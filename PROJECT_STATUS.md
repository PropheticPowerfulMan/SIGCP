# État de livraison · IMPERIUM RDC 0.4.0

Date : 27 novembre 2026. Pilote à données exclusivement fictives, non homologué. Version 0.4.0 validée en CI et publiée sur GitHub Pages ; contrôles visuels, six captures, hors connexion public et PDF final confirmés. Les résultats 0.3.1 et antérieurs sont historiques.

## Évolutions de la version 0.4.0

- Thème perle bleutée, surfaces et champs adoucis, avec reprise des contrastes des badges, du focus et des erreurs. Les modes clair/sombre et les adaptations tactiles sont conservés.
- Recherche globale locale depuis chaque rubrique, accessible par Ctrl K, sur les métadonnées fictives ; jusqu’à douze résultats présentés.
- Émetteur/propriétaire et destinataire distingués ; valeurs saisies dans les champs libres conservées.
- Avertissement de doublons potentiels, suivi d’une confirmation explicite pour poursuivre l’enregistrement. Ce contrôle local ne constitue pas une garantie de dédoublonnage concurrent côté serveur.
- Profils Agent pilote (AP), Responsable du courrier (RC) et Autorité de validation (AV) cohérents avec les avatars et les acteurs des événements fictifs.
- Résumé des erreurs avec déplacement du focus vers la saisie à corriger, sans modification du hash de navigation.

Ces changements sont validés par les parcours du pilote ci-dessous. Aucun backend ni droit serveur n’est ajouté, aucune nouvelle dépendance n’est introduite et le schéma `Mail` reste inchangé. Les profils servent à la présentation et ne constituent pas une identité authentifiée ou des habilitations.

## Fonctions conservées

Emblème fourni et ligne tricolore, session de démonstration, registres entrants/sortants, cartes tactiles et tableaux ordinateur, création validée, filtres/tri/pagination, workflow local, retours pour correction, fiches fictives, statistiques et échanges simulés. Le rail tablette, la navigation basse téléphone, les champs tactiles et les mouvements réduits sont conservés.

La PWA garde l’identité `/SIGCP/` et le cache de coque statique : aucune réponse d’API, donnée saisie, pièce, export ou jeton n’est ajouté au cache. Les scénarios synthétiques initiaux font partie du bundle ; les dossiers créés restent dans le stockage local. La mise à jour est explicite et bloquée pendant l’édition.

## État des preuves de la 0.4.0

| Élément | État confirmé |
| --- | --- |
| Tests Node | 47 réussis en CI |
| Parcours Chromium | 23 réussis ; 1 test de captures conditionnel ignoré |
| Typage/build et audit npm | Réussis ; 0 vulnérabilité signalée |
| Révision applicative publiée / PR | `be9463cd13cc596ac63e0e4a190b02272a14c223`, PR 4 fusionnée |
| Validation PR | [45985797807](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45985797807), source `ea5eccfa` |
| Publication Pages | [45986496672](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45986496672), succès ; build `140463373730`, deploy `140463879230`, artefact `15191024538` |
| Bundles | `index-DRwZDCfA.js` : 339,74 kB / 100,72 kB gzip ; `index-CF7AcEUd.css` : 112,82 kB / 23,20 kB gzip |
| Cache de coque | `imperium-sigcp-shell-cc9b9de510c6dda81353`, 27 ressources statiques |
| Ressources publiques | Page, manifeste, SW, JS, CSS, trois icônes et emblème : HTTP 200 avec types MIME attendus |
| Parcours locaux | 6 réussis |
| Revue visuelle | 1440/390/820 px en clair et sombre ; 53 états, 1 407 échantillons calculables sans échec ; minimum texte 5,038:1 |
| Captures | 6 PNG `v04-*` figés |
| Hors connexion public | 1 test réussi, scénario 25,0 s / exécution 1,0 min, code de sortie 0 ; réseau/cache HTTP désactivés, 42 dossiers/SW/CSS/DM Sans/images disponibles |
| PDF 0.4.0 | 10 pages, 1 251 108 octets ; rendu et inspection des dix pages sans défaut constaté |

Le [rapport de validation](docs/VALIDATION_REPORT.md) distingue CI, contrôles locaux, mesures de contraste, publication et contrôle documentaire. Les fonds dégradés sont examinés manuellement ; aucune certification générale d’accessibilité n’est déduite des échantillons calculables.

Publication 0.4.0 : https://propheticpowerfulman.github.io/SIGCP/. Le manifeste a id/scope/start_url `/SIGCP/`, le mode `standalone` et trois icônes (192 any, 512 any, 512 maskable).

## Historique de la publication 0.3.1

Les références ci-dessous concernent la publication antérieure et ne valident pas la 0.4.0.

Le [run 45886138008](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45886138008) avait publié la révision `1bee9bf2f77728652758725e404b1aaa1ca68475` : 32 tests Node, 19 parcours Chromium, typage/build et audit npm sans vulnérabilité ; un test de captures conditionnel était ignoré. Build `140137188118`, deploy `140137540180`, artefact `15149296772`.

Les bundles contrôlés étaient `index-CA1h1BLN.js` et `index-BctLyuSp.css`, avec le cache `9f7f654df48ed8f6037f` de 27 ressources. Le test public hors connexion avait réussi en 36 secondes ; dix captures et le PDF 0.3.1 de dix pages/1 419 426 octets avaient été inspectés. Ces preuves ne valident pas les nouveaux changements 0.4.0.

## Limites de production

Aucun backend Java, PostgreSQL, OIDC/MFA, RBAC/ABAC serveur, stockage documentaire privé, antivirus, signature vérifiable, messagerie réelle, journal inviolable, sauvegarde serveur ou migration historique n’est livré. Les profils AP/RC/AV et les événements locaux n’accordent aucun droit institutionnel. Aucune certification ni homologation revendiquée.

L’emblème a été fourni par le concepteur ; sa présence ne vaut pas approbation institutionnelle. Les douze PDF institutionnels prescrits restent à produire avec leurs preuves ; le dossier de revue du pilote ne les remplace pas.

Les 40 sections des prompts sont tracées dans [la matrice des exigences](docs/REQUIREMENTS_MATRIX.md). Aucun accès au système historique n’a été effectué.
