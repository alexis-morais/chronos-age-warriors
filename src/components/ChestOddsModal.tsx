import { useEffect, useRef } from 'react'
import { EQUIPMENT_CHANCES, RARITY_CHANCES, rarityOrder } from '../config'
import { RIFT_CHEST_ODDS } from '../riftChest'

export function ChestOddsModal({ onClose }: { onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    close.current?.focus({ preventScroll: true })
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') { event.preventDefault(); close.current?.focus({ preventScroll: true }) }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = previousOverflow; previous?.focus() }
  }, [onClose])
  return <div className="chest-result-overlay" role="dialog" aria-modal="true" aria-labelledby="chest-odds-title">
    <section className="equipment-result-panel chest-odds-panel" ref={panel}>
      <h2 id="chest-odds-title">Probabilités des coffres</h2>
      <div className="chest-odds-grid">{[['Coffre Warrior', RARITY_CHANCES], ['Coffre Équipement', EQUIPMENT_CHANCES], ['Coffre de Faille', RIFT_CHEST_ODDS]].map(([title, odds]) => {
        const chances = odds as typeof RARITY_CHANCES
        return <section key={String(title)}><h3>{String(title)}</h3>{title === 'Coffre Équipement' && <p>50 % Arme · 50 % Armure</p>}
          <dl>{rarityOrder.map((rarity) => <div key={rarity}><dt className={`rarity-${rarity.toLowerCase().replace(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>{rarity}</dt><dd>{chances[rarity].toLocaleString('fr-FR', { maximumFractionDigits: 2 })} %</dd></div>)}</dl>
        </section>
      })}</div>
      <button className="primary" type="button" ref={close} onClick={onClose}>FERMER</button>
    </section>
  </div>
}
