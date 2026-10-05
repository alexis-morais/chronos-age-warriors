import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ invoke: vi.fn(), signOut: vi.fn() }))
vi.mock('./lib/supabase', () => ({ supabase: {
  functions: { invoke: mocks.invoke }, auth: { signOut: mocks.signOut },
} }))

import { duelFight, duelState } from './duelClient'

beforeEach(() => {
  mocks.invoke.mockReset(); mocks.signOut.mockReset()
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: true })
})

describe('frontière transport Duel', () => {
  it('ne laisse pas sortir une erreur technique Edge Function', async () => {
    mocks.invoke.mockResolvedValue({ data: null, error: new Error('Failed to send a request to the Edge Function') })
    await expect(duelState()).rejects.toThrow('Service Duel indisponible. Réessaie.')
  })
  it('conserve Aucun adversaire comme état normal et sans faux résultat', async () => {
    const state = { charges: 10, rechargeAt: null, resetAt: '2026-10-05T22:00:00Z', limitRule: 'daily-v015', serverNow: '2026-10-04T00:00:00Z', points: 0, opponent: null }
    mocks.invoke.mockResolvedValue({ data: state, error: null })
    await expect(duelState()).resolves.toEqual(state)
    expect(mocks.invoke).toHaveBeenCalledWith('duel', { body: { action: 'state' } })
  })
  it('n’envoie que le requestId pour combattre, jamais winner ou récompense', async () => {
    mocks.invoke.mockResolvedValue({ data: { result: { winner: 'enemy' } }, error: null })
    await duelFight('request-1')
    expect(mocks.invoke).toHaveBeenCalledWith('duel', { body: { action: 'fight', requestId: 'request-1' } })
  })
  it('ne contacte pas Duel hors ligne', async () => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false })
    await expect(duelState()).rejects.toThrow('Connexion Internet nécessaire pour Duel.')
    expect(mocks.invoke).not.toHaveBeenCalled()
  })
  it('ferme la session locale si le serveur rejette le token', async () => {
    mocks.invoke.mockResolvedValue({ data: null, error: { context: new Response(JSON.stringify({ error: 'Session invalide.' })) } })
    mocks.signOut.mockResolvedValue({ error: null })
    await expect(duelState()).rejects.toThrow('Session invalide.')
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: 'local' })
  })
})
