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
  'assets/sprites/ennemies/primal/.DS_Store',
  // The supplied sheets and first-pass exports stay in public as immutable
  // sources. Ship isolated atlases, except three already-clean transparent
  // Smilodon exports retained directly by the runtime registry.
  ...['cave-brute','tribal-warrior','tribal-hunter','raptor','shaman','smilodon','mammoth']
    .flatMap((id) => ['idle','run','anticipation','attack','attack-fx','dodge','block','hit','ko']
      .map((pose) => `assets/sprites/ennemies/primal/${id}/${pose}.png`)),
  ...['idle','run','anticipation','attack','attack-fx','dodge','block','hit','ko']
    .filter((pose) => !['idle','anticipation','block'].includes(pose))
    .map((pose) => `assets/sprites/ennemies/primal/smilodon/${pose}-runtime.png`),
  ...['tribal-warrior','tribal-hunter','raptor'].map((id) => `assets/sprites/ennemies/primal/${id}/attack-runtime.png`),
  ...['cave-brute','tribal-warrior','tribal-hunter','raptor','shaman','smilodon','mammoth']
    .map((id) => `assets/sprites/ennemies/primal/${id}/base 3.png`),
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
