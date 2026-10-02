import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, Sparkles, Trophy, X } from 'lucide-react'
import { ADMIN_SAVE_KEY, canEnterCampaignNode, canOpenChest, canStartBattle, isLocalAdmin, withAdminAccess } from './admin'
import { GAME } from './config'
import { badges, equipment, skillDescriptions, skills } from './data'
import { activateWarrior, addEquipmentCopy, addWarriorXp, claimWelcomeWarrior, compareEquipmentStats, effectiveStats, equipmentStats, equipItem, generateEnemy, grantWarrior, rollChest, rollWarriorChest, seededRng, simulateBattle, xpForLevel } from './game'
import { loadSave, persistSave } from './storage'
import type { BattleResult, EquipmentDefinition, Fighter, OwnedEquipment, Rarity, SaveData, StatKey, View } from './types'
import { EquipmentArt, GameIcon, ProductionEnemy, ProductionWarrior } from './components/Art'
import { WarriorCard, WarriorStats } from './components/WarriorCard'
import { WarriorDetail } from './components/WarriorDetail'
import { enemyIds, spriteStates, type EnemyId } from './art/assetsV04'
import { assetsV06, enemySprite, equipmentAsset, playerPoses, playerWeapons, preloadBattleAssetsV06, resolveEnemyId, weaponMotion, type PlayerState } from './art/assetsV06'
import { finalBattleFrame } from './art/battleVisual'
import { attackHasImpact, playerReactionForEvent, preloadWarriorSpriteKit, warriorAttackTimeline, warriorBattleGeometry, warriorSpriteKit, warriorUsesApproach, type WarriorBattleMeasurements } from './art/warriorSprites'
import { FloatingCombatText, WarriorAttackFx, WarriorCompanion, WarriorSprite } from './components/WarriorSprite'
import { BattleFighterHud } from './components/BattleHud'
import { HudPortraitPreview } from './components/HudPortraitPreview'
import { SpritePreview } from './components/SpritePreview'
import { combatTextForEvent } from './art/combatText'
import { enemyContactDistance, enemyPaintedBattleSize, enemyProjectileGeometry, enemySpriteKit, enemyVisualPose, preloadEnemySpriteKit, type EnemyMotion, type EnemyVisualPose } from './art/enemySprites'
import { warriorCombatFactor } from './art/combatVisualScale'
import { EnemyAttackFx, EnemySprite } from './components/EnemySprite'
import { EnemySpritePreview } from './components/EnemySpritePreview'
import { activeWarrior, primalWarriors, warriorDefinitions } from './warriors'

const nav: { id: View; label: string; icon: string }[] = [
  { id: 'hub', label: 'Hub', icon: 'hub' }, { id: 'collection', label: 'Collection', icon: 'collection' },
  { id: 'training', label: 'Entraînement', icon: 'training' }, { id: 'chest', label: 'Coffre', icon: 'chest' },
  { id: 'duel', label: 'Duel', icon: 'duel' },
]

const rarityClass = (rarity: Rarity) => `rarity-${rarity.toLowerCase().replace(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`
const itemById = (id: string) => equipment.find((item) => item.id === id)!
const clone = (save: SaveData): SaveData => structuredClone(save)

function unlock(save: SaveData, id: string) {
  if (!save.badges.some((badge) => badge.id === id)) save.badges.push({ id, unlockedAt: new Date().toISOString() })
}

const statMeta = { strength: { label: 'Force', icon: 'force' }, dodge: { label: 'Esquive', icon: 'dodge' }, speed: { label: 'Vitesse', icon: 'speed' }, hp: { label: 'PV', icon: 'pv' } }
type SkillFilter = 'all' | 'owned' | 'locked'
const skillIcon = (index: number) => ['force', 'dodge', 'speed', 'pv'][index % 4]
const badgeVisual = (id: string) => id.startsWith('training') ? ['navigation', 'training'] as const : id.startsWith('gear') ? ['navigation', 'equipment'] as const : id.includes('rare') || id.includes('epic') || id.includes('legendary') || id.includes('mythic') ? ['stats', 'badge'] as const : ['navigation', 'force'] as const
const formatStats = (item: EquipmentDefinition) => Object.entries(equipmentStats(item.id)).map(([key, value]) => `+${value} ${statMeta[key as keyof typeof statMeta].label}`)
const equipmentIcon = (type: EquipmentDefinition['type']) => `/assets/icons/collection/${type}.png`

function Stat({ type, value }: { type: 'strength' | 'dodge' | 'speed'; value: number }) {
  return <div className="stat"><GameIcon group="stats" name={statMeta[type].icon}/><span>{statMeta[type].label}</span><strong>{value}</strong></div>
}

function EquipmentCard({ item, save, onClick }: { item: EquipmentDefinition; save: SaveData; onClick: () => void }) {
  const owned = save.owned[item.id]
  return <article className={`equipment-card ${rarityClass(item.rarity)} ${!owned ? 'locked' : ''}`}>
    <button className="card-main" onClick={onClick}>{!owned && <GameIcon group="system" name="lock" className="lock"/>}<div className="card-art-wrap"><EquipmentArt item={item} silhouette={!owned}/><span className="rarity-pip"/></div>
      <div className="equipment-card-copy"><div className="card-kicker"><span className="rarity-label">{item.rarity}</span></div><strong>{owned ? item.name : item.type === 'weapon' ? 'Arme inconnue' : 'Armure inconnue'}</strong>
        {owned && <><div className="card-stats">{formatStats(item).map((bonus) => <span key={bonus}>{bonus}</span>)}</div><p>{item.effect}</p></>}
      </div></button>
  </article>
}

function Header({ save, view, setView, admin }: { save: SaveData; view: View; setView: (view: View) => void; admin: boolean }) {
  return <header className={`topbar ${admin ? 'is-admin' : ''}`}><button className="mini-brand" onClick={() => setView('hub')}><img src={assetsV06.brand.logo} alt="Chronos Age Warriors"/><span>ÈRE PRIMORDIALE</span>{admin && <span className="admin-indicator">ADMIN LOCAL</span>}</button><div className="topbar-title">{view === 'adventure' && <button className="icon-button" aria-label="Retour au Hub" onClick={() => setView('hub')}><ChevronLeft/></button>}<strong>{view === 'chest' ? 'Coffres' : view.charAt(0).toUpperCase() + view.slice(1)}</strong></div><div className="currency"><GameIcon group="stats" name="coins"/><strong>{save.coins}</strong></div></header>
}

function EmptyHub() {
  return <div className="hub-page empty-hub page-enter"><section className="gear-gallery desktop-only"><span className="eyebrow">ARSENAL</span><h2>Relics du Warrior</h2><div className="shelf"><div className="gear-empty-slot">Aucune arme</div><div className="gear-empty-slot">Aucune armure</div></div></section><section className="hero-warrior"><span className="eyebrow">WARRIOR ACTIF</span><div className="empty-warrior-space"><GameIcon group="navigation" name="collection"/><span>Ton premier Warrior t’attend</span></div><div className="hero-name"><h1>Aucun Warrior actif</h1></div><div className="resource-row mobile-only"><span>Le coffre de bienvenue est prêt.</span></div><button className="adventure-button" disabled>AVENTURE</button></section><section className="stats-panel"><span className="eyebrow">PUISSANCE</span><h2>Statistiques</h2><p>Ouvre le coffre de bienvenue pour révéler ton Warrior.</p></section><section className="hub-bottom"><div className="skill-panel"><span className="eyebrow">PASSIFS</span><h2>Compétences</h2><p>À découvrir avec ton Warrior.</p></div><div className="mobile-gear mobile-only"><div className="gear-empty-slot">Aucune arme</div><div className="gear-empty-slot">Aucune armure</div></div></section></div>
}

function WarriorChestReveal({ warrior, duplicate = false }: { warrior: (typeof primalWarriors)[number]; duplicate?: boolean }) {
  return <div className="warrior-chest-reveal"><span className="eyebrow">{duplicate ? 'DÉJÀ POSSÉDÉ' : 'NOUVEAU WARRIOR'}</span><WarriorCard warrior={warrior} level={1} className="warrior-chest-card" loading="eager"/><strong>{warrior.name}</strong><span className={`warrior-rarity ${rarityClass(warrior.rarity)}`}>{warrior.rarity}</span></div>
}

