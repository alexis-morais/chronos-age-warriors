# CHRONOS AGE WARRIORS — V0.15 Phase 2

Rapport local du 5 octobre 2026. **Passe fonctionnelle et calibration mesurées ; V0.15 NON CLÔTURABLE en l’état.**
La cible Common N10 contre raretés N5 reste non atteinte. Arbitrage demandé avant de déplacer les murs PvE ou de changer la philosophie des courbes. Aucun déploiement, aucun Git write. Les taux ci-dessous sont des simulations, pas de la télémétrie.

## A. Executive summary

Progression active renforcée, Expédition XP réduite, cap Adventure 15, personal first-clear par Warrior, recyclage manuel et reçus XP réels implémentés. Duel quotidien préparé côté SQL/Edge, non appliqué à Supabase. Builds spécialisés désormais mesurés ; art/HUD/sprites/passifs/ennemis inchangés.

Régulier équilibré : N10 5 [4–6] ; 128/128 jours ; sans Expédition 8 [7–10] ; 128/128. Les intervalles sont P10–P90, le compteur est observé/total. Rareté N5 : pas validée. SQL : inspection et contrat statique seulement, pas une validation PostgreSQL.

## B. Implemented decisions

- Save v6, anciennes v2–v5 acceptées ; clés de stockage conservées.
- Personal clear Warrior/mode/node ; carte globale ; XP personnelle seule sur ancien niveau.
- Cap 15, recharge inchangée 20 min. Duel 10/jour Paris, pas de recharge minute.
- Replays 5 XP/5 pièces Normal, 10/10 Némésis. Défaites 4/10 XP, 0 pièce.
- Expédition 300 XP / 50 pièces par 24 h ; Faille 20 pièces par victoire ; Duel victoire 20 XP/10 pièces, défaite 4/0. XP toujours plafonnée réellement.
- Recyclage équipement manuel, quantité validée, dernier exemplaire et presets conservés.
- Panthéon des 12 Warriors 1500 ; Némésis predicate corrigé. Prix/odds/refunds Warrior inchangés.

## C. XP / progression changes

Courbe inchangée : 120, 180, 300, 450, 650, 850, 1100, 1400, 1800 ; total 6850. Pas de multiplicateur, catch-up, bonus rareté ni boost selon le main.

| Niveau Adventure | Normal first-clear XP | Némésis first-clear XP | Coins première victoire globale Normal / Némésis |
| --- | --- | --- | --- |
| 1 | 120 | 180 | 20 / 50 |
| 2 | 180 | 220 | 20 / 50 |
| 3 | 250 | 260 | 20 / 50 |
| 4 | 300 | 300 | 20 / 50 |
| 5 | 450 | 550 | 20 / 50 |
| 6 | 180 | 240 | 20 / 50 |
| 7 | 200 | 280 | 20 / 50 |
| 8 | 220 | 320 | 20 / 50 |
| 9 | 250 | 360 | 20 / 50 |
| 10 | 550 | 700 | 20 / 50 |
| 11 | 150 | 300 | 20 / 50 |
| 12 | 175 | 340 | 20 / 50 |
| 13 | 200 | 380 | 20 / 50 |
| 14 | 225 | 420 | 20 / 50 |
| 15 | 650 | 850 | 20 / 50 |
| 16 | 150 | 360 | 20 / 50 |
| 17 | 175 | 400 | 20 / 50 |
| 18 | 200 | 440 | 20 / 50 |
| 19 | 250 | 480 | 20 / 50 |
| 20 | 500 | 1000 | 20 / 50 |

Total Normal 5375, Némésis 8380. Un clear Normal seul ne donne pas N10 ; la faisabilité des victoires reste liée aux stats/loadout. Personal first-clear sur niveau globalement terminé : 0 pièce et aucun lot compte.

## D. First level 10

Phase 1 équilibré : casual ~10, régulier ~9, actif ~8 jours. Phase 2 :

| Profil | Stratégie | N10 médian [P10–P90] ; observés | Morgath Normal | Morgath Némésis |
| --- | --- | --- | --- | --- |
| casual | A-warrior | 9 [7–10] ; 128/128 | 25 [10–50] ; 108/128 | 38 [19–54] ; 56/128 |
| casual | B-equipment | 6 [5–7] ; 128/128 | 8 [6–17] ; 128/128 | 15 [11–26] ; 128/128 |
| casual | C-balanced | 7 [6–8] ; 128/128 | 11 [6–30] ; 128/128 | 19 [13–41] ; 123/128 |
| casual | D-main | 7 [6–7] ; 128/128 | 10 [6–22] ; 127/128 | 19 [12–33] ; 127/128 |
| casual | E-collection | 14 [12–17] ; 128/128 | 19 [12–39] ; 127/128 | 28 [18–47] ; 109/128 |
| casual | F-no-duel | 7 [6–8] ; 128/128 | 10 [6–30] ; 127/128 | 18 [9–42] ; 124/128 |
| casual | G-no-rift | 8 [7–9] ; 128/128 | 11 [7–24] ; 128/128 | 19 [11–43] ; 127/128 |
| casual | H-no-expedition | 14 [11–17] ; 128/128 | 18 [12–33] ; 126/128 | 26 [19–45] ; 115/128 |
| casual | budget-75 | 7 [6–9] ; 128/128 | 15 [7–34] ; 127/128 | 28 [14–47] ; 111/128 |
| casual | budget-25 | 6 [6–8] ; 128/128 | 10 [6–22] ; 128/128 | 17 [11–29] ; 126/128 |
| regular | A-warrior | 7 [6–8] ; 128/128 | 25 [12–47] ; 108/128 | 37 [21–52] ; 72/128 |
| regular | B-equipment | 5 [4–6] ; 128/128 | 6 [4–14] ; 128/128 | 10 [6–20] ; 128/128 |
| regular | C-balanced | 5 [4–6] ; 128/128 | 8 [5–20] ; 128/128 | 13 [7–29] ; 128/128 |
| regular | D-main | 5 [4–6] ; 128/128 | 8 [5–21] ; 128/128 | 13 [7–30] ; 128/128 |
| regular | E-collection | 9 [7–11] ; 128/128 | 13 [7–29] ; 128/128 | 22 [10–40] ; 120/128 |
| regular | F-no-duel | 7 [5–7] ; 128/128 | 10 [6–22] ; 128/128 | 16 [8–35] ; 128/128 |
| regular | G-no-rift | 6 [5–7] ; 128/128 | 9 [5–24] ; 126/128 | 18 [7–35] ; 124/128 |
| regular | H-no-expedition | 8 [7–10] ; 128/128 | 12 [7–30] ; 127/128 | 19 [10–36] ; 127/128 |
| regular | budget-75 | 6 [5–7] ; 128/128 | 11 [6–30] ; 127/128 | 21 [8–42] ; 124/128 |
| regular | budget-25 | 5 [4–6] ; 128/128 | 7 [5–18] ; 128/128 | 11 [6–26] ; 128/128 |
| active | A-warrior | 7 [6–8] ; 128/128 | 34 [16–52] ; 80/128 | 31 [18–32] ; 4/128 |
| active | B-equipment | 4 [4–5] ; 128/128 | 4 [4–8] ; 128/128 | 5 [4–10] ; 128/128 |
| active | C-balanced | 5 [4–5] ; 128/128 | 5 [4–12] ; 128/128 | 8 [5–18] ; 128/128 |
| active | D-main | 4 [3–4] ; 128/128 | 5 [3–12] ; 128/128 | 8 [4–16] ; 128/128 |
| active | E-collection | 6 [5–7] ; 128/128 | 8 [5–14] ; 128/128 | 14 [7–25] ; 127/128 |
| active | F-no-duel | 5 [5–6] ; 128/128 | 6 [5–14] ; 128/128 | 9 [6–18] ; 128/128 |
| active | G-no-rift | 5 [5–6] ; 128/128 | 6 [5–13] ; 128/128 | 10 [5–20] ; 128/128 |
| active | H-no-expedition | 5 [5–6] ; 128/128 | 6 [5–14] ; 128/128 | 9 [5–20] ; 128/128 |
| active | budget-75 | 5 [4–6] ; 128/128 | 9 [4–19] ; 128/128 | 16 [6–32] ; 128/128 |
| active | budget-25 | 4 [4–5] ; 128/128 | 5 [4–10] ; 128/128 | 7 [5–13] ; 128/128 |

3840 carrières × 60 jours, 128/cellule ; casual 8 min/1 session, régulier 24 min/1 session, actif 60 min/3 sessions. A Warrior, B équipement, C équilibré, D main/retours fréquents, E collection/secondaire, F sans Duel, G sans Faille, H sans Expédition ; compléments budget 75/25. Graines : career 1500001+i*7919; combat/draw independent successive seeded PRNG; rate 733001+i*97; RNG 2117001+i*97; Rift 3100001+i*97; matchups4190001+i*97; collection5500001+i*7919; equipment recycling6500001+i*7919; multi-builds 8119001+i×97, 1000 graines/cellule. Combats moteur : 17 447 941.

Sessions/planning/choix des builds sont des hypothèses analytiques. Duel simule des adversaires indépendants à même niveau/loadout tirés selon roster, pas de bots/comptes créés ni population réelle. Non-finis restent censurés à 60 jours ; médianes de victoire conditionnelles aux observés, ne pas les lire comme victoire garantie pour tous.

## E. Expedition

600 → 300 XP. 350 → 50 pièces, changement séparé justifié par l’économie (S). Avec C équilibré 5 [4–6] ; 128/128, sans H 8 [7–10] ; 128/128; sans Duel F 7 [5–7] ; 128/128; sans Faille G 6 [5–7] ; 128/128.

Loot conservé : tranche complète 6 h, 4 recherches maximum, 35 % équipement, 65 % rien, tables par durée inchangées, ≤10 % coffre équipement, ≤2 % Warrior à 24 h, aucun coffre Faille. Pas de tolérance exploitable. À 23 h 36 : 3 recherches ; interface montre le délai de la quatrième et confirmation explicite avant rappel. À 24 h : 4. Le Warrior en Expédition reste indisponible Adventure/Faille, disponible Duel.

## F. Adventure charges

10 → 15, +1/20 min. Ancienne réserve pleine 10 devient 15 ; partielle 8 reste 8 et conserve son échéance. Offline calcule les charges jusqu’à 15 puis timer null. Hub/map/fixtures 15. Admin réalimente uniquement sa sauvegarde locale isolée ; fixtures réalistes ne réalimentent pas.

## G. Duel 10/day

Nouvelle migration 202610050005_v015_daily_duel.sql après 004. daily_date autoritaire Paris, reset au prochain minuit local via AT TIME ZONE ; 23/25 h DST. Migration déduit les matchs attaquants déjà joués ce jour ; 10 maximum, jamais +1/20 min. Row lock avant lecture du quota, horloge serveur fraîche après locks, mêmes reçus request UUID.

Interface affiche 10/jour et reset HH:MM:SS avec offset serveur figé à la réponse, pas à chaque render. Backend ancien : message de mise à jour, pas de faux affichage de nouvelle limite. Récompense victoire 20 XP nominaux validés côté SQL, XP réelle dans replay, 10 pièces ; défaite 4/0 ; points inchangés.

## H. Personal first-clears

Structure : personalClears[warriorId] = { normal: [nodes], nemesis: [nodes] }. Seulement IDs possédés, nodes entiers uniques 1–20. campaignBattleSequence monotonique ; contexte d’un combat fige Warrior et séquence ; transaction unique XP/charges/marks/progression. Double règlement même séquence refusé, même après sérialisation/reload. Changement d’actif ne détourne pas l’XP.

Ancienne v5 : personalClears={} pour TOUS, sans inventer quel Warrior a gagné autrefois, sans crédit immédiat. Ils doivent battre les niveaux. Les anciennes victoires globales restent ; leurs Boss sont marqués consommés sans nouveau lot. Exemple Asha a Normal1–15 ; Tyrak N1 gagne Normal1 : +120 XP / 0 pièce, puis replay +5/+5. Pour Némésis1 : +180 XP /0, puis +10/+10. Boss déjà globalement terminé : jamais 1500+10 W ni 2500+3 R, seulement XP personnelle.

## I. Late Warrior results

6144 parcours, 64/cellule, Karg/Naya/Urgath/Tyrak, commun et moyen ; compte Asha8 inchangé. Graines 7150001+sample*7919; probe8170001+i*97. Normal5/10/15/20 × Némésis0/5/20. Lorsqu’il y a déjà Némésis, le compte a forcément terminé Normal20 : opportunités Normal20 dans cette fixture, pas un saut de carte.

