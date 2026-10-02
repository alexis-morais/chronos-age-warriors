import type { EnemyId, SpriteState } from './assetsV04'
import { enemyFrameGeometry, enemyFramePaintedSize } from './enemyFrameGeometry.generated'
import { enemyCombatFactor, warriorCombatFactor } from './combatVisualScale'
import type { WarriorBattleMeasurements } from './warriorSprites'

export type EnemyVisualPose = 'idle' | 'run' | 'anticipation' | 'attack' | 'dodge' | 'block' | 'hit' | 'ko'
export type EnemySheet = EnemyVisualPose | 'attack-fx'
export type EnemyMotion = 'idle' | 'approach' | 'return'

export interface EnemySpriteKit {
  id: EnemyId
  base: string
  sheets: Record<EnemySheet, string>
  geometry: Record<EnemySheet, readonly [number, number]>
  paintedSize: Record<EnemySheet, readonly [number, number]>
  frameCount: number
  cellWidth: number
  cellHeight: number
  facing: 'left'
  attackKind: 'melee' | 'ranged'
  profile: 'heavy' | 'spear' | 'fast' | 'caster' | 'predator' | 'boss'
  scaleDesktop: number
  scaleMobile: number
  koScaleDesktop: number
  koScaleMobile: number
  koOffsetY: number
  footReference: number
  feet: Record<EnemySheet, readonly [number, number, number, number]>
  combatTextLift: { desktop: number; mobile: number }
  stopGap: number
  contactAdvance?: number
  attackMs: number
  runAtMs: number
  anticipationAtMs: number
  poseAtMs: number
  fxAtMs: number
  fxMs: number
  returnMs: number
  projectile?: { originX: number; originY: number; visualAnchorX: number; visualAnchorY: number; targetY: number; width: number; mobileWidth: number }
}

const root = '/assets/sprites/ennemies/primal'
const feet = {
  brute: { idle:[674,676,698,674],run:[724,662,676,670],anticipation:[677,676,676,676],attack:[702,708,709,708],dodge:[700,672,698,662],block:[692,692,692,692],hit:[692,692,693,700],ko:[684,633,696,636],'attack-fx':[673,672,690,685] },
  tribal: { idle:[690,690,704,702],run:[664,674,679,679],anticipation:[690,684,700,676],attack:[664,696,698,676],dodge:[690,692,700,656],block:[682,678,678,689],hit:[684,676,676,700],ko:[648,664,676,676],'attack-fx':[682,683,674,660] },
  raptor: { idle:[690,665,698,665],run:[672,724,724,702],anticipation:[700,724,683,704],attack:[724,692,708,699],dodge:[690,688,704,645],block:[670,664,698,668],hit:[696,690,693,694],ko:[690,671,662,667],'attack-fx':[724,724,700,664] },
  shaman: { idle:[697,697,700,697],run:[674,677,678,682],anticipation:[724,724,724,724],attack:[700,690,693,706],dodge:[700,690,692,676],block:[678,687,706,684],hit:[708,708,708,708],ko:[647,668,652,667],'attack-fx':[724,724,724,724] },
  smilodon: { idle:[560,561,560,560],run:[519,521,471,531],anticipation:[569,563,567,568],attack:[550,533,552,550],dodge:[520,526,506,544],block:[544,533,533,544],hit:[592,590,597,596],ko:[573,583,581,578],'attack-fx':[537,554,538,527] },
  mammoth: { idle:[650,652,700,648],run:[668,724,702,724],anticipation:[628,686,631,636],attack:[685,640,676,660],dodge:[685,690,698,674],block:[627,662,628,627],hit:[692,686,660,676],
    // KO debris extends below the painted body; anchor the body, not the rocks.
    ko:[590,600,610,595],'attack-fx':[704,724,678,672] },
} as const satisfies Record<string, Record<EnemySheet, readonly [number, number, number, number]>>

