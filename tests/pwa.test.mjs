import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import path from 'node:path';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { buildPwa, CACHE_PREFIX, isShellAsset, PWA_SCOPE, renderServiceWorker } from '../scripts/build-pwa.mjs';

const origin = 'https://example.test';
const paths = ['/SIGCP/index.html', '/SIGCP/assets/app-abc123.js', '/SIGCP/assets/app-abc123.css', '/SIGCP/manifest.webmanifest'];
const request = (pathname, extras = {}) => ({ url: origin + pathname, method: 'GET', headers: new Headers(), mode: 'cors', ...extras });

function worker({ network = async () => new Response('network'), cached = new Map() } = {}) {
  const events = new Map();
  const deleted = [];
  let claimed = 0, skipped = 0;
  const cache = {
    match: async key => cached.get(typeof key === 'string' ? key : new URL(key.url).pathname)?.clone(),
    addAll: async () => {},
    put: () => { throw new Error('No runtime cache writes are permitted'); },
  };
  const self = { location: new URL(origin + '/SIGCP/sw.js'), addEventListener: (name, fn) => events.set(name, fn), clients: { claim: async () => { claimed++; } }, skipWaiting: async () => { skipped++; } };
  const context = vm.createContext({ self, URL, Request, Response, Headers, Set, Promise, caches: { open: async () => cache, keys: async () => [CACHE_PREFIX + 'old', CACHE_PREFIX + 'rev1', 'other-app-cache'], delete: async key => { deleted.push(key); return true; } }, fetch: network });
  vm.runInContext(renderServiceWorker({ revision: 'rev1', assets: paths }), context);
  return { context, events, deleted, self, counts: () => ({ claimed, skipped }) };
}

test('manifest defines a unique project identity and complete launcher icons', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));
  assert.equal(manifest.id, '/SIGCP/');
  assert.equal(manifest.scope, '/SIGCP/');
  assert.equal(manifest.start_url, '/SIGCP/');
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.name.includes('IMPERIUM RDC'));
  assert.ok(manifest.icons.some(icon => icon.sizes === '192x192' && icon.purpose === 'any'));
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose === 'maskable'));
  assert.ok(manifest.icons.every(icon => icon.src.startsWith('/SIGCP/brand/')));
});

test('precache allowlist contains static shell resources and excludes business data', () => {
  for (const file of ['index.html', 'manifest.webmanifest', 'assets/index-AbC_123.js', 'assets/index.css', 'assets/font.woff2', 'brand/emblem-presidence.jpg', 'brand/icon-maskable-512.png', 'brand/favicon-64.png']) assert.equal(isShellAsset(file), true, file);
  for (const file of ['api/courriers', 'exports/report.csv', 'documents/note.pdf', 'uploads/scan.png', 'assets/records.json', 'records.json', 'brand/private-scan.png', '../index.html', 'assets/../auth.js', 'assets/app.js?token=secret', 'assets\\app.js', 'sw.js']) assert.equal(isShellAsset(file), false, file);
});

test('worker refuses cross-origin, API, auth, documents, queries and authorization headers', () => {
  const { context } = worker();
  assert.equal(context.isEligible(request('/SIGCP/')), true);
  assert.equal(context.isEligible(request('/SIGCP/assets/app-abc123.js')), true);
  for (const value of [
    request('/SIGCP/api/courriers'), request('/SIGCP/auth/callback'), request('/SIGCP/login'),
    request('/SIGCP/documents/note.pdf'), request('/SIGCP/exports/report.csv'),
    request('/SIGCP/?code=secret'), request('/SIGCP/assets/app-abc123.js?token=secret'),
    request('/outside/'), request('/SIGCP/unlisted-page'), request('/SIGCP/', { method: 'POST' }),
    request('/SIGCP/', { url: 'https://outside.test/SIGCP/' }),
    request('/SIGCP/', { headers: new Headers({ Authorization: 'Bearer fictitious-test' }) }),
  ]) assert.equal(context.isEligible(value), false, value.url);
});

test('offline fallback serves only the versioned application entry', async () => {
  const { events } = worker({ network: async () => { throw new TypeError('offline'); }, cached: new Map([['/SIGCP/index.html', new Response('versioned shell')]]) });
  let response;
  events.get('fetch')({ request: request('/SIGCP/', { mode: 'navigate' }), respondWith: promise => { response = promise; } });
  assert.equal(await (await response).text(), 'versioned shell');
  let intercepted = false;
  events.get('fetch')({ request: request('/SIGCP/api/courriers', { mode: 'navigate' }), respondWith: () => { intercepted = true; } });
  assert.equal(intercepted, false);
});

