# État de livraison · IMPERIUM RDC 0.3

Date : 26 novembre 2026. Pilote fonctionnel à données exclusivement fictives, non homologué. Version 0.3 validée en CI et publiée sur GitHub Pages ; quatre captures finales produites et inspectées.

## Fonctions disponibles

Registres entrants/sortants, création complète validée, recherche sans accents, filtres combinés, tri et pagination, suivi en sept étapes, retour motivé pour correction, validation et archivage distincts selon le type de courrier, fiches documentaires fictives, statistiques calculées, réseau fictif idempotent avec transmission/réception/accusé séparés, reprise après échec, journal de session, mode sombre et récupération des données locales.

## Évolutions de la version 0.3

- Écran d’entrée avec l’emblème fourni et trois profils de démonstration : Agent pilote, Responsable du courrier, Autorité de validation. Session locale conservée au rechargement et fermeture depuis le profil. Aucun compte réel, mot de passe, OIDC/MFA ou contrôle d’accès serveur n’est implémenté.
- Navigation rétractable avec préférence persistante, liens accessibles dans le menu réduit et navigation mobile. Design bleu nuit/or, ligne bleue/jaune/rouge et emblème intégré à la connexion, au menu et aux icônes.
- PWA propre au périmètre `/SIGCP/` : manifeste, icônes PNG 192/512 et maskable, installation native lorsque disponible et guide adapté aux autres navigateurs.
- Service worker généré après compilation, cache de coque statique versionné, reprise hors connexion et mise à jour sur confirmation. Le cache n’ajoute aucune réponse d’API, donnée saisie, document, export ou jeton. Les dossiers synthétiques intégrés au bundle et les données locales du navigateur ne constituent pas un backend.
- Les mises à jour ne rechargent pas automatiquement une saisie ; la confirmation est bloquée pendant l’édition. Le nettoyage des caches reste limité au préfixe SIGCP, pour préserver les autres projets sur la même origine GitHub Pages.

## Preuves de la version 0.3

- 32 tests Node métier, échanges et PWA : réussis en CI.
- 17 parcours Chromium : réussis ; un test de captures conditionnel ignoré en CI.
- Audit npm : zéro vulnérabilité signalée.
- TypeScript strict et compilation de production : réussis en CI.
- Bundle : `index-DCWiXY7w.js`, 325,75 kB / 96,43 kB gzip ; `index-6kHQ4sAP.css`, 79,43 kB / 16,61 kB gzip.
- Cache de coque : `imperium-sigcp-shell-89c6d17eea990bedf670`, 27 ressources statiques.
- Publication GitHub Pages : réussie ; page, bundles, service worker, manifeste et icônes vérifiés en HTTP 200.
- Captures finales de la connexion et du tableau de bord : produites et inspectées sur ordinateur et mobile, dans `docs/screenshots/`. Dimensions exactes dans le rapport de validation.
- Test supplémentaire hors connexion sur l’adresse publique : réussi, avec cache HTTP désactivé, 42 dossiers, CSS, polices et images chargés.
- Dossier PDF de revue 0.3 : huit pages, 1 098 386 octets ; rendu inspecté et validé.

Le [run de validation 45881470660](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45881470660) a réussi pour la source `f6e2175875ddfc3d921db8e0275f192a48445ffb`. La PR 2 est fusionnée dans `main` au commit `b8688b1d9e53008efb6d453563d289d5a0d0d58e`. Le [rapport de validation](docs/VALIDATION_REPORT.md) distingue cette CI de la vérification de publication et des exécutions historiques.

## Publication

Démonstration : https://propheticpowerfulman.github.io/SIGCP/

Le [run de publication 45881652536](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45881652536) est terminé avec succès au commit `b8688b1d9e53008efb6d453563d289d5a0d0d58e` : job build `140122197195`, job deploy `140122737703`. HTTP 200 et correspondance des bundles `index-DCWiXY7w.js` / `index-6kHQ4sAP.css` vérifiés sur le site public.

Le service worker est accessible en HTTP 200 avec la version de cache `89c6d17eea990bedf670`. Le manifeste répond en `application/manifest+json` ; l’icône PNG 512, l’icône Apple 180 et le favicon 64 répondent en HTTP 200 avec `image/png`.

La version 0.2 avait été publiée et contrôlée ; ses résultats restent historiques et ne valident pas les changements 0.3.

## Limites de production

Aucun backend Java, PostgreSQL, OIDC/MFA, RBAC/ABAC serveur, stockage documentaire privé, antivirus, signature vérifiable, messagerie réelle, journal inviolable, sauvegarde serveur ou migration historique n’est livré. Aucun contrôle d’accès ne peut être déduit des trois profils de l’écran d’entrée. Aucune certification ni homologation revendiquée.

L’emblème demandé a été fourni par le concepteur et intégré ; sa présence ne vaut pas validation institutionnelle du produit. Les douze PDF institutionnels prescrits restent à produire avec leurs preuves correspondantes. Le dossier PDF de revue a été actualisé pour la 0.3 ; il présente le pilote et ne remplace pas ces douze livrables.

Les 40 sections des deux prompts sont tracées dans [la matrice des exigences](docs/REQUIREMENTS_MATRIX.md). Aucun accès au système historique n’a été effectué.
