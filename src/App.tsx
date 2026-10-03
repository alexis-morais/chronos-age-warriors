import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Award, Check, ChevronLeft, Sparkles } from 'lucide-react'
import { ADMIN_SAVE_KEY, canEnterCampaignNode, canStartBattle, isLocalAdmin, withAdminAccess } from './admin'
import { equipment } from './data'
import { activateWarrior, addEquipmentCopy, addWarriorXp, claimWelcomeWarrior, effectiveStats, equipmentStats, equipItem, generateEnemy, rollWarriorChest, seededRng, simulateBattle, xpForLevel } from './game'
import { LEGACY_ADMIN_SAVE_KEY, LEGACY_SAVE_KEY, PREVIOUS_ADMIN_SAVE_KEY, PREVIOUS_SAVE_KEY, loadSave, persistSave, SAVE_KEY } from './storage'
import type { BattleResult, EquipmentDefinition, Fighter, Rarity, SaveData, View } from './types'
import { campaignBaseXp, campaignNodeTier } from './campaignProgression'
import { getNewlyUnlockedWarriorPassives, getWarriorPassives, type WarriorPassiveDefinition } from './warriorPassives'
import { MAX_WARRIOR_LEVEL } from './warriorProgression'
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
import { BadgesView } from './components/BadgesView'
import { ChestPage } from './components/ChestPage'
import { WarriorGacha } from './components/WarriorGacha'
import { shortEquipmentSummary } from './equipmentSummary'
import { AdventureMap } from './components/AdventureMap'
import { RiftPage } from './components/RiftPage'
import { primalMapLayout } from './art/adventureMapLayout'
import { activeWarrior, primalWarriors, warriorDefinitions } from './warriors'
import { grantEarnedBadges } from './badgeSystem'
import { recordBattleOutcome } from './victories'
import { createRiftEncounter, quitRift, resolveRiftStage, todayRiftRun, type RiftEncounter } from './rift'
import { RIFT_REWARDS, RIFT_STAGE_LABELS } from './riftBalance'
import { isWarriorOnExpedition } from './expedition'

const nav: { id: View; label: string; icon: string }[] = [
  { id: 'hub', label: 'Hub', icon: 'hub' }, { id: 'collection', label: 'Collection', icon: 'collection' },
  { id: 'activities', label: 'Faille', icon: 'training' }, { id: 'chest', label: 'Coffre', icon: 'chest' },
  { id: 'duel', label: 'Duel', icon: 'duel' },
]

const rarityClass = (rarity: Rarity) => `rarity-${rarity.toLowerCase().replace(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`
const itemById = (id: string) => equipment.find((item) => item.id === id)!
const clone = (save: SaveData): SaveData => structuredClone(save)

const statMeta = { strength: { label: 'Force', icon: 'force' }, dodge: { label: 'Esquive', icon: 'dodge' }, speed: { label: 'Vitesse', icon: 'speed' }, hp: { label: 'PV', icon: 'pv' } }
const formatStats = (item: EquipmentDefinition) => Object.entries(equipmentStats(item.id)).map(([key, value]) => `+${value} ${statMeta[key as keyof typeof statMeta].label}`)
const equipmentIcon = (type: EquipmentDefinition['type']) => `/assets/icons/collection/${type}.png`

function Stat({ type, value }: { type: 'strength' | 'dodge' | 'speed'; value: number }) {
  return <div className="stat"><GameIcon group="stats" name={statMeta[type].icon}/><span>{statMeta[type].label}</span><strong>{value}</strong></div>
}

function HubEquipmentSlot({ type, item }: { type: EquipmentDefinition['type']; item?: EquipmentDefinition }) {
  const label = type === 'weapon' ? 'Arme' : 'Armure'
  const summary = item ? [...formatStats(item), item.effect].join(' · ') : 'Emplacement vide'
  return <article className={`hub-equipment-slot ${item ? 'is-equipped' : 'is-empty'}`} aria-label={`${label} : ${item?.name ?? 'vide'}`}>
    <img src={equipmentIcon(type)} alt=""/>
    <div className="hub-equipment-copy"><strong>{item?.name ?? `Aucune ${label.toLowerCase()}`}</strong><span>{summary}</span></div>
  </article>
}

function Header({ save, view, setView, admin }: { save: SaveData; view: View; setView: (view: View) => void; admin: boolean }) {
  return <header className={`topbar ${admin ? 'is-admin' : ''}`}><button className="mini-brand" onClick={() => setView('hub')}><img src={assetsV06.brand.logo} alt="Chronos Age Warriors"/><span>ÈRE PRIMORDIALE</span>{admin && <span className="admin-indicator">ADMIN LOCAL</span>}</button><div className="topbar-title">{view === 'adventure' && <button className="icon-button" aria-label="Retour au Hub" onClick={() => setView('hub')}><ChevronLeft/></button>}<strong>{view === 'chest' ? 'Coffres' : view === 'adventure' ? 'Aventure' : view === 'activities' ? 'Faille' : view.charAt(0).toUpperCase() + view.slice(1)}</strong></div><div className="currency"><GameIcon group="stats" name="coins"/><strong>{save.coins}</strong></div></header>
}

function EmptyHub() {
  return <div className="hub-page empty-hub page-enter"><section className="hero-warrior"><span className="eyebrow">WARRIOR ACTIF</span><div className="empty-warrior-space"><GameIcon group="navigation" name="collection"/><span>Ton premier Warrior t’attend</span></div><div className="hero-name"><h1>Aucun Warrior actif</h1></div><div className="resource-row mobile-only"><span>Le coffre de bienvenue est prêt.</span></div><button className="adventure-button" disabled>AVENTURE</button></section><section className="stats-panel"><span className="eyebrow">PUISSANCE</span><h2>Statistiques</h2><p>Ouvre le coffre de bienvenue pour révéler ton Warrior.</p></section><section className="hub-bottom"><div className="skill-panel"><span className="eyebrow">PASSIFS</span><h2>Passifs du Warrior</h2><p>À découvrir avec ton Warrior.</p></div></section></div>
}

