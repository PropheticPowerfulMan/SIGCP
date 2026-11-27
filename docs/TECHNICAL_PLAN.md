# Plan technique — IMPERIUM RDC

## Livraison actuelle

Démonstration statique React/TypeScript 0.3.1, données synthétiques locales, publiée via GitHub Actions et Pages. Base URL /SIGCP/. Entrée par trois profils fictifs, emblème fourni intégré, navigation adaptative et PWA avec cache de coque statique disponibles. Ces profils n’authentifient aucune identité et ne constituent pas des habilitations. Le domaine et les fonctions de recherche/export sont séparés de la vue pour préparer l’intégration d’une API.

## Architecture cible

Monolithe modulaire Java 25 / Spring Boot, couches domain, application, infrastructure et presentation. Modules identité, référentiels, registre, workflow, GED, messagerie, audit, échanges et migration. PostgreSQL et Flyway ; BFF OIDC avec cookies HttpOnly et Secure ; documents privés compatibles S3 ; outbox transactionnelle. Validation des versions et licences avant implémentation.

## Backlog priorisé

1. Faire valider institutionnellement les parcours et la charte du pilote ; l’emblème fourni est déjà intégré et la recette technique 0.3.1 sur Pages est réalisée, sans homologation implicite.
2. Formaliser organigramme, numérotation, classifications, rôles et circuits approuvés.
3. Initialiser backend, migrations, environnement Docker et identité OIDC.
4. Implémenter autorisations serveur, transitions concurrentes et registre transactionnel.
5. Ajouter GED privée, quarantaine antivirus, audit durable et conservation.
6. Intégrer messagerie de test et passerelle entre institutions fictives isolées.
7. Exécuter tests de contrats, isolation, sécurité, sauvegarde et restauration.
8. Produire les PDF requis avec preuves, captures réelles et limites explicites.
9. Préparer migration à blanc, réconciliation, retour arrière et validation humaine avant production.

## Risques et frontières

Le navigateur et localStorage ne sont pas fiables pour la production. Aucun secret ni contenu institutionnel ne doit être chargé sur Pages. React encode les champs affichés ; les exports CSV neutralisent les formules. Pas de chargement de HTML fourni par l’utilisateur. Les protections d’accès, preuves de signature et garanties d’archivage nécessitent le serveur. La démonstration ne les revendique pas.

Les polices sont servies localement avec repli système. Les ressources de production devront être hébergées conformément à la politique institutionnelle.

## Validation avant migration

Tout changement passe par les tests, la compilation et une revue du pilote. Les contrôles de production et les autorisations institutionnelles restent obligatoires avant utilisation réelle. Aucun accès au système historique n’a été effectué.
