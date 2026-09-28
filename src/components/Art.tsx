import type { Appearance, EquipmentDefinition } from '../types'
import { sexLabel } from '../character'
import { resolveCanonicalCreationCharacter } from '../art/creationCharacterAssets'
import { enemySprite, equipmentAsset, gameIcon, heroPortrait, playerSprite, resolveEnemyId, resolvePlayerWeapon, weaponMotion, type EnemyId, type PlayerState, type SpriteState } from '../art/assetsV06'

const line = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function WeaponIllustration({ art }: { art: string }) {
  if (art === 'club') return <g transform="rotate(18 80 65)"><path d="M75 111 91 51" stroke="#68452d" strokeWidth="13" strokeLinecap="round"/><path d="m68 59 12-40 28-7 21 23-15 37-27 7Z" fill="#77766e" stroke="#282824" strokeWidth="5"/><path d="m77 58 38 7M83 48l36 5" stroke="#c5a36a" strokeWidth="6"/><path d="m84 27 12 15 10-18m-7 34 13-16" {...line} stroke="#aaa89d" strokeWidth="3"/></g>
  if (art === 'spear') return <g transform="rotate(35 80 65)"><path d="M80 119V31" stroke="#76513a" strokeWidth="8"/><path d="m80 8 18 29-18 16-18-16Z" fill="#e4d4b3" stroke="#514738" strokeWidth="4"/><path d="M68 44q12 12 24 0m-23 9q11 11 22 0" {...line} stroke="#b47b48" strokeWidth="4"/><path d="m80 12 4 22-8 8" {...line} stroke="#fff1cf" strokeWidth="2"/></g>
  if (art === 'axe') return <g transform="rotate(28 80 65)"><path d="M77 118V36" stroke="#493429" strokeWidth="10"/><path d="M78 27Q106 5 137 24q-8 33-51 42l-10-19Z" fill="#191c22" stroke="#090b0f" strokeWidth="5"/><path d="M91 25q23-11 38 2-9 9-37 17" {...line} stroke="#777d93" strokeWidth="3"/><path d="M67 49h24m-23 9h21" stroke="#a36e48" strokeWidth="5"/></g>
  if (art === 'bow') return <g><path d="M51 13q73 52 2 105" {...line} stroke="#8e5c35" strokeWidth="9"/><path d="M51 13 53 118" stroke="#e4d5bd" strokeWidth="2"/><path d="M31 69h91" stroke="#d8c7aa" strokeWidth="3"/><path d="m129 69-23-11v22Z" fill="#c2b494"/><path d="M48 30q17 14 6 30m-2 19q14 15 0 28" {...line} stroke="#c28e4c" strokeWidth="3"/></g>
  if (art === 'fangs') return <g><g transform="rotate(-15 55 68)"><path d="M34 17q43 24 41 92-13 15-26 3 10-43-20-77Z" fill="#efe1bd" stroke="#50483c" strokeWidth="5"/><path d="M43 34q20 22 20 57" {...line} stroke="#fff8df" strokeWidth="3"/><path d="M43 94h27" stroke="#8b5736" strokeWidth="10"/></g><g transform="translate(53) rotate(15 55 68)"><path d="M34 17q43 24 41 92-13 15-26 3 10-43-20-77Z" fill="#efe1bd" stroke="#50483c" strokeWidth="5"/><path d="M43 34q20 22 20 57" {...line} stroke="#fff8df" strokeWidth="3"/><path d="M43 94h27" stroke="#8b5736" strokeWidth="10"/></g></g>
  if (art === 'mammoth') return <g transform="rotate(35 80 65)"><path d="M80 124V34" stroke="#493429" strokeWidth="10"/><path d="M80 4q31 20 18 45L80 65 62 49Q49 24 80 4Z" fill="#f1dfb2" stroke="#5b4936" strokeWidth="5"/><path d="M68 54h24m-26 9h28" stroke="#c28b4b" strokeWidth="5"/><path d="M78 10q12 18 3 40" {...line} stroke="#fff5d9" strokeWidth="3"/><circle cx="80" cy="69" r="7" fill="#dfb354"/></g>
  if (art === 'hammer') return <g transform="rotate(25 80 65)"><path d="M78 121V56" stroke="#5f3a25" strokeWidth="13"/><path d="M28 18h104l-8 48H36Z" fill="#272426" stroke="#100f10" strokeWidth="6"/><path d="m43 24 14 17 13-9 13 25 15-19 17 9" {...line} stroke="#f0642e" strokeWidth="5"/><path d="m51 23 7 11m44 7 9 9" stroke="#ffb34f" strokeWidth="3"/></g>
  if (art === 'claw') return <g transform="rotate(-12 80 65)"><path d="m39 111 40-49" stroke="#562f24" strokeWidth="15"/><path d="M69 71Q70 25 99 7q7 27-5 48 18-31 42-35-2 34-31 57 23-17 42-6-14 27-60 37Z" fill="#bb8c4c" stroke="#352218" strokeWidth="5"/><path d="M87 69q14-31 40-42M94 84q20-17 42-12" {...line} stroke="#f2ce75" strokeWidth="3"/><circle cx="73" cy="89" r="8" fill="#8d241f"/></g>
  return <g><path d="M80 120 32 66Q17 33 45 19q23-11 35 14 13-25 36-14 28 14 12 47Z" fill="#15121c" stroke="#08070b" strokeWidth="6"/><path d="M80 109 45 64q-10-22 8-30 18-7 27 16 10-23 28-16 18 8 7 30Z" fill="#44225f"/><path d="m42 65 25-2 10-29 12 51 10-24h22" {...line} stroke="#c18bff" strokeWidth="4"/><circle cx="49" cy="30" r="2" fill="#fff"/><circle cx="119" cy="38" r="1.5" fill="#fff"/><circle cx="107" cy="91" r="2" fill="#aa74ff"/></g>
}

