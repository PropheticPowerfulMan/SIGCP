# État de livraison · IMPERIUM RDC 0.2

Date : 26 novembre 2026. Pilote fonctionnel à données exclusivement fictives, non homologué.

## Fonctions disponibles

Registres entrants/sortants, création complète validée, recherche sans accents, filtres combinés, tri et pagination, suivi en sept étapes, retour motivé pour correction, validation et archivage distincts selon le type de courrier, fiches documentaires fictives, statistiques calculées, réseau fictif idempotent avec transmission/réception/accusé séparés, reprise après échec, journal de session, mode sombre, récupération des données locales et navigation responsive accessible.

## Corrections de la version précédente

Ancien domaine JavaScript remplacé par un modèle TypeScript strict. Sa résolution prioritaire provoquait une page blanche : fichier supprimé et imports explicités. Sauts de statuts refusés, données corrompues signalées, dates et références contrôlées. Raccourcis urgents/archives et destinataire partenaire corrigés. Lisibilité, contrastes, dialogues, menu mobile et focus repris. Le débordement mobile provenait d’un libellé sr-only absolu hors du conteneur ; positionnement relatif du conteneur, largeur mesurée de 829 à 390 px, sans masquer globalement les débordements. Polices locales et CSP par meta. Vite mis à jour de 6.4.1 à 6.4.6 après alerte npm.

## Preuves réellement exécutées

Exécution GitHub Actions : https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45871315126
Révision applicative validée : 5528c99621b8bbc0f43cc063e0db855e94f65cbc.

- 24 tests métier et échanges : réussis.
- 10 parcours Playwright Chromium : réussis ; 1 test de captures conditionnel ignoré en CI.
- TypeScript strict et compilation : réussis.
- Audit npm : zéro vulnérabilité signalée.
- Bundle : JS 300,85 kB / 89,56 kB gzip ; CSS 52,10 kB / 11,34 kB gzip.
- Captures réelles et dossier PDF de revue de six pages produits ; rendu PDF inspecté.

La validation des pull requests a aussi réussi dans le run 45874350254 ; PR 1 fusionnée. Le workflow publie uniquement depuis main.

## Publication vérifiée

Démonstration : https://propheticpowerfulman.github.io/SIGCP/

Déploiement réussi dans le run 45871315126, job deploy 140107074425. HTTP 200 vérifié avec les ressources exactes index-8ktd3b7o.js et index-DAab89lC.css. Le propriétaire a autorisé et effectué le passage du dépôt en public ; la source GitHub Actions a été enregistrée. Les corrections sur main sont testées avant publication.

Le premier échec Not Found provenait de Pages non activé ; ce blocage est résolu.

## Limites de production

Aucun backend Java, PostgreSQL, OIDC/MFA, RBAC/ABAC serveur, stockage documentaire privé, antivirus, signature vérifiable, messagerie réelle, journal inviolable, sauvegarde serveur ou migration historique n’est livré. Aucune certification ni homologation revendiquée. Les douze PDF institutionnels prescrits restent à produire avec les preuves correspondantes ; le dossier de revue du pilote ne les remplace pas. L’emblème officiel reste à fournir.

Les 40 sections des deux prompts sont tracées dans docs/REQUIREMENTS_MATRIX.md. Aucun accès au système historique n’a été effectué.
