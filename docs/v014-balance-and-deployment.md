# CHRONOS AGE WARRIORS — V0.14 : bilan local et déploiement

## A. Résumé

Implémentation locale terminée : économie, XP, rencontres fixes Normal/Némésis, loot Expédition, récompenses Faille/Duel, 20 équipements, 36 textes de passifs quantifiés, probabilités, recyclage explicite et protections cloud. Prêt à tester localement. Le service Duel distant nécessite les actions O. Aucun artwork/sprite/HUD/cartographie ou système auth/admin redessiné.

Réserve game design : le niveau 10 possède un saut de maîtrise important, pas une interpolation linéaire 9→10. Ce choix distingue effectivement le niveau 9 suréquipé du niveau 10 moyen. Niveaux 1–9 inchangés. Matchups endgame Némésis : Naya 63,4 %, Eyla 44,8 % ; pas de taux identiques forcés.

## B. XP et compatibilité

Ancienne courbe : 120/180/280/410/560/750/970/1240/1580, cumul 6090.
Nouvelle : 120/180/300/450/650/850/1100/1400/1800, cumul 6850.
Cumuls aux niveaux 2→10 : 120/300/600/1050/1700/2550/3650/5050/6850.

Version persistée 5 conservée. Niveaux valides préservés, sans recalcul par XP cumulée ; niveau 6 reste 6. XP intra-niveau conservée dans le nouveau seuil. Niveau 10 : XP zéro. Legacy v2 ne remet plus tous les Warriors au niveau 1. Valeurs hors limites normalisées vers 1–10. Passifs aux niveaux 3/7/10.

Niveaux 1–9 inchangés ; palier 10 renforcé :

Warrior | Ancien niveau 10 F/E/V/PV | Final F/E/V/PV
---|---|---
karg | 28/18/22/270 | 90/28/40/850
naya | 21/27/30/220 | 73/45/55/700
brakk | 24/15/17/330 | 86/25/32/940
eyla | 23/21/28/235 | 85/35/50/820
asha | 28/21/25/300 | 90/30/43/880
rhex | 27/23/29/280 | 89/35/50/850
ursak | 32/17/22/370 | 89/26/38/900
saar | 33/31/34/310 | 90/44/54/850
morga | 34/15/19/420 | 91/24/33/970
vorka | 37/27/32/380 | 94/38/50/920
urgath | 41/17/21/470 | 93/26/35/1010
tyrak | 44/18/25/500 | 96/28/42/1030

## C. Économie

Événement | XP | Pièces
---|---:|---:
Normal première victoire |20|20
Normal replay gagné |5|5
Normal défaite |4|0
Némésis première victoire |50|50
Némésis replay gagné |10|10
Némésis défaite |10|0
Faille victoire, chaque combat |40|40
Faille défaite |0|0
Expédition 24 h, moyenne |600|350
Duel victoire |20|20
Duel défaite |4|0

Bonus premiers Boss intacts : Normal +1500 pièces et 10 coffres Warrior ; Némésis +2500 pièces et 3 coffres Faille. Flags anti-double gain conservés. Récompenses ponctuelles de badges distinctes et intactes.

Prix : Warrior 100 ; Équipement 25 (ancien 20), ×10=250 (ancien 200), aucun rabais. Faille non achetable.

## D. Aventure Normal

Anciennes valeurs nominales avec RNG=0,5 : tiers/profils/modificateurs et jitter ±6 %. Nouvelles réellement fixes, indépendantes du niveau/rareté/seed du joueur.

