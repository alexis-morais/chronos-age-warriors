// Supabase Edge / Deno. engine.js is built from src/duelRules.ts by pnpm run build:duel-edge.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { applyDuelReward, normalizedDuelSave, resolveDuel, warriorDefinitions } from './engine.js'

declare const Deno: { env: { get(name: string): string | undefined }; serve(handler: (request: Request) => Promise<Response>): void }

const url = Deno.env.get('SUPABASE_URL')!
const publicKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!
const secretKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SECRET_KEY')!
const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
const authClient = createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false } })
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' }
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
const failure = (error: unknown) => error instanceof Error ? error.message : String(error)
const uuid = (value: unknown) => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

async function rpc(name: string, params: Record<string, unknown>) {
  const { data, error } = await admin.rpc(name, params)
  if (error) throw error
  return data
}

async function saveRow(userId: string) {
  const { data, error } = await admin.from('game_saves').select('save_data,revision').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return data
}

async function requireEligibleAttacker(userId: string) {
  const row = await saveRow(userId)
  if (!row || !normalizedDuelSave(row.save_data)) throw new Error('Warrior actif ou sauvegarde Duel invalide.')
}

async function publicOpponent(userId: string) {
  const [save, profile, duel] = await Promise.all([
    saveRow(userId),
    admin.from('profiles').select('username').eq('user_id', userId).maybeSingle(),
    admin.from('duel_players').select('points').eq('user_id', userId).maybeSingle(),
  ])
  if (profile.error || duel.error) throw profile.error ?? duel.error
  const normalized = save ? normalizedDuelSave(save.save_data) : null
  if (!normalized || !profile.data || !duel.data) return null
  const warriorId = normalized.activeWarriorId
  return { username: profile.data.username, warriorId, level: normalized.ownedWarriors[warriorId].level,
    rarity: warriorDefinitions[warriorId].rarity, points: duel.data.points }
}

async function assign(attackerId: string) {
  const excluded: string[] = []
  let lastState: { opponent_id: string | null; charges: number; recharge_at: string | null; server_now: string; points: number } | null = null
  for (let attempt = 0; attempt < 20; attempt++) {
    const state = await rpc('duel_assign', { p_attacker: attackerId, p_exclude: excluded })
    lastState = state
    if (!state.opponent_id) return { state, opponent: null }
    const opponent = await publicOpponent(state.opponent_id)
    if (opponent) return { state, opponent }
    excluded.push(state.opponent_id)
    await rpc('duel_invalidate', { p_attacker: attackerId, p_defender: state.opponent_id })
  }
  return { state: { ...lastState, opponent_id: null }, opponent: null }
}

