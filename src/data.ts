import type { EquipmentDefinition } from './types'

export const skills = [
  'Double Frappe', 'Frappe Dévastatrice', 'Précision', 'Brise-Armure', 'Rage',
  'Premier Sang', 'Saignement', 'Peau Dure', 'Parade', 'Riposte',
  'Second Souffle', 'Instinct de Survie', 'Endurci', 'Réflexes', 'Accélération',
  'Élan', 'Frein Temporel', 'Désarmement', 'Opportuniste', 'Vampirisme',
]

export const skillDescriptions: Record<string, string> = {
  'Double Frappe': 'Peut enchaîner une seconde attaque.', 'Frappe Dévastatrice': 'Peut déclencher un coup nettement plus puissant.',
  'Précision': 'Réduit les chances d’esquive adverses.', 'Brise-Armure': 'Contourne une partie des protections.',
  'Rage': 'Augmente les dégâts quand les PV diminuent.', 'Premier Sang': 'Renforce la première attaque du combat.',
  'Saignement': 'Peut infliger des dégâts persistants.', 'Peau Dure': 'Réduit les dégâts directs reçus.',
  'Parade': 'Peut fortement amortir une attaque.', 'Riposte': 'Peut répondre après une attaque subie.',
  'Second Souffle': 'Évite une première mise K.O. et restaure des PV.', 'Instinct de Survie': 'Renforce la défense à faibles PV.',
  'Endurci': 'Améliore la résistance aux effets prolongés.', 'Réflexes': 'Accroît les chances d’éviter une attaque.',
  'Accélération': 'Augmente la fréquence des actions.', 'Élan': 'Augmente légèrement les chances de critique.',
  'Frein Temporel': 'Peut ralentir brièvement l’adversaire.', 'Désarmement': 'Peut atténuer le prochain coup adverse.',
  'Opportuniste': 'Augmente les dégâts contre une cible affaiblie.', 'Vampirisme': 'Rend une part des dégâts infligés sous forme de PV.',
}