Niveau | Nom | Type | Ancien nominal F/E/V/PV | Final F/E/V/PV | Objectif
---|---|---|---|---|---
1 | Ramasseur des brumes | Standard | 5/5/6/110 | 8/6/8/110 | Montée entre les murs
2 | Chasseur de cornes | Standard | 6/4/5/126 | 9/9/10/120 | Montée entre les murs
3 | Veilleuse des fougères | Standard | 6/6/7/115 | 11/8/10/145 | Montée entre les murs
4 | Pilleur de silex | Standard | 6/7/9/106 | 12/8/11/165 | Montée entre les murs
5 | Brak le Colossal | Élite | 10/8/9/170 | 27/10/14/360 | Mur de préparation
6 | Traqueur des marais | Standard | 7/8/9/138 | 24/13/19/310 | Montée entre les murs
7 | Dompteuse de raptors | Standard | 9/9/10/175 | 23/17/25/320 | Montée entre les murs
8 | Gardien des os | Standard | 11/8/8/201 | 27/12/19/355 | Montée entre les murs
9 | Éclaireur du volcan | Standard | 9/9/10/161 | 28/15/21/375 | Montée entre les murs
10 | Ura la Balafrée | Élite | 12/12/16/227 | 42/15/23/550 | Mur de préparation
11 | Briseur de défenses | Standard | 13/11/13/185 | 38/14/24/500 | Montée entre les murs
12 | Prêtresse du feu | Standard | 11/11/13/195 | 38/18/26/515 | Montée entre les murs
13 | Fils du Smilodon | Standard | 13/11/13/230 | 43/21/30/540 | Montée entre les murs
14 | Sentinelle noire | Standard | 15/9/11/265 | 46/20/28/590 | Montée entre les murs
15 | Korga Croc-de-Fer | Élite | 19/14/16/311 | 65/18/30/800 | Mur de préparation
16 | Champion des cendres | Champion | 18/16/20/305 | 63/19/32/760 | Fin d’ère développée
17 | Champion du tonnerre | Champion | 21/16/19/302 | 68/20/33/810 | Fin d’ère développée
18 | Champion des abysses | Champion | 20/17/20/344 | 74/22/35/870 | Fin d’ère développée
19 | Champion du Titan | Champion | 20/16/19/374 | 80/23/37/950 | Fin d’ère développée
20 | Morgath, Roi Primordial | Boss | 23/14/5/393 | 145/24/45/1500 | Palier final niveau 10

## E. Némésis

20 profils fixes endgame. Mêmes identités, skills et sprites. Premiers niveaux exigeants ; Élites 5/10/15 ; Boss 20.

Niveau | Nom | Type | Ancien F/E/V/PV | Final F/E/V/PV | Écart vs Normal F/E/V/PV
---|---|---|---|---|---
1 | Ramasseur des brumes | Standard | 23/19/24/275 | 105/22/38/1120 | 97/16/30/1010
2 | Chasseur de cornes | Standard | 24/21/25/290 | 108/25/41/1160 | 99/16/31/1040
3 | Veilleuse des fougères | Standard | 26/21/25/310 | 112/23/40/1200 | 101/15/30/1055
4 | Pilleur de silex | Standard | 27/20/24/335 | 115/24/41/1240 | 103/16/30/1075
5 | Brak le Colossal | Élite | 31/19/22/410 | 130/25/42/1440 | 103/15/28/1080
6 | Traqueur des marais | Standard | 29/23/28/355 | 120/26/43/1340 | 96/13/24/1030
7 | Dompteuse de raptors | Standard | 28/25/32/350 | 118/31/50/1350 | 95/14/25/1030
8 | Gardien des os | Standard | 31/22/27/385 | 126/26/44/1390 | 99/14/25/1035
9 | Éclaireur du volcan | Standard | 32/24/29/405 | 130/28/45/1420 | 102/13/24/1045
10 | Ura la Balafrée | Élite | 36/24/30/470 | 146/27/46/1560 | 104/12/23/1010
11 | Briseur de défenses | Standard | 37/23/28/465 | 140/27/46/1480 | 102/13/22/980
12 | Prêtresse du feu | Standard | 36/27/31/450 | 142/30/48/1500 | 104/12/22/985
13 | Fils du Smilodon | Standard | 39/29/34/455 | 146/32/51/1480 | 103/11/21/940
14 | Sentinelle noire | Standard | 40/28/32/485 | 150/30/49/1520 | 104/10/21/930
15 | Korga Croc-de-Fer | Élite | 39/24/28/495 | 160/28/48/1620 | 95/10/18/820
16 | Champion des cendres | Champion | 40/24/29/510 | 156/29/48/1580 | 93/10/16/820
17 | Champion du tonnerre | Champion | 41/26/30/525 | 160/30/49/1600 | 92/10/16/790
18 | Champion des abysses | Champion | 42/27/31/540 | 164/31/50/1620 | 90/9/15/750
19 | Champion du Titan | Champion | 43/28/32/565 | 168/32/51/1650 | 88/9/14/700
20 | Morgath, Roi Primordial | Boss | 43/22/18/560 | 170/28/49/1700 | 25/4/4/200

## F. Simulations

Script : scripts/simulate-v014-balance.mjs.
Commande : node scripts/simulate-v014-balance.mjs --trials=1000 --optimize=yes.

Vite SSR importe le moteur réel et les données runtime, pas un score de puissance. 1 944 000 combats campagne +192 000 Faille +240 000 évaluations de loadouts =2 376 000 simulations.
1000 graines par cellule principale ; seed node*1000003 + level*7919 + sample*97.

