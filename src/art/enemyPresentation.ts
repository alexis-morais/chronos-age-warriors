import type { EnemyId } from './assetsV04'

export interface EnemyPresentation {
  idleScale: number
  koScale: number
  koOffsetX: number
  koOffsetY: number
}

// Alpha bounds measured at A > 24. KO art is much wider/shorter than idle art:
// at equal CSS height a tribal-warrior KO would be ~2.4× its standing width.
// Each KO scale keeps the fallen body's visible length near 1.1× standing height.
export const enemyPresentation: Record<EnemyId, EnemyPresentation> = {
  'tribal-hunter': { idleScale: 1, koScale: 0.61, koOffsetX: 0, koOffsetY: -2 },
  'tribal-warrior': { idleScale: 1, koScale: 0.61, koOffsetX: 0, koOffsetY: -2 },
  'cave-brute': { idleScale: 1, koScale: 0.65, koOffsetX: 0, koOffsetY: -2 },
  shaman: { idleScale: 1, koScale: 0.53, koOffsetX: 0, koOffsetY: -2 },
  raptor: { idleScale: 1, koScale: 0.54, koOffsetX: 0, koOffsetY: -2 },
  smilodon: { idleScale: 1, koScale: 0.62, koOffsetX: 0, koOffsetY: -2 },
  mammoth: { idleScale: 1, koScale: 0.77, koOffsetX: 0, koOffsetY: -2 },
}
