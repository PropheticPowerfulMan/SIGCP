# Matrice de traçabilité des exigences — IMPERIUM RDC / SIGCP

Version du périmètre : 0.4.0, démonstration frontend. Date : 27 novembre 2026. CI et publication réussies : 47 Node, 23 Chromium, audit sans vulnérabilité et typage/build ; un test de captures conditionnel ignoré. Six parcours locaux, six captures, revue visuelle, hors connexion public et PDF final confirmés. Les preuves antérieures restent historiques.

Initiateur et concepteur : **LOKALA LOMBOTO Jonathan**.

Propriétaire intellectuel revendiqué : LOKALA LOMBOTO Jonathan, sous réserve des dispositions institutionnelles, contractuelles et légales applicables.

Cette matrice reprend les 40 sections du master prompt initial et de son extension stratégique nationale fournis par le concepteur. Elle décrit les écarts entre ces exigences et le code de la démonstration. Elle ne constitue ni une homologation, ni un audit indépendant, ni une attestation de conformité ou de sécurité.

## Lecture des statuts

| Statut | Signification |
| --- | --- |
| Réalisé local | Fonction disponible dans le navigateur avec des données synthétiques ; aucune garantie de production implicite. |
| Partiel | Une partie démontrable existe, mais des fonctions demandées restent absentes. |
| Non commencé | Aucun service fonctionnel correspondant à l’exigence cible n’est implémenté. |
| À valider | Une décision, un fichier autorisé, un inventaire ou une validation institutionnelle est nécessaire. |

Le statut d’une section agrège plusieurs exigences : « Partiel » ne signifie pas que ses contrôles de sécurité sont opérationnels. Le stockage navigateur, les identifiants d’institutions et les agents fictifs sont modifiables par l’utilisateur. Cette version n’offre aucune isolation multitenant de production. Aucune donnée réelle ne doit être introduite dans la démonstration GitHub Pages.

## Fondation, identité et architecture — sections 1 à 6

| Section | Exigence résumée | Statut réel v0.4.0 | Éléments présents et écarts |
| --- | --- | --- | --- |
| 1 — Mission générale | Plateforme institutionnelle, attribution, souveraineté et statut non homologué | Partiel / À valider | Identité du projet, attribution et mentions de démonstration présentes. Seul un frontend pilote est livré ; reconnaissance institutionnelle et cadre de propriété restent à valider. |
| 2 — Contexte historique | Reconstruire les fonctions en préservant la continuité ; ne pas présumer les vulnérabilités | À valider | Aucun accès ni modification du système PHP historique. Version PHP, moteur de base, volumes, contrats et règles métier restent inconnus ; leur inventaire nécessite un mandat formalisé. |
| 3 — Architecture obligatoire | Java 25, Spring Boot maintenu, monolithe modulaire, React strict et infrastructure souveraine | Partiel | React, TypeScript strict, Vite et Lucide sont intégrés. Domaine frontend typé séparé de la vue. Backend Java/Spring, PostgreSQL, Flyway, Maven Wrapper, JPA, API, outbox, IAM, S3, Docker et observabilité non commencés. Voir écarts technologiques détaillés ci-dessous. |
| 4 — Identité visuelle et UI/UX | Charte bleu nuit/or, emblème exact, responsive, accessibilité, tableaux et graphiques | Partiel / À valider | Thème perle bleutée, surfaces/champs doux, contrastes focus/erreurs/badges repris ; emblème, ligne tricolore et adaptations tactiles conservés. Revue 1440/390/820 px clair/sombre : 53 états, 1 407 échantillons calculables sans échec, minimum texte 5,038:1 ; dégradés contrôlés manuellement. Six captures figées. Ces mesures ciblées ne constituent pas une certification WCAG ou une approbation de charte. |
| 5 — Identité | OIDC, SSO, MFA/WebAuthn, sessions et BFF avec cookies sécurisés | Non commencé pour l’identité de production | Entrée fictive Agent pilote/AP, Responsable du courrier/RC, Autorité de validation/AV et session de présentation en sessionStorage. En 0.4.0, avatars et acteurs fictifs sont cohérents avec le profil choisi. Aucun mot de passe réel, identité authentifiée ou droit serveur délivré. Aucun backend OIDC, SSO, MFA, BFF, cookie sécurisé, LDAP ou révocation ajouté. Aucun jeton d’authentification dans localStorage. |
| 6 — Rôles et habilitations | RBAC/ABAC côté serveur, refus par défaut, besoin d’en connaître et séparation des tâches | Non commencé | Aucun contrôle d’accès serveur. Les noms d’agents et services servent à illustrer les parcours ; ils ne constituent pas des habilitations. Matrice officielle des rôles, classifications et délégations à fournir. |

