import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { createWarriorReel, WARRIOR_WINNER_INDEX } from '../art/warriorGacha'
import type { Rarity, WarriorDefinition } from '../types'
import { WarriorCard } from './WarriorCard'

const rarityClass = (rarity: Rarity) => `rarity-${rarity.toLowerCase().replace(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`
const NATURAL_SPIN_MS = 3200
const REDUCED_SPIN_MS = 120

function GachaCard({ warrior, winner }: { warrior: WarriorDefinition; winner: boolean }) {
  return <div className={`gacha-entry ${rarityClass(warrior.rarity)} ${winner ? 'is-winner' : ''}`}>
    <WarriorCard warrior={warrior} variant="gacha" loading="eager"/>
    <strong>{warrior.name}</strong><span>{warrior.rarity}</span>
  </div>
}

/** Shared reveal for a paid single draw and the free welcome chest. */
export function WarriorGacha({ warrior, duplicate, welcome = false, onContinue }: { warrior: WarriorDefinition; duplicate: boolean; welcome?: boolean; onContinue: () => void }) {
  const [reel] = useState(() => createWarriorReel(warrior, Math.random))
  const [spinning, setSpinning] = useState(true)
  const revealed = useRef(false)
  const timer = useRef<number | null>(null)
  const reveal = useCallback(() => {
    if (revealed.current) return
    revealed.current = true
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
    setSpinning(false)
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    timer.current = window.setTimeout(reveal, reduced ? REDUCED_SPIN_MS : NATURAL_SPIN_MS)
    return () => { if (timer.current !== null) window.clearTimeout(timer.current) }
  }, [reveal])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (spinning) reveal()
      else onContinue()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onContinue, reveal, spinning])

  return <div className="chest-result-overlay" role="dialog" aria-modal="true" aria-label={welcome ? 'Coffre Warrior de bienvenue' : 'Tirage du Coffre Warrior'}>
    <section className="gacha-panel">
      <div className="gacha-panel-heading"><span className="eyebrow">{welcome ? 'COFFRE WARRIOR OFFERT' : 'COFFRE WARRIOR'}</span><h2>{spinning ? 'Le destin se révèle…' : 'Votre Warrior'}</h2></div>
      <button className={`gacha-roulette ${spinning ? 'is-spinning' : 'is-finished'}`} type="button" onClick={reveal} disabled={!spinning} aria-label={spinning ? 'Toucher ou cliquer pour passer la roulette' : 'Roulette des Warriors'} style={{ '--gacha-winner-index': WARRIOR_WINNER_INDEX } as CSSProperties}>
        <span className="gacha-roulette-marker" aria-hidden="true"/>
        <div className="gacha-roulette-track">{reel.map((entry, index) => <GachaCard key={`${entry.id}-${index}`} warrior={entry} winner={!spinning && index === WARRIOR_WINNER_INDEX}/>)}</div>
      </button>
      {spinning ? <p className="gacha-skip-hint">Toucher ou cliquer pour passer</p> : <>
        <div className="gacha-winner-copy" role="status"><strong>{warrior.name}</strong><span className={rarityClass(warrior.rarity)}>{warrior.rarity}</span><small>{duplicate ? 'Doublon' : 'Nouveau'}</small></div>
        <div className="chest-result-actions"><button className="primary" type="button" onClick={onContinue} autoFocus>{welcome ? 'ENTRER DANS LE HUB' : 'CONTINUER'}</button></div>
      </>}
    </section>
  </div>
}
