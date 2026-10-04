export interface WarriorPassiveDefinition {
  id: string
  warriorId: string
  name: string
  unlockLevel: 3 | 7 | 10
  description: string
}

const define = (warriorId: string, rows: readonly [WarriorPassiveDefinition['unlockLevel'], string, string][]): readonly WarriorPassiveDefinition[] =>
  rows.map(([unlockLevel, name, description]) => ({ id: `${warriorId}-${unlockLevel}`, warriorId, name, unlockLevel, description }))

export const warriorPassives: Record<string, readonly WarriorPassiveDefinition[]> = {
  karg: define('karg', [[3,"Premier Sang","Votre première attaque réussie inflige +25 % de dégâts."],[7,"Pression du chasseur","Chaque coup consécutif ajoute +6 % de dégâts au suivant (maximum +18 %). Une esquive adverse annule les charges."],[10,"Coup de Grâce","Infligez +30 % de dégâts aux cibles à 30 % de PV ou moins."]]),
  naya: define('naya', [[3,"Pas d’Ombre","Votre chance d’esquiver le premier assaut est multipliée par 1,25 (plafond 35 %)."],[7,"Tempo fantôme","Après le premier assaut, esquive ×2 (plafond 35 %). Chaque esquive donne +30 % de cadence à la prochaine action et +40 % de dégâts au prochain coup réussi."],[10,"Embuscade décisive","Après une esquive, le prochain coup réussi inflige +60 % de dégâts au lieu de +40 %."]]),
  brakk: define('brakk', [[3,"Garde rocheuse","Les 3 premiers coups reçus infligent −12 % de dégâts."],[7,"Riposte du Bastion","12 % de chance de bloquer entièrement une attaque. Le prochain coup réussi inflige alors +30 % de dégâts."],[10,"Dernière Résistance","À 30 % de PV ou moins, les 3 prochains coups reçus infligent −35 % de dégâts. Une fois par combat."]]),
  eyla: define('eyla', [[3,"Mise en joue","Votre première attaque réussie inflige +20 % de dégâts."],[7,"Cadence précise","Chaque 3e attaque réussie ajoute un tir à 45 % des dégâts normaux. Ce tir ne déclenche pas vos passifs d’attaque."],[10,"Flèche fatale","Le premier coup réussi contre une cible à 50 % de PV ou moins inflige +40 % de dégâts."]]),
  asha: define('asha', [[3,"Marque de Braise","Chaque coup réussi ajoute une Braise (maximum 3). Chaque Braise déjà présente ajoute +3 % de dégâts."],[7,"Foyer ardent","Avec 3 Braises, le prochain coup réussi les consume et inflige +30 % de dégâts."],[10,"Crescendo incandescent","Les détonations infligent +50 % au lieu de +30 % et donnent +20 % de cadence à la prochaine action."]]),
  rhex: define('rhex', [[3,"Signal de meute","Chaque 3e attaque réussie ajoute une morsure à 35 % des dégâts normaux, sans déclencher vos passifs d’attaque."],[7,"Relais de meute","Chaque assaut de raptor donne +20 % de cadence à votre prochaine action."],[10,"Assaut coordonné","Chaque assaut ajoute 2 morsures à 30 % des dégâts normaux chacune, au lieu d’une à 35 %."]]),
  ursak: define('ursak', [[3,"Fureur cavernicole","Chaque coup reçu ajoute +8 % de dégâts au prochain coup réussi (maximum 3 charges)."],[7,"Endurance sous pression","À 50 % de PV ou moins, recevez −15 % de dégâts."],[10,"Fureur ancestrale","À 30 % de PV ou moins, gagnez +20 % de dégâts et +15 % de cadence jusqu’à la fin du combat."]]),
  saar: define('saar', [[3,"Pas félin","Chaque esquive donne +25 % de cadence à votre prochaine action."],[7,"Frénésie féline","Chaque coup réussi donne +5 % de cadence (maximum +15 %). Un coup reçu annule les charges."],[10,"Contre-attaque prédatrice","Après une esquive, le prochain coup réussi inflige +45 % de dégâts."]]),
  morga: define('morga', [[3,"Garde d’Ivoire","Les 4 premiers coups reçus infligent −12 % de dégâts."],[7,"Protection de la tribu","À 60 % de PV ou moins, les 3 prochains coups reçus infligent −20 % de dégâts. Une fois par combat."],[10,"Endurance de Matriarche","À 25 % de PV ou moins, récupérez 15 % des PV maximum et recevez −15 % de dégâts jusqu’à la fin. Une fois par combat."]]),
  vorka: define('vorka', [[3,"Entaille d’obsidienne","25 % de chance d’infliger un saignement : 10 % des dégâts du coup pendant 2 actions, sans cumul."],[7,"Pression persistante","Infligez +15 % de dégâts aux cibles qui saignent."],[10,"Coupure décisive","Le premier coup contre une cible qui saigne à 40 % de PV ou moins inflige +45 % de dégâts et consume le saignement."]]),
  urgath: define('urgath', [[3,"Rempart glacial","Les 5 premiers coups reçus infligent −12 % de dégâts."],[7,"Froid écrasant","Chaque coup réussi réduit la cadence adverse de 5 % (maximum −15 %)."],[10,"Résilience du Titan","À 40 % de PV ou moins, recevez −20 % de dégâts."]]),
  tyrak: define('tyrak', [[3,"Présence primordiale","Les 3 premiers coups reçus infligent −10 % de dégâts."],[7,"Sursaut cristallin","À 65 % de PV ou moins, gagnez +35 % de cadence à la prochaine action et +30 % de dégâts au prochain coup réussi. Une fois par combat."],[10,"Domination du Roi","À 35 % de PV ou moins, gagnez +25 % de dégâts et recevez −12 % de dégâts jusqu’à la fin du combat."]]),
}

