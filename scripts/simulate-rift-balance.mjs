/** Seeded five-stage runs through the real Rift state machine and combat engine.
 * Run: node scripts/simulate-rift-balance.mjs --trials=300 --gear=common
 * Options: --warriors=karg,naya --levels=8,9,10 --difficulties=100,74,50
 */
import { createServer } from 'vite'

const option = (name, fallback) => process.argv.find((argument) => argument.startsWith(`--${name}=`))?.split('=')[1] ?? fallback
const numbers = (name, fallback) => option(name, fallback).split(',').map(Number)
const trials = Math.max(1, Math.trunc(Number(option('trials', '300'))))
const levels = numbers('levels', '8,9,10')
const difficulties = numbers('difficulties', '100,74,50')
const gear = option('gear', 'common')
const server = await createServer({ server: { middlewareMode: true, ws: false, watch: null }, appType: 'custom', logLevel: 'error' })

try {
  const { freshSave } = await server.ssrLoadModule('/src/storage.ts')
  const { primalWarriors } = await server.ssrLoadModule('/src/warriors.ts')
  const { prepareRift, beginRiftStage, createRiftEncounter, resolveRiftStage } = await server.ssrLoadModule('/src/rift.ts')
  const warriorIds = option('warriors', primalWarriors.map(({ id }) => id).join(',')).split(',')
  const streakFor = new Map([[100, 0], [90, 1], [82, 2], [74, 3], [68, 4], [62, 5], [56, 6], [50, 7]])
  const date = new Date('2026-10-03T12:00:00Z')
  const rows = []
  for (const warriorId of warriorIds) for (const level of levels) for (const difficulty of difficulties) {
    const streak = streakFor.get(difficulty)
    if (streak === undefined) throw new Error(`Unsupported difficulty: ${difficulty}`)
    const stages = [0, 0, 0, 0, 0], actions = [0, 0, 0, 0, 0]
    let clears = 0
    for (let sample = 0; sample < trials; sample++) {
      const base = freshSave()
      base.activeWarriorId = warriorId
      base.welcomeChestOpened = true
      base.ownedWarriors[warriorId] = { warriorId, level, xp: 0 }
      base.riftLossStreak = streak
      if (gear === 'common') {
        base.owned['flint-club'] = { quantity: 1, level: 1, xp: 0, kills: 0 }
        base.owned['hunter-hides'] = { quantity: 1, level: 1, xp: 0, kills: 0 }
        base.equippedWeapon = 'flint-club'; base.equippedArmor = 'hunter-hides'
      }
      let save = prepareRift(base, date, (sample * 104729 + level * 8191 + warriorIds.indexOf(warriorId) * 37) >>> 0)
      for (let stage = 0; stage < 5; stage++) {
        save = beginRiftStage(save, date)
        const encounter = createRiftEncounter(save, date)
        if (!encounter) throw new Error(`Rift encounter missing at stage ${stage}: ${JSON.stringify(save.riftRun)}`)
        actions[stage] += encounter.result.events.filter((event) => event.type === 'attack' && event.label !== 'Coup supplémentaire').length
        save = resolveRiftStage(save, encounter, encounter.result.winner)
        if (encounter.result.winner !== 'player') break
        stages[stage]++
        if (stage === 4) clears++
      }
    }
    rows.push({ warriorId, level, difficulty, trials, stageWins: stages.map((value) => Math.round(value / trials * 100)), clearRate: Math.round(clears / trials * 100), meanStageActions: actions.map((value, stage) => Math.round(value / (stage === 0 ? trials : stages[stage - 1] || 1) * 10) / 10) })
  }
  const format = option('format', 'table')
  if (format === 'json') console.log(JSON.stringify(rows, null, 2))
  else if (format === 'compact') {
    console.log(`Gear=${gear}; ${trials} seeded runs per cell; clear rate in %`)
    console.log(`Warrior | Level | ${difficulties.join(' / ')} power`)
    for (const warriorId of warriorIds) for (const level of levels) {
      const cells = difficulties.map((difficulty) => rows.find((row) => row.warriorId === warriorId && row.level === level && row.difficulty === difficulty)?.clearRate ?? '—')
      console.log(`${warriorId.padEnd(7)} | ${String(level).padStart(5)} | ${cells.join(' / ')}`)
    }
  } else {
    console.log(`Gear=${gear}, ${trials} runs per Warrior/level/difficulty`)
    console.log('Warrior | Lvl | Power | Stage wins 1→5 (% of runs) | Clear % | Mean actions/stage')
    for (const row of rows) console.log(`${row.warriorId.padEnd(7)} | ${String(row.level).padStart(3)} | ${String(row.difficulty).padStart(5)} | ${row.stageWins.map((value) => String(value).padStart(3)).join(' ')} | ${String(row.clearRate).padStart(7)} | ${row.meanStageActions.join(' / ')}`)
  }
} finally {
  await server.close()
}
