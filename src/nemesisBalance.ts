import { generateEnemy } from './game'
import type { Fighter, Stats } from './types'

/** Fixed endgame profiles. Index is the adventure node minus one; no player data or pity enters this table. */
export const NEMESIS_STATS: readonly Stats[] = [
  { strength: 105, dodge: 22, speed: 38, hp: 1120 },
  { strength: 108, dodge: 25, speed: 41, hp: 1160 },
  { strength: 112, dodge: 23, speed: 40, hp: 1200 },
  { strength: 115, dodge: 24, speed: 41, hp: 1240 },
  { strength: 130, dodge: 25, speed: 42, hp: 1440 },
  { strength: 120, dodge: 26, speed: 43, hp: 1340 },
  { strength: 118, dodge: 31, speed: 50, hp: 1350 },
  { strength: 126, dodge: 26, speed: 44, hp: 1390 },
  { strength: 130, dodge: 28, speed: 45, hp: 1420 },
  { strength: 146, dodge: 27, speed: 46, hp: 1560 },
  { strength: 140, dodge: 27, speed: 46, hp: 1480 },
  { strength: 142, dodge: 30, speed: 48, hp: 1500 },
  { strength: 146, dodge: 32, speed: 51, hp: 1480 },
  { strength: 150, dodge: 30, speed: 49, hp: 1520 },
  { strength: 160, dodge: 28, speed: 48, hp: 1620 },
  { strength: 156, dodge: 29, speed: 48, hp: 1580 },
  { strength: 160, dodge: 30, speed: 49, hp: 1600 },
  { strength: 164, dodge: 31, speed: 50, hp: 1620 },
  { strength: 168, dodge: 32, speed: 51, hp: 1650 },
  { strength: 190, dodge: 28, speed: 49, hp: 1904 },
] as const

/** Keep the canonical enemy identity, AI skills and artwork mapping; replace only combat stats. */
export function nemesisEnemy(node: number): Fighter {
  const stats = NEMESIS_STATS[node - 1]
  if (!stats) throw new RangeError(`Invalid Némésis node: ${node}`)
  return { ...generateEnemy(1, node, () => .5), stats: { ...stats } }
}
