export type StatKey = 'strength' | 'dodge' | 'speed' | 'hp'
export type Rarity = 'Commun' | 'Peu commun' | 'Rare' | 'Épique' | 'Légendaire' | 'Mythique'
export type EquipmentType = 'weapon' | 'armor'
export type BattleSpeed = 1 | 2 | 3
export type View = 'hub' | 'collection' | 'training' | 'chest' | 'duel' | 'adventure' | 'battle'

export interface Stats { strength: number; dodge: number; speed: number; hp: number }

export interface Appearance {
  gender: 'Homme' | 'Femme'
  skin: string
  hair: 'Crête' | 'Tresses' | 'Sauvage'
  hairColor: string
}

export interface EquipmentDefinition {
  id: string
  name: string
  type: EquipmentType
  rarity: Rarity
  bonus: string
  effect: string
  art: string
}

export interface OwnedEquipment { level: number; xp: number; kills: number }

export interface Warrior {
  name: string
  appearance: Appearance
  level: number
  xp: number
  stats: Stats
  skills: string[]
}

export interface BadgeState { id: string; unlockedAt?: string }

export interface SaveData {
  version: number
  created: boolean
  warrior: Warrior
  coins: number
  owned: Record<string, OwnedEquipment>
  equippedWeapon: string
  equippedArmor: string
  campaignNode: number
  defeatedNodes: number[]
  campaignRemaining: number
  trainingRemaining: number
  trainingWins: number
  totalWins: number
  chests: number
  speed: BattleSpeed
  badges: BadgeState[]
  pendingLevelChoice: boolean
  lastReset: string
  bossTrophyPending: boolean
  eraRewardClaimed: boolean
}

export type BattleEventType = 'attack' | 'dodge' | 'damage' | 'critical' | 'skill' | 'heal' | 'bleed' | 'ko'
export interface BattleEvent {
  type: BattleEventType
  actor: 'player' | 'enemy'
  target: 'player' | 'enemy'
  value?: number
  label?: string
  playerHp: number
  enemyHp: number
}

export interface Fighter {
  name: string
  stats: Stats
  skills: string[]
  weapon?: string
  armor?: string
}

export interface BattleResult {
  winner: 'player' | 'enemy'
  events: BattleEvent[]
  enemy: Fighter
  consecutiveMax: number
}
