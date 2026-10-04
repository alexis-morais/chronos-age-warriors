// This repository-source audit runs in Vitest/Node, outside the browser TS project.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const edge = readFileSync(resolve('supabase/functions/duel/index.ts'), 'utf8')
const duelSql = readFileSync(resolve('supabase/migrations/202610040002_v0132_duel.sql'), 'utf8')
const securitySql = readFileSync(resolve('supabase/migrations/202610040003_v0133_security.sql'), 'utf8')
const economySql = readFileSync(resolve('supabase/migrations/202610040004_v014_economy.sql'), 'utf8')

describe('garde-fous statiques de la frontière Duel', () => {
  it('V0.14 ne change que les récompenses de finalize, garde CAS, reçus et privilèges', () => {
    const previous = duelSql.slice(duelSql.indexOf('create or replace function public.duel_finalize('), duelSql.indexOf('create or replace function public.duel_board(')).trim()
    const functionEnd = previous.indexOf('$$;') + 3
    const expected = previous.slice(0, functionEnd).replace('p_xp <> 100 or p_coins <> 50', 'p_xp <> 20 or p_coins <> 20').replace('p_xp <> 25 or p_coins <> 10', 'p_xp <> 4 or p_coins <> 0')
    expect(economySql.slice(economySql.indexOf('create or replace function'), economySql.indexOf('$$;') + 3)).toBe(expected)
    expect(economySql).toContain('from public, anon, authenticated')
    expect(economySql).toContain('to service_role')
  })
  it('accepte le preflight et les quatre headers utilisés par le SDK Supabase', () => {
    expect(edge).toMatch(/Access-Control-Allow-Headers[^\n]*authorization, x-client-info, apikey, content-type/)
    expect(edge).toMatch(/request\.method === 'OPTIONS'[^\n]*status: 204/)
  })
  it('vérifie le bearer, déduit l’identité du JWT et ne prend pas le résultat du navigateur', () => {
    expect(edge).toMatch(/get\('Authorization'\)/)
    expect(edge).toMatch(/authorization\?\.match\(\/\^Bearer/)
    expect(edge).toMatch(/authClient\.auth\.getUser\(token\)/)
    expect(edge).toMatch(/attackerId = verified\.data\.user\.id/)
    expect(edge).toMatch(/uuid\(body\.requestId\)/)
    expect(edge).toMatch(/resolveDuel\(attackerSave, defenderSave, seed\)/)
    expect(edge).toMatch(/getRandomValues\(new Uint32Array\(1\)\)/)
    expect(edge).not.toMatch(/body\.(attackerId|winner|points|coins|xp)/)
  })
  it('interdit les écritures compétitives directes et les cinq RPC au client', () => {
    for (const table of ['duel_players', 'duel_matches']) {
      expect(duelSql).toContain(`alter table public.${table} enable row level security`)
      expect(duelSql).toContain(`revoke all on public.${table} from public, anon, authenticated`)
    }
    for (const rpc of ['duel_assign', 'duel_invalidate', 'duel_finalize', 'duel_board', 'duel_profile']) {
      expect(duelSql).toMatch(new RegExp(`revoke all on function public\\.${rpc}\\([^;]+from public, anon, authenticated`))
    }
    expect(duelSql).toContain('unique (attacker_id, request_id)')
    expect(duelSql).toContain('constraint duel_no_self_match check (attacker_id <> defender_id)')
    expect(securitySql).toMatch(/revoke all on function public\.duel_board\(uuid\) from public, anon, authenticated/)
    expect(securitySql).toMatch(/revoke all on function public\.duel_profile\(text\) from public, anon, authenticated/)
  })
  it('ne révèle ni save ni identité privée dans le JSON public', () => {
    expect(securitySql).not.toMatch(/to_jsonb\(x\)/)
    expect(securitySql).toContain("'username', x.username")
    expect(securitySql).toContain("'history'")
    expect(edge).not.toMatch(/return reply\(\{\s*(save_data|secretKey|attackerId)\s*:/)
  })
})