function WelcomeChest({ onClaim, onDone }: { onClaim: (warriorId: string) => void; onDone: () => void }) {
  const [warrior, setWarrior] = useState<(typeof primalWarriors)[number] | null>(null)
  const open = () => {
    if (warrior) return
    const drawn = rollWarriorChest(Math.random)
    setWarrior(drawn)
    onClaim(drawn.id)
  }
  return createPortal(warrior ? <WarriorGacha warrior={warrior} duplicate={false} welcome onContinue={onDone}/> : <div className="welcome-overlay" role="dialog" aria-modal="true" aria-label="Coffre Warrior de bienvenue"><section className="welcome-panel"><span className="eyebrow">BIENVENUE DANS CHRONOS</span><h2>Ton histoire commence ici</h2><p>Un coffre Warrior t’est offert. Découvre ton premier combattant.</p><div className="welcome-chest-art"><img src={assetsV06.chest.closed} alt="Coffre Warrior de bienvenue"/></div><button className="primary wide" autoFocus onClick={open}>OUVRIR MON COFFRE OFFERT</button></section></div>, document.body)
}

function Hub({ save, setView }: { save: SaveData; setView: (view: View) => void }) {
  const warrior = activeWarrior(save)
  const stats = warrior.stats
  const weapon = equipment.find((item) => item.id === save.equippedWeapon), armor = equipment.find((item) => item.id === save.equippedArmor)
  const passives = getWarriorPassives(warrior.id)
  const unlockedCount = passives.filter((passive) => warrior.level >= passive.unlockLevel).length
  const nextXp = xpForLevel(warrior.level)
  return <div className="hub-page page-enter">
    <section className="hero-warrior"><span className="eyebrow">WARRIOR ACTIF</span><div className="hero-avatar"><WarriorCard warrior={warrior} level={warrior.level} className="hub-warrior-card" loading="eager"/></div><div className="hero-name"><h1>{warrior.name}</h1><div className="warrior-tags"><span>{warrior.warriorClass}</span><span className={`warrior-rarity ${rarityClass(warrior.rarity)}`}>{warrior.rarity}</span></div></div><WarriorStats stats={stats} className="hub-warrior-stats"/>
      <div className="resource-row mobile-only"><span><GameIcon group="stats" name="xp"/>{save.campaignRemaining} / 10 combats récompensés</span></div>
      <button className="adventure-button" onClick={() => setView('adventure')}><GameIcon group="navigation" name="adventure"/><span><small>CAMPAGNE</small>AVENTURE</span><i>→</i></button>
    </section>
    <section className="stats-panel"><span className="eyebrow">PUISSANCE</span><h2>Statistiques</h2><div className="desktop-stats"><div className="hp-display"><GameIcon group="stats" name="pv"/><span>POINTS DE VIE</span><strong>{stats.hp}</strong></div><div className="stats-grid"><Stat type="strength" value={stats.strength}/><Stat type="dodge" value={stats.dodge}/><Stat type="speed" value={stats.speed}/></div><div className="xp-block"><span>EXPÉRIENCE <b>{nextXp ? `${warrior.xp} / ${nextXp}` : 'Niveau maximum'}</b></span><div className="progress"><i style={{ width: `${nextXp ? warrior.xp / nextXp * 100 : 100}%` }}/></div></div><div className="daily"><span><GameIcon group="stats" name="xp"/> {save.campaignRemaining} / 10 Campagne</span></div></div></section>
    <section className="hub-bottom"><div className="skill-panel skill-summary"><div className="section-title"><div><span className="eyebrow">PASSIFS</span><h2>Passifs du Warrior</h2></div><span>{unlockedCount} / 3 débloqués</span></div>
      <div className="passive-milestones">{passives.map((passive) => <article className={`passive-milestone ${warrior.level >= passive.unlockLevel ? 'reached' : 'locked'}`} key={passive.id}><span className="passive-level">Niv. {passive.unlockLevel} · {warrior.level >= passive.unlockLevel ? 'Débloqué' : 'Verrouillé'}</span><strong>{passive.name}</strong><p>{passive.description}</p></article>)}</div></div>
      <div className="hub-equipment" aria-label="Équipement du Warrior actif"><span className="eyebrow">ÉQUIPEMENT</span><div className="hub-equipment-grid"><HubEquipmentSlot type="weapon" item={weapon}/><HubEquipmentSlot type="armor" item={armor}/></div></div>
    </section>
  </div>
}

