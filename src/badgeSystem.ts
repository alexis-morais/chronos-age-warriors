import type { SaveData } from './types'
import { rarityOrder } from './config'
import { primalWarriors, warriorDefinitions } from './warriors'
import { eligibleGlobalWins } from './victories'
import { MAX_WARRIOR_LEVEL } from './warriorProgression'

export type BadgeGrade = 'bronze' | 'silver' | 'gold' | 'platinum'
export interface BadgeProgress { current: number; target: number }
export interface BadgeDefinition {
  id: string
  title: string
  description: string
  grade: BadgeGrade
  progress: (save: SaveData) => BadgeProgress
  binary?: boolean
}
export type EraBadgeDefinition = BadgeDefinition

export const gradeRewards: Record<BadgeGrade, number> = { bronze: 50, silver: 100, gold: 200, platinum: 500 }
export const PRIMAL_MASTERY_REWARD = 1500

// Frozen to the first era: later equipment catalogs must not move Primal goals.
export const primalEquipmentIds = [
  'flint-club', 'bone-spear', 'obsidian-axe', 'hunter-bow', 'smilodon-fangs',
  'mammoth-spear', 'volcanic-hammer', 'tyrant-claw', 'titan-heart',
  'hunter-hides', 'bone-harness', 'mammoth-plate', 'volcanic-shell',
  'white-titan-fur', 'primordial-titan-skin',
  'storm-javelin', 'reed-mantle', 'raptor-scales', 'smilodon-cloak', 'ancestor-guard',
] as const

const count = (current: number, target: number): BadgeProgress => ({ current: Math.min(Math.max(Number.isFinite(current) ? current : 0, 0), target), target })
const completedPrimalLevels = (save: SaveData) => new Set(save.defeatedNodes.filter((node) => Number.isInteger(node) && node >= 1 && node <= 20))
const primalWarriorCount = (save: SaveData) => primalWarriors.filter(({ id }) => Boolean(save.ownedWarriors[id])).length
const ownedWarriors = (save: SaveData) => Object.keys(save.ownedWarriors).filter((id) => warriorDefinitions[id] && save.ownedWarriors[id]?.warriorId === id)
const warriorCount = (save: SaveData) => ownedWarriors(save).length
const ownsRarity = (save: SaveData, rarity: 'Rare' | 'Légendaire' | 'Mythique', orHigher = false) => ownedWarriors(save).some((id) => {
  const ownedRarity = warriorDefinitions[id].rarity
  return orHigher ? rarityOrder.indexOf(ownedRarity) >= rarityOrder.indexOf(rarity) : ownedRarity === rarity
})
const primalEquipmentCount = (save: SaveData) => primalEquipmentIds.filter((id) => (save.owned[id]?.quantity ?? 0) > 0).length
const hasLegacyBadge = (save: SaveData, id: string) => save.badges.some((badge) => badge.id === id)

/** Completion is persisted by campaign settlement (including migrated completed saves). */
export function hasCompletedPrimalNemesis(save: SaveData): boolean {
  return save.nemesisCompleted || save.nemesisDefeatedNodes.includes(20)
}