| Warrior | Gear | Normal annoncé | Némésis globale | XP personnelle théorique disponible | Combats médians N3 / N5 / N7 / N10 |
| --- | --- | --- | --- | --- | --- |
| karg | common | 5 | 0 | 1300 | 2 / 44 / 344 / 1116 |
| karg | common | 5 | 5 | 6885 | 2 / 44 / 344 / 696 |
| karg | common | 5 | 20 | 13755 | 2 / 44 / 344 / 696 |
| karg | common | 10 | 0 | 2700 | 2 / 44 / 344 / 841 |
| karg | common | 10 | 5 | 6885 | 2 / 44 / 344 / 696 |
| karg | common | 10 | 20 | 13755 | 2 / 44 / 344 / 696 |
| karg | common | 15 | 0 | 4100 | 2 / 44 / 344 / 696 |
| karg | common | 15 | 5 | 6885 | 2 / 44 / 344 / 696 |
| karg | common | 15 | 20 | 13755 | 2 / 44 / 344 / 696 |
| karg | common | 20 | 0 | 5375 | 2 / 44 / 344 / 696 |
| karg | common | 20 | 5 | 6885 | 2 / 44 / 344 / 696 |
| karg | common | 20 | 20 | 13755 | 2 / 44 / 344 / 696 |
| karg | medium | 5 | 0 | 1300 | 2 / 5 / 255 / 1115 |
| karg | medium | 5 | 5 | 6885 | 2 / 5 / 10 / 383 |
| karg | medium | 5 | 20 | 13755 | 2 / 5 / 10 / 383 |
| karg | medium | 10 | 0 | 2700 | 2 / 5 / 10 / 840 |
| karg | medium | 10 | 5 | 6885 | 2 / 5 / 10 / 383 |
| karg | medium | 10 | 20 | 13755 | 2 / 5 / 10 / 383 |
| karg | medium | 15 | 0 | 4100 | 2 / 5 / 10 / 566 |
| karg | medium | 15 | 5 | 6885 | 2 / 5 / 10 / 383 |
| karg | medium | 15 | 20 | 13755 | 2 / 5 / 10 / 383 |
| karg | medium | 20 | 0 | 5375 | 2 / 5 / 10 / 464 |
| karg | medium | 20 | 5 | 6885 | 2 / 5 / 10 / 383 |
| karg | medium | 20 | 20 | 13755 | 2 / 5 / 10 / 383 |
| naya | common | 5 | 0 | 1300 | 2 / 45 / 345 / 1116 |
| naya | common | 5 | 5 | 6885 | 2 / 45 / 345 / 697 |
| naya | common | 5 | 20 | 13755 | 2 / 45 / 345 / 697 |
| naya | common | 10 | 0 | 2700 | 2 / 45 / 345 / 842 |
| naya | common | 10 | 5 | 6885 | 2 / 45 / 345 / 697 |
| naya | common | 10 | 20 | 13755 | 2 / 45 / 345 / 697 |
| naya | common | 15 | 0 | 4100 | 2 / 45 / 345 / 697 |
| naya | common | 15 | 5 | 6885 | 2 / 45 / 345 / 697 |
| naya | common | 15 | 20 | 13755 | 2 / 45 / 345 / 697 |
| naya | common | 20 | 0 | 5375 | 2 / 45 / 345 / 697 |
| naya | common | 20 | 5 | 6885 | 2 / 45 / 345 / 697 |
| naya | common | 20 | 20 | 13755 | 2 / 45 / 345 / 697 |
| naya | medium | 5 | 0 | 1300 | 2 / 5 / 255 / 1115 |
| naya | medium | 5 | 5 | 6885 | 2 / 5 / 10 / 427 |
| naya | medium | 5 | 20 | 13755 | 2 / 5 / 10 / 427 |
| naya | medium | 10 | 0 | 2700 | 2 / 5 / 10 / 840 |
| naya | medium | 10 | 5 | 6885 | 2 / 5 / 10 / 427 |
| naya | medium | 10 | 20 | 13755 | 2 / 5 / 10 / 427 |
| naya | medium | 15 | 0 | 4100 | 2 / 5 / 10 / 566 |
| naya | medium | 15 | 5 | 6885 | 2 / 5 / 10 / 427 |
| naya | medium | 15 | 20 | 13755 | 2 / 5 / 10 / 427 |
| naya | medium | 20 | 0 | 5375 | 2 / 5 / 10 / 465 |
| naya | medium | 20 | 5 | 6885 | 2 / 5 / 10 / 427 |
| naya | medium | 20 | 20 | 13755 | 2 / 5 / 10 / 427 |
| urgath | common | 5 | 0 | 1300 | 2 / 6 / 256 / 1116 |
| urgath | common | 5 | 5 | 6885 | 2 / 6 / 90 / 696 |
| urgath | common | 5 | 20 | 13755 | 2 / 6 / 90 / 696 |
| urgath | common | 10 | 0 | 2700 | 2 / 6 / 90 / 841 |
| urgath | common | 10 | 5 | 6885 | 2 / 6 / 90 / 696 |
| urgath | common | 10 | 20 | 13755 | 2 / 6 / 90 / 696 |
| urgath | common | 15 | 0 | 4100 | 2 / 6 / 90 / 696 |
| urgath | common | 15 | 5 | 6885 | 2 / 6 / 90 / 696 |
| urgath | common | 15 | 20 | 13755 | 2 / 6 / 90 / 696 |
| urgath | common | 20 | 0 | 5375 | 2 / 6 / 90 / 696 |
| urgath | common | 20 | 5 | 6885 | 2 / 6 / 90 / 696 |
| urgath | common | 20 | 20 | 13755 | 2 / 6 / 90 / 696 |
| urgath | medium | 5 | 0 | 1300 | 2 / 5 / 255 / 1115 |
| urgath | medium | 5 | 5 | 6885 | 2 / 5 / 10 / 282 |
| urgath | medium | 5 | 20 | 13755 | 2 / 5 / 10 / 282 |
| urgath | medium | 10 | 0 | 2700 | 2 / 5 / 10 / 840 |
| urgath | medium | 10 | 5 | 6885 | 2 / 5 / 10 / 282 |
| urgath | medium | 10 | 20 | 13755 | 2 / 5 / 10 / 282 |
| urgath | medium | 15 | 0 | 4100 | 2 / 5 / 10 / 566 |
| urgath | medium | 15 | 5 | 6885 | 2 / 5 / 10 / 282 |
| urgath | medium | 15 | 20 | 13755 | 2 / 5 / 10 / 282 |
| urgath | medium | 20 | 0 | 5375 | 2 / 5 / 10 / 416 |
| urgath | medium | 20 | 5 | 6885 | 2 / 5 / 10 / 282 |
| urgath | medium | 20 | 20 | 13755 | 2 / 5 / 10 / 282 |
| tyrak | common | 5 | 0 | 1300 | 2 / 5 / 255 / 1115 |
| tyrak | common | 5 | 5 | 6885 | 2 / 5 / 61 / 697 |
| tyrak | common | 5 | 20 | 13755 | 2 / 5 / 61 / 697 |
| tyrak | common | 10 | 0 | 2700 | 2 / 5 / 90 / 841 |
| tyrak | common | 10 | 5 | 6885 | 2 / 5 / 61 / 697 |
| tyrak | common | 10 | 20 | 13755 | 2 / 5 / 61 / 697 |
| tyrak | common | 15 | 0 | 4100 | 2 / 5 / 61 / 697 |
| tyrak | common | 15 | 5 | 6885 | 2 / 5 / 61 / 697 |
| tyrak | common | 15 | 20 | 13755 | 2 / 5 / 61 / 697 |
| tyrak | common | 20 | 0 | 5375 | 2 / 5 / 61 / 697 |
| tyrak | common | 20 | 5 | 6885 | 2 / 5 / 61 / 697 |
| tyrak | common | 20 | 20 | 13755 | 2 / 5 / 61 / 697 |
| tyrak | medium | 5 | 0 | 1300 | 2 / 5 / 255 / 1115 |
| tyrak | medium | 5 | 5 | 6885 | 2 / 5 / 10 / 282 |
| tyrak | medium | 5 | 20 | 13755 | 2 / 5 / 10 / 282 |
| tyrak | medium | 10 | 0 | 2700 | 2 / 5 / 10 / 840 |
| tyrak | medium | 10 | 5 | 6885 | 2 / 5 / 10 / 282 |
| tyrak | medium | 10 | 20 | 13755 | 2 / 5 / 10 / 282 |
| tyrak | medium | 15 | 0 | 4100 | 2 / 5 / 10 / 566 |
| tyrak | medium | 15 | 5 | 6885 | 2 / 5 / 10 / 282 |
| tyrak | medium | 15 | 20 | 13755 | 2 / 5 / 10 / 282 |
| tyrak | medium | 20 | 0 | 5375 | 2 / 5 / 10 / 416 |
| tyrak | medium | 20 | 5 | 6885 | 2 / 5 / 10 / 282 |
| tyrak | medium | 20 | 20 | 13755 | 2 / 5 / 10 / 282 |

Une charge par combat. Bas niveau : opportunités ne sont pas garanties accessibles en puissance. Algorithme : tenter un niveau personnel avec chance estimée ≥20 %, après 2 échecs farm1 par bloc de 15 ; aucune XP externe. Recharge analytique 20 min/essai, pas temps de joueur observé. Les 6144 assertions conservent main/progression globale/lots ; chaque parcours arrive N10 dans ≤2500 combats. La table complète contient XP effectivement reçue et chaque tentative, pas seulement le plafond théorique.

## J. Rarity vs level — NON VALIDÉ

| Gauche | Rareté | Niveau | Droite | Rareté | Niveau | Gear comparable | Victoire gauche % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| karg | Commun | 10 | vorka | Épique | 5 | none | 100 |
| naya | Commun | 10 | vorka | Épique | 5 | none | 100 |
| brakk | Commun | 10 | vorka | Épique | 5 | none | 100 |
| eyla | Commun | 10 | vorka | Épique | 5 | none | 100 |
| karg | Commun | 10 | vorka | Épique | 5 | medium | 100 |
| naya | Commun | 10 | vorka | Épique | 5 | medium | 100 |
| brakk | Commun | 10 | vorka | Épique | 5 | medium | 100 |
| eyla | Commun | 10 | vorka | Épique | 5 | medium | 100 |
| karg | Commun | 10 | vorka | Épique | 5 | endgame | 100 |
| naya | Commun | 10 | vorka | Épique | 5 | endgame | 100 |
| brakk | Commun | 10 | vorka | Épique | 5 | endgame | 100 |
| eyla | Commun | 10 | vorka | Épique | 5 | endgame | 100 |
| karg | Commun | 10 | urgath | Légendaire | 5 | none | 100 |
| naya | Commun | 10 | urgath | Légendaire | 5 | none | 100 |
| brakk | Commun | 10 | urgath | Légendaire | 5 | none | 100 |
| eyla | Commun | 10 | urgath | Légendaire | 5 | none | 100 |
| karg | Commun | 10 | urgath | Légendaire | 5 | medium | 100 |
| naya | Commun | 10 | urgath | Légendaire | 5 | medium | 100 |
| brakk | Commun | 10 | urgath | Légendaire | 5 | medium | 100 |
| eyla | Commun | 10 | urgath | Légendaire | 5 | medium | 100 |
| karg | Commun | 10 | urgath | Légendaire | 5 | endgame | 100 |
| naya | Commun | 10 | urgath | Légendaire | 5 | endgame | 100 |
| brakk | Commun | 10 | urgath | Légendaire | 5 | endgame | 100 |
| eyla | Commun | 10 | urgath | Légendaire | 5 | endgame | 100 |
| karg | Commun | 10 | tyrak | Mythique | 5 | none | 100 |
| naya | Commun | 10 | tyrak | Mythique | 5 | none | 100 |
| brakk | Commun | 10 | tyrak | Mythique | 5 | none | 100 |
| eyla | Commun | 10 | tyrak | Mythique | 5 | none | 100 |
| karg | Commun | 10 | tyrak | Mythique | 5 | medium | 100 |
| naya | Commun | 10 | tyrak | Mythique | 5 | medium | 100 |
| brakk | Commun | 10 | tyrak | Mythique | 5 | medium | 100 |
| eyla | Commun | 10 | tyrak | Mythique | 5 | medium | 100 |
| karg | Commun | 10 | tyrak | Mythique | 5 | endgame | 100 |
| naya | Commun | 10 | tyrak | Mythique | 5 | endgame | 100 |
| brakk | Commun | 10 | tyrak | Mythique | 5 | endgame | 100 |
| eyla | Commun | 10 | tyrak | Mythique | 5 | endgame | 100 |
| asha | Peu commun | 8 | saar | Rare | 6 | none | 99.8 |
| asha | Peu commun | 8 | morga | Rare | 6 | none | 99.7 |
| rhex | Peu commun | 8 | saar | Rare | 6 | none | 99.7 |
| rhex | Peu commun | 8 | morga | Rare | 6 | none | 99.8 |
| ursak | Peu commun | 8 | saar | Rare | 6 | none | 100 |
| ursak | Peu commun | 8 | morga | Rare | 6 | none | 100 |
| asha | Peu commun | 8 | saar | Rare | 6 | medium | 93.1 |
| asha | Peu commun | 8 | morga | Rare | 6 | medium | 95.1 |
| rhex | Peu commun | 8 | saar | Rare | 6 | medium | 94.6 |
| rhex | Peu commun | 8 | morga | Rare | 6 | medium | 96.4 |
| ursak | Peu commun | 8 | saar | Rare | 6 | medium | 96.9 |
| ursak | Peu commun | 8 | morga | Rare | 6 | medium | 97.1 |
| asha | Peu commun | 8 | saar | Rare | 6 | endgame | 87.7 |
| asha | Peu commun | 8 | morga | Rare | 6 | endgame | 87.9 |
| rhex | Peu commun | 8 | saar | Rare | 6 | endgame | 88.2 |
| rhex | Peu commun | 8 | morga | Rare | 6 | endgame | 90.5 |
| ursak | Peu commun | 8 | saar | Rare | 6 | endgame | 91.5 |
| ursak | Peu commun | 8 | morga | Rare | 6 | endgame | 93.4 |
| saar | Rare | 7 | vorka | Épique | 5 | none | 90 |
| morga | Rare | 7 | vorka | Épique | 5 | none | 93.8 |
| saar | Rare | 7 | vorka | Épique | 5 | medium | 74.7 |
| morga | Rare | 7 | vorka | Épique | 5 | medium | 73.6 |
| saar | Rare | 7 | vorka | Épique | 5 | endgame | 67.7 |
| morga | Rare | 7 | vorka | Épique | 5 | endgame | 69.9 |
| karg | Commun | 7 | tyrak | Mythique | 7 | none | 3.4 |
| naya | Commun | 7 | tyrak | Mythique | 7 | none | 0.8 |
| brakk | Commun | 7 | tyrak | Mythique | 7 | none | 5.8 |
| eyla | Commun | 7 | tyrak | Mythique | 7 | none | 1.4 |
| karg | Commun | 7 | tyrak | Mythique | 7 | medium | 18.8 |
| naya | Commun | 7 | tyrak | Mythique | 7 | medium | 19.5 |
| brakk | Commun | 7 | tyrak | Mythique | 7 | medium | 23.7 |
| eyla | Commun | 7 | tyrak | Mythique | 7 | medium | 21.6 |
| karg | Commun | 7 | tyrak | Mythique | 7 | endgame | 28.6 |
| naya | Commun | 7 | tyrak | Mythique | 7 | endgame | 46.4 |
| brakk | Commun | 7 | tyrak | Mythique | 7 | endgame | 37.1 |
| eyla | Commun | 7 | tyrak | Mythique | 7 | endgame | 29.5 |
| karg | Commun | 10 | tyrak | Mythique | 10 | none | 22.3 |
| naya | Commun | 10 | tyrak | Mythique | 10 | none | 10.3 |
| brakk | Commun | 10 | tyrak | Mythique | 10 | none | 28.3 |
| eyla | Commun | 10 | tyrak | Mythique | 10 | none | 16.9 |
| karg | Commun | 10 | tyrak | Mythique | 10 | medium | 29.5 |
| naya | Commun | 10 | tyrak | Mythique | 10 | medium | 28 |
| brakk | Commun | 10 | tyrak | Mythique | 10 | medium | 32.7 |
| eyla | Commun | 10 | tyrak | Mythique | 10 | medium | 27.1 |
| karg | Commun | 10 | tyrak | Mythique | 10 | endgame | 32.4 |
| naya | Commun | 10 | tyrak | Mythique | 10 | endgame | 45.2 |
| brakk | Commun | 10 | tyrak | Mythique | 10 | endgame | 40.4 |
| eyla | Commun | 10 | tyrak | Mythique | 10 | endgame | 31.2 |

