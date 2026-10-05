# CHRONOS AGE WARRIORS — V0.15 Final calibration

**V0.15 READY TO CLOSE**, pour validation humaine locale. Aucune publication ni opération Git d’écriture. Le backend préparé reste non appliqué ; son test d’intégration et sa bascule restent à effectuer après approbation. Les statistiques ci-dessous sont des simulations, pas de la télémétrie ni une certification Supabase.

Le rapport [Phase 2](v015-phase2-final.md) reste intact comme historique. Cette passe remplace son arbitrage bloquant par la philosophie rareté-first explicitement choisie. Aucun travail V0.16, art, sprite, HUD, odds, équipement ou passif modifié.

## A. Philosophie finale

La rareté donne de la puissance visible et une progression PvE plus précoce. Les niveaux, équipements et passifs restent déterminants ; aucun multiplicateur de dégâts caché, condition par adversaire ou difficulté dépendant de la rareté. Les anciens objectifs PvP précis et l’interdiction universelle de Morgath avant N10 ne sont plus des critères. Un Common bien préparé reste viable.

| Common N10 contre | Avant % Common | Après % Common |
| --- | --- | --- |
| Épique N5 | 100.00 | 36.94 |
| Légendaire N5 | 100.00 | 29.59 |
| Mythique N5 | 100.00 | 14.84 |


Résultats sans équipement, moyenne non pondérée des 4 Common ; 5000 graines par paire. Les trois tiers supérieurs ne contiennent actuellement qu’un Warrior chacun : Épique = Vorka, Légendaire = Urgath, Mythique = Tyrak. Les matchups de classes restent réels. On ne peut pas déduire un classement absolu de toutes les classes à partir de la seule rareté.

## B. Stats / progression exactes

Common : les 40 tuples Phase 2 restent identiques. N1 des 12 Warriors inchangé. Les autres tiers interpolent entre leur propre N1 et leur propre plafond N10 ; seul le budget Force/PV du plafond augmente. Esquive/Vitesse finales, identités/classes, passifs et équipements restent identiques. Formule : end = arrondi(anchorN10 × budget pour Force/PV, anchorN10 sinon), statN = arrondi(start + (end − start) × growth[N − 1]). Aucune référence à l’ennemi ou au mode. Les niveaux 5→10 continuent à augmenter les stats et débloquent les passifs 7/10 ; ils ne sont pas remplacés par un boost d’acquisition.

| Rareté | Budget Force/PV N10 vsPhase2 | Fractions de croissance N1→10 |
| --- | --- | --- |
| Peu commun | 1.02 | 0 · 0.035 · 0.075 · 0.13 · 0.21 · 0.3 · 0.43 · 0.59 · 0.77 · 1 |
| Rare | 1.06 | 0 · 0.065 · 0.15 · 0.3 · 0.48 · 0.59 · 0.69 · 0.79 · 0.89 · 1 |
| Épique | 1.16 | 0 · 0.1 · 0.3 · 0.6 · 0.88 · 0.904 · 0.928 · 0.952 · 0.976 · 1 |
| Légendaire | 1.24 | 0 · 0.12 · 0.33 · 0.62 · 0.88 · 0.904 · 0.928 · 0.952 · 0.976 · 1 |
| Mythique | 1.3 | 0 · 0.14 · 0.36 · 0.64 · 0.86 · 0.888 · 0.916 · 0.944 · 0.972 · 1 |


Toutes les valeurs dans l’ordre **Force / Esquive / Vitesse / PV** :

| Warrior | Rareté | Niveau | Avant Phase2 | Après final |
| --- | --- | --- | --- | --- |
| karg | Commun | 1 | 11 / 8 / 10 / 110 | 11 / 8 / 10 / 110 |
| karg | Commun | 2 | 13 / 9 / 11 / 128 | 13 / 9 / 11 / 128 |
| karg | Commun | 3 | 15 / 10 / 13 / 146 | 15 / 10 / 13 / 146 |
| karg | Commun | 4 | 17 / 11 / 14 / 163 | 17 / 11 / 14 / 163 |
| karg | Commun | 5 | 19 / 12 / 15 / 181 | 19 / 12 / 15 / 181 |
| karg | Commun | 6 | 20 / 14 / 17 / 199 | 20 / 14 / 17 / 199 |
| karg | Commun | 7 | 29 / 15 / 18 / 306 | 29 / 15 / 18 / 306 |
| karg | Commun | 8 | 40 / 16 / 20 / 455 | 40 / 16 / 20 / 455 |
| karg | Commun | 9 | 54 / 17 / 22 / 626 | 54 / 17 / 22 / 626 |
| karg | Commun | 10 | 99 / 28 / 40 / 1139 | 99 / 28 / 40 / 1139 |
| naya | Commun | 1 | 8 / 13 / 14 / 90 | 8 / 13 / 14 / 90 |
| naya | Commun | 2 | 9 / 15 / 16 / 104 | 9 / 15 / 16 / 104 |
| naya | Commun | 3 | 11 / 16 / 18 / 119 | 11 / 16 / 18 / 119 |
| naya | Commun | 4 | 12 / 18 / 19 / 133 | 12 / 18 / 19 / 133 |
| naya | Commun | 5 | 14 / 19 / 21 / 148 | 14 / 19 / 21 / 148 |
| naya | Commun | 6 | 15 / 21 / 23 / 162 | 15 / 21 / 23 / 162 |
| naya | Commun | 7 | 21 / 22 / 25 / 235 | 21 / 22 / 25 / 235 |
| naya | Commun | 8 | 28 / 24 / 26 / 338 | 28 / 24 / 26 / 338 |
| naya | Commun | 9 | 37 / 25 / 28 / 455 | 37 / 25 / 28 / 455 |
| naya | Commun | 10 | 73 / 45 / 55 / 900 | 73 / 45 / 55 / 900 |
| brakk | Commun | 1 | 12 / 6 / 7 / 145 | 12 / 6 / 7 / 145 |
| brakk | Commun | 2 | 13 / 7 / 8 / 166 | 13 / 7 / 8 / 166 |
| brakk | Commun | 3 | 15 / 8 / 9 / 186 | 15 / 8 / 9 / 186 |
| brakk | Commun | 4 | 16 / 9 / 10 / 207 | 16 / 9 / 10 / 207 |
| brakk | Commun | 5 | 17 / 10 / 11 / 227 | 17 / 10 / 11 / 227 |
| brakk | Commun | 6 | 19 / 11 / 13 / 248 | 19 / 11 / 13 / 248 |
| brakk | Commun | 7 | 27 / 12 / 14 / 356 | 27 / 12 / 14 / 356 |
| brakk | Commun | 8 | 38 / 13 / 15 / 507 | 38 / 13 / 15 / 507 |
| brakk | Commun | 9 | 51 / 14 / 17 / 680 | 51 / 14 / 17 / 680 |
| brakk | Commun | 10 | 95 / 25 / 32 / 1260 | 95 / 25 / 32 / 1260 |
| eyla | Commun | 1 | 10 / 10 / 12 / 100 | 10 / 10 / 12 / 100 |
| eyla | Commun | 2 | 11 / 11 / 14 / 115 | 11 / 11 / 14 / 115 |
| eyla | Commun | 3 | 13 / 12 / 16 / 130 | 13 / 12 / 16 / 130 |
| eyla | Commun | 4 | 14 / 14 / 17 / 145 | 14 / 14 / 17 / 145 |
| eyla | Commun | 5 | 16 / 15 / 19 / 160 | 16 / 15 / 19 / 160 |
| eyla | Commun | 6 | 17 / 16 / 21 / 175 | 17 / 16 / 21 / 175 |
| eyla | Commun | 7 | 26 / 17 / 23 / 282 | 26 / 17 / 23 / 282 |
| eyla | Commun | 8 | 38 / 19 / 25 / 432 | 38 / 19 / 25 / 432 |
| eyla | Commun | 9 | 52 / 20 / 27 / 604 | 52 / 20 / 27 / 604 |
| eyla | Commun | 10 | 94 / 35 / 50 / 1099 | 94 / 35 / 50 / 1099 |
| asha | Peu commun | 1 | 11 / 10 / 11 / 120 | 11 / 10 / 11 / 120 |
| asha | Peu commun | 2 | 13 / 11 / 13 / 140 | 14 / 11 / 12 / 158 |
| asha | Peu commun | 3 | 15 / 12 / 14 / 160 | 18 / 12 / 13 / 201 |
| asha | Peu commun | 4 | 17 / 14 / 16 / 180 | 23 / 13 / 15 / 261 |
| asha | Peu commun | 5 | 19 / 15 / 17 / 200 | 30 / 14 / 18 / 347 |
| asha | Peu commun | 6 | 20 / 16 / 19 / 220 | 38 / 16 / 21 / 445 |
| asha | Peu commun | 7 | 29 / 17 / 20 / 327 | 50 / 19 / 25 / 586 |
| asha | Peu commun | 8 | 40 / 19 / 22 / 477 | 64 / 22 / 30 / 759 |
| asha | Peu commun | 9 | 54 / 20 / 23 / 648 | 80 / 25 / 36 / 954 |
| asha | Peu commun | 10 | 99 / 30 / 43 / 1179 | 101 / 30 / 43 / 1203 |
| rhex | Peu commun | 1 | 11 / 11 / 13 / 115 | 11 / 11 / 13 / 115 |
| rhex | Peu commun | 2 | 13 / 12 / 15 / 133 | 14 / 12 / 14 / 152 |
| rhex | Peu commun | 3 | 15 / 14 / 17 / 152 | 18 / 13 / 16 / 194 |
| rhex | Peu commun | 4 | 16 / 15 / 18 / 170 | 23 / 14 / 18 / 251 |
| rhex | Peu commun | 5 | 18 / 16 / 20 / 188 | 30 / 16 / 21 / 335 |
| rhex | Peu commun | 6 | 20 / 18 / 22 / 207 | 38 / 18 / 24 / 429 |
| rhex | Peu commun | 7 | 29 / 19 / 24 / 312 | 49 / 21 / 29 / 565 |
| rhex | Peu commun | 8 | 40 / 20 / 25 / 458 | 64 / 25 / 35 / 733 |
| rhex | Peu commun | 9 | 54 / 22 / 27 / 626 | 80 / 29 / 41 / 921 |
| rhex | Peu commun | 10 | 98 / 35 / 50 / 1139 | 100 / 35 / 50 / 1162 |
| ursak | Peu commun | 1 | 14 / 7 / 9 / 150 | 14 / 7 / 9 / 150 |
| ursak | Peu commun | 2 | 16 / 8 / 10 / 174 | 17 / 8 / 10 / 188 |
| ursak | Peu commun | 3 | 18 / 9 / 12 / 199 | 20 / 8 / 11 / 231 |
| ursak | Peu commun | 4 | 20 / 10 / 13 / 223 | 25 / 9 / 13 / 290 |
| ursak | Peu commun | 5 | 22 / 11 / 15 / 248 | 32 / 11 / 15 / 377 |
| ursak | Peu commun | 6 | 24 / 13 / 16 / 272 | 40 / 13 / 18 / 474 |
| ursak | Peu commun | 7 | 32 / 14 / 18 / 370 | 51 / 15 / 21 / 614 |
| ursak | Peu commun | 8 | 42 / 15 / 19 / 507 | 65 / 18 / 26 / 787 |
| ursak | Peu commun | 9 | 54 / 16 / 21 / 663 | 80 / 22 / 31 / 982 |
| ursak | Peu commun | 10 | 98 / 26 / 38 / 1206 | 100 / 26 / 38 / 1230 |
| saar | Rare | 1 | 15 / 16 / 16 / 135 | 15 / 16 / 16 / 135 |
| saar | Rare | 2 | 17 / 18 / 18 / 154 | 21 / 18 / 18 / 205 |
| saar | Rare | 3 | 19 / 19 / 20 / 174 | 29 / 20 / 22 / 296 |
| saar | Rare | 4 | 21 / 21 / 22 / 193 | 42 / 24 / 27 / 457 |
| saar | Rare | 5 | 23 / 23 / 24 / 213 | 58 / 29 / 34 / 650 |
| saar | Rare | 6 | 25 / 24 / 26 / 232 | 68 / 33 / 38 / 767 |
| saar | Rare | 7 | 32 / 26 / 28 / 331 | 77 / 35 / 42 / 875 |
| saar | Rare | 8 | 42 / 28 / 30 / 468 | 86 / 38 / 46 / 982 |
| saar | Rare | 9 | 54 / 29 / 32 / 626 | 95 / 41 / 50 / 1089 |
| saar | Rare | 10 | 99 / 44 / 54 / 1139 | 105 / 44 / 54 / 1207 |
| morga | Rare | 1 | 16 / 5 / 7 / 195 | 16 / 5 / 7 / 195 |
| morga | Rare | 2 | 18 / 6 / 8 / 220 | 22 / 6 / 9 / 272 |
| morga | Rare | 3 | 20 / 7 / 10 / 245 | 30 / 8 / 11 / 372 |
| morga | Rare | 4 | 22 / 8 / 11 / 270 | 43 / 11 / 15 / 550 |
| morga | Rare | 5 | 24 / 9 / 12 / 295 | 59 / 14 / 19 / 763 |
| morga | Rare | 6 | 26 / 11 / 14 / 320 | 69 / 16 / 22 / 893 |
| morga | Rare | 7 | 33 / 12 / 15 / 419 | 78 / 18 / 25 / 1011 |
| morga | Rare | 8 | 43 / 13 / 16 / 557 | 87 / 20 / 28 / 1130 |
| morga | Rare | 9 | 55 / 14 / 18 / 715 | 96 / 22 / 30 / 1248 |
| morga | Rare | 10 | 100 / 24 / 33 / 1300 | 106 / 24 / 33 / 1378 |
| vorka | Épique | 1 | 18 / 12 / 14 / 165 | 18 / 12 / 14 / 165 |
| vorka | Épique | 2 | 20 / 14 / 16 / 189 | 28 / 15 / 18 / 292 |
| vorka | Épique | 3 | 22 / 15 / 18 / 213 | 48 / 20 / 25 / 545 |
| vorka | Épique | 4 | 24 / 17 / 20 / 237 | 79 / 28 / 36 / 924 |
| vorka | Épique | 5 | 26 / 19 / 22 / 261 | 107 / 35 / 46 / 1278 |
| vorka | Épique | 6 | 29 / 20 / 24 / 284 | 109 / 36 / 47 / 1309 |
| vorka | Épique | 7 | 36 / 22 / 26 / 380 | 112 / 36 / 47 / 1339 |
| vorka | Épique | 8 | 45 / 24 / 28 / 513 | 114 / 37 / 48 / 1369 |
| vorka | Épique | 9 | 56 / 25 / 30 / 666 | 117 / 37 / 49 / 1400 |
| vorka | Épique | 10 | 103 / 38 / 50 / 1233 | 119 / 38 / 50 / 1430 |
| urgath | Légendaire | 1 | 21 / 6 / 8 / 225 | 21 / 6 / 8 / 225 |
| urgath | Légendaire | 2 | 23 / 7 / 9 / 252 | 34 / 8 / 11 / 399 |
| urgath | Légendaire | 3 | 25 / 8 / 11 / 279 | 56 / 13 / 17 / 704 |
| urgath | Légendaire | 4 | 28 / 10 / 12 / 307 | 86 / 18 / 25 / 1126 |
| urgath | Légendaire | 5 | 30 / 11 / 14 / 334 | 113 / 24 / 32 / 1504 |
| urgath | Légendaire | 6 | 32 / 12 / 15 / 361 | 116 / 24 / 32 / 1539 |
| urgath | Légendaire | 7 | 38 / 13 / 17 / 457 | 118 / 25 / 33 / 1573 |
| urgath | Légendaire | 8 | 46 / 15 / 18 / 591 | 121 / 25 / 34 / 1608 |
| urgath | Légendaire | 9 | 56 / 16 / 20 / 744 | 123 / 26 / 34 / 1643 |
| urgath | Légendaire | 10 | 102 / 26 / 35 / 1353 | 126 / 26 / 35 / 1678 |
| tyrak | Mythique | 1 | 23 / 8 / 12 / 245 | 23 / 8 / 12 / 245 |
| tyrak | Mythique | 2 | 25 / 9 / 13 / 273 | 39 / 11 / 16 / 462 |
| tyrak | Mythique | 3 | 28 / 10 / 15 / 302 | 64 / 15 / 23 / 803 |
| tyrak | Mythique | 4 | 30 / 11 / 16 / 330 | 97 / 21 / 31 / 1236 |
| tyrak | Mythique | 5 | 32 / 12 / 18 / 358 | 122 / 25 / 38 / 1577 |
| tyrak | Mythique | 6 | 35 / 14 / 19 / 387 | 125 / 26 / 39 / 1621 |
| tyrak | Mythique | 7 | 41 / 15 / 21 / 480 | 128 / 26 / 39 / 1664 |
| tyrak | Mythique | 8 | 49 / 16 / 22 / 610 | 132 / 27 / 40 / 1707 |
| tyrak | Mythique | 9 | 58 / 17 / 24 / 759 | 135 / 27 / 41 / 1751 |
| tyrak | Mythique | 10 | 106 / 28 / 42 / 1380 | 138 / 28 / 42 / 1794 |


