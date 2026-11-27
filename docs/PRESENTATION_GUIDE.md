# Guide de présentation — IMPERIUM RDC / SIGCP v0.4.0

Présentation du **vendredi 27 novembre 2026**, heure de Lagos (UTC+1).

Édition **0.4.0 validée et publiée**. Les contrôles de cette édition sont détaillés ci-dessous : 47 tests Node, 23 parcours Chromium et publication vérifiée. Les bilans v0.3.1 et v0.3 conservés ensuite restent historiques.

Initiateur et concepteur : **LOKALA LOMBOTO Jonathan**.

Objectif : présenter en cinq minutes le parcours d’un courrier, l’identité visuelle et l’accès sous forme d’application installable, puis distinguer clairement le pilote et la future plateforme institutionnelle.

Adresse : [Ouvrir IMPERIUM RDC](https://propheticpowerfulman.github.io/SIGCP/).

## Message d’ouverture

> « IMPERIUM RDC organise les correspondances et rend chaque étape de traitement lisible. Cette démonstration utilise exclusivement des données fictives. Elle sert à valider les usages avant le raccordement à une infrastructure institutionnelle approuvée. »

L’emblème présenté est le fichier fourni et autorisé par le concepteur. Son affichage ne signifie pas que l’application a reçu une homologation institutionnelle.

## Préparation avant la séance

1. Ouvrir la version publiée en ligne dans Chrome ou Edge sur l’ordinateur de présentation et vérifier son numéro de version. Éviter une fenêtre privée pour que les dossiers fictifs puissent être conservés normalement.
2. Vérifier l’affichage de l’emblème, de la page d’entrée, du tableau de bord et du contrôle d’installation. Attendre le chargement de la coque de l’application avant toute démonstration hors connexion.
3. Se familiariser avec les trois profils fictifs : **Agent pilote**, **Responsable du courrier**, **Autorité de validation**. Ils personnalisent le parcours d’entrée ; ils ne créent aucun droit de sécurité.
4. Préparer un registre de démonstration connu. Une réinitialisation remplace les modifications locales : ne la faire qu’avant la séance, après avoir conservé tout exemple utile.
5. Vérifier un courrier sortant validé ou expédié et un partenaire fictif connecté pour le parcours d’échange. Ne pas commencer cette séquence avec un courrier entrant ou une institution signalée indisponible.
6. Préparer la connexion Internet, un affichage lisible, la démonstration mobile si disponible et une copie du dossier de revue illustré. Conserver les guides et captures réelles localement en solution de secours.
7. Si une mise à jour est proposée, terminer les formulaires, l’appliquer avant la présentation et refaire un passage rapide sur le parcours.

## Déroulé de cinq minutes

| Temps | Action à montrer | Message à faire passer |
| --- | --- | --- |
| 00:00–00:25 | Page d’entrée, emblème, profil **Agent pilote**, puis **Ouvrir la démonstration** | « L’identité visuelle est institutionnelle. L’entrée actuelle est une session de démonstration, sans mot de passe réel. » |
| 00:25–01:00 | Tableau de bord : volume, dossiers actifs et échéances ; ouvrir la recherche globale avec Ctrl K ou la commande de recherche | « Les indicateurs et la recherche portent sur les dossiers fictifs de ce navigateur. Le mode clair adouci et la navigation restent adaptés à l’écran. » |
| 01:00–01:45 | **Nouveau courrier** : créer l’exemple ci-dessous | « Le propriétaire du dossier reste distinct du destinataire. La saisie est validée et un doublon possible demande une confirmation explicite. » |
| 01:45–02:30 | Dans la fiche : affecter, passer en traitement, soumettre en validation ; ouvrir l’évolution | « Le circuit rend visibles les étapes franchies et l’historique. Il refuse les sauts d’étapes dans le pilote. » |
| 02:30–02:55 | Valider puis archiver le courrier entrant | « La clôture du parcours se retrouve dans le registre et les indicateurs. Il s’agit d’une validation fictive locale, sans signature officielle. » |
| 02:55–03:45 | **Réseau institutionnel** : courrier sortant éligible, partenaire fictif, préparation puis progression | « Une transmission technique, une réception administrative et un accusé de réception sont trois états différents. Ici, ils sont simulés. » |
| 03:45–04:20 | **Installer l’application** ; accepter si le navigateur propose l’installation, sinon ouvrir le guide adapté | « Une icône dédiée permet de retrouver l’espace. Le mode d’installation dépend du navigateur et de l’appareil. » |
| 04:20–04:45 | Sur l’appareil préparé, couper temporairement la connexion puis rouvrir l’application ; rétablir le réseau | « La coque statique déjà chargée reste disponible hors connexion. Les dossiers fictifs restent locaux ; aucun serveur institutionnel n’est synchronisé. » |
| 04:45–05:00 | Conclusion et prochaine étape | « Après validation des usages : backend Java/Spring, base PostgreSQL, identité OIDC/MFA, habilitations serveur et GED privée. L’extension nationale se fera par phases autorisées. » |

Si l’installation ou la confirmation système prend trop de temps, montrer le guide et garder le parcours métier comme priorité de la présentation.

## Nouveautés de la revue 0.4.0

- **Recherche globale.** Depuis les rubriques de l’espace de démonstration, utiliser la commande **Ouvrir la recherche globale**, `Ctrl K` ou `Cmd K` sur Mac. Saisir une référence ou plusieurs mots des métadonnées, puis ouvrir une fiche. `Tab` parcourt les résultats, `Entrée` ouvre le résultat choisi et `Échap` ferme la fenêtre. Fermer d’abord une autre fenêtre ou un formulaire : la recherche ne superpose pas une seconde fenêtre à la saisie en cours.
- **Institutions explicites.** Le champ **Institution propriétaire du dossier** représente l’émetteur d’un échange sortant. **Choisir une institution destinataire** est une aide distincte qui ne change pas ce propriétaire. Le nom libre déjà saisi est conservé ; **Utiliser ce destinataire** permet son remplacement volontaire si un autre choix est proposé.
- **Doublons possibles.** Les courriers partageant l’objet, l’expéditeur, la date et le type après normalisation déclenchent un avertissement avec leurs références. Comparer les dossiers avant de cocher **Je confirme qu’il s’agit d’un courrier distinct.**, puis choisir **Confirmer et enregistrer**. Aucune création ne doit précéder cette confirmation. Des objets identiques ne sont pas interdits arbitrairement ; l’avertissement aide à décider.
- **Erreurs de formulaire.** Les liens du résumé d’erreurs focalisent le champ à corriger et le ramènent dans la zone visible, sans changer de rubrique ni perdre le formulaire.
- **Profils cohérents.** Le profil fictif choisi se retrouve dans l’acteur des créations, transitions et événements présentés. Cette cohérence de démonstration n’ajoute aucune authentification ou habilitation serveur.
- **Lecture plus douce.** Le thème clair utilise des surfaces moins éclatantes. Vérifier le confort de lecture sur l’écran de présentation ; aucune certification d’accessibilité n’est déduite de ce changement visuel.

Pour illustrer l’avertissement de doublon pendant les questions, reprendre volontairement un exemple déjà enregistré. Montrer d’abord l’absence de nouvelle création, puis la comparaison des références. Ne confirmer que si l’on souhaite réellement conserver un second exemple fictif distinct. Une modification des champs ou des dossiers correspondants demande une nouvelle confirmation.

## Astuces pour téléphone et tablette

- **Téléphone : commencer par l’accès.** Sur petit écran, la zone de profil doit arriver avant la présentation longue du projet. Choisir le profil puis ouvrir la démonstration ; aucun mot de passe réel ne doit être saisi.
- **Navigation rapide en bas.** Utiliser les destinations affichées dans la barre inférieure. Pour les autres fonctions, ouvrir le menu complet. Vérifier la destination active avant de poursuivre la présentation.
- **Courriers sous forme de cartes.** Sur les petits écrans, parcourir les cartes plutôt que chercher les colonnes d’un grand tableau. Toucher le dossier pour voir son détail, sa priorité, son échéance et son évolution. Si la recherche ne donne rien, effacer les filtres avant de changer de registre.
- **Tablette : rail compact.** Le menu latéral compact laisse davantage de place au contenu. Développer le menu pour retrouver les libellés, puis le rétracter pour présenter une fiche ou un registre.
- **Saisie tactile.** Utiliser les commandes principales suffisamment espacées. Quand le clavier est ouvert, faire défiler le formulaire pour retrouver le champ ou la validation ; vérifier l’échéance avant d’enregistrer.
- **Fiches et fenêtres longues.** Faire défiler leur contenu jusqu’aux actions de fin. Fermer la fenêtre avec sa commande dédiée avant de changer de destination.
- **Défilement assorti.** Les barres de défilement reprennent la palette bleu nuit et or lorsque le navigateur permet ce rendu. Leur visibilité reste adaptée au système ; une barre discrète n’empêche pas le geste de défilement.
- **Installation.** Préparer l’appareil en ligne puis utiliser la commande Installer ou son guide adapté. La présentation tactile ne doit pas devenir une promesse d’installation native sur tous les appareils.

Pour la répétition mobile, refaire au minimum : accès, ouverture d’une carte courrier, recherche/filtre, création, détail/chronologie, fermeture d’une fenêtre et retour au tableau de bord. Sur tablette, vérifier le passage rail compact/menu développé et les orientations utiles à la séance. Les dimensions réellement testées doivent être consignées dans le rapport de validation.

## Exemple de courrier à préparer

| Champ | Exemple exclusivement fictif |
| --- | --- |
| Type | Courrier entrant |
| Objet | Note pilote de coordination documentaire - présentation |
| Expéditeur | Institution partenaire B |
| Destinataire | Espace pilote IMPERIUM RDC |
| Service | Direction numérique pilote |
| Agent | Agent pilote A |
| Priorité | Haute |
| Réception | Date du jour de la présentation |
| Échéance | Sept jours après la réception |
| Observations | Exemple fictif destiné à la revue des usages du 27 novembre 2026. |

Conserver la référence `DEMO/...` affichée après enregistrement pour retrouver rapidement le dossier. La référence est locale au navigateur ; elle n’est pas une référence administrative officielle.

## Ce qu’il faut dire avec précision

| Sujet | Formulation exacte pour le pilote |
| --- | --- |
| Page d’entrée | « Profils de démonstration ; identité institutionnelle à intégrer. » |
| Validation | « Transition de traitement fictive ; aucune décision ni signature officielle. » |
| Échanges | « Simulation des étapes ; aucune transmission à une institution réelle. » |
| Documents | « Fiches documentaires synthétiques ; aucune pièce institutionnelle réelle hébergée. » |
| Hors connexion | « Coque statique préparée en ligne ; données fictives conservées dans ce navigateur. » |
| Sécurité | « Contrôles frontend vérifiés dans le périmètre exécuté ; authentification, autorisation et audit serveur restent à développer. » |
| Résultats des tests | Citer uniquement les résultats de l’édition présentée, avec leur révision : 47 tests Node et 23 parcours Chromium réussis pour la 0.4.0, avec un scénario de captures conditionnel ignoré. Les bilans 0.3.1/0.3 restent historiques. |

## Contrôles vérifiés et publication de la v0.4.0

Le [workflow push main 45986496672](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45986496672), révision `be9463cd13cc596ac63e0e4a190b02272a14c223`, a réussi : **47 tests Node et 23 parcours Chromium réussis**, un scénario de captures conditionnel ignoré, audit npm à zéro vulnérabilité signalée, typage et compilation de production réussis. Six parcours locaux ciblés supplémentaires ont réussi.

Les tâches build et deploy du run main sont toutes deux réussies. La version publique a été vérifiée en HTTP 200 avec `index-DRwZDCfA.js`, `index-CF7AcEUd.css`, son manifeste, son service worker, ses icônes et l’emblème attendu. Le cache statique de la version est identifié par `cc9b9de510c6dda81353`, avec 27 ressources et aucune donnée métier ajoutée au cache.

La revue couvre **53 états sur 6 formats/thèmes**. Sur les 1 407 textes dont le fond est calculable automatiquement, aucun échec mesuré n’a été relevé et le minimum ordinaire observé est **5,038:1**. Les gradients ont fait l’objet d’une revue visuelle manuelle ; ce bilan ciblé ne constitue ni une certification WCAG ni une validation de tous les appareils physiques.

Les quatre captures documentaires v0.4 sont réelles et figées : entrée, tableau de bord sur ordinateur et au format tablette, registre au format téléphone. Les résultats n’établissent pas l’existence de l’identité OIDC/MFA, des habilitations serveur ou de la messagerie institutionnelle, qui restent hors du pilote.

## Historique vérifié de la v0.3.1 — distinct de la recette v0.4.0

Le [workflow main 45886138008](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45886138008), révision `1bee9bf2f77728652758725e404b1aaa1ca68475`, a réussi : **32 tests Node et 19 parcours Chromium réussis**, un scénario de captures conditionnel ignoré, audit npm à zéro vulnérabilité signalée, typage et compilation de production réussis.

Les tâches build et deploy sont toutes deux réussies. La version publique a été contrôlée en HTTP 200 avec ses ressources exactes `index-CA1h1BLN.js` et `index-BctLyuSp.css`, son manifeste, son service worker et son emblème. Le contrôle PWA confirme le cache statique de la version, sans données métier ajoutées au cache.

Les captures finales illustrent l’entrée, le tableau de bord sur ordinateur et tablette, ainsi que les cartes du registre sur téléphone. La recette inclut les parcours tactiles ; elle ne vaut pas démonstration d’une installation native sur chaque appareil réel ni validation de services institutionnels encore absents.

## Historique vérifié de la v0.3 — distinct de la recette v0.4.0

La [CI v0.3, exécution 45881470660](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45881470660) a réussi sur la révision `f6e2175875ddfc3d921db8e0275f192a48445ffb` : **32 tests Node et 17 parcours Chromium réussis**, un scénario de capture conditionnel ignoré, typage strict et compilation réussis, audit npm à zéro vulnérabilité signalée.

Ces résultats portent sur le pilote frontend, ses règles locales et ses parcours navigateur. Ils ne prouvent ni authentification serveur, ni signature officielle, ni conformité de production, ni installation native sur toutes les combinaisons d’appareils. La publication v0.3 a été vérifiée séparément : [déploiement 45881652536](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45881652536), réponse HTTP 200, ressources de la version, manifeste et service worker attendus accessibles. Révision publiée : `b8688b1d9e53008efb6d453563d289d5a0d0d58e`.

## Réponses aux questions probables

**Est-ce déjà connecté à la Présidence ?** Aucun annuaire ni système institutionnel réel n’est raccordé à ce pilote. L’emblème fourni sert à la présentation autorisée du projet.

**Les profils garantissent-ils les habilitations ?** Non. Les profils d’entrée sont fictifs. Le refus d’accès selon rôle, service et classification devra être contrôlé côté serveur après intégration de l’identité institutionnelle.

**Pourquoi l’application fonctionne-t-elle sans réseau ?** Une coque composée des ressources statiques approuvées peut être préparée en ligne. Les dossiers de démonstration restent dans le stockage local du navigateur ; les pièces jointes, jetons et futures réponses d’API sensibles ne doivent pas être placés dans le cache du service worker.

**Les données se retrouvent-elles sur un autre appareil ?** Aucune synchronisation de production n’existe. Un autre appareil ou navigateur possède son propre environnement local. Préparer séparément chaque appareil utilisé pendant la séance.

**Peut-on installer sur tous les appareils ?** L’accès web reste disponible sur les navigateurs compatibles. La proposition d’installation, la fenêtre autonome et la commande système diffèrent selon le navigateur et le système. Voir [le guide d’installation](PWA_INSTALLATION.md).

## Solutions de secours

- **Pas de proposition native d’installation** : montrer le guide adapté ; utiliser le menu du navigateur ou poursuivre dans l’onglet web. Ne pas annoncer une installation réussie sur la seule ouverture du guide.
- **Connexion perdue avant la première préparation** : rétablir le réseau ou utiliser les captures réelles et le PDF local ; ne pas promettre un premier chargement hors ligne.
- **Ancienne interface affichée** : revenir en ligne et appliquer la mise à jour proposée après avoir fermé les formulaires. Vérifier la version avant de reprendre.
- **Stockage refusé ou endommagé** : lire le message de l’application ; utiliser un environnement préparé ou réinitialiser explicitement les données fictives. Ne pas présenter la perte de stockage comme un mécanisme de sécurité.
- **Temps réduit** : faire page d’entrée, création, chronologie et synthèse des limites en trois minutes. Reporter l’installation à la période de questions.

## Clôture proposée

> « Le pilote permet de discuter concrètement des usages et de leur évolution. La prochaine décision est de valider le périmètre métier et les responsabilités afin de construire les services institutionnels, leurs habilitations et leurs preuves. »

Proposition technique non homologuée. Ne saisir ni donnée personnelle réelle, ni courrier confidentiel, ni secret de production.
