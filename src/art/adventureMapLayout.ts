export type AdventureNodeKind = 'standard' | 'elite' | 'boss'

export interface AdventureMapPoint {
  node: number
  x: number // 0–1, relative to the map overlay
  y: number // 0–1, relative to the map overlay
  kind?: AdventureNodeKind
}

export interface AdventureMapLayout {
  id: string
  points: readonly AdventureMapPoint[]
}

export const sharedMapAssets: Record<AdventureNodeKind, string> & { connector: string } = {
  standard: '/assets/maps/shared/level-node-standard.png',
  elite: '/assets/maps/shared/level-node-elite.png',
  boss: '/assets/maps/shared/level-node-boss.png',
  connector: '/assets/maps/shared/level-path-connector-horizontal.png',
}

/** The route follows the foreground, lake shores, cliffs and finally the volcano. */
export const primalMapLayout: AdventureMapLayout = {
  id: 'primal-valley',
  points: [
    { node: 1, x: .17, y: .86 },
    { node: 2, x: .34, y: .78 },
    { node: 3, x: .54, y: .84 },
    { node: 4, x: .70, y: .76 },
    { node: 5, x: .84, y: .84, kind: 'elite' },
    { node: 6, x: .86, y: .67 },
    { node: 7, x: .68, y: .61 },
    { node: 8, x: .51, y: .68 },
    { node: 9, x: .34, y: .60 },
    { node: 10, x: .19, y: .66, kind: 'elite' },
    { node: 11, x: .20, y: .51 },
    { node: 12, x: .37, y: .45 },
    { node: 13, x: .54, y: .52 },
    { node: 14, x: .72, y: .43 },
    { node: 15, x: .84, y: .50, kind: 'elite' },
    { node: 16, x: .80, y: .34 },
    { node: 17, x: .58, y: .37 },
    { node: 18, x: .45, y: .30 },
    { node: 19, x: .61, y: .22 },
    { node: 20, x: .79, y: .13, kind: 'boss' },
  ],
}