XP inchangée : 120/180/300/450/650/850/1100/1400/1800 ; cumul 6850. Prix, RNG, chances Mythique normal 0,01 % / Faille 2 % et récompenses Phase 2 conservés ; aucune pity nouvelle. Le seul budget ennemi retouché est C1 Faille, section H.

## C. Matrice rareté vs niveau

| Gauche | N | Droite | N | Kit égal | Avant %gauche | Après %gauche | Graines |
| --- | --- | --- | --- | --- | --- | --- | --- |
| karg | 10 | vorka | 5 | Aucun | 100.00 | 39.40 | 5000 |
| naya | 10 | vorka | 5 | Aucun | 100.00 | 24.30 | 5000 |
| brakk | 10 | vorka | 5 | Aucun | 100.00 | 46.54 | 5000 |
| eyla | 10 | vorka | 5 | Aucun | 100.00 | 37.50 | 5000 |
| karg | 10 | vorka | 5 | Marteau + Carapace | 100.00 | 45.34 | 5000 |
| naya | 10 | vorka | 5 | Marteau + Carapace | 100.00 | 45.00 | 5000 |
| brakk | 10 | vorka | 5 | Marteau + Carapace | 100.00 | 50.20 | 5000 |
| eyla | 10 | vorka | 5 | Marteau + Carapace | 100.00 | 45.06 | 5000 |
| karg | 10 | vorka | 5 | Cœur + Peau | 100.00 | 48.56 | 5000 |
| naya | 10 | vorka | 5 | Cœur + Peau | 100.00 | 60.38 | 5000 |
| brakk | 10 | vorka | 5 | Cœur + Peau | 100.00 | 57.16 | 5000 |
| eyla | 10 | vorka | 5 | Cœur + Peau | 100.00 | 49.32 | 5000 |
| karg | 10 | urgath | 5 | Aucun | 100.00 | 32.32 | 5000 |
| naya | 10 | urgath | 5 | Aucun | 100.00 | 16.22 | 5000 |
| brakk | 10 | urgath | 5 | Aucun | 100.00 | 39.10 | 5000 |
| eyla | 10 | urgath | 5 | Aucun | 100.00 | 30.72 | 5000 |
| karg | 10 | urgath | 5 | Marteau + Carapace | 100.00 | 44.74 | 5000 |
| naya | 10 | urgath | 5 | Marteau + Carapace | 100.00 | 43.14 | 5000 |
| brakk | 10 | urgath | 5 | Marteau + Carapace | 100.00 | 49.46 | 5000 |
| eyla | 10 | urgath | 5 | Marteau + Carapace | 100.00 | 45.76 | 5000 |
| karg | 10 | urgath | 5 | Cœur + Peau | 100.00 | 47.78 | 5000 |
| naya | 10 | urgath | 5 | Cœur + Peau | 100.00 | 58.42 | 5000 |
| brakk | 10 | urgath | 5 | Cœur + Peau | 100.00 | 55.14 | 5000 |
| eyla | 10 | urgath | 5 | Cœur + Peau | 100.00 | 47.58 | 5000 |
| karg | 10 | tyrak | 5 | Aucun | 100.00 | 16.90 | 5000 |
| naya | 10 | tyrak | 5 | Aucun | 100.00 | 8.26 | 5000 |
| brakk | 10 | tyrak | 5 | Aucun | 100.00 | 19.84 | 5000 |
| eyla | 10 | tyrak | 5 | Aucun | 100.00 | 14.36 | 5000 |
| karg | 10 | tyrak | 5 | Marteau + Carapace | 100.00 | 30.04 | 5000 |
| naya | 10 | tyrak | 5 | Marteau + Carapace | 100.00 | 28.36 | 5000 |
| brakk | 10 | tyrak | 5 | Marteau + Carapace | 100.00 | 32.78 | 5000 |
| eyla | 10 | tyrak | 5 | Marteau + Carapace | 100.00 | 28.42 | 5000 |
| karg | 10 | tyrak | 5 | Cœur + Peau | 100.00 | 36.30 | 5000 |
| naya | 10 | tyrak | 5 | Cœur + Peau | 100.00 | 48.00 | 5000 |
| brakk | 10 | tyrak | 5 | Cœur + Peau | 100.00 | 42.26 | 5000 |
| eyla | 10 | tyrak | 5 | Cœur + Peau | 100.00 | 35.38 | 5000 |
| karg | 8 | saar | 6 | Aucun | 99.58 | 0.10 | 5000 |
| karg | 8 | morga | 6 | Aucun | 99.22 | 0.00 | 5000 |
| naya | 8 | saar | 6 | Aucun | 96.22 | 0.00 | 5000 |
| naya | 8 | morga | 6 | Aucun | 91.48 | 0.00 | 5000 |
| brakk | 8 | saar | 6 | Aucun | 99.92 | 0.04 | 5000 |
| brakk | 8 | morga | 6 | Aucun | 99.72 | 0.10 | 5000 |
| eyla | 8 | saar | 6 | Aucun | 99.54 | 0.06 | 5000 |
| eyla | 8 | morga | 6 | Aucun | 99.38 | 0.02 | 5000 |
| karg | 8 | saar | 6 | Marteau + Carapace | 92.36 | 2.26 | 5000 |
| karg | 8 | morga | 6 | Marteau + Carapace | 94.12 | 3.16 | 5000 |
| naya | 8 | saar | 6 | Marteau + Carapace | 89.10 | 1.90 | 5000 |
| naya | 8 | morga | 6 | Marteau + Carapace | 90.70 | 2.66 | 5000 |
| brakk | 8 | saar | 6 | Marteau + Carapace | 93.88 | 2.40 | 5000 |
| brakk | 8 | morga | 6 | Marteau + Carapace | 95.68 | 4.06 | 5000 |
| eyla | 8 | saar | 6 | Marteau + Carapace | 93.08 | 2.74 | 5000 |
| eyla | 8 | morga | 6 | Marteau + Carapace | 95.86 | 4.16 | 5000 |
| karg | 8 | saar | 6 | Cœur + Peau | 85.82 | 8.16 | 5000 |
| karg | 8 | morga | 6 | Cœur + Peau | 87.60 | 10.44 | 5000 |
| naya | 8 | saar | 6 | Cœur + Peau | 91.28 | 16.50 | 5000 |
| naya | 8 | morga | 6 | Cœur + Peau | 92.00 | 19.04 | 5000 |
| brakk | 8 | saar | 6 | Cœur + Peau | 89.90 | 10.54 | 5000 |
| brakk | 8 | morga | 6 | Cœur + Peau | 91.14 | 11.82 | 5000 |
| eyla | 8 | saar | 6 | Cœur + Peau | 88.10 | 9.96 | 5000 |
| eyla | 8 | morga | 6 | Cœur + Peau | 90.38 | 12.04 | 5000 |
| karg | 8 | vorka | 5 | Aucun | 99.40 | 0.00 | 5000 |
| naya | 8 | vorka | 5 | Aucun | 93.56 | 0.00 | 5000 |
| brakk | 8 | vorka | 5 | Aucun | 99.84 | 0.00 | 5000 |
| eyla | 8 | vorka | 5 | Aucun | 99.50 | 0.00 | 5000 |
| karg | 8 | vorka | 5 | Marteau + Carapace | 91.12 | 0.00 | 5000 |
| naya | 8 | vorka | 5 | Marteau + Carapace | 85.86 | 0.02 | 5000 |
| brakk | 8 | vorka | 5 | Marteau + Carapace | 92.96 | 0.00 | 5000 |
| eyla | 8 | vorka | 5 | Marteau + Carapace | 92.76 | 0.00 | 5000 |
| karg | 8 | vorka | 5 | Cœur + Peau | 83.08 | 0.00 | 5000 |
| naya | 8 | vorka | 5 | Cœur + Peau | 89.22 | 0.66 | 5000 |
| brakk | 8 | vorka | 5 | Cœur + Peau | 87.66 | 0.14 | 5000 |
| eyla | 8 | vorka | 5 | Cœur + Peau | 85.80 | 0.06 | 5000 |
| asha | 8 | saar | 6 | Aucun | 99.80 | 42.78 | 5000 |
| asha | 8 | morga | 6 | Aucun | 99.70 | 45.94 | 5000 |
| rhex | 8 | saar | 6 | Aucun | 99.72 | 49.90 | 5000 |
| rhex | 8 | morga | 6 | Aucun | 99.66 | 52.92 | 5000 |
| ursak | 8 | saar | 6 | Aucun | 100.00 | 50.18 | 5000 |
| ursak | 8 | morga | 6 | Aucun | 99.94 | 50.28 | 5000 |
| asha | 8 | saar | 6 | Marteau + Carapace | 93.70 | 47.34 | 5000 |
| asha | 8 | morga | 6 | Marteau + Carapace | 95.86 | 56.82 | 5000 |
| rhex | 8 | saar | 6 | Marteau + Carapace | 94.52 | 54.78 | 5000 |
| rhex | 8 | morga | 6 | Marteau + Carapace | 96.98 | 65.90 | 5000 |
| ursak | 8 | saar | 6 | Marteau + Carapace | 97.06 | 50.58 | 5000 |
| ursak | 8 | morga | 6 | Marteau + Carapace | 97.64 | 60.56 | 5000 |
| asha | 8 | saar | 6 | Cœur + Peau | 88.48 | 51.02 | 5000 |
| asha | 8 | morga | 6 | Cœur + Peau | 89.66 | 57.00 | 5000 |
| rhex | 8 | saar | 6 | Cœur + Peau | 89.38 | 55.70 | 5000 |
| rhex | 8 | morga | 6 | Cœur + Peau | 91.88 | 62.80 | 5000 |
| ursak | 8 | saar | 6 | Cœur + Peau | 92.58 | 55.84 | 5000 |
| ursak | 8 | morga | 6 | Cœur + Peau | 94.02 | 61.28 | 5000 |
| asha | 8 | vorka | 5 | Aucun | 99.58 | 0.00 | 5000 |
| rhex | 8 | vorka | 5 | Aucun | 99.70 | 0.02 | 5000 |
| ursak | 8 | vorka | 5 | Aucun | 99.98 | 0.00 | 5000 |
| asha | 8 | vorka | 5 | Marteau + Carapace | 92.94 | 0.50 | 5000 |
| rhex | 8 | vorka | 5 | Marteau + Carapace | 94.66 | 1.06 | 5000 |
| ursak | 8 | vorka | 5 | Marteau + Carapace | 96.96 | 0.34 | 5000 |
| asha | 8 | vorka | 5 | Cœur + Peau | 86.08 | 3.08 | 5000 |
| rhex | 8 | vorka | 5 | Cœur + Peau | 87.92 | 3.96 | 5000 |
| ursak | 8 | vorka | 5 | Cœur + Peau | 91.34 | 2.92 | 5000 |
| saar | 7 | vorka | 5 | Aucun | 88.82 | 0.90 | 5000 |
| morga | 7 | vorka | 5 | Aucun | 94.50 | 0.62 | 5000 |
| saar | 7 | vorka | 5 | Marteau + Carapace | 75.96 | 4.10 | 5000 |
| morga | 7 | vorka | 5 | Marteau + Carapace | 74.44 | 1.84 | 5000 |
| saar | 7 | vorka | 5 | Cœur + Peau | 67.92 | 9.28 | 5000 |
| morga | 7 | vorka | 5 | Cœur + Peau | 69.08 | 7.06 | 5000 |
| saar | 7 | urgath | 5 | Aucun | 75.76 | 0.58 | 5000 |
| morga | 7 | urgath | 5 | Aucun | 87.20 | 0.22 | 5000 |
| saar | 7 | urgath | 5 | Marteau + Carapace | 77.46 | 3.34 | 5000 |
| morga | 7 | urgath | 5 | Marteau + Carapace | 74.52 | 1.74 | 5000 |
| saar | 7 | urgath | 5 | Cœur + Peau | 69.48 | 7.94 | 5000 |
| morga | 7 | urgath | 5 | Cœur + Peau | 69.36 | 5.46 | 5000 |


