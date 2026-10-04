import { beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCacheKey, CloudSaveManager, readAccountCache, type CloudGateway, type CloudRow, type SaveConflict, type SyncStatus } from './cloudSave'
import { freshSave, parseAccountSave } from './storage'
import { establishedKargSave } from './testFixtures'

function harness(userId = 'user-a') {
  let cloud: CloudRow | null = null
  let online = true
  const statuses: SyncStatus[] = []
  const conflicts: SaveConflict[] = []
  const gateway: CloudGateway = {
    read: vi.fn(async () => cloud),
    write: vi.fn(async (revision, save) => {
      if (revision !== (cloud?.revision ?? 0)) return { status: 'conflict' as const, row: cloud }
      cloud = { save, revision: revision + 1, updatedAt: '2026-10-04T00:00:00Z' }
      return { status: 'saved' as const, row: cloud }
    }),
  }
  const replaced = vi.fn()
  const manager = () => new CloudSaveManager(userId, localStorage, gateway, () => online, {
    onStatus: (status) => statuses.push(status), onConflict: (conflict) => conflicts.push(conflict), onSave: replaced,
  })
  return { gateway, manager, statuses, conflicts, replaced, get cloud() { return cloud }, set cloud(value: CloudRow | null) { cloud = value }, set online(value: boolean) { online = value } }
}

beforeEach(() => { localStorage.clear(); vi.useRealTimers() })

