import type { CSSProperties } from 'react'
import type { PlayerState } from '../art/assetsV06'
import { warriorSpriteKit, warriorSpriteKits, type WarriorSpritePose } from '../art/warriorSprites'
import { WarriorAttackFx, WarriorSprite } from './WarriorSprite'

type PreviewAnimation = WarriorSpritePose | 'attack+fx' | 'attack-fx' | 'aim' | 'projectile' | 'attack-impact' | 'command' | 'command-solo' | 'raptors-run' | 'raptors-attack'
const standardAnimations: PreviewAnimation[] = ['idle', 'run', 'attack', 'attack+fx', 'attack-fx', 'dodge', 'block', 'hit', 'ko']

function previewState(animation: PreviewAnimation): PlayerState | 'approach' {
  if (animation === 'run') return 'approach'
  if (animation === 'hit') return 'hurt'
  if (animation === 'attack+fx') return 'attack'
  if (animation === 'attack-fx') return 'idle'
  if (['aim', 'projectile', 'attack-impact', 'command', 'command-solo', 'raptors-run', 'raptors-attack'].includes(animation)) return 'attack'
  return animation as PlayerState
}

export function SpritePreview() {
  const query = new URLSearchParams(window.location.search)
  const requestedWarrior = query.get('qaWarrior') ?? 'karg'
  const warriorId = warriorSpriteKit(requestedWarrior) ? requestedWarrior : 'karg'
  const kit = warriorSpriteKit(warriorId)
  const animations = [...standardAnimations.filter((entry) => entry !== 'run' || kit.attackKind !== 'ranged' && kit.attackKind !== 'companion'), ...Object.keys(kit.previewExtras ?? {}) as PreviewAnimation[]]
  const requestedAnimation = query.get('qaAnimation')
  const animation = animations.find((entry) => entry === requestedAnimation) ?? 'idle'
  const speed = query.get('qaSpeed') === '3' ? 3 : 1
  const url = (nextWarrior: string, nextAnimation: PreviewAnimation, nextSpeed = speed) => `?admin&spritePreview&qaWarrior=${encodeURIComponent(nextWarrior)}&qaAnimation=${encodeURIComponent(nextAnimation)}&qaSpeed=${nextSpeed}`
  const extraSource = kit.previewExtras?.[animation]
  const extraFx = animation === 'projectile' || animation === 'attack-impact'
  const showWarrior = animation !== 'attack-fx' && !extraFx
  const showFx = animation === 'attack+fx' || animation === 'attack-fx' || extraFx
  const geometry = kit.poseGeometry?.[animation as WarriorSpritePose] ?? kit
  const stageStyle = { '--battle-speed': speed, '--preview-attack-duration': `${kit.durationMs.attack}ms`, '--preview-ratio': `${kit.frameWidth} / ${kit.frameHeight}` } as CSSProperties
  return <main className="sprite-preview-page">
    <header><span>OUTIL QA LOCAL · HORS SAUVEGARDE</span><h1>Primal Sprite Preview</h1><p>Une cellule et un sprite à la fois. Les animations tournent en boucle pour inspecter les contours et les transitions.</p></header>
    <nav className="sprite-preview-controls" aria-label="Warrior à inspecter">{Object.keys(warriorSpriteKits).map((id) => <a key={id} aria-current={id === warriorId ? 'page' : undefined} href={url(id, animation)}>{id}</a>)}</nav>
    <nav className="sprite-preview-controls" aria-label="Animation à inspecter">{animations.map((entry) => <a key={entry} aria-current={entry === animation ? 'page' : undefined} href={url(warriorId, entry)}>{entry}</a>)}</nav>
    <nav className="sprite-preview-controls" aria-label="Vitesse de prévisualisation">{([1, 3] as const).map((value) => <a key={value} aria-current={speed === value ? 'page' : undefined} href={url(warriorId, animation, value)}>×{value}</a>)}</nav>
    <section className={`sprite-preview-stage ${showFx ? 'has-fx' : ''} ${animation === 'attack-fx' ? 'fx-only' : ''} ${animation === 'attack+fx' ? 'combined-fx' : ''}`} style={stageStyle} aria-label={`Prévisualisation ${warriorId} ${animation}`}>
      <div className="sprite-preview-baseline" aria-hidden="true"/>
      {showWarrior && <div className="sprite-preview-rig"><WarriorSprite key={`${warriorId}-${animation}`} warriorId={warriorId} state={previewState(animation)} sourceOverride={extraSource}/></div>}
      {showFx && <WarriorAttackFx warriorId={warriorId} source={extraSource}/>}
      <span className="sprite-preview-caption">{warriorId} · {animation} · {kit.frames} × {geometry.frameWidth}×{geometry.frameHeight}</span>
    </section>
    <p className="sprite-preview-note"><code>attack</code> montre le corps seul ; <code>attack+fx</code> ajoute l’effet autour de la troisième frame. Le KO est figé sur sa dernière frame dans le vrai combat.</p>
  </main>
}
