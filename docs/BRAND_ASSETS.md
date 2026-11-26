# Identité visuelle du pilote 0.3

L’emblème intégré provient du fichier `EmblemRDC.jpg` fourni par le concepteur dans son dossier Téléchargements. Le fichier original est conservé à l’identique dans `public/brand/emblem-presidence.jpg` : 709 × 709 pixels, 61 844 octets.

SHA-256 : `1D40D86235FF4169450C1BEB9FD47CA4FEC485F3F26FB580A1B874DB6AEC3261`.

L’interface utilise cette image avec `object-fit: contain`. Aucune inscription ni élément des armoiries n’a été redessiné. Son emploi dans ce pilote ne constitue pas une homologation institutionnelle.

Les icônes de lancement sont produites par `scripts/generate-brand-icons.mjs` en redimensionnant l’image entière : 192 et 512 pixels, icône maskable de 512 pixels avec marge de sécurité, icône Apple de 180 pixels et favicon de 64 pixels. Le script utilise le canevas du navigateur ; il ne retouche pas le dessin source. Les images produites sont versionnées, donc leur génération n’est pas nécessaire au déploiement courant.

La ligne d’identité suit l’ordre bleu `#007fff`, jaune `#f7d618`, rouge `#ce1021`, dans les proportions visuelles déjà présentes dans le projet SSDC. Le rail du menu reprend les usages du projet KCS Nexus AI : réduction, liens nommés, préférence locale et ouverture mobile indépendante.
