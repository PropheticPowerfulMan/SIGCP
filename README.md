# IMPERIUM RDC — SIGCP

Démonstration interactive du Système Intégré de Gestion des Courriers Présidentiels.
Projet proposé, non homologué. Données exclusivement fictives.

Initiateur et concepteur : LOKALA LOMBOTO Jonathan.
Propriétaire intellectuel revendiqué : LOKALA LOMBOTO Jonathan, sous réserve des dispositions institutionnelles, contractuelles et légales applicables.

## Démarrage

Prérequis : Node.js 24 et npm.

```sh
npm ci
npm run dev
```

Ouvrir l’URL locale affichée avec le chemin `/SIGCP/`.

```sh
npm test
npm run build
npm run preview
```

## Parcours disponibles

Tableau de bord calculé sur le registre, courriers entrants et sortants, recherche et filtre par statut, enregistrement validé d’un courrier fictif, détail et chronologie, transitions successives du circuit simplifié, validation, archives, catalogue de dossiers, préparation de correspondances interinstitutionnelles fictives, journal de session, export CSV protégé contre les formules, mode sombre et réinitialisation.

Les dossiers sont conservés dans localStorage uniquement. Le journal de session est temporaire et modifiable ; il ne constitue pas une piste d’audit sécurisée. Aucune authentification ni habilitation de production n’est fournie. Aucun email, fichier ou courrier réel n’est transmis. Ne pas introduire de données réelles.

## GitHub Pages

Le workflow `.github/workflows/pages.yml` exécute les tests et la compilation avant publication. Dans Settings > Pages, sélectionner GitHub Actions. L’activation automatique est demandée par `actions/configure-pages` ; si les droits ou l’abonnement du dépôt privé l’interdisent, l’administrateur doit activer Pages avec une offre compatible. Ne pas rendre le dépôt public sans décision du propriétaire.

URL attendue après déploiement réussi : https://propheticpowerfulman.github.io/SIGCP/

Chaque correction doit passer les tests et être publiée dans cette démonstration avant validation et migration sur l’infrastructure serveur.

## Infrastructure cible et limites

React / TypeScript strict / Vite pour cette version. Le backend Java 25 / Spring Boot, PostgreSQL, OIDC et MFA, RBAC/ABAC côté serveur, stockage S3 privé, antivirus, signatures, messagerie, échanges interinstitutionnels et migration du système historique restent à développer. GitHub Pages héberge uniquement les fichiers statiques.

L’emblème officiel doit être fourni et son usage autorisé ; le monogramme typographique du produit n’est pas un sceau institutionnel. Aucun emblème n’a été inventé.

Voir PROJECT_STATUS.md et docs/TECHNICAL_PLAN.md pour le périmètre et les prochaines étapes.
