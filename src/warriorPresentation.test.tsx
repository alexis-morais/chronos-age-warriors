import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { persistSave, SAVE_KEY } from './storage'
import { establishedKargSave } from './testFixtures'
import { KARG, primalWarriors } from './warriors'

describe('Karg dans le Hub et la Collection', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
    window.scrollTo = () => undefined
  })

  it('affiche la carte canonique et les quatre statistiques du Warrior actif au Hub', () => {
    persistSave(establishedKargSave())
    const { container } = render(<App/>)
    const hero = container.querySelector('.hero-warrior')!
    expect(hero.querySelector('.dev-warrior-card')).toBeNull()
    expect(hero.querySelector('img')?.getAttribute('src')).toBe(KARG.art)
    expect(hero.querySelector('.hero-name')?.textContent).toContain('Karg')
    expect(hero.querySelector('.hero-name')?.textContent).toContain('Ravageur')
    expect([...hero.querySelectorAll('.warrior-stat')].map((stat) => stat.textContent)).toEqual(['PV110', 'Force11', 'Esquive8', 'Vitesse10'])
    expect(hero.querySelector('.warrior-card .warrior-level-badge')?.textContent).toBe('1')
  })

  it('ouvre la fiche uniquement depuis la Collection sans modifier la sauvegarde', () => {
    const save = establishedKargSave()
    save.ownedWarriors.karg.xp = 23
    persistSave(save)
    render(<App/>)
    expect(screen.queryByRole('dialog', { name: 'Fiche de Karg' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Collection' }))
    expect(screen.getByRole('button', { name: 'Voir la fiche de Karg' })).toBeTruthy()
    const original = localStorage.getItem(SAVE_KEY)
    fireEvent.click(screen.getByRole('button', { name: 'Voir la fiche de Karg' }))
    const dialog = screen.getByRole('dialog', { name: 'Fiche de Karg' })
    expect(within(dialog).getByText('Premier Chasseur')).toBeTruthy()
    expect(within(dialog).getByText('23 / 286 XP')).toBeTruthy()
    expect(within(dialog).getByText('Furie')).toBeTruthy()
    expect(within(dialog).getByText('+5 % dégâts par attaque réussie, max ×3. Raté = reset.')).toBeTruthy()
    expect(dialog.querySelectorAll('.warrior-equipment-slot')).toHaveLength(2)
    expect(within(dialog).getByText('Warrior actif')).toBeTruthy()
    expect(localStorage.getItem(SAVE_KEY)).toBe(original)
    fireEvent.click(within(dialog).getByRole('button', { name: 'Fermer la fiche Warrior' }))
    expect(screen.queryByRole('dialog', { name: 'Fiche de Karg' })).toBeNull()
  })

  it('ne révèle ni identité ni artwork des Warriors non possédés', () => {
    persistSave(establishedKargSave())
    const { container } = render(<App/>)
    fireEvent.click(screen.getByRole('button', { name: 'Collection' }))
    expect(container.querySelectorAll('.warrior-collection-entry')).toHaveLength(12)
    expect(container.querySelector('.big-tabs .collection-tab-icon')?.getAttribute('src')).toBe('/assets/icons/collection/warrior.png')
    expect(container.querySelectorAll('.warrior-collection-entry.is-unowned')).toHaveLength(11)
    expect([...container.querySelectorAll('.warrior-collection-entry .warrior-card-frame > img:not(.game-icon)')].map((image) => image.getAttribute('src'))).toEqual([KARG.art])
    expect(container.querySelectorAll('.is-unowned .warrior-card-frame > img:not(.game-icon)')).toHaveLength(0)
    expect(container.querySelectorAll('.is-unowned .lock')).toHaveLength(11)
    for (const entry of container.querySelectorAll('.warrior-collection-entry.is-unowned')) {
      expect(entry.textContent).toBe('???Warrior inconnu · Non découvert')
      expect(entry.getAttribute('aria-label')).toBe('Warrior inconnu')
    }
    for (const warrior of primalWarriors.slice(1)) {
      expect(container.querySelector('.warrior-collection-grid')?.textContent).not.toContain(warrior.name)
      expect(screen.queryByRole('button', { name: `Voir la fiche de ${warrior.name}` })).toBeNull()
    }
    expect(screen.getByRole('button', { name: 'Voir la fiche de Karg' })).toBeTruthy()
    fireEvent.click(container.querySelector('.warrior-collection-entry.is-unowned')!)
    expect(screen.queryByRole('dialog', { name: /Fiche de/ })).toBeNull()
  })

  it('révèle automatiquement une carte dès que le Warrior est possédé', () => {
    const save = establishedKargSave()
    save.ownedWarriors.naya = { warriorId: 'naya', level: 2, xp: 0, bonusStats: { strength: 0, dodge: 0, speed: 0, hp: 0 } }
    persistSave(save)
    const { container } = render(<App/>)
    fireEvent.click(screen.getByRole('button', { name: 'Collection' }))
    expect(container.querySelectorAll('.warrior-collection-entry.is-unowned')).toHaveLength(10)
    const naya = screen.getByRole('button', { name: 'Voir la fiche de Naya' })
    expect(naya.querySelector('.warrior-card img')?.getAttribute('src')).toBe(primalWarriors[1].art)
    expect(naya.textContent).toContain('Spectre · Commun')
    fireEvent.click(naya)
    expect(screen.getByRole('dialog', { name: 'Fiche de Naya' })).toBeTruthy()
  })

  it('prévisualise un autre Warrior au Hub en QA sans écrire dans la sauvegarde', () => {
    const save = establishedKargSave()
    persistSave(save)
    const original = localStorage.getItem(SAVE_KEY)
    window.history.replaceState({}, '', '/?qaPreview&qaWarrior=tyrak')
    const { container } = render(<App/>)
    expect(container.querySelector('.hero-name')?.textContent).toContain('TYRAK')
    expect(container.querySelector('.hub-warrior-card img')?.getAttribute('src')).toBe('/assets/warriors/primal/tyrak.png')
    expect(localStorage.getItem(SAVE_KEY)).toBe(original)
  })
})
