# Installer et utiliser IMPERIUM RDC — pilote PWA v0.4.0

Guide actualisé le 27 novembre 2026. Édition **0.4.0 validée et publiée**. Les preuves de publication 0.3.1 et 0.3 conservées plus bas restent historiques.

Adresse : [IMPERIUM RDC / SIGCP](https://propheticpowerfulman.github.io/SIGCP/).

La PWA fournit un accès web et, lorsque le navigateur le permet, une icône et une fenêtre d’application. Le pilote ne collecte pas de mot de passe institutionnel. L’entrée par profil est une démonstration locale ; elle n’est ni une authentification OIDC/MFA, ni une habilitation serveur.

La [CI main 0.4.0](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45986496672), révision `be9463cd13cc596ac63e0e4a190b02272a14c223`, a réussi : 47 tests Node, 23 parcours Chromium, un scénario de captures conditionnel ignoré, audit npm à zéro, typage et construction stricte réussis. La publication a été vérifiée en HTTP 200 pour la page, les deux bundles exacts, le manifeste, le service worker, les icônes et l’emblème. Ces contrôles confirment la version publiée ; ils ne constituent pas une installation native effectuée sur chaque appareil ou navigateur.

Historique 0.3.1 : la [CI main 0.3.1](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45886138008), source `1bee9bf2f77728652758725e404b1aaa1ca68475`, a réussi : 32 tests Node, 19 parcours Chromium, un scénario de captures ignoré, audit npm à zéro et construction stricte réussie. La publication de cette révision a été vérifiée en HTTP 200 pour la page, les bundles attendus, le manifeste, le service worker, l’icône 512 et l’emblème. Ces preuves concernent le pilote web/PWA ; elles ne constituent pas une installation native exécutée sur toutes les plateformes.

Historique distinct : la version publiée v0.3 a été contrôlée le 26 novembre 2026 : accès HTTPS, manifeste, service worker et icônes attendus accessibles. La [CI de publication](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45881652536) est réussie. Cette vérification historique ne constitue pas la recette de la v0.4.0 et ne garantit pas une installation native sur chaque appareil ; utilisez la procédure adaptée ci-dessous.

## Depuis le bouton de l’application

1. Ouvrir la version publiée en ligne sur l’appareil concerné.
2. Choisir **Installer l’application**, sur la page d’entrée ou dans l’espace du pilote.
3. Si le navigateur a fourni une proposition native d’installation, lire puis confirmer sa fenêtre système. Le choix peut aussi être annulé.
4. Sans proposition native disponible, le bouton ouvre un guide correspondant à l’appareil ; suivre la procédure manuelle ci-dessous. Ce guide ne signifie pas que l’application est déjà installée.

Le mécanisme de proposition programmatique dépend de l’événement du navigateur ; il n’est pas universel, notamment sur iOS. Le site reste utilisable dans un onglet lorsque l’installation n’est pas proposée. [MDN : conditions d’installation et proposition native](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).

## Choisir la procédure adaptée

| Appareil | Procédure à essayer | Résultat à vérifier |
| --- | --- | --- |
| Windows, macOS ou Linux avec Chrome | Icône Installer dans la barre d’adresse, si présente ; sinon menu du navigateur, puis la commande d’installation de la page comme application. Confirmer la fenêtre proposée. | Lancer IMPERIUM RDC depuis l’icône créée. [Aide Chrome](https://support.google.com/chrome/answer/9658361?hl=fr). |
| Ordinateur avec Edge | Utiliser l’icône d’installation ou la commande d’installation du menu, puis confirmer. | Vérifier l’ouverture dédiée. Les libellés varient selon la version. [MDN : installation des applications web](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing). |
| Android avec Chrome | Ouvrir le menu puis **Installer l’application** ou **Ajouter à l’écran d’accueil**, selon ce que le navigateur propose. | Vérifier l’icône et son lancement ; le type d’intégration dépend de l’appareil et du navigateur. [MDN : différences de prise en charge](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable). |
| iPhone ou iPad | Ouvrir le site dans Safari, puis **Partager** et **Ajouter à l’écran d’accueil**. Confirmer le nom ; choisir l’ouverture comme app si cette option est proposée. | Ouvrir l’icône ajoutée. [MDN : installation sur écran d’accueil](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing). |
| Mac avec Safari | Sur macOS Sonoma ou ultérieur, menu **Fichier**, puis **Ajouter au Dock**. | Vérifier l’icône dans le Dock. Sur un système plus ancien, utiliser l’accès web ou un navigateur compatible. [MDN : prise en charge Safari](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable). |
| Navigateur sans installation proposée | Conserver l’accès web et éventuellement un favori ; essayer Chrome ou Edge si l’installation est souhaitée. | Ne pas confondre un favori avec une installation native. [MDN : installation et raccourcis](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing). |

L’installation n’a pas été démontrée sur chaque combinaison de système et de navigateur. Les étapes ci-dessus décrivent les voies usuelles ; les résultats réellement exécutés sur le pilote doivent figurer dans le rapport de validation.

## Prendre en main le pilote sur petit écran

Sur téléphone, l’accès par profil passe au premier plan. Dans l’espace du pilote, utiliser la navigation rapide inférieure pour les destinations présentes, et le menu complet pour le reste. Les cartes de courrier facilitent la lecture et l’ouverture d’un dossier sans dépendre d’un grand tableau horizontal.

Sur tablette, le rail latéral compact est prévu par défaut ; le développer pour lire les libellés puis le rétracter afin de donner plus de place aux dossiers. Les commandes principales et l’espacement des formulaires sont adaptés au toucher. La recette couvre les tailles et parcours tactiles documentés ; répéter néanmoins la présentation sur l’appareil effectivement utilisé.

Dans une fenêtre longue, faire défiler le contenu jusqu’aux actions. Les barres assorties bleu nuit/or dépendent des possibilités du navigateur et du système ; elles conservent leur fonction habituelle. Si le clavier masque une commande, continuer le défilement du formulaire et vérifier les valeurs avant de valider.

Ces améliorations concernent la présentation et la navigation ; elles ne modifient ni la portée du profil fictif, ni les garanties d’accès, ni le stockage local du pilote.

## Repères de saisie et de recherche en 0.4.0

La commande de recherche globale de l’en-tête est accessible au toucher. Sur un appareil avec clavier, `Ctrl K` ou `Cmd K` ouvre la même fenêtre depuis les rubriques ; fermer d’abord une autre fenêtre ou un formulaire en cours. La recherche concerne les métadonnées des courriers fictifs de ce navigateur, sans indexer de pièce jointe réelle.

Lors de la préparation d’un courrier sortant, distinguer **Institution propriétaire du dossier** et **Choisir une institution destinataire**. Choisir un destinataire ne change pas l’émetteur. Un texte libre saisi reste conservé tant qu’un remplacement explicite n’a pas été demandé.

Un avertissement de doublon possible ne doit pas être confondu avec un échec de stockage. Comparer les dossiers signalés, puis cocher la confirmation et utiliser **Confirmer et enregistrer** seulement si un nouveau courrier distinct doit être conservé. Le profil utilisé reste un acteur fictif local ; aucun mot de passe institutionnel ni droit serveur n’est ajouté.

## Préparer le mode hors connexion

La PWA doit d’abord être ouverte **en ligne** dans sa version de production. Le service worker de ce projet est enregistré dans le périmètre `/SIGCP/` sur un contexte sécurisé. Le serveur de développement ne constitue pas la preuve de la préparation hors ligne.

Après préparation réussie, la coque statique permet de rouvrir le pilote sans réseau. Les données de démonstration déjà enregistrées restent locales au navigateur. Le profil fictif peut être redemandé à l’ouverture d’une nouvelle fenêtre ; aucun mot de passe réel ne doit être saisi. Une première visite sans réseau, un cache incomplet, une navigation privée ou l’effacement des données peuvent empêcher ce fonctionnement.

Pour une répétition : ouvrir le pilote en ligne, laisser terminer le chargement, fermer les formulaires, couper temporairement le réseau, rouvrir le pilote sur le même appareil, puis rétablir le réseau. Ne pas effectuer cette démonstration sur des données réelles.

## Ce que le service worker de SIGCP met en cache

La politique du projet limite le précache aux ressources statiques autorisées de la version construite : entrée HTML, manifeste, bundles CSS/JavaScript, polices et images/icônes de la coque.

Les requêtes avec autorisation, les URL d’authentification, API, fichiers, exports et documents métier ne sont pas ajoutées au cache du service worker. Les listes de courriers et journaux fictifs sont conservées par l’application dans le navigateur ; cette conservation locale est distincte du cache de ressources.

Ces règles appartiennent au pilote et doivent être revues avant toute connexion à un serveur institutionnel. Le mode hors ligne ne constitue pas une garantie de confidentialité, de synchronisation ou de conservation réglementaire. Références du dépôt : `scripts/build-pwa.mjs`, `src/pwa.ts`, `src/InstallPrompt.tsx`, `tests/pwa.test.mjs`.

## Appliquer une mise à jour

Quand **Nouvelle version** apparaît, enregistrer ou fermer les formulaires en cours, puis confirmer l’actualisation. La mise à jour recharge l’interface. Les dossiers fictifs effectivement enregistrés sont censés rester dans le stockage du même navigateur ; ils ne sont pas répliqués dans un serveur de production.

Si la nouvelle version n’est plus en attente, revenir en ligne et rouvrir le pilote. Ne pas effacer les données du site sans avoir décidé de remplacer les exemples locaux.

## Si l’installation ou le hors-ligne ne fonctionne pas

- Ouvrir le lien HTTPS complet et attendre le chargement en ligne ; éviter un fichier HTML ouvert directement depuis le disque. [MDN : contexte nécessaire à l’installation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).
- Vérifier si l’application est déjà installée dans le navigateur utilisé. Une installation dans un autre navigateur ne partage pas automatiquement ses données locales. [MDN : installation et environnement du navigateur](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing).
- Utiliser la procédure manuelle si le bouton ne reçoit pas de proposition native ; l’absence de cette proposition n’est pas une erreur de saisie.
- Si l’application signale l’échec de préparation hors connexion, rétablir le réseau et rouvrir la version publiée ; continuer dans l’onglet en ligne si nécessaire.
- Pour la présentation, garder les captures réelles et le dossier PDF local comme solution de secours.

## Désinstallation et données locales

Utiliser les commandes de gestion d’applications du navigateur ou du système. Lire la confirmation avant d’effacer également les données du site, car cela peut supprimer les exemples conservés. L’application web reste accessible à son URL après désinstallation. [Aide Chrome : gestion et suppression d’une application web](https://support.google.com/chrome/answer/9658361?hl=fr).

## Limites du pilote

Aucune authentification institutionnelle réelle, synchronisation serveur, habilitation RBAC/ABAC, signature officielle, GED privée ou messagerie de production n’est fournie. La PWA améliore l’accès à la démonstration ; elle ne transforme pas GitHub Pages en infrastructure institutionnelle.

Initiateur et concepteur : **LOKALA LOMBOTO Jonathan**. Proposition technique non homologuée, exclusivement destinée aux données fictives.
