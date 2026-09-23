import { describe, expect, it } from 'vitest'
import { RARITY_CHANCES } from './config'
import { addWarriorXp, damageForStrength, dodgeChance, equipmentLevelFromXp, initialStats, rollChest, seededRng, simulateBattle, speedWeight, xpForLevel } from './game'
import { dailyReset, freshSave, loadSave, persistSave, SAVE_KEY } from './storage'
import type { Fighter } from './types'

describe('RNG initiale', () => {
  it('distribue exactement 8 points avec un plafond de 4', () => {
    for (let seed = 0; seed < 100; seed += 1) {
      const stats = initialStats(seededRng(seed))
      const points = stats.strength - 4 + stats.dodge - 4 + stats.speed - 4 + (stats.hp - 100) / 10
      expect(points).toBe(8)
      expect(Math.max(stats.strength - 4, stats.dodge - 4, stats.speed - 4, (stats.hp - 100) / 10)).toBeLessThanOrEqual(4)
    }
  })
})

describe('formules de combat', () => {
  it('calcule des dégâts croissants et la vitesse pondérée', () => {
    expect(damageForStrength(10)).toBeCloseTo(18.37, 1)
    expect(damageForStrength(20)).toBeGreaterThan(damageForStrength(10))
    expect(speedWeight(20)).toBeGreaterThan(speedWeight(10))
  })
  it('plafonne l’esquive à 35 %', () => {
    expect(dodgeChance(4)).toBeGreaterThan(.04)
    expect(dodgeChance(100000)).toBe(.35)
  })
  it('reste déterministe, gère critiques/esquives et limite les actions consécutives à 3', () => {
    const fighter: Fighter = { name: 'A', stats: { strength: 12, dodge: 12, speed: 40, hp: 180 }, skills: ['Précision'] }
    const enemy: Fighter = { name: 'B', stats: { strength: 10, dodge: 18, speed: 4, hp: 170 }, skills: [] }
    const one = simulateBattle(fighter, enemy, 42), two = simulateBattle(fighter, enemy, 42)
    expect(one).toEqual(two)
    expect(one.events.some((event) => ['critical', 'dodge'].includes(event.type))).toBe(true)
    expect(one.consecutiveMax).toBeLessThanOrEqual(3)
  })
})

describe('progression', () => {
  it('respecte les courbes XP Warrior et équipement', () => {
    expect(xpForLevel(1)).toBe(286)
    expect(equipmentLevelFromXp(19).level).toBe(1)
    expect(equipmentLevelFromXp(20).level).toBe(2)
    expect(equipmentLevelFromXp(960).level).toBe(10)
  })
  it('propose un choix au niveau 5 et permet l’attribution de compétence', () => {
    const save = freshSave(2); save.warrior.level = 4
    addWarriorXp(save, xpForLevel(4), seededRng(1))
    expect(save.warrior.level).toBe(5)
    expect(save.pendingLevelChoice).toBe(true)
    save.warrior.skills.push('Rage')
    expect(save.warrior.skills).toContain('Rage')
  })
})

describe('gacha et doublons', () => {
  it('totalise exactement 100 %', () => expect(Object.values(RARITY_CHANCES).reduce((a, b) => a + b, 0)).toBeCloseTo(100, 10))
  it('identifie un doublon et sa conversion', () => {
    const reward = rollChest(() => 0, { 'flint-club': { level: 1, xp: 0, kills: 0 } }, [])
    expect(reward.kind).toBe('equipment')
    if (reward.kind === 'equipment') { expect(reward.duplicate).toBe(true); expect(reward.recycle).toEqual({ coins: 10, xp: 10 }) }
  })
})

describe('sauvegarde et reset quotidien', () => {
  it('persiste notamment la vitesse x1/x2/x3', () => {
    const memory = new Map<string, string>()
    const storage = { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => { memory.set(key, value) } }
    const save = freshSave(); save.speed = 3; persistSave(save, storage)
    expect(memory.has(SAVE_KEY)).toBe(true)
    expect(loadSave(storage).speed).toBe(3)
  })
  it('restaure les compteurs à une nouvelle date locale', () => {
    const save = freshSave(); save.lastReset = '2025-01-01'; save.campaignRemaining = 0; save.trainingRemaining = 0
    dailyReset(save, '2025-01-02')
    expect(save.campaignRemaining).toBe(10); expect(save.trainingRemaining).toBe(100)
  })
})
