/** V0.15 Phase 1. In-memory analytical careers ONLY. No player storage, HTTP or runtime writes.
 * Run: pnpm exec node scripts/audit-v015-global-loop.mjs --runs=128 --days=60 --trials=1000
 * Source functions are loaded through Vite SSR; all output goes to ignored qa-output/.
 */
import { createServer } from 'vite'
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'

const option = (key, fallback) => Number(process.argv.find(v => v.startsWith(`--${key}=`))?.split('=')[1] ?? fallback)
const runs = option('runs', 128), days = option('days', 60), trials = option('trials', 1000)
assert(runs > 0 && days >= 30 && trials > 0)
const DAY = 86400000, MIN = 60000, start = Date.parse('2026-11-01T09:00:00Z')
const server = await createServer({ server: { middlewareMode: true, ws: false, watch: null }, appType: 'custom', logLevel: 'error' })
const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(`${dir}/${e.name}`) : [`${dir}/${e.name}`])
const hashes = () => Object.fromEntries([...files('src'), ...files('supabase'), 'package.json', 'pnpm-lock.yaml', 'vite.config.ts'].map(path => [path, createHash('sha256').update(readFileSync(path)).digest('hex')]))
const baseline = hashes()
const round = n => Math.round(n * 100) / 100
const mean = list => list.length ? list.reduce((a,b) => a+b,0)/list.length : null
const quantile = (list, p) => { const a=list.filter(Number.isFinite).sort((a,b)=>a-b); return a.length ? a[Math.floor((a.length-1)*p)] : null }
const distribution = list => ({ observed:list.filter(Number.isFinite).length, total:list.length, p10:quantile(list,.1), median:quantile(list,.5), p90:quantile(list,.9) })
let battles = 0
try {
  const load = name => server.ssrLoadModule(`/src/${name}.ts`)
  const [game, storage, roster, catalog, campaign, reserves, rift, expedition, chests, recycle, riftChest, badges, progression, nemesis, config, passives, cloud, duel] = await Promise.all(['game','storage','warriors','data','nemesisCampaign','combatReserves','rift','expedition','chestSystem','warriorRecycle','riftChest','badgeSystem','warriorProgression','nemesisBalance','config','warriorPassives','cloudSave','duelRules'].map(load))
  const warriors=roster.primalWarriors, equipment=catalog.equipment, cumulative=[0]
  for (const xp of progression.WARRIOR_XP_REQUIREMENTS) cumulative.push(cumulative.at(-1)+xp)
  const xpOf = owned => owned ? cumulative[owned.level-1]+owned.xp : 0
  const mainFighter = save => ({ name:roster.warriorDefinitions[save.activeWarriorId].name, warriorId:save.activeWarriorId, level:save.ownedWarriors[save.activeWarriorId].level, stats:game.effectiveStats(save), skills:[], weapon:save.equippedWeapon, armor:save.equippedArmor })
  const fighter = (id,level,weapon='',armor='') => ({ name:id, warriorId:id, level, stats:game.getEffectiveWarriorStats(id,level,weapon,armor),skills:[],weapon,armor })
  const fight = (a,b,seed) => { battles++; return game.simulateBattle(a,b,seed) }
  const rateCache=new Map()
  const pveRate = (id,level,weapon,armor,mode,node,count=80) => {
    const key=[id,level,weapon,armor,mode,node,count].join('|')
    if (!rateCache.has(key)) {
      const enemy=mode==='normal' ? game.generateEnemy(1,node,()=>.5) : nemesis.nemesisEnemy(node)
      let wins=0
      for(let i=0;i<count;i++) wins += fight(fighter(id,level,weapon,armor),enemy,733001+i*97).winner==='player'
      rateCache.set(key,wins/count)
    }
    return rateCache.get(key)
  }
  const gearCache=new Map()
  const chooseGear = save => {
    const id=save.activeWarriorId, level=save.ownedWarriors[id].level
    const mode=save.normalBossFirstClearRewardClaimed ? 'nemesis' : 'normal'
    const node=mode==='nemesis' ? save.nemesisCampaignNode : [5,10,15,20].find(v=>v>=save.campaignNode) ?? 20
    const owned=Object.keys(save.owned).sort(), key=[id,level,mode,node,...owned].join('|')
    if(!gearCache.has(key)) {
      const pool=equipment.filter(e=>save.owned[e.id]), weapons=['',...pool.filter(e=>e.type==='weapon').map(e=>e.id)], armors=['',...pool.filter(e=>e.type==='armor').map(e=>e.id)]
      let best=-1, selected=['',''], tie=-1
      for(const w of weapons) for(const a of armors) {
        const rate=pveRate(id,level,w,a,mode,node), stats=game.getEffectiveWarriorStats(id,level,w,a)
        // Tie-break only: expected basic survival/output, NOT a displayed power score.
        const t=stats.hp/(1-game.dodgeChance(stats.dodge))*game.damageForStrength(stats.strength)*game.speedWeight(stats.speed)
        if(rate>best || rate===best && t>tie) { best=rate;tie=t;selected=[w,a] }
      }
      gearCache.set(key,selected)
    }
    const [weapon,armor]=gearCache.get(key)
    return {...save,equippedWeapon:weapon,equippedArmor:armor,loadouts:{...save.loadouts,[id]:{weapon,armor}}}
  }
  const strategies=[
    {id:'A-warrior', ratio:1}, {id:'B-equipment',ratio:0}, {id:'C-balanced',ratio:.5},
    {id:'D-main',ratio:.25,multiRecall:true}, {id:'E-collection',ratio:.75,secondary:true},
    {id:'F-no-duel',ratio:.5,noDuel:true}, {id:'G-no-rift',ratio:.5,noRift:true},
    {id:'H-no-expedition',ratio:.5,noExpedition:true}, {id:'budget-75',ratio:.75}, {id:'budget-25',ratio:.25},
  ]
  const profiles={casual:{minutes:8,sessions:[0],slots:12,duels:3},regular:{minutes:24,sessions:[0],slots:36,duels:10},active:{minutes:60,sessions:[0,360,720],slots:30,duels:10}}
  const sourceNames=['normal','nemesis','rift','duel','expedition','recycle','badges','boss']
  const career = (profileId,strategy,seed,settings={}) => {
    const profile=profiles[profileId],rng=game.seededRng(seed)
    let save=storage.freshSave();save.lastReset='2026-11-01'
    save=game.claimWelcomeWarrior(save,game.rollWarriorChest(rng).id)
    const main=save.activeWarriorId
    const sources=Object.fromEntries(sourceNames.map(k=>[k,{coins:0,xpMain:0,xpAll:0,nominalXp:0}]))
    const metrics={warriorPaid:0,equipmentPaid:0,warriorFree:0,equipmentFree:0,riftChests:0,duplicates:0,equipmentDuplicates:0,adventureBattles:0,duelBattles:0,riftBattles:0,chargeDenied:0,wallAttempts:0,expeditionClaims:0,spentWarrior:0,spentEquipment:0,duelPoints:0}
    const milestones={level3:null,level5:null,level7:null,level10:null,normalAttempt:null,normalWin:null,nemesisAttempt:null,nemesisWin:null,normal20:null,normal50:null,normal80:null,nemesis20:null,nemesis50:null,nemesis80:null}
    const snapshots=[],trace=[]
    let day=1,now=start,duelHeld=10,duelNext=null
    const transact = (next,source,nominal=0,bonus=0) => {
      const entry=sources[source],beforeAll=Object.values(save.ownedWarriors).reduce((s,w)=>s+xpOf(w),0),afterAll=Object.values(next.ownedWarriors).reduce((s,w)=>s+xpOf(w),0)
      entry.coins+=next.coins-save.coins-bonus;entry.xpMain+=xpOf(next.ownedWarriors[main])-xpOf(save.ownedWarriors[main]);entry.xpAll+=afterAll-beforeAll;entry.nominalXp+=nominal
      if(bonus) sources.boss.coins+=bonus
      save=next
      const awarded=badges.grantEarnedBadges(save,'2026-11-01T00:00:00Z');sources.badges.coins+=awarded.save.coins-save.coins;save=awarded.save
      for(const level of [3,5,7,10]) if(!milestones[`level${level}`] && Object.values(save.ownedWarriors).some(w=>w.level>=level)) milestones[`level${level}`]=day
    }
    const recycleDraw = draw => {
      if(!draw.recycleId) return
      metrics.duplicates++
      transact(recycle.recycleWarrior(save,draw.recycleId),'recycle',recycle.WARRIOR_RECYCLE_REWARDS[roster.warriorDefinitions[draw.warrior?.id ?? draw.warriorId].rarity].xp)
    }
    const stored = () => {
      for(const kind of ['warrior','equipment']) while(save[`${kind}ChestCount`]>0) {
        const purchased=chests.openStoredChest(save,kind,rng);assert(purchased)
        metrics[kind==='warrior'?'warriorFree':'equipmentFree']++;save=purchased.save
        for(const draw of purchased.draws) { if(draw.kind==='warrior') recycleDraw(draw);else metrics.equipmentDuplicates+=draw.duplicate }
        transact(save,'recycle')
      }
      while(save.riftChestCount>0) { const draw=riftChest.openRiftChest(save,rng);assert(draw);save=draw.save;metrics.riftChests++;recycleDraw(draw);transact(save,'recycle') }
    }
    const shop = () => {
      stored()
      let ratio=strategy.ratio
      if(strategy.id==='D-main' && equipment.some(e=>e.type==='weapon'&&save.owned[e.id]&&config.rarityOrder.indexOf(e.rarity)>=2) && equipment.some(e=>e.type==='armor'&&save.owned[e.id]&&config.rarityOrder.indexOf(e.rarity)>=2)) ratio=.5
      // Cumulative gross purchase allocation; no adaptive free-money refill.
      for(let guard=0;guard<500 && save.coins>=25;guard++) {
        const total=metrics.spentWarrior+metrics.spentEquipment
        const kind=ratio===1?'warrior':ratio===0?'equipment':total===0 || metrics.spentWarrior/total<ratio?'warrior':'equipment'
        if(save.coins<chests.CHEST_UNIT_PRICES[kind]) break
        const bought=chests.purchaseChest(save,{kind,quantity:1},rng);assert(bought)
        save=bought.save;metrics[kind==='warrior'?'warriorPaid':'equipmentPaid']++
        metrics[kind==='warrior'?'spentWarrior':'spentEquipment']+=bought.cost
        for(const draw of bought.draws) { if(draw.kind==='warrior') recycleDraw(draw);else metrics.equipmentDuplicates+=draw.duplicate }
        transact(save,'recycle')
      }
      save=chooseGear(save)
    }
    const recall = () => {
      if(!save.expedition) return
      const next=expedition.settleExpedition(save,now,rng)
      transact(next,'expedition',next.expeditionReturn.xp);metrics.expeditionClaims++
    }
    const send = () => {
      if(strategy.noExpedition || save.expedition) return
      const target=strategy.secondary ? Object.keys(save.ownedWarriors).filter(id=>id!==main).sort((a,b)=>xpOf(save.ownedWarriors[a])-xpOf(save.ownedWarriors[b]))[0] ?? main : main
      save=expedition.startExpedition(save,target,now)
    }
    shop()
    for(day=1;day<=days;day++) {
      if(settings.duelDaily) { duelHeld=10;duelNext=null }
      for(const [session,minute] of profile.sessions.entries()) {
        now=start+(day-1)*DAY+minute*MIN
        if(session===0 || strategy.multiRecall) recall()
        shop()
        let used=0
        if(session===0 && !strategy.noRift) {
          save=rift.prepareRift(save,new Date(now),Math.floor(rng()*2**32))
          for(let stage=0;stage<5;stage++) {
            const next=rift.beginRiftStage(save,new Date(now));if(next===save) break
            save=next;const encounter=rift.createRiftEncounter(save,new Date(now));assert(encounter)
            battles++;metrics.riftBattles++;used++
            const settled=rift.resolveRiftStage(save,encounter,encounter.result.winner)
            transact(settled,'rift',encounter.result.winner==='player'?40:0)
            now+=30*1000
            if(encounter.result.winner==='enemy') break
          }
        }
        if(!strategy.noDuel) for(let n=0;n<profile.duels && used<profile.slots;n++) {
          if(!settings.duelDaily) { const charged=reserves.rechargeCharges(duelHeld,duelNext,now);duelHeld=charged.charges;duelNext=charged.nextAt }
          if(!duelHeld) break
          // Analytical population scenario only: independent sampled roster, SAME level and gear.
          // No fake account, bot, HTTP request or claim of actual matchmaking availability.
          const defender=game.rollWarriorChest(rng)
          const result=fight(mainFighter(save),fighter(defender.id,save.ownedWarriors[main].level,save.equippedWeapon,save.equippedArmor),Math.floor(rng()*2**32))
          const won=result.winner==='player',reward=duel.DUEL_REWARDS[won?'win':'loss']
          const resolution={result,xp:reward.xp,coins:reward.coins}
          const applied=duel.applyDuelReward(save,resolution)
          sources.badges.coins+=applied.granted.reduce((s,b)=>s+b.coins,0)
          const next=applied.save;next.coins-=applied.granted.reduce((s,b)=>s+b.coins,0)
          transact(next,'duel',reward.xp);save.coins+=applied.granted.reduce((s,b)=>s+b.coins,0)
          metrics.duelPoints+=duel.duelPoints(roster.warriorDefinitions[main].rarity,defender.rarity,won)
          duelHeld--;duelNext ??= now+20*MIN;metrics.duelBattles++;used++;now+=30*1000
        }
        let failed=0
        while(used<profile.slots) {
          if(expedition.isWarriorOnExpedition(save,main)) break
          const cap=settings.cap ?? 10
          // Clock/cap adapter: production recharge math, hypothetical cap only in this script.
          const recharge = (held,nextAt) => {
            if(cap===10) return reserves.rechargeCharges(held,nextAt,now)
            if(held>=cap) return {charges:cap,nextAt:null}
            if(nextAt!==null && now>=nextAt) { const earned=1+Math.floor((now-nextAt)/(20*MIN)),charges=Math.min(cap,held+earned);return {charges,nextAt:charges===cap?null:nextAt+earned*20*MIN} }
            return {charges:held,nextAt:nextAt ?? now+20*MIN}
          }
          const charge=recharge(save.campaignRemaining,save.campaignRechargeAt)
          if(!charge.charges) { metrics.chargeDenied++;break }
          save={...save,campaignRemaining:charge.charges,campaignRechargeAt:charge.nextAt}
          const mode=save.normalBossFirstClearRewardClaimed?'nemesis':'normal'
          const progress=campaign.campaignProgress(save,mode),id=save.activeWarriorId,level=save.ownedWarriors[id].level
          // Try next wall twice/session; otherwise replay the earliest safe node.
          const node=failed<2 || !progress.defeated.length ? progress.node : 1
          const enemy=mode==='normal'?game.generateEnemy(1,node,()=>.5):nemesis.nemesisEnemy(node)
          if(node===progress.node) metrics.wallAttempts++
          if(node===20 && !milestones[`${mode}Attempt`]) milestones[`${mode}Attempt`]=day
          const result=fight(mainFighter(save),enemy,Math.floor(rng()*2**32)),held=charge.charges-1,nextAt=charge.nextAt ?? now+20*MIN
          const settled=campaign.settleCampaignBattle(save,mode,node,result.winner)
          settled.save.campaignRemaining=held;settled.save.campaignRechargeAt=nextAt
          transact(settled.save,mode,settled.xp,settled.bonusCoins)
          metrics.adventureBattles++;used++;now+=30*1000
          if(result.winner==='enemy') failed++
          if(save.normalBossFirstClearRewardClaimed && !milestones.normalWin) milestones.normalWin=day
          if(save.nemesisCompleted && !milestones.nemesisWin) milestones.nemesisWin=day
          if(level!==save.ownedWarriors[id].level) { failed=0;save=chooseGear(save) }
        }
        now=start+(day-1)*DAY+(minute+profile.minutes/profile.sessions.length)*MIN
        shop()
        if(strategy.multiRecall || session===profile.sessions.length-1 || strategy.secondary) send()
      }
      for(const mode of ['normal','nemesis']) {
        const accessible=mode==='normal'?save.campaignNode===20:save.nemesisUnlocked&&save.nemesisCampaignNode===20
        if(!accessible) continue
        const p=pveRate(main,save.ownedWarriors[main].level,save.equippedWeapon,save.equippedArmor,mode,20,400)
        for(const threshold of [20,50,80]) if(p*100>=threshold && !milestones[`${mode}${threshold}`]) milestones[`${mode}${threshold}`]=day
      }
      const snapshot={day,main,level:save.ownedWarriors[main].level,xp:save.ownedWarriors[main].xp,coins:save.coins,normalNode:save.campaignNode,nemesisNode:save.nemesisUnlocked?save.nemesisCampaignNode:0,warriors:Object.keys(save.ownedWarriors).length,warriorRarities:Object.fromEntries(config.rarityOrder.map(r=>[r,Object.keys(save.ownedWarriors).filter(id=>roster.warriorDefinitions[id].rarity===r).length])),equipment:Object.keys(save.owned).length,equipmentCopies:Object.values(save.owned).reduce((s,e)=>s+e.quantity,0),loadout:[save.equippedWeapon,save.equippedArmor],riftStreak:save.riftLossStreak,riftStatus:save.riftRun?.status,badges:save.badges.length,metrics:{...metrics},sources:structuredClone(sources)}
      if(day<=30 || day===days) snapshots.push(snapshot)
      if(seed===1500001) trace.push({day,level:snapshot.level,node:snapshot.normalNode,nemesis:snapshot.nemesisNode,loadout:snapshot.loadout,expeditionXpMain:sources.expedition.xpMain})
    }
    const delta=milestones.normalWin&&milestones.nemesis50 ? Math.max(0,milestones.nemesis50-milestones.normalWin):null
    return {seed,profile:profileId,strategy:strategy.id,settings,main,milestones,nemesisReasonableExtraDays:delta,snapshots,trace}
  }
  const careers=[]
  for(const profile of Object.keys(profiles)) for(const strategy of strategies) {
    for(let i=0;i<runs;i++) careers.push(career(profile,strategy,1500001+i*7919))
    console.log(`Careers ${profile} / ${strategy.id}: ${runs} × ${days} days`)
  }
  for(const cap of [15,20,25,30]) for(let i=0;i<runs;i++) careers.push(career('regular',strategies[2],1500001+i*7919,{cap}))
  for(const profile of ['regular','active']) for(let i=0;i<runs;i++) careers.push(career(profile,strategies[2],1500001+i*7919,{duelDaily:true}))
  const aggregate = list => ({runs:list.length,milestones:Object.fromEntries(Object.keys(list[0].milestones).map(k=>[k,distribution(list.map(r=>r.milestones[k]))])),nemesisReasonableExtraDays:distribution(list.map(r=>r.nemesisReasonableExtraDays)),level10ByDay:Object.fromEntries([3,5,7,10,14,30,days].map(d=>[d,round(list.filter(r=>r.milestones.level10 && r.milestones.level10<=d).length/list.length*100)])),at:Object.fromEntries([14,30].map(day=> {
    const snapshots=list.map(r=>r.snapshots.find(s=>s.day===day))
    return [day,{level:round(mean(snapshots.map(s=>s.level))),coins:round(mean(snapshots.map(s=>s.coins))),normalNode:round(mean(snapshots.map(s=>s.normalNode))),nemesisNode:round(mean(snapshots.map(s=>s.nemesisNode))),warriors:round(mean(snapshots.map(s=>s.warriors))),equipment:round(mean(snapshots.map(s=>s.equipment))),equipmentCopies:round(mean(snapshots.map(s=>s.equipmentCopies))),metrics:Object.fromEntries(Object.keys(snapshots[0].metrics).map(k=>[k,round(mean(snapshots.map(s=>s.metrics[k])))])),sources:Object.fromEntries(sourceNames.map(k=>[k,Object.fromEntries(Object.keys(snapshots[0].sources[k]).map(f=>[f,round(mean(snapshots.map(s=>s.sources[k][f])))]))]))}]
  }))})
  const groups=Object.fromEntries([...new Set(careers.map(r=>[r.profile,r.strategy,JSON.stringify(r.settings)].join('|')))].map(key=>[key,aggregate(careers.filter(r=>[r.profile,r.strategy,JSON.stringify(r.settings)].join('|')===key))]))
  const quality=[],matchups=[],rngRows=[],riftRows=[],equipmentRanks={}
  for(const warrior of warriors) {
    const combos=[]
    for(const w of equipment.filter(e=>e.type==='weapon')) for(const a of equipment.filter(e=>e.type==='armor')) combos.push({weapon:w.id,armor:a.id,winRate:round(100*pveRate(warrior.id,10,w.id,a.id,'nemesis',20,trials))})
    equipmentRanks[warrior.id]=combos.sort((a,b)=>b.winRate-a.winRate)
    for(const level of [1,3,5,7,9,10]) for(const [label,w,a] of [['none','',''],['common','flint-club','hunter-hides'],['medium','volcanic-hammer','volcanic-shell'],['good','tyrant-claw','white-titan-fur'],['endgame','titan-heart','primordial-titan-skin']]) for(const mode of ['normal','nemesis']) quality.push({warrior:warrior.id,level,gear:label,mode,winRate:round(100*pveRate(warrior.id,level,w,a,mode,20,trials))})
    const player=fighter(warrior.id,10,'titan-heart','primordial-titan-skin'),enemy=nemesis.nemesisEnemy(20)
    let streak=0,maxLoss=0,winStreak=0,maxWin=0,coinFlips=0
    const actions=[],blocks=[],critical=[],dodges=[],remaining=[]
    let wins=0
    for(let i=0;i<trials;i++) {
      const result=fight(player,enemy,2117001+i*97),won=result.winner==='player';wins+=won
      streak=won?0:streak+1;maxLoss=Math.max(maxLoss,streak);winStreak=won?winStreak+1:0;maxWin=Math.max(maxWin,winStreak)
      actions.push(result.events.filter(e=>e.type==='attack').length);critical.push(result.events.filter(e=>e.type==='critical').length);dodges.push(result.events.filter(e=>e.type==='dodge').length)
      remaining.push(won?result.events.at(-1).playerHp/player.stats.hp:-result.events.at(-1).enemyHp/enemy.stats.hp)
      const margin=remaining.at(-1);coinFlips+=Math.abs(margin)<.1
      if((i+1)%50===0) blocks.push(100*mean(remaining.slice(-50).map(m=>Number(m>0))))
    }
    rngRows.push({warrior:warrior.id,winRate:round(wins/trials*100),block50Rates:distribution(blocks),maxLossStreak:maxLoss,maxWinStreak:maxWin,closeFinishPct:round(coinFlips/trials*100),attackActions:distribution(actions),criticalMean:round(mean(critical)),dodgeMean:round(mean(dodges)),finalNormalizedHp:distribution(remaining)})
    for(const [level,label,w,a] of [[1,'none','',''],[2,'none','',''],[3,'common','flint-club','hunter-hides'],[5,'medium','volcanic-hammer','volcanic-shell'],[7,'good','tyrant-claw','white-titan-fur'],[9,'good','tyrant-claw','white-titan-fur'],[10,'good','tyrant-claw','white-titan-fur'],[10,'endgame','titan-heart','primordial-titan-skin']]) {
      const reached=[0,0,0,0,0],won=[0,0,0,0,0]
      for(let i=0;i<trials;i++) {
        let save=game.claimWelcomeWarrior(storage.freshSave(),warrior.id);save.ownedWarriors[warrior.id].level=level
        for(const item of [w,a].filter(Boolean)) save=game.equipItem(game.addEquipmentCopy(save,item),item)
        save=rift.prepareRift(save,new Date(start),3100001+i*97)
        for(let stage=0;stage<5;stage++) {
          save=rift.beginRiftStage(save,new Date(start));const encounter=rift.createRiftEncounter(save,new Date(start));assert(encounter);battles++;reached[stage]++
          save=rift.resolveRiftStage(save,encounter,encounter.result.winner)
          if(encounter.result.winner==='enemy') break
          won[stage]++
        }
      }
      riftRows.push({warrior:warrior.id,level,gear:label,reached,won,conditionalPct:won.map((n,i)=>reached[i]?round(n/reached[i]*100):null),reachWinPct:won.map(n=>round(n/trials*100)),fullClearPct:round(won[4]/trials*100),xpMean:round(won.reduce((s,n)=>s+n,0)*40/trials)})
    }
    console.log(`Matrices / builds / RNG / Rift: ${warrior.id}`)
  }
  const scenarios=[['Commun',10,'Épique',5],['Commun',10,'Légendaire',5],['Commun',10,'Mythique',5],['Peu commun',8,'Rare',6],['Rare',7,'Épique',5],['Commun',7,'Mythique',7],['Commun',10,'Mythique',10]]
  for(const [ra,la,rb,lb] of scenarios) for(const gear of ['', 'medium','endgame']) for(const left of warriors.filter(w=>w.rarity===ra)) for(const right of warriors.filter(w=>w.rarity===rb)) {
    const kit=gear==='medium'?['volcanic-hammer','volcanic-shell']:gear==='endgame'?['titan-heart','primordial-titan-skin']:['','']
    let wins=0
    for(let i=0;i<trials;i++) wins+=fight(fighter(left.id,la,...kit),fighter(right.id,lb,...kit),4190001+i*97).winner==='player'
    matchups.push({left:left.id,leftRarity:ra,leftLevel:la,right:right.id,rightRarity:rb,rightLevel:lb,gear:gear||'none',winRate:round(100*wins/trials)})
  }
  const collection=[]
  for(const n of [10,25,50,100,250,500,1000]) {
    const counts=[],coins=[],xp=[],gearCounts=[]
    for(let i=0;i<5000;i++) {
      const rng=game.seededRng(5500001+i*7919),owned=new Set(),ownedGear=new Set();let c=0,x=0
      for(let j=0;j<n;j++) {
        const w=game.rollWarriorChest(rng)
        if(owned.has(w.id)) { c+=recycle.WARRIOR_RECYCLE_REWARDS[w.rarity].coins;x+=recycle.WARRIOR_RECYCLE_REWARDS[w.rarity].xp } else owned.add(w.id)
        ownedGear.add(game.rollChest(rng,{}).item.id)
      }
      counts.push(owned.size);coins.push(c);xp.push(x);gearCounts.push(ownedGear.size)
    }
    collection.push({draws:n,warriors:distribution(counts),warriorsMean:round(mean(counts)),duplicatesMean:round(n-mean(counts)),recycleCoinsMean:round(mean(coins)),nominalRecycleXpMean:round(mean(xp)),equipment:distribution(gearCounts),equipmentMean:round(mean(gearCounts))})
  }
  const probability=(p,n)=>-Math.expm1(n*Math.log1p(-p))
  const mythic=[100,500,1000,2500,5000,6931,10000,20000].map(n=>({draws:n,probabilityPct:round(100*probability(.0001,n)),days:Object.fromEntries([1,3,5,10].map(d=>[d,round(n/d)])),bothMythicEquipmentPct:round(100*(1-2*Math.exp(n*Math.log1p(-.00005))+Math.exp(n*Math.log1p(-.0001))))}))
  const riftOdds=[1,10,25,35,50,100,150].map(n=>({draws:n,riftMythicPct:round(100*probability(.02,n)),normalMythicPct:round(100*probability(.0001,n))}))
  const recycleTables={prudent:[2,3,5,8,12,18],balanced:[3,5,8,12,18,24],generous:[5,8,12,18,24,24]}
  const equipmentRecycle=Object.entries(recycleTables).map(([name,values])=> {
    const expectation=config.rarityOrder.reduce((s,r,i)=>s+config.EQUIPMENT_CHANCES[r]/100*values[i],0)
    const simulations=[]
    for(let i=0;i<5000;i++) {
      const rng=game.seededRng(6500001+i*7919),owned=new Set();let wallet=250,draws=0,refund=0
      while(wallet>=25 && draws<10000) { wallet-=25;const e=game.rollChest(rng,{}).item;draws++;if(owned.has(e.id)) { const coins=values[config.rarityOrder.indexOf(e.rarity)];wallet+=coins;refund+=coins }else owned.add(e.id) }
      assert(draws<10000);simulations.push({draws,refund,owned:owned.size})
    }
    return {name,values,refundWhenAllOwned:round(expectation),returnFraction:round(expectation/25*100),asymptoticDrawMultiplier:round(25/(25-expectation)),drawsFrom250:distribution(simulations.map(r=>r.draws)),drawMean:round(mean(simulations.map(r=>r.draws))),refundMean:round(mean(simulations.map(r=>r.refund)))}
  })
  const personal=[]
  const levelFrom = xp => { const level=cumulative.findLastIndex(n=>n<=xp)+1;return {level:Math.min(10,level),xp:level>=10?0:xp-cumulative[level-1]} }
  for(const mode of ['normal','nemesis']) for(const nodes of [5,10,15,20]) for(const system of ['current','personal']) {
    const reward=mode==='normal'?(system==='personal'?20:5):(system==='personal'?50:10),xp=nodes*reward
    personal.push({mode,nodes,system,winXp:reward,xp,combats:nodes,charges:nodes,minutesAt30s:nodes/2,...levelFrom(xp)})
  }
  const personalGrind=[]
  for(const mode of ['normal','nemesis']) for(const nodes of [5,10,15,20]) for(const level of [3,5,7,10]) {
    const xp=cumulative[level-1],first=mode==='normal'?20:50,replay=mode==='normal'?5:10
    const firstWins=Math.min(nodes,Math.ceil(xp/first)),wins=firstWins+Math.max(0,Math.ceil((xp-firstWins*first)/replay))
    personalGrind.push({mode,availableNodes:nodes,targetLevel:level,currentWins:Math.ceil(xp/replay),personalWins:wins,currentDaysAt10:round(Math.ceil(xp/replay)/10),personalDaysAt10:round(wins/10),savedWins:Math.ceil(xp/replay)-wins})
  }
  const assertions=[]
  const check=(name,fn)=>{fn();assertions.push({name,passed:true})}
  check('new account, welcome once, no inherited gear',()=>{
    const fresh=storage.freshSave(),s=game.claimWelcomeWarrior(fresh,'karg');assert.equal(fresh.activeWarriorId,'');assert.equal(s.coins,300);assert.deepEqual(s.loadouts.karg,{weapon:'',armor:''});assert.deepEqual(game.claimWelcomeWarrior(s,'naya'),s)
  })
  check('advanced loadouts restored and normalized without loss',()=>{
    let s=game.claimWelcomeWarrior(storage.freshSave(),'karg');s=game.equipItem(game.addEquipmentCopy(s,'flint-club'),'flint-club');s=game.grantWarrior(s,'tyrak');s=game.activateWarrior(s,'tyrak');s=game.equipItem(game.addEquipmentCopy(s,'titan-heart'),'titan-heart');s.ownedWarriors.tyrak.level=8;s.nemesisUnlocked=true;s.defeatedNodes=[1,5,10,15,20];s.campaignNode=20
    const restored=storage.parseAccountSave(JSON.parse(JSON.stringify(s)));assert.equal(game.activateWarrior(restored,'karg').equippedWeapon,'flint-club');assert.equal(restored.ownedWarriors.tyrak.level,8);assert(restored.nemesisUnlocked)
  })
  check('all XP sources retain level10 xp0 and boss receipts are unique',()=>{
    let s=game.claimWelcomeWarrior(storage.freshSave(),'karg');s.ownedWarriors.karg.level=10
    s=campaign.settleCampaignBattle(s,'normal',20,'player').save;const bonus=s.coins;s=campaign.settleCampaignBattle(s,'normal',20,'player').save;assert.equal(s.coins-bonus,5);assert.equal(s.warriorChestCount,10)
    s=campaign.settleCampaignBattle(s,'nemesis',20,'player').save;s=expedition.startExpedition(s,'karg',start);s=expedition.settleExpedition(s,start+DAY,()=>.5);assert.equal(s.ownedWarriors.karg.xp,0);assert.equal(s.ownedWarriors.karg.level,10)
    const exp=s;assert.equal(expedition.settleExpedition(exp,start+DAY,()=>.5),exp)
    const receipt=recycle.queueWarriorRecycle(s,'karg');s=recycle.recycleWarrior(s,receipt);assert.equal(recycle.recycleWarrior(s,receipt),s)
    s=duel.applyDuelReward(s,{xp:20,coins:20,result:{winner:'player'}}).save
    s.riftRun=null;s=rift.prepareRift(s,new Date(start),42);s=rift.beginRiftStage(s,new Date(start));const encounter=rift.createRiftEncounter(s,new Date(start));s=rift.resolveRiftStage(s,encounter,'player');assert.equal(rift.resolveRiftStage(s,encounter,'player'),s);assert.equal(s.ownedWarriors.karg.xp,0)
  })
  check('badge reward once; Némésis mastery unreachable in current predicate',()=>{
    let s=game.claimWelcomeWarrior(storage.freshSave(),'karg');s.defeatedNodes=[1];s.nemesisCompleted=true
    const first=badges.grantEarnedBadges(s);assert(first.granted.length);assert.equal(badges.grantEarnedBadges(first.save).granted.length,0);assert.equal(badges.hasCompletedPrimalNemesis(s),false)
  })
  check('cloud monotonic receipts reject a regressive new-save snapshot',()=>{
    const s=game.claimWelcomeWarrior(storage.freshSave(),'karg');s.ownedWarriors.karg.level=8;assert.equal(cloud.losesProgress(storage.freshSave(),s),true)
  })
  assert.deepEqual(hashes(),baseline)
  const badgeAudit=[...badges.primalBadges,...badges.exploits].map(b=>({id:b.id,title:b.title,description:b.description,grade:b.grade,coins:badges.gradeRewards[b.grade]}))
  const result={meta:{runs,days,trials,careers:careers.length,battles,sourceHashes:baseline,seed:'career 1500001+i*7919; combat/draw independent successive seeded PRNG; rate 733001+i*97; RNG 2117001+i*97; Rift 3100001+i*97; matchups4190001+i*97; collection5500001+i*7919; equipment recycling6500001+i*7919',notes:['In-memory synthetic accounts only; no backend writes.','Matched-level/equal-gear Duel analytical opponents, sampled normal roster odds; availability assumed, NOT observed real population. No-Duel is also no-population scenario.','30s/action presentation and chest/menu time allowance; x3/skip available. Schedule assumptions are not telemetry.','Regular/casual main overnight Expedition; active main overnight 12h, D-main recalls between sessions. E-collection dispatches a secondary once owned.','Gear selection 80 real engine seeds against next elite/Boss; tie-break basic survival/output only. Not perfect player foresight.','Personal clears, equipment recycling, hypothetical cap and Duel daily are analysis-only.','Each source XP is actual credited XP, not advertised reward; cap discards excess.','Level10 milestone is first owned Warrior reaching10; main remains first welcome Warrior, no automatic rarity reroll.','Probability milestone at reachable Boss uses 400 seeds; thresholds have sampling uncertainty.','Career samples right-censored at configured horizon; never treat non-completers as completed.']},profiles,strategies,xpRequirements:progression.WARRIOR_XP_REQUIREMENTS,cumulative,groups,quality,matchups,rngRows,riftRows,equipmentRanks,collection,mythic,riftOdds,equipmentRecycle,personal,personalGrind,warriors:warriors.map(w=>({...w,statsByLevel:Array.from({length:10},(_,i)=>progression.getWarriorLevelStats(w.id,i+1)),passives:passives.warriorPassives[w.id]})),equipment,badgeAudit,assertions,careers}
  mkdirSync('qa-output',{recursive:true});writeFileSync('qa-output/v015-global-loop.json',JSON.stringify(result,null,2))
  const header=['profile','strategy','seed','day','main','level','xp','coins','normalNode','nemesisNode','warriors','equipment','warriorPaid','equipmentPaid','riftChests','duplicates','adventureBattles','duelBattles','riftBattles','expeditionClaims']
  writeFileSync('qa-output/v015-careers.csv',header.join(',')+'\n'+careers.flatMap(c=>c.snapshots.map(s=>[c.profile,c.strategy,c.seed,s.day,s.main,s.level,s.xp,s.coins,s.normalNode,s.nemesisNode,s.warriors,s.equipment,...header.slice(12).map(k=>s.metrics[k])].join(','))).join('\n')+'\n')
  writeFileSync('qa-output/v015-summary.json',JSON.stringify({...result,careers:undefined,sourceHashes:undefined,meta:{...result.meta,sourceHashes:undefined}},null,2))
  console.log(JSON.stringify({careers:careers.length,battles,assertions,output:'qa-output/v015-global-loop.json'}))
} finally { await server.close() }