function WelcomeChest({ onClaim, onDone }: { onClaim: (warriorId: string) => void; onDone: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'opening' | 'reveal'>('ready')
  const [warrior, setWarrior] = useState<(typeof primalWarriors)[number] | null>(null)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const open = () => {
    if (phase !== 'ready') return
    const drawn = rollWarriorChest(Math.random)
    setWarrior(drawn)
    onClaim(drawn.id)
    setPhase('opening')
    timers.current.push(window.setTimeout(() => setPhase('reveal'), 1000))
  }
  return createPortal(<div className="welcome-overlay" role="dialog" aria-modal="true" aria-label="Coffre Warrior de bienvenue"><section className="welcome-panel"><span className="eyebrow">BIENVENUE DANS CHRONOS</span>{phase === 'reveal' && warrior ? <WarriorChestReveal warrior={warrior}/> : <><h2>Ton histoire commence ici</h2><p>Un coffre Warrior t’est offert. Découvre ton premier combattant.</p><div className={`welcome-chest-art ${phase === 'opening' ? 'opening' : ''}`}><img src={phase === 'opening' ? assetsV06.chest.open : assetsV06.chest.closed} alt="Coffre Warrior de bienvenue"/></div></>}{phase === 'ready' && <button className="primary wide" autoFocus onClick={open}>OUVRIR MON COFFRE OFFERT</button>}{phase === 'opening' && <p className="welcome-opening">Le temps révèle ton Warrior…</p>}{phase === 'reveal' && <button className="primary wide" onClick={onDone}>ENTRER DANS LE HUB</button>}</section></div>, document.body)
}

function Hub({ save, setView, setDetail }: { save: SaveData; setView: (view: View) => void; setDetail: (item: EquipmentDefinition) => void }) {
  const warrior = activeWarrior(save)
  const stats = warrior.stats
  const weapon = equipment.find((item) => item.id === save.equippedWeapon), armor = equipment.find((item) => item.id === save.equippedArmor)
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('all')
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const previewSkills = activeWarrior(save).skills.filter((skill) => skills.includes(skill)).slice(0, 3)
  const visibleSkills = skills.filter((skill) => skillFilter === 'all' || (skillFilter === 'owned') === activeWarrior(save).skills.includes(skill))
  useEffect(() => {
    if (!skillsOpen && !selectedSkill) return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (selectedSkill) setSelectedSkill(null)
      else setSkillsOpen(false)
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [skillsOpen, selectedSkill])
  return <div className="hub-page page-enter">
    <section className="gear-gallery desktop-only"><span className="eyebrow">ARSENAL</span><h2>Relics du Warrior</h2><div className="shelf">{weapon ? <EquipmentCard item={weapon} save={save} onClick={() => setDetail(weapon)}/> : <div className="gear-empty-slot">Aucune arme</div>}{armor ? <EquipmentCard item={armor} save={save} onClick={() => setDetail(armor)}/> : <div className="gear-empty-slot">Aucune armure</div>}</div><button className="text-button" onClick={() => setView('collection')}>Voir la collection <ChevronLeft size={16}/></button></section>
    <section className="hero-warrior"><span className="eyebrow">WARRIOR ACTIF</span><div className="hero-avatar"><WarriorCard warrior={warrior} level={warrior.level} className="hub-warrior-card" loading="eager"/></div><div className="hero-name"><h1>{warrior.name}</h1><div className="warrior-tags"><span>{warrior.warriorClass}</span><span className={`warrior-rarity ${rarityClass(warrior.rarity)}`}>{warrior.rarity}</span></div></div><WarriorStats stats={stats} className="hub-warrior-stats"/>
      <div className="resource-row mobile-only"><span><GameIcon group="stats" name="coins"/>{save.coins}</span><span><GameIcon group="stats" name="xp"/>{save.campaignRemaining} / 10</span></div>
      <button className="adventure-button" onClick={() => setView('adventure')}><GameIcon group="navigation" name="adventure"/><span><small>CAMPAGNE</small>AVENTURE</span><i>→</i></button>
    </section>
    <section className="stats-panel"><span className="eyebrow">PUISSANCE</span><h2>Statistiques</h2><div className="desktop-stats"><div className="hp-display"><GameIcon group="stats" name="pv"/><span>POINTS DE VIE</span><strong>{stats.hp}</strong></div><div className="stats-grid"><Stat type="strength" value={stats.strength}/><Stat type="dodge" value={stats.dodge}/><Stat type="speed" value={stats.speed}/></div><div className="xp-block"><span>EXPÉRIENCE <b>{activeWarrior(save).xp} / {xpForLevel(activeWarrior(save).level)}</b></span><div className="progress"><i style={{ width: `${activeWarrior(save).xp / xpForLevel(activeWarrior(save).level) * 100}%` }}/></div></div><div className="daily"><span><GameIcon group="stats" name="coins"/> {save.coins} pièces</span><span><GameIcon group="stats" name="xp"/> {save.campaignRemaining} / 10 Campagne</span></div></div></section>
    <section className="hub-bottom"><div className="skill-panel skill-summary"><div className="section-title"><div><span className="eyebrow">PASSIFS</span><h2>Compétences</h2></div><span>{activeWarrior(save).skills.length} / {skills.length} débloquées</span></div>
      {previewSkills.length ? <div className="skill-preview-list">{previewSkills.map((skill) => <button className="skill-preview" onClick={() => setSelectedSkill(skill)} key={skill}><GameIcon group="stats" name={skillIcon(skills.indexOf(skill))}/><span><strong>{skill}</strong><small>Débloquée</small></span><ChevronLeft aria-hidden="true"/></button>)}</div> : <p className="skill-preview-empty">Aucune compétence débloquée <span>Progresse pour éveiller ton premier passif.</span></p>}
      <button className="skill-see-all" onClick={() => { setSkillFilter('all'); setSkillsOpen(true) }}>Voir toutes <span aria-hidden="true">→</span></button></div>
      <div className="mobile-gear mobile-only">{weapon ? <EquipmentCard item={weapon} save={save} onClick={() => setDetail(weapon)}/> : <div className="gear-empty-slot">Aucune arme</div>}{armor ? <EquipmentCard item={armor} save={save} onClick={() => setDetail(armor)}/> : <div className="gear-empty-slot">Aucune armure</div>}</div></section>
    {skillsOpen && createPortal(<div className="skills-sheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSkillsOpen(false) }}><section className="skills-sheet" role="dialog" aria-modal="true" aria-label="Toutes les compétences"><div className="skills-sheet-header"><div><span className="eyebrow">PASSIFS DU WARRIOR</span><h2>Compétences</h2><p>{activeWarrior(save).skills.length} / {skills.length} débloquées</p></div><button className="skills-sheet-close" aria-label="Fermer les compétences" onClick={() => setSkillsOpen(false)} autoFocus><X/></button></div><div className="skill-filters" aria-label="Filtrer les compétences">{([['all','Toutes'],['owned','Débloquées'],['locked','Verrouillées']] as [SkillFilter,string][]).map(([filter,label]) => <button aria-pressed={skillFilter === filter} className={skillFilter === filter ? 'active' : ''} onClick={() => setSkillFilter(filter)} key={filter}>{label}</button>)}</div><div className="skill-list">{visibleSkills.map((skill) => { const index = skills.indexOf(skill), owned = activeWarrior(save).skills.includes(skill); return <button className={`skill-card ${owned ? 'owned' : 'locked-skill'}`} onClick={() => setSelectedSkill(skill)} key={skill}>{owned ? <GameIcon group="stats" name={skillIcon(index)}/> : <GameIcon group="system" name="lock"/>}<span><strong>{owned ? skill : '???'}</strong><small>{owned ? skillDescriptions[skill] : 'Verrouillée'}</small></span></button> })}</div>{visibleSkills.length === 0 && <p className="skills-empty">Aucune compétence dans ce filtre.</p>}</section></div>, document.body)}
    {selectedSkill && createPortal(<div className="skill-detail-modal" role="dialog" aria-modal="true" aria-label="Détail de compétence" onClick={() => setSelectedSkill(null)} onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); setSelectedSkill(null) } }}><section onClick={(event) => event.stopPropagation()}><button className="close" aria-label="Fermer" onClick={() => setSelectedSkill(null)} autoFocus><X/></button><GameIcon group={activeWarrior(save).skills.includes(selectedSkill) ? 'stats' : 'system'} name={activeWarrior(save).skills.includes(selectedSkill) ? skillIcon(skills.indexOf(selectedSkill)) : 'lock'}/><span className="eyebrow">{activeWarrior(save).skills.includes(selectedSkill) ? 'COMPÉTENCE DÉBLOQUÉE' : 'COMPÉTENCE VERROUILLÉE'}</span><h2>{activeWarrior(save).skills.includes(selectedSkill) ? selectedSkill : '???'}</h2><p>{activeWarrior(save).skills.includes(selectedSkill) ? skillDescriptions[selectedSkill] : 'Continue ta progression pour révéler cette compétence.'}</p><button className="primary wide" onClick={() => setSelectedSkill(null)}>FERMER</button></section></div>, document.body)}
  </div>
}

