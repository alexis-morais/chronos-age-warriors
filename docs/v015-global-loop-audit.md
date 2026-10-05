# CHRONOS AGE WARRIORS — V0.15 Phase 1

# Global Game Loop / Economy / Progression Audit

## A. Executive Summary

Audit du 5 octobre 2026. V0.14.1 locale figée. **Phase 1 uniquement : aucun équilibrage runtime ni déploiement.**

La boucle existe, mais ne satisfait pas toutes les intentions simultanément. En stratégie équilibrée, le premier N10 médian arrive à **10 jours pour le casual, 9 pour le régulier, 8 pour le très actif**. Aucun régulier équilibré ne l’atteint avant J7 dans les 128 graines. Le très actif optimisé y arrive en 6–7 jours, mais cumule 30 Duels/jour et rappelle son main entre sessions. Cela ne démontre pas une cible 5–7 jours naturelle et facultative pour tous.

Sans Expédition, le régulier passe à **24 jours** ; sans Duel à 10 jours ; sans Faille à 10 jours. L’Expédition domine l’XP ; la Faille joue surtout sur l’accès aux Warriors extraordinaires. Morgath Normal est battu au jour 12 médian par le régulier équilibré. Pour Morgath Némésis, atteindre 50 % de victoire reste généralement hors de la fenêtre de 60 jours avec le gear réellement obtenu.

Deux contradictions confirmées : le prédicat du badge Némésis retourne toujours false, bloquant la Maîtrise à 1500 pièces ; posséder 12 Warriors donne actuellement 200 pièces (Panthéon), pas directement 1500. Des reçus affichent de l’XP nominale au plafond N10 malgré zéro XP créditée.

Le régulier équilibré finit Némésis au jour 26 médian, en multipliant les essais à faible probabilité : cela ne signifie pas une préparation à P50. Normal lui-même reste sous P50 pour près de90 % des carrières à J60. La boucle « gagner du loot puis retenter » existe, mais une victoire rare remplace souvent une préparation fiable.

Propositions soumises à validation : cap Aventure 15 ; Duel 10/jour sans recharge ; personal first-clear 20/50 XP sans récompense globale supplémentaire ; recyclage Équipement manuel avec chaque remboursement inférieur à 25 ; builds plus spécialisés. Replay 5/10, odds, jackpots Boss et référence Faille endgame ≈85 % restent intacts. Les chiffres du Duel supposent une population analytique disponible, pas un matchmaking réel mesuré.

## B. Current Ruleset

| Système | Règle confirmée |
| --- | --- |
| XP | Seuils 120/180/300/450/650/850/1100/1400/1800 ; total 6850 ; N10 absolu, XP résiduelle 0 |
| Bienvenue | Un Warrior gratuit aux vraies odds normales +300 pièces ; aucun équipement |
| Normal | Première victoire du compte : 20 XP /20 pièces ; replay 5/5 ; défaite 4/0 |
| Némésis | Première victoire : 50/50 ; replay 10/10 ; défaite 10/0 ; accessible après Boss Normal |
| Boss Normal | 1500 pièces +10 coffres Warrior stockés, une seule fois |
| Boss Némésis | 2500 pièces +3 coffres Faille stockés, une seule fois |
| Aventure | Cap 10 ; +1/20 min ; réserve partagée Normal/Némésis, sans reset quotidien |
| Duel actuel | Cap 10 ; +1/20 min côté serveur ; victoire 20/20, défaite 4/0 |
| Faille | Une tentative/jour Paris ; cinq étapes ; 40 XP/40 pièces par victoire ; 5/5 = coffre Faille |
| Expédition | Un slot, plafond 24 h ; 600 XP/350 pièces ±10 % indépendants ; bloque Aventure/Faille du Warrior, pas Duel |
| Coffres | Warrior 100 ; Équipement 25, ×10=250 sans remise ; type Équipement 50/50 puis rareté |
| Recyclage Warrior | 20/40/80/150/200/250 pièces et 25/40/75/125/200/350 XP selon rareté ; XP au Warrior doublonné |
| Équipement | 20 objets statiques ; doublons stockés, aucun recyclage ou gain d’XP actuel ; presets partagés |
| Passifs | 36, seuils 3/7/10 ; état propre à chaque combat |
| Sauvegarde | Version 5 ; cache par compte, CAS, reçus ; admin isolé sur localhost |

Moteur : dégâts de base 6+2,2×Force^0,75 ; variance ±10 % ; critiques 5 % ×1,5 ; esquive plafonnée à 35 % ; cadence (Vitesse+10)^0,65 ; maximum trois actions consécutives. Les ennemis restent fixes, jamais ajustés au Warrior.

Toutes les sources convergent vers addWarriorXp et jettent l’excédent à N10 : Aventure, Némésis, Faille, Duel, Expédition, recyclage. Aucun prestige, stockage ou conversion. Les anciens champs equipment.level/xp n’augmentent plus les stats.

Sources inspectées : src/game.ts, warriorProgression.ts, warriors.ts, warriorPassives.ts, data.ts, config.ts, combatReserves.ts, nemesisCampaign.ts, nemesisBalance.ts, rift.ts, expedition.ts, chestSystem.ts, warriorRecycle.ts, riftChest.ts, badgeSystem.ts, storage.ts, cloudSave.ts, duelRules.ts, App.tsx et composants ; règles SQL/Edge lues sans exécution. Les hashes figent les sources employées.

## C. Player Profiles

| Profil | Temps actif/jour | Sessions | Actions max/session | Duels max/session |
| --- | --- | --- | --- | --- |
| casual | 8 min | 0 h | 12 | 3 |
| regular | 24 min | 0 h | 36 | 10 |
| active | 60 min | 0 h / 6 h / 12 h | 30 | 10 |

Hypothèse : 30 secondes/action avec ×3/Passer ; menus et coffres dans le temps restant. Ce n’est ni une mesure x1 ni de la télémétrie. Une session s’arrête quand la réserve est vide ; aucune attente de 20 minutes n’est comptée comme temps actif.

Stratégies : A 100 % Warrior ; B 100 % Équipement ; C 50/50 ; D main optimisé (25/75 puis 50/50 après obtention de gear Rare dans les deux slots, rappels entre sessions) ; E collection (75/25 et Expédition d’un secondaire) ; F sans Duel ; G sans Faille ; H sans Expédition. Deux variantes de C à 75/25 et 25/75 isolent le seul budget. Le main reste le Warrior de bienvenue, sans reroll ni substitution automatique par un héros rare.

Casual/régulier : main envoyé après la session et rappelé à la suivante, environ 23 h 52/23 h 36. Actif C : après la dernière session jusqu’à la première, environ 11 h 40. Actif D : rappels/envois entre sessions, presque 24 h cumulées hors jeu. E : secondaire envoyé dès qu’un autre Warrior est possédé.

**Population Duel analytique seulement** : roster tiré aux odds normales, même niveau et gear que le joueur. Aucun bot, faux compte, appel réseau ou donnée de population inventée. Le vrai SQL cherche d’abord la proximité de points, pas de niveau/gear : cette hypothèse peut surestimer la viabilité réelle. F fournit aussi la borne sans adversaires : zéro combat, XP, pièce et charge dépensée.

4608 carrières ×60 jours ; 128 graines/cellule, snapshots J1–30 et J60. 14 854 550 combats dans le simulateur global. 8192 carrières de Warriors tardifs ; 96 cellules d’ablation ×2000 graines avec/sans kit. Benchmarks 1000 graines/cellule. Gear choisi parmi les copies réellement obtenues avec 80 sondes contre le prochain mur ; départage physique, aucune note de puissance UI.

Graine globale : career 1500001+i*7919; combat/draw independent successive seeded PRNG; rate 733001+i*97; RNG 2117001+i*97; Rift 3100001+i*97; matchups4190001+i*97; collection5500001+i*7919; equipment recycling6500001+i*7919. Les variantes de même seed consomment le RNG différemment : ce n’est pas un essai causal strictement apparié. Incertitude 95 % maximale d’une proportion : ±8,7 points avec 128 carrières, ±3,1 avec 1000 combats, ±4,9 avec 400 sondes Boss. Les petits écarts de classement ne sont pas significatifs.

Le calendrier et les caps hypothétiques sont des adaptateurs du script : recharge réelle sur horloge déterministe, puis remplacement des seuls compteurs de charges après le règlement de campagne. Combat, XP, loot et reçus emploient les fonctions actuelles. Les tableaux agrégés JSON ont des quantiles conditionnels aux cas observés ; ce rapport recalcule les jalons sur toute la cohorte depuis les carrières brutes.

Médianes [P10–P90] calculées sur **toute la cohorte**, avec non-completers censurés à 60 jours ; « observés » donne le taux de réalisation. Les politiques de session, dépenses et sélection sont des hypothèses, pas des comportements humains observés. Aucun compte distant ni sauvegarde personnelle n’alimente les calculs. JSON/CSV conservent les trajectoires, rewards, reçus et seeds.

## D. 14-Day Simulation

Moyennes des carrières réellement simulées avec combat, loot, doublons, Faille/pity et Expédition. Les niveaux sont entiers par carrière ; 8,4 est une moyenne, pas un niveau gameplay. Wallet après dépenses ; nodes indiquent la progression globale ; Némésis 0 signifie non débloquée.

| Profil | Stratégie | Niveau main | Normal | Némésis | Warriors uniques | Gear uniques | W/E payants | Coffres Faille | Doublons W | Wallet |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| casual | A-warrior | 10 | 20 | 1,13 | 9,98 | 7,66 | 118,16/0 | 1,13 | 111,66 | 62,67 |
| casual | B-equipment | 10 | 20 | 9,15 | 6,21 | 15,51 | 0/419,86 | 2,37 | 4,38 | 11,94 |
| casual | C-balanced | 10 | 20 | 7,32 | 9,71 | 14,6 | 59,12/236,63 | 2,03 | 58,95 | 37,77 |
| casual | D-main | 10 | 20 | 7,55 | 9,77 | 14,5 | 59,46/238,12 | 2,05 | 59,33 | 35,71 |
| casual | E-collection | 6,2 | 14 | 0 | 9,44 | 12,87 | 70,91/95,16 | 0 | 62,71 | 48,03 |
| casual | F-no-duel | 10 | 20 | 9,87 | 9,79 | 14,38 | 58,75/235,25 | 2,07 | 58,8 | 33,35 |
| casual | G-no-rift | 10 | 20 | 8,79 | 9,09 | 14,21 | 49,27/197,13 | 0 | 47,07 | 34,2 |
| casual | H-no-expedition | 5,66 | 12,59 | 0 | 6,88 | 11,55 | 15,3/61,36 | 0 | 9,43 | 32,5 |
| casual | budget-75 | 10 | 20 | 4,73 | 10,07 | 13,47 | 92,2/123,55 | 1,75 | 89,8 | 49,69 |
| casual | budget-25 | 10 | 20 | 8,3 | 9,38 | 15,16 | 28,23/335,45 | 2,15 | 29,43 | 21,09 |
| regular | A-warrior | 10 | 20 | 1,02 | 9,98 | 7,66 | 137,39/0 | 1,22 | 130,77 | 60,64 |
| regular | B-equipment | 10 | 20 | 15,95 | 7,26 | 16,25 | 0/535,38 | 3,53 | 6,02 | 12,8 |
| regular | C-balanced | 10 | 20 | 12,88 | 9,98 | 14,83 | 72,95/291,95 | 2,77 | 74,3 | 35,97 |
| regular | D-main | 10 | 20 | 12,66 | 10,1 | 14,99 | 73,36/293,48 | 2,77 | 74,67 | 37,2 |
| regular | E-collection | 7,77 | 16,63 | 0 | 9,49 | 13,27 | 85,88/115,09 | 0,01 | 77,66 | 50,45 |
| regular | F-no-duel | 10 | 20 | 8,94 | 9,8 | 14,45 | 58,22/232,94 | 2,09 | 57,15 | 34,91 |
| regular | G-no-rift | 10 | 20 | 12,16 | 9,38 | 14,77 | 60,16/240,88 | 0,26 | 59,38 | 34,36 |
| regular | H-no-expedition | 7,46 | 15,77 | 0 | 8,02 | 12,77 | 25,63/102,66 | 0 | 18,61 | 31,84 |
| regular | budget-75 | 10 | 20 | 6,3 | 10,09 | 13,5 | 106,44/142,59 | 2,06 | 103,45 | 50,2 |
| regular | budget-25 | 10 | 20 | 15,02 | 9,72 | 15,47 | 35,08/417,29 | 2,91 | 37,8 | 21,89 |
| active | A-warrior | 10 | 20 | 0,55 | 9,98 | 3,5 | 157,23/0 | 0,93 | 149,84 | 58,99 |
| active | B-equipment | 10 | 20 | 19,89 | 8,28 | 16,32 | 0/687,41 | 4,91 | 7,77 | 13,49 |
| active | C-balanced | 10 | 20 | 18,31 | 10,46 | 15,36 | 96,62/386,7 | 4,21 | 100,73 | 39,34 |
| active | D-main | 10 | 20 | 19,43 | 10,59 | 15,85 | 115,9/463,73 | 5,3 | 121,7 | 35,38 |
| active | E-collection | 10 | 20 | 15,25 | 10,29 | 14,57 | 164,19/219,49 | 2,52 | 165,81 | 46,99 |
| active | F-no-duel | 10 | 20 | 10,89 | 9,58 | 14,2 | 51,77/207,27 | 1,21 | 51,01 | 33,43 |
| active | G-no-rift | 10 | 20 | 17,23 | 9,81 | 15,05 | 80,8/323,38 | 1,24 | 82,16 | 28,05 |
| active | H-no-expedition | 10 | 20 | 15,15 | 9,95 | 14,82 | 73,35/293,63 | 2,43 | 74,88 | 35,51 |
| active | budget-75 | 10 | 20 | 16,9 | 10,45 | 14,02 | 148,44/198,52 | 3,18 | 150,84 | 46,5 |
| active | budget-25 | 10 | 20 | 19,33 | 10,27 | 15,96 | 46,11/550,66 | 4,83 | 51,46 | 21,8 |

