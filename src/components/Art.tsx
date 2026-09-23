import type { Appearance, EquipmentDefinition } from '../types'

export function EquipmentArt({ item, compact = false }: { item: EquipmentDefinition; compact?: boolean }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg className={`equipment-art ${compact ? 'compact' : ''}`} viewBox="0 0 160 130" role="img" aria-label={`Illustration — ${item.name}`}>
      <defs>
        <radialGradient id={`glow-${item.id}`}><stop stopColor="currentColor" stopOpacity=".32"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="65" r="58" fill={`url(#glow-${item.id})`}/>
      {item.art === 'club' && <><path {...common} strokeWidth="12" d="M55 108 92 36"/><path fill="currentColor" d="m78 46 17-28 28 20-17 29Z"/><path d="m91 28 8 12m7-15 2 18" stroke="#0d100e" strokeWidth="3"/></>}
      {['spear','mammoth'].includes(item.art) && <><path {...common} d="m43 112 69-89"/><path fill="currentColor" d="m101 30 24-18-8 29Z"/>{item.art === 'mammoth' && <path {...common} strokeWidth="3" d="M38 106c23 7 37 1 48-11"/>}</>}
      {item.art === 'axe' && <><path {...common} strokeWidth="7" d="m53 111 43-85"/><path fill="currentColor" d="M77 22q28-13 47 9-10 25-42 25Z"/></>}
      {item.art === 'bow' && <><path {...common} d="M55 19q80 46 1 94"/><path {...common} strokeWidth="2" d="m55 19 1 94m-1-46 72-2"/><path fill="currentColor" d="m128 65-17-8v16Z"/></>}
      {item.art === 'fangs' && <><path fill="currentColor" d="M42 24q20 44 16 86 28-21 25-77Zm48 5q23 43 17 81 31-25 25-75Z"/><path {...common} stroke="#111" strokeWidth="2" d="M55 40q14 25 12 48m38-45q13 21 10 43"/></>}
      {item.art === 'hammer' && <><path {...common} strokeWidth="11" d="m57 113 42-74"/><path fill="currentColor" d="m62 16 65 31-17 35-65-31Z"/><path stroke="#ffb24c" strokeWidth="4" d="m71 28 8 18 15-4 3 21 17 6"/></>}
      {item.art === 'claw' && <><path {...common} strokeWidth="8" d="M45 104q36-30 72-65"/><path fill="currentColor" d="M82 55q7-37 25-42 5 24-3 35 15-25 32-23-2 25-22 40Z"/></>}
      {item.art === 'heart' && <><path fill="currentColor" d="M80 116 28 62Q16 24 51 16q21-4 29 19 9-23 30-19 35 8 22 46Z"/><path {...common} stroke="#e5c7ff" strokeWidth="3" d="M43 60h23l10-24 12 50 10-26h21"/></>}
      {item.type === 'armor' && item.art !== 'titan' && <><path fill="currentColor" fillOpacity=".78" d="m48 28 32-13 32 13 17 25-20 15-5 46H56l-5-46-20-15Z"/><path {...common} strokeWidth="3" d="M80 17v94M48 31l18 28h28l18-28"/></>}
      {item.art === 'titan' && <><path fill="currentColor" d="m45 25 35-14 35 14 19 34-25 13-5 44H56l-5-44-25-13Z"/><path {...common} stroke="#c9a0ff" strokeWidth="3" d="m45 34 35 24 35-24M80 13v101"/><circle cx="80" cy="59" r="9" fill="#d9bcff"/></>}
    </svg>
  )
}

export function WarriorAvatar({ appearance, weapon, armor, enemy = false, className = '' }: { appearance: Appearance; weapon?: string; armor?: string; enemy?: boolean; className?: string }) {
  const skin = enemy ? '#82634f' : appearance.skin
  const hair = enemy ? '#201b17' : appearance.hairColor
  const armorColor = armor?.includes('titan') ? '#4b2d70' : armor?.includes('volcanic') ? '#7d2e22' : armor?.includes('mammoth') ? '#6a6253' : armor?.includes('bone') ? '#b9aa87' : '#5a3925'
  return (
    <svg className={`warrior ${className}`} viewBox="0 0 220 260" role="img" aria-label={enemy ? 'Adversaire' : 'Warrior'}>
      <ellipse cx="110" cy="238" rx="66" ry="12" fill="#000" opacity=".25"/>
      <g className="warrior-body">
        <path d="M70 123q40-30 80 0l10 75-50 22-50-22Z" fill={armorColor} stroke="#1a1712" strokeWidth="5"/>
        <path d="m68 136-28 38 17 12 31-34m64-16 28 38-17 12-31-34" fill={skin} stroke="#1a1712" strokeWidth="7" strokeLinecap="round"/>
        <path d="m83 205-8 34m62-34 8 34" stroke="#211b16" strokeWidth="22" strokeLinecap="round"/>
        <circle cx="110" cy="88" r="48" fill={skin} stroke="#1a1712" strokeWidth="5"/>
        {appearance.hair === 'Crête' && <path d="M76 57q31-51 70-18l-8 25q-28-15-62 5Z" fill={hair}/>} 
        {appearance.hair === 'Tresses' && <path d="M66 75q0-49 44-49t44 49l-14-14-8 48-15-44-13 46-17-46-10 39Z" fill={hair}/>} 
        {appearance.hair === 'Sauvage' && <path d="m63 71 8-38 20 9 16-25 17 23 25-10 6 43-20-15-23 4-26-7Z" fill={hair}/>} 
        <path d="M88 89h12m20 0h12" stroke="#211914" strokeWidth="6" strokeLinecap="round"/>
        <path d="M99 108q11 8 22 0" fill="none" stroke="#6d392d" strokeWidth="4" strokeLinecap="round"/>
        <path d="M72 132q38 26 76 0" fill="none" stroke="#d9b66e" strokeWidth="8" opacity=".7"/>
        <g className="held-weapon" transform="translate(146 122) rotate(12)">
          {weapon?.includes('bow') ? <><path d="M8 6q45 45 0 92" fill="none" stroke="#d7ae72" strokeWidth="6"/><path d="M8 6v92" stroke="#eee2c4" strokeWidth="2"/></> : weapon?.includes('hammer') ? <><path d="M11 19v91" stroke="#6c4931" strokeWidth="10"/><rect width="52" height="30" rx="5" fill="#a8422d" stroke="#2b1813" strokeWidth="5"/></> : <><path d="M11 14v99" stroke="#826144" strokeWidth="9"/><path d="m-3 23 15-23 16 24Z" fill={weapon?.includes('titan') ? '#9d66e8' : '#c5b59d'} stroke="#251d18" strokeWidth="4"/></>}
        </g>
      </g>
    </svg>
  )
}
