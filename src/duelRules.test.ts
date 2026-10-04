import { describe, expect, it } from 'vitest'
import { applyDuelReward, DUEL_REWARDS, duelFighter, duelPoints, normalizedDuelSave, resolveDuel, validDuelWarrior } from './duelRules'
import { rechargeAdventure, rechargeCharges, spendAdventure, spendCharge } from './combatReserves'
import { simulateBattle } from './game'
import { establishedKargSave } from './testFixtures'
import type { Fighter } from './types'

describe('règles de Duel', () => {
  it('refuse les données impossibles avant la migration qui pourrait les corriger', () => {
    const valid = establishedKargSave()
    expect(normalizedDuelSave(valid)).not.toBeNull()
    const altered = (change: (save: typeof valid) => void) => {
      const copy = structuredClone(valid); change(copy); return normalizedDuelSave(copy)
    }
    expect(altered((save) => { save.activeWarriorId = 'unknown' })).toBeNull()
    expect(altered((save) => { save.ownedWarriors.karg.warriorId = 'naya' })).toBeNull()
    expect(altered((save) => { save.ownedWarriors.karg.level = 99 })).toBeNull()
    expect(altered((save) => { save.ownedWarriors.karg.level = 1.5 })).toBeNull()
    expect(altered((save) => { save.ownedWarriors.karg.xp = 9999 })).toBeNull()
    expect(altered((save) => { save.equippedWeapon = 'nonexistent' })).toBeNull()
    expect(altered((save) => { save.equippedWeapon = 'hunter-hides' })).toBeNull()
    expect(altered((save) => { delete save.owned['flint-club'] })).toBeNull()
    expect(altered((save) => { save.owned['invented-item'] = { quantity: 1, level: 1, xp: 0, kills: 0 } })).toBeNull()
    expect(altered((save) => { save.owned['flint-club'].quantity = 0 })).toBeNull()
    expect(altered((save) => { save.loadouts.karg.weapon = 'nonexistent' })).toBeNull()
    expect(altered((save) => { save.loadouts.karg.weapon = '' })).toBeNull()
    expect(altered((save) => { save.ownedWarriors.naya = { warriorId: 'naya', level: 99, xp: 0 } })).toBeNull()
    expect(normalizedDuelSave({ ...valid, activeWarriorId: '', ownedWarriors: {} })).toBeNull()
  })
  it('attribue les points uniquement selon l’écart positif de rareté et jamais une perte', () => {
    expect(duelPoints('Commun', 'Commun', true)).toBe(20)
    expect(duelPoints('Mythique', 'Commun', true)).toBe(20)
    expect(['Peu commun', 'Rare', 'Épique', 'Légendaire', 'Mythique'].map((rarity) =>
      duelPoints('Commun', rarity as Parameters<typeof duelPoints>[1], true))).toEqual([25, 30, 35, 40, 45])
    expect(duelPoints('Commun', 'Mythique', false)).toBe(0)
  })
  it('résout avec les stats canoniques et récompense seulement la save attaquante', () => {
    const attacker = establishedKargSave()
    const defender = establishedKargSave()
    defender.coins = 777
    const originalDefender = structuredClone(defender)
    expect(validDuelWarrior(attacker)).toBe(true)
    expect(duelFighter(attacker).stats.strength).toBe(12)
    const resolution = resolveDuel(attacker, defender, 42)
    const rewarded = applyDuelReward(attacker, resolution)
    const next = rewarded.save
    expect(next.version).toBe(attacker.version)
    expect(next.coins - attacker.coins - rewarded.granted.reduce((total, badge) => total + badge.coins, 0)).toBe(resolution.result.winner === 'player' ? 50 : 10)
    expect(resolution.points).toBe(resolution.result.winner === 'player' ? 20 : 0)
    expect(next.ownedWarriors.karg.xp).toBe(resolution.result.winner === 'player' ? DUEL_REWARDS.win.xp : DUEL_REWARDS.loss.xp)
    expect(defender).toEqual(originalDefender)
  })
  it('active les passifs des deux côtés du moteur, sur sept familles', () => {
    const labels: Record<string, string> = {
      karg: 'Premier Sang', naya: 'Embuscade décisive', brakk: 'Parade', asha: 'Crescendo incandescent',
      rhex: 'Assaut coordonné', vorka: 'Entaille d’obsidienne', tyrak: 'Sursaut cristallin',
    }
    for (const [id, label] of Object.entries(labels)) {
      const fighter = (name: string, warriorId?: string): Fighter => ({ name, warriorId, level: 10,
        stats: { strength: 5, dodge: id === 'naya' ? 40 : 12, speed: 10, hp: 1000 }, skills: [] })
      const player = fighter('Attaquant', id)
      const enemy = fighter('Défenseur', id)
      const seen = new Set<string>()
      for (let seed = 1; seed <= 20 && seen.size < 2; seed++) {
        for (const event of simulateBattle(player, enemy, seed).events) {
          if (event.type === 'skill' && event.label === label) seen.add(event.actor)
        }
      }
      expect(seen, `${id}: ${label}`).toEqual(new Set(['player', 'enemy']))
    }
  })
})

describe('réserves distinctes', () => {
  const minute = 60_000
  it('recharge Duel +1 par 20 minutes sans dépasser 10', () => {
    const spent = spendCharge(10, null, 0)!
    expect(spent).toEqual({ charges: 9, nextAt: 20 * minute })
    expect(rechargeCharges(spent.charges, spent.nextAt, 20 * minute - 1).charges).toBe(9)
    expect(rechargeCharges(spent.charges, spent.nextAt, 20 * minute)).toEqual({ charges: 10, nextAt: null })
    expect(rechargeCharges(0, 20 * minute, 60 * minute)).toEqual({ charges: 3, nextAt: 80 * minute })
  })
  it('la dépense Aventure ne touche pas la réserve Duel', () => {
    const adventure = establishedKargSave()
    adventure.campaignRemaining = 3
    adventure.campaignRechargeAt = 20 * minute
    const duel = { charges: 8, nextAt: 20 * minute }
    const next = spendAdventure(adventure, 0)!
    expect(next.campaignRemaining).toBe(2)
    expect(duel.charges).toBe(8)
    expect(spendCharge(duel.charges, duel.nextAt, 0)?.charges).toBe(7)
    expect(rechargeAdventure(next, 20 * minute).campaignRemaining).toBe(3)
  })
})
