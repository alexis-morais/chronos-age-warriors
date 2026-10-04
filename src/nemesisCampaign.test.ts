import { describe, expect, it } from 'vitest'
import { canEnterCampaignNode } from './admin'
import { resolveEnemyId } from './art/assetsV04'
import { campaignBattleReward, settleCampaignBattle } from './nemesisCampaign'
import { NEMESIS_STATS, nemesisEnemy } from './nemesisBalance'
import { loadSave, SAVE_KEY } from './storage'
import { establishedKargSave } from './testFixtures'

describe('fin d’ère et Némésis', () => {
  it('attribue exactement une fois le lot normal sans trophée ni ancien bonus', () => {
    const save = establishedKargSave()
    save.campaignNode = 20
    const first = settleCampaignBattle(save, 'normal', 20, 'player')
    expect(first).toMatchObject({ xp: 20, coins: 20, bonusCoins: 1500, bonusChests: 10, bonusChestKind: 'warrior' })
    expect(first.save.coins).toBe(save.coins + 1520)
    expect(first.save.warriorChestCount).toBe(save.warriorChestCount + 10)
    expect(first.save.nemesisUnlocked).toBe(true)
    expect(first.save.defeatedNodes).toContain(20)
    expect(save.warriorChestCount).toBe(0)
    const replay = settleCampaignBattle(first.save, 'normal', 20, 'player')
    expect(replay).toMatchObject({ xp: 5, coins: 5, bonusCoins: 0, bonusChests: 0 })
    expect(replay.save.warriorChestCount).toBe(10)
  })

  it('garde les deux progressions séparées et une seule limite quotidienne', () => {
    let save = establishedKargSave()
    save = settleCampaignBattle(save, 'normal', 20, 'player').save
    const normal = { node: save.campaignNode, defeated: [...save.defeatedNodes] }
    expect(canEnterCampaignNode(save, 20, false)).toBe(true)
    expect(canEnterCampaignNode(save, 2, false, 'nemesis')).toBe(false)
    save = settleCampaignBattle(save, 'nemesis', 1, 'player').save
    expect(save.nemesisCampaignNode).toBe(2)
    expect(save.nemesisDefeatedNodes).toEqual([1])
    expect(save.campaignNode).toBe(normal.node)
    expect(save.defeatedNodes).toEqual(normal.defeated)
    expect(save.campaignRemaining).toBe(8)
    expect(canEnterCampaignNode(save, 1, false, 'nemesis')).toBe(true)
    expect(canEnterCampaignNode(save, 20, false, 'nemesis')).toBe(false)
    const restored = loadSave({ getItem: (key) => key === SAVE_KEY ? JSON.stringify(save) : null })
    expect(restored.nemesisCampaignNode).toBe(2)
    expect(restored.nemesisDefeatedNodes).toEqual([1])
  })

  it('dérive les récompenses Némésis fixes et replay réduit et protège le lot final', () => {
    expect(campaignBattleReward(20, true, 'nemesis')).toEqual({ xp: 50, coins: 50 })
    expect(campaignBattleReward(1, false, 'nemesis')).toEqual({ xp: 10, coins: 0 })
    const save = establishedKargSave()
    save.nemesisUnlocked = true
    save.nemesisCampaignNode = 20
    const first = settleCampaignBattle(save, 'nemesis', 20, 'player')
    expect(first).toMatchObject({ xp: 50, coins: 50, bonusCoins: 2500, bonusChests: 3, bonusChestKind: 'rift' })
    expect(first.save.riftChestCount).toBe(save.riftChestCount + 3)
    expect(first.save.nemesisCompleted).toBe(true)
    const replay = settleCampaignBattle(first.save, 'nemesis', 20, 'player')
    expect(replay.bonusCoins).toBe(0)
    expect(replay.save.riftChestCount).toBe(first.save.riftChestCount)
    expect(replay.save.coins - first.save.coins).toBe(10)
  })

  it('migre une victoire legacy sans grant silencieux et permet le prochain bonus sur replay', () => {
    const old = establishedKargSave()
    old.defeatedNodes = [20]
    const raw = { ...old, eraRewardClaimed: true, bossTrophyPending: true }
    const restored = loadSave({ getItem: (key) => key === SAVE_KEY ? JSON.stringify(raw) : null })
    expect(restored.nemesisUnlocked).toBe(true)
    expect(restored.normalBossFirstClearRewardClaimed).toBe(false)
    expect(restored.coins).toBe(old.coins)
    expect(restored.warriorChestCount).toBe(0)
    expect('bossTrophyPending' in restored).toBe(false)
    expect(settleCampaignBattle(restored, 'normal', 20, 'player').bonusChests).toBe(10)
  })

  it('emploie exactement les mêmes 20 identités ennemies avec des stats fixes sans pity', () => {
    expect(NEMESIS_STATS).toHaveLength(20)
    for (let node = 1; node <= 20; node++) {
      const first = nemesisEnemy(node)
      expect(first.stats).toEqual(nemesisEnemy(node).stats)
      expect(resolveEnemyId(node, node === 20)).toBeTruthy()
      expect(first.name).toBeTruthy()
      for (const value of Object.values(first.stats)) expect(value).toBeGreaterThan(0)
    }
    expect(nemesisEnemy(20).name).toBe('Morgath, Roi Primordial')
    expect(nemesisEnemy(20).skills).toContain('Second Souffle')
  })
})
