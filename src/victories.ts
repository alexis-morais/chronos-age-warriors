import type { BattleResult, SaveData } from './types'

export type VictoryMode = 'adventure' | 'rift' | 'duel' | 'training'
const wins = (value: number | undefined) => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0

/** Only these explicitly recorded victories qualify for global Exploits. */
export function eligibleGlobalWins(save: SaveData): number {
  return wins(save.adventureWins) + wins(save.riftWins) + wins(save.duelWins)
}

/** Record a settled combat once. Defeats never affect a victory counter. */
export function recordBattleOutcome(save: SaveData, mode: VictoryMode, winner: BattleResult['winner']): void {
  if (winner !== 'player') return
  // Retain the legacy total for compatibility, but never use it for Exploits.
  save.totalWins = wins(save.totalWins) + 1
  if (mode === 'adventure') save.adventureWins = wins(save.adventureWins) + 1
  else if (mode === 'rift') save.riftWins = wins(save.riftWins) + 1
  else if (mode === 'duel') save.duelWins = wins(save.duelWins) + 1
  else save.trainingWins = wins(save.trainingWins) + 1
}
