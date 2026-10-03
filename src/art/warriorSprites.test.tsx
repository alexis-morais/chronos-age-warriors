import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BattleResultOverlay } from '../App'
import { FloatingCombatText, WarriorAttackFx, WarriorCompanion, WarriorSprite } from '../components/WarriorSprite'
import { BattleFighterHud } from '../components/BattleHud'
import { SpritePreview } from '../components/SpritePreview'
import { simulateBattle } from '../game'
import type { Fighter } from '../types'
import { combatTextForEvent } from './combatText'
import { attackHasImpact, companionFootOffsetY, playerReactionForEvent, spritePose, warriorAttackTimeline, warriorBattleGeometry, warriorSpriteKit, warriorSpriteKits, warriorUsesApproach } from './warriorSprites'
import { primalWarriors } from '../warriors'

describe('pipeline de sprites Warrior', () => {
  it('enregistre les 12 Warriors avec leurs propres fichiers runtime existants', () => {
    expect(Object.keys(warriorSpriteKits)).toEqual(primalWarriors.map((warrior) => warrior.id))
    for (const warrior of primalWarriors) {
      const kit = warriorSpriteKit(warrior.id)!
      const root = `/assets/sprites/warriors/primal/${warrior.id}/`
      expect(kit.base).toBe(`${root}base.png`)
      for (const path of [kit.base, ...Object.values(kit.sheets), kit.attackFx, kit.projectile, kit.impactFx, kit.companionRun, kit.companionAttack].filter((value): value is string => Boolean(value))) {
        expect(path).toMatch(new RegExp(`^${root}`))
      }
      expect(kit.frames).toBe(4)
      expect(Object.values(kit.sheets)).toHaveLength(7)
      expect(kit.sheets.hit).toMatch(new RegExp(`/${warrior.id}/hit(?:-runtime)?\\.png$`))
      expect(kit.sheets.dodge).toContain(`/${warrior.id}/dodge.png`)
      expect(kit.sheets.block).toContain(`/${warrior.id}/block.png`)
      expect(kit.sheets.ko).toContain(`/${warrior.id}/`)
    }
  })

  it('termine chaque attaque Primal avant le prochain événement et garde le FX sur la vraie frame de contact', () => {
    for (const id of ['brakk', 'ursak', 'saar', 'morga', 'vorka', 'urgath', 'tyrak']) {
      const kit = warriorSpriteKit(id)!
      const presentation = kit.attackPresentation!
      expect(presentation.contactFrame).toBe(2)
      expect(presentation.fxCueMs - presentation.poseAtMs).toBeGreaterThanOrEqual(kit.durationMs.attack / 2)
      expect(presentation.fxCueMs - presentation.poseAtMs).toBeLessThan(kit.durationMs.attack * 0.75)
      expect(presentation.eventDurationMs - presentation.poseAtMs).toBeGreaterThanOrEqual(kit.durationMs.attack + presentation.contactHoldMs!)
      expect(presentation.contactHoldMs).toBe(0)
      expect(kit.contact).toBeDefined()
    }
    expect(warriorSpriteKit('brakk')!.sheets.attack).toContain('attack-runtime.png')
    expect(warriorSpriteKit('tyrak')!.sheets.hit).toContain('hit-runtime.png')
  })

  it('calcule les contacts et les trajectoires depuis les vrais centres mesurés, sans charge pour Eyla ni Asha', () => {
    const bounds = { playerCenterX: 454, enemyCenterX: 986, playerWidth: 150, playerHeight: 200, enemyWidth: 133, enemyHeight: 133, groundFromBottom: 150 }
    const contacts = ['brakk', 'ursak', 'saar', 'morga', 'vorka', 'urgath', 'tyrak'].map((id) => warriorBattleGeometry(warriorSpriteKit(id)!, bounds, false).contactDistance)
    expect(contacts.every((distance) => distance !== null && distance > 0 && distance < 532)).toBe(true)
    expect(new Set(contacts.map((distance) => Math.round(distance!))).size).toBeGreaterThanOrEqual(5)
    for (const id of ['eyla', 'asha']) {
      const kit = warriorSpriteKit(id)!
      expect(warriorUsesApproach(kit)).toBe(false)
      const geometry = warriorBattleGeometry(kit, bounds, false)
      expect(geometry.contactDistance).toBeNull()
      expect(geometry.projectile!.left + geometry.projectile!.width * kit.projectilePresentation!.visualAnchorX).toBeGreaterThan(bounds.playerCenterX)
      expect(geometry.projectile?.left).toBeLessThan(bounds.enemyCenterX)
      expect(geometry.projectile?.travelX).toBeGreaterThan(300)
    }
    expect(warriorBattleGeometry(warriorSpriteKit('rhex')!, bounds, false).companionDistance).toBeGreaterThan(0)
  })

  it('réserve les charges aux mêlées et utilise les kits spécifiques de distance, compagnons et morsure', () => {
    expect(warriorUsesApproach(warriorSpriteKit('karg')!)).toBe(true)
    expect(warriorUsesApproach(warriorSpriteKit('naya')!)).toBe(true)
    for (const id of ['eyla', 'asha']) {
      const kit = warriorSpriteKit(id)!
      expect(kit.attackKind).toBe('ranged')
      expect(warriorUsesApproach(kit)).toBe(false)
      expect(kit.projectile).toContain(`/${id}/`)
      expect(kit.sheets.run).toBe(kit.sheets.idle)
    }
    expect(warriorSpriteKit('asha')!.projectile).toContain('/asha/attack-fx-runtime.png')
    const rhex = warriorSpriteKit('rhex')!
    expect(rhex.attackKind).toBe('companion')
    expect(warriorUsesApproach(rhex)).toBe(false)
    expect(rhex.companionRun).toContain('/rhex/raptors-run.png')
    expect(rhex.companionAttack).toContain('/rhex/raptors-attack-runtime.png')
    expect(rhex.sheets.attack).toBe('/assets/sprites/warriors/primal/rhex/command-solo.png')
    expect(rhex.sheets.attack).not.toBe(rhex.previewExtras?.command)
    expect(rhex.footY.attack).toBe(692)
    expect(rhex.posePresentation?.attack?.scale).toBe(0.82)
    expect(rhex.posePresentation?.attack?.mobileScale).toBe(0.68)
    expect(rhex.attackPresentation?.contactHoldMs).toBe(0)
    expect(rhex.companionFootY).toEqual({ idle: 679, run: 520, attack: 597 })
    expect(companionFootOffsetY(rhex, 'run')).toBeCloseTo(190.08, 1)
    expect(companionFootOffsetY(rhex, 'attack')).toBeCloseTo(113.08, 1)
    expect(companionFootOffsetY(rhex, 'return', true)).toBeCloseTo(190.98, 1)
    const { container, rerender, unmount } = render(<WarriorCompanion warriorId="rhex" phase="run"/>)
    expect(container.querySelectorAll('.warrior-companion-frame')).toHaveLength(1)
    expect(container.querySelector('.warrior-companion')?.getAttribute('style')).toContain('--companion-paint-offset: 26.')
    rerender(<WarriorCompanion warriorId="rhex" phase="attack"/>)
    expect(container.querySelectorAll('.warrior-companion-frame')).toHaveLength(1)
    expect(container.querySelector('.warrior-companion')?.getAttribute('style')).toContain('raptors-attack-runtime.png')
    unmount()
    for (const path of [rhex.companionAttack!, ...['brakk', 'eyla', 'ursak', 'saar', 'rhex'].map((id) => warriorSpriteKit(id)!.sheets.hit)]) {
      expect(path).toContain('-runtime.png')
    }
    expect(warriorSpriteKit('brakk')!.poseGeometry?.attack?.frameWidth).toBe(640)
    expect(warriorSpriteKit('saar')!.attackFx).toContain('/saar/attack-fx.png')
    expect(warriorSpriteKit('saar')!.attackFx).not.toBe(warriorSpriteKit('karg')!.attackFx)
    const tyrak = warriorSpriteKit('tyrak')!
    expect(tyrak.sheets.run).toContain('/tyrak/run-runtime.png')
    expect(tyrak.sheets.attack).toContain('/tyrak/attack-runtime.png')
    expect(tyrak.attackFx).toContain('/tyrak/attack-fx.png')
    expect(tyrak.sheets.ko).toContain('/tyrak/ko-runtime.png')
  })

  it('ouvre chaque nouveau Warrior et les planches spéciales dans SpritePreview', () => {
    for (const id of ['brakk', 'eyla', 'asha', 'rhex', 'ursak', 'saar', 'morga', 'vorka', 'urgath', 'tyrak']) {
      window.history.replaceState({}, '', `/?admin&spritePreview&qaWarrior=${id}&qaAnimation=attack`)
      const { unmount } = render(<SpritePreview/> )
      expect(screen.getByRole('img', { name: `${id}, animation attack` })).toBeTruthy()
      unmount()
    }
    window.history.replaceState({}, '', '/?admin&spritePreview&qaWarrior=rhex&qaAnimation=raptors-run')
    const { unmount } = render(<SpritePreview/> )
    expect(screen.getByRole('img', { name: 'rhex, animation attack' }).getAttribute('style')).toContain('/rhex/raptors-run.png')
    unmount()
    window.history.replaceState({}, '', '/?admin&spritePreview&qaWarrior=rhex&qaAnimation=command-solo')
    const solo = render(<SpritePreview/> )
    expect(screen.getByRole('img', { name: 'rhex, animation attack' }).getAttribute('style')).toContain('/rhex/command-solo.png')
    solo.unmount()
    window.history.replaceState({}, '', '/')
  })
  it('résout les neuf assets de Karg et quatre cellules de 543 × 724', () => {
    const kit = warriorSpriteKit('karg')!
    expect(kit).toBeDefined()
    expect(kit.frames).toBe(4)
    expect(kit.frameWidth * kit.frames).toBe(2172)
    expect(kit.frameHeight).toBe(724)
    expect(kit.scale).toBe(0.82)
    expect(kit.mobileScale).toBe(0.69)
    expect(kit.groundAnchor).toBe(0.056)
    expect(kit.mobileGroundAnchor).toBe(0.044)
    expect([kit.base, ...Object.values(kit.sheets), kit.attackFx]).toHaveLength(9)
    expect(kit.sheets.dodge).toContain('/dodge.png')
    expect(kit.sheets.block).toContain('/block.png')
    expect(kit.sheets.ko).toContain('/ko.png')
    expect([kit.base, ...Object.values(kit.sheets), kit.attackFx].every((asset) => asset.startsWith('/assets/sprites/warriors/primal/karg/'))).toBe(true)
  })

  it('résout les neuf assets de Naya sans charger son image statique en combat', () => {
    const kit = warriorSpriteKit('naya')!
    expect(kit).toBeDefined()
    expect(kit.frames).toBe(4)
    expect(kit.frameWidth * kit.frames).toBe(2172)
    expect(kit.frameHeight).toBe(724)
    expect(kit.base).toBe('/assets/sprites/warriors/primal/naya/base.png')
    expect([kit.base, ...Object.values(kit.sheets), kit.attackFx]).toHaveLength(9)
    expect([kit.base, ...Object.values(kit.sheets), kit.attackFx].every((asset) => asset.startsWith('/assets/sprites/warriors/primal/naya/'))).toBe(true)
    expect(Object.values(kit.sheets)).not.toContain(kit.base)
    expect(kit.attackFx).toContain('/naya/attack-fx.png')
  })

  it('montre le corps de Naya avant le FX de contact, sans changer le rythme de Karg', () => {
    const naya = warriorSpriteKit('naya')!
    const nayaTimeline = warriorAttackTimeline(naya)
    expect(naya.durationMs.attack).toBe(360)
    expect(nayaTimeline).toEqual({ approachAtMs: 100, poseAtMs: 230, fxCueMs: 410, fxDurationMs: 240, eventDurationMs: 500 })
    expect(nayaTimeline.fxCueMs).toBe(nayaTimeline.poseAtMs + naya.durationMs.attack / 2)
    expect(nayaTimeline.fxCueMs).toBeLessThan(nayaTimeline.eventDurationMs)
    expect(nayaTimeline.fxCueMs! + nayaTimeline.fxDurationMs).toBeGreaterThan(nayaTimeline.eventDurationMs)
    expect(warriorSpriteKit('karg')?.durationMs.attack).toBe(270)
    expect(warriorAttackTimeline(warriorSpriteKit('karg')!)).toEqual({ approachAtMs: 100, poseAtMs: 230, fxCueMs: null, fxDurationMs: 320, eventDurationMs: 500 })
    const hp = { playerHp: 100, enemyHp: 90 }
    expect(attackHasImpact([{ type: 'attack', actor: 'player', target: 'enemy', ...hp }, { type: 'critical', actor: 'player', target: 'enemy', ...hp }, { type: 'damage', actor: 'player', target: 'enemy', value: 12, ...hp }], 0)).toBe(true)
    expect(attackHasImpact([{ type: 'attack', actor: 'player', target: 'enemy', ...hp }, { type: 'dodge', actor: 'enemy', target: 'player', ...hp }], 0)).toBe(false)
  })

  it('aligne la hauteur visible et les pieds de Naya sur Karg sans modifier Karg', () => {
    const karg = warriorSpriteKit('karg')!
    const naya = warriorSpriteKit('naya')!
    for (const [scaleKey, anchorKey] of [['scale', 'groundAnchor'], ['mobileScale', 'mobileGroundAnchor']] as const) {
      const kargHeight = karg[scaleKey] * (662 - 99) / karg.frameHeight
      const nayaHeight = naya[scaleKey] * (676 - 126) / naya.frameHeight
      expect(Math.abs(nayaHeight - kargHeight)).toBeLessThan(0.003)
      const kargFoot = karg[scaleKey] * (karg.frameHeight - 662) / karg.frameHeight - karg[anchorKey]
      const nayaFoot = naya[scaleKey] * (naya.frameHeight - 676) / naya.frameHeight - naya[anchorKey]
      expect(Math.abs(nayaFoot - kargFoot)).toBeLessThan(0.002)
    }
  })

  it('rend toutes les poses et le portrait Naya avec son propre kit', () => {
    const { rerender } = render(<WarriorSprite warriorId="naya" state="idle"/>)
    for (const [state, pose] of [['idle', 'idle'], ['approach', 'run'], ['attack', 'attack'], ['hurt', 'hit'], ['dodge', 'dodge'], ['block', 'block'], ['ko', 'ko']] as const) {
      rerender(<WarriorSprite warriorId="naya" state={state} facing="left"/>)
      const sprite = screen.getByRole('img', { name: `naya, animation ${pose}` })
      expect(sprite.getAttribute('data-frame-count')).toBe('4')
      expect(sprite.className).toContain('facing-left')
      expect(sprite.getAttribute('style')).toContain(`/naya/${pose}.png`)
    }
    rerender(<BattleFighterHud side="player" name="Naya" level={1} hp={110} maxHp={110} portrait="/naya.png" portraitId="naya"/>)
    expect(screen.getByRole('region', { name: /Naya, niveau 1/ }).querySelector('.combat-hud-portrait')?.getAttribute('style')).toContain('--portrait-zoom: 3.3')
  })

  it('utilise la planche FX dédiée de Naya et garde sa pose KO à taille constante', () => {
    const { container, rerender } = render(<><WarriorSprite warriorId="naya" state="attack"/><WarriorAttackFx warriorId="naya"/></>)
    const attack = screen.getByRole('img', { name: /naya, animation attack/ })
    const attackScale = attack.style.getPropertyValue('--warrior-scale')
    expect(container.querySelector('.warrior-attack-fx')?.getAttribute('style')).toContain('/naya/attack-fx.png')
    rerender(<WarriorSprite warriorId="naya" state="ko"/>)
    const ko = screen.getByRole('img', { name: /naya, animation ko/ })
    expect(ko.style.getPropertyValue('--warrior-scale')).toBe(attackScale)
    expect(ko.style.getPropertyValue('--warrior-sheet')).toContain('/naya/ko.png')
  })

  it('rend Karg sans crash à droite et à gauche, et garde un fallback pour les autres', () => {
    const { rerender } = render(<WarriorSprite warriorId="karg" state="idle"/>)
    expect(screen.getByRole('img', { name: /karg, animation idle/ }).getAttribute('data-frame-count')).toBe('4')
    expect(screen.getByRole('img', { name: /karg, animation idle/ }).className).toContain('facing-right')
    expect(screen.getByRole('img', { name: /karg, animation idle/ }).getAttribute('style')).toContain('--warrior-scale: 0.82')
    rerender(<WarriorSprite warriorId="karg" state="approach" facing="left"/>)
    expect(screen.getByRole('img', { name: /karg, animation run/ }).className).toContain('facing-left')
    rerender(<WarriorSprite warriorId="another-warrior" state="attack"/>)
    expect(screen.getByRole('img', { name: /sprite provisoire/i })).toBeTruthy()
  })

  it('normalise la hauteur alpha et la baseline face à un humain standard aux deux formats', () => {
    const kit = warriorSpriteKit('karg')!
    // Measured at alpha > 24: Karg idle y=99..662 / 724, tribal-hunter y=6..274 / 280.
    const reference = { visible: 268, image: 280, footMargin: 6 }
    for (const [playerHeight, enemyHeight, scale, anchor] of [[200, 133, kit.scale, kit.groundAnchor], [161, 88, kit.mobileScale, kit.mobileGroundAnchor], [140, 80, kit.mobileScale, kit.mobileGroundAnchor]]) {
      const kargVisible = playerHeight * scale * (662 - 99) / kit.frameHeight
      const enemyVisible = enemyHeight * reference.visible / reference.image
      expect(Math.abs(kargVisible - enemyVisible) / enemyVisible).toBeLessThan(0.05)
      const kargFoot = playerHeight * (scale * (kit.frameHeight - 662) / kit.frameHeight - anchor)
      const enemyFoot = enemyHeight * reference.footMargin / reference.image
      expect(Math.abs(kargFoot - enemyFoot)).toBeLessThan(1)
    }
  })

  it('relie les états combat aux poses et affiche les textes seulement pour les événements réels', () => {
    expect(spritePose('approach')).toBe('run')
    expect(spritePose('attack')).toBe('attack')
    expect(spritePose('hurt')).toBe('hit')
    expect(spritePose('dodge')).toBe('dodge')
    expect(spritePose('block')).toBe('block')
    expect(spritePose('ko')).toBe('ko')
    const base = { actor: 'player', target: 'enemy', playerHp: 100, enemyHp: 90 } as const
    expect(combatTextForEvent({ ...base, type: 'attack' })).toBeNull()
    const dodge = combatTextForEvent({ ...base, type: 'dodge' })!
    expect(dodge).toEqual({ kind: 'dodge', target: 'player', label: 'ESQUIVE' })
    expect(combatTextForEvent({ ...base, type: 'skill', label: 'Parade' })).toEqual({ kind: 'block', target: 'player', label: 'BLOCAGE' })
    expect(combatTextForEvent({ ...base, type: 'skill', label: 'Rage' })).toBeNull()
    expect(playerReactionForEvent({ ...base, type: 'dodge' })).toBe('dodge')
    expect(playerReactionForEvent({ ...base, type: 'skill', label: 'Parade' })).toBe('block')
    const hit = { ...base, type: 'damage' as const, actor: 'enemy' as const, target: 'player' as const, value: 20 }
    const parade = { ...base, type: 'skill' as const, actor: 'player' as const, target: 'enemy' as const, label: 'Parade' }
    expect(playerReactionForEvent(hit)).toBe('hurt')
    expect(playerReactionForEvent(hit, parade)).toBe('block')
    expect(playerReactionForEvent({ ...hit, playerHp: 0 }, parade)).toBe('ko')
    expect(playerReactionForEvent({ ...hit, playerHp: 0 }, undefined, { ...base, type: 'heal', label: 'Second Souffle' })).toBe('hurt')
    expect(playerReactionForEvent({ ...hit, type: 'dodge', actor: 'player' })).toBe('dodge')
    expect(playerReactionForEvent({ ...base, type: 'ko', actor: 'enemy', target: 'player', playerHp: 0 })).toBe('ko')
    expect(playerReactionForEvent({ ...base, type: 'ko', actor: 'enemy', target: 'player' })).toBeNull()
    const { rerender } = render(<FloatingCombatText text={combatTextForEvent({ ...base, type: 'damage', value: 114 })!}/> )
    expect(screen.getByRole('status').textContent).toBe('−114')
    rerender(<FloatingCombatText text={combatTextForEvent({ ...base, type: 'damage', value: 100, target: 'player' }, true)!}/> )
    expect(screen.getByRole('status').classList.contains('target-player')).toBe(true)
    expect(screen.getByRole('status').classList.contains('floating-critical')).toBe(true)
    expect(screen.getByRole('status').textContent).toBe('−100')
    rerender(<FloatingCombatText text={dodge}/> )
    expect(screen.getByRole('status').textContent).toBe('ESQUIVE')
  })

  it('conserve la hauteur de Karg et compense seulement la baseline des nouvelles poses', () => {
    const { rerender } = render(<WarriorSprite warriorId="karg" state="idle"/>)
    const idle = screen.getByRole('img', { name: /karg, animation idle/ })
    const scale = idle.style.getPropertyValue('--warrior-scale')
    const idleAnchor = parseFloat(idle.style.getPropertyValue('--warrior-ground-anchor'))
    rerender(<WarriorSprite warriorId="karg" state="dodge"/>)
    const dodge = screen.getByRole('img', { name: /karg, animation dodge/ })
    expect(dodge.style.getPropertyValue('--warrior-scale')).toBe(scale)
    expect(parseFloat(dodge.style.getPropertyValue('--warrior-ground-anchor'))).toBeGreaterThan(idleAnchor)
    rerender(<WarriorSprite warriorId="karg" state="block"/>)
    expect(parseFloat(screen.getByRole('img', { name: /karg, animation block/ }).style.getPropertyValue('--warrior-ground-anchor'))).toBeLessThan(idleAnchor)
    rerender(<WarriorSprite warriorId="karg" state="ko"/>)
    const ko = screen.getByRole('img', { name: /karg, animation ko/ })
    expect(ko.style.getPropertyValue('--warrior-scale')).toBe(scale)
    expect(ko.style.getPropertyValue('--warrior-sheet')).toContain('/ko.png')
  })

  it('relie une vraie esquive et une vraie Parade du moteur aux poses Karg', () => {
    const player: Fighter = { name: 'Karg', stats: { strength: 8, dodge: 100, speed: 10, hp: 700 }, skills: ['Parade'] }
    const enemy: Fighter = { name: 'Chasseur', stats: { strength: 8, dodge: 0, speed: 10, hp: 700 }, skills: [] }
    const events = Array.from({ length: 12 }, (_, seed) => simulateBattle(player, enemy, seed + 1).events).flat()
    const dodge = events.find((event) => event.type === 'dodge' && event.actor === 'player')
    const block = events.find((event) => event.type === 'skill' && event.label === 'Parade' && event.actor === 'player')
    expect(dodge).toBeDefined()
    expect(block).toBeDefined()
    expect(playerReactionForEvent(dodge!)).toBe('dodge')
    expect(playerReactionForEvent(block!)).toBe('block')
    expect(combatTextForEvent(dodge!)?.label).toBe('ESQUIVE')
    expect(combatTextForEvent(block!)?.label).toBe('BLOCAGE')
  })

  it('affiche un HUD alimenté par les vrais PV et capable de descendre à zéro', () => {
    const { rerender } = render(<BattleFighterHud side="player" name="Karg" level={4} hp={54} maxHp={120} portrait="/karg.png" portraitId="karg"/>)
    expect(screen.getByText('Karg')).toBeTruthy()
    expect(screen.getByText('Niv. 4')).toBeTruthy()
    expect(screen.getByText('54 / 120 PV')).toBeTruthy()
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('54')
    expect(screen.getByRole('progressbar').querySelector('i')?.getAttribute('style')).toContain('45%')
    expect(screen.getByRole('region', { name: /Karg, niveau 4/ }).querySelector('.combat-hud-portrait img')?.getAttribute('src')).toBe('/karg.png')
    expect(screen.getByRole('region', { name: /Karg, niveau 4/ }).querySelector('.combat-hud-portrait')?.getAttribute('style')).toContain('--portrait-zoom: 3.3')
    rerender(<BattleFighterHud side="enemy" name="Chasseur primordial des cavernes" level={9} hp={0} maxHp={200} portrait="/enemy.png" portraitId="shaman"/> )
    expect(screen.getByText('0 / 200 PV')).toBeTruthy()
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0')
    expect(screen.getByRole('progressbar').querySelector('i')?.getAttribute('style')).toContain('0%')
    expect(screen.getByRole('region', { name: /Chasseur primordial des cavernes, niveau 9/ }).querySelector('.combat-hud-portrait img')?.getAttribute('src')).toBe('/enemy.png')
    expect(screen.getByRole('region', { name: /Chasseur primordial des cavernes, niveau 9/ }).className).toContain('enemy')
  })

  it('affiche la même fenêtre sobre en victoire et en défaite', () => {
    const summary = { xp: 1, coins: 1, levelUp: 0, badges: [], unlockedPassives: [] }
    const { rerender } = render(<BattleResultOverlay winner="player" enemyName="Guerrier errant" summary={summary} warriorLevel={1} onContinue={() => {}}/>)
    expect(screen.getByRole('dialog', { name: 'Résultat du combat' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'VICTOIRE' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'CONTINUER' })).toBeTruthy()
    expect(screen.getByText('+1 XP')).toBeTruthy()
    rerender(<BattleResultOverlay winner="enemy" enemyName="Guerrier errant" summary={{ ...summary, xp: 0, coins: 0 }} warriorLevel={1} onContinue={() => {}}/>)
    expect(screen.getByRole('heading', { name: 'DÉFAITE' })).toBeTruthy()
    expect(screen.getByRole('dialog', { name: 'Résultat du combat' }).querySelector('.result-sheet.enemy')).toBeTruthy()
  })
})
