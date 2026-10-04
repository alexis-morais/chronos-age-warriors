import { describe, expect, it } from 'vitest'
import { grantWarrior } from './game'
import { openRiftChest, RIFT_CHEST_ODDS, rollRiftChestWarrior } from './riftChest'
import { beginRiftStage, createRiftEncounter, parisDateKey, prepareRift, quitRift, resolveRiftStage, riftDifficulty, riftVisibleStages, todayRiftRun } from './rift'
import { riftEnemy, riftLineup, RIFT_REWARDS } from './riftBalance'
import { loadSave, PREVIOUS_SAVE_KEY, SAVE_KEY, SAVE_VERSION } from './storage'
import { establishedKargSave } from './testFixtures'
import { primalWarriors } from './warriors'

const day = new Date('2026-10-03T12:00:00Z')
const tomorrow = new Date('2026-10-04T12:00:00Z')
const ready = () => prepareRift(establishedKargSave(), day, 42)
const fight = (save = ready()) => beginRiftStage(save, day)
const win = (save: ReturnType<typeof ready>) => {
  const encounter = createRiftEncounter(save, day)!
  return resolveRiftStage(save, encounter, 'player')
}

describe('Faille Primordiale — run quotidien', () => {
  it('utilise strictement le calendrier Europe/Paris, y compris aux bascules été/hiver', () => {
    expect(parisDateKey(new Date('2026-03-28T22:30:00Z'))).toBe('2026-03-28')
    expect(parisDateKey(new Date('2026-03-28T23:30:00Z'))).toBe('2026-03-29')
    expect(parisDateKey(new Date('2026-10-24T21:30:00Z'))).toBe('2026-10-24')
    expect(parisDateKey(new Date('2026-10-24T22:30:00Z'))).toBe('2026-10-25')
    const initial = ready()
    expect(todayRiftRun(initial, tomorrow)).toBeNull()
    expect(prepareRift(initial, tomorrow, 99).riftRun?.seed).toBe(99)
  })

  it('ne consomme rien avant le premier combat et garde une séquence stable/non révélée', () => {
    const save = ready()
    expect(save.riftRun).toMatchObject({ status: 'ready', stage: 0, warriorId: '', seed: 42, difficulty: 100 })
    expect(save.riftRun?.lineup).toHaveLength(5)
    expect(new Set(save.riftRun?.lineup).size).toBe(5)
    expect(riftVisibleStages(save.riftRun!)).toEqual([0])
    expect(prepareRift(save, day, 999)).toBe(save)
    expect(quitRift(save, day)).toBe(save)
    const started = fight(save)
    expect(started.riftRun).toMatchObject({ status: 'fighting', warriorId: 'karg' })
    expect(started.riftRun?.lineup).toEqual(save.riftRun?.lineup)
    expect(save.riftRun?.status).toBe('ready')
  })

  it('garde le Warrior verrouillé, ses vraies stats et 100 % PV à chaque combat', () => {
    let save = fight()
    const first = createRiftEncounter(save, day)!
    expect(createRiftEncounter(save, day)).toEqual(first)
    expect(first.player.warriorId).toBe('karg')
    expect(first.player.stats.hp).toBeGreaterThan(0)
    save = win(save)
    expect(save.riftRun?.status).toBe('between')
    expect(riftVisibleStages(save.riftRun!)).toEqual([0, 1])
    save = grantWarrior(save, 'naya')
    save.activeWarriorId = 'naya'
    save = fight(save)
    const second = createRiftEncounter(save, day)!
    expect(second.player.warriorId).toBe('karg')
    expect(second.player.stats.hp).toBeGreaterThanOrEqual(first.player.stats.hp)
    expect(second.player.level).toBeGreaterThanOrEqual(first.player.level!)
    expect(second.result.events[0].playerHp).toBeLessThanOrEqual(second.player.stats.hp)
  })

  it('paie chaque victoire exactement une fois et conserve les gains avant une défaite', () => {
    let save = fight()
    const first = createRiftEncounter(save, day)!
    const afterFirst = resolveRiftStage(save, first, 'player')
    expect(afterFirst.coins - save.coins).toBe(40)
    expect(afterFirst.riftRun).toMatchObject({ stage: 1, earnedCoins: 40, earnedXp: 40, status: 'between' })
    expect(resolveRiftStage(afterFirst, first, 'player')).toBe(afterFirst)
    save = fight(afterFirst)
    const second = createRiftEncounter(save, day)!
    save = resolveRiftStage(save, second, 'player')
    expect(save.riftRun).toMatchObject({ earnedCoins: 80, earnedXp: 80, stage: 2 })
    const coins = save.coins
    save = fight(save)
    const third = createRiftEncounter(save, day)!
    const lost = resolveRiftStage(save, third, 'enemy')
    expect(lost.riftRun).toMatchObject({ status: 'lost', earnedCoins: 80, earnedXp: 80 })
    expect(lost.coins).toBe(coins)
    expect(lost.riftLossStreak).toBe(1)
    expect(beginRiftStage(lost, day)).toBe(lost)
    expect(resolveRiftStage(lost, third, 'enemy')).toBe(lost)
    expect(prepareRift(lost, day, 77)).toBe(lost)
  })

  it('donne 200 pièces, 200 XP et un coffre uniquement au 5/5, puis remet le pity à 100 %', () => {
    let save = ready()
    save.riftLossStreak = 7
    save.riftRun!.difficulty = 50
    const startingCoins = save.coins
    for (let stage = 0; stage < 5; stage++) {
      save = fight(save)
      save = win(save)
      expect(save.riftRun?.earnedCoins).toBe(RIFT_REWARDS.slice(0, stage + 1).reduce((sum, reward) => sum + reward.coins, 0))
    }
    expect(save.riftRun).toMatchObject({ status: 'complete', earnedCoins: 200, earnedXp: 200 })
    expect(save.coins - startingCoins).toBe(200)
    expect(save.riftChestCount).toBe(1)
    expect(save.riftLossStreak).toBe(0)
    expect(prepareRift(save, tomorrow, 12).riftRun?.difficulty).toBe(100)
  })

  it('ne baisse jamais le pity après un abandon volontaire et borne le plancher à 50 %', () => {
    expect(Array.from({ length: 10 }, (_, losses) => riftDifficulty(losses))).toEqual([100, 90, 82, 74, 68, 62, 56, 50, 50, 50])
    const started = fight()
    started.speed = 3
    const abandoned = quitRift(started, day)
    expect(abandoned.riftRun?.status).toBe('quit')
    expect(abandoned.riftLossStreak).toBe(0)
    expect(abandoned.speed).toBe(3)
    expect(beginRiftStage(abandoned, day)).toBe(abandoned)
  })

  it('emploie des budgets fixes indépendants du Warrior et baisse surtout Force/PV au pity', () => {
    const ids = riftLineup(() => .3)
    expect(ids).toHaveLength(5)
    expect(new Set(ids).size).toBe(5)
    const at100 = riftEnemy(4, ids[4], 100, () => .5)
    const at50 = riftEnemy(4, ids[4], 50, () => .5)
    expect(at100.skills).toContain('Second Souffle')
    expect(at50.stats.hp).toBeLessThan(at100.stats.hp)
    expect(at50.stats.strength).toBeLessThan(at100.stats.strength)
    expect(at50.stats.speed / at100.stats.speed).toBeGreaterThan(at50.stats.hp / at100.stats.hp)
  })
})

