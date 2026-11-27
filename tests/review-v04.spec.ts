import { test, expect, type Locator, type Page } from '@playwright/test';

async function enterProfile(page: Page, role = 'Agent pilote') {
  await page.goto('./#/login', { waitUntil: 'domcontentloaded' });
  await page.getByRole('combobox', { name: 'Profil de démonstration', exact: true }).selectOption({ label: role });
  await page.getByRole('button', { name: 'Ouvrir la démonstration', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(role === 'Autorité de validation' ? 'Centre de validation' : 'Vue d’ensemble');
}

async function openCreate(page: Page) {
  await page.getByRole('button', { name: 'Nouveau courrier', exact: true }).click();
  const form = page.getByRole('dialog', { name: 'Enregistrer un courrier fictif', exact: true });
  await expect(form).toBeVisible();
  return form;
}

async function fillIncoming(form: Locator, subject: string, sender: string) {
  await form.getByRole('textbox', { name: /Objet du courrier/ }).fill(subject);
  await form.getByRole('textbox', { name: /Expéditeur fictif/ }).fill(sender);
}

async function storedCount(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('imperium-demo-v2') || '[]').length as number);
}

async function validateNewMail(detail: Locator) {
  for (const name of ['Passer à « Affecté »', 'Passer à « En traitement »', 'Passer à « En validation »', 'Valider le dossier']) {
    await detail.getByRole('button', { name, exact: true }).click();
  }
  await expect(detail.locator('.detail-badges')).toContainText('Validé');
}

