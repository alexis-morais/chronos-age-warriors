import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ADMIN_SAVE_KEY, canStartBattle } from './admin'
import { openStoredChest } from './chestSystem'
import { ExpeditionPage } from './components/ExpeditionPage'
import { EXPEDITION_MAX_MS, EXPEDITION_ROLL_MS, expeditionRarityWeights } from './expeditionBalance'
import { dismissExpeditionReturn, expeditionChestChances, expeditionClock, expeditionElapsed, isWarriorOnExpedition, rollExpeditionRewards, settleExpedition, startExpedition } from './expedition'
import { grantWarrior } from './game'
import { beginRiftStage, prepareRift } from './rift'
import { loadSave, persistSave, SAVE_KEY } from './storage'
import { establishedKargSave } from './testFixtures'

const start = Date.parse('2026-01-15T12:00:00Z')
const hour = 3_600_000
const neutral = () => 0.5
const started = () => startExpedition(establishedKargSave(), 'karg', start)

describe('Expédition — temps, disponibilité et sauvegarde', () => {
  it('n’autorise qu’une seule expédition et uniquement un Warrior possédé', () => {
    const save = establishedKargSave()
    expect(startExpedition(save, 'naya', start)).toBe(save)
    const first = startExpedition(save, 'karg', start)
    expect(first.expedition).toEqual({ warriorId: 'karg', startedAt: start })
    expect(startExpedition(first, 'karg', start + hour)).toBe(first)
    expect(save.expedition).toBeNull()
  })

  it('compte depuis le timestamp après fermeture et plafonne à 24 h', () => {
    expect(expeditionElapsed(start, start + hour)).toBe(hour)
    expect(expeditionElapsed(start, start + 12 * hour)).toBe(12 * hour)
    expect(expeditionElapsed(start, start + 30 * hour)).toBe(EXPEDITION_MAX_MS)
    expect(expeditionClock(0)).toBe('00:00:00')
    expect(expeditionClock(1000)).toBe('00:00:01')
    expect(expeditionClock(30 * hour)).toBe('24:00:00')
    const stored = new Map<string, string>()
    const storage = { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => { stored.set(key, value) } }
    persistSave(started(), storage)
    const reloaded = loadSave(storage)
    expect(reloaded.expedition?.startedAt).toBe(start)
    expect(expeditionElapsed(reloaded.expedition!.startedAt, start + 12 * hour)).toBe(12 * hour)
  })

  it('migre les anciennes saves sans expédition et isole la carrière admin', () => {
    const stored = new Map<string, string>()
    const storage = { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => { stored.set(key, value) } }
    const legacy = establishedKargSave() as unknown as Record<string, unknown>
    delete legacy.expedition
    delete legacy.expeditionReturn
    delete legacy.equipmentChestCount
    delete legacy.warriorChestCount
    legacy.trainingRemaining = 7
    legacy.trainingWins = 12
    storage.setItem(SAVE_KEY, JSON.stringify(legacy))
    const migrated = loadSave(storage)
    expect(migrated).toMatchObject({ expedition: null, expeditionReturn: null, equipmentChestCount: 0, warriorChestCount: 0 })
    expect('trainingRemaining' in migrated).toBe(false)
    expect('trainingWins' in migrated).toBe(false)
    expect(migrated.ownedWarriors.karg.level).toBe(1)
    expect(migrated.coins).toBe(300)
    persistSave(startExpedition(migrated, 'karg', start), storage, ADMIN_SAVE_KEY)
    expect(loadSave(storage).expedition).toBeNull()
    expect(loadSave(storage, ADMIN_SAVE_KEY).expedition?.warriorId).toBe('karg')
  })

  it('bloque Aventure et Faille pour ce Warrior, y compris en admin, sans toucher au Duel', () => {
    const save = started()
    expect(isWarriorOnExpedition(save, 'karg')).toBe(true)
    expect(canStartBattle(save, false)).toBe(false)
    expect(canStartBattle(save, true)).toBe(false)
    expect(prepareRift(save, new Date(start), 42)).toBe(save)
    const ready = prepareRift(establishedKargSave(), new Date(start), 42)
    const paused = { ...ready, expedition: save.expedition }
    expect(beginRiftStage(paused, new Date(start))).toBe(paused)
    const naya = grantWarrior(save, 'naya')
    naya.activeWarriorId = 'naya'
    expect(canStartBattle(naya, false)).toBe(true)
    expect(prepareRift(naya, new Date(start), 42).riftRun).not.toBeNull()
  })
})

