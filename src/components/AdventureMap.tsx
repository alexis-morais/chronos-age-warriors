import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Check } from 'lucide-react'
import { sharedMapAssets } from '../art/adventureMapLayout'
import type { AdventureMapLayout, AdventureMapPoint, AdventureNodeKind } from '../art/adventureMapLayout'

type NodeState = 'current' | 'done' | 'locked'

export function AdventureNode({ point, state, disabled, onEnter }: {
  point: AdventureMapPoint
  state: NodeState
  disabled: boolean
  onEnter: (node: number) => void
}) {
  const kind: AdventureNodeKind = point.kind ?? 'standard'
  const kindName = kind === 'boss' ? 'Boss' : kind === 'elite' ? 'Combat élite' : 'Combat standard'
  const stateName = state === 'current' ? 'prochain combat' : state === 'done' ? 'terminé' : 'verrouillé'
  return <button type="button" className={`map-node kind-${kind} is-${state}`} style={{ '--x': `${point.x * 100}%`, '--y': `${point.y * 100}%` } as CSSProperties} aria-label={`Niveau ${point.node} · ${kindName} · ${stateName}`} title={`Niveau ${point.node} · ${kindName}`} disabled={disabled} onClick={() => onEnter(point.node)}>
    <img className="map-node-art" src={sharedMapAssets[kind]} alt="" draggable={false}/>
    <span className="map-node-number">{point.node}</span>
    {state === 'done' && <span className="map-node-check" aria-hidden="true"><Check/></span>}
  </button>
}

export function AdventurePath({ layout, width, height, defeatedNodes, currentNode }: {
  layout: AdventureMapLayout
  width: number
  height: number
  defeatedNodes: ReadonlySet<number>
  currentNode: number
}) {
  return <svg className="map-route-lines" viewBox={`0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`} aria-hidden="true">
    {layout.points.slice(1).map((point, index) => {
      const previous = layout.points[index]
      const dx = (point.x - previous.x) * width
      const dy = (point.y - previous.y) * height
      const length = Math.hypot(dx, dy)
      const angle = Math.atan2(dy, dx) * 180 / Math.PI
      const complete = defeatedNodes.has(previous.node) && (defeatedNodes.has(point.node) || point.node === currentNode)
      return <g key={point.node} className={complete ? 'route-complete' : 'route-future'} transform={`translate(${previous.x * width} ${previous.y * height}) rotate(${angle})`}>
        <line className="map-route-underlay" x1="0" y1="0" x2={length} y2="0"/>
        <image href={sharedMapAssets.connector} x="0" y="-12" width={length} height="24" preserveAspectRatio="none"/>
      </g>
    })}
  </svg>
}

export function AdventureMap({ layout, currentNode, defeatedNodes, canEnter, onEnter }: {
  layout: AdventureMapLayout
  currentNode: number
  defeatedNodes: readonly number[]
  canEnter: (node: number) => boolean
  onEnter: (node: number) => void
}) {
  const routeRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const route = routeRef.current
    if (!route) return
    const measure = () => {
      const { width, height } = route.getBoundingClientRect()
      setSize((before) => before.width === width && before.height === height ? before : { width, height })
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(route)
    return () => observer.disconnect()
  }, [])
  const done = new Set(defeatedNodes)
  return <>
    <div className="map-route" ref={routeRef} aria-label={`Parcours de la campagne, du niveau 1 au boss du niveau ${layout.points.length}`}>
      <AdventurePath layout={layout} width={size.width} height={size.height} defeatedNodes={done} currentNode={currentNode}/>
      {layout.points.map((point) => <AdventureNode key={point.node} point={point} state={done.has(point.node) ? 'done' : point.node === currentNode ? 'current' : 'locked'} disabled={!canEnter(point.node)} onEnter={onEnter}/>)}
    </div>
    <div className="map-legend" aria-label="Types de combats">{(['standard', 'elite', 'boss'] as const).map((kind) => <span key={kind}><img src={sharedMapAssets[kind]} alt=""/>{kind === 'standard' ? 'Standard' : kind === 'elite' ? 'Élite' : 'Boss'}</span>)}</div>
  </>
}
