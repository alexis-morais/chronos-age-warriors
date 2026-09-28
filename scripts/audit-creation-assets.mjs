import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { inflateSync } from 'node:zlib'

const packRoot = resolve('public/chronos-v1-creation-canonical-pack')
const characterRoot = resolve(packRoot, 'characters')
const sexes = ['male', 'female']
const colors = ['brown', 'black', 'blond', 'red']
const skins = ['skin-01', 'skin-02', 'skin-03', 'skin-04']
const failures = []
const verified = { male: 0, female: 0 }

function listPngFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const child = resolve(directory, entry.name)
    return entry.isDirectory() ? listPngFiles(child) : entry.name.toLowerCase().endsWith('.png') ? [child] : []
  })
}

function paeth(left, up, upperLeft) {
  const estimate = left + up - upperLeft
  const leftDistance = Math.abs(estimate - left)
  const upDistance = Math.abs(estimate - up)
  const upperLeftDistance = Math.abs(estimate - upperLeft)
  return leftDistance <= upDistance && leftDistance <= upperLeftDistance ? left : upDistance <= upperLeftDistance ? up : upperLeft
}

function inspectAlpha(png, width, height) {
  const idat = []
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset)
    const type = png.subarray(offset + 4, offset + 8).toString('ascii')
    if (type === 'IDAT') idat.push(png.subarray(offset + 8, offset + 8 + length))
    offset += length + 12
  }
  const raw = inflateSync(Buffer.concat(idat))
  const stride = width * 4
  const previous = Buffer.alloc(stride)
  let opaquePixels = 0
  let transparentPixels = 0
  for (let row = 0, offset = 0; row < height; row += 1) {
    const filter = raw[offset]
    const current = Buffer.alloc(stride)
    offset += 1
    for (let column = 0; column < stride; column += 1) {
      const source = raw[offset + column]
      const left = column >= 4 ? current[column - 4] : 0
      const up = previous[column]
      const upperLeft = column >= 4 ? previous[column - 4] : 0
      current[column] = (source + (filter === 1 ? left : filter === 2 ? up : filter === 3 ? Math.floor((left + up) / 2) : filter === 4 ? paeth(left, up, upperLeft) : 0)) & 255
    }
    for (let alpha = 3; alpha < stride; alpha += 4) {
      if (current[alpha] > 0) opaquePixels += 1
      if (current[alpha] < 255) transparentPixels += 1
    }
    current.copy(previous)
    offset += stride
  }
  return { opaquePixels, transparentPixels }
}

const manifest = JSON.parse(readFileSync(resolve(packRoot, 'manifest.json'), 'utf8'))
const manifestAssets = new Map((manifest.assets ?? []).map((asset) => [asset.path, asset]))
const expectedPaths = new Set()

for (const sex of sexes) {
  for (const skin of skins) {
    for (const color of colors) {
      const relativePath = `characters/${sex}/${skin}/${color}.png`
      const absolutePath = resolve(packRoot, relativePath)
      expectedPaths.add(relativePath)
      if (!existsSync(absolutePath)) {
        failures.push(`missing:${relativePath}`)
        continue
      }
      const png = readFileSync(absolutePath)
      if (statSync(absolutePath).size < 33 || png.subarray(1, 4).toString() !== 'PNG') {
        failures.push(`invalid-png:${relativePath}`)
        continue
      }
      const width = png.readUInt32BE(16)
      const height = png.readUInt32BE(20)
      const bitDepth = png[24]
      const colorType = png[25]
      if (width !== 512 || height !== 512) failures.push(`dimensions:${relativePath}:${width}x${height}`)
      if (bitDepth !== 8 || colorType !== 6) failures.push(`not-rgba8:${relativePath}:depth-${bitDepth}:type-${colorType}`)
      if (colorType === 6) {
        const alpha = inspectAlpha(png, width, height)
        if (!alpha.opaquePixels || !alpha.transparentPixels) failures.push(`invalid-alpha:${relativePath}`)
      }
      const manifestAsset = manifestAssets.get(relativePath)
      if (!manifestAsset) failures.push(`manifest-missing:${relativePath}`)
      else if (createHash('sha256').update(png).digest('hex') !== manifestAsset.sha256) failures.push(`checksum:${relativePath}`)
      verified[sex] += 1
    }
  }
}

const runtimeFiles = listPngFiles(characterRoot).map((file) => relative(packRoot, file))
if (runtimeFiles.length !== 32) failures.push(`runtime-file-count:${runtimeFiles.length}`)
for (const file of runtimeFiles) if (!expectedPaths.has(file)) failures.push(`unexpected-runtime-file:${file}`)
if (manifestAssets.size !== 32) failures.push(`manifest-count:${manifestAssets.size}`)

if (failures.length) {
  console.error(`Creation asset audit failed:\n${failures.join('\n')}`)
  process.exitCode = 1
} else {
  console.log(`Creation asset audit passed: male ${verified.male}/16, female ${verified.female}/16, total ${runtimeFiles.length}/32; 512x512 RGBA with non-empty transparent alpha; checksums valid.`)
}
