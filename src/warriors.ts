import type { SaveData, Stats, WarriorDefinition } from './types'
import { getWarriorLevelStats } from './warriorProgression'

export const KARG_ID = 'karg'
export const KARG: WarriorDefinition = {
  id: KARG_ID,
  name: 'Karg',
  title: 'Premier Chasseur',
  era: 'Primordiale',
  rarity: 'Commun',
  warriorClass: 'Ravageur',
  passive: { name: 'Furie', description: '+5 % dégâts par attaque réussie, max ×3. Raté = reset.' },
  baseStats: { strength: 11, dodge: 8, speed: 10, hp: 110 },
  art: '/assets/warriors/primal/karg.png',
  artPosition: '50% 8%',
}

const primalWarrior = (id: string, name: string, title: string, rarity: WarriorDefinition['rarity'], warriorClass: WarriorDefinition['warriorClass'], baseStats: Stats, artPosition: string): WarriorDefinition => ({
  id, name, title, era: 'Primordiale', rarity, warriorClass, baseStats, art: `/assets/warriors/primal/${id}.png`, artPosition,
})

export const primalWarriors: WarriorDefinition[] = [
  KARG,
  primalWarrior('naya', 'Naya', 'Ombre des Falaises', 'Commun', 'Spectre', { strength: 8, dodge: 13, speed: 14, hp: 90 }, '50% 8%'),
  primalWarrior('brakk', 'Brakk', 'Brise-Roc', 'Commun', 'Bastion', { strength: 12, dodge: 6, speed: 7, hp: 145 }, '50% 7%'),
  primalWarrior('eyla', 'Eyla', 'Œil de Silex', 'Commun', 'Tempête', { strength: 10, dodge: 10, speed: 12, hp: 100 }, '50% 9%'),
  primalWarrior('asha', 'Asha', 'Voix des Braises', 'Peu commun', 'Fléau', { strength: 11, dodge: 10, speed: 11, hp: 120 }, '50% 8%'),
  primalWarrior('rhex', 'Rhex', 'Meneur de Raptors', 'Peu commun', 'Héraut', { strength: 11, dodge: 11, speed: 13, hp: 115 }, '50% 10%'),
  primalWarrior('ursak', 'Ursak', 'Roi des Cavernes', 'Peu commun', 'Ravageur', { strength: 14, dodge: 7, speed: 9, hp: 150 }, '50% 5%'),
  primalWarrior('saar', 'Saar', 'Croc du Smilodon', 'Rare', 'Spectre', { strength: 15, dodge: 16, speed: 16, hp: 135 }, '50% 15%'),
  primalWarrior('morga', 'Morga', 'Matriarche d’Ivoire', 'Rare', 'Bastion', { strength: 16, dodge: 5, speed: 7, hp: 195 }, '50% 9%'),
  primalWarrior('vorka', 'Vorka', 'Reine d’Obsidienne', 'Épique', 'Fléau', { strength: 18, dodge: 12, speed: 14, hp: 165 }, '50% 5%'),
  primalWarrior('urgath', 'Urgath', 'Titan des Glaces', 'Légendaire', 'Bastion', { strength: 21, dodge: 6, speed: 8, hp: 225 }, '50% 5%'),
  primalWarrior('tyrak', 'TYRAK', 'Roi Primordial', 'Mythique', 'Ravageur', { strength: 23, dodge: 8, speed: 12, hp: 245 }, '50% 0%'),
]

export const warriorDefinitions: Record<string, WarriorDefinition> = Object.fromEntries(primalWarriors.map((warrior) => [warrior.id, warrior]))

export function ownedWarrior(save: SaveData, warriorId: string) {
  const owned = save.ownedWarriors[warriorId]
  const definition = warriorDefinitions[warriorId]
  if (!owned || !definition || owned.warriorId !== definition.id) throw new Error('Warrior definition or ownership is missing')
  const stats = getWarriorLevelStats(warriorId, owned.level)
  return { ...definition, level: owned.level, xp: owned.xp, stats, skills: [] as string[] }
}

export function activeWarrior(save: SaveData) { return ownedWarrior(save, save.activeWarriorId) }