## Courriers, référentiels et documents — sections 7 à 15

| Section | Exigence résumée | Statut réel v0.4.0 | Éléments présents et écarts |
| --- | --- | --- | --- |
| 7 — Courriers entrants | Registre complet, enregistrement, affectation, consultation, exports et numérotation fiable | Partiel | Création, registre, fiche, service/agent, dates, recherche, CSV et historique locaux ; cartes tactiles et table ordinateur conservées. Édition 0.4.0 : émetteur/propriétaire distinct du destinataire, champs libres préservés et avertissement de doublons potentiels avec confirmation explicite. Références `DEMO/YYYY/00001` fictives. Schéma Mail inchangé. Numérotation concurrente, dédoublonnage transactionnel serveur, modification contrôlée complète, sélection multiple autorisée, impression et accusés officiels absents. |
| 8 — Courriers sortants | Brouillon, rédaction, visa, signature, expédition et preuves de livraison | Partiel | Création d’un courrier sortant et circuit local jusqu’à l’expédition simulée puis l’archivage. Aucun éditeur de modèles approuvés, visa officiel, lien de réponse complet, génération PDF ou signature cryptographique. |
| 9 — Messagerie | Connecteurs IMAP/SMTP/OAuth, fils, pièces jointes, rattachement et analyse des contenus | Non commencé | Aucune messagerie réelle et aucun envoi externe. Mailpit, connecteurs, antimalware, conversion email-courrier et conservation des messages originaux restent à implémenter. |
| 10 — Workflow | Circuits configurables, validations, retours motivés, délais, délégations et autorisations serveur | Partiel | Transitions locales explicites, distinction entrant/sortant, retour pour correction motivé, refus des sauts d’étapes et actions rétrodatées, chronologie et échéances. Pas de moteur configurable, validation parallèle, délégation, rappel planifié, verrouillage transactionnel ou contrôle serveur. |
| 11 — Organes et services | Référentiel hiérarchique configurable et import officiel | Partiel / À valider | Quatre services pilotes et trois institutions fictives sont définis dans le domaine. Aucun organigramme réel inventé. Administration hiérarchique, import et responsables habilités non implémentés. |
| 12 — Types et référentiels | Administration des catégories, priorités, classifications, modèles et règles de conservation | Partiel / À valider | Types entrant/sortant, priorités, canaux, statuts et agents synthétiques intégrés. Classification unique « Démonstration ». Aucun moteur d’administration ni classement officiel automatique ; règles institutionnelles à approuver. |
| 13 — GED | Téléversement, versions, empreintes, quarantaine, droits, OCR et conservation | Partiel | Fiches descriptives fictives, métadonnées et téléchargement d’un texte de démonstration. Aucune pièce originale hébergée. Stockage privé, téléversement, numérisation, SHA-256 documentaire, antivirus, versions, droits, OCR et gel de conservation non commencés. |
| 14 — Recherche | Filtres avancés, pagination serveur, index et absence de fuite de métadonnées | Partiel | Recherche globale locale depuis chaque rubrique, Ctrl K, métadonnées fictives et douze résultats maximum, contrôlés par les parcours 0.4.0. Filtres/tri/pagination conservés ; 42 dossiers chargés dans le navigateur. Aucun index PostgreSQL, pagination API, recherche dans les pièces ou filtrage serveur par habilitations. |
| 15 — Synthèses | Indicateurs, tendances, services, délais, rapports PDF/Excel et exports autorisés | Partiel | Indicateurs calculés depuis les dossiers, tendance sur sept jours, répartition par service/statut, retard, délai moyen et export CSV neutralisant les formules. Médiane, indicateurs institutionnels de conformité, rapports PDF/Excel et autorisations d’export restent à réaliser. |

## Sécurité, tests, migration et exploitation — sections 16 à 24

