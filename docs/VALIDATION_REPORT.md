# Rapport des contrôles · démonstration 0.3.1

Date : 26 novembre 2026. Portée : frontend statique à données fictives. Version 0.3.1 validée en CI et publiée sur GitHub Pages. Dix captures et le PDF final inspectés ; contrôle hors connexion public réussi. Les preuves 0.3 et 0.2 sont conservées uniquement dans l’historique.

## Bilan confirmé pour la 0.3.1

| Contrôle ou référence | État |
| --- | --- |
| Révision finale de `main` | `1bee9bf2f77728652758725e404b1aaa1ca68475` |
| Tests Node métier, échanges et PWA | 32 sur 32 réussis |
| Parcours navigateur Chromium | 19 réussis ; 1 test de captures conditionnel ignoré |
| Audit npm | 0 vulnérabilité signalée |
| Typage TypeScript strict et build | Réussis |
| GitHub Actions | [Run 45886138008](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45886138008), succès |
| Jobs Pages | Build `140137188118` et deploy `140137540180`, succès |
| Artefact Pages | `15149296772` |
| JavaScript | `index-CA1h1BLN.js` : 330,44 kB, 97,65 kB gzip |
| CSS | `index-BctLyuSp.css` : 99,43 kB, 20,60 kB gzip |
| Cache de coque | `imperium-sigcp-shell-9f7f654df48ed8f6037f`, 27 ressources statiques |
| Page, manifeste, SW, JS, CSS, PNG 512, emblème publics | HTTP 200 avec les types MIME attendus et les ressources exactes de la révision |
| Manifeste publié | id/scope/start_url `/SIGCP/`, `standalone`, trois icônes |
| Contrôles tactiles locaux supplémentaires | 2 parcours réussis ; détails ci-dessous |
| Captures | 9 claires et 1 sombre produites et inspectées |
| Contrôle final du mode sombre | Réussi : dialogue sans débordement, sauvegarde entièrement visible et notice corrigée |
| Rechargement hors connexion sur le site public | 1 test réussi en 36 s, code de sortie 0, cache HTTP désactivé |
| Dossier PDF de revue 0.3.1 | 10 pages, 1 419 426 octets ; rendu et inspection réussis |

Le run ci-dessus valide et publie cette édition sur https://propheticpowerfulman.github.io/SIGCP/. Aucun résultat de la 0.3 ou de la 0.2 n’est présenté comme preuve de ses nouveaux changements. Le test de captures conditionnel ignoré n’est pas compté parmi les succès.

## Parcours de recette de la 0.3.1

Les parcours couvrent les cartes des mêmes courriers jusqu’à 1000 px, les tableaux sur ordinateur, les dates/échéances, le tri, la recherche, la pagination et l’ouverture des dossiers. Les états vides ont une présentation adaptée sans duplication visible.

Les deux parcours tactiles ont aussi été exécutés localement avec succès : sur 390 px, la première carte est entièrement visible avant la navigation basse (bas de carte vers 730 px, navigation vers 778 px) ; sur 820 px, l’action de sauvegarde est entièrement accessible. Le rail de 78 px, la préférence explicite, le rechargement et la rotation à 1024 px sont contrôlés sans débordement horizontal. Ces mesures décrivent les configurations de recette, pas tous les appareils possibles.

La recette couvre également la navigation basse sur téléphone, la connexion donnant priorité à l’accès et les champs tactiles de 16 px avec hauteur minimale de 48 px.

Les contrôles d’interaction portent sur le focus clavier, la pression et le survol, les mouvements réduits, les barres de défilement horizontales/verticales et le retour aux couleurs système en mode forcé. Les spinners doivent correspondre aux opérations réelles de sauvegarde, d’installation ou d’activation d’une mise à jour ; le bouton d’installation de l’espace de travail doit rester dans la barre supérieure et ne pas recouvrir les cartes.

La stratégie PWA reste celle de la coque statique connue : aucune réponse d’API, identité, pièce, donnée saisie, export ou jeton ajouté au cache ; périmètre `/SIGCP/`, mise à jour explicite et conservation des caches des autres projets.

