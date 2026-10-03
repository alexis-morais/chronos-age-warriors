import type { BattleEvent } from '../types'
import type { PlayerState } from './assetsV06'

export type WarriorSpritePose = 'idle' | 'run' | 'attack' | 'hit' | 'dodge' | 'block' | 'ko'
export type WarriorAttackKind = 'melee' | 'ranged' | 'companion'

export interface WarriorAttackPresentation {
  // Milliseconds from the engine's attack event, before speed scaling.
  approachAtMs: number
  poseAtMs: number
  fxCueMs: number
  fxDurationMs: number
  eventDurationMs: number
  fxScale: number
  fxOpacity: number
  contactFrame?: number
  contactHoldMs?: number
}

export interface WarriorContactPresentation {
  // Painted contact point in the attack cell, relative to its width.
  pointX: number
  targetInset: number
  extraPx?: number
  approachFraction?: number
}

export interface WarriorProjectilePresentation {
  // Origin relative to the fighter's fixed box (left-to-right / ground-up).
  originX: number
  originY: number
  // The projectile art's own painted origin within its cell.
  visualAnchorX: number
  visualAnchorY: number
  width: number
  mobileWidth: number
  targetY: number
  targetInset: number
}

export interface WarriorSpriteKit {
  base: string
  sheets: Record<WarriorSpritePose, string>
  attackFx: string
  frames: number
  frameWidth: number
  frameHeight: number
  poseGeometry?: Partial<Record<WarriorSpritePose, { frameWidth: number; frameHeight: number }>>
  fxGeometry?: { frameWidth: number; frameHeight: number }
  attackKind?: WarriorAttackKind
  returnMs?: number
  projectile?: string
  impactFx?: string
  companionRun?: string
  companionAttack?: string
  companionFootY?: { idle: number; run: number; attack: number }
  previewExtras?: Record<string, string>
  scale: number
  mobileScale: number
  offsetX: number
  offsetY: number
  groundAnchor: number
  mobileGroundAnchor: number
  koScale?: number
  koMobileScale?: number
  koOffsetX?: number
  koOffsetY?: number
  posePresentation?: Partial<Record<WarriorSpritePose, { scale: number; mobileScale: number; offsetY: number; mobileOffsetY: number }>>
  zIndex: number
  durationMs: Record<WarriorSpritePose, number>
  attackPresentation?: WarriorAttackPresentation
  contact?: WarriorContactPresentation
  projectilePresentation?: WarriorProjectilePresentation
  combatTextLift?: { desktop: number; mobile: number }
  // Alpha foot positions measured in a single 543 × 724 frame.
  footY: Record<WarriorSpritePose, number>
}

const primalSpriteRoot = '/assets/sprites/warriors/primal'
const kargRoot = `${primalSpriteRoot}/karg`
const nayaRoot = `${primalSpriteRoot}/naya`

type NewKitOptions = Omit<WarriorSpriteKit, 'base' | 'sheets' | 'attackFx' | 'frames' | 'zIndex'> & {
  poseFiles?: Partial<Record<WarriorSpritePose, string>>
  attackFxFile?: string
}

function primalKit(id: string, options: NewKitOptions): WarriorSpriteKit {
  const root = `${primalSpriteRoot}/${id}`
  const { poseFiles = {}, attackFxFile = 'attack-fx', ...presentation } = options
  const sheet = (pose: WarriorSpritePose) => `${root}/${poseFiles[pose] ?? pose}.png`
  return {
    ...presentation,
    base: `${root}/base.png`,
    sheets: { idle: sheet('idle'), run: sheet('run'), attack: sheet('attack'), hit: sheet('hit'), dodge: sheet('dodge'), block: sheet('block'), ko: sheet('ko') },
    attackFx: `${root}/${attackFxFile}.png`,
    frames: 4,
    zIndex: 3,
  }
}

