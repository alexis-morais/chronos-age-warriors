import { GAME, RARITY_CHANCES, rarityOrder } from './config'
import { equipment } from './data'
import type { BattleResult, Fighter, OwnedEquipment, Rarity, SaveData, Stats } from './types'
import { activeWarrior, primalWarriors, warriorDefinitions } from './warriors'
import { xpForLevel } from './warriorProgression'
import { WarriorPassiveRuntime } from './warriorPassives'
import { primalEnemyStats } from './primalEnemyBalance'
export { xpForLevel } from './warriorProgression'

export type Rng = () => number

export function seededRng(seed: number): Rng {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const damageForStrength = (strength: number) => GAME.baseDamage + GAME.strengthScale * strength ** GAME.strengthExponent
export const dodgeChance = (dodge: number) => Math.min(GAME.dodgeCap, GAME.dodgeBase + GAME.dodgeScale * dodge / (dodge + 100))
export const speedWeight = (speed: number) => (speed + GAME.speedOffset) ** GAME.speedExponent

export function equipmentStats(id: string): Partial<Stats> {
  const stats: Partial<Stats> = {}
  const add = (key: keyof Stats, value: number) => { stats[key] = (stats[key] ?? 0) + value }
  if (id === 'flint-club') add('strength', 1)
  if (id === 'bone-spear') add('speed', 1)
  if (['obsidian-axe', 'bone-harness'].includes(id)) { add('strength', 1); add('hp', 5) }
  if (id === 'hunter-bow') { add('speed', 1); add('hp', 5) }
  if (id === 'smilodon-fangs') { add('strength', 1); add('speed', 1) }
  if (['mammoth-spear', 'mammoth-plate'].includes(id)) { add('strength', 1); add('hp', 10) }
  if (id === 'volcanic-hammer') { add('strength', 2); add('hp', 5) }
  if (id === 'volcanic-shell') { add('strength', 1); add('hp', 15) }
  if (id === 'tyrant-claw') { add('strength', 2); add('speed', 1) }
  if (id === 'titan-heart') { add('strength', 2); add('speed', 1); add('hp', 5) }
  if (id === 'hunter-hides') add('hp', 10)
  if (id === 'white-titan-fur') { add('strength', 1); add('hp', 20) }
  if (id === 'primordial-titan-skin') { add('dodge', 1); add('hp', 25) }
  return stats
}

export function compareEquipmentStats(candidateId: string, currentId: string) {
  const candidate = equipmentStats(candidateId), current = equipmentStats(currentId)
  return (['strength', 'dodge', 'speed', 'hp'] as (keyof Stats)[]).map((stat) => ({ stat, candidate: candidate[stat] ?? 0, current: current[stat] ?? 0, difference: (candidate[stat] ?? 0) - (current[stat] ?? 0) })).filter(({ candidate: value, current: old }) => value !== 0 || old !== 0)
}

export function equipItem(save: SaveData, itemId: string): SaveData {
  const item = equipment.find((entry) => entry.id === itemId)
  if (!item || !save.owned[itemId]) return save
  const next = structuredClone(save)
  if (item.type === 'weapon') next.equippedWeapon = itemId
  else next.equippedArmor = itemId
  next.loadouts ??= {}
  next.loadouts[next.activeWarriorId] = { weapon: next.equippedWeapon, armor: next.equippedArmor }
  return next
}

/** A stack includes its equipped copy; loadouts are presets, not reservations. */
export function addEquipmentCopy(save: SaveData, itemId: string): SaveData {
  if (!equipment.some((item) => item.id === itemId)) return save
  const next = structuredClone(save)
  next.owned[itemId] ??= { quantity: 0, level: 1, xp: 0, kills: 0 }
  next.owned[itemId].quantity = (next.owned[itemId].quantity ?? 1) + 1
  return next
}

export function activateWarrior(save: SaveData, warriorId: string): SaveData {
  if (!save.ownedWarriors[warriorId]) return save
  const next = structuredClone(save)
  next.loadouts ??= {}
  if (next.activeWarriorId) next.loadouts[next.activeWarriorId] = { weapon: next.equippedWeapon, armor: next.equippedArmor }
  next.activeWarriorId = warriorId
  const selected = next.loadouts[warriorId]
  next.equippedWeapon = selected?.weapon && next.owned[selected.weapon] ? selected.weapon : ''
  next.equippedArmor = selected?.armor && next.owned[selected.armor] ? selected.armor : ''
  next.loadouts[warriorId] = { weapon: next.equippedWeapon, armor: next.equippedArmor }
  return next
}

/** The first copy of a Warrior has no gear, regardless of inventory contents. */
export function grantWarrior(save: SaveData, warriorId: string): SaveData {
  if (!warriorDefinitions[warriorId]) return save
  const next = structuredClone(save)
  if (!next.ownedWarriors[warriorId]) {
    next.ownedWarriors[warriorId] = { warriorId, level: 1, xp: 0 }
    next.loadouts[warriorId] = { weapon: '', armor: '' }
  }
  return next.activeWarriorId ? next : activateWarrior(next, warriorId)
}

/** Shared by the paid Warrior chest and the free first-arrival chest. */
export function rollWarriorChest(rng: Rng) {
  const rarity = rollRarity(rng)
  const pool = primalWarriors.filter((warrior) => warrior.rarity === rarity)
  return pool[Math.floor(rng() * pool.length)]
}

export function claimWelcomeWarrior(save: SaveData, warriorId: string): SaveData {
  if (save.welcomeChestOpened || Object.keys(save.ownedWarriors).length > 0) return save
  const next = grantWarrior(save, warriorId)
  if (next === save) return save
  next.welcomeChestOpened = true
  return next
}

export function effectiveStats(save: SaveData): Stats {
  const result = { ...activeWarrior(save).stats }
  const apply = (id: string) => {
    const owned = save.owned[id]
    if (!owned) return
    const bonuses = equipmentStats(id)
    for (const [key, value] of Object.entries(bonuses) as [keyof Stats, number][]) result[key] += value
  }
  apply(save.equippedWeapon)
  apply(save.equippedArmor)
  return result
}

function owns(fighter: Fighter, skill: string) { return fighter.skills.includes(skill) }

export function simulateBattle(player: Fighter, enemy: Fighter, seed: number): BattleResult {
  const rng = seededRng(seed)
  const passives = new WarriorPassiveRuntime(player.warriorId, player.level)
  let playerHp = player.stats.hp
  let enemyHp = enemy.stats.hp
  let previous: 'player' | 'enemy' | null = null
  let consecutive = 0
  let consecutiveMax = 0
  let turns = 0
  let playerAttacks = 0
  let enemyAttacks = 0
  let playerSecondWind = false
  let enemySecondWind = false
  let playerBleed = 0
  let enemyBleed = 0
  let vorkaBleedTicks = 0
  let vorkaBleedDamage = 0
  const events: BattleResult['events'] = []
  const hp = () => ({ playerHp: Math.max(0, Math.round(playerHp)), enemyHp: Math.max(0, Math.round(enemyHp)) })

  while (playerHp > 0 && enemyHp > 0 && turns < 160) {
    turns += 1
    if (vorkaBleedTicks > 0) {
      enemyHp -= vorkaBleedDamage
      vorkaBleedTicks--
      events.push({ type: 'bleed', actor: 'player', target: 'enemy', value: vorkaBleedDamage, label: 'Saignement', ...hp() })
      if (enemyHp <= 0) break
    }
    const pWeight = speedWeight(player.stats.speed) * (owns(player, 'Accélération') ? 1.12 : 1) * passives.actionRateMultiplier()
    const eWeight = speedWeight(enemy.stats.speed) * (owns(enemy, 'Accélération') ? 1.12 : 1) * passives.opponentRateMultiplier()
    let actor: 'player' | 'enemy' = rng() < pWeight / (pWeight + eWeight) ? 'player' : 'enemy'
    if (actor === previous && consecutive >= GAME.maxConsecutiveActions) actor = actor === 'player' ? 'enemy' : 'player'
    consecutive = actor === previous ? consecutive + 1 : 1
    consecutiveMax = Math.max(consecutiveMax, consecutive)
    previous = actor
    if (actor === 'player') passives.onAction()
    const target = actor === 'player' ? 'enemy' : 'player'
    const attacker = actor === 'player' ? player : enemy
    const defender = actor === 'player' ? enemy : player
    const attackCount = actor === 'player' ? ++playerAttacks : ++enemyAttacks
    events.push({ type: 'attack', actor, target, ...hp() })

    const hitChance = owns(attacker, 'Précision') ? 0.05 : 0
    const baseDodge = Math.max(0, dodgeChance(defender.stats.dodge) - hitChance)
    const finalDodge = target === 'player' ? passives.dodgeChance(baseDodge, GAME.dodgeCap) : baseDodge
    if (rng() < finalDodge) {
      events.push({ type: 'dodge', actor: target, target: actor, label: 'Esquive', ...hp() })
      if (target === 'player') passives.onDodge()
      else passives.onMiss()
      continue
    }
    if (target === 'player' && passives.blockChance() > 0 && rng() < passives.blockChance()) {
      passives.onBlock()
      events.push({ type: 'skill', actor: 'player', target: 'enemy', label: 'Parade', ...hp() })
      continue
    }
    let damage = damageForStrength(attacker.stats.strength) * (0.9 + rng() * 0.2)
    if (attackCount === 1 && owns(attacker, 'Premier Sang')) damage *= 1.22
    if (owns(attacker, 'Frappe Dévastatrice') && rng() < 0.12) { damage *= 1.45; events.push({ type: 'skill', actor, target, label: 'Frappe Dévastatrice', ...hp() }) }
    if (owns(attacker, 'Rage')) damage *= 1 + (1 - (actor === 'player' ? playerHp / player.stats.hp : enemyHp / enemy.stats.hp)) * 0.22
    if (owns(attacker, 'Opportuniste') && (target === 'player' ? playerHp / player.stats.hp : enemyHp / enemy.stats.hp) < 0.3) damage *= 1.25
    if (attacker.weapon === 'flint-club' && rng() < 0.05) damage *= 1.2
    if (attacker.weapon === 'bone-spear' && attackCount === 1) damage *= 1.1
    if (attacker.weapon === 'tyrant-claw' && rng() < 0.12) damage *= 1.5
    if (attacker.weapon === 'titan-heart' && rng() < 0.07) damage *= 1.8
    const normalAttackDamage = damage
    const crit = rng() < GAME.criticalChance + (owns(attacker, 'Élan') ? 0.03 : 0)
    if (crit) { damage *= GAME.criticalMultiplier; events.push({ type: 'critical', actor, target, label: 'Critique', ...hp() }) }
    const passiveHit = actor === 'player' ? passives.onSuccessfulAttack(enemyHp, enemy.stats.hp, vorkaBleedTicks > 0 || enemyBleed > 0, rng) : null
    if (passiveHit) {
      damage *= passiveHit.multiplier
      for (const label of passiveHit.labels) events.push({ type: 'skill', actor, target, label, ...hp() })
      if (passiveHit.consumeBleed) { vorkaBleedTicks = 0; enemyBleed = 0 }
    }
    const offensiveDamage = damage
    if (owns(defender, 'Peau Dure')) damage *= 0.9
    if (owns(defender, 'Parade') && rng() < 0.1) { damage *= 0.55; events.push({ type: 'skill', actor: target, target: actor, label: 'Parade', ...hp() }) }
    if (defender.armor === 'hunter-hides' && attackCount === 1) damage *= 0.95
    if (defender.armor === 'bone-harness' && rng() < 0.05) damage *= 0.75
    if (defender.armor === 'white-titan-fur' && (target === 'player' ? playerHp / player.stats.hp : enemyHp / enemy.stats.hp) > 0.5) damage *= 0.92
    if (defender.armor === 'primordial-titan-skin' && attackCount <= 3) damage *= 0.8
    if (target === 'player') damage *= passives.incomingMultiplier(playerHp, player.stats.hp)
    const bonusStrikeBasis = normalAttackDamage * damage / offensiveDamage
    damage = Math.max(1, Math.round(damage))
    if (target === 'player') playerHp -= damage; else enemyHp -= damage
    events.push({ type: 'damage', actor, target, value: damage, ...hp() })
    if (target === 'player') {
      const reaction = passives.onDamageTaken(playerHp, player.stats.hp)
      if (reaction.heal > 0) {
        const beforeHeal = Math.max(0, playerHp)
        playerHp = Math.min(player.stats.hp, beforeHeal + reaction.heal)
        events.push({ type: 'heal', actor: 'player', target: 'player', value: playerHp - beforeHeal, label: 'Endurance de Matriarche', ...hp() })
      }
      for (const label of reaction.labels) events.push({ type: 'skill', actor: 'player', target: 'player', label, ...hp() })
      passives.updateThresholds(playerHp, player.stats.hp)
    }
    if (passiveHit?.applyBleed && enemyHp > 0) { vorkaBleedTicks = 2; vorkaBleedDamage = Math.max(1, Math.round(damage * .10)) }
    if (passiveHit?.bonusStrikes.length && enemyHp > 0) {
      for (const portion of passiveHit.bonusStrikes) {
        if (enemyHp <= 0) break
        const extraDamage = Math.max(1, Math.round(bonusStrikeBasis * portion))
        events.push({ type: 'attack', actor: 'player', target: 'enemy', label: 'Coup supplémentaire', ...hp() })
        enemyHp -= extraDamage
        events.push({ type: 'damage', actor: 'player', target: 'enemy', value: extraDamage, ...hp() })
      }
    }
    if (owns(attacker, 'Vampirisme')) {
      const heal = Math.max(1, Math.round(damage * 0.08))
      if (actor === 'player') playerHp = Math.min(player.stats.hp, playerHp + heal); else enemyHp = Math.min(enemy.stats.hp, enemyHp + heal)
      events.push({ type: 'heal', actor, target: actor, value: heal, label: 'Vampirisme', ...hp() })
    }
    const bleedChance = owns(attacker, 'Saignement') ? 0.12 : attacker.weapon === 'obsidian-axe' ? 0.06 : 0
    if (rng() < bleedChance) { if (target === 'player') playerBleed = 2; else enemyBleed = 2; events.push({ type: 'skill', actor, target, label: 'Saignement', ...hp() }) }
    if (playerBleed > 0) { playerHp -= 3; playerBleed -= 1; events.push({ type: 'bleed', actor: 'enemy', target: 'player', value: 3, ...hp() }) }
    if (enemyBleed > 0) { enemyHp -= 3; enemyBleed -= 1; events.push({ type: 'bleed', actor: 'player', target: 'enemy', value: 3, ...hp() }) }
    if (playerHp <= 0 && owns(player, 'Second Souffle') && !playerSecondWind) { playerHp = Math.round(player.stats.hp * 0.18); playerSecondWind = true; events.push({ type: 'heal', actor: 'player', target: 'player', value: playerHp, label: 'Second Souffle', ...hp() }) }
    if (enemyHp <= 0 && owns(enemy, 'Second Souffle') && !enemySecondWind) { enemyHp = Math.round(enemy.stats.hp * 0.18); enemySecondWind = true; events.push({ type: 'heal', actor: 'enemy', target: 'enemy', value: enemyHp, label: 'Second Souffle', ...hp() }) }
    const extra = owns(attacker, 'Double Frappe') ? 0.1 : attacker.weapon === 'smilodon-fangs' ? 0.08 : 0
    if (rng() < extra && playerHp > 0 && enemyHp > 0) previous = null
  }
  const winner = enemyHp <= 0 ? 'player' : 'enemy'
  events.push({ type: 'ko', actor: winner, target: winner === 'player' ? 'enemy' : 'player', label: 'K.O.', ...hp() })
  return { winner, events, enemy, consecutiveMax }
}

export function generateEnemy(level: number, node = 0, rng: Rng = Math.random): Fighter {
  const boss = node === 20
  const trainingScale = 1 + level * 0.12
  return {
    name: node ? (['Ramasseur des brumes','Chasseur de cornes','Veilleuse des fougères','Pilleur de silex','Brak le Colossal','Traqueur des marais','Dompteuse de raptors','Gardien des os','Éclaireur du volcan','Ura la Balafrée','Briseur de défenses','Prêtresse du feu','Fils du Smilodon','Sentinelle noire','Korga Croc-de-Fer','Champion des cendres','Champion du tonnerre','Champion des abysses','Champion du Titan','Morgath, Roi Primordial'][node - 1]) : 'Guerrier errant',
    stats: node > 0 ? primalEnemyStats(node, rng) : { strength: Math.round((4 + rng() * 4) * trainingScale), dodge: Math.round((4 + rng() * 4) * trainingScale), speed: Math.round((4 + rng() * 4) * trainingScale), hp: Math.round((95 + rng() * 35) * trainingScale) },
    skills: node > 12 ? ['Peau Dure', ...(boss ? ['Frappe Dévastatrice', 'Second Souffle'] : [])] : [],
    weapon: boss ? 'mammoth-spear' : undefined,
    armor: boss ? 'mammoth-plate' : undefined,
  }
}

export function rollRarity(rng: Rng): Rarity {
  const roll = rng() * 100
  let total = 0
  for (const rarity of rarityOrder) { total += RARITY_CHANCES[rarity]; if (roll < total) return rarity }
  return 'Mythique'
}

export function rollChest(rng: Rng, owned: Record<string, OwnedEquipment>) {
  const rarity = rollRarity(rng)
  const pool = equipment.filter((item) => item.rarity === rarity)
  const item = pool[Math.floor(rng() * pool.length)]
  const duplicate = Boolean(owned[item.id])
  return { kind: 'equipment' as const, item, duplicate }
}

export function addWarriorXp(save: SaveData, amount: number, rng: Rng = Math.random) {
  const warrior = save.ownedWarriors[save.activeWarriorId]
  if (!warrior || warrior.level >= GAME.maxWarriorLevel || !Number.isFinite(amount) || amount <= 0) return 0
  warrior.xp += Math.trunc(amount)
  let levels = 0
  while (warrior.level < GAME.maxWarriorLevel && warrior.xp >= xpForLevel(warrior.level)) {
    warrior.xp -= xpForLevel(warrior.level)
    warrior.level += 1
    levels += 1
  }
  if (warrior.level >= GAME.maxWarriorLevel) warrior.xp = 0
  void rng
  return levels
}
