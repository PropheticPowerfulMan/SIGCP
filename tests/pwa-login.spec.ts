import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const OPEN_DEMO = 'Ouvrir la démonstration';
const LOGIN_ROUTE = /#\/login$/;

async function visitLogin(page: Page) {
  await page.goto('./', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: OPEN_DEMO, exact: true })).toBeVisible({ timeout: 30_000 });
}
async function enterDemo(page: Page) {
  await visitLogin(page);
  await page.getByRole('button', { name: OPEN_DEMO, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vue d’ensemble', { timeout: 30_000 });
}
async function capturePresentation(page: Page, name: string) {
  await mkdir('docs/screenshots', { recursive: true });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage: true, animations: 'disabled' });
}
async function waitForShellWorker(page: Page) {
  await expect.poll(() => page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return null;
    const registration = await navigator.serviceWorker.getRegistration();
    return registration?.active?.state ?? null;
  }), { message: 'Le service worker de production doit être installé et actif.', timeout: 30_000 }).toBe('activated');
  const registration = await page.evaluate(async () => {
    const active = await navigator.serviceWorker.getRegistration();
    return { scope: active?.scope ?? '', script: active?.active?.scriptURL ?? '' };
  });
  expect(new URL(registration.scope).pathname).toBe('/SIGCP/');
  expect(new URL(registration.script).pathname).toMatch(/^\/SIGCP\/[^/]+\.js$/);
  return registration;
}