## D. Même niveau / identité

| Gauche | N | Droite | N | Kit égal | Avant %gauche | Après %gauche | Graines |
| --- | --- | --- | --- | --- | --- | --- | --- |
| karg | 5 | saar | 5 | Aucun | 17.06 | 0.00 | 5000 |
| karg | 5 | morga | 5 | Aucun | 5.86 | 0.00 | 5000 |
| naya | 5 | saar | 5 | Aucun | 4.84 | 0.00 | 5000 |
| naya | 5 | morga | 5 | Aucun | 0.64 | 0.00 | 5000 |
| brakk | 5 | saar | 5 | Aucun | 20.94 | 0.00 | 5000 |
| brakk | 5 | morga | 5 | Aucun | 7.44 | 0.00 | 5000 |
| eyla | 5 | saar | 5 | Aucun | 8.30 | 0.00 | 5000 |
| eyla | 5 | morga | 5 | Aucun | 2.18 | 0.00 | 5000 |
| karg | 5 | saar | 5 | Marteau + Carapace | 23.90 | 0.00 | 5000 |
| karg | 5 | morga | 5 | Marteau + Carapace | 27.36 | 0.00 | 5000 |
| naya | 5 | saar | 5 | Marteau + Carapace | 23.62 | 0.00 | 5000 |
| naya | 5 | morga | 5 | Marteau + Carapace | 25.76 | 0.02 | 5000 |
| brakk | 5 | saar | 5 | Marteau + Carapace | 21.36 | 0.00 | 5000 |
| brakk | 5 | morga | 5 | Marteau + Carapace | 26.10 | 0.02 | 5000 |
| eyla | 5 | saar | 5 | Marteau + Carapace | 24.94 | 0.00 | 5000 |
| eyla | 5 | morga | 5 | Marteau + Carapace | 27.86 | 0.02 | 5000 |
| karg | 5 | saar | 5 | Cœur + Peau | 32.22 | 0.28 | 5000 |
| karg | 5 | morga | 5 | Cœur + Peau | 34.30 | 0.34 | 5000 |
| naya | 5 | saar | 5 | Cœur + Peau | 29.36 | 0.26 | 5000 |
| naya | 5 | morga | 5 | Cœur + Peau | 31.46 | 0.32 | 5000 |
| brakk | 5 | saar | 5 | Cœur + Peau | 32.58 | 0.32 | 5000 |
| brakk | 5 | morga | 5 | Cœur + Peau | 33.74 | 0.24 | 5000 |
| eyla | 5 | saar | 5 | Cœur + Peau | 31.34 | 0.26 | 5000 |
| eyla | 5 | morga | 5 | Cœur + Peau | 33.20 | 0.36 | 5000 |
| karg | 5 | vorka | 5 | Aucun | 3.46 | 0.00 | 5000 |
| naya | 5 | vorka | 5 | Aucun | 0.66 | 0.00 | 5000 |
| brakk | 5 | vorka | 5 | Aucun | 4.90 | 0.00 | 5000 |
| eyla | 5 | vorka | 5 | Aucun | 1.44 | 0.00 | 5000 |
| karg | 5 | vorka | 5 | Marteau + Carapace | 15.38 | 0.00 | 5000 |
| naya | 5 | vorka | 5 | Marteau + Carapace | 13.40 | 0.00 | 5000 |
| brakk | 5 | vorka | 5 | Marteau + Carapace | 14.68 | 0.00 | 5000 |
| eyla | 5 | vorka | 5 | Marteau + Carapace | 14.82 | 0.00 | 5000 |
| karg | 5 | vorka | 5 | Cœur + Peau | 23.14 | 0.00 | 5000 |
| naya | 5 | vorka | 5 | Cœur + Peau | 20.88 | 0.00 | 5000 |
| brakk | 5 | vorka | 5 | Cœur + Peau | 22.14 | 0.00 | 5000 |
| eyla | 5 | vorka | 5 | Cœur + Peau | 22.44 | 0.00 | 5000 |
| karg | 5 | urgath | 5 | Aucun | 0.64 | 0.00 | 5000 |
| naya | 5 | urgath | 5 | Aucun | 0.02 | 0.00 | 5000 |
| brakk | 5 | urgath | 5 | Aucun | 1.20 | 0.00 | 5000 |
| eyla | 5 | urgath | 5 | Aucun | 0.04 | 0.00 | 5000 |
| karg | 5 | urgath | 5 | Marteau + Carapace | 13.70 | 0.00 | 5000 |
| naya | 5 | urgath | 5 | Marteau + Carapace | 11.46 | 0.00 | 5000 |
| brakk | 5 | urgath | 5 | Marteau + Carapace | 12.44 | 0.00 | 5000 |
| eyla | 5 | urgath | 5 | Marteau + Carapace | 13.28 | 0.00 | 5000 |
| karg | 5 | urgath | 5 | Cœur + Peau | 22.54 | 0.00 | 5000 |
| naya | 5 | urgath | 5 | Cœur + Peau | 20.62 | 0.00 | 5000 |
| brakk | 5 | urgath | 5 | Cœur + Peau | 21.68 | 0.00 | 5000 |
| eyla | 5 | urgath | 5 | Cœur + Peau | 21.56 | 0.00 | 5000 |
| karg | 5 | tyrak | 5 | Aucun | 0.14 | 0.00 | 5000 |
| naya | 5 | tyrak | 5 | Aucun | 0.00 | 0.00 | 5000 |
| brakk | 5 | tyrak | 5 | Aucun | 0.20 | 0.00 | 5000 |
| eyla | 5 | tyrak | 5 | Aucun | 0.00 | 0.00 | 5000 |
| karg | 5 | tyrak | 5 | Marteau + Carapace | 7.82 | 0.00 | 5000 |
| naya | 5 | tyrak | 5 | Marteau + Carapace | 7.00 | 0.00 | 5000 |
| brakk | 5 | tyrak | 5 | Marteau + Carapace | 6.92 | 0.00 | 5000 |
| eyla | 5 | tyrak | 5 | Marteau + Carapace | 7.48 | 0.00 | 5000 |
| karg | 5 | tyrak | 5 | Cœur + Peau | 17.88 | 0.00 | 5000 |
| naya | 5 | tyrak | 5 | Cœur + Peau | 16.20 | 0.00 | 5000 |
| brakk | 5 | tyrak | 5 | Cœur + Peau | 17.18 | 0.00 | 5000 |
| eyla | 5 | tyrak | 5 | Cœur + Peau | 17.60 | 0.00 | 5000 |
| karg | 10 | tyrak | 10 | Aucun | 22.78 | 0.62 | 5000 |
| naya | 10 | tyrak | 10 | Aucun | 10.74 | 0.34 | 5000 |
| brakk | 10 | tyrak | 10 | Aucun | 26.20 | 1.00 | 5000 |
| eyla | 10 | tyrak | 10 | Aucun | 17.76 | 0.30 | 5000 |
| karg | 10 | tyrak | 10 | Marteau + Carapace | 29.36 | 3.78 | 5000 |
| naya | 10 | tyrak | 10 | Marteau + Carapace | 27.82 | 4.10 | 5000 |
| brakk | 10 | tyrak | 10 | Marteau + Carapace | 32.54 | 3.70 | 5000 |
| eyla | 10 | tyrak | 10 | Marteau + Carapace | 26.72 | 2.38 | 5000 |
| karg | 10 | tyrak | 10 | Cœur + Peau | 34.00 | 7.12 | 5000 |
| naya | 10 | tyrak | 10 | Cœur + Peau | 44.02 | 13.66 | 5000 |
| brakk | 10 | tyrak | 10 | Cœur + Peau | 39.56 | 8.52 | 5000 |
| eyla | 10 | tyrak | 10 | Cœur + Peau | 31.62 | 5.68 | 5000 |


Même rareté :

| Gauche | Droite | Niveau | % victoire gauche |
| --- | --- | --- | --- |
| karg | naya | 5 | 77.94 |
| karg | naya | 10 | 62.96 |
| brakk | karg | 5 | 60.30 |
| brakk | karg | 10 | 59.04 |
| brakk | naya | 5 | 84.94 |
| brakk | naya | 10 | 75.36 |
| brakk | eyla | 5 | 76.18 |
| brakk | eyla | 10 | 61.12 |
| eyla | karg | 5 | 33.42 |
| eyla | karg | 10 | 49.74 |
| eyla | naya | 5 | 63.86 |
| eyla | naya | 10 | 65.46 |
| asha | rhex | 5 | 44.18 |
| asha | rhex | 10 | 46.16 |
| asha | ursak | 5 | 41.34 |
| asha | ursak | 10 | 45.62 |
| rhex | ursak | 5 | 43.94 |
| rhex | ursak | 10 | 48.08 |
| morga | saar | 5 | 48.16 |
| morga | saar | 10 | 65.74 |


Une défaite Common N5 contre un Mythique N5 est parfois presque certaine dans l’échantillon : cela ne signifie pas que toutes les confrontations le sont. Le test décisif Common N10 / Mythique N5 conserve des renversements ; le kit et les matchups déplacent les résultats. Incertitude par cellule de 5000 : environ ±1,39 point à 50 %, intervalle binomial à 95 % ; les moyennes de plusieurs classes ne représentent pas une population de matchmaking.

## E. Murs Adventure fixes

Première estimation confortable ≥60 % sur les nodes 5/10/15 avec **kit Common** ; Morgath réaliste ≥20 % avec **kit good**. Ce changement de kit au node 20 est explicite : on ne prétend pas qu’un Tyrak N4 sans équipement termine Primal. Les niveaux sont discrets, pas des verrous codés. 1000 graines par cellule PvE.

| Warrior | Rareté | Niveau5 | Niveau10 | Niveau15 | Morgath20 |
| --- | --- | --- | --- | --- | --- |
| karg | Commun | N7 (77.70 %) | N9 (96.30 %) | N10 (99.20 %) | N10 (57.70 %) |
| naya | Commun | N8 (94.50 %) | N9 (68.30 %) | N10 (95.90 %) | N10 (51.70 %) |
| brakk | Commun | N7 (84.70 %) | N9 (96.60 %) | N10 (99.60 %) | N10 (60.30 %) |
| eyla | Commun | N7 (72.20 %) | N9 (96.60 %) | N10 (99.20 %) | N10 (54.00 %) |
| asha | Peu commun | N5 (82.90 %) | N7 (93.60 %) | N9 (82.10 %) | N10 (60.30 %) |
| rhex | Peu commun | N5 (88.90 %) | N7 (94.00 %) | N9 (83.80 %) | N10 (67.40 %) |
| ursak | Peu commun | N5 (90.50 %) | N7 (96.20 %) | N9 (85.80 %) | N10 (60.80 %) |
| saar | Rare | N3 (69.10 %) | N5 (98.60 %) | N7 (65.70 %) | N9 (35.40 %) |
| morga | Rare | N3 (78.40 %) | N5 (98.90 %) | N7 (65.90 %) | N9 (29.10 %) |
| vorka | Épique | N3 (100.00 %) | N3 (82.40 %) | N4 (70.10 %) | N5 (52.30 %) |
| urgath | Légendaire | N2 (85.40 %) | N3 (95.80 %) | N4 (84.30 %) | N5 (58.30 %) |
| tyrak | Mythique | N2 (98.40 %) | N3 (99.80 %) | N4 (97.30 %) | N4 (24.10 %) |


Les 20 ennemis Normal et Némésis n’ont pas changé. Tyrak N1 nu ne bat pas Morgath dans les 1000 graines ; Urgath N3 avec kit Common ne trivialise pas Morgath. Un Mythique N5 bien équipé peut avancer plus tôt : conséquence volontaire du choix rareté-first, pas un bug compensé par scaling.

## F. Morgath Normal

N10 par Warrior / préparation :

