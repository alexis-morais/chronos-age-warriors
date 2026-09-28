import type { Appearance, CharacterSex, HairColor, HairStyle, SkinTone } from './types'

export const characterSexes: { id: CharacterSex; label: string }[] = [
  { id: 'male', label: 'Homme' },
  { id: 'female', label: 'Femme' },
]

const hairStyleIds: HairStyle[] = ['style-01', 'style-02', 'style-03']

export const hairColors: { id: HairColor; label: string; hex: string }[] = [
  { id: 'hair-brown', label: 'Brun', hex: '#3B241C' },
  { id: 'hair-black', label: 'Noir', hex: '#1C1A19' },
  { id: 'hair-blond', label: 'Blond', hex: '#C99949' },
  { id: 'hair-red', label: 'Rouge', hex: '#9D3026' },
]

export const skinTones: { id: SkinTone; label: string; hex: string }[] = [
  { id: 'skin-01', label: 'Clair', hex: '#F1C3A0' },
  { id: 'skin-02', label: 'Doré', hex: '#D79568' },
  { id: 'skin-03', label: 'Brun', hex: '#A96845' },
  { id: 'skin-04', label: 'Foncé', hex: '#704734' },
]

export const DEFAULT_APPEARANCE: Appearance = {
  sex: 'male', hairStyle: 'style-01', hairColor: 'hair-brown', skinTone: 'skin-02',
}

const isOneOf = <T extends string>(value: unknown, options: readonly T[]): value is T => typeof value === 'string' && options.includes(value as T)

function closestPaletteId<T extends string>(value: unknown, palette: { id: T; hex: string }[], fallback: T): T {
  if (isOneOf(value, palette.map(({ id }) => id))) return value
  if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value)) return fallback
  const rgb = (hex: string) => [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16))
  const target = rgb(value)
  return palette.reduce((best, option) => {
    const color = rgb(option.hex)
    const distance = color.reduce((sum, channel, index) => sum + (channel - target[index]) ** 2, 0)
    return distance < best.distance ? { id: option.id, distance } : best
  }, { id: fallback, distance: Number.POSITIVE_INFINITY }).id
}

export function normalizeAppearance(value: unknown): Appearance {
  const raw = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const sexIds = characterSexes.map(({ id }) => id)
  const legacyHair: Record<string, HairStyle> = { 'Crête': 'style-01', Sauvage: 'style-02', Tresses: 'style-03' }
  const legacyHairColor: Record<string, HairColor> = { brown: 'hair-brown', black: 'hair-black', blond: 'hair-blond', red: 'hair-red' }
  return {
    sex: isOneOf(raw.sex, sexIds) ? raw.sex : raw.gender === 'Femme' ? 'female' : 'male',
    hairStyle: isOneOf(raw.hairStyle, hairStyleIds) ? raw.hairStyle : legacyHair[String(raw.hair)] ?? DEFAULT_APPEARANCE.hairStyle,
    hairColor: legacyHairColor[String(raw.hairColor)] ?? closestPaletteId(raw.hairColor, hairColors, DEFAULT_APPEARANCE.hairColor),
    skinTone: closestPaletteId(raw.skinTone ?? raw.skin, skinTones, DEFAULT_APPEARANCE.skinTone),
  }
}

export function sexLabel(sex: CharacterSex) {
  return characterSexes.find((option) => option.id === sex)?.label ?? 'Warrior'
}

export function updateAppearance(appearance: Appearance, change: Partial<Appearance>): Appearance {
  return { ...appearance, ...change }
}
