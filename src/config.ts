import type { Rarity } from './types'
import { MAX_WARRIOR_LEVEL } from './warriorProgression'

export const GAME = {
  baseDamage: 6,
  strengthExponent: 0.75,
  strengthScale: 2.2,
  damageVariance: 0.1,
  criticalChance: 0.05,
  criticalMultiplier: 1.5,
  dodgeBase: 0.04,
  dodgeScale: 0.36,
  dodgeCap: 0.35,
  speedOffset: 10,
  speedExponent: 0.65,
  maxConsecutiveActions: 3,
  campaignDaily: 15,
  maxWarriorLevel: MAX_WARRIOR_LEVEL,
} as const

export const RARITY_CHANCES: Record<Rarity, number> = {
  Commun: 70,
  'Peu commun': 22,
  Rare: 7,
  'Épique': 0.85,
  'Légendaire': 0.14,
  Mythique: 0.01,
}

export const EQUIPMENT_CHANCES: Record<Rarity, number> = {
  Commun: 63, 'Peu commun': 27, Rare: 8.5, Épique: 1.35, Légendaire: .14, Mythique: .01,
}

/** Basis points: exact integer thresholds, including 1/10,000 Mythique. */
export const rarityWeights = (chances: Record<Rarity, number>) => rarityOrder.map((rarity) => Math.round(chances[rarity] * 100))

export const rarityOrder: Rarity[] = ['Commun', 'Peu commun', 'Rare', 'Épique', 'Légendaire', 'Mythique']