Tables Warriors conservées pour ne pas casser V0.14.1. Le test Common10 contre N5 reste loin des cibles 25–35 / 10–20 / 5–10. Un candidat explicite, non appliqué, a atteint environ 30,25 / 12,45 / 7,08 % mais, en propageant ses stats de façon monotone jusqu’à N9, les cas Vorka/Urgath/Tyrak ont gagné Morgath N9 environ 84,9 / 95,7 / 96,5 %. Ce probe ne prouve PAS qu’aucune autre solution n’existe ; il démontre que ce candidat casse le mur validé. Résultats bruts : v015-rarity-constraint-probe.json.

**Arbitrage restant : préserver les murs PvE actuels et assouplir les cibles N5, ou prioriser les cibles N5 en autorisant une recalibration conjointe plus large des courbes et PvE. Aucun multiplicateur opaque ajouté. Ne pas annoncer V0.15 terminée.**

## K. Final Warrior stats / modifiers

Aucun changement des 12 tables, classes, raretés, 36 passifs ou modificateurs d’ennemis. getEffectiveWarriorStats demeure la source unique ; equipment.stats n’est additionné qu’une fois. Tables exactes, hors équipement :

| Warrior | Classe | Rareté | Niveau | Force | Esquive | Vitesse | PV |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Karg | Ravageur | Commun | 1 | 11 | 8 | 10 | 110 |
| Karg | Ravageur | Commun | 2 | 13 | 9 | 11 | 128 |
| Karg | Ravageur | Commun | 3 | 15 | 10 | 13 | 146 |
| Karg | Ravageur | Commun | 4 | 17 | 11 | 14 | 163 |
| Karg | Ravageur | Commun | 5 | 19 | 12 | 15 | 181 |
| Karg | Ravageur | Commun | 6 | 20 | 14 | 17 | 199 |
| Karg | Ravageur | Commun | 7 | 29 | 15 | 18 | 306 |
| Karg | Ravageur | Commun | 8 | 40 | 16 | 20 | 455 |
| Karg | Ravageur | Commun | 9 | 54 | 17 | 22 | 626 |
| Karg | Ravageur | Commun | 10 | 99 | 28 | 40 | 1139 |
| Naya | Spectre | Commun | 1 | 8 | 13 | 14 | 90 |
| Naya | Spectre | Commun | 2 | 9 | 15 | 16 | 104 |
| Naya | Spectre | Commun | 3 | 11 | 16 | 18 | 119 |
| Naya | Spectre | Commun | 4 | 12 | 18 | 19 | 133 |
| Naya | Spectre | Commun | 5 | 14 | 19 | 21 | 148 |
| Naya | Spectre | Commun | 6 | 15 | 21 | 23 | 162 |
| Naya | Spectre | Commun | 7 | 21 | 22 | 25 | 235 |
| Naya | Spectre | Commun | 8 | 28 | 24 | 26 | 338 |
| Naya | Spectre | Commun | 9 | 37 | 25 | 28 | 455 |
| Naya | Spectre | Commun | 10 | 73 | 45 | 55 | 900 |
| Brakk | Bastion | Commun | 1 | 12 | 6 | 7 | 145 |
| Brakk | Bastion | Commun | 2 | 13 | 7 | 8 | 166 |
| Brakk | Bastion | Commun | 3 | 15 | 8 | 9 | 186 |
| Brakk | Bastion | Commun | 4 | 16 | 9 | 10 | 207 |
| Brakk | Bastion | Commun | 5 | 17 | 10 | 11 | 227 |
| Brakk | Bastion | Commun | 6 | 19 | 11 | 13 | 248 |
| Brakk | Bastion | Commun | 7 | 27 | 12 | 14 | 356 |
| Brakk | Bastion | Commun | 8 | 38 | 13 | 15 | 507 |
| Brakk | Bastion | Commun | 9 | 51 | 14 | 17 | 680 |
| Brakk | Bastion | Commun | 10 | 95 | 25 | 32 | 1260 |
| Eyla | Tempête | Commun | 1 | 10 | 10 | 12 | 100 |
| Eyla | Tempête | Commun | 2 | 11 | 11 | 14 | 115 |
| Eyla | Tempête | Commun | 3 | 13 | 12 | 16 | 130 |
| Eyla | Tempête | Commun | 4 | 14 | 14 | 17 | 145 |
| Eyla | Tempête | Commun | 5 | 16 | 15 | 19 | 160 |
| Eyla | Tempête | Commun | 6 | 17 | 16 | 21 | 175 |
| Eyla | Tempête | Commun | 7 | 26 | 17 | 23 | 282 |
| Eyla | Tempête | Commun | 8 | 38 | 19 | 25 | 432 |
| Eyla | Tempête | Commun | 9 | 52 | 20 | 27 | 604 |
| Eyla | Tempête | Commun | 10 | 94 | 35 | 50 | 1099 |
| Asha | Fléau | Peu commun | 1 | 11 | 10 | 11 | 120 |
| Asha | Fléau | Peu commun | 2 | 13 | 11 | 13 | 140 |
| Asha | Fléau | Peu commun | 3 | 15 | 12 | 14 | 160 |
| Asha | Fléau | Peu commun | 4 | 17 | 14 | 16 | 180 |
| Asha | Fléau | Peu commun | 5 | 19 | 15 | 17 | 200 |
| Asha | Fléau | Peu commun | 6 | 20 | 16 | 19 | 220 |
| Asha | Fléau | Peu commun | 7 | 29 | 17 | 20 | 327 |
| Asha | Fléau | Peu commun | 8 | 40 | 19 | 22 | 477 |
| Asha | Fléau | Peu commun | 9 | 54 | 20 | 23 | 648 |
| Asha | Fléau | Peu commun | 10 | 99 | 30 | 43 | 1179 |
| Rhex | Héraut | Peu commun | 1 | 11 | 11 | 13 | 115 |
| Rhex | Héraut | Peu commun | 2 | 13 | 12 | 15 | 133 |
| Rhex | Héraut | Peu commun | 3 | 15 | 14 | 17 | 152 |
| Rhex | Héraut | Peu commun | 4 | 16 | 15 | 18 | 170 |
| Rhex | Héraut | Peu commun | 5 | 18 | 16 | 20 | 188 |
| Rhex | Héraut | Peu commun | 6 | 20 | 18 | 22 | 207 |
| Rhex | Héraut | Peu commun | 7 | 29 | 19 | 24 | 312 |
| Rhex | Héraut | Peu commun | 8 | 40 | 20 | 25 | 458 |
| Rhex | Héraut | Peu commun | 9 | 54 | 22 | 27 | 626 |
| Rhex | Héraut | Peu commun | 10 | 98 | 35 | 50 | 1139 |
| Ursak | Ravageur | Peu commun | 1 | 14 | 7 | 9 | 150 |
| Ursak | Ravageur | Peu commun | 2 | 16 | 8 | 10 | 174 |
| Ursak | Ravageur | Peu commun | 3 | 18 | 9 | 12 | 199 |
| Ursak | Ravageur | Peu commun | 4 | 20 | 10 | 13 | 223 |
| Ursak | Ravageur | Peu commun | 5 | 22 | 11 | 15 | 248 |
| Ursak | Ravageur | Peu commun | 6 | 24 | 13 | 16 | 272 |
| Ursak | Ravageur | Peu commun | 7 | 32 | 14 | 18 | 370 |
| Ursak | Ravageur | Peu commun | 8 | 42 | 15 | 19 | 507 |
| Ursak | Ravageur | Peu commun | 9 | 54 | 16 | 21 | 663 |
| Ursak | Ravageur | Peu commun | 10 | 98 | 26 | 38 | 1206 |
| Saar | Spectre | Rare | 1 | 15 | 16 | 16 | 135 |
| Saar | Spectre | Rare | 2 | 17 | 18 | 18 | 154 |
| Saar | Spectre | Rare | 3 | 19 | 19 | 20 | 174 |
| Saar | Spectre | Rare | 4 | 21 | 21 | 22 | 193 |
| Saar | Spectre | Rare | 5 | 23 | 23 | 24 | 213 |
| Saar | Spectre | Rare | 6 | 25 | 24 | 26 | 232 |
| Saar | Spectre | Rare | 7 | 32 | 26 | 28 | 331 |
| Saar | Spectre | Rare | 8 | 42 | 28 | 30 | 468 |
| Saar | Spectre | Rare | 9 | 54 | 29 | 32 | 626 |
| Saar | Spectre | Rare | 10 | 99 | 44 | 54 | 1139 |
| Morga | Bastion | Rare | 1 | 16 | 5 | 7 | 195 |
| Morga | Bastion | Rare | 2 | 18 | 6 | 8 | 220 |
| Morga | Bastion | Rare | 3 | 20 | 7 | 10 | 245 |
| Morga | Bastion | Rare | 4 | 22 | 8 | 11 | 270 |
| Morga | Bastion | Rare | 5 | 24 | 9 | 12 | 295 |
| Morga | Bastion | Rare | 6 | 26 | 11 | 14 | 320 |
| Morga | Bastion | Rare | 7 | 33 | 12 | 15 | 419 |
| Morga | Bastion | Rare | 8 | 43 | 13 | 16 | 557 |
| Morga | Bastion | Rare | 9 | 55 | 14 | 18 | 715 |
| Morga | Bastion | Rare | 10 | 100 | 24 | 33 | 1300 |
| Vorka | Fléau | Épique | 1 | 18 | 12 | 14 | 165 |
| Vorka | Fléau | Épique | 2 | 20 | 14 | 16 | 189 |
| Vorka | Fléau | Épique | 3 | 22 | 15 | 18 | 213 |
| Vorka | Fléau | Épique | 4 | 24 | 17 | 20 | 237 |
| Vorka | Fléau | Épique | 5 | 26 | 19 | 22 | 261 |
| Vorka | Fléau | Épique | 6 | 29 | 20 | 24 | 284 |
| Vorka | Fléau | Épique | 7 | 36 | 22 | 26 | 380 |
| Vorka | Fléau | Épique | 8 | 45 | 24 | 28 | 513 |
| Vorka | Fléau | Épique | 9 | 56 | 25 | 30 | 666 |
| Vorka | Fléau | Épique | 10 | 103 | 38 | 50 | 1233 |
| Urgath | Bastion | Légendaire | 1 | 21 | 6 | 8 | 225 |
| Urgath | Bastion | Légendaire | 2 | 23 | 7 | 9 | 252 |
| Urgath | Bastion | Légendaire | 3 | 25 | 8 | 11 | 279 |
| Urgath | Bastion | Légendaire | 4 | 28 | 10 | 12 | 307 |
| Urgath | Bastion | Légendaire | 5 | 30 | 11 | 14 | 334 |
| Urgath | Bastion | Légendaire | 6 | 32 | 12 | 15 | 361 |
| Urgath | Bastion | Légendaire | 7 | 38 | 13 | 17 | 457 |
| Urgath | Bastion | Légendaire | 8 | 46 | 15 | 18 | 591 |
| Urgath | Bastion | Légendaire | 9 | 56 | 16 | 20 | 744 |
| Urgath | Bastion | Légendaire | 10 | 102 | 26 | 35 | 1353 |
| TYRAK | Ravageur | Mythique | 1 | 23 | 8 | 12 | 245 |
| TYRAK | Ravageur | Mythique | 2 | 25 | 9 | 13 | 273 |
| TYRAK | Ravageur | Mythique | 3 | 28 | 10 | 15 | 302 |
| TYRAK | Ravageur | Mythique | 4 | 30 | 11 | 16 | 330 |
| TYRAK | Ravageur | Mythique | 5 | 32 | 12 | 18 | 358 |
| TYRAK | Ravageur | Mythique | 6 | 35 | 14 | 19 | 387 |
| TYRAK | Ravageur | Mythique | 7 | 41 | 15 | 21 | 480 |
| TYRAK | Ravageur | Mythique | 8 | 49 | 16 | 22 | 610 |
| TYRAK | Ravageur | Mythique | 9 | 58 | 17 | 24 | 759 |
| TYRAK | Ravageur | Mythique | 10 | 106 | 28 | 42 | 1380 |

