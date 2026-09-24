import { enemySprite, equipmentAsset, resolveEnemyId, weaponMotion, type EnemyId, type SpriteState, type WeaponMotion } from './assetsV04'

export const V05_ROOT = '/assets-v05'

export const playerWeapons = ['massue-silex', 'lance-os', 'hache-obsidienne', 'arc-chasseur', 'crocs-smilodon', 'lance-mammouth', 'marteau-volcanique', 'griffe-tyran', 'coeur-titan'] as const
export const playerStates = ['idle', 'idle-to-anticipation', 'anticipation', 'anticipation-to-attack', 'attack', 'attack-to-recovery', 'hurt', 'dodge', 'ko'] as const
export type PlayerWeapon = typeof playerWeapons[number]
export type PlayerState = typeof playerStates[number] | 'victory'
export type PlayerSex = 'male' | 'female'

const weaponAliases: Record<string, PlayerWeapon> = {
  'flint-club': 'massue-silex', 'bone-spear': 'lance-os', 'obsidian-axe': 'hache-obsidienne',
  'hunter-bow': 'arc-chasseur', 'smilodon-fangs': 'crocs-smilodon', 'mammoth-spear': 'lance-mammouth',
  'volcanic-hammer': 'marteau-volcanique', 'tyrant-claw': 'griffe-tyran', 'titan-heart': 'coeur-titan',
}

export const assetsV05 = {
  hub: { male: `${V05_ROOT}/hub/hub-male.png`, female: `${V05_ROOT}/hub/hub-female.png` },
  customization: {
    male: `${V05_ROOT}/customization/male/customization-options.png`,
    female: `${V05_ROOT}/customization/female/customization-options.png`,
  },
  arena: {
    background: `${V05_ROOT}/arena/primordial/background-full.png`, ground: `${V05_ROOT}/arena/primordial/ground.png`,
    foreground: `${V05_ROOT}/arena/primordial/foreground.png`, contactShadow: `${V05_ROOT}/arena/primordial/contact-shadow.png`,
    bossShadow: `${V05_ROOT}/arena/primordial/contact-shadow-boss.png`,
  },
  chest: { closed: `${V05_ROOT}/chest/closed.png`, open: `${V05_ROOT}/chest/open.png`, glow: `${V05_ROOT}/chest/open-glow.png` },
  effects: {
    slashLight: `${V05_ROOT}/combat-effects/slash-light.png`, projectileHeavy: `${V05_ROOT}/combat-effects/projectile-heavy.png`,
    impactStar: `${V05_ROOT}/combat-effects/impact-star.png`, impactGround: `${V05_ROOT}/combat-effects/impact-ground.png`,
    dust: `${V05_ROOT}/combat-effects/dust.png`, criticalStars: `${V05_ROOT}/combat-effects/critical-stars.png`,
    impactBlue: `${V05_ROOT}/combat-effects/impact-blue.png`, dodgeTrail: `${V05_ROOT}/combat-effects/dodge-trail.png`,
    projectileArrow: `${V05_ROOT}/combat-effects/projectile-arrow.png`,
  },
  icons: {
    navigation: Object.fromEntries(['hub','collection','training','chest','duel','pv','xp','badge','coins','force','dodge','speed','shield','equipment','adventure'].map((name) => [name, `${V05_ROOT}/icons/navigation/${name}.png`])) as Record<string, string>,
    stats: Object.fromEntries(['pv','xp','badge','coins','force','dodge','speed'].map((name) => [name, `${V05_ROOT}/icons/stats/${name}.png`])) as Record<string, string>,
    system: Object.fromEntries(['lock','settings','info','confirm'].map((name) => [name, `${V05_ROOT}/icons/system/${name}.png`])) as Record<string, string>,
  },
} as const

export function resolvePlayerWeapon(weapon?: string): PlayerWeapon {
  if (weapon && playerWeapons.includes(weapon as PlayerWeapon)) return weapon as PlayerWeapon
  return weaponAliases[weapon ?? ''] ?? 'massue-silex'
}

export function playerSprite(sex: PlayerSex, weapon: string | undefined, state: PlayerState = 'idle') {
  const resolvedState = state === 'victory' ? 'idle' : state
  const root = resolvedState === 'hurt' ? `${V05_ROOT}/derived/player` : `${V05_ROOT}/player`
  return `${root}/${sex}/${resolvePlayerWeapon(weapon)}/${resolvedState}.png`
}

export function hubPortrait(sex: PlayerSex) { return assetsV05.hub[sex] }
export function gameIcon(group: keyof typeof assetsV05.icons, name: string) { return assetsV05.icons[group][name] }
export { enemySprite, equipmentAsset, resolveEnemyId, weaponMotion }
export type { EnemyId, SpriteState, WeaponMotion }

export const preloadBattleAssetsV05 = (sex: PlayerSex, weapon: string, enemy: EnemyId) => {
  const sources = [
    ...Object.values(assetsV05.arena), ...Object.values(assetsV05.effects),
    ...playerStates.map((state) => playerSprite(sex, weapon, state)),
    ...(['idle', 'anticipation', 'attack', 'dodge', 'hurt', 'ko'] as SpriteState[]).map((state) => enemySprite(enemy, state)),
  ]
  return Promise.all(sources.map((src) => new Promise<void>((resolve) => { const image = new Image(); image.onload = image.onerror = () => resolve(); image.src = src })))
}

export const v04RuntimeFallbacks = ['logo', 'equipment illustrations', 'enemy sprites'] as const
