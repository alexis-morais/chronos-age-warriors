import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EQUIPMENT_CHANCES, RARITY_CHANCES, rarityOrder, rarityWeights } from './config'
import { equipment } from './data'
import { addWarriorXp, grantWarrior, rollChest, rollRarity } from './game'
import { RIFT_CHEST_ODDS, openRiftChest } from './riftChest'
import { purchaseChest, openStoredChest } from './chestSystem'
import { WARRIOR_RECYCLE_REWARDS, queueWarriorRecycle, recycleWarrior } from './warriorRecycle'
import { primalWarriors } from './warriors'
import { freshSave, loadSave } from './storage'
import { establishedKargSave } from './testFixtures'
import { campaignBattleReward, settleCampaignBattle } from './nemesisCampaign'
import { ChestOddsModal } from './components/ChestOddsModal'
import { ChestPage } from './components/ChestPage'
import { RiftPage } from './components/RiftPage'
import { parisDateKey } from './rift'
import { withAdminAccess } from './admin'

describe('V0.14 tables exactes et catégorie avant rareté', () => {
  it.each([
    [RARITY_CHANCES, [7000,2200,700,85,14,1]],
    [EQUIPMENT_CHANCES, [6300,2700,850,135,14,1]],
    [RIFT_CHEST_ODDS, [500,1500,4000,2800,1000,200]],
  ])('couvre exactement les 10 000 tickets, sans flottants cumulés', (table, expected) => {
    expect(rarityWeights(table)).toEqual(expected)
    expect(rarityWeights(table).reduce((sum, value) => sum + value, 0)).toBe(10000)
    const counts = rarityOrder.map(() => 0)
    for (let ticket = 0; ticket < 10000; ticket++) counts[rarityOrder.indexOf(rollRarity(() => (ticket + .5) / 10000, table))]++
    expect(counts).toEqual(expected)
  })
  it('possède 10 armes et 10 armures, chaque rareté dans les deux catégories, et admin auto-étendu', () => {
    expect(equipment).toHaveLength(20)
    for (const type of ['weapon','armor']) {
      expect(equipment.filter((item) => item.type === type)).toHaveLength(10)
      for (const rarity of rarityOrder) expect(equipment.some((item) => item.type === type && item.rarity === rarity)).toBe(true)
    }
    expect(Object.keys(withAdminAccess(freshSave()).owned)).toHaveLength(20)
  })
  it('appelle le RNG type, rareté, objet : 50/50 quel que soit le nombre d’objets', () => {
    const counts = { weapon: 0, armor: 0 }
    for (let ticket = 0; ticket < 10000; ticket++) {
      const rolls = [(ticket + .5) / 10000, .99995, 0]
      const rng = vi.fn(() => rolls.shift()!)
      const item = rollChest(rng, {}).item
      counts[item.type]++
      expect(item.rarity).toBe('Mythique')
      expect(rng).toHaveBeenCalledTimes(3)
    }
    expect(counts).toEqual({ weapon: 5000, armor: 5000 })
  })
})