describe('Expédition — tables et récompenses', () => {
  it('scale 600 XP / 350 pièces avec ±10 % sans valeur négative', () => {
    expect(rollExpeditionRewards(24 * hour, neutral)).toMatchObject({ xp: 600, coins: 350 })
    expect(rollExpeditionRewards(12 * hour, neutral)).toMatchObject({ xp: 300, coins: 175 })
    expect(rollExpeditionRewards(24 * hour, () => 0)).toMatchObject({ xp: 540, coins: 315 })
    expect(rollExpeditionRewards(24 * hour, () => 0.999999)).toMatchObject({ xp: 660, coins: 385 })
    expect(rollExpeditionRewards(0, () => 0)).toMatchObject({ xp: 0, coins: 0 })
  })

  it('donne un roll par quatre heures complètes, 60 % de trouvaille', () => {
    for (const [elapsed, expected] of [[3 * hour + 59 * 60_000, 0], [4 * hour, 1], [7 * hour + 59 * 60_000, 1], [8 * hour, 2], [12 * hour, 3], [24 * hour, 6]]) {
      expect(Math.floor(elapsed / EXPEDITION_ROLL_MS)).toBe(expected)
      expect(rollExpeditionRewards(elapsed, () => 0.6).equipmentIds).toHaveLength(0)
      expect(rollExpeditionRewards(elapsed, () => 0.59).equipmentIds).toHaveLength(expected)
    }
  })

  it('utilise exclusivement les 15 objets et les six raretés existants, avec progression qualitative', () => {
    const short = expeditionRarityWeights(4 * hour)
    const long = expeditionRarityWeights(24 * hour)
    expect(short.find(([rarity]) => rarity === 'Mythique')).toBeUndefined()
    expect(long.find(([rarity]) => rarity === 'Mythique')?.[1]).toBe(1)
    expect(long.find(([rarity]) => rarity === 'Commun')?.[1]).toBeLessThan(short.find(([rarity]) => rarity === 'Commun')![1])
    expect(rollExpeditionRewards(24 * hour, () => 0).equipmentIds).toHaveLength(6)
  })

  it('scale les deux chances de coffre indépendamment et accepte les quatre issues', () => {
    expect(expeditionChestChances(6 * hour)).toEqual({ equipment: 0.05, warrior: 0.0125 })
    expect(expeditionChestChances(12 * hour)).toEqual({ equipment: 0.1, warrior: 0.025 })
    expect(expeditionChestChances(48 * hour)).toEqual({ equipment: 0.2, warrior: 0.05 })
    const outcome = (equipmentRoll: number, warriorRoll: number) => {
      const values = [0.5, 0.5, ...Array(6).fill(0.99), equipmentRoll, warriorRoll]
      let index = 0
      return rollExpeditionRewards(24 * hour, () => values[index++])
    }
    expect(outcome(0.9, 0.9)).toMatchObject({ equipmentChest: false, warriorChest: false })
    expect(outcome(0.1, 0.9)).toMatchObject({ equipmentChest: true, warriorChest: false })
    expect(outcome(0.9, 0.01)).toMatchObject({ equipmentChest: false, warriorChest: true })
    expect(outcome(0.1, 0.01)).toMatchObject({ equipmentChest: true, warriorChest: true })
  })

  it('règle une seule fois, crédite le Warrior envoyé, les doublons, les coffres hors Faille et garde un reçu', () => {
    const save = started()
    save.ownedWarriors.karg.xp = 100
    save.owned['flint-club'].quantity = 2
    const next = settleExpedition(save, start + 48 * hour, () => 0, { forceEquipmentChest: true, forceWarriorChest: true })
    expect(next.expedition).toBeNull()
    expect(next.expeditionReturn).toMatchObject({ elapsedMs: 24 * hour, xp: 540, coins: 315, equipmentChest: true, warriorChest: true })
    expect(next.ownedWarriors.karg.level).toBeGreaterThan(save.ownedWarriors.karg.level)
    expect(next.owned['flint-club'].quantity).toBe(8)
    expect(next.equipmentChestCount).toBe(1)
    expect(next.warriorChestCount).toBe(1)
    expect(next.riftChestCount).toBe(save.riftChestCount)
    expect(settleExpedition(next, start + 49 * hour, () => 0)).toBe(next)
    const stored = new Map<string, string>()
    const storage = { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => { stored.set(key, value) } }
    persistSave(next, storage)
    const reloaded = loadSave(storage)
    expect(reloaded.expeditionReturn).toEqual(next.expeditionReturn)
    expect(settleExpedition(reloaded, start + 49 * hour, () => 0)).toBe(reloaded)
    expect(dismissExpeditionReturn(next).expeditionReturn).toBeNull()
    expect(next.expeditionReturn).not.toBeNull()
  })

  it('les coffres stockés s’ouvrent avec les vraies tables, sans achat', () => {
    const save = establishedKargSave()
    save.equipmentChestCount = 1
    save.warriorChestCount = 1
    const gear = openStoredChest(save, 'equipment', neutral)!
    expect(gear.cost).toBe(0)
    expect(gear.save.equipmentChestCount).toBe(0)
    expect(gear.save.coins).toBe(save.coins)
    expect(gear.draws).toHaveLength(1)
    expect(openStoredChest(gear.save, 'equipment', neutral)).toBeNull()
    const warrior = openStoredChest(gear.save, 'warrior', neutral)!
    expect(warrior.save.warriorChestCount).toBe(0)
    expect(warrior.save.riftChestCount).toBe(0)
  })
})

