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
    const loot: LootContext = { reward, equipped }
    render(<LootReveal loot={loot} onEquip={onEquip} onStore={onStore}/>)

    expect(screen.getByText('NOUVEL OBJET')).toBeTruthy()
    expect(screen.getByText('ÉQUIPÉ ACTUELLEMENT')).toBeTruthy()
    expect(screen.getByText('Massue de silex')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'ÉQUIPER' }))
    fireEvent.click(screen.getByRole('button', { name: 'STOCKER' }))
    expect(onEquip).toHaveBeenCalledOnce()
    expect(onStore).toHaveBeenCalledOnce()
  })

  it('affiche la quantité d’un doublon sans recyclage ni XP', () => {
    const reward = rollChest(() => 0, { 'flint-club': { level: 1, xp: 0, kills: 0 } }, [])
    const loot: LootContext = {
      reward,
      after: { quantity: 2, level: 1, xp: 0, kills: 0 },
    }
    render(<LootReveal loot={loot} onEquip={vi.fn()} onStore={vi.fn()}/>)
    expect(screen.getByText('DÉJÀ POSSÉDÉ · +1 EXEMPLAIRE')).toBeTruthy()
    expect(screen.getByText('Dans l’inventaire : ×2')).toBeTruthy()
    expect(screen.queryByText(/RECYCLÉ|XP équipement|Niveau 1/)).toBeNull()
  })
})
