/** Primal difficulty is fixed per node and never reads the active Warrior's level. */
export const PRIMAL_NODE_TIERS = [1,1,2,2,3,3,4,4,4,5,5,5,6,6,7,7,7,8,8,9] as const

/** Normal first-clear economy. Replay/defeat and Némésis are settled in nemesisCampaign. */
export const PRIMAL_NODE_BASE_XP = [120,180,250,300,450,180,200,220,250,550,150,175,200,225,650,150,175,200,250,500] as const

export function campaignNodeTier(node: number): number {
  return PRIMAL_NODE_TIERS[node - 1] ?? 1
}

export function campaignBaseXp(node: number): number {
  return PRIMAL_NODE_BASE_XP[node - 1] ?? PRIMAL_NODE_BASE_XP[0]
}