const durations = (idle: number, run: number, attack: number, ko = 760) => ({ idle, run, attack, hit: 300, dodge: 350, block: 400, ko })
const melee = (poseAtMs: number, fxCueMs: number, eventDurationMs: number, fxScale = 0.8): WarriorAttackPresentation => ({ approachAtMs: 100, poseAtMs, fxCueMs, fxDurationMs: 230, eventDurationMs, fxScale, fxOpacity: 0.82, contactFrame: 2, contactHoldMs: 0 })
const ranged = (poseAtMs: number, fxCueMs: number, eventDurationMs: number): WarriorAttackPresentation => ({ approachAtMs: 0, poseAtMs, fxCueMs, fxDurationMs: 240, eventDurationMs, fxScale: 0.72, fxOpacity: 0.86, contactHoldMs: 0 })

export const warriorSpriteKits: Record<string, WarriorSpriteKit> = {
  karg: {
    base: `${kargRoot}/base.png`,
    sheets: {
      idle: `${kargRoot}/idle.png`,
      run: `${kargRoot}/run.png`,
      attack: `${kargRoot}/attack.png`,
      hit: `${kargRoot}/hit.png`,
      dodge: `${kargRoot}/dodge.png`,
      block: `${kargRoot}/block.png`,
      ko: `${kargRoot}/ko.png`,
    },
    attackFx: `${kargRoot}/attack-fx.png`,
    frames: 4,
    frameWidth: 543,
    frameHeight: 724,
    // Idle alpha bounds: y=99..662 / 724. Calibrated against a standard
    // human enemy (about 96% of its image height), not against PNG dimensions.
    scale: 0.82,
    mobileScale: 0.69,
    offsetX: 0,
    offsetY: 0,
    groundAnchor: 0.056,
    mobileGroundAnchor: 0.044,
    zIndex: 3,
    durationMs: { idle: 960, run: 260, attack: 270, hit: 300, dodge: 350, block: 400, ko: 760 },
    footY: { idle: 662, run: 662, attack: 662, hit: 662, dodge: 640, block: 694, ko: 653 },
  },
  naya: {
    base: `${nayaRoot}/base.png`,
    sheets: {
      idle: `${nayaRoot}/idle.png`,
      run: `${nayaRoot}/run.png`,
      attack: `${nayaRoot}/attack.png`,
      hit: `${nayaRoot}/hit.png`,
      dodge: `${nayaRoot}/dodge.png`,
      block: `${nayaRoot}/block.png`,
      ko: `${nayaRoot}/ko.png`,
    },
    attackFx: `${nayaRoot}/attack-fx.png`,
    frames: 4,
    frameWidth: 543,
    frameHeight: 724,
    // Alpha idle bounds: y=126..676. These values match Karg's visible height
    // and ground contact without changing the shared arena dimensions.
    scale: 0.84,
    mobileScale: 0.71,
    offsetX: 0,
    offsetY: 0,
    groundAnchor: 0.0415,
    mobileGroundAnchor: 0.032,
    koScale: 0.84,
    koMobileScale: 0.71,
    koOffsetX: 0,
    koOffsetY: 0,
    zIndex: 3,
    durationMs: { idle: 960, run: 260, attack: 360, hit: 300, dodge: 350, block: 400, ko: 760 },
    attackPresentation: { approachAtMs: 100, poseAtMs: 230, fxCueMs: 410, fxDurationMs: 240, eventDurationMs: 500, fxScale: 0.76, fxOpacity: 0.76 },
    footY: { idle: 676, run: 642, attack: 646, hit: 676, dodge: 638, block: 697, ko: 669 },
  },
  brakk: primalKit('brakk', {
    frameWidth: 543, frameHeight: 724, scale: 0.9, mobileScale: 0.72, offsetX: 0, offsetY: 0,
    poseGeometry: { attack: { frameWidth: 640, frameHeight: 724 } },
    groundAnchor: 0.055, mobileGroundAnchor: 0.041, durationMs: durations(1140, 330, 440, 880),
    attackKind: 'melee', returnMs: 300, attackPresentation: melee(255, 530, 740, 0.92),
    // Wider attack cell restores the clipped third pose; equivalent reach.
    contact: { pointX: 0.772, targetInset: 0.06, approachFraction: 0.73 },
    combatTextLift: { desktop: 179, mobile: 122 },
    poseFiles: { attack: 'attack-runtime', hit: 'hit-runtime' },
    footY: { idle: 666, run: 640, attack: 681, hit: 668, dodge: 655, block: 699, ko: 665 },
  }),
  eyla: primalKit('eyla', {
    frameWidth: 543, frameHeight: 724, scale: 0.8, mobileScale: 0.68, offsetX: 0, offsetY: 0,
    groundAnchor: 0.0244, mobileGroundAnchor: 0.0181, durationMs: durations(930, 300, 390),
    attackKind: 'ranged', attackPresentation: ranged(110, 340, 560),
    projectile: `${primalSpriteRoot}/eyla/projectile.png`,
    projectilePresentation: { originX: 0.81, originY: 0.59, visualAnchorX: 0.06, visualAnchorY: 0.48, width: 76, mobileWidth: 55, targetY: 0.55, targetInset: 0.24 },
    previewExtras: { aim: `${primalSpriteRoot}/eyla/aim-runtime.png`, projectile: `${primalSpriteRoot}/eyla/projectile.png` },
    poseFiles: { run: 'idle', attack: 'attack-runtime', hit: 'hit-runtime' },
    combatTextLift: { desktop: 172, mobile: 119 },
    footY: { idle: 685, run: 685, attack: 682, hit: 674, dodge: 670, block: 707, ko: 648 },
  }),
  asha: primalKit('asha', {
    frameWidth: 443.5, frameHeight: 887, scale: 0.64, mobileScale: 0.55, offsetX: 0, offsetY: 0,
    groundAnchor: 0.0382, mobileGroundAnchor: 0.0303, durationMs: durations(1050, 330, 420),
    attackKind: 'ranged', attackPresentation: ranged(120, 365, 590), fxGeometry: { frameWidth: 448, frameHeight: 887 },
    attackFxFile: 'attack-fx-runtime', projectile: `${primalSpriteRoot}/asha/attack-fx-runtime.png`, impactFx: `${primalSpriteRoot}/asha/attack-impact.png`,
    projectilePresentation: { originX: 0.71, originY: 0.52, visualAnchorX: 0.45, visualAnchorY: 0.5, width: 104, mobileWidth: 76, targetY: 0.56, targetInset: 0.25 },
    previewExtras: { 'attack-impact': `${primalSpriteRoot}/asha/attack-impact.png` },
    poseFiles: { run: 'idle' },
    combatTextLift: { desktop: 184, mobile: 126 },
    footY: { idle: 807, run: 807, attack: 759, hit: 815, dodge: 758, block: 803, ko: 735 },
  }),
  rhex: primalKit('rhex', {
    frameWidth: 543, frameHeight: 724, scale: 0.94, mobileScale: 0.78, offsetX: 0, offsetY: 0,
    // Solo command art is painted larger/lower than the group idle sheet.
    posePresentation: { attack: { scale: 0.82, mobileScale: 0.68, offsetY: -14, mobileOffsetY: -9 } },
    groundAnchor: 0.0392, mobileGroundAnchor: 0.0305, durationMs: durations(980, 240, 470, 800),
    attackKind: 'companion', attackPresentation: ranged(95, 420, 700),
    companionRun: `${primalSpriteRoot}/rhex/raptors-run.png`, companionAttack: `${primalSpriteRoot}/rhex/raptors-attack-runtime.png`,
    // Painted front-paw baselines in the idle, moving and attack cells.
    companionFootY: { idle: 679, run: 520, attack: 597 },
    previewExtras: { command: `${primalSpriteRoot}/rhex/command.png`, 'command-solo': `${primalSpriteRoot}/rhex/command-solo.png`, 'raptors-run': `${primalSpriteRoot}/rhex/raptors-run.png`, 'raptors-attack': `${primalSpriteRoot}/rhex/raptors-attack-runtime.png` },
    poseFiles: { run: 'idle', attack: 'command-solo', hit: 'hit-runtime' },
    combatTextLift: { desktop: 183, mobile: 125 },
    footY: { idle: 679, run: 679, attack: 692, hit: 676, dodge: 675, block: 668, ko: 652 },
  }),
  ursak: primalKit('ursak', {
    frameWidth: 543, frameHeight: 724, scale: 0.87, mobileScale: 0.76, offsetX: 0, offsetY: 0,
    groundAnchor: 0.0154, mobileGroundAnchor: 0.0121, durationMs: durations(1120, 300, 350, 800),
    attackKind: 'melee', attackPresentation: melee(220, 425, 610, 0.85),
    contact: { pointX: 0.84, targetInset: 0.09, approachFraction: 0.75 },
    combatTextLift: { desktop: 177, mobile: 126 },
    poseFiles: { attack: 'attack-runtime', hit: 'hit-runtime' },
    footY: { idle: 695, run: 630, attack: 651, hit: 683, dodge: 670, block: 681, ko: 645 },
  }),
  saar: primalKit('saar', {
    frameWidth: 543, frameHeight: 724, scale: 0.94, mobileScale: 0.82, offsetX: 0, offsetY: 0,
    groundAnchor: 0.057, mobileGroundAnchor: 0.046, durationMs: durations(760, 175, 240, 660),
    attackKind: 'melee', returnMs: 160, attackPresentation: melee(170, 300, 450, 0.78), fxGeometry: { frameWidth: 443.5, frameHeight: 887 },
    contact: { pointX: 0.85, targetInset: 0.11, approachFraction: 0.86 },
    combatTextLift: { desktop: 158, mobile: 115 },
    poseFiles: { attack: 'attack-runtime', hit: 'hit-runtime' },
    footY: { idle: 666, run: 583, attack: 619, hit: 650, dodge: 590, block: 639, ko: 648 },
  }),
  morga: primalKit('morga', {
    frameWidth: 543, frameHeight: 724, scale: 1.19, mobileScale: 0.96, offsetX: 0, offsetY: 0,
    groundAnchor: 0.043, mobileGroundAnchor: 0.032, durationMs: durations(1250, 370, 480, 980),
    attackKind: 'melee', returnMs: 310, attackPresentation: melee(290, 545, 815, 0.92),
    contact: { pointX: 0.86, targetInset: 0.12, approachFraction: 0.73 },
    combatTextLift: { desktop: 190, mobile: 141 },
    poseFiles: { attack: 'attack-runtime' },
    footY: { idle: 685, run: 650, attack: 661, hit: 681, dodge: 645, block: 671, ko: 663 },
  }),
  vorka: primalKit('vorka', {
    frameWidth: 443.5, frameHeight: 887, scale: 0.63, mobileScale: 0.55, offsetX: 0, offsetY: 0,
    groundAnchor: -0.0013, mobileGroundAnchor: -0.0038, durationMs: durations(900, 250, 360, 810),
    attackKind: 'melee', attackPresentation: melee(220, 435, 625, 0.8), fxGeometry: { frameWidth: 443.5, frameHeight: 887 },
    contact: { pointX: 0.9, targetInset: 0.12, approachFraction: 0.75 },
    combatTextLift: { desktop: 176, mobile: 120 },
    footY: { idle: 860, run: 719, attack: 824, hit: 829, dodge: 728, block: 835, ko: 793 },
  }),
  urgath: primalKit('urgath', {
    frameWidth: 418, frameHeight: 941, scale: 0.82, mobileScale: 0.64, offsetX: 0, offsetY: 0,
    groundAnchor: 0.037, mobileGroundAnchor: 0.026, durationMs: durations(1350, 390, 520, 1100),
    attackKind: 'melee', returnMs: 320, attackPresentation: melee(295, 575, 865, 0.96), fxGeometry: { frameWidth: 418, frameHeight: 941 },
    contact: { pointX: 0.87, targetInset: 0.13, approachFraction: 0.72 },
    combatTextLift: { desktop: 218, mobile: 155 },
    footY: { idle: 875, run: 746, attack: 849, hit: 826, dodge: 823, block: 848, ko: 861 },
  }),
  tyrak: primalKit('tyrak', {
    frameWidth: 418, frameHeight: 941, scale: 1.24, mobileScale: 1.07, offsetX: 0, offsetY: 0,
    groundAnchor: 0.045, mobileGroundAnchor: 0.0385, durationMs: durations(1100, 290, 430, 900),
    attackKind: 'melee', returnMs: 260, attackPresentation: melee(205, 485, 690, 0.9),
    contact: { pointX: 0.73, targetInset: 0.1, approachFraction: 0.75 },
    combatTextLift: { desktop: 258, mobile: 188 },
    poseFiles: { idle: 'idle-runtime', run: 'run-runtime', attack: 'attack-runtime', hit: 'hit-runtime', ko: 'ko-runtime' },
    poseGeometry: { idle: { frameWidth: 543, frameHeight: 724 }, attack: { frameWidth: 950, frameHeight: 724 }, ko: { frameWidth: 543, frameHeight: 724 } },
    footY: { idle: 690, run: 662, attack: 655, hit: 703, dodge: 693, block: 709, ko: 690 },
  }),
}