Le JSON conserve XP courante, pièces, raretés, copies d’équipement, loadout exact, étapes Faille, claims Expédition, badges, recyclage, compteurs de combats et sources/sinks par jour/seed. Le CSV distingue caps et quota Duel des variantes. Les jackpots uniques ne sont pas transformés en revenu quotidien.

## E. 30-Day Simulation

Moyennes des carrières réellement simulées avec combat, loot, doublons, Faille/pity et Expédition. Les niveaux sont entiers par carrière ; 8,4 est une moyenne, pas un niveau gameplay. Wallet après dépenses ; nodes indiquent la progression globale ; Némésis 0 signifie non débloquée.

| Profil | Stratégie | Niveau main | Normal | Némésis | Warriors uniques | Gear uniques | W/E payants | Coffres Faille | Doublons W | Wallet |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| casual | A-warrior | 10 | 20 | 6,91 | 10,63 | 10,18 | 265,91/0 | 4,11 | 265,4 | 67,01 |
| casual | B-equipment | 10 | 20 | 19,3 | 9,66 | 16,83 | 0/948,05 | 11,48 | 13,18 | 10,93 |
| casual | C-balanced | 10 | 20 | 19,55 | 10,98 | 16,2 | 137,27/549,34 | 10,42 | 148,13 | 38,01 |
| casual | D-main | 10 | 20 | 19,45 | 10,94 | 16,13 | 135,15/540,8 | 9,98 | 145,67 | 35,17 |
| casual | E-collection | 8,91 | 19,23 | 0 | 10,01 | 14,35 | 155,27/207,65 | 0,17 | 146,99 | 46,64 |
| casual | F-no-duel | 10 | 20 | 19,55 | 10,86 | 15,9 | 131,75/527,04 | 9,48 | 141,85 | 36,59 |
| casual | G-no-rift | 10 | 20 | 18,8 | 10,05 | 15,84 | 108,95/435,91 | 1,8 | 111,86 | 33,56 |
| casual | H-no-expedition | 8,34 | 17,95 | 0 | 8,46 | 13,32 | 32,44/129,93 | 0,05 | 25,02 | 33,16 |
| casual | budget-75 | 10 | 20 | 18,32 | 10,85 | 15,02 | 215,51/287,9 | 8,59 | 224,27 | 51,11 |
| casual | budget-25 | 10 | 20 | 19,69 | 10,77 | 16,47 | 63,27/755,66 | 10,47 | 74,45 | 21,63 |
| regular | A-warrior | 10 | 20 | 7,89 | 10,63 | 10,02 | 312,07/0 | 4,49 | 312,14 | 62,08 |
| regular | B-equipment | 10 | 20 | 19,84 | 9,64 | 17,16 | 0/1 100,65 | 12,65 | 14,44 | 11,79 |
| regular | C-balanced | 10 | 20 | 19,54 | 10,82 | 16,25 | 156,08/624,53 | 10,66 | 167,45 | 37,73 |
| regular | D-main | 10 | 20 | 19,53 | 10,98 | 16,39 | 157,81/631,4 | 10,91 | 169,06 | 33,84 |
| regular | E-collection | 10 | 20 | 14,72 | 10,51 | 14,97 | 218,64/292,09 | 3,89 | 221,41 | 48,41 |
| regular | F-no-duel | 10 | 20 | 18,93 | 10,77 | 16,06 | 134,08/536,6 | 9,51 | 143,96 | 35,73 |
| regular | G-no-rift | 10 | 20 | 19,26 | 10,13 | 16,08 | 124,02/496,09 | 2,09 | 127,23 | 33,91 |
| regular | H-no-expedition | 10 | 20 | 13,06 | 10,02 | 14,66 | 70,73/283,11 | 3,02 | 72,07 | 35,12 |
| regular | budget-75 | 10 | 20 | 18,02 | 10,87 | 15,23 | 245,03/327,3 | 8,58 | 253,43 | 45,53 |
| regular | budget-25 | 10 | 20 | 19,98 | 10,95 | 16,79 | 74,58/891,69 | 11,99 | 87,16 | 23,37 |
| active | A-warrior | 10 | 20 | 4,5 | 10,62 | 5,81 | 346,38/0 | 3,07 | 342,79 | 61,55 |
| active | B-equipment | 10 | 20 | 20 | 9,84 | 17,25 | 0/1 335,77 | 13,44 | 14,87 | 13,6 |
| active | C-balanced | 10 | 20 | 20 | 11,11 | 16,65 | 193,97/776,19 | 12,37 | 206,52 | 34,49 |
| active | D-main | 10 | 20 | 20 | 11,07 | 16,92 | 226,28/905,38 | 13,38 | 240,23 | 34,17 |
| active | E-collection | 10 | 20 | 19,84 | 10,94 | 15,87 | 355,22/474,18 | 10,38 | 366,15 | 46,45 |
| active | F-no-duel | 10 | 20 | 19,84 | 10,83 | 15,89 | 130,3/521,22 | 9,86 | 140,52 | 35,14 |
| active | G-no-rift | 10 | 20 | 20 | 10,44 | 16,3 | 157,88/631,69 | 2,72 | 161,35 | 37,8 |
| active | H-no-expedition | 10 | 20 | 20 | 10,86 | 16,1 | 158,74/635,05 | 10,34 | 169,22 | 33,79 |
| active | budget-75 | 10 | 20 | 19,84 | 10,98 | 15,57 | 312,94/417,9 | 11,06 | 324,13 | 46,38 |
| active | budget-25 | 10 | 20 | 20 | 10,98 | 16,98 | 89,78/1 073,94 | 13,05 | 103,08 | 20,3 |

Le JSON conserve XP courante, pièces, raretés, copies d’équipement, loadout exact, étapes Faille, claims Expédition, badges, recyclage, compteurs de combats et sources/sinks par jour/seed. Le CSV distingue caps et quota Duel des variantes. Les jackpots uniques ne sont pas transformés en revenu quotidien.

## F. First Level 10

| Profil / stratégie | Premier N10 : médiane [P10–P90] ; réalisation | J3 | J5 | J7 | J10 | J14 |
| --- | --- | --- | --- | --- | --- | --- |
| casual / C-balanced | 10 j [10 j–10 j] ; 100 % observés | 0 % | 0 % | 0 % | 99,22 % | 100 % |
| casual / D-main | 10 j [10 j–10 j] ; 100 % observés | 0 % | 0 % | 0 % | 100 % | 100 % |
| casual / F-no-duel | 10 j [10 j–10 j] ; 100 % observés | 0 % | 0 % | 0 % | 97,66 % | 100 % |
| casual / G-no-rift | 11 j [11 j–11 j] ; 100 % observés | 0 % | 0 % | 0 % | 0 % | 100 % |
| casual / H-no-expedition | 39 j [35 j–46 j] ; 100 % observés | 0 % | 0 % | 0 % | 0 % | 0 % |
| casual / E-collection | 35 j [32 j–38 j] ; 100 % observés | 0 % | 0 % | 0 % | 0 % | 0 % |
| regular / C-balanced | 9 j [8 j–9 j] ; 100 % observés | 0 % | 0 % | 0 % | 100 % | 100 % |
| regular / D-main | 9 j [8 j–9 j] ; 100 % observés | 0 % | 0 % | 0 % | 100 % | 100 % |
| regular / F-no-duel | 10 j [10 j–10 j] ; 100 % observés | 0 % | 0 % | 0 % | 96,88 % | 100 % |
| regular / G-no-rift | 10 j [9 j–10 j] ; 100 % observés | 0 % | 0 % | 0 % | 99,22 % | 100 % |
| regular / H-no-expedition | 24 j [22 j–28 j] ; 100 % observés | 0 % | 0 % | 0 % | 0 % | 0 % |
| regular / E-collection | 23 j [21 j–25 j] ; 100 % observés | 0 % | 0 % | 0 % | 0 % | 0 % |
| active / C-balanced | 8 j [8 j–9 j] ; 100 % observés | 0 % | 0 % | 7,81 % | 100 % | 100 % |
| active / D-main | 6 j [6 j–7 j] ; 100 % observés | 0 % | 0 % | 100 % | 100 % | 100 % |
| active / F-no-duel | 13 j [13 j–14 j] ; 100 % observés | 0 % | 0 % | 0 % | 0 % | 100 % |
| active / G-no-rift | 9 j [8 j–10 j] ; 100 % observés | 0 % | 0 % | 0 % | 100 % | 100 % |
| active / H-no-expedition | 11 j [10 j–12 j] ; 100 % observés | 0 % | 0 % | 0 % | 18,75 % | 100 % |
| active / E-collection | 11 j [10 j–12 j] ; 100 % observés | 0 % | 0 % | 0 % | 35,16 % | 100 % |

La cible 5–7 jours n’est pas atteinte par le régulier équilibré : 0 % avant J7. L’actif C est modestement plus rapide, mais D cumule des rappels d’Expédition et 30 Duels. Le premier N10 peut être un secondaire avant le main dans E ; le niveau du main est conservé séparément.

Minimum mathématique : **jour 1**, bienvenue Urgath puis 35 doublons Légendaires =7000 XP nominale, 3800 pièces finales. Exemple légal mais probabilité ≈1,82×10^-103, donc inutilisable comme délai réaliste. Aucun minimum garanti sans conditions de RNG/population.

Borne productive optimiste hors loterie avec Duel plafonné à 10/jour : 600 Expédition +200 Duel +200 Faille +50 replay =1050 XP/jour, soit 6,52 journées de rendement pour 6850 XP. Premier retour Expédition au jour 2. Cela suppose toutes les victoires, adversaires disponibles et compatibilité des 24 heures ; l’early ne remplit pas ces conditions. Tenir 5–7 jours tout en gardant les modes facultatifs exige un arbitrage, pas un buff massif du replay.

Sources du régulier équilibré à J14 :

| Source | Pièces cumulées | XP créditée au main | XP créditée au roster | XP nominale proposée |
| --- | --- | --- | --- | --- |
| normal | 732,77 | 641,8 | 641,8 | 822,59 |
| nemesis | 744,14 | 0 | 0 | 792,66 |
| rift | 1 770,31 | 722,82 | 722,82 | 1 770,31 |
| duel | 1 368,13 | 941,23 | 941,23 | 1 654,5 |
| expedition | 4 465,5 | 4 409,3 | 4 409,3 | 7 657,43 |
| recycle | 2 198,28 | 134,85 | 2 230,55 | 2 419,96 |
| badges | 1 667,19 | 0 | 0 | 0 |
| boss | 1 382,81 | 0 | 0 | 0 |

Combats moyens à J14 : Aventure 140, Duel 140, Faille 55,84 ; arrêts sur réserve vide 14 ; essais de mur 59,35. L’XP nominale post-N10 est jetée. Jalons 3/5/7 également conservés pour chaque carrière.

## G. Morgath Normal

Sondes Boss à 400 graines avec l’inventaire réellement obtenu. Un jalon de probabilité exige aussi que le Boss soit accessible. Premier essai ≠ chance raisonnable ; P20/P50/P80 sont des estimations, pas des promesses.

