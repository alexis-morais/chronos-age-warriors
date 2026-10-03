/** Reproducible PvE matrix using the game's real generation and combat engine.
 * Run: node scripts/simulate-primal-balance.mjs --trials=200 --gear=common
 * Optional: --nodes=1,5,10,15,16,17,18,19,20 --levels=1,3,5,7,9,10 --warriors=karg,naya
 */
import { createServer } from 'vite'

const option = (name, fallback) => process.argv.find((argument) => argument.startsWith(`--${name}=`))?.split('=')[1] ?? fallback
const numbers = (name, fallback) => option(name, fallback).split(',').map(Number)
const trials = Math.max(1, Math.trunc(Number(option('trials', '100'))))
const nodes = numbers('nodes', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20')
const levels = numbers('levels', '1,3,5,7,9,10')
const gear = option('gear', 'none')
const server = await createServer({ server: { middlewareMode: true, ws: false, watch: null }, appType: 'custom', logLevel: 'error' })

try {
  const { generateEnemy, seededRng, simulateBattle, equipmentStats } = await server.ssrLoadModule('/src/game.ts')
  const { campaignNodeTier } = await server.ssrLoadModule('/src/campaignProgression.ts')
  const { getWarriorLevelStats } = await server.ssrLoadModule('/src/warriorProgression.ts')
  const { primalWarriors } = await server.ssrLoadModule('/src/warriors.ts')
  const warriorIds = option('warriors', primalWarriors.map(({ id }) => id).join(',')).split(',')
  const equipment = gear === 'common' ? ['flint-club', 'hunter-hides'] : gear === 'none' ? [] : gear.split(',')
  const rows = []
  for (const warriorId of warriorIds) for (const level of levels) for (const node of nodes) {
    const stats = getWarriorLevelStats(warriorId, level)
    const player = { name: warriorId, warriorId, level, stats: { ...stats }, skills: [] }
    for (const id of equipment) for (const [stat, value] of Object.entries(equipmentStats(id))) player.stats[stat] += value
    player.weapon = equipment.find((id) => ['flint-club', 'bone-spear', 'obsidian-axe', 'hunter-bow', 'smilodon-fangs', 'mammoth-spear', 'volcanic-hammer', 'tyrant-claw', 'titan-heart'].includes(id))
    player.armor = equipment.find((id) => ['hunter-hides', 'bone-harness', 'mammoth-plate', 'volcanic-shell', 'white-titan-fur', 'primordial-titan-skin'].includes(id))
    let wins = 0, attacks = 0, oneshots = 0
    for (let sample = 0; sample < trials; sample++) {
      const key = node * 1000003 + sample * 97 + level * 7919
      const enemy = generateEnemy(campaignNodeTier(node), node, seededRng(key))
      const result = simulateBattle(player, enemy, key ^ 0x5f3759df)
      if (result.winner === 'player') wins++
      attacks += result.events.filter((event) => event.type === 'attack' && event.label !== 'Coup supplémentaire').length
      if (result.events.find((event) => event.type === 'damage' && event.target === 'enemy')?.enemyHp === 0) oneshots++
    }
    rows.push({ warriorId, level, node, tier: campaignNodeTier(node), gear, trials, winRate: Math.round(100 * wins / trials), meanActions: Math.round(attacks / trials * 10) / 10, oneShotRate: Math.round(100 * oneshots / trials) })
  }
  if (option('format', 'summary') === 'json') console.log(JSON.stringify(rows, null, 2))
  else if (option('format', 'summary') === 'warriors') {
    console.log('Warrior | Level | Node | Win % | Mean actions | One-shot %')
    for (const row of rows) console.log(`${row.warriorId.padEnd(7)} | ${String(row.level).padStart(5)} | ${String(row.node).padStart(4)} | ${String(row.winRate).padStart(5)} | ${String(row.meanActions).padStart(12)} | ${String(row.oneShotRate).padStart(10)}`)
  }
  else if (option('format', 'summary') === 'enemy') {
    console.log('Node | Tier | Strength | Dodge | Speed | HP | Enemy')
    for (const node of nodes) {
      const enemy = generateEnemy(campaignNodeTier(node), node, () => .5)
      console.log(`${String(node).padStart(4)} | ${String(campaignNodeTier(node)).padStart(4)} | ${String(enemy.stats.strength).padStart(8)} | ${String(enemy.stats.dodge).padStart(5)} | ${String(enemy.stats.speed).padStart(5)} | ${String(enemy.stats.hp).padStart(3)} | ${enemy.name}`)
    }
  } else {
    console.log(`Gear=${gear}, trials=${trials}, warriors=${warriorIds.length}`)
    console.log('Level | Node | Tier | Win % | Mean actions | One-shot %')
    for (const level of levels) for (const node of nodes) {
      const group = rows.filter((row) => row.level === level && row.node === node)
      const mean = (key) => Math.round(group.reduce((sum, row) => sum + row[key], 0) / group.length)
      console.log(`${String(level).padStart(5)} | ${String(node).padStart(4)} | ${String(campaignNodeTier(node)).padStart(4)} | ${String(mean('winRate')).padStart(5)} | ${String(mean('meanActions')).padStart(12)} | ${String(mean('oneShotRate')).padStart(10)}`)
    }
  }
} finally {
  await server.close()
}
