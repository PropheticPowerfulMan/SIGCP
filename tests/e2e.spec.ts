import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

async function openDemo(page: Page, hash = '') {
  await page.addInitScript(() => {
    sessionStorage.setItem('imperium-demo-session', JSON.stringify({version: 1, role: 'Agent pilote', startedAt: new Date().toISOString()}));
  });
  page.on('pageerror', error => console.log('[bootstrap pageerror]', error.message));
  page.on('console', message => { if (message.type() === 'error') console.log('[browser console]', message.text()); });
  page.on('response', response => { if (response.status() >= 400) console.log('[resource]', response.status(), response.url()); });
  await page.goto(hash ? './#/' + hash : './', { waitUntil: 'domcontentloaded' });
  try { await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 30000 }); }
  catch (error) {
    console.log('[bootstrap body]', await page.locator('body').innerText({ timeout: 3000 }).catch(() => 'body unavailable'));
    await page.screenshot({ path: test.info().outputPath('bootstrap-failure.png'), fullPage: true, timeout: 5000 }).catch(() => {});
    throw error;
  }
}
async function openCreate(page: Page) {
  await page.getByRole('button', { name: 'Nouveau courrier', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Enregistrer un courrier fictif' });
  await expect(dialog).toBeVisible();
  return dialog;
}

test('le tableau de bord affiche 42 dossiers et la navigation utilise une route partageable', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await openDemo(page);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vue d’ensemble');
  await expect(page.getByRole('button', { name: /Courriers enregistrés/ })).toContainText('42');
  await page.getByRole('link', { name: /Courriers entrants/ }).click();
  await expect(page).toHaveURL(/#\/entrant$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Courriers entrants');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Courriers entrants');
  expect(errors).toEqual([]);
});

test('la recherche ignore les accents et expose un état vide récupérable', async ({ page }) => {
  await openDemo(page, 'entrant');
  const search = page.getByRole('textbox', { name: 'Rechercher dans le registre' });
  await search.fill('numerisation materiel');
  await expect(page.locator('tbody tr')).toHaveCount(2);
  for (const row of await page.locator('tbody tr').all()) await expect(row).toContainText('matériel de numérisation');
  await search.fill('dossier introuvable e2e zzzz');
  await expect(page.getByRole('heading', { name: 'Aucun courrier trouvé' })).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(0);
  await page.getByRole('button', { name: 'Effacer les filtres' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(8);
});

test('la pagination change les dossiers et conserve le nombre de résultats', async ({ page }) => {
  await openDemo(page, 'entrant');
  await expect(page.getByText('Page 1 sur 4', { exact: true })).toBeVisible();
  const first = await page.locator('tbody tr').first().innerText();
  await page.getByRole('button', { name: 'Page suivante', exact: true }).click();
  await expect(page.getByText('Page 2 sur 4', { exact: true })).toBeVisible();
  expect(await page.locator('tbody tr').first().innerText()).not.toEqual(first);
  await expect(page.locator('tbody tr')).toHaveCount(8);
  await page.getByRole('button', { name: 'Page précédente', exact: true }).click();
  await expect(page.getByText('Page 1 sur 4', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Page précédente', exact: true })).toBeDisabled();
});

test('un formulaire vide affiche ses erreurs liées aux champs et reçoit le focus', async ({ page }) => {
  await openDemo(page);
  const dialog = await openCreate(page);
  await dialog.getByRole('button', { name: 'Enregistrer le courrier', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('Vérifiez les champs du formulaire');
  const subject = dialog.getByRole('textbox', { name: /Objet du courrier/ });
  const sender = dialog.getByRole('textbox', { name: /Expéditeur fictif/ });
  await expect(subject).toHaveAttribute('aria-invalid', 'true');
  await expect(sender).toHaveAttribute('aria-invalid', 'true');
  await expect(subject).toBeFocused();
  await subject.fill('Objet fictif de test');
  await sender.fill('Institution de démonstration');
  await expect(subject).not.toHaveAttribute('aria-invalid', 'true');
});

test('un courrier entrant est créé, validé puis archivé et persiste après rechargement', async ({ page }) => {
  await openDemo(page);
  const create = await openCreate(page);
  const subject = 'Essai E2E du circuit de correspondance fictive';
  await create.getByRole('textbox', { name: /Objet du courrier/ }).fill(subject);
  await create.getByRole('textbox', { name: /Expéditeur fictif/ }).fill('Institution fictive du test E2E');
  await create.getByRole('textbox', { name: 'Observations', exact: true }).fill('Exercice synthétique créé par le test automatisé.');
  await create.getByRole('button', { name: 'Enregistrer le courrier', exact: true }).click();
  const detail = page.getByRole('dialog', { name: 'Fiche de correspondance' });
  await expect(detail.getByRole('heading', { name: subject, exact: true })).toBeVisible();
  for (const [button, status] of [
    ['Passer à « Affecté »', 'Affecté'],
    ['Passer à « En traitement »', 'En traitement'],
    ['Passer à « En validation »', 'En validation'],
    ['Valider le dossier', 'Validé'],
  ]) {
    await detail.getByRole('button', { name: button, exact: true }).click();
    await expect(detail.locator('.detail-badges')).toContainText(status);
  }
  await expect(detail.getByRole('button', { name: 'Simuler l’expédition' })).toHaveCount(0);
  await detail.getByRole('button', { name: 'Archiver le dossier', exact: true }).click();
  await expect(detail.locator('.detail-badges')).toContainText('Archivé');
  await detail.getByRole('button', { name: 'Évolution', exact: true }).click();
  await expect(detail.locator('.timeline li')).toHaveCount(6);
  await detail.getByRole('button', { name: 'Fermer la fenêtre' }).click();
  await page.reload();
  await page.getByRole('link', { name: /Courriers entrants/ }).click();
  await page.getByRole('textbox', { name: 'Rechercher dans le registre' }).fill(subject);
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody tr')).toContainText('Archivé');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('imperium-demo-v2') || '[]'));
  expect(stored).toHaveLength(43);
});

test('le choix du thème sombre persiste dans le navigateur', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Activer le mode sombre' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Activer le mode clair' })).toBeVisible();
});

test('des données corrompues sont signalées sans écrasement puis réinitialisées sur confirmation', async ({ page }) => {
  await page.addInitScript(() => { if (!sessionStorage.getItem('e2e-corrupted-once')) { localStorage.setItem('imperium-demo-v2', '{invalid local data'); sessionStorage.setItem('e2e-corrupted-once', 'true'); } });
  await openDemo(page);
  await expect(page.getByRole('alert')).toContainText('endommagé');
  expect(await page.evaluate(() => localStorage.getItem('imperium-demo-v2'))).toBe('{invalid local data');
  await page.getByRole('button', { name: 'Réinitialiser', exact: true }).click();
  const reset = page.getByRole('dialog', { name: 'Réinitialiser la démonstration ?' });
  await expect(reset).toBeVisible();
  await reset.getByRole('button', { name: 'Réinitialiser les dossiers', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', { name: /Courriers enregistrés/ })).toContainText('42');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('imperium-demo-v2') || '[]').length)).toBe(42);
});

test('la fenêtre accessible se ferme avec Échap et restitue le focus au déclencheur', async ({ page }) => {
  await openDemo(page);
  const trigger = page.getByRole('button', { name: 'Nouveau courrier', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Enregistrer un courrier fictif' });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('le réseau distingue les étapes simulées, reprend un échec et évite les doublons', async ({ page }) => {
  await openDemo(page, 'institutions');
  await expect(page.getByText('Simulation dans ce navigateur uniquement.', { exact: true })).toBeVisible();
  const failed = page.locator('.exchange-row').filter({ has: page.getByText('Échec', { exact: true }) });
  await failed.getByRole('button', { name: 'Relancer la simulation', exact: true }).click();
  await expect(failed).toHaveCount(0);
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('imperium-exchanges-v2') || '[]'));
  const sourceId = await page.getByRole('combobox', { name: /Courrier sortant validé/ }).inputValue();
  const original = before.find((exchange: { mailId: string }) => exchange.mailId === sourceId);
  expect(original).toBeTruthy();
  await page.getByRole('button', { name: 'Préparer le scénario', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: /Échange fictif/ });
  await expect(dialog).toBeVisible();
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('imperium-exchanges-v2') || '[]'));
  expect(after).toHaveLength(before.length);
  expect(after.find((exchange: { mailId: string }) => exchange.mailId === sourceId).id).toBe(original.id);
  await dialog.getByRole('button', { name: 'Fermer la fenêtre' }).click();
  const prepared = page.locator('.exchange-row').filter({ has: page.getByText('Préparé', { exact: true }) });
  await expect(prepared).toHaveCount(1);
  const ref = await prepared.locator('.network-caption > span').first().innerText();
  const row = page.locator('.exchange-row').filter({ hasText: ref });
  for (const [button, expectedStatus] of [['Simuler la transmission', 'Transmis'], ['Simuler la réception', 'Reçu'], ['Confirmer l’accusé fictif', 'Accusé confirmé']]) {
    await row.getByRole('button', { name: button, exact: true }).click();
    await expect(row.getByText(expectedStatus, { exact: true })).toBeVisible();
  }
  await page.reload();
  await expect(page.locator('.exchange-row').filter({ hasText: ref }).getByText('Accusé confirmé', { exact: true })).toBeVisible();
});

test('sur mobile le menu fermé est absent du parcours Tab et peut être ouvert puis fermé', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openDemo(page);
  const sidebar = page.getByRole('complementary', { name: 'Navigation principale', includeHidden: true });
  await expect(sidebar).toBeHidden();
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('.sidebar')))).toBe(false);
  }
  const open = page.getByRole('button', { name: 'Ouvrir le menu', exact: true, includeHidden: true });
  await open.click();
  await expect(sidebar).toBeVisible();
  await expect(open).toHaveAttribute('aria-expanded', 'true');
  await sidebar.getByRole('button', { name: 'Fermer le menu', exact: true }).click();
  await expect(sidebar).toBeHidden();
  await open.click();
  await page.keyboard.press('Escape');
  await expect(sidebar).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
});

test('captures de livraison réelles desktop et mobile', async ({ page }) => {
  test.skip(!process.env.SIGCP_CAPTURE_SCREENSHOTS, 'Captures réalisées après finalisation de la feuille de styles.');
  await mkdir('docs/screenshots', { recursive: true });
  await openDemo(page);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'docs/screenshots/dashboard.png', fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'docs/screenshots/dashboard-mobile.png', fullPage: true, animations: 'disabled' });
});