type KitOptions = Omit<EnemySpriteKit, 'id' | 'base' | 'sheets' | 'geometry' | 'paintedSize' | 'frameCount' | 'facing'>
function kit(id: EnemyId, options: KitOptions): EnemySpriteKit {
  const folder = `${root}/${id}`
  const sheets = Object.fromEntries((['idle','run','anticipation','attack','dodge','block','hit','ko','attack-fx'] as EnemySheet[]).map((pose) => [pose, `${folder}/${pose}${id === 'smilodon' && ['idle','anticipation','block'].includes(pose) ? '-runtime' : '-isolated'}.png`])) as Record<EnemySheet, string>
  return { id, base: `${folder}/base.png`, sheets, geometry: enemyFrameGeometry[id], paintedSize: enemyFramePaintedSize[id], frameCount: 4, facing: 'left', ...options }
}

const tribal = {
  cellWidth:543,cellHeight:724,attackKind:'melee',profile:'spear',scaleDesktop:1.2,scaleMobile:1.12,koScaleDesktop:1.2,koScaleMobile:1.12,koOffsetY:0,
  footReference:696,feet:feet.tribal,combatTextLift:{desktop:195,mobile:126},stopGap:66,contactAdvance:90,
  attackMs:570,runAtMs:0,anticipationAtMs:185,poseAtMs:275,fxAtMs:410,fxMs:210,returnMs:230,
} as const satisfies KitOptions

export const enemySpriteKits: Record<EnemyId, EnemySpriteKit> = {
  'cave-brute': kit('cave-brute', { cellWidth:543,cellHeight:724,attackKind:'melee',profile:'heavy',scaleDesktop:1.48,scaleMobile:1.32,koScaleDesktop:1.36,koScaleMobile:1.22,koOffsetY:0,
    footReference:676,feet:feet.brute,combatTextLift:{desktop:222,mobile:150},stopGap:24,contactAdvance:40,attackMs:690,runAtMs:0,anticipationAtMs:235,poseAtMs:345,fxAtMs:520,fxMs:230,returnMs:290 }),
  'tribal-warrior': kit('tribal-warrior', tribal),
  'tribal-hunter': kit('tribal-hunter', tribal),
  raptor: kit('raptor', { cellWidth:543,cellHeight:724,attackKind:'melee',profile:'fast',scaleDesktop:.92,scaleMobile:1.04,koScaleDesktop:.92,koScaleMobile:1.04,koOffsetY:0,
    footReference:678,feet:feet.raptor,combatTextLift:{desktop:153,mobile:105},stopGap:18,attackMs:425,runAtMs:0,anticipationAtMs:95,poseAtMs:160,fxAtMs:305,fxMs:170,returnMs:165 }),
  shaman: kit('shaman', { cellWidth:543,cellHeight:724,attackKind:'ranged',profile:'caster',scaleDesktop:1.2,scaleMobile:1.12,koScaleDesktop:1.2,koScaleMobile:1.12,koOffsetY:0,
    footReference:697,feet:feet.shaman,combatTextLift:{desktop:191,mobile:128},stopGap:0,attackMs:590,runAtMs:0,anticipationAtMs:0,poseAtMs:155,fxAtMs:375,fxMs:215,returnMs:150,
    projectile:{originX:.30,originY:.56,visualAnchorX:.29,visualAnchorY:.55,targetY:.55,width:118,mobileWidth:86} }),
  smilodon: kit('smilodon', { cellWidth:627,cellHeight:627,attackKind:'melee',profile:'predator',scaleDesktop:1.31,scaleMobile:1.31,koScaleDesktop:1.31,koScaleMobile:1.31,koOffsetY:0,
    footReference:560,feet:feet.smilodon,combatTextLift:{desktop:172,mobile:114},stopGap:25,contactAdvance:60,attackMs:475,runAtMs:0,anticipationAtMs:100,poseAtMs:180,fxAtMs:340,fxMs:190,returnMs:190 }),
  mammoth: kit('mammoth', { cellWidth:543,cellHeight:724,attackKind:'melee',profile:'boss',scaleDesktop:1.12,scaleMobile:.96,koScaleDesktop:1.05,koScaleMobile:.92,koOffsetY:0,
    footReference:650,feet:feet.mammoth,combatTextLift:{desktop:305,mobile:210},stopGap:74,contactAdvance:90,attackMs:760,runAtMs:0,anticipationAtMs:230,poseAtMs:355,fxAtMs:590,fxMs:250,returnMs:340 }),
}

