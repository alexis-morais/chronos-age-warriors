// Frozen-seed calibration using the production combat engine. QA artifacts only.
import { createServer } from 'vite'
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
const option=(k,d)=>Number(process.argv.find(v=>v.startsWith(`--${k}=`))?.split('=')[1]??d)
const major=option('major',5000), trials=option('trials',1000)
assert(major>=5000&&trials>=1000)
const files=['src/warriorProgression.ts','src/warriors.ts','src/game.ts','src/warriorPassives.ts','src/primalEnemyBalance.ts','src/nemesisBalance.ts','src/riftBalance.ts','src/data.ts']
const hashes=()=>Object.fromEntries(files.map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')]))
const baseline=hashes(), server=await createServer({server:{middlewareMode:true,ws:false,watch:null},appType:'custom',logLevel:'error'})
try {
  const load=n=>server.ssrLoadModule(`/src/${n}.ts`)
  const [game,roster,progression,nemesis,rift,data]=await Promise.all(['game','warriors','warriorProgression','nemesisBalance','riftBalance','data'].map(load))
  let battles=0
  const round=n=>Math.round(n*100)/100
  const fighter=(id,level,weapon='',armor='',before=false)=>{
    const s=game.getEffectiveWarriorStats(id,level,weapon,armor)
    if(before) {
      const current=progression.getWarriorLevelStats(id,level),old=progression.PHASE2_LEVEL_STATS[id][level-1]
      for(const [i,k] of ['strength','dodge','speed','hp'].entries())s[k]+=old[i]-current[k]
    }
    return {name:id,warriorId:id,level,stats:s,skills:[],weapon,armor}
  }
  const rate=(a,b,count=trials,seed=733001)=>{let wins=0;for(let i=0;i<count;i++){battles++;wins+=game.simulateBattle(a,b,seed+i*97).winner==='player'}return round(wins/count*100)}
  const kits={none:['',''],common:['flint-club','hunter-hides'],medium:['volcanic-hammer','volcanic-shell'],good:['tyrant-claw','white-titan-fur'],endgame:['titan-heart','primordial-titan-skin']}
  const pairs=[['Commun',10,'Épique',5],['Commun',10,'Légendaire',5],['Commun',10,'Mythique',5],['Commun',8,'Rare',6],['Commun',8,'Épique',5],['Peu commun',8,'Rare',6],['Peu commun',8,'Épique',5],['Rare',7,'Épique',5],['Rare',7,'Légendaire',5],['Commun',5,'Rare',5],['Commun',5,'Épique',5],['Commun',5,'Légendaire',5],['Commun',5,'Mythique',5],['Commun',10,'Mythique',10]]
  const matchups=[]
  for(const [ra,la,rb,lb] of pairs) for(const [gear,kit] of Object.entries(kits).filter(([k])=>['none','medium','endgame'].includes(k))) for(const left of roster.primalWarriors.filter(w=>w.rarity===ra))for(const right of roster.primalWarriors.filter(w=>w.rarity===rb)) {
    matchups.push({left:left.id,leftRarity:ra,leftLevel:la,right:right.id,rightRarity:rb,rightLevel:lb,gear,trials:major,before:rate(fighter(left.id,la,...kit,true),fighter(right.id,lb,...kit,true),major,4190001),after:rate(fighter(left.id,la,...kit),fighter(right.id,lb,...kit),major,4190001)})
  }
  console.log('Rarity matrix complete',battles)
  const sameRarity=[]
  for(const left of roster.primalWarriors) for(const right of roster.primalWarriors.filter(w=>w.rarity===left.rarity&&w.id>left.id)) for(const level of [5,10]) sameRarity.push({left:left.id,right:right.id,level,rate:rate(fighter(left.id,level),fighter(right.id,level),major,5127001)})
  const walls=[], bosses=[], riftRows=[], buildRanks={}
  for(const w of roster.primalWarriors) {
    for(const level of Array.from({length:10},(_,i)=>i+1))for(const [gear,kit] of Object.entries(kits)) {
      for(const node of [5,10,15,20])if(['none','common','good'].includes(gear))walls.push({id:w.id,rarity:w.rarity,level,node,gear,rate:rate(fighter(w.id,level,...kit),game.generateEnemy(1,node,()=>.5))})
      for(const mode of ['normal','nemesis'])bosses.push({id:w.id,rarity:w.rarity,level,gear,mode,rate:rate(fighter(w.id,level,...kit),mode==='normal'?game.generateEnemy(1,20,()=>.5):nemesis.nemesisEnemy(20))})
    }
    for(const level of [1,2,3,5,7,10])for(const gear of (level<=3?['none','common']:level===5?['common','medium']:['good','endgame'])) {
      const f=fighter(w.id,level,...kits[gear]),reached=[0,0,0,0,0],wins=[0,0,0,0,0]
      for(let i=0;i<major;i++) {
        const seed=3100001+i*97,lineup=rift.riftLineup(game.seededRng(seed))
        for(let stage=0;stage<5;stage++) {
          const s=(seed+stage*1000003)>>>0;reached[stage]++;battles++
          if(game.simulateBattle(f,rift.riftEnemy(stage,lineup[stage],100,game.seededRng(s)),s^0x5f3759df).winner!=='player')break
          wins[stage]++
        }
      }
      riftRows.push({id:w.id,rarity:w.rarity,level,gear,trials:major,difficulty:100,reached,wins,conditional:wins.map((n,i)=>reached[i]?round(n/reached[i]*100):null),unconditional:wins.map(n=>round(n/major*100)),fullClear:round(wins[4]/major*100)})
    }
    const profiles={boss:nemesis.nemesisEnemy(20),fast:{name:'Rapide QA',stats:{strength:160,dodge:35,speed:115,hp:1800},skills:[]},tank:{name:'Tank QA',stats:{strength:170,dodge:12,speed:38,hp:2900},skills:[]},dodge:{name:'Esquive QA',stats:{strength:160,dodge:120,speed:70,hp:1750},skills:[]}}
    buildRanks[w.id]={}
    for(const [profile,enemy]of Object.entries(profiles)) {
      const rows=[]
      for(const weapon of data.equipment.filter(e=>e.type==='weapon'))for(const armor of data.equipment.filter(e=>e.type==='armor'))rows.push({weapon:weapon.id,armor:armor.id,rate:rate(fighter(w.id,10,weapon.id,armor.id),enemy,1000,8119001)})
      buildRanks[w.id][profile]=rows.sort((a,b)=>b.rate-a.rate)
    }
    console.log('Walls / bosses / Rift / builds',w.id,battles)
  }
  assert.deepEqual(hashes(),baseline)
  const result={meta:{major,trials,battles,hashes:baseline,seed:'matchups4190001+i*97; sameRarity5127001+i*97; PvE733001+i*97; Rift3100001+i*97; builds8119001+i*97',notes:['All seeds deterministic; real engine/passives/equipment.','Walls/boss cells 1000 trials, major PvP and all Rift profiles5000.','Equal gear on both PvP fighters; sample uncertainty, not exact odds.','Rift full power100; loss-streak assistance is NOT included in this matrix.','Good gear = legendary claw/fur; endgame = mythic heart/skin, access not assumed for fresh accounts.']},profiles:progression.RARITY_STAT_PROFILES,warriors:roster.primalWarriors.map(w=>({id:w.id,rarity:w.rarity,before:progression.PHASE2_LEVEL_STATS[w.id],after:Array.from({length:10},(_,i)=>progression.getWarriorLevelStats(w.id,i+1))})),matchups,sameRarity,walls,bosses,riftRows,buildRanks}
  mkdirSync('qa-output',{recursive:true});writeFileSync('qa-output/v015-final-calibration.json',JSON.stringify(result,null,2))
  console.log('Output qa-output/v015-final-calibration.json')
}finally{await server.close()}