| Profil / stratégie | Premier essai | Première victoire | P≥20 % | P≥50 % | P≥80 % |
| --- | --- | --- | --- | --- | --- |
| casual / C-balanced | 10 j [8 j–11 j] ; 100 % observés | 13 j [10 j–21 j] ; 100 % observés | 29 j [10 j–>60 j] ; 67,19 % observés | >60 j [>60 j–>60 j] ; 7,03 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| casual / F-no-duel | 10 j [8 j–10 j] ; 100 % observés | 13 j [10 j–23 j] ; 100 % observés | 33 j [11 j–>60 j] ; 69,53 % observés | >60 j [>60 j–>60 j] ; 3,13 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| casual / G-no-rift | 11 j [8 j–11 j] ; 100 % observés | 14 j [11 j–22 j] ; 100 % observés | 29 j [12 j–>60 j] ; 67,19 % observés | >60 j [>60 j–>60 j] ; 5,47 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| casual / H-no-expedition | 35 j [28 j–43 j] ; 100 % observés | 42 j [37 j–51 j] ; 96,88 % observés | >60 j [37 j–>60 j] ; 44,53 % observés | >60 j [>60 j–>60 j] ; 3,13 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| regular / C-balanced | 9 j [7 j–9 j] ; 100 % observés | 12 j [9 j–23 j] ; 100 % observés | 29 j [9 j–>60 j] ; 75,78 % observés | >60 j [57 j–>60 j] ; 10,16 % observés | >60 j [>60 j–>60 j] ; 0,78 % observés |
| regular / F-no-duel | 10 j [8 j–10 j] ; 100 % observés | 14 j [10 j–25 j] ; 100 % observés | 34 j [10 j–>60 j] ; 68,75 % observés | >60 j [>60 j–>60 j] ; 7,81 % observés | >60 j [>60 j–>60 j] ; 0,78 % observés |
| regular / G-no-rift | 10 j [8 j–10 j] ; 100 % observés | 12 j [10 j–21 j] ; 100 % observés | 25 j [10 j–>60 j] ; 75,78 % observés | >60 j [>60 j–>60 j] ; 3,91 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| regular / H-no-expedition | 22 j [17 j–27 j] ; 100 % observés | 27 j [23 j–38 j] ; 99,22 % observés | 47 j [23 j–>60 j] ; 53,13 % observés | >60 j [>60 j–>60 j] ; 4,69 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| active / C-balanced | 7 j [6 j–9 j] ; 100 % observés | 9 j [8 j–13 j] ; 100 % observés | 21 j [8 j–>60 j] ; 83,59 % observés | >60 j [47 j–>60 j] ; 10,94 % observés | >60 j [>60 j–>60 j] ; 0,78 % observés |
| active / F-no-duel | 11 j [10 j–14 j] ; 100 % observés | 14 j [13 j–17 j] ; 100 % observés | 38 j [13 j–>60 j] ; 66,41 % observés | >60 j [>60 j–>60 j] ; 3,91 % observés | >60 j [>60 j–>60 j] ; 0,78 % observés |
| active / G-no-rift | 8 j [6 j–9 j] ; 100 % observés | 10 j [9 j–15 j] ; 100 % observés | 24 j [9 j–>60 j] ; 78,13 % observés | >60 j [>60 j–>60 j] ; 4,69 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| active / H-no-expedition | 9 j [7 j–12 j] ; 100 % observés | 12 j [11 j–17 j] ; 100 % observés | 30 j [11 j–>60 j] ; 80,47 % observés | >60 j [>60 j–>60 j] ; 7,81 % observés | >60 j [>60 j–>60 j] ; 0 % observés |

Une série chanceuse permet de battre Morgath avant P50. Le régulier équilibré gagne au jour 12 médian. Focus Warrior sans achat de gear rallonge la préparation ; focus équipement la raccourcit. Le jackpot est volontaire et séparé du financement pré-Boss.

Benchmark contrôlé N10, gear identique entre Warriors, **non prêté aux carrières** :

| Warrior | Sans gear | Commun | Moyen Épique | Bon Légendaire | Endgame Mythique |
| --- | --- | --- | --- | --- | --- |
| Karg | 0 % | 0 % | 9,5 % | 44,4 % | 82,3 % |
| Naya | 0 % | 0,1 % | 10,6 % | 40 % | 82,8 % |
| Brakk | 0 % | 0 % | 8,5 % | 45,2 % | 82,6 % |
| Eyla | 0 % | 0 % | 7,4 % | 41,4 % | 79,3 % |
| Asha | 0 % | 0 % | 10,9 % | 47,9 % | 83,9 % |
| Rhex | 0 % | 0,4 % | 16,1 % | 53,4 % | 85,5 % |
| Ursak | 0 % | 0 % | 9,7 % | 46,2 % | 87 % |
| Saar | 0 % | 0,1 % | 9,3 % | 42,8 % | 79,7 % |
| Morga | 0 % | 0 % | 10,6 % | 54,1 % | 89,6 % |
| Vorka | 0 % | 0,1 % | 12,1 % | 44,4 % | 79,2 % |
| Urgath | 0,1 % | 0 % | 12 % | 55,9 % | 89,9 % |
| TYRAK | 0,3 % | 0,2 % | 21 % | 62,6 % | 91,7 % |

P80 n’est pas automatiquement acquis à N10. « >60 j » est une censure, pas une estimation à 61 jours. Moyen =Marteau/Carapace ; bon =Griffe/Fourrure ; endgame =Cœur/Peau. La disponibilité du dernier couple est analysée en R.

## H. Nemesis

Sondes Boss à 400 graines avec l’inventaire réellement obtenu. Un jalon de probabilité exige aussi que le Boss soit accessible. Premier essai ≠ chance raisonnable ; P20/P50/P80 sont des estimations, pas des promesses.

| Profil / stratégie | Premier essai | Première victoire | P≥20 % | P≥50 % | P≥80 % |
| --- | --- | --- | --- | --- | --- |
| casual / C-balanced | 19 j [16 j–28 j] ; 100 % observés | 27 j [19 j–43 j] ; 97,66 % observés | >60 j [>60 j–>60 j] ; 6,25 % observés | >60 j [>60 j–>60 j] ; 0 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| casual / F-no-duel | 18 j [14 j–29 j] ; 100 % observés | 29 j [18 j–49 j] ; 92,97 % observés | >60 j [>60 j–>60 j] ; 3,13 % observés | >60 j [>60 j–>60 j] ; 0 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| casual / G-no-rift | 18 j [14 j–29 j] ; 100 % observés | 28 j [17 j–52 j] ; 91,41 % observés | >60 j [>60 j–>60 j] ; 5,47 % observés | >60 j [>60 j–>60 j] ; 0 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| casual / H-no-expedition | 49 j [42 j–59 j] ; 91,41 % observés | 59 j [46 j–>60 j] ; 53,91 % observés | >60 j [>60 j–>60 j] ; 3,13 % observés | >60 j [>60 j–>60 j] ; 0 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| regular / C-balanced | 15 j [11 j–29 j] ; 100 % observés | 26 j [14 j–51 j] ; 96,09 % observés | >60 j [>60 j–>60 j] ; 7,81 % observés | >60 j [>60 j–>60 j] ; 0 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| regular / F-no-duel | 19 j [13 j–28 j] ; 100 % observés | 28 j [16 j–51 j] ; 92,97 % observés | >60 j [>60 j–>60 j] ; 5,47 % observés | >60 j [>60 j–>60 j] ; 0,78 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| regular / G-no-rift | 16 j [13 j–26 j] ; 100 % observés | 26 j [15 j–45 j] ; 96,88 % observés | >60 j [>60 j–>60 j] ; 4,69 % observés | >60 j [>60 j–>60 j] ; 0 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| regular / H-no-expedition | 32 j [26 j–43 j] ; 98,44 % observés | 40 j [30 j–>60 j] ; 84,38 % observés | >60 j [>60 j–>60 j] ; 3,91 % observés | >60 j [>60 j–>60 j] ; 0 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| active / C-balanced | 10 j [8 j–15 j] ; 100 % observés | 14 j [9 j–24 j] ; 100 % observés | >60 j [>60 j–>60 j] ; 8,59 % observés | >60 j [>60 j–>60 j] ; 0,78 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| active / F-no-duel | 15 j [14 j–20 j] ; 100 % observés | 20 j [15 j–32 j] ; 100 % observés | >60 j [>60 j–>60 j] ; 3,13 % observés | >60 j [>60 j–>60 j] ; 0 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| active / G-no-rift | 12 j [10 j–16 j] ; 100 % observés | 16 j [11 j–28 j] ; 100 % observés | >60 j [>60 j–>60 j] ; 4,69 % observés | >60 j [>60 j–>60 j] ; 0 % observés | >60 j [>60 j–>60 j] ; 0 % observés |
| active / H-no-expedition | 14 j [12 j–18 j] ; 100 % observés | 17 j [13 j–26 j] ; 100 % observés | >60 j [>60 j–>60 j] ; 7,81 % observés | >60 j [>60 j–>60 j] ; 0 % observés | >60 j [>60 j–>60 j] ; 0 % observés |

Némésis est accessible sans verrou de niveau/gear dès Morgath Normal. Ses ennemis sont endgame : N1 Force 105/PV1120 contre 8/110 en Normal1, pas simplement toutes les stats ×3. En équilibré, P50 reste censuré à 60 jours dans la quasi-totalité des carrières. Le frein est surtout le gear, pas un nouveau niveau. Aucun délai cible supplémentaire inventé.

| Profil | Délai Normal gagné→Némésis P50 (cas observés seulement) | Némésis terminée à J30 |
| --- | --- | --- |
| casual | Non estimable : 0/128 cas à J60 | 64,06 % |
| regular | Non estimable : 0/128 cas à J60 | 60,94 % |
| active | 24 j [24–24] ; 1/128 cas, pas une médiane de population | 96,09 % |

Benchmark contrôlé N10, gear identique entre Warriors, **non prêté aux carrières** :

| Warrior | Sans gear | Commun | Moyen Épique | Bon Légendaire | Endgame Mythique |
| --- | --- | --- | --- | --- | --- |
| Karg | 0 % | 0 % | 1,2 % | 17,4 % | 50,8 % |
| Naya | 0 % | 0 % | 2,1 % | 15,1 % | 56,9 % |
| Brakk | 0 % | 0 % | 1,4 % | 16,3 % | 50,5 % |
| Eyla | 0 % | 0 % | 0,5 % | 10,4 % | 45,9 % |
| Asha | 0 % | 0 % | 0,4 % | 15,9 % | 54,4 % |
| Rhex | 0 % | 0 % | 1,7 % | 19,1 % | 59,2 % |
| Ursak | 0 % | 0 % | 0,5 % | 16,7 % | 54,5 % |
| Saar | 0 % | 0 % | 1,3 % | 11,8 % | 48,6 % |
| Morga | 0 % | 0 % | 1,4 % | 17,7 % | 59,8 % |
| Vorka | 0 % | 0 % | 1,5 % | 17,6 % | 46,9 % |
| Urgath | 0 % | 0 % | 1,4 % | 20 % | 60,9 % |
| TYRAK | 0 % | 0 % | 3,6 % | 28,4 % | 66,4 % |

P80 n’est pas automatiquement acquis à N10. « >60 j » est une censure, pas une estimation à 61 jours. Moyen =Marteau/Carapace ; bon =Griffe/Fourrure ; endgame =Cœur/Peau. La disponibilité du dernier couple est analysée en R.

## I. Adventure Charges

Caps contre-factuels, recharge 1/20 min inchangée. Tous commencent avec 10 charges ; les caps supérieurs se remplissent après la première session, sans cadeau initial.

| Cap | Vide→plein | Aventures/j J1–30 | Arrêts réserve vide/j | Premier N10 | Normal gagné | Pièces Normal+Némésis J30 |
| --- | --- | --- | --- | --- | --- | --- |
| 10 | 200 min | 10 | 1 | 9 j [8 j–9 j] ; 100 % observés | 12 j [9 j–23 j] ; 100 % observés | 2 972,15 |
| 15 | 300 min | 14,83 | 1 | 9 j [8 j–9 j] ; 100 % observés | 11 j [8 j–18 j] ; 100 % observés | 4 231,41 |
| 20 | 400 min | 19,67 | 1 | 8 j [8 j–9 j] ; 100 % observés | 11 j [8 j–18 j] ; 100 % observés | 5 365,12 |
| 25 | 500 min | 20,94 | 0,03 | 8 j [8 j–9 j] ; 100 % observés | 11 j [8 j–18 j] ; 100 % observés | 5 674,37 |
| 30 | 600 min | 20,94 | 0,03 | 8 j [8 j–9 j] ; 100 % observés | 11 j [8 j–18 j] ; 100 % observés | 5 674,37 |

