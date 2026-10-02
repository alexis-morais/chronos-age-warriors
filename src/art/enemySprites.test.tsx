import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { enemyIds } from './assetsV04'
import { enemyContactDistance, enemyPaintedBattleSize, enemyProjectileGeometry, enemySpriteKits, enemyVisualPose } from './enemySprites'
import { EnemySprite } from '../components/EnemySprite'

describe('Primal enemy sprite pipeline', () => {
  it('registers seven complete native-left four-frame kits with runtime paths', () => {
    expect(Object.keys(enemySpriteKits)).toHaveLength(7)
    for (const id of enemyIds) {
      const kit = enemySpriteKits[id]
      expect(kit.id).toBe(id)
      expect(kit.base).toContain(`/ennemies/primal/${id}/base.png`)
      expect(kit.facing).toBe('left')
      expect(kit.frameCount).toBe(4)
      expect(kit.cellWidth).toBeGreaterThan(0)
      expect(kit.cellHeight).toBeGreaterThan(0)
      for (const pose of ['idle','run','anticipation','attack','attack-fx','dodge','block','hit','ko'] as const) {
        expect(kit.sheets[pose]).toContain(`/ennemies/primal/${id}/${pose}`)
        expect(kit.sheets[pose]).toContain(id === 'smilodon' && ['idle','anticipation','block'].includes(pose) ? '-runtime.png' : '-isolated.png')
        expect(kit.geometry[pose][0]).toBeGreaterThanOrEqual(kit.cellWidth)
        expect(kit.paintedSize[pose][0]).toBeLessThan(kit.geometry[pose][0])
        expect(kit.feet[pose]).toHaveLength(4)
      }
    }
    expect(enemySpriteKits['tribal-hunter'].id).not.toBe(enemySpriteKits['tribal-warrior'].id)
    expect(enemySpriteKits['tribal-hunter'].sheets.idle).not.toBe(enemySpriteKits['tribal-warrior'].sheets.idle)
  })

  it('keeps the Raptor muzzle inside its own attack cells and sizes arena art independently of previews', () => {
    expect(enemySpriteKits.raptor.geometry.attack[0]).toBe(720)
    expect(enemySpriteKits.raptor.paintedSize.attack[0]).toBeLessThan(720)
    const preview = render(<EnemySprite enemyId="raptor" pose="attack"/>)
    const previewScale = preview.container.querySelector('.gameplay-enemy-sprite')?.getAttribute('style')
    preview.rerender(<EnemySprite enemyId="raptor" pose="attack" combat/>)
    const battleScale = preview.container.querySelector('.gameplay-enemy-sprite')?.getAttribute('style')
    expect(previewScale).toContain('--enemy-scale: 0.92')
    expect(battleScale).toContain('--enemy-scale: 1.84')
    preview.unmount()
  })

  it('anchors the Shaman projectile at the staff release and aims at the Warrior chest', () => {
    const kit = enemySpriteKits.shaman
    const bounds = { playerCenterX: 440, enemyCenterX: 990, playerWidth: 150, playerHeight: 180, enemyWidth: 133, enemyHeight: 133, groundFromBottom: 100 }
    const geometry = enemyProjectileGeometry(kit, bounds, false, 'karg', .63)!
    const startX = geometry.left + kit.projectile!.visualAnchorX * geometry.width
    expect(startX).toBeLessThan(bounds.enemyCenterX)
    expect(startX).toBeGreaterThan(850)
    expect(startX + geometry.travelX).toBeCloseTo(bounds.playerCenterX)
    expect(geometry.travelY).toBeGreaterThan(0)
    expect(kit.fxAtMs).toBeGreaterThan(kit.poseAtMs)
    expect(kit.fxAtMs).toBeLessThan(kit.attackMs)
    const painted = enemyPaintedBattleSize(kit, bounds.enemyHeight, false)
    expect(painted.height).toBeGreaterThan(bounds.enemyHeight)
  })

  it('keeps each combat profile distinct without changing Fighter data', () => {
    expect(enemySpriteKits.shaman.attackKind).toBe('ranged')
    expect(enemySpriteKits.shaman.projectile).toBeDefined()
    expect(enemySpriteKits.mammoth.profile).toBe('boss')
    expect(enemySpriteKits.raptor.attackMs).toBeLessThan(enemySpriteKits['cave-brute'].attackMs)
    expect(enemySpriteKits.smilodon.attackKind).toBe('melee')
    expect(enemyContactDistance(enemySpriteKits.shaman, 100, 400, 120, 120, false)).toBe(0)
    const tribal = enemySpriteKits['tribal-warrior']
    expect(enemyContactDistance(tribal, 100, 400, 120, 120, false)).toBe(enemyContactDistance({ ...tribal, contactAdvance: 0 }, 100, 400, 120, 120, false) + 90)
  })

  it('maps only visual reactions and preserves KO and true block', () => {
    expect(enemyVisualPose('hurt')).toBe('hit')
    expect(enemyVisualPose('dodge')).toBe('dodge')
    expect(enemyVisualPose('block')).toBe('block')
    expect(enemyVisualPose('ko')).toBe('ko')
    expect(enemyVisualPose('victory')).toBe('idle')
  })

  it('renders a modern sheet and falls back to legacy on image failure', () => {
    const { container } = render(<EnemySprite enemyId="raptor" pose="hit"/>)
    expect(screen.getByRole('img', { name: 'raptor, animation hit' }).getAttribute('data-frame-count')).toBe('4')
    expect(container.querySelector('.gameplay-enemy-sprite')).toBeTruthy()
    fireEvent.error(container.querySelector('.enemy-sheet-probe')!)
    expect(container.querySelector('.enemy-raptor.state-hurt img')?.getAttribute('src')).toBe('/assets-v04/derived/enemies/raptor/hurt.png')
  })
})
