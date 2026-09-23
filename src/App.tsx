import { useEffect, useMemo, useRef, useState } from 'react'
import { Archive, Badge, Boxes, ChevronLeft, Coins, Dumbbell, Home, Lock, Map, PackageOpen, Shield, Swords, Trophy, X, Zap } from 'lucide-react'
import { GAME } from './config'
import { badges, equipment, skills } from './data'
import { addWarriorXp, effectiveStats, equipmentLevelFromXp, generateEnemy, grantEquipmentXp, rollChest, seededRng, simulateBattle, xpForLevel } from './game'
import { loadSave, persistSave } from './storage'
import type { BattleResult, EquipmentDefinition, Fighter, Rarity, SaveData, StatKey, View } from './types'
import { EquipmentArt, WarriorAvatar } from './components/Art'

const nav: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'hub', label: 'Hub', icon: Home }, { id: 'collection', label: 'Collection', icon: Boxes },
  { id: 'training', label: 'Entraînement', icon: Dumbbell }, { id: 'chest', label: 'Coffre', icon: PackageOpen },
  { id: 'duel', label: 'Duel', icon: Swords },
]

const rarityClass = (rarity: Rarity) => `rarity-${rarity.toLowerCase().replace(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`
const itemById = (id: string) => equipment.find((item) => item.id === id)!
const clone = (save: SaveData): SaveData => structuredClone(save)

function unlock(save: SaveData, id: string) {
  if (!save.badges.some((badge) => badge.id === id)) save.badges.push({ id, unlockedAt: new Date().toISOString() })
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong></div>
}

function EquipmentCard({ item, save, onClick }: { item: EquipmentDefinition; save: SaveData; onClick: () => void }) {
  const owned = save.owned[item.id]
  const equipped = [save.equippedWeapon, save.equippedArmor].includes(item.id)
  const progress = owned ? equipmentLevelFromXp(owned.xp) : null
  return <button className={`equipment-card ${rarityClass(item.rarity)} ${!owned ? 'locked' : ''}`} onClick={onClick}>
    {!owned && <Lock className="lock" size={20}/>}<EquipmentArt item={item}/>
    <div className="equipment-card-copy"><span className="rarity-label">{item.rarity}</span><strong>{item.name}</strong>
      <small>{owned ? `Niveau ${owned.level}` : 'Non découvert'}</small>
      {owned && progress && <div className="tiny-progress"><i style={{ width: progress.needed ? `${progress.progress / progress.needed * 100}%` : '100%' }}/></div>}
      {equipped && <span className="equipped">ÉQUIPÉ</span>}
    </div>
  </button>
}

