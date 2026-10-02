import { useState, type CSSProperties } from 'react'
import type { EnemyId, SpriteState } from '../art/assetsV04'
import { enemySpriteKit, type EnemySheet, type EnemyVisualPose } from '../art/enemySprites'
import { enemyCombatFactor } from '../art/combatVisualScale'
import { ProductionEnemy } from './Art'

const legacyState = (pose: EnemyVisualPose): SpriteState => pose === 'hit' ? 'hurt' : pose === 'run' ? 'idle' : pose === 'block' ? 'dodge' : pose

function sheetStyle(enemyId: EnemyId, pose: EnemySheet, fx = false, combat = false): CSSProperties | undefined {
  const kit = enemySpriteKit(enemyId)
  if (!kit) return undefined
  const [cellWidth, cellHeight] = kit.geometry[pose]
  const feet = kit.feet[pose]
  const shifts = feet.map((foot) => `${(kit.footReference - foot) / cellHeight * 100}%`)
  const ko = pose === 'ko'
  const desktopScale = (ko ? kit.koScaleDesktop : kit.scaleDesktop) * (combat ? enemyCombatFactor(enemyId, false) : 1)
  const mobileScale = (ko ? kit.koScaleMobile : kit.scaleMobile) * (combat ? enemyCombatFactor(enemyId, true) : 1)
  const frameGap = (cellHeight - kit.footReference) / cellHeight
  return {
    '--enemy-sheet': `url("${kit.sheets[pose]}")`,
    '--enemy-frame-count': kit.frameCount,
    '--enemy-cell-ratio': `${cellWidth} / ${cellHeight}`,
    '--enemy-cell-width-ratio': cellWidth / cellHeight,
    '--enemy-scale': desktopScale,
    '--enemy-mobile-scale': mobileScale,
    '--enemy-ground-offset': `${frameGap * desktopScale * 100}%`,
    '--enemy-mobile-ground-offset': `${frameGap * mobileScale * 100}%`,
    '--enemy-ko-offset-y': `${ko ? kit.koOffsetY : 0}px`,
    '--enemy-shift-0': shifts[0], '--enemy-shift-1': shifts[1], '--enemy-shift-2': shifts[2], '--enemy-shift-3': shifts[3],
    '--enemy-duration': `${fx ? kit.fxMs : pose === 'idle' ? 1120 : pose === 'run' ? 310 : pose === 'ko' ? 760 : pose === 'attack' ? Math.max(260, kit.attackMs - kit.poseAtMs) : 280}ms`,
  } as CSSProperties
}

export function EnemySprite({ enemyId, pose, koFinal = false, previewFrame, className = '', combat = false }: { enemyId: EnemyId; pose: EnemyVisualPose; koFinal?: boolean; previewFrame?: number | null; className?: string; combat?: boolean }) {
  const [failed, setFailed] = useState(false)
  const kit = enemySpriteKit(enemyId)
  if (!kit || failed) return <ProductionEnemy enemyId={enemyId} state={legacyState(pose)} boss={enemyId === 'mammoth'} className={className}/>
  return <div className={`gameplay-enemy-sprite pose-${pose} ${koFinal ? 'ko-final' : ''} ${className}`} style={sheetStyle(enemyId, pose, false, combat)} role="img" aria-label={`${enemyId}, animation ${pose}`} data-enemy-sprite={enemyId} data-frame-count={kit.frameCount}>
    <div className="gameplay-enemy-frame" style={previewFrame == null ? undefined : { animation:'none', backgroundPosition:`${previewFrame / 3 * 100}% 0`, transform:`translate3d(0,var(--enemy-shift-${previewFrame}),0)` }}/>
    <img className="enemy-sheet-probe" src={kit.sheets[pose]} alt="" aria-hidden="true" onError={() => setFailed(true)}/>
  </div>
}

export function EnemyAttackFx({ enemyId, projectile = false, previewFrame }: { enemyId: EnemyId; projectile?: boolean; previewFrame?: number | null }) {
  const kit = enemySpriteKit(enemyId)
  if (!kit) return null
  return <div className={`enemy-attack-fx ${projectile ? 'projectile-art' : ''}`} style={{ ...sheetStyle(enemyId, 'attack-fx', true), ...(previewFrame == null ? {} : { animation:'none', backgroundPosition:`${previewFrame / 3 * 100}% 0`, transform:`translate3d(0,var(--enemy-shift-${previewFrame}),0)` }) }} aria-hidden="true"/>
}
