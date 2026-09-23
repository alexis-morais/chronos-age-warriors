import type { Rarity } from './types'

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
  chestCost: 100,
  campaignDaily: 10,
  trainingDaily: 100,
  maxEquipmentLevel: 10,
  maxWarriorLevel: 100,
  mythicalSkillWeight: 0.25,
} as const

export const EQUIPMENT_XP = [0, 20, 30, 45, 65, 90, 120, 155, 195, 240]

export const RARITY_CHANCES: Record<Rarity, number> = {
  Commun: 43.49,
  'Peu commun': 40,
  Rare: 15,
  'Épique': 1,
  'Légendaire': 0.5,
  Mythique: 0.01,
}

export const DUPLICATE_REWARDS: Record<Rarity, { coins: number; xp: number }> = {
  Commun: { coins: 10, xp: 10 },
  'Peu commun': { coins: 15, xp: 15 },
  Rare: { coins: 25, xp: 25 },
  'Épique': { coins: 40, xp: 40 },
  'Légendaire': { coins: 75, xp: 60 },
  Mythique: { coins: 200, xp: 100 },
}

export const rarityOrder: Rarity[] = ['Commun', 'Peu commun', 'Rare', 'Épique', 'Légendaire', 'Mythique']