**Recommandation : 15**, plus petit cap répondant au confort proposé de 15 Aventures/session. Avec 10 Duels et jusqu’à 5 Faille : 30 actions ≈15 minutes, laissant 9 minutes de menus au régulier de 24 minutes. C’est une cible UX proposée, pas de la télémétrie. Cap 20 si l’on souhaite 20 Aventures/session ; 25/30 ne produisent presque plus de gain dans ce budget de temps. Le gain vers N10 reste limité, et les activités restent épuisables.

La recharge ne commence qu’à la dépense Aventure, après Faille/Duel dans cette politique ; elle peut arriver trop tard dans une session courte. Cap ≠ quota quotidien : plusieurs sessions permettent plus de 10 combats/jour actuellement. Cap 15 ne change ni les rewards ni la pente de grind.

## J. Duel

Hypothèse 10/jour sans recharge, même moteur et rewards, **non implémentée**.

| Profil | Règle | Duels/j J1–30 | XP main Duel J30 | Pièces Duel/j | Points/j | Premier N10 |
| --- | --- | --- | --- | --- | --- | --- |
| regular | Cap10+recharge | 10 | 941,23 | 98,58 | 104,85 | 9 j [8 j–9 j] ; 100 % observés |
| regular | 10/jour | 10 | 941,23 | 98,58 | 104,85 | 9 j [8 j–9 j] ; 100 % observés |
| active | Cap10+recharge | 30 | 2 635,43 | 298,48 | 317,84 | 8 j [8 j–9 j] ; 100 % observés |
| active | 10/jour | 10 | 1 199,63 | 99,22 | 105,49 | 11 j [10 j–11 j] ; 100 % observés |

Pour 10 Duels à taux de victoire p : XP nominale =40+160p ; pièces =200p. À p=0/50/70/100 % : 40/120/152/200 XP et 0/100/140/200 pièces. Sans adversaire : aucun combat, XP, pièce ou charge, jamais une défaite fictive à 4 XP. F sans Duel borne ce cas.

Ranking : victoire 20+5×écart positif de rareté, max45 ; défaite0 ; points cumulés sans retrait. Dix victoires/jour donnent 200–450 points/jour. La recharge actuelle fournit jusqu’à 72 charges/24h hors stock initial, encourage les retours et favorise l’assiduité. Un hard cap10 réduit cette pression, mais l’actif équilibré passe de N10 médian 8 à 11 jours ; le régulier à 10/session ne change pas.

Recommandation : 10/jour côté serveur, reset Paris explicite, facultatif, aucun bot. Le matchmaking par points peut opposer des comptes trop forts aux nouveaux ; la population analytique ne valide pas les taux réels. Ne pas refondre le classement sans population observée. L’absence de Duel ne doit verrouiller aucun mode PvE.

## K. Expedition

20000 tirages de récompenses par durée réelle :

| Durée | XP moyenne | Pièces | Objets/retour | Coffre Équipement % | Coffre Warrior % | Épiques/retour | Légendaires/retour |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 6 h | 150,09 | 87,42 | 0,35 | 2,46 % | 0,51 % | 0 | 0 |
| 12 h | 300,08 | 175 | 0,69 | 4,84 % | 1,01 % | 0,01 | 0 |
| 23.6 h | 590,21 | 344,01 | 1,04 | 9,61 % | 1,92 % | 0,02 | 0 |
| 24 h | 600,35 | 350,16 | 1,4 | 10,1 % | 1,91 % | 0,03 | 0 |

**23 h 36 ≠24 h** : trois jets d’objets au tier18h, contre quatre au meilleur tier24h. Au-delà de la petite différence d’XP/pièces, un jet entier disparaît. Une session quotidienne à heure fixe rappelant le main à son début doit attendre 24h depuis l’envoi, décaler son horaire ou envoyer un secondaire.

Quatre retours de 6h et un retour de 24h ont même espérance 600 XP/350 pièces, quatre jets à 35 %, chances de coffres proratisées totalisant 0,1/0,02. Les tiers 6h donnent un loot inférieur : aucun avantage de qualité à rappeler toutes les 6h. Les rappels du main entre sessions cumulent toutefois combats et presque 600 XP, donc une pression de planning réelle. L’actif D en profite ; C overnight reçoit environ 300 XP.

Régulier sans Expédition : 24 j [22 j–28 j] ; 100 % observés contre 9 j [8 j–9 j] ; 100 % observés. La facultativité est technique, mais le retard majeur. 600 XP seuls exigent ≈11,42 retours pour 6850 XP. Envoyer un secondaire respecte la même règle, mais retarde le main : E 23 j [21 j–25 j] ; 100 % observés.

Conserver 24h naturel et 600 comme référence, sans boost ou catch-up automatique. Arbitrer la cible sans Expédition et la disponibilité du main avant toute modification. Fallout Shelter reste une piste future hors scope, aucun nouveau journal/lore ici.

## L. Late Warrior Progression / Personal First Clears

### L1. Modèle exact et équité

Actuel : un niveau déjà terminé par le compte ne donne au nouveau Warrior que 5 XP Normal/10 Némésis. Candidat : la première victoire du compte donne les récompenses actuelles ET consomme la marque personnelle du Warrior ayant combattu. Chaque autre Warrior, possédé avant ou après ce clear, obtient 20/50 XP **une fois par Warrior/niveau/mode**, à sa propre victoire.

Cette première victoire personnelle ultérieure donne **XP seulement : zéro pièce first-clear, coffre, ticket, progression, jackpot Boss ou bonus de maîtrise globale supplémentaire**. Ensuite replay ordinaire 5 XP/5 pièces ou 10/10. Une seule carte et progression de compte.

Parcours ci-dessous entièrement gagnés ; XP cumulée =reward×victoires. La colonne XP restante est la valeur résiduelle dans le niveau, selon la vraie courbe.

| Mode | Parcours accessible gagné | Système | XP cumulée | Niveau +XP résiduelle | Victoires/charges | Temps actif à 30 s |
| --- | --- | --- | --- | --- | --- | --- |
| normal | 1→5 | current | 25 | N1 +25 XP | 5 | 2,5 min |
| normal | 1→5 | personal | 100 | N1 +100 XP | 5 | 2,5 min |
| normal | 1→10 | current | 50 | N1 +50 XP | 10 | 5 min |
| normal | 1→10 | personal | 200 | N2 +80 XP | 10 | 5 min |
| normal | 1→15 | current | 75 | N1 +75 XP | 15 | 7,5 min |
| normal | 1→15 | personal | 300 | N3 +0 XP | 15 | 7,5 min |
| normal | 1→20 | current | 100 | N1 +100 XP | 20 | 10 min |
| normal | 1→20 | personal | 400 | N3 +100 XP | 20 | 10 min |
| nemesis | 1→5 | current | 50 | N1 +50 XP | 5 | 2,5 min |
| nemesis | 1→5 | personal | 250 | N2 +130 XP | 5 | 2,5 min |
| nemesis | 1→10 | current | 100 | N1 +100 XP | 10 | 5 min |
| nemesis | 1→10 | personal | 500 | N3 +200 XP | 10 | 5 min |
| nemesis | 1→15 | current | 150 | N2 +30 XP | 15 | 7,5 min |
| nemesis | 1→15 | personal | 750 | N4 +150 XP | 15 | 7,5 min |
| nemesis | 1→20 | current | 200 | N2 +80 XP | 20 | 10 min |
| nemesis | 1→20 | personal | 1000 | N4 +400 XP | 20 | 10 min |

Normal1→20 =400 XP →N3+100, **pas N6–7**. Némésis1→20 =1000 XP →N4+400. Vingt Normal +vingt Némésis =1400 XP →N5+350. N1 ne bat pas nécessairement Normal5, encore moins Némésis1 : ce sont des bornes après victoires, pas des gains gratuits.

Un main utilisé dès le début reçoit ces mêmes 400 XP Normal. Les marques personnelles restituent exactement cette opportunité au tardif : même courbe et rewards, aucun multiplicateur lié au main, à la rareté ou à la carte. Karg a battu Normal1→15 ; Naya nouvelle N1 gagne20 XP à sa première victoire sur1, puis5 XP/5 pièces à la deuxième ; niveau2 nouveau pour elle =20 XP. Un Warrior déjà possédé mais inutilisé garde aussi ses marques disponibles. Les premières globales futures consomment simultanément la marque du seul combattant.

### L2. Minimum de victoires, tous niveaux disponibles et gagnables


| Mode | Nodes disponibles | Cible | Replay actuel | Personal proposé | Charges économisées | Jours à 10 combats/j actuel→personal |
| --- | --- | --- | --- | --- | --- | --- |
| normal | 5 | N3 | 60 | 45 | 15 | 6→4,5 |
| normal | 5 | N5 | 210 | 195 | 15 | 21→19,5 |
| normal | 5 | N7 | 510 | 495 | 15 | 51→49,5 |
| normal | 5 | N10 | 1370 | 1355 | 15 | 137→135,5 |
| normal | 10 | N3 | 60 | 30 | 30 | 6→3 |
| normal | 10 | N5 | 210 | 180 | 30 | 21→18 |
| normal | 10 | N7 | 510 | 480 | 30 | 51→48 |
| normal | 10 | N10 | 1370 | 1340 | 30 | 137→134 |
| normal | 15 | N3 | 60 | 15 | 45 | 6→1,5 |
| normal | 15 | N5 | 210 | 165 | 45 | 21→16,5 |
| normal | 15 | N7 | 510 | 465 | 45 | 51→46,5 |
| normal | 15 | N10 | 1370 | 1325 | 45 | 137→132,5 |
| normal | 20 | N3 | 60 | 15 | 45 | 6→1,5 |
| normal | 20 | N5 | 210 | 150 | 60 | 21→15 |
| normal | 20 | N7 | 510 | 450 | 60 | 51→45 |
| normal | 20 | N10 | 1370 | 1310 | 60 | 137→131 |
| nemesis | 5 | N3 | 30 | 10 | 20 | 3→1 |
| nemesis | 5 | N5 | 105 | 85 | 20 | 10,5→8,5 |
| nemesis | 5 | N7 | 255 | 235 | 20 | 25,5→23,5 |
| nemesis | 5 | N10 | 685 | 665 | 20 | 68,5→66,5 |
| nemesis | 10 | N3 | 30 | 6 | 24 | 3→0,6 |
| nemesis | 10 | N5 | 105 | 65 | 40 | 10,5→6,5 |
| nemesis | 10 | N7 | 255 | 215 | 40 | 25,5→21,5 |
| nemesis | 10 | N10 | 685 | 645 | 40 | 68,5→64,5 |
| nemesis | 15 | N3 | 30 | 6 | 24 | 3→0,6 |
| nemesis | 15 | N5 | 105 | 45 | 60 | 10,5→4,5 |
| nemesis | 15 | N7 | 255 | 195 | 60 | 25,5→19,5 |
| nemesis | 15 | N10 | 685 | 625 | 60 | 68,5→62,5 |
| nemesis | 20 | N3 | 30 | 6 | 24 | 3→0,6 |
| nemesis | 20 | N5 | 105 | 25 | 80 | 10,5→2,5 |
| nemesis | 20 | N7 | 255 | 175 | 80 | 25,5→17,5 |
| nemesis | 20 | N10 | 685 | 605 | 80 | 68,5→60,5 |

Sans défaite ou source extérieure : 20 premiers clears Normal économisent 60 victoires au-delà de 400 XP ; 20 Némésis économisent 80 au-delà de 1000. Normal replay seul N1→10 =1370 victoires ; modèle 20 personal =1310 minimum. À 10/jour : 137→131 jours ; temps actif 685→655 min ; budget de recharge 20 min/charge : 456,67→436,67 heures avant stock initial. Ce dernier timer n’est pas du temps actif. Cap15 change les charges/session, pas les XP.

### L3. Vrais combats, Normal1→15 déjà globalement accessible

Fixture avancée : Asha Peu commun N8, compte ayant déjà gagné Normal1→5/10/15/20 ; nouveaux Karg/Naya/Urgath/Tyrak N1. Le cas demandé du Légendaire obtenu tard est Urgath. Gear partagé déjà possédé : commun =Massue/Peaux, moyen =Marteau/Carapace. 128 graines/cellule. Tenter un niveau personnel seulement à P≥20 % estimée sur 200 graines ; après deux défaites/bloc de dix, farm Normal1. Aucun Duel/Faille/Expédition/recyclage. Aucun gear offert selon le niveau du main. Assertions : niveau/XP d’Asha, son preset et les clears globaux restent inchangés.

