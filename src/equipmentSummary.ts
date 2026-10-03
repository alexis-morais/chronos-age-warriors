import { equipmentStats } from './game'
import type { EquipmentDefinition, StatKey } from './types'

const statNames: Record<StatKey, string> = { strength: 'Force', dodge: 'Esquive', speed: 'Vitesse', hp: 'PV' }

export const shortEquipmentEffect = (effect: string) => effect
  .replace(/(\d+) % de chance de réduire une attaque de (\d+) %/, '$1 % : −$2 % dégâts')
  .replace(/(\d+) % de chance d’un second coup à (\d+) %/, '$1 % : second coup à $2 %')
  .replace(/(\d+) % de chance d’ignorer la protection/, '$1 % : ignore protection')
  .replace(/(\d+) % de chance de /, '$1 % : ')
  .replace('Première attaque reçue', '1re attaque reçue')
  .replace('Première attaque', '1re attaque')
  .replace('Les 3 premières attaques reçues font', '3 attaques :')
  .replace('Réduit légèrement l’Esquive adverse', 'Esquive adverse réduite')

export const shortEquipmentSummary = (item: EquipmentDefinition) => [
  ...Object.entries(equipmentStats(item.id)).map(([key, value]) => `+${value} ${statNames[key as StatKey]}`),
  shortEquipmentEffect(item.effect),
].join(' · ')
