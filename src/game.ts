import { DUPLICATE_REWARDS, EQUIPMENT_XP, GAME, RARITY_CHANCES, rarityOrder } from './config'
import { equipment, skills } from './data'
import type { BattleResult, Fighter, OwnedEquipment, Rarity, SaveData, StatKey, Stats } from './types'

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

export function initialStats(rng: Rng): Stats {
  const stats: Stats = { strength: 4, dodge: 4, speed: 4, hp: 100 }
  const spent: Record<StatKey, number> = { strength: 0, dodge: 0, speed: 0, hp: 0 }
  const keys: StatKey[] = ['strength', 'dodge', 'speed', 'hp']
  for (let i = 0; i < 8; i += 1) {
    const available = keys.filter((key) => spent[key] < 4)
    const key = available[Math.floor(rng() * available.length)]
    spent[key] += 1
    stats[key] += key === 'hp' ? 10 : 1
  }
  return stats
}

export const xpForLevel = (level: number) => Math.round(250 + 35 * level + 1.2 * level ** 2)
export const damageForStrength = (strength: number) => GAME.baseDamage + GAME.strengthScale * strength ** GAME.strengthExponent
export const dodgeChance = (dodge: number) => Math.min(GAME.dodgeCap, GAME.dodgeBase + GAME.dodgeScale * dodge / (dodge + 100))
export const speedWeight = (speed: number) => (speed + GAME.speedOffset) ** GAME.speedExponent

export function equipmentLevelFromXp(xp: number) {
  let remaining = xp
  let level = 1
  while (level < GAME.maxEquipmentLevel && remaining >= EQUIPMENT_XP[level]) {
    remaining -= EQUIPMENT_XP[level]
    level += 1
  }
  return { level, progress: remaining, needed: level === GAME.maxEquipmentLevel ? 0 : EQUIPMENT_XP[level] }
}

export function equipmentStats(id: string, level: number): Partial<Stats> {
  const stats: Partial<Stats> = {}
  const add = (key: keyof Stats, value: number) => { stats[key] = (stats[key] ?? 0) + value }
  if (id === 'flint-club') add('strength', level)
  if (id === 'bone-spear') add('speed', level)
  if (['obsidian-axe', 'bone-harness'].includes(id)) { add('strength', level); add('hp', 5 * level) }
  if (id === 'hunter-bow') { add('speed', level); add('hp', 5 * level) }
  if (id === 'smilodon-fangs') { add('strength', level); add('speed', level) }
  if (['mammoth-spear', 'mammoth-plate'].includes(id)) { add('strength', level); add('hp', 10 * level) }
  if (id === 'volcanic-hammer') { add('strength', 2 * level); add('hp', 5 * level) }
  if (id === 'volcanic-shell') { add('strength', level); add('hp', 15 * level) }
  if (id === 'tyrant-claw') { add('strength', 2 * level); add('speed', level) }
  if (id === 'titan-heart') { add('strength', 2 * level); add('speed', level); add('hp', 5 * level) }
  if (id === 'hunter-hides') add('hp', 10 * level)
  if (id === 'white-titan-fur') { add('strength', level); add('hp', 20 * level) }
  if (id === 'primordial-titan-skin') { add('dodge', level); add('hp', 25 * level) }
  return stats
}

export function compareEquipmentStats(candidateId: string, candidateLevel: number, currentId: string, currentLevel: number) {
  const candidate = equipmentStats(candidateId, candidateLevel), current = equipmentStats(currentId, currentLevel)
  return (['strength', 'dodge', 'speed', 'hp'] as (keyof Stats)[]).map((stat) => ({ stat, candidate: candidate[stat] ?? 0, current: current[stat] ?? 0, difference: (candidate[stat] ?? 0) - (current[stat] ?? 0) })).filter(({ candidate: value, current: old }) => value !== 0 || old !== 0)
}

export function equipItem(save: SaveData, itemId: string): SaveData {
  const item = equipment.find((entry) => entry.id === itemId)
  if (!item || !save.owned[itemId]) return save
  const next = structuredClone(save)
  if (item.type === 'weapon') next.equippedWeapon = itemId
  else next.equippedArmor = itemId
  return next
}

export function effectiveStats(save: SaveData): Stats {
  const result = { ...save.warrior.stats }
  const apply = (id: string) => {
    const owned = save.owned[id]
    if (!owned) return
    const bonuses = equipmentStats(id, owned.level)
    for (const [key, value] of Object.entries(bonuses) as [keyof Stats, number][]) result[key] += value
  }
  apply(save.equippedWeapon)
  apply(save.equippedArmor)
  return result
}

function owns(fighter: Fighter, skill: string) { return fighter.skills.includes(skill) }

