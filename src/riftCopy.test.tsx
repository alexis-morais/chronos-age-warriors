import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { ADMIN_SAVE_KEY } from './admin'
import { RiftPage } from './components/RiftPage'
import { ChestPage } from './components/ChestPage'
import { prepareRift } from './rift'
import { nextParisMidnight, riftCountdown } from './riftCountdown'
import { persistSave } from './storage'
import { establishedKargSave } from './testFixtures'

beforeEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/'); window.scrollTo = () => undefined })
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); window.history.replaceState({}, '', '/') })

const lostRun = (date: Date) => {
  const save = prepareRift(establishedKargSave(), date, 42)
  save.riftRun!.status = 'lost'
  save.riftLossStreak = 1
  return save
}

describe('copy et navigation Faille', () => {
  it('remplace le label principal sans retirer les sous-onglets', () => {
    persistSave(establishedKargSave())
    render(<App/>)
    const navigation = screen.getByRole('navigation', { name: 'Navigation principale' })
    expect(within(navigation).getByRole('button', { name: 'Faille' })).toBeTruthy()
    expect(within(navigation).queryByRole('button', { name: 'Activités' })).toBeNull()
    expect(within(navigation).queryByRole('button', { name: 'Entraînement' })).toBeNull()
    fireEvent.click(within(navigation).getByRole('button', { name: 'Faille' }))
    expect(screen.getByRole('tab', { name: 'Faille' })).toBeTruthy()
    expect(screen.getByRole('tab', { name: 'Expédition' })).toBeTruthy()
    expect(screen.queryByRole('tab', { name: 'Entraînement' })).toBeNull()
    expect(screen.queryByText(/La Faille s’adapte/)).toBeNull()
    fireEvent.click(screen.getByRole('tab', { name: 'Expédition' }))
    expect(screen.getByRole('heading', { name: 'EXPÉDITION' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'ENVOYER' })).toBeTruthy()
  })

  it('ouvre directement la preview Expédition même si un combat Faille admin était enregistré', () => {
    const save = prepareRift(establishedKargSave(), new Date(), 42)
    save.riftRun!.status = 'fighting'
    save.riftRun!.warriorId = 'karg'
    persistSave(save, localStorage, ADMIN_SAVE_KEY)
    window.history.replaceState({}, '', '/?admin&expeditionPreview')
    render(<App/>)
    expect(screen.getByRole('tab', { name: 'Expédition' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('heading', { name: 'EXPÉDITION' })).toBeTruthy()
    expect(screen.queryByRole('group', { name: 'Vitesse du combat' })).toBeNull()
  })

  it('cache les paliers en UI normale mais les laisse au QA admin', () => {
    const save = establishedKargSave()
    save.riftLossStreak = 3
    const { rerender } = render(<RiftPage save={save} setSave={vi.fn()} setView={vi.fn()} onStart={vi.fn()} admin={false}/>)
    expect(screen.getByRole('button', { name: 'ENTRER DANS LA FAILLE' })).toBeTruthy()
    expect(document.body.textContent).not.toMatch(/74\s*%|Puissance|adaptation|pity/i)
    rerender(<RiftPage save={save} setSave={vi.fn()} setView={vi.fn()} onStart={vi.fn()} admin/>)
    expect(document.body.textContent).toContain('74 %')
  })

  it('affiche uniquement OUVRIR pour le Coffre de Faille', () => {
    const save = establishedKargSave()
    save.riftChestCount = 2
    render(<ChestPage save={save} setSave={vi.fn()} admin={false}/>)
    const offer = screen.getByRole('region', { name: 'Coffre de Faille' })
    const button = within(offer).getByRole('button', { name: 'Ouvrir un Coffre de Faille' })
    expect(button.textContent).toContain('OUVRIR')
    expect(button.textContent).not.toContain('×1')
    expect(offer.textContent).toContain('Coffres : 2')
  })
})

describe('countdown au prochain minuit Europe/Paris', () => {
  it('calcule le reset exact en hiver, été et aux deux changements d’heure', () => {
    expect(new Date(nextParisMidnight('2026-01-15')).toISOString()).toBe('2026-01-15T23:00:00.000Z')
    expect(new Date(nextParisMidnight('2026-07-15')).toISOString()).toBe('2026-07-15T22:00:00.000Z')
    expect(new Date(nextParisMidnight('2026-03-29')).toISOString()).toBe('2026-03-29T22:00:00.000Z')
    expect(new Date(nextParisMidnight('2026-10-25')).toISOString()).toBe('2026-10-25T23:00:00.000Z')
  })

  it('décrémente chaque seconde après la tentative consommée', () => {
    vi.useFakeTimers()
    const date = new Date('2026-01-15T21:30:00Z') // 22:30 à Paris.
    vi.setSystemTime(date)
    render(<RiftPage save={lostRun(date)} setSave={vi.fn()} setView={vi.fn()} onStart={vi.fn()} admin={false}/>)
    expect(screen.getByRole('timer').textContent).toBe('01:30:00')
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByRole('timer').textContent).toBe('01:29:59')
    expect(riftCountdown(new Date('2026-01-15T22:59:59Z'))).toBe('00:00:01')
  })

  it('rend une nouvelle Faille disponible à minuit sans rechargement', () => {
    vi.useFakeTimers()
    const date = new Date('2026-01-15T22:59:58Z')
    vi.setSystemTime(date)
    render(<RiftPage save={lostRun(date)} setSave={vi.fn()} setView={vi.fn()} onStart={vi.fn()} admin={false}/>)
    expect(screen.getByRole('timer').textContent).toBe('00:00:02')
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.queryByRole('timer')).toBeNull()
    expect(screen.getByRole('button', { name: 'ENTRER DANS LA FAILLE' })).toBeTruthy()
  })
})