Optimisation : les 100 combinaisons légales arme/armure, 200 graines chacune par Warrior contre Morgath Némésis, puis mesure sur un ensemble distinct. Pour ce matchup, les 12 meilleures combinaisons sont Cœur du Titan/Peau du Titan.

Loadouts explicites : commun Massue/Peaux ; moyen Marteau/Carapace (Épique) ; bon Griffe/Fourrure (Légendaire) ; endgame Cœur/Peau (Mythique). Ces labels ne représentent pas toutes les variantes possibles.

Warrior | N9 endgame Normal % | N10 moyen Normal % | N10 bon Normal % | N10 endgame Normal % | N10 moyen Némésis % | N10 bon Némésis % | N10 endgame Némésis %
---|---|---|---|---|---|---|---
karg | 1 | 10.3 | 46 | 84.9 | 1.8 | 12.6 | 49.1
naya | 2.5 | 16.7 | 49.8 | 89.1 | 3.1 | 20.5 | 63.4
brakk | 0.8 | 9 | 48.7 | 85.2 | 0.5 | 15.4 | 52.1
eyla | 0.5 | 10.5 | 39.5 | 81.5 | 0.9 | 10.6 | 44.8
asha | 0.6 | 12.7 | 42.9 | 83.7 | 2.2 | 15.2 | 50.1
rhex | 0.8 | 15.6 | 48.7 | 86.2 | 2.4 | 16.4 | 52.7
ursak | 1 | 10.2 | 45.4 | 86 | 1.3 | 13.2 | 51.2
saar | 0.6 | 10.7 | 43 | 82.1 | 1.3 | 12.5 | 46.1
morga | 0.8 | 12.1 | 53.5 | 91.9 | 1 | 14.9 | 55.3
vorka | 2.6 | 12.2 | 44.9 | 84.1 | 1.6 | 13 | 46.1
urgath | 2.2 | 13.3 | 53.9 | 90.5 | 1.3 | 16.3 | 55.9
tyrak | 2.2 | 18.8 | 57.8 | 89.9 | 3 | 21.3 | 59.3

N9 bon Normal : 0 % pour 11 Warriors, Naya 0,1 %. N9 endgame Némésis : Naya 0,5 %, Vorka 0,2 %, autres 0 %. Aucun niveau 9 testé n’a de taux confortable.

Configuration | Niveau Aventure | Normal moyen % | Némésis moyen %
---|---|---|---
N1 none | 1 | 84.49 | 0.00
N1 none | 5 | 0.57 | 0.00
N1 none | 10 | 0.00 | 0.00
N1 none | 15 | 0.00 | 0.00
N1 none | 16 | 0.00 | 0.00
N1 none | 17 | 0.00 | 0.00
N1 none | 18 | 0.00 | 0.00
N1 none | 19 | 0.00 | 0.00
N1 none | 20 | 0.00 | 0.00
N3 common | 1 | 99.73 | 0.00
N3 common | 5 | 11.00 | 0.00
N3 common | 10 | 0.07 | 0.00
N3 common | 15 | 0.00 | 0.00
N3 common | 16 | 0.00 | 0.00
N3 common | 17 | 0.00 | 0.00
N3 common | 18 | 0.00 | 0.00
N3 common | 19 | 0.00 | 0.00
N3 common | 20 | 0.00 | 0.00
N5 medium | 1 | 100.00 | 0.06
N5 medium | 5 | 99.99 | 0.00
N5 medium | 10 | 93.29 | 0.00
N5 medium | 15 | 11.78 | 0.00
N5 medium | 16 | 15.10 | 0.00
N5 medium | 17 | 8.16 | 0.00
N5 medium | 18 | 3.02 | 0.00
N5 medium | 19 | 0.75 | 0.00
N5 medium | 20 | 0.00 | 0.00
N7 good | 1 | 100.00 | 15.68
N7 good | 5 | 100.00 | 0.88
N7 good | 10 | 100.00 | 0.08
N7 good | 15 | 83.33 | 0.01
N7 good | 16 | 86.05 | 0.00
N7 good | 17 | 77.32 | 0.01
N7 good | 18 | 63.28 | 0.00
N7 good | 19 | 41.23 | 0.00
N7 good | 20 | 0.00 | 0.00
N10 good | 1 | 100.00 | 99.84
N10 good | 5 | 100.00 | 95.27
N10 good | 10 | 100.00 | 83.60
N10 good | 15 | 100.00 | 57.78
N10 good | 16 | 100.00 | 62.69
N10 good | 17 | 100.00 | 60.24
N10 good | 18 | 100.00 | 54.94
N10 good | 19 | 99.98 | 48.58
N10 good | 20 | 47.84 | 15.16

