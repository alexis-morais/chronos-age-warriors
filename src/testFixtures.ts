import { grantWarrior } from './game'
import { freshSave } from './storage'

/** Historical career used by presentation tests; freshSave now begins unclaimed. */
export function establishedKargSave() {
  const save = grantWarrior(freshSave(), 'karg')
  save.welcomeChestOpened = true
  save.owned['flint-club'] = { quantity: 1, level: 1, xp: 0, kills: 0 }
  save.owned['hunter-hides'] = { quantity: 1, level: 1, xp: 0, kills: 0 }
  save.equippedWeapon = 'flint-club'
  save.equippedArmor = 'hunter-hides'
  save.loadouts.karg = { weapon: 'flint-club', armor: 'hunter-hides' }
  return save
}
