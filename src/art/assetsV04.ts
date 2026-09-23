export const V04_ROOT = '/assets-v04'

export const weaponIds = ['flint-club', 'bone-spear', 'obsidian-axe', 'hunter-bow', 'smilodon-fangs', 'mammoth-spear', 'volcanic-hammer', 'tyrant-claw', 'titan-heart'] as const
export const armorIds = ['hunter-hides', 'bone-harness', 'mammoth-plate', 'volcanic-shell', 'white-titan-fur', 'primordial-titan-skin'] as const
export const spriteStates = ['idle', 'anticipation', 'attack', 'dodge', 'hurt', 'ko', 'victory'] as const
export const enemyIds = ['tribal-hunter', 'tribal-warrior', 'cave-brute', 'shaman', 'raptor', 'smilodon', 'mammoth'] as const

export type WeaponId = typeof weaponIds[number]
export type ArmorId = typeof armorIds[number]
export type SpriteState = typeof spriteStates[number]
export type EnemyId = typeof enemyIds[number]
export type SpriteSex = 'male' | 'female'

const weaponSet = new Set<string>(weaponIds)
const armorSet = new Set<string>(armorIds)
const enemySet = new Set<string>(enemyIds)

export const assetsV04 = {
  logo: `${V04_ROOT}/branding/logo.png`,
  hubReference: `${V04_ROOT}/reference/hub-reference.png`,
  customization: {
    male: `${V04_ROOT}/customization/male-customization.png`,
    female: `${V04_ROOT}/customization/female-customization.png`,
  },
  arena: {
    background: `${V04_ROOT}/arena/primordial-background.png`,
    ground: `${V04_ROOT}/arena/primordial-ground.png`,
    foreground: `${V04_ROOT}/arena/primordial-foreground.png`,
  },
  effects: {
    slash: `${V04_ROOT}/derived/effects/slash.png`,
    energy: `${V04_ROOT}/derived/effects/energy.png`,
    impact: `${V04_ROOT}/derived/effects/impact.png`,
    dust: `${V04_ROOT}/derived/effects/dust.png`,
    critical: `${V04_ROOT}/derived/effects/critical.png`,
    parry: `${V04_ROOT}/derived/effects/parry.png`,
    dodge: `${V04_ROOT}/derived/effects/dodge.png`,
    projectile: `${V04_ROOT}/derived/effects/projectile.png`,
  },
} as const

export function resolveWeaponId(value?: string): WeaponId {
  return weaponSet.has(value ?? '') ? value as WeaponId : 'flint-club'
}

export function resolveArmorId(value?: string): ArmorId {
  return armorSet.has(value ?? '') ? value as ArmorId : 'hunter-hides'
}

export function warriorSprite(sex: SpriteSex, weapon: string | undefined, state: SpriteState = 'idle') {
  const resolvedState = state === 'hurt' || state === 'victory' ? 'idle' : state
  return `${V04_ROOT}/derived/warriors/${sex}/${resolveWeaponId(weapon)}/${resolvedState}.png`
}

export function equipmentAsset(id: string, type: 'weapon' | 'armor') {
  const resolved = type === 'weapon' ? resolveWeaponId(id) : resolveArmorId(id)
  return `${V04_ROOT}/derived/equipment/${type === 'weapon' ? 'weapons' : 'armors'}/${resolved}.png`
}

export function resolveEnemyId(value?: string | number, boss = false): EnemyId {
  if (boss) return 'mammoth'
  if (typeof value === 'string' && enemySet.has(value)) return value as EnemyId
  const index = Math.abs(typeof value === 'number' ? value : 0) % (enemyIds.length - 1)
  return enemyIds[index]
}

export function enemySprite(enemy: string | number | undefined, state: SpriteState = 'idle', boss = false) {
  const id = resolveEnemyId(enemy, boss)
  const resolvedState = state === 'victory' ? 'idle' : state === 'hurt' ? 'hurt' : state
  return `${V04_ROOT}/derived/enemies/${id}/${resolvedState}.png`
}

export type WeaponMotion = 'heavy' | 'spear' | 'axe' | 'ranged' | 'claw' | 'arcane'
export function weaponMotion(weapon?: string): WeaponMotion {
  const id = resolveWeaponId(weapon)
  if (id === 'flint-club' || id === 'volcanic-hammer') return 'heavy'
  if (id === 'bone-spear' || id === 'mammoth-spear') return 'spear'
  if (id === 'obsidian-axe') return 'axe'
  if (id === 'hunter-bow') return 'ranged'
  if (id === 'titan-heart') return 'arcane'
  return 'claw'
}

export const preloadBattleAssets = (sex: SpriteSex, weapon: string, enemy: EnemyId) => {
  const sources: string[] = [assetsV04.arena.background, assetsV04.arena.ground, assetsV04.arena.foreground]
  for (const state of ['idle', 'anticipation', 'attack', 'dodge', 'ko'] as const) sources.push(warriorSprite(sex, weapon, state))
  for (const state of ['idle', 'anticipation', 'attack', 'dodge', 'hurt', 'ko'] as const) sources.push(enemySprite(enemy, state))
  return Promise.all(sources.map((src) => new Promise<void>((resolve) => { const image = new Image(); image.onload = image.onerror = () => resolve(); image.src = src })))
}