export const equipment: EquipmentDefinition[] = [
  { id: 'flint-club', name: 'Massue de silex', type: 'weapon', rarity: 'Commun', stats: { strength: 3 }, bonus: '+3 Force', effect: '5 % : +20 % dégâts', art: 'club' },
  { id: 'bone-spear', name: 'Lance d’os', type: 'weapon', rarity: 'Commun', stats: { strength: 1, speed: 4 }, bonus: '+1 Force · +4 Vitesse', effect: 'Premier coup : +10 % dégâts', art: 'spear' },
  { id: 'obsidian-axe', name: 'Hache d’obsidienne', type: 'weapon', rarity: 'Peu commun', stats: { strength: 7, hp: 20 }, bonus: '+7 Force · +20 PV', effect: '6 % : saignement, 3 dégâts ×2', art: 'axe' },
  { id: 'hunter-bow', name: 'Arc du chasseur', type: 'weapon', rarity: 'Peu commun', stats: { strength: 4, speed: 8 }, bonus: '+4 Force · +8 Vitesse', effect: 'Esquive adverse : −3 points', art: 'bow' },
  { id: 'smilodon-fangs', name: 'Crocs du Smilodon', type: 'weapon', rarity: 'Rare', stats: { strength: 14, speed: 10 }, bonus: '+14 Force · +10 Vitesse', effect: '8 % : second coup à 50 %', art: 'fangs' },
  { id: 'mammoth-spear', name: 'Lance du Mammouth ancestral', type: 'weapon', rarity: 'Rare', stats: { strength: 18, hp: 50 }, bonus: '+18 Force · +50 PV', effect: '10 % : ignore les réductions de dégâts', art: 'mammoth' },
  { id: 'volcanic-hammer', name: 'Marteau volcanique', type: 'weapon', rarity: 'Épique', stats: { strength: 38, hp: 100 }, bonus: '+38 Force · +100 PV', effect: '10 % : brûlure, 3 dégâts ×2', art: 'hammer' },
  { id: 'storm-javelin', name: 'Javelot des Tempêtes', type: 'weapon', rarity: 'Épique', stats: { strength: 65, speed: 45, dodge: 16 }, bonus: '+65 Force · +45 Vitesse · +16 Esquive', effect: 'Premier coup : +20 % dégâts', art: 'spear' },
  { id: 'tyrant-claw', name: 'Griffe du Tyran', type: 'weapon', rarity: 'Légendaire', stats: { strength: 75, speed: 14 }, bonus: '+75 Force · +14 Vitesse', effect: '12 % : +50 % dégâts', art: 'claw' },
  { id: 'titan-heart', name: 'Cœur du Titan Primordial', type: 'weapon', rarity: 'Mythique', stats: { strength: 75, speed: 22, hp: 100 }, bonus: '+75 Force · +22 Vitesse · +100 PV', effect: '7 % : +80 % dégâts', art: 'heart' },
  { id: 'hunter-hides', name: 'Peaux du chasseur', type: 'armor', rarity: 'Commun', stats: { hp: 30 }, bonus: '+30 PV', effect: 'Premier coup reçu : −5 % dégâts', art: 'hide' },
  { id: 'reed-mantle', name: 'Manteau des Roseaux', type: 'armor', rarity: 'Commun', stats: { hp: 15, dodge: 4 }, bonus: '+15 PV · +4 Esquive', effect: 'Premier coup reçu : −5 % dégâts', art: 'hide' },
  { id: 'bone-harness', name: 'Harnais d’os', type: 'armor', rarity: 'Peu commun', stats: { hp: 65, strength: 3 }, bonus: '+65 PV · +3 Force', effect: '5 % : −25 % dégâts reçus', art: 'bones' },
  { id: 'raptor-scales', name: 'Écailles du Raptor', type: 'armor', rarity: 'Peu commun', stats: { hp: 45, speed: 6, dodge: 6 }, bonus: '+45 PV · +6 Vitesse · +6 Esquive', effect: 'Premier coup reçu : −10 % dégâts', art: 'hide' },
  { id: 'mammoth-plate', name: 'Cuirasse du Mammouth ancestral', type: 'armor', rarity: 'Rare', stats: { hp: 140, strength: 6 }, bonus: '+140 PV · +6 Force', effect: 'Bonus de critique adverse : −20 %', art: 'plate' },
  { id: 'smilodon-cloak', name: 'Cape du Smilodon', type: 'armor', rarity: 'Rare', stats: { hp: 95, dodge: 14, speed: 8 }, bonus: '+95 PV · +14 Esquive · +8 Vitesse', effect: 'Premier coup reçu : −15 % dégâts', art: 'fur' },
  { id: 'volcanic-shell', name: 'Carapace volcanique', type: 'armor', rarity: 'Épique', stats: { hp: 320, strength: 10 }, bonus: '+320 PV · +10 Force', effect: '10 % : brûle l’attaquant, 3 dégâts ×2', art: 'shell' },
  { id: 'ancestor-guard', name: 'Garde des Ancêtres', type: 'armor', rarity: 'Épique', stats: { hp: 440, dodge: 20, speed: 32 }, bonus: '+440 PV · +20 Esquive · +32 Vitesse', effect: 'Les 3 premiers coups reçus : −15 % dégâts', art: 'plate' },
  { id: 'white-titan-fur', name: 'Fourrure du Titan blanc', type: 'armor', rarity: 'Légendaire', stats: { hp: 450, strength: 15 }, bonus: '+450 PV · +15 Force', effect: 'Au-dessus de 50 % PV : −8 % dégâts reçus', art: 'fur' },
  { id: 'primordial-titan-skin', name: 'Peau du Titan primordial', type: 'armor', rarity: 'Mythique', stats: { hp: 650, dodge: 25 }, bonus: '+650 PV · +25 Esquive', effect: 'Les 3 premiers coups reçus : −20 % dégâts', art: 'titan' },
]

export const enemies = [
  'Ramasseur des brumes', 'Chasseur de cornes', 'Veilleuse des fougères', 'Pilleur de silex', 'Brak le Colossal',
  'Traqueur des marais', 'Dompteuse de raptors', 'Gardien des os', 'Éclaireur du volcan', 'Ura la Balafrée',
  'Briseur de défenses', 'Prêtresse du feu', 'Fils du Smilodon', 'Sentinelle noire', 'Korga Croc-de-Fer',
  'Champion des cendres', 'Champion du tonnerre', 'Champion des abysses', 'Champion du Titan', 'Morgath, Roi Primordial',
]
