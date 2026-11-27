# Publication de la démonstration GitHub Pages

État vérifié le 27 novembre 2026 : version 0.4.0 publiée sur https://propheticpowerfulman.github.io/SIGCP/, page et ressources exactes contrôlées en HTTP 200. Le dépôt est public avec l’accord du propriétaire et la source Pages est GitHub Actions.

## Activation initiale

1. Ouvrir https://github.com/PropheticPowerfulMan/SIGCP/settings/pages avec un compte administrateur du dépôt.
2. Dans Build and deployment, choisir la source **GitHub Actions**.
3. Ouvrir https://github.com/PropheticPowerfulMan/SIGCP/actions et exécuter **Validate and deploy demo** (Run workflow), ou publier une correction sur `main`.
4. Attendre que les tâches de compilation et de déploiement soient toutes les deux réussies.
5. Ouvrir l’URL retournée par le job de déploiement, choisir un profil fictif et vérifier le tableau de bord.

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

## Contrôle de la version installable 0.4.0

La PR 4 est fusionnée au commit applicatif `be9463cd13cc596ac63e0e4a190b02272a14c223`. La [validation PR 45985797807](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45985797807) concernait la source `ea5eccfa` ; le [run main 45986496672](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45986496672) a publié le commit fusionné. Résultats : 47 tests Node, 23 parcours Chromium, audit npm sans vulnérabilité et typage/build réussis ; un test de captures conditionnel ignoré.

Build `140463373730` et deploy `140463879230` réussis ; artefact Pages `15191024538`, déploiement terminé à 10:59:17 UTC. Le HTML public référence `index-DRwZDCfA.js` (339,74 kB ; 100,72 kB gzip) et `index-CF7AcEUd.css` (112,82 kB ; 23,20 kB gzip). Le cache de coque `cc9b9de510c6dda81353` contient 27 ressources statiques.

La page, le manifeste, le service worker, le JS/CSS, les trois icônes et l’emblème répondent en HTTP 200 avec les types attendus : HTML, `application/manifest+json`, `application/javascript`, `text/css`, `image/png`, `image/jpeg`. Le manifeste conserve id/scope/start_url `/SIGCP/`, `standalone` et les icônes 192 any/512 any/512 maskable.

Six parcours locaux et la revue visuelle sur 1440/390/820 px, clair/sombre, sont confirmés. Un test public hors connexion a réussi : scénario 25,0 s, exécution 1,0 min, code de sortie 0. Réseau/cache HTTP désactivés, le service worker contrôle le tableau de bord de 42 dossiers ; CSS, DM Sans et images sont disponibles. Le [rapport](VALIDATION_REPORT.md) distingue ce contrôle de la CI et documente le PDF final 0.4.0 : dix pages, 1 251 108 octets, rendu et inspection vérifiés.

Le schéma `Mail` est inchangé, aucune nouvelle dépendance ni migration n’est ajoutée. La publication statique n’ajoute aucun backend ni habilitation serveur. Les anciens bundles et runs ci-dessous ne valident pas la 0.4.0.

## Historique vérifié de la version 0.3.1

Publication vérifiée : [run 45886138008](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45886138008), révision applicative de `main` `1bee9bf2f77728652758725e404b1aaa1ca68475`. Build `140137188118` et deploy `140137540180` réussis ; artefact Pages `15149296772`. Les 32 tests Node et 19 parcours Chromium ont réussi, avec un test de captures conditionnel ignoré ; typage/build et audit npm sans vulnérabilité confirmés.

Le HTML public sert `index-CA1h1BLN.js` (330,44 kB ; 97,65 kB gzip) et `index-BctLyuSp.css` (99,43 kB ; 20,60 kB gzip). La page, le manifeste, le service worker, ces bundles, l’icône PNG 512 et l’emblème répondent en HTTP 200 avec leurs types MIME attendus. L’identité, le démarrage et le périmètre du manifeste sont `/SIGCP/`, avec affichage `standalone` et trois icônes. Le cache de coque `9f7f654df48ed8f6037f` contient 27 ressources statiques autorisées.

Le test final hors connexion sur l’adresse publique a réussi en 36 secondes avec le cache HTTP désactivé : service worker actif, tableau de bord de 42 dossiers, CSS, police DM Sans et images chargés. Ce contrôle ne remplace pas la vérification de l’installation propre au navigateur de chaque appareil.

Après une correction, vérifier ces ressources et le parcours d’entrée avant d’utiliser le mode hors connexion. Les changements d’interface restent publiés par la chaîne de validation ; les mises à jour de documentation seules ne relancent pas le déploiement. Consulter [le guide d’installation](PWA_INSTALLATION.md) et [le guide de présentation](PRESENTATION_GUIDE.md).
