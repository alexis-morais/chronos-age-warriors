import { useEffect, useRef, useState, type ComponentType, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { CloudSaveManager, OFFLINE_IDENTITY_KEY, readAccountCache, supabaseGateway, transientNetworkFailure, type SaveConflict, type SyncStatus } from '../cloudSave'
import { supabase } from '../lib/supabase'
import type { SaveData } from '../types'
const LOGGED_OUT_KEY = 'chronos.logged-out-user'

export interface AccountPlay { userId: string; username: string; initialSave: SaveData; manager: CloudSaveManager; status: SyncStatus; logout: () => Promise<void> }
type Mode = 'login' | 'signup' | 'forgot' | 'reset' | 'verify'
type OfflineIdentity = { userId: string; username: string }

function offlineIdentity(): OfflineIdentity | null {
  try {
    const value = JSON.parse(localStorage.getItem(OFFLINE_IDENTITY_KEY) ?? 'null') as Partial<OfflineIdentity> | null
    return value && typeof value.userId === 'string' && typeof value.username === 'string' ? value as OfflineIdentity : null
  } catch { return null }
}

function errorText(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  if (/already|duplicate|unique|23505/i.test(message)) return 'Ce pseudo ou cet e-mail est déjà utilisé.'
  if (/invalid login credentials/i.test(message)) return 'E-mail ou mot de passe incorrect.'
  if (/email not confirmed/i.test(message)) return 'Confirmez votre adresse e-mail avant de vous connecter.'
  if (/password/i.test(message) && /weak|short|6 char/i.test(message)) return 'Le mot de passe est trop court.'
  return message || 'Une erreur est survenue.'
}

export function AccountGate({ Game }: { Game: ComponentType<{ account: AccountPlay }> }) {
  const [mode, setMode] = useState<Mode>('login')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [username, setUsername] = useState('')
  const [phase, setPhase] = useState<'loading' | 'auth' | 'play'>('loading')
  const [account, setAccount] = useState<Omit<AccountPlay, 'logout'> | null>(null)
  const [status, setStatus] = useState<SyncStatus>('pending')
  const [conflict, setConflict] = useState<SaveConflict | null>(null)
  const manager = useRef<CloudSaveManager | null>(null)
  const epoch = useRef(0)
  const recovery = useRef(false)
  const online = () => navigator.onLine

  useEffect(() => {
    let alive = true
    const client = supabase
    if (!client) { setPhase('auth'); setError('Configuration Supabase manquante sur cet environnement.'); return }
    async function enter(session: Session | null, networkFallback = false) {
      const attempt = ++epoch.current
      const cachedIdentity = offlineIdentity()
      const userId = session?.user.id ?? (!online() || networkFallback ? cachedIdentity?.userId : null)
      if (!userId || recovery.current || localStorage.getItem(LOGGED_OUT_KEY) === userId) { manager.current?.dispose(); manager.current = null; if (alive) { setAccount(null); setPhase('auth') } return }
      const allowedOffline = cachedIdentity?.userId === userId && Boolean(readAccountCache(userId, localStorage))
      let name = allowedOffline ? cachedIdentity!.username : ''
      try {
        if (online()) {
          if (!session && !networkFallback) throw new Error('Connexion requise.')
          try {
            if (!session) throw new Error('Failed to fetch')
            const verified = await client!.auth.getUser()
            if (verified.error || verified.data.user?.id !== userId) throw verified.error ?? new Error('Session invalide.')
            const profile = await client!.from('profiles').select('username').eq('user_id', userId).single()
            if (profile.error || !profile.data?.username) throw profile.error ?? new Error('Profil introuvable.')
            name = profile.data.username
          } catch (cause) { if (!allowedOffline || !transientNetworkFailure(cause)) throw cause }
        } else if (!allowedOffline) throw new Error('Connexion Internet requise.')
        const next = new CloudSaveManager(userId, localStorage, supabaseGateway(client!, userId), online, {
          onStatus: setStatus,
          onConflict: setConflict,
          onSave: (save) => window.dispatchEvent(new CustomEvent('chronos-cloud-save', { detail: { userId, save } })),
        })
        const save = await next.initialize(Boolean(allowedOffline))
        if (!alive || attempt !== epoch.current) { next.dispose(); return }
        manager.current?.dispose(); manager.current = next
        localStorage.setItem(OFFLINE_IDENTITY_KEY, JSON.stringify({ userId, username: name }))
        setAccount({ userId, username: name, initialSave: save, manager: next, status })
        setError(''); setPhase('play')
      } catch (cause) {
        if (!alive || attempt !== epoch.current) return
        setError(errorText(cause)); setPhase('auth')
      }
    }
    const { data: listener } = client.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') { recovery.current = true; setMode('reset'); setPhase('auth'); return }
      if (event === 'SIGNED_OUT') { localStorage.removeItem(OFFLINE_IDENTITY_KEY); void enter(null) }
      // Initial session and explicit login are handled below; TOKEN_REFRESHED does not remount the game.
    })
    void client.auth.getSession().then(({ data }) => { if (!recovery.current) void enter(data.session) }).catch((cause) => { if (!online() || transientNetworkFailure(cause)) void enter(null, true); else if (alive) { setError(errorText(cause)); setPhase('auth') } })
    const reconnect = () => { void (async () => {
      if (!manager.current) return
      const verified = await client.auth.getUser()
      if (verified.error || verified.data.user?.id !== offlineIdentity()?.userId) {
        if (verified.error && transientNetworkFailure(verified.error)) { setStatus('offline'); return }
        manager.current.dispose(); manager.current = null; setPhase('auth'); setError('Session expirée. Reconnectez-vous pour synchroniser.'); return
      }
      await manager.current.reconnect()
    })() }
    window.addEventListener('online', reconnect)
    const wentOffline = () => manager.current?.offline()
    window.addEventListener('offline', wentOffline)
    window.addEventListener('focus', reconnect)
    const visibility = () => { if (document.visibilityState === 'visible') reconnect() }
    document.addEventListener('visibilitychange', visibility)
    const periodic = window.setInterval(() => { if (document.visibilityState === 'visible' && online()) reconnect() }, 30_000)
    return () => { alive = false; epoch.current++; listener.subscription.unsubscribe(); window.removeEventListener('online', reconnect); window.removeEventListener('offline', wentOffline); window.removeEventListener('focus', reconnect); document.removeEventListener('visibilitychange', visibility); window.clearInterval(periodic); manager.current?.dispose() }
  }, [])

  const logout = async () => {
    // The marker is removed before the network request; a failed logout cannot grant offline play.
    localStorage.removeItem(OFFLINE_IDENTITY_KEY)
    if (account) localStorage.setItem(LOGGED_OUT_KEY, account.userId)
    manager.current?.dispose(); manager.current = null
    setAccount(null); setPhase('auth'); setMode('login')
    const { error: authError } = await supabase!.auth.signOut({ scope: 'local' })
    if (authError) setError(errorText(authError))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!supabase || busy) return
    setError(''); setBusy(true)
    try {
      if (mode === 'signup') {
        const chosen = username.trim()
        if (!chosen || chosen.length > 24 || [...chosen].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) throw new Error('Choisissez un pseudo de 1 à 24 caractères.')
        if (password !== confirmation) throw new Error('Les mots de passe ne correspondent pas.')
        const availability = await supabase.rpc('username_available', { candidate: chosen })
        if (availability.error) throw availability.error
        if (!availability.data) throw new Error('Ce pseudo est déjà utilisé.')
        const { data, error: authError } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { username: chosen }, emailRedirectTo: new URL(import.meta.env.BASE_URL, window.location.origin).toString() } })
        if (authError) throw authError
        setPassword(''); setConfirmation('')
        if (!data.session) setMode('verify')
        else window.location.reload()
      } else if (mode === 'login') {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (authError) throw authError
        localStorage.removeItem(LOGGED_OUT_KEY)
        setPassword(''); window.location.reload()
      } else if (mode === 'forgot') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: new URL(import.meta.env.BASE_URL, window.location.origin).toString() })
        if (authError) throw authError
        setMode('verify')
      } else if (mode === 'reset') {
        if (password !== confirmation) throw new Error('Les mots de passe ne correspondent pas.')
        const { error: authError } = await supabase.auth.updateUser({ password })
        if (authError) throw authError
        setPassword(''); setConfirmation(''); window.location.replace(new URL(import.meta.env.BASE_URL, window.location.origin).toString())
      }
    } catch (cause) { setError(errorText(cause)) }
    finally { setBusy(false) }
  }

  if (phase === 'loading') return <main className="account-screen"><section className="account-card" role="status">Chargement du compte…</section></main>
  if (phase === 'play' && account) return <>
    <Game key={account.userId} account={{ ...account, status, logout }}/>
    {conflict && <div className="account-conflict-backdrop" role="dialog" aria-modal="true" aria-label="Conflit de sauvegarde"><section className="account-card"><h2>Deux progressions différentes</h2><p>La progression de cet appareil et celle du cloud ont changé. Choisissez celle à conserver.</p><p>En ligne : {conflict.cloud?.updatedAt ? new Date(conflict.cloud.updatedAt).toLocaleString('fr-FR') : 'aucune sauvegarde'}<br/>Cet appareil : {conflict.device.updatedAt ? new Date(conflict.device.updatedAt).toLocaleString('fr-FR') : 'date inconnue'}</p><div className="account-conflict-choices"><button onClick={() => { manager.current?.chooseCloud(); setConflict(null) }}>Utiliser la sauvegarde en ligne</button><button onClick={async () => { try { const resolved = await manager.current?.chooseDevice(); if (resolved) setConflict(null) } catch (cause) { setError(errorText(cause)) } }}>Utiliser cet appareil</button></div>{error && <p role="alert">{error}</p>}</section></div>}
  </>
  return <main className="account-screen"><section className="account-card"><img className="account-logo" src="/assets-v06/branding/logo.png" alt="Chronos Age Warriors"/>
    {mode === 'verify' ? <><h1>Vérifiez votre adresse e-mail</h1><p>Ouvrez le lien reçu, puis connectez-vous.</p><button type="button" onClick={() => setMode('login')}>Se connecter</button></> : <>
      <h1>{mode === 'signup' ? 'Créer un compte' : mode === 'forgot' ? 'Mot de passe oublié' : mode === 'reset' ? 'Nouveau mot de passe' : 'Se connecter'}</h1>
      {mode === 'login' || mode === 'signup' ? <div className="account-tabs"><button type="button" aria-pressed={mode === 'login'} onClick={() => { setMode('login'); setError('') }}>Se connecter</button><button type="button" aria-pressed={mode === 'signup'} onClick={() => { setMode('signup'); setError('') }}>Créer un compte</button></div> : null}
      <form onSubmit={submit}>
        {mode === 'signup' && <label>Pseudo<input autoComplete="nickname" maxLength={24} value={username} onChange={(event) => setUsername(event.target.value)} required/></label>}
        {mode !== 'reset' && <label>E-mail<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required/></label>}
        {mode !== 'forgot' && <label>Mot de passe<input type="password" minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} required/></label>}
        {(mode === 'signup' || mode === 'reset') && <label>Confirmation du mot de passe<input type="password" minLength={6} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required/></label>}
        {error && <p className="account-error" role="alert">{error}</p>}
        <button className="primary wide" disabled={busy || !supabase}>{busy ? 'Veuillez patienter…' : mode === 'signup' ? 'Créer mon compte' : mode === 'forgot' ? 'Envoyer le lien' : mode === 'reset' ? 'Changer le mot de passe' : 'Se connecter'}</button>
      </form>
      {mode === 'login' && <button className="account-text-button" onClick={() => { setMode('forgot'); setError('') }}>Mot de passe oublié ?</button>}
      {(mode === 'forgot' || mode === 'reset') && <button className="account-text-button" onClick={() => { setMode('login'); setError('') }}>Retour à la connexion</button>}
    </>}
  </section></main>
}
