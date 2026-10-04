import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AccountGate, type AccountPlay } from './AccountGate'

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), getUser: vi.fn(), signOut: vi.fn(), listener: null as null | ((event: string) => void) }))
vi.mock('../lib/supabase', () => ({ supabase: {
  auth: {
    getSession: mocks.getSession, getUser: mocks.getUser, signOut: mocks.signOut,
    onAuthStateChange: (listener: (event: string) => void) => { mocks.listener = listener; return { data: { subscription: { unsubscribe() {} } } } },
  },
  from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { username: 'KargQA' }, error: null }) }) }) }),
} }))
vi.mock('../cloudSave', async () => {
  const { freshSave } = await import('../storage')
  return {
    OFFLINE_IDENTITY_KEY: 'chronos.offline-identity',
    readAccountCache: () => null,
    transientNetworkFailure: () => false,
    supabaseGateway: () => ({}),
    CloudSaveManager: class {
      initialize = async () => freshSave()
      dispose = () => undefined
      reconnect = async () => undefined
      offline = () => undefined
    },
  }
})

beforeEach(() => {
  localStorage.clear()
  mocks.listener = null
  mocks.getSession.mockReset(); mocks.getUser.mockReset(); mocks.signOut.mockReset()
  mocks.getSession.mockResolvedValue({ data: { session: { user: { id: 'user-a' } } } })
  mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-a' } }, error: null })
  mocks.signOut.mockImplementation(async () => { mocks.listener?.('SIGNED_OUT'); return { error: null } })
})

describe('session de compte', () => {
  const Game = ({ account }: { account: AccountPlay }) => <><p>Partie de {account.username}</p><button onClick={() => void account.logout()}>Quitter</button></>

  it('restaure une session valide et retire le jeu au logout sans toucher à la save cloud', async () => {
    render(<AccountGate Game={Game}/>)
    expect(await screen.findByText('Partie de KargQA')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Quitter' }))
    expect(await screen.findByRole('heading', { name: 'Se connecter' })).toBeTruthy()
    expect(screen.queryByText('Partie de KargQA')).toBeNull()
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: 'local' })
    expect(localStorage.getItem('chronos.offline-identity')).toBeNull()
  })

  it('bloque une session restaurée dont le token est invalidé', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: new Error('Session invalide.') })
    render(<AccountGate Game={Game}/>)
    expect(await screen.findByRole('heading', { name: 'Se connecter' })).toBeTruthy()
    expect(screen.queryByText('Partie de KargQA')).toBeNull()
  })
})
