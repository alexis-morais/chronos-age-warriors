import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'
import { describe, expect, it, vi } from 'vitest'

type Handler = (request: Request) => Promise<Response>

function edgeHarness(validSave = true, existingReceipt: unknown = null) {
  const source = readFileSync(resolve('supabase/functions/duel/index.ts'), 'utf8')
  const script = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  let handler: Handler | undefined
  const rpc = vi.fn(async (name: string) => name === 'duel_assign'
    ? { data: { opponent_id: null, charges: 10, recharge_at: null, server_now: '2026-10-04T00:00:00Z', points: 0 }, error: null }
    : { data: { own_rank: 1, own_points: 0, top: [] }, error: null })
  const admin = {
    rpc,
    from: vi.fn((table: string) => {
      const chain = {
        select: () => chain, eq: () => chain,
        maybeSingle: async () => ({ data: table === 'game_saves' && validSave ? { save_data: { activeWarriorId: 'karg' }, revision: 1 }
          : table === 'duel_matches' && existingReceipt ? { replay: existingReceipt } : null, error: null }),
      }
      return chain
    }),
  }
  const auth = { auth: { getUser: vi.fn(async (token: string) => token === 'valid'
    ? { data: { user: { id: 'user-a' } }, error: null }
    : { data: { user: null }, error: new Error('invalid JWT') }) } }
  const engine = { normalizedDuelSave: (save: unknown) => validSave ? save : null, warriorDefinitions: { karg: { rarity: 'Commun' } },
    resolveDuel: vi.fn(), applyDuelReward: vi.fn() }
  runInNewContext(script, {
    exports: {}, require: (id: string) => id === './engine.js' ? engine : { createClient: (_url: string, key: string) => key === 'secret' ? admin : auth },
    Deno: { env: { get: (name: string) => name === 'SUPABASE_URL' ? 'https://example.invalid' : name === 'SUPABASE_SERVICE_ROLE_KEY' ? 'secret' : 'public' }, serve: (fn: Handler) => { handler = fn } },
    Response, Request, crypto,
  })
  if (!handler) throw new Error('Duel Edge handler not registered')
  return { handler, admin, auth, rpc, engine }
}

const post = (body: unknown, token?: string) => new Request('http://localhost/duel', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  body: JSON.stringify(body),
})

describe('protocole HTTP Edge Duel', () => {
  it('répond au preflight avec les headers Supabase requis', async () => {
    const { handler } = edgeHarness()
    const response = await handler(new Request('http://localhost/duel', { method: 'OPTIONS' }))
    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe('authorization, x-client-info, apikey, content-type')
  })
  it('refuse sans bearer et avec un token invalide avant tout accès DB', async () => {
    const { handler, admin, auth } = edgeHarness()
    expect((await handler(post({ action: 'state' }))).status).toBe(401)
    expect((await handler(post({ action: 'state' }, 'invalid'))).status).toBe(401)
    expect(auth.auth.getUser).toHaveBeenCalledWith('invalid')
    expect(admin.from).not.toHaveBeenCalled()
  })
  it('refuse requestId invalide, action inconnue et profil invalide', async () => {
    const { handler, rpc } = edgeHarness()
    expect((await handler(post({ action: 'fight', requestId: 'wrong' }, 'valid'))).status).toBe(400)
    expect((await handler(post({ action: 'invented', winner: 'player' }, 'valid'))).status).toBe(400)
    expect((await handler(post({ action: 'profile', username: 'x'.repeat(25) }, 'valid'))).status).toBe(400)
    expect(rpc).not.toHaveBeenCalled()
  })
  it('traite aucun adversaire comme état normal sans combat ni charge', async () => {
    const { handler, rpc, engine } = edgeHarness()
    const state = await handler(post({ action: 'state', attackerId: 'forged' }, 'valid'))
    expect(state.status).toBe(200)
    expect(await state.json()).toMatchObject({ charges: 10, opponent: null, points: 0 })
    expect(rpc).toHaveBeenCalledWith('duel_assign', { p_attacker: 'user-a', p_exclude: [] })
    const fight = await handler(post({ action: 'fight', requestId: '11111111-1111-4111-8111-111111111111' }, 'valid'))
    expect(fight.status).toBe(409)
    expect((await fight.json()).error).toBe('Aucun adversaire disponible.')
    expect(engine.resolveDuel).not.toHaveBeenCalled()
  })
  it('refuse une save impossible sans attribuer d’adversaire ni dépenser de charge', async () => {
    const { handler, rpc } = edgeHarness(false)
    const response = await handler(post({ action: 'state' }, 'valid'))
    expect(response.status).toBe(409)
    expect((await response.json()).error).toBe('Warrior actif ou sauvegarde Duel invalide.')
    expect(rpc).not.toHaveBeenCalled()
  })
  it('retourne le même reçu pour un requestId déjà validé, sans nouveau combat', async () => {
    const receipt = { result: { winner: 'player' }, coins: 50, points: 20 }
    const { handler, rpc, engine } = edgeHarness(true, receipt)
    const id = '11111111-1111-4111-8111-111111111111'
    expect(await (await handler(post({ action: 'fight', requestId: id }, 'valid'))).json()).toEqual(receipt)
    expect(await (await handler(post({ action: 'fight', requestId: id }, 'valid'))).json()).toEqual(receipt)
    expect(rpc).not.toHaveBeenCalled()
    expect(engine.resolveDuel).not.toHaveBeenCalled()
  })
  it('ne renvoie aucune donnée privée dans le classement', async () => {
    const { handler } = edgeHarness()
    const response = await handler(post({ action: 'leaderboard' }, 'valid'))
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ ownRank: 1, ownPoints: 0, top: [] })
    expect(JSON.stringify(body)).not.toMatch(/user-a|save_data|email|secret/)
  })
})
