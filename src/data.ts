import type { EquipmentDefinition } from './types'

export const skills = [
  'Double Frappe', 'Frappe Dévastatrice', 'Précision', 'Brise-Armure', 'Rage',
  'Premier Sang', 'Saignement', 'Peau Dure', 'Parade', 'Riposte',
  'Second Souffle', 'Instinct de Survie', 'Endurci', 'Réflexes', 'Accélération',
  'Élan', 'Frein Temporel', 'Désarmement', 'Opportuniste', 'Vampirisme',
]

export const equipment: EquipmentDefinition[] = [
  { id: 'flint-club', name: 'Massue de silex', type: 'weapon', rarity: 'Commun', bonus: '+1 Force / niveau', effect: '5 % de chance de +20 % dégâts', art: 'club' },
  { id: 'bone-spear', name: 'Lance d’os', type: 'weapon', rarity: 'Commun', bonus: '+1 Vitesse / niveau', effect: 'Première attaque +10 %', art: 'spear' },
  { id: 'obsidian-axe', name: 'Hache d’obsidienne', type: 'weapon', rarity: 'Peu commun', bonus: '+1 Force et +5 PV / niveau', effect: '6 % de chance de saignement', art: 'axe' },
  { id: 'hunter-bow', name: 'Arc du chasseur', type: 'weapon', rarity: 'Peu commun', bonus: '+1 Vitesse et +5 PV / niveau', effect: 'Réduit légèrement l’Esquive adverse', art: 'bow' },
  { id: 'smilodon-fangs', name: 'Crocs du Smilodon', type: 'weapon', rarity: 'Rare', bonus: '+1 Force et +1 Vitesse / niveau', effect: '8 % de chance d’un second coup à 50 %', art: 'fangs' },
  { id: 'mammoth-spear', name: 'Lance du Mammouth ancestral', type: 'weapon', rarity: 'Rare', bonus: '+1 Force et +10 PV / niveau', effect: '10 % de chance d’ignorer la protection', art: 'mammoth' },
  { id: 'volcanic-hammer', name: 'Marteau volcanique', type: 'weapon', rarity: 'Épique', bonus: '+2 Force et +5 PV / niveau', effect: '10 % de chance de brûlure', art: 'hammer' },
  { id: 'tyrant-claw', name: 'Griffe du Tyran', type: 'weapon', rarity: 'Légendaire', bonus: '+2 Force et +1 Vitesse / niveau', effect: '12 % de chance de +50 % dégâts', art: 'claw' },
  { id: 'titan-heart', name: 'Cœur du Titan Primordial', type: 'weapon', rarity: 'Mythique', bonus: '+2 Force, +1 Vitesse et +5 PV / niveau', effect: '7 % de chance de +80 % dégâts', art: 'heart' },
  { id: 'hunter-hides', name: 'Peaux du chasseur', type: 'armor', rarity: 'Commun', bonus: '+10 PV / niveau', effect: 'Première attaque reçue −5 %', art: 'hide' },
  { id: 'bone-harness', name: 'Harnais d’os', type: 'armor', rarity: 'Peu commun', bonus: '+5 PV et +1 Force / niveau', effect: '5 % de chance de réduire une attaque de 25 %', art: 'bones' },
  { id: 'mammoth-plate', name: 'Cuirasse du Mammouth ancestral', type: 'armor', rarity: 'Rare', bonus: '+10 PV et +1 Force / niveau', effect: 'Critiques supplémentaires réduits de 20 %', art: 'plate' },
  { id: 'volcanic-shell', name: 'Carapace volcanique', type: 'armor', rarity: 'Épique', bonus: '+15 PV et +1 Force / niveau', effect: 'Peut brûler l’attaquant', art: 'shell' },
  { id: 'white-titan-fur', name: 'Fourrure du Titan blanc', type: 'armor', rarity: 'Légendaire', bonus: '+20 PV et +1 Force / niveau', effect: 'Au-dessus de 50 % PV : −8 % dégâts reçus', art: 'fur' },
  { id: 'primordial-titan-skin', name: 'Peau du Titan primordial', type: 'armor', rarity: 'Mythique', bonus: '+25 PV et +1 Esquive / niveau', effect: 'Les 3 premières attaques reçues font −20 % dégâts', art: 'titan' },
]

export const badges = [
  ['first-win', 'Premier impact', 'Première victoire'], ['first-rare', 'Éclat azur', 'Première arme Rare'],
  ['first-epic', 'Faveur violette', 'Premier Épique'], ['first-legendary', 'Légende naissante', 'Premier Légendaire'],
  ['first-mythic', 'Cosmos éveillé', 'Premier Mythique'], ['training-10', 'Endurant', '10 victoires Entraînement'],
  ['training-50', 'Infatigable', '50 victoires Entraînement'], ['gear-3', 'Forgeron', 'Équipement niveau 3'],
  ['gear-5', 'Maître-forgeron', 'Équipement niveau 5'], ['first-elite', 'Briseur d’Élite', 'Première Élite'],
  ['boss', 'Maître du Primordial', 'Boss Primordial vaincu'],
] as const

export const enemies = [
  'Ramasseur des brumes', 'Chasseur de cornes', 'Veilleuse des fougères', 'Pilleur de silex', 'Brak le Colossal',
  'Traqueur des marais', 'Dompteuse de raptors', 'Gardien des os', 'Éclaireur du volcan', 'Ura la Balafrée',
  'Briseur de défenses', 'Prêtresse du feu', 'Fils du Smilodon', 'Sentinelle noire', 'Korga Croc-de-Fer',
  'Champion des cendres', 'Champion du tonnerre', 'Champion des abysses', 'Champion du Titan', 'Morgath, Roi Primordial',
]
