import { describe, expect, it } from 'vitest'
import { createWarriorReel, WARRIOR_REEL_LENGTH, WARRIOR_WINNER_INDEX } from './warriorGacha'
import { primalWarriors } from '../warriors'

describe('roulette Warrior décorative', () => {
  it('dépasse le roster et autorise les répétitions avec remplacement', () => {
    const winner = primalWarriors.find((warrior) => warrior.id === 'naya')!
    const reel = createWarriorReel(winner, () => 0)
    expect(reel).toHaveLength(WARRIOR_REEL_LENGTH)
    expect(WARRIOR_REEL_LENGTH).toBeGreaterThan(primalWarriors.length)
    expect(reel.filter((warrior) => warrior.id === 'karg').length).toBe(WARRIOR_REEL_LENGTH - 1)
    expect(reel[WARRIOR_WINNER_INDEX]).toBe(winner)
  })

  it('peut montrer le gagnant avant sa position finale sans le retirer artificiellement', () => {
    const winner = primalWarriors[0]
    const reel = createWarriorReel(winner, () => 0)
    expect(reel.slice(0, WARRIOR_WINNER_INDEX).some((warrior) => warrior.id === winner.id)).toBe(true)
    expect(reel[WARRIOR_WINNER_INDEX]).toBe(winner)
  })
})
