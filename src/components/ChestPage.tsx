import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { canOpenChest } from '../admin'
import { RARITY_CHANCES } from '../config'
import { assetsV06 } from '../art/assetsV06'
import { chestPrice, purchaseChest, type ChestDraw, type ChestKind, type ChestPurchase, type ChestSelection } from '../chestSystem'
import { shortEquipmentSummary } from '../equipmentSummary'
import type { Rarity, SaveData } from '../types'
import { WarriorGacha } from './WarriorGacha'

const rarityClass = (rarity: Rarity) => `rarity-${rarity.toLowerCase().replace(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`
const equipmentIcon = (type: 'weapon' | 'armor') => `/assets/icons/collection/${type}.png`

function ChestVisual({ variant }: { variant: ChestKind }) {
  return <div className={`chest-visual chest-visual-${variant}`}><img src={assetsV06.chest.closed} alt="" draggable={false}/></div>
}

function ChestOffer({ kind, busy, save, admin, onOpen }: { kind: ChestKind; busy: boolean; save: SaveData; admin: boolean; onOpen: (selection: ChestSelection) => void }) {
  const warrior = kind === 'warrior'
  const choices: ChestSelection[] = warrior ? [{ kind: 'warrior', quantity: 1 }] : [{ kind: 'equipment', quantity: 1 }, { kind: 'equipment', quantity: 10 }]
  return <section className={`chest-offer chest-offer-${kind}`} aria-label={warrior ? 'Coffre Warrior' : 'Coffre Équipement'}>
    <ChestVisual variant={kind}/>
    <div className="chest-offer-copy"><span className="eyebrow">{warrior ? 'CHRONOS · WARRIORS' : 'CHRONOS · ARSENAL'}</span><h2>{warrior ? 'Coffre Warrior' : 'Coffre Équipement'}</h2><p>{warrior ? 'Obtenez un Warrior aléatoire.' : 'Obtenez une arme ou une armure.'}</p></div>
    <div className="chest-offer-actions">{choices.map((selection) => <button key={selection.quantity} type="button" onClick={() => onOpen(selection)} disabled={busy || !canOpenChest(save, admin, selection)} aria-label={`Ouvrir ${warrior ? 'Coffre Warrior' : 'Coffre Équipement'} ×${selection.quantity}, ${chestPrice(selection)} pièces`}><strong>Ouvrir ×{selection.quantity}</strong><span>{chestPrice(selection)} pièces</span></button>)}</div>
    {!admin && save.coins < chestPrice(choices[0]) && <small className="chest-offer-hint">Solde insuffisant</small>}
  </section>
}

function EquipmentOpening({ purchase, onClose }: { purchase: ChestPurchase; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])
  const groups = purchase.draws.reduce<Extract<ChestDraw, { kind: 'equipment' }>[][]>((result, draw) => {
    if (draw.kind !== 'equipment') return result
    const group = result.find((entries) => entries[0].item.id === draw.item.id)
    if (group) group.push(draw)
    else result.push([draw])
    return result
  }, [])
  return <div className="chest-result-overlay" role="dialog" aria-modal="true" aria-label="Récompense du Coffre Équipement"><section className="equipment-result-panel"><button className="chest-result-close" type="button" aria-label="Fermer le résultat" onClick={onClose}><X/></button><span className="eyebrow">COFFRE ÉQUIPEMENT · ×{purchase.draws.length}</span><h2>{purchase.draws.length === 1 ? 'Équipement obtenu' : 'Vos 10 équipements'}</h2>
    <div className={`equipment-results ${purchase.draws.length === 1 ? 'is-single' : ''}`}>{groups.map((entries) => { const first = entries[0], last = entries[entries.length - 1]; return <article className={`equipment-result-item ${rarityClass(first.item.rarity)}`} key={first.item.id}><img src={equipmentIcon(first.item.type)} alt=""/><div><span className="eyebrow">{first.item.type === 'weapon' ? 'ARME' : 'ARMURE'} · {first.item.rarity}</span><h3>{first.item.name}{entries.length > 1 && <small> ×{entries.length}</small>}</h3><p>{shortEquipmentSummary(first.item)}</p><span className="equipment-result-state">{first.duplicate ? 'Doublon' : 'Nouveau'} · Inventaire ×{last.quantityAfter}</span></div></article> })}</div>
    <div className="chest-result-actions"><button className="primary" type="button" onClick={onClose} autoFocus>CONTINUER</button></div>
  </section></div>
}

export function ChestPage({ save, setSave, admin }: { save: SaveData; setSave: (save: SaveData) => void; admin: boolean }) {
  const [result, setResult] = useState<ChestPurchase | null>(null)
  const busy = useRef(false)
  const close = () => { setResult(null); busy.current = false }
  const open = (selection: ChestSelection) => {
    if (busy.current) return
    const purchase = purchaseChest(save, selection, Math.random, admin)
    if (!purchase) return
    busy.current = true
    setSave(purchase.save)
    setResult(purchase)
  }
  const warriorDraw = result?.draws[0]
  return <div className="chest-page-v095 content-page page-enter"><header className="chest-page-heading"><span className="eyebrow">AUTEL DES POSSIBLES</span><h1>Coffres</h1><p>Deux chemins pour enrichir votre légende.</p></header><div className="chest-offers"><ChestOffer kind="warrior" busy={Boolean(result)} save={save} admin={admin} onOpen={open}/><ChestOffer kind="equipment" busy={Boolean(result)} save={save} admin={admin} onOpen={open}/></div><p className="chest-odds">Raretés Warrior & Équipement · Commun {RARITY_CHANCES.Commun.toLocaleString('fr-FR')} % · Peu commun {RARITY_CHANCES['Peu commun']} % · Rare {RARITY_CHANCES.Rare} % · Épique {RARITY_CHANCES['Épique']} % · Légendaire {RARITY_CHANCES['Légendaire'].toLocaleString('fr-FR')} % · Mythique {RARITY_CHANCES.Mythique.toLocaleString('fr-FR')} %</p>
    {result && createPortal(warriorDraw?.kind === 'warrior' ? <WarriorGacha warrior={warriorDraw.warrior} duplicate={warriorDraw.duplicate} onContinue={close}/> : <EquipmentOpening purchase={result} onClose={close}/>, document.body)}
  </div>
}
