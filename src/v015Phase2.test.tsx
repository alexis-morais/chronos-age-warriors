import dailySql from '../supabase/migrations/202610050005_v015_daily_duel.sql?raw'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, cleanup } from '@testing-library/react'
import { establishedKargSave } from './testFixtures'
import { activateWarrior, addEquipmentCopy, creditWarriorXp, equipItem, grantWarrior, warriorTotalXp } from './game'
import { FIRST_CLEAR_XP, settleCampaignBattle } from './nemesisCampaign'
import { equipmentRecycleQuote, EQUIPMENT_RECYCLE_COINS, recycleEquipment } from './equipmentRecycle'
import { COMBAT_RECHARGE_MS, rechargeAdventure } from './combatReserves'
import { loadSave, parseAccountSave, SAVE_VERSION } from './storage'
import { losesProgress, CloudSaveManager } from './cloudSave'
import { grantEarnedBadges, hasCompletedPrimalNemesis } from './badgeSystem'
import { primalWarriors } from './warriors'
import { parisDateKey } from './rift'
import { settleExpedition, startExpedition } from './expedition'
import { BattleResultOverlay } from './App'
import { v015Fixture } from './qa/v015Fixtures'
import { strictDuelPayload } from './duelRules'

const reload = (save: ReturnType<typeof establishedKargSave>) => loadSave({ getItem: () => JSON.stringify(save) }, 'test-memory')

describe('V0.15 personal first-clears', () => {
  it.each(['normal', 'nemesis'] as const)('première victoire globale, personnelle XP seule, replay puis reload (%s)', (mode) => {
    let save = grantWarrior(establishedKargSave(), 'tyrak')
    save.nemesisUnlocked = true
    const first = settleCampaignBattle(save, mode, 1, 'player')
    expect(first.xp).toBe(FIRST_CLEAR_XP[mode][0])
    expect(first.coins).toBe(mode === 'normal' ? 20 : 50)
    const global = mode === 'normal' ? first.save.defeatedNodes : first.save.nemesisDefeatedNodes
    save = activateWarrior(first.save, 'tyrak')
    const personal = settleCampaignBattle(save, mode, 1, 'player')
    expect(personal.xp).toBe(first.xp); expect(personal.coins).toBe(0)
    expect(personal.bonusCoins).toBe(0); expect(personal.bonusChests).toBe(0)
    expect(mode === 'normal' ? personal.save.defeatedNodes : personal.save.nemesisDefeatedNodes).toEqual(global)
    save = reload(personal.save)
    expect(save.personalClears.tyrak[mode]).toEqual([1])
    const repeat = settleCampaignBattle(save, mode, 1, 'player')
    expect(repeat.xp).toBe(mode === 'normal' ? 5 : 10)
    expect(repeat.coins).toBe(repeat.xp)
  })
  it.each(['normal', 'nemesis'] as const)('ne répète jamais les lots Boss sur un autre Warrior (%s)', (mode) => {
    let save = grantWarrior(establishedKargSave(), 'tyrak')
    save = settleCampaignBattle(save, mode, 20, 'player').save
    const coins = save.coins, chests = [save.warriorChestCount, save.riftChestCount]
    save = activateWarrior(save, 'tyrak')
    const personal = settleCampaignBattle(save, mode, 20, 'player')
    expect(personal.xp).toBe(FIRST_CLEAR_XP[mode][19])
    expect(personal.save.coins).toBe(coins)
    expect([personal.save.warriorChestCount, personal.save.riftChestCount]).toEqual(chests)
  })
  it('le contexte figé paie le bon Warrior et ne paie pas deux fois après reload', () => {
    const save = grantWarrior(establishedKargSave(), 'naya')
    const context = { warriorId: 'karg', sequence: 1, now: Date.now() }
    const switched = activateWarrior(save, 'naya')
    const next = settleCampaignBattle(switched, 'normal', 1, 'player', context).save
    expect(next.ownedWarriors.karg.level).toBe(2)
    expect(next.ownedWarriors.naya.level).toBe(1)
    const restored = reload(next)
    expect(settleCampaignBattle(restored, 'normal', 1, 'player', context).save).toBe(restored)
    const exhausted = { ...save, campaignRemaining: 0, campaignRechargeAt: context.now + COMBAT_RECHARGE_MS }
    expect(settleCampaignBattle(exhausted, 'normal', 1, 'player', context).save).toBe(exhausted)
  })
  it('conserve exactement la pente des premières victoires, indépendamment du main et de la rareté', () => {
    for (const warrior of primalWarriors) {
      let fresh = grantWarrior(establishedKargSave(), warrior.id), late = grantWarrior(establishedKargSave(), warrior.id)
      fresh = activateWarrior(fresh, warrior.id); late = activateWarrior(late, warrior.id)
      late.defeatedNodes = [1, 2, 3, 4, 5]
      for (let node = 1; node <= 5; node++) {
        fresh = settleCampaignBattle(fresh, 'normal', node, 'player').save
        late = settleCampaignBattle(late, 'normal', node, 'player').save
      }
      expect(late.ownedWarriors[warrior.id]).toEqual(fresh.ownedWarriors[warrior.id])
      expect(late.ownedWarriors[warrior.id]).toMatchObject({ level: 5, xp: 250 })
    }
  })
})