function Creation({ save, setSave }: { save: SaveData; setSave: (save: SaveData) => void }) {
  const [name, setName] = useState('')
  const [appearance, setAppearance] = useState(save.warrior.appearance)
  const finish = () => {
    if (!name.trim()) return
    const next = clone(save); next.created = true; next.warrior.name = name.trim().slice(0, 18); next.warrior.appearance = appearance; window.scrollTo({ top: 0 }); setSave(next)
  }
  return <main className="creation-shell">
    <section className="creation-art"><div className="brand"><span>CHRONOS</span><strong>AGE WARRIORS</strong></div><div className="avatar-stage"><WarriorAvatar appearance={appearance} weapon="flint-club" armor="hunter-hides"/></div><p>Chaque légende commence avant l’Histoire.</p></section>
    <section className="creation-panel"><div><span className="eyebrow">ÈRE PRIMORDIALE</span><h1>Crée ton Warrior</h1><p>Ton apparence pourra évoluer avec ton équipement.</p></div>
      <label className="field">Pseudo<input value={name} maxLength={18} placeholder="Ton nom de guerrier" onChange={(event) => setName(event.target.value)} autoFocus/></label>
      <fieldset><legend>Genre</legend><div className="segmented">{(['Homme','Femme'] as const).map((gender) => <button className={appearance.gender === gender ? 'active' : ''} onClick={() => setAppearance({ ...appearance, gender })} key={gender}>{gender}</button>)}</div></fieldset>
      <fieldset><legend>Teinte de peau</legend><div className="swatches">{['#f1c7a5','#c68a63','#9c6346','#673f31'].map((skin) => <button aria-label={`Teinte ${skin}`} className={appearance.skin === skin ? 'active' : ''} style={{ background: skin }} onClick={() => setAppearance({ ...appearance, skin })} key={skin}/>)}</div></fieldset>
      <fieldset><legend>Coiffure</legend><div className="segmented">{(['Crête','Tresses','Sauvage'] as const).map((hair) => <button className={appearance.hair === hair ? 'active' : ''} onClick={() => setAppearance({ ...appearance, hair })} key={hair}>{hair}</button>)}</div></fieldset>
      <fieldset><legend>Couleur des cheveux</legend><div className="swatches">{['#211914','#633b20','#b78b45','#912b22'].map((hairColor) => <button aria-label={`Couleur ${hairColor}`} className={appearance.hairColor === hairColor ? 'active' : ''} style={{ background: hairColor }} onClick={() => setAppearance({ ...appearance, hairColor })} key={hairColor}/>)}</div></fieldset>
      <button className="primary wide" disabled={!name.trim()} onClick={finish}>ENTRER DANS L’ÈRE</button>
    </section>
  </main>
}

function Header({ save, view, setView }: { save: SaveData; view: View; setView: (view: View) => void }) {
  return <header className="topbar"><button className="mini-brand" onClick={() => setView('hub')}><i>CAW</i><span>ÈRE PRIMORDIALE</span></button><div className="topbar-title">{view === 'adventure' && <button className="icon-button" onClick={() => setView('hub')}><ChevronLeft/></button>}<strong>{view === 'chest' ? 'Coffres' : view.charAt(0).toUpperCase() + view.slice(1)}</strong></div><div className="currency"><Coins size={18}/><strong>{save.coins}</strong></div></header>
}

function Hub({ save, setView, setDetail }: { save: SaveData; setView: (view: View) => void; setDetail: (item: EquipmentDefinition) => void }) {
  const stats = effectiveStats(save)
  const weapon = itemById(save.equippedWeapon), armor = itemById(save.equippedArmor)
  return <div className="hub-page page-enter">
    <section className="gear-gallery desktop-only"><span className="eyebrow">ARSENAL</span><h2>Relics du Warrior</h2><div className="shelf"><EquipmentCard item={weapon} save={save} onClick={() => setDetail(weapon)}/><EquipmentCard item={armor} save={save} onClick={() => setDetail(armor)}/></div><button className="text-button" onClick={() => setView('collection')}>Voir la collection <ChevronLeft size={16}/></button></section>
    <section className="hero-warrior"><span className="eyebrow">WARRIOR ACTIF</span><div className="hero-name"><div><h1>{save.warrior.name}</h1><span>Niveau {save.warrior.level}</span></div><div className="level-ring">{save.warrior.level}</div></div><div className="hero-avatar"><div className="sun-disc"/><WarriorAvatar appearance={save.warrior.appearance} weapon={save.equippedWeapon} armor={save.equippedArmor}/></div>
      <div className="mobile-stats mobile-only"><div className="hp-row"><span>PV</span><strong>{stats.hp}</strong></div><div className="stats-grid"><Stat label="Force" value={stats.strength}/><Stat label="Esquive" value={stats.dodge}/><Stat label="Vitesse" value={stats.speed}/></div></div>
      <div className="resource-row mobile-only"><span><Coins size={18}/>{save.coins}</span><span><Zap size={18}/>{save.campaignRemaining} / 10</span></div>
      <button className="adventure-button" onClick={() => setView('adventure')}><Map/><span><small>CAMPAGNE</small>AVENTURE</span><i>→</i></button>
    </section>
    <section className="stats-panel"><span className="eyebrow">PUISSANCE</span><h2>Statistiques</h2><div className="desktop-stats"><div className="hp-display"><span>POINTS DE VIE</span><strong>{stats.hp}</strong></div><div className="stats-grid"><Stat label="Force" value={stats.strength}/><Stat label="Esquive" value={stats.dodge}/><Stat label="Vitesse" value={stats.speed}/></div><div className="xp-block"><span>EXPÉRIENCE <b>{save.warrior.xp} / {xpForLevel(save.warrior.level)}</b></span><div className="progress"><i style={{ width: `${save.warrior.xp / xpForLevel(save.warrior.level) * 100}%` }}/></div></div><div className="daily"><span><Coins/> {save.coins} pièces</span><span><Zap/> {save.campaignRemaining} / 10 Campagne</span></div></div></section>
    <section className="hub-bottom"><div className="skill-panel"><div className="section-title"><div><span className="eyebrow">PASSIFS</span><h2>Compétences</h2></div><span>{save.warrior.skills.length} / 20</span></div>{save.warrior.skills.length ? <div className="skill-list">{save.warrior.skills.map((skill) => <span key={skill}><Zap size={15}/>{skill}</span>)}</div> : <div className="empty"><Zap/><p>Ta première compétence s’obtient au niveau 5 ou dans un coffre Mythique.</p></div>}</div>
      <div className="mobile-gear mobile-only"><EquipmentCard item={weapon} save={save} onClick={() => setDetail(weapon)}/><EquipmentCard item={armor} save={save} onClick={() => setDetail(armor)}/></div></section>
  </div>
}