## L. Morgath Normal

| Warrior | N9 endgame | N10 moyen | N10 bon | N10 endgame |
| --- | --- | --- | --- | --- |
| Karg | 2.2 % | 9.5 % | 57.7 % | 82.3 % |
| Naya | 4.6 % | 10.6 % | 51.7 % | 82.8 % |
| Brakk | 3.7 % | 8.5 % | 60.3 % | 82.6 % |
| Eyla | 3.4 % | 7.4 % | 54 % | 79.3 % |
| Asha | 2.1 % | 10.9 % | 57.8 % | 83.9 % |
| Rhex | 4.1 % | 16.1 % | 64.8 % | 85.5 % |
| Ursak | 2.5 % | 9.7 % | 57.6 % | 87 % |
| Saar | 2.2 % | 9.3 % | 54.6 % | 79.7 % |
| Morga | 1.8 % | 10.6 % | 66.9 % | 89.6 % |
| Vorka | 4 % | 12.1 % | 56 % | 79.2 % |
| Urgath | 3.4 % | 12 % | 70 % | 89.9 % |
| TYRAK | 2.9 % | 21 % | 71.3 % | 91.7 % |

Moyennes : N9 3.07 %, N10 moyen 11.47 %, bon 60.23 %, endgame 84.46 %. Kits : none=aucun; common=Massue + Peaux; medium=Marteau + Carapace; good=Griffe + Fourrure blanche; endgame=Cœur + Peau. V0.14 tests conservés, pas de niveau minimum ni gear score ; carte et ennemis fixes.

## M. Morgath Némésis

| Warrior | N10 moyen | N10 bon | N10 endgame |
| --- | --- | --- | --- |
| Karg | 1.2 % | 24.6 % | 50.8 % |
| Naya | 2.1 % | 23.4 % | 56.9 % |
| Brakk | 1.4 % | 26.2 % | 50.5 % |
| Eyla | 0.5 % | 21.3 % | 45.9 % |
| Asha | 0.4 % | 26.9 % | 54.4 % |
| Rhex | 1.7 % | 28.2 % | 59.2 % |
| Ursak | 0.5 % | 24.7 % | 54.5 % |
| Saar | 1.3 % | 20.9 % | 48.6 % |
| Morga | 1.4 % | 28.6 % | 59.8 % |
| Vorka | 1.5 % | 25.6 % | 46.9 % |
| Urgath | 1.4 % | 29.5 % | 60.9 % |
| TYRAK | 3.6 % | 38.6 % | 66.4 % |

Moyennes 1.42 / 26.54 / 54.57 %. Identités, carte, ordre, switch libre et RNG préservés ; pas de pity Adventure. Même seeds permettent comparaison appariée.

## N. Rift early game

| Warrior | Niveau | Gear | C1 gagné % | Full clear % | XP moyenne réelle |
| --- | --- | --- | --- | --- | --- |
| karg | 1 | none | 0 | 0 | 0 |
| karg | 2 | none | 0 | 0 | 0 |
| karg | 3 | common | 0 | 0 | 0 |
| karg | 5 | medium | 99.4 | 0 | 88.92 |
| karg | 7 | good | 100 | 0 | 128.88 |
| karg | 9 | good | 100 | 0.4 | 152.76 |
| naya | 1 | none | 0 | 0 | 0 |
| naya | 2 | none | 0 | 0 | 0 |
| naya | 3 | common | 0 | 0 | 0 |
| naya | 5 | medium | 99 | 0 | 86.84 |
| naya | 7 | good | 100 | 0 | 130.12 |
| naya | 9 | good | 100 | 0.1 | 148.88 |
| brakk | 1 | none | 0 | 0 | 0 |
| brakk | 2 | none | 0 | 0 | 0 |
| brakk | 3 | common | 0 | 0 | 0 |
| brakk | 5 | medium | 99.4 | 0 | 87.92 |
| brakk | 7 | good | 100 | 0 | 131.44 |
| brakk | 9 | good | 100 | 0.6 | 154.6 |
| eyla | 1 | none | 0 | 0 | 0 |
| eyla | 2 | none | 0 | 0 | 0 |
| eyla | 3 | common | 0 | 0 | 0 |
| eyla | 5 | medium | 99.6 | 0 | 88.92 |
| eyla | 7 | good | 100 | 0 | 128.96 |
| eyla | 9 | good | 100 | 0.7 | 154.16 |
| asha | 1 | none | 0 | 0 | 0 |
| asha | 2 | none | 0 | 0 | 0 |
| asha | 3 | common | 0 | 0 | 0 |
| asha | 5 | medium | 99.8 | 0 | 98.16 |
| asha | 7 | good | 100 | 0 | 128.88 |
| asha | 9 | good | 100 | 0.7 | 153.8 |
| rhex | 1 | none | 0 | 0 | 0 |
| rhex | 2 | none | 0 | 0 | 0 |
| rhex | 3 | common | 0 | 0 | 0 |
| rhex | 5 | medium | 99.8 | 0 | 101 |
| rhex | 7 | good | 100 | 0 | 130.76 |
| rhex | 9 | good | 100 | 0.9 | 155.04 |
| ursak | 1 | none | 0 | 0 | 0 |
| ursak | 2 | none | 0 | 0 | 0 |
| ursak | 3 | common | 0.3 | 0 | 0.12 |
| ursak | 5 | medium | 99.9 | 0 | 105.44 |
| ursak | 7 | good | 100 | 0 | 132.04 |
| ursak | 9 | good | 100 | 0.3 | 154.84 |
| saar | 1 | none | 0 | 0 | 0 |
| saar | 2 | none | 0 | 0 | 0 |
| saar | 3 | common | 0.2 | 0 | 0.08 |
| saar | 5 | medium | 100 | 0 | 106 |
| saar | 7 | good | 100 | 0 | 130.48 |
| saar | 9 | good | 100 | 0.6 | 154.36 |
| morga | 1 | none | 0 | 0 | 0 |
| morga | 2 | none | 0 | 0 | 0 |
| morga | 3 | common | 1.1 | 0 | 0.44 |
| morga | 5 | medium | 99.9 | 0 | 104.36 |
| morga | 7 | good | 100 | 0 | 131.44 |
| morga | 9 | good | 100 | 0.3 | 152.52 |
| vorka | 1 | none | 0 | 0 | 0 |
| vorka | 2 | none | 0 | 0 | 0 |
| vorka | 3 | common | 1.6 | 0 | 0.64 |
| vorka | 5 | medium | 100 | 0 | 111.48 |
| vorka | 7 | good | 100 | 0 | 134.92 |
| vorka | 9 | good | 100 | 0.9 | 154.92 |
| urgath | 1 | none | 0 | 0 | 0 |
| urgath | 2 | none | 0 | 0 | 0 |
| urgath | 3 | common | 5 | 0 | 2 |
| urgath | 5 | medium | 100 | 0 | 112.72 |
| urgath | 7 | good | 100 | 0 | 138.72 |
| urgath | 9 | good | 100 | 0.9 | 156.16 |
| tyrak | 1 | none | 0 | 0 | 0 |
| tyrak | 2 | none | 0.5 | 0 | 0.2 |
| tyrak | 3 | common | 13.3 | 0 | 5.32 |
| tyrak | 5 | medium | 100 | 0 | 115.6 |
| tyrak | 7 | good | 100 | 0 | 138.24 |
| tyrak | 9 | good | 100 | 0.6 | 155.76 |

Pleine difficulté, chaque rencontre HP restaurés comme le moteur. N1/N2 ne reçoivent pas de gratuité ; plusieurs N3 restent sévèrement limités. Pity caché conservé dans carrières, aucune UI/difficulté réduite. L’accessibilité très early reste une réserve de game design si le profil ci-dessus est jugé trop sévère ; aucune nouvelle barrière introduite.

## O. Rift endgame

| Warrior | N10 bon full clear % | N10 endgame full clear % |
| --- | --- | --- |
| Karg | 60.1 | 81.9 |
| Naya | 54.9 | 83.6 |
| Brakk | 61.6 | 84.8 |
| Eyla | 54.7 | 79.6 |
| Asha | 59.9 | 84.5 |
| Rhex | 64.3 | 85.4 |
| Ursak | 63.1 | 86.8 |
| Saar | 52.5 | 78.8 |
| Morga | 71.5 | 89.9 |
| Vorka | 59 | 82.7 |
| Urgath | 72.3 | 90.1 |
| TYRAK | 75.5 | 92.6 |

Moyenne endgame 85.06 %, Phase1 85,06 %. Difficultés/pity/lineup inchangés. Coins 40→20 par victoire pour l’économie, XP40 inchangée mais réellement plafonnée ; coffre Faille final conservé.

## P. Equipment rebalance

Javelot : Force30→65, Vitesse20→45, Esquive8→16. Griffe : Force55→75, Vitesse14 conservée. Garde Ancêtres : PV260→440, Esquive20 conservée, Vitesse12→32. Peau mythique finalement conservée PV650/Esquive25 : candidat PV550/Esquive40/Vitesse8 rejeté (test MorgathN9 max10,5 %). Fourrure Force25 et Griffe85 rejetées (bon kit trop puissant). Aucun effet/passif moteur changé. Les autres 17 objets et les quantités/niveaux/XP sont conservés.

| ID | Type | Rareté | Stats N1 | Effet |
| --- | --- | --- | --- | --- |
| flint-club | weapon | Commun | {"strength":3} | 5 % : +20 % dégâts |
| bone-spear | weapon | Commun | {"strength":1,"speed":4} | Premier coup : +10 % dégâts |
| obsidian-axe | weapon | Peu commun | {"strength":7,"hp":20} | 6 % : saignement, 3 dégâts ×2 |
| hunter-bow | weapon | Peu commun | {"strength":4,"speed":8} | Esquive adverse : −3 points |
| smilodon-fangs | weapon | Rare | {"strength":14,"speed":10} | 8 % : second coup à 50 % |
| mammoth-spear | weapon | Rare | {"strength":18,"hp":50} | 10 % : ignore les réductions de dégâts |
| volcanic-hammer | weapon | Épique | {"strength":38,"hp":100} | 10 % : brûlure, 3 dégâts ×2 |
| storm-javelin | weapon | Épique | {"strength":65,"speed":45,"dodge":16} | Premier coup : +20 % dégâts |
| tyrant-claw | weapon | Légendaire | {"strength":75,"speed":14} | 12 % : +50 % dégâts |
| titan-heart | weapon | Mythique | {"strength":75,"speed":22,"hp":100} | 7 % : +80 % dégâts |
| hunter-hides | armor | Commun | {"hp":30} | Premier coup reçu : −5 % dégâts |
| reed-mantle | armor | Commun | {"hp":15,"dodge":4} | Premier coup reçu : −5 % dégâts |
| bone-harness | armor | Peu commun | {"hp":65,"strength":3} | 5 % : −25 % dégâts reçus |
| raptor-scales | armor | Peu commun | {"hp":45,"speed":6,"dodge":6} | Premier coup reçu : −10 % dégâts |
| mammoth-plate | armor | Rare | {"hp":140,"strength":6} | Bonus de critique adverse : −20 % |
| smilodon-cloak | armor | Rare | {"hp":95,"dodge":14,"speed":8} | Premier coup reçu : −15 % dégâts |
| volcanic-shell | armor | Épique | {"hp":320,"strength":10} | 10 % : brûle l’attaquant, 3 dégâts ×2 |
| ancestor-guard | armor | Épique | {"hp":440,"dodge":20,"speed":32} | Les 3 premiers coups reçus : −15 % dégâts |
| white-titan-fur | armor | Légendaire | {"hp":450,"strength":15} | Au-dessus de 50 % PV : −8 % dégâts reçus |
| primordial-titan-skin | armor | Mythique | {"hp":650,"dodge":25} | Les 3 premiers coups reçus : −20 % dégâts |

