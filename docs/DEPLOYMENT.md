# Publication de la démonstration GitHub Pages

État vérifié le 26 novembre 2026 : démonstration publiée sur https://propheticpowerfulman.github.io/SIGCP/, HTTP 200 et bundle corrigé vérifiés. Le dépôt est public avec l’accord du propriétaire et la source Pages est GitHub Actions.

## Activation initiale

1. Ouvrir https://github.com/PropheticPowerfulMan/SIGCP/settings/pages avec un compte administrateur du dépôt.
2. Dans Build and deployment, choisir la source **GitHub Actions**.
3. Ouvrir https://github.com/PropheticPowerfulMan/SIGCP/actions et exécuter **Validate and deploy demo** (Run workflow), ou publier une correction sur `main`.
4. Attendre que les tâches de compilation et de déploiement soient toutes les deux réussies.
5. Ouvrir l’URL retournée par le job de déploiement et vérifier le tableau de bord.

URL de projet attendue : https://propheticpowerfulman.github.io/SIGCP/
Cette URL ne constitue pas une preuve de publication tant que le déploiement n’a pas réussi.

## Pourquoi l’activation initiale est distincte

L’action officielle `actions/configure-pages` indique que `enablement: true` exige un jeton autre que `GITHUB_TOKEN`. Le jeton automatique dispose des droits pour publier une fois Pages configuré, mais ne peut pas activer un nouveau site à lui seul. L’activation manuelle dans les paramètres évite de créer un secret supplémentaire.

Source : https://github.com/actions/configure-pages/blob/main/action.yml

## Dépôt privé

GitHub Pages dans un dépôt privé exige une offre GitHub Pro, Team ou Enterprise compatible. Le projet ne change jamais automatiquement la visibilité du dépôt. Si GitHub affiche une demande de mise à niveau, le propriétaire doit décider du mode d’hébergement ou de l’offre avant poursuite.

Source : https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Diagnostic

- **Get Pages site failed** : vérifier l’activation et la source GitHub Actions.
- **Resource not accessible by integration** : vérifier l’offre du dépôt et les permissions `pages: write` / `id-token: write` du workflow.
- **404 après un déploiement réussi** : patienter jusqu’à la disponibilité du site, vérifier l’URL retournée par le déploiement, la casse `/SIGCP/` et l’éventuel domaine personnalisé.
- **Échec de build ou de tests** : corriger l’erreur dans les journaux GitHub Actions avant publication.

Les données de démonstration sont exclusivement fictives. La publication Pages n’installe pas le backend, l’identité OIDC, le stockage documentaire ou les contrôles d’accès institutionnels.
