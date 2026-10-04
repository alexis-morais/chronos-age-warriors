/** Real engine, deterministic seeds, fixed enemies; generated reports are git-ignored. */
import { createServer } from 'vite'
import { mkdirSync, writeFileSync } from 'node:fs'

const option = (name, fallback) => process.argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback
const trials = Number(option('trials', '1000'))
const nodes = option('nodes', '1,5,10,15,16,17,18,19,20').split(',').map(Number)
const server = await createServer({ server: { middlewareMode: true, ws: false, watch: null }, appType: 'custom', logLevel: 'error' })
try {
  const game = await server.ssrLoadModule('/src/game.ts')
  const { getWarriorLevelStats, WARRIOR_XP_REQUIREMENTS } = await server.ssrLoadModule('/src/warriorProgression.ts')
  const { primalWarriors } = await server.ssrLoadModule('/src/warriors.ts')
  const { equipment } = await server.ssrLoadModule('/src/data.ts')
  const { warriorPassives } = await server.ssrLoadModule('/src/warriorPassives.ts')
  const { nemesisEnemy } = await server.ssrLoadModule('/src/nemesisBalance.ts')
  const { riftEnemy } = await server.ssrLoadModule('/src/riftBalance.ts')
  const fighter = (warrior, level, gear) => {
    const stats = { ...getWarriorLevelStats(warrior.id, level) }
    for (const id of gear) for (const [key, value] of Object.entries(game.equipmentStats(id))) stats[key] += value
    return { name: warrior.name, warriorId: warrior.id, level, stats, skills: [], weapon: gear[0], armor: gear[1] }
  }
  const rate = (player, enemy, count, seedBase = 1) => {
    let wins = 0, maxActions = 0
    const procs = {}
    for (let sample = 0; sample < count; sample++) {
      const result = game.simulateBattle(player, enemy, seedBase + sample * 97)
      wins += result.winner === 'player' ? 1 : 0
      maxActions = Math.max(maxActions, result.events.filter((entry) => entry.type === 'attack').length)
      for (const event of result.events) if (event.type === 'skill' && event.label) procs[event.label] = (procs[event.label] ?? 0) + 1
    }
    return { winRate: Math.round(10000 * wins / count) / 100, maxActions, procs }
  }
  const rows = [], loadouts = {}, rift = []
  for (const warrior of primalWarriors) {
    const configurations = {
      none: [], common: ['flint-club', 'hunter-hides'], medium: ['volcanic-hammer', 'volcanic-shell'],
      good: ['tyrant-claw', 'white-titan-fur'], endgame: ['titan-heart', 'primordial-titan-skin'],
    }
    // Excellent optimization is the best legal loadout for this matchup, not a fictitious power score.
    if (option('optimize', 'no') === 'yes') {
      let best = -1
      for (const weapon of equipment.filter((item) => item.type === 'weapon')) for (const armor of equipment.filter((item) => item.type === 'armor')) {
        const gear = [weapon.id, armor.id]
        const winRate = rate(fighter(warrior, 10, gear), nemesisEnemy(20), 200).winRate
        if (winRate > best) { best = winRate; configurations.endgame = gear }
      }
    }
    loadouts[warrior.id] = configurations
    const cases = [[1, 'none'], [3, 'common'], [5, 'medium'], [7, 'good'], [9, 'good'], [9, 'endgame'], [10, 'medium'], [10, 'good'], [10, 'endgame']]
    for (const [level, gear] of cases) for (const mode of ['normal', 'nemesis']) for (const node of nodes) {
      const enemy = mode === 'normal' ? game.generateEnemy(1, node, () => .5) : nemesisEnemy(node)
      rows.push({ warrior: warrior.id, level, gear, mode, node, trials, ...rate(fighter(warrior, level, configurations[gear]), enemy, trials, node * 1000003 + level * 7919) })
    }
    for (const level of [1, 5, 7, 10]) for (const difficulty of [100, 50]) for (const stage of [0, 4]) {
      rift.push({ warrior: warrior.id, level, difficulty, stage, ...rate(fighter(warrior, level, configurations[level === 1 ? 'none' : level === 5 ? 'medium' : level === 7 ? 'good' : 'endgame']), riftEnemy(stage, 'mammoth', difficulty, () => .5), trials) })
    }
  }
  const enemies = Array.from({ length: 20 }, (_, index) => ({ node: index + 1, normal: game.generateEnemy(1, index + 1, () => .5), nemesis: nemesisEnemy(index + 1) }))
  mkdirSync('qa-output', { recursive: true })
  const report = { trials, seedFormula: 'node*1000003 + level*7919 + sample*97', xp: WARRIOR_XP_REQUIREMENTS, loadouts, equipment, warriorPassives, enemies, rows, rift }
  writeFileSync('qa-output/v014-balance.json', JSON.stringify(report, null, 2))
  const lines = ['# V0.14 — simulations reproductibles', `\n${trials} graines par cellule. Statistiques ennemies fixes. Aucun scaling joueur/rareté.`, '\n## Morgath', '\nWarrior | Niveau | Équipement | Normal % | Némésis %', '---|---:|---|---:|---:']
  for (const warrior of primalWarriors) for (const [level, gear] of [[9,'good'],[9,'endgame'],[10,'medium'],[10,'good'],[10,'endgame']]) {
    const find = (mode) => rows.find((row) => row.warrior === warrior.id && row.level === level && row.gear === gear && row.mode === mode && row.node === 20)?.winRate
    lines.push(`${warrior.name}|${level}|${gear}|${find('normal')}|${find('nemesis')}`)
  }
  lines.push('\n## Niveaux clés — moyenne des 12 Warriors', '\nNiveau Warrior | Équipement | Aventure | Normal % | Némésis %', '---:|---|---:|---:|---:')
  for (const [level, gear] of [[1,'none'],[3,'common'],[5,'medium'],[7,'good'],[10,'good']]) for (const node of nodes) {
    const mean = (mode) => { const group = rows.filter((row) => row.level === level && row.gear === gear && row.node === node && row.mode === mode); return Math.round(group.reduce((sum, row) => sum + row.winRate, 0) / group.length * 100) / 100 }
    lines.push(`${level}|${gear}|${node}|${mean('normal')}|${mean('nemesis')}`)
  }
  writeFileSync('qa-output/v014-balance.md', lines.join('\n') + '\n')
  console.log(lines.slice(0, 66).join('\n'))
  console.log(`Saved ${rows.length * trials} campaign trials + ${rift.length * trials} Rift trials.`)
} finally { await server.close() }