function ArmorIllustration({ art }: { art: string }) {
  if (art === 'hide') return <g><path d="m36 30 44-18 44 18 20 36-25 13-7 40H48l-7-40-25-13Z" fill="#765137" stroke="#2c2118" strokeWidth="5"/><path d="m39 31 18-15 11 13 15-16 16 14 18-10 8 19-19 19-19-8-15 12-23-13Z" fill="#a7815c"/><path d="m49 82 20-13 19 10 24-15m-56 45 9-22m37 22-8-23" {...line} stroke="#d5b27f" strokeWidth="4"/></g>
  if (art === 'bones') return <g><path d="m43 31 37-17 37 17 16 32-21 15-7 41H55l-7-41-21-15Z" fill="#5e4936" stroke="#291f18" strokeWidth="5"/><path d="M49 33 108 105M111 33 52 105" stroke="#d9cfb4" strokeWidth="10"/><path d="M78 21v91M42 62h76" stroke="#eee5cc" strokeWidth="8"/><circle cx="80" cy="62" r="12" fill="#c8b995" stroke="#51493b" strokeWidth="4"/></g>
  if (art === 'plate') return <g><path d="m31 36 49-24 49 24 18 31-26 14-7 39H46l-7-39-26-14Z" fill="#5b4939" stroke="#211b17" strokeWidth="6"/><path d="m40 36 25 18 15-34 15 34 25-18 9 27-28 9-7 37H66l-7-37-28-9Z" fill="#8c7861"/><path d="m33 42 25-17 9 27m60-10-25-17-9 27" {...line} stroke="#e9dab8" strokeWidth="8"/><path d="M80 20v90" stroke="#d6b976" strokeWidth="4"/></g>
  if (art === 'shell') return <g><path d="m31 35 49-21 49 21 19 35-27 14-8 36H47l-8-36-27-14Z" fill="#272427" stroke="#110f11" strokeWidth="6"/><path d="m34 41 25 11 20-29 21 28 28-11-12 34-22 6 8 28H58l8-28-21-8Z" fill="#3d3739"/><path d="m61 27 8 31-16 18 21 5-5 28m31-80-10 29 17 17-20 7 5 26" {...line} stroke="#f26330" strokeWidth="5"/><path d="m65 52 11 11 9-24m7 40 9 13" stroke="#ffb34d" strokeWidth="3"/></g>
  if (art === 'fur') return <g><path d="m24 40 56-27 56 27 17 32-25 9-10 40H42L32 81 7 72Z" fill="#dedbd2" stroke="#595a58" strokeWidth="6"/><path d="m24 40 18-21 15 12 23-19 21 18 20-12 15 22-18 20-19-8-20 10-18-11-19 12Z" fill="#f4f1e8"/><path d="m50 68 12 18-8 25m56-43L98 86l8 25M80 49v65" {...line} stroke="#a7abb0" strokeWidth="4"/></g>
  return <g><path d="m25 35 55-23 55 23 20 36-30 14-8 36H43l-8-36L5 71Z" fill="#111019" stroke="#050408" strokeWidth="6"/><path d="m33 38 25 11 22-29 22 29 25-11-12 38-21 7 11 27H55l11-27-21-7Z" fill="#30203f"/><path d="m45 43 35 25 35-25M80 20v94" {...line} stroke="#9a62cf" strokeWidth="4"/><circle cx="80" cy="68" r="10" fill="#b786ec"/><circle cx="49" cy="28" r="2" fill="#fff"/><circle cx="120" cy="51" r="1.5" fill="#fff"/></g>
}

