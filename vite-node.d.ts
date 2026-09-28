declare module 'node:fs' {
  interface Dirent {
    name: string
    isDirectory(): boolean
  }

  export function readdirSync(path: URL, options: { withFileTypes: true }): Dirent[]
  export function rmSync(path: URL, options: { recursive: boolean; force: boolean }): void
}
