import { useEffect, useState } from 'react'
import type { AccountPlay } from './AccountGate'
import { duelBoard, duelFight, duelProfile, duelState, type DuelBoard, type DuelProfile, type DuelState } from '../duelClient'
import type { DuelReplay } from '../duelRules'
import { nextChargeSeconds } from '../combatReserves'
import { warriorDefinitions } from '../warriors'

const requestKey = (userId: string) => `chronos.duel.request.${userId}`
const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

const qaState: DuelState = { charges: 7, rechargeAt: null, serverNow: new Date(0).toISOString(), points: 45,
  opponent: { username: 'APERÇU LOCAL', warriorId: 'naya', level: 7, rarity: 'Commun', points: 35 } }
const qaBoard: DuelBoard = { ownRank: 2, ownPoints: 45, top: [
  { rank: 1, username: 'APERÇU 1', warrior_id: 'tyrak', level: 10, points: 85, rarity: 'Mythique' },
  { rank: 2, username: 'APERÇU 2', warrior_id: 'karg', level: 7, points: 45, rarity: 'Commun' },
] }

export function DuelPage({ account, onStart, preview = false }: { account?: AccountPlay; onStart: (replay: DuelReplay) => void; preview?: boolean }) {
  const [tab, setTab] = useState<'fight' | 'ranking'>('fight')
  const [state, setState] = useState<DuelState | null>(preview ? qaState : null)
  const [board, setBoard] = useState<DuelBoard | null>(preview ? qaBoard : null)
  const [profile, setProfile] = useState<DuelProfile | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [now, setNow] = useState(0)
  const online = typeof navigator !== 'undefined' && navigator.onLine
  useEffect(() => {
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    const network = () => { setNow(Date.now()); if (navigator.onLine) setRetry((value) => value + 1) }
    window.addEventListener('online', network); window.addEventListener('offline', network)
    return () => { window.clearInterval(timer); window.removeEventListener('online', network); window.removeEventListener('offline', network) }
  }, [account])
  useEffect(() => {
    if (preview) {
      setState({ ...qaState, rechargeAt: new Date(Date.now() + 12 * 60_000 + 43_000).toISOString(), serverNow: new Date().toISOString() })
      return
    }
    if (!account || !online) return
    let live = true
    if (tab === 'fight') void duelState().then((value) => { if (live) { setState(value); setError('') } }).catch((cause) => { if (live) { setState(null); setError(cause instanceof Error ? cause.message : 'Service Duel indisponible.') } })
    else void duelBoard().then((value) => { if (live) { setBoard(value); setError('') } }).catch((cause) => { if (live) { setBoard(null); setError(cause instanceof Error ? cause.message : 'Service Duel indisponible.') } })
    return () => { live = false }
  }, [account?.userId, tab, online, preview, retry])

  const fight = async () => {
    if (preview || !account || busy || !online) return
    setBusy(true); setError('')
    try {
      if (!navigator.onLine) throw new Error('Connexion Internet nécessaire pour Duel.')
      if (!(await account.manager.readyForServerMutation())) throw new Error('Synchronise ta sauvegarde avant le Duel.')
      if (!navigator.onLine) throw new Error('Connexion Internet nécessaire pour Duel.')
      const key = requestKey(account.userId)
      const previousRequestId = localStorage.getItem(key)
      const requestId = previousRequestId ?? crypto.randomUUID()
      localStorage.setItem(key, requestId)
      let replay: DuelReplay
      try { replay = await duelFight(requestId) }
      catch (cause) {
        // The offline guard in invokeDuel ran before any HTTP call; no receipt can exist.
        if (!previousRequestId && cause instanceof Error && cause.message === 'Connexion Internet nécessaire pour Duel.') localStorage.removeItem(key)
        throw cause
      }
      await account.manager.refreshAfterServerMutation()
      localStorage.removeItem(key)
      onStart(replay)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Duel indisponible.') }
    finally { setBusy(false) }
  }
  const openProfile = async (username: string) => {
    if (preview) { setProfile({ username, rank: 1, points: 85, warrior_id: 'tyrak', level: 10, rarity: 'Mythique', history: [] }); return }
    try { setProfile(await duelProfile(username)); setError('') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Profil indisponible.') }
  }
  const serverOffset = state ? Date.parse(state.serverNow) - now : 0
  const seconds = state?.rechargeAt ? nextChargeSeconds(Date.parse(state.rechargeAt), now + serverOffset) : 0
  return <div className="duel-page content-page page-enter"><header className="page-heading"><span className="eyebrow">ARÈNE ASYNCHRONE{preview ? ' · APERÇU LOCAL SANS JOUEURS RÉELS' : ''}</span><h1>Duel</h1></header>
    <div className="big-tabs duel-tabs"><button aria-pressed={tab === 'fight'} className={tab === 'fight' ? 'active' : ''} onClick={() => setTab('fight')}>COMBATTRE</button><button aria-pressed={tab === 'ranking'} className={tab === 'ranking' ? 'active' : ''} onClick={() => setTab('ranking')}>CLASSEMENT</button></div>
    {!account && !preview ? <p className="duel-notice">Connecte-toi à ton compte pour affronter de vrais joueurs.</p> : !online && !preview ? <p className="duel-notice">Connexion Internet nécessaire pour Duel.</p> : <>
      {error && <p className="duel-error" role="alert">{error} <button type="button" onClick={() => setRetry((value) => value + 1)}>Réessayer</button></p>}
      {tab === 'fight' ? <section className="duel-fight"><div className="duel-reserve"><span className="eyebrow">RÉSERVE DUEL</span><strong>{state ? `${state.charges}/10` : '…'}</strong>{state && state.charges < 10 && <small>Prochain combat dans {clock(seconds)}</small>}</div>
        {state?.opponent ? <article className="duel-opponent"><span className="eyebrow">PROCHAIN ADVERSAIRE</span><img src={warriorDefinitions[state.opponent.warriorId]?.art} alt=""/><div><h2>{state.opponent.username}</h2><p>{warriorDefinitions[state.opponent.warriorId]?.name} · Niveau {state.opponent.level} · {state.opponent.rarity}</p><small>{state.opponent.points} points</small></div><button className="primary" disabled={preview || busy || state.charges < 1} onClick={() => void fight()}>{preview ? 'APERÇU UNIQUEMENT' : busy ? 'PRÉPARATION…' : 'COMBATTRE'}</button></article> : !error && <p className="duel-notice">{state ? 'Aucun adversaire disponible.' : 'Recherche d’un adversaire…'}</p>}
      </section> : <section className="duel-ranking"><div className="duel-own-rank"><span className="eyebrow">VOTRE RANG</span><strong>{board ? `#${board.ownRank}` : '…'}</strong><span>{board?.ownPoints ?? 0} points</span></div><h2>TOP 100</h2><div className="duel-leaderboard">{board?.top.map((row) => <button key={row.username} className="duel-rank-row" onClick={() => void openProfile(row.username)}><b>#{row.rank}</b><span><strong>{row.username}</strong><small>{warriorDefinitions[row.warrior_id ?? '']?.name ?? 'Warrior inconnu'} · Niv. {row.level ?? '—'}</small></span><b>{row.points}</b></button>)}</div></section>}
      {profile && <div className="duel-profile-overlay" role="dialog" aria-modal="true" aria-label={`Profil de ${profile.username}`}><section className="duel-profile"><button className="duel-profile-close" onClick={() => setProfile(null)} aria-label="Fermer le profil">×</button><span className="eyebrow">PROFIL DUEL</span><h2>{profile.username}</h2><p>#{profile.rank} · {profile.points} points</p><p>{warriorDefinitions[profile.warrior_id ?? '']?.name ?? 'Warrior inconnu'} · Niveau {profile.level ?? '—'} · {profile.rarity ?? '—'}</p><h3>5 derniers Duels initiés</h3>{profile.history.length ? profile.history.map((entry, index) => <div className="duel-history-row" key={`${entry.created_at}-${index}`}><span>{entry.opponent} · {warriorDefinitions[entry.warrior_id]?.name ?? entry.warrior_id}</span><b>{entry.won ? 'Victoire' : 'Défaite'}</b></div>) : <p>Aucun Duel initié.</p>}</section></div>}
    </>}
  </div>
}
