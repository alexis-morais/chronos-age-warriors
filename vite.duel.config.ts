import { defineConfig } from 'vite'

// One compiled copy of the browser's canonical combat/reward modules for Deno Edge.
export default defineConfig({
  // Edge bundles contain executable code only; Vite must not copy the game's public/ tree.
  publicDir: false,
  build: {
    outDir: 'supabase/functions/duel',
    emptyOutDir: false,
    minify: 'oxc',
    lib: { entry: 'src/duelRules.ts', formats: ['es'], fileName: () => 'engine.js' },
  },
})