function Collection({ save, setSave, setDetail }: { save: SaveData; setSave: (save: SaveData) => void; setDetail: (item: EquipmentDefinition) => void }) {
  const [tab, setTab] = useState<'equipment' | 'badges'>('equipment')
  const [type, setType] = useState<'weapon' | 'armor'>('weapon')
  const unlocked = new Set(save.badges.map((badge) => badge.id))
  return <div className="content-page page-enter"><div className="page-heading"><span className="eyebrow">ARCHIVES DU TEMPS</span><h1>Collection</h1><p>{Object.keys(save.owned).length} reliques découvertes sur {equipment.length}</p></div><div className="big-tabs"><button className={tab === 'equipment' ? 'active' : ''} onClick={() => setTab('equipment')}><Archive/>Équipements</button><button className={tab === 'badges' ? 'active' : ''} onClick={() => setTab('badges')}><Badge/>Badges</button></div>
    {tab === 'equipment' ? <><div className="filter-row"><button className={type === 'weapon' ? 'active' : ''} onClick={() => setType('weapon')}>Armes</button><button className={type === 'armor' ? 'active' : ''} onClick={() => setType('armor')}>Armures</button></div><div className="collection-grid">{equipment.filter((item) => item.type === type).map((item) => <EquipmentCard key={item.id} item={item} save={save} onClick={() => setDetail(item)}/>)}</div></> : <div className="badge-grid">{badges.map(([id, name, description]) => <div className={`badge-card ${unlocked.has(id) ? 'unlocked' : ''}`} key={id}><div className="badge-medal"><Trophy/></div><div><strong>{name}</strong><span>{description}</span></div>{!unlocked.has(id) && <Lock size={18}/>}</div>)}</div>}
    <div hidden>{String(setSave)}</div>
  </div>
}