function EquipmentCollection({ save, setSave, type, setType }: { save: SaveData; setSave: (save: SaveData) => void; type: EquipmentDefinition['type']; setType: (type: EquipmentDefinition['type']) => void }) {
  const [confirmation, setConfirmation] = useState<{ itemId: string; label: string; sequence: number } | null>(null)
  const timer = useRef<number | null>(null)
  const sequence = useRef(0)
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current) }, [])
  const inventory = equipment.filter((item) => item.type === type && (save.owned[item.id]?.quantity ?? (save.owned[item.id] ? 1 : 0)) > 0)
  const activeGear = [equipment.find((item) => item.id === save.equippedWeapon), equipment.find((item) => item.id === save.equippedArmor)]
  const equip = (item: EquipmentDefinition) => {
    if ((item.type === 'weapon' ? save.equippedWeapon : save.equippedArmor) === item.id) return
    setSave(equipItem(save, item.id))
    if (timer.current !== null) window.clearTimeout(timer.current)
    setConfirmation({ itemId: item.id, label: `${item.type === 'weapon' ? 'Arme' : 'Armure'} équipée : ${item.name}`, sequence: ++sequence.current })
    timer.current = window.setTimeout(() => { setConfirmation(null); timer.current = null }, 2000)
  }
  return <section className="equipment-inventory">
    <div className="active-loadout"><span className="eyebrow">ÉQUIPEMENT DE {activeWarrior(save).name.toUpperCase()}</span><div className="active-loadout-slots">{activeGear.map((item, index) => <div className={`active-loadout-slot ${confirmation?.itemId === item?.id ? 'just-equipped' : ''}`} key={index}><img src={equipmentIcon(index === 0 ? 'weapon' : 'armor')} alt=""/><span><strong>{item?.name ?? (index === 0 ? 'Aucune arme' : 'Aucune armure')}</strong><small>{item ? shortEquipmentSummary(item) : 'Emplacement vide'}</small></span></div>)}</div></div>
    <div className="inventory-filters" aria-label="Catégorie d’équipement"><button aria-pressed={type === 'weapon'} className={type === 'weapon' ? 'active' : ''} onClick={() => setType('weapon')}><img src={equipmentIcon('weapon')} alt=""/>Armes</button><button aria-pressed={type === 'armor'} className={type === 'armor' ? 'active' : ''} onClick={() => setType('armor')}><img src={equipmentIcon('armor')} alt=""/>Armures</button></div>
    {inventory.length ? <div className="equipment-inventory-grid">{inventory.map((item) => {
      const equipped = (item.type === 'weapon' ? save.equippedWeapon : save.equippedArmor) === item.id
      const quantity = save.owned[item.id].quantity ?? 1
      const contents = <><img src={equipmentIcon(item.type)} alt=""/><span className="inventory-entry-copy"><strong>{item.name}</strong><small>{shortEquipmentSummary(item)}</small></span><span className="inventory-entry-meta">{equipped && <span className="inventory-equipped"><Check aria-hidden="true"/>Équipé</span>}{quantity > 1 && <b className="inventory-quantity">×{quantity}</b>}</span></>
      const className = `inventory-entry ${rarityClass(item.rarity)} ${equipped ? 'is-equipped' : ''} ${confirmation?.itemId === item.id ? 'just-equipped' : ''}`
      return equipped ? <article key={item.id} className={className} aria-label={`${item.name} équipé`}>{contents}</article> : <button key={item.id} className={className} onClick={() => equip(item)} aria-label={`Équiper ${item.name}`}>{contents}</button>
    })}</div> : <p className="inventory-empty">Aucune {type === 'weapon' ? 'arme possédée' : 'armure possédée'}.</p>}
    {confirmation && createPortal(<div key={confirmation.sequence} className="equipment-confirmation" role="status" aria-live="polite"><Check aria-hidden="true"/><span>{confirmation.label}</span></div>, document.body)}
  </section>
}

function Collection({ save, setSave, setWarriorDetail }: { save: SaveData; setSave: (save: SaveData) => void; setWarriorDetail: (id: string) => void }) {
  const [tab, setTab] = useState<'warriors' | 'equipment' | 'badges'>('warriors')
  const [type, setType] = useState<'weapon' | 'armor'>('weapon')
  return <div className="content-page page-enter"><div className="page-heading"><span className="eyebrow">ARCHIVES DU TEMPS</span><h1>Collection</h1><p>Warriors possédés : {Object.keys(save.ownedWarriors).length} / {primalWarriors.length} · {Object.keys(save.owned).length} types d’équipements possédés</p></div><div className="big-tabs"><button className={tab === 'warriors' ? 'active' : ''} onClick={() => setTab('warriors')}><img className="collection-tab-icon" src="/assets/icons/collection/warrior.png" alt="" aria-hidden="true"/>Warriors</button><button className={tab === 'equipment' ? 'active' : ''} onClick={() => setTab('equipment')}><GameIcon group="navigation" name="equipment"/>Équipements</button><button className={tab === 'badges' ? 'active' : ''} onClick={() => setTab('badges')}><GameIcon group="stats" name="badge"/>Badges</button></div>
    {tab === 'warriors' ? <div className="warrior-collection-grid">{primalWarriors.map((warrior) => {
      const owned = save.ownedWarriors[warrior.id]
      return owned
        ? <button className="warrior-collection-entry" key={warrior.id} onClick={() => setWarriorDetail(warrior.id)} aria-label={`Voir la fiche de ${warrior.name}`}><WarriorCard warrior={warrior} level={owned.level} className="collection-warrior-card"/><span className="warrior-collection-copy"><strong>{warrior.name}</strong><small>{warrior.warriorClass} · {warrior.rarity}</small></span></button>
        : <article className="warrior-collection-entry is-unowned" key={warrior.id} aria-label="Warrior inconnu"><div className="warrior-card collection-warrior-card locked-warrior-card" aria-hidden="true"><div className="warrior-card-frame"><svg className="warrior-locked-silhouette" viewBox="0 0 120 120" fill="currentColor"><circle cx="60" cy="39" r="19"/><path d="M22 110c0-25 15-43 38-43s38 18 38 43Z"/></svg><GameIcon group="system" name="lock" className="lock"/></div></div><span className="warrior-collection-copy"><strong>???</strong><small>Warrior inconnu · Non découvert</small></span></article>
    })}</div> : tab === 'equipment' ? <EquipmentCollection save={save} setSave={setSave} type={type} setType={setType}/> : <BadgesView save={save}/>}
  </div>
}

function Chests({ save, setSave, admin }: { save: SaveData; setSave: (save: SaveData) => void; admin: boolean }) {
  return <ChestPage save={save} setSave={setSave} admin={admin}/>
}

