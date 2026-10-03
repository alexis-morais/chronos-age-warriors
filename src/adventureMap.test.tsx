import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { ADMIN_SAVE_KEY } from './admin'
import { primalMapLayout, sharedMapAssets } from './art/adventureMapLayout'
import { persistSave, SAVE_KEY } from './storage'
import { establishedKargSave } from './testFixtures'

describe('carte Aventure', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
    window.scrollTo = () => undefined
  })

  it('présente les 20 niveaux, leurs états et le parcours sans avatar legacy', () => {
    window.history.replaceState({}, '', '/?admin&adventurePreview&qaNode=9')
    const { container } = render(<App/>)
    expect(container.querySelectorAll('.map-node')).toHaveLength(20)
    expect(container.querySelectorAll('.map-route-lines g')).toHaveLength(19)
    expect(container.querySelectorAll('.map-route-underlay')).toHaveLength(19)
    expect(container.querySelectorAll('.map-route-lines image')).toHaveLength(19)
    expect(container.querySelector('.map-route-lines image')?.getAttribute('href')).toBe(sharedMapAssets.connector)
    expect([...container.querySelectorAll('.map-node-number')].map((node) => Number(node.textContent))).toEqual(Array.from({ length: 20 }, (_, index) => index + 1))
    expect(screen.getByRole('button', { name: 'Niveau 5 · Combat élite · terminé' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Niveau 9 · Combat standard · prochain combat' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Niveau 20 · Boss · verrouillé' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Niveau 1 · Combat standard · terminé' }).querySelector('img')?.getAttribute('src')).toBe(sharedMapAssets.standard)
    expect(screen.getByRole('button', { name: 'Niveau 5 · Combat élite · terminé' }).querySelector('img')?.getAttribute('src')).toBe(sharedMapAssets.elite)
    expect(screen.getByRole('button', { name: 'Niveau 20 · Boss · verrouillé' }).querySelector('img')?.getAttribute('src')).toBe(sharedMapAssets.boss)
    expect(container.querySelector('.map-avatar')).toBeNull()
    expect(localStorage.getItem(SAVE_KEY)).toBeNull()
    expect(localStorage.getItem(ADMIN_SAVE_KEY)).toBeNull()
  })

  it('conserve un tracé Primal normalisé et composé, indépendant du visuel partagé', () => {
    expect(primalMapLayout.points).toHaveLength(20)
    expect(primalMapLayout.points.every(({ x, y }) => x > 0 && x < 1 && y > 0 && y < 1)).toBe(true)
    expect(new Set(primalMapLayout.points.map(({ y }) => y)).size).toBeGreaterThan(12)
    expect(primalMapLayout.points[0].y).toBeGreaterThan(primalMapLayout.points[19].y)
    expect(primalMapLayout.points.filter(({ kind }) => kind === 'elite').map(({ node }) => node)).toEqual([5, 10, 15])
    expect(primalMapLayout.points.find(({ kind }) => kind === 'boss')?.node).toBe(20)
  })

  it('garde les niveaux futurs inaccessibles et lance le combat du niveau courant', () => {
    persistSave(establishedKargSave())
    render(<App/>)
    fireEvent.click(screen.getByRole('button', { name: /CAMPAGNE.*AVENTURE/ }))
    const locked = screen.getByRole('button', { name: 'Niveau 2 · Combat standard · verrouillé' }) as HTMLButtonElement
    expect(locked.disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Niveau 1 · Combat standard · prochain combat' }))
    expect(screen.getByText('NIVEAU 1')).toBeTruthy()
  })
})