| Section | Exigence résumée | Statut réel v0.4.0 | Éléments présents et écarts |
| --- | --- | --- | --- |
| 16 — Cybersécurité | ASVS, contrôles applicatifs/HTTP, chiffrement, secrets, base et audit protégé | Partiel | Champs affichés via React, validation métier locale, lecture stricte du stockage et protection CSV. Ces mesures ne remplacent pas l’autorisation serveur. Pas de base, gestion des clés, chiffrement institutionnel, audit immuable, BFF, rate limiting ni contrôle HTTP complet. Aucune certification revendiquée. |
| 17 — Tests et autocorrection | SAST, dépendances, secrets, DAST local, conteneurs et tests d’autorisation | Partiel | Tests unitaires frontend et scénarios Playwright présents. Les résultats effectivement exécutés sont à consulter dans les rapports de livraison. Tests d’autorisation serveur, Semgrep/SpotBugs/FindSecBugs, CodeQL, Gitleaks, ZAP, Trivy/Checkov, Dependency-Check/OSV et SBOM ne sont pas attestés par leur seule présence dans le master prompt. Aucun test sur un système institutionnel réel. |
| 18 — Performance | Index, tâches asynchrones, charge 100 000/1 000 000 dossiers, latence et concurrence | Non commencé | Pagination locale d’un petit jeu synthétique ; elle ne mesure pas la capacité de l’architecture cible. Aucun benchmark k6/Gatling sur infrastructure représentative, aucune garantie de débit ou disponibilité. |
| 19 — Migration PHP | Inventaire, mapping, dry-run, import idempotent, réconciliation et retour arrière | Non commencé / À valider | Une orientation technique figure dans `TECHNICAL_PLAN.md`. Aucun adaptateur, mapping source-cible, script de migration ou rapprochement exécuté. Aucun mot de passe historique importé. Découverte et extraction doivent rester en lecture seule sous mandat. |
| 20 — Notifications | Affectations, validations, échéances, retards et événements de sécurité | Partiel | Messages internes et lecture des priorités du registre local. Aucune notification planifiée ou email externe, aucun contenu classifié transmis. |
| 21 — Web et PWA | Responsive, installation contrôlée, ressources statiques seules en cache | Réalisé local pour le pilote / À valider pour la production | Identité /SIGCP/, icônes, cache de coque seule, installation explicite et aide par appareil conservés ; aucune donnée saisie/API/pièce/export/jeton ajouté au cache. Contrôle topbar et mise à jour confirmée/bloquée en édition, nettoyage des seuls caches SIGCP. Publication et ressources PWA 0.4.0 vérifiées ; cache cc9b9de510c6dda81353, 27 ressources. Test public hors connexion réussi avec réseau/cache HTTP désactivés, 42 dossiers et ressources visibles. Politique institutionnelle à approuver avant usage réel. |
| 22 — IA optionnelle | Module désactivé, supervision humaine, modèles approuvés et protection contre les instructions malveillantes | Non commencé | Aucune fonction IA, aucun appel à un modèle et aucun envoi de document à un service IA. Les décisions officielles ne sont pas automatisées. |
| 23 — Infrastructure | Environnements séparés, réseau, TLS, logs, sauvegardes, PRA/PCA et publication autorisée | Partiel | Démonstration 0.4.0 publiée sur https://propheticpowerfulman.github.io/SIGCP/ au commit be9463cd13cc596ac63e0e4a190b02272a14c223, run 45986496672 réussi ; ressources exactes et MIME vérifiés en HTTP 200. Aucun backend ajouté ; environnements séparés, Docker, segmentation, supervision, sauvegardes/restauration et haute disponibilité non commencés. |
| 24 — DevSecOps | Compilation, tests, analyses, SBOM, artefacts intègres et publication contrôlée | Partiel | PR 4 fusionnée ; validation PR 45985797807/source ea5eccfa et publication main 45986496672/be9463cd13cc596ac63e0e4a190b02272a14c223 réussies. 47 Node, 23 Chromium, audit sans vulnérabilité et typage/build ; un test de captures ignoré. Jobs 140463373730/140463879230, artefact 15191024538. Aucune dépendance ni schéma Mail ajouté. Les contrôles SAST/DAST, secrets, conteneurs, SBOM et protections de branche restent à compléter. |

## Structure et livraison — sections 25 à 30