Ajustements après mesures : pics Élites et Boss, gear réellement structurant, saut niveau 10, premiers niveaux Némésis renforcés après constat de facilité, Naya moins dominante, Braises d’Asha utiles dès niveau 3. Aucune rareté du joueur n’entre dans les rencontres.

Résultats complets avec procs et maxima d’actions : qa-output/v014-balance.json et qa-output/v014-balance.md (ignorés). Tests de régression des murs avec le vrai moteur. Les écarts entre Warriors et la variance RNG restent honnêtement conservés.

## G. Faille

40 XP/40 pièces par victoire ; cinq victoires=200/200 +1 coffre Faille. Défaite sans nouvelle récompense, gains précédents acquis.
Budgets F/E/V/PV avant profils/jitter/pity : 33/15/24/430 ;42/17/26/530 ;52/20/28/660 ;65/21/30/810 ;85/24/35/1050.

Après défaite : retour direct à l’entrée, message concis et compte à rebours, sans gros récapitulatif ni nouvelle tentative. Vérifié avec une vraie séquence de combat QA.
Reset Europe/Paris, hidden pity, lineup, lock Warrior, abandon et gains acquis préservés.

Simulations Faille, moyenne des 12 Warriors contre profil Mammouth (combat1/Boss), pas probabilité du run complet :

Configuration | Difficulté interne | Combat1 % | Boss %
---|---:|---:|---:
N1 sans gear |100|0|0
N1 sans gear |50|0,76|0
N5 moyen |100|99,42|0
N5 moyen |50|100|2,98
N7 bon |100|100|2,79
N7 bon |50|100|59,63
N10 endgame |100|100|99,98
N10 endgame |50|100|100

Limite explicite : Faille devient très fiable au niveau10 endgame ; sa tentative quotidienne limite le farming. Le Boss Faille n’est pas calibré sur le taux endgame de Morgath Némésis.

## H. Expédition

600 XP/350 pièces à 24 h, au prorata ; jitter indépendant ±10 %. Un roll par tranche complète de 6 h, chance équipement 35 %, maximum quatre. Crédit au Warrior envoyé et règlement unique préservés.
Coffres indépendants au prorata : Équipement 10 % à 24 h, Warrior 2 % ; aucun Faille.
La rareté des objets trouvés dépend du temps total au retour :

Durée | Commun | Peu commun | Rare | Épique | Légendaire | Mythique
---|---:|---:|---:|---:|---:|---:
6–<12 h |75 %|20 %|5 %|0|0|0
12–<18 h |70 %|23 %|6 %|1 %|0|0
18–<24 h |65 %|25 %|8 %|1,9 %|0,1 %|0
24 h |60 %|28 %|10 %|1,85 %|0,14 %|0,01 %

## I. Duel

Ancien : victoire 100 XP/50 pièces, défaite 25 XP/10 pièces.
Nouveau : victoire 20/20, défaite 4/0. Points, classement, charges/recharge inchangés.

src/duelRules.ts compile dans supabase/functions/duel/engine.js ; handler index.ts inchangé.
202610040004_v014_economy.sql change seulement les deux validations de récompenses de duel_finalize. Un test compare la fonction complète avec l’ancienne, en ne remplaçant que ces deux lignes.

Bearer auth.getUser, identité/RNG serveur, RLS/RPC service_role, double CAS, verrous ordonnés, reçu idempotent, anti-auto-duel et charge unique préservés.
Backend distant non déployé ni validé avec deux comptes réels ici.

## J. Les 36 passifs

La description finale ci-dessous est le texte joueur exact : mécanique, valeurs, seuils, limites. État propre à chaque combat ; charges bornées et bonus non récursifs. Les réactions défensives aux dégâts bonus restent appliquées.