Les bonus équipements ne sont pas multipliés par le niveau de l’équipement dans ce système V1 : progression legacy conservée, pas de nouvelle mécanique ajoutée.

## Q. Build diversity

12 Warriors ×100 paires ×4 profils ×1000 seeds = 4800000 combats pour cette matrice. Boss réel Morgath Némésis ; profils synthétiques explicites, non ennemis modifiés : rapide F160/E35/V115/PV1800 ; tank F170/E12/V38/PV2900 ; dodge F160/E120/V70/PV1750. Niveau10, équipement comparable N1.

Familles top1 observées (3) : titan-heart / ancestor-guard; titan-heart / primordial-titan-skin; storm-javelin / primordial-titan-skin. Écarts de ~1–2 points peuvent être du bruit d’échantillonnage, pas une domination certaine. Le Cœur reste très fort ; ne pas prétendre toutes les armes viables. Top5 par Warrior ET matchup :

| Warrior | Matchup | Rang | Arme | Armure | Victoire |
| --- | --- | --- | --- | --- | --- |
| karg | boss | 1 | titan-heart | ancestor-guard | 52.60 % |
| karg | boss | 2 | storm-javelin | primordial-titan-skin | 51.80 % |
| karg | boss | 3 | titan-heart | primordial-titan-skin | 51.50 % |
| karg | boss | 4 | storm-javelin | ancestor-guard | 47.50 % |
| karg | boss | 5 | tyrant-claw | ancestor-guard | 40.70 % |
| karg | fast | 1 | titan-heart | primordial-titan-skin | 78 % |
| karg | fast | 2 | storm-javelin | primordial-titan-skin | 77.90 % |
| karg | fast | 3 | titan-heart | ancestor-guard | 77 % |
| karg | fast | 4 | storm-javelin | ancestor-guard | 74 % |
| karg | fast | 5 | storm-javelin | white-titan-fur | 67.10 % |
| karg | tank | 1 | titan-heart | ancestor-guard | 72.10 % |
| karg | tank | 2 | storm-javelin | primordial-titan-skin | 71.10 % |
| karg | tank | 3 | titan-heart | primordial-titan-skin | 70.70 % |
| karg | tank | 4 | storm-javelin | ancestor-guard | 65.30 % |
| karg | tank | 5 | tyrant-claw | ancestor-guard | 59.80 % |
| karg | dodge | 1 | storm-javelin | primordial-titan-skin | 82.80 % |
| karg | dodge | 2 | titan-heart | ancestor-guard | 82.70 % |
| karg | dodge | 3 | titan-heart | primordial-titan-skin | 81.50 % |
| karg | dodge | 4 | storm-javelin | ancestor-guard | 80.60 % |
| karg | dodge | 5 | storm-javelin | white-titan-fur | 74.10 % |
| naya | boss | 1 | titan-heart | primordial-titan-skin | 56.50 % |
| naya | boss | 2 | titan-heart | ancestor-guard | 50.70 % |
| naya | boss | 3 | storm-javelin | primordial-titan-skin | 47.20 % |
| naya | boss | 4 | tyrant-claw | primordial-titan-skin | 45.10 % |
| naya | boss | 5 | tyrant-claw | ancestor-guard | 40.40 % |
| naya | fast | 1 | titan-heart | primordial-titan-skin | 84.60 % |
| naya | fast | 2 | storm-javelin | primordial-titan-skin | 81.50 % |
| naya | fast | 3 | titan-heart | ancestor-guard | 80 % |
| naya | fast | 4 | tyrant-claw | primordial-titan-skin | 76.70 % |
| naya | fast | 5 | storm-javelin | white-titan-fur | 73 % |
| naya | tank | 1 | titan-heart | primordial-titan-skin | 73.70 % |
| naya | tank | 2 | titan-heart | ancestor-guard | 68.80 % |
| naya | tank | 3 | tyrant-claw | primordial-titan-skin | 62.80 % |
| naya | tank | 4 | storm-javelin | primordial-titan-skin | 61.80 % |
| naya | tank | 5 | tyrant-claw | ancestor-guard | 56.20 % |
| naya | dodge | 1 | titan-heart | primordial-titan-skin | 89.90 % |
| naya | dodge | 2 | titan-heart | ancestor-guard | 85.90 % |
| naya | dodge | 3 | storm-javelin | primordial-titan-skin | 85.60 % |
| naya | dodge | 4 | tyrant-claw | primordial-titan-skin | 83.40 % |
| naya | dodge | 5 | tyrant-claw | ancestor-guard | 78.70 % |
| brakk | boss | 1 | titan-heart | ancestor-guard | 59.80 % |
| brakk | boss | 2 | storm-javelin | primordial-titan-skin | 55.80 % |
| brakk | boss | 3 | storm-javelin | ancestor-guard | 54.80 % |
| brakk | boss | 4 | titan-heart | primordial-titan-skin | 52.90 % |
| brakk | boss | 5 | tyrant-claw | ancestor-guard | 47.80 % |
| brakk | fast | 1 | titan-heart | ancestor-guard | 87.20 % |
| brakk | fast | 2 | titan-heart | primordial-titan-skin | 85.20 % |
| brakk | fast | 3 | storm-javelin | primordial-titan-skin | 85.10 % |
| brakk | fast | 4 | storm-javelin | ancestor-guard | 83.90 % |
| brakk | fast | 5 | tyrant-claw | ancestor-guard | 79.40 % |
| brakk | tank | 1 | titan-heart | ancestor-guard | 79.50 % |
| brakk | tank | 2 | storm-javelin | primordial-titan-skin | 75.60 % |
| brakk | tank | 3 | titan-heart | primordial-titan-skin | 75.40 % |
| brakk | tank | 4 | storm-javelin | ancestor-guard | 74.50 % |
| brakk | tank | 5 | tyrant-claw | ancestor-guard | 67.10 % |
| brakk | dodge | 1 | titan-heart | ancestor-guard | 91.20 % |
| brakk | dodge | 2 | titan-heart | primordial-titan-skin | 90.30 % |
| brakk | dodge | 3 | storm-javelin | primordial-titan-skin | 90.10 % |
| brakk | dodge | 4 | storm-javelin | ancestor-guard | 89.30 % |
| brakk | dodge | 5 | tyrant-claw | ancestor-guard | 85.60 % |
| eyla | boss | 1 | titan-heart | primordial-titan-skin | 46.10 % |
| eyla | boss | 2 | titan-heart | ancestor-guard | 43.20 % |
| eyla | boss | 3 | storm-javelin | primordial-titan-skin | 40.70 % |
| eyla | boss | 4 | storm-javelin | ancestor-guard | 34.10 % |
| eyla | boss | 5 | tyrant-claw | primordial-titan-skin | 33.40 % |
| eyla | fast | 1 | titan-heart | primordial-titan-skin | 77.30 % |
| eyla | fast | 2 | storm-javelin | primordial-titan-skin | 75 % |
| eyla | fast | 3 | titan-heart | ancestor-guard | 74.60 % |
| eyla | fast | 4 | storm-javelin | ancestor-guard | 71.20 % |
| eyla | fast | 5 | titan-heart | white-titan-fur | 67 % |
| eyla | tank | 1 | titan-heart | primordial-titan-skin | 69.80 % |
| eyla | tank | 2 | titan-heart | ancestor-guard | 65.80 % |
| eyla | tank | 3 | storm-javelin | primordial-titan-skin | 62.50 % |
| eyla | tank | 4 | storm-javelin | ancestor-guard | 56 % |
| eyla | tank | 5 | titan-heart | white-titan-fur | 54.80 % |
| eyla | dodge | 1 | titan-heart | primordial-titan-skin | 86.20 % |
| eyla | dodge | 2 | storm-javelin | primordial-titan-skin | 84.20 % |
| eyla | dodge | 3 | titan-heart | ancestor-guard | 83 % |
| eyla | dodge | 4 | storm-javelin | ancestor-guard | 77.50 % |
| eyla | dodge | 5 | tyrant-claw | primordial-titan-skin | 76.20 % |
| asha | boss | 1 | titan-heart | primordial-titan-skin | 55.50 % |
| asha | boss | 2 | titan-heart | ancestor-guard | 55 % |
| asha | boss | 3 | storm-javelin | primordial-titan-skin | 53.70 % |
| asha | boss | 4 | storm-javelin | ancestor-guard | 48.70 % |
| asha | boss | 5 | tyrant-claw | ancestor-guard | 42.50 % |
| asha | fast | 1 | titan-heart | ancestor-guard | 81.70 % |
| asha | fast | 2 | titan-heart | primordial-titan-skin | 81 % |
| asha | fast | 3 | storm-javelin | primordial-titan-skin | 80.60 % |
| asha | fast | 4 | storm-javelin | ancestor-guard | 77.40 % |
| asha | fast | 5 | storm-javelin | white-titan-fur | 71.90 % |
| asha | tank | 1 | titan-heart | primordial-titan-skin | 76.80 % |
| asha | tank | 2 | titan-heart | ancestor-guard | 75.50 % |
| asha | tank | 3 | storm-javelin | primordial-titan-skin | 74.50 % |
| asha | tank | 4 | storm-javelin | ancestor-guard | 69.40 % |
| asha | tank | 5 | tyrant-claw | ancestor-guard | 64.30 % |
| asha | dodge | 1 | storm-javelin | primordial-titan-skin | 88 % |
| asha | dodge | 2 | titan-heart | ancestor-guard | 86.50 % |
| asha | dodge | 3 | titan-heart | primordial-titan-skin | 86.50 % |
| asha | dodge | 4 | storm-javelin | ancestor-guard | 85.20 % |
| asha | dodge | 5 | storm-javelin | white-titan-fur | 79.10 % |
| rhex | boss | 1 | titan-heart | primordial-titan-skin | 60.60 % |
| rhex | boss | 2 | titan-heart | ancestor-guard | 59.20 % |
| rhex | boss | 3 | storm-javelin | primordial-titan-skin | 55.80 % |
| rhex | boss | 4 | storm-javelin | ancestor-guard | 50.80 % |
| rhex | boss | 5 | tyrant-claw | primordial-titan-skin | 45.80 % |
| rhex | fast | 1 | titan-heart | primordial-titan-skin | 84.30 % |
| rhex | fast | 2 | titan-heart | ancestor-guard | 83.90 % |
| rhex | fast | 3 | storm-javelin | primordial-titan-skin | 81.60 % |
| rhex | fast | 4 | storm-javelin | ancestor-guard | 77.60 % |
| rhex | fast | 5 | titan-heart | white-titan-fur | 74.30 % |
| rhex | tank | 1 | titan-heart | primordial-titan-skin | 79.40 % |
| rhex | tank | 2 | titan-heart | ancestor-guard | 78.30 % |
| rhex | tank | 3 | storm-javelin | primordial-titan-skin | 75 % |
| rhex | tank | 4 | storm-javelin | ancestor-guard | 69.20 % |
| rhex | tank | 5 | tyrant-claw | ancestor-guard | 67.60 % |
| rhex | dodge | 1 | titan-heart | primordial-titan-skin | 90.10 % |
| rhex | dodge | 2 | storm-javelin | primordial-titan-skin | 89.20 % |
| rhex | dodge | 3 | titan-heart | ancestor-guard | 88.60 % |
| rhex | dodge | 4 | storm-javelin | ancestor-guard | 85.60 % |
| rhex | dodge | 5 | tyrant-claw | primordial-titan-skin | 83 % |
| ursak | boss | 1 | titan-heart | ancestor-guard | 56 % |
| ursak | boss | 2 | titan-heart | primordial-titan-skin | 56 % |
| ursak | boss | 3 | storm-javelin | primordial-titan-skin | 55.30 % |
| ursak | boss | 4 | storm-javelin | ancestor-guard | 51.70 % |
| ursak | boss | 5 | tyrant-claw | ancestor-guard | 42.20 % |
| ursak | fast | 1 | titan-heart | primordial-titan-skin | 88.60 % |
| ursak | fast | 2 | titan-heart | ancestor-guard | 88.50 % |
| ursak | fast | 3 | storm-javelin | primordial-titan-skin | 87.70 % |
| ursak | fast | 4 | storm-javelin | ancestor-guard | 84.70 % |
| ursak | fast | 5 | titan-heart | white-titan-fur | 79.30 % |
| ursak | tank | 1 | titan-heart | ancestor-guard | 78.10 % |
| ursak | tank | 2 | storm-javelin | primordial-titan-skin | 77.30 % |
| ursak | tank | 3 | titan-heart | primordial-titan-skin | 77.20 % |
| ursak | tank | 4 | storm-javelin | ancestor-guard | 71.30 % |
| ursak | tank | 5 | storm-javelin | white-titan-fur | 64.90 % |
| ursak | dodge | 1 | storm-javelin | primordial-titan-skin | 92.50 % |
| ursak | dodge | 2 | titan-heart | primordial-titan-skin | 91.60 % |
| ursak | dodge | 3 | titan-heart | ancestor-guard | 91.10 % |
| ursak | dodge | 4 | storm-javelin | ancestor-guard | 89.50 % |
| ursak | dodge | 5 | tyrant-claw | ancestor-guard | 85.20 % |
| saar | boss | 1 | titan-heart | primordial-titan-skin | 50.10 % |
| saar | boss | 2 | titan-heart | ancestor-guard | 46.80 % |
| saar | boss | 3 | storm-javelin | primordial-titan-skin | 45.60 % |
| saar | boss | 4 | tyrant-claw | primordial-titan-skin | 39.30 % |
| saar | boss | 5 | storm-javelin | ancestor-guard | 37.20 % |
| saar | fast | 1 | titan-heart | primordial-titan-skin | 81.80 % |
| saar | fast | 2 | storm-javelin | primordial-titan-skin | 80.70 % |
| saar | fast | 3 | titan-heart | ancestor-guard | 75.60 % |
| saar | fast | 4 | storm-javelin | ancestor-guard | 74.70 % |
| saar | fast | 5 | tyrant-claw | primordial-titan-skin | 70.40 % |
| saar | tank | 1 | titan-heart | primordial-titan-skin | 72.10 % |
| saar | tank | 2 | titan-heart | ancestor-guard | 65.60 % |
| saar | tank | 3 | storm-javelin | primordial-titan-skin | 65.30 % |
| saar | tank | 4 | tyrant-claw | primordial-titan-skin | 59.40 % |
| saar | tank | 5 | storm-javelin | ancestor-guard | 57.60 % |
| saar | dodge | 1 | titan-heart | primordial-titan-skin | 87.60 % |
| saar | dodge | 2 | storm-javelin | primordial-titan-skin | 86.40 % |
| saar | dodge | 3 | titan-heart | ancestor-guard | 84.20 % |
| saar | dodge | 4 | storm-javelin | ancestor-guard | 82.30 % |
| saar | dodge | 5 | tyrant-claw | primordial-titan-skin | 78.70 % |
| morga | boss | 1 | titan-heart | ancestor-guard | 65.10 % |
| morga | boss | 2 | storm-javelin | primordial-titan-skin | 63.30 % |
| morga | boss | 3 | storm-javelin | ancestor-guard | 62.90 % |
| morga | boss | 4 | titan-heart | primordial-titan-skin | 60.90 % |
| morga | boss | 5 | tyrant-claw | ancestor-guard | 52.90 % |
| morga | fast | 1 | titan-heart | ancestor-guard | 91.70 % |
| morga | fast | 2 | titan-heart | primordial-titan-skin | 90.90 % |
| morga | fast | 3 | storm-javelin | primordial-titan-skin | 90.40 % |
| morga | fast | 4 | storm-javelin | ancestor-guard | 89.70 % |
| morga | fast | 5 | tyrant-claw | ancestor-guard | 83.80 % |
| morga | tank | 1 | titan-heart | ancestor-guard | 86.70 % |
| morga | tank | 2 | storm-javelin | primordial-titan-skin | 86.30 % |
| morga | tank | 3 | storm-javelin | ancestor-guard | 83.10 % |
| morga | tank | 4 | titan-heart | primordial-titan-skin | 83 % |
| morga | tank | 5 | tyrant-claw | ancestor-guard | 76.60 % |
| morga | dodge | 1 | titan-heart | ancestor-guard | 95.50 % |
| morga | dodge | 2 | storm-javelin | primordial-titan-skin | 94.60 % |
| morga | dodge | 3 | storm-javelin | ancestor-guard | 94 % |
| morga | dodge | 4 | titan-heart | primordial-titan-skin | 92.30 % |
| morga | dodge | 5 | tyrant-claw | ancestor-guard | 90.30 % |
| vorka | boss | 1 | titan-heart | ancestor-guard | 51.80 % |
| vorka | boss | 2 | titan-heart | primordial-titan-skin | 51.40 % |
| vorka | boss | 3 | storm-javelin | primordial-titan-skin | 48.50 % |
| vorka | boss | 4 | storm-javelin | ancestor-guard | 44.90 % |
| vorka | boss | 5 | tyrant-claw | ancestor-guard | 41.80 % |
| vorka | fast | 1 | titan-heart | ancestor-guard | 80.10 % |
| vorka | fast | 2 | storm-javelin | primordial-titan-skin | 78.80 % |
| vorka | fast | 3 | titan-heart | primordial-titan-skin | 78.60 % |
| vorka | fast | 4 | storm-javelin | ancestor-guard | 73.60 % |
| vorka | fast | 5 | tyrant-claw | primordial-titan-skin | 69.30 % |
| vorka | tank | 1 | titan-heart | primordial-titan-skin | 72.10 % |
| vorka | tank | 2 | storm-javelin | primordial-titan-skin | 71.60 % |
| vorka | tank | 3 | titan-heart | ancestor-guard | 71.10 % |
| vorka | tank | 4 | storm-javelin | ancestor-guard | 65.10 % |
| vorka | tank | 5 | tyrant-claw | primordial-titan-skin | 60.20 % |
| vorka | dodge | 1 | titan-heart | ancestor-guard | 87.10 % |
| vorka | dodge | 2 | titan-heart | primordial-titan-skin | 87 % |
| vorka | dodge | 3 | storm-javelin | primordial-titan-skin | 84.60 % |
| vorka | dodge | 4 | storm-javelin | ancestor-guard | 82 % |
| vorka | dodge | 5 | tyrant-claw | ancestor-guard | 78.90 % |
| urgath | boss | 1 | titan-heart | ancestor-guard | 65 % |
| urgath | boss | 2 | storm-javelin | ancestor-guard | 63.80 % |
| urgath | boss | 3 | storm-javelin | primordial-titan-skin | 63.10 % |
| urgath | boss | 4 | titan-heart | primordial-titan-skin | 61.80 % |
| urgath | boss | 5 | tyrant-claw | ancestor-guard | 51 % |
| urgath | fast | 1 | titan-heart | ancestor-guard | 91 % |
| urgath | fast | 2 | titan-heart | primordial-titan-skin | 90.90 % |
| urgath | fast | 3 | storm-javelin | primordial-titan-skin | 90.40 % |
| urgath | fast | 4 | storm-javelin | ancestor-guard | 89.50 % |
| urgath | fast | 5 | tyrant-claw | ancestor-guard | 83.60 % |
| urgath | tank | 1 | titan-heart | ancestor-guard | 85 % |
| urgath | tank | 2 | titan-heart | primordial-titan-skin | 84.90 % |
| urgath | tank | 3 | storm-javelin | primordial-titan-skin | 84.50 % |
| urgath | tank | 4 | storm-javelin | ancestor-guard | 83.40 % |
| urgath | tank | 5 | tyrant-claw | ancestor-guard | 76.50 % |
| urgath | dodge | 1 | storm-javelin | primordial-titan-skin | 94.60 % |
| urgath | dodge | 2 | titan-heart | ancestor-guard | 94.10 % |
| urgath | dodge | 3 | storm-javelin | ancestor-guard | 93.80 % |
| urgath | dodge | 4 | titan-heart | primordial-titan-skin | 93.40 % |
| urgath | dodge | 5 | storm-javelin | white-titan-fur | 89.40 % |
| tyrak | boss | 1 | titan-heart | ancestor-guard | 69 % |
| tyrak | boss | 2 | storm-javelin | primordial-titan-skin | 68.70 % |
| tyrak | boss | 3 | titan-heart | primordial-titan-skin | 66.40 % |
| tyrak | boss | 4 | storm-javelin | ancestor-guard | 65.40 % |
| tyrak | boss | 5 | tyrant-claw | ancestor-guard | 56.50 % |
| tyrak | fast | 1 | storm-javelin | primordial-titan-skin | 91.70 % |
| tyrak | fast | 2 | titan-heart | primordial-titan-skin | 91.60 % |
| tyrak | fast | 3 | titan-heart | ancestor-guard | 91.50 % |
| tyrak | fast | 4 | storm-javelin | ancestor-guard | 89.20 % |
| tyrak | fast | 5 | tyrant-claw | ancestor-guard | 86.10 % |
| tyrak | tank | 1 | titan-heart | ancestor-guard | 88 % |
| tyrak | tank | 2 | storm-javelin | primordial-titan-skin | 87.40 % |
| tyrak | tank | 3 | titan-heart | primordial-titan-skin | 85.70 % |
| tyrak | tank | 4 | storm-javelin | ancestor-guard | 84.30 % |
| tyrak | tank | 5 | tyrant-claw | ancestor-guard | 78.40 % |
| tyrak | dodge | 1 | storm-javelin | primordial-titan-skin | 95.10 % |
| tyrak | dodge | 2 | titan-heart | ancestor-guard | 95.10 % |
| tyrak | dodge | 3 | titan-heart | primordial-titan-skin | 93.60 % |
| tyrak | dodge | 4 | storm-javelin | ancestor-guard | 93.50 % |
| tyrak | dodge | 5 | storm-javelin | white-titan-fur | 90.60 % |

