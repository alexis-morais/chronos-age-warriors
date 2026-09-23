import type { BattleResult } from '../types'
import type { SpriteState } from './assetsV04'

export interface FinalBattleFrame {
  index: number
  playerHp: number
  enemyHp: number
  playerState: SpriteState
  enemyState: SpriteState
}

export function finalBattleFrame(result: BattleResult): FinalBattleFrame {
  const index = Math.max(0, result.events.length - 1)
  const event = result.events[index]
  return {
    index,
    playerHp: event?.playerHp ?? 0,
    enemyHp: event?.enemyHp ?? 0,
    playerState: result.winner === 'player' ? 'victory' : 'ko',
    enemyState: result.winner === 'enemy' ? 'victory' : 'ko',
  }
}