function Collection({ save, setSave, setWarriorDetail }: { save: SaveData; setSave: (save: SaveData) => void; setWarriorDetail: (id: string) => void }) {
  const [tab, setTab] = useState<'warriors' | 'equipment' | 'badges'>('warriors')
  const [type, setType] = useState<'weapon' | 'armor'>('weapon')
  const unlocked = new Set(save.badges.map((badge) => badge.id))
  const inventory = equipment.filter((item) => item.type === type && (save.owned[item.id]?.quantity ?? (save.owned[item.id] ? 1 : 0)) > 0)
  const activeGear = [equipment.find((item) => item.id === save.equippedWeapon), equipment.find((item) => item.id === save.equippedArmor)]
  return <div className="content-page page-enter"><div className="page-heading"><span className="eyebrow">ARCHIVES DU TEMPS</span><h1>Collection</h1><p>Warriors possédés : {Object.keys(save.ownedWarriors).length} / {primalWarriors.length} · {Object.keys(save.owned).length} types d’équipements possédés</p></div><div className="big-tabs"><button className={tab === 'warriors' ? 'active' : ''} onClick={() => setTab('warriors')}><img className="collection-tab-icon" src="/assets/icons/collection/warrior.png" alt="" aria-hidden="true"/>Warriors</button><button className={tab === 'equipment' ? 'active' : ''} onClick={() => setTab('equipment')}><GameIcon group="navigation" name="equipment"/>Équipements</button><button className={tab === 'badges' ? 'active' : ''} onClick={() => setTab('badges')}><GameIcon group="stats" name="badge"/>Badges</button></div>
    {tab === 'warriors' ? <div className="warrior-collection-grid">{primalWarriors.map((warrior) => {
      const owned = save.ownedWarriors[warrior.id]
      return owned
        ? <button className="warrior-collection-entry" key={warrior.id} onClick={() => setWarriorDetail(warrior.id)} aria-label={`Voir la fiche de ${warrior.name}`}><WarriorCard warrior={warrior} level={owned.level} className="collection-warrior-card"/><span className="warrior-collection-copy"><strong>{warrior.name}</strong><small>{warrior.warriorClass} · {warrior.rarity}</small></span></button>
        : <article className="warrior-collection-entry is-unowned" key={warrior.id} aria-label="Warrior inconnu"><div className="warrior-card collection-warrior-card locked-warrior-card" aria-hidden="true"><div className="warrior-card-frame"><svg className="warrior-locked-silhouette" viewBox="0 0 120 120" fill="currentColor"><circle cx="60" cy="39" r="19"/><path d="M22 110c0-25 15-43 38-43s38 18 38 43Z"/></svg><GameIcon group="system" name="lock" className="lock"/></div></div><span className="warrior-collection-copy"><strong>???</strong><small>Warrior inconnu · Non découvert</small></span></article>
    })}</div> : tab === 'equipment' ? <section className="equipment-inventory"><div className="active-loadout"><span className="eyebrow">ÉQUIPEMENT DE {activeWarrior(save).name.toUpperCase()}</span><div className="active-loadout-slots">{activeGear.map((item, index) => <div className="active-loadout-slot" key={index}><img src={equipmentIcon(index === 0 ? 'weapon' : 'armor')} alt=""/><span><strong>{item?.name ?? (index === 0 ? 'Aucune arme' : 'Aucune armure')}</strong>{item && <small>{[...formatStats(item), item.effect].join(' · ')}</small>}</span></div>)}</div></div><div className="inventory-filters" aria-label="Catégorie d’équipement"><button aria-pressed={type === 'weapon'} className={type === 'weapon' ? 'active' : ''} onClick={() => setType('weapon')}><img src={equipmentIcon('weapon')} alt=""/>Armes</button><button aria-pressed={type === 'armor'} className={type === 'armor' ? 'active' : ''} onClick={() => setType('armor')}><img src={equipmentIcon('armor')} alt=""/>Armures</button></div>{inventory.length ? <div className="equipment-inventory-grid">{inventory.map((item) => { const equipped = [save.equippedWeapon, save.equippedArmor].includes(item.id), quantity = save.owned[item.id].quantity ?? 1; return <button key={item.id} className={`inventory-entry ${rarityClass(item.rarity)} ${equipped ? 'is-equipped' : ''}`} onClick={() => setSave(equipItem(save, item.id))} aria-label={`Équiper ${item.name}`} aria-pressed={equipped}><img src={equipmentIcon(item.type)} alt=""/><span className="inventory-entry-copy"><strong>{item.name}</strong><small>{[...formatStats(item), item.effect].join(' · ')}</small></span>{quantity > 1 && <b className="inventory-quantity">×{quantity}</b>}</button> })}</div> : <p className="inventory-empty">Aucune {type === 'weapon' ? 'arme possédée' : 'armure possédée'}.</p>}</section> : <div className="badge-grid">{badges.map(([id, name, description]) => { const [group, icon] = badgeVisual(id); return <div className={`badge-card badge-${group}-${icon} ${unlocked.has(id) ? 'unlocked' : ''}`} key={id}><div className="badge-medal"><GameIcon group={group} name={icon}/></div><div><strong>{name}</strong><span>{description}</span></div>{!unlocked.has(id) && <GameIcon group="system" name="lock"/>}</div> })}</div>}
  </div>
}

export type ChestReward = ReturnType<typeof rollChest>
export interface LootContext { reward: ChestReward; after?: OwnedEquipment; equipped?: EquipmentDefinition }

function StatChips({ item }: { item: EquipmentDefinition }) {
  return <div className="loot-stat-chips">{formatStats(item).map((bonus) => <span key={bonus}>{bonus}</span>)}</div>
}

export function LootReveal({ loot, onEquip, onStore }: { loot: LootContext; onEquip: () => void; onStore: () => void }) {
  const reward = loot.reward
  if (reward.kind === 'skill') return <div className="reward-card rarity-mythique"><span className="eyebrow">COMPÉTENCE MYTHIQUE</span><div className="skill-orb"><Sparkles/></div><h2>{reward.skill}</h2><p>Nouvelle compétence passive acquise.</p><button className="primary wide" onClick={onStore}>CONTINUER</button></div>
  const item = reward.item
  if (reward.duplicate) {
    return <div className={`reward-card duplicate-reveal ${rarityClass(item.rarity)}`}><span className="eyebrow">DÉJÀ POSSÉDÉ · +1 EXEMPLAIRE</span><div className="loot-hero"><EquipmentArt item={item}/><div><span className="rarity-label">{item.rarity}</span><h2>{item.name}</h2><b>Dans l’inventaire : ×{loot.after?.quantity ?? 2}</b></div></div><button className="primary wide" onClick={onStore}>CONTINUER</button></div>
  }
  const comparison = loot.equipped ? compareEquipmentStats(item.id, loot.equipped.id) : []
  return <div className={`reward-card new-loot ${rarityClass(item.rarity)}`}><span className="eyebrow">NOUVEL OBJET</span><div className="loot-hero"><EquipmentArt item={item}/><div><span className="rarity-label">{item.rarity}</span><h2>{item.name}</h2><b>{item.type === 'weapon' ? 'Arme' : 'Armure'}</b></div></div><div className="loot-detail"><section><small>BONUS</small><StatChips item={item}/><small>EFFET SPÉCIAL</small><p>{item.effect}</p>{comparison.length > 0 && <div className="stat-differences">{comparison.map(({ stat, difference }) => <span className={difference > 0 ? 'up' : difference < 0 ? 'down' : 'equal'} key={stat}>{difference > 0 ? '↑' : difference < 0 ? '↓' : '='} {statMeta[stat].label} {difference !== 0 && `${difference > 0 ? '+' : ''}${difference}`}</span>)}</div>}</section>{loot.equipped && <section className="comparison"><small>ÉQUIPÉ ACTUELLEMENT</small><div className="comparison-title"><EquipmentArt item={loot.equipped} compact/><div><strong>{loot.equipped.name}</strong><span>{loot.equipped.rarity}</span></div></div><StatChips item={loot.equipped}/><p>{loot.equipped.effect}</p></section>}</div><div className="reward-actions"><button className="primary" onClick={onEquip}>ÉQUIPER</button><button className="secondary" onClick={onStore}>STOCKER</button></div></div>
}