export function enemySpriteKit(id: EnemyId): EnemySpriteKit | undefined { return enemySpriteKits[id] }
export function enemyVisualPose(state: SpriteState | 'run' | 'block'): EnemyVisualPose {
  if (state === 'hurt') return 'hit'
  if (state === 'victory') return 'idle'
  return state
}
export function enemyContactDistance(kit: EnemySpriteKit, playerCenter: number, enemyCenter: number, playerWidth: number, enemyWidth: number, mobile: boolean): number {
  if (kit.attackKind === 'ranged') return 0
  const separation = enemyCenter - playerCenter
  const responsiveReach = mobile ? .55 : 1
  return Math.max(0, separation - (playerWidth + enemyWidth) / 2 - kit.stopGap * responsiveReach + (kit.contactAdvance ?? 0) * responsiveReach)
}

export function enemyPaintedBattleSize(kit: EnemySpriteKit, fighterHeight: number, mobile: boolean, pose: EnemySheet = 'attack') {
  const scale = (mobile ? kit.scaleMobile : kit.scaleDesktop) * enemyCombatFactor(kit.id, mobile)
  const [width, height] = kit.paintedSize[pose]
  const cellHeight = kit.geometry[pose][1]
  return { width: fighterHeight * scale * width / cellHeight, height: fighterHeight * scale * height / cellHeight }
}

/** Position the projectile's painted skull at the staff tip, then fly it to the target chest. */
export function enemyProjectileGeometry(kit: EnemySpriteKit, bounds: WarriorBattleMeasurements, mobile: boolean, warriorId: string, warriorScale: number) {
  const projectile = kit.projectile
  if (!projectile) return null
  const enemyScale = (mobile ? kit.scaleMobile : kit.scaleDesktop) * enemyCombatFactor(kit.id, mobile)
  const [cellWidth, cellHeight] = kit.geometry.attack
  const renderedHeight = bounds.enemyHeight * enemyScale
  const renderedWidth = renderedHeight * cellWidth / cellHeight
  const startX = bounds.enemyCenterX + (projectile.originX - .5) * renderedWidth
  const startBottom = bounds.groundFromBottom + projectile.originY * renderedHeight
  const width = mobile ? projectile.mobileWidth : projectile.width
  const [fxWidth, fxHeight] = kit.geometry['attack-fx']
  const height = width * fxHeight / fxWidth
  const targetBottom = bounds.groundFromBottom + projectile.targetY * bounds.playerHeight * warriorScale * warriorCombatFactor(warriorId, mobile)
  return {
    left: startX - width * projectile.visualAnchorX,
    bottom: startBottom - height * (1 - projectile.visualAnchorY),
    travelX: bounds.playerCenterX - startX,
    travelY: startBottom - targetBottom,
    width,
  }
}

export async function preloadEnemySpriteKit(id: EnemyId): Promise<boolean> {
  const selected = enemySpriteKit(id)
  if (!selected || typeof Image === 'undefined') return false
  const sources = Object.values(selected.sheets)
  return (await Promise.all(sources.map((src) => new Promise<boolean>((resolve) => {
    const image = new Image()
    let complete = false
    const settle = (ok: boolean) => { if (!complete) { complete = true; clearTimeout(timer); resolve(ok) } }
    const timer = window.setTimeout(() => { image.src = ''; settle(false) }, 8000)
    image.onload = () => {
      if (typeof image.decode === 'function') image.decode().then(() => settle(true), () => settle(false))
      else settle(true)
    }
    image.onerror = () => settle(false)
    image.src = src
  })))).every(Boolean)
}
