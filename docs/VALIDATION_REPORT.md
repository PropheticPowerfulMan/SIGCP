# Rapport des contrôles exécutés

Date : 26 novembre 2026.
Source : https://github.com/PropheticPowerfulMan/SIGCP/actions/runs/45871315126
Révision : 5528c99621b8bbc0f43cc063e0db855e94f65cbc.

## Résultat applicatif

Job build 140087156007 : success.
npm ci, audit npm (0 alerte), 24 tests métier, typage strict, compilation Vite, 10 tests Playwright (11 secondes) et création de l’artefact Pages : réussis.
Artefact GitHub Pages : 15141849152.

Parcours vérifiés : navigation/rechargement, recherche/état vide, pagination, validation et focus du formulaire, entrant de création à archivage et persistance, thème, corruption/réinitialisation, Échap/retour focus, réseau/idempotence/reprise/accusé, navigation mobile et largeur du document. Les captures conditionnelles sont ignorées dans la CI ; les captures documentaires sont réalisées localement.

## Résultat de publication

Job deploy 140087596541 : failure à configure-pages@v5, Get Pages site failed / Not Found. L’étape deploy-pages n’a pas été exécutée. L’écran du propriétaire confirme que l’offre exige une mise à niveau ou un dépôt public.

## Portée

Ces preuves concernent le pilote statique à données fictives. Elles ne démontrent ni sécurité serveur, ni signature officielle, ni conformité ASVS, ni exploitation institutionnelle.
