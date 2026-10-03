import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { grantEarnedBadges, gradeRewards, hasBadgeReward, primalBadges, primalEquipmentIds, PRIMAL_MASTERY_ID, PRIMAL_MASTERY_REWARD, unlockedPrimalBadgeCount } from './badgeSystem'
import { loadSave, persistSave, SAVE_KEY } from './storage'
import { establishedKargSave } from './testFixtures'
import { primalWarriors } from './warriors'

const badge = (id: string) => primalBadges.find((entry) => entry.id === id)!

describe('distinctions primordiales', () => {
  beforeEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/'); window.scrollTo = () => undefined })

  it('déclare douze badges uniques, les quatre grades et les objectifs canoniques', () => {
    expect(primalBadges).toHaveLength(12)
    expect(new Set(primalBadges.map(({ id }) => id)).size).toBe(12)
    expect(primalBadges.filter(({ grade }) => grade === 'bronze')).toHaveLength(3)
    expect(primalBadges.filter(({ grade }) => grade === 'silver')).toHaveLength(4)
    expect(primalBadges.filter(({ grade }) => grade === 'gold')).toHaveLength(3)
    expect(primalBadges.filter(({ grade }) => grade === 'platinum')).toHaveLength(2)
    expect(primalWarriors).toHaveLength(12)
    expect(primalEquipmentIds).toHaveLength(15)
    expect(gradeRewards).toEqual({ bronze: 50, silver: 100, gold: 200, platinum: 500 })
  })

  it('calcule une progression unique et ignore les objets hors ère', () => {
    const save = establishedKargSave()
    save.defeatedNodes = [1, 5, 5, 9]
    save.owned['obsidian-axe'] = { quantity: 3, level: 1, xp: 0, kills: 0 }
    save.owned['future-item'] = { quantity: 1, level: 1, xp: 0, kills: 0 }
    expect(badge('primal-first-level').progress(save)).toEqual({ current: 1, target: 1 })
    expect(badge('primal-ten-levels').progress(save)).toEqual({ current: 3, target: 10 })
    expect(badge('primal-first-elite').progress(save)).toEqual({ current: 1, target: 1 })
    expect(badge('primal-three-equipment').progress(save)).toEqual({ current: 3, target: 3 })
    expect(badge('primal-nemesis').progress(save)).toEqual({ current: 0, target: 1 })
  })

  it('crédite chaque récompense une seule fois, y compris après rechargement', () => {
    const save = establishedKargSave()
    save.defeatedNodes = [1]
    save.owned['bone-spear'] = { quantity: 1, level: 1, xp: 0, kills: 0 }
    const first = grantEarnedBadges(save, '2026-01-01T00:00:00Z')
    expect(first.granted.map(({ id }) => id)).toEqual(['primal-first-level', 'primal-three-equipment'])
    expect(first.save.coins).toBe(save.coins + 100)
    expect(save.badges).toHaveLength(0)
    persistSave(first.save)
    const reloaded = loadSave()
    const second = grantEarnedBadges(reloaded)
    expect(second.granted).toHaveLength(0)
    expect(second.save.coins).toBe(first.save.coins)
    expect(second.save.badges.filter(({ id }) => id === 'primal-first-level')).toHaveLength(1)
  })

  it('accorde Maîtrise Primordiale une fois les douze reçus, sans doublon', () => {
    const save = establishedKargSave()
    save.badges = primalBadges.map(({ id }) => ({ id, unlockedAt: '2026-01-01T00:00:00Z' }))
    const first = grantEarnedBadges(save)
    expect(first.granted).toEqual([{ id: PRIMAL_MASTERY_ID, title: 'Maîtrise Primordiale', coins: PRIMAL_MASTERY_REWARD }])
    expect(first.save.coins).toBe(save.coins + 1500)
    expect(unlockedPrimalBadgeCount(first.save)).toBe(12)
    expect(hasBadgeReward(first.save, PRIMAL_MASTERY_ID)).toBe(true)
    expect(grantEarnedBadges(first.save).granted).toHaveLength(0)
  })

  it('affiche les familles, les états et la progression sans ancien catalogue', () => {
    const save = establishedKargSave()
    save.defeatedNodes = [1]
    persistSave(save)
    const firstMount = render(<App/>)
    fireEvent.click(screen.getByRole('button', { name: 'Collection' }))
    fireEvent.click(screen.getByRole('button', { name: 'Badges' }))
    expect(screen.getByRole('button', { name: 'Exploits' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ères' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Exploits' }).getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Ères' }))
    expect(screen.getByText('Ère Primordiale')).toBeTruthy()
    expect(document.querySelectorAll('.era-badge-card')).toHaveLength(12)
    expect(screen.getByRole('article', { name: 'Premiers pas dans le Primal · débloqué' })).toBeTruthy()
    expect(screen.getByRole('article', { name: 'Tribu naissante · en progression' })).toBeTruthy()
    expect(screen.getByRole('article', { name: 'Dominateur du Primal · verrouillé' })).toBeTruthy()
    expect(screen.getByText('Maîtrise Primordiale')).toBeTruthy()
    expect(localStorage.getItem(SAVE_KEY)).toContain('primal-first-level')
    expect(loadSave().coins).toBe(save.coins + 50)
    fireEvent.click(screen.getByRole('button', { name: 'Exploits' }))
    expect(screen.getByText('Vos accomplissements à travers toutes les ères.')).toBeTruthy()
    expect(screen.getByRole('article', { name: 'Premier Impact · verrouillé' })).toBeTruthy()
    expect(document.querySelectorAll('.era-badge-card')).toHaveLength(12)
    firstMount.unmount()
    render(<App/>)
    expect(loadSave().coins).toBe(save.coins + 50)
  })
})