RNG : blocs de50, streaks/crit/esquives/HP/actions dans JSON. P90 max d’actions dans les cas RNG mesurés 51; moteur conserve sa borne60 tours. Aucun nouveau proc récursif, dodge cap ou effet invincible. Matrices difficiles évitent le faux classement où tout gagne100 %.

## R. Equipment recycle

Commun3, Peu commun5, Rare8, Épique12, Légendaire18, Mythique24 pièces par exemplaire. Manuel, qty entière1..owned−1, quote inclut gain/remain ; confirmation attend quantité initiale + equipmentRecycleSequence suivant. Stale/double confirmation = no-op. Aucun équipement de dernier exemplaire vendu, aucun preset invalidé, aucune XP ajoutée par cette action. Doublons de coffre continuent leur système XP équipement existant ; pas d’autovente ajoutée.

Chaque remboursement <25. Retour normal pondéré ~4.11 pièces <prix25 : boucle déficitaire même catalogue entièrement possédé. La carrière analytique choisit explicitement de recycler les surplus, ce n’est pas du runtime automatique.

## S. Economy

Itérations : I1 maintenait Exp350 ; I2 (240 carrières/30j) focusW observé11,74 coffres/j pendant14→30 incluant jackpots ; I3 Exp100/Rift25/Duel10 encore8,5 incluant jackpots ; candidat final Exp50/Rift20/Duel10. XP/loot/prix isolés du coin tuning. Les jackpots1500/2500 et les10W/3R n’ont pas été réduits.

Régulier A focusWarrior, fenêtre jours31–60 : achats payants réellement simulés 6.10/jour (INCLUT jackpots), Warrior gratuits 0.11/jour, équipement gratuits 0.10, Faille 0.38. Solde moyen J60 63.92.

| Source | Pièces/jour fenêtre31–60 |
| --- | --- |
| normal | 17.14 |
| nemesis | 103.28 |
| rift | 86.67 |
| duel | 50.52 |
| expedition | 49.07 |
| recycle | 223.72 |
| equipmentRecycle | 4.09 |
| badges | 29.43 |
| boss | 46.22 |

Pour éviter de confondre ce flux avec un régime sans jackpots : première victoire globale 10.09/jour, Boss+badges 75.65/jour, refund attendu d’un tirage W catalogue possédé 29.98 (coût net 70.02). En retirant ces jackpots ET le remboursement induit par leurs achats + celui des10W Boss gratuits : capacité installée analytique corrigée **4.84 payants/jour**. Ce chiffre est une correction comptable à rendement moyen, pas une seconde simulation entièrement sans milestones ; les refunds Faille/Exp récurrents restent légitimes. Ne pas prétendre une garantie quotidienne ou tous les12Warriors possédés dèsJ1.

Budget 50/50 et 75/25 explicitement simulés : allocation cumulative, aucune monnaie rajoutée. Payer équipements réduit les coffres Warrior ; table métriques suivante. Pas de bots pour fournir revenu Duel.

## T. Chest flow

W100 ; E25 ; E×10=250. W odds70/22/7/0,85/0,14/0,01 %. E63/27/8,5/1,35/0,14/0,01 %. Faille5/15/40/28/10/2 %. Warrior recycle20+25XP /40+40 /80+75 /150+125 /200+200 /250+350 inchangé, XP effective plafonnée.

