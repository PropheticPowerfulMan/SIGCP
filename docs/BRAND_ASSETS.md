# Identité visuelle du pilote 0.3.1

L’emblème intégré provient du fichier `EmblemRDC.jpg` fourni par le concepteur dans son dossier Téléchargements. Le fichier original est conservé à l’identique dans `public/brand/emblem-presidence.jpg` : 709 × 709 pixels, 61 844 octets.

SHA-256 : `1D40D86235FF4169450C1BEB9FD47CA4FEC485F3F26FB580A1B874DB6AEC3261`.

L’interface utilise cette image avec `object-fit: contain`. Aucune inscription ni élément des armoiries n’a été redessiné. Son emploi dans ce pilote ne constitue pas une homologation institutionnelle.

Les icônes de lancement sont produites par `scripts/generate-brand-icons.mjs` en redimensionnant l’image entière : 192 et 512 pixels, icône maskable de 512 pixels avec marge de sécurité, icône Apple de 180 pixels et favicon de 64 pixels. Le script utilise le canevas du navigateur ; il ne retouche pas le dessin source. Les images produites sont versionnées, donc leur génération n’est pas nécessaire au déploiement courant.

La ligne d’identité suit l’ordre bleu `#007fff`, jaune `#f7d618`, rouge `#ce1021`, dans les proportions visuelles déjà présentes dans le projet SSDC. Le rail du menu reprend les usages du projet KCS Nexus AI : réduction, liens nommés, préférence locale et ouverture mobile indépendante.

La 0.3.1 adapte cette identité aux écrans tactiles : rail de 78 px par défaut sur tablette sans préférence enregistrée, navigation basse sur téléphone, emblème et titre du tableau de bord réorganisés, accès au pilote avant l’éditorial sur petit écran. Les scrollbars navy/or couvrent les deux axes et rendent les couleurs au système en mode forcé ; les mouvements des boutons respectent la préférence de réduction.

Contrôle de publication : [run 45886138008](https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45886138008) réussi, source `1bee9bf2f77728652758725e404b1aaa1ca68475`. Le HTML public référence `index-CA1h1BLN.js` / `index-BctLyuSp.css`, le cache de coque est `9f7f654df48ed8f6037f` (27 ressources) ; l’emblème et l’icône PNG 512 répondent en HTTP 200 avec les types attendus. Le manifeste a l’identité `/SIGCP/`, `standalone` et trois icônes.

Dix captures ont été inspectées, dont le formulaire tablette sombre ; les 19 parcours Chromium CI ont réussi et les deux parcours tactiles ont également réussi localement. Le dossier PDF de revue 0.3.1 comporte dix pages ; son rendu et ses quatre légendes ont été vérifiés. Ces contrôles portent sur le pilote et ne constituent pas une homologation de la charte institutionnelle.
