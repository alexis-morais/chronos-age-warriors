/** Arena-only presentation multipliers. Hub, map, previews and HUD are unchanged. */
const warriorDesktop: Record<string, number> = {
  morga: 1.5,
  urgath: 1.35,
  tyrak: 1.33,
}

const warriorMobile: Record<string, number> = {
  urgath: 1.08,
  tyrak: 1.04,
}

const enemyDesktop: Record<string, number> = {
  'cave-brute': 1.9,
  'tribal-warrior': 1.78,
  'tribal-hunter': 1.78,
  raptor: 2,
  shaman: 1.78,
  smilodon: 2,
  mammoth: 1.85,
}

const enemyMobile: Record<string, number> = {
  mammoth: 1.04,
}

export const warriorCombatFactor = (id: string, mobile: boolean) => mobile ? warriorMobile[id] ?? 1.1 : warriorDesktop[id] ?? 1.78
export const enemyCombatFactor = (id: string, mobile: boolean) => mobile ? enemyMobile[id] ?? 1.1 : enemyDesktop[id] ?? 1.78