export const getWarriorPassives = (warriorId: string): readonly WarriorPassiveDefinition[] => warriorPassives[warriorId] ?? []
export const getUnlockedWarriorPassives = (warriorId: string, level: number): readonly WarriorPassiveDefinition[] => getWarriorPassives(warriorId).filter((passive) => level >= passive.unlockLevel)
export const getNewlyUnlockedWarriorPassives = (warriorId: string, before: number, after: number): readonly WarriorPassiveDefinition[] =>
  getWarriorPassives(warriorId).filter((passive) => before < passive.unlockLevel && after >= passive.unlockLevel)

export interface PassiveHit {
  multiplier: number
  bonusStrikes: readonly number[]
  applyBleed: boolean
  consumeBleed: boolean
  labels: readonly string[]
}

/** One instance per battle. All fields die with the simulation; nothing is persisted. */
export class WarriorPassiveRuntime {
  readonly warriorId: string
  readonly level: number
  targetedAttacks = 0
  receivedHits = 0
  landedHits = 0
  pressure = 0
  braise = 0
  fury = 0
  frenzy = 0
  cold = 0
  actionCredit = 0
  riposteReady = false
  counterReady = false
  crystalReady = false
  lastResistance = 0
  tribeProtection = 0
  thresholdTriggered = false
  secondThresholdTriggered = false
  finalShotUsed = false
  decisiveCutUsed = false
  permanentDefense = false
  enraged = false

  constructor(warriorId = '', level = 1) { this.warriorId = warriorId; this.level = level }
  has(unlockLevel: 3 | 7 | 10): boolean { return this.level >= unlockLevel && Boolean(warriorPassives[this.warriorId]) }
  credit(amount: number) { this.actionCredit = Math.min(1, this.actionCredit + amount) }

  /** Credit enhances the existing weighted initiative draw, then is consumed on that Warrior's action. */
  actionRateMultiplier(): number {
    const frenzy = this.warriorId === 'saar' && this.has(7) ? 1 + .05 * this.frenzy : 1
    const rage = this.warriorId === 'ursak' && this.enraged ? 1.15 : 1
    return (1 + this.actionCredit) * frenzy * rage
  }
  opponentRateMultiplier(): number { return this.warriorId === 'urgath' && this.has(7) ? 1 - .05 * this.cold : 1 }
  onAction() { this.actionCredit = 0 }