Un test final a été exécuté contre https://propheticpowerfulman.github.io/SIGCP/ : un succès en 36 secondes, code de sortie 0. Avec le cache HTTP désactivé puis la connexion coupée, le rechargement confirme le service worker, le tableau de bord de 42 dossiers, le CSS, la police DM Sans et les images. Cette vérification publique est distincte de la CI et ne prétend pas installer nativement l’application sur tous les systèmes.

## Captures et dossier de revue 0.3.1

Neuf captures claires et la capture [formulaire tablette sombre](screenshots/formulaire-tablette-sombre.png) sont figées dans `docs/screenshots/` et ont été inspectées. Après défilement, le dialogue sombre n’a pas de débordement et la sauvegarde est entièrement visible. La notice utilise le texte `#a6b6c8` sur le fond `#1b2e43`.

Le [dossier PDF de revue](IMPERIUM_RDC_Dossier_Revue_Pilote.pdf) documente la 0.3.1 avec la source et le run actuels : dix pages, 1 419 426 octets. Le rendu Poppler, l’inspection des dix pages et la vérification des quatre légendes ont réussi. Ce document ne remplace pas les douze livrables institutionnels demandés.

## Historique vérifié de la version 0.3

Le [run de validation 45881470660](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45881470660) avait réussi pour la source `f6e2175875ddfc3d921db8e0275f192a48445ffb`. La PR 2 a été fusionnée au commit `b8688b1d9e53008efb6d453563d289d5a0d0d58e`.

| Contrôle historique 0.3 | Résultat |
| --- | --- |
| Tests Node | 24 métier/échanges et 8 PWA, soit 32 réussis |
| Parcours Chromium | 17 réussis ; 1 test de captures conditionnel ignoré |
| Audit npm | 0 vulnérabilité signalée |
| Typage et build | Réussis |
| JavaScript | `index-DCWiXY7w.js` : 325,75 kB, 96,43 kB gzip |
| CSS | `index-6kHQ4sAP.css` : 79,43 kB, 16,61 kB gzip |
| Cache | `imperium-sigcp-shell-89c6d17eea990bedf670`, 27 ressources |

Le [run de publication 45881652536](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45881652536) avait réussi au commit fusionné : build `140122197195`, deploy `140122737703`. La page https://propheticpowerfulman.github.io/SIGCP/ et les bundles exacts avaient été vérifiés en HTTP 200, ainsi que le service worker, le manifeste `application/manifest+json`, l’emblème et les icônes PNG 512, Apple 180 et favicon 64 avec les types attendus. Le manifeste avait id/scope/start_url `/SIGCP/`, standalone et trois icônes.

Un test public hors connexion avait réussi en 30 secondes avec code de sortie 0 : service worker actif au bon périmètre, cache HTTP désactivé par CDP, tableau de bord de 42 dossiers, CSS, polices et images chargés. Ce contrôle est distinct des parcours CI.

Les captures 0.3 avaient été produites et inspectées : connexion ordinateur 1440 × 1142, connexion mobile 390 × 1489, tableau de bord ordinateur 1440 × 1917 et mobile 390 × 2562. Le dossier PDF de revue 0.3 comportait huit pages et 1 098 386 octets ; son rendu avait été inspecté. Ces artefacts historiques ont été remplacés par les supports 0.3.1 vérifiés séparément ci-dessus.

## Historique de la version 0.2

Le [run 45871315126](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45871315126) avait validé la révision `5528c99621b8bbc0f43cc063e0db855e94f65cbc` : 24 tests métier, typage/build, 10 parcours Playwright et audit sans alerte. Artefact `15141849152`, build `140087156007`, deploy `140107074425`. Les ressources publiques contrôlées étaient `index-8ktd3b7o.js` et `index-DAab89lC.css`. Ces références ne valident pas les éditions suivantes.

## Portée

Ces contrôles concernent le pilote statique à données fictives. Ils ne démontrent ni authentification réelle, ni autorisation serveur, ni signature officielle, ni conformité ASVS, ni capacité d’une infrastructure institutionnelle. Le dossier de revue ne remplace pas les douze PDF institutionnels prescrits. Aucun accès au système historique ni test sur une institution réelle n’a été effectué.
