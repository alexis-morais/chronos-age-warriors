import { RARITY_CHANCES, rarityOrder } from './config'
import { equipment } from './data'
import { addEquipmentCopy, grantWarrior, rollChest, rollWarriorChest, type Rng } from './game'
import type { EquipmentDefinition, SaveData, WarriorDefinition } from './types'
import { primalWarriors } from './warriors'

export type ChestKind = 'warrior' | 'equipment'
export type ChestSelection = { kind: 'warrior'; quantity: 1 } | { kind: 'equipment'; quantity: 1 | 10 }

/** Equipment ×10 deliberately has no discount; Warrior has no batch purchase. */
export const CHEST_UNIT_PRICES: Record<ChestKind, number> = { warrior: 100, equipment: 20 }
const validSelection = (selection: ChestSelection) => selection.kind === 'warrior' ? selection.quantity === 1 : selection.kind === 'equipment' && (selection.quantity === 1 || selection.quantity === 10)
export const chestPrice = (selection: ChestSelection) => {
  if (!validSelection(selection)) throw new Error('Invalid chest selection')
  return CHEST_UNIT_PRICES[selection.kind] * selection.quantity
}

export type ChestDraw =
  | { kind: 'warrior'; warrior: WarriorDefinition; duplicate: boolean }
  | { kind: 'equipment'; item: EquipmentDefinition; duplicate: boolean; quantityAfter: number }

export interface ChestPurchase { save: SaveData; draws: ChestDraw[]; cost: number }

/** Expedition chests are stored draws, opened later through the existing loot tables. */
export function openStoredChest(save: SaveData, kind: ChestKind, rng: Rng = Math.random): ChestPurchase | null {
  const field = kind === 'warrior' ? 'warriorChestCount' : 'equipmentChestCount'
  if (save[field] <= 0 || !hasCompletePool(kind)) return null
  let next = structuredClone(save)
  let draw: ChestDraw
  if (kind === 'warrior') {
    const warrior = rollWarriorChest(rng)
    if (!warrior) return null
    draw = { kind, warrior, duplicate: Boolean(next.ownedWarriors[warrior.id]) }
    next = grantWarrior(next, warrior.id)
  } else {
    const reward = rollChest(rng, next.owned)
    if (!reward.item) return null
    draw = { kind, item: reward.item, duplicate: Boolean(next.owned[reward.item.id]), quantityAfter: 0 }
    next = addEquipmentCopy(next, reward.item.id)
    draw.quantityAfter = next.owned[reward.item.id].quantity ?? 1
  }
  next[field] -= 1
  next.chests += 1
  return { save: next, draws: [draw], cost: 0 }
}

function hasCompletePool(kind: ChestKind): boolean {
  const catalog = kind === 'warrior' ? primalWarriors : equipment
  return rarityOrder.every((rarity) => RARITY_CHANCES[rarity] <= 0 || catalog.some((entry) => entry.rarity === rarity))
}

/** All draws and inventory changes are prepared before the caller persists one debit. */
export function purchaseChest(save: SaveData, selection: ChestSelection, rng: Rng = Math.random, admin = false): ChestPurchase | null {
  if (!validSelection(selection)) return null
  const { kind, quantity } = selection
  const cost = chestPrice(selection)
  if ((!admin && save.coins < cost) || !hasCompletePool(kind)) return null
  let next = structuredClone(save)
  const draws: ChestDraw[] = []
  for (let index = 0; index < quantity; index += 1) {
    if (kind === 'warrior') {
      const warrior = rollWarriorChest(rng)
      if (!warrior) return null
      const duplicate = Boolean(next.ownedWarriors[warrior.id])
      next = grantWarrior(next, warrior.id)
      draws.push({ kind, warrior, duplicate })
    } else {
      const reward = rollChest(rng, next.owned)
      if (!reward.item) return null
      const duplicate = Boolean(next.owned[reward.item.id])
      next = addEquipmentCopy(next, reward.item.id)
      draws.push({ kind, item: reward.item, duplicate, quantityAfter: next.owned[reward.item.id].quantity ?? 1 })
    }
  }
  if (!admin) next.coins -= cost
  next.chests += quantity
  return { save: next, draws, cost }
}
