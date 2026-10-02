import type { BattleEvent } from '../types'

export type CombatText = { kind: 'damage' | 'critical' | 'dodge' | 'block' | 'heal'; target: 'player' | 'enemy'; label: string }

export function combatTextForEvent(event: BattleEvent | undefined, critical = false): CombatText | null {
  if (event?.type === 'damage' && typeof event.value === 'number') return { kind: critical ? 'critical' : 'damage', target: event.target, label: `−${event.value}` }
  if (event?.type === 'dodge') return { kind: 'dodge', target: event.actor, label: 'ESQUIVE' }
  if (event?.type === 'skill' && event.label === 'Parade') return { kind: 'block', target: event.actor, label: 'BLOCAGE' }
  return null
}
