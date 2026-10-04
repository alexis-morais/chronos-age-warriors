import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { WarriorDetail } from './components/WarriorDetail'
import { activateWarrior, effectiveStats, equipItem, getEffectiveWarriorStats, grantWarrior, simulateBattle } from './game'
import { loadSave, persistSave } from './storage'
import { establishedKargSave } from './testFixtures'
import { duelFighter } from './duelRules'
import { getWarriorLevelStats } from './warriorProgression'
import type { SaveData } from './types'

const career = () => {
  const save = grantWarrior(establishedKargSave(), 'naya')
  save.ownedWarriors.karg.level = 6 // 20 Force, unchanged early progression.
  for (const id of ['obsidian-axe', 'reed-mantle', 'hunter-bow']) save.owned[id] = { quantity: 1, level: 1, xp: 0, kills: 0 }
  save.loadouts.naya = { weapon: 'hunter-bow', armor: 'reed-mantle' }
  return save
}
const readStats = (scope: HTMLElement) => Object.fromEntries(Array.from(scope.querySelectorAll('.warrior-stat')).map(entry => [entry.querySelector('dt span')!.textContent, Number(entry.querySelector('dd')!.textContent)]))
const hub = () => document.querySelector('.hub-warrior-stats') as HTMLElement
const details = (save: SaveData, id = 'karg') => <WarriorDetail save={save} warriorId={id} onClose={() => undefined} onActivate={() => undefined}/>

describe('V0.14.1 stats effectives — une source de vérité', () => {
  beforeEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/'); window.scrollTo = () => undefined })

  it('Hub 20+3=23 puis remplacement +7=27 immédiatement et après retour Collection', () => {
    persistSave(career())
    render(<App/> )
    expect(readStats(hub()).Force).toBe(23)
    fireEvent.click(screen.getByRole('button', { name: 'Collection' }))
    fireEvent.click(screen.getByRole('button', { name: 'Voir la fiche de Karg' }))
    expect(readStats(screen.getByRole('dialog', { name: 'Fiche de Karg' })).Force).toBe(23)
    fireEvent.click(screen.getByRole('button', { name: 'Fermer la fiche Warrior' }))
    fireEvent.click(screen.getByRole('button', { name: 'Équipements' }))
    fireEvent.click(screen.getByRole('button', { name: 'Équiper Hache d’obsidienne' }))
    fireEvent.click(screen.getByRole('button', { name: 'Warriors' }))
    fireEvent.click(screen.getByRole('button', { name: 'Voir la fiche de Karg' }))
    expect(readStats(screen.getByRole('dialog', { name: 'Fiche de Karg' })).Force).toBe(27)
    fireEvent.click(screen.getByRole('button', { name: 'Fermer la fiche Warrior' }))
    fireEvent.click(screen.getByRole('button', { name: 'Hub' }))
    expect(readStats(hub()).Force).toBe(27)
  })

  it('fiche ouverte recalculée au rerender, bonus PV/esquive et aucun proc permanent', () => {
    const save = career()
    const { rerender } = render(details(save))
    expect(readStats(screen.getByRole('dialog')).Force).toBe(23)
    const next = equipItem(equipItem(save, 'obsidian-axe'), 'reed-mantle')
    rerender(details(next))
    const base = getWarriorLevelStats('karg',6)
    expect(readStats(screen.getByRole('dialog'))).toEqual({ Force: 27, PV: base.hp+20+15, Esquive: base.dodge+4, Vitesse: base.speed })
  })

  it('fiche inactive utilise son propre loadout sans modifier la sauvegarde', () => {
    const save = career(), snapshot = structuredClone(save)
    render(details(save,'naya'))
    expect(readStats(screen.getByRole('dialog'))).toEqual({ Force: 12, PV: 105, Esquive: 17, Vitesse: 22 })
    expect(save).toEqual(snapshot)
    expect(effectiveStats(save).strength).toBe(23)
  })

  it('changement de Warrior puis restauration/reload conserve les stats et les deux presets', () => {
    let save = equipItem(career(),'obsidian-axe')
    save = activateWarrior(save,'naya')
    expect(effectiveStats(save)).toEqual(getEffectiveWarriorStats('naya',1,'hunter-bow','reed-mantle'))
    save = activateWarrior(save,'karg')
    persistSave(save)
    const reloaded = loadSave()
    expect(effectiveStats(reloaded).strength).toBe(27)
    expect(reloaded.loadouts).toEqual(save.loadouts)
    render(<App/> )
    expect(readStats(hub()).Force).toBe(27)
  })

  it('Hub suit immédiatement Karg → Naya → Karg via les vrais boutons Collection', () => {
    persistSave(career())
    render(<App/> )
    for (const [id,name,force,pv] of [['naya','Naya',12,105],['karg','Karg',23,229]] as const) {
      fireEvent.click(screen.getByRole('button',{name:'Collection'}))
      fireEvent.click(screen.getByRole('button',{name:`Voir la fiche de ${name}`}))
      const dialog=screen.getByRole('dialog')
      expect(readStats(dialog).Force).toBe(effectiveStats(career(),id).strength)
      fireEvent.click(screen.getByRole('button',{name:'Définir comme Warrior actif'}))
      fireEvent.click(screen.getByRole('button',{name:'Hub'}))
      expect(readStats(hub()).Force).toBe(force)
      expect(readStats(hub()).PV).toBe(pv)
    }
  })

  it('retirer un slot conserve exclusivement le bonus de l’autre slot', () => {
    const save = career(), base = getWarriorLevelStats('karg',6)
    save.equippedWeapon = ''
    expect(effectiveStats(save)).toEqual({...base,hp:base.hp+30})
    save.equippedWeapon = 'flint-club'; save.equippedArmor = ''
    expect(effectiveStats(save)).toEqual({...base,strength:base.strength+3})
  })

  it('slots vides/objet non possédé rendent les stats de base dans Hub et Collection', () => {
    const save = career()
    save.equippedWeapon = ''; save.equippedArmor = ''
    save.loadouts.karg = { weapon: '', armor: '' }
    persistSave(save)
    const { unmount } = render(<App/> )
    expect(readStats(hub()).Force).toBe(20)
    expect(readStats(hub()).PV).toBe(199)
    unmount()
    render(details(save))
    expect(readStats(screen.getByRole('dialog')).Force).toBe(20)
    save.equippedWeapon = 'titan-heart'
    expect(effectiveStats(save)).toEqual(getWarriorLevelStats('karg',6))
  })

  it('combat applique +3 une seule fois et laisse les stats préparées immuables', () => {
    const save = career(), stats = effectiveStats(save)
    expect(duelFighter(save).stats).toEqual(stats)
    const player = { name: 'Karg', warriorId: 'karg', level: 6, stats, skills: [], weapon: save.equippedWeapon, armor: save.equippedArmor }
    const enemy = { name: 'Test', stats: { strength: 12, dodge: 8, speed: 10, hp: 1000 }, skills: [] }
    const result = simulateBattle(player,enemy,123)
    expect(stats.strength).toBe(23)
    expect(result).toEqual(simulateBattle({ ...player, stats: { ...getWarriorLevelStats('karg',6), strength: 23, hp: 229 } },enemy,123))
    expect(result).not.toEqual(simulateBattle({ ...player, stats: { ...stats, strength: 26 } },enemy,123))
    expect(stats).toEqual(effectiveStats(save))
  })
})
