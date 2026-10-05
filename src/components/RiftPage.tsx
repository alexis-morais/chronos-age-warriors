import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { GameIcon } from './Art'
import { beginRiftStage, parisDateKey, prepareRift, quitRift, riftDifficulty, todayRiftRun } from '../rift'
import { nextParisMidnight, riftCountdown } from '../riftCountdown'
import { riftEnemy, RIFT_REWARDS, RIFT_STAGE_LABELS } from '../riftBalance'
import { seededRng } from '../game'
import type { SaveData, View } from '../types'
import { warriorDefinitions } from '../warriors'
import { isWarriorOnExpedition } from '../expedition'
import { ExpeditionPage } from './ExpeditionPage'

function NextRift({ countdown }: { countdown: string }) {
  return <div className="rift-countdown"><span>Prochaine Faille dans</span><strong role="timer" aria-live="off">{countdown}</strong></div>
}

export function RiftPage({ save, setSave, onExpeditionCommit = setSave, setView, onStart, admin, previewExpedition = false }: {
  save: SaveData
  setSave: (save: SaveData) => void
  onExpeditionCommit?: (save: SaveData) => void
  setView: (view: View) => void
  onStart: (save: SaveData) => void
  admin: boolean
  previewExpedition?: boolean
}) {
  const [tab, setTab] = useState<'rift' | 'expedition'>(previewExpedition ? 'expedition' : 'rift')
  const [entered, setEntered] = useState(() => Boolean(todayRiftRun(save) && todayRiftRun(save)?.status !== 'ready'))
  const [confirmQuit, setConfirmQuit] = useState(false)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const dayKey = parisDateKey(now)
  const midnight = useMemo(() => nextParisMidnight(dayKey), [dayKey])
  const countdown = riftCountdown(now, midnight)
  const run = todayRiftRun(save, now)
  const warrior = warriorDefinitions[run?.warriorId || save.activeWarriorId]
  const unavailable = isWarriorOnExpedition(save, run?.warriorId || save.activeWarriorId)
  const difficulty = run?.difficulty ?? riftDifficulty(save.riftLossStreak)
  useEffect(() => {
    if (save.riftRun && save.riftRun.dateKey !== dayKey) {
      setEntered(false)
      setConfirmQuit(false)
    }
  }, [dayKey, save.riftRun])

  const enter = () => { setSave(prepareRift(save, now)); setEntered(true) }
  const start = () => { const next = beginRiftStage(save, now); if (next !== save) { setSave(next); onStart(next) } }
  const adminSet = (streak: number, stage = 0) => {
    const base = structuredClone(save)
    base.riftLossStreak = streak
    base.riftRun = null
    const next = prepareRift(base, now)
    if (next.riftRun && stage > 0) { next.riftRun.warriorId = next.activeWarriorId; next.riftRun.stage = stage; next.riftRun.status = 'between' }
    setSave(next)
    setEntered(true)
  }
  const enemyName = (stage: number) => run
    ? riftEnemy(stage, run.lineup[stage] as Parameters<typeof riftEnemy>[1], difficulty, seededRng(run.seed + stage * 1000003)).name
    : ''

  return <div className="activities-page content-page page-enter">
    <header className="activities-heading"><h1>Faille</h1></header>
    <div className="activities-tabs" role="tablist" aria-label="Modes de la Faille"><button role="tab" aria-selected={tab === 'rift'} className={tab === 'rift' ? 'active' : ''} onClick={() => setTab('rift')}>Faille</button><button role="tab" aria-selected={tab === 'expedition'} className={tab === 'expedition' ? 'active' : ''} onClick={() => setTab('expedition')}>Expédition</button></div>
    {tab === 'expedition' ? <ExpeditionPage save={save} onCommit={onExpeditionCommit} now={now.getTime()} admin={admin}/>
      : run?.status === 'lost' || !entered && (!run || run.status === 'ready') ? <section className="rift-entry">
        <div className="rift-portal" aria-hidden="true"><div className="rift-portal-core"/><div className="rift-portal-shard shard-one"/><div className="rift-portal-shard shard-two"/><div className="rift-portal-shard shard-three"/></div>
        <span className="eyebrow">5 COMBATS</span>
        {run?.status === 'lost' ? <><p>La tentative du jour est terminée. Vos gains restent acquis.</p><NextRift countdown={countdown}/></> : <button className="primary rift-primary" disabled={!warrior || unavailable} onClick={enter}>ENTRER DANS LA FAILLE</button>}
        {!warrior && <small>Obtenez d’abord votre premier Warrior.</small>}
        {unavailable && <small>Ce Warrior est en expédition.</small>}
      </section>
      : <section className="rift-interior">
        <div className="rift-interior-heading"><button className="rift-back" onClick={() => { setConfirmQuit(false); if (run?.status === 'ready') setEntered(false); else setView('hub') }} aria-label={run?.status === 'ready' ? 'Revenir à l’entrée de la Faille' : 'Retour au Hub'}><ChevronLeft/> Retour</button><h2>{run?.status === 'complete' ? 'VICTOIRE' : run?.status === 'quit' ? 'FAILLE QUITTÉE' : 'Faille'}</h2></div>
        {run && <>
          <div className="rift-stage-track" aria-label="Progression dans la Faille">{RIFT_STAGE_LABELS.map((label, index) => {
            const won = index < run.stage || run.status === 'complete'
            const current = index === run.stage && run.status !== 'complete'
            return <div className={`rift-stage ${won ? 'won' : current ? 'current' : 'unknown'}`} key={label}><small>{label}</small><strong>{won ? '✓' : current ? enemyName(index) : '???'}</strong></div>
          })}</div>
          {warrior && <div className="rift-warrior"><img src={warrior.art} alt=""/><div><span className="eyebrow">WARRIOR</span><strong>{warrior.name}</strong><span>{warrior.rarity} · Niveau {save.ownedWarriors[warrior.id]?.level ?? 1}</span></div></div>}
          {['ready', 'between', 'fighting'].includes(run.status) ? <>
            <div className="rift-current"><span className="eyebrow">{RIFT_STAGE_LABELS[run.stage]}</span><h3>{enemyName(run.stage)}</h3><div className="rift-reward-preview"><span><GameIcon group="stats" name="coins"/>+{RIFT_REWARDS[run.stage].coins}</span><span><GameIcon group="stats" name="xp"/>{save.ownedWarriors[run.warriorId || save.activeWarriorId]?.level === 10 ? 'Niveau maximum' : `+${RIFT_REWARDS[run.stage].xp} XP`}</span>{run.stage === 4 && <span>+1 Coffre de Faille</span>}</div><button className="primary rift-primary" onClick={start} disabled={run.status === 'fighting' || unavailable}>{run.status === 'fighting' ? 'COMBAT EN COURS' : 'COMBATTRE'}</button>{unavailable && <small>Ce Warrior est en expédition.</small>}{run.status !== 'ready' && <button className="rift-quit" onClick={() => setConfirmQuit(true)}>QUITTER LA FAILLE</button>}</div>
            {run.status !== 'ready' && <NextRift countdown={countdown}/>}
          </> : <div className={`rift-finale is-${run.status}`}>
            {run.status !== 'complete' && <span className="eyebrow">{RIFT_STAGE_LABELS[run.stage]}</span>}
            <div className="rift-totals"><span><strong>{run.earnedCoins}</strong> pièces</span><span><strong>{run.earnedXp}</strong> XP</span>{run.status === 'complete' && <span><strong>+1</strong> Coffre de Faille</span>}</div>
            <NextRift countdown={countdown}/>
            {run.status === 'complete' && <button className="primary rift-primary" onClick={() => setView('chest')}>VOIR MES COFFRES</button>}
          </div>}
        </>}
        {confirmQuit && <div className="rift-confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirmer l’abandon de la Faille"><div className="rift-confirm"><h3>Quitter la Faille ?</h3><p>La tentative du jour prendra fin. Vos récompenses restent acquises.</p><div><button onClick={() => setConfirmQuit(false)}>RESTER</button><button className="rift-danger" onClick={() => { setSave(quitRift(save, now)); setConfirmQuit(false) }}>QUITTER LA FAILLE</button></div></div></div>}
      </section>}
    {admin && <details className="rift-admin"><summary>QA Faille · admin local</summary><small>Palier du jour : {difficulty} % · défaites : {save.riftLossStreak}</small><div><button onClick={() => adminSet(0)}>Réinitialiser · 100 %</button><button onClick={() => adminSet(3)}>Palier 74 %</button><button onClick={() => adminSet(7)}>Palier 50 %</button><button onClick={() => adminSet(save.riftLossStreak, 3)}>Combat 4</button><button onClick={() => adminSet(save.riftLossStreak, 4)}>Boss</button><button onClick={() => setSave({ ...save, riftChestCount: save.riftChestCount + 1 })}>+1 Coffre de Faille</button></div></details>}
  </div>
}