function Chests({ save, setSave, admin }: { save: SaveData; setSave: (save: SaveData) => void; admin: boolean }) {
  const [mode, setMode] = useState<'equipment' | 'warrior'>('equipment')
  const [spinning, setSpinning] = useState(false), [loot, setLoot] = useState<LootContext | null>(null), [strip, setStrip] = useState<EquipmentDefinition[]>([])
  const [warriorLoot, setWarriorLoot] = useState<{ warrior: (typeof primalWarriors)[number]; duplicate: boolean } | null>(null)
  useEffect(() => {
    if (!loot && !warriorLoot) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setLoot(null); setWarriorLoot(null) } }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [loot, warriorLoot])
  const open = () => {
    if (!canOpenChest(save, admin) || spinning) return
    if (mode === 'warrior') {
      const warrior = rollWarriorChest(Math.random)
      const duplicate = Boolean(save.ownedWarriors[warrior.id])
      const next = grantWarrior(save, warrior.id)
      next.coins -= GAME.chestCost; next.chests += 1
      setSpinning(true)
      window.setTimeout(() => { setSpinning(false); setWarriorLoot({ warrior, duplicate }); setSave(next) }, 1200)
      return
    }
    const result = rollChest(Math.random, save.owned, activeWarrior(save).skills)
    const target = result.kind === 'equipment' ? result.item : equipment.find((item) => item.rarity === 'Mythique')!
    const fillers = Array.from({ length: 18 }, () => equipment[Math.floor(Math.random() * equipment.length)]); fillers[15] = target
    setStrip(fillers); setLoot(null); setSpinning(true)
    const next = clone(save); next.coins -= GAME.chestCost; next.chests += 1
    const equippedId = result.kind === 'equipment' ? (result.item.type === 'weapon' ? save.equippedWeapon : save.equippedArmor) : undefined
    const equipped = equippedId ? itemById(equippedId) : undefined
    if (result.kind === 'skill') next.unlockedSkills.push(result.skill)
    else next.owned = addEquipmentCopy(next, result.item.id).owned
    if (result.kind === 'equipment') { if (result.item.rarity === 'Rare' && result.item.type === 'weapon') unlock(next, 'first-rare'); if (result.item.rarity === 'Épique') unlock(next, 'first-epic'); if (result.item.rarity === 'Légendaire') unlock(next, 'first-legendary'); if (result.item.rarity === 'Mythique') unlock(next, 'first-mythic') }
    const after = result.kind === 'equipment' && next.owned[result.item.id] ? { ...next.owned[result.item.id] } : undefined
    setTimeout(() => { setSpinning(false); setLoot({ reward: result, after, equipped }); setSave(next) }, 4400)
  }
  const equipReward = () => { if (!loot || loot.reward.kind !== 'equipment') return; setSave(equipItem(save, loot.reward.item.id)); setLoot(null) }
  return <div className="chest-page content-page page-enter"><div className="page-heading centered"><span className="eyebrow">AUTEL DES POSSIBLES</span><h1>Coffre primordial</h1><p>Le destin est scellé avant que la roulette ne s’élance.</p></div><div className="chest-modes" aria-label="Type de coffre"><button className={mode === 'equipment' ? 'active' : ''} aria-pressed={mode === 'equipment'} onClick={() => setMode('equipment')} disabled={spinning}>Équipement</button><button className={mode === 'warrior' ? 'active' : ''} aria-pressed={mode === 'warrior'} onClick={() => setMode('warrior')} disabled={spinning}>Warrior</button></div><div className={`chest chest-v06 ${spinning ? 'opening' : ''}`}><img className="chest-main" src={spinning ? assetsV06.chest.open : assetsV06.chest.closed} alt={spinning ? 'Coffre primordial ouvert' : 'Coffre primordial fermé'}/>{spinning && <img className="chest-glow" src={assetsV06.chest.glow} alt=""/>}</div>
    {mode === 'equipment' && (spinning || loot) && <div className={`roulette ${spinning ? 'spinning' : 'finished'}`}><div className="roulette-marker"/><div className="roulette-track">{strip.map((item, index) => <div className={`roulette-card ${rarityClass(item.rarity)} ${!spinning && index === 15 ? 'winner' : ''}`} key={`${item.id}-${index}`}><EquipmentArt item={item} compact/><strong>{item.name}</strong><span>{item.rarity}</span></div>)}</div></div>}
    {!loot && !warriorLoot && <button className="primary chest-button" onClick={open} disabled={!canOpenChest(save, admin) || spinning}>{spinning ? 'LE TEMPS SE PLIE…' : <><GameIcon group="navigation" name="chest"/> OUVRIR · {GAME.chestCost} <GameIcon group="stats" name="coins"/></>}</button>}
    {!canOpenChest(save, admin) && !spinning && <p className="hint">Il te faut encore {GAME.chestCost - save.coins} pièces.</p>}
    {loot && <div className="loot-modal" role="dialog" aria-modal="true" aria-label="Récompense du coffre"><div className="loot-modal-panel"><LootReveal loot={loot} onEquip={equipReward} onStore={() => setLoot(null)}/></div></div>} 
    {warriorLoot && <div className="loot-modal" role="dialog" aria-modal="true" aria-label="Récompense du coffre Warrior"><div className="loot-modal-panel"><div className="reward-card warrior-reward"><WarriorChestReveal warrior={warriorLoot.warrior} duplicate={warriorLoot.duplicate}/><button className="primary wide" onClick={() => setWarriorLoot(null)}>CONTINUER</button></div></div></div>}
    <div className="odds"><span>Commun 43,49 %</span><span>Peu commun 40 %</span><span>Rare 15 %</span><span>Épique 1 %</span><span>Légendaire 0,5 %</span><span>Mythique 0,01 %</span></div>
  </div>
}

function Adventure({ save, startBattle, admin }: { save: SaveData; startBattle: (mode: 'campaign', node: number) => void; admin: boolean }) {
  const [walking, setWalking] = useState<number | null>(null)
  const choose = (node: number) => { if (!canEnterCampaignNode(save, node, admin) || walking) return; setWalking(node); setTimeout(() => startBattle('campaign', node), 850) }
  return <div className="adventure-page page-enter"><div className="adventure-copy"><span className="eyebrow">CARTE I · ÈRE PRIMORDIALE</span><h1>La Vallée des Titans</h1><p>La puissance qui sommeille au volcan déforme la faune et les guerriers.</p><span className="daily-pill"><GameIcon group="stats" name="xp"/> {save.campaignRemaining} / 10 combats récompensés</span></div><div className="map-scene"><div className="volcano"/><div className="mountains"/><div className="map-path"/>
    {Array.from({ length: 20 }, (_, i) => i + 1).map((node) => { const done = save.defeatedNodes.includes(node), accessible = node === save.campaignNode, elite = [5,10,15].includes(node), boss = node === 20; return <button key={node} onClick={() => choose(node)} style={{ '--x': `${12 + ((node - 1) % 5) * 19 + (Math.floor((node - 1) / 5) % 2 ? 6 : 0)}%`, '--y': `${82 - Math.floor((node - 1) / 5) * 23}%` } as React.CSSProperties} className={`map-node ${done ? 'done' : ''} ${accessible ? 'accessible' : ''} ${elite ? 'elite' : ''} ${boss ? 'boss' : ''}`}><span>{boss ? <Trophy/> : elite ? <GameIcon group="navigation" name="force"/> : node}</span>{node > save.campaignNode && !admin && <GameIcon group="system" name="lock" className="node-lock"/>}{accessible && <div className={`map-avatar ${walking === node ? 'walking' : ''}`}><ProductionWarrior weapon={save.equippedWeapon}/></div>}</button> })}
  </div><div className="map-legend"><span><i className="standard"/>Standard</span><span><i className="elite"/>Élite</span><span><i className="boss"/>Boss</span></div></div>
}

interface ActiveBattle { result: BattleResult; mode: 'training' | 'campaign'; node: number; enemyLevel: number }
interface BattleSummary { xp: number; coins: number; levelUp: number; badges: string[]; campaignProgress?: string }

export function BattleResultOverlay({ winner, enemyName, summary, warriorLevel, onContinue }: { winner: BattleResult['winner']; enemyName: string; summary: BattleSummary; warriorLevel: number; onContinue: () => void }) {
  return <div className="result-overlay" role="dialog" aria-modal="true" aria-label="Résultat du combat">
    <section className={`result-sheet ${winner}`}>
      <span className="result-kicker">COMBAT TERMINÉ</span>
      <h1>{winner === 'player' ? 'VICTOIRE' : 'DÉFAITE'}</h1>
      <p>contre <strong>{enemyName}</strong></p>
      <div className="result-rewards">
        <span><GameIcon group="stats" name="xp"/><b>+{summary.xp} XP</b></span>
        <span><GameIcon group="stats" name="coins"/><b>+{summary.coins} pièces</b></span>
      </div>
      {summary.levelUp > 0 && <div className="result-callout"><Sparkles/> Niveau {warriorLevel} atteint</div>}
      {summary.badges.map((badge) => <div className="result-callout" key={badge}><GameIcon group="stats" name="badge"/> Badge débloqué : {badge}</div>)}
      {summary.campaignProgress && <div className="campaign-result"><GameIcon group="navigation" name="adventure"/><span>{summary.campaignProgress}</span></div>}
      <button className="result-continue" onClick={onContinue}>CONTINUER</button>
    </section>
  </div>
}

