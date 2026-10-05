import { equipment } from './data'
import type { Rarity, SaveData } from './types'

export const EQUIPMENT_RECYCLE_COINS: Record<Rarity, number> = {
  Commun: 3, 'Peu commun': 5, Rare: 8, Épique: 12, Légendaire: 18, Mythique: 24,
}

export function equipmentRecycleQuote(save: SaveData, id: string, count: number) {
  const definition = equipment.find((item) => item.id === id)
  const quantity = save.owned[id]?.quantity ?? (save.owned[id] ? 1 : 0)
  if (!definition || !Number.isSafeInteger(count) || count < 1 || count >= quantity) return null
  return { quantity, count, remaining: quantity - count, coins: count * EQUIPMENT_RECYCLE_COINS[definition.rarity] }
}

/** Frozen sequence + quantity guard stale/repeated confirmation, including after reload. */
export function recycleEquipment(save: SaveData, id: string, count: number, expectedQuantity: number, sequence: number): SaveData {
  const quote = equipmentRecycleQuote(save, id, count)
  if (!quote || quote.quantity !== expectedQuantity || sequence !== save.equipmentRecycleSequence + 1) return save
  const next = structuredClone(save)
  next.owned[id].quantity = quote.remaining
  next.coins += quote.coins
  next.equipmentRecycleSequence = sequence
  // Keep the final shared copy: every existing loadout remains usable, with no XP change.
  return next
}
