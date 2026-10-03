import { useState } from 'react'
import { Award, Check, Crown, Lock } from 'lucide-react'
import { exploits, gradeRewards, hasBadgeReward, primalBadges, PRIMAL_MASTERY_ID, PRIMAL_MASTERY_REWARD, unlockedExploitCount, unlockedPrimalBadgeCount, type BadgeDefinition, type BadgeGrade } from '../badgeSystem'
import type { SaveData } from '../types'
import { GameIcon } from './Art'

const gradeNames: Record<BadgeGrade, string> = { bronze: 'Bronze', silver: 'Argent', gold: 'Or', platinum: 'Platine' }

function BadgeCard({ badge, save }: { badge: BadgeDefinition; save: SaveData }) {
  const { current, target } = badge.progress(save)
  const unlocked = hasBadgeReward(save, badge.id)
  const state = unlocked ? 'unlocked' : current > 0 ? 'progress' : 'locked'
  return <article className={`era-badge-card grade-${badge.grade} state-${state}`} aria-label={`${badge.title} · ${unlocked ? 'débloqué' : current > 0 ? 'en progression' : 'verrouillé'}`}>
    <span className="era-badge-emblem" aria-hidden="true"><Award/></span>
    <div className="era-badge-copy"><span className="era-badge-grade">{gradeNames[badge.grade]}</span><h4>{badge.title}</h4><p>{badge.description}</p>{!unlocked && !badge.binary && <div className="era-badge-progress"><span>{current} / {target}</span><div className="era-badge-progress-track" role="progressbar" aria-label={`Progression de ${badge.title}`} aria-valuemin={0} aria-valuemax={target} aria-valuenow={current}><i style={{ width: `${current / target * 100}%` }}/></div></div>}</div>
    <div className="era-badge-meta"><span className="era-badge-reward"><GameIcon group="stats" name="coins"/>+{gradeRewards[badge.grade]}</span><span className="era-badge-state">{unlocked ? <><Check/>Débloqué</> : current > 0 ? 'En progression' : <><Lock/>Verrouillé</>}</span></div>
  </article>
}

function BadgeGrades({ badges, save }: { badges: readonly BadgeDefinition[]; save: SaveData }) {
  return (['bronze', 'silver', 'gold', 'platinum'] as const).map((grade) => <section className="era-grade-section" key={grade} aria-label={`Badges ${gradeNames[grade]}`}><div className="era-grade-heading"><span className={`era-grade-dot grade-${grade}`}/><h3>{gradeNames[grade]}</h3></div><div className="era-badge-grid">{badges.filter((badge) => badge.grade === grade).map((badge) => <BadgeCard key={badge.id} badge={badge} save={save}/>)}</div></section>)
}

export function BadgesView({ save }: { save: SaveData }) {
  const [family, setFamily] = useState<'eras' | 'exploits'>('exploits')
  const unlockedCount = unlockedPrimalBadgeCount(save)
  const unlockedExploits = unlockedExploitCount(save)
  const masteryUnlocked = hasBadgeReward(save, PRIMAL_MASTERY_ID)
  return <section className="badges-view" aria-label="Badges"><div className="badges-heading"><span className="eyebrow">DISTINCTIONS</span><h2>Vos accomplissements</h2><p>Une trace de chaque victoire à travers les ères.</p></div>
    <div className="badge-family-tabs" aria-label="Famille de badges"><button className={family === 'exploits' ? 'active' : ''} aria-pressed={family === 'exploits'} onClick={() => setFamily('exploits')}>Exploits</button><button className={family === 'eras' ? 'active' : ''} aria-pressed={family === 'eras'} onClick={() => setFamily('eras')}>Ères</button></div>
    {family === 'exploits' ? <div className="primal-badges"><div className="primal-badges-summary"><div><span className="eyebrow">CARRIÈRE CHRONOS</span><h3>Exploits</h3><p>Vos accomplissements à travers toutes les ères.</p></div><div className="primal-badges-totals"><strong>{unlockedExploits} <small>/ {exploits.length}</small></strong><span>exploits débloqués</span></div><div className="primal-badges-track" role="progressbar" aria-label="Progression des exploits" aria-valuemin={0} aria-valuemax={exploits.length} aria-valuenow={unlockedExploits}><i style={{ width: `${unlockedExploits / exploits.length * 100}%` }}/></div></div><BadgeGrades badges={exploits} save={save}/></div> : <div className="primal-badges"><div className="primal-badges-summary"><div><span className="eyebrow">ÈRE I</span><h3>Ère Primordiale</h3><p>La Vallée des Titans · 12 distinctions à conquérir</p></div><div className="primal-badges-totals"><strong>{unlockedCount} <small>/ {primalBadges.length}</small></strong><span>badges débloqués</span></div><div className="primal-badges-track" role="progressbar" aria-label="Progression des badges primordiaux" aria-valuemin={0} aria-valuemax={primalBadges.length} aria-valuenow={unlockedCount}><i style={{ width: `${unlockedCount / primalBadges.length * 100}%` }}/></div></div>
      <BadgeGrades badges={primalBadges} save={save}/>
      <article className={`primal-mastery ${masteryUnlocked ? 'is-unlocked' : ''}`}><span className="primal-mastery-icon" aria-hidden="true"><Crown/></span><div><span className="eyebrow">RÉCOMPENSE D’ÈRE</span><h3>Maîtrise Primordiale</h3><p>Complétez les 12 distinctions de l’Ère Primordiale.</p><small>{unlockedCount} / {primalBadges.length} badges · {masteryUnlocked ? 'Obtenue' : 'À débloquer'}</small></div><strong><GameIcon group="stats" name="coins"/>+{PRIMAL_MASTERY_REWARD}</strong></article>
    </div>}
  </section>
}