function Battle({ save, setSave, active, onExit, admin }: { save: SaveData; setSave: (save: SaveData) => void; active: ActiveBattle; onExit: () => void; admin: boolean }) {
  const [index, setIndex] = useState(-1), [done, setDone] = useState(false), [settled, setSettled] = useState(false), [summary, setSummary] = useState<BattleSummary | null>(null)
  const [playerState, setPlayerState] = useState<PlayerState>('idle'), [enemyState, setEnemyState] = useState<EnemyVisualPose>('idle'), [ready, setReady] = useState(false)
  const [enemyKitReady, setEnemyKitReady] = useState(false), [enemyMotion, setEnemyMotion] = useState<EnemyMotion>('idle')
  const [enemyFxVisible, setEnemyFxVisible] = useState(false), [enemyFxSequence, setEnemyFxSequence] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const [kargApproaching, setKargApproaching] = useState(false)
  const [companionPhase, setCompanionPhase] = useState<'idle' | 'run' | 'attack' | 'return'>(() => {
    const query = new URLSearchParams(window.location.search)
    const requested = query.get('qaCompanion')
    return import.meta.env.DEV && admin && query.has('qaHold') && (requested === 'run' || requested === 'attack' || requested === 'return') ? requested : 'idle'
  })
  const [timedFxVisible, setTimedFxVisible] = useState(false), [timedFxSequence, setTimedFxSequence] = useState(0)
  const arenaRef = useRef<HTMLDivElement>(null), playerRef = useRef<HTMLDivElement>(null), enemyRef = useRef<HTMLDivElement>(null)
  const [battleBounds, setBattleBounds] = useState<{ measurements: WarriorBattleMeasurements; mobile: boolean } | null>(null)
  const warriorId = activeWarrior(save).id
  const spriteKit = warriorSpriteKit(warriorId)
  const hasSpriteKit = Boolean(spriteKit)
  useLayoutEffect(() => {
    const arena = arenaRef.current, player = playerRef.current, enemy = enemyRef.current
    if (!arena || !player || !enemy) return
    const measure = () => setBattleBounds({ measurements: {
      playerCenterX: player.offsetLeft, enemyCenterX: enemy.offsetLeft,
      playerWidth: player.offsetWidth, playerHeight: player.offsetHeight,
      enemyWidth: enemy.offsetWidth, enemyHeight: enemy.offsetHeight,
      groundFromBottom: arena.clientHeight - player.offsetTop - player.offsetHeight,
    }, mobile: window.innerWidth <= 700 })
    measure()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (observer) observer.observe(arena)
    window.addEventListener('resize', measure)
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure) }
  }, [])
  const qaHold = import.meta.env.DEV && admin && new URLSearchParams(window.location.search).has('qaHold')
  const qaFx = qaHold && new URLSearchParams(window.location.search).has('qaFx')
  const requestedQaPose = qaHold ? new URLSearchParams(window.location.search).get('qaPose') : null
  const qaPose = requestedQaPose && ['idle', 'approach', 'attack', 'hurt', 'dodge', 'block', 'ko'].includes(requestedQaPose)
    ? requestedQaPose as PlayerState | 'approach' : null
  const playerVisualState = qaPose ?? (spriteKit?.attackKind === 'companion' && companionPhase !== 'idle'
    ? 'attack'
    : kargApproaching && hasSpriteKit ? 'approach' : playerState)
  const event = index >= 0 ? active.result.events[index] : undefined
  const isCritical = event?.type === 'damage' && active.result.events[index - 1]?.type === 'critical'
  const requestedEnemy = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('enemy') : null
  const enemyId = requestedEnemy && enemyIds.includes(requestedEnemy as EnemyId)
    ? requestedEnemy as EnemyId
    : resolveEnemyId(active.node || active.enemyLevel, active.node === 20)
  const enemyKit = enemySpriteKit(enemyId)
  const settle = () => {
    if (settled) return
    const next = clone(save), won = active.result.winner === 'player', elite = [5,10,15].includes(active.node), boss = active.node === 20
    const previousLevel = activeWarrior(save).level, previousBadges = new Set(save.badges.map((badge) => badge.id))
    const baseXp = 100 + 12 * active.enemyLevel
    const xp = active.mode === 'training' ? (won ? 1 : 0) : Math.round(baseXp * (won ? (boss ? 2.5 : elite ? 1.5 : 1) : 0.1))
    const coins = active.mode === 'training' ? (won ? 1 : 0) : won ? 50 : 10
    next.coins += coins; addWarriorXp(next, xp)
    if (active.mode === 'training') { next.trainingRemaining = Math.max(0, next.trainingRemaining - 1); if (won) { next.trainingWins += 1; next.totalWins += 1 } }
    else { next.campaignRemaining = Math.max(0, next.campaignRemaining - 1); if (won) { next.totalWins += 1; if (!next.defeatedNodes.includes(active.node)) next.defeatedNodes.push(active.node); next.campaignNode = Math.min(20, active.node + 1); if (elite) unlock(next, 'first-elite'); if (boss) { unlock(next, 'boss'); next.bossTrophyPending = true; if (!next.eraRewardClaimed) { next.coins += 100; next.chests += 3; addWarriorXp(next, 500); next.eraRewardClaimed = true } } } }
    if (won) unlock(next, 'first-win'); if (next.trainingWins >= 10) unlock(next, 'training-10'); if (next.trainingWins >= 50) unlock(next, 'training-50')
    setSummary({ xp, coins, levelUp: activeWarrior(next).level - previousLevel, badges: next.badges.filter((badge) => !previousBadges.has(badge.id)).map((badge) => badges.find(([id]) => id === badge.id)?.[1] ?? badge.id), campaignProgress: active.mode === 'campaign' ? (won ? `Niveau ${active.node} terminé${active.node < 20 ? ` · prochain : niveau ${active.node + 1}` : ' · Ère achevée'}` : `Niveau ${active.node} à retenter`) : undefined })
    setSave(next); setSettled(true)
  }
  useEffect(() => {
    let live = true
    Promise.all([preloadBattleAssetsV06('male', save.equippedWeapon, enemyId, !hasSpriteKit, !enemyKit), preloadWarriorSpriteKit(warriorId), preloadEnemySpriteKit(enemyId)]).then(async ([, , modernReady]) => {
      if (!modernReady) await preloadBattleAssetsV06('male', save.equippedWeapon, enemyId, false, true)
      if (live) { setEnemyKitReady(modernReady); setReady(true) }
    })
    return () => { live = false }
  }, [save.equippedWeapon, enemyId, warriorId, hasSpriteKit, enemyKit])
  useEffect(() => {
    if (!timedFxVisible || !spriteKit?.attackPresentation) return
    const timer = window.setTimeout(() => setTimedFxVisible(false), spriteKit.attackPresentation.fxDurationMs / save.speed)
    return () => clearTimeout(timer)
  }, [timedFxVisible, spriteKit, save.speed])
  useEffect(() => {
    if (!ready || done) { if (done) settle(); return }
    if (qaHold) return
    if (skipped) return
    const timers: number[] = []
    const later = (fn: () => void, delay: number) => timers.push(window.setTimeout(fn, delay / save.speed))
    if (index < 0) { later(() => setIndex(0), 260); return () => timers.forEach(clearTimeout) }
    if (!event) { setDone(true); return }
    const recentAttack = active.result.events.slice(Math.max(0, index - 3), index).reverse().find((entry) => entry.type === 'attack')
    const continuesStrike = Boolean(recentAttack && ['critical', 'damage', 'bleed', 'skill'].includes(event.type))
    if (!continuesStrike && event.type !== 'ko') { setPlayerState('idle'); setEnemyState('idle'); setEnemyMotion('idle'); setEnemyFxVisible(false); setKargApproaching(false); setTimedFxVisible(false); setCompanionPhase('idle') }
    if (continuesStrike && recentAttack?.actor === 'enemy' && event.type !== 'attack') setEnemyMotion('return')
    let duration = 360
    if (event.type === 'attack') {
      const motion = event.actor === 'player' ? weaponMotion(save.equippedWeapon) : 'heavy'
      const spriteTimeline = spriteKit && event.actor === 'player' ? warriorAttackTimeline(spriteKit) : null
      const anticipation = spriteTimeline?.approachAtMs ?? (motion === 'heavy' ? 125 : motion === 'claw' ? 90 : motion === 'spear' ? 100 : 110)
      const contact = spriteTimeline?.eventDurationMs ?? (motion === 'heavy' ? 450 : motion === 'spear' ? 380 : motion === 'axe' ? 400 : motion === 'claw' ? 340 : motion === 'ranged' ? 430 : 390)
      if (event.actor === 'player') {
        setPlayerState('anticipation')
        if (hasSpriteKit) {
          if (warriorUsesApproach(spriteKit!)) later(() => setKargApproaching(true), anticipation)
          later(() => { setKargApproaching(false); setPlayerState('attack'); if (spriteKit?.attackKind === 'companion') setCompanionPhase('run') }, spriteTimeline!.poseAtMs)
          if (spriteKit?.attackKind === 'companion') later(() => setCompanionPhase('attack'), spriteTimeline!.fxCueMs ?? spriteTimeline!.eventDurationMs - 280)
          else if (spriteTimeline!.fxCueMs !== null && (spriteKit?.attackKind === 'ranged' || attackHasImpact(active.result.events, index))) later(() => { setTimedFxSequence((current) => current + 1); setTimedFxVisible(true) }, spriteTimeline!.fxCueMs)
        } else later(() => setPlayerState('attack'), anticipation)
      } else if (enemyKitReady && enemyKit) {
        if (enemyKit.attackKind === 'melee') { setEnemyState('run'); setEnemyMotion('approach'); later(() => setEnemyState('anticipation'), enemyKit.anticipationAtMs) }
        else { setEnemyState('anticipation'); setEnemyMotion('idle') }
        later(() => setEnemyState('attack'), enemyKit.poseAtMs)
        later(() => { setEnemyFxSequence((current) => current + 1); setEnemyFxVisible(true) }, enemyKit.fxAtMs)
      } else {
        setEnemyState('anticipation'); later(() => setEnemyState('attack'), anticipation)
      }
      duration = event.actor === 'enemy' && enemyKitReady && enemyKit ? enemyKit.attackMs : contact
    }
    else if (event.type === 'critical') { duration = 100 }
    else if (event.type === 'dodge') {
      if (event.actor === 'player') { setPlayerState(playerReactionForEvent(event) ?? 'idle'); setEnemyMotion('return'); setEnemyFxVisible(false) } else setEnemyState('dodge')
      if (event.actor === 'player') later(() => setPlayerState('idle'), 350)
      else later(() => setEnemyState('idle'), 350)
      duration = 380
    }
    else if (event.type === 'damage' || event.type === 'bleed') {
      const previous = active.result.events[index - 1]
      const next = active.result.events[index + 1]
      if (event.target === 'player') { setKargApproaching(false); setPlayerState(playerReactionForEvent(event, previous, next) ?? 'hurt') }
      const enemyDies = event.target === 'enemy' && event.enemyHp === 0 && !(next?.type === 'heal' && next.label === 'Second Souffle')
      if (event.target === 'enemy') setEnemyState(enemyDies ? 'ko' : previous?.type === 'skill' && previous.label === 'Parade' && previous.actor === 'enemy' ? 'block' : 'hit')
      if (event.actor === 'enemy') setEnemyFxVisible(false)
      if (event.actor === 'player') { if (spriteKit?.attackKind === 'companion') setCompanionPhase('return'); later(() => setPlayerState('recovery'), spriteKit?.attackPresentation?.contactHoldMs ?? 90); later(() => { setPlayerState('idle'); setCompanionPhase('idle') }, spriteKit?.attackKind === 'companion' ? 310 : 265) }
      else if (!enemyDies) { later(() => setEnemyState('idle'), 230) }
      duration = 320
    }
    else if (event.type === 'skill' && event.label === 'Parade') { if (event.actor === 'player') setPlayerState(playerReactionForEvent(event) ?? 'idle'); else setEnemyState('block'); duration = 420 }
    else if (event.type === 'ko') { setEnemyFxVisible(false); setEnemyMotion('idle'); if (event.target === 'player') setPlayerState(playerReactionForEvent(event) ?? 'ko'); else setEnemyState('ko'); if (event.actor === 'player') setPlayerState('victory'); else setEnemyState('idle'); duration = event.target === 'player' && hasSpriteKit ? Math.max(780, spriteKit?.durationMs.ko ?? 780) : event.target === 'enemy' && enemyKitReady ? 780 : 620 }
    later(() => { if (index >= active.result.events.length - 1) setDone(true); else setIndex((current) => current + 1) }, duration)
    return () => timers.forEach(clearTimeout)
  }, [index, done, ready, skipped, save.speed, save.equippedWeapon, event, active.result.events, isCritical, hasSpriteKit, spriteKit, qaHold, enemyKitReady, enemyKit])
  const skip = () => {
    const final = finalBattleFrame(active.result)
    setSkipped(true)
    setKargApproaching(false); setTimedFxVisible(false); setEnemyFxVisible(false); setEnemyMotion('idle'); setCompanionPhase('idle'); setPlayerState(final.playerState); setEnemyState(enemyVisualPose(final.enemyState)); setIndex(final.index)
    window.setTimeout(() => setDone(true), 260 / save.speed)
  }
  const playerHp = event?.playerHp ?? effectiveStats(save).hp, enemyHp = event?.enemyHp ?? active.result.enemy.stats.hp
  const setSpeed = (speed: 1 | 2 | 3) => { const next = clone(save); next.speed = speed; setSave(next) }
  const ranged = save.equippedWeapon === 'hunter-bow' && !spriteKit?.projectile && event?.actor === 'player' && event.type === 'attack'
  const effectTarget = event && ['dodge', 'skill', 'heal'].includes(event.type) ? event.actor : event?.target ?? 'enemy'
  const floatingText = combatTextForEvent(event, isCritical)
  const impactEffect = isCritical ? assetsV06.effects.criticalStars : weaponMotion(save.equippedWeapon) === 'heavy' ? assetsV06.effects.impactGround : assetsV06.effects.impactStar
  const attackKind = spriteKit?.attackKind ?? 'melee'
  const showProjectile = (timedFxVisible || qaFx) && attackKind === 'ranged' && Boolean(spriteKit?.projectile)
  const showWarriorFx = (timedFxVisible && attackKind === 'melee') || (event?.type === 'damage' && event.actor === 'player' && hasSpriteKit && (!spriteKit?.attackPresentation || attackKind !== 'melee'))
  const spriteTimeline = spriteKit ? warriorAttackTimeline(spriteKit) : null
  const enemyVisualSize = enemyKit && battleBounds ? enemyPaintedBattleSize(enemyKit, battleBounds.measurements.enemyHeight, battleBounds.mobile) : null
  const playerVisualWidth = spriteKit && battleBounds ? battleBounds.measurements.playerWidth * (battleBounds.mobile ? spriteKit.mobileScale : spriteKit.scale) * warriorCombatFactor(warriorId, battleBounds.mobile) : 0
  const battleGeometry = spriteKit && battleBounds ? warriorBattleGeometry(spriteKit, battleBounds.measurements, battleBounds.mobile, {
    playerFactor: warriorCombatFactor(warriorId, battleBounds.mobile),
    enemyVisualWidth: enemyVisualSize?.width,
    enemyVisualHeight: enemyVisualSize?.height,
  }) : null
  const enemyApproachDistance = enemyKit && battleBounds ? enemyContactDistance(enemyKit, battleBounds.measurements.playerCenterX, battleBounds.measurements.enemyCenterX, playerVisualWidth, enemyVisualSize?.width ?? battleBounds.measurements.enemyWidth, battleBounds.mobile) : 0
  const enemyProjectile = enemyKit && battleBounds && spriteKit ? enemyProjectileGeometry(enemyKit, battleBounds.measurements, battleBounds.mobile, warriorId, battleBounds.mobile ? spriteKit.mobileScale : spriteKit.scale) : null
  const fighterStyle = spriteKit ? {
    '--fighter-aspect': `${spriteKit.frameWidth} / ${spriteKit.frameHeight}`,
    '--sprite-approach-ms': `${Math.max(1, (spriteTimeline?.poseAtMs ?? 230) - (spriteTimeline?.approachAtMs ?? 100))}ms`,
    '--sprite-contact-ms': `${Math.max(1, (spriteTimeline?.eventDurationMs ?? 500) - (spriteTimeline?.poseAtMs ?? 230))}ms`,
    '--sprite-return-ms': `${spriteKit.returnMs ?? 240}ms`,
    ...(battleGeometry?.approachDistance !== null && battleGeometry?.approachDistance !== undefined ? { '--sprite-approach-distance': `${battleGeometry.approachDistance}px` } : {}),
    ...(battleGeometry?.contactDistance !== null && battleGeometry?.contactDistance !== undefined ? { '--sprite-contact-distance': `${battleGeometry.contactDistance}px` } : {}),
  } as React.CSSProperties : undefined
  return <div className={`battle-page ${isCritical ? 'screen-shake' : ''} ${ready ? 'assets-ready' : 'assets-loading'} ${skipped ? 'skip-to-final' : ''} ${qaFx ? 'qa-hold-fx' : ''}`} style={{ '--battle-speed': save.speed } as React.CSSProperties}><div className="battle-top"><div><span className="eyebrow">{active.mode === 'training' ? 'ENTRAÎNEMENT' : `NIVEAU ${active.node}`}</span><strong>Arène Primordiale</strong></div><div className="speed-control" role="group" aria-label="Vitesse du combat">{([1,2,3] as const).map((speed) => <button aria-pressed={save.speed === speed} className={save.speed === speed ? 'active' : ''} onClick={() => setSpeed(speed)} key={speed}>×{speed}</button>)}</div><button className="skip" onClick={skip}>Passer</button></div>{admin && <span className="admin-indicator admin-battle-indicator">ADMIN LOCAL</span>}
    <div ref={arenaRef} style={{ '--companion-distance': battleGeometry ? `${battleGeometry.companionDistance}px` : undefined, '--player-combat-text-lift': `${(battleBounds?.mobile ? spriteKit?.combatTextLift?.mobile ?? 110 : spriteKit?.combatTextLift?.desktop ?? 163) * warriorCombatFactor(warriorId, battleBounds?.mobile ?? false)}px`, '--enemy-combat-text-lift': `${enemyVisualSize ? enemyVisualSize.height + (battleBounds?.mobile ? 14 : 28) : battleBounds?.mobile ? 110 : 163}px` } as React.CSSProperties} className={`arena event-${event?.type ?? 'idle'} actor-${event?.actor ?? 'player'} ${hasSpriteKit ? 'has-warrior-sprite-kit' : ''}`}><img className="arena-layer arena-background" src={assetsV06.arena.background} alt=""/><img className="arena-layer arena-ground-v06" src={assetsV06.arena.ground} alt=""/><div className="battle-hud"><BattleFighterHud side="player" name={activeWarrior(save).name} level={activeWarrior(save).level} hp={playerHp} maxHp={effectiveStats(save).hp} portrait={activeWarrior(save).art} portraitId={warriorId}/><BattleFighterHud side="enemy" name={active.result.enemy.name} level={active.enemyLevel} hp={enemyHp} maxHp={active.result.enemy.stats.hp} portrait={enemySprite(enemyId, 'idle')} portraitId={enemyId}/></div><div ref={playerRef} style={fighterStyle} className={`fighter player phase-${playerVisualState} ${hasSpriteKit ? 'has-sprite-kit' : ''} attack-${attackKind} motion-${weaponMotion(save.equippedWeapon)}`}><img className="contact-shadow" src={assetsV06.arena.contactShadow} alt=""/><WarriorSprite warriorId={warriorId} weapon={save.equippedWeapon} state={playerVisualState} combat/></div>
      {companionPhase !== 'idle' && <WarriorCompanion warriorId={warriorId} phase={companionPhase}/>}
      {showProjectile && <div className="warrior-projectile" style={{ '--projectile-aspect': `${spriteKit?.fxGeometry?.frameWidth ?? 543} / ${spriteKit?.fxGeometry?.frameHeight ?? 724}`, ...(battleGeometry?.projectile ? { '--projectile-start-x': `${battleGeometry.projectile.left}px`, '--projectile-bottom': `${battleGeometry.projectile.bottom}px`, '--projectile-width': `${battleGeometry.projectile.width}px`, '--projectile-travel-x': `${battleGeometry.projectile.travelX}px`, '--projectile-travel-y': `${-battleGeometry.projectile.travelY}px` } : {}) } as React.CSSProperties} key={`projectile-${timedFxSequence}`}><WarriorAttackFx warriorId={warriorId} source={spriteKit?.projectile}/></div>}
      {ranged && ['anticipation','attack'].includes(playerState) && <div className="projectile from-player to-enemy"><img src={assetsV06.effects.projectileArrow} alt=""/></div>}
      <div className={`impact-zone target-${effectTarget} ${weaponMotion(save.equippedWeapon) === 'heavy' ? 'ground-impact' : ''} ${isCritical ? 'is-critical' : ''}`}>
        {showWarriorFx && <WarriorAttackFx key={spriteKit?.attackPresentation ? `fx-cue-${timedFxSequence}-${index}` : `fx-${index}`} warriorId={warriorId} source={spriteKit?.impactFx}/>}
        {event?.type === 'damage' && <>{!showWarriorFx && !spriteKit?.attackPresentation && <img className="production-impact" src={impactEffect} alt=""/>}{isCritical && <em>CRITIQUE</em>}</>}
        {['skill','heal','bleed'].includes(event?.type ?? '') && !(event?.type === 'skill' && event.label === 'Parade') && <b>{event?.label ?? event?.type}</b>}
        {event?.type === 'dodge' && <img className="production-dodge" src={assetsV06.effects.dodgeTrail} alt=""/>}
      </div>
      {floatingText && <FloatingCombatText key={`combat-text-${index}`} text={floatingText}/>}
      {enemyKitReady && enemyKit && enemyFxVisible && (enemyKit.attackKind === 'ranged' ? enemyProjectile && <div key={`enemy-projectile-${enemyFxSequence}`} className="enemy-projectile-flight" style={{ '--enemy-projectile-left': `${enemyProjectile.left}px`, '--enemy-projectile-bottom': `${enemyProjectile.bottom}px`, '--enemy-projectile-dx': `${enemyProjectile.travelX}px`, '--enemy-projectile-dy': `${enemyProjectile.travelY}px`, '--enemy-projectile-width': `${enemyProjectile.width}px`, '--enemy-projectile-ms': `${enemyKit.attackMs - enemyKit.fxAtMs}ms`, '--enemy-fx-ratio': `${enemyKit.geometry['attack-fx'][0]} / ${enemyKit.geometry['attack-fx'][1]}` } as React.CSSProperties}><EnemyAttackFx enemyId={enemyId} projectile/></div> : <div key={`enemy-fx-${enemyFxSequence}`} className={`enemy-attack-fx-zone fx-${enemyId}`} style={{ '--enemy-fx-ratio': `${enemyKit.geometry['attack-fx'][0]} / ${enemyKit.geometry['attack-fx'][1]}` } as React.CSSProperties}><EnemyAttackFx enemyId={enemyId}/></div>)}
      <div ref={enemyRef} style={enemyKitReady && enemyKit ? { '--enemy-approach-distance': `${enemyApproachDistance}px`, '--enemy-attack-ms': `${enemyKit.attackMs}ms`, '--enemy-return-ms': `${enemyKit.returnMs}ms` } as React.CSSProperties : undefined} className={`fighter enemy phase-${enemyState} ${enemyId === 'mammoth' ? 'boss-fighter' : ''} ${enemyKitReady ? `enemy-modern motion-${enemyMotion}` : ''}`}><img className="contact-shadow" src={enemyId === 'mammoth' ? assetsV06.arena.bossShadow : assetsV06.arena.contactShadow} alt=""/>{enemyKitReady ? <EnemySprite enemyId={enemyId} pose={enemyState} koFinal={skipped && enemyState === 'ko'} combat/> : <ProductionEnemy enemyId={enemyId} state={enemyState === 'hit' ? 'hurt' : enemyState === 'run' ? 'idle' : enemyState === 'block' ? 'dodge' : enemyState} boss={active.node === 20}/>}</div><img className="arena-layer arena-foreground" src={assetsV06.arena.foreground} alt=""/></div>
    {done && settled && summary && <BattleResultOverlay winner={active.result.winner} enemyName={active.result.enemy.name} summary={summary} warriorLevel={activeWarrior(save).level} onContinue={onExit}/>}
  </div>
}

