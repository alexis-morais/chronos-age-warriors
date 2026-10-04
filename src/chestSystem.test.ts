import { describe, expect, it } from 'vitest'
import { RARITY_CHANCES } from './config'
import { CHEST_UNIT_PRICES, chestPrice, purchaseChest, type ChestSelection } from './chestSystem'
import { rollWarriorChest } from './game'
import { establishedKargSave } from './testFixtures'

describe('prix et transactions des coffres', () => {
  it('centralise seulement les trois achats autorisés', () => {
    expect(CHEST_UNIT_PRICES).toEqual({ warrior: 100, equipment: 25 })
    expect(chestPrice({ kind: 'warrior', quantity: 1 })).toBe(100)
    expect(chestPrice({ kind: 'equipment', quantity: 1 })).toBe(25)
    expect(chestPrice({ kind: 'equipment', quantity: 10 })).toBe(250)
  })

  it.each([{ selection: { kind: 'warrior', quantity: 1 }, price: 100 }, { selection: { kind: 'equipment', quantity: 1 }, price: 25 }, { selection: { kind: 'equipment', quantity: 10 }, price: 250 }] as { selection: ChestSelection; price: number }[])('$selection.kind ×$selection.quantity accepte le solde exact et refuse un solde inférieur', ({ selection, price }) => {
    const save = establishedKargSave()
    save.coins = price
    const bought = purchaseChest(save, selection, () => 0)
    expect(bought?.draws).toHaveLength(selection.quantity)
    expect(bought?.save.coins).toBe(0)
    expect(bought?.save.chests).toBe(save.chests + selection.quantity)
    expect(save.coins).toBe(price)
    save.coins = price - 1
    expect(purchaseChest(save, selection, () => 0)).toBeNull()
    expect(save.coins).toBe(price - 1)
  })

  it('refuse un ancien appel Warrior ×10 même si les types sont contournés', () => {
    const save = establishedKargSave()
    const invalid = { kind: 'warrior', quantity: 10 } as unknown as ChestSelection
    expect(purchaseChest(save, invalid, () => 0, true)).toBeNull()
    expect(() => chestPrice(invalid)).toThrow('Invalid chest selection')
    expect(save.chests).toBe(0)
  })

  it('préserve le Warrior actif et le loadout sur un doublon Warrior', () => {
    const save = establishedKargSave()
    const result = purchaseChest(save, { kind: 'warrior', quantity: 1 }, () => 0)!
    expect(result.draws[0]).toMatchObject({ kind: 'warrior', warrior: { id: 'karg' }, duplicate: true })
    expect(Object.keys(result.save.ownedWarriors)).toEqual(['karg'])
    expect(result.save.activeWarriorId).toBe('karg')
    expect(result.save.equippedWeapon).toBe('flint-club')
    expect(result.save.loadouts).toEqual(save.loadouts)
  })

  it('reconnaît un nouveau Warrior, sans changer celui qui est actif', () => {
    const save = establishedKargSave()
    const rolls = [0, .3]
    const result = purchaseChest(save, { kind: 'warrior', quantity: 1 }, () => rolls.shift() ?? 0)!
    expect(result.draws[0]).toMatchObject({ kind: 'warrior', warrior: { id: 'naya' }, duplicate: false })
    expect(result.save.ownedWarriors.naya).toBeTruthy()
    expect(result.save.activeWarriorId).toBe('karg')
    expect(result.save.equippedArmor).toBe(save.equippedArmor)
  })

  it('utilise la même table canonique pour Commun, Rare, Légendaire et Mythique', () => {
    expect(Object.values(RARITY_CHANCES).reduce((sum, value) => sum + value, 0)).toBeCloseTo(100)
    for (const [roll, rarity] of [[0, 'Commun'], [.95, 'Rare'], [.999, 'Légendaire'], [.999999, 'Mythique']] as const) {
      const warrior = rollWarriorChest(() => roll)
      const bought = purchaseChest(establishedKargSave(), { kind: 'warrior', quantity: 1 }, () => roll)!
      expect(warrior.rarity).toBe(rarity)
      expect(bought.draws[0]).toMatchObject({ kind: 'warrior', warrior: { id: warrior.id, rarity } })
    }
  })

  it('tire dix équipements réels, empile les doublons et ne débite pas l’admin', () => {
    const save = establishedKargSave()
    const result = purchaseChest(save, { kind: 'equipment', quantity: 10 }, () => 0)!
    expect(result.draws).toHaveLength(10)
    expect(result.draws[0]).toMatchObject({ kind: 'equipment', item: { id: 'flint-club' }, duplicate: true, quantityAfter: 2 })
    expect(result.draws[9]).toMatchObject({ quantityAfter: 11 })
    expect(result.save.owned['flint-club'].quantity).toBe(11)
    expect(save.owned['flint-club'].quantity).toBe(1)
    expect(result.save.coins).toBe(save.coins - 250)
    const emptyAdminSave = { ...save, coins: 0 }
    const admin = purchaseChest(emptyAdminSave, { kind: 'equipment', quantity: 10 }, () => 0, true)!
    expect(admin.draws).toHaveLength(10)
    expect(admin.save.coins).toBe(0)
  })

  it('peut tirer une armure neuve et ne produit jamais une compétence legacy', () => {
    const save = establishedKargSave()
    delete save.owned['hunter-hides']
    const rngValues = [.999, 0, 0]
    const result = purchaseChest(save, { kind: 'equipment', quantity: 1 }, () => rngValues.shift() ?? 0)!
    expect(result.draws[0]).toMatchObject({ kind: 'equipment', item: { id: 'hunter-hides', type: 'armor' }, duplicate: false, quantityAfter: 1 })
    expect(result.save.unlockedSkills).toEqual(save.unlockedSkills)
  })
})