export const warriorSpriteKit = (warriorId: string) => warriorSpriteKits[warriorId]

export interface WarriorBattleMeasurements {
  playerCenterX: number
  enemyCenterX: number
  playerWidth: number
  playerHeight: number
  enemyWidth: number
  enemyHeight: number
  groundFromBottom: number
}

export function warriorBattleGeometry(kit: WarriorSpriteKit, bounds: WarriorBattleMeasurements, mobile: boolean, presentation: { playerFactor?: number; enemyVisualWidth?: number; enemyVisualHeight?: number } = {}) {
  const scale = (mobile ? kit.mobileScale : kit.scale) * (presentation.playerFactor ?? 1)
  const enemyWidth = presentation.enemyVisualWidth ?? bounds.enemyWidth
  const enemyHeight = presentation.enemyVisualHeight ?? bounds.enemyHeight
  const attackWidthRatio = (kit.poseGeometry?.attack?.frameWidth ?? kit.frameWidth) / kit.frameWidth
  const contact = kit.contact
  const tipReach = contact ? (contact.pointX - 0.5) * bounds.playerWidth * attackWidthRatio * scale : 0
  const targetEdge = bounds.enemyCenterX - enemyWidth * (0.45 - (contact?.targetInset ?? 0))
  const contactDistance = contact ? Math.max(0, targetEdge - bounds.playerCenterX - tipReach + (contact.extraPx ?? 0)) : null
  const approachDistance = contactDistance === null ? null : contactDistance * (contact?.approachFraction ?? 0.72)
  const companionDistance = Math.max(0, bounds.enemyCenterX - bounds.playerCenterX - enemyWidth * 0.46 - bounds.playerWidth * scale * 0.47)
  const projectile = kit.projectilePresentation
  if (!projectile) return { contactDistance, approachDistance, companionDistance, projectile: null }
  const width = mobile ? projectile.mobileWidth : projectile.width
  const fx = kit.fxGeometry ?? kit
  const height = width * fx.frameHeight / fx.frameWidth
  const originX = bounds.playerCenterX + (projectile.originX - 0.5) * bounds.playerWidth * scale
  const originBottom = bounds.groundFromBottom + projectile.originY * bounds.playerHeight * scale
  const targetX = bounds.enemyCenterX - enemyWidth * projectile.targetInset
  const targetBottom = bounds.groundFromBottom + projectile.targetY * enemyHeight
  return {
    contactDistance, approachDistance, companionDistance,
    projectile: {
      left: originX - width * projectile.visualAnchorX,
      bottom: originBottom - height * (1 - projectile.visualAnchorY),
      width,
      travelX: targetX - originX - width * (0.95 - projectile.visualAnchorX),
      travelY: targetBottom - originBottom,
    },
  }
}

