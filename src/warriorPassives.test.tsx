import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PassiveUnlockModal } from './App'
import { addWarriorXp, simulateBattle } from './game'
import type { Fighter } from './types'
import { establishedKargSave } from './testFixtures'
import { primalWarriors } from './warriors'
import { getWarriorLevelStats } from './warriorProgression'
import { getNewlyUnlockedWarriorPassives, getUnlockedWarriorPassives, getWarriorPassives, WarriorPassiveRuntime, warriorPassives } from './warriorPassives'

const hit = (runtime: WarriorPassiveRuntime, hp = 100, maxHp = 100, bleeding = false, roll = .99) =>
  runtime.onSuccessfulAttack(hp, maxHp, bleeding, () => roll)

describe('registre des 36 passifs uniques', () => {
  it('couvre exactement les 12 Warriors avec 3 IDs uniques et paliers 3/7/10', () => {
    expect(Object.keys(warriorPassives).sort()).toEqual(primalWarriors.map(({ id }) => id).sort())
    const all = Object.values(warriorPassives).flat()
    expect(all).toHaveLength(36)
    expect(new Set(all.map(({ id }) => id)).size).toBe(36)
    for (const warrior of primalWarriors) {
      const definitions = getWarriorPassives(warrior.id)
      expect(definitions.map(({ unlockLevel }) => unlockLevel)).toEqual([3, 7, 10])
      expect(definitions.every(({ name, description }) => name.length > 0 && description.length > 0)).toBe(true)
      for (const [level, count] of [[1,0],[2,0],[3,1],[6,1],[7,2],[9,2],[10,3]]) {
        expect(getUnlockedWarriorPassives(warrior.id, level)).toHaveLength(count)
      }
    }
  })

  it('regroupe les nouveaux passifs lors de plusieurs niveaux franchis', () => {
    expect(getNewlyUnlockedWarriorPassives('karg', 2, 3).map(({ name }) => name)).toEqual(['Premier Sang'])
    expect(getNewlyUnlockedWarriorPassives('karg', 3, 6)).toEqual([])
    expect(getNewlyUnlockedWarriorPassives('karg', 2, 8).map(({ unlockLevel }) => unlockLevel)).toEqual([3, 7])
    expect(getNewlyUnlockedWarriorPassives('karg', 1, 10).map(({ unlockLevel }) => unlockLevel)).toEqual([3, 7, 10])
  })

  it('déduit la notification d’une vraie montée de niveau, sans l’écrire en sauvegarde', () => {
    const save = establishedKargSave()
    save.ownedWarriors.karg.level = 2
    save.ownedWarriors.karg.xp = 179
    const before = save.ownedWarriors.karg.level
    addWarriorXp(save, 1)
    expect(save.ownedWarriors.karg.level).toBe(3)
    expect(getNewlyUnlockedWarriorPassives('karg', before, save.ownedWarriors.karg.level).map(({ name }) => name)).toEqual(['Premier Sang'])
    expect(JSON.stringify(save)).not.toContain('passive1Unlocked')
    const nextBefore = save.ownedWarriors.karg.level
    addWarriorXp(save, 300)
    expect(save.ownedWarriors.karg.level).toBe(4)
    expect(getNewlyUnlockedWarriorPassives('karg', nextBefore, save.ownedWarriors.karg.level)).toEqual([])
  })
})

