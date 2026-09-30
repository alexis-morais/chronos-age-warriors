import { describe, expect, it } from 'vitest'
import { armorIds, enemyIds, enemySprite, equipmentAsset, resolveEnemyId, weaponIds, weaponMotion } from './assetsV04'
import { finalBattleFrame } from './battleVisual'
import type { BattleResult } from '../types'

describe('manifest V0.4', () => {
  it('résout les neuf illustrations d’armes', () => {
    for (const weapon of weaponIds) {
      expect(equipmentAsset(weapon, 'weapon')).toContain(`/weapons/${weapon}.png`)
    }
  })

  it('expose quinze illustrations d’équipement uniques et dérivées', () => {
    const equipmentPaths = [
      ...weaponIds.map((weapon) => equipmentAsset(weapon, 'weapon')),
      ...armorIds.map((armor) => equipmentAsset(armor, 'armor')),
    ]

    expect(equipmentPaths).toHaveLength(15)
    expect(new Set(equipmentPaths)).toHaveLength(15)
    for (const path of equipmentPaths) {
      expect(path).toMatch(/^\/assets-v04\/derived\/equipment\/(weapons|armors)\/[a-z-]+\.png$/)
      expect(path).not.toContain('atlas')
    }
  })

  it('résout chaque ennemi et réserve le Mammouth au Boss', () => {
    for (const enemy of enemyIds) expect(enemySprite(enemy, 'ko')).toContain(`/enemies/${enemy}/ko.png`)
    expect(resolveEnemyId(20, true)).toBe('mammoth')
  })

  it('utilise des fallbacks sûrs sans chemin d’atlas ou art-direction', () => {
    expect(resolveEnemyId('inconnu')).toBe('tribal-hunter')
  })

  it('attribue des profils de mouvement distincts', () => {
    expect(weaponMotion('volcanic-hammer')).toBe('heavy')
    expect(weaponMotion('bone-spear')).toBe('spear')
    expect(weaponMotion('hunter-bow')).toBe('ranged')
    expect(weaponMotion('smilodon-fangs')).toBe('claw')
    expect(weaponMotion('titan-heart')).toBe('arcane')
  })
})

describe('Passer le combat', () => {
  it('synchronise les PV finaux et les poses victoire/KO', () => {
    const result: BattleResult = {
      winner: 'player', enemy: { name: 'Brute', stats: { strength: 1, dodge: 1, speed: 1, hp: 20 }, skills: [] }, consecutiveMax: 1,
      events: [{ type: 'ko', actor: 'player', target: 'enemy', playerHp: 12, enemyHp: 0 }],
    }
    expect(finalBattleFrame(result)).toEqual({ index: 0, playerHp: 12, enemyHp: 0, playerState: 'victory', enemyState: 'ko' })
  })
})
