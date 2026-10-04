import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AccountGate } from './AccountGate'

vi.mock('../lib/supabase', () => ({ supabase: {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
  },
  rpc: async () => ({ data: false, error: null }),
} }))

beforeEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/') })

describe('écran compte obligatoire', () => {
  it('ne montre jamais le jeu sans session', async () => {
    const Game = vi.fn(() => <p>Jeu privé</p>)
    render(<AccountGate Game={Game}/>)
    await screen.findByRole('heading', { name: 'Se connecter' })
    expect(screen.queryByText('Jeu privé')).toBeNull()
    expect(Game).not.toHaveBeenCalled()
  })

  it('demande un pseudo et une confirmation avant inscription', async () => {
    render(<AccountGate Game={() => null}/>)
    await screen.findByRole('heading', { name: 'Se connecter' })
    fireEvent.click(screen.getByRole('button', { name: 'Créer un compte' }))
    expect(screen.getByRole('textbox', { name: 'Pseudo' })).toBeTruthy()
    fireEvent.change(screen.getByRole('textbox', { name: 'Pseudo' }), { target: { value: 'Naya' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'E-mail' }), { target: { value: 'naya@example.test' } })
    fireEvent.change(screen.getByLabelText('Mot de passe', { exact: true }), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByLabelText('Confirmation du mot de passe'), { target: { value: 'different' } })
    fireEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('ne correspondent pas'))
  })

  it('propose la récupération de mot de passe sans ouvrir le jeu', async () => {
    render(<AccountGate Game={() => <p>Jeu privé</p>}/>)
    await screen.findByRole('heading', { name: 'Se connecter' })
    fireEvent.click(screen.getByRole('button', { name: 'Mot de passe oublié ?' }))
    expect(screen.getByRole('heading', { name: 'Mot de passe oublié' })).toBeTruthy()
    expect(screen.queryByText('Jeu privé')).toBeNull()
  })
})
