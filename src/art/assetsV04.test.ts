import { describe, expect, it } from 'vitest'
import { armorIds, assetsV04, enemyIds, enemySprite, equipmentAsset, resolveEnemyId, warriorSprite, weaponIds, weaponMotion } from './assetsV04'
import { finalBattleFrame } from './battleVisual'
import type { BattleResult } from '../types'

describe('manifest V0.4', () => {
  it('résout les neuf armes pour les Warriors homme et femme', () => {
    for (const weapon of weaponIds) {
      expect(warriorSprite('male', weapon, 'attack')).toContain(`/male/${weapon}/attack.png`)
      expect(warriorSprite('female', weapon, 'idle')).toContain(`/female/${weapon}/idle.png`)
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
    expect(warriorSprite('male', 'inconnu', 'hurt')).toBe('/assets-v04/derived/warriors/male/flint-club/idle.png')
    expect(resolveEnemyId('inconnu')).toBe('tribal-hunter')
    expect(JSON.stringify(assetsV04)).not.toContain('art-direction')
    expect(JSON.stringify(assetsV04)).not.toContain('atlas')
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