| Section | Exigence résumée | Statut réel v0.4.0 | Éléments présents et écarts |
| --- | --- | --- | --- |
| 25 — Repository | Structure maintenable, code, tests, infrastructure et documentation utiles | Partiel | Frontend structuré en composants, deux domaines typés, tests et documentation. Pas de répertoires backend factices présentés comme réalisés. Structure Java, migration et infrastructure à ajouter au moment de leur implémentation. |
| 26 — Documentation | Guides français, architecture, API, modèle de menaces, licences et six PDF | Partiel | Documentation Markdown, guides et origine graphique présents ; six captures 0.4.0 figées, PDF final de dix pages/1 251 108 octets rendu et inspecté. API, UML/C4, STRIDE, matrice d’habilitations/ASVS, procédures d’incident/sauvegarde, inventaire complet des licences et six PDF institutionnels restent à produire. Le dossier de revue ne les remplace pas. |
| 27 — Écrans | Trente écrans, formulaires validés, états de chargement/erreur/vide | Partiel | Écrans existants conservés ; recherche globale, émetteur/destinataire, confirmation de doublons, acteurs AP/RC/AV et résumé d’erreurs/focus/hash contrôlés dans les parcours 0.4.0. 23 Chromium CI et six parcours locaux réussis. Aucun écran d’identité/MFA réelle, messagerie institutionnelle ou administration des droits serveur ; aucune couverture globale des trente écrans déduite de ces résultats. |
| 28 — Données de démonstration | Isolement, acteurs/dossiers/documents fictifs, sans secrets ni données historiques | Partiel ; registre réalisé local | 42 courriers, trois institutions, quatre services et des agents fictifs, historiques et fiches synthétiques. Profils AP/RC/AV et acteurs de présentation cohérents ; échanges simulés localement. Aucun email fictif dans un module de messagerie réel. Schéma Mail inchangé. L’isolement est celui du pilote statique, pas une frontière d’accès sécurisée. |
| 29 — Méthode autonome | Analyse, backlog, exécution/correction, preuves et PROJECT_STATUS | Partiel | Analyse et implémentation progressive, tests du domaine, plan technique et suivi. Les contrôles backend, résilience, cybersécurité, performance, PDF et homologation doivent conserver des statuts distincts et ne peuvent être déclarés terminés. |
| 30 — Livraison finale | Code, application, base, identité, habilitations, tests, rapports, PDF et reprise | Partiel | Application frontend exécutable et sources des fonctions effectivement réalisées. Pas de base initialisée, identité réelle, habilitations vérifiées, restauration, migration, rapport de performance serveur ni dossier complet d’homologation. Le master prompt complet n’est pas terminé. |

## Extension nationale et échanges — sections 31 à 40