function LevelChoice({ save, setSave }: { save: SaveData; setSave: (save: SaveData) => void }) {
  const chooseStat = (stat: StatKey) => { const next = clone(save); next.ownedWarriors[next.activeWarriorId].bonusStats[stat] += stat === 'hp' ? 40 : 2; next.pendingLevelChoice = false; setSave(next) }
  const chooseSkill = () => { const pool = skills.filter((skill) => !save.unlockedSkills.includes(skill)); const next = clone(save); if (pool.length) next.unlockedSkills.push(pool[Math.floor(Math.random() * pool.length)]); next.pendingLevelChoice = false; setSave(next) }
  return <div className="modal-backdrop level-choice-backdrop"><section className="level-choice level-choice-premium" role="dialog" aria-modal="true" aria-label="Faveur du niveau"><span className="level-choice-mark" aria-hidden="true">✦</span><span className="eyebrow">NIVEAU {activeWarrior(save).level}</span><h2>Le temps t’accorde une faveur</h2><p>Choisis un attribut ou laisse le hasard éveiller une compétence.</p><div className="choice-grid">{([['strength','+2 Force'],['dodge','+2 Esquive'],['speed','+2 Vitesse'],['hp','+40 PV']] as [StatKey,string][]).map(([stat,label]) => <button onClick={() => chooseStat(stat)} key={stat}>{label}</button>)}<button className="skill-choice" onClick={chooseSkill}><GameIcon group="stats" name="xp"/>Compétence aléatoire</button></div></section></div>
}

