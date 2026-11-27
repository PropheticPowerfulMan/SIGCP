# État de livraison · IMPERIUM RDC 0.3.1

Date : 26 novembre 2026. Pilote à données exclusivement fictives, non homologué. Version 0.3.1 validée en CI et publiée sur GitHub Pages. Dix captures et le PDF final inspectés ; contrôle hors connexion public réussi. Les résultats de la 0.3 ci-dessous restent historiques.

## Évolutions de la version 0.3.1

- Les tableaux de courriers deviennent des cartes jusqu’à 1000 px, y compris les dernières correspondances du tableau de bord. Référence, objet, sens, correspondant, service, priorité, statut et date proviennent des mêmes dossiers ; les outils de tri restent disponibles.
- La tablette utilise par défaut un rail de navigation de 78 px lorsqu’aucune préférence explicite n’est enregistrée. Le choix de menu réduit ou développé reste conservé. Le téléphone dispose d’une navigation basse.
- Les champs tactiles utilisent une police de 16 px et une hauteur minimale de 48 px. Sur petit écran, l’accès au pilote précède le contenu éditorial de la connexion ; le titre et l’emblème du tableau de bord ont une disposition adaptée.
- Les barres de défilement verticales et horizontales partagent la palette navy/or. Les propriétés CSS standard sont privilégiées avec un repli WebKit ; le mode de couleurs forcées conserve le rendu système.
- Les boutons ont des retours de survol, de focus et de pression. Les mouvements sont réduits selon la préférence système.
- Les indicateurs de sauvegarde, d’installation et de mise à jour suivent les opérations réellement en cours ; aucun chargement artificiel n’est ajouté aux parcours immédiats.
- Dans l’espace de travail, le contrôle d’installation est intégré à la barre supérieure au moyen d’un portail React, pour libérer le contenu. L’écran d’entrée conserve son accès à l’installation et à l’aide par appareil.

Ces changements concernent l’interface du pilote. La validation CI, la correspondance des ressources publiées et les contrôles de présentation de la 0.3.1 sont confirmés ci-dessous.

## Fonctions conservées

Entrée par trois profils fictifs, emblème fourni et ligne tricolore, session de démonstration, registres entrants/sortants, création validée, recherche/filtres/tri/pagination, workflow local, retour pour correction, fiches documentaires fictives, statistiques, échanges simulés, mode sombre et récupération du stockage local.

La PWA conserve son identité `/SIGCP/`, ses icônes et sa stratégie de cache de coque statique. Aucune réponse d’API, donnée saisie, pièce, export ou jeton n’est ajouté au cache. Les scénarios synthétiques initiaux font partie du bundle ; les dossiers créés restent dans le stockage local du navigateur. Les mises à jour demandent une confirmation et sont bloquées pendant l’édition.

## Preuves confirmées pour la 0.3.1

| Élément | État |
| --- | --- |
| Révision de `main` | `1bee9bf2f77728652758725e404b1aaa1ca68475` |
| Tests Node | 32 sur 32 réussis |
| Parcours Chromium | 19 réussis ; 1 test de captures conditionnel ignoré |
| Audit npm, typage strict et build | 0 vulnérabilité ; typage et build réussis |
| Exécution GitHub Actions | [45886138008](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45886138008), succès |
| Publication Pages | Build `140137188118`, deploy `140137540180` réussis ; artefact `15149296772` |
| Bundles | `index-CA1h1BLN.js` : 330,44 kB / 97,65 kB gzip ; `index-BctLyuSp.css` : 99,43 kB / 20,60 kB gzip |
| Cache de coque | `imperium-sigcp-shell-9f7f654df48ed8f6037f`, 27 ressources statiques |
| Ressources publiques | Page, manifeste, SW, JS, CSS, PNG 512 et emblème : HTTP 200, types MIME attendus |
| Contrôles tactiles locaux | 2 parcours réussis : carte visible à 390 px, sauvegarde accessible à 820 px, rail/préférence/rechargement/rotation à 1024 px sans débordement |
| Captures | 9 captures claires et `formulaire-tablette-sombre.png` inspectés ; sauvegarde entièrement visible et notice lisible en sombre |
| Hors connexion public | 1 test réussi en 36 s, cache HTTP désactivé ; 42 dossiers, SW, CSS, DM Sans et images chargés |
| PDF 0.3.1 | 10 pages, 1 419 426 octets ; rendu Poppler, inspection des 10 pages et des 4 légendes réussis |

Le [rapport de validation](docs/VALIDATION_REPORT.md) conserve les références exactes et sépare les résultats CI, tactiles locaux, publics et documentaires.

Publication : https://propheticpowerfulman.github.io/SIGCP/. Le manifeste publié a id/scope/start_url `/SIGCP/`, le mode `standalone` et trois icônes.

## Historique de la publication 0.3

Démonstration : https://propheticpowerfulman.github.io/SIGCP/

La 0.3 avait réussi 32 tests Node, 17 parcours Chromium, le typage/build et un audit npm sans vulnérabilité ; un test de captures conditionnel était ignoré. [Validation 45881470660](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45881470660), source `f6e2175875ddfc3d921db8e0275f192a48445ffb`, fusion `b8688b1d9e53008efb6d453563d289d5a0d0d58e`.

Le [déploiement 45881652536](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45881652536) avait été contrôlé avec les bundles `index-DCWiXY7w.js` / `index-6kHQ4sAP.css` et le cache `89c6d17eea990bedf670` de 27 ressources. Un test hors connexion sur l’adresse publique avait réussi. Quatre captures et le dossier PDF 0.3 de huit pages avaient été inspectés. Ces preuves ne valident pas les changements 0.3.1.

## Limites de production

Aucun backend Java, PostgreSQL, OIDC/MFA, RBAC/ABAC serveur, stockage documentaire privé, antivirus, signature vérifiable, messagerie réelle, journal inviolable, sauvegarde serveur ou migration historique n’est livré. Les trois profils de l’entrée ne constituent pas des habilitations. Aucune certification ni homologation revendiquée.

L’emblème a été fourni par le concepteur ; sa présence ne vaut pas approbation institutionnelle. Les douze PDF institutionnels prescrits restent à produire avec leurs preuves ; le dossier de revue du pilote ne les remplace pas.

Les 40 sections des prompts sont tracées dans [la matrice des exigences](docs/REQUIREMENTS_MATRIX.md). Aucun accès au système historique n’a été effectué.
