import { describe, expect, it } from 'vitest'
import { campaignBaseXp, campaignNodeTier, PRIMAL_NODE_TIERS } from './campaignProgression'
import { levelTenWarriorCount, exploits, grantEarnedBadges } from './badgeSystem'
import { addWarriorXp, effectiveStats, generateEnemy, grantWarrior, seededRng } from './game'
import { LEGACY_ADMIN_SAVE_KEY, LEGACY_SAVE_KEY, loadSave, SAVE_KEY, SAVE_VERSION } from './storage'
import { establishedKargSave } from './testFixtures'
import { primalWarriors, ownedWarrior } from './warriors'
import { getUnlockedPassiveSlots, getWarriorLevelStats, WARRIOR_XP_REQUIREMENTS } from './warriorProgression'

const levelTen: Record<string, [number, number, number, number]> = {
  karg: [28,18,22,270], naya: [21,27,30,220], brakk: [24,15,17,330], eyla: [23,21,28,235],
  asha: [28,21,25,300], rhex: [27,23,29,280], ursak: [32,17,22,370], saar: [33,31,34,310],
  morga: [34,15,19,420], vorka: [37,27,32,380], urgath: [41,17,21,470], tyrak: [44,18,25,500],
}
const values = (stats: { strength: number; dodge: number; speed: number; hp: number }) => [stats.strength, stats.dodge, stats.speed, stats.hp]

