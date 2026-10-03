import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { ChestPage } from './components/ChestPage'
import { loadSave, persistSave } from './storage'
import { establishedKargSave } from './testFixtures'

beforeEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/'); window.scrollTo = () => undefined })
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); window.history.replaceState({}, '', '/') })

describe('écran Coffres V0.9.5', () => {
  it('montre seulement les trois achats autorisés sans navigation secondaire', () => {
    const save = establishedKargSave()
    save.coins = 300
    render(<ChestPage save={save} setSave={vi.fn()} admin={false}/>)
    expect(screen.getByRole('region', { name: 'Coffre Warrior' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Coffre Équipement' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ouvrir Coffre Warrior ×1, 100 pièces' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Ouvrir Coffre Warrior ×10/ })).toBeNull()
    expect(screen.queryByText('1000 pièces')).toBeNull()
    expect(screen.getByRole('button', { name: 'Ouvrir Coffre Équipement ×1, 20 pièces' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ouvrir Coffre Équipement ×10, 200 pièces' })).toBeTruthy()
    expect(screen.queryByRole('tab')).toBeNull()
  })

  it('ouvre un équipement immédiatement, n’affiche que son icône générique et ignore le double clic', () => {
    const save = establishedKargSave()
    save.coins = 40
    const setSave = vi.fn()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    render(<ChestPage save={save} setSave={setSave} admin={false}/>)
    const button = screen.getByRole('button', { name: 'Ouvrir Coffre Équipement ×1, 20 pièces' })
    fireEvent.click(button)
    fireEvent.click(button)
    expect(setSave).toHaveBeenCalledOnce()
    expect(setSave.mock.calls[0][0].coins).toBe(20)
    const result = screen.getByRole('dialog', { name: 'Récompense du Coffre Équipement' })
    expect(result.textContent).toContain('Massue de silex')
    expect(result.textContent).toContain('Doublon · Inventaire ×2')
    expect(result.querySelector('img')?.getAttribute('src')).toBe('/assets/icons/collection/weapon.png')
    expect(result.querySelector('img[src*="derived/equipment"]')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'CONTINUER' }))
    expect(setSave).toHaveBeenCalledOnce()
  })

  it('désactive les prix inaccessibles et laisse les boutons abordables actifs', () => {
    const save = establishedKargSave()
    save.coins = 20
    render(<ChestPage save={save} setSave={vi.fn()} admin={false}/>)
    expect(screen.getByRole('button', { name: 'Ouvrir Coffre Warrior ×1, 100 pièces' }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('button', { name: 'Ouvrir Coffre Équipement ×10, 200 pièces' }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('button', { name: 'Ouvrir Coffre Équipement ×1, 20 pièces' }).hasAttribute('disabled')).toBe(false)
  })

  it('passe immédiatement la roulette Warrior sans nouveau tirage ni second débit', () => {
    vi.useFakeTimers()
    const save = establishedKargSave()
    save.coins = 100
    const setSave = vi.fn()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const { container } = render(<ChestPage save={save} setSave={setSave} admin={false}/>)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir Coffre Warrior ×1, 100 pièces' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir Coffre Équipement ×10, 200 pièces' }))
    expect(setSave).toHaveBeenCalledOnce()
    expect(setSave.mock.calls[0][0].coins).toBe(0)
    const dialog = screen.getByRole('dialog', { name: 'Tirage du Coffre Warrior' })
    expect(dialog.textContent).toContain('Le destin se révèle…')
    expect(dialog.querySelectorAll('.gacha-entry').length).toBeGreaterThan(12)
    const randomCalls = vi.mocked(Math.random).mock.calls.length
    const skip = screen.getByRole('button', { name: 'Toucher ou cliquer pour passer la roulette' })
    fireEvent.click(skip)
    fireEvent.click(skip)
    expect(dialog.querySelector('.gacha-entry.is-winner')?.textContent).toContain('Karg')
    expect(dialog.querySelector('.gacha-winner-copy')?.textContent).toBe('KargCommunDoublon')
    act(() => vi.advanceTimersByTime(4000))
    expect(vi.mocked(Math.random).mock.calls.length).toBe(randomCalls)
    expect(setSave).toHaveBeenCalledOnce()
    expect(dialog.querySelectorAll('.gacha-entry.is-winner')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'CONTINUER' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(container.querySelector('.chest-offers')).toBeTruthy()
  })

  it('révèle naturellement le même résultat Warrior après la durée normale', () => {
    vi.useFakeTimers()
    const save = establishedKargSave()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const setSave = vi.fn()
    render(<ChestPage save={save} setSave={setSave} admin={false}/>)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir Coffre Warrior ×1, 100 pièces' }))
    expect(screen.getByRole('button', { name: 'Toucher ou cliquer pour passer la roulette' })).toBeTruthy()
    act(() => vi.advanceTimersByTime(3200))
    const dialog = screen.getByRole('dialog', { name: 'Tirage du Coffre Warrior' })
    expect(dialog.querySelector('.gacha-entry.is-winner')?.textContent).toContain('Karg')
    expect(dialog.querySelector('.gacha-winner-copy')?.textContent).toBe('KargCommunDoublon')
    expect(setSave).toHaveBeenCalledOnce()
  })

  it('persiste un stack Équipement après fermeture et rechargement du jeu', () => {
    persistSave(establishedKargSave())
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const first = render(<App/>)
    fireEvent.click(screen.getByRole('button', { name: 'Coffre' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir Coffre Équipement ×1, 20 pièces' }))
    expect(loadSave().owned['flint-club'].quantity).toBe(2)
    fireEvent.click(screen.getByRole('button', { name: 'CONTINUER' }))
    first.unmount()
    render(<App/>)
    expect(loadSave().owned['flint-club'].quantity).toBe(2)
  })
})