| Warrior | Gear | Système | Combats médians N3 | N5 | N7 | N10 |
| --- | --- | --- | --- | --- | --- | --- |
| karg | common | current | 61 | 211 | 511 | 1371 |
| karg | common | personal | 49 | 199 | 499 | 1330 |
| karg | medium | current | 60 | 210 | 510 | 1370 |
| karg | medium | personal | 22 | 169 | 469 | 1326 |
| naya | common | current | 62 | 212 | 512 | 1372 |
| naya | common | personal | 50 | 200 | 500 | 1334 |
| naya | medium | current | 60 | 210 | 510 | 1370 |
| naya | medium | personal | 22 | 169 | 469 | 1327 |
| urgath | common | current | 60 | 210 | 510 | 1370 |
| urgath | common | personal | 46 | 185 | 485 | 1331 |
| urgath | medium | current | 60 | 210 | 510 | 1370 |
| urgath | medium | personal | 19 | 169 | 469 | 1326 |
| tyrak | common | current | 60 | 210 | 510 | 1370 |
| tyrak | common | personal | 38 | 185 | 483 | 1332 |
| tyrak | medium | current | 60 | 210 | 510 | 1370 |
| tyrak | medium | personal | 18 | 168 | 468 | 1326 |

Les variantes à 5/10/20 nodes sont également exécutées dans qa-output/v015-personal-clears.json. Avec gear commun, certains clears attendent une montée de niveau ; la carte accessible ne les rend pas gratuits. Le modèle corrige l’injustice de première XP et aide les premiers paliers, **sans résoudre à lui seul le grind secondaire jusqu’à10**.

### L4. Stockage et anti-exploit proposés, non implémentés

Champ proposé : personalClears[warriorId]={normal:[nodes],nemesis:[nodes]}. Défauts rétrocompatibles ; validation des IDs et nodes1–20. Reçu figé sur Warrior du combat, mode, node et ID unique de règlement ; attribution XP+marque atomique ; pertes sans consommation ; flags des jackpots inchangés. Changer le Warrior actif après lancement ne transfère jamais les XP.

Même ID lors d’un reload/doubleclic : aucun second paiement. Nouveau combat sur marque existante : replay. CAS cloud entier incluant XP/reçu, garde monotone des marques. Ne pas additionner les XP de deux branches offline : conflit explicite, aucune double attribution inter-appareils. Les replays ultérieurs redonnent leurs pièces normales, pas la première personnelle.

**Migration à décision humaine** : la v5 ne stocke pas l’identité du Warrior de chaque clear. Impossible de la reconstruire depuis le main actif. Option conservatrice : marquer les anciens Warriors sur les clears globaux (pénalise les tardifs déjà possédés). Option grâce : anciennes marques vides et XP à regagner par victoire une fois, ancien main compris (surplus fini, jamais gratuit). Ne pas promettre zéro redoublement historique sans preuve. Aucun boost, schéma ou migration modifié dans cette phase.

## M. Economy

Conservation contrôlée sur **142 848 snapshots** : 300 initial +sources −sinks =wallet. Régulier équilibré J30 :

| Source | Pièces cumulées | XP créditée au main | XP créditée au roster | XP nominale proposée |
| --- | --- | --- | --- | --- |
| normal | 804,96 | 641,8 | 641,8 | 908,84 |
| nemesis | 2 167,19 | 0 | 0 | 2 496,41 |
| rift | 4 586,25 | 722,82 | 722,82 | 4 586,25 |
| duel | 2 957,5 | 941,23 | 941,23 | 3 566 |
| expedition | 9 982,22 | 4 409,3 | 4 409,3 | 17 090,44 |
| recycle | 5 441,17 | 134,85 | 5 311,06 | 5 853,05 |
| badges | 2 007,81 | 0 | 0 | 0 |
| boss | 3 011,72 | 0 | 0 | 0 |

Dépenses J30 : Warrior 15 607,81, Équipement 15 613,28 ; wallet 37,73. Badges et Boss sont one-shot ; coffres gratuits séparés des payants.

Régulier orienté Warrior A :

| Source | Pièces cumulées | XP créditée au main | XP créditée au roster | XP nominale proposée |
| --- | --- | --- | --- | --- |
| normal | 1 289,88 | 605,31 | 605,31 | 1 499,7 |
| nemesis | 681,64 | 0 | 0 | 778,91 |
| rift | 4 120,63 | 471 | 471 | 4 120,63 |
| duel | 2 981,72 | 947,63 | 947,63 | 3 585,38 |
| expedition | 9 968,05 | 4 527,41 | 4 527,41 | 17 111,61 |
| recycle | 9 388,13 | 298,65 | 9 339,08 | 10 298,87 |
| badges | 1 710,94 | 0 | 0 | 0 |
| boss | 828,13 | 0 | 0 | 0 |

Les jackpots 1500+10 coffres et 2500+3 Faille produisent volontairement un bond de collection, jamais du financement rétroactif pré-Boss. Expédition finance beaucoup de coffres ; ignorer les modes facultatifs réduit fortement le budget. Facultativité technique ≠équivalence économique.

## N. Chest Purchasing

Allocation cumulative de pièces brutes. Revenu récurrent =Normal+Némésis+Faille+Duel+Expédition, hors Boss/badges/recyclage. Fenêtre J15–30 pour isoler ce flux.

| Budget W/E | W payants/j J1–14 | W payants/j J1–30 | E payants/j J1–30 | Pièces récurrentes/j J15–30 | N10 régulier |
| --- | --- | --- | --- | --- | --- |
| 100/0 | 9,81 | 10,4 | 0 | 679,4 | 9 j [9 j–9 j] ; 100 % observés |
| 75/25 | 7,6 | 8,17 | 10,91 | 718,23 | 9 j [8 j–9 j] ; 100 % observés |
| 50/50 | 5,21 | 5,2 | 20,82 | 713,58 | 9 j [8 j–9 j] ; 100 % observés |
| 25/75 | 2,51 | 2,49 | 29,72 | 713,83 | 9 j [8 j–9 j] ; 100 % observés |
| 0/100 | 0 | 0 | 36,69 | 712,2 | 9 j [9 j–9 j] ; 100 % observés |

Roster complet : coût net Warrior 70,02 pièces ; 4–5 coffres payants exigent 280,08/350,1 pièces récurrentes/jour. Roster neuf : moins de doublons, proche de 100/coffre, donc 400–500/jour. Les moyennes payantes J30 incluent des jackpots : elles seules ne prouvent pas 4–5 hors jackpots.

Mais le flux récurrent mesuré du focus Warrior est679,4 pièces/jour à J15–30 : la cible4–5 est **viable et même dépassable** après montée en puissance avec tous les modes. Le régulier équilibré achète5,2 Warrior et20,82 Équipement/jour en moyenne J1–30 ; tension d’allocation réelle, mais volume important des deux. Sans Expédition, ce flux équilibré tombe à341,05 pièces/jour et les achats Warrior à2,36/jour. Sans Faille :537,78 pièces récurrentes/jour,4,13 Warrior payants/jour ; sans Duel :616,96 et4,47. Ni pénurie ni inflation uniforme : la dépendance aux modes et le rendement des copies dominent. Ne pas nerfer sur la seule moyenne incluant jackpots.

Un Warrior coûte quatre essais de gear ; ×10 n’améliore ni odds ni espérance. Budget 50/50 ne donne pas autant de coffres de chaque type. Focus Warrior retarde le gear (principalement drops Expédition), focus gear limite le roster hors Faille/bonus. La tension est réelle, mais le gear Boss peut transformer la préparation en attente de loterie.

## O. Warrior Collection

5000 séquences par longueur, pool12 et vraies tables. Tirages hors bienvenue ; XP de recyclage nominale répartie aux doublons, soumise au plafond.

| Tirages | Uniques moyens | Uniques P10/P50/P90 | Doublons moyens | Pièces recyclées | XP nominale recyclée |
| --- | --- | --- | --- | --- | --- |
| 10 | 5,72 | 4/6/7 | 4,28 | 103,9 | 121,25 |
| 25 | 7,93 | 7/8/9 | 17,07 | 438,26 | 502,38 |
| 50 | 9,02 | 8/9/10 | 40,99 | 1 103,27 | 1 246,97 |
| 100 | 9,65 | 9/10/10 | 90,35 | 2 530,26 | 2 827,73 |
| 250 | 10,2 | 10/10/11 | 239,8 | 6 943,34 | 7 688,63 |
| 500 | 10,54 | 10/11/11 | 489,46 | 14 380,54 | 15 861,62 |
| 1000 | 10,85 | 10/11/11 | 989,15 | 29 305,23 | 32 256,26 |

Aucun délai garanti. Le Mythique bloque souvent le dernier 12/12, croissance des uniques non linéaire. Les doublons aident surtout les communs ; 4–5 coffres ne donnent pas 4–5×25 XP au Warrior choisi. Espérance XP par coffre normal pour le main déjà possédé : Karg/Naya/Brakk/Eyla4,375 chacun ; Asha/Rhex/Ursak2,933 ; Saar/Morga2,625 ; Vorka1,0625 ; Urgath0,28 ; Tyrak0,035. La Faille accélère les raretés Warrior, jamais le gear.

## P. Mythic Odds

Formule exacte 1−(1−0,0001)^n. Durée d’exposition à 1/3/5/10 coffres normaux/jour :

| Tirages | ≥1 Mythique | 1/j | 3/j | 5/j | 10/j |
| --- | --- | --- | --- | --- | --- |
| 100 | 1 % | 100 j | 33,33 j | 20 j | 10 j |
| 500 | 4,88 % | 500 j | 166,67 j | 100 j | 50 j |
| 1000 | 9,52 % | 1 000 j | 333,33 j | 200 j | 100 j |
| 2500 | 22,12 % | 2 500 j | 833,33 j | 500 j | 250 j |
| 5000 | 39,35 % | 5 000 j | 1 666,67 j | 1 000 j | 500 j |
| 6931 | 50 % | 6 931 j | 2 310,33 j | 1 386,2 j | 693,1 j |
| 10000 | 63,21 % | 10 000 j | 3 333,33 j | 2 000 j | 1 000 j |
| 20000 | 86,47 % | 20 000 j | 6 666,67 j | 4 000 j | 2 000 j |

6931 tirages ≈50 %, soit 1386,2 jours à 5/jour, environ 3,8 ans. Probabilité cumulée, jamais date promise ou pity. Après 10000 échecs, le prochain coffre garde 0,01 %. Odds conservées, aucune garantie automatique proposée.

## Q. Rift Chest

| Coffres | ≥1 Mythique Faille 2 % | ≥1 Mythique normal 0,01 % |
| --- | --- | --- |
| 1 | 2 % | 0,01 % |
| 10 | 18,29 % | 0,1 % |
| 25 | 39,65 % | 0,25 % |
| 35 | 50,69 % | 0,35 % |
| 50 | 63,58 % | 0,5 % |
| 100 | 86,74 % | 1 % |
| 150 | 95,17 % | 1,49 % |

Médiane d’obtention : 35 coffres à 2 % (34,31 avant arrondi), pas 35 jours si échecs. À 85 % de clears constants, 35 coffres exigent ≈41,2 jours de présence après accès endgame ; le pity réel influe sur ce taux. Boss Némésis donne trois coffres une fois. Route vers les Warriors extraordinaires, pas le gear Mythique.

## R. Equipment Collection

| Tirages | Gear uniques moyens | P10/P50/P90 |
| --- | --- | --- |
| 10 | 6,22 | 5/6/8 |
| 25 | 9,26 | 8/9/11 |
| 50 | 11,2 | 10/11/13 |
| 100 | 12,8 | 11/13/14 |
| 250 | 14,59 | 13/15/16 |
| 500 | 15,88 | 15/16/17 |
| 1000 | 16,95 | 16/17/18 |

Type50/50 puis rareté : chaque équipement Mythique précis a 0,005 %. Cœur ET Peau après n : 1−2(1−0,00005)^n+(1−0,0001)^n.

| Tirages | ≥1 Mythique quelconque | Cœur ET Peau |
| --- | --- | --- |
| 100 | 1 % | 0 % |
| 500 | 4,88 % | 0,06 % |
| 1000 | 9,52 % | 0,24 % |
| 2500 | 22,12 % | 1,38 % |
| 5000 | 39,35 % | 4,89 % |
| 6931 | 50 % | 8,58 % |
| 10000 | 63,21 % | 15,48 % |
| 20000 | 86,47 % | 39,96 % |