describe('V0.14 économie et recyclage atomique', () => {
  it.each(['normal','nemesis'] as const)('sépare première victoire, replay et défaite (%s)', (mode) => {
    const save = establishedKargSave()
    const first = settleCampaignBattle(save, mode, 1, 'player')
    expect(first.xp).toBe(mode === 'normal' ? 20 : 50)
    expect(first.coins).toBe(first.xp)
    const replay = settleCampaignBattle(first.save, mode, 1, 'player')
    expect(replay.xp).toBe(mode === 'normal' ? 5 : 10)
    expect(replay.coins).toBe(replay.xp)
    expect(campaignBattleReward(20, false, mode, true)).toEqual({ xp: mode === 'normal' ? 4 : 10, coins: 0 })
  })
  it.each(rarityOrder)('recycle le Warrior concerné, une fois, même après reload (%s)', (rarity) => {
    const warrior = primalWarriors.find((entry) => entry.rarity === rarity)!
    const save = grantWarrior(establishedKargSave(), warrior.id)
    const id = queueWarriorRecycle(save, warrior.id)
    const restored = loadSave({ getItem: () => JSON.stringify(save) })
    const recycled = recycleWarrior(restored, id)
    const reward = WARRIOR_RECYCLE_REWARDS[rarity]
    const expected = structuredClone(restored)
    const active = expected.activeWarriorId
    expected.activeWarriorId = warrior.id
    addWarriorXp(expected, reward.xp)
    expect(recycled.coins).toBe(restored.coins + reward.coins)
    expect(recycled.ownedWarriors[warrior.id]).toEqual(expected.ownedWarriors[warrior.id])
    expect(recycled.activeWarriorId).toBe(active)
    expect(recycled.loadouts).toEqual(save.loadouts)
    expect(recycleWarrior(recycled, id)).toBe(recycled)
    expect(Object.keys(recycled.ownedWarriors)).toHaveLength(Object.keys(save.ownedWarriors).length)
  })
  it('à niveau 10 donne seulement les pièces et garde XP=0', () => {
    const save = establishedKargSave(); save.ownedWarriors.karg = { warriorId: 'karg', level: 10, xp: 0 }
    const next = recycleWarrior(save, queueWarriorRecycle(save, 'karg'))
    expect(next.ownedWarriors.karg).toEqual(save.ownedWarriors.karg)
    expect(next.coins).toBe(save.coins + 20)
  })
  it('350 XP monte Tyrak de 1 à 3 puis sature proprement le palier 10', () => {
    const save = grantWarrior(establishedKargSave(), 'tyrak')
    let next = recycleWarrior(save, queueWarriorRecycle(save, 'tyrak'))
    expect(next.ownedWarriors.tyrak).toEqual({ warriorId: 'tyrak', level: 3, xp: 50 })
    next.ownedWarriors.tyrak = { warriorId: 'tyrak', level: 9, xp: 1790 }
    next = recycleWarrior(next, queueWarriorRecycle(next, 'tyrak'))
    expect(next.ownedWarriors.tyrak).toEqual({ warriorId: 'tyrak', level: 10, xp: 0 })
  })
  it('toutes les sources de doublons créent un reçu et ne recyclent pas pendant le tirage', () => {
    const save = establishedKargSave(); save.riftChestCount = 1; save.warriorChestCount = 1
    for (const next of [purchaseChest(save, { kind: 'warrior', quantity: 1 }, () => 0)!.save,
      openStoredChest(save, 'warrior', () => 0)!.save, openRiftChest(save, () => 0)!.save]) {
      expect(next.pendingWarriorRecycles).toHaveLength(1)
      expect(next.ownedWarriors.karg.xp).toBe(0)
    }
  })
  it('préserve niveaux, XP, loadouts et reçus v5 sous la nouvelle courbe', () => {
    const save = establishedKargSave(); save.ownedWarriors.karg = { warriorId: 'karg', level: 6, xp: 500 }
    save.campaignNode = 15; save.defeatedNodes = [1,5,10]; save.nemesisUnlocked = true
    const loaded = loadSave({ getItem: () => JSON.stringify(save) })
    expect(loaded.ownedWarriors).toEqual(save.ownedWarriors)
    expect(loaded.loadouts).toEqual(save.loadouts)
    expect(loaded.defeatedNodes).toEqual(save.defeatedNodes)
    expect(loaded.campaignNode).toBe(15)
  })
})

describe('V0.14 UI', () => {
  it('reprend un reçu après reload et ignore un double clic sur Recycler', () => {
    const save = establishedKargSave()
    queueWarriorRecycle(save, 'karg')
    const persist = vi.fn()
    render(<ChestPage save={save} setSave={persist} admin={false}/>)
    expect(screen.getByRole('dialog', { name: 'Tirage du Coffre Warrior' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Toucher ou cliquer pour passer la roulette' }))
    const recycle = screen.getByRole('button', { name: 'RECYCLER' })
    act(() => { recycle.click(); recycle.click() })
    expect(persist).toHaveBeenCalledOnce()
    expect(persist.mock.calls[0][0].pendingWarriorRecycles).toHaveLength(0)
    expect(screen.getByText('RECYCLÉ')).toBeTruthy()
  })
  it('affiche les trois tables dans une modale accessible, refermable', () => {
    const close = vi.fn(); render(<ChestOddsModal onClose={close}/>)
    expect(screen.getByRole('dialog', { name: 'Probabilités des coffres' })).toBeTruthy()
    expect(screen.getByText('50 % Arme · 50 % Armure')).toBeTruthy()
    expect(screen.getAllByText('0,01 %')).toHaveLength(2)
    fireEvent.keyDown(window, { key: 'Escape' }); expect(close).toHaveBeenCalledOnce()
  })
  it('une Faille perdue retourne à l’entrée sans gros récapitulatif ni nouvelle tentative', () => {
    const save = establishedKargSave()
    save.riftRun = { dateKey: parisDateKey(), status: 'lost', warriorId: 'karg', stage: 2, lineup: ['raptor','shaman','mammoth','smilodon','cave-brute'], seed: 42, difficulty: 100, earnedCoins: 80, earnedXp: 80 }
    const { container } = render(<RiftPage save={save} setSave={vi.fn()} setView={vi.fn()} onStart={vi.fn()} admin={false}/>)
    expect(container.querySelector('.rift-entry')).toBeTruthy()
    expect(container.querySelector('.rift-stage-track,.rift-finale,.rift-warrior')).toBeNull()
    expect(screen.queryByRole('button', { name: 'ENTRER DANS LA FAILLE' })).toBeNull()
    expect(screen.getByRole('timer')).toBeTruthy()
  })
})
