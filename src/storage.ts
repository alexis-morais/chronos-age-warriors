import type { SaveData } from './types'
import { DEV_WARRIOR_ID, warriorDefinitions } from './warriors'

export const SAVE_KEY = 'chronos-age-warriors:v2'
export const SAVE_VERSION = 2
export const localDate = (date = new Date()) => date.toLocaleDateString('sv-SE')

export function freshSave(): SaveData {
  return {
    version: SAVE_VERSION,
    activeWarriorId: DEV_WARRIOR_ID,
    ownedWarriors: { [DEV_WARRIOR_ID]: { warriorId: DEV_WARRIOR_ID, level: 1, xp: 0, bonusStats: { strength: 0, dodge: 0, speed: 0, hp: 0 } } },
    unlockedSkills: [],
    coins: 300,
    owned: { 'flint-club': { level: 1, xp: 0, kills: 0 }, 'hunter-hides': { level: 1, xp: 0, kills: 0 } },
    equippedWeapon: 'flint-club', equippedArmor: 'hunter-hides', campaignNode: 1, defeatedNodes: [], campaignRemaining: 10,
    trainingRemaining: 100, trainingWins: 0, totalWins: 0, chests: 0, speed: 1, badges: [], pendingLevelChoice: false,
    lastReset: localDate(), bossTrophyPending: false, eraRewardClaimed: false,
  }
}

export function dailyReset(save: SaveData, today = localDate()) {
  if (save.lastReset !== today) { save.lastReset = today; save.campaignRemaining = 10; save.trainingRemaining = 100 }
  return save
}

export function loadSave(storage: Pick<Storage, 'getItem'> = localStorage): SaveData {
  try {
    const raw = storage.getItem(SAVE_KEY)
    if (!raw) return freshSave()
    const parsed = JSON.parse(raw) as SaveData
    if (parsed.version !== SAVE_VERSION || !warriorDefinitions[parsed.activeWarriorId] || parsed.ownedWarriors?.[parsed.activeWarriorId]?.warriorId !== parsed.activeWarriorId || !Array.isArray(parsed.unlockedSkills)) return freshSave()
    return dailyReset(parsed)
  } catch { return freshSave() }
}

export function persistSave(save: SaveData, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(SAVE_KEY, JSON.stringify(save))
}
