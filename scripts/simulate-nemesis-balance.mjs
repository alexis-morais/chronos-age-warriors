/** Seeded matrix against the real combat engine. Example:
 * node scripts/simulate-nemesis-balance.mjs --trials=400 --gear=common
 * Options: --gear=none|common|endgame --levels=8,9,10 --nodes=1,5,10,15,19,20 --format=matrix|json
 */
import { createServer } from 'vite'

const option = (name, fallback) => process.argv.find((argument) => argument.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback
const trials = Math.max(1, Math.trunc(Number(option('trials', '400'))))
const nodes = option('nodes', '1,5,10,15,19,20').split(',').map(Number)
const levels = option('levels', '10').split(',').map(Number)
const gear = option('gear', 'common')
const server = await createServer({ server: { middlewareMode: true, ws: false, watch: null }, appType: 'custom', logLevel: 'error' })

try {
  const { simulateBattle, equipmentStats } = await server.ssrLoadModule('/src/game.ts')
  const { nemesisEnemy } = await server.ssrLoadModule('/src/nemesisBalance.ts')
  const { getWarriorLevelStats } = await server.ssrLoadModule('/src/warriorProgression.ts')
  const { primalWarriors } = await server.ssrLoadModule('/src/warriors.ts')
  const warriorIds = option('warriors', primalWarriors.map(({ id }) => id).join(',')).split(',')
  const loadout = gear === 'none' ? [] : gear === 'common' ? ['flint-club', 'hunter-hides']
    : gear === 'endgame' ? ['tyrant-claw', 'primordial-titan-skin'] : gear.split(',')
  const rows = []
  for (const warriorId of warriorIds) for (const level of levels) for (const node of nodes) {
    const stats = { ...getWarriorLevelStats(warriorId, level) }
    for (const id of loadout) for (const [stat, value] of Object.entries(equipmentStats(id))) stats[stat] += value
    const fighter = { name: warriorId, warriorId, level, stats, skills: [], weapon: loadout[0], armor: loadout[1] }
    const enemy = nemesisEnemy(node)
    let wins = 0, firstWinningSeed = null
    for (let sample = 0; sample < trials; sample++) {
      const seed = node * 1000003 + sample * 97 + level * 7919 + warriorIds.indexOf(warriorId) * 10007
      if (simulateBattle(fighter, enemy, seed).winner === 'player') { wins++; firstWinningSeed ??= seed }
    }
    rows.push({ warriorId, level, node, gear, trials, wins, winRate: Math.round(1000 * wins / trials) / 10, firstWinningSeed })
  }
  if (option('format', 'matrix') === 'json') console.log(JSON.stringify(rows, null, 2))
  else {
    console.log(`Némésis · ${trials} seeded battles per matchup · gear=${gear}`)
    console.log(`Warrior / level | ${nodes.map((node) => `N${node}`.padStart(6)).join(' ')}`)
    for (const warriorId of warriorIds) for (const level of levels) {
      const row = rows.filter((entry) => entry.warriorId === warriorId && entry.level === level)
      console.log(`${`${warriorId} / ${level}`.padEnd(15)} | ${row.map((entry) => `${entry.winRate}%`.padStart(6)).join(' ')}`)
    }
  }
} finally {
  await server.close()
}
