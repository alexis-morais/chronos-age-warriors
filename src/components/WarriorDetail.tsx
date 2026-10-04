import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { GAME } from '../config'
import { equipment } from '../data'
import { activateWarrior, effectiveStats, xpForLevel } from '../game'
import type { SaveData } from '../types'
import { ownedWarrior } from '../warriors'
import { WarriorCard, WarriorStats } from './WarriorCard'

export function WarriorDetail({ save, warriorId, onClose, onActivate }: { save: SaveData; warriorId: string; onClose: () => void; onActivate: () => void }) {
  const warrior = ownedWarrior(save, warriorId)
  const active = save.activeWarriorId === warriorId
  const nextXp = warrior.level >= GAME.maxWarriorLevel ? null : xpForLevel(warrior.level)
  const progress = nextXp ? Math.min(100, Math.max(0, warrior.xp / nextXp * 100)) : 100
  const preview = active ? save : activateWarrior(save, warriorId)
  const weaponId = preview.equippedWeapon
  const armorId = preview.equippedArmor
  const weapon = weaponId && save.owned[weaponId] ? equipment.find((item) => item.id === weaponId) : undefined
  const armor = armorId && save.owned[armorId] ? equipment.find((item) => item.id === armorId) : undefined

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return createPortal(<div className="warrior-detail-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="warrior-detail" role="dialog" aria-modal="true" aria-label={`Fiche de ${warrior.name}`}>
      <button className="warrior-detail-close" aria-label="Fermer la fiche Warrior" onClick={onClose} autoFocus><X size={20}/></button>
      <WarriorCard warrior={warrior} level={warrior.level} className="warrior-detail-art"/>
      <div className="warrior-detail-heading"><span className="eyebrow">{warrior.era}</span><h2>{warrior.name}</h2><p>{warrior.title}</p><div className="warrior-tags"><span>{warrior.warriorClass}</span><span className={`warrior-rarity rarity-${warrior.rarity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(' ', '-')}`}>{warrior.rarity}</span><span>Niveau {warrior.level}</span></div></div>
      <div className="warrior-detail-xp"><div><strong>EXPÉRIENCE</strong><span>{nextXp === null ? 'Niveau maximum' : `${warrior.xp} / ${nextXp} XP`}</span></div><div className="progress" role="progressbar" aria-label="Progression XP Warrior" aria-valuenow={warrior.xp} aria-valuemin={0} aria-valuemax={nextXp ?? warrior.xp}><i style={{ width: `${progress}%` }}/></div></div>
      <WarriorStats stats={effectiveStats(save, warriorId)}/>
      {warrior.passive && <div className="warrior-detail-passive"><span className="eyebrow">PASSIF DE CLASSE</span><strong>{warrior.passive.name}</strong><p>{warrior.passive.description}</p></div>}
      <div className="warrior-detail-equipment"><span className="eyebrow">ÉQUIPEMENT</span><div className="warrior-equipment-slot"><span>Arme</span><strong>{weapon?.name ?? 'Emplacement vide'}</strong></div><div className="warrior-equipment-slot"><span>Armure</span><strong>{armor?.name ?? 'Emplacement vide'}</strong></div></div>
      {active ? <p className="warrior-active-status">Warrior actif</p> : <button className="primary wide" onClick={onActivate}>Définir comme Warrior actif</button>}
    </section>
  </div>, document.body)
}