Médiane du couple24559 tirages,613975 pièces brutes ; à20 coffres gear/jour1227,95 jours. Le recyclage réduit le coût, pas le nombre de tirages. Expédition24h : quatre jets×35 %×0,01 % =0,00014 objet Mythique attendu/jour, soit ≈0,014 % de chance quotidienne (≈7143 jours d’espérance). Aucun accès garanti. Légendaire quelconque0,14 % : 1/714 essais en espérance ; par slot1/1429.

**Un benchmark Cœur/Peau ne signifie pas que le joueur en disposera normalement.** Les odds restent exceptionnelles, aucun pity proposé. Arbitrer préparation normalement obtenable versus artefacts exceptionnels. Le badge Arsenal sur15 IDs exige déjà les deux Mythiques, même sans étendre son catalogue à20.

## S. Equipment Recycle

Candidat non implémenté : manuel, surplus quantity>1 ; conserver une copie partagée utilisable par tous les loadouts ; pièces seulement, ni XP, forge ou automatisation.

| Table | Commun | Peu commun | Rare | Épique | Légendaire | Mythique | Remboursement moyen roster complet | % du prix | Multiplicateur limite des achats |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| prudent | 2 | 3 | 5 | 8 | 12 | 18 | 2,62 | 10,49 % | 1,12 |
| balanced | 3 | 5 | 8 | 12 | 18 | 24 | 4,11 | 16,44 % | 1,2 |
| generous | 5 | 8 | 12 | 18 | 24 | 24 | 6,61 | 26,44 % | 1,36 |

5000 chaînes depuis250 pièces et inventaire vide ; prix25, première copie gardée, surplus réinvestis jusqu’à épuisement :

| Table | Tirages moyens | P10/P50/P90 | Remboursement moyen |
| --- | --- | --- | --- |
| prudent | 10 | 10/10/10 | 8,48 |
| balanced | 10,01 | 10/10/10 | 13,12 |
| generous | 10,34 | 10/10/11 | 22,62 |

Recommandation **balanced 3/5/8/12/18/24**, ou prudent2/3/5/8/12/18 si un sink plus fort est désiré. Chaque remboursement <25 : **chaque boucle coûte**, même Mythique. Impossibilité d’autosuffisance, pas seulement espérance négative. Une copie suffit aux presets partagés. Confirmation et reçus/CAS atomiques contre doubleclic/reload ; conserver les IDs et presets.

Recyclage Warrior actuel, tous possédés : remboursement normal moyen 29,98, coût net 70,02, facteur de réinvestissement 1,43. Coffre Faille gratuit : remboursement moyen 106. Légendaire200/Mythique250 dépassent100 individuellement, pas en espérance. Surveiller les séries rares sans conclure automatiquement à une inflation globale. Au N10 les pièces continuent, l’XP est jetée sans conversion.

## T. Equipment Builds

100 combinaisons ×12 Warriors ×1000 graines contre Morgath Némésis, N10, mêmes seeds. Top5 sans restriction d’inventaire ; écarts <3 points potentiellement ex æquo statistiques.

| Warrior | Rang | Arme | Armure | Winrate |
| --- | --- | --- | --- | --- |
| Karg | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 50,8 % |
| Karg | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 34,8 % |
| Karg | 3 | Griffe du Tyran | Peau du Titan primordial | 27,7 % |
| Karg | 4 | Cœur du Titan Primordial | Garde des Ancêtres | 24,6 % |
| Karg | 5 | Cœur du Titan Primordial | Carapace volcanique | 19,7 % |
| Naya | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 56,9 % |
| Naya | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 34,6 % |
| Naya | 3 | Griffe du Tyran | Peau du Titan primordial | 30,3 % |
| Naya | 4 | Cœur du Titan Primordial | Garde des Ancêtres | 25,5 % |
| Naya | 5 | Cœur du Titan Primordial | Carapace volcanique | 18,9 % |
| Brakk | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 50,5 % |
| Brakk | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 36,7 % |
| Brakk | 3 | Cœur du Titan Primordial | Garde des Ancêtres | 29,5 % |
| Brakk | 4 | Griffe du Tyran | Peau du Titan primordial | 25,2 % |
| Brakk | 5 | Cœur du Titan Primordial | Carapace volcanique | 23,9 % |
| Eyla | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 45,9 % |
| Eyla | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 32,2 % |
| Eyla | 3 | Cœur du Titan Primordial | Garde des Ancêtres | 19,3 % |
| Eyla | 4 | Griffe du Tyran | Peau du Titan primordial | 19 % |
| Eyla | 5 | Cœur du Titan Primordial | Carapace volcanique | 15,5 % |
| Asha | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 54,4 % |
| Asha | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 36,5 % |
| Asha | 3 | Cœur du Titan Primordial | Garde des Ancêtres | 27,5 % |
| Asha | 4 | Griffe du Tyran | Peau du Titan primordial | 26,6 % |
| Asha | 5 | Cœur du Titan Primordial | Carapace volcanique | 20,5 % |
| Rhex | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 59,2 % |
| Rhex | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 43,8 % |
| Rhex | 3 | Cœur du Titan Primordial | Garde des Ancêtres | 30,5 % |
| Rhex | 4 | Griffe du Tyran | Peau du Titan primordial | 28,4 % |
| Rhex | 5 | Cœur du Titan Primordial | Carapace volcanique | 24,7 % |
| Ursak | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 54,5 % |
| Ursak | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 38,6 % |
| Ursak | 3 | Cœur du Titan Primordial | Garde des Ancêtres | 27,2 % |
| Ursak | 4 | Griffe du Tyran | Peau du Titan primordial | 26,5 % |
| Ursak | 5 | Cœur du Titan Primordial | Carapace volcanique | 19,7 % |
| Saar | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 48,6 % |
| Saar | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 32 % |
| Saar | 3 | Griffe du Tyran | Peau du Titan primordial | 23,9 % |
| Saar | 4 | Cœur du Titan Primordial | Garde des Ancêtres | 22,6 % |
| Saar | 5 | Cœur du Titan Primordial | Carapace volcanique | 18,7 % |
| Morga | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 59,8 % |
| Morga | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 43,7 % |
| Morga | 3 | Cœur du Titan Primordial | Garde des Ancêtres | 36,8 % |
| Morga | 4 | Griffe du Tyran | Peau du Titan primordial | 30,6 % |
| Morga | 5 | Cœur du Titan Primordial | Carapace volcanique | 23,7 % |
| Vorka | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 46,9 % |
| Vorka | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 35,7 % |
| Vorka | 3 | Griffe du Tyran | Peau du Titan primordial | 26,5 % |
| Vorka | 4 | Cœur du Titan Primordial | Garde des Ancêtres | 24,8 % |
| Vorka | 5 | Cœur du Titan Primordial | Carapace volcanique | 22,8 % |
| Urgath | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 60,9 % |
| Urgath | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 43,9 % |
| Urgath | 3 | Cœur du Titan Primordial | Garde des Ancêtres | 37,9 % |
| Urgath | 4 | Griffe du Tyran | Peau du Titan primordial | 31,6 % |
| Urgath | 5 | Cœur du Titan Primordial | Carapace volcanique | 26 % |
| TYRAK | 1 | Cœur du Titan Primordial | Peau du Titan primordial | 66,4 % |
| TYRAK | 2 | Cœur du Titan Primordial | Fourrure du Titan blanc | 50 % |
| TYRAK | 3 | Cœur du Titan Primordial | Garde des Ancêtres | 42,6 % |
| TYRAK | 4 | Griffe du Tyran | Peau du Titan primordial | 39,2 % |
| TYRAK | 5 | Cœur du Titan Primordial | Carapace volcanique | 33 % |

Les 20 équipements analysés :

| Objet | Type | Rareté | Bonus | Effet |
| --- | --- | --- | --- | --- |
| Massue de silex | weapon | Commun | +3 Force | 5 % : +20 % dégâts |
| Lance d’os | weapon | Commun | +1 Force · +4 Vitesse | Premier coup : +10 % dégâts |
| Hache d’obsidienne | weapon | Peu commun | +7 Force · +20 PV | 6 % : saignement, 3 dégâts ×2 |
| Arc du chasseur | weapon | Peu commun | +4 Force · +8 Vitesse | Esquive adverse : −3 points |
| Crocs du Smilodon | weapon | Rare | +14 Force · +10 Vitesse | 8 % : second coup à 50 % |
| Lance du Mammouth ancestral | weapon | Rare | +18 Force · +50 PV | 10 % : ignore les réductions de dégâts |
| Marteau volcanique | weapon | Épique | +38 Force · +100 PV | 10 % : brûlure, 3 dégâts ×2 |
| Javelot des Tempêtes | weapon | Épique | +30 Force · +20 Vitesse · +8 Esquive | Premier coup : +20 % dégâts |
| Griffe du Tyran | weapon | Légendaire | +55 Force · +14 Vitesse | 12 % : +50 % dégâts |
| Cœur du Titan Primordial | weapon | Mythique | +75 Force · +22 Vitesse · +100 PV | 7 % : +80 % dégâts |
| Peaux du chasseur | armor | Commun | +30 PV | Premier coup reçu : −5 % dégâts |
| Manteau des Roseaux | armor | Commun | +15 PV · +4 Esquive | Premier coup reçu : −5 % dégâts |
| Harnais d’os | armor | Peu commun | +65 PV · +3 Force | 5 % : −25 % dégâts reçus |
| Écailles du Raptor | armor | Peu commun | +45 PV · +6 Vitesse · +6 Esquive | Premier coup reçu : −10 % dégâts |
| Cuirasse du Mammouth ancestral | armor | Rare | +140 PV · +6 Force | Bonus de critique adverse : −20 % |
| Cape du Smilodon | armor | Rare | +95 PV · +14 Esquive · +8 Vitesse | Premier coup reçu : −15 % dégâts |
| Carapace volcanique | armor | Épique | +320 PV · +10 Force | 10 % : brûle l’attaquant, 3 dégâts ×2 |
| Garde des Ancêtres | armor | Épique | +260 PV · +20 Esquive · +12 Vitesse | Les 3 premiers coups reçus : −15 % dégâts |
| Fourrure du Titan blanc | armor | Légendaire | +450 PV · +15 Force | Au-dessus de 50 % PV : −8 % dégâts reçus |
| Peau du Titan primordial | armor | Mythique | +650 PV · +25 Esquive | Les 3 premiers coups reçus : −20 % dégâts |

Cœur/Peau premier pour les12 : méta universelle dans ce benchmark, pas preuve de diversité endgame. +75Force/+22Vitesse/+100PV et +650PV/+25Esquive couvrent presque tous les styles. Les procs inférieurs intéressants ne compensent pas cette masse de stats.

Philosophie A : montée de rareté presque toujours supérieure. B recommandée : supérieure meilleure globalement, mais inférieure spécialisée parfois optimale face à un profil. Aucun bonus de classe ou nerf inventé ici. Un seul Boss ne couvre pas tout le jeu ; tester plusieurs profils adverses avant toute retouche.

## U. 12 Warrior Balance

Stats N10 hors gear : Force/Esquive/Vitesse/PV. Dégâts basiques hors critiques/variance/procs. Esquive45 ne signifie pas45 % ; la probabilité suit la formule plafonnée.

| Warrior | Classe | Rareté | Stats N10 | Dégât basique | Esquive de base | Némésis moyen/bon/endgame | Gain passifs endgame (points) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Karg | Ravageur | Commun | 99/28/40/1139 | 75,05 | 11,88 % | 1,2 % / 17,4 % / 50,8 % | 29,75 |
| Naya | Spectre | Commun | 73/45/55/900 | 60,94 | 15,17 % | 2,1 % / 15,1 % / 56,9 % | 47,05 |
| Brakk | Bastion | Commun | 95/25/32/1260 | 72,94 | 11,2 % | 1,4 % / 16,3 % / 50,5 % | 31,15 |
| Eyla | Tempête | Commun | 94/35/50/1099 | 72,42 | 13,33 % | 0,5 % / 10,4 % / 45,9 % | 22,25 |
| Asha | Fléau | Peu commun | 99/30/43/1179 | 75,05 | 12,31 % | 0,4 % / 15,9 % / 54,4 % | 28,6 |
| Rhex | Héraut | Peu commun | 98/35/50/1139 | 74,52 | 13,33 % | 1,7 % / 19,1 % / 59,2 % | 32,65 |
| Ursak | Ravageur | Peu commun | 98/26/38/1206 | 74,52 | 11,43 % | 0,5 % / 16,7 % / 54,5 % | 32,1 |
| Saar | Spectre | Rare | 99/44/54/1139 | 75,05 | 15 % | 1,3 % / 11,8 % / 48,6 % | 15,55 |
| Morga | Bastion | Rare | 100/24/33/1300 | 75,57 | 10,97 % | 1,4 % / 17,7 % / 59,8 % | 37,65 |
| Vorka | Fléau | Épique | 103/38/50/1233 | 77,13 | 13,91 % | 1,5 % / 17,6 % / 46,9 % | 12,85 |
| Urgath | Bastion | Légendaire | 102/26/35/1353 | 76,61 | 11,43 % | 1,4 % / 20 % / 60,9 % | 29,2 |
| TYRAK | Ravageur | Mythique | 106/28/42/1380 | 78,68 | 11,88 % | 3,6 % / 28,4 % / 66,4 % | 26,6 |

