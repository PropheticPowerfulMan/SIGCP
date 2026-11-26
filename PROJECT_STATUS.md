# État de livraison · IMPERIUM RDC 0.2

Date : 26 novembre 2026. Statut : pilote fonctionnel à données exclusivement fictives, non homologué.

## Reprise de la version précédente

- Domaine JavaScript faiblement contrôlé remplacé par un modèle TypeScript strict.
- Ancien module supprimé : sa résolution prioritaire provoquait un écran blanc dans le navigateur.
- Formulaire contrôlé et complet ; erreurs accessibles par champ et validation des dates.
- Circuit entrant/sortant distinct ; sauts d’étapes refusés et correction motivée.
- Chargement local contrôlé en profondeur ; registre corrompu signalé et non écrasé silencieusement.
- Navigation par routes hash, pagination, filtres multicritères, tri et statistiques calculées.
- Menus, dialogs nommés, clavier, contraste et lisibilité repris ; thème conservé.
- Raccourcis urgents et archives corrigés ; partenaire destinataire conservé.
- Transmission, réception et accusé distingués dans les scénarios locaux idempotents.
- Polices désormais locales ; CSP par meta pour les ressources du pilote.
- Vite 6.4.1 remplacé par 6.4.6 après alerte npm ; audit signalé à zéro après correction.
- Workflow Pages corrigé : activation préalable, tests et publication avec permissions limitées.

## Vérifications réalisées

- 24 tests domaine/échanges : réussis.
- TypeScript strict : réussi.
- Compilation finale Vite 6.4.6 : réussie, 1 594 modules, JS 300,85 kB / 89,56 kB gzip, CSS 52,09 kB / 11,34 kB gzip.
- Tests Playwright : 8 parcours desktop réussis ; réseau et mobile en vérification ciblée finale. Captures réelles desktop/mobile effectuées ; débordement mobile corrigé puis recompilé.
- Audit npm après mise à jour : zéro vulnérabilité signalée (cela ne constitue pas un audit de sécurité complet).

## Publication

L’utilisateur a confirmé le choix GitHub Actions dans Settings > Pages. La version 0.2 sera envoyée après les contrôles finaux. L’URL ne sera déclarée publiée qu’après réponse HTTP réussie du site.

## Limites réelles

La démonstration est statique et locale. Aucune authentification ni autorisation de production, signature vérifiable, transmission réelle, messagerie, hébergement de document réel, audit inviolable, sauvegarde serveur ou migration PHP n’est livré. Aucune certification ou homologation n’est revendiquée. Les 12 documents PDF exigés restent à produire avec les preuves de l’infrastructure correspondante.

Les 40 sections des deux prompts sont tracées dans docs/REQUIREMENTS_MATRIX.md. Les technologies non intégrées et les décisions institutionnelles restent explicites. Aucun accès au système historique n’a été effectué.
