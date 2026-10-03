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
  campaignDaily: 10,
  maxWarriorLevel: MAX_WARRIOR_LEVEL,
} as const

export const RARITY_CHANCES: Record<Rarity, number> = {
  Commun: 43.49,
  'Peu commun': 40,
  Rare: 15,
  'Épique': 1,
  'Légendaire': 0.5,
  Mythique: 0.01,
}

export const rarityOrder: Rarity[] = ['Commun', 'Peu commun', 'Rare', 'Épique', 'Légendaire', 'Mythique']
