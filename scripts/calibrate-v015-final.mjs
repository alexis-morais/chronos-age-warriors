// Candidate-only rarity calibration. Real engine, no account/storage/network writes.
import { createServer } from 'vite'
import { mkdirSync, writeFileSync } from 'node:fs'
const server = await createServer({ server: { middlewareMode: true, ws: false, watch: null }, appType: 'custom', logLevel: 'error' })
const trials = Number(process.argv.find(v => v.startsWith('--trials='))?.split('=')[1] ?? 1000)
try {
  const load = n => server.ssrLoadModule(`/src/${n}.ts`)
  const [game, roster, progression, nemesis, rift] = await Promise.all(['game','warriors','warriorProgression','nemesisBalance','riftBalance'].map(load))
  const tiers = ['Commun','Peu commun','Rare','Épique','Légendaire','Mythique']
  const shapes = [
    null,
    [0,.035,.075,.13,.21,.30,.43,.59,.77,1],
    [0,.065,.15,.30,.48,.59,.69,.79,.89,1],
    [0,.10,.28,.56,.80,.84,.88,.92,.96,1],
    [0,.12,.31,.59,.84,.872,.904,.936,.968,1],
    [0,.14,.34,.62,.87,.896,.922,.948,.974,1],
  ]
  const candidates = [
    { name:'moderate', endpoints:[1,1.02,1.06,1.12,1.24,1.36], shapes },
    { name:'tempered', endpoints:[1,1.015,1.04,1.10,1.18,1.28], shapes },
    { name:'forward', endpoints:[1,1.02,1.06,1.14,1.26,1.38], shapes:shapes.map((s,i)=>i<3?s:s.map((v,l)=>l>1&&l<9?Math.min(.985,v+.04):v)) },
    { name:'identity', endpoints:[1,1.02,1.06,1.20,1.24,1.30], shapes:[...shapes.slice(0,3),
      [0,.10,.30,.60,.90,.92,.94,.96,.98,1],
      [0,.12,.33,.62,.88,.904,.928,.952,.976,1],
      [0,.14,.36,.64,.86,.888,.916,.944,.972,1],
    ] },
  ]
  const stats = (candidate, id, level) => {
    const w=roster.warriorDefinitions[id], tier=tiers.indexOf(w.rarity)
    if(!tier) return progression.getWarriorLevelStats(id,level)
    const first=progression.getWarriorLevelStats(id,1), last=progression.getWarriorLevelStats(id,10), fraction=candidate.shapes[tier][level-1]
    return Object.fromEntries(Object.keys(first).map(k=>[k, Math.round(first[k]+(Math.round(last[k]*(['strength','hp'].includes(k)?candidate.endpoints[tier]:1))-first[k])*fraction)]))
  }
  const fighter=(candidate,id,level,weapon='',armor='')=> {
    const base=game.getEffectiveWarriorStats(id,level), equipped=game.getEffectiveWarriorStats(id,level,weapon,armor), s=stats(candidate,id,level)
    return {name:id,warriorId:id,level,stats:Object.fromEntries(Object.keys(s).map(k=>[k,s[k]+equipped[k]-base[k]])),skills:[],weapon,armor}
  }
  const rate=(a,b,seed=4190001)=> {let wins=0;for(let i=0;i<trials;i++)wins+=game.simulateBattle(a,b,seed+i*97).winner==='player';return wins/trials*100}
  const results=[]
  for(const candidate of candidates) {
    const row={...candidate,matchups:[],bosses:[],rift:[],early:[]}
    for(const left of roster.primalWarriors.filter(w=>w.rarity==='Commun')) for(const right of roster.primalWarriors.filter(w=>['Épique','Légendaire','Mythique'].includes(w.rarity))) row.matchups.push({left:left.id,right:right.id,rate:rate(fighter(candidate,left.id,10),fighter(candidate,right.id,5))})
    for(const w of roster.primalWarriors) {
      for(const level of [1,3,5,9,10]) for(const [gear,weapon,armor] of [['none','',''],['medium','volcanic-hammer','volcanic-shell'],['endgame','titan-heart','primordial-titan-skin']]) for(const mode of ['normal','nemesis']) row.bosses.push({id:w.id,level,gear,mode,rate:rate(fighter(candidate,w.id,level,weapon,armor),mode==='normal'?game.generateEnemy(1,20,()=>.5):nemesis.nemesisEnemy(20),733001)})
      const f=fighter(candidate,w.id,10,'titan-heart','primordial-titan-skin');let wins=0
      for(let i=0;i<trials;i++) {
        const seed=3100001+i*97,lineup=rift.riftLineup(game.seededRng(seed));let all=true
        for(let stage=0;stage<5;stage++) {
          const s=(seed+stage*1000003)>>>0
          if(game.simulateBattle(f,rift.riftEnemy(stage,lineup[stage],100,game.seededRng(s)),s^0x5f3759df).winner!=='player'){all=false;break}
        }
        wins+=all
      }
      row.rift.push({id:w.id,rate:wins/trials*100})
    }
    results.push(row)
    console.log(JSON.stringify({name:candidate.name,matchups:row.matchups,rift:row.rift,bosses:row.bosses.filter(r=>['tyrak','urgath','vorka'].includes(r.id)&&r.mode==='normal'&&(r.level<=3||r.level===5)&&r.gear==='none')}))
  }
  mkdirSync('qa-output',{recursive:true});writeFileSync('qa-output/v015-final-candidates.json',JSON.stringify({trials,results},null,2))
} finally {await server.close()}
