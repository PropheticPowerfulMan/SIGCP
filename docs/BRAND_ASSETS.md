# Identité visuelle du pilote 0.4.0

L’emblème intégré provient du fichier `EmblemRDC.jpg` fourni par le concepteur dans son dossier Téléchargements. Le fichier original est conservé à l’identique dans `public/brand/emblem-presidence.jpg` : 709 × 709 pixels, 61 844 octets.

SHA-256 : `1D40D86235FF4169450C1BEB9FD47CA4FEC485F3F26FB580A1B874DB6AEC3261`.

L’interface utilise cette image avec `object-fit: contain`. Aucune inscription ni élément des armoiries n’a été redessiné. Son emploi dans ce pilote ne constitue pas une homologation institutionnelle.

Les icônes de lancement sont produites par `scripts/generate-brand-icons.mjs` en redimensionnant l’image entière : 192 et 512 pixels, icône maskable de 512 pixels avec marge de sécurité, icône Apple de 180 pixels et favicon de 64 pixels. Le script utilise le canevas du navigateur ; il ne retouche pas le dessin source. Les images produites sont versionnées, donc leur génération n’est pas nécessaire au déploiement courant.

La ligne d’identité suit l’ordre bleu `#007fff`, jaune `#f7d618`, rouge `#ce1021`, dans les proportions visuelles déjà présentes dans le projet SSDC. Le rail du menu reprend les usages du projet KCS Nexus AI : réduction, liens nommés, préférence locale et ouverture mobile indépendante.

La 0.4.0 reprend le thème avec une perle bleutée, des surfaces et champs adoucis et des contrastes revus pour les badges, les erreurs et le focus. Les profils AP/RC/AV et leurs avatars sont présentés de façon cohérente avec les acteurs fictifs, sans conférer de droits serveur. L’emblème source, la ligne tricolore et les icônes restent conservés.

Les adaptations tactiles introduites en 0.3.1 sont conservées : rail de 78 px sans préférence enregistrée, navigation basse téléphone, accès au pilote avant l’éditorial et scrollbars navy/or sur deux axes. Les couleurs forcées et la réduction des mouvements restent prises en compte.

Pour la 0.4.0, 47 tests Node, 23 parcours Chromium, audit npm sans vulnérabilité et typage/build ont réussi en CI ; un test de captures conditionnel est ignoré. Six parcours ont aussi réussi localement. Six captures `v04-*` sont figées ; la revue couvre 1440, 390 et 820 px en clair et sombre, avec 53 états et 1 407 échantillons de contraste calculables sans échec.

Minimum du texte calculé : 5,038:1 ; focus clair/sombre : 4,269:1 / 8,818:1 ; texte au survol : 5,339:1 / 8,347:1. Les dégradés sont contrôlés manuellement. Ces mesures portent sur les états exercés et ne constituent pas une homologation de charte ou une certification globale d’accessibilité.

Publication courante : [run 45986496672](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45986496672) réussi, révision `be9463cd13cc596ac63e0e4a190b02272a14c223`. Le HTML sert `index-DRwZDCfA.js` / `index-CF7AcEUd.css`, le cache est `cc9b9de510c6dda81353` (27 ressources). L’emblème et les trois icônes répondent en HTTP 200 avec `image/jpeg` et `image/png` respectivement. Le PDF 0.4.0 final comporte dix pages et 1 251 108 octets ; les dix pages rendues ont été inspectées sans défaut constaté.

## Historique des contrôles 0.3.1

Contrôle de publication : [run 45886138008](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45886138008) réussi, source `1bee9bf2f77728652758725e404b1aaa1ca68475`. Le HTML public référence `index-CA1h1BLN.js` / `index-BctLyuSp.css`, le cache de coque est `9f7f654df48ed8f6037f` (27 ressources) ; l’emblème et l’icône PNG 512 répondent en HTTP 200 avec les types attendus. Le manifeste a l’identité `/SIGCP/`, `standalone` et trois icônes.

Dix captures ont été inspectées, dont le formulaire tablette sombre ; les 19 parcours Chromium CI ont réussi et les deux parcours tactiles ont également réussi localement. Le dossier PDF de revue 0.3.1 comporte dix pages ; son rendu et ses quatre légendes ont été vérifiés. Ces contrôles portent sur le pilote et ne constituent pas une homologation de la charte institutionnelle.
