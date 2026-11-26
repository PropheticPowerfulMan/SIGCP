# IMPERIUM RDC · SIGCP

**Système Intégré de Gestion des Courriers Présidentiels — démonstration 0.2**

Une information maîtrisée. Une action mieux coordonnée.

Projet initié et conçu par **LOKALA LOMBOTO Jonathan**. Propriétaire intellectuel revendiqué : LOKALA LOMBOTO Jonathan, sous réserve des dispositions institutionnelles, contractuelles et légales applicables.

Proposition technique non homologuée. Institutions, services, agents, références et documents exclusivement fictifs. Ne saisir aucune donnée réelle.

## Démarrer le pilote

Node.js 24 et npm requis.

```sh
npm ci
npm run dev
```

Ouvrir http://127.0.0.1:5173/SIGCP/. Les routes `#/entrant`, `#/workflow`, `#/institutions` et les autres espaces fonctionnent sur GitHub Pages sans réécriture serveur.

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

Pour les tests navigateur :

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

En local Windows, la configuration utilise Chrome installé ; en CI, Chromium Playwright. Pour les captures du pilote, définir `SIGCP_CAPTURE_SCREENSHOTS=1` avant `npm run test:e2e`.

## Parcours disponibles

- Tableau de bord sur 42 dossiers : flux sur sept jours, priorités, échéances et accès aux dossiers.
- Registres entrants et sortants : recherche sans accents, filtres combinés, dates, services, priorités, tri, pagination et export CSV neutralisant les formules.
- Formulaire complet : expéditeur, destinataire, service, agent, canal, priorité, réception et échéance ; validation accessible et erreurs par champ.
- Circuits : affectation, instruction, validation, retour motivé pour correction et archivage. Les entrants ne passent pas par l’expédition.
- Fiche de dossier : informations, chronologie et fiches documentaires fictives téléchargeables en texte.
- Synthèses : période, activité par service, taux de traitement, délais et répartition par statut.
- Réseau institutionnel : annuaire fictif, préparation d’échange idempotente, distinction transmission/réception/accusé, historique, reprise après échec et refus des destinations non activées.
- Navigation clavier, menu rétractable, modes clair/sombre, responsive, notifications locales, journal de session, récupération des données corrompues et réinitialisation.

## Ce que signifie cette démonstration

Les courriers et scénarios sont enregistrés dans ce navigateur, via `localStorage`. Aucun serveur métier n’est connecté. Le navigateur n’est pas une frontière de sécurité : les données sont modifiables localement et les journaux n’ont aucune valeur de preuve. Aucun identifiant, jeton d’authentification ou secret de production n’est demandé.

Les statuts d’échange désignent des **simulations locales**, pas de véritables transmissions ou signatures. Les fichiers proposés sont des fiches textuelles générées, pas des documents institutionnels. L’identité, les habilitations et les contrôles de sécurité serveur ne sont pas présentés comme réalisés.

## Déploiement et corrections

Le workflow [pages.yml](.github/workflows/pages.yml) contrôle les dépendances, exécute les tests de domaine et de navigateur, compile, puis publie sur GitHub Pages. La source Pages doit être **GitHub Actions**. Voir [la procédure de déploiement](docs/DEPLOYMENT.md).

URL cible : https://propheticpowerfulman.github.io/SIGCP/ — l’accessibilité effective est consignée dans PROJECT_STATUS.md.

Les corrections sont testées et publiées sur cette démonstration avant revue et migration à l’infrastructure institutionnelle. La visibilité du dépôt n’est pas modifiée automatiquement.

## Organisation du code

```text
src/domain.ts       Modèle, validations, transitions, recherche et statistiques
src/exchange.ts     Scénarios d’échanges locaux, idempotence et progression
src/main.tsx        Navigation, état du registre, persistance et coordination
src/Insights.tsx    Tableau de bord et synthèses
src/Register.tsx    Registre et pagination
src/CreateForm.tsx  Saisie et erreurs accessibles
src/Detail.tsx      Fiche, historique, documents et paramètres
src/Network.tsx     Réseau fictif et suivi des échanges
src/ui.tsx          Composants accessibles et utilitaires de présentation
src/style.css       Design system, responsive, sombre et impression
```

La typographie est servie localement. Le monogramme du produit ne représente pas un emblème officiel ; le fichier présidentiel autorisé reste à fournir.

## Suite de la plateforme

Les deux prompts initiaux sont suivis dans [la matrice des exigences](docs/REQUIREMENTS_MATRIX.md). Le backend Java 25 / Spring Boot, PostgreSQL, OIDC/MFA, RBAC/ABAC serveur, GED privée, antivirus, messagerie de test puis institutionnelle, signatures et passerelle nationale restent à réaliser et à vérifier. Les douze PDF, les tests de sécurité de l’infrastructure cible et la migration historique ne sont pas revendiqués comme livrés.

Voir [PROJECT_STATUS.md](PROJECT_STATUS.md) et [le plan technique](docs/TECHNICAL_PLAN.md) pour les résultats réellement exécutés, limites et prochaines étapes.
