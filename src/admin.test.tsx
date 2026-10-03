import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ADMIN_COINS, ADMIN_SAVE_KEY, canEnterCampaignNode, canOpenChest, canStartBattle, isLocalAdmin, withAdminAccess } from './admin'
import App from './App'
import { equipment } from './data'
import { persistSave, SAVE_KEY } from './storage'
import { establishedKargSave } from './testFixtures'
import { primalWarriors } from './warriors'

describe('mode admin local', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
    window.scrollTo = () => undefined
  })

  it('ne s’active que sur localhost ou 127.0.0.1 avec ?admin', () => {
    expect(isLocalAdmin({ hostname: 'localhost', search: '?admin' })).toBe(true)
    expect(isLocalAdmin({ hostname: '127.0.0.1', search: '?admin' })).toBe(true)
    expect(isLocalAdmin({ hostname: 'localhost', search: '' })).toBe(false)
    expect(isLocalAdmin({ hostname: 'chronos.example', search: '?admin' })).toBe(false)
    expect(isLocalAdmin({ hostname: 'localhost.example', search: '?admin' })).toBe(false)
  })

  it('complète dynamiquement le catalogue admin sans altérer les niveaux existants', () => {
    const save = establishedKargSave()
    save.coins = 0
    save.campaignRemaining = 0
    save.trainingRemaining = 0
    save.ownedWarriors.naya = { warriorId: 'naya', level: 4, xp: 19, bonusStats: { strength: 2, dodge: 0, speed: 0, hp: 0 } }
    save.owned['obsidian-axe'] = { level: 5, xp: 100, kills: 3 }
    const admin = withAdminAccess(save)
    expect(Object.keys(admin.ownedWarriors)).toHaveLength(primalWarriors.length)
    expect(Object.keys(admin.owned)).toHaveLength(equipment.length)
    expect(admin.ownedWarriors.naya).toEqual(save.ownedWarriors.naya)
    expect(admin.owned['obsidian-axe']).toEqual(save.owned['obsidian-axe'])
    expect(admin.coins).toBe(ADMIN_COINS)
    expect(admin.campaignRemaining).toBeGreaterThan(0)
    expect(admin.trainingRemaining).toBeGreaterThan(0)
    expect(save.coins).toBe(0)
    expect(Object.keys(save.ownedWarriors)).toHaveLength(2)
    expect(canOpenChest(save, false)).toBe(false)
    expect(canOpenChest(save, true)).toBe(true)
    expect(canStartBattle(save, 'training', false)).toBe(false)
    expect(canStartBattle(save, 'training', true)).toBe(true)
    expect(canEnterCampaignNode(save, 20, false)).toBe(false)
    expect(canEnterCampaignNode(save, 20, true)).toBe(true)
  })

  it('garde la progression réelle intacte lors de la sélection et sauvegarde admin', () => {
    const normal = establishedKargSave()
    normal.coins = 17
    persistSave(normal)
    const original = localStorage.getItem(SAVE_KEY)
    window.history.replaceState({}, '', '/?admin')
    const { container: adminContainer, unmount } = render(<App/>)
    expect(screen.getByText('ADMIN LOCAL')).toBeTruthy()
    expect(adminContainer.querySelector('.currency strong')?.textContent).toBe(String(ADMIN_COINS))
    fireEvent.click(screen.getByRole('button', { name: 'Collection' }))
    expect(screen.getAllByRole('button', { name: /Voir la fiche de/ })).toHaveLength(primalWarriors.length)
    fireEvent.click(screen.getByRole('button', { name: 'Voir la fiche de TYRAK' }))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Fiche de TYRAK' })).getByRole('button', { name: 'Définir comme Warrior actif' }))
    expect(JSON.parse(localStorage.getItem(ADMIN_SAVE_KEY)!).activeWarriorId).toBe('tyrak')
    expect(localStorage.getItem(SAVE_KEY)).toBe(original)
    unmount()

    window.history.replaceState({}, '', '/')
    const { container } = render(<App/>)
    expect(screen.queryByText('ADMIN LOCAL')).toBeNull()
    expect(container.querySelector('.hero-name')?.textContent).toContain('Karg')
    expect(container.querySelector('.currency strong')?.textContent).toBe('17')
    expect(localStorage.getItem(SAVE_KEY)).toBe(original)
  })

  it('ouvre directement un vrai combat QA local sans écrire dans les sauvegardes', async () => {
    persistSave(establishedKargSave())
    persistSave(establishedKargSave(), localStorage, ADMIN_SAVE_KEY)
    const normal = localStorage.getItem(SAVE_KEY), admin = localStorage.getItem(ADMIN_SAVE_KEY)
    window.history.replaceState({}, '', '/?admin&desktopCombatPreview&qaNode=9')
    const { unmount } = render(<App/>)
    expect(screen.getByText('NIVEAU 9')).toBeTruthy()
    expect(screen.getByRole('img', { name: /karg, animation idle/ })).toBeTruthy()
    expect(screen.getByRole('group', { name: 'Vitesse du combat' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '×3' }))
    expect(screen.getByRole('button', { name: '×3' }).getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: '×1' }))
    expect(screen.getByRole('button', { name: '×1' }).getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Passer' }))
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Résultat du combat' })).toBeTruthy())
    expect(screen.queryByText(/nœud/i)).toBeNull()
    expect(screen.getByText(/Niveau 9 (terminé|à retenter)/)).toBeTruthy()
    expect(localStorage.getItem(SAVE_KEY)).toBe(normal)
    expect(localStorage.getItem(ADMIN_SAVE_KEY)).toBe(admin)
    unmount()

    window.history.replaceState({}, '', '/?desktopCombatPreview')
    render(<App/>)
    expect(screen.queryByText('NIVEAU 1')).toBeNull()
    expect(screen.getByRole('button', { name: /CAMPAGNE.*AVENTURE/ })).toBeTruthy()
  })

  it('isole la prévisualisation des sprites et sa pose sélectionnée des sauvegardes', () => {
    persistSave(establishedKargSave())
    persistSave(establishedKargSave(), localStorage, ADMIN_SAVE_KEY)
    const normal = localStorage.getItem(SAVE_KEY), admin = localStorage.getItem(ADMIN_SAVE_KEY)
    window.history.replaceState({}, '', '/?admin&spritePreview&qaWarrior=naya&qaAnimation=attack%2Bfx&qaSpeed=3')
    const { unmount } = render(<App/>)
    expect(screen.getByRole('heading', { name: 'Primal Sprite Preview' })).toBeTruthy()
    expect(screen.getByRole('img', { name: 'naya, animation attack' })).toBeTruthy()
    expect(document.querySelector('.sprite-preview-stage .warrior-attack-fx')?.getAttribute('style')).toContain('/naya/attack-fx.png')
    expect(screen.getByRole('link', { name: '×3' }).getAttribute('aria-current')).toBe('page')
    expect(localStorage.getItem(SAVE_KEY)).toBe(normal)
    expect(localStorage.getItem(ADMIN_SAVE_KEY)).toBe(admin)
    unmount()
    window.history.replaceState({}, '', '/?admin&spritePreview&qaWarrior=naya&qaAnimation=ko')
    render(<App/>)
    expect(screen.getByRole('img', { name: 'naya, animation ko' })).toBeTruthy()
    expect(localStorage.getItem(SAVE_KEY)).toBe(normal)
    expect(localStorage.getItem(ADMIN_SAVE_KEY)).toBe(admin)
  })

  it('ne réactive plus le choix legacy via son ancienne URL QA', () => {
    const adminSave = establishedKargSave()
    persistSave(adminSave, localStorage, ADMIN_SAVE_KEY)
    const original = localStorage.getItem(ADMIN_SAVE_KEY)
    window.history.replaceState({}, '', '/?admin&qaLevelChoice&qaWarrior=karg')
    const { unmount } = render(<App/>)
    expect(screen.queryByRole('dialog', { name: 'Faveur du niveau' })).toBeNull()
    expect(screen.getByText('Passifs du Warrior')).toBeTruthy()
    expect(localStorage.getItem(ADMIN_SAVE_KEY)).toBe(original)
    unmount()
  })
})