export const primalBadges: readonly EraBadgeDefinition[] = [
  { id: 'primal-first-level', title: 'Premiers pas dans le Primal', description: 'Terminez le premier niveau de l’Ère Primordiale.', grade: 'bronze', binary: true, progress: (save) => count(Number(completedPrimalLevels(save).has(1)), 1) },
  { id: 'primal-three-warriors', title: 'Tribu naissante', description: 'Obtenez 3 Warriors de l’Ère Primordiale.', grade: 'bronze', progress: (save) => count(primalWarriorCount(save), 3) },
  { id: 'primal-three-equipment', title: 'Équipement de survie', description: 'Obtenez 3 équipements primordiaux différents.', grade: 'bronze', progress: (save) => count(primalEquipmentCount(save), 3) },
  { id: 'primal-ten-levels', title: 'Au cœur de la jungle', description: 'Terminez 10 niveaux de l’Ère Primordiale.', grade: 'silver', progress: (save) => count(completedPrimalLevels(save).size, 10) },
  { id: 'primal-first-elite', title: 'Briseur d’Élite', description: 'Vainquez votre premier Élite Primal.', grade: 'silver', binary: true, progress: (save) => count(Number([5, 10, 15].some((node) => completedPrimalLevels(save).has(node)) || hasLegacyBadge(save, 'first-elite')), 1) },
  { id: 'primal-six-warriors', title: 'Meute primordiale', description: 'Obtenez 6 Warriors de l’Ère Primordiale.', grade: 'silver', progress: (save) => count(primalWarriorCount(save), 6) },
  { id: 'primal-eight-equipment', title: 'Arsenal de chasse', description: 'Obtenez 8 équipements primordiaux différents.', grade: 'silver', progress: (save) => count(primalEquipmentCount(save), 8) },
  { id: 'primal-conqueror', title: 'Conquérant primordial', description: 'Vainquez le Boss final de l’Aventure Primal.', grade: 'gold', binary: true, progress: (save) => count(Number(completedPrimalLevels(save).has(20) || hasLegacyBadge(save, 'boss')), 1) },
  { id: 'primal-all-warriors', title: 'Panthéon primordial', description: 'Obtenez les 12 Warriors primordiaux.', grade: 'gold', progress: (save) => count(primalWarriorCount(save), primalWarriors.length) },
  { id: 'primal-all-equipment', title: 'Arsenal primordial', description: 'Obtenez les 20 équipements primordiaux.', grade: 'gold', progress: (save) => count(primalEquipmentCount(save), primalEquipmentIds.length) },
  { id: 'primal-tyrak', title: 'Roi parmi les rois', description: 'Obtenez Tyrak, Roi Primordial.', grade: 'platinum', binary: true, progress: (save) => count(Number(Boolean(save.ownedWarriors.tyrak)), 1) },
  { id: 'primal-nemesis', title: 'Dominateur du Primal', description: 'Terminez l’Ère Primordiale en Némésis.', grade: 'platinum', binary: true, progress: (save) => count(Number(hasCompletedPrimalNemesis(save)), 1) },
]

export function levelTenWarriorCount(save: SaveData): number {
  return ownedWarriors(save).filter((id) => save.ownedWarriors[id].level >= MAX_WARRIOR_LEVEL).length
}

export const exploits: readonly BadgeDefinition[] = [
  { id: 'exploit-first-impact', title: 'Premier Impact', description: 'Remportez votre premier combat.', grade: 'bronze', binary: true, progress: (save) => count(eligibleGlobalWins(save), 1) },
  { id: 'exploit-first-reinforcements', title: 'Premiers renforts', description: 'Rassemblez 5 Warriors différents.', grade: 'bronze', progress: (save) => count(warriorCount(save), 5) },
  { id: 'exploit-rare-spark', title: 'Éclat rare', description: 'Obtenez votre premier Warrior Rare ou supérieur.', grade: 'bronze', binary: true, progress: (save) => count(Number(ownsRarity(save, 'Rare', true)), 1) },
  { id: 'exploit-first-duel', title: 'Premier duel', description: 'Remportez votre premier Duel.', grade: 'bronze', binary: true, progress: (save) => count(save.duelWins, 1) },
  { id: 'exploit-seasoned-fighter', title: 'Combattant aguerri', description: 'Remportez 25 combats.', grade: 'silver', progress: (save) => count(eligibleGlobalWins(save), 25) },
  { id: 'exploit-chronos-collector', title: 'Collectionneur de Chronos', description: 'Rassemblez 10 Warriors différents.', grade: 'silver', progress: (save) => count(warriorCount(save), 10) },
  { id: 'exploit-ascension', title: 'Ascension', description: 'Amenez un Warrior au niveau 10.', grade: 'silver', binary: true, progress: (save) => count(levelTenWarriorCount(save), 1) },
  { id: 'exploit-war-machine', title: 'Machine de guerre', description: 'Remportez 100 combats.', grade: 'gold', progress: (save) => count(eligibleGlobalWins(save), 100) },
  { id: 'exploit-awakened-legend', title: 'Légende éveillée', description: 'Obtenez votre premier Warrior Légendaire.', grade: 'gold', binary: true, progress: (save) => count(Number(ownsRarity(save, 'Légendaire')), 1) },
  { id: 'exploit-elite-squad', title: 'Escouade d’élite', description: 'Amenez 6 Warriors au niveau 10.', grade: 'gold', binary: true, progress: (save) => count(levelTenWarriorCount(save), 6) },
  { id: 'exploit-feared-rival', title: 'Rival redouté', description: 'Remportez 25 Duels.', grade: 'gold', progress: (save) => count(save.duelWins, 25) },
  { id: 'exploit-mythic-fracture', title: 'Fracture mythique', description: 'Obtenez votre premier Warrior Mythique.', grade: 'platinum', binary: true, progress: (save) => count(Number(ownsRarity(save, 'Mythique')), 1) },
]