describe('Expédition — interaction', () => {
  it('demande confirmation pour le dernier Warrior et autorise annuler/envoyer', () => {
    const commit = vi.fn()
    render(<ExpeditionPage save={establishedKargSave()} onCommit={commit} now={start} admin={false}/>)
    expect(screen.getByText('Karg')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'ENVOYER' }))
    expect(screen.getByRole('dialog', { name: 'Confirmer l’envoi' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'ANNULER' }))
    expect(commit).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'ENVOYER' }))
    fireEvent.click(screen.getByRole('dialog').querySelector('.primary')!)
    expect(commit.mock.calls[0][0].expedition).toMatchObject({ warriorId: 'karg', startedAt: start })
  })
  it('affiche le timer, confirme le rappel anticipé et propose récupérer après 24 h', () => {
    const commit = vi.fn()
    const save = started()
    const { rerender } = render(<ExpeditionPage save={save} onCommit={commit} now={start + hour} admin={false}/>)
    expect(screen.getByRole('timer').textContent).toBe('01:00:00')
    fireEvent.click(screen.getByRole('button', { name: 'RAPPELER' }))
    expect(screen.getByRole('dialog', { name: 'Confirmer le rappel' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'ANNULER' }))
    expect(commit).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'RAPPELER' }))
    fireEvent.click(screen.getByRole('dialog').querySelector('.primary')!)
    expect(commit.mock.calls[0][0].expedition).toBeNull()
    commit.mockClear()
    rerender(<ExpeditionPage save={{ ...save }} onCommit={commit} now={start + 30 * hour} admin={false}/>)
    expect(screen.getByRole('timer').textContent).toBe('24:00:00')
    expect(screen.getByText('EXPÉDITION TERMINÉE')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'RÉCUPÉRER' }))
    expect(commit.mock.calls[0][0].expedition).toBeNull()
  })
})