type ChestReward = ReturnType<typeof rollChest>
function Chests({ save, setSave, setDetail }: { save: SaveData; setSave: (save: SaveData) => void; setDetail: (item: EquipmentDefinition) => void }) {
  const [spinning, setSpinning] = useState(false), [reward, setReward] = useState<ChestReward | null>(null), [strip, setStrip] = useState<EquipmentDefinition[]>([])
  const open = () => {
    if (save.coins < GAME.chestCost || spinning) return
    const result = rollChest(Math.random, save.owned, save.warrior.skills)
    const target = result.kind === 'equipment' ? result.item : equipment.find((item) => item.rarity === 'Mythique')!
    const fillers = Array.from({ length: 18 }, () => equipment[Math.floor(Math.random() * equipment.length)]); fillers[15] = target
    setStrip(fillers); setReward(null); setSpinning(true)
    const next = clone(save); next.coins -= GAME.chestCost; next.chests += 1
    if (result.kind === 'skill') next.warrior.skills.push(result.skill)
    else if (result.duplicate && result.recycle) { next.coins += result.recycle.coins; grantEquipmentXp(next.owned[result.item.id], result.recycle.xp) }
    else next.owned[result.item.id] = { level: 1, xp: 0, kills: 0 }
    if (result.kind === 'equipment') { if (result.item.rarity === 'Rare' && result.item.type === 'weapon') unlock(next, 'first-rare'); if (result.item.rarity === 'Épique') unlock(next, 'first-epic'); if (result.item.rarity === 'Légendaire') unlock(next, 'first-legendary'); if (result.item.rarity === 'Mythique') unlock(next, 'first-mythic') }
    setTimeout(() => { setSpinning(false); setReward(result); setSave(next) }, 4400)
  }
  const equipReward = () => { if (!reward || reward.kind !== 'equipment') return; const next = clone(save); if (reward.item.type === 'weapon') next.equippedWeapon = reward.item.id; else next.equippedArmor = reward.item.id; setSave(next); setDetail(reward.item) }
  return <div className="chest-page content-page page-enter"><div className="page-heading centered"><span className="eyebrow">AUTEL DES POSSIBLES</span><h1>Coffre primordial</h1><p>Le destin est scellé avant que la roulette ne s’élance.</p></div><div className={`chest ${spinning ? 'opening' : ''}`}><div className="chest-lid"/><div className="chest-body"><i/></div><div className="chest-glow"/></div>
    {(spinning || reward) && <div className={`roulette ${spinning ? 'spinning' : 'finished'}`}><div className="roulette-marker"/><div className="roulette-track">{strip.map((item, index) => <div className={`roulette-card ${rarityClass(item.rarity)}`} key={`${item.id}-${index}`}><EquipmentArt item={item} compact/><strong>{item.name}</strong><span>{item.rarity}</span></div>)}</div></div>}
    {!reward && <button className="primary chest-button" onClick={open} disabled={save.coins < GAME.chestCost || spinning}>{spinning ? 'LE TEMPS SE PLIE…' : <><PackageOpen/> OUVRIR · {GAME.chestCost} <Coins size={17}/></>}</button>}
    {save.coins < GAME.chestCost && !spinning && <p className="hint">Il te faut encore {GAME.chestCost - save.coins} pièces.</p>}
    {reward && <div className={`reward-card ${rarityClass(reward.kind === 'equipment' ? reward.item.rarity : reward.rarity)}`}><span className="eyebrow">{reward.kind === 'equipment' && reward.duplicate ? 'DOUBLON RECYCLÉ' : 'NOUVELLE RÉCOMPENSE'}</span>{reward.kind === 'equipment' ? <><EquipmentArt item={reward.item}/><h2>{reward.item.name}</h2><span className="rarity-label">{reward.item.rarity}</span>{reward.duplicate && reward.recycle ? <p>+{reward.recycle.coins} pièces · +{reward.recycle.xp} XP équipement</p> : <div className="reward-actions"><button className="primary" onClick={equipReward}>ÉQUIPER</button><button className="secondary" onClick={() => setReward(null)}>STOCKER</button></div>}</> : <><Zap size={64}/><h2>{reward.skill}</h2><p>Compétence passive acquise</p></>}<button className="text-button" onClick={() => setReward(null)}>Continuer</button></div>}
    <div className="odds"><span>Commun 43,49 %</span><span>Peu commun 40 %</span><span>Rare 15 %</span><span>Épique 1 %</span><span>Légendaire 0,5 %</span><span>Mythique 0,01 %</span></div>
  </div>
}

