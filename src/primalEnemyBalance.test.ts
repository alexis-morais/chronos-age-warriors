import { describe, expect, it } from 'vitest'
import { campaignNodeTier, PRIMAL_NODE_TIERS } from './campaignProgression'
import { equipmentStats, generateEnemy, seededRng, simulateBattle, speedWeight } from './game'
import { PRIMAL_ENEMY_PROFILES, PRIMAL_NODE_STATS, primalEnemyStats, primalNodeKind } from './primalEnemyBalance'
import type { Fighter } from './types'
import { getWarriorLevelStats } from './warriorProgression'
import { WarriorPassiveRuntime } from './warriorPassives'

describe('équilibrage PvE Primal fixe', () => {
  it('préserve les tiers, avec 20 rencontres fixes explicites', () => {
    expect(PRIMAL_NODE_TIERS).toEqual([1,1,2,2,3,3,4,4,4,5,5,5,6,6,7,7,7,8,8,9])
    expect(PRIMAL_NODE_STATS).toHaveLength(20)
    expect(Array.from({ length: 20 }, (_, index) => campaignNodeTier(index + 1))).toEqual([...PRIMAL_NODE_TIERS])
  })

  it('ne lit jamais le niveau du joueur ni sa rareté pour un node donné', () => {
    for (const node of [1, 5, 10, 15, 16, 19, 20]) {
      const fromBeginner = generateEnemy(1, node, seededRng(42))
      const fromVeteran = generateEnemy(10, node, seededRng(42))
      expect(fromBeginner).toEqual(fromVeteran)
      expect(fromBeginner.stats).toEqual(primalEnemyStats(node, seededRng(42)))
    }
  })

  it('réserve les pics Élite, Champion et Boss aux bons nodes', () => {
    expect(Array.from({ length: 20 }, (_, index) => primalNodeKind(index + 1))).toEqual([
      'standard','standard','standard','standard','elite','standard','standard','standard','standard','elite',
      'standard','standard','standard','standard','elite','champion','champion','champion','champion','boss',
    ])
    expect(PRIMAL_NODE_STATS[4].hp).toBeGreaterThan(PRIMAL_NODE_STATS[5].hp)
    expect(PRIMAL_NODE_STATS[9].strength).toBeGreaterThan(PRIMAL_NODE_STATS[10].strength)
    expect(PRIMAL_NODE_STATS[14].hp).toBeGreaterThan(PRIMAL_NODE_STATS[13].hp)
    expect(PRIMAL_NODE_STATS[18].hp).toBeGreaterThan(PRIMAL_NODE_STATS[17].hp)
    const boss = generateEnemy(9, 20, () => .5)
    expect(boss.name).toBe('Morgath, Roi Primordial')
    expect(boss.skills).toContain('Second Souffle')
  })

  it('garde les profils Faille distincts, sans variation RNG en campagne', () => {
    expect(PRIMAL_ENEMY_PROFILES.raptor.speed).toBeGreaterThan(PRIMAL_ENEMY_PROFILES['tribal-warrior'].speed)
    expect(PRIMAL_ENEMY_PROFILES['cave-brute'].strength).toBeGreaterThan(PRIMAL_ENEMY_PROFILES['tribal-warrior'].strength)
    expect(PRIMAL_ENEMY_PROFILES['cave-brute'].speed).toBeLessThan(PRIMAL_ENEMY_PROFILES['tribal-warrior'].speed)
    expect(PRIMAL_ENEMY_PROFILES.mammoth.hp).toBeGreaterThan(PRIMAL_ENEMY_PROFILES['tribal-warrior'].hp)
    for (const node of [1, 10, 16, 20]) {
      const low = primalEnemyStats(node, () => 0), high = primalEnemyStats(node, () => .999)
      for (const stat of ['strength','dodge','speed','hp'] as const) {
        expect(low[stat]).toBeGreaterThan(0)
        expect(high[stat]).toBe(low[stat])
      }
    }
  })

  it('rend le replay du premier node dominant sans rubber-banding', () => {
    const enemy = generateEnemy(1, 1, seededRng(17))
    const fighter = (level: number): Fighter => ({ name: 'Karg', warriorId: 'karg', level, stats: getWarriorLevelStats('karg', level), skills: [] })
    const early = Array.from({ length: 100 }, (_, index) => simulateBattle(fighter(1), enemy, index).winner === 'player').filter(Boolean).length
    const replay = Array.from({ length: 100 }, (_, index) => simulateBattle(fighter(10), enemy, index).winner === 'player').filter(Boolean).length
    expect(replay).toBe(100)
    expect(replay).toBeGreaterThan(early)
  })

  it('traduit chaque crédit de progression en une chance d’initiative supérieure, bornée', () => {
    const p = speedWeight(20), e = speedWeight(20)
    const baseline = p / (p + e)
    let previous = baseline
    for (const credit of [.20, .25, .30, .35]) {
      const runtime = new WarriorPassiveRuntime('naya', 10)
      runtime.credit(credit)
      const chance = p * runtime.actionRateMultiplier() / (p * runtime.actionRateMultiplier() + e)
      expect(chance).toBeGreaterThan(previous)
      expect(chance).toBeLessThan(1)
      runtime.onAction()
      expect(runtime.actionRateMultiplier()).toBe(1)
      previous = chance
    }
  })

  it('produit des pics mesurables aux Élites et un Boss plus dur que le node 19', () => {
    const sample = (level: number, node: number) => {
      const gear = level <= 3 ? ['flint-club','hunter-hides'] : level <= 5 ? ['obsidian-axe','bone-harness'] : ['tyrant-claw','white-titan-fur']
      const stats = { ...getWarriorLevelStats('karg', level) }
      for (const id of gear) for (const [key, value] of Object.entries(equipmentStats(id))) stats[key as keyof typeof stats] += value
      const player: Fighter = { name: 'Karg', warriorId: 'karg', level, stats, skills: [], weapon: gear[0], armor: gear[1] }
      return Array.from({ length: 120 }, (_, index) => {
        const enemy = generateEnemy(campaignNodeTier(node), node, seededRng(node * 100003 + index))
        return simulateBattle(player, enemy, node * 100003 + index + 999).winner === 'player'
      }).filter(Boolean).length
    }
    expect(sample(3, 4)).toBeGreaterThan(sample(3, 5))
    expect(sample(5, 9)).toBeGreaterThan(sample(5, 10))
    expect(sample(7, 14)).toBeGreaterThan(sample(7, 15))
    expect(sample(9, 19)).toBeGreaterThan(sample(9, 20))
  })
})
