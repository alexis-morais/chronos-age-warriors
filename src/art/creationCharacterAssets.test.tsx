import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { CharacterPreview } from '../components/Art'
import { CREATION_CHARACTER_ROOT, getCreationPreloadAssets, resolveCanonicalCreationCharacter } from './creationCharacterAssets'

describe('CharacterPreview final precomposed variants', () => {
  beforeEach(() => {
    localStorage.clear()
    window.scrollTo = () => undefined
    window.history.replaceState({}, '', '/?qaCreated&qaCreation')
  })

  afterEach(() => window.history.replaceState({}, '', '/'))

  it('rend exactement une image de personnage aplatie', () => {
    const appearance = { sex: 'female', hairStyle: 'style-01', hairColor: 'hair-red', skinTone: 'skin-04' } as const
    const { container } = render(<CharacterPreview appearance={appearance}/>)
    const images = container.querySelectorAll('.character-preview-v07-stack > img')

    expect(images).toHaveLength(1)
    expect(images[0].classList.contains('character-preview-v07-image')).toBe(true)
    expect(images[0].getAttribute('src')).toBe(`${CREATION_CHARACTER_ROOT}/female/skin-04/red.png`)
    expect(images[0].getAttribute('style')).toBeNull()
  })

  it('ignore toute ancienne coiffure dans le resolver', () => {
    expect(resolveCanonicalCreationCharacter({ sex: 'male', hairStyle: 'style-03', hairColor: 'hair-red', skinTone: 'skin-01' }))
      .toBe(`${CREATION_CHARACTER_ROOT}/male/skin-01/red.png`)
    expect(resolveCanonicalCreationCharacter({ sex: 'female', hairStyle: 'style-01', hairColor: 'hair-red', skinTone: 'skin-01' }))
      .toBe(`${CREATION_CHARACTER_ROOT}/female/skin-01/red.png`)
  })

  it('précharge uniquement les variantes canoniques utiles, sans selector ni overlay', () => {
    const assets = getCreationPreloadAssets({ sex: 'male', hairStyle: 'style-02', hairColor: 'hair-black', skinTone: 'skin-02' })
    expect(assets).toHaveLength(8)
    expect(assets.every((asset) => asset.includes('/characters/male/') || asset.includes('/characters/female/'))).toBe(true)
    expect(assets.every((asset) => asset.startsWith('/chronos-v1-creation-canonical-pack/characters/'))).toBe(true)
    expect(assets.every((asset) => !asset.includes('/selectors/') && !asset.includes('/hair-overlays/') && !asset.includes('chronos-perfect-creation-assets-v4'))).toBe(true)
  })

  it('ne présente aucun choix de coiffure dans la création normale', () => {
    const { container } = render(<App/>)
    expect(screen.queryByText('Coiffure')).toBeNull()
    expect(screen.queryByText(/^Style [123]$/)).toBeNull()
    expect(container.querySelector('.creation-v07-hair-grid')).toBeNull()
    expect([...container.querySelectorAll('img')].every((image) => !image.src.includes('/selectors/') && !image.src.includes('/hair-overlays/'))).toBe(true)
    expect(screen.getByText('Couleur des cheveux')).toBeTruthy()
    expect(screen.getByText('Teint')).toBeTruthy()
  })
})
