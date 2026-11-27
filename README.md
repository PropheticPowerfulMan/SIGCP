# IMPERIUM RDC · SIGCP

**Système Intégré de Gestion des Courriers Présidentiels — démonstration 0.4.0**

Une information maîtrisée. Une action mieux coordonnée.

Projet initié et conçu par **LOKALA LOMBOTO Jonathan**. Propriétaire intellectuel revendiqué : LOKALA LOMBOTO Jonathan, sous réserve des dispositions institutionnelles, contractuelles et légales applicables.

Proposition technique non homologuée. Institutions, services, agents, références et documents exclusivement fictifs. Ne saisir aucune donnée réelle.

## Accéder à la démonstration

[Ouvrir IMPERIUM RDC 0.4.0](https://propheticpowerfulman.github.io/SIGCP/). La démonstration est publiée sur GitHub Pages ; la page et les ressources exactes de cette édition sont vérifiées.

L’écran d’entrée propose trois profils : **Agent pilote**, **Responsable du courrier** et **Autorité de validation**. Choisir un profil puis « Ouvrir la démonstration ». Aucun mot de passe réel n’est demandé. Le profil présente un usage et n’attribue aucun droit de sécurité. La session locale résiste au rechargement et se ferme depuis le profil.

## Évolutions de la 0.4.0

- Thème perle bleutée, surfaces et champs adoucis, contrastes repris pour le focus, les erreurs et les badges.
- Recherche globale depuis chaque rubrique, raccourci Ctrl K, métadonnées fictives et douze résultats au maximum.
- Émetteur/propriétaire distingué du destinataire et valeurs saisies dans les champs libres conservées.
- Avertissement de doublons potentiels avec confirmation explicite pour poursuivre l’enregistrement.
- Profils Agent pilote (AP), Responsable du courrier (RC) et Autorité de validation (AV) cohérents avec les avatars et les acteurs fictifs.
- Résumé des erreurs avec focus de correction et conservation du hash de navigation.

La CI a réussi : 47 tests Node, 23 parcours Chromium, typage/build et audit npm sans vulnérabilité ; un test de captures conditionnel est ignoré. Six parcours ont aussi réussi localement. Aucun backend, droit serveur ou nouvelle dépendance n’est ajouté, et le schéma `Mail` reste inchangé.

Les adaptations tactiles de la 0.3.1 sont conservées :

- Courriers présentés en cartes jusqu’à 1000 px, avec les mêmes données, actions et outils de tri ; tableaux conservés sur ordinateur.
- Rail de navigation de 78 px par défaut sur tablette sans préférence explicite, et navigation basse sur téléphone.
- Sur petit écran, accès au pilote placé avant le contenu éditorial de la connexion ; champs tactiles de 16 px et hauteur minimale de 48 px.
- Barres de défilement horizontales et verticales navy/or, propriétés CSS standard et repli WebKit, avec rendu système en couleurs forcées.
- Retours de focus, de pression et de survol sur les boutons, respect de la réduction des mouvements, indicateurs liés aux vrais états de sauvegarde, d’installation et de mise à jour.
- Contrôle d’installation intégré à la barre supérieure de l’espace de travail, sans recouvrir les dossiers ; l’accès de l’écran d’entrée est conservé.

Le [rapport de validation](docs/VALIDATION_REPORT.md) consigne les SHA, runs, bundles, cache et contrôles visuels. La revue de six configurations (1440, 390 et 820 px, clair/sombre) couvre 53 états et 1 407 échantillons de contraste calculables sans échec ; six captures `v04-*` sont figées. Ces mesures ne constituent pas une certification globale d’accessibilité. Les preuves 0.3.1 restent historiques.

## Démarrer le pilote

Node.js 24 et npm requis.

```sh
npm ci
npm run dev
```

Ouvrir http://127.0.0.1:5173/SIGCP/. Les routes `#/login`, `#/entrant`, `#/workflow`, `#/institutions` et les autres espaces fonctionnent sur GitHub Pages sans réécriture serveur.

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

Le build génère aussi le service worker à partir des ressources compilées. L’installation PWA et le mode hors connexion s’évaluent sur la version publiée ou sur la prévisualisation de production, pas avec le serveur de développement.

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
- Navigation clavier, menu rétractable avec préférence persistante, modes clair/sombre, responsive, notifications locales, journal de session, récupération des données corrompues et réinitialisation.

L’emblème fourni par le concepteur est intégré à l’entrée, à la navigation et aux icônes. L’interface reprend le bleu nuit, l’or et une ligne bleue, jaune et rouge inspirée de la charte du projet SSDC. Cette intégration graphique ne vaut pas approbation institutionnelle.

## Installer l’application

Utiliser « Installer l’application » sur l’écran d’entrée ou « Installer » dans la barre supérieure de l’espace de travail. Quand le navigateur fournit une installation native, le bouton ouvre sa confirmation. Sinon, une aide explique la procédure adaptée à l’appareil : partage et écran d’accueil sur iPhone/iPad, menu du navigateur sur Android, installation Chrome/Edge sur ordinateur, ajout au Dock sur les versions compatibles de Safari pour Mac.

L’identité PWA est propre au projet : identifiant, point d’entrée et périmètre `/SIGCP/`, avec manifeste et icônes PNG 192 et 512 pixels, dont une version maskable. La disponibilité et la forme de l’installation dépendent du navigateur et du système ; [voir les capacités décrites par MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).

Après une première ouverture en ligne et l’installation du service worker, la coque peut se recharger hors connexion. Son cache contient uniquement le HTML de la version, le JavaScript, le CSS, les polices et les images connues. Aucun résultat d’API, courrier saisi, document téléversé, export ou jeton n’est ajouté au cache. Le bundle contient le jeu synthétique initial ; les dossiers créés restent dans le stockage local du navigateur, indépendamment du cache PWA.

Une nouvelle version propose une mise à jour qui exige une confirmation explicite et reste bloquée pendant l’édition d’un formulaire. Le nettoyage concerne seulement les caches préfixés `imperium-sigcp-shell-` : les autres projets sur la même origine conservent leurs caches.

## Ce que signifie cette démonstration

Les courriers et scénarios sont enregistrés dans ce navigateur, via `localStorage`. Aucun serveur métier n’est connecté. Le navigateur n’est pas une frontière de sécurité : les données sont modifiables localement et les journaux n’ont aucune valeur de preuve. Aucun identifiant, jeton d’authentification ou secret de production n’est demandé.

Les statuts d’échange désignent des **simulations locales**, pas de véritables transmissions ou signatures. Les fichiers proposés sont des fiches textuelles générées, pas des documents institutionnels. L’identité, les habilitations et les contrôles de sécurité serveur ne sont pas présentés comme réalisés.

## Déploiement et corrections

Le workflow [pages.yml](.github/workflows/pages.yml) contrôle les dépendances, exécute les tests de domaine, de PWA et de navigateur, compile, puis publie sur GitHub Pages. La source Pages doit être **GitHub Actions**. Voir [la procédure de déploiement](docs/DEPLOYMENT.md).

La PR 4 est fusionnée au commit applicatif `be9463cd13cc596ac63e0e4a190b02272a14c223`. La [validation PR 45985797807](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45985797807) concernait la source `ea5eccfa`. Le [run de publication 45986496672](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45986496672) a réussi sur le commit fusionné : 47 Node, 23 Chromium, audit/typage/build, jobs build `140463373730` et deploy `140463879230`, artefact Pages `15191024538`.

Le site sert `index-DRwZDCfA.js` / `index-CF7AcEUd.css` et le cache de coque `cc9b9de510c6dda81353` de 27 ressources. La page, le manifeste, le service worker, les bundles, les trois icônes et l’emblème répondent en HTTP 200 avec les types attendus.

À titre historique, le [run 45886138008](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45886138008) avait publié la 0.3.1 au commit `1bee9bf2f77728652758725e404b1aaa1ca68475` avec 32 tests Node et 19 parcours Chromium réussis. Ses bundles `index-CA1h1BLN.js` / `index-BctLyuSp.css` et son cache `9f7f654df48ed8f6037f` ne constituent pas des preuves de la 0.4.0.

Les références des versions 0.3 et 0.2 restent également dans [l’historique du rapport](docs/VALIDATION_REPORT.md) ; elles ne valident pas les éditions suivantes.

Les six parcours locaux et la revue visuelle 0.4.0 sont confirmés. Le test public hors connexion a réussi : scénario de 25,0 s, exécution totale de 1,0 min, code de sortie 0. Réseau coupé et cache HTTP désactivé, le tableau de bord affiche 42 dossiers avec le service worker, le CSS, DM Sans et les images disponibles. Le dossier PDF final est également vérifié ; les anciens succès restent attribués à leur version.

Les corrections sont testées et publiées sur cette démonstration avant revue et migration à l’infrastructure institutionnelle. La visibilité du dépôt n’est pas modifiée automatiquement.

## Organisation du code

```text
src/domain.ts       Modèle, validations, transitions, recherche et statistiques
src/exchange.ts     Scénarios d’échanges locaux, idempotence et progression
src/main.tsx        Navigation, état du registre, persistance et coordination
src/Login.tsx       Entrée par profil de démonstration et identité visuelle
src/demo-session.ts Session locale de présentation, sans authentification
src/InstallPrompt.tsx Installation, aide par appareil et mise à jour explicite
src/pwa.ts          Événements et inscription du service worker en production
scripts/build-pwa.mjs Génération du cache de coque statique versionné
public/brand/       Emblème fourni et icônes dérivées
src/Insights.tsx    Tableau de bord et synthèses
src/Register.tsx    Registre et pagination
src/CreateForm.tsx  Saisie et erreurs accessibles
src/Detail.tsx      Fiche, historique, documents et paramètres
src/Network.tsx     Réseau fictif et suivi des échanges
src/ui.tsx          Composants accessibles et utilitaires de présentation
src/style.css       Design system, responsive, sombre et impression
```

Les polices et les ressources visuelles, dont l’emblème fourni, sont servies localement.

## Suite de la plateforme

Les deux prompts initiaux sont suivis dans [la matrice des exigences](docs/REQUIREMENTS_MATRIX.md). Le backend Java 25 / Spring Boot, PostgreSQL, OIDC/MFA, RBAC/ABAC serveur, GED privée, antivirus, messagerie de test puis institutionnelle, signatures et passerelle nationale restent à réaliser et à vérifier. Les douze PDF, les tests de sécurité de l’infrastructure cible et la migration historique ne sont pas revendiqués comme livrés.

Le [dossier PDF de revue du pilote 0.4.0](docs/IMPERIUM_RDC_Dossier_Revue_Pilote.pdf) comporte dix pages et 1 251 108 octets. Les dix pages ont été rendues et inspectées sans défaut constaté ; les preuves du run main et les limites des mesures y sont reprises. Il ne remplace pas les douze livrables institutionnels prescrits. L’[inventaire des dépendances](docs/DEPENDENCIES.md) est extrait des manifests installés ; aucune nouvelle dépendance n’est introduite par la 0.4.0.

Pour préparer la présentation : [guide de démonstration](docs/PRESENTATION_GUIDE.md), [installation PWA](docs/PWA_INSTALLATION.md) et [origine des éléments graphiques](docs/BRAND_ASSETS.md).

Voir [PROJECT_STATUS.md](PROJECT_STATUS.md) et [le plan technique](docs/TECHNICAL_PLAN.md) pour les résultats réellement exécutés, limites et prochaines étapes.
