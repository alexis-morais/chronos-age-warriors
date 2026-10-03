import { equipment } from './data'
import { addEquipmentCopy, addWarriorXp, type Rng } from './game'
import { EXPEDITION_EQUIPMENT_CHEST_CHANCE, EXPEDITION_EQUIPMENT_FIND_CHANCE, EXPEDITION_MAX_COINS, EXPEDITION_MAX_MS, EXPEDITION_MAX_XP, EXPEDITION_ROLL_MS, EXPEDITION_WARRIOR_CHEST_CHANCE, expeditionRarityWeights } from './expeditionBalance'
import type { ExpeditionReturn, SaveData } from './types'

export interface ExpeditionQaOverrides { forceEquipment?: boolean; forceEquipmentChest?: boolean; forceWarriorChest?: boolean }

export function expeditionElapsed(startedAt: number, now = Date.now()): number {
  return Math.min(EXPEDITION_MAX_MS, Math.max(0, now - startedAt))
}

export function expeditionClock(elapsedMs: number): string {
  const seconds = Math.floor(Math.max(0, Math.min(EXPEDITION_MAX_MS, elapsedMs)) / 1000)
  return [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), seconds % 60].map((part) => String(part).padStart(2, '0')).join(':')
}

export function isWarriorOnExpedition(save: SaveData, warriorId: string): boolean {
  return Boolean(warriorId && save.expedition?.warriorId === warriorId)
}

export function startExpedition(save: SaveData, warriorId: string, now = Date.now()): SaveData {
  if (save.expedition || !save.ownedWarriors[warriorId] || !Number.isSafeInteger(now) || now <= 0) return save
  const next = structuredClone(save)
  next.expedition = { warriorId, startedAt: now }
  next.expeditionReturn = null
  return next
}

export function expeditionChestChances(elapsedMs: number) {
  const fraction = Math.max(0, Math.min(1, elapsedMs / EXPEDITION_MAX_MS))
  return { equipment: EXPEDITION_EQUIPMENT_CHEST_CHANCE * fraction, warrior: EXPEDITION_WARRIOR_CHEST_CHANCE * fraction }
}

function drawEquipment(elapsedMs: number, rng: Rng): string {
  const weights = expeditionRarityWeights(elapsedMs)
  const total = weights.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = rng() * total
  let rarity = weights[weights.length - 1][0]
  for (const [candidate, weight] of weights) { if (roll < weight) { rarity = candidate; break } roll -= weight }
  const pool = equipment.filter((item) => item.rarity === rarity)
  return pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))].id
}

/** The caller supplies a controllable RNG; chest draws are independent. */
export function rollExpeditionRewards(elapsedMs: number, rng: Rng = Math.random, qa: ExpeditionQaOverrides = {}) {
  const duration = Math.max(0, Math.min(EXPEDITION_MAX_MS, elapsedMs))
  const factor = duration / EXPEDITION_MAX_MS
  const xp = Math.max(0, Math.round(EXPEDITION_MAX_XP * factor * (0.9 + rng() * 0.2)))
  const coins = Math.max(0, Math.round(EXPEDITION_MAX_COINS * factor * (0.9 + rng() * 0.2)))
  const equipmentIds: string[] = []
  for (let index = 0; index < Math.floor(duration / EXPEDITION_ROLL_MS); index += 1) {
    if (qa.forceEquipment || rng() < EXPEDITION_EQUIPMENT_FIND_CHANCE) equipmentIds.push(drawEquipment(duration, rng))
  }
  const chances = expeditionChestChances(duration)
  const equipmentChest = qa.forceEquipmentChest || rng() < chances.equipment
  const warriorChest = qa.forceWarriorChest || rng() < chances.warrior
  return { xp, coins, equipmentIds, equipmentChest, warriorChest }
}

/** Settlement and receipt are one immutable save transition; a second call cannot pay again. */
export function settleExpedition(save: SaveData, now = Date.now(), rng: Rng = Math.random, qa: ExpeditionQaOverrides = {}): SaveData {
  const active = save.expedition
  if (!active || !save.ownedWarriors[active.warriorId]) return save
  const elapsedMs = expeditionElapsed(active.startedAt, now)
  const reward = rollExpeditionRewards(elapsedMs, rng, qa)
  let next = structuredClone(save)
  next.coins += reward.coins
  for (const id of reward.equipmentIds) next = addEquipmentCopy(next, id)
  if (reward.equipmentChest) next.equipmentChestCount += 1
  if (reward.warriorChest) next.warriorChestCount += 1
  const previousActive = next.activeWarriorId
  next.activeWarriorId = active.warriorId
  const levelsGained = addWarriorXp(next, reward.xp)
  next.activeWarriorId = previousActive
  const receipt: ExpeditionReturn = { id: `${active.warriorId}:${active.startedAt}`, warriorId: active.warriorId, elapsedMs, ...reward, levelsGained }
  next.expedition = null
  next.expeditionReturn = receipt
  return next
}

export function dismissExpeditionReturn(save: SaveData): SaveData {
  return save.expeditionReturn ? { ...save, expeditionReturn: null } : save
}
