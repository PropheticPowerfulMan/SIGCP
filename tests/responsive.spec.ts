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
async function viewportCapture(page: Page, name: string) {
  if (process.env.SIGCP_CAPTURE_SCREENSHOTS !== '1') return;
  await mkdir('docs/screenshots', { recursive: true });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage: false, animations: 'disabled' });
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
  for (const name of ['Nouveau courrier', 'Ouvrir le menu', 'Ouvrir les notifications', 'Ouvrir le profil pilote']) {
    const target = page.getByRole('button', { name, exact: true });
    await comfortableTouch(target);
    await expect(target).toBeInViewport({ ratio: 1 });
  }
  await quick.getByRole('button', { name: 'Aller à Courriers', exact: true }).tap();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Courriers entrants');
  const cards = await visibleRegisterCards(page);
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
  await comfortableTouch(sidebar.getByRole('button', { name: 'Fermer le menu', exact: true }));
  await sidebar.getByRole('button', { name: 'Fermer le menu', exact: true }).tap();
  await expect(sidebar).toBeHidden();
  await noHorizontalOverflow(page);
});

test('tablette 820 : rail par défaut, cartes, formulaire confortable, préférence conservée et rotation 1024', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto('./', { waitUntil: 'domcontentloaded' });
  expect(await page.evaluate(() => localStorage.getItem('imperium-sidebar-collapsed'))).toBeNull();
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
});
