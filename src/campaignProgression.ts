/** Primal difficulty is fixed per node and never reads the active Warrior's level. */
export const PRIMAL_NODE_TIERS = [1,1,2,2,3,3,4,4,4,5,5,5,6,6,7,7,7,8,8,9] as const

/** Fixed base rewards preserve the 5,188 XP first-clear projection of the approved B curve. */
export const PRIMAL_NODE_BASE_XP = [112,112,136,148,148,172,172,184,196,196,208,220,220,232,244,244,244,268,268,268] as const

export function campaignNodeTier(node: number): number {
  return PRIMAL_NODE_TIERS[node - 1] ?? 1
}

export function campaignBaseXp(node: number): number {
  return PRIMAL_NODE_BASE_XP[node - 1] ?? PRIMAL_NODE_BASE_XP[0]
}
