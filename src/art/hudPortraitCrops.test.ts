import { describe, expect, it } from 'vitest'
import { enemyIds } from './assetsV04'
import { enemyHudPortraitCrops, hudPortraitCrop, warriorHudPortraitCrops } from './hudPortraitCrops'
import { primalWarriors } from '../warriors'

describe('cadrage des portraits de combat', () => {
  it('possède un réglage dédié pour chaque Warrior et chaque ennemi Primal', () => {
    expect(Object.keys(warriorHudPortraitCrops).sort()).toEqual(primalWarriors.map((warrior) => warrior.id).sort())
    expect(Object.keys(enemyHudPortraitCrops).sort()).toEqual([...enemyIds].sort())
  })

  it('garde des réglages de zoom et décalage sûrs pour les petits et grands HUD', () => {
    for (const [side, ids] of [['player', primalWarriors.map((warrior) => warrior.id)], ['enemy', enemyIds]] as const) {
      for (const id of ids) {
        const crop = hudPortraitCrop(side, id)
        expect(crop.zoom).toBeGreaterThan(1)
        expect(crop.zoom).toBeLessThan(4)
        for (const value of [crop.x, crop.y, crop.offsetX, crop.offsetY]) expect(value).toMatch(/^-?\d+%$/)
      }
    }
  })

  it('réutilise le crop Warrior lorsque Tyrak est affiché du côté ennemi', () => {
    expect(hudPortraitCrop('enemy', 'tyrak')).toEqual(hudPortraitCrop('player', 'tyrak'))
  })
})
