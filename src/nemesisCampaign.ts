import { creditWarriorXp } from './game'
import type { BattleResult, SaveData } from './types'
import { recordBattleOutcome } from './victories'
import { spendAdventure } from './combatReserves'
import { PRIMAL_NODE_BASE_XP } from './campaignProgression'

export type AdventureMode = 'normal' | 'nemesis'
export interface CampaignSettlement {
  save: SaveData
  xp: number
  coins: number
  bonusCoins: number
  bonusChests: number
  bonusChestKind: 'warrior' | 'rift' | null
  progress: string
}

export function campaignProgress(save: SaveData, mode: AdventureMode) {
  return mode === 'nemesis'
    ? { node: save.nemesisCampaignNode, defeated: save.nemesisDefeatedNodes, completed: save.nemesisCompleted }
    : { node: save.campaignNode, defeated: save.defeatedNodes, completed: save.defeatedNodes.includes(20) }
}

export function canEnterAdventureNode(save: SaveData, mode: AdventureMode, node: number, admin: boolean): boolean {
  if (!Number.isInteger(node) || node < 1 || node > 20 || mode === 'nemesis' && !save.nemesisUnlocked && !admin) return false
  const progress = campaignProgress(save, mode)
  return admin || node === progress.node || progress.defeated.includes(node)
}

// Active progress, not easy replays. Same table for every Warrior, regardless of acquisition date.
export const FIRST_CLEAR_XP = {
  normal: PRIMAL_NODE_BASE_XP,
  nemesis: [180,220,260,300,550,240,280,320,360,700,300,340,380,420,850,360,400,440,480,1000],
} as const

export function campaignBattleReward(node: number, won: boolean, mode: AdventureMode, replay = false) {
  const amount = mode === 'nemesis' ? won ? replay ? 10 : 50 : 10 : won ? replay ? 5 : 20 : 4
  return { xp: won && !replay ? FIRST_CLEAR_XP[mode][node - 1] : amount, coins: won ? amount : 0 }
}

/** One atomic settlement: progress, shared daily counter and first-clear receipts change together. */
export function settleCampaignBattle(save: SaveData, mode: AdventureMode, node: number, winner: BattleResult['winner'], context = { warriorId: save.activeWarriorId, sequence: save.campaignBattleSequence + 1, now: Date.now() }): CampaignSettlement {
  if (!Number.isInteger(node) || node < 1 || node > 20) throw new RangeError(`Invalid adventure node: ${node}`)
  const empty = { save, xp: 0, coins: 0, bonusCoins: 0, bonusChests: 0, bonusChestKind: null, progress: 'Combat déjà résolu ou indisponible' }
  if (context.sequence !== save.campaignBattleSequence + 1 || !save.ownedWarriors[context.warriorId]) return empty
  const spent = spendAdventure(save, context.now)
  if (!spent) return empty
  const next = structuredClone(spent)
  next.campaignBattleSequence = context.sequence
  const won = winner === 'player'
  const globalReplay = campaignProgress(save, mode).defeated.includes(node)
  const personalReplay = save.personalClears[context.warriorId]?.[mode].includes(node) ?? false
  const reward = campaignBattleReward(node, won, mode, personalReplay)
  // A restored personal opportunity pays only XP, not replay coins or account rewards.
  reward.coins = !won ? 0 : !globalReplay ? mode === 'normal' ? 20 : 50
    : personalReplay ? mode === 'normal' ? 5 : 10 : 0
  next.coins += reward.coins
  reward.xp = creditWarriorXp(next, reward.xp, context.warriorId)
  recordBattleOutcome(next, 'adventure', winner)
  let bonusCoins = 0, bonusChests = 0, bonusChestKind: CampaignSettlement['bonusChestKind'] = null
  if (won) {
    next.personalClears[context.warriorId] ??= { normal: [], nemesis: [] }
    if (!personalReplay) next.personalClears[context.warriorId][mode].push(node)
    const defeated = mode === 'nemesis' ? next.nemesisDefeatedNodes : next.defeatedNodes
    if (!defeated.includes(node)) defeated.push(node)
    if (mode === 'nemesis') next.nemesisCampaignNode = Math.max(next.nemesisCampaignNode, Math.min(20, node + 1))
    else next.campaignNode = Math.max(next.campaignNode, Math.min(20, node + 1))
    if (node === 20 && mode === 'normal') {
      next.nemesisUnlocked = true
      if (!globalReplay && !next.normalBossFirstClearRewardClaimed) {
        bonusCoins = 1500; bonusChests = 10; bonusChestKind = 'warrior'
        next.coins += bonusCoins; next.warriorChestCount += bonusChests
        next.normalBossFirstClearRewardClaimed = true
      }
    }
    if (node === 20 && mode === 'nemesis') {
      next.nemesisCompleted = true
      if (!globalReplay && !next.nemesisBossFirstClearRewardClaimed) {
        bonusCoins = 2500; bonusChests = 3; bonusChestKind = 'rift'
        next.coins += bonusCoins; next.riftChestCount += bonusChests
        next.nemesisBossFirstClearRewardClaimed = true
      }
    }
  }
  const label = mode === 'nemesis' ? 'Némésis' : 'Niveau'
  return { save: next, ...reward, bonusCoins, bonusChests, bonusChestKind,
    progress: won ? `${label} ${node} terminé${node < 20 ? ` · prochain : niveau ${node + 1}` : mode === 'nemesis' ? ' · Némésis terminé' : ' · Ère achevée'}` : `${label} ${node} à retenter` }
}