| Profil | Stratégie | Jour | W payants | E payants | W gratuits | Rift chests | Uniques W | Uniques E | Doublons W | Doublons E | E recyclés | Pièces E recycle | Adventure node | Némésis node | Coins |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| casual | A-warrior | 14 | 45 | 0 | 0 | 1 | 10 | 5 | 37 | 0 | 6 | 18 | 20 | 0 | 87 |
| casual | A-warrior | 30 | 94 | 0 | 0 | 4 | 11 | 8 | 88 | 1 | 19 | 66 | 20 | 0 | 62 |
| casual | A-warrior | 60 | 275 | 0 | 10 | 18 | 11 | 11 | 293 | 3 | 38 | 143 | 20 | 20 | 72 |
| casual | B-equipment | 14 | 0 | 346 | 10 | 6 | 9 | 16 | 8 | 331 | 323 | 1252 | 20 | 20 | 23 |
| casual | B-equipment | 30 | 0 | 756 | 10 | 25 | 10 | 16 | 26 | 742 | 758 | 3002 | 20 | 20 | 2 |
| casual | B-equipment | 60 | 0 | 1257 | 11 | 48 | 12 | 17 | 48 | 1243 | 1286 | 5145 | 20 | 20 | 6 |
| casual | C-balanced | 14 | 63 | 253 | 10 | 8 | 11 | 17 | 71 | 238 | 162 | 622 | 20 | 20 | 41 |
| casual | C-balanced | 30 | 94 | 377 | 10 | 20 | 11 | 17 | 114 | 362 | 385 | 1546 | 20 | 20 | 0 |
| casual | C-balanced | 60 | 148 | 592 | 10 | 43 | 11 | 18 | 191 | 578 | 632 | 2546 | 20 | 20 | 3 |
| casual | D-main | 14 | 40 | 161 | 10 | 3 | 9 | 13 | 45 | 148 | 157 | 612 | 20 | 15 | 89 |
| casual | D-main | 30 | 64 | 254 | 10 | 8 | 11 | 13 | 72 | 242 | 267 | 1037 | 20 | 20 | 3 |
| casual | D-main | 60 | 131 | 524 | 10 | 25 | 11 | 14 | 156 | 515 | 567 | 2263 | 20 | 20 | 19 |
| casual | E-collection | 14 | 30 | 41 | 0 | 0 | 8 | 12 | 23 | 31 | 35 | 117 | 20 | 0 | 84 |
| casual | E-collection | 30 | 62 | 83 | 0 | 3 | 10 | 13 | 56 | 72 | 99 | 369 | 20 | 0 | 59 |
| casual | E-collection | 60 | 196 | 262 | 10 | 21 | 11 | 15 | 217 | 249 | 304 | 1206 | 20 | 20 | 29 |
| casual | F-no-duel | 14 | 68 | 271 | 10 | 9 | 10 | 16 | 78 | 255 | 262 | 995 | 20 | 20 | 9 |
| casual | F-no-duel | 30 | 113 | 453 | 10 | 20 | 12 | 18 | 132 | 437 | 460 | 1793 | 20 | 20 | 9 |
| casual | F-no-duel | 60 | 168 | 671 | 10 | 45 | 12 | 18 | 212 | 657 | 712 | 2844 | 20 | 20 | 0 |
| casual | G-no-rift | 14 | 37 | 149 | 10 | 0 | 9 | 14 | 39 | 136 | 149 | 587 | 20 | 18 | 87 |
| casual | G-no-rift | 30 | 75 | 301 | 10 | 3 | 11 | 17 | 78 | 287 | 314 | 1213 | 20 | 20 | 8 |
| casual | G-no-rift | 60 | 103 | 411 | 10 | 3 | 11 | 17 | 106 | 400 | 461 | 1836 | 20 | 20 | 0 |
| casual | H-no-expedition | 14 | 15 | 59 | 0 | 0 | 8 | 11 | 8 | 48 | 41 | 139 | 19 | 0 | 9 |
| casual | H-no-expedition | 30 | 74 | 294 | 10 | 10 | 11 | 16 | 84 | 278 | 272 | 1056 | 20 | 20 | 11 |
| casual | H-no-expedition | 60 | 136 | 541 | 10 | 36 | 12 | 16 | 171 | 525 | 522 | 2114 | 20 | 20 | 24 |
| casual | budget-75 | 14 | 71 | 95 | 10 | 4 | 10 | 12 | 76 | 86 | 90 | 333 | 20 | 20 | 20 |
| casual | budget-75 | 30 | 166 | 222 | 12 | 14 | 12 | 13 | 181 | 214 | 241 | 925 | 20 | 20 | 23 |
| casual | budget-75 | 60 | 236 | 315 | 12 | 30 | 12 | 14 | 267 | 309 | 370 | 1424 | 20 | 20 | 7 |
| casual | budget-25 | 14 | 19 | 229 | 11 | 4 | 10 | 16 | 25 | 213 | 212 | 815 | 20 | 12 | 60 |
| casual | budget-25 | 30 | 45 | 541 | 11 | 21 | 11 | 16 | 67 | 525 | 553 | 2237 | 20 | 20 | 37 |
| casual | budget-25 | 60 | 75 | 891 | 11 | 48 | 11 | 16 | 124 | 879 | 936 | 3822 | 20 | 20 | 4 |
| regular | A-warrior | 14 | 67 | 0 | 0 | 1 | 9 | 8 | 60 | 1 | 6 | 20 | 20 | 0 | 32 |
| regular | A-warrior | 30 | 188 | 0 | 10 | 8 | 11 | 10 | 196 | 2 | 21 | 78 | 20 | 20 | 24 |
| regular | A-warrior | 60 | 387 | 0 | 11 | 23 | 11 | 11 | 411 | 3 | 59 | 220 | 20 | 20 | 77 |
| regular | B-equipment | 14 | 0 | 580 | 12 | 9 | 9 | 15 | 13 | 568 | 563 | 2214 | 20 | 20 | 17 |
| regular | B-equipment | 30 | 0 | 881 | 12 | 20 | 11 | 15 | 22 | 869 | 875 | 3456 | 20 | 20 | 2 |
| regular | B-equipment | 60 | 0 | 1586 | 13 | 44 | 12 | 18 | 46 | 1573 | 1608 | 6437 | 20 | 20 | 10 |
| regular | C-balanced | 14 | 80 | 321 | 10 | 8 | 11 | 15 | 88 | 307 | 317 | 1234 | 20 | 20 | 23 |
| regular | C-balanced | 30 | 120 | 478 | 11 | 14 | 11 | 15 | 135 | 468 | 489 | 1922 | 20 | 20 | 20 |
| regular | C-balanced | 60 | 218 | 873 | 11 | 43 | 12 | 17 | 261 | 865 | 916 | 3672 | 20 | 20 | 25 |
| regular | D-main | 14 | 82 | 326 | 10 | 9 | 11 | 17 | 91 | 310 | 319 | 1261 | 20 | 20 | 0 |
| regular | D-main | 30 | 126 | 503 | 10 | 24 | 11 | 17 | 150 | 488 | 509 | 2039 | 20 | 20 | 12 |
| regular | D-main | 60 | 211 | 845 | 11 | 50 | 11 | 17 | 262 | 833 | 893 | 3583 | 20 | 20 | 87 |
| regular | E-collection | 14 | 77 | 103 | 11 | 2 | 10 | 12 | 81 | 92 | 102 | 368 | 20 | 19 | 61 |
| regular | E-collection | 30 | 178 | 238 | 11 | 13 | 11 | 13 | 192 | 227 | 252 | 973 | 20 | 20 | 21 |
| regular | E-collection | 60 | 303 | 405 | 11 | 37 | 11 | 14 | 341 | 398 | 454 | 1805 | 20 | 20 | 36 |
| regular | F-no-duel | 14 | 77 | 308 | 10 | 13 | 11 | 17 | 90 | 294 | 302 | 1188 | 20 | 20 | 18 |
| regular | F-no-duel | 30 | 134 | 537 | 11 | 27 | 12 | 17 | 161 | 525 | 550 | 2215 | 20 | 20 | 59 |
| regular | F-no-duel | 60 | 208 | 829 | 12 | 54 | 12 | 17 | 263 | 821 | 884 | 3527 | 20 | 20 | 23 |
| regular | G-no-rift | 14 | 26 | 104 | 0 | 0 | 7 | 11 | 20 | 93 | 103 | 356 | 20 | 0 | 20 |
| regular | G-no-rift | 30 | 44 | 174 | 1 | 0 | 9 | 13 | 37 | 164 | 192 | 695 | 20 | 0 | 11 |
| regular | G-no-rift | 60 | 124 | 497 | 13 | 3 | 10 | 15 | 131 | 486 | 543 | 2063 | 20 | 20 | 77 |
| regular | H-no-expedition | 14 | 68 | 273 | 10 | 7 | 11 | 16 | 75 | 257 | 165 | 622 | 20 | 20 | 57 |
| regular | H-no-expedition | 30 | 128 | 511 | 10 | 22 | 12 | 17 | 149 | 494 | 483 | 1948 | 20 | 20 | 3 |
| regular | H-no-expedition | 60 | 202 | 809 | 10 | 51 | 12 | 18 | 252 | 791 | 779 | 3090 | 20 | 20 | 25 |
| regular | budget-75 | 14 | 49 | 66 | 0 | 2 | 9 | 11 | 43 | 57 | 68 | 228 | 20 | 0 | 84 |
| regular | budget-75 | 30 | 177 | 237 | 10 | 14 | 10 | 14 | 192 | 227 | 255 | 969 | 20 | 20 | 75 |
| regular | budget-75 | 60 | 303 | 405 | 10 | 39 | 10 | 17 | 343 | 394 | 452 | 1761 | 20 | 20 | 73 |
| regular | budget-25 | 14 | 39 | 469 | 10 | 8 | 10 | 15 | 48 | 456 | 456 | 1815 | 20 | 20 | 0 |
| regular | budget-25 | 30 | 66 | 786 | 13 | 21 | 11 | 17 | 90 | 775 | 795 | 3176 | 20 | 20 | 17 |
| regular | budget-25 | 60 | 111 | 1331 | 13 | 47 | 12 | 18 | 160 | 1321 | 1360 | 5489 | 20 | 20 | 8 |
| active | A-warrior | 14 | 88 | 0 | 0 | 2 | 10 | 5 | 81 | 0 | 4 | 17 | 20 | 0 | 75 |
| active | A-warrior | 30 | 168 | 0 | 0 | 5 | 10 | 7 | 164 | 0 | 6 | 23 | 20 | 0 | 46 |
| active | A-warrior | 60 | 330 | 0 | 0 | 11 | 11 | 7 | 331 | 1 | 16 | 55 | 20 | 0 | 27 |
| active | B-equipment | 14 | 0 | 744 | 10 | 11 | 10 | 16 | 12 | 728 | 728 | 3032 | 20 | 20 | 22 |
| active | B-equipment | 30 | 0 | 1259 | 11 | 25 | 11 | 17 | 26 | 1242 | 1246 | 5107 | 20 | 20 | 18 |
| active | B-equipment | 60 | 0 | 2179 | 11 | 46 | 11 | 18 | 47 | 2163 | 2174 | 8929 | 20 | 20 | 13 |
| active | C-balanced | 14 | 104 | 416 | 10 | 13 | 11 | 16 | 117 | 402 | 407 | 1642 | 20 | 20 | 19 |
| active | C-balanced | 30 | 172 | 688 | 10 | 27 | 11 | 16 | 199 | 676 | 689 | 2767 | 20 | 20 | 15 |
| active | C-balanced | 60 | 303 | 1213 | 10 | 53 | 11 | 17 | 356 | 1203 | 1222 | 4966 | 20 | 20 | 12 |
| active | D-main | 14 | 107 | 425 | 11 | 13 | 10 | 17 | 122 | 408 | 413 | 1631 | 20 | 20 | 20 |
| active | D-main | 30 | 195 | 779 | 11 | 28 | 12 | 18 | 223 | 761 | 770 | 3114 | 20 | 20 | 8 |
| active | D-main | 60 | 329 | 1317 | 12 | 53 | 12 | 18 | 383 | 1302 | 1317 | 5427 | 20 | 20 | 74 |
| active | E-collection | 14 | 71 | 94 | 1 | 1 | 11 | 13 | 63 | 84 | 98 | 374 | 20 | 0 | 22 |
| active | E-collection | 30 | 189 | 252 | 12 | 5 | 11 | 13 | 196 | 244 | 275 | 1064 | 20 | 20 | 20 |
| active | E-collection | 60 | 416 | 555 | 12 | 23 | 11 | 16 | 441 | 546 | 607 | 2381 | 20 | 20 | 95 |
| active | F-no-duel | 14 | 87 | 348 | 10 | 8 | 11 | 14 | 95 | 334 | 337 | 1378 | 20 | 20 | 14 |
| active | F-no-duel | 30 | 164 | 656 | 10 | 22 | 12 | 15 | 185 | 642 | 653 | 2654 | 20 | 20 | 12 |
| active | F-no-duel | 60 | 277 | 1109 | 10 | 50 | 12 | 17 | 326 | 1093 | 1116 | 4552 | 20 | 20 | 63 |
| active | G-no-rift | 14 | 86 | 345 | 10 | 3 | 10 | 16 | 90 | 330 | 329 | 1263 | 20 | 20 | 43 |
| active | G-no-rift | 30 | 136 | 545 | 10 | 3 | 10 | 17 | 140 | 529 | 533 | 2109 | 20 | 20 | 65 |
| active | G-no-rift | 60 | 228 | 910 | 10 | 3 | 10 | 18 | 232 | 893 | 905 | 3630 | 20 | 20 | 16 |
| active | H-no-expedition | 14 | 70 | 281 | 10 | 3 | 10 | 14 | 74 | 267 | 263 | 1086 | 20 | 20 | 21 |
| active | H-no-expedition | 30 | 150 | 600 | 10 | 12 | 10 | 16 | 163 | 584 | 581 | 2393 | 20 | 20 | 23 |
| active | H-no-expedition | 60 | 286 | 1144 | 10 | 38 | 12 | 17 | 323 | 1127 | 1124 | 4511 | 20 | 20 | 11 |
| active | budget-75 | 14 | 144 | 193 | 10 | 6 | 11 | 14 | 150 | 179 | 179 | 646 | 20 | 20 | 3 |
| active | budget-75 | 30 | 250 | 334 | 10 | 18 | 11 | 14 | 268 | 320 | 325 | 1209 | 20 | 20 | 20 |
| active | budget-75 | 60 | 442 | 590 | 10 | 38 | 11 | 16 | 480 | 575 | 596 | 2311 | 20 | 20 | 87 |
| active | budget-25 | 14 | 47 | 565 | 10 | 11 | 11 | 16 | 58 | 550 | 550 | 2289 | 20 | 20 | 64 |
| active | budget-25 | 30 | 80 | 955 | 10 | 25 | 11 | 18 | 105 | 940 | 942 | 3832 | 20 | 20 | 23 |
| active | budget-25 | 60 | 150 | 1801 | 10 | 49 | 12 | 18 | 198 | 1788 | 1802 | 7301 | 20 | 20 | 77 |

