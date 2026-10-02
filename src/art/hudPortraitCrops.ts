import type { EnemyId } from './assetsV04'

/** Percentages are relative to the circular portrait, so the same hero crop works at every HUD size. */
export type HudPortraitCrop = {
  zoom: number
  x: string
  y: string
  offsetX: string
  offsetY: string
}

const crop = (zoom: number, x: number, y: number, offsetX = 0, offsetY = 0): HudPortraitCrop => ({
  zoom, x: `${x}%`, y: `${y}%`, offsetX: `${offsetX}%`, offsetY: `${offsetY}%`,
})

/** Full-height painted illustrations: focus on the head and upper shoulders, not the legs. */
export const warriorHudPortraitCrops = {
  karg: crop(3.3, 56, 4),
  naya: crop(3.3, 57, 7),
  brakk: crop(3.2, 57, 2),
  eyla: crop(3.2, 50, 10),
  asha: crop(3.2, 56, 4),
  rhex: crop(3.2, 57, 5),
  ursak: crop(2.8, 70, 4),
  saar: crop(2.45, 83, 28),
  morga: crop(2.35, 59, 15),
  vorka: crop(3, 52, 5),
  urgath: crop(3, 56, 0),
  tyrak: crop(1.75, 96, 0),
} satisfies Record<string, HudPortraitCrop>

/** Transparent enemy idles: each species has a different silhouette and head position. */
export const enemyHudPortraitCrops = {
  'tribal-hunter': crop(2.05, 55, 22),
  'tribal-warrior': crop(2.05, 57, 22),
  'cave-brute': crop(2, 82, 25),
  shaman: crop(2.05, 50, 25),
  raptor: crop(1.8, 100, 18, -7),
  smilodon: crop(1.65, 100, 42, -18),
  mammoth: crop(1.75, 98, 18, -2),
} satisfies Record<EnemyId, HudPortraitCrop>

const fallback = crop(1.7, 50, 20)

export function hudPortraitCrop(side: 'player' | 'enemy', id?: string): HudPortraitCrop {
  if (side === 'enemy') return enemyHudPortraitCrops[id as EnemyId] ?? warriorHudPortraitCrops[id as keyof typeof warriorHudPortraitCrops] ?? fallback
  return warriorHudPortraitCrops[id as keyof typeof warriorHudPortraitCrops] ?? fallback
}
