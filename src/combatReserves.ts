import type { SaveData } from './types'

export const MAX_COMBAT_CHARGES = 15
export const COMBAT_RECHARGE_MS = 20 * 60 * 1000

/** nextAt is the instant of the next charge, not the last spend. */
export function rechargeCharges(charges: number, nextAt: number | null, now: number) {
  const held = Math.min(MAX_COMBAT_CHARGES, Math.max(0, Math.trunc(charges)))
  if (held === MAX_COMBAT_CHARGES) return { charges: held, nextAt: null }
  if (nextAt === null || !Number.isFinite(nextAt)) return { charges: held, nextAt: now + COMBAT_RECHARGE_MS }
  if (now < nextAt) return { charges: held, nextAt }
  const earned = 1 + Math.floor((now - nextAt) / COMBAT_RECHARGE_MS)
  const updated = Math.min(MAX_COMBAT_CHARGES, held + earned)
  return { charges: updated, nextAt: updated === MAX_COMBAT_CHARGES ? null : nextAt + earned * COMBAT_RECHARGE_MS }
}

export function spendCharge(charges: number, nextAt: number | null, now: number) {
  const ready = rechargeCharges(charges, nextAt, now)
  if (ready.charges < 1) return null
  return { charges: ready.charges - 1, nextAt: ready.nextAt ?? now + COMBAT_RECHARGE_MS }
}

export function rechargeAdventure(save: SaveData, now = Date.now()): SaveData {
  const ready = rechargeCharges(save.campaignRemaining, save.campaignRechargeAt, now)
  if (ready.charges === save.campaignRemaining && ready.nextAt === save.campaignRechargeAt) return save
  return { ...save, campaignRemaining: ready.charges, campaignRechargeAt: ready.nextAt }
}

export function spendAdventure(save: SaveData, now = Date.now()): SaveData | null {
  const spent = spendCharge(save.campaignRemaining, save.campaignRechargeAt, now)
  return spent ? { ...save, campaignRemaining: spent.charges, campaignRechargeAt: spent.nextAt } : null
}

export function nextChargeSeconds(nextAt: number | null, serverNow: number) {
  return nextAt === null ? 0 : Math.max(0, Math.ceil((nextAt - serverNow) / 1000))
}