function TrophyChoice({ save, setSave }: { save: SaveData; setSave: (save: SaveData) => void }) {
  const choose = (id: string) => { const next = addEquipmentCopy(save, id); next.bossTrophyPending = false; setSave(next) }
  return <div className="modal-backdrop"><section className="level-choice"><span className="eyebrow">BOSS PRIMORDIAL VAINCU</span><h2>Choisis ton trophée</h2><div className="trophy-grid">{['mammoth-spear','mammoth-plate'].map((id) => { const item = itemById(id); return <button className={rarityClass(item.rarity)} onClick={() => choose(id)} key={id}><EquipmentArt item={item}/><strong>{item.name}</strong><span>{item.bonus}</span></button> })}</div></section></div>
}

function SpriteLabFigure({ children, label, state }: { children: React.ReactNode; label: string; state?: string }) {
  const figure = useRef<HTMLElement>(null)
  const [size, setSize] = useState('mesure…')
  useEffect(() => {
    const host = figure.current
    const image = host?.querySelector('img')
    if (!host || !image) return
    const measure = () => {
      const rect = image.getBoundingClientRect()
      setSize(`${image.naturalWidth}×${image.naturalHeight} natif · ${Math.round(rect.width)}×${Math.round(rect.height)} rendu`)
    }
    image.addEventListener('load', measure)
    const observer = new ResizeObserver(measure)
    observer.observe(image)
    measure()
    return () => { image.removeEventListener('load', measure); observer.disconnect() }
  }, [children])
  return <figure ref={figure}>{children}<figcaption>{label}{state && <small>{state}</small>}<small className="sprite-size">{size}</small></figcaption></figure>
}

function SpriteLab() {
  const [grid, setGrid] = useState(true), [boxes, setBoxes] = useState(true), [baseline, setBaseline] = useState(true)
  return <main className={`sprite-lab ${grid ? 'show-grid' : ''} ${boxes ? 'show-boxes' : ''} ${baseline ? 'show-baseline' : ''}`}><header><span className="eyebrow">OUTIL DE DÉVELOPPEMENT</span><h1>Sprite Lab V0.6</h1><p>Une pose complète à la fois, canvas 512×512 constant et baseline commune.</p><div className="sprite-lab-controls"><label><input type="checkbox" checked={grid} onChange={(event) => setGrid(event.target.checked)}/> Quadrillage</label><label><input type="checkbox" checked={boxes} onChange={(event) => setBoxes(event.target.checked)}/> Bounding box</label><label><input type="checkbox" checked={baseline} onChange={(event) => setBaseline(event.target.checked)}/> Baseline</label></div></header>
    <section><h2>Équipements</h2><div className="sprite-lab-grid equipment">{equipment.map((item) => <SpriteLabFigure key={item.id} label={item.id} state={item.type}><img src={equipmentAsset(item.id, item.type)} alt=""/></SpriteLabFigure>)}</div></section>
    {(['male','female'] as const).map((sex) => <section key={sex}><h2>Sprite provisoire {sex}</h2><div className="sprite-lab-grid player-v06-lab">{playerWeapons.flatMap((weapon) => playerPoses.map((state) => <SpriteLabFigure key={`${sex}-${weapon}-${state}`} label={weapon} state={state}><ProductionWarrior sex={sex} weapon={weapon} state={state}/></SpriteLabFigure>))}</div></section>)}
    <section><h2>Ennemis</h2><div className="sprite-lab-grid">{enemyIds.flatMap((enemy) => spriteStates.filter((state) => !['victory'].includes(state)).map((state) => <SpriteLabFigure key={`${enemy}-${state}`} label={enemy} state={state}><ProductionEnemy enemyId={enemy} state={state}/></SpriteLabFigure>))}</div></section>
    <section><h2>Ombres de contact</h2><div className="sprite-lab-grid effects">{[assetsV06.arena.contactShadow, assetsV06.arena.bossShadow].map((src) => <SpriteLabFigure key={src} label={src.includes('boss') ? 'boss' : 'standard'}><img src={src} alt=""/></SpriteLabFigure>)}</div></section>
    <section><h2>Effets</h2><div className="sprite-lab-grid effects">{Object.entries(assetsV06.effects).map(([name, src]) => <SpriteLabFigure key={name} label={name}><img src={src} alt=""/></SpriteLabFigure>)}</div></section>
  </main>
}

