import { test, expect, type Locator, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
test.use({ hasTouch: true });

async function enterDemo(page: Page) {
  await page.goto('./', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Ouvrir la démonstration', exact: true }).tap();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vue d’ensemble');
}
async function noHorizontalOverflow(page: Page) {
  const size = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  expect(size.document, 'La page ne doit pas imposer de défilement horizontal.').toBeLessThanOrEqual(size.viewport + 1);
}
async function comfortableTouch(target: Locator) {
  await expect(target).toBeVisible();
  const rect = await target.boundingBox();
  expect(rect).not.toBeNull();
  expect(rect!.width, 'La cible doit mesurer au moins 44px de large.').toBeGreaterThanOrEqual(43.5);
  expect(rect!.height, 'La cible doit mesurer au moins 44px de haut.').toBeGreaterThanOrEqual(43.5);
}
async function viewportCapture(page: Page, name: string, folder = 'docs/screenshots') {
  if (process.env.SIGCP_CAPTURE_SCREENSHOTS !== '1') return;
  await mkdir(folder, { recursive: true });
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.evaluate(() => Array.from(document.images).filter(image => image.getClientRects().length > 0).every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  await page.screenshot({ path: `${folder}/${name}.png`, fullPage: false, animations: 'disabled' });
}
async function visibleRegisterCards(page: Page) {
  const register = page.locator('section.register');
  await expect(register.getByRole('table', { includeHidden: true })).toBeHidden();
  const cards = register.getByRole('button', { name: /^Consulter DEMO\// });
  await expect(cards).toHaveCount(8);
  await expect(cards.first()).toBeVisible();
  await expect(cards.first()).toContainText('Échéance');
  await expect(cards.first()).toContainText('Entrant');
  await comfortableTouch(cards.first());
  return cards;
}

test('téléphone 390 : cartes lisibles, fiche, navigation basse et menu utilisables au toucher', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterDemo(page);
  const quick = page.getByRole('navigation', { name: 'Accès rapides', exact: true });
  await expect(quick).toBeVisible();
  for (const name of ['Aller à Accueil', 'Aller à Courriers', 'Aller à Validation', 'Afficher toutes les rubriques']) {
    await comfortableTouch(quick.getByRole('button', { name, exact: true }));
  }
  for (const name of ['Nouveau courrier', 'Ouvrir le menu', 'Ouvrir les notifications']) {
    const target = page.getByRole('button', { name, exact: true });
    await comfortableTouch(target);
    await expect(target).toBeInViewport({ ratio: 1 });
  }
  await quick.getByRole('button', { name: 'Aller à Courriers', exact: true }).tap();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Courriers entrants');
  const cards = await visibleRegisterCards(page);
  await expect(cards.first()).toBeInViewport({ ratio: 1 });
  const firstCardBounds = await cards.first().boundingBox();
  const quickBounds = await quick.boundingBox();
  expect(firstCardBounds).not.toBeNull();
  expect(quickBounds).not.toBeNull();
  expect(firstCardBounds!.y + firstCardBounds!.height, 'La première carte doit rester entièrement au-dessus de la navigation basse.').toBeLessThanOrEqual(quickBounds!.y);
  await noHorizontalOverflow(page);
  await viewportCapture(page, 'registre-mobile');
  await cards.first().tap();
  const detail = page.getByRole('dialog', { name: 'Fiche de correspondance', exact: true });
  await expect(detail).toBeVisible();
  await comfortableTouch(detail.getByRole('button', { name: 'Fermer la fenêtre', exact: true }));
  await detail.getByRole('button', { name: 'Fermer la fenêtre', exact: true }).tap();
  await expect(detail).toHaveCount(0);
  await quick.getByRole('button', { name: 'Aller à Validation', exact: true }).tap();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Centre de validation');
  await quick.getByRole('button', { name: 'Afficher toutes les rubriques', exact: true }).tap();
  const sidebar = page.getByRole('complementary', { name: 'Navigation principale', exact: true });
  await expect(sidebar).toBeVisible();
  await expect(sidebar.getByRole('link', { name: 'Courriers sortants', exact: true })).toBeVisible();
  const mobileProfile = sidebar.getByRole('button', { name: 'Ouvrir le profil de démonstration', exact: true });
  await comfortableTouch(mobileProfile);
  await mobileProfile.tap();
  const profileDialog = page.getByRole('dialog', { name: 'Profil de démonstration', exact: true });
  await expect(profileDialog).toBeVisible();
  await profileDialog.getByRole('button', { name: 'Fermer la fenêtre', exact: true }).tap();
  await expect(profileDialog).toHaveCount(0);
  await expect(sidebar).toBeVisible();
  await expect(mobileProfile).toBeFocused();
  await comfortableTouch(sidebar.getByRole('button', { name: 'Fermer le menu', exact: true }));
  await sidebar.getByRole('button', { name: 'Fermer le menu', exact: true }).tap();
  await expect(sidebar).toBeHidden();
  await noHorizontalOverflow(page);
  if (process.env.SIGCP_CAPTURE_SCREENSHOTS === '1') {
    await page.getByRole('button', { name: 'Activer le mode sombre', exact: true }).tap();
    await quick.getByRole('button', { name: 'Aller à Courriers', exact: true }).tap();
    await viewportCapture(page, 'registre-mobile-dark', '.local/responsive-review-final');
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.screenshot({ path: '.local/responsive-review-final/registre-mobile-dark-bas.png', fullPage: false, animations: 'disabled' });
  }
});

test('tablette 820 : rail par défaut, cartes, formulaire confortable, préférence conservée et rotation 1024', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto('./', { waitUntil: 'domcontentloaded' });
  expect(await page.evaluate(() => localStorage.getItem('imperium-sidebar-collapsed'))).toBeNull();
  await page.getByRole('button', { name: 'Ouvrir la démonstration', exact: true }).waitFor();
  await viewportCapture(page, 'login-tablet');
  await page.getByRole('button', { name: 'Ouvrir la démonstration', exact: true }).tap();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vue d’ensemble');
  const sidebar = page.getByRole('complementary', { name: 'Navigation principale', exact: true });
  await expect.poll(() => sidebar.evaluate(element => Math.round(element.getBoundingClientRect().width))).toBe(78);
  expect(await page.evaluate(() => localStorage.getItem('imperium-sidebar-collapsed'))).toBeNull();
  await noHorizontalOverflow(page);
  await viewportCapture(page, 'dashboard-tablet');
  await sidebar.getByRole('link', { name: 'Courriers entrants', exact: true }).tap();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Courriers entrants');
  const cards = await visibleRegisterCards(page);
  await viewportCapture(page, 'registre-tablet');
  await cards.first().tap();
  const detail = page.getByRole('dialog', { name: 'Fiche de correspondance', exact: true });
  await expect(detail).toBeVisible();
  await detail.getByRole('button', { name: 'Fermer la fenêtre', exact: true }).tap();
  await page.getByRole('button', { name: 'Nouveau courrier', exact: true }).tap();
  const form = page.getByRole('dialog', { name: 'Enregistrer un courrier fictif', exact: true });
  await expect(form).toBeVisible();
  const fields = await form.locator('input:not([type="hidden"]),select,textarea').evaluateAll(elements => elements.map(element => ({
    name: element.getAttribute('name') || element.getAttribute('aria-label') || element.tagName,
    fontSize: parseFloat(getComputedStyle(element).fontSize),
    height: element.getBoundingClientRect().height,
  })));
  expect(fields.length).toBeGreaterThan(8);
  for (const field of fields) {
    expect(field.fontSize, `Le champ ${field.name} doit rester lisible et éviter le zoom automatique.`).toBeGreaterThanOrEqual(16);
    expect(field.height, `Le champ ${field.name} doit rester facile à toucher.`).toBeGreaterThanOrEqual(47.5);
  }
  const save = form.getByRole('button', { name: 'Enregistrer le courrier', exact: true });
  await save.scrollIntoViewIfNeeded();
  await comfortableTouch(save);
  await expect(save).toBeInViewport({ ratio: 1 });
  await comfortableTouch(form.getByRole('button', { name: 'Fermer la fenêtre', exact: true }));
  await form.getByRole('button', { name: 'Fermer la fenêtre', exact: true }).tap();
  await page.getByRole('button', { name: 'Développer le menu', exact: true }).tap();
  await expect.poll(() => sidebar.evaluate(element => Math.round(element.getBoundingClientRect().width))).toBeGreaterThan(200);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Réduire le menu', exact: true })).toBeVisible();
  expect((await sidebar.boundingBox())!.width).toBeGreaterThan(200);
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Courriers entrants');
  expect((await sidebar.boundingBox())!.width).toBeGreaterThan(200);
  await noHorizontalOverflow(page);
  if (process.env.SIGCP_CAPTURE_SCREENSHOTS === '1') {
    await sidebar.getByRole('link', { name: 'Vue d’ensemble', exact: true }).tap();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Vue d’ensemble');
    await viewportCapture(page, 'dashboard-tablet-landscape');
    await sidebar.getByRole('link', { name: 'Courriers entrants', exact: true }).tap();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Courriers entrants');
    await page.getByRole('button', { name: 'Activer le mode sombre', exact: true }).tap();
    await viewportCapture(page, 'registre-tablet-dark-landscape', '.local/responsive-review-final');
    await page.getByRole('button', { name: 'Nouveau courrier', exact: true }).tap();
    const darkForm = page.getByRole('dialog', { name: 'Enregistrer un courrier fictif', exact: true });
    await expect(darkForm).toBeVisible();
    await viewportCapture(page, 'formulaire-tablet-dark-haut', '.local/responsive-review-final');
    await darkForm.getByRole('button', { name: 'Enregistrer le courrier', exact: true }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: '.local/responsive-review-final/formulaire-tablet-dark-bas.png', fullPage: false, animations: 'disabled' });
    await darkForm.getByRole('button', { name: 'Fermer la fenêtre', exact: true }).tap();
  }
});
