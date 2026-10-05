/** Additional counterfactual ablations / steady-state loot math. Analysis ONLY. */
import { createServer } from 'vite'
import { mkdirSync,writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
const server=await createServer({server:{middlewareMode:true,ws:false,watch:null},appType:'custom',logLevel:'error'})
try {
  const game=await server.ssrLoadModule('/src/game.ts'),{primalWarriors}=await server.ssrLoadModule('/src/warriors.ts'),{nemesisEnemy}=await server.ssrLoadModule('/src/nemesisBalance.ts'),config=await server.ssrLoadModule('/src/config.ts'),recycle=await server.ssrLoadModule('/src/warriorRecycle.ts'),riftChest=await server.ssrLoadModule('/src/riftChest.ts'),storage=await server.ssrLoadModule('/src/storage.ts'),expedition=await server.ssrLoadModule('/src/expedition.ts')
  const trials=2000,rows=[]
  for(const w of primalWarriors) for(const [gear,weapon,armor] of [['common','flint-club','hunter-hides'],['medium','volcanic-hammer','volcanic-shell'],['good','tyrant-claw','white-titan-fur'],['endgame','titan-heart','primordial-titan-skin']]) for(const mode of ['normal','nemesis']) {
    const fighter={name:w.id,warriorId:w.id,level:10,stats:game.getEffectiveWarriorStats(w.id,10,weapon,armor),skills:[],weapon,armor}
    const enemy=mode==='normal'?game.generateEnemy(1,20,()=>.5):nemesisEnemy(20)
    let normal=0,without=0
    for(let i=0;i<trials;i++) { normal+=game.simulateBattle(fighter,enemy,9310001+i*97).winner==='player';without+=game.simulateBattle({...fighter,warriorId:undefined},enemy,9310001+i*97).winner==='player' }
    rows.push({warrior:w.id,gear,mode,withPassives:normal/trials*100,withoutPassives:without/trials*100,deltaPp:(normal-without)/trials*100})
  }
  const ev=odds=>Object.entries(odds).reduce((s,[r,p])=>s+p/100*recycle.WARRIOR_RECYCLE_REWARDS[r].coins,0)
  const normalEv=ev(config.RARITY_CHANCES),riftEv=ev(riftChest.RIFT_CHEST_ODDS)
  const perWarrior=primalWarriors.map(w=>({warrior:w.id,rarity:w.rarity,probability:config.RARITY_CHANCES[w.rarity]/100/primalWarriors.filter(x=>x.rarity===w.rarity).length,nominalXpPerNormalDraw:config.RARITY_CHANCES[w.rarity]/100/primalWarriors.filter(x=>x.rarity===w.rarity).length*recycle.WARRIOR_RECYCLE_REWARDS[w.rarity].xp}))
  const expeditionTiming=[]
  for(const hours of [6,12,23.6,24]) {
    let coins=0,xp=0,eq=0,eqChest=0,warChest=0,epic=0,legend=0,myth=0
    const rng=game.seededRng(9750001)
    for(let i=0;i<20000;i++) { const r=expedition.rollExpeditionRewards(hours*3600000,rng);xp+=r.xp;coins+=r.coins;eq+=r.equipmentIds.length;eqChest+=r.equipmentChest;warChest+=r.warriorChest;for(const id of r.equipmentIds) { const {equipment}=await server.ssrLoadModule('/src/data.ts');const item=equipment.find(e=>e.id===id);epic+=item.rarity==='Épique';legend+=item.rarity==='Légendaire';myth+=item.rarity==='Mythique' } }
    expeditionTiming.push({hours,xp:xp/20000,coins:coins/20000,equipmentPerReturn:eq/20000,equipmentChestPct:eqChest/200,warriorChestPct:warChest/200,epicPerReturn:epic/20000,legendPerReturn:legend/20000,mythPerReturn:myth/20000})
  }
  // Mathematical day1 minimum via a vanishingly unlikely legal duplicate chain.
  let s=game.claimWelcomeWarrior(storage.freshSave(),'urgath');for(let i=0;i<35;i++) {s.coins-=100;const receipt=recycle.queueWarriorRecycle(s,'urgath');s=recycle.recycleWarrior(s,receipt)}
  assert.equal(s.ownedWarriors.urgath.level,10);assert.equal(s.ownedWarriors.urgath.xp,0);assert.equal(s.coins,3800)
  const result={trials,seed:'9310001+i*97; Expedition20,000 draws9750001',rows,warriorRecycling:{normalCoinsEvAllOwned:normalEv,normalNetCost:100-normalEv,reinvestMultiplier:100/(100-normalEv),riftCoinsEvAllOwned:riftEv,perWarrior,coinsBreakEvenWinDuplicates:'Legend200 / Myth250 exceed purchase100 on individual draws; expected refund remains <100.'},expeditionTiming,minimum:{sessions:1,example:'Welcome Urgath +35 consecutive Legendary duplicates, 7000 nominal XP, final3800coins',probabilityOrder:'0.0014^36 ≈1.82e-103; NOT a usable planning minimum'},assertions:{dayOneLotteryMinimum:true}}
  mkdirSync('qa-output',{recursive:true});writeFileSync('qa-output/v015-sensitivities.json',JSON.stringify(result,null,2));console.log('Sensitivity simulations complete')
}finally{await server.close()}
