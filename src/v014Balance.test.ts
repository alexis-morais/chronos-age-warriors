import { describe, expect, it } from 'vitest'
import { generateEnemy, getEffectiveWarriorStats, seededRng, simulateBattle } from './game'
import { nemesisEnemy } from './nemesisBalance'
import { primalWarriors } from './warriors'
import { riftEnemy, riftLineup } from './riftBalance'

describe('V0.14 murs mesurés avec le vrai moteur', () => {
  it('Morgath distingue niveau 9, niveau 10 et qualité du loadout sans scaling', () => {
    const rates: Record<string, number[]> = {}
    for (const [label, level, weapon, armor, mode] of [
      ['nine', 9, 'titan-heart', 'primordial-titan-skin', 'normal'],
      ['medium', 10, 'volcanic-hammer', 'volcanic-shell', 'normal'],
      ['good', 10, 'tyrant-claw', 'white-titan-fur', 'normal'],
      ['endgame', 10, 'titan-heart', 'primordial-titan-skin', 'normal'],
      ['nemesis', 10, 'titan-heart', 'primordial-titan-skin', 'nemesis'],
    ] as const) {
      rates[label] = primalWarriors.map((warrior) => {
        const stats = getEffectiveWarriorStats(warrior.id, level, weapon, armor)
        const player = { name: warrior.name, warriorId: warrior.id, level, stats, skills: [], weapon, armor }
        const enemy = mode === 'normal' ? generateEnemy(1, 20, () => .5) : nemesisEnemy(20)
        let wins = 0
        for (let sample = 0; sample < 200; sample++) wins += simulateBattle(player, enemy, 20 * 1000003 + level * 7919 + sample * 97).winner === 'player' ? 1 : 0
        return wins / 2
      })
    }
    const mean = (key: string) => rates[key].reduce((sum, rate) => sum + rate, 0) / rates[key].length
    expect(Math.max(...rates.nine)).toBeLessThanOrEqual(8)
    expect(mean('medium')).toBeGreaterThan(8); expect(mean('medium')).toBeLessThan(22)
    expect(mean('good')).toBeGreaterThan(38); expect(mean('good')).toBeLessThan(62)
    expect(mean('endgame')).toBeGreaterThan(78); expect(mean('endgame')).toBeLessThan(96)
    expect(mean('nemesis')).toBeGreaterThan(43); expect(mean('nemesis')).toBeLessThan(65)
  })

  it('Faille pleine difficulté : Boss endgame non garanti, plus dangereux que C1–C4', () => {
    const rates = primalWarriors.map(warrior => {
      const player = { name: warrior.name, warriorId: warrior.id, level: 10, stats: getEffectiveWarriorStats(warrior.id,10,'titan-heart','primordial-titan-skin'), skills: [], weapon: 'titan-heart', armor: 'primordial-titan-skin' }
      const wins=[0,0,0,0,0]
      for (let sample=0;sample<600;sample++) {
        const seed=145267+sample*97, lineup=riftLineup(seededRng(seed))
        for (let stage=0;stage<5;stage++) {
          const stageSeed=(seed+stage*1000003)>>>0
          wins[stage]+=simulateBattle(player,riftEnemy(stage,lineup[stage],100,seededRng(stageSeed)),stageSeed^0x5f3759df).winner==='player' ? 1 : 0
        }
      }
      expect(wins[4]).toBeLessThan(600)
      for (const prior of wins.slice(0,4)) expect(prior).toBeGreaterThanOrEqual(wins[4])
      return wins[4]/6
    })
    const mean=rates.reduce((sum,value)=>sum+value,0)/rates.length
    expect(mean).toBeGreaterThan(78); expect(mean).toBeLessThan(92)
  })

  it('préserve le mur 10 avec gear de départ et une fin de parcours non garantie avant maîtrise', () => {
    const averageRate = (level: number, node: number, weapon: string, armor: string) => {
      let wins=0
      for (const warrior of primalWarriors) {
        const player={name:warrior.name,warriorId:warrior.id,level,stats:getEffectiveWarriorStats(warrior.id,level,weapon,armor),skills:[],weapon,armor}
        for (let sample=0;sample<300;sample++) wins+=simulateBattle(player,generateEnemy(1,node,()=>.5),node*1000003+level*7919+sample*97).winner==='player' ? 1 : 0
      }
      return wins/(primalWarriors.length*3)
    }
    expect(averageRate(5,10,'flint-club','hunter-hides')).toBeLessThan(5)
    const seven=averageRate(7,19,'tyrant-claw','white-titan-fur')
    const eight=averageRate(8,19,'tyrant-claw','white-titan-fur')
    const nine=averageRate(9,19,'tyrant-claw','white-titan-fur')
    expect(seven).toBeLessThan(eight); expect(eight).toBeLessThan(nine)
    expect(nine).toBeLessThan(85)
  })
})
