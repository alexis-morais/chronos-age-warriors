import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { rmSync } from 'node:fs'

const nonRuntimePublicAssets = [
  'art-direction',
  'assets-v06/source', 'assets-v06/source-clean', 'assets-v06/source-v06', 'assets-v06/qa',
  '.DS_Store',
  'assets-v04/reference', 'assets-v04/weapons', 'assets-v04/effects', 'assets-v04/ui',
  'assets-v04/armors', 'assets-v04/arena',
  'assets-v04/derived/effects', 'assets-v04/README-ASSETS.txt',
]

const pruneNonRuntimeAssets = {
  name: 'prune-non-runtime-assets',
  apply: 'build' as const,
  writeBundle() {
    for (const asset of nonRuntimePublicAssets) rmSync(new URL(`dist/${asset}`, import.meta.url), { recursive: true, force: true })
  },
}

export default defineConfig({
  plugins: [react(), pruneNonRuntimeAssets],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
