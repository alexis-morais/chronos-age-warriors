import { describe, expect, it } from 'vitest'
import { grantEarnedBadges, hasBadgeReward } from './badgeSystem'
import { establishedKargSave } from './testFixtures'
import { eligibleGlobalWins, recordBattleOutcome } from './victories'

describe('victoires éligibles aux Exploits', () => {
  it('un ancien totalWins contenant potentiellement des victoires Entraînement ne débloque pas Premier Impact', () => {
    const save = establishedKargSave()
    save.totalWins = 12
    expect(save.totalWins).toBe(12)
    expect(eligibleGlobalWins(save)).toBe(0)
    expect(hasBadgeReward(grantEarnedBadges(save).save, 'exploit-first-impact')).toBe(false)
  })

  it('une défaite Aventure ne compte pas, une victoire compte et débloque Premier Impact', () => {
    const save = establishedKargSave()
    recordBattleOutcome(save, 'adventure', 'enemy')
    expect(save.adventureWins).toBe(0)
    expect(eligibleGlobalWins(save)).toBe(0)
    expect(hasBadgeReward(grantEarnedBadges(save).save, 'exploit-first-impact')).toBe(false)
    recordBattleOutcome(save, 'adventure', 'player')
    expect(save.adventureWins).toBe(1)
    expect(eligibleGlobalWins(save)).toBe(1)
    expect(hasBadgeReward(grantEarnedBadges(save).save, 'exploit-first-impact')).toBe(true)
  })

  it('une défaite Duel ne compte pas ; le premier Duel gagné débloque les deux Exploits', () => {
    const save = establishedKargSave()
    recordBattleOutcome(save, 'duel', 'enemy')
    expect(save.duelWins).toBe(0)
    expect(eligibleGlobalWins(save)).toBe(0)
    recordBattleOutcome(save, 'duel', 'player')
    expect(save.duelWins).toBe(1)
    expect(eligibleGlobalWins(save)).toBe(1)
    const granted = grantEarnedBadges(save).granted.map(({ id }) => id)
    expect(granted).toContain('exploit-first-impact')
    expect(granted).toContain('exploit-first-duel')
  })

  it('25 victoires Aventure seules ou 24 Aventure + 1 Duel débloquent Combattant aguerri', () => {
    const adventure = establishedKargSave()
    adventure.adventureWins = 24
    recordBattleOutcome(adventure, 'adventure', 'player')
    expect(eligibleGlobalWins(adventure)).toBe(25)
    expect(hasBadgeReward(grantEarnedBadges(adventure).save, 'exploit-seasoned-fighter')).toBe(true)
    const mixed = establishedKargSave()
    mixed.adventureWins = 24
    recordBattleOutcome(mixed, 'duel', 'player')
    expect(eligibleGlobalWins(mixed)).toBe(25)
    expect(hasBadgeReward(grantEarnedBadges(mixed).save, 'exploit-seasoned-fighter')).toBe(true)
    expect(hasBadgeReward(grantEarnedBadges(mixed).save, 'exploit-first-duel')).toBe(true)
  })

  it('Aventure + Duel + future Faille atteignent 100, sans créer de gameplay Faille', () => {
    const save = establishedKargSave()
    save.adventureWins = 74
    save.duelWins = 25
    recordBattleOutcome(save, 'rift', 'enemy')
    expect(save.riftWins).toBe(0)
    recordBattleOutcome(save, 'rift', 'player')
    expect(save.riftWins).toBe(1)
    expect(eligibleGlobalWins(save)).toBe(100)
    expect(hasBadgeReward(grantEarnedBadges(save).save, 'exploit-war-machine')).toBe(true)
  })

  it('un reçu gagné sous l’ancien total reste acquis sans retirer ni redonner de pièces', () => {
    const save = establishedKargSave()
    save.badges.push({ id: 'exploit-first-impact' })
    save.totalWins = 1
    const awarded = grantEarnedBadges(save)
    expect(awarded.save.coins).toBe(save.coins)
    expect(awarded.granted).toHaveLength(0)
    expect(hasBadgeReward(awarded.save, 'exploit-first-impact')).toBe(true)
  })
})