| Warrior | Rareté | Aucun | Moyen | Bon | Endgame |
| --- | --- | --- | --- | --- | --- |
| karg | Commun | 0.00 | 9.50 | 57.70 | 82.30 |
| naya | Commun | 0.00 | 10.60 | 51.70 | 82.80 |
| brakk | Commun | 0.00 | 8.50 | 60.30 | 82.60 |
| eyla | Commun | 0.00 | 7.40 | 54.00 | 79.30 |
| asha | Peu commun | 0.00 | 12.90 | 60.30 | 85.80 |
| rhex | Peu commun | 0.10 | 18.50 | 67.40 | 86.50 |
| ursak | Peu commun | 0.00 | 11.80 | 60.80 | 88.10 |
| saar | Rare | 0.00 | 15.40 | 65.00 | 85.30 |
| morga | Rare | 0.00 | 18.10 | 78.00 | 94.50 |
| vorka | Épique | 0.80 | 33.70 | 78.60 | 93.30 |
| urgath | Légendaire | 3.40 | 53.40 | 94.10 | 99.10 |
| tyrak | Mythique | 11.40 | 69.30 | 97.40 | 99.40 |


Common N10 bien équipé : 55.92 [51.70–60.30] % ; la viabilité ne nécessite pas un Warrior Epic+. Par rareté et niveaux pertinents :

| Rareté | Niveau | Kit | Moyenne[min–max] % |
| --- | --- | --- | --- |
| Commun | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Commun | 3 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Commun | 3 | Cœur + Peau | 0.00 [0.00–0.00] |
| Commun | 5 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Commun | 5 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Commun | 5 | Cœur + Peau | 0.00 [0.00–0.00] |
| Commun | 7 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Commun | 7 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Commun | 7 | Cœur + Peau | 0.05 [0.00–0.20] |
| Commun | 9 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Commun | 9 | Griffe + Fourrure blanche | 0.25 [0.10–0.40] |
| Commun | 9 | Cœur + Peau | 3.48 [2.20–4.60] |
| Commun | 10 | Marteau + Carapace | 9.00 [7.40–10.60] |
| Commun | 10 | Griffe + Fourrure blanche | 55.92 [51.70–60.30] |
| Commun | 10 | Cœur + Peau | 81.75 [79.30–82.80] |
| Peu commun | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Peu commun | 3 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Peu commun | 3 | Cœur + Peau | 0.00 [0.00–0.00] |
| Peu commun | 5 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Peu commun | 5 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Peu commun | 5 | Cœur + Peau | 0.03 [0.00–0.10] |
| Peu commun | 7 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Peu commun | 7 | Griffe + Fourrure blanche | 0.10 [0.10–0.10] |
| Peu commun | 7 | Cœur + Peau | 1.97 [1.40–2.50] |
| Peu commun | 9 | Marteau + Carapace | 0.13 [0.00–0.20] |
| Peu commun | 9 | Griffe + Fourrure blanche | 14.03 [11.40–16.10] |
| Peu commun | 9 | Cœur + Peau | 40.33 [36.50–45.60] |
| Peu commun | 10 | Marteau + Carapace | 14.40 [11.80–18.50] |
| Peu commun | 10 | Griffe + Fourrure blanche | 62.83 [60.30–67.40] |
| Peu commun | 10 | Cœur + Peau | 86.80 [85.80–88.10] |
| Rare | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Rare | 3 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Rare | 3 | Cœur + Peau | 0.00 [0.00–0.00] |
| Rare | 5 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Rare | 5 | Griffe + Fourrure blanche | 0.15 [0.10–0.20] |
| Rare | 5 | Cœur + Peau | 2.70 [2.70–2.70] |
| Rare | 7 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Rare | 7 | Griffe + Fourrure blanche | 5.45 [4.40–6.50] |
| Rare | 7 | Cœur + Peau | 24.50 [23.30–25.70] |
| Rare | 9 | Marteau + Carapace | 1.25 [0.90–1.60] |
| Rare | 9 | Griffe + Fourrure blanche | 32.25 [29.10–35.40] |
| Rare | 9 | Cœur + Peau | 60.45 [56.80–64.10] |
| Rare | 10 | Marteau + Carapace | 16.75 [15.40–18.10] |
| Rare | 10 | Griffe + Fourrure blanche | 71.50 [65.00–78.00] |
| Rare | 10 | Cœur + Peau | 89.90 [85.30–94.50] |
| Épique | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Épique | 3 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Épique | 3 | Cœur + Peau | 0.90 [0.90–0.90] |
| Épique | 5 | Marteau + Carapace | 8.80 [8.80–8.80] |
| Épique | 5 | Griffe + Fourrure blanche | 52.30 [52.30–52.30] |
| Épique | 5 | Cœur + Peau | 80.40 [80.40–80.40] |
| Épique | 7 | Marteau + Carapace | 18.30 [18.30–18.30] |
| Épique | 7 | Griffe + Fourrure blanche | 63.90 [63.90–63.90] |
| Épique | 7 | Cœur + Peau | 86.80 [86.80–86.80] |
| Épique | 9 | Marteau + Carapace | 26.90 [26.90–26.90] |
| Épique | 9 | Griffe + Fourrure blanche | 72.40 [72.40–72.40] |
| Épique | 9 | Cœur + Peau | 91.60 [91.60–91.60] |
| Épique | 10 | Marteau + Carapace | 33.70 [33.70–33.70] |
| Épique | 10 | Griffe + Fourrure blanche | 78.60 [78.60–78.60] |
| Épique | 10 | Cœur + Peau | 93.30 [93.30–93.30] |
| Légendaire | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Légendaire | 3 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Légendaire | 3 | Cœur + Peau | 1.10 [1.10–1.10] |
| Légendaire | 5 | Marteau + Carapace | 7.00 [7.00–7.00] |
| Légendaire | 5 | Griffe + Fourrure blanche | 58.30 [58.30–58.30] |
| Légendaire | 5 | Cœur + Peau | 83.80 [83.80–83.80] |
| Légendaire | 7 | Marteau + Carapace | 22.30 [22.30–22.30] |
| Légendaire | 7 | Griffe + Fourrure blanche | 79.00 [79.00–79.00] |
| Légendaire | 7 | Cœur + Peau | 94.10 [94.10–94.10] |
| Légendaire | 9 | Marteau + Carapace | 31.60 [31.60–31.60] |
| Légendaire | 9 | Griffe + Fourrure blanche | 85.80 [85.80–85.80] |
| Légendaire | 9 | Cœur + Peau | 96.40 [96.40–96.40] |
| Légendaire | 10 | Marteau + Carapace | 53.40 [53.40–53.40] |
| Légendaire | 10 | Griffe + Fourrure blanche | 94.10 [94.10–94.10] |
| Légendaire | 10 | Cœur + Peau | 99.10 [99.10–99.10] |
| Mythique | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Mythique | 3 | Griffe + Fourrure blanche | 0.50 [0.50–0.50] |
| Mythique | 3 | Cœur + Peau | 3.90 [3.90–3.90] |
| Mythique | 5 | Marteau + Carapace | 18.80 [18.80–18.80] |
| Mythique | 5 | Griffe + Fourrure blanche | 71.50 [71.50–71.50] |
| Mythique | 5 | Cœur + Peau | 91.50 [91.50–91.50] |
| Mythique | 7 | Marteau + Carapace | 32.00 [32.00–32.00] |
| Mythique | 7 | Griffe + Fourrure blanche | 82.70 [82.70–82.70] |
| Mythique | 7 | Cœur + Peau | 96.60 [96.60–96.60] |
| Mythique | 9 | Marteau + Carapace | 48.90 [48.90–48.90] |
| Mythique | 9 | Griffe + Fourrure blanche | 90.50 [90.50–90.50] |
| Mythique | 9 | Cœur + Peau | 97.90 [97.90–97.90] |
| Mythique | 10 | Marteau + Carapace | 69.30 [69.30–69.30] |
| Mythique | 10 | Griffe + Fourrure blanche | 97.40 [97.40–97.40] |
| Mythique | 10 | Cœur + Peau | 99.40 [99.40–99.40] |


## G. Morgath Némésis

Réserve précédente : le good moyen était 26,54 % plutôt que 10–25 %, et les très hauts tiers ne se distinguaient pas. Les bandes identiques par rareté sont désormais abandonnées. Mesures nouvelles :

| Warrior | Rareté | N10 aucun | N10 moyen | N10 bon | N10 endgame |
| --- | --- | --- | --- | --- | --- |
| karg | Commun | 0.00 | 1.20 | 24.60 | 50.80 |
| naya | Commun | 0.00 | 2.10 | 23.40 | 56.90 |
| brakk | Commun | 0.00 | 1.40 | 26.20 | 50.50 |
| eyla | Commun | 0.00 | 0.50 | 21.30 | 45.90 |
| asha | Peu commun | 0.00 | 0.70 | 28.90 | 57.70 |
| rhex | Peu commun | 0.00 | 2.40 | 31.60 | 62.70 |
| ursak | Peu commun | 0.00 | 0.60 | 28.70 | 58.00 |
| saar | Rare | 0.00 | 2.30 | 29.00 | 58.10 |
| morga | Rare | 0.00 | 2.80 | 38.20 | 68.70 |
| vorka | Épique | 0.00 | 8.20 | 47.60 | 70.30 |
| urgath | Légendaire | 0.30 | 16.60 | 71.20 | 89.40 |
| tyrak | Mythique | 1.00 | 35.60 | 80.60 | 95.00 |


| Rareté | Niveau | Kit | Moyenne[min–max] % |
| --- | --- | --- | --- |
| Commun | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Commun | 3 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Commun | 3 | Cœur + Peau | 0.00 [0.00–0.00] |
| Commun | 5 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Commun | 5 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Commun | 5 | Cœur + Peau | 0.00 [0.00–0.00] |
| Commun | 7 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Commun | 7 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Commun | 7 | Cœur + Peau | 0.00 [0.00–0.00] |
| Commun | 9 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Commun | 9 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Commun | 9 | Cœur + Peau | 0.35 [0.00–0.80] |
| Peu commun | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Peu commun | 3 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Peu commun | 3 | Cœur + Peau | 0.00 [0.00–0.00] |
| Peu commun | 5 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Peu commun | 5 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Peu commun | 5 | Cœur + Peau | 0.00 [0.00–0.00] |
| Peu commun | 7 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Peu commun | 7 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Peu commun | 7 | Cœur + Peau | 0.03 [0.00–0.10] |
| Peu commun | 9 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Peu commun | 9 | Griffe + Fourrure blanche | 2.00 [1.00–3.00] |
| Peu commun | 9 | Cœur + Peau | 10.47 [9.50–12.00] |
| Rare | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Rare | 3 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Rare | 3 | Cœur + Peau | 0.00 [0.00–0.00] |
| Rare | 5 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Rare | 5 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Rare | 5 | Cœur + Peau | 0.10 [0.00–0.20] |
| Rare | 7 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Rare | 7 | Griffe + Fourrure blanche | 0.75 [0.30–1.20] |
| Rare | 7 | Cœur + Peau | 4.80 [3.90–5.70] |
| Rare | 9 | Marteau + Carapace | 0.25 [0.10–0.40] |
| Rare | 9 | Griffe + Fourrure blanche | 7.10 [6.80–7.40] |
| Rare | 9 | Cœur + Peau | 25.35 [22.20–28.50] |
| Épique | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Épique | 3 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Épique | 3 | Cœur + Peau | 0.10 [0.10–0.10] |
| Épique | 5 | Marteau + Carapace | 1.10 [1.10–1.10] |
| Épique | 5 | Griffe + Fourrure blanche | 24.00 [24.00–24.00] |
| Épique | 5 | Cœur + Peau | 45.30 [45.30–45.30] |
| Épique | 7 | Marteau + Carapace | 2.30 [2.30–2.30] |
| Épique | 7 | Griffe + Fourrure blanche | 33.00 [33.00–33.00] |
| Épique | 7 | Cœur + Peau | 56.00 [56.00–56.00] |
| Épique | 9 | Marteau + Carapace | 6.00 [6.00–6.00] |
| Épique | 9 | Griffe + Fourrure blanche | 40.50 [40.50–40.50] |
| Épique | 9 | Cœur + Peau | 65.60 [65.60–65.60] |
| Légendaire | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Légendaire | 3 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Légendaire | 3 | Cœur + Peau | 0.10 [0.10–0.10] |
| Légendaire | 5 | Marteau + Carapace | 0.90 [0.90–0.90] |
| Légendaire | 5 | Griffe + Fourrure blanche | 23.00 [23.00–23.00] |
| Légendaire | 5 | Cœur + Peau | 46.00 [46.00–46.00] |
| Légendaire | 7 | Marteau + Carapace | 3.80 [3.80–3.80] |
| Légendaire | 7 | Griffe + Fourrure blanche | 43.70 [43.70–43.70] |
| Légendaire | 7 | Cœur + Peau | 70.30 [70.30–70.30] |
| Légendaire | 9 | Marteau + Carapace | 6.20 [6.20–6.20] |
| Légendaire | 9 | Griffe + Fourrure blanche | 54.20 [54.20–54.20] |
| Légendaire | 9 | Cœur + Peau | 76.70 [76.70–76.70] |
| Mythique | 3 | Marteau + Carapace | 0.00 [0.00–0.00] |
| Mythique | 3 | Griffe + Fourrure blanche | 0.00 [0.00–0.00] |
| Mythique | 3 | Cœur + Peau | 0.10 [0.10–0.10] |
| Mythique | 5 | Marteau + Carapace | 2.90 [2.90–2.90] |
| Mythique | 5 | Griffe + Fourrure blanche | 36.70 [36.70–36.70] |
| Mythique | 5 | Cœur + Peau | 61.30 [61.30–61.30] |
| Mythique | 7 | Marteau + Carapace | 6.10 [6.10–6.10] |
| Mythique | 7 | Griffe + Fourrure blanche | 51.70 [51.70–51.70] |
| Mythique | 7 | Cœur + Peau | 75.60 [75.60–75.60] |
| Mythique | 9 | Marteau + Carapace | 12.40 [12.40–12.40] |
| Mythique | 9 | Griffe + Fourrure blanche | 62.20 [62.20–62.20] |
| Mythique | 9 | Cœur + Peau | 84.50 [84.50–84.50] |


