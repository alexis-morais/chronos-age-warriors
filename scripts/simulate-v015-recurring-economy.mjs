/** Independent behavioral economy, not a subtraction from the Phase 2 career ledger.
 * Established synthetic N10 accounts, zero opening wallet, no Boss/badge/welcome payouts.
 * 30-day acquisition warm-up, then days31–90 measured; real engine/draws/settlements.
 */
import { createServer } from 'vite'
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
const runs=Number(process.argv.find(v=>v.startsWith('--runs='))?.split('=')[1]??128)
const DAY=86400000,start=Date.parse('2026-11-01T09:00:00Z'),days=90,warmup=30
const files=['src/warriorProgression.ts','src/game.ts','src/data.ts','src/chestSystem.ts','src/warriorRecycle.ts','src/equipmentRecycle.ts','src/expedition.ts','src/expeditionBalance.ts','src/rift.ts','src/riftBalance.ts','src/duelRules.ts','src/nemesisCampaign.ts']
const hashes=()=>Object.fromEntries(files.map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')]))
const baseline=hashes(),server=await createServer({server:{middlewareMode:true,ws:false,watch:null},appType:'custom',logLevel:'error'})
try {
  const load=n=>server.ssrLoadModule(`/src/${n}.ts`)
  const [game,storage,roster,data,campaign,rift,expedition,chests,recycle,gearRecycle,riftChest,duel,nemesis]=await Promise.all(['game','storage','warriors','data','nemesisCampaign','rift','expedition','chestSystem','warriorRecycle','equipmentRecycle','riftChest','duelRules','nemesisBalance'].map(load))
  const pools={medium:['volcanic-hammer','volcanic-shell'],good:['tyrant-claw','white-titan-fur'],endgame:['titan-heart','primordial-titan-skin']}
  // Focus ≠ exclusive spending: keep a meaningful equipment budget alongside Warrior draws.
  // Exclusive100% is reported as a separate upper-bound behavior, never hidden.
  const strategies={warrior:.8,balanced:.5,equipment:.25,exclusive:1}
  const metrics=['earned','spent','warriorChests','equipmentChests','warriorRecycle','equipmentRecycle','balance','adventureCoins','riftCoins','duelCoins','expeditionCoins','riftFreeChests','expeditionFreeWarrior','expeditionFreeEquipment','adventureBattles','duelBattles','riftBattles','riftFullClears','minutesEstimated','maxPurchaseChain']
  const rows=[];let battles=0
  for(const [quality,kit]of Object.entries(pools))for(const [strategy,ratio]of Object.entries(strategies))for(let run=0;run<runs;run++) {
    const rng=game.seededRng(9100001+run*7919),main=game.rollWarriorChest(rng).id
    let save=game.claimWelcomeWarrior(storage.freshSave(),main)
    save.ownedWarriors[main].level=10;save.coins=0
    for(const w of roster.primalWarriors.filter(w=>['Commun','Peu commun'].includes(w.rarity)))save=game.grantWarrior(save,w.id)
    for(const id of kit)save=game.equipItem(game.addEquipmentCopy(save,id),id)
    save.defeatedNodes=Array.from({length:20},(_,i)=>i+1);save.campaignNode=20;save.normalBossFirstClearRewardClaimed=true;save.nemesisUnlocked=true;save.nemesisDefeatedNodes=[1,2,3,4,5];save.nemesisCampaignNode=6
    save.personalClears[main]={normal:[...save.defeatedNodes],nemesis:[...save.nemesisDefeatedNodes]}
    save.warriorChestCount=0;save.equipmentChestCount=0;save.riftChestCount=0
    const secondary=Object.keys(save.ownedWarriors).find(id=>id!==main)
    let spentW=0,spentE=0,dayMetrics
    const addCoins=(next,source)=>{const delta=next.coins-save.coins;assert(delta>=0);dayMetrics[source]+=delta;dayMetrics.earned+=delta;save=next}
    const recycleDraw=draw=>{if(draw.recycleId)addCoins(recycle.recycleWarrior(save,draw.recycleId),'warriorRecycle')}
    const recycleGear=()=>{for(const item of data.equipment){const q=save.owned[item.id]?.quantity??0;if(q>1)addCoins(gearRecycle.recycleEquipment(save,item.id,q-1,q,save.equipmentRecycleSequence+1),'equipmentRecycle')}}
    const stored=()=>{
      while(save.riftChestCount){const draw=riftChest.openRiftChest(save,rng);assert(draw);save=draw.save;dayMetrics.riftFreeChests++;recycleDraw(draw)}
      for(const kind of ['warrior','equipment'])while(save[`${kind}ChestCount`]){const draw=chests.openStoredChest(save,kind,rng);assert(draw);save=draw.save;dayMetrics[kind==='warrior'?'expeditionFreeWarrior':'expeditionFreeEquipment']++;for(const reward of draw.draws)recycleDraw(reward)}
    }
    const fighter=()=>({name:main,warriorId:main,level:10,stats:game.effectiveStats(save),skills:[],weapon:save.equippedWeapon,armor:save.equippedArmor})
    const snapshots=[]
    for(let day=1;day<=days;day++) {
      dayMetrics=Object.fromEntries(metrics.map(k=>[k,0]));let now=start+(day-1)*DAY, opening=save.coins
      if(save.expedition)addCoins(expedition.settleExpedition(save,now,rng),'expeditionCoins')
      // Always the same fixed enemy. Farm only an already-personally-cleared node.
      for(let i=0;i<15;i++) {
        const enemy=nemesis.nemesisEnemy(1),result=game.simulateBattle(fighter(),enemy,Math.floor(rng()*2**32));battles++;dayMetrics.adventureBattles++
        const settled=campaign.settleCampaignBattle(save,'nemesis',1,result.winner,{warriorId:main,sequence:save.campaignBattleSequence+1,now})
        assert.equal(settled.bonusCoins,0);assert.equal(settled.bonusChests,0)
        addCoins(settled.save,'adventureCoins');now+=30000
      }
      for(let i=0;i<10;i++) {
        const opponent=game.rollWarriorChest(rng),stats=game.getEffectiveWarriorStats(opponent.id,10,save.equippedWeapon,save.equippedArmor)
        const result=game.simulateBattle(fighter(),{name:opponent.id,warriorId:opponent.id,level:10,stats,skills:[],weapon:save.equippedWeapon,armor:save.equippedArmor},Math.floor(rng()*2**32));battles++;dayMetrics.duelBattles++
        const reward=duel.DUEL_REWARDS[result.winner==='player'?'win':'loss'],applied=duel.applyDuelReward(save,{result,...reward})
        // One-time badges never enter this wallet, including their downstream refund chain.
        applied.save.coins-=applied.granted.reduce((s,b)=>s+b.coins,0)
        addCoins(applied.save,'duelCoins');now+=30000
      }
      save=rift.prepareRift(save,new Date(now),Math.floor(rng()*2**32))
      for(let stage=0;stage<5;stage++) {
        save=rift.beginRiftStage(save,new Date(now));const encounter=rift.createRiftEncounter(save,new Date(now));assert(encounter)
        battles++;dayMetrics.riftBattles++;const settled=rift.resolveRiftStage(save,encounter,encounter.result.winner);addCoins(settled,'riftCoins');now+=30000
        if(encounter.result.winner==='enemy')break
      }
      dayMetrics.riftFullClears+=Number(save.riftRun?.status==='complete')
      stored();recycleGear()
      let bought=0
      while(save.coins>=25) {
        const total=spentW+spentE,kind=ratio===1?'warrior':total===0||spentW/total<ratio?'warrior':'equipment'
        if(save.coins<chests.CHEST_UNIT_PRICES[kind])break
        const draw=chests.purchaseChest(save,{kind,quantity:1},rng);assert(draw);save=draw.save
        dayMetrics.spent+=draw.cost;dayMetrics[kind==='warrior'?'warriorChests':'equipmentChests']++;if(kind==='warrior')spentW+=draw.cost;else spentE+=draw.cost
        for(const reward of draw.draws)recycleDraw(reward)
        recycleGear();bought++;assert(bought<10000)
      }
      // Keep the initial quality bracket: sensitivity scenarios must not silently converge to mythic gear.
      save=expedition.startExpedition(save,secondary,now)
      dayMetrics.balance=save.coins;dayMetrics.maxPurchaseChain=bought
      dayMetrics.minutesEstimated=(dayMetrics.adventureBattles+dayMetrics.duelBattles+dayMetrics.riftBattles)*.5+(dayMetrics.warriorChests+dayMetrics.equipmentChests)*.5+3
      assert.equal(save.coins,opening+dayMetrics.earned-dayMetrics.spent)
      if(day>warmup)snapshots.push({day,...dayMetrics})
    }
    rows.push({quality,strategy,seed:9100001+run*7919,main,initialGear:kit,warriorsAtEnd:Object.keys(save.ownedWarriors).length,snapshots})
    if(run===runs-1)console.log('Independent economy',quality,strategy)
  }
  assert.deepEqual(hashes(),baseline)
  const mean=a=>a.reduce((s,n)=>s+n,0)/a.length,round=n=>Math.round(n*1000)/1000
  const groups=Object.fromEntries(Object.keys(pools).flatMap(q=>Object.keys(strategies).map(s=>{const careers=rows.filter(r=>r.quality===q&&r.strategy===s),snapshots=careers.flatMap(r=>r.snapshots);return [`${q}|${s}`,{careers:careers.length,days:snapshots.length,mean:Object.fromEntries(metrics.map(k=>[k,round(mean(snapshots.map(d=>d[k])))])),warriorChestsPerCareer:careers.map(r=>round(mean(r.snapshots.map(d=>d.warriorChests))))}]})))
  mkdirSync('qa-output',{recursive:true});writeFileSync('qa-output/v015-independent-economy.json',JSON.stringify({meta:{runs,days,warmup,careers:rows.length,battles,sourceHashes:baseline,notes:['Independent wallet simulation, not Phase2 accounting correction.','Established N10 main sampled from normal welcome odds;7Common/Uncommon already owned, no free currency.','Preparation brackets medium/good/endgame held fixed; not the rarity acquisition probability or a fresh-player forecast.','Only replay Némésis1 income, genuine Rift outcomes/pity and Expedition/stored chests.','All first-clear/Boss/badge/welcome payouts and their induced refunds absent.','10 same-level/gear analytical Duel opponents drawn from normal odds; not real population telemetry.','Spending Warrior80/20%, balanced50/50, equipment25/75 and exclusive100% by cumulative gross currency; all surplus gear manually recycled.','15–30 minute daily session;30s/fight and30s/chest+3min overhead. Estimated durations reported rather than assumed.','Secondary sent for next24h; recall interval reflects actual time spent playing.','Zero opening wallet, draws/refunds cascade genuinely until insufficient currency; no accounting adjustment.']},groups,rows},null,2))
  console.log(JSON.stringify(Object.fromEntries(Object.entries(groups).map(([k,g])=>[k,g.mean])),null,2))
}finally{await server.close()}