Warrior | Niveau | Nom | Description finale / mécanique exacte | Changement
---|---|---|---|---
karg | 3 | Premier Sang | Votre première attaque réussie inflige +25 % de dégâts. | Mécanique conservée, texte quantifié
karg | 7 | Pression du chasseur | Chaque coup consécutif ajoute +6 % de dégâts au suivant (maximum +18 %). Une esquive adverse annule les charges. | Mécanique conservée, texte quantifié
karg | 10 | Coup de Grâce | Infligez +30 % de dégâts aux cibles à 30 % de PV ou moins. | Mécanique conservée, texte quantifié
naya | 3 | Pas d’Ombre | Votre chance d’esquiver le premier assaut est multipliée par 1,25 (plafond 35 %). | Mécanique conservée, texte quantifié
naya | 7 | Tempo fantôme | Après le premier assaut, esquive ×2 (plafond 35 %). Chaque esquive donne +30 % de cadence à la prochaine action et +40 % de dégâts au prochain coup réussi. | Esquive ×2,6 → ×2
naya | 10 | Embuscade décisive | Après une esquive, le prochain coup réussi inflige +60 % de dégâts au lieu de +40 %. | +80 % → +60 %
brakk | 3 | Garde rocheuse | Les 3 premiers coups reçus infligent −12 % de dégâts. | Mécanique conservée, texte quantifié
brakk | 7 | Riposte du Bastion | 12 % de chance de bloquer entièrement une attaque. Le prochain coup réussi inflige alors +30 % de dégâts. | Mécanique conservée, texte quantifié
brakk | 10 | Dernière Résistance | À 30 % de PV ou moins, les 3 prochains coups reçus infligent −35 % de dégâts. Une fois par combat. | Mécanique conservée, texte quantifié
eyla | 3 | Mise en joue | Votre première attaque réussie inflige +20 % de dégâts. | Mécanique conservée, texte quantifié
eyla | 7 | Cadence précise | Chaque 3e attaque réussie ajoute un tir à 45 % des dégâts normaux. Ce tir ne déclenche pas vos passifs d’attaque. | Mécanique conservée, texte quantifié
eyla | 10 | Flèche fatale | Le premier coup réussi contre une cible à 50 % de PV ou moins inflige +40 % de dégâts. | Mécanique conservée, texte quantifié
asha | 3 | Marque de Braise | Chaque coup réussi ajoute une Braise (maximum 3). Chaque Braise déjà présente ajoute +3 % de dégâts. | +3 % par Braise dès niveau 3
asha | 7 | Foyer ardent | Avec 3 Braises, le prochain coup réussi les consume et inflige +30 % de dégâts. | Mécanique conservée, texte quantifié
asha | 10 | Crescendo incandescent | Les détonations infligent +50 % au lieu de +30 % et donnent +20 % de cadence à la prochaine action. | Mécanique conservée, texte quantifié
rhex | 3 | Signal de meute | Chaque 3e attaque réussie ajoute une morsure à 35 % des dégâts normaux, sans déclencher vos passifs d’attaque. | Mécanique conservée, texte quantifié
rhex | 7 | Relais de meute | Chaque assaut de raptor donne +20 % de cadence à votre prochaine action. | Mécanique conservée, texte quantifié
rhex | 10 | Assaut coordonné | Chaque assaut ajoute 2 morsures à 30 % des dégâts normaux chacune, au lieu d’une à 35 %. | Mécanique conservée, texte quantifié
ursak | 3 | Fureur cavernicole | Chaque coup reçu ajoute +8 % de dégâts au prochain coup réussi (maximum 3 charges). | Mécanique conservée, texte quantifié
ursak | 7 | Endurance sous pression | À 50 % de PV ou moins, recevez −15 % de dégâts. | Mécanique conservée, texte quantifié
ursak | 10 | Fureur ancestrale | À 30 % de PV ou moins, gagnez +20 % de dégâts et +15 % de cadence jusqu’à la fin du combat. | Mécanique conservée, texte quantifié
saar | 3 | Pas félin | Chaque esquive donne +25 % de cadence à votre prochaine action. | Mécanique conservée, texte quantifié
saar | 7 | Frénésie féline | Chaque coup réussi donne +5 % de cadence (maximum +15 %). Un coup reçu annule les charges. | Mécanique conservée, texte quantifié
saar | 10 | Contre-attaque prédatrice | Après une esquive, le prochain coup réussi inflige +45 % de dégâts. | Mécanique conservée, texte quantifié
morga | 3 | Garde d’Ivoire | Les 4 premiers coups reçus infligent −12 % de dégâts. | Mécanique conservée, texte quantifié
morga | 7 | Protection de la tribu | À 60 % de PV ou moins, les 3 prochains coups reçus infligent −20 % de dégâts. Une fois par combat. | Mécanique conservée, texte quantifié
morga | 10 | Endurance de Matriarche | À 25 % de PV ou moins, récupérez 15 % des PV maximum et recevez −15 % de dégâts jusqu’à la fin. Une fois par combat. | Mécanique conservée, texte quantifié
vorka | 3 | Entaille d’obsidienne | 25 % de chance d’infliger un saignement : 10 % des dégâts du coup pendant 2 actions, sans cumul. | Mécanique conservée, texte quantifié
vorka | 7 | Pression persistante | Infligez +15 % de dégâts aux cibles qui saignent. | Mécanique conservée, texte quantifié
vorka | 10 | Coupure décisive | Le premier coup contre une cible qui saigne à 40 % de PV ou moins inflige +45 % de dégâts et consume le saignement. | Mécanique conservée, texte quantifié
urgath | 3 | Rempart glacial | Les 5 premiers coups reçus infligent −12 % de dégâts. | Mécanique conservée, texte quantifié
urgath | 7 | Froid écrasant | Chaque coup réussi réduit la cadence adverse de 5 % (maximum −15 %). | Mécanique conservée, texte quantifié
urgath | 10 | Résilience du Titan | À 40 % de PV ou moins, recevez −20 % de dégâts. | Mécanique conservée, texte quantifié
tyrak | 3 | Présence primordiale | Les 3 premiers coups reçus infligent −10 % de dégâts. | Mécanique conservée, texte quantifié
tyrak | 7 | Sursaut cristallin | À 65 % de PV ou moins, gagnez +35 % de cadence à la prochaine action et +30 % de dégâts au prochain coup réussi. Une fois par combat. | Mécanique conservée, texte quantifié
tyrak | 10 | Domination du Roi | À 35 % de PV ou moins, gagnez +25 % de dégâts et recevez −12 % de dégâts jusqu’à la fin du combat. | Mécanique conservée, texte quantifié