  dodgeChance(base: number, cap: number): number {
    const first = this.targetedAttacks++ === 0
    if (this.warriorId !== 'naya' || !this.has(3)) return base
    if (first) return Math.min(cap, base * 1.25)
    // Tempo fantôme is her sustained dodge tool; the global dodge cap still applies.
    return this.has(7) ? Math.min(cap, base * 2) : base
  }
  onDodge() {
    if (this.warriorId === 'naya' && this.has(7)) { this.credit(.30); this.counterReady = true }
    if (this.warriorId === 'saar') { if (this.has(3)) this.credit(.25); if (this.has(10)) this.counterReady = true }
  }
  onMiss() { if (this.warriorId === 'karg' && this.has(7)) this.pressure = 0 }
  blockChance(): number { return this.warriorId === 'brakk' && this.has(7) ? .12 : 0 }
  onBlock() { if (this.warriorId === 'brakk' && this.has(7)) this.riposteReady = true }

  incomingMultiplier(hp: number, maxHp: number): number {
    let multiplier = 1
    const firstGuard: Record<string, number> = { brakk: 3, morga: 4, urgath: 5, tyrak: 3 }
    if (this.has(3) && this.receivedHits < (firstGuard[this.warriorId] ?? 0)) multiplier *= this.warriorId === 'tyrak' ? .90 : .88
    if (this.warriorId === 'brakk' && this.has(10) && this.lastResistance > 0) { multiplier *= .65; this.lastResistance-- }
    if (this.warriorId === 'morga') {
      if (this.has(7) && this.tribeProtection > 0) { multiplier *= .80; this.tribeProtection-- }
      if (this.permanentDefense) multiplier *= .85
    }
    if (this.warriorId === 'ursak' && this.has(7) && hp <= maxHp * .5) multiplier *= .85
    if (this.warriorId === 'urgath' && this.has(10) && hp <= maxHp * .4) multiplier *= .80
    if (this.warriorId === 'tyrak' && this.has(10) && hp <= maxHp * .35) multiplier *= .88
    return multiplier
  }

  onDamageTaken(hpAfter: number, maxHp: number): { heal: number; labels: string[] } {
    this.receivedHits++
    const labels: string[] = []
    let heal = 0
    if (this.warriorId === 'ursak') {
      if (this.has(3)) this.fury = Math.min(3, this.fury + 1)
      if (this.has(10) && !this.enraged && hpAfter <= maxHp * .30) { this.enraged = true; labels.push('Fureur ancestrale') }
    }
    if (this.warriorId === 'saar' && this.has(7)) this.frenzy = 0
    if (this.warriorId === 'brakk' && this.has(10) && !this.thresholdTriggered && hpAfter <= maxHp * .30) {
      this.thresholdTriggered = true; this.lastResistance = 3; labels.push('Dernière Résistance')
    }
    if (this.warriorId === 'morga') {
      if (this.has(7) && !this.thresholdTriggered && hpAfter <= maxHp * .60) { this.thresholdTriggered = true; this.tribeProtection = 3; labels.push('Protection de la tribu') }
      if (this.has(10) && !this.secondThresholdTriggered && hpAfter <= maxHp * .25) {
        this.secondThresholdTriggered = true; this.permanentDefense = true; heal = Math.round(maxHp * .15); labels.push('Endurance de Matriarche')
      }
    }
    if (this.warriorId === 'tyrak' && this.has(7) && !this.thresholdTriggered && hpAfter <= maxHp * .65) {
      this.thresholdTriggered = true; this.crystalReady = true; this.credit(.35); labels.push('Sursaut cristallin')
    }
    return { heal, labels }
  }

