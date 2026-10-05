import { GAME } from './config'
import { equipment } from './data'
import type { SaveData } from './types'
import { primalWarriors } from './warriors'
import { chestPrice, type ChestSelection } from './chestSystem'
import { isWarriorOnExpedition } from './expedition'
import { canEnterAdventureNode, type AdventureMode } from './nemesisCampaign'
import { rechargeAdventure } from './combatReserves'

export const ADMIN_SAVE_KEY = 'chronos-age-warriors:admin:v4'
export const ADMIN_COINS = 9_999_999

export function isLocalAdmin(location: Pick<Location, 'hostname' | 'search'>): boolean {
  return ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).has('admin')
}

/** Fill the isolated QA career from the current catalog without changing item or Warrior data. */
export function withAdminAccess(save: SaveData): SaveData {
  const ownedWarriors = { ...save.ownedWarriors }
  for (const warrior of primalWarriors) {
    ownedWarriors[warrior.id] ??= { warriorId: warrior.id, level: 1, xp: 0 }
  }
  const owned = { ...save.owned }
  for (const item of equipment) owned[item.id] ??= { quantity: 1, level: 1, xp: 0, kills: 0 }
  return {
    ...save, activeWarriorId: save.activeWarriorId || primalWarriors[0].id, welcomeChestOpened: true, ownedWarriors, owned, coins: ADMIN_COINS,
    campaignRemaining: GAME.campaignDaily, campaignRechargeAt: null,
  }
}

export function canOpenChest(save: SaveData, admin: boolean, selection: ChestSelection = { kind: 'warrior', quantity: 1 }): boolean {
  return admin || save.coins >= chestPrice(selection)
}

export function canStartBattle(save: SaveData, admin: boolean): boolean {
  if (isWarriorOnExpedition(save, save.activeWarriorId)) return false
  return admin || rechargeAdventure(save).campaignRemaining > 0
}

export function canEnterCampaignNode(save: SaveData, node: number, admin: boolean, mode: AdventureMode = 'normal'): boolean {
  return canEnterAdventureNode(save, mode, node, admin) && canStartBattle(save, admin)
}
