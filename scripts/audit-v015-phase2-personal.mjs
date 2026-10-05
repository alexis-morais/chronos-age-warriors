// Actual V0.15 settlements, synthetic in-memory careers only. No catch-up and no storage/network.
import { createServer } from 'vite'
import { mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
const runs=Number(process.argv.find(v=>v.startsWith('--runs='))?.split('=')[1]??64)
const server=await createServer({server:{middlewareMode:true,ws:false,watch:null},appType:'custom',logLevel:'error'})
try {
  const load=n=>server.ssrLoadModule(`/src/${n}.ts`)
  const [game,storage,campaign,nemesis]=await Promise.all(['game','storage','nemesisCampaign','nemesisBalance'].map(load))
  const rows=[],cache=new Map(),start=Date.parse('2026-11-01T09:00:00Z')
  const fighter=(s,id,kit)=>({name:id,warriorId:id,level:s.ownedWarriors[id].level,stats:game.effectiveStats(s),skills:[],weapon:kit[1],armor:kit[2]})
  const enemy=(mode,node)=>mode==='normal'?game.generateEnemy(1,node,()=>.5):nemesis.nemesisEnemy(node)
  const chance=(s,id,kit,mode,node)=>{
    const key=[id,s.ownedWarriors[id].level,...kit,mode,node].join('|')
    if(!cache.has(key)){let wins=0;for(let i=0;i<200;i++)wins+=game.simulateBattle(fighter(s,id,kit),enemy(mode,node),8170001+i*97).winner==='player';cache.set(key,wins/200)}
    return cache.get(key)
  }
  for(const id of ['karg','naya','urgath','tyrak']) for(const kit of [['common','flint-club','hunter-hides'],['medium','volcanic-hammer','volcanic-shell']]) for(const availableNodes of [5,10,15,20]) for(const nemesisNodes of [0,5,20]) {
    const observations=[]
    for(let sample=0;sample<runs;sample++) {
      let save=game.claimWelcomeWarrior(storage.freshSave(),'asha');save.ownedWarriors.asha.level=8
      save.defeatedNodes=Array.from({length:availableNodes},(_,i)=>i+1);save.campaignNode=Math.min(20,availableNodes+1)
      // Partial/full Némésis fixtures represent a globally unlocked account; all Normal nodes are available.
      if(nemesisNodes){save.defeatedNodes=Array.from({length:20},(_,i)=>i+1);save.campaignNode=20}
      save.nemesisUnlocked=availableNodes===20||nemesisNodes>0;save.nemesisDefeatedNodes=Array.from({length:nemesisNodes},(_,i)=>i+1)
      save.nemesisCampaignNode=Math.min(20,nemesisNodes+1);save.normalBossFirstClearRewardClaimed=save.defeatedNodes.includes(20);save.nemesisBossFirstClearRewardClaimed=nemesisNodes===20
      for(const item of kit.slice(1))save=game.equipItem(game.addEquipmentCopy(save,item),item)
      save=game.activateWarrior(game.grantWarrior(save,id),id);for(const item of kit.slice(1))save=game.equipItem(save,item)
      const main=structuredClone(save.ownedWarriors.asha),global=[...save.defeatedNodes],nemesisGlobal=[...save.nemesisDefeatedNodes],rng=game.seededRng(7150001+sample*7919)
      const opportunities=[...save.defeatedNodes.map(node=>({mode:'normal',node})),...save.nemesisDefeatedNodes.map(node=>({mode:'nemesis',node}))]
      const theoreticalXp=opportunities.reduce((s,p)=>s+campaign.FIRST_CLEAR_XP[p.mode][p.node-1],0)
      const milestones={},byNode={};let combats=0,failed=0,earnedPersonalXp=0,paidCoins=0
      while(save.ownedWarriors[id].level<10&&combats<2500){
        const candidate=opportunities.find(p=>!save.personalClears[id]?.[p.mode].includes(p.node)&&chance(save,id,kit,p.mode,p.node)>=.2)??{mode:'normal',node:1}
        const p=failed<2?candidate:{mode:'normal',node:1}
        const won=game.simulateBattle(fighter(save,id,kit),enemy(p.mode,p.node),Math.floor(rng()*2**32)).winner==='player'
        const first=!(save.personalClears[id]?.[p.mode].includes(p.node)),beforeLevel=save.ownedWarriors[id].level
        const settled=campaign.settleCampaignBattle(save,p.mode,p.node,won?'player':'enemy',{warriorId:id,sequence:save.campaignBattleSequence+1,now:start+combats*20*60000})
        if(won&&first){earnedPersonalXp+=settled.xp;assert.equal(settled.coins,0);assert.equal(settled.bonusCoins,0);assert.equal(settled.bonusChests,0)}
        save=settled.save;paidCoins+=settled.coins;combats++;byNode[`${p.mode}:${p.node}`]=(byNode[`${p.mode}:${p.node}`]??0)+1
        if(!won)failed++;if(combats%15===0||beforeLevel!==save.ownedWarriors[id].level)failed=0
        for(const level of [3,5,7,10])if(!milestones[level]&&save.ownedWarriors[id].level>=level)milestones[level]=combats
      }
      assert.deepEqual(save.ownedWarriors.asha,main);assert.deepEqual(save.defeatedNodes,global);assert.deepEqual(save.nemesisDefeatedNodes,nemesisGlobal)
      assert(save.ownedWarriors[id].level===10)
      observations.push({combats,charges:combats,theoreticalXp,earnedPersonalXp,paidCoins,level:save.ownedWarriors[id].level,milestones,personalClears:save.personalClears[id],byNode})
    }
    const median=a=>a.sort((a,b)=>a-b)[Math.floor(a.length/2)]
    rows.push({warrior:id,gear:kit[0],availableNodes,nemesisNodes,runs,theoreticalXp:observations[0].theoreticalXp,medianCombats:Object.fromEntries([3,5,7,10].map(level=>[level,median(observations.map(o=>o.milestones[level]))])),observations})
    console.log(`${id} ${kit[0]} Normal${availableNodes} Némésis${nemesisNodes}`)
  }
  mkdirSync('qa-output',{recursive:true});writeFileSync('qa-output/v015-phase2-personal.json',JSON.stringify({runs,careers:rows.length*runs,seed:'7150001+sample*7919; probe8170001+i*97',notes:['Actual runtime settlements; no other XP source.','Asha8 main preserved; shared common/medium gear.','Attempt a personally uncleared node at >=20% estimated victory chance; two failures then farm1 per15-attempt block.','Full recharge schedule is analytical: one charge per20min, or ceil(attempts/15) separate full-reserve sessions. Not real player telemetry.','Theoretical XP is an upper bound, not a level1 guaranteed win; all account rewards remain unchanged.'],rows},null,2))
}finally{await server.close()}