export const warriorUsesApproach = (kit: WarriorSpriteKit) => (kit.attackKind ?? 'melee') === 'melee'

export function warriorAttackTimeline(kit: WarriorSpriteKit) {
  const config = kit.attackPresentation
  return {
    approachAtMs: config?.approachAtMs ?? 100,
    poseAtMs: config?.poseAtMs ?? 230,
    fxCueMs: config?.fxCueMs ?? null,
    fxDurationMs: config?.fxDurationMs ?? 320,
    eventDurationMs: config?.eventDurationMs ?? 500,
  }
}

export function attackHasImpact(events: BattleEvent[], attackIndex: number): boolean {
  const attack = events[attackIndex]
  if (attack?.type !== 'attack') return false
  for (const event of events.slice(attackIndex + 1)) {
    if (event.type === 'dodge' || event.type === 'attack' || event.type === 'ko') return false
    if (event.type === 'damage' && event.actor === attack.actor) return true
  }
  return false
}

export function playerReactionForEvent(event: BattleEvent, previous?: BattleEvent, next?: BattleEvent): PlayerState | null {
  if (event.actor === 'player' && event.type === 'dodge') return 'dodge'
  if (event.actor === 'player' && event.type === 'skill' && event.label === 'Parade') return 'block'
  if ((event.type === 'damage' || event.type === 'bleed') && event.target === 'player') {
    if (event.playerHp === 0 && next?.type !== 'heal') return 'ko'
    if (previous?.type === 'skill' && previous.label === 'Parade' && previous.actor === 'player') return 'block'
    return 'hurt'
  }
  if (event.target === 'player' && event.type === 'ko' && event.playerHp === 0) return 'ko'
  return null
}