test('un nouveau visiteur arrive sur la connexion de démonstration sans mot de passe réel', async ({ page }) => {
  const capture = process.env.SIGCP_CAPTURE_SCREENSHOTS === '1';
  if (capture) test.setTimeout(120_000);
  await visitLogin(page);
  await expect(page).toHaveURL(LOGIN_ROUTE);
  await expect(page.getByRole('main')).toContainText(/démonstration|fictif/i);
  await expect(page.getByRole('combobox', { name: /Profil de démonstration/ })).toHaveValue('Agent pilote');
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  const emblem = page.getByRole('img', { name: 'Emblème fourni de la Présidence de la République démocratique du Congo', exact: true });
  await expect(emblem).toBeVisible();
  await expect(emblem).toHaveAttribute('src', /\/SIGCP\/brand\/emblem-presidence\.jpg$/);
  await expect.poll(() => emblem.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
  if (capture) await capturePresentation(page, 'login');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  if (capture) await capturePresentation(page, 'login-mobile');
  await expect(page.getByRole('button', { name: OPEN_DEMO, exact: true })).toBeEnabled();
  await page.getByRole('button', { name: OPEN_DEMO, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vue d’ensemble');
  await expect(page.getByRole('button', { name: /Courriers enregistrés/ })).toContainText('42');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  if (capture) {
    await capturePresentation(page, 'dashboard-mobile');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await capturePresentation(page, 'dashboard');
  }
});

test('la session fictive survit au rechargement et sa fermeture ramène à la connexion', async ({ page }) => {
  await enterDemo(page);
  await page.evaluate(() => localStorage.setItem('imperium-test-unrelated-preference', 'conserver'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vue d’ensemble');
  await page.getByRole('button', { name: 'Ouvrir le profil pilote', exact: true }).click();
  const profile = page.getByRole('dialog', { name: 'Profil de démonstration', exact: true });
  await expect(profile).toBeVisible();
  await expect(profile).toContainText(/Agent pilote/);
  await profile.getByRole('button', { name: 'Fermer la session de démonstration', exact: true }).click();
  await expect(page).toHaveURL(LOGIN_ROUTE);
  await expect(page.getByRole('button', { name: OPEN_DEMO, exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('imperium-test-unrelated-preference'))).toBe('conserver');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(LOGIN_ROUTE);
  await page.goto('./#/dashboard', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: OPEN_DEMO, exact: true })).toBeVisible();
});

test('le menu réduit conserve ses liens accessibles et sa préférence après rechargement', async ({ page }) => {
  await enterDemo(page);
  const sidebar = page.getByRole('complementary', { name: 'Navigation principale' });
  expect((await sidebar.boundingBox())!.width).toBeGreaterThan(200);
  await page.getByRole('button', { name: 'Réduire le menu', exact: true }).click();
  await expect.poll(() => sidebar.evaluate(element => Math.round(element.getBoundingClientRect().width))).toBeLessThan(120);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Développer le menu', exact: true })).toBeVisible();
  expect((await sidebar.boundingBox())!.width).toBeLessThan(120);
  await sidebar.getByRole('link', { name: /Courriers entrants/ }).click();
  await expect(page).toHaveURL(/#\/entrant$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Courriers entrants');
  await page.getByRole('button', { name: 'Développer le menu', exact: true }).click();
  await expect.poll(() => sidebar.evaluate(element => Math.round(element.getBoundingClientRect().width))).toBeGreaterThan(200);
});

test('le manifeste installe le pilote au bon périmètre avec une vraie icône PNG de 512 pixels', async ({ page, request }) => {
  await visitLogin(page);
  const manifestUrl = await page.locator('link[rel="manifest"]').evaluate(element => (element as HTMLLinkElement).href);
  const response = await request.get(manifestUrl);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/json|manifest/i);
  const manifest = await response.json();
  expect(manifest.name).toContain('IMPERIUM');
  expect(manifest.display).toBe('standalone');
  expect(new URL(manifest.scope, manifestUrl).pathname).toBe('/SIGCP/');
  expect(new URL(manifest.start_url, manifestUrl).pathname).toBe('/SIGCP/');
  expect(new URL(manifest.start_url, manifestUrl).origin).toBe(new URL(manifestUrl).origin);
  expect(Array.isArray(manifest.icons)).toBe(true);
  const icons = manifest.icons as Array<{ src: string; sizes: string; type?: string }>;
  const large = icons.find(icon => icon.sizes.split(/\s+/).includes('512x512'));
  expect(large, 'Une icône PNG réelle de 512 × 512 pixels est nécessaire.').toBeTruthy();
  expect(large!.type).toBe('image/png');
  const iconUrl = new URL(large!.src, manifestUrl);
  expect(iconUrl.origin).toBe(new URL(manifestUrl).origin);
  expect(iconUrl.pathname).toMatch(/^\/SIGCP\//);
  const iconResponse = await request.get(iconUrl.href);
  expect(iconResponse.status()).toBe(200);
  expect(iconResponse.headers()['content-type']).toContain('image/png');
  const png = await iconResponse.body();
  expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(png.readUInt32BE(16)).toBe(512);
  expect(png.readUInt32BE(20)).toBe(512);
});

test('le shell de production se recharge hors ligne avec le cache HTTP désactivé', async ({ page, context }) => {
  test.setTimeout(120_000);
  await enterDemo(page);
  await waitForShellWorker(page);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), { timeout: 15_000 }).toBe(true);
  await page.evaluate(() => document.fonts.ready);
  const network = await context.newCDPSession(page);
  await network.send('Network.enable');
  await network.send('Network.setCacheDisabled', { cacheDisabled: true });
  await context.setOffline(true);
  try {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Vue d’ensemble');
    await expect(page.getByRole('button', { name: /Courriers enregistrés/ })).toContainText('42');
    expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    expect(await page.evaluate(() => Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).some(link => Boolean(link.sheet)))).toBe(true);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.fonts.check('400 16px "DM Sans"'))).toBe(true);
    expect(await page.evaluate(() => Array.from(document.images).filter(image => image.getClientRects().length > 0).every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  } finally {
    await context.setOffline(false);
    await network.detach();
  }
});

test('le service worker conserve uniquement des assets statiques et ignore les sondes API et identité', async ({ page }) => {
  test.setTimeout(120_000);
  await enterDemo(page);
  await waitForShellWorker(page);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.evaluate(async () => {
    for (const path of ['api/demo-private-cache-probe', 'auth/demo-session-cache-probe']) {
      await fetch(new URL(path, location.href.split('#')[0]), {
        headers: { Authorization: 'Bearer SYNTHETIC_TEST_ONLY_DO_NOT_CACHE' },
        credentials: 'omit', cache: 'no-store',
      }).then(response => response.arrayBuffer()).catch(() => undefined);
    }
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    const requests = [] as Array<{ cache: string; url: string; authorization: string | null }>;
    for (const name of names) for (const request of await (await caches.open(name)).keys()) {
      requests.push({ cache: name, url: request.url, authorization: request.headers.get('authorization') });
    }
    return { names, requests };
  });
  expect(cached.names.length).toBeGreaterThan(0);
  expect(cached.requests.length).toBeGreaterThan(0);
  const origin = new URL(page.url()).origin;
  const forbidden = /\/(?:api|auth|oauth|session|sessions|token|tokens|courriers|users)(?:\/|$)/i;
  for (const entry of cached.requests) {
    const url = new URL(entry.url);
    expect(url.origin).toBe(origin);
    expect(url.pathname).toMatch(/^\/SIGCP\//);
    expect(url.pathname).not.toMatch(forbidden);
    expect(entry.authorization).toBeNull();
    const staticAsset = url.pathname === '/SIGCP/' || /\.(?:html|js|css|woff2?|png|jpe?g|webp|avif|gif|svg|ico|webmanifest)$/i.test(url.pathname) || /\/manifest\.json$/i.test(url.pathname);
    expect(staticAsset, `Le cache ne doit pas contenir de données applicatives : ${url.pathname}`).toBe(true);
  }
});

test('le bouton Installer ouvre une aide accessible lorsque le navigateur ne propose pas de dialogue natif', async ({ page }) => {
  await page.addInitScript(() => {
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault(); event.stopImmediatePropagation();
    }, { capture: true });
  });
  await visitLogin(page);
  const loginInstall = page.getByRole('button', { name: /^Installer l’application/ });
  await loginInstall.click();
  const dialog = page.getByRole('dialog', { name: 'Installer IMPERIUM RDC', exact: true });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(loginInstall).toBeFocused();
  await page.getByRole('button', { name: OPEN_DEMO, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vue d’ensemble');
  const install = page.getByRole('button', { name: 'Installer IMPERIUM RDC sur cet appareil', exact: true });
  await install.click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/navigateur|Chrome|Edge|Safari/i);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(install).toBeFocused();
});