export const PRIMAL_MASTERY_ID = 'primal-mastery'
export const hasBadgeReward = (save: SaveData, id: string) => save.badges.some((badge) => badge.id === id)
export const unlockedPrimalBadgeCount = (save: SaveData) => primalBadges.filter(({ id }) => hasBadgeReward(save, id)).length
export const unlockedExploitCount = (save: SaveData) => exploits.filter(({ id }) => hasBadgeReward(save, id)).length
export const primalMasteryReady = (save: SaveData) => primalBadges.every(({ id }) => hasBadgeReward(save, id))

/** Unlock and credit in one immutable save transition; badge ids are payment receipts. */
export function grantEarnedBadges(save: SaveData, unlockedAt = new Date().toISOString()): { save: SaveData; granted: { id: string; title: string; coins: number }[] } {
  const newlyEarned = [...primalBadges, ...exploits].filter((badge) => {
    if (hasBadgeReward(save, badge.id)) return false
    const { current, target } = badge.progress(save)
    return current >= target
  })
  const legacyPanthéon = hasBadgeReward(save, 'primal-all-warriors') && !hasBadgeReward(save, 'primal-warriors-v015-reward')
  if (!newlyEarned.length && !legacyPanthéon && (hasBadgeReward(save, PRIMAL_MASTERY_ID) || !primalMasteryReady(save))) return { save, granted: [] }
  const next = structuredClone(save)
  const granted = newlyEarned.map((badge) => {
    const coins = badge.id === 'primal-all-warriors' ? PRIMAL_MASTERY_REWARD : gradeRewards[badge.grade]
    next.badges.push({ id: badge.id, unlockedAt })
    next.coins += coins
    return { id: badge.id, title: badge.title, coins }
  })
  // Old Panthéon receipts paid 200. A separate receipt grants just the missing 1300 once.
  if (hasBadgeReward(save, 'primal-all-warriors') && !hasBadgeReward(next, 'primal-warriors-v015-reward')) {
    next.badges.push({ id: 'primal-warriors-v015-reward', unlockedAt })
    next.coins += PRIMAL_MASTERY_REWARD - gradeRewards.gold
    granted.push({ id: 'primal-warriors-v015-reward', title: 'Panthéon primordial · complément V0.15', coins: PRIMAL_MASTERY_REWARD - gradeRewards.gold })
  } else if (newlyEarned.some(({ id }) => id === 'primal-all-warriors')) {
    next.badges.push({ id: 'primal-warriors-v015-reward', unlockedAt })
  }
  if (primalMasteryReady(next) && !hasBadgeReward(next, PRIMAL_MASTERY_ID)) {
    next.badges.push({ id: PRIMAL_MASTERY_ID, unlockedAt })
    next.coins += PRIMAL_MASTERY_REWARD
    granted.push({ id: PRIMAL_MASTERY_ID, title: 'Maîtrise Primordiale', coins: PRIMAL_MASTERY_REWARD })
  }
  return { save: next, granted }
}
