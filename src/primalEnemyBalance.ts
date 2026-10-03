import { resolveEnemyId, type EnemyId } from './art/assetsV04'
import { campaignNodeTier } from './campaignProgression'
import type { Stats } from './types'

/** Campaign-only budgets; independent of the Warrior's level. */
export const PRIMAL_TIER_BUDGETS: readonly Stats[] = [
  { strength: 5, dodge: 5, speed: 6, hp: 110 },
  { strength: 6, dodge: 6, speed: 7, hp: 125 },
  { strength: 7, dodge: 7, speed: 8, hp: 145 },
  { strength: 9, dodge: 9, speed: 10, hp: 175 },
  { strength: 11, dodge: 10, speed: 12, hp: 205 },
  { strength: 13, dodge: 11, speed: 13, hp: 230 },
  { strength: 15, dodge: 13, speed: 15, hp: 260 },
  { strength: 17, dodge: 14, speed: 16, hp: 290 },
  { strength: 19, dodge: 15, speed: 18, hp: 260 },
]

/** Enemy identities follow the same node-to-sprite mapping as the battle scene. */
export const PRIMAL_ENEMY_PROFILES: Record<EnemyId, Stats> = {
  'tribal-hunter': { strength: 1, dodge: 1.08, speed: 1.08, hp: .95 },
  'tribal-warrior': { strength: 1, dodge: 1, speed: 1, hp: 1 },
  'cave-brute': { strength: 1.18, dodge: .85, speed: .82, hp: 1.15 },
  shaman: { strength: 1.05, dodge: 1.05, speed: 1, hp: .92 },
  raptor: { strength: .92, dodge: 1.15, speed: 1.22, hp: .85 },
  smilodon: { strength: 1.15, dodge: 1.08, speed: 1.12, hp: .90 },
  mammoth: { strength: 1.07, dodge: .85, speed: .82, hp: 1.12 },
}

const CHAMPION_MODIFIERS: readonly Stats[] = [
  { strength: 1.30, dodge: 1.10, speed: 1.12, hp: 1.38 },
  { strength: 1.24, dodge: 1.11, speed: 1.14, hp: 1.29 },
  { strength: 1.17, dodge: 1.12, speed: 1.16, hp: 1.25 },
  { strength: 1.20, dodge: 1.14, speed: 1.18, hp: 1.29 },
]

export type PrimalNodeKind = 'standard' | 'elite' | 'champion' | 'boss'

export function primalNodeKind(node: number): PrimalNodeKind {
  if (node === 20) return 'boss'
  if ([5, 10, 15].includes(node)) return 'elite'
  if (node >= 16 && node <= 19) return 'champion'
  return 'standard'
}

export function primalNodeModifier(node: number): Stats {
  const kind = primalNodeKind(node)
  if (kind === 'elite') return { strength: 1.20, dodge: 1.06, speed: 1.06, hp: 1.30 }
  if (kind === 'boss') return { strength: 1.12, dodge: 1.10, speed: .32, hp: 1.35 }
  if (kind === 'champion') return CHAMPION_MODIFIERS[node - 16]
  return { strength: 1, dodge: 1, speed: 1, hp: 1 }
}

/** Stable for a given node and RNG seed; never reads the player or its rarity. */
export function primalEnemyStats(node: number, rng: () => number): Stats {
  const budget = PRIMAL_TIER_BUDGETS[campaignNodeTier(node) - 1]
  const profile = PRIMAL_ENEMY_PROFILES[resolveEnemyId(node, node === 20)]
  const modifier = primalNodeModifier(node)
  const result = {} as Stats
  for (const stat of ['strength', 'dodge', 'speed', 'hp'] as const) {
    result[stat] = Math.max(1, Math.round(budget[stat] * profile[stat] * modifier[stat] * (.94 + rng() * .12)))
  }
  return result
}