| Section | Exigence résumée | Statut réel v0.4.0 | Éléments présents et écarts |
| --- | --- | --- | --- |
| 31 — Vision NSEN | Communication interne, interinstitutionnelle et nationale progressive | Partiel / À valider | Parcours d’institutions fictives pour explorer les usages. Aucun raccordement réel ni autorisation automatique d’une institution. Vision et gouvernance nationale à approuver. |
| 32 — Architecture multi-institutionnelle | Espaces indépendants, contexte issu de l’identité, isolation logique/physique et fédération | Non commencé | Un registre navigateur peut contenir plusieurs identifiants fictifs. Cela ne constitue pas un système multitenant sécurisé. Identité authentifiée, bases/schémas/instances séparés, politiques par institution et modèle d’isolation restent à concevoir et tester. |
| 33 — Passerelle ISE | Envoi/réception fiable, signatures, empreintes, preuves, idempotence et reprise | Partiel | Domaine `exchange.ts` pour préparer puis simuler transmission, réception, accusé et reprise d’échec ; idempotence locale testée. Aucune connexion réseau interinstitutionnelle, identité technique, empreinte documentaire, signature ni preuve officielle. |
| 34 — Annuaire national | Institutions vérifiées, capacités, certificats, inscription/suspension/révocation et visibilité | Partiel / À valider | Trois fiches synthétiques et état de connexion indicatif. Aucun référentiel officiel, processus d’admission, certificat X.509 ou administration de révocation. |
| 35 — Profil ISEP | TLS/mTLS, OIDC, PKI, anti-rejeu, OpenAPI/JSON Schema, formats versionnés et livraison fiable | Non commencé | La simulation locale ne met en œuvre aucun protocole d’échange sécurisé. Choix du profil standard, contrats d’API, authentification mutuelle, horodatage, anti-rejeu et garanties de livraison à spécifier puis implémenter. |
| 36 — Confidentialité | Chiffrement, clés propres à chaque institution, habilitations et éventuel bout en bout | Non commencé / À valider | Aucune clé institutionnelle ni donnée classifiée traitée. localStorage n’est pas un stockage chiffré institutionnel. Politique de chiffrement et arbitrages OCR/recherche/antivirus/archivage/récupération des clés à approuver. |
| 37 — Trust & Signature | Signatures et cachets vérifiables, certificats, horodatage et conservation des preuves | Non commencé / À valider | Aucun PAdES/XAdES/CAdES, PKI, RFC 3161, cachet ou signature officielle. Cadre juridique applicable et prestataire de confiance à faire valider ; aucune qualification juridique revendiquée. |
| 38 — Workflow interinstitutionnel | Validation/signature, contrôle d’autorisation, réception locale, réponse et confidentialité interne | Partiel | Étapes techniques de transmission et réception administrative distinguées dans la simulation. Le circuit complet à seize étapes, les signatures, contrôles serveurs, réponses officielles et frontières de confidentialité ne sont pas implémentés. |
| 39 — Tests interinstitutionnels | Isolation, identités, certificats, rejeu, intégrité, résilience et non-divulgation | Partiel | Tests unitaires sur admissibilité fictive, idempotence, reprises et chargement des scénarios. Ils ne prouvent pas l’isolation de bases, le refus d’accès serveur, la validité d’un certificat, une signature ou la résistance à la compromission. Tests serveur et rapport de sécurité interinstitutionnel non commencés. |
| 40 — Écrans et livrables nationaux | Annuaire, échange, accusés, confiance, supervision, six PDF et déploiement en six phases | Partiel / À valider | Écran réseau, partenaires et suivi fictif. Pas d’administration PKI, gouvernance nationale, audit protégé, centre de vérification de signatures ni tableaux nationaux autorisés. Six PDF nationaux absents. Chaque phase d’extension reste conditionnée aux validations métier, techniques, juridiques et sécuritaires. |

## Écarts technologiques explicites

| Exigence | État dans le dépôt frontend |
| --- | --- |
| React, TypeScript strict, Vite, Lucide | Intégrés. |
| Bibliothèque de composants accessibles | Composants locaux et `<dialog>` natif ; audit d’accessibilité complet à effectuer. |
| Tailwind CSS, TanStack Query, TanStack Table, React Hook Form, Zod | Non intégrés à cette livraison ; CSS et logique de formulaire/tableau locaux. La conformité à ces choix obligatoires du master reste ouverte. TanStack Query devra être évalué au raccordement API. |
| Recharts ou Apache ECharts | Non intégrés ; graphiques locaux basés sur les statistiques calculées. |
| Playwright | Version 0.4.0 : 23 parcours Chromium réussis en CI, un test de captures conditionnel ignoré ; six parcours également réussis localement, sans additionner les suites. Résultats antérieurs historiques. |
| Java 25/Spring Boot, Spring Security/JPA, Hibernate, Bean Validation, Flyway, Maven Wrapper, OpenAPI, JUnit/Testcontainers | Aucun backend livré. Versions exactes, maintenance et compatibilité à vérifier au démarrage du chantier serveur. |
| PostgreSQL, stockage S3, OIDC/Keycloak, antivirus, gestion des clés, Docker, NGINX, observabilité | Non déployés. Redis/Valkey, OpenSearch et Kubernetes restent des choix conditionnels à justifier, conformément au master. |

## Références de code et preuves disponibles

Les chemins ci-dessous sont relatifs à la racine du dépôt.