Identités : Karg burst/pression/exécution ; Naya esquive→tempo et PV faibles ; Brakk mitigation/bloc/riposte ; Eyla tirs bonus/exécution ; Asha braises/détonation ; Rhex morsures/relais ; Ursak fureur sous pression ; Saar cadence/esquive ; Morga mitigation/soin ; Vorka saignement/exécution ; Urgath amortissement/froid ; Tyrak sursaut/prédation.

| Warrior | Passif3 | Passif7 | Passif10 |
| --- | --- | --- | --- |
| Karg | Premier Sang | Pression du chasseur | Coup de Grâce |
| Naya | Pas d’Ombre | Tempo fantôme | Embuscade décisive |
| Brakk | Garde rocheuse | Riposte du Bastion | Dernière Résistance |
| Eyla | Mise en joue | Cadence précise | Flèche fatale |
| Asha | Marque de Braise | Foyer ardent | Crescendo incandescent |
| Rhex | Signal de meute | Relais de meute | Assaut coordonné |
| Ursak | Fureur cavernicole | Endurance sous pression | Fureur ancestrale |
| Saar | Pas félin | Frénésie féline | Contre-attaque prédatrice |
| Morga | Garde d’Ivoire | Protection de la tribu | Endurance de Matriarche |
| Vorka | Entaille d’obsidienne | Pression persistante | Coupure décisive |
| Urgath | Rempart glacial | Froid écrasant | Résilience du Titan |
| TYRAK | Présence primordiale | Sursaut cristallin | Domination du Roi |

Les36 kits restent inchangés et les noms proviennent des définitions. Naya dépend de ses seuils7/10 et d’esquives utiles, fragile avant7. Morga/Urgath profitent des combats longs mitigés. Eyla/Rhex gardent des dégâts forts malgré la faible rareté. À gear endgame identique, Tyrak dépasse les autres ici ; Eyla/Vorka/Saar restent plus faibles face à ce Boss. Ne pas extrapoler un dominant global d’un seul matchup. Les autres niveaux/gear et ablations sont conservés dans les JSON.

## V. Rarity vs Level

Winrate du camp de gauche, moins rare ; gear identique des deux côtés ; stats/passifs réels ; 1000 graines par paire.

| Matchup | Gear identique | Winrate moyen à gauche | Min–max selon identité |
| --- | --- | --- | --- |
| Commun N10 vs Épique N5 | none | 100 % | 100 %–100 % |
| Commun N10 vs Épique N5 | medium | 100 % | 100 %–100 % |
| Commun N10 vs Épique N5 | endgame | 100 % | 100 %–100 % |
| Commun N10 vs Légendaire N5 | none | 100 % | 100 %–100 % |
| Commun N10 vs Légendaire N5 | medium | 100 % | 100 %–100 % |
| Commun N10 vs Légendaire N5 | endgame | 100 % | 100 %–100 % |
| Commun N10 vs Mythique N5 | none | 100 % | 100 %–100 % |
| Commun N10 vs Mythique N5 | medium | 100 % | 100 %–100 % |
| Commun N10 vs Mythique N5 | endgame | 100 % | 100 %–100 % |
| Peu commun N8 vs Rare N6 | none | 99,83 % | 99,7 %–100 % |
| Peu commun N8 vs Rare N6 | medium | 95,53 % | 93,1 %–97,1 % |
| Peu commun N8 vs Rare N6 | endgame | 89,87 % | 87,7 %–93,4 % |
| Rare N7 vs Épique N5 | none | 91,9 % | 90 %–93,8 % |
| Rare N7 vs Épique N5 | medium | 74,15 % | 73,6 %–74,7 % |
| Rare N7 vs Épique N5 | endgame | 68,8 % | 67,7 %–69,9 % |
| Commun N7 vs Mythique N7 | none | 2,85 % | 0,8 %–5,8 % |
| Commun N7 vs Mythique N7 | medium | 20,9 % | 18,8 %–23,7 % |
| Commun N7 vs Mythique N7 | endgame | 35,4 % | 28,6 %–46,4 % |
| Commun N10 vs Mythique N10 | none | 19,45 % | 10,3 %–28,3 % |
| Commun N10 vs Mythique N10 | medium | 29,33 % | 27,1 %–32,7 % |
| Commun N10 vs Mythique N10 | endgame | 37,3 % | 31,2 %–45,2 % |

**RARETÉ >NIVEAU >ÉQUIPEMENT >RNG >PASSIFS n’est pas le ressenti assuré actuellement.** CommunN10 bat Épique/Légendaire/MythiqueN5 bien plus qu’exceptionnellement. KargN10 F99/PV1139 face à TyrakN5 F32/PV358 : le niveau domine. À N10, Tyrak106/1380 ne dépasse Karg que de7,1 % Force/21,2 % PV ; +75Force/+750PV du kit Mythique dépasse cet écart.

Le bond9→10 reste de l’ordre de75–98 % selon la stat malgré le lissage7–9. La rareté est plus visible en early. Arbitrer la compensation N10 et la hiérarchie ressentie, sans imposer de formule stricte. Les passifs produisent de vrais gains (U), pas une identité seulement cosmétique.

## W. RNG Variance

N10 endgame contre Morgath Némésis ; 1000 combats indépendants, blocs de50. Critiques, esquives, initiative, variance et procs réels.

| Warrior | Winrate | Blocs50 P10/P50/P90 % | Streak max pertes/victoires | Fins ±10 %PV | Attaques P10/P50/P90 | Critiques moyens | Esquives moyennes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| karg | 50 % | 40/50/60 | 9/7 | 34,5 % | 30/35/40 | 1,5 | 4,74 |
| naya | 59,8 % | 48/60/70 | 8/15 | 33,4 % | 34/41/45 | 1,56 | 9,01 |
| brakk | 53,4 % | 44/52/62 | 7/9 | 40,5 % | 38/44/50 | 1,82 | 6,12 |
| eyla | 45,6 % | 38/44/56 | 9/8 | 37 % | 35/41/47 | 1,54 | 5,11 |
| asha | 54,2 % | 44/54/64 | 7/8 | 35,6 % | 31/36/41 | 1,55 | 4,97 |
| rhex | 59,4 % | 50/60/66 | 5/14 | 32,2 % | 40/46/51 | 1,54 | 5,06 |
| ursak | 53,9 % | 42/54/62 | 9/8 | 38,3 % | 35/39/44 | 1,71 | 5,32 |
| saar | 47,7 % | 36/48/54 | 8/7 | 37,5 % | 33/38/43 | 1,63 | 5,61 |
| morga | 58 % | 52/54/66 | 6/15 | 37,6 % | 40/45/50 | 1,96 | 6,16 |
| vorka | 49 % | 38/48/58 | 10/10 | 39,7 % | 33/39/44 | 1,58 | 5,66 |
| urgath | 61,6 % | 52/60/68 | 6/13 | 36,6 % | 37/43/48 | 1,89 | 5,77 |
| tyrak | 65,2 % | 58/66/70 | 5/13 | 35,3 % | 36/40/45 | 1,76 | 5,52 |

Renversement opérationnel : à55 % de victoire, les45 % de défaites contredisent la prévision majoritaire. Cela ne prouve pas qu’un critique ait causé chaque perte. Fin ±10 %PV =indicateur de sensibilité, pas attribution causale. Bloc de cinq défaites : probabilité3,125 % à p=50 %, 1,024 % à p=60 %. Les streaks maximums dépendent de la longueur et des seeds ; aucun plafond garanti.

Ablation : même fighter/stats/gear avec warriorId omis pour désactiver le kit, moteur intact. 2000 graines/cellule, deltas en U/JSON. Après un proc les flux RNG divergent : effet global du kit, pas causalité isolée de chaque passif. Le casino Némésis est intentionnel ; un mur à presque0 % avec gear accessible est toutefois une attente de loot, pas automatiquement un bon mur.

## X. Rift Early / Endgame

1000 runs/Warrior/profil ; lineup, jitter et règlement réels ; PV pleins et niveau recalculé entre étapes. Benchmark à100 % de difficulté sans pity ; carrières avec pity chronologique. Taux =**atteindre ET gagner** l’étape, full clear observé, non produit de moyennes. Moyenne uniforme des12 Warriors.

| Niveau/gear | C1 | C2 | C3 | C4 | Boss/full clear | XP et pièces moyennes/run |
| --- | --- | --- | --- | --- | --- | --- |
| 1/none | 0 % | 0 % | 0 % | 0 % | 0 % | 0 |
| 2/none | 0,04 % | 0 % | 0 % | 0 % | 0 % | 0,02 |
| 3/common | 1,79 % | 0 % | 0 % | 0 % | 0 % | 0,72 |
| 5/medium | 99,73 % | 92,41 % | 59,39 % | 0 % | 0 % | 100,61 |
| 7/good | 100 % | 100 % | 99,89 % | 17,36 % | 0 % | 126,9 |
| 9/good | 100 % | 100 % | 100 % | 75,19 % | 0,09 % | 150,11 |
| 10/good | 100 % | 100 % | 100 % | 100 % | 51,38 % | 180,55 |
| 10/endgame | 100 % | 100 % | 100 % | 100 % | 85,06 % | 194,02 |

Taux conditionnels et détail par Warrior dans le JSON. Accessible immédiatement ≠gratuit. Moyenne uniforme ≠bienvenue70 % Commun. Karg N1/N2 sans gear : 0 victoire C1/1000, pas preuve d’une probabilité mathématiquement nulle ; borne supérieure95 % ≈0,3 %.

Pity invisible100/90/82/74/68/62/56/50 après défaites quotidiennes ; Force/PV encore×0,7 au plancher, soit budgetPV35 % avant profil/jitter. Après sept échecs, le parcours diffère donc du benchmark100 %. Les carrières gardent la montée et le reset réels, jamais exposés au joueur.

Sans Faille, régulier N10 10 j [9 j–10 j] ; 100 % observés contre 9 j [8 j–9 j] ; 100 % observés, mais moins de raretés extraordinaires. Endgame reste autour de85 % full clear : aucune preuve globale imposant de rouvrir la validation. Gear moyen/bon moins performant sans pity, progression ensuite facilitée. La Faille pèse surtout sur la collection ; 200 XP max ne dominent pas600 Expédition.

## Y. Badges / Masteries

24 conditions et récompenses auditées :

| ID | Condition actuelle | Pièces | Compteur/mode |
| --- | --- | --- | --- |
| primal-first-level | Terminez le premier niveau de l’Ère Primordiale. | 50 | Nodes Normal uniques ; anciens badges acceptés |
| primal-three-warriors | Obtenez 3 Warriors de l’Ère Primordiale. | 50 | Possessions uniques/catalogue figé |
| primal-three-equipment | Obtenez 3 équipements primordiaux différents. | 50 | Possessions uniques/catalogue figé |
| primal-ten-levels | Terminez 10 niveaux de l’Ère Primordiale. | 100 | Nodes Normal uniques ; anciens badges acceptés |
| primal-first-elite | Vainquez votre premier Élite Primal. | 100 | Nodes Normal uniques ; anciens badges acceptés |
| primal-six-warriors | Obtenez 6 Warriors de l’Ère Primordiale. | 100 | Possessions uniques/catalogue figé |
| primal-eight-equipment | Obtenez 8 équipements primordiaux différents. | 100 | Possessions uniques/catalogue figé |
| primal-conqueror | Vainquez le Boss final de l’Aventure Primal. | 200 | Nodes Normal uniques ; anciens badges acceptés |
| primal-all-warriors | Obtenez les 12 Warriors primordiaux. | 200 | Possessions uniques/catalogue figé |
| primal-all-equipment | Obtenez les 15 équipements primordiaux. | 200 | Possessions uniques/catalogue figé |
| primal-tyrak | Obtenez Tyrak, Roi Primordial. | 500 | Possessions uniques/catalogue figé |
| primal-nemesis | Terminez l’Ère Primordiale en Némésis. | 500 | BUG : prédicat false |
| exploit-first-impact | Remportez votre premier combat. | 50 | adventureWins+riftWins+duelWins |
| exploit-first-reinforcements | Rassemblez 5 Warriors différents. | 50 | Possessions uniques/catalogue figé |
| exploit-rare-spark | Obtenez votre premier Warrior Rare ou supérieur. | 50 | Possessions uniques/catalogue figé |
| exploit-first-duel | Remportez votre premier Duel. | 50 | duelWins |
| exploit-seasoned-fighter | Remportez 25 combats. | 100 | adventureWins+riftWins+duelWins |
| exploit-chronos-collector | Rassemblez 10 Warriors différents. | 100 | Possessions uniques/catalogue figé |
| exploit-ascension | Amenez un Warrior au niveau 10. | 100 | Warriors N10 |
| exploit-war-machine | Remportez 100 combats. | 200 | adventureWins+riftWins+duelWins |
| exploit-awakened-legend | Obtenez votre premier Warrior Légendaire. | 200 | Possessions uniques/catalogue figé |
| exploit-elite-squad | Amenez 6 Warriors au niveau 10. | 200 | Warriors N10 |
| exploit-feared-rival | Remportez 25 Duels. | 200 | duelWins |
| exploit-mythic-fracture | Obtenez votre premier Warrior Mythique. | 500 | Possessions uniques/catalogue figé |

