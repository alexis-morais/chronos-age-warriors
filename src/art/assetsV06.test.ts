import { describe, expect, it } from 'vitest'
import { assetsV06, gameIcon, playerCanvas, playerPoses, playerSprite, playerWeapons, resolvePlayerWeapon, v04RuntimeFallbacks } from './assetsV06'

describe('pipeline runtime V0.6', () => {
  it('résout exactement 108 poses propres, sans frame de transition', () => {
    const paths = new Set<string>()
    for (const sex of ['male', 'female'] as const) {
      for (const weapon of playerWeapons) {
        for (const pose of playerPoses) {
          const path = playerSprite(sex, weapon, pose)
          expect(path).toContain(`/${sex}/${weapon}/${pose}.png`)
          expect(path).not.toMatch(/idle-to|anticipation-to|attack-to/)
          expect(path).toContain('/assets-v06/derived/player/')
          paths.add(path)
        }
      }
    }
    expect(paths).toHaveLength(2 * 9 * 6)
  })

  it('réutilise idle pour recovery et victory sans superposer une seconde image', () => {
    expect(playerSprite('male', 'flint-club', 'recovery')).toBe(playerSprite('male', 'flint-club', 'idle'))
    expect(playerSprite('female', 'hunter-bow', 'victory')).toBe(playerSprite('female', 'hunter-bow', 'idle'))
  })

  it('publie un canvas canonique et une ancre de pieds stable', () => {
    expect(playerCanvas).toEqual({ width: 768, height: 512, anchorX: 384, groundY: 462, bodyHeight: 126 })
  })

  it('traduit les identifiants gameplay et centralise le runtime V0.6', () => {
    expect(resolvePlayerWeapon('flint-club')).toBe('massue-silex')
    expect(resolvePlayerWeapon('hunter-bow')).toBe('arc-chasseur')
    const paths = [
      assetsV06.brand.logo, ...Object.values(assetsV06.arena),
      ...Object.values(assetsV06.chest), ...Object.values(assetsV06.effects), gameIcon('navigation', 'hub'),
    ]
    expect(paths.every((path) => path.startsWith('/assets-v06/'))).toBe(true)
    expect(JSON.stringify(assetsV06)).not.toContain('source-v06')
  })

  it('limite les fallbacks V0.4 aux visuels sans équivalent V0.6 complet', () => {
    expect(v04RuntimeFallbacks).toEqual(['equipment illustrations', 'enemy sprites'])
  })
})
