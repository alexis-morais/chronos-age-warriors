import { creditWarriorXp, effectiveStats, simulateBattle } from './game'
export { warriorTotalXp } from './game'
import type { BattleResult, Fighter, Rarity, SaveData } from './types'
import { activeWarrior, warriorDefinitions } from './warriors'
import { recordBattleOutcome } from './victories'
import { grantEarnedBadges } from './badgeSystem'
import { parseAccountSave } from './storage'
import { equipment } from './data'
import { xpForLevel } from './warriorProgression'
export { warriorDefinitions } from './warriors'

export const DUEL_MAX_CHARGES = 10
export const DUEL_RESET_TIMEZONE = 'Europe/Paris'

export const DUEL_REWARDS = { win: { xp: 20, coins: 10 }, loss: { xp: 4, coins: 0 } } as const

export const RARITY_TIERS: Record<Rarity, number> = {
  Commun: 0, 'Peu commun': 1, Rare: 2, 'Épique': 3, Légendaire: 4, Mythique: 5,
}

export function duelPoints(attacker: Rarity, defender: Rarity, won: boolean) {
  return won ? 20 + 5 * Math.max(0, RARITY_TIERS[defender] - RARITY_TIERS[attacker]) : 0
}

export function validDuelWarrior(save: SaveData) {
  const id = save.activeWarriorId
  const owned = save.ownedWarriors?.[id]
  return Boolean(warriorDefinitions[id] && owned?.warriorId === id && Number.isInteger(owned.level) && owned.level >= 1 && owned.level <= 10)
}

export function normalizedDuelSave(value: unknown): SaveData | null {
  // Validate the unmodified payload first. The solo migration deliberately repairs old
  // data (including clamping levels), which must never turn impossible Duel data valid.
  if (!strictDuelPayload(value)) return null
  const save = parseAccountSave(value)
  return save && validDuelWarrior(save) ? save : null
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function strictDuelPayload(value: unknown): boolean {
  if (!record(value) || typeof value.activeWarriorId !== 'string' || !warriorDefinitions[value.activeWarriorId]
    || !record(value.ownedWarriors) || !record(value.owned)
    || typeof value.equippedWeapon !== 'string' || typeof value.equippedArmor !== 'string') return false
  for (const [id, raw] of Object.entries(value.ownedWarriors)) {
    if (!warriorDefinitions[id] || !record(raw) || raw.warriorId !== id
      || !Number.isInteger(raw.level) || (raw.level as number) < 1 || (raw.level as number) > 10
      || !Number.isSafeInteger(raw.xp) || (raw.xp as number) < 0
      || (raw.level === 10 ? raw.xp !== 0 : (raw.xp as number) >= xpForLevel(raw.level as number))) return false
  }
  if (!Object.hasOwn(value.ownedWarriors, value.activeWarriorId)) return false
  if (value.version === 6) {
    if (!record(value.personalClears) || !Number.isSafeInteger(value.campaignBattleSequence)
      || (value.campaignBattleSequence as number) < 0 || !Number.isSafeInteger(value.equipmentRecycleSequence)
      || (value.equipmentRecycleSequence as number) < 0) return false
    for (const [id, clears] of Object.entries(value.personalClears)) {
      if (!Object.hasOwn(value.ownedWarriors, id) || !record(clears)) return false
      for (const mode of ['normal', 'nemesis']) {
        const nodes = clears[mode]
        if (!Array.isArray(nodes) || nodes.some(node => !Number.isInteger(node) || node < 1 || node > 20)
          || new Set(nodes).size !== nodes.length) return false
      }
    }
  }
  const definitions = new Map(equipment.map((item) => [item.id, item]))
  for (const [id, raw] of Object.entries(value.owned)) {
    if (!definitions.has(id) || !record(raw) || !Number.isInteger(raw.level) || (raw.level as number) < 1
      || !Number.isSafeInteger(raw.xp) || (raw.xp as number) < 0
      || (raw.quantity !== undefined && (!Number.isSafeInteger(raw.quantity) || (raw.quantity as number) < 1))) return false
  }
  const validSlot = (slot: 'weapon' | 'armor', id: unknown) => typeof id === 'string'
    && (!id || (definitions.get(id)?.type === slot && Object.hasOwn(value.owned as Record<string, unknown>, id)))
  if (!validSlot('weapon', value.equippedWeapon) || !validSlot('armor', value.equippedArmor)) return false
  if (value.loadouts !== undefined) {
    if (!record(value.loadouts)) return false
    for (const [warriorId, loadout] of Object.entries(value.loadouts)) {
      if (!Object.hasOwn(value.ownedWarriors, warriorId) || !record(loadout)
        || !validSlot('weapon', loadout.weapon) || !validSlot('armor', loadout.armor)) return false
    }
    const current = value.loadouts[value.activeWarriorId]
    if (current && (!record(current) || current.weapon !== value.equippedWeapon || current.armor !== value.equippedArmor)) return false
  }
  return true
}

export function duelFighter(save: SaveData): Fighter {
  if (!validDuelWarrior(save)) throw new Error('Warrior actif invalide.')
  const warrior = activeWarrior(save)
  return { name: warrior.name, stats: effectiveStats(save), skills: [], warriorId: warrior.id,
    level: warrior.level, weapon: save.equippedWeapon, armor: save.equippedArmor }
}

export function resolveDuel(attackerSave: SaveData, defenderSave: SaveData, seed: number) {
  const attacker = duelFighter(attackerSave)
  const defender = duelFighter(defenderSave)
  const result = simulateBattle(attacker, defender, seed)
  const won = result.winner === 'player'
  const reward = DUEL_REWARDS[won ? 'win' : 'loss']
  const rarity = warriorDefinitions[attacker.warriorId!].rarity
  const defenderRarity = warriorDefinitions[defender.warriorId!].rarity
  return { attacker, defender, result, xp: reward.xp, coins: reward.coins,
    points: duelPoints(rarity, defenderRarity, won), attackerRarity: rarity, defenderRarity }
}

/** Apply only the authorized Duel deltas to the current server snapshot. */
export function applyDuelReward(save: SaveData, resolution: ReturnType<typeof resolveDuel>) {
  const next = structuredClone(save)
  next.coins += resolution.coins
  recordBattleOutcome(next, 'duel', resolution.result.winner)
  creditWarriorXp(next, resolution.xp)
  return grantEarnedBadges(next)
}

export interface PublicDuelOpponent { username: string; warriorId: string; level: number; rarity: Rarity; points: number }
export interface DuelReplay { result: BattleResult; attacker: Fighter; defender: Fighter; opponent: PublicDuelOpponent; xp: number; coins: number; points: number; levelAfter: number; badges: { title: string; coins: number }[] }