function Adventure({ save, startBattle, admin }: { save: SaveData; startBattle: (node: number) => void; admin: boolean }) {
  return <div className="adventure-page page-enter">
    <header className="adventure-copy"><div><span className="eyebrow">CARTE I · ÈRE PRIMORDIALE</span><h1>La Vallée des Titans</h1><p>La puissance qui sommeille au volcan déforme la faune et les guerriers.</p></div><div className="adventure-progress"><span>{save.defeatedNodes.includes(20) ? 'CAMPAGNE TERMINÉE' : 'PROCHAIN COMBAT'}</span><strong>{save.defeatedNodes.includes(20) ? 'Ère achevée' : <>Niveau {Math.min(save.campaignNode, 20)} <small>/ 20</small></>}</strong><span className="daily-pill"><GameIcon group="stats" name="xp"/> {save.campaignRemaining} / 10 combats récompensés</span></div></header>
    {isWarriorOnExpedition(save, save.activeWarriorId) && <p className="expedition-unavailable">Ce Warrior est en expédition.</p>}
    <div className="map-scene"><AdventureMap layout={primalMapLayout} currentNode={save.campaignNode} defeatedNodes={save.defeatedNodes} canEnter={(node) => canEnterCampaignNode(save, node, admin)} onEnter={startBattle}/></div>
  </div>
}

interface ActiveBattle { result: BattleResult; mode: 'campaign' | 'rift'; node: number; enemyLevel: number; player: Fighter; enemyId?: EnemyId; riftToken?: Pick<RiftEncounter, 'dateKey' | 'stage' | 'seed'> }
interface BattleSummary { xp: number; coins: number; levelUp: number; badges: string[]; campaignProgress?: string; riftChest?: boolean; unlockedPassives: readonly WarriorPassiveDefinition[] }

export function PassiveUnlockModal({ passives, onContinue }: { passives: readonly WarriorPassiveDefinition[]; onContinue: () => void }) {
  return <div className="passive-unlock-overlay" role="dialog" aria-modal="true" aria-label="Passif débloqué"><section className="passive-unlock-sheet"><Sparkles aria-hidden="true"/><span className="eyebrow">{passives.length > 1 ? 'PASSIFS DÉBLOQUÉS' : 'PASSIF DÉBLOQUÉ'}</span><h2>{passives.length > 1 ? `${passives.length} nouveaux passifs` : passives[0].name}</h2><div className="passive-unlock-list">{passives.map((passive) => <article key={passive.id}><small>NIVEAU {passive.unlockLevel}</small>{passives.length > 1 && <strong>{passive.name}</strong>}<p>{passive.description}</p></article>)}</div><button className="primary wide" onClick={onContinue} autoFocus>CONTINUER</button></section></div>
}

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
      {summary.levelUp > 0 && <div className="result-callout"><Sparkles/> Niveau {warriorLevel - summary.levelUp} → Niveau {warriorLevel}</div>}
      {summary.badges.map((badge) => <div className="result-callout" key={badge}><GameIcon group="stats" name="badge"/> Badge débloqué : {badge}</div>)}
      {summary.campaignProgress && <div className="campaign-result"><GameIcon group="navigation" name="adventure"/><span>{summary.campaignProgress}</span></div>}
      {summary.riftChest && <div className="result-callout"><Sparkles/> +1 Coffre de Faille stocké</div>}
      <button className="result-continue" onClick={onContinue}>CONTINUER</button>
    </section>
  </div>
}