function Adventure({ save, startBattle }: { save: SaveData; startBattle: (mode: 'campaign', node: number) => void }) {
  const [walking, setWalking] = useState<number | null>(null)
  const choose = (node: number) => { if (node !== save.campaignNode || walking || save.campaignRemaining <= 0) return; setWalking(node); setTimeout(() => startBattle('campaign', node), 850) }
  return <div className="adventure-page page-enter"><div className="adventure-copy"><span className="eyebrow">CARTE I · ÈRE PRIMORDIALE</span><h1>La Vallée des Titans</h1><p>La puissance qui sommeille au volcan déforme la faune et les guerriers.</p><span className="daily-pill"><Zap/> {save.campaignRemaining} / 10 combats récompensés</span></div><div className="map-scene"><div className="volcano"/><div className="mountains"/><div className="map-path"/>
    {Array.from({ length: 20 }, (_, i) => i + 1).map((node) => { const done = save.defeatedNodes.includes(node), accessible = node === save.campaignNode, elite = [5,10,15].includes(node), boss = node === 20; return <button key={node} onClick={() => choose(node)} style={{ '--x': `${12 + ((node - 1) % 5) * 19 + (Math.floor((node - 1) / 5) % 2 ? 6 : 0)}%`, '--y': `${82 - Math.floor((node - 1) / 5) * 23}%` } as React.CSSProperties} className={`map-node ${done ? 'done' : ''} ${accessible ? 'accessible' : ''} ${elite ? 'elite' : ''} ${boss ? 'boss' : ''}`}><span>{boss ? <Trophy/> : elite ? <Swords/> : node}</span>{node > save.campaignNode && <Lock className="node-lock"/>}{accessible && <div className={`map-avatar ${walking === node ? 'walking' : ''}`}><WarriorAvatar appearance={save.warrior.appearance} weapon={save.equippedWeapon} armor={save.equippedArmor}/></div>}</button> })}
  </div><div className="map-legend"><span><i className="standard"/>Standard</span><span><i className="elite"/>Élite</span><span><i className="boss"/>Boss</span></div></div>
}