Corrections transversales : bonus Crocs/Double Frappe réellement infligé, réactions défensives après chaque dégât, Second Souffle ne peut plus être contourné par un bonus d’équipement létal. Identités des Warriors conservées.

## K. Les 20 équipements

10 armes/10 armures. Bonus numériques centralisés dans les définitions, fixes, non multipliés par le niveau legacy d’équipement. Identifiants anciens, possessions, quantités et loadouts conservés. Icônes génériques existantes ; aucun nouvel asset.

Nom | Type | Rareté | Ancien bonus | Bonus final | Effet final | Statut
---|---|---|---|---|---|---
Massue de silex | Arme | Commun | +1 Force | +3 Force | 5 % : +20 % dégâts | Ancien rééquilibré
Lance d’os | Arme | Commun | +1 Vitesse | +1 Force · +4 Vitesse | Premier coup : +10 % dégâts | Ancien rééquilibré
Hache d’obsidienne | Arme | Peu commun | +1 Force et +5 PV | +7 Force · +20 PV | 6 % : saignement, 3 dégâts ×2 | Ancien rééquilibré
Arc du chasseur | Arme | Peu commun | +1 Vitesse et +5 PV | +4 Force · +8 Vitesse | Esquive adverse : −3 points | Ancien rééquilibré
Crocs du Smilodon | Arme | Rare | +1 Force et +1 Vitesse | +14 Force · +10 Vitesse | 8 % : second coup à 50 % | Ancien rééquilibré
Lance du Mammouth ancestral | Arme | Rare | +1 Force et +10 PV | +18 Force · +50 PV | 10 % : ignore les réductions de dégâts | Ancien rééquilibré
Marteau volcanique | Arme | Épique | +2 Force et +5 PV | +38 Force · +100 PV | 10 % : brûlure, 3 dégâts ×2 | Ancien rééquilibré
Javelot des Tempêtes | Arme | Épique | — | +30 Force · +20 Vitesse · +8 Esquive | Premier coup : +20 % dégâts | NOUVEAU
Griffe du Tyran | Arme | Légendaire | +2 Force et +1 Vitesse | +55 Force · +14 Vitesse | 12 % : +50 % dégâts | Ancien rééquilibré
Cœur du Titan Primordial | Arme | Mythique | +2 Force, +1 Vitesse et +5 PV | +75 Force · +22 Vitesse · +100 PV | 7 % : +80 % dégâts | Ancien rééquilibré
Peaux du chasseur | Armure | Commun | +10 PV | +30 PV | Premier coup reçu : −5 % dégâts | Ancien rééquilibré
Manteau des Roseaux | Armure | Commun | — | +15 PV · +4 Esquive | Premier coup reçu : −5 % dégâts | NOUVEAU
Harnais d’os | Armure | Peu commun | +5 PV et +1 Force | +65 PV · +3 Force | 5 % : −25 % dégâts reçus | Ancien rééquilibré
Écailles du Raptor | Armure | Peu commun | — | +45 PV · +6 Vitesse · +6 Esquive | Premier coup reçu : −10 % dégâts | NOUVEAU
Cuirasse du Mammouth ancestral | Armure | Rare | +10 PV et +1 Force | +140 PV · +6 Force | Bonus de critique adverse : −20 % | Ancien rééquilibré
Cape du Smilodon | Armure | Rare | — | +95 PV · +14 Esquive · +8 Vitesse | Premier coup reçu : −15 % dégâts | NOUVEAU
Carapace volcanique | Armure | Épique | +15 PV et +1 Force | +320 PV · +10 Force | 10 % : brûle l’attaquant, 3 dégâts ×2 | Ancien rééquilibré
Garde des Ancêtres | Armure | Épique | — | +260 PV · +20 Esquive · +12 Vitesse | Les 3 premiers coups reçus : −15 % dégâts | NOUVEAU
Fourrure du Titan blanc | Armure | Légendaire | +20 PV et +1 Force | +450 PV · +15 Force | Au-dessus de 50 % PV : −8 % dégâts reçus | Ancien rééquilibré
Peau du Titan primordial | Armure | Mythique | +25 PV et +1 Esquive | +650 PV · +25 Esquive | Les 3 premiers coups reçus : −20 % dégâts | Ancien rééquilibré

