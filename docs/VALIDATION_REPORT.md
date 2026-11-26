# Rapport des contrôles · démonstration 0.3

Date : 26 novembre 2026. Portée : frontend statique à données fictives, validé localement et dans GitHub Actions. Version 0.3 publiée sur GitHub Pages ; quatre captures finales produites et inspectées.

Le [run de validation 45881470660](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45881470660) est terminé avec succès pour la source `f6e2175875ddfc3d921db8e0275f192a48445ffb`. La PR 2 est fusionnée au commit `b8688b1d9e53008efb6d453563d289d5a0d0d58e`. Les résultats ci-dessous appartiennent à cette version 0.3 ; aucun ancien run n’est utilisé comme preuve de ses nouvelles fonctions.

## Contrôles CI confirmés pour la 0.3

| Contrôle | Résultat confirmé |
| --- | --- |
| Tests Node métier et échanges | 24 réussis |
| Tests Node PWA | 8 réussis |
| Total des tests Node | 32 réussis |
| Parcours navigateur Chromium | 17 réussis ; 1 test de captures conditionnel ignoré |
| Audit npm | 0 vulnérabilité signalée |
| Typage TypeScript strict | Réussi |
| Compilation de production Vite et génération PWA | Réussies |
| Bundle JavaScript | `index-DCWiXY7w.js` : 325,75 kB, 96,43 kB gzip |
| Bundle CSS | `index-6kHQ4sAP.css` : 79,43 kB, 16,61 kB gzip |
| Cache de coque statique | `imperium-sigcp-shell-89c6d17eea990bedf670`, 27 ressources |

Les tests PWA couvrent l’identité stable du manifeste, les icônes déclarées, le périmètre du précache, l’exclusion des API et identités, le repli hors connexion, la conservation de la coque correspondant à la version, le respect des réponses d’autorisation serveur, la conservation des caches des autres projets, le message explicite d’activation et le hachage des ressources compilées. Le favicon PNG utilisé par l’index est explicitement inclus dans les ressources autorisées.

Ces tests n’installent pas une application native sur chaque système. Les tailles PNG et l’allowlist sont contrôlées par le builder ; l’installation effective dépend du navigateur et de l’appareil.

## Recette navigateur de la 0.3

17 parcours Chromium réussis dans le run de validation de la 0.3. Un test de captures, conditionné par une variable d’environnement, est ignoré dans cette CI et n’est pas compté comme réussi.

La recette couvre les parcours existants et les nouveaux contrôles : entrée sans mot de passe réel, session fictive et fermeture, menu réduit et persistance, manifeste et icône PNG 512, rechargement hors connexion avec le cache HTTP désactivé, exclusion des sondes API/identité du CacheStorage et aide d’installation accessible avec Échap/retour du focus.

Les captures finales de la nouvelle connexion et du tableau de bord ont été produites lors d’une exécution locale distincte, puis inspectées visuellement.

| Capture de la version 0.3 | Dimensions PNG |
| --- | --- |
| [Connexion, ordinateur](screenshots/login.png) | 1440 × 1142 |
| [Connexion, mobile](screenshots/login-mobile.png) | 390 × 1489 |
| [Tableau de bord, ordinateur](screenshots/dashboard.png) | 1440 × 1917 |
| [Tableau de bord, mobile](screenshots/dashboard-mobile.png) | 390 × 2562 |

## Publication de la 0.3

Adresse publiée : https://propheticpowerfulman.github.io/SIGCP/

Le [run de publication 45881652536](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45881652536) est terminé avec succès pour le commit fusionné `b8688b1d9e53008efb6d453563d289d5a0d0d58e`. Job build : `140122197195` ; job deploy : `140122737703`. Cette preuve de publication est distincte du run de validation de la PR.

| Ressource publique contrôlée | Résultat |
| --- | --- |
| Page `/SIGCP/` | HTTP 200 ; références exactes aux bundles de la 0.3 |
| JavaScript `index-DCWiXY7w.js` et CSS `index-6kHQ4sAP.css` | HTTP 200 ; correspondance avec le build validé |
| `/SIGCP/sw.js` | HTTP 200 ; cache `89c6d17eea990bedf670` |
| Manifeste PWA | HTTP 200 ; `application/manifest+json` ; id/scope/start_url `/SIGCP/`, standalone et trois icônes |
| Icône PNG 512, icône Apple 180, favicon PNG 64 | HTTP 200 ; `image/png` |
| Emblème fourni | HTTP 200 ; type d’image attendu |

Les contrôles établissent que les ressources de la version 0.3 sont servies sur GitHub Pages. Ils ne prouvent pas une installation native sur chaque modèle d’appareil ; celle-ci dépend des capacités du navigateur et du système.

Un test Playwright supplémentaire a été exécuté contre l’adresse publique https://propheticpowerfulman.github.io/SIGCP/ : un test réussi en 30 secondes, code de sortie 0. Il confirme le service worker actif au périmètre attendu puis le rechargement hors connexion avec le cache HTTP désactivé par CDP : tableau de bord et 42 dossiers affichés, CSS, polices et images chargés. Ce test public est distinct des 17 parcours CI.

## Dossier documentaire de la 0.3

Le [dossier PDF de revue du pilote](IMPERIUM_RDC_Dossier_Revue_Pilote.pdf) a été actualisé pour la version 0.3 : huit pages, 1 098 386 octets. Le rendu a été produit, inspecté et validé. Ce dossier de présentation ne remplace pas les douze PDF institutionnels demandés par les prompts initiaux.

## Historique de la version 0.2

Le [run 45871315126](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45871315126) avait validé la révision `5528c99621b8bbc0f43cc063e0db855e94f65cbc` : 24 tests métier, typage/compilation, 10 parcours Playwright et audit npm sans alerte. L’artefact Pages était `15141849152`, le job build `140087156007` et le job deploy `140107074425`.

La publication de cette version avait été contrôlée en HTTP 200 avec `index-8ktd3b7o.js` et `index-DAab89lC.css`. Ces références sont conservées pour l’historique ; elles ne valident ni l’écran d’entrée, ni le nouveau design, ni la PWA de la 0.3.

## Portée

Ces contrôles concernent le pilote statique à données fictives. Ils ne démontrent ni authentification réelle, ni autorisation serveur, ni signature officielle, ni conformité ASVS, ni capacité d’une infrastructure institutionnelle. Aucun accès au système historique ni test sur une institution réelle n’a été effectué.
