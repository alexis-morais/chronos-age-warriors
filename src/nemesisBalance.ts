import { generateEnemy } from './game'
import type { Fighter, Stats } from './types'

/** Fixed endgame profiles. Index is the adventure node minus one; no player data or pity enters this table. */
export const NEMESIS_STATS: readonly Stats[] = [
  { strength: 23, dodge: 19, speed: 24, hp: 275 },
  { strength: 24, dodge: 21, speed: 25, hp: 290 },
  { strength: 26, dodge: 21, speed: 25, hp: 310 },
  { strength: 27, dodge: 20, speed: 24, hp: 335 },
  { strength: 31, dodge: 19, speed: 22, hp: 410 },
  { strength: 29, dodge: 23, speed: 28, hp: 355 },
  { strength: 28, dodge: 25, speed: 32, hp: 350 },
  { strength: 31, dodge: 22, speed: 27, hp: 385 },
  { strength: 32, dodge: 24, speed: 29, hp: 405 },
  { strength: 36, dodge: 24, speed: 30, hp: 470 },
  { strength: 37, dodge: 23, speed: 28, hp: 465 },
  { strength: 36, dodge: 27, speed: 31, hp: 450 },
  { strength: 39, dodge: 29, speed: 34, hp: 455 },
  { strength: 40, dodge: 28, speed: 32, hp: 485 },
  { strength: 39, dodge: 24, speed: 28, hp: 495 },
  { strength: 40, dodge: 24, speed: 29, hp: 510 },
  { strength: 41, dodge: 26, speed: 30, hp: 525 },
  { strength: 42, dodge: 27, speed: 31, hp: 540 },
  { strength: 43, dodge: 28, speed: 32, hp: 565 },
  { strength: 43, dodge: 22, speed: 18, hp: 560 },
] as const

/** Keep the canonical enemy identity, AI skills and artwork mapping; replace only combat stats. */
export function nemesisEnemy(node: number): Fighter {
  const stats = NEMESIS_STATS[node - 1]
  if (!stats) throw new RangeError(`Invalid Némésis node: ${node}`)
  return { ...generateEnemy(1, node, () => .5), stats: { ...stats } }
}