interface ActiveBattle { result: BattleResult; mode: 'training' | 'campaign'; node: number; enemyLevel: number }
function Battle({ save, setSave, active, onExit }: { save: SaveData; setSave: (save: SaveData) => void; active: ActiveBattle; onExit: () => void }) {
  const [index, setIndex] = useState(-1), [done, setDone] = useState(false), [settled, setSettled] = useState(false)
  const event = active.result.events[Math.max(0, index)]
  const settle = () => {
    if (settled) return
    const next = clone(save), won = active.result.winner === 'player', elite = [5,10,15].includes(active.node), boss = active.node === 20
    const baseXp = 100 + 12 * active.enemyLevel
    const xp = active.mode === 'training' ? (won ? 1 : 0) : Math.round(baseXp * (won ? (boss ? 2.5 : elite ? 1.5 : 1) : 0.1))
    const coins = active.mode === 'training' ? (won ? 1 : 0) : won ? 50 : 10
    next.coins += coins; addWarriorXp(next, xp)
    if (active.mode === 'training') { next.trainingRemaining = Math.max(0, next.trainingRemaining - 1); if (won) { next.trainingWins += 1; next.totalWins += 1; grantEquipmentXp(next.owned[next.equippedWeapon], 1); grantEquipmentXp(next.owned[next.equippedArmor], 1); next.owned[next.equippedWeapon].kills += 1 } }
    else { next.campaignRemaining = Math.max(0, next.campaignRemaining - 1); if (won) { next.totalWins += 1; if (!next.defeatedNodes.includes(active.node)) next.defeatedNodes.push(active.node); next.campaignNode = Math.min(20, active.node + 1); if (elite) unlock(next, 'first-elite'); if (boss) { unlock(next, 'boss'); next.bossTrophyPending = true; if (!next.eraRewardClaimed) { next.coins += 100; next.chests += 3; addWarriorXp(next, 500); next.eraRewardClaimed = true } } } }
    if (won) unlock(next, 'first-win'); if (next.trainingWins >= 10) unlock(next, 'training-10'); if (next.trainingWins >= 50) unlock(next, 'training-50')
    setSave(next); setSettled(true)
  }
  useEffect(() => { if (done) { settle(); return } const timer = setTimeout(() => setIndex((current) => current + 1), 620 / save.speed); return () => clearTimeout(timer) }, [index, done, save.speed])
  useEffect(() => { if (index >= active.result.events.length - 1) setDone(true) }, [index, active.result.events.length])
  const skip = () => { setIndex(active.result.events.length - 1); setDone(true) }
  const playerHp = event?.playerHp ?? effectiveStats(save).hp, enemyHp = event?.enemyHp ?? active.result.enemy.stats.hp
  const setSpeed = (speed: 1 | 2 | 3) => { const next = clone(save); next.speed = speed; setSave(next) }
  return <div className="battle-page"><div className="battle-top"><div><span className="eyebrow">{active.mode === 'training' ? 'ENTRAÎNEMENT' : `NŒUD ${active.node}`}</span><strong>Arène Primordiale</strong></div><div className="speed-control">{([1,2,3] as const).map((speed) => <button className={save.speed === speed ? 'active' : ''} onClick={() => setSpeed(speed)} key={speed}>×{speed}</button>)}</div><button className="skip" onClick={skip}>Passer</button></div>
    <div className="arena"><div className="arena-sky"><div className="arena-volcano"/></div><div className="arena-ground"/><div className="fighter player"><div className="fighter-ui"><strong>{save.warrior.name}</strong><div><i style={{ width: `${playerHp / effectiveStats(save).hp * 100}%` }}/></div><span>{playerHp} PV</span></div><WarriorAvatar className={`${event?.actor === 'player' && event.type === 'attack' ? 'attacking' : ''} ${event?.target === 'player' && event.type === 'damage' ? 'hit' : ''} ${event?.actor === 'player' && event.type === 'dodge' ? 'dodging' : ''} ${done && active.result.winner === 'enemy' ? 'ko' : ''}`} appearance={save.warrior.appearance} weapon={save.equippedWeapon} armor={save.equippedArmor}/></div>
      <div className="impact-zone">{event?.type === 'damage' && <span className={active.result.events[index - 1]?.type === 'critical' ? 'critical' : ''}>−{event.value}</span>}{['skill','dodge','heal','bleed'].includes(event?.type) && <b>{event.label ?? event.type}</b>}</div>
      <div className="fighter enemy"><div className="fighter-ui"><strong>{active.result.enemy.name}</strong><div><i style={{ width: `${enemyHp / active.result.enemy.stats.hp * 100}%` }}/></div><span>{enemyHp} PV</span></div><WarriorAvatar enemy className={`${event?.actor === 'enemy' && event.type === 'attack' ? 'attacking' : ''} ${event?.target === 'enemy' && event.type === 'damage' ? 'hit' : ''} ${event?.actor === 'enemy' && event.type === 'dodge' ? 'dodging' : ''} ${done && active.result.winner === 'player' ? 'ko' : ''}`} appearance={save.warrior.appearance} weapon={active.result.enemy.weapon ?? 'bone-spear'} armor={active.result.enemy.armor ?? 'bone-harness'}/></div></div>
    {done && settled && <div className="result-overlay"><div className="result-sheet"><span className="eyebrow">COMBAT TERMINÉ</span><h1>{active.result.winner === 'player' ? 'VICTOIRE' : 'DÉFAITE'}</h1><p>contre {active.result.enemy.name}</p><div className="result-rewards"><span><Zap/> +{active.mode === 'training' ? (active.result.winner === 'player' ? 1 : 0) : Math.round((100 + 12 * active.enemyLevel) * (active.result.winner === 'player' ? ([5,10,15].includes(active.node) ? 1.5 : active.node === 20 ? 2.5 : 1) : .1))} XP</span><span><Coins/> +{active.mode === 'training' ? (active.result.winner === 'player' ? 1 : 0) : active.result.winner === 'player' ? 50 : 10}</span>{active.mode === 'training' && active.result.winner === 'player' && <span><Shield/> +1 XP équipement</span>}</div><button className="primary wide" onClick={onExit}>CONTINUER</button></div></div>}
  </div>
}