Le Mythique N10 moyennement équipé reste loin d’une victoire garantie ; avec équipement Mythique optimisé, sa victoire peut être très probable. RNG non supprimée, niveaux/passifs et différence de préparation restent observables. Aucun ennemi personnalisé ni score d’accès.

## H. Faille early : réserve traitée

C1 ancien {Force 33, Esquive 15, Vitesse 24, PV 430} rendait pratiquement impossible la participation des Common N1–3 sans équipement. Nouveau budget fixe **14/10/14/180** ; profils des 7 ennemis, jitter ±6 %, C2→Boss, récompenses 20 pièces/40 XP, lineup, HP restaurés, calendrier et assistance existante par série de défaites restent inchangés. Ce n’est PAS une facilité réservée aux Common ni du scaling selon le joueur.

Les colonnes indiquent la probabilité INCONDITIONNELLE depuis l’entrée, à pleine difficulté 100 sans assistance. C1 n’est pas garanti pour les faibles ; C2 marque ensuite une vraie étape de préparation. Équipement Common inclus comme scénario séparé, aucune récompense offerte.

| Warrior | Rareté | Niveau | Kit | C1 % | C2 % | C3 % | C4 % | Full % |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| karg | Commun | 1 | Aucun | 5.30 | 0.00 | 0.00 | 0.00 | 0.00 |
| karg | Commun | 1 | Massue + Peaux | 23.86 | 0.00 | 0.00 | 0.00 | 0.00 |
| karg | Commun | 2 | Aucun | 14.66 | 0.00 | 0.00 | 0.00 | 0.00 |
| karg | Commun | 2 | Massue + Peaux | 42.72 | 0.00 | 0.00 | 0.00 | 0.00 |
| karg | Commun | 3 | Aucun | 37.16 | 0.00 | 0.00 | 0.00 | 0.00 |
| karg | Commun | 3 | Massue + Peaux | 67.58 | 0.00 | 0.00 | 0.00 | 0.00 |
| karg | Commun | 5 | Massue + Peaux | 90.96 | 0.00 | 0.00 | 0.00 | 0.00 |
| karg | Commun | 5 | Marteau + Carapace | 100.00 | 86.10 | 37.60 | 0.00 | 0.00 |
| naya | Commun | 1 | Aucun | 1.44 | 0.00 | 0.00 | 0.00 | 0.00 |
| naya | Commun | 1 | Massue + Peaux | 12.82 | 0.00 | 0.00 | 0.00 | 0.00 |
| naya | Commun | 2 | Aucun | 4.68 | 0.00 | 0.00 | 0.00 | 0.00 |
| naya | Commun | 2 | Massue + Peaux | 25.66 | 0.00 | 0.00 | 0.00 | 0.00 |
| naya | Commun | 3 | Aucun | 14.94 | 0.00 | 0.00 | 0.00 | 0.00 |
| naya | Commun | 3 | Massue + Peaux | 44.36 | 0.00 | 0.00 | 0.00 | 0.00 |
| naya | Commun | 5 | Massue + Peaux | 74.76 | 0.00 | 0.00 | 0.00 | 0.00 |
| naya | Commun | 5 | Marteau + Carapace | 100.00 | 84.18 | 34.18 | 0.00 | 0.00 |
| brakk | Commun | 1 | Aucun | 12.62 | 0.00 | 0.00 | 0.00 | 0.00 |
| brakk | Commun | 1 | Massue + Peaux | 39.34 | 0.00 | 0.00 | 0.00 | 0.00 |
| brakk | Commun | 2 | Aucun | 26.76 | 0.00 | 0.00 | 0.00 | 0.00 |
| brakk | Commun | 2 | Massue + Peaux | 56.54 | 0.00 | 0.00 | 0.00 | 0.00 |
| brakk | Commun | 3 | Aucun | 52.90 | 0.00 | 0.00 | 0.00 | 0.00 |
| brakk | Commun | 3 | Massue + Peaux | 78.66 | 0.00 | 0.00 | 0.00 | 0.00 |
| brakk | Commun | 5 | Massue + Peaux | 94.62 | 0.00 | 0.00 | 0.00 | 0.00 |
| brakk | Commun | 5 | Marteau + Carapace | 100.00 | 85.14 | 35.62 | 0.00 | 0.00 |
| eyla | Commun | 1 | Aucun | 3.18 | 0.00 | 0.00 | 0.00 | 0.00 |
| eyla | Commun | 1 | Massue + Peaux | 19.34 | 0.00 | 0.00 | 0.00 | 0.00 |
| eyla | Commun | 2 | Aucun | 9.42 | 0.00 | 0.00 | 0.00 | 0.00 |
| eyla | Commun | 2 | Massue + Peaux | 33.98 | 0.00 | 0.00 | 0.00 | 0.00 |
| eyla | Commun | 3 | Aucun | 24.34 | 0.00 | 0.00 | 0.00 | 0.00 |
| eyla | Commun | 3 | Massue + Peaux | 56.98 | 0.00 | 0.00 | 0.00 | 0.00 |
| eyla | Commun | 5 | Massue + Peaux | 83.94 | 0.00 | 0.00 | 0.00 | 0.00 |
| eyla | Commun | 5 | Marteau + Carapace | 100.00 | 85.82 | 37.10 | 0.00 | 0.00 |
| asha | Peu commun | 1 | Aucun | 8.18 | 0.00 | 0.00 | 0.00 | 0.00 |
| asha | Peu commun | 1 | Massue + Peaux | 31.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| asha | Peu commun | 2 | Aucun | 35.68 | 0.00 | 0.00 | 0.00 | 0.00 |
| asha | Peu commun | 2 | Massue + Peaux | 65.44 | 0.00 | 0.00 | 0.00 | 0.00 |
| asha | Peu commun | 3 | Aucun | 80.12 | 0.00 | 0.00 | 0.00 | 0.00 |
| asha | Peu commun | 3 | Massue + Peaux | 93.34 | 0.00 | 0.00 | 0.00 | 0.00 |
| asha | Peu commun | 5 | Massue + Peaux | 100.00 | 6.54 | 0.02 | 0.00 | 0.00 |
| asha | Peu commun | 5 | Marteau + Carapace | 100.00 | 99.66 | 89.24 | 0.08 | 0.00 |
| rhex | Peu commun | 1 | Aucun | 8.82 | 0.00 | 0.00 | 0.00 | 0.00 |
| rhex | Peu commun | 1 | Massue + Peaux | 32.16 | 0.00 | 0.00 | 0.00 | 0.00 |
| rhex | Peu commun | 2 | Aucun | 35.32 | 0.00 | 0.00 | 0.00 | 0.00 |
| rhex | Peu commun | 2 | Massue + Peaux | 66.42 | 0.00 | 0.00 | 0.00 | 0.00 |
| rhex | Peu commun | 3 | Aucun | 82.72 | 0.00 | 0.00 | 0.00 | 0.00 |
| rhex | Peu commun | 3 | Massue + Peaux | 94.90 | 0.00 | 0.00 | 0.00 | 0.00 |
| rhex | Peu commun | 5 | Massue + Peaux | 99.98 | 8.68 | 0.04 | 0.00 | 0.00 |
| rhex | Peu commun | 5 | Marteau + Carapace | 100.00 | 99.76 | 91.76 | 0.30 | 0.00 |
| ursak | Peu commun | 1 | Aucun | 23.92 | 0.00 | 0.00 | 0.00 | 0.00 |
| ursak | Peu commun | 1 | Massue + Peaux | 54.16 | 0.00 | 0.00 | 0.00 | 0.00 |
| ursak | Peu commun | 2 | Aucun | 59.30 | 0.00 | 0.00 | 0.00 | 0.00 |
| ursak | Peu commun | 2 | Massue + Peaux | 82.58 | 0.00 | 0.00 | 0.00 | 0.00 |
| ursak | Peu commun | 3 | Aucun | 91.76 | 0.00 | 0.00 | 0.00 | 0.00 |
| ursak | Peu commun | 3 | Massue + Peaux | 97.92 | 0.00 | 0.00 | 0.00 | 0.00 |
| ursak | Peu commun | 5 | Massue + Peaux | 100.00 | 8.32 | 0.02 | 0.00 | 0.00 |
| ursak | Peu commun | 5 | Marteau + Carapace | 100.00 | 99.90 | 92.36 | 0.06 | 0.00 |
| saar | Rare | 1 | Aucun | 34.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| saar | Rare | 1 | Massue + Peaux | 64.26 | 0.00 | 0.00 | 0.00 | 0.00 |
| saar | Rare | 2 | Aucun | 88.52 | 0.02 | 0.00 | 0.00 | 0.00 |
| saar | Rare | 2 | Massue + Peaux | 96.84 | 0.04 | 0.00 | 0.00 | 0.00 |
| saar | Rare | 3 | Aucun | 99.82 | 0.74 | 0.00 | 0.00 | 0.00 |
| saar | Rare | 3 | Massue + Peaux | 100.00 | 2.72 | 0.02 | 0.00 | 0.00 |
| saar | Rare | 5 | Massue + Peaux | 100.00 | 98.36 | 78.86 | 0.00 | 0.00 |
| saar | Rare | 5 | Marteau + Carapace | 100.00 | 100.00 | 99.98 | 30.88 | 0.00 |
| morga | Rare | 1 | Aucun | 50.98 | 0.00 | 0.00 | 0.00 | 0.00 |
| morga | Rare | 1 | Massue + Peaux | 77.34 | 0.00 | 0.00 | 0.00 | 0.00 |
| morga | Rare | 2 | Aucun | 94.68 | 0.00 | 0.00 | 0.00 | 0.00 |
| morga | Rare | 2 | Massue + Peaux | 98.88 | 0.00 | 0.00 | 0.00 | 0.00 |
| morga | Rare | 3 | Aucun | 99.90 | 0.90 | 0.00 | 0.00 | 0.00 |
| morga | Rare | 3 | Massue + Peaux | 100.00 | 2.96 | 0.00 | 0.00 | 0.00 |
| morga | Rare | 5 | Massue + Peaux | 100.00 | 98.32 | 78.72 | 0.04 | 0.00 |
| morga | Rare | 5 | Marteau + Carapace | 100.00 | 100.00 | 100.00 | 20.80 | 0.00 |
| vorka | Épique | 1 | Aucun | 58.36 | 0.00 | 0.00 | 0.00 | 0.00 |
| vorka | Épique | 1 | Massue + Peaux | 81.70 | 0.00 | 0.00 | 0.00 | 0.00 |
| vorka | Épique | 2 | Aucun | 99.60 | 0.14 | 0.00 | 0.00 | 0.00 |
| vorka | Épique | 2 | Massue + Peaux | 99.94 | 1.24 | 0.00 | 0.00 | 0.00 |
| vorka | Épique | 3 | Aucun | 100.00 | 71.84 | 17.52 | 0.00 | 0.00 |
| vorka | Épique | 3 | Massue + Peaux | 100.00 | 82.78 | 30.20 | 0.00 | 0.00 |
| vorka | Épique | 5 | Massue + Peaux | 100.00 | 100.00 | 100.00 | 81.14 | 0.14 |
| vorka | Épique | 5 | Marteau + Carapace | 100.00 | 100.00 | 100.00 | 99.78 | 13.06 |
| urgath | Légendaire | 1 | Aucun | 82.82 | 0.00 | 0.00 | 0.00 | 0.00 |
| urgath | Légendaire | 1 | Massue + Peaux | 93.76 | 0.00 | 0.00 | 0.00 | 0.00 |
| urgath | Légendaire | 2 | Aucun | 99.94 | 2.12 | 0.00 | 0.00 | 0.00 |
| urgath | Légendaire | 2 | Massue + Peaux | 100.00 | 5.38 | 0.02 | 0.00 | 0.00 |
| urgath | Légendaire | 3 | Aucun | 100.00 | 90.80 | 49.14 | 0.00 | 0.00 |
| urgath | Légendaire | 3 | Massue + Peaux | 100.00 | 95.04 | 62.50 | 0.00 | 0.00 |
| urgath | Légendaire | 5 | Massue + Peaux | 100.00 | 100.00 | 100.00 | 86.10 | 0.18 |
| urgath | Légendaire | 5 | Marteau + Carapace | 100.00 | 100.00 | 100.00 | 99.78 | 10.88 |
| tyrak | Mythique | 1 | Aucun | 93.68 | 0.00 | 0.00 | 0.00 | 0.00 |
| tyrak | Mythique | 1 | Massue + Peaux | 98.46 | 0.02 | 0.00 | 0.00 | 0.00 |
| tyrak | Mythique | 2 | Aucun | 100.00 | 15.68 | 0.14 | 0.00 | 0.00 |
| tyrak | Mythique | 2 | Massue + Peaux | 100.00 | 26.50 | 0.92 | 0.00 | 0.00 |
| tyrak | Mythique | 3 | Aucun | 100.00 | 99.28 | 84.30 | 0.02 | 0.00 |
| tyrak | Mythique | 3 | Massue + Peaux | 100.00 | 99.64 | 91.26 | 0.08 | 0.00 |
| tyrak | Mythique | 5 | Massue + Peaux | 100.00 | 100.00 | 100.00 | 95.16 | 0.86 |
| tyrak | Mythique | 5 | Marteau + Carapace | 100.00 | 100.00 | 100.00 | 99.92 | 21.94 |


