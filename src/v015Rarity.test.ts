import { describe, expect, it } from 'vitest'
import { getWarriorLevelStats, PHASE2_LEVEL_STATS, WARRIOR_GROWTH_TIERS, xpForLevel } from './warriorProgression'
import { primalWarriors, ownedWarrior } from './warriors'
import { generateEnemy, getEffectiveWarriorStats, grantWarrior, simulateBattle } from './game'
import { nemesisEnemy } from './nemesisBalance'
import { parseAccountSave } from './storage'
import { establishedKargSave } from './testFixtures'
import { losesProgress } from './cloudSave'
import { RIFT_STAGE_BUDGETS, riftEnemy } from './riftBalance'
import type { Fighter } from './types'

const fighter = (id: string, level: number, weapon = '', armor = '') => ({ name: id, warriorId: id, level, stats: getEffectiveWarriorStats(id,level,weapon,armor), skills: [], weapon, armor })
const rate = (id: string, level: number, enemy: Fighter, weapon = '', armor = '') => {
  let wins = 0
  for (let i = 0; i < 600; i++) wins += Number(simulateBattle(fighter(id,level,weapon,armor),enemy,4190001+i*97).winner === 'player')
  return wins/6
}

describe('V0.15 rarity-first canonical stats / unchanged engine', () => {
  it('checks roster tier contracts, Common anchors, XP and identity allocations', () => {
    for (const w of primalWarriors) {
      expect(WARRIOR_GROWTH_TIERS[w.id] ?? 'Commun').toBe(w.rarity)
      expect(getWarriorLevelStats(w.id,1)).toEqual(w.baseStats)
      for(let level=1;level<=10;level++) {
        const s=getWarriorLevelStats(w.id,level)
        if(w.rarity==='Commun')expect([s.strength,s.dodge,s.speed,s.hp]).toEqual(PHASE2_LEVEL_STATS[w.id][level-1])
        expect(Object.values(s).every(Number.isSafeInteger)).toBe(true)
      }
    }
    expect(getWarriorLevelStats('naya',10).speed).toBeGreaterThan(getWarriorLevelStats('brakk',10).speed)
    expect(getWarriorLevelStats('brakk',10).hp).toBeGreaterThan(getWarriorLevelStats('naya',10).hp)
    expect(xpForLevel(9)).toBe(1800)
    expect(getWarriorLevelStats('tyrak',5)).toEqual({ strength:122, dodge:25, speed:38, hp:1577 })
    expect(getWarriorLevelStats('tyrak',10)).toEqual({ strength:138, dodge:28, speed:42, hp:1794 })
  })

  it('higher N5 rarities favor the rare fighter without deterministic Common defeat', () => {
    const commons=primalWarriors.filter(w=>w.rarity==='Commun')
    const averages=['vorka','urgath','tyrak'].map(id=>commons.reduce((s,w)=>s+rate(w.id,10,fighter(id,5)),0)/commons.length)
    averages.forEach(p=>{expect(p).toBeGreaterThan(5);expect(p).toBeLessThan(50)})
    expect(averages[0]).toBeGreaterThan(averages[1]);expect(averages[1]).toBeGreaterThan(averages[2])
    for(const id of ['saar','vorka','urgath','tyrak'])expect(rate('karg',5,fighter(id,5))).toBeLessThan(10)
    expect(rate('karg',10,fighter('tyrak',10))).toBeLessThan(rate('karg',10,fighter('tyrak',5)))
  })

  it('fixed Morgath is not free at Mythic N1/Legendary N3, gear and levels matter', () => {
    const boss=generateEnemy(1,20,()=>.5)
    const asFighter={...boss,warriorId:undefined,level:undefined,weapon:'',armor:''}
    expect(rate('tyrak',1,asFighter)).toBe(0)
    expect(rate('urgath',3,asFighter,'flint-club','hunter-hides')).toBeLessThan(2)
    const middle=rate('tyrak',5,asFighter,'volcanic-hammer','volcanic-shell')
    expect(rate('tyrak',10,asFighter,'volcanic-hammer','volcanic-shell')).toBeGreaterThan(middle+10)
    const n=nemesisEnemy(20),nemesisFighter={...n,warriorId:undefined,level:undefined,weapon:'',armor:''}
    const bare=rate('tyrak',10,nemesisFighter),medium=rate('tyrak',10,nemesisFighter,'volcanic-hammer','volcanic-shell'),endgame=rate('tyrak',10,nemesisFighter,'titan-heart','primordial-titan-skin')
    expect(medium).toBeGreaterThan(bare+10);expect(medium).toBeLessThan(70);expect(endgame).toBeGreaterThan(medium+15)
    expect(rate('karg',10,asFighter,'tyrant-claw','white-titan-fur')).toBeGreaterThan(35)
  })

  it('makes C1 possible for weak Common but not a free reward; enemies do not read identity', () => {
    expect(RIFT_STAGE_BUDGETS[0]).toEqual({strength:14,dodge:10,speed:14,hp:180})
    const enemy={...riftEnemy(0,'tribal-warrior',100,()=>.5),weapon:'',armor:''}
    const one=rate('karg',1,enemy),three=rate('karg',3,enemy)
    expect(one).toBeGreaterThan(0);expect(one).toBeLessThan(35);expect(three).toBeGreaterThan(one)
    expect(enemy.stats).toEqual(RIFT_STAGE_BUDGETS[0])
    expect(RIFT_STAGE_BUDGETS[4]).toEqual({strength:165,dodge:24,speed:40,hp:1600})
  })

  it('derives new stats at existing levels from old/cloud saves with no migration/reset', () => {
    const old=grantWarrior(establishedKargSave(),'tyrak');old.ownedWarriors.tyrak.level=5;old.ownedWarriors.tyrak.xp=123
    old.ownedWarriors.tyrak.bonusStats={strength:999,dodge:999,speed:999,hp:9999}
    old.personalClears.tyrak={normal:[1,2,3],nemesis:[]};old.coins=1234
    const encoded=JSON.stringify(old),restored=parseAccountSave(JSON.parse(encoded))!
    expect(restored.ownedWarriors.tyrak).toEqual({warriorId:'tyrak',level:5,xp:123})
    expect(ownedWarrior(restored,'tyrak').stats).toEqual(getWarriorLevelStats('tyrak',5))
    expect(restored.personalClears).toEqual(old.personalClears);expect(restored.loadouts).toEqual(old.loadouts);expect(restored.coins).toBe(1234)
    expect(losesProgress(restored,old)).toBe(false);expect(JSON.stringify(old)).toBe(encoded)
  })
})