describe('V0.15 migration et cloud', () => {
  it('v5 conserve plusieurs loadouts, compteurs, expédition et badges ; cap plein 10→15, aucun personal clear deviné', () => {
    const advanced = v015Fixture('advanced')
    expect(advanced.version).toBe(SAVE_VERSION)
    expect(advanced.campaignRemaining).toBe(15)
    expect(advanced.personalClears).toEqual({})
    expect(advanced.ownedWarriors.asha.level).toBe(8)
    expect(advanced.loadouts.asha).toEqual({ weapon: 'flint-club', armor: 'hunter-hides' })
    expect(advanced.expedition?.warriorId).toBe('asha')
    expect(advanced.defeatedNodes).toHaveLength(20)
    expect(advanced.badges).toHaveLength(1)
    expect(reload(advanced)).toEqual(advanced)
  })
  it('une réserve partielle conserve sa recharge offline et atteint exactement le nouveau plafond', () => {
    const save = establishedKargSave(); save.version = 5; save.campaignRemaining = 8
    save.campaignRechargeAt = Date.now() + COMBAT_RECHARGE_MS
    const loaded = reload(save)
    expect(loaded.campaignRemaining).toBe(8)
    expect(loaded.campaignRechargeAt).toBe(save.campaignRechargeAt)
    expect(rechargeAdventure(loaded, save.campaignRechargeAt + 6 * COMBAT_RECHARGE_MS)).toMatchObject({ campaignRemaining: 15, campaignRechargeAt: null })
  })
  it('normalise les IDs et les nodes invalides sans attribuer de victoires à un Warrior inconnu', () => {
    const save = establishedKargSave()
    save.personalClears = { karg: { normal: [1, 1, 0, 21, 2.5, 20], nemesis: [5] }, unknown: { normal: [1], nemesis: [] } }
    expect(reload(save).personalClears).toEqual({ karg: { normal: [1, 20], nemesis: [5] } })
  })
  it('refuse une régression de personal clear et de reçu de recyclage', () => {
    const save = establishedKargSave(), authoritative = reload(save)
    authoritative.personalClears.karg = { normal: [1], nemesis: [2] }
    authoritative.equipmentRecycleSequence = 1
    expect(losesProgress(save, authoritative)).toBe(true)
    expect(losesProgress(authoritative, authoritative)).toBe(false)
  })
  it('cloud avancé gagne contre cache vide/nouvelle origine et inclut les nouveaux champs', async () => {
    const advanced = v015Fixture('personal')
    advanced.personalClears.urgath = { normal: [1, 2], nemesis: [] }
    advanced.equipmentRecycleSequence = 3
    const memory = new Map<string, string>()
    const manager = new CloudSaveManager('isolated-test-user', { getItem: k => memory.get(k) ?? null, setItem: (k,v) => { memory.set(k,v) } }, {
      read: async () => ({ save: advanced, revision: 12, updatedAt: '2026-10-05' }),
      write: async () => { throw new Error('No bootstrap overwrite permitted') },
    }, () => true, { onStatus: () => {}, onConflict: () => {}, onSave: () => {} })
    const selected = await manager.initialize(false)
    expect(selected).toEqual(advanced)
    expect(memory.size).toBe(1)
    manager.dispose()
  })
})

describe('V0.15 recyclage manuel équipement', () => {
  it.each(Object.entries(EQUIPMENT_RECYCLE_COINS))('table %s = %i, toujours inférieure au coffre', (_rarity, coins) => {
    expect(coins).toBeLessThan(25)
  })
  it('ne vend jamais le dernier exemplaire, ne change aucun loadout ni aucune XP et résiste aux confirmations répétées', () => {
    let save = grantWarrior(establishedKargSave(), 'naya')
    save = addEquipmentCopy(addEquipmentCopy(save, 'flint-club'), 'flint-club')
    save = equipItem(activateWarrior(save, 'naya'), 'flint-club')
    const quote = equipmentRecycleQuote(save, 'flint-club', 2)!
    expect(quote).toEqual({ quantity: 3, count: 2, remaining: 1, coins: 6 })
    const next = recycleEquipment(save, 'flint-club', 2, 3, 1)
    expect(next.coins).toBe(save.coins + 6)
    expect(next.loadouts).toEqual(save.loadouts); expect(next.ownedWarriors).toEqual(save.ownedWarriors)
    expect(next.owned['flint-club']).toEqual({ ...save.owned['flint-club'], quantity: 1 })
    expect(recycleEquipment(next, 'flint-club', 1, 1, 2)).toBe(next)
    const restored = reload(next)
    expect(recycleEquipment(restored, 'flint-club', 2, 3, 1)).toBe(restored)
    expect(recycleEquipment(save, 'flint-club', 1.5, 3, 1)).toBe(save)
    expect(recycleEquipment(save, 'unknown', 1, 3, 1)).toBe(save)
  })
})

