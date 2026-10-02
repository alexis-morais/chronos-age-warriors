import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { skills } from './data'
import { persistSave, SAVE_KEY } from './storage'
import { establishedKargSave } from './testFixtures'

function renderHub(ownedSkills: string[]) {
  const save = establishedKargSave()
  save.unlockedSkills = [...ownedSkills]
  persistSave(save)
  const view = render(<App/>)
  return { ...view, save }
}

describe('résumé des compétences du Hub', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
    window.scrollTo = () => undefined
  })
  afterEach(() => window.history.replaceState({}, '', '/'))

  it.each([0, 1, 2, 3, 5, 20])('affiche au plus trois compétences pour %i acquises', (count) => {
    const { container } = renderHub(skills.slice(0, count))
    expect(screen.getByText(`${count} / 20 débloquées`)).toBeTruthy()
    expect(container.querySelectorAll('.skill-preview')).toHaveLength(Math.min(count, 3))
    expect(container.querySelectorAll('.skill-card')).toHaveLength(0)
    if (count === 0) expect(screen.getByText('Aucune compétence débloquée')).toBeTruthy()
    else expect(container.querySelector('.skill-preview')?.textContent).toContain(skills[0])
  })

  it('ouvre les 20 compétences et conserve les trois filtres', () => {
    const { container } = renderHub(skills.slice(0, 2))
    fireEvent.click(screen.getByRole('button', { name: /Voir toutes/ }))
    const sheet = screen.getByRole('dialog', { name: 'Toutes les compétences' })
    expect(sheet.querySelectorAll('.skill-card')).toHaveLength(20)
    fireEvent.click(within(sheet).getByRole('button', { name: 'Débloquées' }))
    expect(sheet.querySelectorAll('.skill-card')).toHaveLength(2)
    fireEvent.click(within(sheet).getByRole('button', { name: 'Verrouillées' }))
    expect(sheet.querySelectorAll('.skill-card')).toHaveLength(18)
    fireEvent.click(within(sheet).getByRole('button', { name: 'Toutes' }))
    expect(sheet.querySelectorAll('.skill-card')).toHaveLength(20)
    fireEvent.click(within(sheet).getByRole('button', { name: 'Fermer les compétences' }))
    expect(container.querySelectorAll('.skill-preview')).toHaveLength(2)
    expect(screen.queryByRole('dialog', { name: 'Toutes les compétences' })).toBeNull()
  })

  it('ouvre la même fiche depuis le résumé et la liste sans modifier la sauvegarde', () => {
    renderHub(skills.slice(0, 1))
    const original = localStorage.getItem(SAVE_KEY)
    fireEvent.click(screen.getByRole('button', { name: /Double Frappe.*Débloquée/ }))
    expect(screen.getByRole('dialog', { name: 'Détail de compétence' }).textContent).toContain('Peut enchaîner une seconde attaque.')
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }))
    fireEvent.click(screen.getByRole('button', { name: /Voir toutes/ }))
    const sheet = screen.getByRole('dialog', { name: 'Toutes les compétences' })
    fireEvent.click(within(sheet).getByRole('button', { name: /Double Frappe/ }))
    expect(screen.getByRole('dialog', { name: 'Détail de compétence' }).textContent).toContain('Peut enchaîner une seconde attaque.')
    expect(localStorage.getItem(SAVE_KEY)).toBe(original)
  })
})