describe('effets offensifs et tempo', () => {
  it('Karg : premier hit non consommé par miss, pression remise à zéro et grâce à 30 %', () => {
    const karg = new WarriorPassiveRuntime('karg', 10)
    karg.onMiss()
    expect(hit(karg).multiplier).toBeCloseTo(1.25)
    expect(hit(karg).multiplier).toBeCloseTo(1.06)
    expect(hit(karg).multiplier).toBeCloseTo(1.12)
    karg.onMiss()
    expect(karg.pressure).toBe(0)
    expect(hit(karg, 30).multiplier).toBeCloseTo(1.3)
    expect(hit(karg, 31).multiplier).toBeCloseTo(1.06)
    expect(new WarriorPassiveRuntime('karg', 2).onSuccessfulAttack(20, 100, false, () => 1).multiplier).toBe(1)
  })

  it('Naya : Pas d’Ombre seul avant niveau 7, puis esquive plafonnée et riposte unique après esquive', () => {
    const locked = new WarriorPassiveRuntime('naya', 6)
    expect(getUnlockedWarriorPassives('naya', 6).map(({ name }) => name)).toEqual(['Pas d’Ombre'])
    expect(locked.dodgeChance(.20, .35)).toBeCloseTo(.25)
    expect(locked.dodgeChance(.20, .35)).toBe(.20)
    locked.onDodge()
    expect(locked.actionRateMultiplier()).toBe(1)
    expect(hit(locked).multiplier).toBe(1)

    const levelSeven = new WarriorPassiveRuntime('naya', 7)
    expect(levelSeven.dodgeChance(.10, .35)).toBeCloseTo(.125)
    expect(levelSeven.dodgeChance(.10, .35)).toBeCloseTo(.20)
    expect(levelSeven.dodgeChance(.30, .35)).toBe(.35)
    levelSeven.onDodge()
    expect(levelSeven.actionRateMultiplier()).toBeCloseTo(1.30)
    levelSeven.onAction()
    expect(levelSeven.actionRateMultiplier()).toBe(1)
    levelSeven.onMiss() // A dodge or full block does not call onSuccessfulAttack.
    expect(hit(levelSeven).multiplier).toBeCloseTo(1.40)
    expect(hit(levelSeven).multiplier).toBe(1)

    const levelTen = new WarriorPassiveRuntime('naya', 10)
    levelTen.dodgeChance(.10, .35)
    levelTen.onDodge()
    levelTen.onDodge()
    expect(levelTen.actionRateMultiplier()).toBeCloseTo(1.60)
    expect(hit(levelTen).multiplier).toBeCloseTo(1.60) // +60 % replaces +40 %, never stacks.
    expect(hit(levelTen).multiplier).toBe(1)
    const nextBattle = new WarriorPassiveRuntime('naya', 10)
    expect(nextBattle.counterReady).toBe(false)
    expect(nextBattle.actionRateMultiplier()).toBe(1)
    expect(hit(nextBattle).multiplier).toBe(1)
    expect(getWarriorPassives('naya')[1].description).toContain('40 %')
    expect(getWarriorPassives('naya')[2].description).toContain('60 %')
  })

  it('Eyla : premier hit, troisième tir non récursif et flèche fatale unique', () => {
    const eyla = new WarriorPassiveRuntime('eyla', 10)
    expect(hit(eyla).multiplier).toBeCloseTo(1.20)
    expect(hit(eyla).bonusStrikes).toEqual([])
    expect(hit(eyla).bonusStrikes).toEqual([.45])
    expect(eyla.landedHits).toBe(3)
    expect(hit(eyla, 50).multiplier).toBeCloseTo(1.40)
    expect(hit(eyla, 45).multiplier).toBe(1)
    expect(hit(eyla).bonusStrikes).toEqual([.45])
  })

  it('Asha : trois Braises, consommation et crédit à la détonation niveau 10', () => {
    const asha = new WarriorPassiveRuntime('asha', 10)
    for (const count of [1,2,3]) { hit(asha); expect(asha.braise).toBe(count) }
    expect(hit(asha).multiplier).toBeCloseTo(1.50)
    expect(asha.braise).toBe(1)
    expect(asha.actionRateMultiplier()).toBeCloseTo(1.20)
    const mid = new WarriorPassiveRuntime('asha', 7)
    for (let index = 0; index < 3; index++) hit(mid)
    expect(hit(mid).multiplier).toBeCloseTo(1.30)
    expect(mid.actionRateMultiplier()).toBe(1)
  })

  it('Rhex : une puis deux morsures non récursives et relais de meute', () => {
    const atThree = new WarriorPassiveRuntime('rhex', 3)
    hit(atThree); hit(atThree)
    expect(hit(atThree).bonusStrikes).toEqual([.35])
    expect(atThree.landedHits).toBe(3)
    const atTen = new WarriorPassiveRuntime('rhex', 10)
    hit(atTen); hit(atTen)
    expect(hit(atTen).bonusStrikes).toEqual([.30, .30])
    expect(atTen.actionRateMultiplier()).toBeCloseTo(1.20)
    expect(hit(atTen).bonusStrikes).toEqual([])
  })

  it('Ursak : trois charges maximum, seuil 50 % et fureur unique sous 30 %', () => {
    const ursak = new WarriorPassiveRuntime('ursak', 10)
    for (let index = 0; index < 5; index++) ursak.onDamageTaken(70, 100)
    expect(ursak.fury).toBe(3)
    expect(ursak.incomingMultiplier(50, 100)).toBeCloseTo(.85)
    expect(hit(ursak).multiplier).toBeCloseTo(1.24)
    expect(ursak.fury).toBe(0)
    expect(ursak.onDamageTaken(30, 100).labels).toContain('Fureur ancestrale')
    expect(ursak.onDamageTaken(20, 100).labels).toEqual([])
    expect(ursak.actionRateMultiplier()).toBeCloseTo(1.15)
    expect(hit(ursak).multiplier).toBeCloseTo(1.16 * 1.20) // Two newly received Fury charges + permanent rage.
  })

  it('Saar : esquive, frénésie plafonnée/reset et contre-attaque', () => {
    const saar = new WarriorPassiveRuntime('saar', 10)
    saar.onDodge()
    expect(saar.actionRateMultiplier()).toBeCloseTo(1.25)
    expect(hit(saar).multiplier).toBeCloseTo(1.45)
    for (let index = 0; index < 3; index++) hit(saar)
    expect(saar.frenzy).toBe(3)
    saar.onAction()
    expect(saar.actionRateMultiplier()).toBeCloseTo(1.15)
    saar.onDamageTaken(90, 100)
    expect(saar.frenzy).toBe(0)
  })

  it('Vorka : RNG de saignement et coupure décisive consommatrice une seule fois', () => {
    const vorka = new WarriorPassiveRuntime('vorka', 10)
    expect(hit(vorka, 90, 100, false, .20).applyBleed).toBe(true)
    const cut = hit(vorka, 40, 100, true, .99)
    expect(cut.multiplier).toBeCloseTo(1.15 * 1.45)
    expect(cut.consumeBleed).toBe(true)
    expect(hit(vorka, 30, 100, true, .99).consumeBleed).toBe(false)
    expect(hit(new WarriorPassiveRuntime('vorka', 2), 30, 100, true, .01).applyBleed).toBe(false)
  })

  it('Urgath : Froid plafonné à trois charges, cadence adverse -15 %', () => {
    const urgath = new WarriorPassiveRuntime('urgath', 10)
    for (let index = 0; index < 5; index++) hit(urgath)
    expect(urgath.cold).toBe(3)
    expect(urgath.opponentRateMultiplier()).toBeCloseTo(.85)
    expect(new WarriorPassiveRuntime('urgath', 6).opponentRateMultiplier()).toBe(1)
  })

  it('Tyrak : sursaut 65 % unique, prochain coup et domination sous 35 %', () => {
    const tyrak = new WarriorPassiveRuntime('tyrak', 10)
    expect(tyrak.onDamageTaken(65, 100).labels).toContain('Sursaut cristallin')
    expect(tyrak.onDamageTaken(60, 100).labels).toEqual([])
    expect(tyrak.actionRateMultiplier()).toBeCloseTo(1.35)
    expect(hit(tyrak).multiplier).toBeCloseTo(1.30)
    expect(hit(tyrak).multiplier).toBe(1)
    tyrak.onDamageTaken(35, 100); tyrak.updateThresholds(35, 100)
    expect(tyrak.incomingMultiplier(35, 100)).toBeCloseTo(.88) // The first three guarded hits were already consumed.
    expect(hit(tyrak).multiplier).toBeCloseTo(1.25)
    const gated = new WarriorPassiveRuntime('tyrak', 6)
    gated.onDamageTaken(20, 100); gated.updateThresholds(20, 100)
    expect(gated.actionRateMultiplier()).toBe(1)
    expect(hit(gated).multiplier).toBe(1)
  })
})