Naya N1 sans équipement reste très fragile ; N3 et un premier kit rendent l’entrée nettement plus praticable. On ne transforme pas Faille en full clear early. Le même budget profite naturellement aux rares plus puissants, conformément à la philosophie choisie.

## I. Faille endgame

Moyenne uniforme des 12 Warriors N10 Cœur+Peau : **88.34 %**, contre 85,06 % Phase 2. C2→Boss inchangés. Le Mythique réussit plus facilement ; les Common gardent une chance raisonnable.

| Warrior | Rareté | N7 good full% | N10 good full% | N10 endgame full% |
| --- | --- | --- | --- | --- |
| karg | Commun | 0.00 | 57.82 | 81.64 |
| naya | Commun | 0.00 | 54.08 | 83.04 |
| brakk | Commun | 0.02 | 61.86 | 84.40 |
| eyla | Commun | 0.00 | 53.76 | 79.40 |
| asha | Peu commun | 0.20 | 62.36 | 85.52 |
| rhex | Peu commun | 0.38 | 66.14 | 87.26 |
| ursak | Peu commun | 0.16 | 64.38 | 88.00 |
| saar | Rare | 10.44 | 62.90 | 84.88 |
| morga | Rare | 8.04 | 78.18 | 93.76 |
| vorka | Épique | 67.54 | 79.48 | 93.42 |
| urgath | Légendaire | 79.94 | 94.12 | 99.06 |
| tyrak | Mythique | 83.64 | 96.70 | 99.68 |


## J. Diversité des builds

100 combinaisons × 12 Warriors × 4 profils × 1000 graines. Familles en tête observées : titan-heart / ancestor-guard ; titan-heart / primordial-titan-skin ; storm-javelin / primordial-titan-skin ; storm-javelin / ancestor-guard. Les 3 familles de Phase 2 restent pertinentes. La quatrième et les écarts faibles/proches de 100 % peuvent être de simples ex æquo/bruit ; pas une preuve qu’elle est toujours supérieure. Aucun équipement modifié dans cette passe. Cœur+Peau n’est pas un #1 universel.

| Warrior | Profil | Rang | Arme | Armure | Victoire % |
| --- | --- | --- | --- | --- | --- |
| karg | boss | 1 | titan-heart | ancestor-guard | 52.60 |
| karg | boss | 2 | storm-javelin | primordial-titan-skin | 51.80 |
| karg | boss | 3 | titan-heart | primordial-titan-skin | 51.50 |
| karg | boss | 4 | storm-javelin | ancestor-guard | 47.50 |
| karg | boss | 5 | tyrant-claw | ancestor-guard | 40.70 |
| karg | fast | 1 | titan-heart | primordial-titan-skin | 78.00 |
| karg | fast | 2 | storm-javelin | primordial-titan-skin | 77.90 |
| karg | fast | 3 | titan-heart | ancestor-guard | 77.00 |
| karg | fast | 4 | storm-javelin | ancestor-guard | 74.00 |
| karg | fast | 5 | storm-javelin | white-titan-fur | 67.10 |
| karg | tank | 1 | titan-heart | ancestor-guard | 72.10 |
| karg | tank | 2 | storm-javelin | primordial-titan-skin | 71.10 |
| karg | tank | 3 | titan-heart | primordial-titan-skin | 70.70 |
| karg | tank | 4 | storm-javelin | ancestor-guard | 65.30 |
| karg | tank | 5 | tyrant-claw | ancestor-guard | 59.80 |
| karg | dodge | 1 | storm-javelin | primordial-titan-skin | 82.80 |
| karg | dodge | 2 | titan-heart | ancestor-guard | 82.70 |
| karg | dodge | 3 | titan-heart | primordial-titan-skin | 81.50 |
| karg | dodge | 4 | storm-javelin | ancestor-guard | 80.60 |
| karg | dodge | 5 | storm-javelin | white-titan-fur | 74.10 |
| naya | boss | 1 | titan-heart | primordial-titan-skin | 56.50 |
| naya | boss | 2 | titan-heart | ancestor-guard | 50.70 |
| naya | boss | 3 | storm-javelin | primordial-titan-skin | 47.20 |
| naya | boss | 4 | tyrant-claw | primordial-titan-skin | 45.10 |
| naya | boss | 5 | tyrant-claw | ancestor-guard | 40.40 |
| naya | fast | 1 | titan-heart | primordial-titan-skin | 84.60 |
| naya | fast | 2 | storm-javelin | primordial-titan-skin | 81.50 |
| naya | fast | 3 | titan-heart | ancestor-guard | 80.00 |
| naya | fast | 4 | tyrant-claw | primordial-titan-skin | 76.70 |
| naya | fast | 5 | storm-javelin | white-titan-fur | 73.00 |
| naya | tank | 1 | titan-heart | primordial-titan-skin | 73.70 |
| naya | tank | 2 | titan-heart | ancestor-guard | 68.80 |
| naya | tank | 3 | tyrant-claw | primordial-titan-skin | 62.80 |
| naya | tank | 4 | storm-javelin | primordial-titan-skin | 61.80 |
| naya | tank | 5 | tyrant-claw | ancestor-guard | 56.20 |
| naya | dodge | 1 | titan-heart | primordial-titan-skin | 89.90 |
| naya | dodge | 2 | titan-heart | ancestor-guard | 85.90 |
| naya | dodge | 3 | storm-javelin | primordial-titan-skin | 85.60 |
| naya | dodge | 4 | tyrant-claw | primordial-titan-skin | 83.40 |
| naya | dodge | 5 | tyrant-claw | ancestor-guard | 78.70 |
| brakk | boss | 1 | titan-heart | ancestor-guard | 59.80 |
| brakk | boss | 2 | storm-javelin | primordial-titan-skin | 55.80 |
| brakk | boss | 3 | storm-javelin | ancestor-guard | 54.80 |
| brakk | boss | 4 | titan-heart | primordial-titan-skin | 52.90 |
| brakk | boss | 5 | tyrant-claw | ancestor-guard | 47.80 |
| brakk | fast | 1 | titan-heart | ancestor-guard | 87.20 |
| brakk | fast | 2 | titan-heart | primordial-titan-skin | 85.20 |
| brakk | fast | 3 | storm-javelin | primordial-titan-skin | 85.10 |
| brakk | fast | 4 | storm-javelin | ancestor-guard | 83.90 |
| brakk | fast | 5 | tyrant-claw | ancestor-guard | 79.40 |
| brakk | tank | 1 | titan-heart | ancestor-guard | 79.50 |
| brakk | tank | 2 | storm-javelin | primordial-titan-skin | 75.60 |
| brakk | tank | 3 | titan-heart | primordial-titan-skin | 75.40 |
| brakk | tank | 4 | storm-javelin | ancestor-guard | 74.50 |
| brakk | tank | 5 | tyrant-claw | ancestor-guard | 67.10 |
| brakk | dodge | 1 | titan-heart | ancestor-guard | 91.20 |
| brakk | dodge | 2 | titan-heart | primordial-titan-skin | 90.30 |
| brakk | dodge | 3 | storm-javelin | primordial-titan-skin | 90.10 |
| brakk | dodge | 4 | storm-javelin | ancestor-guard | 89.30 |
| brakk | dodge | 5 | tyrant-claw | ancestor-guard | 85.60 |
| eyla | boss | 1 | titan-heart | primordial-titan-skin | 46.10 |
| eyla | boss | 2 | titan-heart | ancestor-guard | 43.20 |
| eyla | boss | 3 | storm-javelin | primordial-titan-skin | 40.70 |
| eyla | boss | 4 | storm-javelin | ancestor-guard | 34.10 |
| eyla | boss | 5 | tyrant-claw | primordial-titan-skin | 33.40 |
| eyla | fast | 1 | titan-heart | primordial-titan-skin | 77.30 |
| eyla | fast | 2 | storm-javelin | primordial-titan-skin | 75.00 |
| eyla | fast | 3 | titan-heart | ancestor-guard | 74.60 |
| eyla | fast | 4 | storm-javelin | ancestor-guard | 71.20 |
| eyla | fast | 5 | titan-heart | white-titan-fur | 67.00 |
| eyla | tank | 1 | titan-heart | primordial-titan-skin | 69.80 |
| eyla | tank | 2 | titan-heart | ancestor-guard | 65.80 |
| eyla | tank | 3 | storm-javelin | primordial-titan-skin | 62.50 |
| eyla | tank | 4 | storm-javelin | ancestor-guard | 56.00 |
| eyla | tank | 5 | titan-heart | white-titan-fur | 54.80 |
| eyla | dodge | 1 | titan-heart | primordial-titan-skin | 86.20 |
| eyla | dodge | 2 | storm-javelin | primordial-titan-skin | 84.20 |
| eyla | dodge | 3 | titan-heart | ancestor-guard | 83.00 |
| eyla | dodge | 4 | storm-javelin | ancestor-guard | 77.50 |
| eyla | dodge | 5 | tyrant-claw | primordial-titan-skin | 76.20 |
| asha | boss | 1 | titan-heart | ancestor-guard | 58.40 |
| asha | boss | 2 | titan-heart | primordial-titan-skin | 58.40 |
| asha | boss | 3 | storm-javelin | primordial-titan-skin | 57.40 |
| asha | boss | 4 | storm-javelin | ancestor-guard | 52.40 |
| asha | boss | 5 | tyrant-claw | ancestor-guard | 46.00 |
| asha | fast | 1 | titan-heart | ancestor-guard | 84.30 |
| asha | fast | 2 | titan-heart | primordial-titan-skin | 83.00 |
| asha | fast | 3 | storm-javelin | primordial-titan-skin | 82.90 |
| asha | fast | 4 | storm-javelin | ancestor-guard | 81.20 |
| asha | fast | 5 | storm-javelin | white-titan-fur | 74.30 |
| asha | tank | 1 | titan-heart | primordial-titan-skin | 78.80 |
| asha | tank | 2 | storm-javelin | primordial-titan-skin | 77.90 |
| asha | tank | 3 | titan-heart | ancestor-guard | 77.70 |
| asha | tank | 4 | storm-javelin | ancestor-guard | 73.80 |
| asha | tank | 5 | tyrant-claw | ancestor-guard | 66.80 |
| asha | dodge | 1 | storm-javelin | primordial-titan-skin | 89.80 |
| asha | dodge | 2 | titan-heart | ancestor-guard | 88.70 |
| asha | dodge | 3 | titan-heart | primordial-titan-skin | 87.90 |
| asha | dodge | 4 | storm-javelin | ancestor-guard | 87.40 |
| asha | dodge | 5 | storm-javelin | white-titan-fur | 81.30 |
| rhex | boss | 1 | titan-heart | primordial-titan-skin | 64.20 |
| rhex | boss | 2 | titan-heart | ancestor-guard | 61.00 |
| rhex | boss | 3 | storm-javelin | primordial-titan-skin | 60.00 |
| rhex | boss | 4 | storm-javelin | ancestor-guard | 54.60 |
| rhex | boss | 5 | tyrant-claw | primordial-titan-skin | 48.90 |
| rhex | fast | 1 | titan-heart | ancestor-guard | 86.70 |
| rhex | fast | 2 | titan-heart | primordial-titan-skin | 85.90 |
| rhex | fast | 3 | storm-javelin | primordial-titan-skin | 83.30 |
| rhex | fast | 4 | storm-javelin | ancestor-guard | 80.30 |
| rhex | fast | 5 | titan-heart | white-titan-fur | 77.10 |
| rhex | tank | 1 | titan-heart | primordial-titan-skin | 81.30 |
| rhex | tank | 2 | titan-heart | ancestor-guard | 80.20 |
| rhex | tank | 3 | storm-javelin | primordial-titan-skin | 78.60 |
| rhex | tank | 4 | storm-javelin | ancestor-guard | 72.60 |
| rhex | tank | 5 | tyrant-claw | ancestor-guard | 70.60 |
| rhex | dodge | 1 | titan-heart | primordial-titan-skin | 91.30 |
| rhex | dodge | 2 | storm-javelin | primordial-titan-skin | 90.50 |
| rhex | dodge | 3 | titan-heart | ancestor-guard | 89.80 |
| rhex | dodge | 4 | storm-javelin | ancestor-guard | 88.30 |
| rhex | dodge | 5 | tyrant-claw | primordial-titan-skin | 85.00 |
| ursak | boss | 1 | storm-javelin | primordial-titan-skin | 59.70 |
| ursak | boss | 2 | titan-heart | primordial-titan-skin | 59.70 |
| ursak | boss | 3 | titan-heart | ancestor-guard | 58.70 |
| ursak | boss | 4 | storm-javelin | ancestor-guard | 55.10 |
| ursak | boss | 5 | tyrant-claw | ancestor-guard | 45.50 |
| ursak | fast | 1 | titan-heart | primordial-titan-skin | 90.90 |
| ursak | fast | 2 | storm-javelin | primordial-titan-skin | 89.90 |
| ursak | fast | 3 | titan-heart | ancestor-guard | 89.90 |
| ursak | fast | 4 | storm-javelin | ancestor-guard | 86.00 |
| ursak | fast | 5 | titan-heart | white-titan-fur | 82.40 |
| ursak | tank | 1 | titan-heart | ancestor-guard | 81.20 |
| ursak | tank | 2 | storm-javelin | primordial-titan-skin | 81.00 |
| ursak | tank | 3 | titan-heart | primordial-titan-skin | 80.20 |
| ursak | tank | 4 | storm-javelin | ancestor-guard | 74.80 |
| ursak | tank | 5 | storm-javelin | white-titan-fur | 68.50 |
| ursak | dodge | 1 | storm-javelin | primordial-titan-skin | 94.10 |
| ursak | dodge | 2 | titan-heart | primordial-titan-skin | 92.80 |
| ursak | dodge | 3 | titan-heart | ancestor-guard | 92.20 |
| ursak | dodge | 4 | storm-javelin | ancestor-guard | 90.70 |
| ursak | dodge | 5 | storm-javelin | white-titan-fur | 87.40 |
| saar | boss | 1 | titan-heart | primordial-titan-skin | 58.20 |
| saar | boss | 2 | titan-heart | ancestor-guard | 55.10 |
| saar | boss | 3 | storm-javelin | primordial-titan-skin | 54.00 |
| saar | boss | 4 | tyrant-claw | primordial-titan-skin | 47.60 |
| saar | boss | 5 | storm-javelin | ancestor-guard | 46.60 |
| saar | fast | 1 | titan-heart | primordial-titan-skin | 86.50 |
| saar | fast | 2 | storm-javelin | primordial-titan-skin | 86.10 |
| saar | fast | 3 | storm-javelin | ancestor-guard | 83.30 |
| saar | fast | 4 | titan-heart | ancestor-guard | 81.70 |
| saar | fast | 5 | tyrant-claw | primordial-titan-skin | 78.80 |
| saar | tank | 1 | titan-heart | primordial-titan-skin | 78.00 |
| saar | tank | 2 | storm-javelin | primordial-titan-skin | 75.80 |
| saar | tank | 3 | titan-heart | ancestor-guard | 75.80 |
| saar | tank | 4 | storm-javelin | ancestor-guard | 68.70 |
| saar | tank | 5 | tyrant-claw | primordial-titan-skin | 67.60 |
| saar | dodge | 1 | storm-javelin | primordial-titan-skin | 91.10 |
| saar | dodge | 2 | titan-heart | primordial-titan-skin | 90.80 |
| saar | dodge | 3 | titan-heart | ancestor-guard | 89.40 |
| saar | dodge | 4 | storm-javelin | ancestor-guard | 87.30 |
| saar | dodge | 5 | tyrant-claw | primordial-titan-skin | 84.70 |
| morga | boss | 1 | titan-heart | ancestor-guard | 75.00 |
| morga | boss | 2 | storm-javelin | primordial-titan-skin | 73.30 |
| morga | boss | 3 | storm-javelin | ancestor-guard | 72.50 |
| morga | boss | 4 | titan-heart | primordial-titan-skin | 69.10 |
| morga | boss | 5 | tyrant-claw | ancestor-guard | 63.80 |
| morga | fast | 1 | titan-heart | ancestor-guard | 95.20 |
| morga | fast | 2 | storm-javelin | primordial-titan-skin | 94.10 |
| morga | fast | 3 | titan-heart | primordial-titan-skin | 94.10 |
| morga | fast | 4 | storm-javelin | ancestor-guard | 93.20 |
| morga | fast | 5 | tyrant-claw | ancestor-guard | 91.70 |
| morga | tank | 1 | storm-javelin | primordial-titan-skin | 91.90 |
| morga | tank | 2 | titan-heart | ancestor-guard | 91.70 |
| morga | tank | 3 | storm-javelin | ancestor-guard | 89.50 |
| morga | tank | 4 | titan-heart | primordial-titan-skin | 89.00 |
| morga | tank | 5 | storm-javelin | white-titan-fur | 85.80 |
| morga | dodge | 1 | storm-javelin | primordial-titan-skin | 97.00 |
| morga | dodge | 2 | titan-heart | ancestor-guard | 97.00 |
| morga | dodge | 3 | storm-javelin | ancestor-guard | 96.90 |
| morga | dodge | 4 | titan-heart | primordial-titan-skin | 95.10 |
| morga | dodge | 5 | tyrant-claw | ancestor-guard | 94.20 |
| vorka | boss | 1 | titan-heart | ancestor-guard | 75.70 |
| vorka | boss | 2 | storm-javelin | primordial-titan-skin | 72.90 |
| vorka | boss | 3 | titan-heart | primordial-titan-skin | 72.60 |
| vorka | boss | 4 | storm-javelin | ancestor-guard | 70.10 |
| vorka | boss | 5 | tyrant-claw | ancestor-guard | 64.70 |
| vorka | fast | 1 | storm-javelin | primordial-titan-skin | 94.20 |
| vorka | fast | 2 | titan-heart | ancestor-guard | 92.20 |
| vorka | fast | 3 | titan-heart | primordial-titan-skin | 91.40 |
| vorka | fast | 4 | storm-javelin | ancestor-guard | 90.70 |
| vorka | fast | 5 | storm-javelin | white-titan-fur | 87.50 |
| vorka | tank | 1 | titan-heart | primordial-titan-skin | 91.10 |
| vorka | tank | 2 | titan-heart | ancestor-guard | 90.40 |
| vorka | tank | 3 | storm-javelin | primordial-titan-skin | 89.80 |
| vorka | tank | 4 | storm-javelin | ancestor-guard | 87.80 |
| vorka | tank | 5 | tyrant-claw | primordial-titan-skin | 83.30 |
| vorka | dodge | 1 | storm-javelin | primordial-titan-skin | 95.40 |
| vorka | dodge | 2 | titan-heart | ancestor-guard | 95.30 |
| vorka | dodge | 3 | titan-heart | primordial-titan-skin | 95.30 |
| vorka | dodge | 4 | storm-javelin | ancestor-guard | 94.00 |
| vorka | dodge | 5 | tyrant-claw | primordial-titan-skin | 92.10 |
| urgath | boss | 1 | titan-heart | ancestor-guard | 92.40 |
| urgath | boss | 2 | storm-javelin | ancestor-guard | 91.00 |
| urgath | boss | 3 | storm-javelin | primordial-titan-skin | 90.00 |
| urgath | boss | 4 | titan-heart | primordial-titan-skin | 89.70 |
| urgath | boss | 5 | tyrant-claw | ancestor-guard | 86.00 |
| urgath | fast | 1 | storm-javelin | ancestor-guard | 99.40 |
| urgath | fast | 2 | titan-heart | ancestor-guard | 99.20 |
| urgath | fast | 3 | storm-javelin | primordial-titan-skin | 99.10 |
| urgath | fast | 4 | titan-heart | primordial-titan-skin | 98.90 |
| urgath | fast | 5 | tyrant-claw | ancestor-guard | 98.40 |
| urgath | tank | 1 | storm-javelin | ancestor-guard | 98.90 |
| urgath | tank | 2 | storm-javelin | primordial-titan-skin | 98.90 |
| urgath | tank | 3 | titan-heart | primordial-titan-skin | 98.70 |
| urgath | tank | 4 | titan-heart | ancestor-guard | 98.10 |
| urgath | tank | 5 | storm-javelin | white-titan-fur | 97.70 |
| urgath | dodge | 1 | storm-javelin | ancestor-guard | 99.80 |
| urgath | dodge | 2 | titan-heart | ancestor-guard | 99.60 |
| urgath | dodge | 3 | storm-javelin | primordial-titan-skin | 99.50 |
| urgath | dodge | 4 | titan-heart | primordial-titan-skin | 99.40 |
| urgath | dodge | 5 | storm-javelin | white-titan-fur | 99.10 |
| tyrak | boss | 1 | titan-heart | ancestor-guard | 94.90 |
| tyrak | boss | 2 | storm-javelin | primordial-titan-skin | 94.40 |
| tyrak | boss | 3 | storm-javelin | ancestor-guard | 94.10 |
| tyrak | boss | 4 | titan-heart | primordial-titan-skin | 94.00 |
| tyrak | boss | 5 | tyrant-claw | ancestor-guard | 91.90 |
| tyrak | fast | 1 | storm-javelin | ancestor-guard | 99.80 |
| tyrak | fast | 2 | storm-javelin | primordial-titan-skin | 99.70 |
| tyrak | fast | 3 | titan-heart | ancestor-guard | 99.70 |
| tyrak | fast | 4 | titan-heart | primordial-titan-skin | 99.70 |
| tyrak | fast | 5 | tyrant-claw | ancestor-guard | 99.50 |
| tyrak | tank | 1 | storm-javelin | primordial-titan-skin | 99.50 |
| tyrak | tank | 2 | titan-heart | ancestor-guard | 99.50 |
| tyrak | tank | 3 | titan-heart | primordial-titan-skin | 99.50 |
| tyrak | tank | 4 | storm-javelin | ancestor-guard | 99.40 |
| tyrak | tank | 5 | storm-javelin | white-titan-fur | 99.20 |
| tyrak | dodge | 1 | storm-javelin | primordial-titan-skin | 100.00 |
| tyrak | dodge | 2 | storm-javelin | ancestor-guard | 99.80 |
| tyrak | dodge | 3 | titan-heart | ancestor-guard | 99.80 |
| tyrak | dodge | 4 | storm-javelin | white-titan-fur | 99.70 |
| tyrak | dodge | 5 | tyrant-claw | ancestor-guard | 99.60 |


