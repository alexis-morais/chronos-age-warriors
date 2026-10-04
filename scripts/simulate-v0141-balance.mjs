/** V0.14.1: real engine, deterministic encounters and shared effective-stat calculation. */
import { createServer } from 'vite'
import { mkdirSync, writeFileSync } from 'node:fs'

const option = (name, fallback) => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length+3) ?? fallback
const trials = Number(option('trials','2000'))
const bossTrials = Number(option('boss-trials','5000'))
const loadoutTrials = Number(option('loadout-trials','1000'))
// Archived V0.14 reference only; never imported by the game.
const beforeLevels = {"karg":[[22,15,18,217],[24,16,19,234],[26,17,21,252],[90,28,40,850]],"naya":[[17,22,25,177],[18,24,26,191],[20,25,28,206],[73,45,55,700]],"brakk":[[20,12,14,268],[21,13,15,289],[23,14,16,309],[86,25,32,940]],"eyla":[[19,17,23,190],[20,19,24,205],[22,20,26,220],[85,35,50,820]],"asha":[[22,17,20,240],[24,19,22,260],[26,20,23,280],[90,30,43,880]],"rhex":[[22,19,24,225],[23,20,25,243],[25,22,27,262],[89,35,50,850]],"ursak":[[26,14,18,297],[28,15,19,321],[30,16,21,346],[89,26,38,900]],"saar":[[27,26,28,252],[29,28,30,271],[31,29,32,291],[90,44,54,850]],"morga":[[28,12,15,345],[30,13,16,370],[32,14,18,395],[91,24,33,970]],"vorka":[[31,22,26,308],[33,24,28,332],[35,25,30,356],[94,38,50,920]],"urgath":[[34,13,17,388],[37,15,18,416],[39,16,20,443],[93,26,35,1010]],"tyrak":[[37,15,21,415],[39,16,22,443],[42,17,24,472],[96,28,42,1030]]}
const beforeEnemies = { 15: [65,18,30,800], 16: [63,19,32,760], 17: [68,20,33,810], 18: [74,22,35,870], 19: [80,23,37,950], 20: [145,24,45,1500] }
const nodes = [1,5,10,15,16,17,18,19,20]
const cases = [[1,'none'],[3,'common'],[5,'common'],[5,'medium'],[7,'common'],[7,'medium'],[7,'good'],[8,'medium'],[8,'good'],[9,'medium'],[9,'good'],[9,'endgame'],[10,'medium'],[10,'good'],[10,'endgame']]
const riftCases = [[5,'medium'],[7,'good'],[9,'good'],[9,'endgame'],[10,'medium'],[10,'good'],[10,'endgame']]
const loadouts = { none: [], common: ['flint-club','hunter-hides'], medium: ['volcanic-hammer','volcanic-shell'], good: ['tyrant-claw','white-titan-fur'], endgame: ['titan-heart','primordial-titan-skin'] }
const server = await createServer({ server: { middlewareMode: true, ws: false, watch: null }, appType: 'custom', logLevel: 'error' })
try {
  const game = await server.ssrLoadModule('/src/game.ts')
  const { getWarriorLevelStats, WARRIOR_XP_REQUIREMENTS } = await server.ssrLoadModule('/src/warriorProgression.ts')
  const { primalWarriors } = await server.ssrLoadModule('/src/warriors.ts')
  const { equipment } = await server.ssrLoadModule('/src/data.ts')
  const { nemesisEnemy } = await server.ssrLoadModule('/src/nemesisBalance.ts')
  const { riftEnemy, riftLineup, RIFT_STAGE_BUDGETS } = await server.ssrLoadModule('/src/riftBalance.ts')
  const fighter = (warrior, level, gear) => ({ name: warrior.name, warriorId: warrior.id, level, stats: game.getEffectiveWarriorStats(warrior.id,level,...gear), skills: [], weapon: gear[0], armor: gear[1] })
  const oldFighter = (warrior,level,gear) => {
    const player = fighter(warrior,level,gear)
    if (level >= 7) {
      const old = beforeLevels[warrior.id][level-7], current = getWarriorLevelStats(warrior.id,level)
      for (const [i,key] of ['strength','dodge','speed','hp'].entries()) player.stats[key] += old[i] - current[key]
    }
    return player
  }
  const oldEnemy = node => {
    const enemy = game.generateEnemy(1,node,()=>.5)
    if (beforeEnemies[node]) for (const [i,key] of ['strength','dodge','speed','hp'].entries()) enemy.stats[key] = beforeEnemies[node][i]
    return enemy
  }
  const rate = (player,enemy,count,seedBase) => {
    let wins=0, maxActions=0
    for (let sample=0;sample<count;sample++) {
      const result = game.simulateBattle(player,enemy,seedBase+sample*97)
      wins += result.winner === 'player'
      maxActions = Math.max(maxActions,result.events.filter(event=>event.type==='attack').length)
    }
    return { trials: count, wins, winRate: Math.round(wins/count*10000)/100, maxActions }
  }
  const rows=[], beforeRows=[], combinations=[], rift=[], riftReference=[], curves={}
  for (const warrior of primalWarriors) {
    curves[warrior.id] = Array.from({length:4},(_,i)=> {
      const level=i+7, stats=getWarriorLevelStats(warrior.id,level), previous=getWarriorLevelStats(warrior.id,level-1)
      return {level, stats, gain: Object.fromEntries(Object.keys(stats).map(key=>[key,stats[key]-previous[key]])) }
    })
    for (const [level,gear] of cases) for (const mode of ['normal','nemesis']) for (const node of nodes) {
      const count=node===20 ? bossTrials : trials, seed=node*1000003+level*7919
      rows.push({warrior:warrior.id,level,gear,mode,node,...rate(fighter(warrior,level,loadouts[gear]),mode==='normal' ? game.generateEnemy(1,node,()=>.5) : nemesisEnemy(node),count,seed)})
      if (mode==='normal') beforeRows.push({warrior:warrior.id,level,gear,mode,node,...rate(oldFighter(warrior,level,loadouts[gear]),oldEnemy(node),count,seed)})
    }
    for (const weapon of equipment.filter(item=>item.type==='weapon')) for (const armor of equipment.filter(item=>item.type==='armor')) combinations.push({warrior:warrior.id,weapon:weapon.id,armor:armor.id,...rate(fighter(warrior,10,[weapon.id,armor.id]),nemesisEnemy(20),loadoutTrials,20*1000003+10*7919)})
    for (const [level,gear] of riftCases) {
      const wins=[0,0,0,0,0], conditionalAttempts=[0,0,0,0,0], conditionalWins=[0,0,0,0,0], bossById={}
      let fullClears=0
      for (let sample=0;sample<trials;sample++) {
        const seed=(145267+sample*97)>>>0, lineup=riftLineup(game.seededRng(seed))
        let survived=true
        for (let stage=0;stage<5;stage++) {
          const stageSeed=(seed+stage*1000003)>>>0
          const enemy=riftEnemy(stage,lineup[stage],100,game.seededRng(stageSeed))
          const won=game.simulateBattle(fighter(warrior,level,loadouts[gear]),enemy,stageSeed^0x5f3759df).winner==='player'
          wins[stage]+=won
          if (survived) { conditionalAttempts[stage]++; conditionalWins[stage]+=won }
          survived &&= won
          if (stage===4) { bossById[lineup[stage]] ??= {trials:0,wins:0}; bossById[lineup[stage]].trials++; bossById[lineup[stage]].wins+=won }
        }
        fullClears+=survived
      }
      const pct=value=>Math.round(value/trials*10000)/100
      rift.push({warrior:warrior.id,level,gear,difficulty:100,trials,stageWins:wins,stageRates:wins.map(pct),conditionalAttempts,conditionalWins,fullClears,fullClearRate:pct(fullClears),bossById})
    }
    const referenceBoss = riftEnemy(4,'mammoth',100,()=>.5)
    const oldReferenceBoss = { ...referenceBoss, stats: { strength: 91, dodge: 20, speed: 29, hp: 1176 } }
    riftReference.push({warrior:warrior.id,enemy:'mammoth',difficulty:100,jitter:.5,
      before:rate(oldFighter(warrior,10,loadouts.endgame),oldReferenceBoss,bossTrials,1),
      after:rate(fighter(warrior,10,loadouts.endgame),referenceBoss,bossTrials,1)})
    console.log(`Completed ${warrior.id}: campaign, 100 loadouts, 5-stage Rift.`)
  }
  const ranking=Object.fromEntries(primalWarriors.map(w=> {
    const sorted=combinations.filter(row=>row.warrior===w.id).sort((a,b)=>b.winRate-a.winRate || a.weapon.localeCompare(b.weapon) || a.armor.localeCompare(b.armor))
    return [w.id,{best:sorted[0],worst:sorted.at(-1),top5:sorted.slice(0,5),zeroWinLoadouts:sorted.filter(row=>row.wins===0).length}]
  }))
  const report={trials,bossTrials,loadoutTrials,seedFormula:'Campaign: node*1000003 + level*7919 + sample*97; Rift: run seed 145267+sample*97, real lineup/jitter/encounter seeds; fixed Mammoth reference: 1+sample*97',notes:'Rift 100% difficulty, 0 XP initially, full HP each stage. Stage rates marginal (even when prior stage would lose), full clears observed on the same five seeded encounters, not multiplied averages. No pity. 95% sampling error <= ±2.2 pp at n=2000, ±1.4 pp at n=5000; optimization n=1000 ranking close ties have noise.',loadouts,xp:WARRIOR_XP_REQUIREMENTS,beforeLevels,curves,equipment,enemies:nodes.map(node=>({node,normal:game.generateEnemy(1,node,()=>.5),nemesis:nemesisEnemy(node)})),riftBudgets:RIFT_STAGE_BUDGETS,rows,beforeRows,combinations,ranking,rift,riftReference}
  mkdirSync('qa-output',{recursive:true})
  writeFileSync('qa-output/v0141-balance.json',JSON.stringify(report,null,2))
  const stats=s=>[s.strength,s.dodge,s.speed,s.hp].join('/')
  const lines=['# V0.14.1 — balance mesurée',report.notes,'\n## Progression F/E/V/PV','Warrior|Niveau|V0.14.1|Gain depuis niveau précédent','---|---:|---|---']
  for (const w of primalWarriors) for (const row of curves[w.id]) lines.push(`${w.name}|${row.level}|${stats(row.stats)}|${stats(row.gain)}`)
  lines.push('\n## Niveau 10 avant → après','Warrior|V0.14|V0.14.1','---|---|---')
  for (const w of primalWarriors) lines.push(`${w.name}|${beforeLevels[w.id][3].join('/')}|${stats(curves[w.id][3].stats)}`)
  lines.push('\n## Morgath — pourcentages','Warrior|N9 endgame Normal|N10 moyen Normal|N10 bon Normal|N10 endgame Normal|N10 moyen Némésis|N10 bon Némésis|N10 endgame Némésis','---|---:|---:|---:|---:|---:|---:|---:')
  for (const w of primalWarriors) {
    const value=(level,gear,mode)=>rows.find(r=>r.warrior===w.id&&r.level===level&&r.gear===gear&&r.mode===mode&&r.node===20).winRate
    lines.push([w.name,value(9,'endgame','normal'),...['medium','good','endgame'].map(g=>value(10,g,'normal')),...['medium','good','endgame'].map(g=>value(10,g,'nemesis'))].join('|'))
  }
  lines.push('\n## Campagne — moyenne des douze Warriors, V0.14 → V0.14.1','Niveau Warrior|Gear|Niveau Aventure|Avant %|Après %','---:|---|---:|---:|---:')
  const mean=(group,key='winRate')=>Math.round(group.reduce((a,r)=>a+r[key],0)/group.length*100)/100
  for (const [level,gear] of cases) for (const node of nodes) {
    const match=r=>r.level===level&&r.gear===gear&&r.mode==='normal'&&r.node===node
    lines.push(`${level}|${gear}|${node}|${mean(beforeRows.filter(match))}|${mean(rows.filter(match))}`)
  }
  lines.push('\n## Faille — moyenne, difficulté 100%','Niveau|Gear|C1 %|C2 %|C3 %|C4 %|Boss %|5/5 %','---:|---|---:|---:|---:|---:|---:|---:')
  for (const [level,gear] of riftCases) {
    const group=rift.filter(r=>r.level===level&&r.gear===gear)
    lines.push([level,gear,...[0,1,2,3,4].map(stage=>Math.round(group.reduce((a,r)=>a+r.stageRates[stage],0)/group.length*100)/100),mean(group,'fullClearRate')].join('|'))
  }
  lines.push('\n## Boss Faille / full clear par Warrior N10 endgame','Warrior|Boss %|5/5 %','---|---:|---:')
  for (const w of primalWarriors) { const row=rift.find(r=>r.warrior===w.id&&r.level===10&&r.gear==='endgame'); lines.push(`${w.name}|${row.stageRates[4]}|${row.fullClearRate}`) }
  lines.push('\n## Référence Faille V0.14 — Mammouth fixe, N10 endgame, difficulté 100%','Warrior|V0.14 %|V0.14.1 %','---|---:|---:')
  for (const row of riftReference) lines.push(`${row.warrior}|${row.before.winRate}|${row.after.winRate}`)
  lines.push('\n## 100 combinaisons — Morgath Némésis N10','Warrior|Meilleur|%|Pire (égalité à zéro possible)|%|Combinaisons sans victoire','---|---|---:|---|---:|---:')
  for (const w of primalWarriors) { const r=ranking[w.id]; lines.push(`${w.name}|${r.best.weapon} + ${r.best.armor}|${r.best.winRate}|${r.worst.weapon} + ${r.worst.armor}|${r.worst.winRate}|${r.zeroWinLoadouts}`) }
  writeFileSync('qa-output/v0141-balance.md',lines.join('\n')+'\n')
  console.log(`Saved ${rows.reduce((a,r)=>a+r.trials,0)} current campaign trials + ${beforeRows.reduce((a,r)=>a+r.trials,0)} reference trials + ${combinations.length*loadoutTrials} loadout trials + ${rift.length*trials*5} Rift fights.`)
} finally { await server.close() }