| Fonction | Fichiers de référence | Nature de la preuve |
| --- | --- | --- |
| Modèle, données synthétiques, règles métier, recherche, pagination, statistiques et CSV | `src/domain.ts`, `tests/domain.test.mjs` | Tests unitaires du domaine frontend ; aucune autorisation serveur implicite. |
| Création et retours de validation | `src/CreateForm.tsx`, `src/Detail.tsx` | Formulaires et UI reliés aux règles du domaine local. |
| Registre, filtres et états vides | `src/Register.tsx` | Table ordinateur/MailCards conservées ; parcours de recherche, saisie et doublons 0.4.0 réussis. |
| Tableau de bord et analyses | `src/Insights.tsx` | Indicateurs et graphiques calculés, sans volumes institutionnels réels. |
| Échanges locaux | `src/exchange.ts`, `src/Network.tsx`, `tests/exchange.test.mjs` | Simulation, contrôles de cohérence et idempotence locale. |
| Navigation, stockage et éléments communs | `src/main.tsx`, `src/ui.tsx`, `src/style.css`, `src/scrollbars.css` | Recherche globale et adaptations tactiles contrôlées ; thème/contrastes revus sur six configurations et 53 états. Données locales modifiables ; schéma Mail inchangé. |
| Entrée et session de présentation | `src/Login.tsx`, `src/login.css`, `src/demo-session.ts` | Profils AP/RC/AV et acteurs fictifs cohérents ; aucune authentification ou habilitation serveur. |
| Identité visuelle | `public/brand/`, `src/style.css`, `src/login.css` | Emblème fourni et icônes dérivées ; aucune homologation implicite. |
| PWA et cache statique | `public/manifest.webmanifest`, `src/pwa.ts`, `src/InstallPrompt.tsx`, `scripts/build-pwa.mjs`, `tests/pwa.test.mjs` | Manifeste/ressources publics et cache cc9b9de510c6dda81353 de 27 ressources vérifiés. Test hors connexion public réussi, scénario 25,0 s / exécution 1,0 min, code de sortie 0. |
| Parcours navigateur | `tests/e2e.spec.ts`, `tests/pwa-login.spec.ts`, `playwright.config.ts`, `docs/screenshots/` | 23 Chromium CI et six parcours locaux réussis ; revue visuelle et six captures v04-* figées. Un test public hors connexion distinct réussi. |
| Dossier de revue du pilote | `docs/IMPERIUM_RDC_Dossier_Revue_Pilote.pdf` | Version 0.4.0 : dix pages, 1 251 108 octets ; rendu et inspection des dix pages sans défaut constaté. Il ne remplace pas les douze livrables institutionnels. |
| Construction et publication | `package.json`, `package-lock.json`, `.github/workflows/pages.yml` | Run main 45986496672 réussi au commit be9463cd13cc596ac63e0e4a190b02272a14c223 ; 47 Node, 23 Chromium, audit/typage/build et ressources exactes confirmés. |
| Suivi | `PROJECT_STATUS.md`, `docs/TECHNICAL_PLAN.md` | État, limitations et décisions ; à mettre à jour avec les résultats réellement obtenus. |

Les tests du domaine local ont été exécutés lors de son implémentation (16 tests réussis). Aucun résultat de test serveur, de scan de cybersécurité, d’audit indépendant ou de performance représentative n’est déduit de ce résultat. Les résultats consolidés les plus récents appartiennent au rapport de livraison.

## Inventaire des douze PDF demandés

Ces douze documents ne sont pas fournis par la livraison frontend v0.4.0. Des fichiers Markdown ou l’export CSV ne les remplacent pas. L’emblème fourni est intégré au pilote ; la préparation des PDF nécessite encore une charte validée, des captures propres à la version documentée et des résultats techniques vérifiables.

| Référence | Livrable | Statut |
| --- | --- | --- |
| §26 | `IMPERIUM_RDC_Dossier_Presentation_Projet.pdf` | Non commencé |
| §26 | `IMPERIUM_RDC_Dossier_Architecture_Technique.pdf` | Non commencé |
| §26 | `IMPERIUM_RDC_Guide_Utilisateur_Illustre.pdf` | Non commencé |
| §26 | `IMPERIUM_RDC_Rapport_Cybersecurite.pdf` | Non commencé |
| §26 | `IMPERIUM_RDC_Strategie_Migration_PHP.pdf` | Non commencé |
| §26 | `IMPERIUM_RDC_Guide_Administration_Deploiement.pdf` | Non commencé |
| §40 | `IMPERIUM_RDC_Vision_Nationale.pdf` | Non commencé |
| §40 | `IMPERIUM_RDC_Architecture_Multi_Institutionnelle.pdf` | Non commencé |
| §40 | `IMPERIUM_RDC_Protocole_Echange_Securise.pdf` | Non commencé |
| §40 | `IMPERIUM_RDC_Guide_Integration_Institutions.pdf` | Non commencé |
| §§39–40 | `IMPERIUM_RDC_Interinstitutional_Security_Assessment.pdf` | Non commencé |
| §40 | `IMPERIUM_RDC_Strategie_Deploiement_National.pdf` | Non commencé |

