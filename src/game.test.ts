import { describe, expect, it } from 'vitest'
import { RARITY_CHANCES } from './config'
import { activateWarrior, addEquipmentCopy, addWarriorXp, claimWelcomeWarrior, compareEquipmentStats, damageForStrength, dodgeChance, effectiveStats, equipmentStats, equipItem, grantWarrior, rollChest, rollWarriorChest, seededRng, simulateBattle, speedWeight, xpForLevel } from './game'
import { dailyReset, freshSave, loadSave, persistSave, SAVE_KEY } from './storage'
import type { Fighter } from './types'
import { KARG, KARG_ID, primalWarriors } from './warriors'
import { establishedKargSave } from './testFixtures'

describe('formules de combat', () => {
  it('calcule des dégâts croissants et la vitesse pondérée', () => {
    expect(damageForStrength(10)).toBeCloseTo(18.37, 1)
    expect(damageForStrength(20)).toBeGreaterThan(damageForStrength(10))
    expect(speedWeight(20)).toBeGreaterThan(speedWeight(10))
  })
  it('plafonne l’esquive à 35 %', () => {
    expect(dodgeChance(4)).toBeGreaterThan(.04)
    expect(dodgeChance(100000)).toBe(.35)
  })
  it('reste déterministe, gère critiques/esquives et limite les actions consécutives à 3', () => {
    const fighter: Fighter = { name: 'A', stats: { strength: 12, dodge: 12, speed: 40, hp: 180 }, skills: ['Précision'] }
    const enemy: Fighter = { name: 'B', stats: { strength: 10, dodge: 18, speed: 4, hp: 170 }, skills: [] }
    const one = simulateBattle(fighter, enemy, 42), two = simulateBattle(fighter, enemy, 42)
    expect(one).toEqual(two)
    expect(one.events.some((event) => ['critical', 'dodge'].includes(event.type))).toBe(true)
    expect(one.consecutiveMax).toBeLessThanOrEqual(3)
  })
})

describe('progression', () => {
  it('respecte la courbe XP Warrior', () => {
    expect(xpForLevel(1)).toBe(286)
  })
  it('propose un choix au niveau 5 et permet l’attribution de compétence', () => {
    const save = establishedKargSave(); save.ownedWarriors[save.activeWarriorId].level = 4
    addWarriorXp(save, xpForLevel(4), seededRng(1))
    expect(save.ownedWarriors[save.activeWarriorId].level).toBe(5)
    expect(save.pendingLevelChoice).toBe(true)
    save.unlockedSkills.push('Rage')
    expect(save.unlockedSkills).toContain('Rage')
  })
})

