import { enemyIds, type EnemyId } from './art/assetsV04'
import { PRIMAL_ENEMY_PROFILES } from './primalEnemyBalance'
import type { Fighter, Stats } from './types'

export const RIFT_STAGE_LABELS = ['Combat 1', 'Combat 2', 'Combat 3', 'Combat 4', 'Boss'] as const
export const RIFT_REWARDS = [
  { coins: 75, xp: 200 },
  { coins: 100, xp: 250 },
  { coins: 125, xp: 325 },
  { coins: 175, xp: 425 },
  { coins: 275, xp: 650 },
] as const

/** Independent of campaign tiers and of the Warrior entering the Rift. */
export const RIFT_STAGE_BUDGETS: readonly Stats[] = [
  { strength: 15, dodge: 11, speed: 13, hp: 235 },
  { strength: 16, dodge: 12, speed: 14, hp: 260 },
  { strength: 17, dodge: 13, speed: 15, hp: 285 },
  { strength: 18, dodge: 13, speed: 14, hp: 310 },
  { strength: 22, dodge: 15, speed: 15, hp: 370 },
]

const ENEMY_NAMES: Record<EnemyId, string> = {
  'tribal-hunter': 'Chasseur tribal',
  'tribal-warrior': 'Guerrier tribal',
  'cave-brute': 'Brute des cavernes',
  shaman: 'Chaman',
  raptor: 'Raptor',
  smilodon: 'Smilodon',
  mammoth: 'Mammouth',
}

export function riftLineup(rng: () => number): EnemyId[] {
  const heavy = ['cave-brute', 'smilodon', 'mammoth'] as EnemyId[]
  const miniBoss = heavy[Math.floor(rng() * heavy.length)]
  const bosses = (['cave-brute', 'smilodon', 'mammoth'] as EnemyId[]).filter((id) => id !== miniBoss)
  const boss = bosses[Math.floor(rng() * bosses.length)]
  const ordinary = enemyIds.filter((id) => id !== miniBoss && id !== boss)
  const result: EnemyId[] = []
  for (let stage = 0; stage < 3; stage++) result.push(ordinary.splice(Math.floor(rng() * ordinary.length), 1)[0])
  return [...result, miniBoss, boss]
}

/** A 50% power tier eases Force/HP more than Dodge/Speed, preserving archetypes. */
export function riftEnemy(stage: number, id: EnemyId, difficulty: number, rng: () => number): Fighter {
  if (!Number.isInteger(stage) || stage < 0 || stage > 4 || !enemyIds.includes(id)) throw new Error('Invalid Rift encounter')
  const relief = (100 - Math.max(50, Math.min(100, difficulty))) / 50
  const ease: Stats = { strength: 1 - .30 * relief, dodge: 1 - .10 * relief, speed: 1 - .10 * relief, hp: 1 - .30 * relief }
  const budget = RIFT_STAGE_BUDGETS[stage]
  const profile = PRIMAL_ENEMY_PROFILES[id]
  const stats = {} as Stats
  for (const stat of ['strength', 'dodge', 'speed', 'hp'] as const) {
    stats[stat] = Math.max(1, Math.round(budget[stat] * profile[stat] * ease[stat] * (.94 + rng() * .12)))
  }
  const boss = stage === 4
  return {
    name: boss ? 'Boss de la Faille' : ENEMY_NAMES[id],
    stats,
    skills: stage === 3 ? ['Peau Dure'] : boss ? ['Peau Dure', 'Frappe Dévastatrice', 'Second Souffle'] : [],
  }
}