export function simulateBattle(player: Fighter, enemy: Fighter, seed: number): BattleResult {
  const rng = seededRng(seed)
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
  const events: BattleResult['events'] = []
  const hp = () => ({ playerHp: Math.max(0, Math.round(playerHp)), enemyHp: Math.max(0, Math.round(enemyHp)) })

  while (playerHp > 0 && enemyHp > 0 && turns < 160) {
    turns += 1
    const pWeight = speedWeight(player.stats.speed) * (owns(player, 'Accélération') ? 1.12 : 1)
    const eWeight = speedWeight(enemy.stats.speed) * (owns(enemy, 'Accélération') ? 1.12 : 1)
    let actor: 'player' | 'enemy' = rng() < pWeight / (pWeight + eWeight) ? 'player' : 'enemy'
    if (actor === previous && consecutive >= GAME.maxConsecutiveActions) actor = actor === 'player' ? 'enemy' : 'player'
    consecutive = actor === previous ? consecutive + 1 : 1
    consecutiveMax = Math.max(consecutiveMax, consecutive)
    previous = actor
    const target = actor === 'player' ? 'enemy' : 'player'
    const attacker = actor === 'player' ? player : enemy
    const defender = actor === 'player' ? enemy : player
    const attackCount = actor === 'player' ? ++playerAttacks : ++enemyAttacks
    events.push({ type: 'attack', actor, target, ...hp() })

    const hitChance = owns(attacker, 'Précision') ? 0.05 : 0
    if (rng() < Math.max(0, dodgeChance(defender.stats.dodge) - hitChance)) {
      events.push({ type: 'dodge', actor: target, target: actor, label: 'Esquive', ...hp() })
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
    const crit = rng() < GAME.criticalChance + (owns(attacker, 'Élan') ? 0.03 : 0)
    if (crit) { damage *= GAME.criticalMultiplier; events.push({ type: 'critical', actor, target, label: 'Critique', ...hp() }) }
    if (owns(defender, 'Peau Dure')) damage *= 0.9
    if (owns(defender, 'Parade') && rng() < 0.1) { damage *= 0.55; events.push({ type: 'skill', actor: target, target: actor, label: 'Parade', ...hp() }) }
    if (defender.armor === 'hunter-hides' && attackCount === 1) damage *= 0.95
    if (defender.armor === 'bone-harness' && rng() < 0.05) damage *= 0.75
    if (defender.armor === 'white-titan-fur' && (target === 'player' ? playerHp / player.stats.hp : enemyHp / enemy.stats.hp) > 0.5) damage *= 0.92
    if (defender.armor === 'primordial-titan-skin' && attackCount <= 3) damage *= 0.8
    damage = Math.max(1, Math.round(damage))
    if (target === 'player') playerHp -= damage; else enemyHp -= damage
    events.push({ type: 'damage', actor, target, value: damage, ...hp() })
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
  const elite = node > 0 && [5, 10, 15].includes(node)
  const champion = node >= 16 && node < 20
  const boss = node === 20
  const scale = 1 + level * 0.12 + node * 0.055
  const wall = boss ? 1.85 : elite ? 1.35 : champion ? 1.48 : 1
  return {
    name: node ? (['Ramasseur des brumes','Chasseur de cornes','Veilleuse des fougères','Pilleur de silex','Brak le Colossal','Traqueur des marais','Dompteuse de raptors','Gardien des os','Éclaireur du volcan','Ura la Balafrée','Briseur de défenses','Prêtresse du feu','Fils du Smilodon','Sentinelle noire','Korga Croc-de-Fer','Champion des cendres','Champion du tonnerre','Champion des abysses','Champion du Titan','Morgath, Roi Primordial'][node - 1]) : 'Guerrier errant',
    stats: { strength: Math.round((4 + rng() * 4) * scale * wall), dodge: Math.round((4 + rng() * 4) * scale * wall), speed: Math.round((4 + rng() * 4) * scale * wall), hp: Math.round((95 + rng() * 35) * scale * wall) },
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

export function rollChest(rng: Rng, owned: Record<string, OwnedEquipment>, knownSkills: string[]) {
  const rarity = rollRarity(rng)
  if (rarity === 'Mythique' && rng() < GAME.mythicalSkillWeight && knownSkills.length < skills.length) {
    const pool = skills.filter((skill) => !knownSkills.includes(skill))
    return { kind: 'skill' as const, skill: pool[Math.floor(rng() * pool.length)], rarity }
  }
  const pool = equipment.filter((item) => item.rarity === rarity)
  const item = pool[Math.floor(rng() * pool.length)]
  const duplicate = Boolean(owned[item.id])
  return { kind: 'equipment' as const, item, duplicate, recycle: duplicate ? DUPLICATE_REWARDS[rarity] : undefined }
}

export function grantEquipmentXp(item: OwnedEquipment, amount: number) {
  item.xp += amount
  const next = equipmentLevelFromXp(item.xp)
  item.level = next.level
}

export function addWarriorXp(save: SaveData, amount: number, rng: Rng = Math.random) {
  save.warrior.xp += amount
  let levels = 0
  while (save.warrior.level < GAME.maxWarriorLevel && save.warrior.xp >= xpForLevel(save.warrior.level)) {
    save.warrior.xp -= xpForLevel(save.warrior.level)
    save.warrior.level += 1
    save.warrior.stats.strength += 1
    save.warrior.stats.dodge += 1
    save.warrior.stats.speed += 1
    save.warrior.stats.hp += 10
    levels += 1
    if (save.warrior.level % 5 === 0) save.pendingLevelChoice = true
  }
  void rng
  return levels
}