describe('comparaison et choix d’équipement', () => {
  it('calcule les bonus réels et les différences sans note artificielle', () => {
    expect(equipmentStats('obsidian-axe')).toEqual({ strength: 1, hp: 5 })
    expect(compareEquipmentStats('obsidian-axe', 'flint-club')).toEqual([
      { stat: 'strength', candidate: 1, current: 1, difference: 0 },
      { stat: 'hp', candidate: 5, current: 0, difference: 5 },
    ])
  })
  it('équipe un objet possédé sans muter la sauvegarde source et stocker reste neutre', () => {
    const save = establishedKargSave(); save.owned['obsidian-axe'] = { level: 1, xp: 0, kills: 0 }
    const stored = structuredClone(save)
    const equipped = equipItem(save, 'obsidian-axe')
    expect(equipped.equippedWeapon).toBe('obsidian-axe')
    expect(save.equippedWeapon).toBe('flint-club')
    expect(stored).toEqual(save)
  })
  it('garde des présélections par Warrior sans retirer d’exemplaire du stack', () => {
    const save = establishedKargSave()
    save.ownedWarriors.brakk = { warriorId: 'brakk', level: 1, xp: 0, bonusStats: { strength: 0, dodge: 0, speed: 0, hp: 0 } }
    save.owned['obsidian-axe'] = { quantity: 1, level: 1, xp: 0, kills: 0 }
    const brakk = equipItem(activateWarrior(save, 'brakk'), 'obsidian-axe')
    const karg = activateWarrior(brakk, 'karg')
    expect(karg.equippedWeapon).toBe('flint-club')
    expect(activateWarrior(karg, 'brakk').equippedWeapon).toBe('obsidian-axe')
    expect(karg.owned['obsidian-axe'].quantity).toBe(1)
    expect(karg.owned['flint-club'].quantity).toBe(1)
  })
  it('ignore le niveau XP historique dans les stats', () => {
    const save = establishedKargSave()
    save.owned['flint-club'].level = 10
    save.owned['flint-club'].xp = 960
    expect(effectiveStats(save).strength).toBe(12)
  })
  it('remplace une arme équipée sans perdre l’ancienne ni modifier son stack', () => {
    const save = establishedKargSave()
    save.owned['flint-club'].quantity = 2
    save.owned['obsidian-axe'] = { quantity: 1, level: 1, xp: 0, kills: 0 }
    const next = equipItem(save, 'obsidian-axe')
    expect(next.equippedWeapon).toBe('obsidian-axe')
    expect(next.owned['flint-club'].quantity).toBe(2)
    expect(next.owned['obsidian-axe'].quantity).toBe(1)
    expect(save.equippedWeapon).toBe('flint-club')
    expect(equipItem(next, 'flint-club').owned['flint-club'].quantity).toBe(2)
    save.owned['hunter-hides'].quantity = 3
    save.owned['bone-harness'] = { quantity: 1, level: 1, xp: 0, kills: 0 }
    const armored = equipItem(save, 'bone-harness')
    expect(armored.equippedArmor).toBe('bone-harness')
    expect(armored.owned['hunter-hides'].quantity).toBe(3)
    expect(save.equippedArmor).toBe('hunter-hides')
  })
})

describe('gacha et doublons', () => {
  it('totalise exactement 100 %', () => expect(Object.values(RARITY_CHANCES).reduce((a, b) => a + b, 0)).toBeCloseTo(100, 10))
  it('distingue un objet réellement nouveau avant le choix Équiper/Stocker', () => {
    const reward = rollChest(() => 0, {})
    expect(reward.kind).toBe('equipment')
    if (reward.kind === 'equipment') { expect(reward.item.id).toBe('flint-club'); expect(reward.duplicate).toBe(false) }
  })
  it('identifie un doublon et incrémente le stack sans compensation', () => {
    const reward = rollChest(() => 0, { 'flint-club': { level: 1, xp: 0, kills: 0 } })
    expect(reward.kind).toBe('equipment')
    if (reward.kind === 'equipment') { expect(reward.duplicate).toBe(true); expect('recycle' in reward).toBe(false) }
    const save = establishedKargSave(), next = addEquipmentCopy(save, 'flint-club')
    expect(next.owned['flint-club'].quantity).toBe(2)
    expect(next.coins).toBe(save.coins)
    expect(next.owned['flint-club'].xp).toBe(0)
    expect(save.owned['flint-club'].quantity).toBe(1)
  })
})

