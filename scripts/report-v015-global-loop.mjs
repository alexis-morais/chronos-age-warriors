/** Analysis report: JSON-encoded Markdown on stdout, applied with apply_patch. */
import { readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
const d = JSON.parse(readFileSync('qa-output/v015-global-loop.json', 'utf8'))
const p = JSON.parse(readFileSync('qa-output/v015-personal-clears.json', 'utf8'))
const s = JSON.parse(readFileSync('qa-output/v015-sensitivities.json', 'utf8'))
const test = JSON.parse(readFileSync('qa-output/v015-tests.json', 'utf8'))
const f = n => n === null || n === undefined ? '—' : Number(n).toLocaleString('fr-FR', { maximumFractionDigits: 2 })
const pct = n => `${f(n)} %`
const mean = a => a.reduce((a, b) => a + b, 0) / a.length
const table = (head, rows) => '\n| ' + head.join(' | ') + ' |\n| ' + head.map(() => '---').join(' | ') + ' |\n' + rows.map(r => '| ' + r.join(' | ') + ' |').join('\n') + '\n'
const sections = []
const add = (title, text) => sections.push(`## ${title}\n\n${text.trim()}\n`)
const group = (profile = 'regular', strategy = 'C-balanced', settings = {}) => d.groups[[profile, strategy, JSON.stringify(settings)].join('|')]
const matching = (profile = 'regular', strategy = 'C-balanced', settings = {}) => d.careers.filter(c => c.profile === profile && c.strategy === strategy && JSON.stringify(c.settings) === JSON.stringify(settings))
const cohort = (profile, strategy, milestone, settings = {}) => {
  const cases = matching(profile, strategy, settings)
  const values = cases.map(c => c.milestones[milestone] ?? Infinity).sort((a, b) => a - b)
  const q = t => { const n = values[Math.floor((values.length - 1) * t)]; return Number.isFinite(n) ? `${n} j` : `>${d.meta.days} j` }
  return `${q(.5)} [${q(.1)}–${q(.9)}] ; ${pct(cases.filter(c => c.milestones[milestone]).length / cases.length * 100)} observés`
}
const sources = (g, day = 30) => table(['Source', 'Pièces cumulées', 'XP créditée au main', 'XP créditée au roster', 'XP nominale proposée'], Object.entries(g.at[day].sources).map(([k, v]) => [k, f(v.coins), f(v.xpMain), f(v.xpAll), f(v.nominalXp)]))
const quality = (id, level, gear, mode) => d.quality.find(r => r.warrior === id && r.level === level && r.gear === gear && r.mode === mode).winRate
const stats = v => [v.strength, v.dodge, v.speed, v.hp].join('/')
let snapshots = 0
for (const c of d.careers) for (const day of c.snapshots) {
  assert.equal(day.coins, 300 + Object.values(day.sources).reduce((a, b) => a + b.coins, 0) - day.metrics.spentWarrior - day.metrics.spentEquipment)
  snapshots++
}
const base = group()
add('A. Executive Summary', `
Audit du 5 octobre 2026. V0.14.1 locale figée. **Phase 1 uniquement : aucun équilibrage runtime ni déploiement.**

La boucle existe, mais ne satisfait pas toutes les intentions simultanément. En stratégie équilibrée, le premier N10 médian arrive à **10 jours pour le casual, 9 pour le régulier, 8 pour le très actif**. Aucun régulier équilibré ne l’atteint avant J7 dans les 128 graines. Le très actif optimisé y arrive en 6–7 jours, mais cumule 30 Duels/jour et rappelle son main entre sessions. Cela ne démontre pas une cible 5–7 jours naturelle et facultative pour tous.

Sans Expédition, le régulier passe à **24 jours** ; sans Duel à 10 jours ; sans Faille à 10 jours. L’Expédition domine l’XP ; la Faille joue surtout sur l’accès aux Warriors extraordinaires. Morgath Normal est battu au jour 12 médian par le régulier équilibré. Pour Morgath Némésis, atteindre 50 % de victoire reste généralement hors de la fenêtre de 60 jours avec le gear réellement obtenu.

Deux contradictions confirmées : le prédicat du badge Némésis retourne toujours false, bloquant la Maîtrise à 1500 pièces ; posséder 12 Warriors donne actuellement 200 pièces (Panthéon), pas directement 1500. Des reçus affichent de l’XP nominale au plafond N10 malgré zéro XP créditée.

Le régulier équilibré finit Némésis au jour 26 médian, en multipliant les essais à faible probabilité : cela ne signifie pas une préparation à P50. Normal lui-même reste sous P50 pour près de90 % des carrières à J60. La boucle « gagner du loot puis retenter » existe, mais une victoire rare remplace souvent une préparation fiable.

Propositions soumises à validation : cap Aventure 15 ; Duel 10/jour sans recharge ; personal first-clear 20/50 XP sans récompense globale supplémentaire ; recyclage Équipement manuel avec chaque remboursement inférieur à 25 ; builds plus spécialisés. Replay 5/10, odds, jackpots Boss et référence Faille endgame ≈85 % restent intacts. Les chiffres du Duel supposent une population analytique disponible, pas un matchmaking réel mesuré.`)
add('B. Current Ruleset', `
${table(['Système', 'Règle confirmée'], [
['XP', 'Seuils ' + d.xpRequirements.join('/') + ' ; total 6850 ; N10 absolu, XP résiduelle 0'],
['Bienvenue', 'Un Warrior gratuit aux vraies odds normales +300 pièces ; aucun équipement'],
['Normal', 'Première victoire du compte : 20 XP /20 pièces ; replay 5/5 ; défaite 4/0'],
['Némésis', 'Première victoire : 50/50 ; replay 10/10 ; défaite 10/0 ; accessible après Boss Normal'],
['Boss Normal', '1500 pièces +10 coffres Warrior stockés, une seule fois'],
['Boss Némésis', '2500 pièces +3 coffres Faille stockés, une seule fois'],
['Aventure', 'Cap 10 ; +1/20 min ; réserve partagée Normal/Némésis, sans reset quotidien'],
['Duel actuel', 'Cap 10 ; +1/20 min côté serveur ; victoire 20/20, défaite 4/0'],
['Faille', 'Une tentative/jour Paris ; cinq étapes ; 40 XP/40 pièces par victoire ; 5/5 = coffre Faille'],
['Expédition', 'Un slot, plafond 24 h ; 600 XP/350 pièces ±10 % indépendants ; bloque Aventure/Faille du Warrior, pas Duel'],
['Coffres', 'Warrior 100 ; Équipement 25, ×10=250 sans remise ; type Équipement 50/50 puis rareté'],
['Recyclage Warrior', '20/40/80/150/200/250 pièces et 25/40/75/125/200/350 XP selon rareté ; XP au Warrior doublonné'],
['Équipement', '20 objets statiques ; doublons stockés, aucun recyclage ou gain d’XP actuel ; presets partagés'],
['Passifs', '36, seuils 3/7/10 ; état propre à chaque combat'],
['Sauvegarde', 'Version 5 ; cache par compte, CAS, reçus ; admin isolé sur localhost']])}
Moteur : dégâts de base 6+2,2×Force^0,75 ; variance ±10 % ; critiques 5 % ×1,5 ; esquive plafonnée à 35 % ; cadence (Vitesse+10)^0,65 ; maximum trois actions consécutives. Les ennemis restent fixes, jamais ajustés au Warrior.

Toutes les sources convergent vers addWarriorXp et jettent l’excédent à N10 : Aventure, Némésis, Faille, Duel, Expédition, recyclage. Aucun prestige, stockage ou conversion. Les anciens champs equipment.level/xp n’augmentent plus les stats.

Sources inspectées : src/game.ts, warriorProgression.ts, warriors.ts, warriorPassives.ts, data.ts, config.ts, combatReserves.ts, nemesisCampaign.ts, nemesisBalance.ts, rift.ts, expedition.ts, chestSystem.ts, warriorRecycle.ts, riftChest.ts, badgeSystem.ts, storage.ts, cloudSave.ts, duelRules.ts, App.tsx et composants ; règles SQL/Edge lues sans exécution. Les hashes figent les sources employées.`)
add('C. Player Profiles', `
${table(['Profil', 'Temps actif/jour', 'Sessions', 'Actions max/session', 'Duels max/session'], Object.entries(d.profiles).map(([id, v]) => [id, v.minutes + ' min', v.sessions.map(m => m / 60 + ' h').join(' / '), v.slots, v.duels]))}
Hypothèse : 30 secondes/action avec ×3/Passer ; menus et coffres dans le temps restant. Ce n’est ni une mesure x1 ni de la télémétrie. Une session s’arrête quand la réserve est vide ; aucune attente de 20 minutes n’est comptée comme temps actif.

Stratégies : A 100 % Warrior ; B 100 % Équipement ; C 50/50 ; D main optimisé (25/75 puis 50/50 après obtention de gear Rare dans les deux slots, rappels entre sessions) ; E collection (75/25 et Expédition d’un secondaire) ; F sans Duel ; G sans Faille ; H sans Expédition. Deux variantes de C à 75/25 et 25/75 isolent le seul budget. Le main reste le Warrior de bienvenue, sans reroll ni substitution automatique par un héros rare.

Casual/régulier : main envoyé après la session et rappelé à la suivante, environ 23 h 52/23 h 36. Actif C : après la dernière session jusqu’à la première, environ 11 h 40. Actif D : rappels/envois entre sessions, presque 24 h cumulées hors jeu. E : secondaire envoyé dès qu’un autre Warrior est possédé.

**Population Duel analytique seulement** : roster tiré aux odds normales, même niveau et gear que le joueur. Aucun bot, faux compte, appel réseau ou donnée de population inventée. Le vrai SQL cherche d’abord la proximité de points, pas de niveau/gear : cette hypothèse peut surestimer la viabilité réelle. F fournit aussi la borne sans adversaires : zéro combat, XP, pièce et charge dépensée.

${d.meta.careers} carrières ×${d.meta.days} jours ; ${d.meta.runs} graines/cellule, snapshots J1–30 et J60. ${f(d.meta.battles)} combats dans le simulateur global. ${p.rows.length * p.seeds} carrières de Warriors tardifs ; 96 cellules d’ablation ×2000 graines avec/sans kit. Benchmarks ${d.meta.trials} graines/cellule. Gear choisi parmi les copies réellement obtenues avec 80 sondes contre le prochain mur ; départage physique, aucune note de puissance UI.

Graine globale : ${d.meta.seed}. Les variantes de même seed consomment le RNG différemment : ce n’est pas un essai causal strictement apparié. Incertitude 95 % maximale d’une proportion : ±8,7 points avec 128 carrières, ±3,1 avec 1000 combats, ±4,9 avec 400 sondes Boss. Les petits écarts de classement ne sont pas significatifs.

Le calendrier et les caps hypothétiques sont des adaptateurs du script : recharge réelle sur horloge déterministe, puis remplacement des seuls compteurs de charges après le règlement de campagne. Combat, XP, loot et reçus emploient les fonctions actuelles. Les tableaux agrégés JSON ont des quantiles conditionnels aux cas observés ; ce rapport recalcule les jalons sur toute la cohorte depuis les carrières brutes.

Médianes [P10–P90] calculées sur **toute la cohorte**, avec non-completers censurés à 60 jours ; « observés » donne le taux de réalisation. Les politiques de session, dépenses et sélection sont des hypothèses, pas des comportements humains observés. Aucun compte distant ni sauvegarde personnelle n’alimente les calculs. JSON/CSV conservent les trajectoires, rewards, reçus et seeds.`)
for (const [letter, day] of [['D', 14], ['E', 30]]) add(`${letter}. ${day}-Day Simulation`, `
Moyennes des carrières réellement simulées avec combat, loot, doublons, Faille/pity et Expédition. Les niveaux sont entiers par carrière ; 8,4 est une moyenne, pas un niveau gameplay. Wallet après dépenses ; nodes indiquent la progression globale ; Némésis 0 signifie non débloquée.
${table(['Profil', 'Stratégie', 'Niveau main', 'Normal', 'Némésis', 'Warriors uniques', 'Gear uniques', 'W/E payants', 'Coffres Faille', 'Doublons W', 'Wallet'], Object.keys(d.profiles).flatMap(profile => d.strategies.map(st => { const a = group(profile, st.id).at[day]; return [profile, st.id, f(a.level), f(a.normalNode), f(a.nemesisNode), f(a.warriors), f(a.equipment), `${f(a.metrics.warriorPaid)}/${f(a.metrics.equipmentPaid)}`, f(a.metrics.riftChests), f(a.metrics.duplicates), f(a.coins)] })))}
Le JSON conserve XP courante, pièces, raretés, copies d’équipement, loadout exact, étapes Faille, claims Expédition, badges, recyclage, compteurs de combats et sources/sinks par jour/seed. Le CSV distingue caps et quota Duel des variantes. Les jackpots uniques ne sont pas transformés en revenu quotidien.`)
add('F. First Level 10', `
${table(['Profil / stratégie', 'Premier N10 : médiane [P10–P90] ; réalisation', 'J3', 'J5', 'J7', 'J10', 'J14'], Object.keys(d.profiles).flatMap(profile => ['C-balanced', 'D-main', 'F-no-duel', 'G-no-rift', 'H-no-expedition', 'E-collection'].map(st => [profile + ' / ' + st, cohort(profile, st, 'level10'), ...[3, 5, 7, 10, 14].map(day => pct(group(profile, st).level10ByDay[day]))])))}
La cible 5–7 jours n’est pas atteinte par le régulier équilibré : ${pct(base.level10ByDay[7])} avant J7. L’actif C est modestement plus rapide, mais D cumule des rappels d’Expédition et 30 Duels. Le premier N10 peut être un secondaire avant le main dans E ; le niveau du main est conservé séparément.

Minimum mathématique : **jour 1**, bienvenue Urgath puis 35 doublons Légendaires =7000 XP nominale, 3800 pièces finales. Exemple légal mais probabilité ≈1,82×10^-103, donc inutilisable comme délai réaliste. Aucun minimum garanti sans conditions de RNG/population.

Borne productive optimiste hors loterie avec Duel plafonné à 10/jour : 600 Expédition +200 Duel +200 Faille +50 replay =1050 XP/jour, soit 6,52 journées de rendement pour 6850 XP. Premier retour Expédition au jour 2. Cela suppose toutes les victoires, adversaires disponibles et compatibilité des 24 heures ; l’early ne remplit pas ces conditions. Tenir 5–7 jours tout en gardant les modes facultatifs exige un arbitrage, pas un buff massif du replay.

Sources du régulier équilibré à J14 :
${sources(base, 14)}
Combats moyens à J14 : Aventure ${f(base.at[14].metrics.adventureBattles)}, Duel ${f(base.at[14].metrics.duelBattles)}, Faille ${f(base.at[14].metrics.riftBattles)} ; arrêts sur réserve vide ${f(base.at[14].metrics.chargeDenied)} ; essais de mur ${f(base.at[14].metrics.wallAttempts)}. L’XP nominale post-N10 est jetée. Jalons 3/5/7 également conservés pour chaque carrière.`)
for (const [letter, mode, title] of [['G', 'normal', 'Morgath Normal'], ['H', 'nemesis', 'Nemesis']]) add(`${letter}. ${title}`, `
Sondes Boss à 400 graines avec l’inventaire réellement obtenu. Un jalon de probabilité exige aussi que le Boss soit accessible. Premier essai ≠ chance raisonnable ; P20/P50/P80 sont des estimations, pas des promesses.
${table(['Profil / stratégie', 'Premier essai', 'Première victoire', 'P≥20 %', 'P≥50 %', 'P≥80 %'], Object.keys(d.profiles).flatMap(profile => ['C-balanced', 'F-no-duel', 'G-no-rift', 'H-no-expedition'].map(st => [profile + ' / ' + st, ...['Attempt', 'Win', '20', '50', '80'].map(m => cohort(profile, st, mode + m))])))}
${mode === 'normal' ? 'Une série chanceuse permet de battre Morgath avant P50. Le régulier équilibré gagne au jour 12 médian. Focus Warrior sans achat de gear rallonge la préparation ; focus équipement la raccourcit. Le jackpot est volontaire et séparé du financement pré-Boss.' : 'Némésis est accessible sans verrou de niveau/gear dès Morgath Normal. Ses ennemis sont endgame : N1 Force 105/PV1120 contre 8/110 en Normal1, pas simplement toutes les stats ×3. En équilibré, P50 reste censuré à 60 jours dans la quasi-totalité des carrières. Le frein est surtout le gear, pas un nouveau niveau. Aucun délai cible supplémentaire inventé.'}
${mode === 'nemesis' ? table(['Profil', 'Délai Normal gagné→Némésis P50 (cas observés seulement)', 'Némésis terminée à J30'], Object.keys(d.profiles).map(profile => { const g = group(profile), cs = matching(profile), x = g.nemesisReasonableExtraDays; return [profile, x.observed ? `${f(x.median)} j [${f(x.p10)}–${f(x.p90)}] ; ${x.observed}/${x.total} cas, pas une médiane de population` : `Non estimable : 0/${x.total} cas à J60`, pct(cs.filter(c => c.milestones.nemesisWin && c.milestones.nemesisWin <= 30).length / cs.length * 100)] })) : ''}
Benchmark contrôlé N10, gear identique entre Warriors, **non prêté aux carrières** :
${table(['Warrior', 'Sans gear', 'Commun', 'Moyen Épique', 'Bon Légendaire', 'Endgame Mythique'], d.warriors.map(w => [w.name, ...['none', 'common', 'medium', 'good', 'endgame'].map(gear => pct(quality(w.id, 10, gear, mode)))]))}
P80 n’est pas automatiquement acquis à N10. « >60 j » est une censure, pas une estimation à 61 jours. Moyen =Marteau/Carapace ; bon =Griffe/Fourrure ; endgame =Cœur/Peau. La disponibilité du dernier couple est analysée en R.`)
add('I. Adventure Charges', `
Caps contre-factuels, recharge 1/20 min inchangée. Tous commencent avec 10 charges ; les caps supérieurs se remplissent après la première session, sans cadeau initial.
${table(['Cap', 'Vide→plein', 'Aventures/j J1–30', 'Arrêts réserve vide/j', 'Premier N10', 'Normal gagné', 'Pièces Normal+Némésis J30'], [10, 15, 20, 25, 30].map(cap => { const settings = cap === 10 ? {} : { cap }, g = group('regular', 'C-balanced', settings), a = g.at[30]; return [cap, cap * 20 + ' min', f(a.metrics.adventureBattles / 30), f(a.metrics.chargeDenied / 30), cohort('regular', 'C-balanced', 'level10', settings), cohort('regular', 'C-balanced', 'normalWin', settings), f(a.sources.normal.coins + a.sources.nemesis.coins)] }))}
**Recommandation : 15**, plus petit cap répondant au confort proposé de 15 Aventures/session. Avec 10 Duels et jusqu’à 5 Faille : 30 actions ≈15 minutes, laissant 9 minutes de menus au régulier de 24 minutes. C’est une cible UX proposée, pas de la télémétrie. Cap 20 si l’on souhaite 20 Aventures/session ; 25/30 ne produisent presque plus de gain dans ce budget de temps. Le gain vers N10 reste limité, et les activités restent épuisables.

La recharge ne commence qu’à la dépense Aventure, après Faille/Duel dans cette politique ; elle peut arriver trop tard dans une session courte. Cap ≠ quota quotidien : plusieurs sessions permettent plus de 10 combats/jour actuellement. Cap 15 ne change ni les rewards ni la pente de grind.`)
add('J. Duel', `
Hypothèse 10/jour sans recharge, même moteur et rewards, **non implémentée**.
${table(['Profil', 'Règle', 'Duels/j J1–30', 'XP main Duel J30', 'Pièces Duel/j', 'Points/j', 'Premier N10'], ['regular', 'active'].flatMap(profile => [false, true].map(hard => { const settings = hard ? { duelDaily: true } : {}, g = group(profile, 'C-balanced', settings), a = g.at[30]; return [profile, hard ? '10/jour' : 'Cap10+recharge', f(a.metrics.duelBattles / 30), f(a.sources.duel.xpMain), f(a.sources.duel.coins / 30), f(a.metrics.duelPoints / 30), cohort(profile, 'C-balanced', 'level10', settings)] })))}
Pour 10 Duels à taux de victoire p : XP nominale =40+160p ; pièces =200p. À p=0/50/70/100 % : 40/120/152/200 XP et 0/100/140/200 pièces. Sans adversaire : aucun combat, XP, pièce ou charge, jamais une défaite fictive à 4 XP. F sans Duel borne ce cas.

Ranking : victoire 20+5×écart positif de rareté, max45 ; défaite0 ; points cumulés sans retrait. Dix victoires/jour donnent 200–450 points/jour. La recharge actuelle fournit jusqu’à 72 charges/24h hors stock initial, encourage les retours et favorise l’assiduité. Un hard cap10 réduit cette pression, mais l’actif équilibré passe de N10 médian 8 à 11 jours ; le régulier à 10/session ne change pas.

Recommandation : 10/jour côté serveur, reset Paris explicite, facultatif, aucun bot. Le matchmaking par points peut opposer des comptes trop forts aux nouveaux ; la population analytique ne valide pas les taux réels. Ne pas refondre le classement sans population observée. L’absence de Duel ne doit verrouiller aucun mode PvE.`)
add('K. Expedition', `
20000 tirages de récompenses par durée réelle :
${table(['Durée', 'XP moyenne', 'Pièces', 'Objets/retour', 'Coffre Équipement %', 'Coffre Warrior %', 'Épiques/retour', 'Légendaires/retour'], s.expeditionTiming.map(r => [r.hours + ' h', f(r.xp), f(r.coins), f(r.equipmentPerReturn), pct(r.equipmentChestPct), pct(r.warriorChestPct), f(r.epicPerReturn), f(r.legendPerReturn)]))}
**23 h 36 ≠24 h** : trois jets d’objets au tier18h, contre quatre au meilleur tier24h. Au-delà de la petite différence d’XP/pièces, un jet entier disparaît. Une session quotidienne à heure fixe rappelant le main à son début doit attendre 24h depuis l’envoi, décaler son horaire ou envoyer un secondaire.

Quatre retours de 6h et un retour de 24h ont même espérance 600 XP/350 pièces, quatre jets à 35 %, chances de coffres proratisées totalisant 0,1/0,02. Les tiers 6h donnent un loot inférieur : aucun avantage de qualité à rappeler toutes les 6h. Les rappels du main entre sessions cumulent toutefois combats et presque 600 XP, donc une pression de planning réelle. L’actif D en profite ; C overnight reçoit environ 300 XP.

Régulier sans Expédition : ${cohort('regular', 'H-no-expedition', 'level10')} contre ${cohort('regular', 'C-balanced', 'level10')}. La facultativité est technique, mais le retard majeur. 600 XP seuls exigent ≈11,42 retours pour 6850 XP. Envoyer un secondaire respecte la même règle, mais retarde le main : E ${cohort('regular', 'E-collection', 'level10')}.

Conserver 24h naturel et 600 comme référence, sans boost ou catch-up automatique. Arbitrer la cible sans Expédition et la disponibilité du main avant toute modification. Fallout Shelter reste une piste future hors scope, aucun nouveau journal/lore ici.`)
add('L. Late Warrior Progression / Personal First Clears', `
### L1. Modèle exact et équité

Actuel : un niveau déjà terminé par le compte ne donne au nouveau Warrior que 5 XP Normal/10 Némésis. Candidat : la première victoire du compte donne les récompenses actuelles ET consomme la marque personnelle du Warrior ayant combattu. Chaque autre Warrior, possédé avant ou après ce clear, obtient 20/50 XP **une fois par Warrior/niveau/mode**, à sa propre victoire.

Cette première victoire personnelle ultérieure donne **XP seulement : zéro pièce first-clear, coffre, ticket, progression, jackpot Boss ou bonus de maîtrise globale supplémentaire**. Ensuite replay ordinaire 5 XP/5 pièces ou 10/10. Une seule carte et progression de compte.

Parcours ci-dessous entièrement gagnés ; XP cumulée =reward×victoires. La colonne XP restante est la valeur résiduelle dans le niveau, selon la vraie courbe.
${table(['Mode', 'Parcours accessible gagné', 'Système', 'XP cumulée', 'Niveau +XP résiduelle', 'Victoires/charges', 'Temps actif à 30 s'], d.personal.map(r => [r.mode, '1→' + r.nodes, r.system, r.winXp * r.nodes, `N${r.level} +${r.xp} XP`, r.combats, f(r.minutesAt30s) + ' min']))}
Normal1→20 =400 XP →N3+100, **pas N6–7**. Némésis1→20 =1000 XP →N4+400. Vingt Normal +vingt Némésis =1400 XP →N5+350. N1 ne bat pas nécessairement Normal5, encore moins Némésis1 : ce sont des bornes après victoires, pas des gains gratuits.

Un main utilisé dès le début reçoit ces mêmes 400 XP Normal. Les marques personnelles restituent exactement cette opportunité au tardif : même courbe et rewards, aucun multiplicateur lié au main, à la rareté ou à la carte. Karg a battu Normal1→15 ; Naya nouvelle N1 gagne20 XP à sa première victoire sur1, puis5 XP/5 pièces à la deuxième ; niveau2 nouveau pour elle =20 XP. Un Warrior déjà possédé mais inutilisé garde aussi ses marques disponibles. Les premières globales futures consomment simultanément la marque du seul combattant.

### L2. Minimum de victoires, tous niveaux disponibles et gagnables

${table(['Mode', 'Nodes disponibles', 'Cible', 'Replay actuel', 'Personal proposé', 'Charges économisées', 'Jours à 10 combats/j actuel→personal'], d.personalGrind.map(r => [r.mode, r.availableNodes, 'N' + r.targetLevel, r.currentWins, r.personalWins, r.savedWins, `${f(r.currentDaysAt10)}→${f(r.personalDaysAt10)}`]))}
Sans défaite ou source extérieure : 20 premiers clears Normal économisent 60 victoires au-delà de 400 XP ; 20 Némésis économisent 80 au-delà de 1000. Normal replay seul N1→10 =1370 victoires ; modèle 20 personal =1310 minimum. À 10/jour : 137→131 jours ; temps actif 685→655 min ; budget de recharge 20 min/charge : 456,67→436,67 heures avant stock initial. Ce dernier timer n’est pas du temps actif. Cap15 change les charges/session, pas les XP.

### L3. Vrais combats, Normal1→15 déjà globalement accessible

Fixture avancée : Asha Peu commun N8, compte ayant déjà gagné Normal1→5/10/15/20 ; nouveaux Karg/Naya/Urgath/Tyrak N1. Le cas demandé du Légendaire obtenu tard est Urgath. Gear partagé déjà possédé : commun =Massue/Peaux, moyen =Marteau/Carapace. 128 graines/cellule. Tenter un niveau personnel seulement à P≥20 % estimée sur 200 graines ; après deux défaites/bloc de dix, farm Normal1. Aucun Duel/Faille/Expédition/recyclage. Aucun gear offert selon le niveau du main. Assertions : niveau/XP d’Asha, son preset et les clears globaux restent inchangés.
${table(['Warrior', 'Gear', 'Système', 'Combats médians N3', 'N5', 'N7', 'N10'], p.rows.filter(r => r.availableNodes === 15).map(r => [r.warrior, r.gear, r.system, ...[3, 5, 7, 10].map(n => r.medianCombats[n])]))}
Les variantes à 5/10/20 nodes sont également exécutées dans qa-output/v015-personal-clears.json. Avec gear commun, certains clears attendent une montée de niveau ; la carte accessible ne les rend pas gratuits. Le modèle corrige l’injustice de première XP et aide les premiers paliers, **sans résoudre à lui seul le grind secondaire jusqu’à10**.

### L4. Stockage et anti-exploit proposés, non implémentés

Champ proposé : personalClears[warriorId]={normal:[nodes],nemesis:[nodes]}. Défauts rétrocompatibles ; validation des IDs et nodes1–20. Reçu figé sur Warrior du combat, mode, node et ID unique de règlement ; attribution XP+marque atomique ; pertes sans consommation ; flags des jackpots inchangés. Changer le Warrior actif après lancement ne transfère jamais les XP.

Même ID lors d’un reload/doubleclic : aucun second paiement. Nouveau combat sur marque existante : replay. CAS cloud entier incluant XP/reçu, garde monotone des marques. Ne pas additionner les XP de deux branches offline : conflit explicite, aucune double attribution inter-appareils. Les replays ultérieurs redonnent leurs pièces normales, pas la première personnelle.

**Migration à décision humaine** : la v5 ne stocke pas l’identité du Warrior de chaque clear. Impossible de la reconstruire depuis le main actif. Option conservatrice : marquer les anciens Warriors sur les clears globaux (pénalise les tardifs déjà possédés). Option grâce : anciennes marques vides et XP à regagner par victoire une fois, ancien main compris (surplus fini, jamais gratuit). Ne pas promettre zéro redoublement historique sans preuve. Aucun boost, schéma ou migration modifié dans cette phase.`)
add('M. Economy', `
Conservation contrôlée sur **${f(snapshots)} snapshots** : 300 initial +sources −sinks =wallet. Régulier équilibré J30 :
${sources(base)}
Dépenses J30 : Warrior ${f(base.at[30].metrics.spentWarrior)}, Équipement ${f(base.at[30].metrics.spentEquipment)} ; wallet ${f(base.at[30].coins)}. Badges et Boss sont one-shot ; coffres gratuits séparés des payants.

Régulier orienté Warrior A :
${sources(group('regular', 'A-warrior'))}
Les jackpots 1500+10 coffres et 2500+3 Faille produisent volontairement un bond de collection, jamais du financement rétroactif pré-Boss. Expédition finance beaucoup de coffres ; ignorer les modes facultatifs réduit fortement le budget. Facultativité technique ≠équivalence économique.`)
add('N. Chest Purchasing', `
Allocation cumulative de pièces brutes. Revenu récurrent =Normal+Némésis+Faille+Duel+Expédition, hors Boss/badges/recyclage. Fenêtre J15–30 pour isoler ce flux.
${table(['Budget W/E', 'W payants/j J1–14', 'W payants/j J1–30', 'E payants/j J1–30', 'Pièces récurrentes/j J15–30', 'N10 régulier'], [['100/0', 'A-warrior'], ['75/25', 'budget-75'], ['50/50', 'C-balanced'], ['25/75', 'budget-25'], ['0/100', 'B-equipment']].map(([label, st]) => { const g = group('regular', st), a = g.at[30], b = g.at[14]; const recurring = ['normal', 'nemesis', 'rift', 'duel', 'expedition'].reduce((sum, k) => sum + a.sources[k].coins - b.sources[k].coins, 0) / 16; return [label, f(b.metrics.warriorPaid / 14), f(a.metrics.warriorPaid / 30), f(a.metrics.equipmentPaid / 30), f(recurring), cohort('regular', st, 'level10')] }))}
Roster complet : coût net Warrior ${f(s.warriorRecycling.normalNetCost)} pièces ; 4–5 coffres payants exigent ${f(4 * s.warriorRecycling.normalNetCost)}/${f(5 * s.warriorRecycling.normalNetCost)} pièces récurrentes/jour. Roster neuf : moins de doublons, proche de 100/coffre, donc 400–500/jour. Les moyennes payantes J30 incluent des jackpots : elles seules ne prouvent pas 4–5 hors jackpots.

Mais le flux récurrent mesuré du focus Warrior est679,4 pièces/jour à J15–30 : la cible4–5 est **viable et même dépassable** après montée en puissance avec tous les modes. Le régulier équilibré achète5,2 Warrior et20,82 Équipement/jour en moyenne J1–30 ; tension d’allocation réelle, mais volume important des deux. Sans Expédition, ce flux équilibré tombe à341,05 pièces/jour et les achats Warrior à2,36/jour. Sans Faille :537,78 pièces récurrentes/jour,4,13 Warrior payants/jour ; sans Duel :616,96 et4,47. Ni pénurie ni inflation uniforme : la dépendance aux modes et le rendement des copies dominent. Ne pas nerfer sur la seule moyenne incluant jackpots.

Un Warrior coûte quatre essais de gear ; ×10 n’améliore ni odds ni espérance. Budget 50/50 ne donne pas autant de coffres de chaque type. Focus Warrior retarde le gear (principalement drops Expédition), focus gear limite le roster hors Faille/bonus. La tension est réelle, mais le gear Boss peut transformer la préparation en attente de loterie.`)
add('O. Warrior Collection', `
5000 séquences par longueur, pool12 et vraies tables. Tirages hors bienvenue ; XP de recyclage nominale répartie aux doublons, soumise au plafond.
${table(['Tirages', 'Uniques moyens', 'Uniques P10/P50/P90', 'Doublons moyens', 'Pièces recyclées', 'XP nominale recyclée'], d.collection.map(r => [r.draws, f(r.warriorsMean), `${r.warriors.p10}/${r.warriors.median}/${r.warriors.p90}`, f(r.duplicatesMean), f(r.recycleCoinsMean), f(r.nominalRecycleXpMean)]))}
Aucun délai garanti. Le Mythique bloque souvent le dernier 12/12, croissance des uniques non linéaire. Les doublons aident surtout les communs ; 4–5 coffres ne donnent pas 4–5×25 XP au Warrior choisi. Espérance XP par coffre normal pour le main déjà possédé : Karg/Naya/Brakk/Eyla4,375 chacun ; Asha/Rhex/Ursak2,933 ; Saar/Morga2,625 ; Vorka1,0625 ; Urgath0,28 ; Tyrak0,035. La Faille accélère les raretés Warrior, jamais le gear.`)
add('P. Mythic Odds', `
Formule exacte 1−(1−0,0001)^n. Durée d’exposition à 1/3/5/10 coffres normaux/jour :
${table(['Tirages', '≥1 Mythique', '1/j', '3/j', '5/j', '10/j'], d.mythic.map(r => [r.draws, pct(r.probabilityPct), ...[1, 3, 5, 10].map(day => f(r.days[day]) + ' j')]))}
6931 tirages ≈50 %, soit 1386,2 jours à 5/jour, environ 3,8 ans. Probabilité cumulée, jamais date promise ou pity. Après 10000 échecs, le prochain coffre garde 0,01 %. Odds conservées, aucune garantie automatique proposée.`)
add('Q. Rift Chest', `
${table(['Coffres', '≥1 Mythique Faille 2 %', '≥1 Mythique normal 0,01 %'], d.riftOdds.map(r => [r.draws, pct(r.riftMythicPct), pct(r.normalMythicPct)]))}
Médiane d’obtention : 35 coffres à 2 % (34,31 avant arrondi), pas 35 jours si échecs. À 85 % de clears constants, 35 coffres exigent ≈41,2 jours de présence après accès endgame ; le pity réel influe sur ce taux. Boss Némésis donne trois coffres une fois. Route vers les Warriors extraordinaires, pas le gear Mythique.`)
add('R. Equipment Collection', `
${table(['Tirages', 'Gear uniques moyens', 'P10/P50/P90'], d.collection.map(r => [r.draws, f(r.equipmentMean), `${r.equipment.p10}/${r.equipment.median}/${r.equipment.p90}`]))}
Type50/50 puis rareté : chaque équipement Mythique précis a 0,005 %. Cœur ET Peau après n : 1−2(1−0,00005)^n+(1−0,0001)^n.
${table(['Tirages', '≥1 Mythique quelconque', 'Cœur ET Peau'], d.mythic.map(r => [r.draws, pct(r.probabilityPct), pct(r.bothMythicEquipmentPct)]))}
Médiane du couple24559 tirages,613975 pièces brutes ; à20 coffres gear/jour1227,95 jours. Le recyclage réduit le coût, pas le nombre de tirages. Expédition24h : quatre jets×35 %×0,01 % =0,00014 objet Mythique attendu/jour, soit ≈0,014 % de chance quotidienne (≈7143 jours d’espérance). Aucun accès garanti. Légendaire quelconque0,14 % : 1/714 essais en espérance ; par slot1/1429.

**Un benchmark Cœur/Peau ne signifie pas que le joueur en disposera normalement.** Les odds restent exceptionnelles, aucun pity proposé. Arbitrer préparation normalement obtenable versus artefacts exceptionnels. Le badge Arsenal sur15 IDs exige déjà les deux Mythiques, même sans étendre son catalogue à20.`)
add('S. Equipment Recycle', `
Candidat non implémenté : manuel, surplus quantity>1 ; conserver une copie partagée utilisable par tous les loadouts ; pièces seulement, ni XP, forge ou automatisation.
${table(['Table', 'Commun', 'Peu commun', 'Rare', 'Épique', 'Légendaire', 'Mythique', 'Remboursement moyen roster complet', '% du prix', 'Multiplicateur limite des achats'], d.equipmentRecycle.map(r => [r.name, ...r.values, f(r.refundWhenAllOwned), pct(r.returnFraction), f(r.asymptoticDrawMultiplier)]))}
5000 chaînes depuis250 pièces et inventaire vide ; prix25, première copie gardée, surplus réinvestis jusqu’à épuisement :
${table(['Table', 'Tirages moyens', 'P10/P50/P90', 'Remboursement moyen'], d.equipmentRecycle.map(r => [r.name, f(r.drawMean), `${r.drawsFrom250.p10}/${r.drawsFrom250.median}/${r.drawsFrom250.p90}`, f(r.refundMean)]))}
Recommandation **balanced 3/5/8/12/18/24**, ou prudent2/3/5/8/12/18 si un sink plus fort est désiré. Chaque remboursement <25 : **chaque boucle coûte**, même Mythique. Impossibilité d’autosuffisance, pas seulement espérance négative. Une copie suffit aux presets partagés. Confirmation et reçus/CAS atomiques contre doubleclic/reload ; conserver les IDs et presets.

Recyclage Warrior actuel, tous possédés : remboursement normal moyen ${f(s.warriorRecycling.normalCoinsEvAllOwned)}, coût net ${f(s.warriorRecycling.normalNetCost)}, facteur de réinvestissement ${f(s.warriorRecycling.reinvestMultiplier)}. Coffre Faille gratuit : remboursement moyen ${f(s.warriorRecycling.riftCoinsEvAllOwned)}. Légendaire200/Mythique250 dépassent100 individuellement, pas en espérance. Surveiller les séries rares sans conclure automatiquement à une inflation globale. Au N10 les pièces continuent, l’XP est jetée sans conversion.`)
add('T. Equipment Builds', `
100 combinaisons ×12 Warriors ×${d.meta.trials} graines contre Morgath Némésis, N10, mêmes seeds. Top5 sans restriction d’inventaire ; écarts <3 points potentiellement ex æquo statistiques.
${table(['Warrior', 'Rang', 'Arme', 'Armure', 'Winrate'], d.warriors.flatMap(w => d.equipmentRanks[w.id].slice(0, 5).map((r, i) => [w.name, i + 1, d.equipment.find(e => e.id === r.weapon).name, d.equipment.find(e => e.id === r.armor).name, pct(r.winRate)])))}
Les 20 équipements analysés :
${table(['Objet', 'Type', 'Rareté', 'Bonus', 'Effet'], d.equipment.map(e => [e.name, e.type, e.rarity, e.bonus, e.effect]))}
Cœur/Peau premier pour les12 : méta universelle dans ce benchmark, pas preuve de diversité endgame. +75Force/+22Vitesse/+100PV et +650PV/+25Esquive couvrent presque tous les styles. Les procs inférieurs intéressants ne compensent pas cette masse de stats.

Philosophie A : montée de rareté presque toujours supérieure. B recommandée : supérieure meilleure globalement, mais inférieure spécialisée parfois optimale face à un profil. Aucun bonus de classe ou nerf inventé ici. Un seul Boss ne couvre pas tout le jeu ; tester plusieurs profils adverses avant toute retouche.`)
add('U. 12 Warrior Balance', `
Stats N10 hors gear : Force/Esquive/Vitesse/PV. Dégâts basiques hors critiques/variance/procs. Esquive45 ne signifie pas45 % ; la probabilité suit la formule plafonnée.
${table(['Warrior', 'Classe', 'Rareté', 'Stats N10', 'Dégât basique', 'Esquive de base', 'Némésis moyen/bon/endgame', 'Gain passifs endgame (points)'], d.warriors.map(w => { const st = w.statsByLevel[9], ab = s.rows.find(r => r.warrior === w.id && r.gear === 'endgame' && r.mode === 'nemesis'); return [w.name, w.warriorClass, w.rarity, stats(st), f(6 + 2.2 * st.strength ** .75), pct(Math.min(.35, .04 + .36 * st.dodge / (st.dodge + 100)) * 100), ['medium', 'good', 'endgame'].map(g => pct(quality(w.id, 10, g, 'nemesis'))).join(' / '), f(ab.deltaPp)] }))}
Identités : Karg burst/pression/exécution ; Naya esquive→tempo et PV faibles ; Brakk mitigation/bloc/riposte ; Eyla tirs bonus/exécution ; Asha braises/détonation ; Rhex morsures/relais ; Ursak fureur sous pression ; Saar cadence/esquive ; Morga mitigation/soin ; Vorka saignement/exécution ; Urgath amortissement/froid ; Tyrak sursaut/prédation.
${table(['Warrior', 'Passif3', 'Passif7', 'Passif10'], d.warriors.map(w => [w.name, ...w.passives.map(v => v.name)]))}
Les36 kits restent inchangés et les noms proviennent des définitions. Naya dépend de ses seuils7/10 et d’esquives utiles, fragile avant7. Morga/Urgath profitent des combats longs mitigés. Eyla/Rhex gardent des dégâts forts malgré la faible rareté. À gear endgame identique, Tyrak dépasse les autres ici ; Eyla/Vorka/Saar restent plus faibles face à ce Boss. Ne pas extrapoler un dominant global d’un seul matchup. Les autres niveaux/gear et ablations sont conservés dans les JSON.`)
add('V. Rarity vs Level', `
Winrate du camp de gauche, moins rare ; gear identique des deux côtés ; stats/passifs réels ; ${d.meta.trials} graines par paire.
${table(['Matchup', 'Gear identique', 'Winrate moyen à gauche', 'Min–max selon identité'], [...new Set(d.matchups.map(r => [r.leftRarity, r.leftLevel, r.rightRarity, r.rightLevel, r.gear].join('|')))].map(key => { const rows = d.matchups.filter(r => [r.leftRarity, r.leftLevel, r.rightRarity, r.rightLevel, r.gear].join('|') === key); return [`${rows[0].leftRarity} N${rows[0].leftLevel} vs ${rows[0].rightRarity} N${rows[0].rightLevel}`, rows[0].gear, pct(mean(rows.map(r => r.winRate))), `${pct(Math.min(...rows.map(r => r.winRate)))}–${pct(Math.max(...rows.map(r => r.winRate)))}`] }))}
**RARETÉ >NIVEAU >ÉQUIPEMENT >RNG >PASSIFS n’est pas le ressenti assuré actuellement.** CommunN10 bat Épique/Légendaire/MythiqueN5 bien plus qu’exceptionnellement. KargN10 F99/PV1139 face à TyrakN5 F32/PV358 : le niveau domine. À N10, Tyrak106/1380 ne dépasse Karg que de7,1 % Force/21,2 % PV ; +75Force/+750PV du kit Mythique dépasse cet écart.

Le bond9→10 reste de l’ordre de75–98 % selon la stat malgré le lissage7–9. La rareté est plus visible en early. Arbitrer la compensation N10 et la hiérarchie ressentie, sans imposer de formule stricte. Les passifs produisent de vrais gains (U), pas une identité seulement cosmétique.`)
add('W. RNG Variance', `
N10 endgame contre Morgath Némésis ; ${d.meta.trials} combats indépendants, blocs de50. Critiques, esquives, initiative, variance et procs réels.
${table(['Warrior', 'Winrate', 'Blocs50 P10/P50/P90 %', 'Streak max pertes/victoires', 'Fins ±10 %PV', 'Attaques P10/P50/P90', 'Critiques moyens', 'Esquives moyennes'], d.rngRows.map(r => [r.warrior, pct(r.winRate), `${f(r.block50Rates.p10)}/${f(r.block50Rates.median)}/${f(r.block50Rates.p90)}`, `${r.maxLossStreak}/${r.maxWinStreak}`, pct(r.closeFinishPct), `${r.attackActions.p10}/${r.attackActions.median}/${r.attackActions.p90}`, f(r.criticalMean), f(r.dodgeMean)]))}
Renversement opérationnel : à55 % de victoire, les45 % de défaites contredisent la prévision majoritaire. Cela ne prouve pas qu’un critique ait causé chaque perte. Fin ±10 %PV =indicateur de sensibilité, pas attribution causale. Bloc de cinq défaites : probabilité3,125 % à p=50 %, 1,024 % à p=60 %. Les streaks maximums dépendent de la longueur et des seeds ; aucun plafond garanti.

Ablation : même fighter/stats/gear avec warriorId omis pour désactiver le kit, moteur intact. 2000 graines/cellule, deltas en U/JSON. Après un proc les flux RNG divergent : effet global du kit, pas causalité isolée de chaque passif. Le casino Némésis est intentionnel ; un mur à presque0 % avec gear accessible est toutefois une attente de loot, pas automatiquement un bon mur.`)
add('X. Rift Early / Endgame', `
${d.meta.trials} runs/Warrior/profil ; lineup, jitter et règlement réels ; PV pleins et niveau recalculé entre étapes. Benchmark à100 % de difficulté sans pity ; carrières avec pity chronologique. Taux =**atteindre ET gagner** l’étape, full clear observé, non produit de moyennes. Moyenne uniforme des12 Warriors.
${table(['Niveau/gear', 'C1', 'C2', 'C3', 'C4', 'Boss/full clear', 'XP et pièces moyennes/run'], [...new Set(d.riftRows.map(r => [r.level, r.gear].join('|')))].map(key => { const rows = d.riftRows.filter(r => [r.level, r.gear].join('|') === key); return [key.replace('|', '/'), ...[0, 1, 2, 3, 4].map(i => pct(mean(rows.map(r => r.reachWinPct[i])))), f(mean(rows.map(r => r.xpMean)))] }))}
Taux conditionnels et détail par Warrior dans le JSON. Accessible immédiatement ≠gratuit. Moyenne uniforme ≠bienvenue70 % Commun. Karg N1/N2 sans gear : 0 victoire C1/1000, pas preuve d’une probabilité mathématiquement nulle ; borne supérieure95 % ≈0,3 %.

Pity invisible100/90/82/74/68/62/56/50 après défaites quotidiennes ; Force/PV encore×0,7 au plancher, soit budgetPV35 % avant profil/jitter. Après sept échecs, le parcours diffère donc du benchmark100 %. Les carrières gardent la montée et le reset réels, jamais exposés au joueur.

Sans Faille, régulier N10 ${cohort('regular', 'G-no-rift', 'level10')} contre ${cohort('regular', 'C-balanced', 'level10')}, mais moins de raretés extraordinaires. Endgame reste autour de85 % full clear : aucune preuve globale imposant de rouvrir la validation. Gear moyen/bon moins performant sans pity, progression ensuite facilitée. La Faille pèse surtout sur la collection ; 200 XP max ne dominent pas600 Expédition.`)
add('Y. Badges / Masteries', `
24 conditions et récompenses auditées :
${table(['ID', 'Condition actuelle', 'Pièces', 'Compteur/mode'], d.badgeAudit.map(b => [b.id, b.description, b.coins, b.id === 'primal-nemesis' ? 'BUG : prédicat false' : b.id.includes('duel') || b.id.includes('rival') ? 'duelWins' : ['exploit-first-impact', 'exploit-seasoned-fighter', 'exploit-war-machine'].includes(b.id) ? 'adventureWins+riftWins+duelWins' : b.id.startsWith('primal-') && ['level', 'levels', 'elite', 'conqueror'].some(k => b.id.includes(k)) ? 'Nodes Normal uniques ; anciens badges acceptés' : b.id.includes('ascension') || b.id.includes('elite-squad') ? 'Warriors N10' : 'Possessions uniques/catalogue figé']))}
recordBattleOutcome incrémente les victoires Aventure/Faille/Duel ; chaque étage Faille gagné compte, pas seulement5/5. Pertes, abandon et Training retiré ne comptent pas. Replay gagné =victoire exploit, pas nouveau niveau unique. Copies ≠objets différents. grantEarnedBadges paie pièces+badge ensemble ; ID comme reçu, pas de second paiement après reload/doubleappel. Cloud conserve unlockedAt. Les anciens badges Élite/Boss compatibles ne repaient pas un bonus.

**Bug confirmé** : hasCompletedPrimalNemesis retourne false malgré nemesisCompleted persisté. Le badge500 Némésis et donc la Maîtrise1500 sont impossibles sur une carrière normale. Le test existant injecte les12 reçus : 281 tests verts ne prouvent pas ce parcours. Phase2 : fin Némésis→badge→reload→aucun second paiement.

**Condition contradictoire** : posséder12 Warriors donne200 Panthéon. Maîtrise exige12 distinctions, dont Némésis et Arsenal15 IDs historiques (dont les deux Mythiques), pas12 Warriors seulement. Référence humaine1500 conservée ; choisir explicitement la condition. Le catalogue15 est volontairement figé dans un commentaire, mais la Collection présente20 équipements.`)
add('Z. QA New Account', `
Parcours en mémoire réellement exécuté : freshSave300/noWarrior/noGear→bienvenue RNG→main→achats→Aventure/charges→mur→gear/passif3→Faille/Expédition/badges→5/7/10→Morgath→Némésis. Inventaires issus des vraies fonctions, aucun Mythique injecté. Carrière ne finissant pas en60 jours : censurée, jamais complétée via admin.

Jalons, combats, murs, sources et loot auditables par seed. Welcome unique ; récompenses Boss uniques ; XP au Warrior concerné ; niveaux/copies/loadouts vérifiés. Frictions révélées au-delà des unitaires : Expédition dominante et main absent, loot23h36/24h, grind tardif, gear Boss rare, badge Némésis bloqué.

L’URL normale affiche l’auth attendue, console propre. **Aucun nouveau compte Supabase créé**, aucune validation fictive d’un login distant. Unitaires auth/welcome et carrières synthétiques couvrent cette phase ; une UI admin riche ne valide pas le early sans gear.`)
add('AA. QA Advanced Account', `
Fixtures multi-Warriors/niveaux, presets Karg Massue/Tyrak Cœur, progression avancée et Némésis : parseAccountSave conserve niveaux/loadouts, activation restaure le preset, jackpot unique. Reçus/règlements Expédition/Faille, recyclage et capN10 XP0 vérifiés par assertions et unitaires. Le futur personal clear est seulement calculé, aucun marqueur persisté.

Preview navigateur non persistante : Hub, Badges, Expédition. KargN10→envoi→24h via outil QA existant→récupération→reçu affichant +604 XP→Hub toujoursN10. Les tests confirment XP0 : ambiguïté de reçu, pas fuite d’XP. Aucune carrière réelle ou sauvegarde admin persistée modifiée par ces essais.

Hub320×844,390×844,768×1024,1440×900 : aucun overflow horizontal ni image cassée. Badges et Expédition à390 propres ; console0 erreur/warning dans les contrôles locaux. Captures/mesures dans qa-output/v015-responsive.json et v015-expedition-cap-390.png. Ce n’est pas une réapprobation artistique des sprites/HUD.

HTTP200 sur port5173, serveur laissé actif. Les previews héritent du gear admin, ne pas les présenter comme un nouveau joueur sans équipement. Aucune carrière personnelle effacée, aucun compte cloud muté.`)
add('AB. Cloud / Offline', `
Lecture et tests de non-régression : savev5, bootstrap cloud avant écriture, cache userid, CAS, modifications dirty conservées offline, relecture/conflit à la reconnexion, logout retire le jeu sans effacer la carrière, auth invalide refusée, admin isolé dans chronos-age-warriors:admin:v4 (normal chronos.save.userid).

Les tests couvrent origine/port neuf, cache initial dirty ne remplaçant pas un cloud avancé, reset injecté rejeté, course CAS/bootstrap, isolation A/B, changement offline→reconnexion, conflit concurrent, cloud invalide non remplacé par une carrière neuve, Duel flush/relecture serveur, requestId idempotent et noOpponent sans reward/charge. ${test.numPassedTests}/${test.numTotalTests} passants.

**Non testé live** : login Supabase réel, coupure réseau physique, logout/login distant, déploiement backend. Le contexte humain « V0.14.1 backend déployée » est respecté, jamais contredit par un ancien rapport. SQL local/client20/4 concordent ; aucune migration ou Edge exécutée/publiée/configurée. Mocks ≠preuve distante. Architecture intacte, aucun secret lu/reproduit.

Phase2 personnelle : parse/garde monotone des marques, CAS et doubles branches offline sans sommation double d’XP. Recyclage : garder une copie, presets et reçus. Recommandations seulement, aucune architecture modifiée.`)
add('AC. UX Text Issues', `
Propositions uniquement, aucun texte runtime modifié :
${table(['Zone', 'Constat', 'Correction proposée'], [
['Hub charges', 'Combats récompensés /10 Campagne évoque un quota quotidien', 'Charges Aventure x/cap ; +1 toutes les20 minutes'],
['Maîtrise', '12 distinctions UI contre intention12 Warriors=1500', 'Décider la condition puis aligner texte/tests'],
['Badge Némésis', 'Stub false malgré completion persistée', 'Brancher la condition avec vrai test de fin de campagne'],
['Arsenal', '15 IDs/texte15, mais20 équipements UI', 'Choisir catalogue figé ou complet et l’expliciter'],
['Expédition N10', 'Reçu +604 XP alors que0 créditée', 'Niveau maximum — XP non créditée'],
['Recyclage N10', 'Résumé d’XP nominale au cap', 'Afficher XP créditée0/max, pas une conversion'],
['Durée Expédition', '23hxx perd un jet entier', 'Expliquer paliers6h et plafond24h sans encourager les micro-claims'],
['Duel futur', 'Prochain combat dans… est juste actuellement', 'Après validation10/jour : reset Paris seulement'],
['Training', 'Aucun onglet joueur ; identifiant technique utilisé par Faille', 'Pas de renommage interne pour un simple copy cleanup'],
['Personal futur', 'Carte complétée masque la première XP personnelle', 'XP personnelle une fois, jackpot du compte déjà réclamé'],
['Admin', 'Tout le gear peut suggérer une disponibilité early', 'Distinguer fixtures QA et vraie carrière'],
['Lore', 'Archives du temps/traces de victoire : lore, pas erreur', 'Aucun grand polish art/texte dans cette phase']])}
Preuve du reçu au plafond, preview isolée :

![Reçu Expédition : XP nominale au plafond](../qa-output/v015-expedition-cap-390.png)

Validation : pnpm test **${test.numPassedTests}/${test.numTotalTests}**,37 fichiers ; pnpm run lint OK ; pnpm exec tsc -b --pretty false OK ; **pnpm exec vite build OK (client+PWA)**. Warning préexistant JS617,63kB>500kB ; precache≈43MB. pnpm run build inclut build:duel-edge : non lancé pour éviter une régénération Edge inutile, TypeScript et build client/PWA exécutés séparément. Hashes runtime/SQL/Edge/assets préservés.

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
- Expédition QA : http://127.0.0.1:5173/?admin&expeditionPreview&qaWarrior=karg&qaLevel=10`)
add('AD. Recommended V0.15 Phase 2', `
Priorité1 : contradictions badge Némésis/Maîtrise et XP nominale au cap ; définir la cible N10 avec des modes réellement facultatifs. Priorité2 : XP personnelle équitable avec reçus/migration choisis, cap de confort et Duel quotidien côté serveur. Priorité3 : recyclage manuel des surplus sans forge et tests loadout/CAS ; diversité de gear et hiérarchie ensuite, si validées.

Conserver replay5/10, odds normal0,01 %/Faille2 %, jackpots one-shot, Faille endgame≈85 %, aucun catch-up. **Attendre validation humaine : cet audit n’autorise aucune Phase2 implicite.**

### Décisions humaines nécessaires — aucune appliquée

${table(['Décision', 'Proposition', 'Arbitrage nécessaire'], [
['Premier N10', 'Revalider cible5–7 jours régulier, modes facultatifs', 'C/F/G/H : ajuster intention ou disponibilité XP, pas buff aveugle'],
['Casual', 'Accepter environ10 jours avec Expédition main, ou autre cible', 'Régulier≈9 jours, aucune cible casual imposée'],
['Cap Aventure', '15 ; recharge1/20 min inchangée', '20 si objectif20 Aventures/session ;15 pour confort minimum proposé'],
['Duel', '10/jour serveur, reset Paris, aucun bot', 'Actif perd XP/pièces ; sans population=aucune activité'],
['Expédition', '24h naturel et600 comme référence, sans catch-up', 'Accepter retard24 jours sans ce mode et arbitrer rappels du main'],
['Personal first XP', '20 Normal/50 Némésis une fois par Warrior/node/mode', 'XP seulement ; carte/pièces/Boss globaux inchangés'],
['Migration personal', 'Conservatrice ou grâce à regagner en combat', 'Attribution historique absente ; ne pas inférer le main'],
['Maîtrise1500', '12 Warriors OU12 distinctions', 'Actuel12 Warriors=200 ; maîtrise bloquée par stub Némésis'],
['Badge gear', '15 IDs figés OU20 actuels', 'Condition/texte cohérents ; Mythiques nécessaires dans les deux'],
['Recyclage Équipement', 'Manuel balanced3/5/8/12/18/24 ; garder une copie', 'Prudent2/3/5/8/12/18 si sink fort ; jamais autosuffisant'],
['Philosophie gear', 'B : supérieur globalement, inférieur parfois spécialisé', 'Cœur/Peau universels et exceptionnels, pas norme accessible'],
['Hiérarchie puissance', 'Arbitrer niveau dominant face à rareté prioritaire', 'CommunN10 vs MythiqueN5 pas une victoire rare ; aucun nerf automatique'],
['Faille', 'Conserver85 % référence et pity invisible ; XP facultative', 'Collection extraordinaire fortement dépendante de ce mode'],
['Textes fonctionnels', 'XP créditée/nominale et réserve/quota clarifiés', 'Aucun polish UI/art global ni système post-cap']])}`)
const header = ['profile', 'strategy', 'cap', 'duelDaily', 'seed', 'day', 'main', 'level', 'xp', 'coins', 'normalNode', 'nemesisNode', 'warriors', 'equipment', 'warriorPaid', 'equipmentPaid', 'riftChests', 'duplicates', 'adventureBattles', 'duelBattles', 'riftBattles', 'expeditionClaims']
writeFileSync('qa-output/v015-careers.csv', header.join(',') + '\n' + d.careers.flatMap(c => c.snapshots.map(a => [c.profile, c.strategy, c.settings.cap ?? 10, Boolean(c.settings.duelDaily), c.seed, a.day, a.main, a.level, a.xp, a.coins, a.normalNode, a.nemesisNode, a.warriors, a.equipment, ...header.slice(14).map(k => a.metrics[k])].join(','))).join('\n') + '\n')
writeFileSync('qa-output/v015-ledger-validation.json', JSON.stringify({ snapshots, balanced: true, sourceHashes: d.meta.sourceHashes }, null, 2))
console.log(JSON.stringify('# CHRONOS AGE WARRIORS — V0.15 Phase 1\n\n# Global Game Loop / Economy / Progression Audit\n\n' + sections.join('\n')))
