import type { SaveData } from './types'
import { enemyIds } from './art/assetsV04'
import { RIFT_DIFFICULTIES } from './rift'
import { KARG_ID, warriorDefinitions } from './warriors'
import { MAX_WARRIOR_LEVEL, xpForLevel } from './warriorProgression'

export const SAVE_KEY = 'chronos-age-warriors:v4'
export const SAVE_VERSION = 4
export const PREVIOUS_SAVE_KEY = 'chronos-age-warriors:v3'
export const PREVIOUS_ADMIN_SAVE_KEY = 'chronos-age-warriors:admin:v3'
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
    totalWins: 0, adventureWins: 0, riftWins: 0, duelWins: 0, chests: 0,
    riftChestCount: 0, riftLossStreak: 0, riftRun: null, expedition: null, expeditionReturn: null,
    equipmentChestCount: 0, warriorChestCount: 0, speed: 1, badges: [],
    lastReset: localDate(), bossTrophyPending: false, eraRewardClaimed: false,
  }
}

export function dailyReset(save: SaveData, today = localDate()) {
  if (save.lastReset !== today) { save.lastReset = today; save.campaignRemaining = 10 }
  return save
}

export function loadSave(storage: Pick<Storage, 'getItem'> = localStorage, key = SAVE_KEY): SaveData {
  try {
    const fallbacks = key === SAVE_KEY ? [PREVIOUS_SAVE_KEY, LEGACY_SAVE_KEY]
      : key === 'chronos-age-warriors:admin:v4' ? [PREVIOUS_ADMIN_SAVE_KEY, LEGACY_ADMIN_SAVE_KEY]
      : key === PREVIOUS_SAVE_KEY ? [LEGACY_SAVE_KEY]
      : key === PREVIOUS_ADMIN_SAVE_KEY ? [LEGACY_ADMIN_SAVE_KEY] : []
    const raw = storage.getItem(key) ?? fallbacks.map((fallback) => storage.getItem(fallback)).find(Boolean)
    if (!raw) return freshSave()
    const parsed = JSON.parse(raw) as SaveData
    if (parsed.version !== SAVE_VERSION && parsed.version !== 3 && parsed.version !== 2) return freshSave()
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
    } else {
      for (const warrior of Object.values(parsed.ownedWarriors)) {
        delete warrior.bonusStats
        warrior.level = Number.isInteger(warrior.level) ? Math.min(MAX_WARRIOR_LEVEL, Math.max(1, warrior.level)) : 1
        warrior.xp = warrior.level === MAX_WARRIOR_LEVEL ? 0 : Number.isInteger(warrior.xp) && warrior.xp >= 0 ? Math.min(warrior.xp, xpForLevel(warrior.level) - 1) : 0
      }
      delete parsed.pendingLevelChoice
    }
    parsed.welcomeChestOpened = hasWarrior ? true : false
    // Old Entraînement counters are not converted into another mode.
    const legacyTraining = parsed as SaveData & { trainingRemaining?: number; trainingWins?: number }
    delete legacyTraining.trainingRemaining
    delete legacyTraining.trainingWins
    parsed.version = SAVE_VERSION
    parsed.riftChestCount = Number.isSafeInteger(parsed.riftChestCount) && parsed.riftChestCount >= 0 ? parsed.riftChestCount : 0
    parsed.riftLossStreak = Number.isSafeInteger(parsed.riftLossStreak) && parsed.riftLossStreak >= 0 ? parsed.riftLossStreak : 0
    parsed.equipmentChestCount = Number.isSafeInteger(parsed.equipmentChestCount) && parsed.equipmentChestCount >= 0 ? parsed.equipmentChestCount : 0
    parsed.warriorChestCount = Number.isSafeInteger(parsed.warriorChestCount) && parsed.warriorChestCount >= 0 ? parsed.warriorChestCount : 0
    const expedition = parsed.expedition
    parsed.expedition = expedition && Boolean(parsed.ownedWarriors[expedition.warriorId])
      && Number.isSafeInteger(expedition.startedAt) && expedition.startedAt > 0
      ? expedition : null
    const receipt = parsed.expeditionReturn
    parsed.expeditionReturn = receipt && typeof receipt.id === 'string' && Boolean(parsed.ownedWarriors[receipt.warriorId])
      && Number.isSafeInteger(receipt.elapsedMs) && receipt.elapsedMs >= 0 && receipt.elapsedMs <= 86_400_000
      && Number.isSafeInteger(receipt.xp) && receipt.xp >= 0 && Number.isSafeInteger(receipt.coins) && receipt.coins >= 0
      && Array.isArray(receipt.equipmentIds) && receipt.equipmentIds.every((id) => typeof id === 'string')
      && typeof receipt.equipmentChest === 'boolean' && typeof receipt.warriorChest === 'boolean'
      && Number.isSafeInteger(receipt.levelsGained) && receipt.levelsGained >= 0 ? receipt : null
    const run = parsed.riftRun
    parsed.riftRun = run && /^\d{4}-\d{2}-\d{2}$/.test(run.dateKey) && Number.isInteger(run.stage) && run.stage >= 0 && run.stage < 5
      && Array.isArray(run.lineup) && run.lineup.length === 5 && run.lineup.every((id) => enemyIds.some((enemyId) => enemyId === id))
      && Number.isSafeInteger(run.seed) && run.seed >= 0 && run.seed <= 0xffffffff
      && RIFT_DIFFICULTIES.some((value) => value === run.difficulty) && (run.warriorId === '' || Boolean(parsed.ownedWarriors[run.warriorId]))
      && Number.isSafeInteger(run.earnedCoins) && run.earnedCoins >= 0
      && Number.isSafeInteger(run.earnedXp) && run.earnedXp >= 0
      && ['ready', 'fighting', 'between', 'lost', 'quit', 'complete'].includes(run.status)
      ? run : null
    // Legacy totalWins may include retired Entraînement victories; keep it for old receipts only.
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
