import { useEffect, useRef, useState } from 'react'
import { equipment } from '../data'
import { dismissExpeditionReturn, expeditionClock, expeditionElapsed, settleExpedition, startExpedition, type ExpeditionQaOverrides } from '../expedition'
import { EXPEDITION_MAX_MS, EXPEDITION_ROLL_MS } from '../expeditionBalance'
import type { SaveData } from '../types'
import { warriorDefinitions } from '../warriors'

export function ExpeditionPage({ save, onCommit, now, admin }: { save: SaveData; onCommit: (save: SaveData) => void; now: number; admin: boolean }) {
  const [selectedId, setSelectedId] = useState(save.activeWarriorId)
  const [confirm, setConfirm] = useState<'send' | 'recall' | null>(null)
  const busy = useRef(false)
  useEffect(() => { busy.current = false }, [save])
  const owned = Object.values(save.ownedWarriors).map(({ warriorId }) => warriorDefinitions[warriorId]).filter(Boolean)
  const selected = save.ownedWarriors[selectedId] ? selectedId : owned[0]?.id ?? ''
  const active = save.expedition
  const elapsed = active ? expeditionElapsed(active.startedAt, now) : 0
  const finished = elapsed >= EXPEDITION_MAX_MS
  const activeWarrior = active ? warriorDefinitions[active.warriorId] : null
  const receipt = save.expeditionReturn

  const send = () => {
    if (busy.current || !selected || active) return
    if (owned.length === 1 && confirm !== 'send') { setConfirm('send'); return }
    busy.current = true
    onCommit(startExpedition(save, selected, now))
    setConfirm(null)
  }
  const recall = (qa: ExpeditionQaOverrides = {}, force = false) => {
    if (busy.current || !active) return
    if (!finished && confirm !== 'recall' && !force && !Object.keys(qa).length) { setConfirm('recall'); return }
    busy.current = true
    onCommit(settleExpedition(save, now, Math.random, qa))
    setConfirm(null)
  }
  const setHours = (hours: number) => {
    if (!active) return
    onCommit({ ...save, expedition: { ...active, startedAt: now - hours * 3_600_000 } })
  }

  return <section className="expedition-page" aria-label="Expédition">
    <h2>EXPÉDITION</h2>
    {receipt ? <div className="expedition-return"><span className="eyebrow">RETOUR · {warriorDefinitions[receipt.warriorId]?.name}</span><strong>{receipt.xp > 0 ? `+ ${receipt.xp} XP` : 'Niveau maximum · 0 XP'}</strong><strong>+ {receipt.coins} pièces</strong>{receipt.levelsGained > 0 && <span>+{receipt.levelsGained} niveau{receipt.levelsGained > 1 ? 'x' : ''}</span>}
      {receipt.equipmentIds.length > 0 && <div><h3>Équipements</h3><ul>{receipt.equipmentIds.map((id, index) => <li key={`${id}-${index}`}>{equipment.find((item) => item.id === id)?.name}</li>)}</ul></div>}
      {(receipt.equipmentChest || receipt.warriorChest) && <div><h3>Coffres stockés</h3>{receipt.equipmentChest && <span>Coffre Équipement</span>}{receipt.warriorChest && <span>Coffre Warrior</span>}</div>}
      <button className="primary" onClick={() => onCommit(dismissExpeditionReturn(save))}>TERMINER</button></div>
      : active && activeWarrior ? <div className="expedition-active"><div className="expedition-warrior"><img src={activeWarrior.art} alt=""/><div><strong>{activeWarrior.name}</strong><span>{activeWarrior.rarity} · Niveau {save.ownedWarriors[active.warriorId]?.level}</span></div></div><strong className="expedition-timer" role="timer" aria-live="off">{expeditionClock(elapsed)}</strong>{finished && <span className="expedition-finished">EXPÉDITION TERMINÉE</span>}<button className="primary" onClick={() => finished ? recall() : setConfirm('recall')}>{finished ? 'RÉCUPÉRER' : 'RAPPELER'}</button></div>
      : <><div className="expedition-roster" role="radiogroup" aria-label="Choisir un Warrior">{owned.map((warrior) => <button type="button" role="radio" aria-checked={selected === warrior.id} className={`expedition-choice ${selected === warrior.id ? 'selected' : ''}`} key={warrior.id} onClick={() => setSelectedId(warrior.id)}><img src={warrior.art} alt=""/><span><strong>{warrior.name}</strong><small>{warrior.rarity} · Niveau {save.ownedWarriors[warrior.id].level}</small></span></button>)}</div><button className="primary" disabled={!selected} onClick={send}>ENVOYER</button></>}
    {active && <p>{Math.floor(elapsed / EXPEDITION_ROLL_MS)} / 4 recherches accomplies · 1 par tranche de 6 h complète.{!finished && <> Prochaine recherche dans {expeditionClock((Math.floor(elapsed / EXPEDITION_ROLL_MS) + 1) * EXPEDITION_ROLL_MS - elapsed)}. Le meilleur palier est atteint à 24 h.</>}</p>}
    {confirm && <div className="rift-confirm-overlay" role="dialog" aria-modal="true" aria-label={confirm === 'send' ? 'Confirmer l’envoi' : 'Confirmer le rappel'}><div className="rift-confirm"><h3>{confirm === 'send' ? 'Dernier Warrior disponible' : 'Rappeler ce Warrior maintenant ?'}</h3>{confirm === 'send' ? <p>Pendant son expédition, vous ne pourrez pas combattre en Aventure ou dans la Faille jusqu’à son retour. Les Duels restent disponibles.</p> : <p>Vous récupérerez les gains de {expeditionClock(elapsed)} et seulement {Math.floor(elapsed / EXPEDITION_ROLL_MS)} recherche(s) complète(s) sur 4. Attendre 24 h donne le meilleur palier de loot.</p>}<div><button onClick={() => setConfirm(null)}>ANNULER</button><button className="primary" onClick={confirm === 'send' ? send : () => recall()}>{confirm === 'send' ? 'ENVOYER' : 'RAPPELER'}</button></div></div></div>}
    {admin && <details className="rift-admin"><summary>QA Expédition · admin local</summary><div>{!active && !receipt && <button onClick={send}>Lancer</button>}{active && <><button onClick={() => setHours(4)}>4 h</button><button onClick={() => setHours(8)}>8 h</button><button onClick={() => setHours(12)}>12 h</button><button onClick={() => setHours(24)}>24 h</button><button onClick={() => recall({}, true)}>Forcer retour</button><button onClick={() => recall({ forceEquipment: true })}>Roll équipement réussi</button><button onClick={() => recall({ forceEquipmentChest: true })}>Coffre Équipement</button><button onClick={() => recall({ forceWarriorChest: true })}>Coffre Warrior</button></>}</div></details>}
  </section>
}
