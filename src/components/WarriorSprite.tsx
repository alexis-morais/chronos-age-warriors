import type { CSSProperties } from 'react'
import { companionFootOffsetY, spritePose, warriorSpriteKit } from '../art/warriorSprites'
import { warriorCombatFactor } from '../art/combatVisualScale'
import type { PlayerState } from '../art/assetsV06'
import type { CombatText } from '../art/combatText'
import { ProductionWarrior } from './Art'

export function WarriorSprite({ warriorId, state, facing = 'right', weapon, sourceOverride, combat = false }: { warriorId: string; state: PlayerState | 'approach'; facing?: 'left' | 'right'; weapon?: string; sourceOverride?: string; combat?: boolean }) {
  const kit = warriorSpriteKit(warriorId)
  if (!kit) return <ProductionWarrior weapon={weapon} state={state === 'approach' ? 'anticipation' : state}/>
  const pose = spritePose(state)
  const geometry = kit.poseGeometry?.[pose] ?? kit
  const posePresentation = kit.posePresentation?.[pose]
  const desktopFactor = combat ? warriorCombatFactor(warriorId, false) : 1
  const mobileFactor = combat ? warriorCombatFactor(warriorId, true) : 1
  const scale = (pose === 'ko' ? kit.koScale ?? kit.scale : posePresentation?.scale ?? kit.scale) * desktopFactor
  const mobileScale = (pose === 'ko' ? kit.koMobileScale ?? kit.mobileScale : posePresentation?.mobileScale ?? kit.mobileScale) * mobileFactor
  const idleHeight = kit.poseGeometry?.idle?.frameHeight ?? kit.frameHeight
  const qaParams = import.meta.env.DEV ? new URLSearchParams(window.location.search) : null
  const requestedFrame = qaParams?.get('qaFrame')
  const qaFrame = qaParams && (qaParams.has('qaHold') || qaParams.has('spritePreview')) && typeof requestedFrame === 'string' && /^[0-3]$/.test(requestedFrame)
    ? Number(requestedFrame) : null
  const anchor = (poseScale: number, idleScale: number, idleAnchor: number) => (idleAnchor * kit.frameHeight + poseScale * (geometry.frameHeight - kit.footY[pose]) - idleScale * (idleHeight - kit.footY.idle)) / geometry.frameHeight
  const style = {
    '--warrior-sheet': `url("${sourceOverride ?? kit.sheets[pose]}")`,
    '--warrior-duration': `${kit.durationMs[pose]}ms`,
    '--warrior-scale': scale,
    '--warrior-mobile-scale': mobileScale,
    '--warrior-pose-width': `${geometry.frameWidth / kit.frameWidth * 100}%`,
    '--warrior-pose-height': `${geometry.frameHeight / kit.frameHeight * 100}%`,
    '--warrior-offset-x': `${kit.offsetX + (pose === 'ko' ? kit.koOffsetX ?? 0 : 0)}px`,
    '--warrior-offset-y': `${kit.offsetY + (pose === 'ko' ? kit.koOffsetY ?? 0 : posePresentation?.offsetY ?? 0)}px`,
    '--warrior-mobile-offset-y': `${kit.offsetY + (pose === 'ko' ? kit.koOffsetY ?? 0 : posePresentation?.mobileOffsetY ?? 0)}px`,
    '--warrior-ground-anchor': `${anchor(scale, kit.scale * desktopFactor, kit.groundAnchor * desktopFactor) * 100}%`,
    '--warrior-mobile-ground-anchor': `${anchor(mobileScale, kit.mobileScale * mobileFactor, kit.mobileGroundAnchor * mobileFactor) * 100}%`,
    zIndex: kit.zIndex,
  } as CSSProperties
  return <div className={`gameplay-warrior-sprite pose-${pose} facing-${facing}`} style={style} role="img" aria-label={`${warriorId}, animation ${pose}`} data-warrior-sprite={warriorId} data-frame-count={kit.frames}><div className="gameplay-warrior-frame" style={qaFrame === null ? undefined : { animation: 'none', backgroundPosition: `${qaFrame / 3 * 100}% 0` }}/></div>
}

export function WarriorAttackFx({ warriorId, source }: { warriorId: string; source?: string }) {
  const kit = warriorSpriteKit(warriorId)
  if (!kit) return null
  const geometry = kit.fxGeometry ?? kit
  return <div className="warrior-attack-fx" style={{ '--warrior-sheet': `url("${source ?? kit.attackFx}")`, '--warrior-duration': `${kit.attackPresentation?.fxDurationMs ?? 320}ms`, '--warrior-fx-ratio': `${geometry.frameWidth} / ${geometry.frameHeight}`, '--warrior-fx-scale': kit.attackPresentation?.fxScale ?? 1, '--warrior-fx-opacity': kit.attackPresentation?.fxOpacity ?? 1 } as CSSProperties} aria-hidden="true"/>
}

export function WarriorCompanion({ warriorId, phase }: { warriorId: string; phase: 'run' | 'attack' | 'return' }) {
  const kit = warriorSpriteKit(warriorId)
  const source = phase === 'attack' ? kit?.companionAttack : kit?.companionRun
  if (!source || !kit) return null
  const qa = import.meta.env.DEV ? new URLSearchParams(window.location.search) : null
  const holdDeparture = qa?.has('qaHold') && qa.get('qaCompanion') === 'run' && phase === 'run'
  return <div className={`warrior-companion phase-${phase}`} style={{
    '--warrior-sheet': `url("${source}")`, '--warrior-duration': `${phase === 'attack' ? 280 : 240}ms`,
    '--companion-paint-offset': `${companionFootOffsetY(kit, phase) / kit.frameHeight * 100}%`,
    '--companion-mobile-paint-offset': `${companionFootOffsetY(kit, phase, true) / kit.frameHeight * 100}%`,
    ...(holdDeparture ? { animationPlayState: 'paused' } : {}),
  } as CSSProperties} aria-hidden="true"><div className="warrior-companion-frame"/></div>
}

export function FloatingCombatText({ text }: { text: CombatText }) {
  return <span className={`floating-combat-text floating-${text.kind} target-${text.target}`} role="status">{text.label}</span>
}