describe('défenses et reset de combat', () => {
  it('Brakk : trois gardes, blocage/riposte et trois résistances après le seuil', () => {
    expect(new WarriorPassiveRuntime('brakk', 1).blockChance()).toBe(0)
    expect(new WarriorPassiveRuntime('brakk', 6).blockChance()).toBe(0)
    expect(new WarriorPassiveRuntime('brakk', 7).blockChance()).toBe(.12)
    expect(getWarriorPassives('brakk')[1].description).toContain('12 % de chance de bloquer entièrement')
    const brakk = new WarriorPassiveRuntime('brakk', 10)
    expect(brakk.blockChance()).toBe(.12)
    for (let index = 0; index < 3; index++) { expect(brakk.incomingMultiplier(100, 100)).toBeCloseTo(.88); brakk.onDamageTaken(90, 100) }
    expect(brakk.incomingMultiplier(90, 100)).toBe(1)
    brakk.onBlock(); brakk.onMiss()
    expect(hit(brakk).multiplier).toBeCloseTo(1.30)
    expect(hit(brakk).multiplier).toBe(1)
    expect(brakk.onDamageTaken(30, 100).labels).toContain('Dernière Résistance')
    for (let index = 0; index < 3; index++) expect(brakk.incomingMultiplier(30, 100)).toBeCloseTo(.65)
    expect(brakk.incomingMultiplier(30, 100)).toBe(1)
    expect(brakk.onDamageTaken(20, 100).labels).toEqual([])
  })

  it('Morga : quatre gardes, protection trois coups, soin plafonné et défense durable', () => {
    const morga = new WarriorPassiveRuntime('morga', 10)
    for (let index = 0; index < 4; index++) { expect(morga.incomingMultiplier(100, 100)).toBeCloseTo(.88); morga.onDamageTaken(90, 100) }
    expect(morga.onDamageTaken(60, 100).labels).toContain('Protection de la tribu')
    for (let index = 0; index < 3; index++) expect(morga.incomingMultiplier(60, 100)).toBeCloseTo(.80)
    expect(morga.incomingMultiplier(60, 100)).toBe(1)
    expect(morga.onDamageTaken(25, 100).heal).toBe(15)
    expect(morga.onDamageTaken(20, 100).heal).toBe(0)
    expect(morga.incomingMultiplier(20, 100)).toBeCloseTo(.85)
  })

  it('Urgath et Tyrak : amortissent leurs cinq/trois premiers impacts, puis seuils', () => {
    const urgath = new WarriorPassiveRuntime('urgath', 10)
    for (let index = 0; index < 5; index++) { expect(urgath.incomingMultiplier(100, 100)).toBeCloseTo(.88); urgath.onDamageTaken(90, 100) }
    expect(urgath.incomingMultiplier(40, 100)).toBeCloseTo(.80)
    const tyrak = new WarriorPassiveRuntime('tyrak', 3)
    for (let index = 0; index < 3; index++) { expect(tyrak.incomingMultiplier(100, 100)).toBeCloseTo(.90); tyrak.onDamageTaken(90, 100) }
    expect(tyrak.incomingMultiplier(100, 100)).toBe(1)
  })

  it('ne partage aucune charge entre deux combats du même Warrior', () => {
    const first = new WarriorPassiveRuntime('asha', 10)
    for (let index = 0; index < 3; index++) hit(first)
    first.credit(.20)
    const second = new WarriorPassiveRuntime('asha', 10)
    expect(second.braise).toBe(0)
    expect(second.actionCredit).toBe(0)
    const bleed = new WarriorPassiveRuntime('vorka', 10)
    hit(bleed, 100, 100, false, 0)
    expect(new WarriorPassiveRuntime('vorka', 10).decisiveCutUsed).toBe(false)
  })
})