## K. Carrières / pacing

3840 carrières × 60 jours, 128/cellule, calendrier/stratégies/seeds Phase 2 inchangés. Main = Warrior welcome initial, pas de switch automatique vers un Mythique tiré plus tard. Duel analytique à même niveau/kit avec les chances du roster, aucune population réelle créée. XP et règlements runtime, pas de catch-up. Observations censurées : ne pas transformer les non-finisseurs en victoires.

| Profil | Stratégie | N10 médiane[P10–P90] (observés) | Morgath Normal | Morgath Némésis |
| --- | --- | --- | --- | --- |
| casual | A-warrior | 8 [5–9] (128/128) | 24 [9–46] (107/128) | 35 [19–54] (68/128) |
| casual | B-equipment | 6 [5–7] (128/128) | 7 [5–19] (128/128) | 13 [10–28] (128/128) |
| casual | C-balanced | 6 [5–8] (128/128) | 10 [6–23] (127/128) | 18 [12–34] (126/128) |
| casual | D-main | 6 [5–7] (128/128) | 12 [6–27] (128/128) | 20 [12–38] (127/128) |
| casual | E-collection | 13 [10–17] (128/128) | 17 [11–31] (125/128) | 28 [17–45] (115/128) |
| casual | F-no-duel | 7 [5–8] (128/128) | 10 [6–26] (126/128) | 20 [9–41] (125/128) |
| casual | G-no-rift | 7 [6–9] (128/128) | 11 [7–29] (128/128) | 20 [9–45] (125/128) |
| casual | H-no-expedition | 13 [10–17] (128/128) | 17 [11–35] (124/128) | 26 [17–47] (109/128) |
| casual | budget-75 | 7 [5–9] (128/128) | 15 [6–33] (127/128) | 29 [14–48] (120/128) |
| casual | budget-25 | 6 [5–7] (128/128) | 9 [5–18] (128/128) | 16 [11–32] (127/128) |
| regular | A-warrior | 6 [4–8] (128/128) | 24 [9–48] (107/128) | 34 [16–54] (63/128) |
| regular | B-equipment | 5 [4–6] (128/128) | 7 [4–13] (128/128) | 8 [6–19] (128/128) |
| regular | C-balanced | 5 [4–6] (128/128) | 8 [5–18] (128/128) | 13 [7–28] (128/128) |
| regular | D-main | 5 [4–6] (128/128) | 8 [4–21] (128/128) | 14 [6–28] (128/128) |
| regular | E-collection | 8 [6–10] (128/128) | 12 [7–27] (127/128) | 20 [11–42] (126/128) |
| regular | F-no-duel | 6 [5–7] (128/128) | 9 [5–19] (128/128) | 15 [7–31] (127/128) |
| regular | G-no-rift | 6 [5–7] (128/128) | 10 [5–25] (127/128) | 17 [7–39] (126/128) |
| regular | H-no-expedition | 8 [6–10] (128/128) | 11 [7–28] (128/128) | 18 [9–36] (127/128) |
| regular | budget-75 | 5 [4–7] (128/128) | 11 [5–31] (126/128) | 20 [8–45] (120/128) |
| regular | budget-25 | 5 [4–6] (128/128) | 7 [4–14] (128/128) | 11 [6–21] (127/128) |
| active | A-warrior | 7 [4–7] (128/128) | 31 [12–51] (82/128) | 36 [32–57] (7/128) |
| active | B-equipment | 4 [4–5] (128/128) | 4 [4–8] (128/128) | 6 [4–10] (128/128) |
| active | C-balanced | 4 [4–5] (128/128) | 5 [4–11] (128/128) | 8 [5–19] (128/128) |
| active | D-main | 4 [3–4] (128/128) | 5 [3–10] (128/128) | 7 [4–18] (128/128) |
| active | E-collection | 6 [4–7] (128/128) | 9 [5–17] (128/128) | 13 [6–27] (128/128) |
| active | F-no-duel | 5 [5–6] (128/128) | 7 [5–14] (128/128) | 9 [5–19] (128/128) |
| active | G-no-rift | 5 [4–6] (128/128) | 7 [5–15] (128/128) | 10 [6–22] (128/128) |
| active | H-no-expedition | 5 [4–6] (128/128) | 6 [5–13] (128/128) | 9 [5–19] (128/128) |
| active | budget-75 | 5 [4–6] (128/128) | 7 [4–21] (128/128) | 12 [5–32] (128/128) |
| active | budget-25 | 4 [4–5] (128/128) | 5 [4–9] (128/128) | 7 [4–12] (128/128) |


Régulier équilibré 5 [4–6] (128/128), sans Expédition 8 [6–10] (128/128), sans Duel 6 [5–7] (128/128), sans Faille 6 [5–7] (128/128). Aucun ajustement XP/coins/quotas demandé par ces nouvelles mesures.

## L. Économie INDÉPENDANTE

