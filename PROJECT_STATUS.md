# État du projet — 26 novembre 2026

## Terminé dans la démonstration

- Interface React et TypeScript strict, responsive, clair/sombre.
- Tableau de bord calculé, registres entrants/sortants, recherche et filtre.
- Création, détail, chronologie et évolution simplifiée d’un dossier fictif.
- Centre de validation, archives, export CSV et réinitialisation.
- Journal temporaire de session et écran de partenaires fictifs.
- Workflow de tests, compilation et déploiement GitHub Pages.

## Partiel

- GED : catalogue de dossiers uniquement, aucune pièce jointe hébergée.
- Interinstitutionnel : préparation de courrier uniquement, aucune transmission.
- Audit : journal local temporaire, sans garantie d’inaltérabilité.
- Workflow : séquentiel et simulé dans le navigateur.

## Non commencé

Backend Java, base PostgreSQL, OIDC/MFA, autorisations serveur, signatures, messagerie, stockage documentaire, antivirus, migrations historiques, rapports PDF, tests de sécurité et de performance de l’infrastructure cible.

## Vérifications exécutées

- 4 tests Node réussis : données fictives cohérentes, transitions, filtres combinés et protection CSV.
- TypeScript strict : réussi.
- Compilation Vite : voir résultat de livraison.
- Aucun scan de sécurité ni test d’intrusion exécuté ; aucune certification revendiquée.

## Risques et validations restantes

Données accessibles et modifiables localement ; aucune authentification de production. Ne pas saisir de données réelles. Fichier d’emblème officiel à fournir. Règles métier et organigramme à faire approuver. Abonnement et activation Pages du dépôt privé à vérifier pendant publication.

## Résultat de livraison

- Compilation de production Vite réussie : 1 579 modules, JavaScript 229,26 kB (70,64 kB gzip).
- Aperçu local vérifié : HTTP 200 sur http://127.0.0.1:5173/SIGCP/.
- Code publié dans GitHub : commit bf3bf7559c2da5fa49842f4582d9490e760f6714.
- Vérification visuelle non réalisée : délais d’expiration des outils navigateur et Windows.
- Publication Pages non confirmée : l’URL attendue répond HTTP 404 après envoi du code. Le connecteur disponible ne fournit pas le suivi des workflows déclenchés par push ; il ne permet donc pas d’établir la cause.
- Action restante : consulter Actions et Settings > Pages sur le dépôt ; vérifier que GitHub Actions est la source et que l’offre du compte autorise Pages sur ce dépôt privé. Le dépôt n’a pas été rendu public.

