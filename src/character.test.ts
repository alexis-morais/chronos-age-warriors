import { describe, expect, it } from 'vitest'
import { characterSexes, DEFAULT_APPEARANCE, hairColors, normalizeAppearance, skinTones, updateAppearance } from './character'
import { CREATION_CHARACTER_ROOT, canonicalizeCreationAppearance, resolveCanonicalCreationCharacter } from './art/creationCharacterAssets'
import { freshSave, loadSave, persistSave, SAVE_KEY } from './storage'

describe('character creation V1', () => {
  it('résout exhaustivement les 32 variantes canoniques', () => {
    const assets = new Set<string>()
    for (const { id: sex } of characterSexes) {
      for (const { id: skinTone } of skinTones) {
        for (const { id: hairColor } of hairColors) {
          const asset = resolveCanonicalCreationCharacter({ sex, hairStyle: 'style-02', skinTone, hairColor })
          const fileColor = hairColor.replace('hair-', '')
          expect(asset).toBe(`${CREATION_CHARACTER_ROOT}/${sex}/${skinTone}/${fileColor}.png`)
          expect(asset).not.toMatch(/01-bases|02-hair-overlays|06-runtime-normalized|07-final-variants|09-final-human-approved|selectors|hair-overlays/)
          assets.add(asset)
        }
      }
    }
    expect(assets).toHaveLength(32)
  })

  it('impose toujours Style 1 à l’homme, y compris pour les anciennes valeurs Style 2 et Style 3', () => {
    for (const hairStyle of ['style-01', 'style-02', 'style-03'] as const) {
      expect(resolveCanonicalCreationCharacter({ sex: 'male', hairStyle, skinTone: 'skin-01', hairColor: 'hair-red' }))
        .toBe(`${CREATION_CHARACTER_ROOT}/male/skin-01/red.png`)
    }
  })

  it('impose toujours Style 3 à la femme, y compris pour les anciennes valeurs Style 1 et Style 2', () => {
    for (const hairStyle of ['style-01', 'style-02', 'style-03'] as const) {
      expect(resolveCanonicalCreationCharacter({ sex: 'female', hairStyle, skinTone: 'skin-04', hairColor: 'hair-blond' }))
        .toBe(`${CREATION_CHARACTER_ROOT}/female/skin-04/blond.png`)
    }
  })

  it('change uniquement le nom de fichier lors du changement de couleur', () => {
    const brown = resolveCanonicalCreationCharacter({ sex: 'male', hairStyle: 'style-01', skinTone: 'skin-02', hairColor: 'hair-brown' })
    const black = resolveCanonicalCreationCharacter({ sex: 'male', hairStyle: 'style-03', skinTone: 'skin-02', hairColor: 'hair-black' })
    expect(brown).toBe(`${CREATION_CHARACTER_ROOT}/male/skin-02/brown.png`)
    expect(black).toBe(`${CREATION_CHARACTER_ROOT}/male/skin-02/black.png`)
  })

  it('change uniquement le dossier de teint lors du changement de carnation', () => {
    const light = resolveCanonicalCreationCharacter({ sex: 'female', hairStyle: 'style-01', skinTone: 'skin-01', hairColor: 'hair-red' })
    const dark = resolveCanonicalCreationCharacter({ sex: 'female', hairStyle: 'style-02', skinTone: 'skin-04', hairColor: 'hair-red' })
    expect(light).toBe(`${CREATION_CHARACTER_ROOT}/female/skin-01/red.png`)
    expect(dark).toBe(`${CREATION_CHARACTER_ROOT}/female/skin-04/red.png`)
  })

  it('canonicalise le champ historique sans modifier couleur ni teint', () => {
    expect(canonicalizeCreationAppearance({ sex: 'male', hairStyle: 'style-03', hairColor: 'hair-black', skinTone: 'skin-03' }))
      .toEqual({ sex: 'male', hairStyle: 'style-01', hairColor: 'hair-black', skinTone: 'skin-03' })
    expect(canonicalizeCreationAppearance({ sex: 'female', hairStyle: 'style-01', hairColor: 'hair-red', skinTone: 'skin-02' }))
      .toEqual({ sex: 'female', hairStyle: 'style-03', hairColor: 'hair-red', skinTone: 'skin-02' })
  })

  it('conserve les choix encore exposés lors de chaque modification', () => {
    const initial = { sex: 'male', hairStyle: 'style-01', hairColor: 'hair-black', skinTone: 'skin-03' } as const
    expect(updateAppearance(initial, { skinTone: 'skin-04' })).toEqual({ ...initial, skinTone: 'skin-04' })
    expect(updateAppearance(initial, { hairColor: 'hair-red' })).toEqual({ ...initial, hairColor: 'hair-red' })
    expect(updateAppearance(initial, { sex: 'female' })).toEqual({ ...initial, sex: 'female' })
  })

  it('normalise une apparence inconnue sans casser le schéma sauvegardé', () => {
    expect(normalizeAppearance(null)).toEqual(DEFAULT_APPEARANCE)
    expect(normalizeAppearance({ sex: 'female', hairStyle: 'style-03', hairColor: 'hair-red', skinTone: 'skin-04' })).toEqual({
      sex: 'female', hairStyle: 'style-03', hairColor: 'hair-red', skinTone: 'skin-04',
    })
  })

  it('accepte encore les identifiants historiques pour la compatibilité des sauvegardes', () => {
    expect(normalizeAppearance({ sex: 'female', hairStyle: 'style-02', hairColor: 'black', skinTone: 'skin-03' })).toEqual({
      sex: 'female', hairStyle: 'style-02', hairColor: 'hair-black', skinTone: 'skin-03',
    })
  })

  it('migre une sauvegarde V0.6 sans perdre sa progression', () => {
    const previous = freshSave(7) as unknown as Record<string, unknown>
    const warrior = previous.warrior as Record<string, unknown>
    warrior.name = 'Alya'
    warrior.appearance = { gender: 'Femme', hair: 'Tresses', hairColor: '#912b22', skin: '#673f31', beard: true }
    previous.coins = 777
    const storage = { getItem: (key: string) => key === SAVE_KEY ? JSON.stringify(previous) : null }
    const migrated = loadSave(storage)
    expect(migrated.warrior.name).toBe('Alya')
    expect(migrated.coins).toBe(777)
    expect(migrated.warrior.appearance).toEqual({ sex: 'female', hairStyle: 'style-03', hairColor: 'hair-red', skinTone: 'skin-04' })
  })

  it('persiste et recharge une ancienne coiffure mais le resolver l’ignore', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value) },
    }
    const save = freshSave(17)
    save.created = true
    save.coins = 913
    save.warrior.appearance = { sex: 'female', hairStyle: 'style-02', hairColor: 'hair-black', skinTone: 'skin-03' }
    persistSave(save, storage)
    const loaded = loadSave(storage)
    expect(loaded.warrior.appearance).toEqual(save.warrior.appearance)
    expect(resolveCanonicalCreationCharacter(loaded.warrior.appearance)).toContain('/characters/female/skin-03/black.png')
    expect(loaded.coins).toBe(913)
  })
})