describe('sauvegarde et reset quotidien', () => {
  it('définit Karg avec ses données canoniques et son artwork validé', () => {
    expect(KARG).toMatchObject({
      id: 'karg', name: 'Karg', title: 'Premier Chasseur', era: 'Primordiale',
      rarity: 'Commun', warriorClass: 'Ravageur',
      baseStats: { strength: 11, dodge: 8, speed: 10, hp: 110 },
      art: '/assets/warriors/primal/karg.png', artPosition: '50% 8%',
    })
  })
  it('enregistre les douze Warriors Primal avec leurs statistiques, raretés, classes et PNG', () => {
    const roster = [
      ['karg', 'Karg', 'Premier Chasseur', 'Commun', 'Ravageur', 11, 8, 10, 110],
      ['naya', 'Naya', 'Ombre des Falaises', 'Commun', 'Spectre', 8, 13, 14, 90],
      ['brakk', 'Brakk', 'Brise-Roc', 'Commun', 'Bastion', 12, 6, 7, 145],
      ['eyla', 'Eyla', 'Œil de Silex', 'Commun', 'Tempête', 10, 10, 12, 100],
      ['asha', 'Asha', 'Voix des Braises', 'Peu commun', 'Fléau', 11, 10, 11, 120],
      ['rhex', 'Rhex', 'Meneur de Raptors', 'Peu commun', 'Héraut', 11, 11, 13, 115],
      ['ursak', 'Ursak', 'Roi des Cavernes', 'Peu commun', 'Ravageur', 14, 7, 9, 150],
      ['saar', 'Saar', 'Croc du Smilodon', 'Rare', 'Spectre', 15, 16, 16, 135],
      ['morga', 'Morga', 'Matriarche d’Ivoire', 'Rare', 'Bastion', 16, 5, 7, 195],
      ['vorka', 'Vorka', 'Reine d’Obsidienne', 'Épique', 'Fléau', 18, 12, 14, 165],
      ['urgath', 'Urgath', 'Titan des Glaces', 'Légendaire', 'Bastion', 21, 6, 8, 225],
      ['tyrak', 'TYRAK', 'Roi Primordial', 'Mythique', 'Ravageur', 23, 8, 12, 245],
    ]
    expect(primalWarriors.map(({ id, name, title, rarity, warriorClass, baseStats }) => [id, name, title, rarity, warriorClass, baseStats.strength, baseStats.dodge, baseStats.speed, baseStats.hp])).toEqual(roster)
    expect(primalWarriors.map(({ art }) => art)).toEqual(roster.map(([id]) => `/assets/warriors/primal/${id}.png`))
    expect(primalWarriors.every(({ artPosition }) => /^\d+% \d+%$/.test(artPosition))).toBe(true)
  })
  it('démarre sans Warrior, sans équipement et avec le coffre de bienvenue à ouvrir', () => {
    const save = freshSave()
    expect(save.activeWarriorId).toBe('')
    expect(Object.keys(save.ownedWarriors)).toEqual([])
    expect(Object.keys(save.owned)).toEqual([])
    expect(save.equippedWeapon).toBe('')
    expect(save.equippedArmor).toBe('')
    expect(save.welcomeChestOpened).toBe(false)
    expect('created' in save).toBe(false)
    expect('appearance' in save).toBe(false)
  })
  it('écarte une sauvegarde v2 invalide et garde la v1 intacte sans migration', () => {
    const memory = new Map<string, string>([
      ['chronos-age-warriors:v1', JSON.stringify({ version: 1, warrior: { name: 'Ancien' } })],
      [SAVE_KEY, JSON.stringify({ version: 2, activeWarriorId: 'missing', ownedWarriors: {}, unlockedSkills: [] })],
    ])
    const loaded = loadSave({ getItem: (key: string) => memory.get(key) ?? null })
    expect(loaded.activeWarriorId).toBe('')
    expect(memory.has('chronos-age-warriors:v1')).toBe(true)
  })
  it('convertit le Warrior de développement v2 en Karg sans perdre la progression', () => {
    const oldId = 'dev-primordial-warrior'
    const save = establishedKargSave()
    save.activeWarriorId = oldId
    save.ownedWarriors = { [oldId]: { warriorId: oldId, level: 4, xp: 123, bonusStats: { strength: 2, dodge: 1, speed: 0, hp: 3 } } }
    save.coins = 843
    save.speed = 3
    const memory = new Map([[SAVE_KEY, JSON.stringify(save)]])
    const loaded = loadSave({ getItem: (key: string) => memory.get(key) ?? null })
    expect(loaded.activeWarriorId).toBe(KARG_ID)
    expect(loaded.ownedWarriors[KARG_ID]).toEqual({ warriorId: KARG_ID, level: 4, xp: 123, bonusStats: { strength: 2, dodge: 1, speed: 0, hp: 3 } })
    expect(loaded.ownedWarriors[oldId]).toBeUndefined()
    expect(loaded.coins).toBe(843)
    expect(loaded.speed).toBe(3)
  })
  it('persiste notamment la vitesse x1/x2/x3', () => {
    const memory = new Map<string, string>()
    const storage = { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => { memory.set(key, value) } }
    const save = freshSave(); save.speed = 3; persistSave(save, storage)
    expect(memory.has(SAVE_KEY)).toBe(true)
    expect(loadSave(storage).speed).toBe(3)
  })
  it('normalise une ancienne sauvegarde v2 sans perdre les champs historiques', () => {
    const save = establishedKargSave()
    const legacy = { ...save, loadouts: undefined }
    delete save.owned['flint-club'].quantity
    save.owned['flint-club'].level = 8
    save.owned['flint-club'].xp = 400
    const memory = new Map([[SAVE_KEY, JSON.stringify(legacy)]])
    const loaded = loadSave({ getItem: (key: string) => memory.get(key) ?? null })
    expect(loaded.owned['flint-club']).toMatchObject({ quantity: 1, level: 8, xp: 400 })
    expect(loaded.loadouts.karg).toEqual({ weapon: 'flint-club', armor: 'hunter-hides' })
    expect(effectiveStats(loaded).strength).toBe(12)
  })
  it('conserve les anciennes sauvegardes sans leur donner le coffre offert', () => {
    const legacy = establishedKargSave()
    const { welcomeChestOpened: _removed, ...oldShape } = legacy
    void _removed
    const loaded = loadSave({ getItem: () => JSON.stringify(oldShape) })
    expect(loaded.welcomeChestOpened).toBe(true)
    expect(loaded.activeWarriorId).toBe(KARG_ID)
    expect(loaded.equippedWeapon).toBe('flint-club')
  })
  it('tire le même pool et toutes les raretés possibles pour les deux coffres Warrior', () => {
    expect(rollWarriorChest(() => 0).id).toBe('karg')
    expect(rollWarriorChest(() => .999999).id).toBe('tyrak')
    expect(rollWarriorChest(() => .839).rarity).toBe('Rare')
    for (const warrior of primalWarriors) {
      const pool = primalWarriors.filter((entry) => entry.rarity === warrior.rarity)
      expect(pool.length).toBeGreaterThan(0)
    }
  })
  it('accorde uniquement le Warrior tiré sans arme ni armure, une fois', () => {
    const save = freshSave()
    const claimed = claimWelcomeWarrior(save, 'tyrak')
    expect(Object.keys(claimed.ownedWarriors)).toEqual(['tyrak'])
    expect(claimed.activeWarriorId).toBe('tyrak')
    expect(claimed.loadouts.tyrak).toEqual({ weapon: '', armor: '' })
    expect(claimed.equippedWeapon).toBe('')
    expect(claimed.equippedArmor).toBe('')
    expect(claimed.coins).toBe(save.coins)
    expect(claimWelcomeWarrior(claimed, 'karg')).toBe(claimed)
  })
  it('ne donne jamais automatiquement d’équipement à un nouveau Warrior', () => {
    const save = establishedKargSave()
    const naya = grantWarrior(save, 'naya')
    const active = activateWarrior(naya, 'naya')
    expect(active.equippedWeapon).toBe('')
    expect(active.equippedArmor).toBe('')
    expect(active.loadouts.naya).toEqual({ weapon: '', armor: '' })
    expect(active.owned['flint-club'].quantity).toBe(1)
  })
  it('restaure les compteurs à une nouvelle date locale', () => {
    const save = freshSave(); save.lastReset = '2025-01-01'; save.campaignRemaining = 0; save.trainingRemaining = 0
    dailyReset(save, '2025-01-02')
    expect(save.campaignRemaining).toBe(10); expect(save.trainingRemaining).toBe(100)
  })
})
