import { rarityOrder } from './config'
import { grantWarrior, type Rng } from './game'
import type { Rarity, SaveData, WarriorDefinition } from './types'
import { primalWarriors } from './warriors'

export const RIFT_CHEST_ODDS: Record<Rarity, number> = {
  Commun: 5,
  'Peu commun': 15,
  Rare: 40,
  'Épique': 28,
  Légendaire: 10,
  Mythique: 2,
}

export function rollRiftChestWarrior(rng: Rng): WarriorDefinition {
  const roll = rng() * 100
  let total = 0
  const rarity = rarityOrder.find((entry) => { total += RIFT_CHEST_ODDS[entry]; return roll < total }) ?? 'Mythique'
  const pool = primalWarriors.filter((warrior) => warrior.rarity === rarity)
  return pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))]
}

export function openRiftChest(save: SaveData, rng: Rng = Math.random): { save: SaveData; warrior: WarriorDefinition; duplicate: boolean } | null {
  if (save.riftChestCount <= 0) return null
  const warrior = rollRiftChestWarrior(rng)
  const duplicate = Boolean(save.ownedWarriors[warrior.id])
  const next = grantWarrior(save, warrior.id)
  next.riftChestCount -= 1
  next.chests += 1
  return { save: next, warrior, duplicate }
}
