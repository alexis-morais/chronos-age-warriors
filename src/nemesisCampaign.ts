import { addWarriorXp } from './game'
import type { BattleResult, SaveData } from './types'
import { recordBattleOutcome } from './victories'
import { spendAdventure } from './combatReserves'

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

export function campaignBattleReward(_node: number, won: boolean, mode: AdventureMode, replay = false) {
  const amount = mode === 'nemesis' ? won ? replay ? 10 : 50 : 10 : won ? replay ? 5 : 20 : 4
  return { xp: amount, coins: won ? amount : 0 }
}

/** One atomic settlement: progress, shared daily counter and first-clear receipts change together. */
export function settleCampaignBattle(save: SaveData, mode: AdventureMode, node: number, winner: BattleResult['winner']): CampaignSettlement {
  if (!Number.isInteger(node) || node < 1 || node > 20) throw new RangeError(`Invalid adventure node: ${node}`)
  const next = structuredClone(spendAdventure(save) ?? save)
  const won = winner === 'player'
  const reward = campaignBattleReward(node, won, mode, campaignProgress(save, mode).defeated.includes(node))
  next.coins += reward.coins
  addWarriorXp(next, reward.xp)
  recordBattleOutcome(next, 'adventure', winner)
  let bonusCoins = 0, bonusChests = 0, bonusChestKind: CampaignSettlement['bonusChestKind'] = null
  if (won) {
    const defeated = mode === 'nemesis' ? next.nemesisDefeatedNodes : next.defeatedNodes
    if (!defeated.includes(node)) defeated.push(node)
    if (mode === 'nemesis') next.nemesisCampaignNode = Math.max(next.nemesisCampaignNode, Math.min(20, node + 1))
    else next.campaignNode = Math.max(next.campaignNode, Math.min(20, node + 1))
    if (node === 20 && mode === 'normal') {
      next.nemesisUnlocked = true
      if (!next.normalBossFirstClearRewardClaimed) {
        bonusCoins = 1500; bonusChests = 10; bonusChestKind = 'warrior'
        next.coins += bonusCoins; next.warriorChestCount += bonusChests
        next.normalBossFirstClearRewardClaimed = true
      }
    }
    if (node === 20 && mode === 'nemesis') {
      next.nemesisCompleted = true
      if (!next.nemesisBossFirstClearRewardClaimed) {
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
