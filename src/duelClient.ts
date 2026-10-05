import { supabase } from './lib/supabase'
import type { DuelReplay, PublicDuelOpponent } from './duelRules'

export interface DuelState { charges: number; rechargeAt: string | null; resetAt: string; limitRule: 'daily-v015'; serverNow: string; points: number; opponent: PublicDuelOpponent | null }
export interface DuelRankRow { rank: number; username: string; warrior_id: string | null; level: number | null; points: number; rarity: string | null }
export interface DuelBoard { ownRank: number; ownPoints: number; top: DuelRankRow[] }
export interface DuelProfile { username: string; rank: number; points: number; warrior_id: string | null; level: number | null; rarity: string | null; history: { opponent: string; warrior_id: string; won: boolean; created_at: string }[] }

export async function invokeDuel<T>(body: Record<string, unknown>): Promise<T> {
  if (!supabase || !navigator.onLine) throw new Error('Connexion Internet nécessaire pour Duel.')
  let response
  try { response = await supabase.functions.invoke('duel', { body }) }
  catch { throw new Error('Service Duel indisponible. Réessaie.') }
  const { data, error } = response
  if (error) {
    const response = 'context' in error ? error.context : null
    const payload = response instanceof Response ? await response.json().catch(() => null) : null
    const allowed = ['Connexion requise.', 'Session invalide.', 'Requête Duel invalide.', 'Action inconnue.',
      'Aucun adversaire disponible.', 'Réserve Duel vide.', 'La sauvegarde a changé pendant le Duel. Réessaie.',
      'Warrior actif ou sauvegarde Duel invalide.', 'Profil invalide.', 'Profil introuvable.', 'Service Duel indisponible.']
    if (typeof payload?.error === 'string' && allowed.includes(payload.error)) {
      if (payload.error === 'Session invalide.' || payload.error === 'Connexion requise.') await supabase.auth.signOut({ scope: 'local' })
      throw new Error(payload.error)
    }
    console.error('Duel transport failed', error.name)
    throw new Error('Service Duel indisponible. Réessaie.')
  }
  return data as T
}

export const duelState = async () => {
  const state = await invokeDuel<DuelState>({ action: 'state' })
  if (state.limitRule !== 'daily-v015' || !Number.isFinite(Date.parse(state.resetAt))) throw new Error('Mise à jour du service Duel nécessaire.')
  return state
}
export const duelFight = (requestId: string) => invokeDuel<DuelReplay>({ action: 'fight', requestId })
export const duelBoard = () => invokeDuel<DuelBoard>({ action: 'leaderboard' })
export const duelProfile = (username: string) => invokeDuel<DuelProfile>({ action: 'profile', username })
