import { freshSave, parseAccountSave } from '../storage'
import { activateWarrior, addEquipmentCopy, claimWelcomeWarrior, equipItem, grantWarrior } from '../game'

/** Optional local preview preparation brackets; never invent gear bonuses or persist them. */
export const V015_QA_KITS: Readonly<Record<string, readonly [string, string]>> = {
  none: ['', ''], common: ['flint-club', 'hunter-hides'],
  medium: ['volcanic-hammer', 'volcanic-shell'], good: ['tyrant-claw', 'white-titan-fur'],
  endgame: ['titan-heart', 'primordial-titan-skin'],
}

/** DEV/local-only callers; never persisted or synchronized. No real account touched. */
export function v015Fixture(kind: string) {
  if (kind === 'new') return freshSave()
  let save = claimWelcomeWarrior(freshSave(), 'asha')
  save.ownedWarriors.asha.level = 8
  save = grantWarrior(save, 'urgath')
  save.coins = 900
  for (const id of ['flint-club', 'hunter-hides', 'volcanic-hammer', 'volcanic-shell']) {
    for (let copy = 0; copy < 4; copy++) save = addEquipmentCopy(save, id)
  }
  save = equipItem(equipItem(save, 'flint-club'), 'hunter-hides')
  save = activateWarrior(save, 'urgath')
  save = equipItem(equipItem(save, 'volcanic-hammer'), 'volcanic-shell')
  save.defeatedNodes = Array.from({ length: 20 }, (_, i) => i + 1)
  save.campaignNode = 20; save.normalBossFirstClearRewardClaimed = true
  save.nemesisUnlocked = true; save.nemesisDefeatedNodes = [1, 2, 3, 4, 5]; save.nemesisCampaignNode = 6
  if (kind === 'advanced') {
    save.version = 5
    save.campaignRemaining = 10
    save.expedition = { warriorId: 'asha', startedAt: Date.now() - 23.6 * 3_600_000 }
    save.badges = [{ id: 'primal-conqueror', unlockedAt: '2026-10-01T00:00:00Z' }]
    return parseAccountSave(save)!
  }
  return save
}
