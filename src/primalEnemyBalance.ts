import type { EnemyId } from './art/assetsV04'
import type { Stats } from './types'

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

export type PrimalNodeKind = 'standard' | 'elite' | 'champion' | 'boss'

/** V0.14 fixed encounters: no player-dependent scaling and no random stat jitter. */
export const PRIMAL_NODE_STATS: readonly Stats[] = [
  { strength: 8, dodge: 6, speed: 8, hp: 110 },
  { strength: 9, dodge: 9, speed: 10, hp: 120 },
  { strength: 11, dodge: 8, speed: 10, hp: 145 },
  { strength: 12, dodge: 8, speed: 11, hp: 165 },
  { strength: 27, dodge: 10, speed: 14, hp: 360 },
  { strength: 24, dodge: 13, speed: 19, hp: 310 },
  { strength: 23, dodge: 17, speed: 25, hp: 320 },
  { strength: 27, dodge: 12, speed: 19, hp: 355 },
  { strength: 28, dodge: 15, speed: 21, hp: 375 },
  { strength: 42, dodge: 15, speed: 23, hp: 550 },
  { strength: 38, dodge: 14, speed: 24, hp: 500 },
  { strength: 38, dodge: 18, speed: 26, hp: 515 },
  { strength: 43, dodge: 21, speed: 30, hp: 540 },
  { strength: 46, dodge: 20, speed: 28, hp: 590 },
  // V0.14.1: fixed final approach (+15%, +20%, +25% Force/HP); nodes 1–14 intact.
  { strength: 75, dodge: 18, speed: 30, hp: 920 },
  { strength: 72, dodge: 19, speed: 32, hp: 874 },
  { strength: 78, dodge: 20, speed: 33, hp: 932 },
  { strength: 89, dodge: 22, speed: 35, hp: 1044 },
  { strength: 100, dodge: 23, speed: 37, hp: 1188 },
  { strength: 166, dodge: 24, speed: 45, hp: 1720 },
]

export function primalNodeKind(node: number): PrimalNodeKind {
  if (node === 20) return 'boss'
  if ([5, 10, 15].includes(node)) return 'elite'
  if (node >= 16 && node <= 19) return 'champion'
  return 'standard'
}

/** Fixed per node; never reads RNG, the player or its rarity. */
export function primalEnemyStats(node: number, _rng: () => number): Stats {
  void _rng
  const stats = PRIMAL_NODE_STATS[node - 1]
  if (!stats) throw new RangeError(`Invalid Primal node: ${node}`)
  return { ...stats }
}
