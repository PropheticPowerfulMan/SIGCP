import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PWA_SCOPE = '/SIGCP/';
export const CACHE_PREFIX = 'imperium-sigcp-shell-';
const ROOT_ASSETS = new Set(['index.html', 'manifest.webmanifest', 'favicon.svg', 'favicon.ico']);
const BRAND_FILE = /^brand\/(?:emblem-presidence\.(?:jpe?g|png|webp)|icon-(?:192|512|maskable-512)\.png|apple-touch-icon(?:-180)?\.png|favicon-64\.png)$/;
const BUNDLE_FILE = /^assets\/[a-zA-Z0-9_.-]+\.(?:js|css|woff2?|png|svg|webp|jpe?g)$/;

/** Deliberately excludes API responses, exports, uploaded files and JSON records. */
export function isShellAsset(relativePath) {
  return typeof relativePath === 'string' && !relativePath.includes('..') &&
    !relativePath.includes('\\') && !relativePath.includes('?') &&
    (ROOT_ASSETS.has(relativePath) || BRAND_FILE.test(relativePath) || BUNDLE_FILE.test(relativePath));
}

async function walk(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) files.push(...await walk(path.join(directory, entry.name), relative + '/'));
    else if (entry.isFile()) files.push(relative);
  }
  return files.sort();
}

export function renderServiceWorker({ revision, assets, scope = PWA_SCOPE }) {
  return `/* IMPERIUM RDC: static application shell only. No record or API cache. */
'use strict';
const SCOPE = ${JSON.stringify(scope)};
const CACHE_PREFIX = ${JSON.stringify(CACHE_PREFIX)};
const CACHE_NAME = CACHE_PREFIX + ${JSON.stringify(revision)};
const SHELL_URL = SCOPE + 'index.html';
const PRECACHE_URLS = ${JSON.stringify(assets)};
const ALLOWED_PATHS = new Set(PRECACHE_URLS);

function isEligible(request) {
  if (!request || request.method !== 'GET') return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE) || url.search) return false;
  if (request.headers.has('Authorization')) return false;
  if (/\\/(?:api|auth|oauth|callback|login|logout|files|uploads|exports|documents)(?:\\/|$)/i.test(url.pathname)) return false;
  return url.pathname === SCOPE || ALLOWED_PATHS.has(url.pathname);
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS.map(url => new Request(url, { cache: 'reload', credentials: 'same-origin' })));
    } catch (error) {
      await caches.delete(CACHE_NAME);
      throw error;
    }
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'SKIP_WAITING' || !event.source || typeof event.source.url !== 'string') return;
  try {
    const source = new URL(event.source.url);
    if (source.origin === self.location.origin && source.pathname.startsWith(SCOPE)) self.skipWaiting();
  } catch { /* A malformed or unrelated message never activates an update. */ }
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (!isEligible(request)) return;
  const url = new URL(request.url);
  if (request.mode === 'navigate') {
    // Only the known application entry is an offline navigation fallback.
    if (url.pathname !== SCOPE && url.pathname !== SHELL_URL) return;
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.status < 500) return response;
        return (await cache.match(SHELL_URL)) || response;
      } catch {
        return (await cache.match(SHELL_URL)) || new Response('La démonstration doit être ouverte une première fois en ligne.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(url.pathname)) || fetch(request);
  })());
});
`;
}

export async function buildPwa({ outDir = path.resolve('dist') } = {}) {
  const manifest = JSON.parse(await readFile(path.join(outDir, 'manifest.webmanifest'), 'utf8'));
  if (manifest.id !== PWA_SCOPE || manifest.scope !== PWA_SCOPE || manifest.start_url !== PWA_SCOPE || manifest.display !== 'standalone') {
    throw new Error('Le manifeste PWA ne correspond pas au périmètre /SIGCP/.');
  }
  for (const icon of manifest.icons ?? []) {
    if (!icon.src.startsWith(PWA_SCOPE + 'brand/')) throw new Error('Une icône PWA sort du périmètre autorisé.');
    const relative = icon.src.slice(PWA_SCOPE.length);
    if (!BRAND_FILE.test(relative) || icon.type !== 'image/png') throw new Error('Icône PWA invalide.');
    const bytes = await readFile(path.join(outDir, relative));
    const dimensions = icon.sizes.split('x').map(Number);
    if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || bytes.readUInt32BE(16) !== dimensions[0] || bytes.readUInt32BE(20) !== dimensions[1]) {
      throw new Error('Les dimensions de l’icône ne correspondent pas au manifeste : ' + relative);
    }
  }
  if (!manifest.icons?.some(icon => icon.sizes === '192x192' && icon.purpose === 'any') || !manifest.icons?.some(icon => icon.sizes === '512x512' && icon.purpose === 'any') || !manifest.icons?.some(icon => icon.purpose === 'maskable')) {
    throw new Error('Les icônes 192, 512 et maskable sont requises.');
  }
  const allFiles = await walk(outDir);
  const files = allFiles.filter(isShellAsset);
  if (!files.includes('index.html') || !files.some(file => /^assets\/.+\.js$/.test(file))) throw new Error('Le bundle de production est incomplet.');
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(file + '\0');
    hash.update(await readFile(path.join(outDir, file)));
    hash.update('\0');
  }
  const revision = hash.digest('hex').slice(0, 20);
  const assets = files.map(file => PWA_SCOPE + file);
  await writeFile(path.join(outDir, 'sw.js'), renderServiceWorker({ revision, assets }), 'utf8');
  return { revision, assets, cacheName: CACHE_PREFIX + revision };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await buildPwa();
    console.log('PWA : coque statique versionnée ' + result.revision + ' · ' + result.assets.length + ' ressources · aucune donnée métier en cache');
  } catch (error) {
    console.error('Construction PWA impossible : ' + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
  }
}
