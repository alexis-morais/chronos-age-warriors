declare module 'node:fs' {
  export function rmSync(path: URL, options: { recursive: boolean; force: boolean }): void
}
