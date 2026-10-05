import type { Rarity, Stats } from './types'

export const MAX_WARRIOR_LEVEL = 10
export const WARRIOR_XP_REQUIREMENTS = [120, 180, 300, 450, 650, 850, 1100, 1400, 1800] as const

// Phase 2 anchors: [Force, Esquive, Vitesse, PV]. Common curves remain unchanged.
// V0.15 rarity-first profiles derive visible canonical stats, never combat modifiers.
export const PHASE2_LEVEL_STATS: Readonly<Record<string, readonly (readonly [number, number, number, number])[]>> = {
  karg: [[11,8,10,110],[13,9,11,128],[15,10,13,146],[17,11,14,163],[19,12,15,181],[20,14,17,199],[29,15,18,306],[40,16,20,455],[54,17,22,626],[99,28,40,1139]],
  naya: [[8,13,14,90],[9,15,16,104],[11,16,18,119],[12,18,19,133],[14,19,21,148],[15,21,23,162],[21,22,25,235],[28,24,26,338],[37,25,28,455],[73,45,55,900]],
  brakk: [[12,6,7,145],[13,7,8,166],[15,8,9,186],[16,9,10,207],[17,10,11,227],[19,11,13,248],[27,12,14,356],[38,13,15,507],[51,14,17,680],[95,25,32,1260]],
  eyla: [[10,10,12,100],[11,11,14,115],[13,12,16,130],[14,14,17,145],[16,15,19,160],[17,16,21,175],[26,17,23,282],[38,19,25,432],[52,20,27,604],[94,35,50,1099]],
  asha: [[11,10,11,120],[13,11,13,140],[15,12,14,160],[17,14,16,180],[19,15,17,200],[20,16,19,220],[29,17,20,327],[40,19,22,477],[54,20,23,648],[99,30,43,1179]],
  rhex: [[11,11,13,115],[13,12,15,133],[15,14,17,152],[16,15,18,170],[18,16,20,188],[20,18,22,207],[29,19,24,312],[40,20,25,458],[54,22,27,626],[98,35,50,1139]],
  ursak: [[14,7,9,150],[16,8,10,174],[18,9,12,199],[20,10,13,223],[22,11,15,248],[24,13,16,272],[32,14,18,370],[42,15,19,507],[54,16,21,663],[98,26,38,1206]],
  saar: [[15,16,16,135],[17,18,18,154],[19,19,20,174],[21,21,22,193],[23,23,24,213],[25,24,26,232],[32,26,28,331],[42,28,30,468],[54,29,32,626],[99,44,54,1139]],
  morga: [[16,5,7,195],[18,6,8,220],[20,7,10,245],[22,8,11,270],[24,9,12,295],[26,11,14,320],[33,12,15,419],[43,13,16,557],[55,14,18,715],[100,24,33,1300]],
  vorka: [[18,12,14,165],[20,14,16,189],[22,15,18,213],[24,17,20,237],[26,19,22,261],[29,20,24,284],[36,22,26,380],[45,24,28,513],[56,25,30,666],[103,38,50,1233]],
  urgath: [[21,6,8,225],[23,7,9,252],[25,8,11,279],[28,10,12,307],[30,11,14,334],[32,12,15,361],[38,13,17,457],[46,15,18,591],[56,16,20,744],[102,26,35,1353]],
  tyrak: [[23,8,12,245],[25,9,13,273],[28,10,15,302],[30,11,16,330],[32,12,18,358],[35,14,19,387],[41,15,21,480],[49,16,22,610],[58,17,24,759],[106,28,42,1380]],
}

export const RARITY_STAT_PROFILES = {
  'Peu commun': { forceHpBudget: 1.02, growth: [0,.035,.075,.13,.21,.30,.43,.59,.77,1] },
  Rare: { forceHpBudget: 1.06, growth: [0,.065,.15,.30,.48,.59,.69,.79,.89,1] },
  'Épique': { forceHpBudget: 1.16, growth: [0,.10,.30,.60,.88,.904,.928,.952,.976,1] },
  Légendaire: { forceHpBudget: 1.24, growth: [0,.12,.33,.62,.88,.904,.928,.952,.976,1] },
  Mythique: { forceHpBudget: 1.30, growth: [0,.14,.36,.64,.86,.888,.916,.944,.972,1] },
} as const

// Kept here to avoid a progression ↔ roster import cycle. A contract test checks the roster.
export const WARRIOR_GROWTH_TIERS: Readonly<Record<string, Exclude<Rarity, 'Commun'>>> = {
  asha: 'Peu commun', rhex: 'Peu commun', ursak: 'Peu commun', saar: 'Rare', morga: 'Rare',
  vorka: 'Épique', urgath: 'Légendaire', tyrak: 'Mythique',
}

export function getWarriorLevelStats(warriorId: string, level: number): Stats {
  const table = PHASE2_LEVEL_STATS[warriorId]
  if (!table) throw new Error(`Unknown Warrior: ${warriorId}`)
  const clamped = Number.isFinite(level) ? Math.min(MAX_WARRIOR_LEVEL, Math.max(1, Math.trunc(level))) : 1
  const profile = RARITY_STAT_PROFILES[WARRIOR_GROWTH_TIERS[warriorId]]
  const tuple = profile ? table[0].map((start, stat) => {
    const end = Math.round(table[9][stat] * (stat === 0 || stat === 3 ? profile.forceHpBudget : 1))
    return Math.round(start + (end - start) * profile.growth[clamped - 1])
  }) : table[clamped - 1]
  const [strength, dodge, speed, hp] = tuple
  return { strength, dodge, speed, hp }
}

export function xpForLevel(level: number): number {
  if (!Number.isInteger(level) || level < 1 || level >= MAX_WARRIOR_LEVEL) return 0
  return WARRIOR_XP_REQUIREMENTS[level - 1]
}

export function getUnlockedPassiveSlots(level: number): readonly (1 | 2 | 3)[] {
  return level >= 10 ? [1, 2, 3] : level >= 7 ? [1, 2] : level >= 3 ? [1] : []
}