  /** Called only for a positive-damage hit. Bonus strikes are never passed back into this method. */
  onSuccessfulAttack(targetHp: number, targetMaxHp: number, targetBleeding: boolean, rng: () => number): PassiveHit {
    let multiplier = 1
    let applyBleed = false
    let consumeBleed = false
    const labels: string[] = []
    const bonusStrikes: number[] = []
    const first = this.landedHits === 0
    this.landedHits++
    switch (this.warriorId) {
      case 'karg':
        if (this.has(3) && first) { multiplier *= 1.25; labels.push('Premier Sang') }
        if (this.has(7)) { multiplier *= 1 + .06 * this.pressure; this.pressure = Math.min(3, this.pressure + 1) }
        if (this.has(10) && targetHp <= targetMaxHp * .30) { multiplier *= 1.30; labels.push('Coup de Grâce') }
        break
      case 'naya':
        if (this.has(7) && this.counterReady) {
          multiplier *= this.has(10) ? 1.60 : 1.40
          this.counterReady = false
          labels.push(this.has(10) ? 'Embuscade décisive' : 'Tempo fantôme')
        }
        break
      case 'brakk':
        if (this.has(7) && this.riposteReady) { multiplier *= 1.30; this.riposteReady = false; labels.push('Riposte du Bastion') }
        break
      case 'eyla':
        if (this.has(3) && first) { multiplier *= 1.20; labels.push('Mise en joue') }
        if (this.has(10) && !this.finalShotUsed && targetHp <= targetMaxHp * .50) { multiplier *= 1.40; this.finalShotUsed = true; labels.push('Flèche fatale') }
        if (this.has(7) && this.landedHits % 3 === 0) { bonusStrikes.push(.45); labels.push('Cadence précise') }
        break
      case 'asha':
        if (this.has(3)) {
          if (!(this.has(7) && this.braise === 3)) multiplier *= 1 + .03 * this.braise
          if (this.has(7) && this.braise === 3) {
            multiplier *= this.has(10) ? 1.50 : 1.30
            this.braise = 0
            if (this.has(10)) this.credit(.20)
            labels.push(this.has(10) ? 'Crescendo incandescent' : 'Foyer ardent')
          }
          this.braise = Math.min(3, this.braise + 1)
        }
        break
      case 'rhex':
        if (this.has(3) && this.landedHits % 3 === 0) {
          bonusStrikes.push(...(this.has(10) ? [.30, .30] : [.35]))
          if (this.has(7)) this.credit(.20)
          labels.push(this.has(10) ? 'Assaut coordonné' : 'Signal de meute')
        }
        break
      case 'ursak':
        if (this.has(3) && this.fury) { multiplier *= 1 + .08 * this.fury; this.fury = 0; labels.push('Fureur cavernicole') }
        if (this.enraged) multiplier *= 1.20
        break
      case 'saar':
        if (this.has(10) && this.counterReady) { multiplier *= 1.45; this.counterReady = false; labels.push('Contre-attaque prédatrice') }
        if (this.has(7)) this.frenzy = Math.min(3, this.frenzy + 1)
        break
      case 'vorka':
        if (this.has(7) && targetBleeding) multiplier *= 1.15
        if (this.has(10) && !this.decisiveCutUsed && targetBleeding && targetHp <= targetMaxHp * .40) {
          multiplier *= 1.45; consumeBleed = true; this.decisiveCutUsed = true; labels.push('Coupure décisive')
        }
        if (this.has(3) && rng() < .25) { applyBleed = true; labels.push('Entaille d’obsidienne') }
        break
      case 'urgath':
        if (this.has(7)) this.cold = Math.min(3, this.cold + 1)
        break
      case 'tyrak':
        if (this.has(7) && this.crystalReady) { multiplier *= 1.30; this.crystalReady = false; labels.push('Sursaut cristallin') }
        if (this.has(10) && this.enraged) multiplier *= 1.25
        break
    }
    return { multiplier, bonusStrikes, applyBleed, consumeBleed, labels }
  }

  updateThresholds(hp: number, maxHp: number) {
    if (this.warriorId === 'tyrak' && this.has(10) && hp <= maxHp * .35) this.enraged = true
  }
}