async function battle(attackerId: string, requestId: string) {
  // Return the immutable receipt first: a lost HTTP response never spends twice.
  const prior = await admin.from('duel_matches').select('replay').eq('attacker_id', attackerId).eq('request_id', requestId).maybeSingle()
  if (prior.error) throw prior.error
  if (prior.data) return prior.data.replay
  await requireEligibleAttacker(attackerId)
  for (let attempt = 0; attempt < 4; attempt++) {
    const { state, opponent } = await assign(attackerId)
    if (!opponent || !state.opponent_id) throw new Error('Aucun adversaire disponible.')
    if (state.charges < 1) throw new Error('Réserve Duel vide.')
    const [attackerRow, defenderRow] = await Promise.all([saveRow(attackerId), saveRow(state.opponent_id)])
    const attackerSave = attackerRow ? normalizedDuelSave(attackerRow.save_data) : null
    const defenderSave = defenderRow ? normalizedDuelSave(defenderRow.save_data) : null
    if (!attackerRow || !defenderRow || !attackerSave || !defenderSave) {
      await rpc('duel_invalidate', { p_attacker: attackerId, p_defender: state.opponent_id })
      continue
    }
    // The browser supplies neither RNG seed nor combat outcome.
    const seed = crypto.getRandomValues(new Uint32Array(1))[0]
    const resolution = resolveDuel(attackerSave, defenderSave, seed)
    const rewarded = applyDuelReward(attackerSave, resolution)
    const nextSave = rewarded.save
    const replay = { result: resolution.result, attacker: resolution.attacker, defender: resolution.defender,
      opponent, xp: resolution.xp, coins: resolution.coins, points: resolution.points,
      levelAfter: nextSave.ownedWarriors[resolution.attacker.warriorId].level,
      badges: rewarded.granted.map(({ title, coins }: { title: string; coins: number }) => ({ title, coins })) }
    try {
      return await rpc('duel_finalize', {
        p_attacker: attackerId, p_defender: state.opponent_id, p_request: requestId,
        p_attacker_revision: attackerRow.revision, p_defender_revision: defenderRow.revision,
        p_next_save: nextSave, p_attacker_warrior: resolution.attacker.warriorId,
        p_defender_warrior: resolution.defender.warriorId,
        p_attacker_rarity: resolution.attackerRarity, p_defender_rarity: resolution.defenderRarity,
        p_won: resolution.result.winner === 'player', p_points: resolution.points,
        p_xp: resolution.xp, p_coins: resolution.coins, p_replay: replay,
      })
    } catch (error) {
      const message = failure(error)
      if (!/save changed|opponent changed|serialization|40P01|40001/i.test(message)) throw error
      const committed = await admin.from('duel_matches').select('replay').eq('attacker_id', attackerId).eq('request_id', requestId).maybeSingle()
      if (committed.error) throw committed.error
      if (committed.data) return committed.data.replay
    }
  }
  throw new Error('La sauvegarde a changé pendant le Duel. Réessaie.')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (request.method !== 'POST') return reply({ error: 'Méthode invalide.' }, 405)
  const authorization = request.headers.get('Authorization')
  const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1]
  if (!token) return reply({ error: 'Connexion requise.' }, 401)
  let verified
  try { verified = await authClient.auth.getUser(token) }
  catch { return reply({ error: 'Service Duel indisponible.' }, 503) }
  if (verified.error || !verified.data.user) return reply({ error: 'Session invalide.' }, 401)
  const attackerId = verified.data.user.id
  try {
    let body: { action?: string; requestId?: unknown; username?: unknown }
    try { body = await request.json() }
    catch { return reply({ error: 'Requête Duel invalide.' }, 400) }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({ error: 'Requête Duel invalide.' }, 400)
    if (body.action === 'state') {
      await requireEligibleAttacker(attackerId)
      const { state, opponent } = await assign(attackerId)
      return reply({ charges: state.charges, rechargeAt: state.recharge_at, serverNow: state.server_now,
        points: state.points, opponent })
    }
    if (body.action === 'fight') {
      if (!uuid(body.requestId)) return reply({ error: 'Requête Duel invalide.' }, 400)
      return reply(await battle(attackerId, body.requestId as string))
    }
    if (body.action === 'leaderboard') {
      const data = await rpc('duel_board', { p_viewer: attackerId })
      return reply({ ownRank: data.own_rank, ownPoints: data.own_points,
        top: data.top.map((row: { warrior_id: string }) => ({ ...row, rarity: warriorDefinitions[row.warrior_id]?.rarity ?? null })) })
    }
    if (body.action === 'profile') {
      if (typeof body.username !== 'string' || !body.username.trim() || body.username.length > 24
        || [...body.username].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) return reply({ error: 'Profil invalide.' }, 400)
      const data = await rpc('duel_profile', { p_username: body.username.trim() })
      if (!data) return reply({ error: 'Profil introuvable.' }, 404)
      return reply({ ...data, rarity: warriorDefinitions[data.warrior_id]?.rarity ?? null })
    }
    return reply({ error: 'Action inconnue.' }, 400)
  } catch (error) {
    const message = failure(error)
    if (/^(Aucun adversaire disponible\.|Réserve Duel vide\.|La sauvegarde a changé pendant le Duel\. Réessaie\.|Warrior actif ou sauvegarde Duel invalide\.)$/.test(message)) return reply({ error: message }, 409)
    console.error('Duel action failed', error instanceof Error ? error.name : 'unknown')
    return reply({ error: 'Service Duel indisponible.' }, 500)
  }
})
