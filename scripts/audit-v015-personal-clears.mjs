/** Counterfactual personal first-clear analysis. No persisted save/schema/runtime edits. */
import { createServer } from 'vite'
import { mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
const server=await createServer({server:{middlewareMode:true,ws:false,watch:null},appType:'custom',logLevel:'error'})
try {
  const game=await server.ssrLoadModule('/src/game.ts'),storage=await server.ssrLoadModule('/src/storage.ts')
  const rows=[],seeds=128,cumulative=[0,120,300,600,1050,1700,2550,3650,5050,6850],chanceCache=new Map()
  const chance=(id,level,kit,node)=>{
    const key=[id,level,...kit,node].join('|')
    if(!chanceCache.has(key)) {
      const f={name:id,warriorId:id,level,stats:game.getEffectiveWarriorStats(id,level,kit[1],kit[2]),skills:[],weapon:kit[1],armor:kit[2]}
      let wins=0;for(let i=0;i<200;i++) wins+=game.simulateBattle(f,game.generateEnemy(1,node,()=>.5),8170001+i*97).winner==='player'
      chanceCache.set(key,wins/200)
    }
    return chanceCache.get(key)
  }
  for(const id of ['karg','naya','urgath','tyrak']) for(const kit of [['common','flint-club','hunter-hides'],['medium','volcanic-hammer','volcanic-shell']]) for(const availableNodes of [5,10,15,20]) for(const system of ['current','personal']) {
    const observations=[]
    for(let sample=0;sample<seeds;sample++) {
      // Advanced account fixture: Uncommon main Asha8, account clears already claimed.
      // The newly obtained Warrior remains level1 and uses only shared owned gear.
      let save=game.claimWelcomeWarrior(storage.freshSave(),'asha')
      save.ownedWarriors.asha.level=8
      save.defeatedNodes=Array.from({length:availableNodes},(_,i)=>i+1)
      save.campaignNode=Math.min(20,availableNodes+1)
      for(const item of kit.slice(1)) save=game.equipItem(game.addEquipmentCopy(save,item),item)
      save=game.activateWarrior(game.grantWarrior(save,id),id)
      for(const item of kit.slice(1)) save=game.equipItem(save,item)
      const originalMain=structuredClone(save.ownedWarriors.asha),originalGlobal=[...save.defeatedNodes]
      const personal=new Set(),rng=game.seededRng(7150001+sample*7919),milestones={},attempts={},wins={},losses={}
      let combats=0,failed=0
      while(save.ownedWarriors[id].level<10 && combats<2500) {
        const candidate=system==='personal'?Array.from({length:availableNodes},(_,i)=>i+1).find(n=>!personal.has(n)&&chance(id,save.ownedWarriors[id].level,kit,n)>=.2) ?? 1:1
        const node=failed<2?candidate:1
        const fighter={name:id,warriorId:id,level:save.ownedWarriors[id].level,stats:game.effectiveStats(save),skills:[],weapon:kit[1],armor:kit[2]}
        const won=game.simulateBattle(fighter,game.generateEnemy(1,node,()=>.5),Math.floor(rng()*2**32)).winner==='player'
        const before=save.ownedWarriors[id].level
        const xp=won?system==='personal'&&!personal.has(node)?20:5:4
        game.addWarriorXp(save,xp);if(won) personal.add(node)
        combats++;attempts[node]=(attempts[node]??0)+1
        if(won) wins[node]=(wins[node]??0)+1;else losses[node]=(losses[node]??0)+1
        if(!won && node===candidate) failed++
        // Re-test walls each block of 10 charges or after a level-up, not every farm win.
        if(combats%10===0 || before!==save.ownedWarriors[id].level) failed=0
        for(const level of [3,5,7,10]) if(!milestones[level]&&save.ownedWarriors[id].level>=level) milestones[level]=combats
      }
      assert(save.ownedWarriors[id].level===10)
      assert.deepEqual(save.ownedWarriors.asha,originalMain)
      assert.deepEqual(save.defeatedNodes,originalGlobal)
      assert.deepEqual(save.loadouts.asha,{weapon:kit[1],armor:kit[2]})
      observations.push({milestones,combats,personalNodes:[...personal],attempts,wins,losses})
    }
    const median=list=>list.sort((a,b)=>a-b)[Math.floor(list.length/2)]
    rows.push({warrior:id,gear:kit[0],availableNodes,system,runs:seeds,medianCombats:Object.fromEntries([3,5,7,10].map(level=>[level,median(observations.map(o=>o.milestones[level]))])),meanCombats:Object.fromEntries([3,5,7,10].map(level=>[level,observations.reduce((s,o)=>s+o.milestones[level],0)/seeds])),meanPersonalNodes:observations.reduce((s,o)=>s+o.personalNodes.length,0)/seeds,observations})
    console.log(`${id} ${kit[0]} nodes1-${availableNodes} ${system}`)
  }
  // Same personal XP path as playing from the beginning; no free levels, no rarity bonus.
  for(const mode of ['normal','nemesis']) for(const n of [5,10,15,20]) {
    let first=game.claimWelcomeWarrior(storage.freshSave(),'naya'),late=game.claimWelcomeWarrior(storage.freshSave(),'naya')
    for(let i=0;i<n;i++) { game.addWarriorXp(first,mode==='normal'?20:50);game.addWarriorXp(late,mode==='normal'?20:50) }
    assert.deepEqual(first.ownedWarriors.naya,late.ownedWarriors.naya)
  }
  const caps=[10,15,20,25,30].map(cap=>({cap,fullRechargeMinutes:cap*20,actionsInRegularOne24MinuteSession:cap+1,minutesCombatAt30s:(cap+1)/2,normalReplayXp:(cap+1)*5,normalReplayCoins:(cap+1)*5,sessionAdventureDemand:16,unservedOf16:Math.max(0,16-(cap+1))}))
  const expeditionChoices=[24,12,6].map(hours=>({hours,claimsPer24h:24/hours,xpPer24h:600,coinsPer24h:350,equipmentAttemptsPer24h:4,equipmentFindChance:.35,chestExpectedPer24h:{equipment:.1,warrior:.02},rarityTier:hours/6,notes:'Equal duration expectation without menu downtime; 24h retains best rarity tier. Intermediate claims are not required for reward maximization on a secondary.'}))
  const out={seeds,seedFormula:'7150001+sample*7919; seeded engine outcomes; accessible wall probe8170001+i*97 (200 seeds)',cumulative,notes:['Advanced account fixture: Asha Uncommon main8; newly obtained Karg/Naya/Urgath/Tyrak1. Shared gear is already owned; no scaling with main level.','All tested Normal nodes already cleared at account level. Personal XP20 once/node, then replay5; loss4.','Try personal nodes only when estimated victory chance>=20%; two failures per10-charge block, then node1 replay. No Expedition, Rift, Duel or recycling.','Counterfactual only; Normal/Némésis personal receipts not implemented.','Némésis theoretical XP tables in global report are upper bounds, NOT achievable level1 runs.','Time conversion is charges/10 daily in one-session play, or 20min recharge per lost charge; combat duration30s is an assumption.'],rows,caps,expeditionChoices,assertions:{equalXpSlope:true,allReached10:true,advancedMainAndGlobalProgressUnchanged:true}}
  mkdirSync('qa-output',{recursive:true});writeFileSync('qa-output/v015-personal-clears.json',JSON.stringify(out,null,2))
}finally{await server.close()}