Nouvelle arme : Javelot des Tempêtes.
Quatre nouvelles armures : Manteau des Roseaux, Écailles du Raptor, Cape du Smilodon, Garde des Ancêtres.

Précision Arc, pénétration Mammouth, coup bonus Crocs, brûlures Marteau/Carapace, réduction du bonus critique Cuirasse et nouvelles gardes branchés. Une esquive ne consomme pas une protection limitée aux premiers coups reçus.

## L. Coffres

Rareté | Warrior % | Équipement % | Faille %
---|---:|---:|---:
Commun |70|63|5
Peu commun |22|27|15
Rare |7|8,5|40
Épique |0,85|1,35|28
Légendaire |0,14|0,14|10
Mythique |0,01|0,01|2

Chaque table couvre exactement 10 000 tickets entiers, testés exhaustivement.
Équipement : catégorie 50/50 AVANT rareté puis uniforme dans cette catégorie/rareté ; toutes les raretés existent dans les deux catégories.
Bienvenue partage la table Warrior. Boutons unitaires OUVRIR sans ×1 ; ×10=250.
Modale trois tables, Escape/Tab, focus restauré, scroll mobile/safe areas, focus preventScroll pour ne pas ouvrir en bas.

## M. Recyclage

Rareté | Pièces | XP au Warrior tiré
---|---:|---:
Commun |20|25
Peu commun |40|40
Rare |80|75
Épique |150|125
Légendaire |200|200
Mythique |250|350

DÉJÀ POSSÉDÉ →RECYCLER →RECYCLÉ et gains →CONTINUER. Pas de paiement pendant le tirage.
Reçu UUID persisté, consommé atomiquement ; double-clic protégé ; reload reprend le résultat ; deuxième appel même reçu sans effet.
XP au Warrior concerné même inactif ; actif/loadout restaurés ; aucun second exemplaire ; plusieurs niveaux possibles ; niveau10 seulement pièces et XP0. Sources acheté/stocké/Faille testées.

## N. Cloud save

Cause technique reproduite : le CAS protège la révision, pas la qualité du contenu. Un cache dirty default avec la même révision pouvait envoyer une carrière régressive ; change() acceptait aussi un reset post-bootstrap. La lecture cloud-first existante est conservée et durcie. Sans logs du compte incident, ceci ne prouve pas l’origine historique exacte de la perte.

losesProgress compare Warriors/niveaux/XP, gear possédé, progression Normal/Némésis, badges, compteurs monotones et flags de fin d’ère. Au bootstrap/reconnect, un cache régressif provoque un conflit conservant les deux snapshots. Un reset reçu en runtime est rejeté avant de toucher le cache : la dernière bonne version est restaurée à l’écran, y compris ses progrès dirty encore à synchroniser. Jamais d’upload automatique d’un reset. Pièces consommables exclues du contrôle monotone.

Cache vide/changement de port : cloud lue avant création et restaurée sans write si présente. Nouveau compte réellement sans cloud : write CAS0 ; course concurrente relit cloud.
Cache ancien dirty : conflit CAS ; offline cache par compte dirty conservé ; reconnect relit cloud et vérifie les régressions. Admin/QA jamais cloud. Choix explicite cloud/device préservé.

Tests A cache vide ; B origine nouvelle ; C fresh/default dirty même révision ; D cloud plus récente ; E compte neuf ; reset après bootstrap ; course read/write(0) ; offline ; CAS concurrent.
Ne récupère pas une sauvegarde déjà écrasée : un historique côté service serait nécessaire.

