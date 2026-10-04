import { grantWarrior, type Rng } from './game'
import type { Rarity, SaveData, WarriorDefinition } from './types'
import { primalWarriors } from './warriors'
import { rollRarity } from './game'
import { queueWarriorRecycle } from './warriorRecycle'

export const RIFT_CHEST_ODDS: Record<Rarity, number> = {
  Commun: 5,
  'Peu commun': 15,
  Rare: 40,
  'Épique': 28,
  Légendaire: 10,
  Mythique: 2,
}

export function rollRiftChestWarrior(rng: Rng): WarriorDefinition {
  const rarity = rollRarity(rng, RIFT_CHEST_ODDS)
  const pool = primalWarriors.filter((warrior) => warrior.rarity === rarity)
  return pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))]
}

export function openRiftChest(save: SaveData, rng: Rng = Math.random): { save: SaveData; warrior: WarriorDefinition; duplicate: boolean; recycleId?: string } | null {
  if (save.riftChestCount <= 0) return null
  const warrior = rollRiftChestWarrior(rng)
  const duplicate = Boolean(save.ownedWarriors[warrior.id])
  const next = grantWarrior(save, warrior.id)
  next.riftChestCount -= 1
  next.chests += 1
  return { save: next, warrior, duplicate, ...(duplicate ? { recycleId: queueWarriorRecycle(next, warrior.id) } : {}) }
}
