import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LootReveal, type LootContext } from './App'
import { equipment } from './data'
import { rollChest } from './game'

describe('fiche modale du coffre', () => {
  it('présente un nouvel objet, sa comparaison, puis les choix Équiper et Stocker', () => {
    const onEquip = vi.fn(), onStore = vi.fn()
    const reward = rollChest(() => 0, {}, [])
    const equipped = equipment.find((item) => item.id === 'bone-spear')!
    const loot: LootContext = { reward, equipped, equippedLevel: 4 }
    render(<LootReveal loot={loot} onEquip={onEquip} onStore={onStore}/>)

    expect(screen.getByText('NOUVEL OBJET')).toBeTruthy()
    expect(screen.getByText('ÉQUIPÉ ACTUELLEMENT')).toBeTruthy()
    expect(screen.getByText('Massue de silex')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'ÉQUIPER' }))
    fireEvent.click(screen.getByRole('button', { name: 'STOCKER' }))
    expect(onEquip).toHaveBeenCalledOnce()
    expect(onStore).toHaveBeenCalledOnce()
  })

  it('affiche le recyclage et la progression d’un doublon avant de continuer', () => {
    const reward = rollChest(() => 0, { 'flint-club': { level: 1, xp: 0, kills: 0 } }, [])
    const loot: LootContext = {
      reward,
      before: { level: 1, xp: 0, kills: 0 },
      after: { level: 1, xp: 10, kills: 0 },
    }
    render(<LootReveal loot={loot} onEquip={vi.fn()} onStore={vi.fn()}/>)
    expect(screen.getByText('DÉJÀ POSSÉDÉ · RECYCLÉ')).toBeTruthy()
    expect(screen.getByText('+10 pièces')).toBeTruthy()
    expect(screen.getByText('+10 XP équipement')).toBeTruthy()
    expect(screen.getByText(/Avant · niv. 1/)).toBeTruthy()
    expect(screen.getByText(/Après · niv. 1/)).toBeTruthy()
  })
})