describe('combat intégré et UI', () => {
  it('simule un vrai combat niveau 10 pour chacun des douze kits, sans récursion', () => {
    for (const warrior of primalWarriors) {
      const fighter: Fighter = { name: warrior.name, warriorId: warrior.id, level: 10, stats: getWarriorLevelStats(warrior.id, 10), skills: [] }
      const enemy: Fighter = { name: 'Cible', stats: { strength: 8, dodge: 10, speed: 10, hp: 500 }, skills: [] }
      const result = simulateBattle(fighter, enemy, 42)
      expect(result.events.at(-1)?.type).toBe('ko')
      expect(result.events.length).toBeLessThan(800)
      expect(simulateBattle(fighter, enemy, 42)).toEqual(result)
      expect(result.consecutiveMax).toBeLessThanOrEqual(3)
    }
  })

  it('les attaques bonus d’Eyla et Rhex restent bornées au nombre de coups principaux', () => {
    for (const warriorId of ['eyla', 'rhex']) {
      const fighter: Fighter = { name: warriorId, warriorId, level: 10, stats: getWarriorLevelStats(warriorId, 10), skills: [] }
      const enemy: Fighter = { name: 'Cible robuste', stats: { strength: 1, dodge: 0, speed: 1, hp: 10000 }, skills: [] }
      const events = simulateBattle(fighter, enemy, 42).events
      const bonus = events.filter((event) => event.type === 'attack' && event.label === 'Coup supplémentaire').length
      const main = events.filter((event) => event.type === 'attack' && event.actor === 'player' && event.label !== 'Coup supplémentaire').length
      expect(bonus).toBeGreaterThan(0)
      expect(bonus).toBeLessThanOrEqual(Math.floor(main / 3) * (warriorId === 'rhex' ? 2 : 1))
    }
  })

  it('montre un popup unique, lisible, pour un ou plusieurs passifs', () => {
    const onContinue = vi.fn()
    const passives = getWarriorPassives('karg')
    const { rerender } = render(<PassiveUnlockModal passives={[passives[0]]} onContinue={onContinue}/>)
    expect(screen.getByRole('dialog', { name: 'Passif débloqué' })).toBeTruthy()
    expect(screen.getByText('Premier Sang')).toBeTruthy()
    expect(screen.getByText(passives[0].description)).toBeTruthy()
    rerender(<PassiveUnlockModal passives={passives} onContinue={onContinue}/>)
    expect(screen.getByText('3 nouveaux passifs')).toBeTruthy()
    expect(screen.getAllByText(/NIVEAU (3|7|10)/)).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: 'CONTINUER' }))
    expect(onContinue).toHaveBeenCalledOnce()
  })
})
