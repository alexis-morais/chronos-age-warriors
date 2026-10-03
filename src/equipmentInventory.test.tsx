import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { ADMIN_SAVE_KEY } from './admin'
import { equipment } from './data'
import { freshSave, persistSave, SAVE_KEY } from './storage'
import { establishedKargSave } from './testFixtures'

const openInventory = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Collection' }))
  fireEvent.click(screen.getByRole('button', { name: 'Équipements' }))
}

describe('Collection > Équipements', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
    window.scrollTo = () => undefined
  })

  it('n’affiche que les objets possédés, sans XP ni inconnus', () => {
    const save = establishedKargSave()
    save.owned['obsidian-axe'] = { quantity: 3, level: 9, xp: 400, kills: 2 }
    persistSave(save)
    render(<App/>)
    openInventory()
    expect(screen.getByText('ÉQUIPEMENT DE KARG')).toBeTruthy()
    expect(screen.getByRole('article', { name: 'Massue de silex équipé' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Équiper Massue de silex' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Équiper Hache d’obsidienne' })).toBeTruthy()
    expect(screen.getByText('×3')).toBeTruthy()
    expect([...document.querySelectorAll('.equipment-inventory img')].every((image) => ['/assets/icons/collection/weapon.png', '/assets/icons/collection/armor.png'].includes(image.getAttribute('src') ?? ''))).toBe(true)
    expect(screen.queryByText('Arme inconnue')).toBeNull()
    expect(screen.queryByText(/XP équipement|NIV\. 9/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Armures' }))
    expect(screen.getByRole('article', { name: 'Peaux du chasseur équipé' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Équiper Harnais d’os' })).toBeNull()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('équipe par clic pour le Warrior actif, puis restaure les présélections de chacun', () => {
    const save = establishedKargSave()
    save.owned['obsidian-axe'] = { quantity: 2, level: 1, xp: 0, kills: 0 }
    save.owned['bone-harness'] = { quantity: 1, level: 1, xp: 0, kills: 0 }
    save.ownedWarriors.brakk = { warriorId: 'brakk', level: 1, xp: 0, bonusStats: { strength: 0, dodge: 0, speed: 0, hp: 0 } }
    persistSave(save)
    render(<App/>)
    openInventory()
    fireEvent.click(screen.getByRole('button', { name: 'Équiper Hache d’obsidienne' }))
    expect(screen.getByRole('article', { name: 'Hache d’obsidienne équipé' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Équiper Massue de silex' })).toBeTruthy()
    expect(screen.getByRole('status').textContent).toContain('Arme équipée : Hache d’obsidienne')
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite')
    expect(within(document.querySelector('.active-loadout') as HTMLElement).getByText('Hache d’obsidienne')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Armures' }))
    fireEvent.click(screen.getByRole('button', { name: 'Équiper Harnais d’os' }))
    expect(screen.getByRole('status').textContent).toContain('Armure équipée : Harnais d’os')
    expect(screen.getByRole('article', { name: 'Harnais d’os équipé' })).toBeTruthy()
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).owned['obsidian-axe'].quantity).toBe(2)
    fireEvent.click(screen.getByRole('button', { name: 'Warriors' }))
    fireEvent.click(screen.getByRole('button', { name: 'Voir la fiche de Brakk' }))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Fiche de Brakk' })).getByRole('button', { name: 'Définir comme Warrior actif' }))
    fireEvent.click(screen.getByRole('button', { name: 'Équipements' }))
    expect(screen.getByText('ÉQUIPEMENT DE BRAKK')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Équiper Peaux du chasseur' }))
    expect(screen.getByRole('article', { name: 'Peaux du chasseur équipé' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Warriors' }))
    fireEvent.click(screen.getByRole('button', { name: 'Voir la fiche de Karg' }))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Fiche de Karg' })).getByRole('button', { name: 'Définir comme Warrior actif' }))
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).equippedArmor).toBe('bone-harness')
    fireEvent.click(screen.getByRole('button', { name: 'Équipements' }))
    expect(within(document.querySelector('.active-loadout') as HTMLElement).getByText('Harnais d’os')).toBeTruthy()
  })

  it('remplace le toast lors de changements rapides et le masque après deux secondes', () => {
    vi.useFakeTimers()
    try {
      const save = establishedKargSave()
      save.owned['obsidian-axe'] = { quantity: 2, level: 1, xp: 0, kills: 0 }
      persistSave(save)
      render(<App/>)
      openInventory()
      fireEvent.click(screen.getByRole('button', { name: 'Équiper Hache d’obsidienne' }))
      expect(screen.getByRole('status').textContent).toContain('Hache d’obsidienne')
      act(() => vi.advanceTimersByTime(1000))
      fireEvent.click(screen.getByRole('button', { name: 'Équiper Massue de silex' }))
      expect(screen.getAllByRole('status')).toHaveLength(1)
      expect(screen.getByRole('status').textContent).toContain('Massue de silex')
      expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).owned['obsidian-axe'].quantity).toBe(2)
      act(() => vi.advanceTimersByTime(1000))
      expect(screen.getByRole('status')).toBeTruthy()
      act(() => vi.advanceTimersByTime(1000))
      expect(screen.queryByRole('status')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('montre le catalogue entier en admin sans modifier la sauvegarde normale', () => {
    const normal = freshSave()
    persistSave(normal)
    const original = localStorage.getItem(SAVE_KEY)
    window.history.replaceState({}, '', '/?admin')
    render(<App/>)
    openInventory()
    expect(document.querySelectorAll('.inventory-entry')).toHaveLength(equipment.filter((item) => item.type === 'weapon').length)
    fireEvent.click(screen.getByRole('button', { name: 'Armures' }))
    expect(document.querySelectorAll('.inventory-entry')).toHaveLength(equipment.filter((item) => item.type === 'armor').length)
    expect(localStorage.getItem(ADMIN_SAVE_KEY)).toBeTruthy()
    expect(localStorage.getItem(SAVE_KEY)).toBe(original)
  })

  it('affiche un état vide sans silhouette', () => {
    const save = establishedKargSave()
    save.owned = {}
    save.equippedWeapon = ''
    save.equippedArmor = ''
    save.loadouts.karg = { weapon: '', armor: '' }
    persistSave(save)
    render(<App/>)
    openInventory()
    expect(screen.getByText('Aucune arme possédée.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Armures' }))
    expect(screen.getByText('Aucune armure possédée.')).toBeTruthy()
  })
})
