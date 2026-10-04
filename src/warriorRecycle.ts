import type { Rarity, SaveData } from './types'
import { warriorDefinitions } from './warriors'
import { addWarriorXp } from './game'

export const WARRIOR_RECYCLE_REWARDS: Record<Rarity, { coins: number; xp: number }> = {
  Commun: { coins: 20, xp: 25 }, 'Peu commun': { coins: 40, xp: 40 }, Rare: { coins: 80, xp: 75 },
  Épique: { coins: 150, xp: 125 }, Légendaire: { coins: 200, xp: 200 }, Mythique: { coins: 250, xp: 350 },
}

/** Persisted single-use receipt: no reward during the roulette, survives reload. */
export function queueWarriorRecycle(save: SaveData, warriorId: string): string {
  const id = crypto.randomUUID()
  save.pendingWarriorRecycles ??= []
  save.pendingWarriorRecycles.push({ id, warriorId })
  return id
}

export function recycleWarrior(save: SaveData, receiptId: string): SaveData {
  const receipt = save.pendingWarriorRecycles?.find((entry) => entry.id === receiptId)
  if (!receipt || !save.ownedWarriors[receipt.warriorId] || !warriorDefinitions[receipt.warriorId]) return save
  const next = structuredClone(save)
  next.pendingWarriorRecycles = next.pendingWarriorRecycles!.filter((entry) => entry.id !== receiptId)
  const reward = WARRIOR_RECYCLE_REWARDS[warriorDefinitions[receipt.warriorId].rarity]
  next.coins += reward.coins
  const active = next.activeWarriorId
  next.activeWarriorId = receipt.warriorId
  addWarriorXp(next, reward.xp)
  next.activeWarriorId = active
  return next
}
