import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { ADMIN_SAVE_KEY } from './admin'
import { rollWarriorChest } from './game'
import { loadSave, persistSave, SAVE_KEY } from './storage'
import { establishedKargSave } from './testFixtures'

describe('coffre Warrior de bienvenue', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
    window.scrollTo = () => undefined
  })
  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); window.history.replaceState({}, '', '/') })

  it('arrive dans le Hub réel sans Warrior, bloque la navigation et revient après reload sans tirage', () => {
    const first = render(<App/>)
    expect(first.container.querySelector('.hub-page')).toBeTruthy()
    expect(first.container.querySelector('.empty-hub')).toBeTruthy()
    expect(first.container.querySelector('.app-shell')?.hasAttribute('inert')).toBe(true)
    expect(screen.getByRole('dialog', { name: 'Coffre Warrior de bienvenue' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Collection' })).toBeNull()
    expect(loadSave().activeWarriorId).toBe('')
    expect(Object.keys(loadSave().ownedWarriors)).toHaveLength(0)
    first.unmount()
    render(<App/>)
    expect(screen.getByRole('dialog', { name: 'Coffre Warrior de bienvenue' })).toBeTruthy()
  })

  it('révèle le vrai tirage gratuit, équipe rien et ne revient pas après reload', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValueOnce(.999999).mockReturnValueOnce(0)
    const first = render(<App/>)
    const coins = loadSave().coins
    fireEvent.click(screen.getByRole('button', { name: 'OUVRIR MON COFFRE OFFERT' }))
    expect(loadSave().coins).toBe(coins + 1050)
    expect(loadSave().badges.some(({ id }) => id === 'primal-tyrak')).toBe(true)
    expect(screen.getByRole('status').textContent).toContain('3 badges débloqués')
    expect(screen.getByRole('status').textContent).toContain('+1050 pièces')
    expect(loadSave().activeWarriorId).toBe('tyrak')
    expect(loadSave().ownedWarriors.karg).toBeUndefined()
    expect(loadSave().equippedWeapon).toBe('')
    expect(loadSave().equippedArmor).toBe('')
    expect(screen.getByRole('button', { name: 'Toucher ou cliquer pour passer la roulette' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Toucher ou cliquer pour passer la roulette' }))
    expect(within(screen.getByRole('dialog', { name: 'Coffre Warrior de bienvenue' })).getByRole('status').textContent).toContain('TYRAK')
    fireEvent.click(screen.getByRole('button', { name: 'ENTRER DANS LE HUB' }))
    expect(screen.queryByRole('dialog', { name: 'Coffre Warrior de bienvenue' })).toBeNull()
    expect(first.container.querySelector('.hero-name')?.textContent).toContain('TYRAK')
    fireEvent.click(screen.getByRole('button', { name: 'Collection' }))
    expect(screen.getAllByRole('button', { name: /Voir la fiche de/ })).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Voir la fiche de TYRAK' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Équipements' }))
    expect(screen.getByText('Aucune arme possédée.')).toBeTruthy()
    expect(screen.getByText('Aucune arme')).toBeTruthy()
    first.unmount()
    render(<App/>)
    expect(screen.queryByRole('dialog', { name: 'Coffre Warrior de bienvenue' })).toBeNull()
    expect(screen.getByText('TYRAK')).toBeTruthy()
  })

  it('termine aussi la roulette offerte naturellement sans débiter de coffre payant', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const before = loadSave()
    const first = render(<App/>)
    fireEvent.click(screen.getByRole('button', { name: 'OUVRIR MON COFFRE OFFERT' }))
    expect(screen.getByRole('button', { name: 'Toucher ou cliquer pour passer la roulette' })).toBeTruthy()
    act(() => vi.advanceTimersByTime(3200))
    const dialog = screen.getByRole('dialog', { name: 'Coffre Warrior de bienvenue' })
    expect(within(dialog).getByRole('status').textContent).toContain('Karg')
    expect(loadSave().chests).toBe(before.chests)
    expect(loadSave().coins).toBeGreaterThanOrEqual(before.coins)
    fireEvent.click(screen.getByRole('button', { name: 'ENTRER DANS LE HUB' }))
    first.unmount()
    render(<App/>)
    expect(screen.queryByRole('dialog', { name: 'Coffre Warrior de bienvenue' })).toBeNull()
  })

  it('partage le tirage du coffre Warrior normal sans changer la carrière ancienne', () => {
    vi.useFakeTimers()
    const existing = establishedKargSave()
    persistSave(existing)
    const original = localStorage.getItem(SAVE_KEY)
    expect(rollWarriorChest(() => .999999).id).toBe('tyrak')
    vi.spyOn(Math, 'random').mockReturnValueOnce(.999999).mockReturnValueOnce(0)
    render(<App/>)
    expect(screen.queryByRole('dialog', { name: 'Coffre Warrior de bienvenue' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Coffre' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir Coffre Warrior, 100 pièces' }))
    act(() => vi.advanceTimersByTime(3200))
    expect(screen.getByRole('dialog', { name: 'Tirage du Coffre Warrior' }).textContent).toContain('TYRAK')
    const saved = loadSave()
    expect(saved.coins).toBe(existing.coins - 100 + 1050)
    expect(saved.ownedWarriors.tyrak).toBeTruthy()
    expect(saved.activeWarriorId).toBe('karg')
    expect(saved.equippedWeapon).toBe('flint-club')
    expect(localStorage.getItem(SAVE_KEY)).not.toBe(original)
  })

  it('ne bloque jamais l’admin et isole sa sauvegarde', () => {
    const original = localStorage.getItem(SAVE_KEY)
    window.history.replaceState({}, '', '/?admin')
    render(<App/>)
    expect(screen.queryByRole('dialog', { name: 'Coffre Warrior de bienvenue' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Collection' })).toBeTruthy()
    expect(localStorage.getItem(ADMIN_SAVE_KEY)).toBeTruthy()
    expect(localStorage.getItem(SAVE_KEY)).toBe(original)
  })
})
