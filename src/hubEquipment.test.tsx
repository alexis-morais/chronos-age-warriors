import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { persistSave, SAVE_KEY } from './storage'
import { establishedKargSave } from './testFixtures'

describe('indicateurs d’équipement du Hub', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
    window.scrollTo = () => undefined
  })

  it('place les cartes après les Passifs, sans fiche au clic ni second compteur de pièces', () => {
    persistSave(establishedKargSave())
    const { container } = render(<App/>)
    const slots = container.querySelector('.hub-equipment')!
    expect(container.querySelector('.hub-bottom .skill-panel')?.nextElementSibling).toBe(slots)
    expect(slots.querySelectorAll('.hub-equipment-slot')).toHaveLength(2)
    expect(slots.querySelectorAll('img')).toHaveLength(2)
    expect(slots.querySelectorAll('img')[0].getAttribute('src')).toBe('/assets/icons/collection/weapon.png')
    expect(slots.querySelectorAll('img')[1].getAttribute('src')).toBe('/assets/icons/collection/armor.png')
    expect(slots.textContent).toContain('Massue de silex')
    expect(slots.textContent).toContain('Peaux du chasseur')
    expect(slots.textContent).toContain('+3 Force')
    expect(slots.querySelectorAll('button')).toHaveLength(0)
    expect(slots.querySelector('[title]')).toBeNull()
    expect(container.querySelector('.gear-gallery,.mobile-gear,.equipment-card')).toBeNull()
    const original = localStorage.getItem(SAVE_KEY)
    fireEvent.click(slots.querySelector('.hub-equipment-slot')!)
    expect(container.querySelector('.detail-sheet')).toBeNull()
    expect(localStorage.getItem(SAVE_KEY)).toBe(original)
    expect(container.querySelector('.currency strong')?.textContent).toBe(String(establishedKargSave().coins))
    expect(container.querySelector('.resource-row')?.textContent).toContain('combats récompensés')
    expect(container.querySelector('.resource-row')?.textContent).not.toContain(String(establishedKargSave().coins))
    expect(container.querySelector('.daily')?.textContent).not.toContain(String(establishedKargSave().coins))
  })

  it.each([
    ['arme seule', 'flint-club', '', 1],
    ['armure seule', '', 'hunter-hides', 1],
    ['aucun objet', '', '', 0],
  ])('affiche correctement %s', (_, weapon, armor, equippedCount) => {
    const save = establishedKargSave()
    save.equippedWeapon = weapon
    save.equippedArmor = armor
    save.loadouts.karg = { weapon, armor }
    persistSave(save)
    const { container } = render(<App/>)
    const slots = container.querySelector('.hub-equipment')!
    expect(slots.querySelectorAll('.hub-equipment-slot.is-equipped')).toHaveLength(equippedCount)
    expect(slots.querySelectorAll('.hub-equipment-slot.is-empty')).toHaveLength(2 - equippedCount)
    expect(slots.querySelectorAll('img')).toHaveLength(2)
    expect(slots.querySelectorAll('button')).toHaveLength(0)
    expect(slots.querySelectorAll('.hub-equipment-copy span')).toHaveLength(2)
  })

  it('suit la présélection du Warrior actif puis restaure celle du précédent', () => {
    const save = establishedKargSave()
    save.ownedWarriors.brakk = { warriorId: 'brakk', level: 1, xp: 0, bonusStats: { strength: 0, dodge: 0, speed: 0, hp: 0 } }
    save.owned['obsidian-axe'] = { quantity: 1, level: 1, xp: 0, kills: 0 }
    save.loadouts.brakk = { weapon: 'obsidian-axe', armor: '' }
    persistSave(save)
    render(<App/>)
    expect(within(document.querySelector('.hub-equipment') as HTMLElement).getByText('Massue de silex')).toBeTruthy()
    expect(within(document.querySelector('.hub-equipment') as HTMLElement).getByText('Peaux du chasseur')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Collection' }))
    fireEvent.click(screen.getByRole('button', { name: 'Voir la fiche de Brakk' }))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Fiche de Brakk' })).getByRole('button', { name: 'Définir comme Warrior actif' }))
    fireEvent.click(screen.getByRole('button', { name: 'Hub' }))
    expect(within(document.querySelector('.hub-equipment') as HTMLElement).getByText('Hache d’obsidienne')).toBeTruthy()
    expect(within(document.querySelector('.hub-equipment') as HTMLElement).getByText('Aucune armure')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Collection' }))
    fireEvent.click(screen.getByRole('button', { name: 'Voir la fiche de Karg' }))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Fiche de Karg' })).getByRole('button', { name: 'Définir comme Warrior actif' }))
    fireEvent.click(screen.getByRole('button', { name: 'Hub' }))
    expect(within(document.querySelector('.hub-equipment') as HTMLElement).getByText('Massue de silex')).toBeTruthy()
    expect(within(document.querySelector('.hub-equipment') as HTMLElement).getByText('Peaux du chasseur')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).loadouts.brakk).toEqual({ weapon: 'obsidian-axe', armor: '' })
  })
})