test('Ctrl+K retrouve un dossier depuis Accueil et Statistiques, puis Échap rend le focus', async ({ page }) => {
  await enterProfile(page);
  const trigger = page.getByRole('button', { name: 'Ouvrir la recherche globale', exact: true });
  for (const section of [
    { link: 'Vue d’ensemble', heading: 'Vue d’ensemble', hash: '#/dashboard' },
    { link: 'Synthèses & statistiques', heading: 'Synthèses & statistiques', hash: '#/analytics' },
  ]) {
    await page.getByRole('link', { name: section.link, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(section.heading);
    await trigger.focus();
    await page.keyboard.press('Control+k');
    const search = page.getByRole('dialog', { name: 'Recherche globale', exact: true });
    const input = search.getByRole('searchbox', { name: 'Rechercher dans tous les courriers', exact: true });
    await expect(input).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(search).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await page.keyboard.press('Control+k');
    await input.fill('commission numerique');
    const result = search.getByRole('button', { name: /Invitation à la commission numérique pilote/ }).first();
    await expect(result).toBeVisible();
    const reference = await result.locator('.global-search-reference').innerText();
    await result.click();
    const detail = page.getByRole('dialog', { name: 'Fiche de correspondance', exact: true });
    await expect(detail.getByRole('heading', { name: 'Invitation à la commission numérique pilote', exact: true })).toBeVisible();
    await expect(detail.locator('.detail-title .reference')).toHaveText(reference);
    await expect(search).toHaveCount(0);
    expect(new URL(page.url()).hash).toBe(section.hash);
    await page.keyboard.press('Escape');
    await expect(detail).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
});

test('un doublon est signalé sans créer de dossier avant sa confirmation explicite', async ({ page }) => {
  await enterProfile(page);
  const subject = 'Exercice fictif de détection des doublons version quatre';
  const sender = 'Organisation fictive du contrôle des doublons';
  let form = await openCreate(page);
  await fillIncoming(form, subject, sender);
  await form.getByRole('button', { name: 'Enregistrer le courrier', exact: true }).click();
  const detail = page.getByRole('dialog', { name: 'Fiche de correspondance', exact: true });
  await expect(detail.getByRole('heading', { name: subject, exact: true })).toBeVisible();
  const firstReference = await detail.locator('.detail-title .reference').innerText();
  expect(await storedCount(page)).toBe(43);
  await detail.getByRole('button', { name: 'Fermer la fenêtre', exact: true }).click();

  form = await openCreate(page);
  await fillIncoming(form, subject, sender);
  await form.getByRole('button', { name: 'Enregistrer le courrier', exact: true }).click();
  await expect(form).toBeVisible();
  await expect(form.getByRole('heading', { name: 'Doublon potentiel à vérifier', exact: true })).toBeVisible();
  await expect(form).toContainText(firstReference);
  const confirm = form.getByRole('checkbox', { name: 'Je confirme qu’il s’agit d’un courrier distinct.', exact: true });
  await expect(confirm).toBeVisible();
  await expect(confirm).not.toBeChecked();
  expect(await storedCount(page)).toBe(43);
  await confirm.check();
  await form.getByRole('button', { name: 'Confirmer et enregistrer', exact: true }).click();
  await expect(detail.getByRole('heading', { name: subject, exact: true })).toBeVisible();
  await expect(detail.locator('.detail-title .reference')).not.toHaveText(firstReference);
  expect(await storedCount(page)).toBe(44);
});

test('un sortant rédigé de A vers B devient éligible à un échange local cohérent', async ({ page }) => {
  await enterProfile(page);
  await page.getByRole('link', { name: 'Réseau institutionnel', exact: true }).click();
  const form = await openCreate(page);
  const subject = 'Transmission fictive de A vers B pour la recette quatre';
  await form.getByRole('button', { name: 'Courrier sortant', exact: true }).click();
  await expect(form.getByRole('button', { name: 'Courrier sortant', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(form.getByRole('textbox', { name: /Destinataire fictif/ })).toHaveValue('');
  await form.getByRole('combobox', { name: /^Choisir une institution destinataire/ }).selectOption({ label: 'Institution partenaire B' });
  await expect(form.getByRole('combobox', { name: /Institution propriétaire du dossier/ })).toHaveValue('pilote-a');
  await expect(form.getByRole('textbox', { name: /Expéditeur fictif/ })).toHaveValue('Institution pilote A');
  await expect(form.getByRole('textbox', { name: /Destinataire fictif/ })).toHaveValue('Institution partenaire B');
  await form.getByRole('textbox', { name: /Objet du courrier/ }).fill(subject);
  await form.getByRole('button', { name: 'Enregistrer le courrier', exact: true }).click();
  const detail = page.getByRole('dialog', { name: 'Fiche de correspondance', exact: true });
  await expect(detail.getByRole('heading', { name: subject, exact: true })).toBeVisible();
  const reference = await detail.locator('.detail-title .reference').innerText();
  await validateNewMail(detail);
  await detail.getByRole('button', { name: 'Fermer la fenêtre', exact: true }).click();
  const source = page.getByRole('combobox', { name: 'Courrier sortant validé', exact: true });
  await source.selectOption({ label: `${reference} · ${subject}` });
  const destination = page.getByRole('combobox', { name: 'Institution destinataire', exact: true });
  await destination.selectOption({ label: 'Institution partenaire B' });
  await expect(destination.getByRole('option', { name: /Institution pilote A/ })).toBeDisabled();
  await page.getByRole('button', { name: 'Préparer le scénario', exact: true }).click();
  const exchange = page.getByRole('dialog', { name: `Échange fictif · ${reference}`, exact: true });
  await expect(exchange).toBeVisible();
  await expect(exchange.locator('dl dd').nth(0)).toHaveText('Institution pilote A');
  await expect(exchange.locator('dl dd').nth(1)).toHaveText('Institution partenaire B');
  await expect(exchange.locator('dl dd').nth(2)).toHaveText('Préparé');
  await expect(exchange).toContainText('simulation locale');
});

test('le profil Autorité conserve AV, son acteur et la rubrique lors du focus d’une erreur', async ({ page }) => {
  await enterProfile(page, 'Autorité de validation');
  const profile = page.getByRole('button', { name: 'Ouvrir le profil pilote', exact: true });
  await expect(profile).toHaveText('AV');
  await profile.click();
  const identity = page.getByRole('dialog', { name: 'Profil de démonstration', exact: true });
  await expect(identity.getByRole('heading', { name: 'Autorité de validation', exact: true })).toBeVisible();
  await expect(identity.locator('.avatar')).toHaveText('AV');
  await identity.getByRole('button', { name: 'Fermer la fenêtre', exact: true }).click();
  const form = await openCreate(page);
  await form.getByRole('button', { name: 'Enregistrer le courrier', exact: true }).click();
  const sender = form.getByRole('textbox', { name: /Expéditeur fictif/ });
  const summary = form.getByRole('alert');
  await summary.getByRole('link', { name: /expéditeur/i }).click();
  await expect(sender).toBeFocused();
  expect(new URL(page.url()).hash).toBe('#/validation');
  const subject = 'Courrier fictif examiné par le profil Autorité';
  await fillIncoming(form, subject, 'Institution fictive du contrôle des rôles');
  await form.getByRole('button', { name: 'Enregistrer le courrier', exact: true }).click();
  const detail = page.getByRole('dialog', { name: 'Fiche de correspondance', exact: true });
  await expect(detail.getByRole('heading', { name: subject, exact: true })).toBeVisible();
  await validateNewMail(detail);
  await detail.getByRole('button', { name: 'Évolution', exact: true }).click();
  await expect(detail.locator('.timeline li').last()).toContainText('Autorité de validation');
  await expect(detail.locator('.timeline li').last()).not.toContainText('Agent pilote A');
});
