var e = [
	120,
	180,
	300,
	450,
	650,
	850,
	1100,
	1400,
	1800
], t = {
	karg: [
		[
			11,
			8,
			10,
			110
		],
		[
			13,
			9,
			11,
			128
		],
		[
			15,
			10,
			13,
			146
		],
		[
			17,
			11,
			14,
			163
		],
		[
			19,
			12,
			15,
			181
		],
		[
			20,
			14,
			17,
			199
		],
		[
			29,
			15,
			18,
			306
		],
		[
			40,
			16,
			20,
			455
		],
		[
			54,
			17,
			22,
			626
		],
		[
			99,
			28,
			40,
			1139
		]
	],
	naya: [
		[
			8,
			13,
			14,
			90
		],
		[
			9,
			15,
			16,
			104
		],
		[
			11,
			16,
			18,
			119
		],
		[
			12,
			18,
			19,
			133
		],
		[
			14,
			19,
			21,
			148
		],
		[
			15,
			21,
			23,
			162
		],
		[
			21,
			22,
			25,
			235
		],
		[
			28,
			24,
			26,
			338
		],
		[
			37,
			25,
			28,
			455
		],
		[
			73,
			45,
			55,
			900
		]
	],
	brakk: [
		[
			12,
			6,
			7,
			145
		],
		[
			13,
			7,
			8,
			166
		],
		[
			15,
			8,
			9,
			186
		],
		[
			16,
			9,
			10,
			207
		],
		[
			17,
			10,
			11,
			227
		],
		[
			19,
			11,
			13,
			248
		],
		[
			27,
			12,
			14,
			356
		],
		[
			38,
			13,
			15,
			507
		],
		[
			51,
			14,
			17,
			680
		],
		[
			95,
			25,
			32,
			1260
		]
	],
	eyla: [
		[
			10,
			10,
			12,
			100
		],
		[
			11,
			11,
			14,
			115
		],
		[
			13,
			12,
			16,
			130
		],
		[
			14,
			14,
			17,
			145
		],
		[
			16,
			15,
			19,
			160
		],
		[
			17,
			16,
			21,
			175
		],
		[
			26,
			17,
			23,
			282
		],
		[
			38,
			19,
			25,
			432
		],
		[
			52,
			20,
			27,
			604
		],
		[
			94,
			35,
			50,
			1099
		]
	],
	asha: [
		[
			11,
			10,
			11,
			120
		],
		[
			13,
			11,
			13,
			140
		],
		[
			15,
			12,
			14,
			160
		],
		[
			17,
			14,
			16,
			180
		],
		[
			19,
			15,
			17,
			200
		],
		[
			20,
			16,
			19,
			220
		],
		[
			29,
			17,
			20,
			327
		],
		[
			40,
			19,
			22,
			477
		],
		[
			54,
			20,
			23,
			648
		],
		[
			99,
			30,
			43,
			1179
		]
	],
	rhex: [
		[
			11,
			11,
			13,
			115
		],
		[
			13,
			12,
			15,
			133
		],
		[
			15,
			14,
			17,
			152
		],
		[
			16,
			15,
			18,
			170
		],
		[
			18,
			16,
			20,
			188
		],
		[
			20,
			18,
			22,
			207
		],
		[
			29,
			19,
			24,
			312
		],
		[
			40,
			20,
			25,
			458
		],
		[
			54,
			22,
			27,
			626
		],
		[
			98,
			35,
			50,
			1139
		]
	],
	ursak: [
		[
			14,
			7,
			9,
			150
		],
		[
			16,
			8,
			10,
			174
		],
		[
			18,
			9,
			12,
			199
		],
		[
			20,
			10,
			13,
			223
		],
		[
			22,
			11,
			15,
			248
		],
		[
			24,
			13,
			16,
			272
		],
		[
			32,
			14,
			18,
			370
		],
		[
			42,
			15,
			19,
			507
		],
		[
			54,
			16,
			21,
			663
		],
		[
			98,
			26,
			38,
			1206
		]
	],
	saar: [
		[
			15,
			16,
			16,
			135
		],
		[
			17,
			18,
			18,
			154
		],
		[
			19,
			19,
			20,
			174
		],
		[
			21,
			21,
			22,
			193
		],
		[
			23,
			23,
			24,
			213
		],
		[
			25,
			24,
			26,
			232
		],
		[
			32,
			26,
			28,
			331
		],
		[
			42,
			28,
			30,
			468
		],
		[
			54,
			29,
			32,
			626
		],
		[
			99,
			44,
			54,
			1139
		]
	],
	morga: [
		[
			16,
			5,
			7,
			195
		],
		[
			18,
			6,
			8,
			220
		],
		[
			20,
			7,
			10,
			245
		],
		[
			22,
			8,
			11,
			270
		],
		[
			24,
			9,
			12,
			295
		],
		[
			26,
			11,
			14,
			320
		],
		[
			33,
			12,
			15,
			419
		],
		[
			43,
			13,
			16,
			557
		],
		[
			55,
			14,
			18,
			715
		],
		[
			100,
			24,
			33,
			1300
		]
	],
	vorka: [
		[
			18,
			12,
			14,
			165
		],
		[
			20,
			14,
			16,
			189
		],
		[
			22,
			15,
			18,
			213
		],
		[
			24,
			17,
			20,
			237
		],
		[
			26,
			19,
			22,
			261
		],
		[
			29,
			20,
			24,
			284
		],
		[
			36,
			22,
			26,
			380
		],
		[
			45,
			24,
			28,
			513
		],
		[
			56,
			25,
			30,
			666
		],
		[
			103,
			38,
			50,
			1233
		]
	],
	urgath: [
		[
			21,
			6,
			8,
			225
		],
		[
			23,
			7,
			9,
			252
		],
		[
			25,
			8,
			11,
			279
		],
		[
			28,
			10,
			12,
			307
		],
		[
			30,
			11,
			14,
			334
		],
		[
			32,
			12,
			15,
			361
		],
		[
			38,
			13,
			17,
			457
		],
		[
			46,
			15,
			18,
			591
		],
		[
			56,
			16,
			20,
			744
		],
		[
			102,
			26,
			35,
			1353
		]
	],
	tyrak: [
		[
			23,
			8,
			12,
			245
		],
		[
			25,
			9,
			13,
			273
		],
		[
			28,
			10,
			15,
			302
		],
		[
			30,
			11,
			16,
			330
		],
		[
			32,
			12,
			18,
			358
		],
		[
			35,
			14,
			19,
			387
		],
		[
			41,
			15,
			21,
			480
		],
		[
			49,
			16,
			22,
			610
		],
		[
			58,
			17,
			24,
			759
		],
		[
			106,
			28,
			42,
			1380
		]
	]
};
function n(e, n) {
	let r = t[e];
	if (!r) throw Error(`Unknown Warrior: ${e}`);
	let [i, a, o, s] = r[(Number.isFinite(n) ? Math.min(10, Math.max(1, Math.trunc(n))) : 1) - 1];
	return {
		strength: i,
		dodge: a,
		speed: o,
		hp: s
	};
}
function r(t) {
	return !Number.isInteger(t) || t < 1 || t >= 10 ? 0 : e[t - 1];
}
//#endregion
//#region src/config.ts
var i = {
	baseDamage: 6,
	strengthExponent: .75,
	strengthScale: 2.2,
	damageVariance: .1,
	criticalChance: .05,
	criticalMultiplier: 1.5,
	dodgeBase: .04,
	dodgeScale: .36,
	dodgeCap: .35,
	speedOffset: 10,
	speedExponent: .65,
	maxConsecutiveActions: 3,
	campaignDaily: 10,
	maxWarriorLevel: 10
}, a = [
	"Commun",
	"Peu commun",
	"Rare",
	"Épique",
	"Légendaire",
	"Mythique"
], o = [
	{
		id: "flint-club",
		name: "Massue de silex",
		type: "weapon",
		rarity: "Commun",
		stats: { strength: 3 },
		bonus: "+3 Force",
		effect: "5 % : +20 % dégâts",
		art: "club"
	},
	{
		id: "bone-spear",
		name: "Lance d’os",
		type: "weapon",
		rarity: "Commun",
		stats: {
			strength: 1,
			speed: 4
		},
		bonus: "+1 Force · +4 Vitesse",
		effect: "Premier coup : +10 % dégâts",
		art: "spear"
	},
	{
		id: "obsidian-axe",
		name: "Hache d’obsidienne",
		type: "weapon",
		rarity: "Peu commun",
		stats: {
			strength: 7,
			hp: 20
		},
		bonus: "+7 Force · +20 PV",
		effect: "6 % : saignement, 3 dégâts ×2",
		art: "axe"
	},
	{
		id: "hunter-bow",
		name: "Arc du chasseur",
		type: "weapon",
		rarity: "Peu commun",
		stats: {
			strength: 4,
			speed: 8
		},
		bonus: "+4 Force · +8 Vitesse",
		effect: "Esquive adverse : −3 points",
		art: "bow"
	},
	{
		id: "smilodon-fangs",
		name: "Crocs du Smilodon",
		type: "weapon",
		rarity: "Rare",
		stats: {
			strength: 14,
			speed: 10
		},
		bonus: "+14 Force · +10 Vitesse",
		effect: "8 % : second coup à 50 %",
		art: "fangs"
	},
	{
		id: "mammoth-spear",
		name: "Lance du Mammouth ancestral",
		type: "weapon",
		rarity: "Rare",
		stats: {
			strength: 18,
			hp: 50
		},
		bonus: "+18 Force · +50 PV",
		effect: "10 % : ignore les réductions de dégâts",
		art: "mammoth"
	},
	{
		id: "volcanic-hammer",
		name: "Marteau volcanique",
		type: "weapon",
		rarity: "Épique",
		stats: {
			strength: 38,
			hp: 100
		},
		bonus: "+38 Force · +100 PV",
		effect: "10 % : brûlure, 3 dégâts ×2",
		art: "hammer"
	},
	{
		id: "storm-javelin",
		name: "Javelot des Tempêtes",
		type: "weapon",
		rarity: "Épique",
		stats: {
			strength: 30,
			speed: 20,
			dodge: 8
		},
		bonus: "+30 Force · +20 Vitesse · +8 Esquive",
		effect: "Premier coup : +20 % dégâts",
		art: "spear"
	},
	{
		id: "tyrant-claw",
		name: "Griffe du Tyran",
		type: "weapon",
		rarity: "Légendaire",
		stats: {
			strength: 55,
			speed: 14
		},
		bonus: "+55 Force · +14 Vitesse",
		effect: "12 % : +50 % dégâts",
		art: "claw"
	},
	{
		id: "titan-heart",
		name: "Cœur du Titan Primordial",
		type: "weapon",
		rarity: "Mythique",
		stats: {
			strength: 75,
			speed: 22,
			hp: 100
		},
		bonus: "+75 Force · +22 Vitesse · +100 PV",
		effect: "7 % : +80 % dégâts",
		art: "heart"
	},
	{
		id: "hunter-hides",
		name: "Peaux du chasseur",
		type: "armor",
		rarity: "Commun",
		stats: { hp: 30 },
		bonus: "+30 PV",
		effect: "Premier coup reçu : −5 % dégâts",
		art: "hide"
	},
	{
		id: "reed-mantle",
		name: "Manteau des Roseaux",
		type: "armor",
		rarity: "Commun",
		stats: {
			hp: 15,
			dodge: 4
		},
		bonus: "+15 PV · +4 Esquive",
		effect: "Premier coup reçu : −5 % dégâts",
		art: "hide"
	},
	{
		id: "bone-harness",
		name: "Harnais d’os",
		type: "armor",
		rarity: "Peu commun",
		stats: {
			hp: 65,
			strength: 3
		},
		bonus: "+65 PV · +3 Force",
		effect: "5 % : −25 % dégâts reçus",
		art: "bones"
	},
	{
		id: "raptor-scales",
		name: "Écailles du Raptor",
		type: "armor",
		rarity: "Peu commun",
		stats: {
			hp: 45,
			speed: 6,
			dodge: 6
		},
		bonus: "+45 PV · +6 Vitesse · +6 Esquive",
		effect: "Premier coup reçu : −10 % dégâts",
		art: "hide"
	},
	{
		id: "mammoth-plate",
		name: "Cuirasse du Mammouth ancestral",
		type: "armor",
		rarity: "Rare",
		stats: {
			hp: 140,
			strength: 6
		},
		bonus: "+140 PV · +6 Force",
		effect: "Bonus de critique adverse : −20 %",
		art: "plate"
	},
	{
		id: "smilodon-cloak",
		name: "Cape du Smilodon",
		type: "armor",
		rarity: "Rare",
		stats: {
			hp: 95,
			dodge: 14,
			speed: 8
		},
		bonus: "+95 PV · +14 Esquive · +8 Vitesse",
		effect: "Premier coup reçu : −15 % dégâts",
		art: "fur"
	},
	{
		id: "volcanic-shell",
		name: "Carapace volcanique",
		type: "armor",
		rarity: "Épique",
		stats: {
			hp: 320,
			strength: 10
		},
		bonus: "+320 PV · +10 Force",
		effect: "10 % : brûle l’attaquant, 3 dégâts ×2",
		art: "shell"
	},
	{
		id: "ancestor-guard",
		name: "Garde des Ancêtres",
		type: "armor",
		rarity: "Épique",
		stats: {
			hp: 260,
			dodge: 20,
			speed: 12
		},
		bonus: "+260 PV · +20 Esquive · +12 Vitesse",
		effect: "Les 3 premiers coups reçus : −15 % dégâts",
		art: "plate"
	},
	{
		id: "white-titan-fur",
		name: "Fourrure du Titan blanc",
		type: "armor",
		rarity: "Légendaire",
		stats: {
			hp: 450,
			strength: 15
		},
		bonus: "+450 PV · +15 Force",
		effect: "Au-dessus de 50 % PV : −8 % dégâts reçus",
		art: "fur"
	},
	{
		id: "primordial-titan-skin",
		name: "Peau du Titan primordial",
		type: "armor",
		rarity: "Mythique",
		stats: {
			hp: 650,
			dodge: 25
		},
		bonus: "+650 PV · +25 Esquive",
		effect: "Les 3 premiers coups reçus : −20 % dégâts",
		art: "titan"
	}
], s = "karg", c = {
	id: s,
	name: "Karg",
	title: "Premier Chasseur",
	era: "Primordiale",
	rarity: "Commun",
	warriorClass: "Ravageur",
	passive: {
		name: "Furie",
		description: "+5 % dégâts par attaque réussie, max ×3. Raté = reset."
	},
	baseStats: {
		strength: 11,
		dodge: 8,
		speed: 10,
		hp: 110
	},
	art: "/assets/warriors/primal/karg.png",
	artPosition: "50% 8%"
}, l = (e, t, n, r, i, a, o) => ({
	id: e,
	name: t,
	title: n,
	era: "Primordiale",
	rarity: r,
	warriorClass: i,
	baseStats: a,
	art: `/assets/warriors/primal/${e}.png`,
	artPosition: o
}), u = [
	c,
	l("naya", "Naya", "Ombre des Falaises", "Commun", "Spectre", {
		strength: 8,
		dodge: 13,
		speed: 14,
		hp: 90
	}, "50% 8%"),
	l("brakk", "Brakk", "Brise-Roc", "Commun", "Bastion", {
		strength: 12,
		dodge: 6,
		speed: 7,
		hp: 145
	}, "50% 7%"),
	l("eyla", "Eyla", "Œil de Silex", "Commun", "Tempête", {
		strength: 10,
		dodge: 10,
		speed: 12,
		hp: 100
	}, "50% 9%"),
	l("asha", "Asha", "Voix des Braises", "Peu commun", "Fléau", {
		strength: 11,
		dodge: 10,
		speed: 11,
		hp: 120
	}, "50% 8%"),
	l("rhex", "Rhex", "Meneur de Raptors", "Peu commun", "Héraut", {
		strength: 11,
		dodge: 11,
		speed: 13,
		hp: 115
	}, "50% 10%"),
	l("ursak", "Ursak", "Roi des Cavernes", "Peu commun", "Ravageur", {
		strength: 14,
		dodge: 7,
		speed: 9,
		hp: 150
	}, "50% 5%"),
	l("saar", "Saar", "Croc du Smilodon", "Rare", "Spectre", {
		strength: 15,
		dodge: 16,
		speed: 16,
		hp: 135
	}, "50% 15%"),
	l("morga", "Morga", "Matriarche d’Ivoire", "Rare", "Bastion", {
		strength: 16,
		dodge: 5,
		speed: 7,
		hp: 195
	}, "50% 9%"),
	l("vorka", "Vorka", "Reine d’Obsidienne", "Épique", "Fléau", {
		strength: 18,
		dodge: 12,
		speed: 14,
		hp: 165
	}, "50% 5%"),
	l("urgath", "Urgath", "Titan des Glaces", "Légendaire", "Bastion", {
		strength: 21,
		dodge: 6,
		speed: 8,
		hp: 225
	}, "50% 5%"),
	l("tyrak", "TYRAK", "Roi Primordial", "Mythique", "Ravageur", {
		strength: 23,
		dodge: 8,
		speed: 12,
		hp: 245
	}, "50% 0%")
], d = Object.fromEntries(u.map((e) => [e.id, e]));
function f(e, t) {
	let r = e.ownedWarriors[t], i = d[t];
	if (!r || !i || r.warriorId !== i.id) throw Error("Warrior definition or ownership is missing");
	let a = n(t, r.level);
	return {
		...i,
		level: r.level,
		xp: r.xp,
		stats: a,
		skills: []
	};
}
function p(e) {
	return f(e, e.activeWarriorId);
}
//#endregion
//#region src/warriorPassives.ts
var m = (e, t) => t.map(([t, n, r]) => ({
	id: `${e}-${t}`,
	warriorId: e,
	name: n,
	unlockLevel: t,
	description: r
})), h = {
	karg: m("karg", [
		[
			3,
			"Premier Sang",
			"Votre première attaque réussie inflige +25 % de dégâts."
		],
		[
			7,
			"Pression du chasseur",
			"Chaque coup consécutif ajoute +6 % de dégâts au suivant (maximum +18 %). Une esquive adverse annule les charges."
		],
		[
			10,
			"Coup de Grâce",
			"Infligez +30 % de dégâts aux cibles à 30 % de PV ou moins."
		]
	]),
	naya: m("naya", [
		[
			3,
			"Pas d’Ombre",
			"Votre chance d’esquiver le premier assaut est multipliée par 1,25 (plafond 35 %)."
		],
		[
			7,
			"Tempo fantôme",
			"Après le premier assaut, esquive ×2 (plafond 35 %). Chaque esquive donne +30 % de cadence à la prochaine action et +40 % de dégâts au prochain coup réussi."
		],
		[
			10,
			"Embuscade décisive",
			"Après une esquive, le prochain coup réussi inflige +60 % de dégâts au lieu de +40 %."
		]
	]),
	brakk: m("brakk", [
		[
			3,
			"Garde rocheuse",
			"Les 3 premiers coups reçus infligent −12 % de dégâts."
		],
		[
			7,
			"Riposte du Bastion",
			"12 % de chance de bloquer entièrement une attaque. Le prochain coup réussi inflige alors +30 % de dégâts."
		],
		[
			10,
			"Dernière Résistance",
			"À 30 % de PV ou moins, les 3 prochains coups reçus infligent −35 % de dégâts. Une fois par combat."
		]
	]),
	eyla: m("eyla", [
		[
			3,
			"Mise en joue",
			"Votre première attaque réussie inflige +20 % de dégâts."
		],
		[
			7,
			"Cadence précise",
			"Chaque 3e attaque réussie ajoute un tir à 45 % des dégâts normaux. Ce tir ne déclenche pas vos passifs d’attaque."
		],
		[
			10,
			"Flèche fatale",
			"Le premier coup réussi contre une cible à 50 % de PV ou moins inflige +40 % de dégâts."
		]
	]),
	asha: m("asha", [
		[
			3,
			"Marque de Braise",
			"Chaque coup réussi ajoute une Braise (maximum 3). Chaque Braise déjà présente ajoute +3 % de dégâts."
		],
		[
			7,
			"Foyer ardent",
			"Avec 3 Braises, le prochain coup réussi les consume et inflige +30 % de dégâts."
		],
		[
			10,
			"Crescendo incandescent",
			"Les détonations infligent +50 % au lieu de +30 % et donnent +20 % de cadence à la prochaine action."
		]
	]),
	rhex: m("rhex", [
		[
			3,
			"Signal de meute",
			"Chaque 3e attaque réussie ajoute une morsure à 35 % des dégâts normaux, sans déclencher vos passifs d’attaque."
		],
		[
			7,
			"Relais de meute",
			"Chaque assaut de raptor donne +20 % de cadence à votre prochaine action."
		],
		[
			10,
			"Assaut coordonné",
			"Chaque assaut ajoute 2 morsures à 30 % des dégâts normaux chacune, au lieu d’une à 35 %."
		]
	]),
	ursak: m("ursak", [
		[
			3,
			"Fureur cavernicole",
			"Chaque coup reçu ajoute +8 % de dégâts au prochain coup réussi (maximum 3 charges)."
		],
		[
			7,
			"Endurance sous pression",
			"À 50 % de PV ou moins, recevez −15 % de dégâts."
		],
		[
			10,
			"Fureur ancestrale",
			"À 30 % de PV ou moins, gagnez +20 % de dégâts et +15 % de cadence jusqu’à la fin du combat."
		]
	]),
	saar: m("saar", [
		[
			3,
			"Pas félin",
			"Chaque esquive donne +25 % de cadence à votre prochaine action."
		],
		[
			7,
			"Frénésie féline",
			"Chaque coup réussi donne +5 % de cadence (maximum +15 %). Un coup reçu annule les charges."
		],
		[
			10,
			"Contre-attaque prédatrice",
			"Après une esquive, le prochain coup réussi inflige +45 % de dégâts."
		]
	]),
	morga: m("morga", [
		[
			3,
			"Garde d’Ivoire",
			"Les 4 premiers coups reçus infligent −12 % de dégâts."
		],
		[
			7,
			"Protection de la tribu",
			"À 60 % de PV ou moins, les 3 prochains coups reçus infligent −20 % de dégâts. Une fois par combat."
		],
		[
			10,
			"Endurance de Matriarche",
			"À 25 % de PV ou moins, récupérez 15 % des PV maximum et recevez −15 % de dégâts jusqu’à la fin. Une fois par combat."
		]
	]),
	vorka: m("vorka", [
		[
			3,
			"Entaille d’obsidienne",
			"25 % de chance d’infliger un saignement : 10 % des dégâts du coup pendant 2 actions, sans cumul."
		],
		[
			7,
			"Pression persistante",
			"Infligez +15 % de dégâts aux cibles qui saignent."
		],
		[
			10,
			"Coupure décisive",
			"Le premier coup contre une cible qui saigne à 40 % de PV ou moins inflige +45 % de dégâts et consume le saignement."
		]
	]),
	urgath: m("urgath", [
		[
			3,
			"Rempart glacial",
			"Les 5 premiers coups reçus infligent −12 % de dégâts."
		],
		[
			7,
			"Froid écrasant",
			"Chaque coup réussi réduit la cadence adverse de 5 % (maximum −15 %)."
		],
		[
			10,
			"Résilience du Titan",
			"À 40 % de PV ou moins, recevez −20 % de dégâts."
		]
	]),
	tyrak: m("tyrak", [
		[
			3,
			"Présence primordiale",
			"Les 3 premiers coups reçus infligent −10 % de dégâts."
		],
		[
			7,
			"Sursaut cristallin",
			"À 65 % de PV ou moins, gagnez +35 % de cadence à la prochaine action et +30 % de dégâts au prochain coup réussi. Une fois par combat."
		],
		[
			10,
			"Domination du Roi",
			"À 35 % de PV ou moins, gagnez +25 % de dégâts et recevez −12 % de dégâts jusqu’à la fin du combat."
		]
	])
}, g = class {
	warriorId;
	level;
	targetedAttacks = 0;
	receivedHits = 0;
	landedHits = 0;
	pressure = 0;
	braise = 0;
	fury = 0;
	frenzy = 0;
	cold = 0;
	actionCredit = 0;
	riposteReady = !1;
	counterReady = !1;
	crystalReady = !1;
	lastResistance = 0;
	tribeProtection = 0;
	thresholdTriggered = !1;
	secondThresholdTriggered = !1;
	finalShotUsed = !1;
	decisiveCutUsed = !1;
	permanentDefense = !1;
	enraged = !1;
	constructor(e = "", t = 1) {
		this.warriorId = e, this.level = t;
	}
	has(e) {
		return this.level >= e && !!h[this.warriorId];
	}
	credit(e) {
		this.actionCredit = Math.min(1, this.actionCredit + e);
	}
	actionRateMultiplier() {
		let e = this.warriorId === "saar" && this.has(7) ? 1 + .05 * this.frenzy : 1, t = this.warriorId === "ursak" && this.enraged ? 1.15 : 1;
		return (1 + this.actionCredit) * e * t;
	}
	opponentRateMultiplier() {
		return this.warriorId === "urgath" && this.has(7) ? 1 - .05 * this.cold : 1;
	}
	onAction() {
		this.actionCredit = 0;
	}
	dodgeChance(e, t) {
		let n = this.targetedAttacks++ === 0;
		return this.warriorId !== "naya" || !this.has(3) ? e : n ? Math.min(t, e * 1.25) : this.has(7) ? Math.min(t, e * 2) : e;
	}
	onDodge() {
		this.warriorId === "naya" && this.has(7) && (this.credit(.3), this.counterReady = !0), this.warriorId === "saar" && (this.has(3) && this.credit(.25), this.has(10) && (this.counterReady = !0));
	}
	onMiss() {
		this.warriorId === "karg" && this.has(7) && (this.pressure = 0);
	}
	blockChance() {
		return this.warriorId === "brakk" && this.has(7) ? .12 : 0;
	}
	onBlock() {
		this.warriorId === "brakk" && this.has(7) && (this.riposteReady = !0);
	}
	incomingMultiplier(e, t) {
		let n = 1;
		return this.has(3) && this.receivedHits < ({
			brakk: 3,
			morga: 4,
			urgath: 5,
			tyrak: 3
		}[this.warriorId] ?? 0) && (n *= this.warriorId === "tyrak" ? .9 : .88), this.warriorId === "brakk" && this.has(10) && this.lastResistance > 0 && (n *= .65, this.lastResistance--), this.warriorId === "morga" && (this.has(7) && this.tribeProtection > 0 && (n *= .8, this.tribeProtection--), this.permanentDefense && (n *= .85)), this.warriorId === "ursak" && this.has(7) && e <= t * .5 && (n *= .85), this.warriorId === "urgath" && this.has(10) && e <= t * .4 && (n *= .8), this.warriorId === "tyrak" && this.has(10) && e <= t * .35 && (n *= .88), n;
	}
	onDamageTaken(e, t) {
		this.receivedHits++;
		let n = [], r = 0;
		return this.warriorId === "ursak" && (this.has(3) && (this.fury = Math.min(3, this.fury + 1)), this.has(10) && !this.enraged && e <= t * .3 && (this.enraged = !0, n.push("Fureur ancestrale"))), this.warriorId === "saar" && this.has(7) && (this.frenzy = 0), this.warriorId === "brakk" && this.has(10) && !this.thresholdTriggered && e <= t * .3 && (this.thresholdTriggered = !0, this.lastResistance = 3, n.push("Dernière Résistance")), this.warriorId === "morga" && (this.has(7) && !this.thresholdTriggered && e <= t * .6 && (this.thresholdTriggered = !0, this.tribeProtection = 3, n.push("Protection de la tribu")), this.has(10) && !this.secondThresholdTriggered && e <= t * .25 && (this.secondThresholdTriggered = !0, this.permanentDefense = !0, r = Math.round(t * .15), n.push("Endurance de Matriarche"))), this.warriorId === "tyrak" && this.has(7) && !this.thresholdTriggered && e <= t * .65 && (this.thresholdTriggered = !0, this.crystalReady = !0, this.credit(.35), n.push("Sursaut cristallin")), {
			heal: r,
			labels: n
		};
	}
	onSuccessfulAttack(e, t, n, r) {
		let i = 1, a = !1, o = !1, s = [], c = [], l = this.landedHits === 0;
		switch (this.landedHits++, this.warriorId) {
			case "karg":
				this.has(3) && l && (i *= 1.25, s.push("Premier Sang")), this.has(7) && (i *= 1 + .06 * this.pressure, this.pressure = Math.min(3, this.pressure + 1)), this.has(10) && e <= t * .3 && (i *= 1.3, s.push("Coup de Grâce"));
				break;
			case "naya":
				this.has(7) && this.counterReady && (i *= this.has(10) ? 1.6 : 1.4, this.counterReady = !1, s.push(this.has(10) ? "Embuscade décisive" : "Tempo fantôme"));
				break;
			case "brakk":
				this.has(7) && this.riposteReady && (i *= 1.3, this.riposteReady = !1, s.push("Riposte du Bastion"));
				break;
			case "eyla":
				this.has(3) && l && (i *= 1.2, s.push("Mise en joue")), this.has(10) && !this.finalShotUsed && e <= t * .5 && (i *= 1.4, this.finalShotUsed = !0, s.push("Flèche fatale")), this.has(7) && this.landedHits % 3 == 0 && (c.push(.45), s.push("Cadence précise"));
				break;
			case "asha":
				this.has(3) && (this.has(7) && this.braise === 3 || (i *= 1 + .03 * this.braise), this.has(7) && this.braise === 3 && (i *= this.has(10) ? 1.5 : 1.3, this.braise = 0, this.has(10) && this.credit(.2), s.push(this.has(10) ? "Crescendo incandescent" : "Foyer ardent")), this.braise = Math.min(3, this.braise + 1));
				break;
			case "rhex":
				this.has(3) && this.landedHits % 3 == 0 && (c.push(...this.has(10) ? [.3, .3] : [.35]), this.has(7) && this.credit(.2), s.push(this.has(10) ? "Assaut coordonné" : "Signal de meute"));
				break;
			case "ursak":
				this.has(3) && this.fury && (i *= 1 + .08 * this.fury, this.fury = 0, s.push("Fureur cavernicole")), this.enraged && (i *= 1.2);
				break;
			case "saar":
				this.has(10) && this.counterReady && (i *= 1.45, this.counterReady = !1, s.push("Contre-attaque prédatrice")), this.has(7) && (this.frenzy = Math.min(3, this.frenzy + 1));
				break;
			case "vorka":
				this.has(7) && n && (i *= 1.15), this.has(10) && !this.decisiveCutUsed && n && e <= t * .4 && (i *= 1.45, o = !0, this.decisiveCutUsed = !0, s.push("Coupure décisive")), this.has(3) && r() < .25 && (a = !0, s.push("Entaille d’obsidienne"));
				break;
			case "urgath":
				this.has(7) && (this.cold = Math.min(3, this.cold + 1));
				break;
			case "tyrak": this.has(7) && this.crystalReady && (i *= 1.3, this.crystalReady = !1, s.push("Sursaut cristallin")), this.has(10) && this.enraged && (i *= 1.25);
		}
		return {
			multiplier: i,
			bonusStrikes: c,
			applyBleed: a,
			consumeBleed: o,
			labels: s
		};
	}
	updateThresholds(e, t) {
		this.warriorId === "tyrak" && this.has(10) && e <= t * .35 && (this.enraged = !0);
	}
};
//#endregion
//#region src/game.ts
function _(e) {
	let t = e >>> 0;
	return () => {
		t += 1831565813;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
var ee = (e) => i.baseDamage + i.strengthScale * e ** i.strengthExponent, te = (e) => Math.min(i.dodgeCap, i.dodgeBase + i.dodgeScale * e / (e + 100)), v = (e) => (e + i.speedOffset) ** i.speedExponent;
function y(e) {
	return { ...o.find((t) => t.id === e)?.stats };
}
function b(e, t, r = "", i = "") {
	let a = n(e, t);
	for (let e of [r, i]) {
		let t = y(e);
		for (let [e, n] of Object.entries(t)) a[e] += n;
	}
	return a;
}
function x(e, t = e.activeWarriorId) {
	let n = f(e, t), r = t === e.activeWarriorId ? {
		weapon: e.equippedWeapon,
		armor: e.equippedArmor
	} : e.loadouts[t] ?? {
		weapon: "",
		armor: ""
	};
	return b(t, n.level, e.owned[r.weapon] ? r.weapon : "", e.owned[r.armor] ? r.armor : "");
}
function S(e, t) {
	return e.skills.includes(t);
}
function C(e, t, n) {
	let r = _(n), a = new g(e.warriorId, e.level), o = new g(t.warriorId, t.level), s = e.stats.hp, c = t.stats.hp, l = null, u = 0, d = 0, f = 0, p = 0, m = 0, h = !1, y = !1, b = 0, x = 0, C = 0, w = 0, T = 0, E = 0, D = [], O = () => ({
		playerHp: Math.max(0, Math.round(s)),
		enemyHp: Math.max(0, Math.round(c))
	});
	for (; s > 0 && c > 0 && f < 160 && (f += 1, !(C > 0 && (c -= w, C--, D.push({
		type: "bleed",
		actor: "player",
		target: "enemy",
		value: w,
		label: "Saignement",
		...O()
	}), c <= 0) || T > 0 && (s -= E, T--, D.push({
		type: "bleed",
		actor: "enemy",
		target: "player",
		value: E,
		label: "Saignement",
		...O()
	}), s <= 0)));) {
		let n = v(e.stats.speed) * (S(e, "Accélération") ? 1.12 : 1) * a.actionRateMultiplier() * o.opponentRateMultiplier(), f = v(t.stats.speed) * (S(t, "Accélération") ? 1.12 : 1) * o.actionRateMultiplier() * a.opponentRateMultiplier(), g = r() < n / (n + f) ? "player" : "enemy";
		g === l && u >= i.maxConsecutiveActions && (g = g === "player" ? "enemy" : "player"), u = g === l ? u + 1 : 1, d = Math.max(d, u), l = g;
		let _ = g === "player" ? a : o, k = g === "player" ? o : a;
		_.onAction();
		let A = g === "player" ? "enemy" : "player", j = g === "player" ? e : t, M = g === "player" ? t : e, N = (e) => {
			A === "player" ? s -= e : c -= e, D.push({
				type: "damage",
				actor: g,
				target: A,
				value: e,
				...O()
			});
			let t = A === "player" ? s : c, n = k.onDamageTaken(t, M.stats.hp);
			if (n.heal > 0) {
				let e = Math.max(0, t), r = Math.min(M.stats.hp, e + n.heal);
				A === "player" ? s = r : c = r, D.push({
					type: "heal",
					actor: A,
					target: A,
					value: r - e,
					label: "Endurance de Matriarche",
					...O()
				});
			}
			for (let e of n.labels) D.push({
				type: "skill",
				actor: A,
				target: A,
				label: e,
				...O()
			});
			k.updateThresholds(A === "player" ? s : c, M.stats.hp);
		}, P = g === "player" ? ++p : ++m;
		D.push({
			type: "attack",
			actor: g,
			target: A,
			...O()
		});
		let F = (S(j, "Précision") ? .05 : 0) + (j.weapon === "hunter-bow" ? .03 : 0), I = Math.max(0, te(M.stats.dodge) - F), L = k.dodgeChance(I, i.dodgeCap);
		if (r() < L) {
			D.push({
				type: "dodge",
				actor: A,
				target: g,
				label: "Esquive",
				...O()
			}), k.onDodge(), _.onMiss();
			continue;
		}
		if (k.blockChance() > 0 && r() < k.blockChance()) {
			k.onBlock(), D.push({
				type: "skill",
				actor: A,
				target: g,
				label: "Parade",
				...O()
			});
			continue;
		}
		let R = ee(j.stats.strength) * (.9 + r() * .2);
		P === 1 && S(j, "Premier Sang") && (R *= 1.22), S(j, "Frappe Dévastatrice") && r() < .12 && (R *= 1.45, D.push({
			type: "skill",
			actor: g,
			target: A,
			label: "Frappe Dévastatrice",
			...O()
		})), S(j, "Rage") && (R *= 1 + (1 - (g === "player" ? s / e.stats.hp : c / t.stats.hp)) * .22), S(j, "Opportuniste") && (A === "player" ? s / e.stats.hp : c / t.stats.hp) < .3 && (R *= 1.25), j.weapon === "flint-club" && r() < .05 && (R *= 1.2), j.weapon === "bone-spear" && P === 1 && (R *= 1.1), j.weapon === "storm-javelin" && P === 1 && (R *= 1.2), j.weapon === "tyrant-claw" && r() < .12 && (R *= 1.5), j.weapon === "titan-heart" && r() < .07 && (R *= 1.8);
		let ne = R, z = r() < i.criticalChance + (S(j, "Élan") ? .03 : 0);
		z && (R *= M.armor === "mammoth-plate" ? 1 + (i.criticalMultiplier - 1) * .8 : i.criticalMultiplier, D.push({
			type: "critical",
			actor: g,
			target: A,
			label: "Critique",
			...O()
		}));
		let B = A === "player" ? s : c, re = A === "player" ? T > 0 || b > 0 : C > 0 || x > 0, V = j.warriorId ? _.onSuccessfulAttack(B, M.stats.hp, re, r) : null;
		if (V) {
			R *= V.multiplier;
			for (let e of V.labels) D.push({
				type: "skill",
				actor: g,
				target: A,
				label: e,
				...O()
			});
			V.consumeBleed && (A === "player" ? (T = 0, b = 0) : (C = 0, x = 0));
		}
		let H = j.weapon === "mammoth-spear" && r() < .1;
		H && z && M.armor === "mammoth-plate" && (R *= i.criticalMultiplier / (1 + (i.criticalMultiplier - 1) * .8));
		let U = R;
		H || (S(M, "Peau Dure") && (R *= .9), S(M, "Parade") && r() < .1 && (R *= .55, D.push({
			type: "skill",
			actor: A,
			target: g,
			label: "Parade",
			...O()
		})), ["hunter-hides", "reed-mantle"].includes(M.armor ?? "") && k.receivedHits === 0 && (R *= .95), M.armor === "raptor-scales" && k.receivedHits === 0 && (R *= .9), M.armor === "smilodon-cloak" && k.receivedHits === 0 && (R *= .85), M.armor === "bone-harness" && r() < .05 && (R *= .75), M.armor === "white-titan-fur" && (A === "player" ? s / e.stats.hp : c / t.stats.hp) > .5 && (R *= .92), M.armor === "primordial-titan-skin" && k.receivedHits < 3 && (R *= .8), M.armor === "ancestor-guard" && k.receivedHits < 3 && (R *= .85), R *= k.incomingMultiplier(B, M.stats.hp));
		let W = ne * R / U;
		if (R = Math.max(1, Math.round(R)), N(R), V?.applyBleed && (A === "player" ? s > 0 : c > 0) && (A === "player" ? (T = 2, E = Math.max(1, Math.round(R * .1))) : (C = 2, w = Math.max(1, Math.round(R * .1)))), V?.bonusStrikes.length && (A === "player" ? s > 0 : c > 0)) for (let e of V.bonusStrikes) {
			if (A === "player" ? s <= 0 : c <= 0) break;
			let t = Math.max(1, Math.round(W * e));
			D.push({
				type: "attack",
				actor: g,
				target: A,
				label: "Coup supplémentaire",
				...O()
			}), N(t);
		}
		if (S(j, "Vampirisme")) {
			let n = Math.max(1, Math.round(R * .08));
			g === "player" ? s = Math.min(e.stats.hp, s + n) : c = Math.min(t.stats.hp, c + n), D.push({
				type: "heal",
				actor: g,
				target: g,
				value: n,
				label: "Vampirisme",
				...O()
			});
		}
		let ie = S(j, "Saignement") ? .12 : j.weapon === "obsidian-axe" ? .06 : j.weapon === "volcanic-hammer" ? .1 : 0;
		r() < ie && (A === "player" ? b = 2 : x = 2, D.push({
			type: "skill",
			actor: g,
			target: A,
			label: j.weapon === "volcanic-hammer" ? "Brûlure" : "Saignement",
			...O()
		})), M.armor === "volcanic-shell" && r() < .1 && (g === "player" ? b = 2 : x = 2, D.push({
			type: "skill",
			actor: A,
			target: g,
			label: "Brûlure",
			...O()
		})), b > 0 && (s -= 3, --b, D.push({
			type: "bleed",
			actor: "enemy",
			target: "player",
			value: 3,
			...O()
		})), x > 0 && (c -= 3, --x, D.push({
			type: "bleed",
			actor: "player",
			target: "enemy",
			value: 3,
			...O()
		})), s <= 0 && S(e, "Second Souffle") && !h && (s = Math.round(e.stats.hp * .18), h = !0, D.push({
			type: "heal",
			actor: "player",
			target: "player",
			value: s,
			label: "Second Souffle",
			...O()
		})), c <= 0 && S(t, "Second Souffle") && !y && (c = Math.round(t.stats.hp * .18), y = !0, D.push({
			type: "heal",
			actor: "enemy",
			target: "enemy",
			value: c,
			label: "Second Souffle",
			...O()
		}));
		let ae = S(j, "Double Frappe") ? .1 : j.weapon === "smilodon-fangs" ? .08 : 0;
		if (r() < ae && s > 0 && c > 0) {
			let n = Math.max(1, Math.round(W * .5));
			D.push({
				type: "attack",
				actor: g,
				target: A,
				label: "Coup supplémentaire",
				...O()
			}), N(n), s <= 0 && S(e, "Second Souffle") && !h && (s = Math.round(e.stats.hp * .18), h = !0, D.push({
				type: "heal",
				actor: "player",
				target: "player",
				value: s,
				label: "Second Souffle",
				...O()
			})), c <= 0 && S(t, "Second Souffle") && !y && (c = Math.round(t.stats.hp * .18), y = !0, D.push({
				type: "heal",
				actor: "enemy",
				target: "enemy",
				value: c,
				label: "Second Souffle",
				...O()
			}));
		}
	}
	let k = c <= 0 ? "player" : "enemy";
	return D.push({
		type: "ko",
		actor: k,
		target: k === "player" ? "enemy" : "player",
		label: "K.O.",
		...O()
	}), {
		winner: k,
		events: D,
		enemy: t,
		consecutiveMax: d
	};
}
function w(e, t, n = Math.random) {
	let a = e.ownedWarriors[e.activeWarriorId];
	if (!a || a.level >= i.maxWarriorLevel || !Number.isFinite(t) || t <= 0) return 0;
	a.xp += Math.trunc(t);
	let o = 0;
	for (; a.level < i.maxWarriorLevel && a.xp >= r(a.level);) a.xp -= r(a.level), a.level += 1, o += 1;
	return a.level >= i.maxWarriorLevel && (a.xp = 0), o;
}
//#endregion
//#region src/victories.ts
var T = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 0 ? e : 0;
function E(e) {
	return T(e.adventureWins) + T(e.riftWins) + T(e.duelWins);
}
function D(e, t, n) {
	n === "player" && (e.totalWins = T(e.totalWins) + 1, t === "adventure" ? e.adventureWins = T(e.adventureWins) + 1 : t === "rift" ? e.riftWins = T(e.riftWins) + 1 : e.duelWins = T(e.duelWins) + 1);
}
//#endregion
//#region src/badgeSystem.ts
var O = {
	bronze: 50,
	silver: 100,
	gold: 200,
	platinum: 500
}, k = 1500, A = [
	"flint-club",
	"bone-spear",
	"obsidian-axe",
	"hunter-bow",
	"smilodon-fangs",
	"mammoth-spear",
	"volcanic-hammer",
	"tyrant-claw",
	"titan-heart",
	"hunter-hides",
	"bone-harness",
	"mammoth-plate",
	"volcanic-shell",
	"white-titan-fur",
	"primordial-titan-skin"
], j = (e, t) => ({
	current: Math.min(Math.max(Number.isFinite(e) ? e : 0, 0), t),
	target: t
}), M = (e) => new Set(e.defeatedNodes.filter((e) => Number.isInteger(e) && e >= 1 && e <= 20)), N = (e) => u.filter(({ id: t }) => !!e.ownedWarriors[t]).length, P = (e) => Object.keys(e.ownedWarriors).filter((t) => d[t] && e.ownedWarriors[t]?.warriorId === t), F = (e) => P(e).length, I = (e, t, n = !1) => P(e).some((e) => {
	let r = d[e].rarity;
	return n ? a.indexOf(r) >= a.indexOf(t) : r === t;
}), L = (e) => A.filter((t) => (e.owned[t]?.quantity ?? 0) > 0).length, R = (e, t) => e.badges.some((e) => e.id === t);
function ne(e) {
	return !1;
}
var z = [
	{
		id: "primal-first-level",
		title: "Premiers pas dans le Primal",
		description: "Terminez le premier niveau de l’Ère Primordiale.",
		grade: "bronze",
		binary: !0,
		progress: (e) => j(Number(M(e).has(1)), 1)
	},
	{
		id: "primal-three-warriors",
		title: "Tribu naissante",
		description: "Obtenez 3 Warriors de l’Ère Primordiale.",
		grade: "bronze",
		progress: (e) => j(N(e), 3)
	},
	{
		id: "primal-three-equipment",
		title: "Équipement de survie",
		description: "Obtenez 3 équipements primordiaux différents.",
		grade: "bronze",
		progress: (e) => j(L(e), 3)
	},
	{
		id: "primal-ten-levels",
		title: "Au cœur de la jungle",
		description: "Terminez 10 niveaux de l’Ère Primordiale.",
		grade: "silver",
		progress: (e) => j(M(e).size, 10)
	},
	{
		id: "primal-first-elite",
		title: "Briseur d’Élite",
		description: "Vainquez votre premier Élite Primal.",
		grade: "silver",
		binary: !0,
		progress: (e) => j(Number([
			5,
			10,
			15
		].some((t) => M(e).has(t)) || R(e, "first-elite")), 1)
	},
	{
		id: "primal-six-warriors",
		title: "Meute primordiale",
		description: "Obtenez 6 Warriors de l’Ère Primordiale.",
		grade: "silver",
		progress: (e) => j(N(e), 6)
	},
	{
		id: "primal-eight-equipment",
		title: "Arsenal de chasse",
		description: "Obtenez 8 équipements primordiaux différents.",
		grade: "silver",
		progress: (e) => j(L(e), 8)
	},
	{
		id: "primal-conqueror",
		title: "Conquérant primordial",
		description: "Vainquez le Boss final de l’Aventure Primal.",
		grade: "gold",
		binary: !0,
		progress: (e) => j(Number(M(e).has(20) || R(e, "boss")), 1)
	},
	{
		id: "primal-all-warriors",
		title: "Panthéon primordial",
		description: "Obtenez les 12 Warriors primordiaux.",
		grade: "gold",
		progress: (e) => j(N(e), u.length)
	},
	{
		id: "primal-all-equipment",
		title: "Arsenal primordial",
		description: "Obtenez les 15 équipements primordiaux.",
		grade: "gold",
		progress: (e) => j(L(e), A.length)
	},
	{
		id: "primal-tyrak",
		title: "Roi parmi les rois",
		description: "Obtenez Tyrak, Roi Primordial.",
		grade: "platinum",
		binary: !0,
		progress: (e) => j(Number(!!e.ownedWarriors.tyrak), 1)
	},
	{
		id: "primal-nemesis",
		title: "Dominateur du Primal",
		description: "Terminez l’Ère Primordiale en Némésis.",
		grade: "platinum",
		binary: !0,
		progress: (e) => j(Number(ne(e)), 1)
	}
];
function B(e) {
	return P(e).filter((t) => e.ownedWarriors[t].level >= 10).length;
}
var re = [
	{
		id: "exploit-first-impact",
		title: "Premier Impact",
		description: "Remportez votre premier combat.",
		grade: "bronze",
		binary: !0,
		progress: (e) => j(E(e), 1)
	},
	{
		id: "exploit-first-reinforcements",
		title: "Premiers renforts",
		description: "Rassemblez 5 Warriors différents.",
		grade: "bronze",
		progress: (e) => j(F(e), 5)
	},
	{
		id: "exploit-rare-spark",
		title: "Éclat rare",
		description: "Obtenez votre premier Warrior Rare ou supérieur.",
		grade: "bronze",
		binary: !0,
		progress: (e) => j(Number(I(e, "Rare", !0)), 1)
	},
	{
		id: "exploit-first-duel",
		title: "Premier duel",
		description: "Remportez votre premier Duel.",
		grade: "bronze",
		binary: !0,
		progress: (e) => j(e.duelWins, 1)
	},
	{
		id: "exploit-seasoned-fighter",
		title: "Combattant aguerri",
		description: "Remportez 25 combats.",
		grade: "silver",
		progress: (e) => j(E(e), 25)
	},
	{
		id: "exploit-chronos-collector",
		title: "Collectionneur de Chronos",
		description: "Rassemblez 10 Warriors différents.",
		grade: "silver",
		progress: (e) => j(F(e), 10)
	},
	{
		id: "exploit-ascension",
		title: "Ascension",
		description: "Amenez un Warrior au niveau 10.",
		grade: "silver",
		binary: !0,
		progress: (e) => j(B(e), 1)
	},
	{
		id: "exploit-war-machine",
		title: "Machine de guerre",
		description: "Remportez 100 combats.",
		grade: "gold",
		progress: (e) => j(E(e), 100)
	},
	{
		id: "exploit-awakened-legend",
		title: "Légende éveillée",
		description: "Obtenez votre premier Warrior Légendaire.",
		grade: "gold",
		binary: !0,
		progress: (e) => j(Number(I(e, "Légendaire")), 1)
	},
	{
		id: "exploit-elite-squad",
		title: "Escouade d’élite",
		description: "Amenez 6 Warriors au niveau 10.",
		grade: "gold",
		binary: !0,
		progress: (e) => j(B(e), 6)
	},
	{
		id: "exploit-feared-rival",
		title: "Rival redouté",
		description: "Remportez 25 Duels.",
		grade: "gold",
		progress: (e) => j(e.duelWins, 25)
	},
	{
		id: "exploit-mythic-fracture",
		title: "Fracture mythique",
		description: "Obtenez votre premier Warrior Mythique.",
		grade: "platinum",
		binary: !0,
		progress: (e) => j(Number(I(e, "Mythique")), 1)
	}
], V = "primal-mastery", H = (e, t) => e.badges.some((e) => e.id === t), U = (e) => z.every(({ id: t }) => H(e, t));
function W(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
	let n = [...z, ...re].filter((t) => {
		if (H(e, t.id)) return !1;
		let { current: n, target: r } = t.progress(e);
		return n >= r;
	});
	if (!n.length && (H(e, "primal-mastery") || !U(e))) return {
		save: e,
		granted: []
	};
	let r = structuredClone(e), i = n.map((e) => {
		let n = O[e.grade];
		return r.badges.push({
			id: e.id,
			unlockedAt: t
		}), r.coins += n, {
			id: e.id,
			title: e.title,
			coins: n
		};
	});
	return U(r) && !H(r, "primal-mastery") && (r.badges.push({
		id: V,
		unlockedAt: t
	}), r.coins += k, i.push({
		id: V,
		title: "Maîtrise Primordiale",
		coins: k
	})), {
		save: r,
		granted: i
	};
}
//#endregion
//#region src/art/assetsV04.ts
var ie = [
	"flint-club",
	"bone-spear",
	"obsidian-axe",
	"hunter-bow",
	"smilodon-fangs",
	"mammoth-spear",
	"volcanic-hammer",
	"tyrant-claw",
	"titan-heart"
], ae = [
	"hunter-hides",
	"bone-harness",
	"mammoth-plate",
	"volcanic-shell",
	"white-titan-fur",
	"primordial-titan-skin"
], oe = [
	"tribal-hunter",
	"tribal-warrior",
	"cave-brute",
	"shaman",
	"raptor",
	"smilodon",
	"mammoth"
];
new Set(ie), new Set(ae), new Set(oe);
//#endregion
//#region src/rift.ts
var se = [
	100,
	90,
	82,
	74,
	68,
	62,
	56,
	50
], G = 12e5;
function ce(e, t, n) {
	let r = Math.min(10, Math.max(0, Math.trunc(e)));
	if (r === 10) return {
		charges: r,
		nextAt: null
	};
	if (t === null || !Number.isFinite(t)) return {
		charges: r,
		nextAt: n + G
	};
	if (n < t) return {
		charges: r,
		nextAt: t
	};
	let i = 1 + Math.floor((n - t) / G), a = Math.min(10, r + i);
	return {
		charges: a,
		nextAt: a === 10 ? null : t + i * G
	};
}
function le(e, t = Date.now()) {
	let n = ce(e.campaignRemaining, e.campaignRechargeAt, t);
	return n.charges === e.campaignRemaining && n.nextAt === e.campaignRechargeAt ? e : {
		...e,
		campaignRemaining: n.charges,
		campaignRechargeAt: n.nextAt
	};
}
//#endregion
//#region src/storage.ts
var ue = "chronos-age-warriors:v4", de = "chronos-age-warriors:v3", fe = "chronos-age-warriors:admin:v3", K = "chronos-age-warriors:v2", q = "chronos-age-warriors:admin:v2", J = (e = /* @__PURE__ */ new Date()) => e.toLocaleDateString("sv-SE");
function Y() {
	return {
		version: 5,
		activeWarriorId: "",
		welcomeChestOpened: !1,
		ownedWarriors: {},
		unlockedSkills: [],
		coins: 300,
		owned: {},
		equippedWeapon: "",
		equippedArmor: "",
		campaignNode: 1,
		defeatedNodes: [],
		campaignRemaining: 10,
		campaignRechargeAt: null,
		nemesisUnlocked: !1,
		nemesisCampaignNode: 1,
		nemesisDefeatedNodes: [],
		nemesisCompleted: !1,
		normalBossFirstClearRewardClaimed: !1,
		nemesisBossFirstClearRewardClaimed: !1,
		loadouts: {},
		totalWins: 0,
		adventureWins: 0,
		riftWins: 0,
		duelWins: 0,
		chests: 0,
		riftChestCount: 0,
		riftLossStreak: 0,
		riftRun: null,
		expedition: null,
		expeditionReturn: null,
		equipmentChestCount: 0,
		warriorChestCount: 0,
		speed: 1,
		badges: [],
		pendingWarriorRecycles: [],
		lastReset: J()
	};
}
function pe(e, t = J()) {
	e.lastReset = t;
	let n = le(e);
	return e.campaignRemaining = n.campaignRemaining, e.campaignRechargeAt = n.campaignRechargeAt, e;
}
function me(e = localStorage, t = ue) {
	try {
		let n = t === "chronos-age-warriors:v4" ? [de, K] : t === "chronos-age-warriors:admin:v4" ? [fe, q] : t === "chronos-age-warriors:v3" ? [K] : t === "chronos-age-warriors:admin:v3" ? [q] : [], i = e.getItem(t) ?? n.map((t) => e.getItem(t)).find(Boolean);
		if (!i) return Y();
		let a = JSON.parse(i);
		if (![
			2,
			3,
			4,
			5
		].includes(a.version)) return Y();
		let o = "dev-primordial-warrior";
		if (a.ownedWarriors?.[o]) {
			let e = a.ownedWarriors[o];
			a.ownedWarriors.karg || (a.ownedWarriors[s] = {
				...e,
				warriorId: s
			}), delete a.ownedWarriors[o], a.activeWarriorId === o && (a.activeWarriorId = s);
		}
		let c = !!(d[a.activeWarriorId] && a.ownedWarriors?.[a.activeWarriorId]?.warriorId === a.activeWarriorId), l = a.activeWarriorId === "" && Object.keys(a.ownedWarriors ?? {}).length === 0 && a.welcomeChestOpened === !1;
		if (!c && !l || !Array.isArray(a.unlockedSkills)) return Y();
		a.version === 2 && (a.unlockedSkills = [], delete a.pendingLevelChoice);
		for (let e of Object.values(a.ownedWarriors)) delete e.bonusStats, e.level = Number.isInteger(e.level) ? Math.min(10, Math.max(1, e.level)) : 1, e.xp = e.level === 10 ? 0 : Number.isInteger(e.xp) && e.xp >= 0 ? Math.min(e.xp, r(e.level) - 1) : 0;
		delete a.pendingLevelChoice, a.welcomeChestOpened = !!c;
		let u = a;
		delete u.trainingRemaining, delete u.trainingWins, a.version = 5, a.campaignRemaining = Number.isInteger(a.campaignRemaining) ? Math.min(10, Math.max(0, a.campaignRemaining)) : 10, a.campaignRechargeAt = a.campaignRemaining === 10 ? null : Number.isSafeInteger(a.campaignRechargeAt) && (a.campaignRechargeAt ?? 0) > 0 ? a.campaignRechargeAt : Date.now() + 12e5, a.defeatedNodes = Array.isArray(a.defeatedNodes) ? [...new Set(a.defeatedNodes.filter((e) => Number.isInteger(e) && e >= 1 && e <= 20))] : [], a.campaignNode = Number.isInteger(a.campaignNode) ? Math.min(20, Math.max(1, a.campaignNode)) : 1;
		let f = a.defeatedNodes.includes(20) || a.eraRewardClaimed === !0;
		a.eraRewardClaimed === !0 && !a.defeatedNodes.includes(20) && a.defeatedNodes.push(20), a.nemesisUnlocked = f || a.nemesisUnlocked === !0, a.nemesisDefeatedNodes = Array.isArray(a.nemesisDefeatedNodes) ? [...new Set(a.nemesisDefeatedNodes.filter((e) => Number.isInteger(e) && e >= 1 && e <= 20))] : [], a.nemesisCampaignNode = Number.isInteger(a.nemesisCampaignNode) ? Math.min(20, Math.max(1, a.nemesisCampaignNode)) : 1, a.nemesisCompleted = a.nemesisCompleted === !0 || a.nemesisDefeatedNodes.includes(20), a.nemesisCompleted && !a.nemesisDefeatedNodes.includes(20) && a.nemesisDefeatedNodes.push(20), a.normalBossFirstClearRewardClaimed = a.normalBossFirstClearRewardClaimed === !0, a.nemesisBossFirstClearRewardClaimed = a.nemesisBossFirstClearRewardClaimed === !0, delete a.bossTrophyPending, delete a.eraRewardClaimed, a.riftChestCount = Number.isSafeInteger(a.riftChestCount) && a.riftChestCount >= 0 ? a.riftChestCount : 0, a.riftLossStreak = Number.isSafeInteger(a.riftLossStreak) && a.riftLossStreak >= 0 ? a.riftLossStreak : 0, a.equipmentChestCount = Number.isSafeInteger(a.equipmentChestCount) && a.equipmentChestCount >= 0 ? a.equipmentChestCount : 0, a.warriorChestCount = Number.isSafeInteger(a.warriorChestCount) && a.warriorChestCount >= 0 ? a.warriorChestCount : 0;
		let p = /* @__PURE__ */ new Set();
		a.pendingWarriorRecycles = Array.isArray(a.pendingWarriorRecycles) ? a.pendingWarriorRecycles.filter((e) => !e || typeof e.id != "string" || !e.id || p.has(e.id) || !d[e.warriorId] || !a.ownedWarriors[e.warriorId] ? !1 : (p.add(e.id), !0)) : [];
		let m = a.expedition;
		a.expedition = m && a.ownedWarriors[m.warriorId] && Number.isSafeInteger(m.startedAt) && m.startedAt > 0 ? m : null;
		let h = a.expeditionReturn;
		a.expeditionReturn = h && typeof h.id == "string" && a.ownedWarriors[h.warriorId] && Number.isSafeInteger(h.elapsedMs) && h.elapsedMs >= 0 && h.elapsedMs <= 864e5 && Number.isSafeInteger(h.xp) && h.xp >= 0 && Number.isSafeInteger(h.coins) && h.coins >= 0 && Array.isArray(h.equipmentIds) && h.equipmentIds.every((e) => typeof e == "string") && typeof h.equipmentChest == "boolean" && typeof h.warriorChest == "boolean" && Number.isSafeInteger(h.levelsGained) && h.levelsGained >= 0 ? h : null;
		let g = a.riftRun;
		a.riftRun = g && /^\d{4}-\d{2}-\d{2}$/.test(g.dateKey) && Number.isInteger(g.stage) && g.stage >= 0 && g.stage < 5 && Array.isArray(g.lineup) && g.lineup.length === 5 && g.lineup.every((e) => oe.some((t) => t === e)) && Number.isSafeInteger(g.seed) && g.seed >= 0 && g.seed <= 4294967295 && se.some((e) => e === g.difficulty) && (g.warriorId === "" || a.ownedWarriors[g.warriorId]) && Number.isSafeInteger(g.earnedCoins) && g.earnedCoins >= 0 && Number.isSafeInteger(g.earnedXp) && g.earnedXp >= 0 && [
			"ready",
			"fighting",
			"between",
			"lost",
			"quit",
			"complete"
		].includes(g.status) ? g : null, a.adventureWins = Number.isSafeInteger(a.adventureWins) && a.adventureWins >= 0 ? a.adventureWins : 0, a.riftWins = Number.isSafeInteger(a.riftWins) && a.riftWins >= 0 ? a.riftWins : 0, a.duelWins = Number.isSafeInteger(a.duelWins) && a.duelWins >= 0 ? a.duelWins : 0, a.owned ??= {};
		for (let e of Object.values(a.owned)) e.quantity = Number.isSafeInteger(e.quantity) && (e.quantity ?? 0) > 0 ? e.quantity : 1;
		if (a.loadouts ??= {}, a.loadouts[o] && (a.loadouts[s] ??= a.loadouts[o], delete a.loadouts[o]), c) {
			a.loadouts[a.activeWarriorId] ??= {
				weapon: a.equippedWeapon,
				armor: a.equippedArmor
			};
			let e = a.loadouts[a.activeWarriorId];
			a.equippedWeapon = a.owned[e.weapon] ? e.weapon : "", a.equippedArmor = a.owned[e.armor] ? e.armor : "";
		}
		return pe(a);
	} catch {
		return Y();
	}
}
function he(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e;
	if (![
		2,
		3,
		4,
		5
	].includes(t.version) || typeof t.activeWarriorId != "string" || !t.ownedWarriors || typeof t.ownedWarriors != "object" || Array.isArray(t.ownedWarriors) || !Array.isArray(t.unlockedSkills) || !Number.isSafeInteger(t.coins) || t.coins < 0 || !t.activeWarriorId && (Object.keys(t.ownedWarriors).length > 0 || t.welcomeChestOpened !== !1)) return null;
	let n = JSON.stringify(e), r = me({ getItem: () => n }, "account-save");
	return t.activeWarriorId && !r.activeWarriorId ? null : r;
}
//#endregion
//#region src/duelRules.ts
var ge = 10, _e = 12e5, ve = {
	win: {
		xp: 20,
		coins: 20
	},
	loss: {
		xp: 4,
		coins: 0
	}
}, X = {
	Commun: 0,
	"Peu commun": 1,
	Rare: 2,
	Épique: 3,
	Légendaire: 4,
	Mythique: 5
};
function ye(e, t, n) {
	return n ? 20 + 5 * Math.max(0, X[t] - X[e]) : 0;
}
function Z(e) {
	let t = e.activeWarriorId, n = e.ownedWarriors?.[t];
	return !!(d[t] && n?.warriorId === t && Number.isInteger(n.level) && n.level >= 1 && n.level <= 10);
}
function be(e) {
	if (!xe(e)) return null;
	let t = he(e);
	return t && Z(t) ? t : null;
}
function Q(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function xe(e) {
	if (!Q(e) || typeof e.activeWarriorId != "string" || !d[e.activeWarriorId] || !Q(e.ownedWarriors) || !Q(e.owned) || typeof e.equippedWeapon != "string" || typeof e.equippedArmor != "string") return !1;
	for (let [t, n] of Object.entries(e.ownedWarriors)) if (!d[t] || !Q(n) || n.warriorId !== t || !Number.isInteger(n.level) || n.level < 1 || n.level > 10 || !Number.isSafeInteger(n.xp) || n.xp < 0 || (n.level === 10 ? n.xp !== 0 : n.xp >= r(n.level))) return !1;
	if (!Object.hasOwn(e.ownedWarriors, e.activeWarriorId)) return !1;
	let t = new Map(o.map((e) => [e.id, e]));
	for (let [n, r] of Object.entries(e.owned)) if (!t.has(n) || !Q(r) || !Number.isInteger(r.level) || r.level < 1 || !Number.isSafeInteger(r.xp) || r.xp < 0 || r.quantity !== void 0 && (!Number.isSafeInteger(r.quantity) || r.quantity < 1)) return !1;
	let n = (n, r) => typeof r == "string" && (!r || t.get(r)?.type === n && Object.hasOwn(e.owned, r));
	if (!n("weapon", e.equippedWeapon) || !n("armor", e.equippedArmor)) return !1;
	if (e.loadouts !== void 0) {
		if (!Q(e.loadouts)) return !1;
		for (let [t, r] of Object.entries(e.loadouts)) if (!Object.hasOwn(e.ownedWarriors, t) || !Q(r) || !n("weapon", r.weapon) || !n("armor", r.armor)) return !1;
		let t = e.loadouts[e.activeWarriorId];
		if (t && (!Q(t) || t.weapon !== e.equippedWeapon || t.armor !== e.equippedArmor)) return !1;
	}
	return !0;
}
function $(e) {
	if (!Z(e)) throw Error("Warrior actif invalide.");
	let t = p(e);
	return {
		name: t.name,
		stats: x(e),
		skills: [],
		warriorId: t.id,
		level: t.level,
		weapon: e.equippedWeapon,
		armor: e.equippedArmor
	};
}
function Se(e, t, n) {
	let r = $(e), i = $(t), a = C(r, i, n), o = a.winner === "player", s = ve[o ? "win" : "loss"], c = d[r.warriorId].rarity, l = d[i.warriorId].rarity;
	return {
		attacker: r,
		defender: i,
		result: a,
		xp: s.xp,
		coins: s.coins,
		points: ye(c, l, o),
		attackerRarity: c,
		defenderRarity: l
	};
}
function Ce(e, t) {
	let n = structuredClone(e);
	return n.coins += t.coins, D(n, "duel", t.result.winner), w(n, t.xp), W(n);
}
//#endregion
export { ge as DUEL_MAX_CHARGES, _e as DUEL_RECHARGE_MS, ve as DUEL_REWARDS, X as RARITY_TIERS, Ce as applyDuelReward, $ as duelFighter, ye as duelPoints, be as normalizedDuelSave, Se as resolveDuel, xe as strictDuelPayload, Z as validDuelWarrior, d as warriorDefinitions };