function createActiveBattle(save: SaveData, mode: 'training' | 'campaign', node: number): ActiveBattle {
  const rng = seededRng(Date.now())
  const enemyLevel = Math.max(1, activeWarrior(save).level + (mode === 'training' ? Math.floor(rng() * 3) - 1 : Math.floor(node / 3)))
  const enemy = generateEnemy(enemyLevel, node, rng)
  const fighter: Fighter = { name: activeWarrior(save).name, stats: effectiveStats(save), skills: activeWarrior(save).skills, weapon: save.equippedWeapon, armor: save.equippedArmor }
  return { result: simulateBattle(fighter, enemy, Date.now()), mode, node, enemyLevel }
}

function GameApp() {
  const adminMode = isLocalAdmin(window.location)
  const query = new URLSearchParams(window.location.search)
  const desktopCombatPreview = import.meta.env.DEV && adminMode && query.has('desktopCombatPreview')
  const qaLevelChoice = import.meta.env.DEV && adminMode && query.has('qaLevelChoice')
  const qaMode = import.meta.env.DEV && (query.has('qaPreview') || desktopCombatPreview || qaLevelChoice || (adminMode && query.has('enemySpritePreview')))
  const requestedQaNode = Number(query.get('qaNode'))
  const qaNode = Number.isInteger(requestedQaNode) && requestedQaNode >= 1 && requestedQaNode <= 20 ? requestedQaNode : 1
  const [save, setSaveState] = useState<SaveData>(() => {
    const loaded = adminMode ? withAdminAccess(loadSave(localStorage, ADMIN_SAVE_KEY)) : loadSave()
    if (!qaMode) return loaded
    const qaWeapon = query.get('qaWeapon'), qaSkills = query.get('qaSkills'), qaWarrior = query.get('qaWarrior') ?? (desktopCombatPreview ? 'karg' : null)
    const qaSkillCount = qaSkills && /^\d+$/.test(qaSkills) ? Math.min(skills.length, Number(qaSkills)) : null
    const weapon = qaWeapon && equipment.some((item) => item.type === 'weapon' && item.id === qaWeapon) ? qaWeapon : loaded.equippedWeapon
    const owned = !weapon || loaded.owned[weapon] ? loaded.owned : { ...loaded.owned, [weapon]: { quantity: 1, level: 1, xp: 0, kills: 0 } }
    const previewWarrior = qaWarrior && warriorDefinitions[qaWarrior]
    const ownedWarriors = previewWarrior && !loaded.ownedWarriors[qaWarrior] ? { ...loaded.ownedWarriors, [qaWarrior]: { warriorId: qaWarrior, level: 1, xp: 0, bonusStats: { strength: 0, dodge: 0, speed: 0, hp: 0 } } } : loaded.ownedWarriors
    const activeWarriorId = previewWarrior ? qaWarrior : loaded.activeWarriorId
    const previewOwnedWarriors = qaLevelChoice ? { ...ownedWarriors, [activeWarriorId]: { ...ownedWarriors[activeWarriorId], level: 5 } } : ownedWarriors
    return { ...loaded, activeWarriorId, ownedWarriors: previewOwnedWarriors, pendingLevelChoice: qaLevelChoice || loaded.pendingLevelChoice, coins: query.has('qaCoins') ? Math.max(loaded.coins, Number(query.get('qaCoins')) || 500) : loaded.coins, owned, equippedWeapon: weapon, unlockedSkills: qaSkills === 'all' ? [...skills] : qaSkillCount !== null ? skills.slice(0, qaSkillCount) : loaded.unlockedSkills }
  }), [view, setView] = useState<View>(desktopCombatPreview ? 'battle' : 'hub'), [detail, setDetail] = useState<EquipmentDefinition | null>(null), [warriorDetailId, setWarriorDetailId] = useState<string | null>(null), [activeBattle, setActiveBattle] = useState<ActiveBattle | null>(() => desktopCombatPreview ? createActiveBattle(save, 'campaign', qaNode) : null)
  const [welcomeFlow, setWelcomeFlow] = useState(() => !adminMode && !qaMode && !save.welcomeChestOpened)
  const initial = useRef(true)
  const setSave = (next: SaveData) => setSaveState(adminMode ? withAdminAccess(next) : next)
  useEffect(() => { if (initial.current) initial.current = false; if (!qaMode) persistSave(save, localStorage, adminMode ? ADMIN_SAVE_KEY : undefined) }, [save, qaMode, adminMode])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [view])
  const startBattle = (mode: 'training' | 'campaign', node = 0) => {
    if (!canStartBattle(save, mode, adminMode)) return
    setActiveBattle(createActiveBattle(save, mode, node)); setView('battle')
  }
  const equip = (item: EquipmentDefinition) => setSave(equipItem(save, item.id))
  const content = useMemo(() => {
    if (view === 'hub') return save.activeWarriorId ? <Hub save={save} setView={setView} setDetail={setDetail}/> : <EmptyHub/>
    if (view === 'collection') return <Collection save={save} setSave={setSave} setWarriorDetail={setWarriorDetailId}/>
    if (view === 'chest') return <Chests save={save} setSave={setSave} admin={adminMode}/>
    if (view === 'adventure') return <Adventure save={save} startBattle={startBattle} admin={adminMode}/>
    if (view === 'training') return <div className="mode-page training-page page-enter"><div className="mode-visual"><div className="training-ring"><ProductionWarrior weapon={save.equippedWeapon}/></div></div><div className="mode-copy"><span className="eyebrow">ARÈNE QUOTIDIENNE</span><h1>Entraînement</h1><p>Affronte des Warriors de ton niveau.</p><div className="remaining"><strong>{save.trainingRemaining}</strong><span>combats récompensés<br/>restants sur 100</span></div><div className="training-rewards"><span><GameIcon group="stats" name="xp"/>+1 XP Warrior</span><span><GameIcon group="stats" name="coins"/>+1 pièce</span></div><button className="primary wide" disabled={!canStartBattle(save, 'training', adminMode)} onClick={() => startBattle('training')}>TROUVER UN ADVERSAIRE</button></div></div>
    if (view === 'duel') return <div className="soon page-enter"><div className="duel-emblem"><GameIcon group="navigation" name="duel"/></div><span className="eyebrow">PORTAIL VERROUILLÉ</span><h1>Duel asynchrone</h1><p>Prochainement</p><span>Prépare ton build. Les autres Warriors arrivent d’une autre ligne du temps.</span></div>
    return null
  }, [view, save])
  if (import.meta.env.DEV && adminMode && query.has('enemySpritePreview')) return <EnemySpritePreview/>
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('spriteLab')) return <SpriteLab/>
  if (view === 'battle' && activeBattle) return <Battle save={save} setSave={setSave} active={activeBattle} admin={adminMode} onExit={() => { setView(activeBattle.mode === 'campaign' ? 'adventure' : 'training'); setActiveBattle(null) }}/>
  return <><div className="app-shell" inert={welcomeFlow} aria-hidden={welcomeFlow}><Header save={save} view={view} setView={setView} admin={adminMode}/><main className="main-content">{content}</main><nav className="bottom-nav" aria-label="Navigation principale">{nav.map(({ id, label, icon }) => <button aria-label={label} className={view === id ? 'active' : ''} onClick={() => setView(id)} key={id}><GameIcon group="navigation" name={icon}/><span>{label}</span></button>)}</nav>
    {detail && <div className="modal-backdrop" onClick={() => setDetail(null)}><section className={`detail-sheet ${rarityClass(detail.rarity)}`} onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setDetail(null)}><X/></button><EquipmentArt item={detail}/><span className="rarity-label">{detail.rarity}</span><h2>{detail.name}</h2><p className="bonus">{detail.bonus}</p><p>{detail.effect}</p>{save.owned[detail.id] ? <button className="primary wide" disabled={[save.equippedWeapon, save.equippedArmor].includes(detail.id)} onClick={() => { equip(detail); setDetail(null) }}>{[save.equippedWeapon, save.equippedArmor].includes(detail.id) ? 'ÉQUIPÉ' : 'ÉQUIPER'}</button> : <div className="locked-copy"><GameIcon group="system" name="lock"/>À découvrir dans un coffre</div>}</section></div>}
    {warriorDetailId && view === 'collection' && <WarriorDetail save={save} warriorId={warriorDetailId} onClose={() => setWarriorDetailId(null)} onActivate={() => { setSave(activateWarrior(save, warriorDetailId)); setWarriorDetailId(null) }}/>} {save.pendingLevelChoice && <LevelChoice save={save} setSave={setSave}/>} {save.bossTrophyPending && <TrophyChoice save={save} setSave={setSave}/>}</div>{welcomeFlow && <WelcomeChest onClaim={(id) => setSave(claimWelcomeWarrior(save, id))} onDone={() => setWelcomeFlow(false)}/>}</>
}

export default function App() {
  if (import.meta.env.DEV && isLocalAdmin(window.location) && new URLSearchParams(window.location.search).has('hudPortraitPreview')) return <HudPortraitPreview/>
  if (import.meta.env.DEV && isLocalAdmin(window.location) && new URLSearchParams(window.location.search).has('spritePreview')) return <SpritePreview/>
  return <GameApp/>
}
