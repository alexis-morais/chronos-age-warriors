import { rollWarriorChest, type Rng } from '../game'
import type { WarriorDefinition } from '../types'

export const WARRIOR_REEL_LENGTH = 32
export const WARRIOR_WINNER_INDEX = 28

/** Decorative draws use replacement and cannot change the already-determined reward. */
export function createWarriorReel(winner: WarriorDefinition, rng: Rng): WarriorDefinition[] {
  const reel = Array.from({ length: WARRIOR_REEL_LENGTH }, () => rollWarriorChest(rng))
  reel[WARRIOR_WINNER_INDEX] = winner
  return reel
}
