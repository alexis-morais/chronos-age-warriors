import { enemySprite, equipmentAsset, resolveEnemyId, weaponMotion, type EnemyId, type SpriteState, type WeaponMotion } from './assetsV04'

export const V06_ROOT = '/assets-v06'

export const playerWeapons = ['massue-silex', 'lance-os', 'hache-obsidienne', 'arc-chasseur', 'crocs-smilodon', 'lance-mammouth', 'marteau-volcanique', 'griffe-tyran', 'coeur-titan'] as const
export const playerPoses = ['idle', 'anticipation', 'attack', 'dodge', 'hurt', 'ko'] as const
export type PlayerWeapon = typeof playerWeapons[number]
export type PlayerPose = typeof playerPoses[number]
export type PlayerState = PlayerPose | 'block' | 'recovery' | 'victory'
export type PlayerSex = 'male' | 'female'

const weaponAliases: Record<string, PlayerWeapon> = {
  'flint-club': 'massue-silex', 'bone-spear': 'lance-os', 'obsidian-axe': 'hache-obsidienne',
  'hunter-bow': 'arc-chasseur', 'smilodon-fangs': 'crocs-smilodon', 'mammoth-spear': 'lance-mammouth',
  'volcanic-hammer': 'marteau-volcanique', 'tyrant-claw': 'griffe-tyran', 'titan-heart': 'coeur-titan',
}

export const assetsV06 = {
  brand: { logo: `${V06_ROOT}/branding/logo.png` },
  arena: {
    background: `${V06_ROOT}/arena/primordial/background-full.png`, ground: `${V06_ROOT}/arena/primordial/ground.png`,
    foreground: `${V06_ROOT}/arena/primordial/foreground.png`, contactShadow: `${V06_ROOT}/arena/primordial/contact-shadow.png`,
    bossShadow: `${V06_ROOT}/arena/primordial/contact-shadow-boss.png`,
  },
  chest: { closed: `${V06_ROOT}/chest/closed.png`, open: `${V06_ROOT}/chest/open.png`, glow: `${V06_ROOT}/chest/open-glow.png` },
  effects: {
    impactStar: `${V06_ROOT}/combat-effects/impact-star.png`, impactGround: `${V06_ROOT}/combat-effects/impact-ground.png`,
    criticalStars: `${V06_ROOT}/combat-effects/critical-stars.png`, dodgeTrail: `${V06_ROOT}/combat-effects/dodge-trail.png`,
    projectileArrow: `${V06_ROOT}/combat-effects/projectile-arrow.png`,
  },
  icons: {
    navigation: Object.fromEntries(['hub','collection','training','chest','duel','pv','xp','badge','coins','force','dodge','speed','shield','equipment','adventure'].map((name) => [name, `${V06_ROOT}/icons/navigation/${name}.png`])) as Record<string, string>,
    stats: Object.fromEntries(['pv','xp','badge','coins','force','dodge','speed'].map((name) => [name, `${V06_ROOT}/icons/stats/${name}.png`])) as Record<string, string>,
    system: Object.fromEntries(['lock','settings','info','confirm'].map((name) => [name, `${V06_ROOT}/icons/system/${name}.png`])) as Record<string, string>,
  },
} as const

export function resolvePlayerWeapon(weapon?: string): PlayerWeapon {
  if (weapon && playerWeapons.includes(weapon as PlayerWeapon)) return weapon as PlayerWeapon
  return weaponAliases[weapon ?? ''] ?? 'massue-silex'
}

export function playerSprite(sex: PlayerSex, weapon: string | undefined, state: PlayerState = 'idle') {
  const pose: PlayerPose = state === 'recovery' || state === 'victory' ? 'idle' : state === 'block' ? 'dodge' : state
  return `${V06_ROOT}/derived/player/${sex}/${resolvePlayerWeapon(weapon)}/${pose}.png`
}

export function gameIcon(group: keyof typeof assetsV06.icons, name: string) { return assetsV06.icons[group][name] }
export { enemySprite, equipmentAsset, resolveEnemyId, weaponMotion }
export type { EnemyId, SpriteState, WeaponMotion }

export const preloadBattleAssetsV06 = (sex: PlayerSex, weapon: string, enemy: EnemyId, includeLegacyPlayer = true, includeLegacyEnemy = true) => {
  const sources = [
    ...Object.values(assetsV06.arena), ...Object.values(assetsV06.effects),
    ...(includeLegacyPlayer ? playerPoses.map((state) => playerSprite(sex, weapon, state)) : []),
    ...(includeLegacyEnemy ? (['idle', 'anticipation', 'attack', 'dodge', 'hurt', 'ko'] as SpriteState[]).map((state) => enemySprite(enemy, state)) : []),
  ]
  return Promise.all(sources.map((src) => new Promise<void>((resolve) => { const image = new Image(); image.onload = image.onerror = () => resolve(); image.src = src })))
}

export const v04RuntimeFallbacks = ['equipment illustrations', 'enemy sprites'] as const

export const playerCanvas = { width: 768, height: 512, anchorX: 384, groundY: 462, bodyHeight: 126 } as const
