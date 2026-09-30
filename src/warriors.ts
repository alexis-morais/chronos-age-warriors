import type { SaveData, Stats, WarriorDefinition } from './types'

/** TEMPORARY DEV PLACEHOLDER. Not a collectible roster entry or final character art. */
export const DEV_WARRIOR_ID = 'dev-primordial-warrior'
export const DEV_WARRIOR: WarriorDefinition = {
  id: DEV_WARRIOR_ID,
  name: 'Warrior de développement',
  era: 'Primordiale',
  rarity: 'Commun',
  baseStats: { strength: 6, dodge: 6, speed: 6, hp: 120 },
  art: null,
}

export const warriorDefinitions: Record<string, WarriorDefinition> = { [DEV_WARRIOR_ID]: DEV_WARRIOR }

export function activeWarrior(save: SaveData) {
  const owned = save.ownedWarriors[save.activeWarriorId]
  const definition = warriorDefinitions[save.activeWarriorId]
  if (!owned || !definition || owned.warriorId !== definition.id) throw new Error('Active Warrior definition or ownership is missing')
  const stats = (Object.keys(definition.baseStats) as (keyof Stats)[]).reduce((result, key) => {
    result[key] = definition.baseStats[key] + owned.bonusStats[key]
    return result
  }, {} as Stats)
  return { ...definition, level: owned.level, xp: owned.xp, stats, skills: save.unlockedSkills }
}