function LevelChoice({ save, setSave }: { save: SaveData; setSave: (save: SaveData) => void }) {
  const chooseStat = (stat: StatKey) => { const next = clone(save); next.warrior.stats[stat] += stat === 'hp' ? 40 : 2; next.pendingLevelChoice = false; setSave(next) }
  const chooseSkill = () => { const pool = skills.filter((skill) => !save.warrior.skills.includes(skill)); const next = clone(save); if (pool.length) next.warrior.skills.push(pool[Math.floor(Math.random() * pool.length)]); next.pendingLevelChoice = false; setSave(next) }
  return <div className="modal-backdrop"><section className="level-choice"><span className="eyebrow">NIVEAU {save.warrior.level}</span><h2>Le temps t’accorde une faveur</h2><p>Choisis un attribut ou laisse le hasard éveiller une compétence.</p><div className="choice-grid">{([['strength','+2 Force'],['dodge','+2 Esquive'],['speed','+2 Vitesse'],['hp','+40 PV']] as [StatKey,string][]).map(([stat,label]) => <button onClick={() => chooseStat(stat)} key={stat}>{label}</button>)}<button className="skill-choice" onClick={chooseSkill}><Zap/>Compétence aléatoire</button></div></section></div>
}

function TrophyChoice({ save, setSave }: { save: SaveData; setSave: (save: SaveData) => void }) {
  const choose = (id: string) => { const next = clone(save); next.owned[id] ??= { level: 1, xp: 0, kills: 0 }; next.bossTrophyPending = false; setSave(next) }
  return <div className="modal-backdrop"><section className="level-choice"><span className="eyebrow">BOSS PRIMORDIAL VAINCU</span><h2>Choisis ton trophée</h2><div className="trophy-grid">{['mammoth-spear','mammoth-plate'].map((id) => { const item = itemById(id); return <button className={rarityClass(item.rarity)} onClick={() => choose(id)} key={id}><EquipmentArt item={item}/><strong>{item.name}</strong><span>{item.bonus}</span></button> })}</div></section></div>
}

