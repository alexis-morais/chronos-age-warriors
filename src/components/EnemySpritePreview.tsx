import type { CSSProperties } from 'react'
import { enemyIds, type EnemyId } from '../art/assetsV04'
import { enemySpriteKit, type EnemySheet, type EnemyVisualPose } from '../art/enemySprites'
import { EnemyAttackFx, EnemySprite } from './EnemySprite'

const poses: (EnemySheet | 'base')[] = ['base','idle','run','anticipation','attack','attack-fx','dodge','block','hit','ko']

export function EnemySpritePreview() {
  const query = new URLSearchParams(window.location.search)
  const requestedId = query.get('qaEnemy')
  const enemyId: EnemyId = enemyIds.includes(requestedId as EnemyId) ? requestedId as EnemyId : 'cave-brute'
  const requestedPose = query.get('qaAnimation')
  const pose: EnemySheet | 'base' = poses.includes(requestedPose as EnemySheet | 'base') ? requestedPose as EnemySheet | 'base' : 'idle'
  const requestedFrame = query.get('qaFrame')
  const frame = requestedFrame && /^[0-3]$/.test(requestedFrame) ? Number(requestedFrame) : null
  const kit = enemySpriteKit(enemyId)!
  const url = (id: string, animation: string) => `?admin&enemySpritePreview&qaEnemy=${id}&qaAnimation=${animation}`
  return <main className="sprite-enemy-preview">
    <h1>Enemy Sprite Preview · {enemyId}</h1>
    <p>Kit V1 · 4 cellules · orientation native gauche · ligne pointillée = sol</p>
    <nav aria-label="Familles ennemies">{enemyIds.map((id) => <a key={id} href={url(id, pose)} aria-current={id === enemyId ? 'page' : undefined}>{id}</a>)}</nav>
    <nav aria-label="Animations ennemies">{poses.map((animation) => <a key={animation} href={url(enemyId, animation)} aria-current={animation === pose ? 'page' : undefined}>{animation}</a>)}</nav>
    {pose !== 'base' && <nav aria-label="Cellules de la planche">{[0,1,2,3].map((index) => <a key={index} href={`${url(enemyId, pose)}&qaFrame=${index}`} aria-current={frame === index ? 'page' : undefined}>Frame {index + 1}</a>)}<a href={url(enemyId, pose)}>Boucle</a></nav>}
    <div className="sprite-enemy-preview-stage">
      {pose === 'base' ? <img className="sprite-enemy-preview-base" src={kit.base} alt={`${enemyId} — pose de base`}/>
        : pose === 'attack-fx' ? <div className="enemy-attack-fx-zone" style={{ '--enemy-fx-ratio': `${kit.geometry['attack-fx'][0]} / ${kit.geometry['attack-fx'][1]}` } as CSSProperties}><EnemyAttackFx enemyId={enemyId} previewFrame={frame}/></div>
        : <div className="sprite-enemy-preview-fighter"><EnemySprite enemyId={enemyId} pose={pose as EnemyVisualPose} previewFrame={frame}/></div>}
    </div>
    <p>Runtime : {pose === 'base' ? kit.base : kit.sheets[pose]}</p>
    {pose !== 'base' && <p>Source conservée : /assets/sprites/ennemies/primal/{enemyId}/{pose}{enemyId === 'smilodon' ? '-runtime' : ''}.png · cellule runtime {kit.geometry[pose][0]} × {kit.geometry[pose][1]} · sujet peint ≤ {kit.paintedSize[pose][0]} × {kit.paintedSize[pose][1]} · frame {frame === null ? 'boucle 1–4' : `${frame + 1}/4`}</p>}
  </main>
}