recordBattleOutcome incrémente les victoires Aventure/Faille/Duel ; chaque étage Faille gagné compte, pas seulement5/5. Pertes, abandon et Training retiré ne comptent pas. Replay gagné =victoire exploit, pas nouveau niveau unique. Copies ≠objets différents. grantEarnedBadges paie pièces+badge ensemble ; ID comme reçu, pas de second paiement après reload/doubleappel. Cloud conserve unlockedAt. Les anciens badges Élite/Boss compatibles ne repaient pas un bonus.

**Bug confirmé** : hasCompletedPrimalNemesis retourne false malgré nemesisCompleted persisté. Le badge500 Némésis et donc la Maîtrise1500 sont impossibles sur une carrière normale. Le test existant injecte les12 reçus : 281 tests verts ne prouvent pas ce parcours. Phase2 : fin Némésis→badge→reload→aucun second paiement.

**Condition contradictoire** : posséder12 Warriors donne200 Panthéon. Maîtrise exige12 distinctions, dont Némésis et Arsenal15 IDs historiques (dont les deux Mythiques), pas12 Warriors seulement. Référence humaine1500 conservée ; choisir explicitement la condition. Le catalogue15 est volontairement figé dans un commentaire, mais la Collection présente20 équipements.

## Z. QA New Account

Parcours en mémoire réellement exécuté : freshSave300/noWarrior/noGear→bienvenue RNG→main→achats→Aventure/charges→mur→gear/passif3→Faille/Expédition/badges→5/7/10→Morgath→Némésis. Inventaires issus des vraies fonctions, aucun Mythique injecté. Carrière ne finissant pas en60 jours : censurée, jamais complétée via admin.

Jalons, combats, murs, sources et loot auditables par seed. Welcome unique ; récompenses Boss uniques ; XP au Warrior concerné ; niveaux/copies/loadouts vérifiés. Frictions révélées au-delà des unitaires : Expédition dominante et main absent, loot23h36/24h, grind tardif, gear Boss rare, badge Némésis bloqué.

L’URL normale affiche l’auth attendue, console propre. **Aucun nouveau compte Supabase créé**, aucune validation fictive d’un login distant. Unitaires auth/welcome et carrières synthétiques couvrent cette phase ; une UI admin riche ne valide pas le early sans gear.

## AA. QA Advanced Account

Fixtures multi-Warriors/niveaux, presets Karg Massue/Tyrak Cœur, progression avancée et Némésis : parseAccountSave conserve niveaux/loadouts, activation restaure le preset, jackpot unique. Reçus/règlements Expédition/Faille, recyclage et capN10 XP0 vérifiés par assertions et unitaires. Le futur personal clear est seulement calculé, aucun marqueur persisté.

Preview navigateur non persistante : Hub, Badges, Expédition. KargN10→envoi→24h via outil QA existant→récupération→reçu affichant +604 XP→Hub toujoursN10. Les tests confirment XP0 : ambiguïté de reçu, pas fuite d’XP. Aucune carrière réelle ou sauvegarde admin persistée modifiée par ces essais.

Hub320×844,390×844,768×1024,1440×900 : aucun overflow horizontal ni image cassée. Badges et Expédition à390 propres ; console0 erreur/warning dans les contrôles locaux. Captures/mesures dans qa-output/v015-responsive.json et v015-expedition-cap-390.png. Ce n’est pas une réapprobation artistique des sprites/HUD.

HTTP200 sur port5173, serveur laissé actif. Les previews héritent du gear admin, ne pas les présenter comme un nouveau joueur sans équipement. Aucune carrière personnelle effacée, aucun compte cloud muté.

## AB. Cloud / Offline

Lecture et tests de non-régression : savev5, bootstrap cloud avant écriture, cache userid, CAS, modifications dirty conservées offline, relecture/conflit à la reconnexion, logout retire le jeu sans effacer la carrière, auth invalide refusée, admin isolé dans chronos-age-warriors:admin:v4 (normal chronos.save.userid).

Les tests couvrent origine/port neuf, cache initial dirty ne remplaçant pas un cloud avancé, reset injecté rejeté, course CAS/bootstrap, isolation A/B, changement offline→reconnexion, conflit concurrent, cloud invalide non remplacé par une carrière neuve, Duel flush/relecture serveur, requestId idempotent et noOpponent sans reward/charge. 281/281 passants.

**Non testé live** : login Supabase réel, coupure réseau physique, logout/login distant, déploiement backend. Le contexte humain « V0.14.1 backend déployée » est respecté, jamais contredit par un ancien rapport. SQL local/client20/4 concordent ; aucune migration ou Edge exécutée/publiée/configurée. Mocks ≠preuve distante. Architecture intacte, aucun secret lu/reproduit.

Phase2 personnelle : parse/garde monotone des marques, CAS et doubles branches offline sans sommation double d’XP. Recyclage : garder une copie, presets et reçus. Recommandations seulement, aucune architecture modifiée.

## AC. UX Text Issues

Propositions uniquement, aucun texte runtime modifié :

| Zone | Constat | Correction proposée |
| --- | --- | --- |
| Hub charges | Combats récompensés /10 Campagne évoque un quota quotidien | Charges Aventure x/cap ; +1 toutes les20 minutes |
| Maîtrise | 12 distinctions UI contre intention12 Warriors=1500 | Décider la condition puis aligner texte/tests |
| Badge Némésis | Stub false malgré completion persistée | Brancher la condition avec vrai test de fin de campagne |
| Arsenal | 15 IDs/texte15, mais20 équipements UI | Choisir catalogue figé ou complet et l’expliciter |
| Expédition N10 | Reçu +604 XP alors que0 créditée | Niveau maximum — XP non créditée |
| Recyclage N10 | Résumé d’XP nominale au cap | Afficher XP créditée0/max, pas une conversion |
| Durée Expédition | 23hxx perd un jet entier | Expliquer paliers6h et plafond24h sans encourager les micro-claims |
| Duel futur | Prochain combat dans… est juste actuellement | Après validation10/jour : reset Paris seulement |
| Training | Aucun onglet joueur ; identifiant technique utilisé par Faille | Pas de renommage interne pour un simple copy cleanup |
| Personal futur | Carte complétée masque la première XP personnelle | XP personnelle une fois, jackpot du compte déjà réclamé |
| Admin | Tout le gear peut suggérer une disponibilité early | Distinguer fixtures QA et vraie carrière |
| Lore | Archives du temps/traces de victoire : lore, pas erreur | Aucun grand polish art/texte dans cette phase |

Preuve du reçu au plafond, preview isolée :

![Reçu Expédition : XP nominale au plafond](../qa-output/v015-expedition-cap-390.png)

Validation : pnpm test **281/281**,37 fichiers ; pnpm run lint OK ; pnpm exec tsc -b --pretty false OK ; **pnpm exec vite build OK (client+PWA)**. Warning préexistant JS617,63kB>500kB ; precache≈43MB. pnpm run build inclut build:duel-edge : non lancé pour éviter une régénération Edge inutile, TypeScript et build client/PWA exécutés séparément. Hashes runtime/SQL/Edge/assets préservés.

Node --check, assertions et conservation du ledger passants ; git diff --check OK. Seuls docs/v015-global-loop-audit.md et quatre scripts d’analyse sont créés ; résultats JSON/CSV/captures ignorés dans qa-output. État Git initial propre. Aucune écriture Git, migration, publication ou déploiement.

Reproduction depuis le projet :

- pnpm exec node scripts/audit-v015-global-loop.mjs --runs=128 --days=60 --trials=1000
- pnpm exec node scripts/audit-v015-personal-clears.mjs
- pnpm exec node scripts/audit-v015-sensitivities.mjs
- pnpm exec node scripts/report-v015-global-loop.mjs

Le dernier script restitue du Markdown JSON-encodé sur stdout, à appliquer avec apply_patch. Les résultats restent hors Git et runtime ; seeds/hashes dans JSON.

URLs réellement actives :

- Jeu : http://127.0.0.1:5173/
- Admin : http://127.0.0.1:5173/?admin
- Hub QA : http://127.0.0.1:5173/?admin&qaPreview&qaWarrior=karg&qaLevel=10
- Faille QA : http://127.0.0.1:5173/?admin&riftPreview&qaWarrior=karg&qaLevel=10
- Expédition QA : http://127.0.0.1:5173/?admin&expeditionPreview&qaWarrior=karg&qaLevel=10

## AD. Recommended V0.15 Phase 2

Priorité1 : contradictions badge Némésis/Maîtrise et XP nominale au cap ; définir la cible N10 avec des modes réellement facultatifs. Priorité2 : XP personnelle équitable avec reçus/migration choisis, cap de confort et Duel quotidien côté serveur. Priorité3 : recyclage manuel des surplus sans forge et tests loadout/CAS ; diversité de gear et hiérarchie ensuite, si validées.

Conserver replay5/10, odds normal0,01 %/Faille2 %, jackpots one-shot, Faille endgame≈85 %, aucun catch-up. **Attendre validation humaine : cet audit n’autorise aucune Phase2 implicite.**

### Décisions humaines nécessaires — aucune appliquée


| Décision | Proposition | Arbitrage nécessaire |
| --- | --- | --- |
| Premier N10 | Revalider cible5–7 jours régulier, modes facultatifs | C/F/G/H : ajuster intention ou disponibilité XP, pas buff aveugle |
| Casual | Accepter environ10 jours avec Expédition main, ou autre cible | Régulier≈9 jours, aucune cible casual imposée |
| Cap Aventure | 15 ; recharge1/20 min inchangée | 20 si objectif20 Aventures/session ;15 pour confort minimum proposé |
| Duel | 10/jour serveur, reset Paris, aucun bot | Actif perd XP/pièces ; sans population=aucune activité |
| Expédition | 24h naturel et600 comme référence, sans catch-up | Accepter retard24 jours sans ce mode et arbitrer rappels du main |
| Personal first XP | 20 Normal/50 Némésis une fois par Warrior/node/mode | XP seulement ; carte/pièces/Boss globaux inchangés |
| Migration personal | Conservatrice ou grâce à regagner en combat | Attribution historique absente ; ne pas inférer le main |
| Maîtrise1500 | 12 Warriors OU12 distinctions | Actuel12 Warriors=200 ; maîtrise bloquée par stub Némésis |
| Badge gear | 15 IDs figés OU20 actuels | Condition/texte cohérents ; Mythiques nécessaires dans les deux |
| Recyclage Équipement | Manuel balanced3/5/8/12/18/24 ; garder une copie | Prudent2/3/5/8/12/18 si sink fort ; jamais autosuffisant |
| Philosophie gear | B : supérieur globalement, inférieur parfois spécialisé | Cœur/Peau universels et exceptionnels, pas norme accessible |
| Hiérarchie puissance | Arbitrer niveau dominant face à rareté prioritaire | CommunN10 vs MythiqueN5 pas une victoire rare ; aucun nerf automatique |
| Faille | Conserver85 % référence et pity invisible ; XP facultative | Collection extraordinaire fortement dépendante de ce mode |
| Textes fonctionnels | XP créditée/nominale et réserve/quota clarifiés | Aucun polish UI/art global ni système post-cap |
