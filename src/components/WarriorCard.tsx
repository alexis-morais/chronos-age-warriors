import type { CSSProperties } from 'react'
import type { Stats, WarriorDefinition } from '../types'
import { GameIcon } from './Art'

const statItems = [
  { key: 'hp', label: 'PV', icon: 'pv' },
  { key: 'strength', label: 'Force', icon: 'force' },
  { key: 'dodge', label: 'Esquive', icon: 'dodge' },
  { key: 'speed', label: 'Vitesse', icon: 'speed' },
] as const

export function WarriorCard({ warrior, level, className = '', loading = 'lazy', variant = 'standard' }: { warrior: WarriorDefinition; level?: number; className?: string; loading?: 'eager' | 'lazy'; variant?: 'standard' | 'gacha' }) {
  const rarity = warrior.rarity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(' ', '-')
  return <div className={`warrior-card warrior-${warrior.id} rarity-${rarity} ${variant === 'gacha' ? 'gacha-warrior-card' : ''} ${className}`} style={{ '--warrior-object-position': warrior.artPosition } as CSSProperties}>
    <div className="warrior-card-frame"><img src={warrior.art} alt={`Portrait de ${warrior.name}`} loading={loading}/></div>
    {level !== undefined && <span className="warrior-level-badge" aria-label={`Niveau ${level}`}>{level}</span>}
  </div>
}

export function WarriorStats({ stats, className = '' }: { stats: Stats; className?: string }) {
  return <dl className={`warrior-stat-row ${className}`}>{statItems.map(({ key, label, icon }) => <div key={key} className="warrior-stat"><dt><GameIcon group="stats" name={icon}/><span>{label}</span></dt><dd>{stats[key]}</dd></div>)}</dl>
}