export function spritePose(state: import('./assetsV06').PlayerState | 'approach'): WarriorSpritePose {
  if (state === 'approach') return 'run'
  if (state === 'attack') return 'attack'
  if (state === 'hurt') return 'hit'
  if (state === 'dodge' || state === 'block' || state === 'ko') return state
  return 'idle'
}

export function companionFootOffsetY(kit: WarriorSpriteKit, phase: 'run' | 'attack' | 'return', mobile = false): number {
  if (!kit.companionFootY) return 0
  const feet = kit.companionFootY
  const scale = mobile ? kit.mobileScale : kit.scale
  const groundAnchor = mobile ? kit.mobileGroundAnchor : kit.groundAnchor
  // The idle raptors live inside the scaled, ground-anchored Rhex sheet.
  // Their moving sheets are unscaled; normalize painted paw contact, not PNG boxes.
  const idleFootAboveGround = scale * (kit.frameHeight - feet.idle) - groundAnchor * kit.frameHeight
  return kit.frameHeight - feet[phase === 'attack' ? 'attack' : 'run'] - idleFootAboveGround
}

export function preloadWarriorSpriteKit(warriorId: string): Promise<void> {
  const kit = warriorSpriteKit(warriorId)
  if (!kit || typeof Image === 'undefined') return Promise.resolve()
  const sources = new Set([...Object.values(kit.sheets), kit.attackFx, kit.projectile, kit.impactFx, kit.companionRun, kit.companionAttack].filter((src): src is string => Boolean(src)))
  return Promise.all([...sources].map((src) => new Promise<void>((resolve) => {
    const image = new Image()
    // onload alone does not guarantee a large spritesheet has been decoded.
    // Wait for decode before the first pose switch to avoid a blank GPU frame.
    image.onload = () => { if (typeof image.decode === 'function') image.decode().then(() => resolve(), () => resolve()); else resolve() }
    image.onerror = () => resolve()
    image.src = src
  }))).then(() => undefined)
}
