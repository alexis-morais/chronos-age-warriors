// Rebuild the final report from measured artifacts; keep Phase 2 history intact.
import { readFileSync, writeFileSync } from 'node:fs'
const read=p=>JSON.parse(readFileSync(p,'utf8'))
const d=read('qa-output/v015-final-calibration.json'),c=read('qa-output/v015-final-summary.json'),e=read('qa-output/v015-independent-economy.json'),v=read('qa-output/v015-final-validation.json')
const avg=a=>a.reduce((s,n)=>s+n,0)/a.length,f=n=>Number.isFinite(n)?n.toFixed(2):'—'
const table=(h,rows)=>`| ${h.join(' | ')} |\n| ${h.map(()=>'---').join(' | ')} |\n${rows.map(r=>`| ${r.join(' | ')} |`).join('\n')}\n`
const rarities=['Commun','Peu commun','Rare','Épique','Légendaire','Mythique']
const kit={none:'Aucun',common:'Massue + Peaux',medium:'Marteau + Carapace',good:'Griffe + Fourrure blanche',endgame:'Cœur + Peau'}
const group=(rarity,rows)=>rows.filter(x=>x.rarity===rarity)
const dist=a=>a.length?`${f(avg(a))} [${f(Math.min(...a))}–${f(Math.max(...a))}]`:'—'
const ms=(profile,strategy,key='level10')=>c.groups[`${profile}|${strategy}|{"duelDaily":true}`]?.milestones[key]
const milestone=(profile,strategy,key='level10')=>{const x=ms(profile,strategy,key);return x?`${x.median} [${x.p10}–${x.p90}] (${x.observed}/${x.total})`:'—'}
const families=[...new Set(Object.values(d.buildRanks).flatMap(p=>Object.values(p).map(r=>`${r[0].weapon} / ${r[0].armor}`)))]
const rarityResults=rarities.slice(3).map(r=>{const x=d.matchups.filter(x=>x.leftRarity==='Commun'&&x.leftLevel===10&&x.rightRarity===r&&x.rightLevel===5&&x.gear==='none');return {rarity:r,before:avg(x.map(x=>x.before)),after:avg(x.map(x=>x.after))}})
const endRift=avg(d.riftRows.filter(x=>x.level===10&&x.gear==='endgame').map(x=>x.fullClear))
const commonNormal=d.bosses.filter(x=>x.rarity==='Commun'&&x.level===10&&x.gear==='good'&&x.mode==='normal').map(x=>x.rate)
const targetEconomy=e.groups['good|warrior'].mean.warriorChests
const ready=ms('regular','C-balanced').median>=5&&ms('regular','C-balanced').median<=7&&ms('regular','H-no-expedition').median>=7&&ms('regular','H-no-expedition').median<=10&&rarityResults.every(r=>r.after>5&&r.after<50)&&Math.min(...commonNormal)>20&&endRift>=80&&endRift<=90&&families.length>=3&&targetEconomy>=4&&targetEconomy<=5&&v.commands.every(x=>x.exit===0)
const verdict=ready?'V0.15 READY TO CLOSE':'V0.15 NOT READY TO CLOSE'
const tuple=s=>Array.isArray(s)?s.join(' / '):[s.strength,s.dodge,s.speed,s.hp].join(' / ')
const wallRows=d.warriors.map(w=>[w.id,w.rarity,...[5,10,15,20].map(node=>{
  const gear=node===20?'good':'common',threshold=node===20?20:60
  const row=d.walls.filter(x=>x.id===w.id&&x.node===node&&x.gear===gear&&x.rate>=threshold).sort((a,b)=>a.level-b.level)[0]
  return row?`N${row.level} (${f(row.rate)} %)`:'Non atteint N1–10'
})])
const matrices=d.matchups.map(x=>[x.left,x.leftLevel,x.right,x.rightLevel,kit[x.gear],f(x.before),f(x.after),x.trials])
const bossAtTen=mode=>d.warriors.map(w=>[w.id,w.rarity,...['none','medium','good','endgame'].map(g=>f(d.bosses.find(x=>x.id===w.id&&x.level===10&&x.gear===g&&x.mode===mode).rate))])
const bossByRarity=(mode,levels)=>rarities.flatMap(r=>levels.flatMap(l=>['medium','good','endgame'].map(g=>[r,l,kit[g],dist(group(r,d.bosses.filter(x=>x.mode===mode&&x.level===l&&x.gear===g)).map(x=>x.rate))])))
const riftEndRows=d.warriors.map(w=>[w.id,w.rarity,...[[7,'good'],[10,'good'],[10,'endgame']].map(([l,g])=>f(d.riftRows.find(x=>x.id===w.id&&x.level===l&&x.gear===g).fullClear))])
let out=`# CHRONOS AGE WARRIORS — V0.15 Final calibration

**${verdict}**, pour validation humaine locale. Aucune publication ni opération Git d’écriture. Le backend préparé reste non appliqué ; son test d’intégration et sa bascule restent à effectuer après approbation. Les statistiques ci-dessous sont des simulations, pas de la télémétrie ni une certification Supabase.

Le rapport [Phase 2](v015-phase2-final.md) reste intact comme historique. Cette passe remplace son arbitrage bloquant par la philosophie rareté-first explicitement choisie. Aucun travail V0.16, art, sprite, HUD, odds, équipement ou passif modifié.

## A. Philosophie finale

La rareté donne de la puissance visible et une progression PvE plus précoce. Les niveaux, équipements et passifs restent déterminants ; aucun multiplicateur de dégâts caché, condition par adversaire ou difficulté dépendant de la rareté. Les anciens objectifs PvP précis et l’interdiction universelle de Morgath avant N10 ne sont plus des critères. Un Common bien préparé reste viable.

${table(['Common N10 contre','Avant % Common','Après % Common'],rarityResults.map(x=>[`${x.rarity} N5`,f(x.before),f(x.after)]))}

Résultats sans équipement, moyenne non pondérée des 4 Common ; ${d.meta.major} graines par paire. Les trois tiers supérieurs ne contiennent actuellement qu’un Warrior chacun : Épique = Vorka, Légendaire = Urgath, Mythique = Tyrak. Les matchups de classes restent réels. On ne peut pas déduire un classement absolu de toutes les classes à partir de la seule rareté.

## B. Stats / progression exactes

Common : les 40 tuples Phase 2 restent identiques. N1 des 12 Warriors inchangé. Les autres tiers interpolent entre leur propre N1 et leur propre plafond N10 ; seul le budget Force/PV du plafond augmente. Esquive/Vitesse finales, identités/classes, passifs et équipements restent identiques. Formule : end = arrondi(anchorN10 × budget pour Force/PV, anchorN10 sinon), statN = arrondi(start + (end − start) × growth[N − 1]). Aucune référence à l’ennemi ou au mode. Les niveaux 5→10 continuent à augmenter les stats et débloquent les passifs 7/10 ; ils ne sont pas remplacés par un boost d’acquisition.

${table(['Rareté','Budget Force/PV N10 vsPhase2','Fractions de croissance N1→10'],Object.entries(d.profiles).map(([r,p])=>[r,p.forceHpBudget,p.growth.join(' · ')]))}

Toutes les valeurs dans l’ordre **Force / Esquive / Vitesse / PV** :

${table(['Warrior','Rareté','Niveau','Avant Phase2','Après final'],d.warriors.flatMap(w=>w.after.map((s,i)=>[w.id,w.rarity,i+1,tuple(w.before[i]),tuple(s)])))}

XP inchangée : 120/180/300/450/650/850/1100/1400/1800 ; cumul 6850. Prix, RNG, chances Mythique normal 0,01 % / Faille 2 % et récompenses Phase 2 conservés ; aucune pity nouvelle. Le seul budget ennemi retouché est C1 Faille, section H.

## C. Matrice rareté vs niveau

${table(['Gauche','N','Droite','N','Kit égal','Avant %gauche','Après %gauche','Graines'],matrices.filter((_,i)=>d.matchups[i].leftLevel!==d.matchups[i].rightLevel))}

## D. Même niveau / identité

${table(['Gauche','N','Droite','N','Kit égal','Avant %gauche','Après %gauche','Graines'],matrices.filter((_,i)=>d.matchups[i].leftLevel===d.matchups[i].rightLevel))}

Même rareté :

${table(['Gauche','Droite','Niveau','% victoire gauche'],d.sameRarity.map(x=>[x.left,x.right,x.level,f(x.rate)]))}

Une défaite Common N5 contre un Mythique N5 est parfois presque certaine dans l’échantillon : cela ne signifie pas que toutes les confrontations le sont. Le test décisif Common N10 / Mythique N5 conserve des renversements ; le kit et les matchups déplacent les résultats. Incertitude par cellule de 5000 : environ ±1,39 point à 50 %, intervalle binomial à 95 % ; les moyennes de plusieurs classes ne représentent pas une population de matchmaking.

## E. Murs Adventure fixes

Première estimation confortable ≥60 % sur les nodes 5/10/15 avec **kit Common** ; Morgath réaliste ≥20 % avec **kit good**. Ce changement de kit au node 20 est explicite : on ne prétend pas qu’un Tyrak N4 sans équipement termine Primal. Les niveaux sont discrets, pas des verrous codés. ${d.meta.trials} graines par cellule PvE.

${table(['Warrior','Rareté','Niveau5','Niveau10','Niveau15','Morgath20'],wallRows)}

Les 20 ennemis Normal et Némésis n’ont pas changé. Tyrak N1 nu ne bat pas Morgath dans les 1000 graines ; Urgath N3 avec kit Common ne trivialise pas Morgath. Un Mythique N5 bien équipé peut avancer plus tôt : conséquence volontaire du choix rareté-first, pas un bug compensé par scaling.

## F. Morgath Normal

N10 par Warrior / préparation :

${table(['Warrior','Rareté','Aucun','Moyen','Bon','Endgame'],bossAtTen('normal'))}

Common N10 bien équipé : ${dist(commonNormal)} % ; la viabilité ne nécessite pas un Warrior Epic+. Par rareté et niveaux pertinents :

${table(['Rareté','Niveau','Kit','Moyenne[min–max] %'],bossByRarity('normal',[3,5,7,9,10]))}

## G. Morgath Némésis

Réserve précédente : le good moyen était 26,54 % plutôt que 10–25 %, et les très hauts tiers ne se distinguaient pas. Les bandes identiques par rareté sont désormais abandonnées. Mesures nouvelles :

${table(['Warrior','Rareté','N10 aucun','N10 moyen','N10 bon','N10 endgame'],bossAtTen('nemesis'))}

${table(['Rareté','Niveau','Kit','Moyenne[min–max] %'],bossByRarity('nemesis',[3,5,7,9]))}

Le Mythique N10 moyennement équipé reste loin d’une victoire garantie ; avec équipement Mythique optimisé, sa victoire peut être très probable. RNG non supprimée, niveaux/passifs et différence de préparation restent observables. Aucun ennemi personnalisé ni score d’accès.

## H. Faille early : réserve traitée

C1 ancien {Force 33, Esquive 15, Vitesse 24, PV 430} rendait pratiquement impossible la participation des Common N1–3 sans équipement. Nouveau budget fixe **14/10/14/180** ; profils des 7 ennemis, jitter ±6 %, C2→Boss, récompenses 20 pièces/40 XP, lineup, HP restaurés, calendrier et assistance existante par série de défaites restent inchangés. Ce n’est PAS une facilité réservée aux Common ni du scaling selon le joueur.

Les colonnes indiquent la probabilité INCONDITIONNELLE depuis l’entrée, à pleine difficulté 100 sans assistance. C1 n’est pas garanti pour les faibles ; C2 marque ensuite une vraie étape de préparation. Équipement Common inclus comme scénario séparé, aucune récompense offerte.

${table(['Warrior','Rareté','Niveau','Kit','C1 %','C2 %','C3 %','C4 %','Full %'],d.riftRows.filter(x=>x.level<=5).map(x=>[x.id,x.rarity,x.level,kit[x.gear],...x.unconditional.map(f)]))}

Naya N1 sans équipement reste très fragile ; N3 et un premier kit rendent l’entrée nettement plus praticable. On ne transforme pas Faille en full clear early. Le même budget profite naturellement aux rares plus puissants, conformément à la philosophie choisie.

## I. Faille endgame

Moyenne uniforme des 12 Warriors N10 Cœur+Peau : **${f(endRift)} %**, contre 85,06 % Phase 2. C2→Boss inchangés. Le Mythique réussit plus facilement ; les Common gardent une chance raisonnable.

${table(['Warrior','Rareté','N7 good full%','N10 good full%','N10 endgame full%'],riftEndRows)}

## J. Diversité des builds

100 combinaisons × 12 Warriors × 4 profils × 1000 graines. Familles en tête observées : ${families.join(' ; ')}. Les 3 familles de Phase 2 restent pertinentes. La quatrième et les écarts faibles/proches de 100 % peuvent être de simples ex æquo/bruit ; pas une preuve qu’elle est toujours supérieure. Aucun équipement modifié dans cette passe. Cœur+Peau n’est pas un #1 universel.

${table(['Warrior','Profil','Rang','Arme','Armure','Victoire %'],Object.entries(d.buildRanks).flatMap(([id,p])=>Object.entries(p).flatMap(([profile,rows])=>rows.slice(0,5).map((x,i)=>[id,profile,i+1,x.weapon,x.armor,f(x.rate)]))))}

## K. Carrières / pacing

${c.meta.careers} carrières × 60 jours, 128/cellule, calendrier/stratégies/seeds Phase 2 inchangés. Main = Warrior welcome initial, pas de switch automatique vers un Mythique tiré plus tard. Duel analytique à même niveau/kit avec les chances du roster, aucune population réelle créée. XP et règlements runtime, pas de catch-up. Observations censurées : ne pas transformer les non-finisseurs en victoires.

${table(['Profil','Stratégie','N10 médiane[P10–P90] (observés)','Morgath Normal','Morgath Némésis'],Object.keys(c.groups).map(k=>{const [p,s]=k.split('|');return [p,s,milestone(p,s),milestone(p,s,'normalWin'),milestone(p,s,'nemesisWin')]}))}

Régulier équilibré ${milestone('regular','C-balanced')}, sans Expédition ${milestone('regular','H-no-expedition')}, sans Duel ${milestone('regular','F-no-duel')}, sans Faille ${milestone('regular','G-no-rift')}. Aucun ajustement XP/coins/quotas demandé par ces nouvelles mesures.

## L. Économie INDÉPENDANTE

${e.meta.careers} comptes synthétiques établis × 90 jours ; warm-up 30 jours, mesure 31–90 (60 jours), 128/cellule. Vrai wallet initial 0, vrais combats/tirages/remboursements, assertion quotidienne soldeInitial + crédits − achats = soldeFinal. Aucun jackpot Boss, badge, welcome, première victoire globale ni achat/remboursement induit par ces jackpots. Les coffres Faille/Exp récurrents restent légitimes. Ce n’est pas l’ancienne correction comptable 4,84.

Hypothèses : main N10 selon les chances welcome, 7 Common/Uncommon acquis, Normal terminé/Némésis débloqué, 15 replays Némésis 1, 10 Duels analytiques, 1 Faille, Expédition du secondaire. Brackets de gear fixés séparément : moyen/bon/endgame. Ces équipements initiaux ne sont PAS des gains quotidiens ni une promesse d’acquisition à J1. La mesure conditionne un compte établi, pas la progression d’un nouveau compte. Vrais succès/échecs et assistance Faille historique conservés.

${e.meta.notes.map(n=>`- ${n}`).join('\n')}

## M. Coffres/jour et budgets

"Orienté Warrior" = 80 % du budget brut en Warrior, 20 % équipement ; équilibré 50/50 ; équipement 25/75 ; exclusif 100 % Warrior séparé. Le choix est explicite, pas un quota artificiel de 5 tirages. Tous les surplus sont recyclés manuellement. Les crédits totaux incluent les remboursements ; les crédits d’activités sont présentés séparément pour éviter de les compter deux fois.

${table(['Gear','Stratégie','Coins activités/j','Coins crédités incl.recycle/j','Coins dépensés/j','W payants/j','E payants/j','Recycle W/j','Recycle E/j','Solde fin/j moyen','Minutes estimées/j'],Object.entries(e.groups).map(([k,g])=>{const [q,s]=k.split('|'),m=g.mean;return [kit[q],s,f(m.adventureCoins+m.duelCoins+m.riftCoins+m.expeditionCoins),f(m.earned),f(m.spent),f(m.warriorChests),f(m.equipmentChests),f(m.warriorRecycle),f(m.equipmentRecycle),f(m.balance),f(m.minutesEstimated)]}))}

La stratégie orientée avec gear good mesure ${f(targetEconomy)} W payants/j. **La stratégie exclusivement Warrior produit davantage** : ${f(e.groups['good|exclusive'].mean.warriorChests)} avec good / ${f(e.groups['endgame|exclusive'].mean.warriorChests)} en endgame. Donc 4,84 ne doit jamais être présenté comme le résultat universel du 100 % Warrior. La cible approximative 4–5 est atteinte avec un budget équipement réel, pas un plafond de revenu. Aucune économie runtime retouchée pour forcer ce chiffre. Préparation forte, recyclages et cadeaux récurrents créent une borne supérieure plus généreuse ; c’est une réserve explicite à juger humainement, pas un résultat caché.

## N. Sauvegardes / stats legacy

Aucune nouvelle migration de format ni de clé. Version 6 Phase 2 conservée. Niveau/XP/identité persistés, stats dérivées par getWarriorLevelStats dans Hub/Collection/combat/Duel serveur. Une ancienne sauvegarde Tyrak N5 XP123 reçoit les nouvelles stats N5 sans reset, sans cadeau XP, sans stocker l’ancien bonusStats. Loadouts, inventaire, personalClears, séquences, réserves et reçus conservés. Tests v2/v5/v6, cap 15, plafond XP, badges et recycle existants restent actifs.

## O. Cloud / admin

V0.14 CAS/losesProgress/dirty cache/retry/tests de conflits et nouveau stockage conservés. Aucun vrai compte connecté, aucune sync distante effectuée : validation mock du cloud, pas un test de deux comptes Supabase en production. Admin local uniquement, sauvegarde séparée, pas de cloud. QA DEV en mémoire, sans persistance. Ajout minimal qaKit=none/common/medium/good/endgame pour inspecter les vrais bonus sans polluer la carrière ; n’agit pas hors QA.

## P. Tests / build / QA

${table(['Commande','Résultat'],v.commands.map(x=>[x.command,x.exit===0?'OK':`ÉCHEC${x.exit}`]))}

${v.testCount} tests, ${v.testFiles} fichiers. Tests historiques de murs désormais limités aux Common (bandes conservées), tests supplémentaires de rareté et préparation pour les autres tiers : ce n’est pas une suppression des garde-fous PvE. Le test de croissance conserve les 40 tuples Common, N1 des 12 et la monotonie. Client/PWA et Duel Edge reconstruits avec les mêmes stats. Warning chunk >500k accepté et non corrigé. SQL005 reste uniquement inspecté/testé par contrat statique, non exécuté sur PostgreSQL ; compilation Edge ≠ test Deno/sécurité déployée.

Navigateur : ${v.browserSummary} HTTP 200 confirmé sur ${v.url}. Quatre viewports 320/390/768/1440 ; stats canoniques Tyrak N5 sans équipement 122/25/38/1577 confirmées, HUD/combat/résultat conservés, console sans erreur observée. Les vrais combats seed42 Common N10 good et Tyrak N5 good peuvent perdre ; aucune issue forcée pour la QA. Screenshots et logs ignorés dans qa-output.

Total combats moteur : ${d.meta.battles+c.meta.battles+e.meta.battles} (matrices, carrières et économie indépendante, hors probes/tests). Chaque simulation fige/hache ses sources et vérifie qu’elles ne changent pas pendant le run. Les artifacts Phase2 historiques n’ont pas été remplacés ; les sorties finales sont séparées.

## Q. Réserves / décision

**${verdict}** pour validation humaine. ${ready?'Aucun blocage local restant identifié par les critères retenus.':'Un critère automatique reste hors cible : voir les valeurs des sectionsA/K/M et les commandesP avant clôture.'}

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

\`pnpm exec node scripts/calibrate-v015-final.mjs --trials=1000\`

\`pnpm exec node scripts/audit-v015-final-calibration.mjs --major=5000 --trials=1000\`

\`pnpm exec node scripts/audit-v015-phase2-loop.mjs --runs=128 --days=60 --trials=1000 --output-prefix=v015-final\`

\`pnpm exec node scripts/simulate-v015-recurring-economy.mjs --runs=128\`

\`pnpm exec node scripts/report-v015-final-calibration.mjs\` (aprèsQA etv015-final-validation.json).

JSON/CSV/screenshots générés uniquement sous qa-output/, ignoréGit. Aucun assetcanonique, migrationhistorique, .env.local ni dépendance modifié. Serveur laisséactif.

## URLs locales vérifiées

- Normal : ${v.url}
- Admin : ${v.url}?admin
- TyrakN5nu : ${v.url}?admin&qaPreview&qaWarrior=tyrak&qaLevel=5&qaKit=none
- CommonN10goodMorgath : ${v.url}?admin&normalBossPreview&qaWarrior=karg&qaLevel=10&qaKit=good
- TyrakN5goodMorgath : ${v.url}?admin&normalBossPreview&qaWarrior=tyrak&qaLevel=5&qaKit=good
- Personal : ${v.url}?admin&v015Qa=personal
- Recycle : ${v.url}?admin&v015Qa=recycle
- Duel : ${v.url}?admin&duelPreview
- Failleearly : ${v.url}?admin&riftPreview&qaWarrior=karg&qaLevel=3&qaKit=common
- MorgathNémésis : ${v.url}?admin&nemesisBossPreview&qaWarrior=tyrak&qaLevel=10&qaKit=medium

Confirmation : aucun add/commit/push/branch/stash/reset/checkoutdestructif, aucun remote modifié, aucun déploiement.
`
writeFileSync('docs/v015-final-calibration.md',out)
writeFileSync('qa-output/v015-final-decision.json',JSON.stringify({verdict,ready,rarityResults,endRift,commonNormal,targetEconomy,families,regular:{balanced:ms('regular','C-balanced'),noExp:ms('regular','H-no-expedition'),noDuel:ms('regular','F-no-duel'),noRift:ms('regular','G-no-rift')}},null,2))
console.log(JSON.stringify({verdict,regular:ms('regular','C-balanced'),targetEconomy,endRift,report:'docs/v015-final-calibration.md'}))