describe('progression Warrior 1→10', () => {
  it('matérialise les cibles de tous les Warriors et les intermédiaires arrondis', () => {
    for (const warrior of primalWarriors) {
      expect(values(getWarriorLevelStats(warrior.id, 1))).toEqual(values(warrior.baseStats))
      expect(values(getWarriorLevelStats(warrior.id, 10))).toEqual(levelTen[warrior.id])
      for (const level of [2, 5, 9]) {
        expect(values(getWarriorLevelStats(warrior.id, level))).toEqual(values(warrior.baseStats).map((start, index) =>
          Math.round(start + (levelTen[warrior.id][index] - start) * (level - 1) / 9)))
      }
    }
  })

  it('retire bonusStats du calcul et conserve les avantages de rareté', () => {
    const save = establishedKargSave()
    save.ownedWarriors.karg.level = 10
    save.ownedWarriors.karg.bonusStats = { strength: 99, dodge: 99, speed: 99, hp: 999 }
    expect(ownedWarrior(save, 'karg').stats).toEqual(getWarriorLevelStats('karg', 10))
    expect(effectiveStats(save).strength).toBe(29) // Massue équipée +1.
    const atTen = (id: string) => getWarriorLevelStats(id, 10)
    expect(atTen('tyrak').strength).toBeGreaterThan(atTen('ursak').strength)
    expect(atTen('ursak').strength).toBeGreaterThan(atTen('karg').strength)
    expect(atTen('tyrak').hp).toBeGreaterThan(atTen('ursak').hp)
    expect(atTen('ursak').hp).toBeGreaterThan(atTen('karg').hp)
    expect(atTen('urgath').hp).toBeGreaterThan(atTen('morga').hp)
    expect(atTen('morga').hp).toBeGreaterThan(atTen('brakk').hp)
    expect(atTen('saar').strength + atTen('saar').dodge + atTen('saar').speed + atTen('saar').hp)
      .toBeGreaterThan(atTen('naya').strength + atTen('naya').dodge + atTen('naya').speed + atTen('naya').hp)
  })

  it('atteint exactement les seuils XP et ignore les gains au maximum', () => {
    expect(WARRIOR_XP_REQUIREMENTS.reduce((sum, value) => sum + value, 0)).toBe(6090)
    const save = establishedKargSave()
    addWarriorXp(save, 119)
    expect(save.ownedWarriors.karg).toMatchObject({ level: 1, xp: 119 })
    addWarriorXp(save, 1)
    expect(save.ownedWarriors.karg).toMatchObject({ level: 2, xp: 0 })
    const fresh = establishedKargSave()
    addWarriorXp(fresh, 300)
    expect(fresh.ownedWarriors.karg).toMatchObject({ level: 3, xp: 0 })
    addWarriorXp(fresh, 5790)
    expect(fresh.ownedWarriors.karg).toMatchObject({ level: 10, xp: 0 })
    addWarriorXp(fresh, 100000)
    expect(fresh.ownedWarriors.karg).toMatchObject({ level: 10, xp: 0 })
  })

  it('prépare uniquement les emplacements de passifs 3/7/10', () => {
    expect([1, 2, 3, 6, 7, 9, 10].map(getUnlockedPassiveSlots)).toEqual([[], [], [1], [1], [1,2], [1,2], [1,2,3]])
  })

  it('migre v2 sans effacer carrière, collection, équipements ni reçus', () => {
    const old = grantWarrior(establishedKargSave(), 'tyrak')
    old.version = 2
    old.ownedWarriors.karg = { warriorId: 'karg', level: 38, xp: 417, bonusStats: { strength: 20, dodge: 1, speed: 1, hp: 200 } }
    old.ownedWarriors.tyrak = { warriorId: 'tyrak', level: 70, xp: 800, bonusStats: { strength: 40, dodge: 0, speed: 0, hp: 400 } }
    old.unlockedSkills = ['Rage']
    old.pendingLevelChoice = true
    old.coins = 1277
    old.campaignNode = 12
    old.defeatedNodes = [1, 2, 3, 5, 10, 11]
    old.badges = [{ id: 'exploit-first-impact', unlockedAt: '2026-01-01' }]
    old.totalWins = 22
    const memory = new Map([[LEGACY_SAVE_KEY, JSON.stringify(old)]])
    const migrated = loadSave({ getItem: (key) => memory.get(key) ?? null })
    expect(migrated.version).toBe(SAVE_VERSION)
    expect(Object.keys(migrated.ownedWarriors)).toEqual(['karg', 'tyrak'])
    expect(migrated.ownedWarriors.karg).toEqual({ warriorId: 'karg', level: 1, xp: 0 })
    expect(migrated.ownedWarriors.tyrak).toEqual({ warriorId: 'tyrak', level: 1, xp: 0 })
    expect(migrated.unlockedSkills).toEqual([])
    expect(migrated.pendingLevelChoice).toBeUndefined()
    expect(migrated.coins).toBe(1277)
    expect(migrated.owned).toEqual(old.owned)
    expect(migrated.loadouts).toEqual(old.loadouts)
    expect(migrated.equippedWeapon).toBe(old.equippedWeapon)
    expect(migrated.equippedArmor).toBe(old.equippedArmor)
    expect(migrated.campaignNode).toBe(12)
    expect(migrated.defeatedNodes).toEqual(old.defeatedNodes)
    expect(migrated.badges).toEqual(old.badges)
    expect(migrated.totalWins).toBe(22)
    expect(memory.has(SAVE_KEY)).toBe(false) // Loading does not overwrite the original.
    const admin = loadSave({ getItem: (key) => key === LEGACY_ADMIN_SAVE_KEY ? JSON.stringify(old) : null }, 'chronos-age-warriors:admin:v3')
    expect(admin.ownedWarriors.tyrak.level).toBe(1)
  })

  it('active Ascension puis Escouade à six Warriors, sans double paiement', () => {
    const save = establishedKargSave()
    for (const warrior of primalWarriors.slice(1, 6)) save.ownedWarriors[warrior.id] = { warriorId: warrior.id, level: 10, xp: 0 }
    expect(levelTenWarriorCount(save)).toBe(5)
    const ascension = exploits.find((entry) => entry.id === 'exploit-ascension')!
    const squad = exploits.find((entry) => entry.id === 'exploit-elite-squad')!
    expect(ascension.progress(save).current).toBe(1)
    expect(squad.progress(save).current).toBe(5)
    save.ownedWarriors.karg.level = 10
    expect(squad.progress(save).current).toBe(6)
    const once = grantEarnedBadges(save)
    expect(once.granted.filter(({ id }) => id === squad.id)).toHaveLength(1)
    expect(grantEarnedBadges(once.save).granted.filter(({ id }) => id === squad.id)).toHaveLength(0)
  })
})

describe('difficulté Primal fixe', () => {
  it('définit 20 tiers immuables sans niveau joueur', () => {
    expect(PRIMAL_NODE_TIERS).toEqual([1,1,2,2,3,3,4,4,4,5,5,5,6,6,7,7,7,8,8,9])
    expect(campaignNodeTier(1)).toBe(1)
    expect(campaignNodeTier(10)).toBe(5)
    expect(campaignNodeTier(20)).toBe(9)
    const enemyFor = (node: number) => generateEnemy(campaignNodeTier(node), node, seededRng(42))
    expect(enemyFor(10).stats.hp).toBeGreaterThan(enemyFor(1).stats.hp)
    expect(enemyFor(20).name).toBe('Morgath, Roi Primordial')
  })

  it('préserve 5 188 XP pour le parcours de 20 victoires et premier bonus Boss', () => {
    const total = Array.from({ length: 20 }, (_, index) => {
      const node = index + 1
      return Math.round(campaignBaseXp(node) * (node === 20 ? 2.5 : [5,10,15].includes(node) ? 1.5 : 1))
    }).reduce((sum, reward) => sum + reward, 500)
    expect(total).toBe(5188)
    const save = establishedKargSave()
    addWarriorXp(save, total)
    expect(save.ownedWarriors.karg).toMatchObject({ level: 9, xp: 678 })
  })
})