1536 comptes synthétiques établis × 90 jours ; warm-up 30 jours, mesure 31–90 (60 jours), 128/cellule. Vrai wallet initial 0, vrais combats/tirages/remboursements, assertion quotidienne soldeInitial + crédits − achats = soldeFinal. Aucun jackpot Boss, badge, welcome, première victoire globale ni achat/remboursement induit par ces jackpots. Les coffres Faille/Exp récurrents restent légitimes. Ce n’est pas l’ancienne correction comptable 4,84.

Hypothèses : main N10 selon les chances welcome, 7 Common/Uncommon acquis, Normal terminé/Némésis débloqué, 15 replays Némésis 1, 10 Duels analytiques, 1 Faille, Expédition du secondaire. Brackets de gear fixés séparément : moyen/bon/endgame. Ces équipements initiaux ne sont PAS des gains quotidiens ni une promesse d’acquisition à J1. La mesure conditionne un compte établi, pas la progression d’un nouveau compte. Vrais succès/échecs et assistance Faille historique conservés.

- Independent wallet simulation, not Phase2 accounting correction.
- Established N10 main sampled from normal welcome odds;7Common/Uncommon already owned, no free currency.
- Preparation brackets medium/good/endgame held fixed; not the rarity acquisition probability or a fresh-player forecast.
- Only replay Némésis1 income, genuine Rift outcomes/pity and Expedition/stored chests.
- All first-clear/Boss/badge/welcome payouts and their induced refunds absent.
- 10 same-level/gear analytical Duel opponents drawn from normal odds; not real population telemetry.
- Spending Warrior80/20%, balanced50/50, equipment25/75 and exclusive100% by cumulative gross currency; all surplus gear manually recycled.
- 15–30 minute daily session;30s/fight and30s/chest+3min overhead. Estimated durations reported rather than assumed.
- Secondary sent for next24h; recall interval reflects actual time spent playing.
- Zero opening wallet, draws/refunds cascade genuinely until insufficient currency; no accounting adjustment.

## M. Coffres/jour et budgets

"Orienté Warrior" = 80 % du budget brut en Warrior, 20 % équipement ; équilibré 50/50 ; équipement 25/75 ; exclusif 100 % Warrior séparé. Le choix est explicite, pas un quota artificiel de 5 tirages. Tous les surplus sont recyclés manuellement. Les crédits totaux incluent les remboursements ; les crédits d’activités sont présentés séparément pour éviter de les compter deux fois.

| Gear | Stratégie | Coins activités/j | Coins crédités incl.recycle/j | Coins dépensés/j | W payants/j | E payants/j | Recycle W/j | Recycle E/j | Solde fin/j moyen | Minutes estimées/j |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Marteau + Carapace | warrior | 334.77 | 508.38 | 508.32 | 4.07 | 4.07 | 152.52 | 21.09 | 52.76 | 22.07 |
| Marteau + Carapace | balanced | 334.65 | 481.04 | 481.02 | 2.40 | 9.62 | 102.60 | 43.78 | 37.92 | 24.01 |
| Marteau + Carapace | equipment | 334.68 | 460.77 | 460.80 | 1.15 | 13.82 | 64.83 | 61.26 | 25.84 | 25.49 |
| Marteau + Carapace | exclusive | 334.85 | 529.07 | 529.09 | 5.29 | 0.00 | 189.88 | 4.34 | 62.24 | 20.64 |
| Griffe + Fourrure blanche | warrior | 342.27 | 569.83 | 569.82 | 4.56 | 4.56 | 204.49 | 23.07 | 53.40 | 22.56 |
| Griffe + Fourrure blanche | balanced | 342.65 | 541.47 | 541.50 | 2.71 | 10.83 | 149.83 | 48.99 | 37.76 | 24.77 |
| Griffe + Fourrure blanche | equipment | 342.67 | 519.22 | 519.31 | 1.30 | 15.58 | 108.01 | 68.55 | 25.17 | 26.44 |
| Griffe + Fourrure blanche | exclusive | 342.61 | 593.46 | 593.53 | 5.93 | 0.00 | 246.59 | 4.27 | 62.31 | 20.97 |
| Cœur + Peau | warrior | 346.41 | 602.57 | 602.60 | 4.82 | 4.82 | 232.01 | 24.15 | 52.84 | 22.82 |
| Cœur + Peau | balanced | 346.22 | 572.03 | 571.99 | 2.86 | 11.44 | 174.53 | 51.28 | 37.29 | 25.15 |
| Cœur + Peau | equipment | 345.90 | 545.63 | 545.60 | 1.36 | 16.37 | 128.04 | 71.69 | 25.49 | 26.87 |
| Cœur + Peau | exclusive | 346.75 | 631.70 | 631.76 | 6.32 | 0.00 | 280.72 | 4.23 | 62.25 | 21.16 |


La stratégie orientée avec gear good mesure 4.56 W payants/j. **La stratégie exclusivement Warrior produit davantage** : 5.93 avec good / 6.32 en endgame. Donc 4,84 ne doit jamais être présenté comme le résultat universel du 100 % Warrior. La cible approximative 4–5 est atteinte avec un budget équipement réel, pas un plafond de revenu. Aucune économie runtime retouchée pour forcer ce chiffre. Préparation forte, recyclages et cadeaux récurrents créent une borne supérieure plus généreuse ; c’est une réserve explicite à juger humainement, pas un résultat caché.

## N. Sauvegardes / stats legacy

Aucune nouvelle migration de format ni de clé. Version 6 Phase 2 conservée. Niveau/XP/identité persistés, stats dérivées par getWarriorLevelStats dans Hub/Collection/combat/Duel serveur. Une ancienne sauvegarde Tyrak N5 XP123 reçoit les nouvelles stats N5 sans reset, sans cadeau XP, sans stocker l’ancien bonusStats. Loadouts, inventaire, personalClears, séquences, réserves et reçus conservés. Tests v2/v5/v6, cap 15, plafond XP, badges et recycle existants restent actifs.

## O. Cloud / admin

V0.14 CAS/losesProgress/dirty cache/retry/tests de conflits et nouveau stockage conservés. Aucun vrai compte connecté, aucune sync distante effectuée : validation mock du cloud, pas un test de deux comptes Supabase en production. Admin local uniquement, sauvegarde séparée, pas de cloud. QA DEV en mémoire, sans persistance. Ajout minimal qaKit=none/common/medium/good/endgame pour inspecter les vrais bonus sans polluer la carrière ; n’agit pas hors QA.

## P. Tests / build / QA

| Commande | Résultat |
| --- | --- |
| pnpm test | OK |
| pnpm run lint | OK |
| pnpm exec tsc -b --pretty false | OK |
| pnpm run build (client, PWA, build:duel-edge) | OK |
| git diff --check | OK |


309 tests, 39 fichiers. Tests historiques de murs désormais limités aux Common (bandes conservées), tests supplémentaires de rareté et préparation pour les autres tiers : ce n’est pas une suppression des garde-fous PvE. Le test de croissance conserve les 40 tuples Common, N1 des 12 et la monotonie. Client/PWA et Duel Edge reconstruits avec les mêmes stats. Warning chunk >500k accepté et non corrigé. SQL005 reste uniquement inspecté/testé par contrat statique, non exécuté sur PostgreSQL ; compilation Edge ≠ test Deno/sécurité déployée.

Navigateur : Hub et combat vérifiés à 320×844, 390×844, 768×1024 et 1440×900 : aucun overflow horizontal ni image cassée. Tyrak N5 nu, vrai combat Common N10/Tyrak N5, first-clear personnel, recyclage et Duel preview revalidés. Console warnings/errors vide. URL normale = écran de connexion ; aucun compte utilisé. HTTP 200 confirmé sur http://127.0.0.1:5173/. Quatre viewports 320/390/768/1440 ; stats canoniques Tyrak N5 sans équipement 122/25/38/1577 confirmées, HUD/combat/résultat conservés, console sans erreur observée. Les vrais combats seed42 Common N10 good et Tyrak N5 good peuvent perdre ; aucune issue forcée pour la QA. Screenshots et logs ignorés dans qa-output.

Total combats moteur : 33218380 (matrices, carrières et économie indépendante, hors probes/tests). Chaque simulation fige/hache ses sources et vérifie qu’elles ne changent pas pendant le run. Les artifacts Phase2 historiques n’ont pas été remplacés ; les sorties finales sont séparées.

## Q. Réserves / décision

**V0.15 READY TO CLOSE** pour validation humaine. Aucun blocage local restant identifié par les critères retenus.

Réserves transparentes, non cosmétiques : hypothèses de population Duel ; économies conditionnelles à un compte N10 équipé (pas à J1) ; dépense 100 % Warrior plus généreuse que 4–5 ; Naya N1 sans équipement toujours fragile en Faille ; taux proches de 100 % des Legendary/Mythic optimisés ; écarts faibles entre builds non statistiquement résolus. La philosophie choisie accepte l’avantage PvE des rares. Aucun nerf caché ou scaling de l’ennemi pour compenser. Le backend n’est pas certifié avant les essais d’intégration à faire après approbation.

## R. Backend : ordre exact APRÈS validation

1. Tester dans Supabase TEST la migration [005](../supabase/migrations/202610050005_v015_daily_duel.sql) après 001–004, sans rejouer les historiques : 11e Duel bloqué, idempotence même UUID, deux appareils/CAS/retry, minuit Paris/DST.
2. Suspendre les Duels pendant la bascule pour que l’ancienEdge ne finalise pas avec les anciens rewards.
3. Appliquer uniquement 202610050005_v015_daily_duel.sql une fois.
4. Déployer ensemble supabase/functions/duel/index.ts et engine.js reconstruits (les stats rareté sont aussi dansengine.js).
5. Déployer ensuite le frontend correspondant, vérifier limitRule=daily-v015,resetAt/quota10, puis rouvrir.
6. Conserver JWT/getUser, RLS/grants serviceRole privés, mêmes variables et secrets, RNG serveur, CAS et reçus UUID. Ne rien rendre public ni ajouter de secret VITE.

Aucune de ces opérations effectuée. Aucun deploy, remotechange niGitwrite.

## S. Checklist humaine (10)

1. Common N10 face à Epic/Legend/Mythic N5 : favori rare, renversement possible.
2. Mythic N1→N3 Adventure : fort, pas de Morgath gratuit.
3. Common N10 good Morgath : victoire possible, défaite et nouvelle tentative possibles.
4. Mythic N5 good Morgath : avance plus tôt, préparation réellement utile.
5. Nouveau Warrior personal first-clear : XP une fois, 0 pièce globale/lot Boss répété.
6. Recycle équipement : conserve 1 exemplaire et les presets, pièces seulement.
7. Expédition 23h36→24h : 3→4 recherches, XP réelle / zéro au N10.
8. Duel UI 10/j Paris ; intégration backend TEST selon R après approbation.
9. Faille Common N1/N3 avec/sans premier kit ; Mythic N1 ne reçoit pas un full clear.
10. Badges Némésis/Panthéon 1500 et complément legacy unique ; comparer les stats Hub/Collection.

## Fichiers / reproductibilité

Passe présente : src/warriorProgression.ts(profils+anchors),src/riftBalance.ts(C1seul),src/v014Balance.test.ts(Commonguards),src/warriorProgression.test.ts(courbes),src/v015Rarity.test.ts(nouveauxcontrats),src/App.tsx+src/qa/v015Fixtures.ts(qaKituniquement),supabase/functions/duel/engine.js(bundle).

Scripts : calibrate-v015-final.mjs(probes),audit-v015-final-calibration.mjs(matrices/murs),simulate-v015-recurring-economy.mjs(indépendant),audit-v015-phase2-loop.mjs(optionoutput-prefixseulement),report-v015-final-calibration.mjs(rapport). Tous sous scripts/. Phase2etPhase1 existants préservés.

Commandes reproductibles :

`pnpm exec node scripts/calibrate-v015-final.mjs --trials=1000`

`pnpm exec node scripts/audit-v015-final-calibration.mjs --major=5000 --trials=1000`

`pnpm exec node scripts/audit-v015-phase2-loop.mjs --runs=128 --days=60 --trials=1000 --output-prefix=v015-final`

`pnpm exec node scripts/simulate-v015-recurring-economy.mjs --runs=128`

`pnpm exec node scripts/report-v015-final-calibration.mjs` (aprèsQA etv015-final-validation.json).

JSON/CSV/screenshots générés uniquement sous qa-output/, ignoréGit. Aucun assetcanonique, migrationhistorique, .env.local ni dépendance modifié. Serveur laisséactif.

## URLs locales vérifiées

- Normal : http://127.0.0.1:5173/
- Admin : http://127.0.0.1:5173/?admin
- TyrakN5nu : http://127.0.0.1:5173/?admin&qaPreview&qaWarrior=tyrak&qaLevel=5&qaKit=none
- CommonN10goodMorgath : http://127.0.0.1:5173/?admin&normalBossPreview&qaWarrior=karg&qaLevel=10&qaKit=good
- TyrakN5goodMorgath : http://127.0.0.1:5173/?admin&normalBossPreview&qaWarrior=tyrak&qaLevel=5&qaKit=good
- Personal : http://127.0.0.1:5173/?admin&v015Qa=personal
- Recycle : http://127.0.0.1:5173/?admin&v015Qa=recycle
- Duel : http://127.0.0.1:5173/?admin&duelPreview
- Failleearly : http://127.0.0.1:5173/?admin&riftPreview&qaWarrior=karg&qaLevel=3&qaKit=common
- MorgathNémésis : http://127.0.0.1:5173/?admin&nemesisBossPreview&qaWarrior=tyrak&qaLevel=10&qaKit=medium

Confirmation : aucun add/commit/push/branch/stash/reset/checkoutdestructif, aucun remote modifié, aucun déploiement.