export function EquipmentArt({ item, compact = false, silhouette = false }: { item: EquipmentDefinition; compact?: boolean; silhouette?: boolean }) {
  if (!silhouette) return <div className={`equipment-art production-art ${compact ? 'compact' : ''}`} role="img" aria-label={`Illustration — ${item.name}`}><img src={equipmentAsset(item.id, item.type)} alt="" loading="lazy"/></div>
  return <svg className={`equipment-art ${compact ? 'compact' : ''} silhouette`} viewBox="0 0 160 130" role="img" aria-label={`Silhouette verrouillée — ${item.type === 'weapon' ? 'arme' : 'armure'}`}><circle cx="80" cy="65" r="62" fill="currentColor" opacity=".08"/>{item.type === 'weapon' ? <WeaponIllustration art={item.art}/> : <ArmorIllustration art={item.art}/>}</svg>
}

function CharacterPortrait({ appearance, context, className = '' }: { appearance: Appearance; context: 'hub' | 'creation'; className?: string }) {
  return <div className={`${context}-portrait hero-portrait ${className}`} role="img" aria-label={`Warrior ${sexLabel(appearance.sex)}, portrait ${context}`}><img src={heroPortrait(appearance.sex)} alt="" draggable={false}/></div>
}

export function HubWarrior({ appearance, className = '' }: { appearance: Appearance; className?: string }) {
  return <CharacterPortrait appearance={appearance} context="hub" className={className}/>
}

export function CharacterPreview({ appearance, className = '' }: { appearance: Appearance; className?: string }) {
  return <div className={`character-preview-v07 ${className}`} role="img" aria-label={`Aperçu du Warrior ${sexLabel(appearance.sex)}`}>
    <div className="character-preview-v07-stack">
      <img className="character-preview-v07-image" src={resolveCanonicalCreationCharacter(appearance)} alt="" draggable={false}/>
    </div>
  </div>
}

export function EnemyAvatar({ variant = 0, className = '' }: { variant?: number; className?: string }) {
  return <ProductionEnemy variant={variant} className={className}/>
}

export function ProductionWarrior({ appearance, weapon, state = 'idle', className = '' }: { appearance: Appearance; weapon?: string; state?: PlayerState; className?: string }) {
  const src = playerSprite(appearance.sex, weapon, state)
  return <div className={`warrior-sprite player-v06 weapon-${resolvePlayerWeapon(weapon)} motion-${weaponMotion(weapon)} state-${state} ${className}`} role="img" aria-label={`Warrior ${sexLabel(appearance.sex)}`}><img key={src} className="sprite-frame" src={src} alt="" draggable={false}/></div>
}

export function GameIcon({ group, name, className = '' }: { group: 'navigation' | 'stats' | 'system'; name: string; className?: string }) {
  return <img className={`game-icon ${className}`} src={gameIcon(group, name)} alt="" aria-hidden="true" draggable={false}/>
}

export function ProductionEnemy({ variant = 0, enemyId, state = 'idle', boss = false, className = '' }: { variant?: number; enemyId?: EnemyId; state?: SpriteState; boss?: boolean; className?: string }) {
  const resolved = resolveEnemyId(enemyId ?? variant, boss)
  const src = enemySprite(resolved, state, boss)
  return <div className={`enemy-sprite enemy-${resolved} state-${state} ${boss ? 'is-boss' : ''} ${className}`} role="img" aria-label={`Ennemi primordial ${resolved}`}><img key={src} className="sprite-frame" src={src} alt="" draggable={false}/></div>
}