describe('sauvegarde cloud par compte', () => {
  const advanced = () => ({ ...establishedKargSave(), campaignNode: 15, defeatedNodes: [1,5,10],
    ownedWarriors: { karg: { warriorId: 'karg', level: 3, xp: 42 }, asha: { warriorId: 'asha', level: 6, xp: 500 } } })

  it.each(['cache vide', 'nouvelle origine / port'])('%s : charge le cloud avancé avant toute écriture', async () => {
    const setup = harness(); setup.cloud = { save: advanced(), revision: 8, updatedAt: 'cloud' }
    const manager = setup.manager()
    expect(await manager.initialize(false)).toEqual(setup.cloud.save)
    expect(setup.gateway.write).not.toHaveBeenCalled()
    expect(readAccountCache('user-a', localStorage)).toMatchObject({ revision: 8, dirty: false, save: { campaignNode: 15 } })
    manager.dispose()
  })

  it.each([freshSave(), establishedKargSave()])('cache neuf/default dirty de même révision : aucun écrasement silencieux', async (save) => {
    const setup = harness(); setup.cloud = { save: advanced(), revision: 8, updatedAt: 'cloud' }
    localStorage.setItem(accountCacheKey('user-a'), JSON.stringify({ save, revision: 8, updatedAt: 'device', dirty: true }))
    const manager = setup.manager(); await manager.initialize(false)
    expect(setup.conflicts).toHaveLength(1)
    expect(setup.gateway.write).not.toHaveBeenCalled()
    manager.chooseCloud()
    expect(manager.current).toEqual(setup.cloud.save)
    expect(setup.cloud.save.ownedWarriors.asha.level).toBe(6)
    manager.dispose()
  })

  it('un reset injecté après bootstrap est rejeté avant de toucher le cache', async () => {
    const setup = harness(); setup.cloud = { save: advanced(), revision: 8, updatedAt: 'cloud' }
    const manager = setup.manager(); await manager.initialize(false)
    manager.change(establishedKargSave()); await manager.flush()
    expect(setup.conflicts).toHaveLength(0)
    expect(setup.statuses.at(-1)).toBe('error')
    expect(setup.replaced).toHaveBeenCalledWith(advanced())
    expect(setup.gateway.write).not.toHaveBeenCalled()
    expect(setup.cloud.save.ownedWarriors.asha.level).toBe(6)
    manager.dispose()
  })

  it('un reset rejeté conserve les progrès locaux dirty puis les synchronise', async () => {
    const setup = harness(); setup.cloud = { save: advanced(), revision: 8, updatedAt: 'cloud' }
    const manager = setup.manager(); await manager.initialize(false)
    setup.online = false
    const pending = advanced(); pending.ownedWarriors.asha.xp = 520
    manager.change(pending)
    manager.change(establishedKargSave())
    expect(readAccountCache('user-a', localStorage)).toMatchObject({ dirty: true, save: pending })
    expect(manager.current).toEqual(pending)
    setup.online = true; await manager.reconnect(); await manager.flush()
    expect(setup.cloud.save.ownedWarriors.asha.xp).toBe(520)
    manager.dispose()
  })

  it('cache ancien dirty + cloud récent : conflit CAS, jamais envoi automatique', async () => {
    const setup = harness(); setup.cloud = { save: advanced(), revision: 9, updatedAt: 'cloud' }
    localStorage.setItem(accountCacheKey('user-a'), JSON.stringify({ save: advanced(), revision: 8, updatedAt: 'old', dirty: true }))
    const manager = setup.manager(); await manager.initialize(false)
    expect(setup.conflicts).toHaveLength(1); expect(setup.gateway.write).not.toHaveBeenCalled()
    manager.dispose()
  })

  it('un bootstrap concurrent ne remplace pas le cloud apparu entre read et write(0)', async () => {
    const setup = harness()
    setup.gateway.write = vi.fn(async () => { setup.cloud = { save: advanced(), revision: 8, updatedAt: 'race' }; return { status: 'conflict' as const, row: setup.cloud } })
    const manager = setup.manager(); expect(await manager.initialize(false)).toEqual(advanced())
    expect(readAccountCache('user-a', localStorage)?.revision).toBe(8)
    manager.dispose()
  })
  it('crée la save initiale par CAS puis isole les caches utilisateur', async () => {
    const one = harness('user-a'); const manager = one.manager()
    await manager.initialize(false)
    expect(one.cloud?.revision).toBe(1)
    expect(readAccountCache('user-a', localStorage)?.save.coins).toBe(300)
    expect(readAccountCache('user-b', localStorage)).toBeNull()
    expect(localStorage.getItem(accountCacheKey('user-a'))).toBeTruthy()
    manager.dispose()
  })

  it('garde une mutation offline et la synchronise à la reconnexion', async () => {
    const setup = harness(); const manager = setup.manager(); await manager.initialize(false)
    setup.online = false
    manager.change({ ...freshSave(), coins: 432 })
    expect(readAccountCache('user-a', localStorage)?.dirty).toBe(true)
    expect(setup.cloud?.save.coins).toBe(300)
    setup.online = true
    await manager.reconnect()
    expect(setup.cloud?.save.coins).toBe(432)
    expect(readAccountCache('user-a', localStorage)?.dirty).toBe(false)
    manager.dispose()
  })

  it('n’écrase pas une révision concurrente et exige un choix', async () => {
    const setup = harness(); const manager = setup.manager(); await manager.initialize(false)
    setup.online = false
    manager.change({ ...freshSave(), coins: 111 })
    setup.cloud = { save: { ...freshSave(), coins: 222 }, revision: 2, updatedAt: 'later' }
    setup.online = true
    await manager.reconnect()
    expect(setup.conflicts).toHaveLength(1)
    expect(setup.cloud?.save.coins).toBe(222)
    manager.chooseCloud()
    expect(setup.replaced).toHaveBeenCalledWith(expect.objectContaining({ coins: 222 }))
    expect(readAccountCache('user-a', localStorage)?.save.coins).toBe(222)
    manager.dispose()
  })

  it('peut conserver explicitement la version appareil après un conflit', async () => {
    const setup = harness(); const manager = setup.manager(); await manager.initialize(false)
    setup.online = false
    manager.change({ ...freshSave(), coins: 111 })
    setup.cloud = { save: { ...freshSave(), coins: 222 }, revision: 2, updatedAt: 'later' }
    setup.online = true
    await manager.reconnect()
    await manager.chooseDevice()
    expect(setup.cloud?.revision).toBe(3)
    expect(setup.cloud?.save.coins).toBe(111)
    manager.dispose()
  })

  it('refuse le premier accès offline sans compte et cache préexistant', async () => {
    const setup = harness(); setup.online = false
    await expect(setup.manager().initialize(false)).rejects.toThrow('Connexion Internet requise')
  })

  it('ne remplace pas silencieusement une save cloud invalide par une partie neuve', () => {
    expect(parseAccountSave({ version: 4, activeWarriorId: 'unknown', ownedWarriors: {}, unlockedSkills: [], coins: 1 })).toBeNull()
    expect(parseAccountSave({ version: 4, activeWarriorId: '', ownedWarriors: { karg: {} }, unlockedSkills: [], coins: 1, welcomeChestOpened: false })).toBeNull()
  })

  it('bloque le premier accès si la création cloud échoue', async () => {
    const setup = harness()
    setup.gateway.write = vi.fn().mockRejectedValue(new Error('Migration non appliquée'))
    await expect(setup.manager().initialize(false)).rejects.toThrow('Migration non appliquée')
    expect(readAccountCache('user-a', localStorage)).toBeNull()
  })

  it('vide les changements locaux avant Duel puis lit la révision récompensée par le serveur', async () => {
    const setup = harness(); const manager = setup.manager(); await manager.initialize(false)
    manager.change({ ...freshSave(), coins: 345 })
    expect(await manager.readyForServerMutation()).toBe(true)
    expect(setup.cloud?.revision).toBe(2)
    setup.cloud = { save: { ...freshSave(), coins: 395 }, revision: 3, updatedAt: 'server-duel' }
    await manager.refreshAfterServerMutation()
    expect(readAccountCache('user-a', localStorage)).toMatchObject({ revision: 3, dirty: false, save: { coins: 395 } })
    expect(setup.replaced).toHaveBeenCalledWith(expect.objectContaining({ coins: 395 }))
    manager.dispose()
  })

  it('détecte le Duel serveur N+1 avant toute réécriture locale depuis N', async () => {
    const setup = harness(); const manager = setup.manager(); await manager.initialize(false)
    expect(setup.cloud?.revision).toBe(1)
    setup.cloud = { save: { ...freshSave(), coins: 350 }, revision: 2, updatedAt: 'server-duel' }
    manager.change({ ...freshSave(), coins: 310 })
    await manager.flush()
    expect(setup.cloud?.revision).toBe(2)
    expect(setup.cloud?.save.coins).toBe(350)
    expect(setup.conflicts).toHaveLength(1)
    expect(readAccountCache('user-a', localStorage)?.dirty).toBe(true)
    manager.dispose()
  })
})
