import { enemyIds, enemySprite } from '../art/assetsV04'
import { primalWarriors } from '../warriors'
import { BattleFighterHud } from './BattleHud'

/** Local-only visual contact sheet: the real HUD component and its real portrait sources. */
export function HudPortraitPreview() {
  return <main className="hud-portrait-preview">
    <h1>Portraits HUD · QA locale</h1>
    <p>Le cadrage ci-dessous utilise exactement les portraits du combat.</p>
    <section aria-label="Warriors Primal">
      <h2>Warriors Primal</h2>
      <div className="hud-portrait-preview-grid">
        {primalWarriors.map((warrior) => <BattleFighterHud key={warrior.id} side="player" name={warrior.name} level={1} hp={warrior.baseStats.hp} maxHp={warrior.baseStats.hp} portrait={warrior.art} portraitId={warrior.id}/>)}
      </div>
    </section>
    <section aria-label="Ennemis Primal">
      <h2>Ennemis Primal</h2>
      <div className="hud-portrait-preview-grid">
        {enemyIds.map((enemyId) => <BattleFighterHud key={enemyId} side="enemy" name={enemyId} level={1} hp={100} maxHp={100} portrait={enemySprite(enemyId, 'idle')} portraitId={enemyId}/>)}
      </div>
    </section>
    <section aria-label="Tyrak côté ennemi">
      <h2>Tyrak côté ennemi</h2>
      <div className="hud-portrait-preview-grid">
        <BattleFighterHud side="enemy" name="TYRAK" level={1} hp={245} maxHp={245} portrait={primalWarriors.find((warrior) => warrior.id === 'tyrak')?.art} portraitId="tyrak"/>
      </div>
    </section>
  </main>
}
