# V0.14.1 — correctif ciblé de progression, Faille et stats effectives

Date : 4 octobre 2026. Travail local uniquement. La V0.14 préexistante est conservée.

## A — Résumé et verdict

Implémenté : montée préparatoire aux niveaux 7/8/9, palier 10 toujours majeur, Faille endgame non automatique, affichage Hub/Collection raccordé au calcul utilisé pour préparer les combats.

Les moyennes mesurées sont proches des cibles. Ce n'est pas une uniformisation des matchups :
- Normal : N9 endgame **3,53 %**, N10 moyen **11,72 %**, bon **47,43 %**, endgame **84,22 %**.
- Némésis : N10 moyen **1,67 %**, bon **17,61 %**, endgame **54,63 %**.
- Faille : Boss réel (lineups/jitter) **85,21 %**, full clear **85,21 %** au N10 endgame, pleine difficulté.
- Même référence Mammouth fixe que V0.14 : **99,985 % → 87,42 %**.

Réserves honnêtes : Naya N9 endgame Normal atteint 5,44 % (légèrement au-dessus de 5 %, à ±0,63 point environ pour ce taux/5000 graines). Eyla N10 moyen est à 7,54 %, Tyrak à 20,38 %. Tyrak Némésis endgame reste favorable à 65,56 %. La moyenne réelle Faille masque des matchups de Boss distincts : brute environ 77,73 %, Mammouth 87,46 %, Smilodon 90,56 % sur les séquences aléatoires. Certains matchups individuels sortent de la plage indicative ; aucun résultat n'est prétendu identique pour tous.

La progression est beaucoup moins abrupte qu'avant, mais le palier 10 reste volontairement fort : ratios 9→10 inférieurs à 2 pour chaque statistique (maximum 1,978). Cela ne devient pas une courbe linéaire.

## B/C — Choix de progression et difficulté fixe

Les niveaux 1–6 sont rigoureusement inchangés. Les 12 tables explicites conservent leurs profils distincts. Les stats 7/8/9, leurs gains et les anciennes/nouvelles valeurs 10 figurent plus bas.

Exemple Karg :
- V0.14 N7→10 : Force 22/24/26/90 ; PV 217/234/252/850.
- V0.14.1 : Force 29/40/54/99 ; PV 306/455/626/1139.
- Ratio final Force : 3,46 → 1,83 ; PV : 3,37 → 1,82.

Une redistribution sans ajustement de difficulté faisait monter trop fortement les victoires N9 avec les objets validés. Calibration réelle préalable, sans modifier les équipements/passifs :
- Morgath Normal : 145/24/45/1500 → **166/24/45/1720** (Force +14,48 %, PV +14,67 %).
- Morgath Némésis : 170/28/49/1700 → **190/28/49/1904** (+11,76 % Force, +12 % PV).
- Ni doublement du Boss, ni scaling selon le niveau ou la rareté du joueur.

## F — Campagne, murs et limites

Nodes 1–14 : aucune stat ennemie modifiée. Les murs initiaux ne sont donc pas touchés :
- N3 gear Commun contre Aventure 5 : 11,09 %, inchangé.
- N5 Commun contre Aventure 10 : 0,67 %, inchangé.
- N7 Commun contre Aventure 10 : 4,45 → 14,35 %, toujours un mur.

Pour ne pas trivialiser toute la dernière approche après le lissage :
- Aventure 15/16/17 : Force/PV environ +15 %.
- 18 : environ +20 %.
- 19 : environ +25 %.
- Esquive/vitesse et comportements ennemis inchangés.

Statistiques finales 15→19 F/E/V/PV : 75/18/30/920 ; 72/19/32/874 ; 78/20/33/932 ; 89/22/35/1044 ; 100/23/37/1188.

Aventure 19 avec bon gear : N7 14,66 %, N8 39,63 %, N9 73,59 %, N10 99,99 %. Avec gear moyen, N9 est à 21,27 %. Le palier 10 prépare ensuite Morgath, pas une répétition du même mur.

Limite explicite : bon/endgame gear domine encore certains niveaux antérieurs, notamment 15–17 au N9 et 1–14 avec du gear épique/légendaire. C'était déjà en partie le cas en V0.14. Nous n'avons pas refondu ces rencontres ni nerfé les objets pour rendre chaque node difficile indépendamment du build. Le détail avant/après est fourni, sans masquer les 100 %.

## G — Faille

