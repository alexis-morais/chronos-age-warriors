import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { persistSave, SAVE_KEY } from './storage'
import { establishedKargSave } from './testFixtures'

describe('paliers de passifs du Hub', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
    window.scrollTo = () => undefined
  })
  afterEach(() => window.history.replaceState({}, '', '/'))

  it.each([[1, 0], [3, 1], [7, 2], [10, 3]])('présente les paliers au niveau %i', (level, reached) => {
    const save = establishedKargSave()
    save.ownedWarriors.karg.level = level
    persistSave(save)
    const original = localStorage.getItem(SAVE_KEY)
    const { container } = render(<App/>)
    expect(screen.getByText('Passifs du Warrior')).toBeTruthy()
    expect(screen.getByText(`${reached} / 3 débloqués`)).toBeTruthy()
    expect(container.querySelectorAll('.passive-milestone')).toHaveLength(3)
    expect(container.querySelectorAll('.passive-milestone.reached')).toHaveLength(reached)
    expect(screen.queryByRole('button', { name: /Voir toutes/ })).toBeNull()
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).ownedWarriors.karg.level).toBe(level)
    if (level < 10) expect(localStorage.getItem(SAVE_KEY)).toBe(original)
  })

  it('ne présente plus les compétences génériques même si une sauvegarde v3 en contient', () => {
    const save = establishedKargSave()
    save.unlockedSkills = ['Rage']
    persistSave(save)
    render(<App/>)
    expect(screen.queryByText('Rage')).toBeNull()
    expect(screen.getByText(/Niv. 3 ·/)).toBeTruthy()
    expect(screen.getByText(/Niv. 7 ·/)).toBeTruthy()
    expect(screen.getByText(/Niv. 10 ·/)).toBeTruthy()
  })
})
