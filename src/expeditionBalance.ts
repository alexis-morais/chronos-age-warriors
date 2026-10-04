import { equipment } from './data'
import type { Rarity } from './types'

export const EXPEDITION_MAX_MS = 24 * 60 * 60 * 1000
export const EXPEDITION_ROLL_MS = 6 * 60 * 60 * 1000
export const EXPEDITION_MAX_XP = 600
export const EXPEDITION_MAX_COINS = 350
export const EXPEDITION_EQUIPMENT_FIND_CHANCE = 0.35
export const EXPEDITION_EQUIPMENT_CHEST_CHANCE = 0.1
export const EXPEDITION_WARRIOR_CHEST_CHANCE = 0.02

/** Completed six-hour tiers. Legendary/Mythic remain exceptional even at 24h. */
export const EXPEDITION_RARITY_WEIGHTS: readonly Record<Rarity, number>[] = [
  { Commun: 75, 'Peu commun': 20, Rare: 5, Épique: 0, Légendaire: 0, Mythique: 0 },
  { Commun: 70, 'Peu commun': 23, Rare: 6, Épique: 1, Légendaire: 0, Mythique: 0 },
  { Commun: 65, 'Peu commun': 25, Rare: 8, Épique: 1.9, Légendaire: .1, Mythique: 0 },
  { Commun: 60, 'Peu commun': 28, Rare: 10, Épique: 1.85, Légendaire: .14, Mythique: .01 },
]

export function expeditionRarityWeights(elapsedMs: number) {
  const tier = Math.max(0, Math.min(3, Math.floor(elapsedMs / EXPEDITION_ROLL_MS) - 1))
  const present = new Set(equipment.map((item) => item.rarity))
  return Object.entries(EXPEDITION_RARITY_WEIGHTS[tier]).filter(([rarity, weight]) => weight > 0 && present.has(rarity as Rarity)) as [Rarity, number][]
}
