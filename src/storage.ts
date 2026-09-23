import { initialStats, seededRng } from './game'
import type { SaveData } from './types'

export const SAVE_KEY = 'chronos-age-warriors:v1'
export const SAVE_VERSION = 1
export const localDate = (date = new Date()) => date.toLocaleDateString('sv-SE')

export function freshSave(seed = Date.now()): SaveData {
  return {
    version: SAVE_VERSION, created: false,
    warrior: { name: '', appearance: { gender: 'Homme', skin: '#b97852', hair: 'Crête', hairColor: '#211914' }, level: 1, xp: 0, stats: initialStats(seededRng(seed)), skills: [] },
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
    if (parsed.version !== SAVE_VERSION) return freshSave()
    return dailyReset(parsed)
  } catch { return freshSave() }
}

export function persistSave(save: SaveData, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(SAVE_KEY, JSON.stringify(save))
}
