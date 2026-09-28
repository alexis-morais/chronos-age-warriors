import type { Appearance, CharacterSex, HairColor, HairStyle, SkinTone } from '../types'

export const CREATION_ASSET_ROOT = '/chronos-v1-creation-canonical-pack'
export const CREATION_CHARACTER_ROOT = `${CREATION_ASSET_ROOT}/characters`
export const CREATION_FINAL_SIZE = { width: 512, height: 512 } as const
export const CANONICAL_HAIR_STYLE_BY_SEX: Record<CharacterSex, HairStyle> = {
  male: 'style-01',
  female: 'style-03',
}

const hairColorFile: Record<HairColor, 'brown' | 'black' | 'blond' | 'red'> = {
  'hair-brown': 'brown',
  'hair-black': 'black',
  'hair-blond': 'blond',
  'hair-red': 'red',
}

export function canonicalizeCreationAppearance(appearance: Appearance): Appearance {
  return { ...appearance, hairStyle: CANONICAL_HAIR_STYLE_BY_SEX[appearance.sex] }
}

export function resolveCanonicalCreationCharacter({ sex, skinTone, hairColor }: Appearance) {
  return `${CREATION_CHARACTER_ROOT}/${sex}/${skinTone}/${hairColorFile[hairColor]}.png`
}

function preloadAsset(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image()
    image.onload = image.onerror = () => resolve()
    image.src = src
  })
}

export function getCreationPreloadAssets(appearance: Appearance) {
  const canonical = canonicalizeCreationAppearance(appearance)
  const assets = new Set<string>([resolveCanonicalCreationCharacter(canonical)])

  for (const hairColor of Object.keys(hairColorFile) as HairColor[]) {
    assets.add(resolveCanonicalCreationCharacter({ ...canonical, hairColor }))
  }
  for (const skinTone of ['skin-01', 'skin-02', 'skin-03', 'skin-04'] as SkinTone[]) {
    assets.add(resolveCanonicalCreationCharacter({ ...canonical, skinTone }))
  }
  const otherSex: CharacterSex = canonical.sex === 'male' ? 'female' : 'male'
  assets.add(resolveCanonicalCreationCharacter({ ...canonical, sex: otherSex }))

  return [...assets]
}

export function preloadCreationChoices(appearance: Appearance) {
  return Promise.all(getCreationPreloadAssets(appearance).map(preloadAsset))
}