export default function App() {
  const [save, setSaveState] = useState<SaveData>(() => loadSave()), [view, setView] = useState<View>('hub'), [detail, setDetail] = useState<EquipmentDefinition | null>(null), [activeBattle, setActiveBattle] = useState<ActiveBattle | null>(null)
  const initial = useRef(true)
  const setSave = (next: SaveData) => setSaveState(next)
  useEffect(() => { if (initial.current) initial.current = false; persistSave(save) }, [save])
  const startBattle = (mode: 'training' | 'campaign', node = 0) => {
    if ((mode === 'training' && save.trainingRemaining <= 0) || (mode === 'campaign' && save.campaignRemaining <= 0)) return
    const rng = seededRng(Date.now()), enemyLevel = Math.max(1, save.warrior.level + (mode === 'training' ? Math.floor(rng() * 3) - 1 : Math.floor(node / 3)))
    const enemy = generateEnemy(enemyLevel, node, rng), fighter: Fighter = { name: save.warrior.name, stats: effectiveStats(save), skills: save.warrior.skills, weapon: save.equippedWeapon, armor: save.equippedArmor }
    setActiveBattle({ result: simulateBattle(fighter, enemy, Date.now()), mode, node, enemyLevel }); setView('battle')
  }
  const equip = (item: EquipmentDefinition) => { if (!save.owned[item.id]) return; const next = clone(save); if (item.type === 'weapon') next.equippedWeapon = item.id; else next.equippedArmor = item.id; setSave(next) }
  const content = useMemo(() => {
    if (view === 'hub') return <Hub save={save} setView={setView} setDetail={setDetail}/>
    if (view === 'collection') return <Collection save={save} setSave={setSave} setDetail={setDetail}/>
    if (view === 'chest') return <Chests save={save} setSave={setSave} setDetail={setDetail}/>
    if (view === 'adventure') return <Adventure save={save} startBattle={startBattle}/>
    if (view === 'training') return <div className="mode-page training-page page-enter"><div className="mode-visual"><div className="training-ring"><WarriorAvatar appearance={save.warrior.appearance} weapon={save.equippedWeapon} armor={save.equippedArmor}/></div></div><div className="mode-copy"><span className="eyebrow">ARÈNE QUOTIDIENNE</span><h1>Entraînement</h1><p>Affronte des Warriors de ton niveau. Chaque victoire renforce ton équipement et aiguise ton instinct.</p><div className="remaining"><strong>{save.trainingRemaining}</strong><span>combats récompensés<br/>restants sur 100</span></div><div className="training-rewards"><span><Zap/>+1 XP Warrior</span><span><Coins/>+1 pièce</span><span><Shield/>+1 XP par équipement</span></div><button className="primary wide" disabled={save.trainingRemaining <= 0} onClick={() => startBattle('training')}>TROUVER UN ADVERSAIRE</button></div></div>
    if (view === 'duel') return <div className="soon page-enter"><div className="duel-emblem"><Swords/></div><span className="eyebrow">PORTAIL VERROUILLÉ</span><h1>Duel asynchrone</h1><p>Prochainement</p><span>Prépare ton build. Les autres Warriors arrivent d’une autre ligne du temps.</span></div>
    return null
  }, [view, save])
  if (!save.created) return <Creation save={save} setSave={setSave}/>
  if (view === 'battle' && activeBattle) return <Battle save={save} setSave={setSave} active={activeBattle} onExit={() => { setView(activeBattle.mode === 'campaign' ? 'adventure' : 'training'); setActiveBattle(null) }}/>
  return <div className="app-shell"><Header save={save} view={view} setView={setView}/><main className="main-content">{content}</main><nav className="bottom-nav" aria-label="Navigation principale">{nav.map(({ id, label, icon: Icon }) => <button aria-label={label} className={view === id ? 'active' : ''} onClick={() => setView(id)} key={id}><Icon/><span>{label}</span></button>)}</nav>
    {detail && <div className="modal-backdrop" onClick={() => setDetail(null)}><section className={`detail-sheet ${rarityClass(detail.rarity)}`} onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setDetail(null)}><X/></button><EquipmentArt item={detail}/><span className="rarity-label">{detail.rarity}</span><h2>{detail.name}</h2><p className="bonus">{detail.bonus}</p><p>{detail.effect}</p>{save.owned[detail.id] ? <><div className="detail-level"><span>Niveau {save.owned[detail.id].level}</span><span>{save.owned[detail.id].xp} XP cumulée</span></div><button className="primary wide" disabled={[save.equippedWeapon, save.equippedArmor].includes(detail.id)} onClick={() => { equip(detail); setDetail(null) }}>{[save.equippedWeapon, save.equippedArmor].includes(detail.id) ? 'ÉQUIPÉ' : 'ÉQUIPER'}</button></> : <div className="locked-copy"><Lock/>À découvrir dans un coffre</div>}</section></div>}
    {save.pendingLevelChoice && <LevelChoice save={save} setSave={setSave}/>} {save.bossTrophyPending && <TrophyChoice save={save} setSave={setSave}/>}</div>
}
