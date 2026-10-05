/** Reproduce the decision report from the final measured runtime, not hand-entered win rates. */
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const read=n=>JSON.parse(readFileSync(`qa-output/${n}.json`,'utf8'))
const r=read('v015-phase2-loop'), late=read('v015-phase2-personal')
// Export cleanup only: discard copied Phase1 hypothetical XP tables, never career/matrix measurements.
if ('personal' in r || 'personalGrind' in r) {
  delete r.personal; delete r.personalGrind
  writeFileSync('qa-output/v015-phase2-loop.json',JSON.stringify(r,null,2))
  writeFileSync('qa-output/v015-phase2-summary.json',JSON.stringify({...r,careers:undefined,meta:{...r.meta,sourceHashes:undefined}},null,2))
}
const probe=read('v015-rarity-constraint-probe')
// Optional local runtime override; never changes the Git repository.
const git=process.env.CHRONOS_QA_GIT??'git'
const changed=execFileSync(git,['status','--short'],{encoding:'utf8'}).trim()
const f=n=>n===null||n===undefined?'—':Number(n).toFixed(2).replace(/\.00$/,'')
const avg=a=>a.reduce((s,x)=>s+x,0)/a.length
const table=(head,rows)=>`| ${head.join(' | ')} |\n| ${head.map(()=>'---').join(' | ')} |\n${rows.map(row=>`| ${row.join(' | ')} |`).join('\n')}`
const group=(p,s)=>r.groups[Object.keys(r.groups).find(k=>k.startsWith(`${p}|${s}|`))]
const milestone=(p,s,k='level10')=>{const d=group(p,s).milestones[k];return `${f(d.median)} [${f(d.p10)}–${f(d.p90)}] ; ${d.observed}/${d.total}`}
const cases=Object.entries(r.groups)
const normalFirst=[120,180,250,300,450,180,200,220,250,550,150,175,200,225,650,150,175,200,250,500]
const nemesisFirst=[180,220,260,300,550,240,280,320,360,700,300,340,380,420,850,360,400,440,480,1000]
const quality=(mode,level,gear)=>r.quality.filter(x=>x.mode===mode&&x.level===level&&x.gear===gear)
const rate=(mode,level,gear)=>f(avg(quality(mode,level,gear).map(x=>x.winRate)))
const kit={none:'aucun',common:'Massue + Peaux',medium:'Marteau + Carapace',good:'Griffe + Fourrure blanche',endgame:'Cœur + Peau'}
const buildTable=Object.entries(r.multiBuilds).flatMap(([id,profiles])=>Object.entries(profiles).flatMap(([profile,rows])=>rows.slice(0,5).map((v,i)=>[id,profile,i+1,v.weapon,v.armor,`${f(v.winRate)} %`])))
const topFamilies=[...new Set(Object.values(r.multiBuilds).flatMap(ps=>Object.values(ps).map(rs=>`${rs[0].weapon} / ${rs[0].armor}`)))]
// Installed economy: isolate daily sources and subtract first-clear / milestone jackpots.
const cs=r.careers.filter(c=>c.profile==='regular'&&c.strategy==='A-warrior')
const snap=(c,d)=>c.snapshots.find(s=>s.day===d)
const dMetric=k=>avg(cs.map(c=>(snap(c,60).metrics[k]-snap(c,30).metrics[k])/30))
const dCoins=k=>avg(cs.map(c=>(snap(c,60).sources[k].coins-snap(c,30).sources[k].coins)/30))
const clears=(c,d,mode)=>{const s=snap(c,d),node=mode==='normal'?s.normalNode:s.nemesisNode;return node?node-1+(c.milestones[mode==='normal'?'normalWin':'nemesisWin']&&c.milestones[mode==='normal'?'normalWin':'nemesisWin']<=d?1:0):0}
const oneShotFirst=avg(cs.map(c=>(20*(clears(c,60,'normal')-clears(c,30,'normal'))+50*(clears(c,60,'nemesis')-clears(c,30,'nemesis')))/30))
const expectedRefund=.70*20+.22*40+.07*80+.0085*150+.0014*200+.0001*250
const paid=dMetric('warriorPaid'), grossOneShot=dCoins('boss')+dCoins('badges')+oneShotFirst
// Analytical correction, not a second observed career: refunds induced by removed jackpot spending are removed too.
const freeBossRefund=avg(cs.map(c=>c.milestones.normalWin>30&&c.milestones.normalWin<=60?10*expectedRefund/30:0))
const installedEstimate=paid-(grossOneShot+freeBossRefund)/(100-expectedRefund)
const sourceTable=Object.keys(snap(cs[0],60).sources).map(k=>[k,f(dCoins(k))])
const allStats=r.warriors.flatMap(w=>w.statsByLevel.map((s,i)=>[w.name,w.warriorClass,w.rarity,i+1,s.strength,s.dodge,s.speed,s.hp]))
const totalReturn=avg(cs.map(c=>snap(c,60).coins)), maxActions=Math.max(...r.rngRows.map(x=>x.attackActions.p90))
let out=`# CHRONOS AGE WARRIORS — V0.15 Phase 2

Rapport local du 5 octobre 2026. **Passe fonctionnelle et calibration mesurées ; V0.15 NON CLÔTURABLE en l’état.**
La cible Common N10 contre raretés N5 reste non atteinte. Arbitrage demandé avant de déplacer les murs PvE ou de changer la philosophie des courbes. Aucun déploiement, aucun Git write. Les taux ci-dessous sont des simulations, pas de la télémétrie.

## A. Executive summary

Progression active renforcée, Expédition XP réduite, cap Adventure 15, personal first-clear par Warrior, recyclage manuel et reçus XP réels implémentés. Duel quotidien préparé côté SQL/Edge, non appliqué à Supabase. Builds spécialisés désormais mesurés ; art/HUD/sprites/passifs/ennemis inchangés.

Régulier équilibré : N10 ${milestone('regular','C-balanced')} jours ; sans Expédition ${milestone('regular','H-no-expedition')}. Les intervalles sont P10–P90, le compteur est observé/total. Rareté N5 : pas validée. SQL : inspection et contrat statique seulement, pas une validation PostgreSQL.

## B. Implemented decisions

- Save v6, anciennes v2–v5 acceptées ; clés de stockage conservées.
- Personal clear Warrior/mode/node ; carte globale ; XP personnelle seule sur ancien niveau.
- Cap 15, recharge inchangée 20 min. Duel 10/jour Paris, pas de recharge minute.
- Replays 5 XP/5 pièces Normal, 10/10 Némésis. Défaites 4/10 XP, 0 pièce.
- Expédition 300 XP / 50 pièces par 24 h ; Faille 20 pièces par victoire ; Duel victoire 20 XP/10 pièces, défaite 4/0. XP toujours plafonnée réellement.
- Recyclage équipement manuel, quantité validée, dernier exemplaire et presets conservés.
- Panthéon des 12 Warriors 1500 ; Némésis predicate corrigé. Prix/odds/refunds Warrior inchangés.

## C. XP / progression changes

Courbe inchangée : ${r.xpRequirements.join(', ')} ; total 6850. Pas de multiplicateur, catch-up, bonus rareté ni boost selon le main.

${table(['Niveau Adventure','Normal first-clear XP','Némésis first-clear XP','Coins première victoire globale Normal / Némésis'],normalFirst.map((v,i)=>[i+1,v,nemesisFirst[i],'20 / 50']))}

Total Normal ${normalFirst.reduce((a,b)=>a+b,0)}, Némésis ${nemesisFirst.reduce((a,b)=>a+b,0)}. Un clear Normal seul ne donne pas N10 ; la faisabilité des victoires reste liée aux stats/loadout. Personal first-clear sur niveau globalement terminé : 0 pièce et aucun lot compte.

## D. First level 10

Phase 1 équilibré : casual ~10, régulier ~9, actif ~8 jours. Phase 2 :

${table(['Profil','Stratégie','N10 médian [P10–P90] ; observés','Morgath Normal','Morgath Némésis'],cases.map(([k,g])=>{const [p,s]=k.split('|');return [p,s,milestone(p,s),milestone(p,s,'normalWin'),milestone(p,s,'nemesisWin')]}))}

${r.meta.careers} carrières × ${r.meta.days} jours, ${r.meta.runs}/cellule ; casual 8 min/1 session, régulier 24 min/1 session, actif 60 min/3 sessions. A Warrior, B équipement, C équilibré, D main/retours fréquents, E collection/secondaire, F sans Duel, G sans Faille, H sans Expédition ; compléments budget 75/25. Graines : ${r.meta.seed}; multi-builds 8119001+i×97, ${r.meta.trials} graines/cellule. Combats moteur : ${r.meta.battles.toLocaleString('fr-FR')}.

Sessions/planning/choix des builds sont des hypothèses analytiques. Duel simule des adversaires indépendants à même niveau/loadout tirés selon roster, pas de bots/comptes créés ni population réelle. Non-finis restent censurés à 60 jours ; médianes de victoire conditionnelles aux observés, ne pas les lire comme victoire garantie pour tous.

## E. Expedition

600 → 300 XP. 350 → 50 pièces, changement séparé justifié par l’économie (S). Avec C équilibré ${milestone('regular','C-balanced')}, sans H ${milestone('regular','H-no-expedition')}; sans Duel F ${milestone('regular','F-no-duel')}; sans Faille G ${milestone('regular','G-no-rift')}.

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

${late.careers} parcours, 64/cellule, Karg/Naya/Urgath/Tyrak, commun et moyen ; compte Asha8 inchangé. Graines ${late.seed}. Normal5/10/15/20 × Némésis0/5/20. Lorsqu’il y a déjà Némésis, le compte a forcément terminé Normal20 : opportunités Normal20 dans cette fixture, pas un saut de carte.

${table(['Warrior','Gear','Normal annoncé','Némésis globale','XP personnelle théorique disponible','Combats médians N3 / N5 / N7 / N10'],late.rows.map(x=>[x.warrior,x.gear,x.availableNodes,x.nemesisNodes,x.theoreticalXp,[3,5,7,10].map(l=>x.medianCombats[l]).join(' / ')]))}

Une charge par combat. Bas niveau : opportunités ne sont pas garanties accessibles en puissance. Algorithme : tenter un niveau personnel avec chance estimée ≥20 %, après 2 échecs farm1 par bloc de 15 ; aucune XP externe. Recharge analytique 20 min/essai, pas temps de joueur observé. Les 6144 assertions conservent main/progression globale/lots ; chaque parcours arrive N10 dans ≤2500 combats. La table complète contient XP effectivement reçue et chaque tentative, pas seulement le plafond théorique.

## J. Rarity vs level — NON VALIDÉ

${table(['Gauche','Rareté','Niveau','Droite','Rareté','Niveau','Gear comparable','Victoire gauche %'],r.matchups.map(x=>[x.left,x.leftRarity,x.leftLevel,x.right,x.rightRarity,x.rightLevel,x.gear,x.winRate]))}

Tables Warriors conservées pour ne pas casser V0.14.1. Le test Common10 contre N5 reste loin des cibles 25–35 / 10–20 / 5–10. Un candidat explicite, non appliqué, a atteint environ 30,25 / 12,45 / 7,08 % mais, en propageant ses stats de façon monotone jusqu’à N9, les cas Vorka/Urgath/Tyrak ont gagné Morgath N9 environ 84,9 / 95,7 / 96,5 %. Ce probe ne prouve PAS qu’aucune autre solution n’existe ; il démontre que ce candidat casse le mur validé. Résultats bruts : v015-rarity-constraint-probe.json.

**Arbitrage restant : préserver les murs PvE actuels et assouplir les cibles N5, ou prioriser les cibles N5 en autorisant une recalibration conjointe plus large des courbes et PvE. Aucun multiplicateur opaque ajouté. Ne pas annoncer V0.15 terminée.**

## K. Final Warrior stats / modifiers

Aucun changement des 12 tables, classes, raretés, 36 passifs ou modificateurs d’ennemis. getEffectiveWarriorStats demeure la source unique ; equipment.stats n’est additionné qu’une fois. Tables exactes, hors équipement :

${table(['Warrior','Classe','Rareté','Niveau','Force','Esquive','Vitesse','PV'],allStats)}

## L. Morgath Normal

${table(['Warrior','N9 endgame','N10 moyen','N10 bon','N10 endgame'],r.warriors.map(w=>[w.name,...[[9,'endgame'],[10,'medium'],[10,'good'],[10,'endgame']].map(([l,g])=>quality('normal',l,g).find(x=>x.warrior===w.id).winRate+' %')]))}

Moyennes : N9 ${rate('normal',9,'endgame')} %, N10 moyen ${rate('normal',10,'medium')} %, bon ${rate('normal',10,'good')} %, endgame ${rate('normal',10,'endgame')} %. Kits : ${Object.entries(kit).map(([a,b])=>a+'='+b).join('; ')}. V0.14 tests conservés, pas de niveau minimum ni gear score ; carte et ennemis fixes.

## M. Morgath Némésis

${table(['Warrior','N10 moyen','N10 bon','N10 endgame'],r.warriors.map(w=>[w.name,...['medium','good','endgame'].map(g=>quality('nemesis',10,g).find(x=>x.warrior===w.id).winRate+' %')]))}

Moyennes ${rate('nemesis',10,'medium')} / ${rate('nemesis',10,'good')} / ${rate('nemesis',10,'endgame')} %. Identités, carte, ordre, switch libre et RNG préservés ; pas de pity Adventure. Même seeds permettent comparaison appariée.

## N. Rift early game

${table(['Warrior','Niveau','Gear','C1 gagné %','Full clear %','XP moyenne réelle'],r.riftRows.filter(x=>x.level<10).map(x=>[x.warrior,x.level,x.gear,x.reachWinPct[0],x.fullClearPct,x.xpMean]))}

Pleine difficulté, chaque rencontre HP restaurés comme le moteur. N1/N2 ne reçoivent pas de gratuité ; plusieurs N3 restent sévèrement limités. Pity caché conservé dans carrières, aucune UI/difficulté réduite. L’accessibilité très early reste une réserve de game design si le profil ci-dessus est jugé trop sévère ; aucune nouvelle barrière introduite.

## O. Rift endgame

${table(['Warrior','N10 bon full clear %','N10 endgame full clear %'],r.warriors.map(w=>[w.name,...['good','endgame'].map(g=>r.riftRows.find(x=>x.warrior===w.id&&x.level===10&&x.gear===g).fullClearPct)]))}

Moyenne endgame ${f(avg(r.riftRows.filter(x=>x.level===10&&x.gear==='endgame').map(x=>x.fullClearPct)))} %, Phase1 85,06 %. Difficultés/pity/lineup inchangés. Coins 40→20 par victoire pour l’économie, XP40 inchangée mais réellement plafonnée ; coffre Faille final conservé.

## P. Equipment rebalance

Javelot : Force30→65, Vitesse20→45, Esquive8→16. Griffe : Force55→75, Vitesse14 conservée. Garde Ancêtres : PV260→440, Esquive20 conservée, Vitesse12→32. Peau mythique finalement conservée PV650/Esquive25 : candidat PV550/Esquive40/Vitesse8 rejeté (test MorgathN9 max10,5 %). Fourrure Force25 et Griffe85 rejetées (bon kit trop puissant). Aucun effet/passif moteur changé. Les autres 17 objets et les quantités/niveaux/XP sont conservés.

${table(['ID','Type','Rareté','Stats N1','Effet'],r.equipment.map(e=>[e.id,e.type,e.rarity,JSON.stringify(e.stats),e.effect]))}

Les bonus équipements ne sont pas multipliés par le niveau de l’équipement dans ce système V1 : progression legacy conservée, pas de nouvelle mécanique ajoutée.

## Q. Build diversity

12 Warriors ×100 paires ×4 profils ×${r.meta.trials} seeds = ${12*100*4*r.meta.trials} combats pour cette matrice. Boss réel Morgath Némésis ; profils synthétiques explicites, non ennemis modifiés : rapide F160/E35/V115/PV1800 ; tank F170/E12/V38/PV2900 ; dodge F160/E120/V70/PV1750. Niveau10, équipement comparable N1.

Familles top1 observées (${topFamilies.length}) : ${topFamilies.join('; ')}. Écarts de ~1–2 points peuvent être du bruit d’échantillonnage, pas une domination certaine. Le Cœur reste très fort ; ne pas prétendre toutes les armes viables. Top5 par Warrior ET matchup :

${table(['Warrior','Matchup','Rang','Arme','Armure','Victoire'],buildTable)}

RNG : blocs de50, streaks/crit/esquives/HP/actions dans JSON. P90 max d’actions dans les cas RNG mesurés ${maxActions}; moteur conserve sa borne60 tours. Aucun nouveau proc récursif, dodge cap ou effet invincible. Matrices difficiles évitent le faux classement où tout gagne100 %.

## R. Equipment recycle

Commun3, Peu commun5, Rare8, Épique12, Légendaire18, Mythique24 pièces par exemplaire. Manuel, qty entière1..owned−1, quote inclut gain/remain ; confirmation attend quantité initiale + equipmentRecycleSequence suivant. Stale/double confirmation = no-op. Aucun équipement de dernier exemplaire vendu, aucun preset invalidé, aucune XP ajoutée par cette action. Doublons de coffre continuent leur système XP équipement existant ; pas d’autovente ajoutée.

Chaque remboursement <25. Retour normal pondéré ~${f(.63*3+.27*5+.085*8+.0135*12+.0014*18+.0001*24)} pièces <prix25 : boucle déficitaire même catalogue entièrement possédé. La carrière analytique choisit explicitement de recycler les surplus, ce n’est pas du runtime automatique.

## S. Economy

Itérations : I1 maintenait Exp350 ; I2 (240 carrières/30j) focusW observé11,74 coffres/j pendant14→30 incluant jackpots ; I3 Exp100/Rift25/Duel10 encore8,5 incluant jackpots ; candidat final Exp50/Rift20/Duel10. XP/loot/prix isolés du coin tuning. Les jackpots1500/2500 et les10W/3R n’ont pas été réduits.

Régulier A focusWarrior, fenêtre jours31–60 : achats payants réellement simulés ${f(paid)}/jour (INCLUT jackpots), Warrior gratuits ${f(dMetric('warriorFree'))}/jour, équipement gratuits ${f(dMetric('equipmentFree'))}, Faille ${f(dMetric('riftChests'))}. Solde moyen J60 ${f(totalReturn)}.

${table(['Source','Pièces/jour fenêtre31–60'],sourceTable)}

Pour éviter de confondre ce flux avec un régime sans jackpots : première victoire globale ${f(oneShotFirst)}/jour, Boss+badges ${f(dCoins('boss')+dCoins('badges'))}/jour, refund attendu d’un tirage W catalogue possédé ${f(expectedRefund)} (coût net ${f(100-expectedRefund)}). En retirant ces jackpots ET le remboursement induit par leurs achats + celui des10W Boss gratuits : capacité installée analytique corrigée **${f(installedEstimate)} payants/jour**. Ce chiffre est une correction comptable à rendement moyen, pas une seconde simulation entièrement sans milestones ; les refunds Faille/Exp récurrents restent légitimes. Ne pas prétendre une garantie quotidienne ou tous les12Warriors possédés dèsJ1.

Budget 50/50 et 75/25 explicitement simulés : allocation cumulative, aucune monnaie rajoutée. Payer équipements réduit les coffres Warrior ; table métriques suivante. Pas de bots pour fournir revenu Duel.

## T. Chest flow

W100 ; E25 ; E×10=250. W odds70/22/7/0,85/0,14/0,01 %. E63/27/8,5/1,35/0,14/0,01 %. Faille5/15/40/28/10/2 %. Warrior recycle20+25XP /40+40 /80+75 /150+125 /200+200 /250+350 inchangé, XP effective plafonnée.

${table(['Profil','Stratégie','Jour','W payants','E payants','W gratuits','Rift chests','Uniques W','Uniques E','Doublons W','Doublons E','E recyclés','Pièces E recycle','Adventure node','Némésis node','Coins'],r.careers.filter(c=>c.seed===1500001).flatMap(c=>[14,30,60].map(d=>{const s=snap(c,d),m=s.metrics;return[c.profile,c.strategy,d,m.warriorPaid,m.equipmentPaid,m.warriorFree,m.riftChests,s.warriors,s.equipment,m.duplicates,m.equipmentDuplicates,m.equipmentRecycled,m.equipmentRecycleCoins,s.normalNode,s.nemesisNode,s.coins]})))}

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

Tests complets, lint --max-warnings0, tsc -b --pretty false, build client/PWA + build Duel Edge et git diff --check : résultats de la dernière passe technique consignés dans qa-output/v015-phase2-validation.json. Warning chunk>500kB connu, aucune refonte bundle. Assertions simulation : ${r.assertions.map(x=>x.name+'='+x.passed).join('; ')}.

Commandes reproductibles :

\`pnpm exec node scripts/audit-v015-phase2-loop.mjs --runs=128 --days=60 --trials=1000\`

\`pnpm exec node scripts/audit-v015-phase2-personal.mjs --runs=64\`

\`pnpm exec node scripts/report-v015-phase2.mjs\`

## AD. Files changed

État local à la génération (comprend les5fichiers Phase1 préexistants, conservés) :

\`\`\`
${changed}
\`\`\`

Principaux : storage/types/cloudSave=migration+monotonic ; nemesisCampaign/campaignProgression=personal+XP+accountreceipts ; equipmentRecycle/App/CSS=action manuelle ; expedition/rift/game/Duel/Chest=XP réelle ; balances/data=recalibrage ; badgeSystem=predicate/receipts ; SQL005/index/engine=dailyserver ; tests/QA/scripts/rapport=preuves. Aucun PNG, artwork, sprites ni migration1–4 modifié.

## AE. Backend actions required — APRÈS validation humaine seulement

1. **Ne pas déployer cette passe tant que l’arbitrage rareté et les réserves sont ouverts.** Tester SQL dans un environnement Supabase de test, notamment11eDuel,idempotence,2devices,midnight/DST,CAS/retry.
2. Suspendre temporairement les Duels pendant la bascule coordonnée ; empêcher l’ancien Edge de finaliser entre migration et redeploy. Ne pas toucher auth/RLS/config secrets.
3. Après migrations0001→0004 existantes, appliquer UNIQUEMENT nouvelle \`supabase/migrations/202610050005_v015_daily_duel.sql\` (une fois, transaction). Ne pas rejouer les historiques.
4. Déployer ensemble \`supabase/functions/duel/index.ts\` et \`supabase/functions/duel/engine.js\` régénéré par build:duel-edge. Conserver vérification JWT actuelle/getUser, mêmes variables SUPABASE_URL/public/serviceRole, aucun secret VITE.
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
`
// Keep the probe in the report's reproducible input contract, even when not applied.
if (!probe) throw new Error('Rarity probe missing')
writeFileSync('docs/v015-phase2-final.md',out)
writeFileSync('qa-output/v015-phase2-decision-metrics.json',JSON.stringify({careers:r.meta.careers,battles:r.meta.battles,lateCareers:late.careers,topFamilies,paidPerDay:paid,installedAnalytical:installedEstimate,expectedRefund,oneShotFirst,grossOneShot,freeBossRefund},null,2))
console.log('docs/v015-phase2-final.md generated; unmet rarity explicitly retained.')
