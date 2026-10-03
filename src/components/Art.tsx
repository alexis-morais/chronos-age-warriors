import type { CSSProperties } from 'react'
import type { EquipmentDefinition } from '../types'
import { enemyPresentation } from '../art/enemyPresentation'
import { enemySprite, equipmentAsset, gameIcon, playerSprite, resolveEnemyId, resolvePlayerWeapon, weaponMotion, type EnemyId, type PlayerState, type SpriteState } from '../art/assetsV06'

export function EquipmentArt({ item, compact = false }: { item: EquipmentDefinition; compact?: boolean }) {
  return <div className={`equipment-art production-art ${compact ? 'compact' : ''}`} role="img" aria-label={`Illustration — ${item.name}`}><img src={equipmentAsset(item.id, item.type)} alt="" loading="lazy"/></div>
}

export function EnemyAvatar({ variant = 0, className = '' }: { variant?: number; className?: string }) {
  return <ProductionEnemy variant={variant} className={className}/>
}

/** TEMPORARY LEGACY COMBAT PLACEHOLDER until collectible Warriors receive sprites. */
export function ProductionWarrior({ sex = 'male', weapon, state = 'idle', className = '' }: { sex?: 'male' | 'female'; weapon?: string; state?: PlayerState; className?: string }) {
  const src = playerSprite(sex, weapon, state)
  return <div className={`warrior-sprite player-v06 weapon-${resolvePlayerWeapon(weapon)} motion-${weaponMotion(weapon)} state-${state} ${className}`} role="img" aria-label="Sprite provisoire du Warrior actif"><img key={src} className="sprite-frame" src={src} alt="" draggable={false}/></div>
}

export function GameIcon({ group, name, className = '' }: { group: 'navigation' | 'stats' | 'system'; name: string; className?: string }) {
  return <img className={`game-icon ${className}`} src={gameIcon(group, name)} alt="" aria-hidden="true" draggable={false}/>
}

export function ProductionEnemy({ variant = 0, enemyId, state = 'idle', boss = false, className = '' }: { variant?: number; enemyId?: EnemyId; state?: SpriteState; boss?: boolean; className?: string }) {
  const resolved = resolveEnemyId(enemyId ?? variant, boss)
  const src = enemySprite(resolved, state, boss)
  const presentation = enemyPresentation[resolved]
  const style = {
    '--enemy-ko-scale': presentation.koScale,
    '--enemy-ko-offset-x': `${presentation.koOffsetX}px`,
    '--enemy-ko-offset-y': `${presentation.koOffsetY}px`,
  } as CSSProperties
  return <div className={`enemy-sprite enemy-${resolved} state-${state} ${boss ? 'is-boss' : ''} ${className}`} style={style} role="img" aria-label={`Ennemi primordial ${resolved}`}><img key={src} className="sprite-frame" src={src} alt="" draggable={false}/></div>
}
