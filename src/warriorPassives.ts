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
  karg: define('karg', [[3,'Premier Sang','Sa première attaque réussie inflige 25 % de dégâts supplémentaires.'],[7,'Pression du chasseur','Ses coups consécutifs renforcent progressivement sa prochaine attaque.'],[10,'Coup de Grâce','Inflige 30 % de dégâts supplémentaires aux adversaires affaiblis.']]),
  naya: define('naya', [[3,'Pas d’Ombre','Elle est particulièrement difficile à toucher lors du premier assaut.'],[7,'Tempo fantôme','Après le premier assaut, esquive renforcée ; chaque esquive accélère sa prochaine action et arme une riposte à +40 %.'],[10,'Embuscade décisive','Après une esquive, sa prochaine attaque réussie inflige 80 % de dégâts supplémentaires au lieu de 40 %.']]),
  brakk: define('brakk', [[3,'Garde rocheuse','Réduit les dégâts de ses trois premiers impacts subis.'],[7,'Riposte du Bastion','12 % de chance de bloquer entièrement une attaque ; sa prochaine attaque réussie inflige alors +30 % de dégâts.'],[10,'Dernière Résistance','Sous 30 % de PV, il réduit fortement les trois prochains impacts.']]),
  eyla: define('eyla', [[3,'Mise en joue','Sa première flèche réussie inflige 20 % de dégâts supplémentaires.'],[7,'Cadence précise','Chaque troisième attaque réussie déclenche un tir supplémentaire.'],[10,'Flèche fatale','Punit brutalement la première ouverture d’un adversaire affaibli.']]),
  asha: define('asha', [[3,'Marque de Braise','Ses attaques accumulent jusqu’à trois charges de Braise.'],[7,'Foyer ardent','À trois Braises, sa prochaine attaque les consume pour provoquer une explosion.'],[10,'Crescendo incandescent','Ses détonations deviennent plus violentes et accélèrent son prochain sort.']]),
  rhex: define('rhex', [[3,'Signal de meute','Chaque troisième attaque réussie appelle un raptor à l’assaut.'],[7,'Relais de meute','Les assauts de ses raptors accélèrent le rythme de la meute.'],[10,'Assaut coordonné','Ses deux raptors frappent ensemble lors des assauts de meute.']]),
  ursak: define('ursak', [[3,'Fureur cavernicole','Les coups reçus alimentent la puissance de sa prochaine attaque.'],[7,'Endurance sous pression','Résiste davantage lorsqu’il combat sous la moitié de ses PV.'],[10,'Fureur ancestrale','À l’agonie, il entre dans une fureur qui augmente dégâts et cadence.']]),
  saar: define('saar', [[3,'Pas félin','Chaque esquive le replace immédiatement dans le rythme du combat.'],[7,'Frénésie féline','Plus il frappe sans être touché, plus sa cadence augmente.'],[10,'Contre-attaque prédatrice','Après une esquive, sa prochaine attaque devient une contre-attaque prédatrice.']]),
  morga: define('morga', [[3,'Garde d’Ivoire','Sa défense d’ivoire amortit ses quatre premiers impacts.'],[7,'Protection de la tribu','Sous 60 % de PV, elle renforce temporairement sa protection.'],[10,'Endurance de Matriarche','Au bord de la chute, elle récupère une partie de ses PV et durcit sa défense.']]),
  vorka: define('vorka', [[3,'Entaille d’obsidienne','Ses coups peuvent provoquer un saignement persistant.'],[7,'Pression persistante','Ses attaques sont plus dangereuses contre une cible qui saigne.'],[10,'Coupure décisive','Achève brutalement une cible affaiblie déjà victime de son saignement.']]),
  urgath: define('urgath', [[3,'Rempart glacial','Son corps titanesque réduit les dégâts de ses cinq premiers impacts.'],[7,'Froid écrasant','Ses coups ralentissent progressivement le rythme de son adversaire.'],[10,'Résilience du Titan','Sous 40 % de PV, sa résistance légendaire réduit fortement les dégâts reçus.']]),
  tyrak: define('tyrak', [[3,'Présence primordiale','Sa présence impose sa domination dès les premiers échanges.'],[7,'Sursaut cristallin','Blessé, Tyrak réagit par un violent sursaut de puissance.'],[10,'Domination du Roi','Sous 35 % de PV, le Roi Primordial devient plus violent et plus difficile à abattre.']]),
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
    return this.has(7) ? Math.min(cap, base * 2.6) : base
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
          multiplier *= this.has(10) ? 1.80 : 1.40
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