Un rapport de sécurité ne pourra revendiquer que des analyses réellement exécutées. Les fonctions futures devront apparaître comme proposées, et les contrôles non exécutés comme tels.

## Backlog priorisé après la revue du pilote

| Priorité | Travail | Critère de sortie |
| --- | --- | --- |
| P0 | Faire valider les parcours, règles de numérotation, classifications, responsabilités et charte | Décisions métier documentées et versions approuvées, sans déduire l’organigramme réel des exemples. |
| P0 — réalisé pour le pilote 0.4.0 | Recette de la démonstration et publication Pages | Version 0.4.0 : 47 Node/23 Chromium, audit/typage/build et publication réussis ; six parcours locaux, revue visuelle, six captures, hors connexion public et PDF final confirmés. Les succès antérieurs restent historiques. |
| P1 | Initialiser le backend Java 25/Spring Boot et PostgreSQL/Flyway | Démarrage local reproductible, migrations vérifiées et contrats OpenAPI ; tests JUnit/Testcontainers. |
| P1 | Implémenter BFF OIDC, MFA institutionnelle et RBAC/ABAC | Identité et contexte institutionnel établis côté serveur ; tests négatifs d’accès et révocation réussis. |
| P1 | Refaire numérotation, workflow et audit dans des transactions serveur | Concurrence, idempotence, outbox et séparation des tâches testées ; journal d’audit protégé. |
| P1 | Réaliser GED privée, quarantaine et contrôles de consultation | Fichiers non publics, autorisation à chaque accès, antivirus et règles de conservation testés. |
| P2 | Ajouter recherche API, rapports PDF/Excel et notifications | Pagination/index mesurés, filtres d’habilitation appliqués aux résultats, compteurs et exports. |
| P2 | Intégrer messagerie de test et ISE entre institutions fictives isolées | Contrats versionnés, authentification mutuelle, anti-rejeu, reprise et reçus testés ; aucune institution réelle ciblée. |
| P2 | Exécuter les analyses de sécurité et les tests de résilience/charge | Rapports d’exécution, corrections vérifiées, limites et risques résiduels explicites ; sauvegarde/restauration testées. |
| P2 | Préparer la migration à blanc | Inventaire autorisé, mappings et import idempotent, réconciliation exhaustive et retour arrière démontré. |
| P3 | Produire les douze PDF et le dossier d’homologation | Documents cohérents avec les fonctions et preuves réalisées ; emblème autorisé ; guides illustrés par captures réelles. |
| P3 | Étendre le déploiement institutionnel puis national | Validation fonctionnelle, technique, juridique et sécuritaire propre à chaque phase. |

## Décisions et validations institutionnelles nécessaires

- Emblème fourni par le concepteur et intégré au pilote ; validation institutionnelle de la palette, de l’identité graphique et des conditions d’usage avant production.
- Mandat du pilote, responsables métier, propriétaire opérationnel, cadre de propriété intellectuelle et procédure d’homologation.
- Organigramme officiel, rôles, délégations, classifications, règles de besoin d’en connaître et séparation des tâches.
- Formats de références, circuits par catégorie de courrier, autorité de signature, délais de service et modes de traitement des exceptions.
- Durées de conservation, gels documentaires, journalisation, droit de consultation/téléchargement et règles de restitution.
- IAM institutionnel, MFA, annuaire technique, PKI/prestataire de confiance, politique de clés et valeur juridique des signatures/cachets.
- Choix d’hébergement autorisé et modèle d’isolation par institution ; objectifs de reprise, disponibilité et sauvegarde/restauration.
- Autorisation de découverte du système historique, périmètre en lecture seule, responsables des mappings et procédure de basculement.
- Conditions d’admission, de suspension et de révocation des partenaires ; catégories et indicateurs partageables ; gouvernance du réseau national.
- Politique PWA/hors ligne de production à valider : le pilote limite déjà le cache aux ressources statiques connues. Éventuel module IA : fonctions permises et services institutionnellement approuvés.

Les corrections sont d’abord revues dans la démonstration, conformément à la demande du concepteur. Cette règle ne transforme pas GitHub Pages en infrastructure de production et ne dispense pas des validations avant migration.