describe('Coffre de Faille et sauvegarde', () => {
  it('applique la table exacte, sans pity loot, sur tout le roster réel', () => {
    expect(RIFT_CHEST_ODDS).toEqual({ Commun: 5, 'Peu commun': 15, Rare: 40, 'Épique': 28, Légendaire: 10, Mythique: 2 })
    expect(Object.values(RIFT_CHEST_ODDS).reduce((sum, value) => sum + value, 0)).toBe(100)
    for (const [roll, rarity] of [[.01, 'Commun'], [.10, 'Peu commun'], [.35, 'Rare'], [.70, 'Épique'], [.91, 'Légendaire'], [.99, 'Mythique']] as const) {
      expect(rollRiftChestWarrior(() => roll).rarity).toBe(rarity)
    }
    const drawn = new Set(Array.from({ length: 200 }, (_, index) => rollRiftChestWarrior(() => (index % 100) / 100).id))
    expect([...drawn].every((id) => primalWarriors.some((warrior) => warrior.id === id))).toBe(true)
  })

  it('stocke les coffres, refuse un solde nul, et garde les doublons/Warrior actif', () => {
    const save = establishedKargSave()
    expect(openRiftChest(save, () => 0)).toBeNull()
    save.riftChestCount = 2
    const opened = openRiftChest(save, () => 0)!
    expect(opened.duplicate).toBe(true)
    expect(opened.warrior.id).toBe('karg')
    expect(opened.save.riftChestCount).toBe(1)
    expect(opened.save.activeWarriorId).toBe('karg')
    expect(opened.save.chests).toBe(save.chests + 1)
    expect(save.riftChestCount).toBe(2)
  })

  it('migre v3 vers v4 sans toucher la sauvegarde d’origine ni confondre la normale et l’admin', () => {
    const old = establishedKargSave()
    old.version = 3
    old.coins = 1234
    const memory = new Map([[PREVIOUS_SAVE_KEY, JSON.stringify(old)]])
    const normal = loadSave({ getItem: (key) => memory.get(key) ?? null }, SAVE_KEY)
    const admin = loadSave({ getItem: (key) => memory.get(key) ?? null }, 'chronos-age-warriors:admin:v4')
    expect(normal.version).toBe(SAVE_VERSION)
    expect(normal.coins).toBe(1234)
    expect(normal.riftRun).toBeNull()
    expect(normal.riftChestCount).toBe(0)
    expect(admin.coins).not.toBe(1234)
    expect(memory.has(SAVE_KEY)).toBe(false)
    const malformed = { ...normal, riftRun: { ...ready().riftRun!, lineup: ['unknown', 'shaman', 'raptor', 'smilodon', 'mammoth'] } }
    expect(loadSave({ getItem: () => JSON.stringify(malformed) }).riftRun).toBeNull()
  })
})
