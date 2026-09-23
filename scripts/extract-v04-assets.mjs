import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const bundledPython = resolve(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3')
const python = process.env.PYTHON || (existsSync(bundledPython) ? bundledPython : 'python3')
const result = spawnSync(python, [resolve(root, 'scripts/extract-v04-assets.py')], { cwd: root, stdio: 'inherit' })
if (result.status !== 0) process.exit(result.status ?? 1)
