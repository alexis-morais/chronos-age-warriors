export type StatKey = 'strength' | 'dodge' | 'speed' | 'hp'
export type Rarity = 'Commun' | 'Peu commun' | 'Rare' | 'Épique' | 'Légendaire' | 'Mythique'
export type EquipmentType = 'weapon' | 'armor'
export type BattleSpeed = 1 | 2 | 3
export type View = 'hub' | 'collection' | 'activities' | 'chest' | 'duel' | 'adventure' | 'battle'
export interface Stats { strength: number; dodge: number; speed: number; hp: number }

export type WarriorClass = 'Ravageur' | 'Tempête' | 'Bastion' | 'Spectre' | 'Héraut' | 'Fléau'
export interface WarriorPassive { name: string; description: string }
export interface WarriorDefinition { id: string; name: string; title: string; era: string; rarity: Rarity; warriorClass: WarriorClass; passive?: WarriorPassive; baseStats: Stats; art: string; artPosition: string }
export interface OwnedWarrior { warriorId: string; level: number; xp: number; /** Read only while migrating pre-V1 saves. */ bonusStats?: Stats }

export interface EquipmentDefinition {
  id: string
  name: string
  type: EquipmentType
  rarity: Rarity
  bonus: string
  effect: string
  art: string
  stats: Partial<Stats>
}

/** Quantity includes the equipped copy. Legacy progression fields remain for old saves. */
export interface OwnedEquipment { quantity?: number; level: number; xp: number; kills: number }
export interface WarriorLoadout { weapon: string; armor: string }

export interface BadgeState { id: string; unlockedAt?: string }

export type RiftRunStatus = 'ready' | 'fighting' | 'between' | 'lost' | 'quit' | 'complete'
export interface RiftRun {
  dateKey: string
  status: RiftRunStatus
  warriorId: string
  stage: number
  lineup: string[]
  seed: number
  difficulty: number
  earnedCoins: number
  earnedXp: number
}

export interface ExpeditionState { warriorId: string; startedAt: number }
export interface ExpeditionReturn {
  id: string
  warriorId: string
  elapsedMs: number
  xp: number
  coins: number
  equipmentIds: string[]
  equipmentChest: boolean
  warriorChest: boolean
  levelsGained: number
}

export interface SaveData {
  version: number
  activeWarriorId: string
  welcomeChestOpened: boolean
  ownedWarriors: Record<string, OwnedWarrior>
  unlockedSkills: string[]
  coins: number
  owned: Record<string, OwnedEquipment>
  equippedWeapon: string
  equippedArmor: string
  loadouts: Record<string, WarriorLoadout>
  campaignNode: number
  defeatedNodes: number[]
  nemesisUnlocked: boolean
  nemesisCampaignNode: number
  nemesisDefeatedNodes: number[]
  nemesisCompleted: boolean
  normalBossFirstClearRewardClaimed: boolean
  nemesisBossFirstClearRewardClaimed: boolean
  campaignRemaining: number
  campaignRechargeAt: number | null
  totalWins: number
  adventureWins: number
  riftWins: number
  duelWins: number
  chests: number
  riftChestCount: number
  riftLossStreak: number
  riftRun: RiftRun | null
  expedition: ExpeditionState | null
  expeditionReturn: ExpeditionReturn | null
  equipmentChestCount: number
  warriorChestCount: number
  pendingWarriorRecycles?: { id: string; warriorId: string }[]
  speed: BattleSpeed
  badges: BadgeState[]
  /** Read only while migrating pre-V1 saves. */ pendingLevelChoice?: boolean
  lastReset: string
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
  /** Player-only, derived passive kit. Enemies never receive this identity. */
  warriorId?: string
  level?: number
  weapon?: string
  armor?: string
}

export interface BattleResult {
  winner: 'player' | 'enemy'
  events: BattleEvent[]
  enemy: Fighter
  consecutiveMax: number
}