function Battle({ save, setSave, active, onExit, onQuit, admin }: { save: SaveData; setSave: (save: SaveData) => void; active: ActiveBattle; onExit: () => void; onQuit?: () => void; admin: boolean }) {
  const [index, setIndex] = useState(-1), [done, setDone] = useState(false), [settled, setSettled] = useState(false), [summary, setSummary] = useState<BattleSummary | null>(null)
  const [passiveOpen, setPassiveOpen] = useState(false)
  const [quitConfirm, setQuitConfirm] = useState(false)
  const settleOnce = useRef(false)
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
  const warriorId = active.player.warriorId ?? save.activeWarriorId
  const battleWeapon = active.player.weapon ?? ''
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
  const enemyId = active.enemyId ?? (requestedEnemy && enemyIds.includes(requestedEnemy as EnemyId)
    ? requestedEnemy as EnemyId
    : resolveEnemyId(active.node || active.enemyLevel, active.node === 20))
  const enemyKit = enemySpriteKit(enemyId)
  const settle = () => {
    if (settled || settleOnce.current) return
    settleOnce.current = true
    if (active.mode === 'rift' && active.riftToken) {
      const won = active.result.winner === 'player'
      const next = resolveRiftStage(save, active.riftToken, active.result.winner)
      if (next === save) return
      const earnedBadges = grantEarnedBadges(next).granted
      const previousLevel = active.player.level ?? 1
      const nextLevel = next.ownedWarriors[warriorId].level
      const reward = RIFT_REWARDS[active.node - 1]
      setSummary({ xp: won ? reward.xp : 0, coins: won ? reward.coins : 0,
        levelUp: nextLevel - previousLevel, unlockedPassives: getNewlyUnlockedWarriorPassives(warriorId, previousLevel, nextLevel),
        badges: earnedBadges.map(({ title, coins: value }) => `${title} · +${value} pièces`),
        campaignProgress: won ? `${RIFT_STAGE_LABELS[active.node - 1]} terminé${active.node < 5 ? ` · ${RIFT_STAGE_LABELS[active.node]}` : ''}` : 'Faille échouée',
        riftChest: won && active.node === 5 })
      setSave(next)
      setSettled(true)
      return
    }
    const next = clone(save), won = active.result.winner === 'player', elite = [5,10,15].includes(active.node), boss = active.node === 20
    const previousLevel = activeWarrior(save).level
    const baseXp = campaignBaseXp(active.node)
    const xp = Math.round(baseXp * (won ? (boss ? 2.5 : elite ? 1.5 : 1) : 0.1))
    const coins = won ? 50 : 10
    let bonusXp = 0
    next.coins += coins; addWarriorXp(next, xp)
    recordBattleOutcome(next, 'adventure', active.result.winner)
    next.campaignRemaining = Math.max(0, next.campaignRemaining - 1)
    if (won) { if (!next.defeatedNodes.includes(active.node)) next.defeatedNodes.push(active.node); next.campaignNode = Math.min(20, active.node + 1); if (boss) { next.bossTrophyPending = true; if (!next.eraRewardClaimed) { next.coins += 100; next.chests += 3; bonusXp = 500; addWarriorXp(next, bonusXp); next.eraRewardClaimed = true } } }
    const earnedBadges = grantEarnedBadges(next).granted
    setSummary({ xp: xp + bonusXp, coins, levelUp: activeWarrior(next).level - previousLevel, unlockedPassives: getNewlyUnlockedWarriorPassives(save.activeWarriorId, previousLevel, activeWarrior(next).level), badges: earnedBadges.map(({ title, coins: reward }) => `${title} · +${reward} pièces`), campaignProgress: won ? `Niveau ${active.node} terminé${active.node < 20 ? ` · prochain : niveau ${active.node + 1}` : ' · Ère achevée'}` : `Niveau ${active.node} à retenter` })
    setSave(next); setSettled(true)
  }
  useEffect(() => {
    let live = true
    Promise.all([preloadBattleAssetsV06('male', battleWeapon, enemyId, !hasSpriteKit, !enemyKit), preloadWarriorSpriteKit(warriorId), preloadEnemySpriteKit(enemyId)]).then(async ([, , modernReady]) => {
      if (!modernReady) await preloadBattleAssetsV06('male', battleWeapon, enemyId, false, true)
      if (live) { setEnemyKitReady(modernReady); setReady(true) }
    })
    return () => { live = false }
  }, [battleWeapon, enemyId, warriorId, hasSpriteKit, enemyKit])
  useEffect(() => {
    if (!timedFxVisible || !spriteKit?.attackPresentation) return
    const timer = window.setTimeout(() => setTimedFxVisible(false), spriteKit.attackPresentation.fxDurationMs / save.speed)
    return () => clearTimeout(timer)
  }, [timedFxVisible, spriteKit, save.speed])
  useEffect(() => {
    if (quitConfirm) return
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
      const motion = event.actor === 'player' ? weaponMotion(battleWeapon) : 'heavy'
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
  }, [index, done, ready, skipped, save.speed, battleWeapon, event, active.result.events, isCritical, hasSpriteKit, spriteKit, qaHold, enemyKitReady, enemyKit, quitConfirm])
  const skip = () => {
    const final = finalBattleFrame(active.result)
    setSkipped(true)
    setKargApproaching(false); setTimedFxVisible(false); setEnemyFxVisible(false); setEnemyMotion('idle'); setCompanionPhase('idle'); setPlayerState(final.playerState); setEnemyState(enemyVisualPose(final.enemyState)); setIndex(final.index)
    window.setTimeout(() => setDone(true), 260 / save.speed)
  }
  const playerHp = event?.playerHp ?? active.player.stats.hp, enemyHp = event?.enemyHp ?? active.result.enemy.stats.hp
  const setSpeed = (speed: 1 | 2 | 3) => { const next = clone(save); next.speed = speed; setSave(next) }
  const ranged = battleWeapon === 'hunter-bow' && !spriteKit?.projectile && event?.actor === 'player' && event.type === 'attack'
  const effectTarget = event && ['dodge', 'skill', 'heal'].includes(event.type) ? event.actor : event?.target ?? 'enemy'
  const floatingText = combatTextForEvent(event, isCritical)
  const impactEffect = isCritical ? assetsV06.effects.criticalStars : weaponMotion(battleWeapon) === 'heavy' ? assetsV06.effects.impactGround : assetsV06.effects.impactStar
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
  return <div className={`battle-page ${isCritical ? 'screen-shake' : ''} ${ready ? 'assets-ready' : 'assets-loading'} ${skipped ? 'skip-to-final' : ''} ${qaFx ? 'qa-hold-fx' : ''}`} style={{ '--battle-speed': save.speed } as React.CSSProperties}><div className="battle-top"><div><span className="eyebrow">{active.mode === 'rift' ? `FAILLE · ${RIFT_STAGE_LABELS[active.node - 1].toUpperCase()}` : `NIVEAU ${active.node}`}</span><strong>Arène Primordiale</strong></div><div className="speed-control" role="group" aria-label="Vitesse du combat">{([1,2,3] as const).map((speed) => <button aria-pressed={save.speed === speed} className={save.speed === speed ? 'active' : ''} onClick={() => setSpeed(speed)} key={speed}>×{speed}</button>)}</div><button className="skip" onClick={skip}>Passer</button>{active.mode === 'rift' && <button className="rift-battle-quit" disabled={skipped || done} onClick={() => setQuitConfirm(true)}>Quitter la Faille</button>}</div>{admin && <span className="admin-indicator admin-battle-indicator">ADMIN LOCAL</span>}
    <div ref={arenaRef} style={{ '--companion-distance': battleGeometry ? `${battleGeometry.companionDistance}px` : undefined, '--player-combat-text-lift': `${(battleBounds?.mobile ? spriteKit?.combatTextLift?.mobile ?? 110 : spriteKit?.combatTextLift?.desktop ?? 163) * warriorCombatFactor(warriorId, battleBounds?.mobile ?? false)}px`, '--enemy-combat-text-lift': `${enemyVisualSize ? enemyVisualSize.height + (battleBounds?.mobile ? 14 : 28) : battleBounds?.mobile ? 110 : 163}px` } as React.CSSProperties} className={`arena event-${event?.type ?? 'idle'} actor-${event?.actor ?? 'player'} ${hasSpriteKit ? 'has-warrior-sprite-kit' : ''}`}><img className="arena-layer arena-background" src={assetsV06.arena.background} alt=""/><img className="arena-layer arena-ground-v06" src={assetsV06.arena.ground} alt=""/><div className="battle-hud"><BattleFighterHud side="player" name={active.player.name} level={active.player.level ?? 1} hp={playerHp} maxHp={active.player.stats.hp} portrait={warriorDefinitions[warriorId]?.art ?? ''} portraitId={warriorId}/><BattleFighterHud side="enemy" name={active.result.enemy.name} level={active.enemyLevel} hp={enemyHp} maxHp={active.result.enemy.stats.hp} portrait={enemySprite(enemyId, 'idle')} portraitId={enemyId}/></div><div ref={playerRef} style={fighterStyle} className={`fighter player phase-${playerVisualState} ${hasSpriteKit ? 'has-sprite-kit' : ''} attack-${attackKind} motion-${weaponMotion(battleWeapon)}`}><img className="contact-shadow" src={assetsV06.arena.contactShadow} alt=""/><WarriorSprite warriorId={warriorId} weapon={battleWeapon} state={playerVisualState} combat/></div>
      {companionPhase !== 'idle' && <WarriorCompanion warriorId={warriorId} phase={companionPhase}/>}
      {showProjectile && <div className="warrior-projectile" style={{ '--projectile-aspect': `${spriteKit?.fxGeometry?.frameWidth ?? 543} / ${spriteKit?.fxGeometry?.frameHeight ?? 724}`, ...(battleGeometry?.projectile ? { '--projectile-start-x': `${battleGeometry.projectile.left}px`, '--projectile-bottom': `${battleGeometry.projectile.bottom}px`, '--projectile-width': `${battleGeometry.projectile.width}px`, '--projectile-travel-x': `${battleGeometry.projectile.travelX}px`, '--projectile-travel-y': `${-battleGeometry.projectile.travelY}px` } : {}) } as React.CSSProperties} key={`projectile-${timedFxSequence}`}><WarriorAttackFx warriorId={warriorId} source={spriteKit?.projectile}/></div>}
      {ranged && ['anticipation','attack'].includes(playerState) && <div className="projectile from-player to-enemy"><img src={assetsV06.effects.projectileArrow} alt=""/></div>}
      <div className={`impact-zone target-${effectTarget} ${weaponMotion(battleWeapon) === 'heavy' ? 'ground-impact' : ''} ${isCritical ? 'is-critical' : ''}`}>
        {showWarriorFx && <WarriorAttackFx key={spriteKit?.attackPresentation ? `fx-cue-${timedFxSequence}-${index}` : `fx-${index}`} warriorId={warriorId} source={spriteKit?.impactFx}/>}
        {event?.type === 'damage' && <>{!showWarriorFx && !spriteKit?.attackPresentation && <img className="production-impact" src={impactEffect} alt=""/>}{isCritical && <em>CRITIQUE</em>}</>}
        {['skill','heal','bleed'].includes(event?.type ?? '') && !(event?.type === 'skill' && event.label === 'Parade') && <b>{event?.label ?? event?.type}</b>}
        {event?.type === 'dodge' && <img className="production-dodge" src={assetsV06.effects.dodgeTrail} alt=""/>}
      </div>
      {floatingText && <FloatingCombatText key={`combat-text-${index}`} text={floatingText}/>}
      {enemyKitReady && enemyKit && enemyFxVisible && (enemyKit.attackKind === 'ranged' ? enemyProjectile && <div key={`enemy-projectile-${enemyFxSequence}`} className="enemy-projectile-flight" style={{ '--enemy-projectile-left': `${enemyProjectile.left}px`, '--enemy-projectile-bottom': `${enemyProjectile.bottom}px`, '--enemy-projectile-dx': `${enemyProjectile.travelX}px`, '--enemy-projectile-dy': `${enemyProjectile.travelY}px`, '--enemy-projectile-width': `${enemyProjectile.width}px`, '--enemy-projectile-ms': `${enemyKit.attackMs - enemyKit.fxAtMs}ms`, '--enemy-fx-ratio': `${enemyKit.geometry['attack-fx'][0]} / ${enemyKit.geometry['attack-fx'][1]}` } as React.CSSProperties}><EnemyAttackFx enemyId={enemyId} projectile/></div> : <div key={`enemy-fx-${enemyFxSequence}`} className={`enemy-attack-fx-zone fx-${enemyId}`} style={{ '--enemy-fx-ratio': `${enemyKit.geometry['attack-fx'][0]} / ${enemyKit.geometry['attack-fx'][1]}` } as React.CSSProperties}><EnemyAttackFx enemyId={enemyId}/></div>)}
      <div ref={enemyRef} style={enemyKitReady && enemyKit ? { '--enemy-approach-distance': `${enemyApproachDistance}px`, '--enemy-attack-ms': `${enemyKit.attackMs}ms`, '--enemy-return-ms': `${enemyKit.returnMs}ms` } as React.CSSProperties : undefined} className={`fighter enemy phase-${enemyState} ${enemyId === 'mammoth' ? 'boss-fighter' : ''} ${enemyKitReady ? `enemy-modern motion-${enemyMotion}` : ''}`}><img className="contact-shadow" src={enemyId === 'mammoth' ? assetsV06.arena.bossShadow : assetsV06.arena.contactShadow} alt=""/>{enemyKitReady ? <EnemySprite enemyId={enemyId} pose={enemyState} koFinal={skipped && enemyState === 'ko'} combat/> : <ProductionEnemy enemyId={enemyId} state={enemyState === 'hit' ? 'hurt' : enemyState === 'run' ? 'idle' : enemyState === 'block' ? 'dodge' : enemyState} boss={enemyId === 'mammoth'}/>}</div><img className="arena-layer arena-foreground" src={assetsV06.arena.foreground} alt=""/></div>
    {done && settled && summary && (passiveOpen ? <PassiveUnlockModal passives={summary.unlockedPassives} onContinue={onExit}/> : <BattleResultOverlay winner={active.result.winner} enemyName={active.result.enemy.name} summary={summary} warriorLevel={save.ownedWarriors[warriorId]?.level ?? active.player.level ?? 1} onContinue={() => summary.unlockedPassives.length ? setPassiveOpen(true) : onExit()}/>)}
    {quitConfirm && <div className="rift-confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirmer l’abandon de la Faille"><div className="rift-confirm"><h3>Quitter la Faille ?</h3><p>La tentative du jour prendra fin. Vos récompenses restent acquises.</p><div><button onClick={() => setQuitConfirm(false)}>RESTER</button><button className="rift-danger" onClick={onQuit}>QUITTER LA FAILLE</button></div></div></div>}
  </div>
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

function createActiveBattle(save: SaveData, node: number): ActiveBattle {
  const rng = seededRng(Date.now())
  const enemyLevel = campaignNodeTier(node)
  const enemy = generateEnemy(enemyLevel, node, rng)
  const fighter: Fighter = { name: activeWarrior(save).name, stats: effectiveStats(save), skills: [], warriorId: save.activeWarriorId, level: activeWarrior(save).level, weapon: save.equippedWeapon, armor: save.equippedArmor }
  return { result: simulateBattle(fighter, enemy, Date.now()), mode: 'campaign', node, enemyLevel, player: fighter }
}

function riftActiveBattle(encounter: RiftEncounter): ActiveBattle {
  return { result: encounter.result, mode: 'rift', node: encounter.stage + 1, enemyLevel: 9,
    player: encounter.player, enemyId: encounter.enemyId,
    riftToken: { dateKey: encounter.dateKey, stage: encounter.stage, seed: encounter.seed } }
}

function GameApp() {
  const adminMode = isLocalAdmin(window.location)
  const query = new URLSearchParams(window.location.search)
  const desktopCombatPreview = import.meta.env.DEV && adminMode && query.has('desktopCombatPreview')
  const adventurePreview = import.meta.env.DEV && adminMode && query.has('adventurePreview')
  const riftPreview = import.meta.env.DEV && adminMode && query.has('riftPreview')
  const riftChestPreview = import.meta.env.DEV && adminMode && query.has('riftChestPreview')
  const expeditionPreview = import.meta.env.DEV && adminMode && query.has('expeditionPreview')
  const qaMode = import.meta.env.DEV && (query.has('qaPreview') || desktopCombatPreview || adventurePreview || riftPreview || riftChestPreview || expeditionPreview || (adminMode && (query.has('enemySpritePreview') || query.has('qaLevelChoice'))))
  const requestedQaNode = Number(query.get('qaNode'))
  const qaNode = Number.isInteger(requestedQaNode) && requestedQaNode >= 1 && requestedQaNode <= 20 ? requestedQaNode : 1
  const [initialLoad] = useState(() => {
    const targetKey = adminMode ? ADMIN_SAVE_KEY : SAVE_KEY
    const legacyKeys = adminMode ? [PREVIOUS_ADMIN_SAVE_KEY, LEGACY_ADMIN_SAVE_KEY] : [PREVIOUS_SAVE_KEY, LEGACY_SAVE_KEY]
    const migrated = !localStorage.getItem(targetKey) && legacyKeys.some((key) => Boolean(localStorage.getItem(key)))
    const initialSave = adminMode ? withAdminAccess(loadSave(localStorage, ADMIN_SAVE_KEY)) : loadSave()
    const initialBadges = grantEarnedBadges(initialSave)
    return { loaded: adminMode ? withAdminAccess(initialBadges.save) : initialBadges.save, granted: initialBadges.granted.length > 0, migrated }
  })
  const [save, setSaveState] = useState<SaveData>(() => {
    const loaded = initialLoad.loaded
    if (!qaMode) return loaded
    const qaWeapon = query.get('qaWeapon'), qaWarrior = query.get('qaWarrior') ?? (desktopCombatPreview ? 'karg' : null)
    const weapon = qaWeapon && equipment.some((item) => item.type === 'weapon' && item.id === qaWeapon) ? qaWeapon : loaded.equippedWeapon
    const owned = !weapon || loaded.owned[weapon] ? loaded.owned : { ...loaded.owned, [weapon]: { quantity: 1, level: 1, xp: 0, kills: 0 } }
    const previewWarrior = qaWarrior && warriorDefinitions[qaWarrior]
    const ownedWarriors = previewWarrior && !loaded.ownedWarriors[qaWarrior] ? { ...loaded.ownedWarriors, [qaWarrior]: { warriorId: qaWarrior, level: 1, xp: 0 } } : loaded.ownedWarriors
    const activeWarriorId = previewWarrior ? qaWarrior : loaded.activeWarriorId
    const requestedLevel = Number(query.get('qaLevel'))
    const qaLevel = adminMode && Number.isInteger(requestedLevel) && requestedLevel >= 1 ? Math.min(MAX_WARRIOR_LEVEL, requestedLevel) : null
    const previewOwnedWarriors = qaLevel && ownedWarriors[activeWarriorId] ? { ...ownedWarriors, [activeWarriorId]: { ...ownedWarriors[activeWarriorId], level: qaLevel, xp: 0 } } : ownedWarriors
    return { ...loaded, activeWarriorId, ownedWarriors: previewOwnedWarriors, coins: query.has('qaCoins') ? Math.max(loaded.coins, Number(query.get('qaCoins')) || 500) : loaded.coins, owned, equippedWeapon: weapon, unlockedSkills: [],
      riftChestCount: riftChestPreview ? Math.max(1, loaded.riftChestCount) : loaded.riftChestCount,
      ...(adventurePreview ? { campaignNode: qaNode, defeatedNodes: Array.from({ length: qaNode - 1 }, (_, index) => index + 1) } : {}) }
  }), [view, setView] = useState<View>(() => desktopCombatPreview ? 'battle' : adventurePreview ? 'adventure' : riftPreview || expeditionPreview ? 'activities' : riftChestPreview ? 'chest' : createRiftEncounter(save) ? 'battle' : 'hub'), [warriorDetailId, setWarriorDetailId] = useState<string | null>(null), [activeBattle, setActiveBattle] = useState<ActiveBattle | null>(() => desktopCombatPreview ? createActiveBattle(save, qaNode) : adventurePreview || riftPreview || expeditionPreview || riftChestPreview ? null : createRiftEncounter(save) ? riftActiveBattle(createRiftEncounter(save)!) : null)
  const [welcomeFlow, setWelcomeFlow] = useState(() => !adminMode && !qaMode && !save.welcomeChestOpened)
  const [badgeNotice, setBadgeNotice] = useState<{ label: string; coins: number } | null>(null)
  const badgeNoticeTimer = useRef<number | null>(null)
  const initial = useRef(true)
  const setSave = (next: SaveData) => {
    const prepared = adminMode ? withAdminAccess(next) : next
    const { save: awarded, granted } = grantEarnedBadges(prepared)
    setSaveState(adminMode ? withAdminAccess(awarded) : awarded)
    if (granted.length) {
      if (badgeNoticeTimer.current !== null) window.clearTimeout(badgeNoticeTimer.current)
      setBadgeNotice({ label: granted.length === 1 ? granted[0].title : `${granted.length} badges débloqués`, coins: granted.reduce((total, badge) => total + badge.coins, 0) })
      badgeNoticeTimer.current = window.setTimeout(() => { setBadgeNotice(null); badgeNoticeTimer.current = null }, 2400)
    }
  }
  const commitExpedition = (next: SaveData) => {
    if (next === save) return
    if (!qaMode) persistSave(next, localStorage, adminMode ? ADMIN_SAVE_KEY : SAVE_KEY)
    setSave(next)
  }
  useEffect(() => () => { if (badgeNoticeTimer.current !== null) window.clearTimeout(badgeNoticeTimer.current) }, [])
  useEffect(() => { const first = initial.current; initial.current = false; if (!qaMode && (!first || initialLoad.granted || initialLoad.migrated)) persistSave(save, localStorage, adminMode ? ADMIN_SAVE_KEY : undefined) }, [save, qaMode, adminMode, initialLoad.granted, initialLoad.migrated])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [view])
  const startBattle = (node: number) => {
    if (!canStartBattle(save, adminMode)) return
    setActiveBattle(createActiveBattle(save, node)); setView('battle')
  }
  const startRiftBattle = (next: SaveData) => {
    const encounter = createRiftEncounter(next)
    if (!encounter) return
    setActiveBattle(riftActiveBattle(encounter)); setView('battle')
  }
  const content = useMemo(() => {
    if (view === 'hub') return save.activeWarriorId ? <Hub save={save} setView={setView}/> : <EmptyHub/>
    if (view === 'collection') return <Collection save={save} setSave={setSave} setWarriorDetail={setWarriorDetailId}/>
    if (view === 'chest') return <Chests save={save} setSave={setSave} admin={adminMode}/>
    if (view === 'activities') return <RiftPage save={save} setSave={setSave} onExpeditionCommit={commitExpedition} setView={setView} onStart={startRiftBattle} admin={adminMode} previewExpedition={expeditionPreview}/>
    if (view === 'adventure') return <Adventure save={save} startBattle={startBattle} admin={adminMode}/>
    if (view === 'duel') return <div className="soon page-enter"><div className="duel-emblem"><GameIcon group="navigation" name="duel"/></div><span className="eyebrow">PORTAIL VERROUILLÉ</span><h1>Duel asynchrone</h1><p>Prochainement</p><span>Prépare ton build. Les autres Warriors arrivent d’une autre ligne du temps.</span></div>
    return null
  }, [view, save])
  if (import.meta.env.DEV && adminMode && query.has('enemySpritePreview')) return <EnemySpritePreview/>
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('spriteLab')) return <SpriteLab/>
  const badgeToast = badgeNotice && createPortal(<div className="badge-unlock-toast" role="status" aria-live="polite"><Award aria-hidden="true"/><span>{badgeNotice.label}</span><b>+{badgeNotice.coins} pièces</b></div>, document.body)
  if (view === 'battle' && activeBattle) return <><Battle save={save} setSave={setSave} active={activeBattle} admin={adminMode} onExit={() => { setView(activeBattle.mode === 'campaign' ? 'adventure' : 'activities'); setActiveBattle(null) }} onQuit={activeBattle.mode === 'rift' ? () => { setSave(quitRift(save)); setActiveBattle(null); setView('activities') } : undefined}/>{badgeToast}</>
  return <><div className="app-shell" inert={welcomeFlow} aria-hidden={welcomeFlow}><Header save={save} view={view} setView={setView} admin={adminMode}/><main className="main-content">{content}</main><nav className="bottom-nav" aria-label="Navigation principale">{nav.map(({ id, label, icon }) => <button aria-label={label} className={view === id ? 'active' : ''} onClick={() => setView(id)} key={id}><GameIcon group="navigation" name={icon}/><span>{label}</span></button>)}</nav>
    {warriorDetailId && view === 'collection' && <WarriorDetail save={save} warriorId={warriorDetailId} onClose={() => setWarriorDetailId(null)} onActivate={() => { if (!['fighting', 'between'].includes(todayRiftRun(save)?.status ?? '')) setSave(activateWarrior(save, warriorDetailId)); setWarriorDetailId(null) }}/>} {save.bossTrophyPending && <TrophyChoice save={save} setSave={setSave}/>}</div>{welcomeFlow && <WelcomeChest onClaim={(id) => setSave(claimWelcomeWarrior(save, id))} onDone={() => setWelcomeFlow(false)}/>}{badgeToast}</>
}

export default function App() {
  if (import.meta.env.DEV && isLocalAdmin(window.location) && new URLSearchParams(window.location.search).has('hudPortraitPreview')) return <HudPortraitPreview/>
  if (import.meta.env.DEV && isLocalAdmin(window.location) && new URLSearchParams(window.location.search).has('spritePreview')) return <SpritePreview/>
  return <GameApp/>
}