## O. Supabase / déploiement manuel

1. Appliquer supabase/migrations/202610040004_v014_economy.sql après 001/002/003. Anciennes migrations intactes ; reçus historiques conservés.
2. Redéployer duel avec EXACTEMENT supabase/functions/duel/index.ts (inchangé) et supabase/functions/duel/engine.js (régénéré). Côte à côte, import ./engine.js conservé.
3. Aucun nouveau secret/env/policy ouverte. Conserver le réglage JWT legacy actuel documenté dans docs/v0133-security-checklist.md ainsi que la validation applicative auth.getUser ; aucun autre réglage Supabase demandé.
4. Tester Duel avec deux vrais comptes : récompenses, charge unique, idempotence, défenseur inchangé. Frontend via votre workflow habituel après validation.

Éviter Duel pendant la mise à jour SQL/Edge : versions désaccordées renverraient Invalid Duel awards. Les deux doivent être cohérents.
Aucune action distante effectuée.

## P. Validation

271 tests /36 fichiers OK ; lint OK ; tsc -b --pretty false OK ; build Vite/PWA OK ; build Duel Edge OK ; git diff --check OK.
Warnings non bloquants : chunk JS ~617 kB >500 kB, diagnostic temps callbacks Vite. Precache PWA ~43 MiB, configuration inchangée.

QA 320×844/390×844/768×1024/1440×900 : modale probabilités, roulette/recyclage, inventaire générique, retour Expédition, HUD quatre chiffres. Faille perdue testée à390px. Aucune image cassée/overflow constaté ; console error/warn vide. Normal gate compte ; admin12 Warriors/20gear. HTTP normal/admin200.
Pas de test cloud/auth avec session réelle ni Duel online : gateways et Edge mockés, moteur de simulation réel.

## Q. Fichiers importants

- src/App.test.tsx
- src/App.tsx
- src/campaignProgression.ts
- src/chestSystem.test.ts
- src/chestSystem.ts
- src/cloudSave.test.ts
- src/cloudSave.ts
- src/components/ChestPage.tsx
- src/components/RiftPage.tsx
- src/components/WarriorGacha.tsx
- src/config.ts
- src/data.ts
- src/duelRules.test.ts
- src/duelRules.ts
- src/expedition.test.tsx
- src/expeditionBalance.ts
- src/game.test.ts
- src/game.ts
- src/hubEquipment.test.tsx
- src/nemesisBalance.ts
- src/nemesisCampaign.test.ts
- src/nemesisCampaign.ts
- src/primalEnemyBalance.test.ts
- src/primalEnemyBalance.ts
- src/rift.test.ts
- src/riftBalance.ts
- src/riftChest.ts
- src/storage.ts
- src/styles.css
- src/types.ts
- src/warriorPassives.test.tsx
- src/warriorPassives.ts
- src/warriorProgression.test.ts
- src/warriorProgression.ts
- src/welcomeFlow.test.tsx
- supabase/functions/duel/engine.js
- tests/duelSecurity.test.ts
- scripts/simulate-v014-balance.mjs
- src/components/ChestOddsModal.tsx
- src/v014Balance.test.ts
- src/v014Economy.test.tsx
- src/warriorRecycle.ts
- supabase/migrations/202610040004_v014_economy.sql
- docs/v014-balance-and-deployment.md — ce bilan.

## R. Git

Aucun add, commit, push, branche, stash, reset, checkout, changement de remote ni déploiement. Local existant préservé.
.env.local, node_modules, dist et qa-output ignorés ; seule .env.example suivie. Aucun PNG/artwork modifié.

## S. Checklist humaine

- Vérifier une carrière niveau6 et avancée sur nouvelle origine/port ; choisir cloud en conflit.
- Ouvrir trois coffres, recycler Warrior inactif, recharger et vérifier aucun double crédit.
- Comparer Morgath avec moyen/bon/endgame, en tenant compte du saut de maîtrise niveau10.
- Perdre Faille ; rappeler Expédition à6/12/18/24h ; vérifier gains et coffres stockés.
- Après O, Duel réel victoire/défaite puis même requestId sans double paiement.

## T. URL locale réellement active

http://127.0.0.1:5173/
Admin : http://127.0.0.1:5173/?admin
Combat QA : http://127.0.0.1:5173/?admin&desktopCombatPreview&qaWarrior=karg&qaLevel=10&qaNode=20&qaHold
Faille QA : http://127.0.0.1:5173/?admin&riftPreview
Expédition QA : http://127.0.0.1:5173/?admin&expeditionPreview
Serveur laissé actif.
