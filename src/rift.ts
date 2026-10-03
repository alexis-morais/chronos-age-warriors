import { enemyIds, type EnemyId } from './art/assetsV04'
import { addWarriorXp, effectiveStats, seededRng, simulateBattle } from './game'
import { riftEnemy, riftLineup, RIFT_REWARDS } from './riftBalance'
import type { BattleResult, Fighter, RiftRun, SaveData } from './types'
import { recordBattleOutcome } from './victories'
import { ownedWarrior } from './warriors'
import { isWarriorOnExpedition } from './expedition'

export const RIFT_DIFFICULTIES = [100, 90, 82, 74, 68, 62, 56, 50] as const
export const riftDifficulty = (lossStreak: number) => RIFT_DIFFICULTIES[Math.min(7, Math.max(0, Math.trunc(lossStreak) || 0))]

/** Calendar date in Paris, independent of the device's timezone and DST setting. */
export function parisDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  const field = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${field('year')}-${field('month')}-${field('day')}`
}

export function todayRiftRun(save: SaveData, now = new Date()): RiftRun | null {
  return save.riftRun?.dateKey === parisDateKey(now) ? save.riftRun : null
}

export function prepareRift(save: SaveData, now = new Date(), seed = Math.floor(Math.random() * 0x100000000)): SaveData {
  if (!save.activeWarriorId || !save.ownedWarriors[save.activeWarriorId]) return save
  if (isWarriorOnExpedition(save, save.activeWarriorId)) return save
  if (todayRiftRun(save, now)) return save
  const next = structuredClone(save)
  next.riftRun = {
    dateKey: parisDateKey(now), status: 'ready', warriorId: '', stage: 0,
    lineup: riftLineup(seededRng(seed)), seed: seed >>> 0, difficulty: riftDifficulty(next.riftLossStreak),
    earnedCoins: 0, earnedXp: 0,
  }
  return next
}

export function beginRiftStage(save: SaveData, now = new Date()): SaveData {
  const run = todayRiftRun(save, now)
  if (!run || !['ready', 'between'].includes(run.status) || !save.ownedWarriors[run.warriorId || save.activeWarriorId]) return save
  if (isWarriorOnExpedition(save, run.warriorId || save.activeWarriorId)) return save
  const next = structuredClone(save)
  next.riftRun!.status = 'fighting'
  if (run.status === 'ready') next.riftRun!.warriorId = save.activeWarriorId
  return next
}

export interface RiftEncounter {
  result: BattleResult
  player: Fighter
  enemyId: EnemyId
  stage: number
  seed: number
  dateKey: string
}

/** Deterministic recreation after refresh; every stage starts with freshly derived full HP. */
export function createRiftEncounter(save: SaveData, now = new Date()): RiftEncounter | null {
  const run = todayRiftRun(save, now)
  if (!run || run.status !== 'fighting' || !save.ownedWarriors[run.warriorId]) return null
  const enemyId = run.lineup[run.stage] as EnemyId
  if (!enemyIds.includes(enemyId)) return null
  const warrior = ownedWarrior(save, run.warriorId)
  const loadout = run.warriorId === save.activeWarriorId
    ? { weapon: save.equippedWeapon, armor: save.equippedArmor }
    : save.loadouts[run.warriorId] ?? { weapon: '', armor: '' }
  const projected = { ...save, activeWarriorId: run.warriorId, equippedWeapon: loadout.weapon, equippedArmor: loadout.armor }
  const player: Fighter = { name: warrior.name, warriorId: warrior.id, level: warrior.level, stats: effectiveStats(projected), skills: [], weapon: loadout.weapon, armor: loadout.armor }
  const seed = (run.seed + run.stage * 1000003) >>> 0
  const enemy = riftEnemy(run.stage, enemyId, run.difficulty, seededRng(seed))
  return { result: simulateBattle(player, enemy, seed ^ 0x5f3759df), player, enemyId, stage: run.stage, seed: run.seed, dateKey: run.dateKey }
}

/** A stage token and status gate make reward settlement idempotent. */
export function resolveRiftStage(save: SaveData, encounter: Pick<RiftEncounter, 'dateKey' | 'stage' | 'seed'>, winner: BattleResult['winner']): SaveData {
  const run = save.riftRun
  if (!run || run.status !== 'fighting' || run.dateKey !== encounter.dateKey || run.stage !== encounter.stage || run.seed !== encounter.seed) return save
  const next = structuredClone(save)
  const settled = next.riftRun!
  if (winner === 'enemy') {
    settled.status = 'lost'
    next.riftLossStreak = Math.min(7, next.riftLossStreak + 1)
    return next
  }
  const reward = RIFT_REWARDS[settled.stage]
  next.coins += reward.coins
  const previousActive = next.activeWarriorId
  next.activeWarriorId = settled.warriorId
  addWarriorXp(next, reward.xp)
  next.activeWarriorId = previousActive
  recordBattleOutcome(next, 'rift', 'player')
  settled.earnedCoins += reward.coins
  settled.earnedXp += reward.xp
  if (settled.stage === 4) {
    settled.status = 'complete'
    next.riftLossStreak = 0
    next.riftChestCount += 1
  } else {
    settled.stage += 1
    settled.status = 'between'
  }
  return next
}

export function quitRift(save: SaveData, now = new Date()): SaveData {
  const run = todayRiftRun(save, now)
  if (!run || !['fighting', 'between'].includes(run.status)) return save
  const next = structuredClone(save)
  next.riftRun!.status = 'quit'
  return next
}

export function riftVisibleStages(run: RiftRun): number[] {
  return Array.from({ length: 5 }, (_, index) => index).filter((index) => index <= run.stage)
}
