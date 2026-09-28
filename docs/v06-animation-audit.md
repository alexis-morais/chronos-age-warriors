# Audit animation V0.6

Audit réalisé sur les six poses sources 512×512 et les planches QA fournies. Les exports V0.6.1 utilisent un canvas transparent canonique de **768×512**, une ancre de pieds `x=384, y=462` et une hauteur de corps neutre de **126 px**. La mesure porte sur la bande centrale du corps et ignore la longueur latérale des armes. Une même échelle est appliquée aux six poses d’une famille.

| Sexe | Famille | Statut | Décision runtime |
|---|---|---|---|
| Homme | Massue de silex | OK | Six poses propres. Une seule massue visible ; aucune frame blendée. |
| Homme | Lance d’os | OK | Silhouette, arme et orientation cohérentes. |
| Homme | Hache d’obsidienne | OK | Une seule arme ; attaque lisible. |
| Homme | Arc du chasseur | OK | Projectile séparé du sprite. |
| Homme | Crocs du smilodon | OK | Paire de crocs intentionnelle, sans arme fantôme. |
| Homme | Lance du mammouth | OK | Canvas et baseline communs. |
| Homme | Marteau volcanique | OK | Échelle normalisée par famille, constante entre états. |
| Homme | Griffe du tyran | OK | Silhouette cohérente, sans changement d’échelle par état. |
| Homme | Cœur du titan | OK | Échelle normalisée par famille, constante entre états. |
| Femme | Massue de silex | OK | Six poses propres et arme unique. |
| Femme | Lance d’os | OK | Silhouette, arme et orientation cohérentes. |
| Femme | Hache d’obsidienne | OK | Six poses propres ; aucune superposition. |
| Femme | Arc du chasseur | OK | Projectile séparé du sprite. |
| Femme | Crocs du smilodon | OK | Paire de crocs intentionnelle. |
| Femme | Lance du mammouth | OK | Canvas et baseline communs. |
| Femme | Marteau volcanique | OK | Échelle constante entre états. |
| Femme | Griffe du tyran | OK | Échelle constante entre états. |
| Femme | Cœur du titan | OK | Échelle constante entre états. |

## Fallbacks et limites

- Les trois transitions blendées retirées du pack ne sont jamais demandées par le runtime. La fluidité vient exclusivement des transformations du conteneur.
- Les 18 sources `hurt.png` contiennent un voile rouge uniforme à alpha 20. Les 108 poses runtime sont nettoyées et normalisées dans `assets-v06/derived/player/` avec une baseline commune et du padding transparent stable.
- `victory` et `recovery` utilisent la pose `idle` propre avec animation du conteneur ; aucun sprite complet supplémentaire n’est superposé.
- Les sources de personnalisation sont des planches de référence, pas des couches alignées pose par pose. La création et le Hub utilisent les portraits Chronos frontaux dédiés ; seul le sexe possède actuellement un rendu raster fidèle. Les autres choix restent persistés sans faux recoloring ou composite SVG.
- Les portraits Hero ne résolvent jamais une URL de pose combat.
