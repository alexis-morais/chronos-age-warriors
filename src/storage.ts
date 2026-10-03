import type { SaveData } from './types'
import { KARG_ID, warriorDefinitions } from './warriors'
import { MAX_WARRIOR_LEVEL, xpForLevel } from './warriorProgression'

export const SAVE_KEY = 'chronos-age-warriors:v3'
export const SAVE_VERSION = 3
export const LEGACY_SAVE_KEY = 'chronos-age-warriors:v2'
export const LEGACY_ADMIN_SAVE_KEY = 'chronos-age-warriors:admin:v2'
export const localDate = (date = new Date()) => date.toLocaleDateString('sv-SE')

export function freshSave(): SaveData {
  return {
    version: SAVE_VERSION,
    activeWarriorId: '',
    welcomeChestOpened: false,
    ownedWarriors: {},
    unlockedSkills: [],
    coins: 300,
    owned: {},
    equippedWeapon: '', equippedArmor: '', campaignNode: 1, defeatedNodes: [], campaignRemaining: 10,
    loadouts: {},
    trainingRemaining: 100, trainingWins: 0, totalWins: 0, adventureWins: 0, riftWins: 0, duelWins: 0, chests: 0, speed: 1, badges: [],
    lastReset: localDate(), bossTrophyPending: false, eraRewardClaimed: false,
  }
}

export function dailyReset(save: SaveData, today = localDate()) {
  if (save.lastReset !== today) { save.lastReset = today; save.campaignRemaining = 10; save.trainingRemaining = 100 }
  return save
}

export function loadSave(storage: Pick<Storage, 'getItem'> = localStorage, key = SAVE_KEY): SaveData {
  try {
    const legacyKey = key === SAVE_KEY ? LEGACY_SAVE_KEY : key === 'chronos-age-warriors:admin:v3' ? LEGACY_ADMIN_SAVE_KEY : null
    const raw = storage.getItem(key) ?? (legacyKey ? storage.getItem(legacyKey) : null)
    if (!raw) return freshSave()
    const parsed = JSON.parse(raw) as SaveData
    if (parsed.version !== SAVE_VERSION && parsed.version !== 2) return freshSave()
    const oldId = 'dev-primordial-warrior'
    if (parsed.ownedWarriors?.[oldId]) {
      const old = parsed.ownedWarriors[oldId]
      if (!parsed.ownedWarriors[KARG_ID]) parsed.ownedWarriors[KARG_ID] = { ...old, warriorId: KARG_ID }
      delete parsed.ownedWarriors[oldId]
      if (parsed.activeWarriorId === oldId) parsed.activeWarriorId = KARG_ID
    }
    const hasWarrior = Boolean(warriorDefinitions[parsed.activeWarriorId] && parsed.ownedWarriors?.[parsed.activeWarriorId]?.warriorId === parsed.activeWarriorId)
    const isUnopenedNewSave = parsed.activeWarriorId === '' && Object.keys(parsed.ownedWarriors ?? {}).length === 0 && parsed.welcomeChestOpened === false
    if ((!hasWarrior && !isUnopenedNewSave) || !Array.isArray(parsed.unlockedSkills)) return freshSave()
    if (parsed.version === 2) {
      for (const id of Object.keys(parsed.ownedWarriors)) parsed.ownedWarriors[id] = { warriorId: id, level: 1, xp: 0 }
      parsed.unlockedSkills = []
      delete parsed.pendingLevelChoice
      parsed.version = SAVE_VERSION
    } else {
      for (const warrior of Object.values(parsed.ownedWarriors)) {
        delete warrior.bonusStats
        warrior.level = Number.isInteger(warrior.level) ? Math.min(MAX_WARRIOR_LEVEL, Math.max(1, warrior.level)) : 1
        warrior.xp = warrior.level === MAX_WARRIOR_LEVEL ? 0 : Number.isInteger(warrior.xp) && warrior.xp >= 0 ? Math.min(warrior.xp, xpForLevel(warrior.level) - 1) : 0
      }
      delete parsed.pendingLevelChoice
    }
    parsed.welcomeChestOpened = hasWarrior ? true : false
    // Legacy totalWins mixes Training and Adventure; their historical split is unknowable.
    parsed.adventureWins = Number.isSafeInteger(parsed.adventureWins) && parsed.adventureWins >= 0 ? parsed.adventureWins : 0
    parsed.riftWins = Number.isSafeInteger(parsed.riftWins) && parsed.riftWins >= 0 ? parsed.riftWins : 0
    parsed.duelWins = Number.isSafeInteger(parsed.duelWins) && parsed.duelWins >= 0 ? parsed.duelWins : 0
    parsed.owned ??= {}
    for (const item of Object.values(parsed.owned)) item.quantity = Number.isSafeInteger(item.quantity) && (item.quantity ?? 0) > 0 ? item.quantity : 1
    parsed.loadouts ??= {}
    if (parsed.loadouts[oldId]) { parsed.loadouts[KARG_ID] ??= parsed.loadouts[oldId]; delete parsed.loadouts[oldId] }
    if (hasWarrior) {
      parsed.loadouts[parsed.activeWarriorId] ??= { weapon: parsed.equippedWeapon, armor: parsed.equippedArmor }
      const active = parsed.loadouts[parsed.activeWarriorId]
      parsed.equippedWeapon = parsed.owned[active.weapon] ? active.weapon : ''
      parsed.equippedArmor = parsed.owned[active.armor] ? active.armor : ''
    }
    return dailyReset(parsed)
  } catch { return freshSave() }
}

export function persistSave(save: SaveData, storage: Pick<Storage, 'setItem'> = localStorage, key = SAVE_KEY) {
  storage.setItem(key, JSON.stringify(save))
}
