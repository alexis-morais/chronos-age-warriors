import { describe, expect, it } from 'vitest'
import { assetsV05, gameIcon, hubPortrait, playerSprite, playerStates, playerWeapons, resolvePlayerWeapon, v04RuntimeFallbacks } from './assetsV05'

describe('manifest de production V0.5', () => {
  it('résout les 162 poses joueur sur des canvas V0.5 cohérents', () => {
    const paths = new Set<string>()
    for (const sex of ['male', 'female'] as const) {
      for (const weapon of playerWeapons) {
        for (const state of playerStates) {
          const path = playerSprite(sex, weapon, state)
          expect(path).toContain(`/player/${sex}/${weapon}/${state}.png`)
          if (state === 'hurt') expect(path).toContain('/assets-v05/derived/')
          else expect(path).toMatch(/^\/assets-v05\/player\//)
          paths.add(path)
        }
      }
    }
    expect(paths).toHaveLength(2 * 9 * 9)
  })

  it('traduit les identifiants gameplay sans fallback silencieux', () => {
    expect(resolvePlayerWeapon('flint-club')).toBe('massue-silex')
    expect(resolvePlayerWeapon('hunter-bow')).toBe('arc-chasseur')
    expect(resolvePlayerWeapon('titan-heart')).toBe('coeur-titan')
    expect(resolvePlayerWeapon('inconnu')).toBe('massue-silex')
  })

  it('centralise Hub, arène, coffre, effets et icônes en V0.5', () => {
    const paths = [
      ...Object.values(assetsV05.hub), ...Object.values(assetsV05.customization),
      ...Object.values(assetsV05.arena), ...Object.values(assetsV05.chest),
      ...Object.values(assetsV05.effects), hubPortrait('female'), gameIcon('navigation', 'hub'),
    ]
    expect(paths.every((path) => path.startsWith('/assets-v05/'))).toBe(true)
    expect(JSON.stringify(assetsV05)).not.toContain('art-direction')
  })

  it('documente précisément les seuls fallbacks V0.4 encore exécutés', () => {
    expect(v04RuntimeFallbacks).toEqual(['logo', 'equipment illustrations', 'enemy sprites'])
  })
})
