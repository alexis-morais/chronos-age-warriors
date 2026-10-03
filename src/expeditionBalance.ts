import { equipment } from './data'
import type { Rarity } from './types'

export const EXPEDITION_MAX_MS = 24 * 60 * 60 * 1000
export const EXPEDITION_ROLL_MS = 4 * 60 * 60 * 1000
export const EXPEDITION_MAX_XP = 600
export const EXPEDITION_MAX_COINS = 350
export const EXPEDITION_EQUIPMENT_FIND_CHANCE = 0.6
export const EXPEDITION_EQUIPMENT_CHEST_CHANCE = 0.2
export const EXPEDITION_WARRIOR_CHEST_CHANCE = 0.05

/** Six duration tiers, indexed by completed four-hour intervals. Absent catalog rarities are never drawn. */
export const EXPEDITION_RARITY_WEIGHTS: readonly Record<Rarity, number>[] = [
  { Commun: 75, 'Peu commun': 20, Rare: 5, Épique: 0, Légendaire: 0, Mythique: 0 },
  { Commun: 68, 'Peu commun': 23, Rare: 8, Épique: 1, Légendaire: 0, Mythique: 0 },
  { Commun: 60, 'Peu commun': 26, Rare: 11, Épique: 3, Légendaire: 0, Mythique: 0 },
  { Commun: 53, 'Peu commun': 27, Rare: 14, Épique: 5, Légendaire: 1, Mythique: 0 },
  { Commun: 46, 'Peu commun': 28, Rare: 17, Épique: 7, Légendaire: 2, Mythique: 0 },
  { Commun: 40, 'Peu commun': 28, Rare: 18, Épique: 9, Légendaire: 4, Mythique: 1 },
]

export function expeditionRarityWeights(elapsedMs: number) {
  const tier = Math.max(0, Math.min(5, Math.floor(elapsedMs / EXPEDITION_ROLL_MS) - 1))
  const present = new Set(equipment.map((item) => item.rarity))
  return Object.entries(EXPEDITION_RARITY_WEIGHTS[tier]).filter(([rarity, weight]) => weight > 0 && present.has(rarity as Rarity)) as [Rarity, number][]
}