describe('V0.15 XP et badges', () => {
  it('crédite seulement la XP jusqu’au plafond et affiche Niveau maximum au résultat', () => {
    const save = establishedKargSave(); save.ownedWarriors.karg.level = 9; save.ownedWarriors.karg.xp = 1790
    expect(creditWarriorXp(save, 100)).toBe(10)
    expect(warriorTotalXp(save)).toBe(6850); expect(creditWarriorXp(save, 100)).toBe(0)
    const next = settleExpedition(startExpedition(save, 'karg', 1), 86_400_001, () => .5)
    expect(next.expeditionReturn?.xp).toBe(0)
    render(<BattleResultOverlay winner="player" enemyName="QA" summary={{ xp: 0, coins: 20, levelUp: 0, badges: [], unlockedPassives: [] }} warriorLevel={10} onContinue={() => {}}/>)
    expect(screen.getByText('Niveau maximum')).not.toBeNull()
    expect(screen.queryByText('+20 XP')).toBeNull()
    fireEvent.click(screen.getByText('CONTINUER')); cleanup()
  })
  it('Némésis se débloque et les 12 Warriors paient exactement 1500 une seule fois ; v5 reçoit seulement le complément', () => {
    const save = establishedKargSave()
    for (const warrior of primalWarriors) save.ownedWarriors[warrior.id] = { warriorId: warrior.id, level: 1, xp: 0 }
    save.nemesisCompleted = true
    expect(hasCompletedPrimalNemesis(save)).toBe(true)
    const awarded = grantEarnedBadges(save)
    expect(awarded.granted.find(r => r.id === 'primal-all-warriors')?.coins).toBe(1500)
    expect(awarded.granted.find(r => r.id === 'primal-nemesis')?.coins).toBe(500)
    expect(grantEarnedBadges(reload(awarded.save)).granted).toEqual([])
    const legacy = establishedKargSave(); legacy.badges = [{ id: 'primal-all-warriors', unlockedAt: '2026-10-01' }]
    const topup = grantEarnedBadges(legacy)
    expect(topup.save.coins - legacy.coins).toBe(1300)
    expect(grantEarnedBadges(reload(topup.save)).granted).toEqual([])
  })
})

describe('V0.15 contrat backend quotidien (analyse statique, pas un test Postgres distant)', () => {
  it('refuse les nouveaux reçus et personal clears malformés côté moteur Duel partagé', () => {
    const save = establishedKargSave()
    expect(strictDuelPayload(save)).toBe(true)
    expect(strictDuelPayload({ ...save, equipmentRecycleSequence: -1 })).toBe(false)
    expect(strictDuelPayload({ ...save, campaignBattleSequence: 1.5 })).toBe(false)
    expect(strictDuelPayload({ ...save, personalClears: { karg: { normal: [1, 1], nemesis: [] } } })).toBe(false)
    expect(strictDuelPayload({ ...save, personalClears: { unknown: { normal: [1], nemesis: [] } } })).toBe(false)
  })
  it('nouvelle migration : Paris, sans recharge, row lock, CAS, idempotence, service_role et awards validés', () => {
    const sql = dailySql
    expect(sql).toContain("timezone('Europe/Paris', ts)::date")
    expect(sql).toContain("at time zone 'Europe/Paris'")
    expect(sql).toContain('charges = greatest(0, 10 -')
    expect(sql).toContain('own.charges := 10')
    expect(sql).not.toContain("interval '20 minutes'")
    expect(sql).toContain('charges = own.charges - 1')
    expect(sql).toContain('for update'); expect(sql).toContain('if found then return existing.replay')
    expect(sql).toContain('p_attacker_revision'); expect(sql).toContain('p_defender_revision')
    expect(sql).toContain("is distinct from 'service_role'")
    expect(sql).toContain('from public, anon, authenticated')
    expect(sql).toContain('(p_xp <> 20 or p_coins <> 10)')
  })
  it('dates Paris aux deux changements DST : journées 23 h et 25 h sans recharge de minutes', () => {
    expect(parisDateKey(new Date('2026-03-28T23:00:00Z'))).toBe('2026-03-29')
    expect(parisDateKey(new Date('2026-03-29T22:00:00Z'))).toBe('2026-03-30')
    expect(parisDateKey(new Date('2026-10-24T22:00:00Z'))).toBe('2026-10-25')
    expect(parisDateKey(new Date('2026-10-25T23:00:00Z'))).toBe('2026-10-26')
    expect(parseAccountSave(establishedKargSave())?.campaignRemaining).toBe(15)
  })
})
