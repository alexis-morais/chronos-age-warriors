import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProductionEnemy } from '../components/Art'
import { enemyPresentation } from './enemyPresentation'
import type { EnemyId } from './assetsV04'

// Alpha > 24 measurements: [idle image height, idle visible height,
// KO image height, KO visible width, bottom transparent margin].
const bounds: Record<EnemyId, [number, number, number, number, number]> = {
  'tribal-hunter': [280, 268, 132, 229, 6],
  'tribal-warrior': [275, 263, 132, 229, 6],
  'cave-brute': [256, 244, 149, 242, 6],
  shaman: [235, 223, 122, 242, 5],
  raptor: [282, 270, 113, 219, 6],
  smilodon: [211, 199, 125, 211, 6],
  mammoth: [291, 279, 165, 225, 6],
}

describe('présentation KO des ennemis', () => {
  it('garde le corps couché proche de la hauteur debout sans changer idle', () => {
    for (const [id, [idleHeight, idleVisible, koHeight, koVisibleWidth, koFootMargin]] of Object.entries(bounds) as [EnemyId, typeof bounds[EnemyId]][]) {
      const presentation = enemyPresentation[id]
      expect(presentation.idleScale).toBe(1)
      const fallenLengthVsStanding = presentation.koScale * koVisibleWidth / koHeight / (idleVisible / idleHeight)
      expect(fallenLengthVsStanding).toBeGreaterThan(1)
      expect(fallenLengthVsStanding).toBeLessThan(1.2)
      const footDifference = 133 * Math.abs(presentation.koScale * koFootMargin / koHeight - 6 / idleHeight)
      expect(footDifference).toBeLessThan(1.2)
      expect(presentation.koOffsetY).toBe(-2)
    }
  })

  it('n’applique le correctif qu’à la pose KO du sprite ennemi', () => {
    const { rerender } = render(<ProductionEnemy enemyId="tribal-warrior" state="idle"/>)
    expect(screen.getByRole('img', { name: /Ennemi primordial tribal-warrior/ }).className).toContain('state-idle')
    rerender(<ProductionEnemy enemyId="tribal-warrior" state="ko"/>)
    const sprite = screen.getByRole('img', { name: /Ennemi primordial tribal-warrior/ })
    expect(sprite.className).toContain('state-ko')
    expect(sprite.getAttribute('style')).toContain('--enemy-ko-scale: 0.61')
    expect(sprite.querySelector('img')?.getAttribute('src')).toBe('/assets-v04/derived/enemies/tribal-warrior/ko.png')
  })
})
