import type { CSSProperties } from 'react'
import { hudPortraitCrop, warriorHudPortraitCrops } from '../art/hudPortraitCrops'

type BattleHudProps = {
  side: 'player' | 'enemy'
  name: string
  level: number
  hp: number
  maxHp: number
  portrait?: string
  portraitId?: string
}

export function BattleFighterHud({ side, name, level, hp, maxHp, portrait, portraitId }: BattleHudProps) {
  const safeMax = Math.max(1, maxHp)
  const current = Math.max(0, Math.min(hp, safeMax))
  const crop = hudPortraitCrop(side, portraitId)
  const warriorPortrait = Boolean(portraitId && portraitId in warriorHudPortraitCrops)
  const portraitStyle = { '--portrait-zoom': crop.zoom, '--portrait-x': crop.x, '--portrait-y': crop.y, '--portrait-offset-x': crop.offsetX, '--portrait-offset-y': crop.offsetY } as CSSProperties
  return <section className={`combat-hud-card ${side} ${portrait ? 'has-portrait' : 'without-portrait'} ${warriorPortrait ? 'warrior-portrait' : ''}`} aria-label={`${name}, niveau ${level}, ${current} sur ${maxHp} PV`}>
    <span className="combat-hud-panel" aria-hidden="true"/>
    {portrait && <span className="combat-hud-portrait" style={portraitStyle}><span className="combat-hud-portrait-art"><img src={portrait} alt="" aria-hidden="true"/></span></span>}
    <div className="combat-hud-main">
      <div className="combat-hud-heading"><strong title={name}>{name}</strong><span>Niv. {level}</span></div>
      <div className="combat-hud-health"><div className="combat-hud-meter" role="progressbar" aria-label={`PV de ${name}`} aria-valuemin={0} aria-valuemax={maxHp} aria-valuenow={current}><i style={{ width: `${current / safeMax * 100}%` }}/></div><small>{current} / {maxHp} PV</small></div>
    </div>
  </section>
}