Budgets de base F/E/V/PV (avant multiplicateurs d'identité, jitter ±6 %, hidden pity) :
| Combat | Budget final |
|---|---|
| 1 | 33/15/24/430 |
| 2 | 42/17/26/530 |
| 3 | 52/20/28/660 |
| 4 mini-boss | 95/21/32/1150 |
| 5 Boss | 165/24/40/1600 |

C1–C3 inchangés. C4 auparavant 65/21/30/810, C5 85/24/35/1050. C4 est une préparation au Boss, sans augmenter absurdement les premiers combats.

Mêmes profils ennemis, mêmes compétences ennemies, mêmes 5 étapes, lock, full HP, calendrier Paris, lineup stable, abandon, hidden pity/reset et récompenses 40 XP +40 pièces par victoire, 200/200 + coffre à 5/5. Aucun changement de Faille runtime ou de ses rewards. Une défaite réelle observée en QA revient directement à l'entrée Faille, sans gros récapitulatif.

Les probabilités 5/5 sont observées sur la même séquence de 5 combats, pas obtenues en multipliant des moyennes. Les taux par étape sont marginaux ; les compteurs conditionnels sur les runs survivants sont également dans le JSON. Profils commencent à 0 XP à leur niveau, donc les 200 XP de la run ne leur font pas franchir un palier.

## H — Stats d'équipement / UI

`getEffectiveWarriorStats(warriorId, level, weapon, armor)` calcule uniquement base/progression + bonus statiques. `effectiveStats(save, warriorId?)` résout la possession et le loadout :
- Warrior actif : miroirs équipés existants, compatibles saves et overrides QA.
- Warrior inactif : son propre preset sauvegardé, jamais celui du Warrior actif.
- Objet absent de l'inventaire ou slot vide : aucun bonus.
- Bonus conditionnels/procs : pas ajoutés aux chiffres permanents.

Hub et fiche Collection utilisent cette fonction ; préparation du combat et Duel utilisent déjà `effectiveStats`. Le moteur reçoit une stat préparée et ne la bonifie pas à nouveau. Les nouvelles simulations emploient la même fonction pure.

Exemple réel vérifié navigateur et tests : Karg N6 20 Force → Massue +3 = **23** → Hache +7 = **27**, immédiatement dans Hub et Collection. Hache + Manteau des Roseaux : **27 Force /18 Esquive /17 Vitesse /234 PV**. Karg N10 Cœur/Peau : **174 Force /53 Esquive /62 Vitesse /1889 PV**, Hub et HUD identiques.

## I/J/K — Conservé

- **20 équipements inchangés**, identité/bonus/effets strictement égaux au snapshot V0.14.
- **36 passifs inchangés** ; aucun texte, seuil ou mécanisme retouché.
- XP [120,180,300,450,650,850,1100,1400,1800] = **6850**, inchangée.
- Économie, coffres/odds/recyclage, Expédition, Duel métier, cloud, auth, admin, schémas et loadouts inchangés.
- Pas de reset/downgrade des niveaux : stats dérivées du niveau actuel, sans nouvelle migration.
- Tests legacy, cloud/CAS/conflits/offline/account isolation et sauvegardes restent verts. Pas de validation sur compte/cloud distant non déployé.
- Aucun sprite/artwork/CSS/HUD ou ancien asset modifié.

## L — Validation et QA

- **281 tests réussis, 37 fichiers de tests**, aucune erreur.
- `pnpm run lint` : OK, zéro warning.
- `pnpm exec tsc -b --pretty false` : OK.
- `pnpm run build` : OK, TypeScript + Vite/PWA + Duel Edge.
- Warning préexistant chunk JS >500 kB maintenu ; aucun refactor bundle.
- `git diff --check` : OK.
- Browser : Hub et fiche Collection à 320×844, 390×844, 768×1024, 1440×900 ; chiffres lisibles, pas de scroll horizontal ni image cassée. Arme/armure live, fiche inactive et switch Karg/Naya/Karg vérifiés.
- Combat réel QA à 320/390/1440 avec nouveaux PV, et Boss Faille à 768 ; HUD/sprites inchangés.
- Défaite Faille naturelle ×3 observée : retour à l'entrée, aucun récapitulatif géant.
- Console locale : zéro erreur/warning pendant ces contrôles. Aucune image cassée/404 observée.
- HTTP 200 : jeu normal, admin, combat QA. URL normale affiche l'auth attendue, sans connexion à un compte réel.
- Rechargement des loadouts, bonus exactement une fois, slots vides, deux presets : tests automatisés.
- Captures ignorées : `qa-output/v0141-hub-effective-desktop.jpg` et `qa-output/v0141-rift-loss-tablet.jpg`.

Simulations finales : 2000 graines/cellule campagne, 5000 pour Morgath et référence Mammouth, 1000 par combinaison des 100 loadouts/Warrior, 2000 runs par profil Faille et Warrior. Total **13 500 000 combats**, références avant/après incluses. Script reproductible :
```sh
node scripts/simulate-v0141-balance.mjs
```
JSON et tableau générés dans `qa-output/v0141-balance.json` / `.md`, ignorés par Git.

## M — Fichiers de cette passe uniquement

| Fichier | Modification |
|---|---|
| src/warriorProgression.ts | Tables N7–10 lissées ; N1–6/XP conservés |
| src/primalEnemyBalance.ts | Approche 15–19 et Morgath Normal fixes |
| src/nemesisBalance.ts | Morgath Némésis seulement |
| src/riftBalance.ts | Budgets C4/C5 seulement |
| src/game.ts | Source centrale effective, active/inactive |
| src/App.tsx | Hub affiche les stats effectives |
| src/components/WarriorDetail.tsx | Fiche affiche son propre loadout |
| src/warriorProgression.test.ts | Tables, monotonie, ratios <2, early careers |
| src/warriorPresentation.test.tsx | Attente Hub équipée corrigée |
| src/effectiveWarriorStats.test.tsx | 8 tests UI/loadouts/persistance/calcul unique |
| src/v014Balance.test.ts | Source centrale, Boss Faille non garanti, murs de progression |
| scripts/simulate-v0141-balance.mjs | Matrices réelles + snapshot V0.14, 100 loadouts, Faille complète |
| docs/v0141-targeted-balance.md | Ce rapport |
| supabase/functions/duel/engine.js | Régénération normale du bundle partagé par le build |

Les autres modifications Git visibles sont les modifications V0.14 préexistantes, conservées. Les deux scripts de recherche temporaires créés pendant cette passe ont été retirés ; le script final reste reproductible.

## N — Git / déploiement

Aucune écriture Git : aucun add, commit, push, branche, stash, reset, changement de remote. Aucun déploiement Pages/Supabase/Edge et aucune migration appliquée.

`202610040004_v014_economy.sql` n'est pas modifiée par cette passe et reste en attente. Le bundle Edge partagé a seulement été régénéré localement pour inclure les courbes et la source de stats identiques au client ; il reste **non déployé**.

`node_modules`, `dist`, `qa-output` et `.env.local` restent ignorés. Aucun secret ajouté.

## O — URLs réellement actives

- Jeu : http://127.0.0.1:5173/
- Admin : http://127.0.0.1:5173/?admin
- Hub QA (isolé, non persisté) : http://127.0.0.1:5173/?admin&qaPreview&qaWarrior=karg&qaLevel=6&qaWeapon=flint-club
- Combat : http://127.0.0.1:5173/?admin&desktopCombatPreview&qaWarrior=karg&qaLevel=10&qaNode=20&qaWeapon=titan-heart&qaHold
- Faille : http://127.0.0.1:5173/?admin&riftPreview&qaWarrior=karg&qaLevel=10&qaWeapon=titan-heart

Les URLs QA réutilisent les outils existants et le loadout d'armure du cache admin ; pour choisir un autre preset, employer Collection. Les essais QA ne persistent pas leurs modifications.

# Tables exhaustives de décision et simulations

# V0.14.1 — balance mesurée
Rift 100% difficulty, 0 XP initially, full HP each stage. Stage rates marginal (even when prior stage would lose), full clears observed on the same five seeded encounters, not multiplied averages. No pity. 95% sampling error <= ±2.2 pp at n=2000, ±1.4 pp at n=5000; optimization n=1000 ranking close ties have noise.

## Progression F/E/V/PV
Warrior|Niveau|V0.14.1|Gain depuis niveau précédent
---|---:|---|---
Karg|7|29/15/18/306|9/1/1/107
Karg|8|40/16/20/455|11/1/2/149
Karg|9|54/17/22/626|14/1/2/171
Karg|10|99/28/40/1139|45/11/18/513
Naya|7|21/22/25/235|6/1/2/73
Naya|8|28/24/26/338|7/2/1/103
Naya|9|37/25/28/455|9/1/2/117
Naya|10|73/45/55/900|36/20/27/445
Brakk|7|27/12/14/356|8/1/1/108
Brakk|8|38/13/15/507|11/1/1/151
Brakk|9|51/14/17/680|13/1/2/173
Brakk|10|95/25/32/1260|44/11/15/580
Eyla|7|26/17/23/282|9/1/2/107
Eyla|8|38/19/25/432|12/2/2/150
Eyla|9|52/20/27/604|14/1/2/172
Eyla|10|94/35/50/1099|42/15/23/495
Asha|7|29/17/20/327|9/1/1/107
Asha|8|40/19/22/477|11/2/2/150
Asha|9|54/20/23/648|14/1/1/171
Asha|10|99/30/43/1179|45/10/20/531
Rhex|7|29/19/24/312|9/1/2/105
Rhex|8|40/20/25/458|11/1/1/146
Rhex|9|54/22/27/626|14/2/2/168
Rhex|10|98/35/50/1139|44/13/23/513
Ursak|7|32/14/18/370|8/1/2/98
Ursak|8|42/15/19/507|10/1/1/137
Ursak|9|54/16/21/663|12/1/2/156
Ursak|10|98/26/38/1206|44/10/17/543
Saar|7|32/26/28/331|7/2/2/99
Saar|8|42/28/30/468|10/2/2/137
Saar|9|54/29/32/626|12/1/2/158
Saar|10|99/44/54/1139|45/15/22/513
Morga|7|33/12/15/419|7/1/1/99
Morga|8|43/13/16/557|10/1/1/138
Morga|9|55/14/18/715|12/1/2/158
Morga|10|100/24/33/1300|45/10/15/585
Vorka|7|36/22/26/380|7/2/2/96
Vorka|8|45/24/28/513|9/2/2/133
Vorka|9|56/25/30/666|11/1/2/153
Vorka|10|103/38/50/1233|47/13/20/567
Urgath|7|38/13/17/457|6/1/2/96
Urgath|8|46/15/18/591|8/2/1/134
Urgath|9|56/16/20/744|10/1/2/153
Urgath|10|102/26/35/1353|46/10/15/609
TYRAK|7|41/15/21/480|6/1/2/93
TYRAK|8|49/16/22/610|8/1/1/130
TYRAK|9|58/17/24/759|9/1/2/149
TYRAK|10|106/28/42/1380|48/11/18/621

## Niveau 10 avant → après
Warrior|V0.14|V0.14.1
---|---|---
Karg|90/28/40/850|99/28/40/1139
Naya|73/45/55/700|73/45/55/900
Brakk|86/25/32/940|95/25/32/1260
Eyla|85/35/50/820|94/35/50/1099
Asha|90/30/43/880|99/30/43/1179
Rhex|89/35/50/850|98/35/50/1139
Ursak|89/26/38/900|98/26/38/1206
Saar|90/44/54/850|99/44/54/1139
Morga|91/24/33/970|100/24/33/1300
Vorka|94/38/50/920|103/38/50/1233
Urgath|93/26/35/1010|102/26/35/1353
TYRAK|96/28/42/1030|106/28/42/1380

## Morgath — pourcentages
Warrior|N9 endgame Normal|N10 moyen Normal|N10 bon Normal|N10 endgame Normal|N10 moyen Némésis|N10 bon Némésis|N10 endgame Némésis
---|---:|---:|---:|---:|---:|---:|---:
Karg|3.34|9.9|43.28|80.8|1.52|16.12|49.54
Naya|5.44|8.76|39.5|82.24|1.76|15.28|55.38
Brakk|4|9.04|48.1|83.12|1.18|17.66|54.04
Eyla|3.62|7.54|39.9|79.18|0.82|11.9|45.76
Asha|2.78|12.02|46.36|83.16|1.22|17.2|53.96
Rhex|4.34|15.3|50.02|85.8|1.92|20.82|58.54
Ursak|2.48|9.64|46.28|85.7|0.94|16.06|54.32
Saar|2.74|10.16|41.18|79.22|1.38|13.32|48.02
Morga|1.74|11.1|52.64|89.66|1.22|19.02|61.02
Vorka|4.64|13.62|46.46|81.62|2.28|16.18|49.18
Urgath|3.9|13.2|54.94|88.86|1.88|20.62|60.22
TYRAK|3.36|20.38|60.52|91.24|3.92|27.18|65.56

## Campagne — moyenne des douze Warriors, V0.14 → V0.14.1
Niveau Warrior|Gear|Niveau Aventure|Avant %|Après %
---:|---|---:|---:|---:
1|none|1|84.38|84.38
1|none|5|0.55|0.55
1|none|10|0|0
1|none|15|0|0
1|none|16|0|0
1|none|17|0|0
1|none|18|0|0
1|none|19|0|0
1|none|20|0|0
3|common|1|99.71|99.71
3|common|5|11.09|11.09
3|common|10|0.07|0.07
3|common|15|0|0
3|common|16|0|0
3|common|17|0|0
3|common|18|0|0
3|common|19|0|0
3|common|20|0|0
5|common|1|100|100
5|common|5|28.5|28.5
5|common|10|0.67|0.67
5|common|15|0|0
5|common|16|0|0
5|common|17|0|0
5|common|18|0|0
5|common|19|0|0
5|common|20|0|0
5|medium|1|100|100
5|medium|5|100|100
5|medium|10|93.42|93.42
5|medium|15|11.8|2.2
5|medium|16|15.53|3.75
5|medium|17|7.88|1.4
5|medium|18|3.07|0.22
5|medium|19|0.7|0.01
5|medium|20|0|0
7|common|1|100|100
7|common|5|55.62|86.44
7|common|10|4.45|14.35
7|common|15|0|0
7|common|16|0|0
7|common|17|0|0
7|common|18|0|0
7|common|19|0|0
7|common|20|0|0
7|medium|1|100|100
7|medium|5|100|100
7|medium|10|98.67|99.79
7|medium|15|31.38|21.87
7|medium|16|38.48|28.74
7|medium|17|24.35|15.25
7|medium|18|11.66|3.84
7|medium|19|4.27|0.56
7|medium|20|0|0
7|good|1|100|100
7|good|5|100|100
7|good|10|100|100
7|good|15|83.05|75.83
7|good|16|86.17|80.22
7|good|17|77.15|68.74
7|good|18|61.05|40.35
7|good|19|40.38|14.66
7|good|20|0|0
8|medium|1|100|100
8|medium|5|100|100
8|medium|10|99.28|100
8|medium|15|40.57|56.57
8|medium|16|47.15|64.93
8|medium|17|31.74|47.15
8|medium|18|15.55|17.37
8|medium|19|6.35|3.7
8|medium|20|0|0
8|good|1|100|100
8|good|5|100|100
8|good|10|100|100
8|good|15|88.34|94.31
8|good|16|90.35|96.17
8|good|17|82.05|90.2
8|good|18|66.9|71.01
8|good|19|46.84|39.63
8|good|20|0|0
9|medium|1|100|100
9|medium|5|100|100
9|medium|10|99.46|100
9|medium|15|49.74|88.13
9|medium|16|56.37|91.75
9|medium|17|40.03|81.94
9|medium|18|23.21|54.15
9|medium|19|10.09|21.27
9|medium|20|0|0
9|good|1|100|100
9|good|5|100|100
9|good|10|100|100
9|good|15|91.53|99.37
9|good|16|93.78|99.66
9|good|17|86.78|98.59
9|good|18|73.41|92.17
9|good|19|54.91|73.59
9|good|20|0.01|0.09
9|endgame|1|100|100
9|endgame|5|100|100
9|endgame|10|100|100
9|endgame|15|99.93|100
9|endgame|16|99.96|100
9|endgame|17|99.73|100
9|endgame|18|98.92|99.74
9|endgame|19|96.8|98.32
9|endgame|20|1.13|3.53
10|medium|1|100|100
10|medium|5|100|100
10|medium|10|100|100
10|medium|15|100|100
10|medium|16|100|100
10|medium|17|100|100
10|medium|18|100|100
10|medium|19|99.9|99.67
10|medium|20|11.55|11.72
10|good|1|100|100
10|good|5|100|100
10|good|10|100|100
10|good|15|100|100
10|good|16|100|100
10|good|17|100|100
10|good|18|100|100
10|good|19|99.99|99.99
10|good|20|47.17|47.43
10|endgame|1|100|100
10|endgame|5|100|100
10|endgame|10|100|100
10|endgame|15|100|100
10|endgame|16|100|100
10|endgame|17|100|100
10|endgame|18|100|100
10|endgame|19|100|100
10|endgame|20|86.25|84.22

## Faille — moyenne, difficulté 100%
Niveau|Gear|C1 %|C2 %|C3 %|C4 %|Boss %|5/5 %
---:|---|---:|---:|---:|---:|---:|---:
5|medium|99.61|92.41|62.34|0.03|0|0
7|good|100|100|99.77|17.2|0|0
9|good|100|100|100|74.81|0.16|0.12
9|endgame|100|100|100|98.35|5.4|5.28
10|medium|100|100|100|99.7|15.37|15.34
10|good|100|100|100|100|51.48|51.48
10|endgame|100|100|100|100|85.21|85.21

## Boss Faille / full clear par Warrior N10 endgame
Warrior|Boss %|5/5 %
---|---:|---:
Karg|81.85|81.85
Naya|82.9|82.9
Brakk|85.55|85.55
Eyla|79.15|79.15
Asha|83.65|83.65
Rhex|85.55|85.55
Ursak|86.5|86.5
Saar|80.95|80.95
Morga|91.5|91.5
Vorka|83|83
Urgath|90.75|90.75
TYRAK|91.15|91.15

## Référence Faille V0.14 — Mammouth fixe, N10 endgame, difficulté 100%
Warrior|V0.14 %|V0.14.1 %
---|---:|---:
karg|99.98|84.4
naya|99.98|84.44
brakk|99.96|87.14
eyla|100|83.42
asha|99.96|87.1
rhex|100|88.98
ursak|100|89.2
saar|99.98|81.4
morga|100|92.42
vorka|99.98|84.46
urgath|100|92.54
tyrak|100|93.5

## 100 combinaisons — Morgath Némésis N10
Warrior|Meilleur|%|Pire (égalité à zéro possible)|%|Combinaisons sans victoire
---|---|---:|---|---:|---:
Karg|titan-heart + primordial-titan-skin|49.9|smilodon-fangs + bone-harness|0|27
Naya|titan-heart + primordial-titan-skin|55.9|smilodon-fangs + reed-mantle|0|30
Brakk|titan-heart + primordial-titan-skin|53.7|volcanic-hammer + reed-mantle|0|36
Eyla|titan-heart + primordial-titan-skin|44.5|smilodon-fangs + reed-mantle|0|33
Asha|titan-heart + primordial-titan-skin|52.9|smilodon-fangs + bone-harness|0|31
Rhex|titan-heart + primordial-titan-skin|57.6|obsidian-axe + smilodon-cloak|0|24
Ursak|titan-heart + primordial-titan-skin|53.7|volcanic-hammer + bone-harness|0|40
Saar|titan-heart + primordial-titan-skin|47.5|smilodon-fangs + smilodon-cloak|0|33
Morga|titan-heart + primordial-titan-skin|60.6|smilodon-fangs + reed-mantle|0|35
Vorka|titan-heart + primordial-titan-skin|47.8|smilodon-fangs + reed-mantle|0|33
Urgath|titan-heart + primordial-titan-skin|60.4|smilodon-fangs + bone-harness|0|30
TYRAK|titan-heart + primordial-titan-skin|65.4|obsidian-axe + reed-mantle|0|24

### Loadouts faibles mais pertinents (deux objets Épique ou mieux)

Les pires absolus ci-dessus sont des représentants de nombreuses égalités à 0 %. Pour ne pas comparer uniquement à du gear de départ, voici aussi les moins bons parmi les 16 combinaisons de deux objets Épique/Légendaire/Mythique. Le JSON contient les 100 résultats par Warrior et les cinq meilleurs, sans score artificiel.

Warrior|Pire combinaison pertinente|Victoires %
---|---|---:
Karg|volcanic-hammer + volcanic-shell|2.1
Naya|volcanic-hammer + volcanic-shell|2.6
Brakk|volcanic-hammer + volcanic-shell|1.1
Eyla|storm-javelin + volcanic-shell|0.9
Asha|storm-javelin + volcanic-shell|1.6
Rhex|volcanic-hammer + volcanic-shell|2.5
Ursak|storm-javelin + volcanic-shell|1.3
Saar|volcanic-hammer + volcanic-shell|1.9
Morga|volcanic-hammer + volcanic-shell|1.6
Vorka|volcanic-hammer + volcanic-shell|1.9
Urgath|volcanic-hammer + volcanic-shell|2.3
TYRAK|volcanic-hammer + volcanic-shell|4.2

Le meilleur reste Cœur du Titan + Peau du Titan pour les douze matchups. Aucun autre des 100 loadouts ne contourne la cible. Le classement à 1000 graines peut fluctuer entre des taux proches ; les cellules de référence Morgath sont vérifiées à 5000 graines.

État Git final (V0.14 incluse) : 49 entrées, 39 fichiers suivis modifiés, 0 suppression suivie, 10 non suivis. Aucun changement de l'index Git.