Ces traces sont UNE graine illustrée par stratégie, pas les moyennes. Les moyennes et ledger complets sont dans summary/loop JSON ; les métriques sources XP distinguent XP réelle et nominale. Les 3840 carrières incluent ledger, activités et achats aux checkpoints14/30/60.

## U. Badges / masteries fixes

Némésis lisait l’ancien drapeau incompatible : predicate accepte nemesisCompleted ou defeated20. Panthéon12Warriors :200→1500, reçu unique supplémentaire primal-warriors-v015-reward. Ancien Panthéon déjà payé200 : complément1300 une seule fois, pas1500 supplémentaire. Reload/cloud conserve le marqueur ; pas de révocation des anciennes récompenses.

Arsenal annonce les20 équipements Primal réellement définis, liste figée Primal et non futur catalogue global. Le milestone distinct Maîtrise Primordiale (ensemble des badges)1500 est conservé ; ce n’est pas un deuxième paiement du même Panthéon. Les gains des badges sont séparés dans le ledger.

## V. Level10 XP UX

creditWarriorXp retourne la différence de XP cumulée réellement acquise, jusqu’à6850. N9 à1790 recevant100 ne gagne que10 ; N10 ensuite0. Résultat Adventure/Faille/Duel, reçus Expédition et recycle Warrior affichent cela ; HUD/Collection restent Niveau maximum. Duel SQL valide la prime nominale mais replay montre XP réelle. Ancien reçu Exp affichantXP àN10 sans level-up est normalisé à0 ; un vieux reçu qui vient réellement d’atteindreN10 avec level-up est conservé, car son historique exact n’est pas reconstructible. Pas de fausse XP future, mais cette réserve historique est explicite.

## W. UX text fixes

Hub/map15 ; Duel combats du jour/reset Paris HH:MM:SS ; Exp nombre de recherches/délai/confirmation23h36 ; bonus Arsenal20 ; recyclage quantité/gain/restant/aucuneXP. Uniquement fonctions/copies nécessaires, pas de redesign V0.16. Contraste du bouton rappel corrigé uniquement dans son dialogue Exp.

## X. Save migration

SAVE_VERSION6, SAVE_KEY v4 inchangée : local/admin/cloud existants ne sont pas effacés. Loadouts/Warriors/niveaux/quantités/inventaire/XP/badges/Expactive/Rift/pendingrecycles conservés. Nouveaux champs vide/0 pour legacy ; normalisés pour v6. Réserve pleine15, partielle timer inchangé. Aucun paiement à la simple migration Boss ; seulement Panthéon complément prouvé par reçu, via grant habituel.

## Y. Cloud non-regression

Monotonic checks ajoutés pour personal marks et séquences. Les soldes dépensables ne sont pas comparés à tort comme progression. CAS/cache/conflict handling V0.14 conservés. Tests mock : cloud avancé + cache vide/nouvelle origine, defaultfresh, olderlocal/newercloud, newaccount, dirtycache/conflits/offline/revision, nouvelles structures/cap/recycle. Pas de test avec compte Supabase distant ni manipulation du cache utilisateur réel.

## Z. Duel security

JWT / auth.getUser token serveur, service_role privé, RNG crypto serveur, RLS et grants stricts, verrous de quota, ordre locks saves, CAS deux révisions, identity checks, récompenses/points validés SQL, reçu UUID immutable conservés. Aucun signal admin envoyé au Duel réel. Preview admin purement locale, bouton combat serveur désactivé, pas de sync. Migration limite recharge_at ànull. Functions state exposent resetAt/limitRule sans secret.

Limite de validation : aucun Postgres/Supabase local installé ; contrat SQL analysé et testé statiquement, DST testé en JS. La concurrence/migration SQL doit encore être exercée sur environnement de test contrôlé avant production. Compilation bundle Edge ne remplace pas une exécution Deno/Supabase.

## AA. QA new account

Fixture locale DEV admin v015Qa=new en mémoire : coffre welcome → premier Karg → Hub15/15, inventaire vide,0/3 passifs. Pas de compte authentifié créé. Parcours niveaux/passifs/badges/Morgath/Némésis exercé par tests et carrières, pas revendiqué comme une carrière humaine entière. Preview personal : Urgath1, Normal1 globalement fini → +120XP/0coins,N2,réserve14/15. Achievement victoire général conserve ses propres règles.

## AB. QA advanced account

Fixture v5 avec Asha8/Urgath1, deux loadouts,4objets×4copies, Normal20,Némésis5,Exp23h36,badge : migratev6 sans perte. Rappel affiche3/4+prochaine recherche, confirmation claire. Recycle Massue3/4 →1, +9coins, aucunpreset/XP changé. Tests sérialisation/reload, offlinecharge et cloudmock.

QA responsive et console : voir qa-output/v015-phase2-browser.json et captures QA. Tailles320×844,390×844,768×1024,1440×900 ; pages/effets nouveaux contrôlés, aucune retouche artwork/HUD. Duel en preview uniquement ; SQL non déployé. Tests HTTP locaux seulement, pas de backendmutations.

## AC. Tests

Tests complets, lint --max-warnings0, tsc -b --pretty false, build client/PWA + build Duel Edge et git diff --check : résultats de la dernière passe technique consignés dans qa-output/v015-phase2-validation.json. Warning chunk>500kB connu, aucune refonte bundle. Assertions simulation : new account, welcome once, no inherited gear=true; advanced loadouts restored and normalized without loss=true; all XP sources retain level10 xp0 and boss receipts are unique=true; badge reward once; Némésis predicate repaired=true; cloud monotonic receipts reject a regressive new-save snapshot=true.

Commandes reproductibles :

`pnpm exec node scripts/audit-v015-phase2-loop.mjs --runs=128 --days=60 --trials=1000`

`pnpm exec node scripts/audit-v015-phase2-personal.mjs --runs=64`

`pnpm exec node scripts/report-v015-phase2.mjs`

## AD. Files changed

État local à la génération (comprend les5fichiers Phase1 préexistants, conservés) :

```
M src/App.tsx
 M src/admin.ts
 M src/badgeSystem.test.tsx
 M src/badgeSystem.ts
 M src/campaignProgression.ts
 M src/cloudSave.ts
 M src/combatReserves.ts
 M src/components/ChestPage.tsx
 M src/components/DuelPage.tsx
 M src/components/ExpeditionPage.tsx
 M src/components/RiftPage.tsx
 M src/config.ts
 M src/data.ts
 M src/duelClient.test.ts
 M src/duelClient.ts
 M src/duelRules.test.ts
 M src/duelRules.ts
 M src/expedition.test.tsx
 M src/expedition.ts
 M src/expeditionBalance.ts
 M src/game.ts
 M src/nemesisCampaign.test.ts
 M src/nemesisCampaign.ts
 M src/rift.test.ts
 M src/rift.ts
 M src/riftBalance.ts
 M src/storage.ts
 M src/styles.css
 M src/types.ts
 M src/v014Economy.test.tsx
 M src/warriorProgression.test.ts
 M supabase/functions/duel/engine.js
 M supabase/functions/duel/index.ts
?? docs/v015-global-loop-audit.md
?? docs/v015-phase2-final.md
?? scripts/audit-v015-global-loop.mjs
?? scripts/audit-v015-personal-clears.mjs
?? scripts/audit-v015-phase2-loop.mjs
?? scripts/audit-v015-phase2-personal.mjs
?? scripts/audit-v015-sensitivities.mjs
?? scripts/calibrate-v015-equipment.mjs
?? scripts/calibrate-v015-rarity.mjs
?? scripts/report-v015-global-loop.mjs
?? scripts/report-v015-phase2.mjs
?? src/equipmentRecycle.ts
?? src/qa/
?? src/v015Phase2.test.tsx
?? supabase/migrations/202610050005_v015_daily_duel.sql
```

Principaux : storage/types/cloudSave=migration+monotonic ; nemesisCampaign/campaignProgression=personal+XP+accountreceipts ; equipmentRecycle/App/CSS=action manuelle ; expedition/rift/game/Duel/Chest=XP réelle ; balances/data=recalibrage ; badgeSystem=predicate/receipts ; SQL005/index/engine=dailyserver ; tests/QA/scripts/rapport=preuves. Aucun PNG, artwork, sprites ni migration1–4 modifié.

## AE. Backend actions required — APRÈS validation humaine seulement

1. **Ne pas déployer cette passe tant que l’arbitrage rareté et les réserves sont ouverts.** Tester SQL dans un environnement Supabase de test, notamment11eDuel,idempotence,2devices,midnight/DST,CAS/retry.
2. Suspendre temporairement les Duels pendant la bascule coordonnée ; empêcher l’ancien Edge de finaliser entre migration et redeploy. Ne pas toucher auth/RLS/config secrets.
3. Après migrations0001→0004 existantes, appliquer UNIQUEMENT nouvelle `supabase/migrations/202610050005_v015_daily_duel.sql` (une fois, transaction). Ne pas rejouer les historiques.
4. Déployer ensemble `supabase/functions/duel/index.ts` et `supabase/functions/duel/engine.js` régénéré par build:duel-edge. Conserver vérification JWT actuelle/getUser, mêmes variables SUPABASE_URL/public/serviceRole, aucun secret VITE.
5. Frontend correspondant seulement ensuite, vérifier state.limitRule=daily-v015/resetAt/10max puis rouvrir Duel. Si déploiement partiel, le frontend échoue fermé sur état backend ancien plutôt que d’annoncer fausse limite.

Rien de cela n’a été effectué par l’agent. Aucun changement remote/config/secret/publication.

## AF. Human validation checklist (10)

1. Arbitrer raretéN5 vs mursPvE ; V0.15 ne peut pas être clôturée avec ce point non satisfait.
2. Fixture nouveau/welcome15charges puis Adventure ; comparer Hub/Collection/combatstats.
3. Nouveau Warrior tardif :XPfirstpersonalequal table,0lotcompte ; replay5/10 ; reload.
4. Boss déjà globalement fini : aucun1500+10W ni2500+3R répété.
5. Dernier exemplaire équipement protégé ; qty+gain+reste ; presets restaurés aprèschangementWarrior.
6. N9finproche/N10 : XP créditéepartielle puis0, aucune XP fantôme aux4activités/coffre.
7. Exp23h36 :3recherches etwarning ;24h :4 ; Warrior immobilisécommeavant.
8. Némésisbadge et Panthéon1500/legacy1300, reçusuniquescloud/reload.
9. Faille/Morgath : taux/variance et builds ; juger trèsearlyFaille et budgetW/E.
10. En backend TEST après approbation :10Duels puisblocage,mêmeUUID,multidevice,minuitParis,DST ; préserverJWT/CAS/RLS.

## URLs locales

Normal : http://127.0.0.1:5173/

Admin : http://127.0.0.1:5173/?admin

Nouveau : http://127.0.0.1:5173/?admin&v015Qa=new

Personal : http://127.0.0.1:5173/?admin&v015Qa=personal

Recycle : http://127.0.0.1:5173/?admin&v015Qa=recycle

Avancé : http://127.0.0.1:5173/?admin&v015Qa=advanced

Duel local sans backend : http://127.0.0.1:5173/?admin&duelPreview

Faille : http://127.0.0.1:5173/?admin&riftPreview&qaWarrior=karg&qaLevel=10

Morgath Normal : http://127.0.0.1:5173/?admin&normalBossPreview&qaWarrior=karg&qaLevel=10

Morgath Némésis : http://127.0.0.1:5173/?admin&nemesisBossPreview&qaWarrior=karg&qaLevel=10

Serveur laissé actif. Aucun git add/commit/push/branche/stash/reset/checkout destructif/remote change. Aucun déploiement.
