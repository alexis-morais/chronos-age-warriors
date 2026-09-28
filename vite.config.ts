import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { readdirSync, rmSync } from 'node:fs'

const nonRuntimePublicAssets = [
  'art-direction',
  'chronos-v1-creation-canonical-pack/references',
  'chronos-v1-creation-canonical-pack/contact-sheets',
  'chronos-v1-creation-canonical-pack/scripts',
  'chronos-v1-creation-canonical-pack/README-INTEGRATION.md',
  'chronos-v1-creation-canonical-pack/PROMPT-CODEX-V1-CREATION-FINAL.txt',
  'chronos-v1-creation-canonical-pack/manifest.json',
  'assets-v05',
  'assets-v06/source', 'assets-v06/source-clean', 'assets-v06/source-v06', 'assets-v06/qa',
  'assets-v06/customization',
  'assets-v06/player',
  '.DS_Store',
  'assets-v04/reference', 'assets-v04/weapons', 'assets-v04/effects', 'assets-v04/ui',
  'assets-v04/armors', 'assets-v04/customization', 'assets-v04/warriors', 'assets-v04/arena',
  'assets-v04/derived/warriors', 'assets-v04/derived/effects', 'assets-v04/README-ASSETS.txt',
]

const pruneNonRuntimeAssets = {
  name: 'prune-non-runtime-assets',
  apply: 'build' as const,
  writeBundle() {
    for (const asset of nonRuntimePublicAssets) rmSync(new URL(`dist/${asset}`, import.meta.url), { recursive: true, force: true })
    const pruneNumberedCopies = (directory: URL) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const target = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory)
        if (entry.isDirectory()) pruneNumberedCopies(target)
        else if (/ \d+\.png$/i.test(entry.name)) rmSync(target, { recursive: false, force: true })
      }
    }
    pruneNumberedCopies(new URL('dist/chronos-v1-creation-canonical-pack/characters/', import.meta.url))
  },
}

export default defineConfig({
  plugins: [react(), pruneNonRuntimeAssets],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