test('successful navigation never overwrites the versioned offline shell', async () => {
  const cached = new Map([['/SIGCP/index.html', new Response('old complete shell')]]);
  const { events } = worker({ network: async () => new Response('new network index'), cached });
  let response;
  events.get('fetch')({ request: request('/SIGCP/', { mode: 'navigate' }), respondWith: promise => { response = promise; } });
  assert.equal(await (await response).text(), 'new network index');
  assert.equal(await cached.get('/SIGCP/index.html').text(), 'old complete shell');
});

test('server authorization errors are returned instead of a cached shell', async () => {
  const { events } = worker({ network: async () => new Response('denied', { status: 403 }), cached: new Map([['/SIGCP/index.html', new Response('shell')]]) });
  let response;
  events.get('fetch')({ request: request('/SIGCP/', { mode: 'navigate' }), respondWith: promise => { response = promise; } });
  assert.equal((await response).status, 403);
});

test('activation removes only old caches owned by this app and requires explicit update message', async () => {
  const w = worker();
  let activation;
  w.events.get('activate')({ waitUntil: promise => { activation = promise; } });
  await activation;
  assert.deepEqual(w.deleted, [CACHE_PREFIX + 'old']);
  assert.equal(w.counts().claimed, 1);
  assert.equal(w.counts().skipped, 0);
  w.events.get('message')({ data: { type: 'OTHER' }, source: { url: origin + '/SIGCP/' } });
  w.events.get('message')({ data: { type: 'SKIP_WAITING' }, source: { url: 'https://outside.test/' } });
  w.events.get('message')({ data: { type: 'SKIP_WAITING' }, source: { url: origin + '/another-app/' } });
  w.events.get('message')({ data: { type: 'SKIP_WAITING' }, source: { url: 'malformed' } });
  w.events.get('message')({ data: { type: 'SKIP_WAITING' }, source: {} });
  assert.equal(w.counts().skipped, 0);
  w.events.get('message')({ data: { type: 'SKIP_WAITING' }, source: { url: origin + '/SIGCP/' } });
  assert.equal(w.counts().skipped, 1);
});

function pngHeader(width, height) {
  const bytes = Buffer.alloc(24);
  Buffer.from('89504e470d0a1a0a', 'hex').copy(bytes);
  bytes.writeUInt32BE(width, 16); bytes.writeUInt32BE(height, 20);
  return bytes;
}

test('builder hashes exact shell contents, excludes data and rejects incorrect icon dimensions', async () => {
  const outDir = await mkdtemp(path.join(tmpdir(), 'sigcp-pwa-'));
  try {
    await mkdir(path.join(outDir, 'assets')); await mkdir(path.join(outDir, 'brand')); await mkdir(path.join(outDir, 'exports'));
    const manifest = JSON.parse(await readFile(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));
    await writeFile(path.join(outDir, 'manifest.webmanifest'), JSON.stringify(manifest));
    await writeFile(path.join(outDir, 'index.html'), '<html>test shell</html>');
    await writeFile(path.join(outDir, 'assets/app-test.js'), 'console.log("shell");');
    await writeFile(path.join(outDir, 'exports/data.csv'), 'sensitive test');
    await writeFile(path.join(outDir, 'assets/records.json'), '{"records":[]}');
    for (const icon of manifest.icons) { const size = Number(icon.sizes.split('x')[0]); await writeFile(path.join(outDir, icon.src.slice(PWA_SCOPE.length)), pngHeader(size, size)); }
    const first = await buildPwa({ outDir });
    const second = await buildPwa({ outDir });
    assert.equal(first.revision, second.revision);
    assert.ok(!first.assets.some(url => /exports|records/.test(url)));
    assert.ok((await readFile(path.join(outDir, 'sw.js'), 'utf8')).includes(first.revision));
    await writeFile(path.join(outDir, 'assets/app-test.js'), 'console.log("new shell");');
    assert.notEqual((await buildPwa({ outDir })).revision, first.revision);
    await writeFile(path.join(outDir, 'brand/icon-192.png'), pngHeader(128, 128));
    await assert.rejects(buildPwa({ outDir }), /dimensions/);
  } finally {
    assert.equal(path.dirname(path.resolve(outDir)), path.resolve(tmpdir()));
    assert.ok(path.basename(outDir).startsWith('sigcp-pwa-'));
    await rm(outDir, { recursive: true, force: true });
  }
});
