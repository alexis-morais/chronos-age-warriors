// Candidate-only equipment probe: no persisted saves, source edits or network.
import { createServer } from 'vite'
import { writeFileSync } from 'node:fs'
const server=await createServer({server:{middlewareMode:true,ws:false,watch:null},appType:'custom',logLevel:'error'})
try {
  const [game,storage,data,roster,nemesis]=await Promise.all(['game','storage','data','warriors','nemesisBalance'].map(n=>server.ssrLoadModule(`/src/${n}.ts`)))
  const candidates=[
    {name:'current',changes:{}},
    {name:'balanced',changes:{'primordial-titan-skin':{hp:600,dodge:35},'storm-javelin':{strength:65,speed:45,dodge:16},'tyrant-claw':{strength:85,speed:14},'white-titan-fur':{hp:450,strength:25}}},
    {name:'original-myth',changes:{'primordial-titan-skin':{hp:650,dodge:25},'storm-javelin':{strength:65,speed:45,dodge:16},'tyrant-claw':{strength:85,speed:14},'white-titan-fur':{hp:450,strength:25}}},
  ]
  const originals=structuredClone(data.equipment),rows=[]
  for(const candidate of candidates){
    for(const item of data.equipment)item.stats=candidate.changes[item.id]??originals.find(x=>x.id===item.id).stats
    const result={...candidate,warriors:{}}
    for(const id of Object.keys(roster.warriorDefinitions)){
      const rates=[]
      for(const level of [9,10])for(const weapon of ['titan-heart','tyrant-claw','storm-javelin'])for(const armor of ['primordial-titan-skin','ancestor-guard','white-titan-fur']){
        let save=game.claimWelcomeWarrior(storage.freshSave(),id);save.ownedWarriors[id].level=level
        for(const item of [weapon,armor])save=game.equipItem(game.addEquipmentCopy(save,item),item)
        const f={name:id,warriorId:id,level,stats:game.effectiveStats(save),skills:[],weapon,armor}
        for(const profile of ['normal','nemesis','fast','tank','dodge']){
          const e=profile==='normal'?game.generateEnemy(1,20,()=>.5):profile==='nemesis'?nemesis.nemesisEnemy(20):{name:profile,skills:[],stats:profile==='fast'?{strength:160,dodge:35,speed:115,hp:1800}:profile==='tank'?{strength:170,dodge:12,speed:38,hp:2900}:{strength:160,dodge:120,speed:70,hp:1750}}
          let wins=0;for(let i=0;i<600;i++)wins+=game.simulateBattle(f,e,8119001+i*97).winner==='player'
          rates.push({level,weapon,armor,profile,rate:wins/6})
        }
      }
      result.warriors[id]=rates
    }
    rows.push(result)
    console.log(candidate.name,JSON.stringify({n9MythMax:Math.max(...Object.values(result.warriors).flat().filter(x=>x.level===9&&x.profile==='normal'&&x.weapon==='titan-heart'&&x.armor==='primordial-titan-skin').map(x=>x.rate)),tops:Object.fromEntries(Object.entries(result.warriors).map(([id,rs])=>[id,Object.fromEntries(['nemesis','fast','tank','dodge'].map(p=>[p,rs.filter(x=>x.level===10&&x.profile===p).sort((a,b)=>b.rate-a.rate).slice(0,2)]))]))}))
  }
  writeFileSync('qa-output/v015-equipment-probe.json',JSON.stringify({seeds:'8119001+i*97; 600 trials per cell',rows},null,2))
}finally{await server.close()}
