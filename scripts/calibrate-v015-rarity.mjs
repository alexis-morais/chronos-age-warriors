// Candidate stats only: does not edit runtime, saves, artwork or backend.
import { createServer } from 'vite'
import { mkdirSync, writeFileSync } from 'node:fs'
const server = await createServer({ server: { middlewareMode: true, ws: false, watch: null }, appType: 'custom', logLevel: 'error' })
try {
  const game = await server.ssrLoadModule('/src/game.ts'), roster = await server.ssrLoadModule('/src/warriors.ts')
  const rows = [], commons = roster.primalWarriors.filter(w => w.rarity === 'Commun')
  const fighter = (id, level, stats, weapon = '', armor = '') => ({ name: id, warriorId: id, level, stats, skills: [], weapon, armor })
  for (const [rarity, target] of [['Épique',30],['Légendaire',15],['Mythique',7.5]]) {
    const group = roster.primalWarriors.filter(w => w.rarity === rarity)
    let chosen
    for (let factor = 1; factor <= 1.8; factor += .05) {
      let wins = 0, battles = 0
      const stats = Object.fromEntries(group.map(w => {
        const s = game.getEffectiveWarriorStats(w.id,10)
        return [w.id,{ ...s, strength: Math.round(s.strength*factor), hp: Math.round(s.hp*factor) }]
      }))
      for (const common of commons) for (const w of group) for (let i=0;i<1000;i++) {
        wins += game.simulateBattle(fighter(common.id,10,game.getEffectiveWarriorStats(common.id,10)),fighter(w.id,5,stats[w.id]),4190001+i*97).winner==='player'
        battles++
      }
      const rate=wins/battles*100
      if (!chosen || Math.abs(rate-target)<Math.abs(chosen.rate-target)) chosen={factor:+factor.toFixed(2),rate,stats}
    }
    const normalBoss=game.generateEnemy(1,20,()=>.5)
    const pve=[]
    for(const w of group) {
      const equipped=game.getEffectiveWarriorStats(w.id,9,'titan-heart','primordial-titan-skin'),bare=game.getEffectiveWarriorStats(w.id,9)
      // Smallest monotonic N9 compatible with this N5 candidate; no extra growth assumed.
      const stats=Object.fromEntries(Object.keys(bare).map(k=>[k,Math.max(bare[k],chosen.stats[w.id][k])+equipped[k]-bare[k]]))
      let wins=0;for(let i=0;i<1000;i++)wins+=game.simulateBattle(fighter(w.id,9,stats,'titan-heart','primordial-titan-skin'),normalBoss,733001+i*97).winner==='player'
      pve.push({warrior:w.id,minimumN9Stats:stats,normalBossN9WinRate:wins/10})
    }
    rows.push({rarity,target,chosen,pve})
  }
  mkdirSync('qa-output',{recursive:true});writeFileSync('qa-output/v015-rarity-constraint-probe.json',JSON.stringify(rows,null,2))
  console.log(JSON.stringify(rows,null,2))
} finally { await server.close() }
