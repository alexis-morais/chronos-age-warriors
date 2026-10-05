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
}, n = {
	"Peu commun": {
		forceHpBudget: 1.02,
		growth: [
			0,
			.035,
			.075,
			.13,
			.21,
			.3,
			.43,
			.59,
			.77,
			1
		]
	},
	Rare: {
		forceHpBudget: 1.06,
		growth: [
			0,
			.065,
			.15,
			.3,
			.48,
			.59,
			.69,
			.79,
			.89,
			1
		]
	},
	Épique: {
		forceHpBudget: 1.16,
		growth: [
			0,
			.1,
			.3,
			.6,
			.88,
			.904,
			.928,
			.952,
			.976,
			1
		]
	},
	Légendaire: {
		forceHpBudget: 1.24,
		growth: [
			0,
			.12,
			.33,
			.62,
			.88,
			.904,
			.928,
			.952,
			.976,
			1
		]
	},
	Mythique: {
		forceHpBudget: 1.3,
		growth: [
			0,
			.14,
			.36,
			.64,
			.86,
			.888,
			.916,
			.944,
			.972,
			1
		]
	}
}, r = {
	asha: "Peu commun",
	rhex: "Peu commun",
	ursak: "Peu commun",
	saar: "Rare",
	morga: "Rare",
	vorka: "Épique",
	urgath: "Légendaire",
	tyrak: "Mythique"
};
function i(e, i) {
	let a = t[e];
	if (!a) throw Error(`Unknown Warrior: ${e}`);
	let o = Number.isFinite(i) ? Math.min(10, Math.max(1, Math.trunc(i))) : 1, s = n[r[e]], [c, l, u, d] = s ? a[0].map((e, t) => {
		let n = Math.round(a[9][t] * (t === 0 || t === 3 ? s.forceHpBudget : 1));
		return Math.round(e + (n - e) * s.growth[o - 1]);
	}) : a[o - 1];
	return {
		strength: c,
		dodge: l,
		speed: u,
		hp: d
	};
}
function a(t) {
	return !Number.isInteger(t) || t < 1 || t >= 10 ? 0 : e[t - 1];
}
//#endregion
//#region src/config.ts
var o = {
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
	campaignDaily: 15,
	maxWarriorLevel: 10
}, s = [
	"Commun",
	"Peu commun",
	"Rare",
	"Épique",
	"Légendaire",
	"Mythique"
], c = [
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
			strength: 65,
			speed: 45,
			dodge: 16
		},
		bonus: "+65 Force · +45 Vitesse · +16 Esquive",
		effect: "Premier coup : +20 % dégâts",
		art: "spear"
	},
	{
		id: "tyrant-claw",
		name: "Griffe du Tyran",
		type: "weapon",
		rarity: "Légendaire",
		stats: {
			strength: 75,
			speed: 14
		},
		bonus: "+75 Force · +14 Vitesse",
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
			hp: 440,
			dodge: 20,
			speed: 32
		},
		bonus: "+440 PV · +20 Esquive · +32 Vitesse",
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
], l = "karg", u = {
	id: l,
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
}, d = (e, t, n, r, i, a, o) => ({
	id: e,
	name: t,
	title: n,
	era: "Primordiale",
	rarity: r,
	warriorClass: i,
	baseStats: a,
	art: `/assets/warriors/primal/${e}.png`,
	artPosition: o
}), f = [
	u,
	d("naya", "Naya", "Ombre des Falaises", "Commun", "Spectre", {
		strength: 8,
		dodge: 13,
		speed: 14,
		hp: 90
	}, "50% 8%"),
	d("brakk", "Brakk", "Brise-Roc", "Commun", "Bastion", {
		strength: 12,
		dodge: 6,
		speed: 7,
		hp: 145
	}, "50% 7%"),
	d("eyla", "Eyla", "Œil de Silex", "Commun", "Tempête", {
		strength: 10,
		dodge: 10,
		speed: 12,
		hp: 100
	}, "50% 9%"),
	d("asha", "Asha", "Voix des Braises", "Peu commun", "Fléau", {
		strength: 11,
		dodge: 10,
		speed: 11,
		hp: 120
	}, "50% 8%"),
	d("rhex", "Rhex", "Meneur de Raptors", "Peu commun", "Héraut", {
		strength: 11,
		dodge: 11,
		speed: 13,
		hp: 115
	}, "50% 10%"),
	d("ursak", "Ursak", "Roi des Cavernes", "Peu commun", "Ravageur", {
		strength: 14,
		dodge: 7,
		speed: 9,
		hp: 150
	}, "50% 5%"),
	d("saar", "Saar", "Croc du Smilodon", "Rare", "Spectre", {
		strength: 15,
		dodge: 16,
		speed: 16,
		hp: 135
	}, "50% 15%"),
	d("morga", "Morga", "Matriarche d’Ivoire", "Rare", "Bastion", {
		strength: 16,
		dodge: 5,
		speed: 7,
		hp: 195
	}, "50% 9%"),
	d("vorka", "Vorka", "Reine d’Obsidienne", "Épique", "Fléau", {
		strength: 18,
		dodge: 12,
		speed: 14,
		hp: 165
	}, "50% 5%"),
	d("urgath", "Urgath", "Titan des Glaces", "Légendaire", "Bastion", {
		strength: 21,
		dodge: 6,
		speed: 8,
		hp: 225
	}, "50% 5%"),
	d("tyrak", "TYRAK", "Roi Primordial", "Mythique", "Ravageur", {
		strength: 23,
		dodge: 8,
		speed: 12,
		hp: 245
	}, "50% 0%")
], p = Object.fromEntries(f.map((e) => [e.id, e]));
function m(e, t) {
	let n = e.ownedWarriors[t], r = p[t];
	if (!n || !r || n.warriorId !== r.id) throw Error("Warrior definition or ownership is missing");
	let a = i(t, n.level);
	return {
		...r,
		level: n.level,
		xp: n.xp,
		stats: a,
		skills: []
	};
}
function h(e) {
	return m(e, e.activeWarriorId);
}
//#endregion
//#region src/warriorPassives.ts
var g = (e, t) => t.map(([t, n, r]) => ({
	id: `${e}-${t}`,
	warriorId: e,
	name: n,
	unlockLevel: t,
	description: r
})), _ = {
	karg: g("karg", [
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
	naya: g("naya", [
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
	brakk: g("brakk", [
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
	eyla: g("eyla", [
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
	asha: g("asha", [
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
	rhex: g("rhex", [
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
	ursak: g("ursak", [
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
	saar: g("saar", [
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
	morga: g("morga", [
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
	vorka: g("vorka", [
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
	urgath: g("urgath", [
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
	tyrak: g("tyrak", [
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
}, v = class {
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
		return this.level >= e && !!_[this.warriorId];
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
function y(e) {
	let t = e >>> 0;
	return () => {
		t += 1831565813;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
var ee = (e) => o.baseDamage + o.strengthScale * e ** o.strengthExponent, te = (e) => Math.min(o.dodgeCap, o.dodgeBase + o.dodgeScale * e / (e + 100)), ne = (e) => (e + o.speedOffset) ** o.speedExponent;
function b(e) {
	return { ...c.find((t) => t.id === e)?.stats };
}
function x(e, t, n = "", r = "") {
	let a = i(e, t);
	for (let e of [n, r]) {
		let t = b(e);
		for (let [e, n] of Object.entries(t)) a[e] += n;
	}
	return a;
}
function S(e, t = e.activeWarriorId) {
	let n = m(e, t), r = t === e.activeWarriorId ? {
		weapon: e.equippedWeapon,
		armor: e.equippedArmor
	} : e.loadouts[t] ?? {
		weapon: "",
		armor: ""
	};
	return x(t, n.level, e.owned[r.weapon] ? r.weapon : "", e.owned[r.armor] ? r.armor : "");
}
function C(e, t) {
	return e.skills.includes(t);
}
function w(e, t, n) {
	let r = y(n), i = new v(e.warriorId, e.level), a = new v(t.warriorId, t.level), s = e.stats.hp, c = t.stats.hp, l = null, u = 0, d = 0, f = 0, p = 0, m = 0, h = !1, g = !1, _ = 0, b = 0, x = 0, S = 0, w = 0, T = 0, E = [], D = () => ({
		playerHp: Math.max(0, Math.round(s)),
		enemyHp: Math.max(0, Math.round(c))
	});
	for (; s > 0 && c > 0 && f < 160 && (f += 1, !(x > 0 && (c -= S, x--, E.push({
		type: "bleed",
		actor: "player",
		target: "enemy",
		value: S,
		label: "Saignement",
		...D()
	}), c <= 0) || w > 0 && (s -= T, w--, E.push({
		type: "bleed",
		actor: "enemy",
		target: "player",
		value: T,
		label: "Saignement",
		...D()
	}), s <= 0)));) {
		let n = ne(e.stats.speed) * (C(e, "Accélération") ? 1.12 : 1) * i.actionRateMultiplier() * a.opponentRateMultiplier(), f = ne(t.stats.speed) * (C(t, "Accélération") ? 1.12 : 1) * a.actionRateMultiplier() * i.opponentRateMultiplier(), v = r() < n / (n + f) ? "player" : "enemy";
		v === l && u >= o.maxConsecutiveActions && (v = v === "player" ? "enemy" : "player"), u = v === l ? u + 1 : 1, d = Math.max(d, u), l = v;
		let y = v === "player" ? i : a, O = v === "player" ? a : i;
		y.onAction();
		let k = v === "player" ? "enemy" : "player", A = v === "player" ? e : t, j = v === "player" ? t : e, M = (e) => {
			k === "player" ? s -= e : c -= e, E.push({
				type: "damage",
				actor: v,
				target: k,
				value: e,
				...D()
			});
			let t = k === "player" ? s : c, n = O.onDamageTaken(t, j.stats.hp);
			if (n.heal > 0) {
				let e = Math.max(0, t), r = Math.min(j.stats.hp, e + n.heal);
				k === "player" ? s = r : c = r, E.push({
					type: "heal",
					actor: k,
					target: k,
					value: r - e,
					label: "Endurance de Matriarche",
					...D()
				});
			}
			for (let e of n.labels) E.push({
				type: "skill",
				actor: k,
				target: k,
				label: e,
				...D()
			});
			O.updateThresholds(k === "player" ? s : c, j.stats.hp);
		}, N = v === "player" ? ++p : ++m;
		E.push({
			type: "attack",
			actor: v,
			target: k,
			...D()
		});
		let P = (C(A, "Précision") ? .05 : 0) + (A.weapon === "hunter-bow" ? .03 : 0), F = Math.max(0, te(j.stats.dodge) - P), I = O.dodgeChance(F, o.dodgeCap);
		if (r() < I) {
			E.push({
				type: "dodge",
				actor: k,
				target: v,
				label: "Esquive",
				...D()
			}), O.onDodge(), y.onMiss();
			continue;
		}
		if (O.blockChance() > 0 && r() < O.blockChance()) {
			O.onBlock(), E.push({
				type: "skill",
				actor: k,
				target: v,
				label: "Parade",
				...D()
			});
			continue;
		}
		let L = ee(A.stats.strength) * (.9 + r() * .2);
		N === 1 && C(A, "Premier Sang") && (L *= 1.22), C(A, "Frappe Dévastatrice") && r() < .12 && (L *= 1.45, E.push({
			type: "skill",
			actor: v,
			target: k,
			label: "Frappe Dévastatrice",
			...D()
		})), C(A, "Rage") && (L *= 1 + (1 - (v === "player" ? s / e.stats.hp : c / t.stats.hp)) * .22), C(A, "Opportuniste") && (k === "player" ? s / e.stats.hp : c / t.stats.hp) < .3 && (L *= 1.25), A.weapon === "flint-club" && r() < .05 && (L *= 1.2), A.weapon === "bone-spear" && N === 1 && (L *= 1.1), A.weapon === "storm-javelin" && N === 1 && (L *= 1.2), A.weapon === "tyrant-claw" && r() < .12 && (L *= 1.5), A.weapon === "titan-heart" && r() < .07 && (L *= 1.8);
		let R = L, z = r() < o.criticalChance + (C(A, "Élan") ? .03 : 0);
		z && (L *= j.armor === "mammoth-plate" ? 1 + (o.criticalMultiplier - 1) * .8 : o.criticalMultiplier, E.push({
			type: "critical",
			actor: v,
			target: k,
			label: "Critique",
			...D()
		}));
		let B = k === "player" ? s : c, V = k === "player" ? w > 0 || _ > 0 : x > 0 || b > 0, H = A.warriorId ? y.onSuccessfulAttack(B, j.stats.hp, V, r) : null;
		if (H) {
			L *= H.multiplier;
			for (let e of H.labels) E.push({
				type: "skill",
				actor: v,
				target: k,
				label: e,
				...D()
			});
			H.consumeBleed && (k === "player" ? (w = 0, _ = 0) : (x = 0, b = 0));
		}
		let U = A.weapon === "mammoth-spear" && r() < .1;
		U && z && j.armor === "mammoth-plate" && (L *= o.criticalMultiplier / (1 + (o.criticalMultiplier - 1) * .8));
		let W = L;
		U || (C(j, "Peau Dure") && (L *= .9), C(j, "Parade") && r() < .1 && (L *= .55, E.push({
			type: "skill",
			actor: k,
			target: v,
			label: "Parade",
			...D()
		})), ["hunter-hides", "reed-mantle"].includes(j.armor ?? "") && O.receivedHits === 0 && (L *= .95), j.armor === "raptor-scales" && O.receivedHits === 0 && (L *= .9), j.armor === "smilodon-cloak" && O.receivedHits === 0 && (L *= .85), j.armor === "bone-harness" && r() < .05 && (L *= .75), j.armor === "white-titan-fur" && (k === "player" ? s / e.stats.hp : c / t.stats.hp) > .5 && (L *= .92), j.armor === "primordial-titan-skin" && O.receivedHits < 3 && (L *= .8), j.armor === "ancestor-guard" && O.receivedHits < 3 && (L *= .85), L *= O.incomingMultiplier(B, j.stats.hp));
		let G = R * L / W;
		if (L = Math.max(1, Math.round(L)), M(L), H?.applyBleed && (k === "player" ? s > 0 : c > 0) && (k === "player" ? (w = 2, T = Math.max(1, Math.round(L * .1))) : (x = 2, S = Math.max(1, Math.round(L * .1)))), H?.bonusStrikes.length && (k === "player" ? s > 0 : c > 0)) for (let e of H.bonusStrikes) {
			if (k === "player" ? s <= 0 : c <= 0) break;
			let t = Math.max(1, Math.round(G * e));
			E.push({
				type: "attack",
				actor: v,
				target: k,
				label: "Coup supplémentaire",
				...D()
			}), M(t);
		}
		if (C(A, "Vampirisme")) {
			let n = Math.max(1, Math.round(L * .08));
			v === "player" ? s = Math.min(e.stats.hp, s + n) : c = Math.min(t.stats.hp, c + n), E.push({
				type: "heal",
				actor: v,
				target: v,
				value: n,
				label: "Vampirisme",
				...D()
			});
		}
		let K = C(A, "Saignement") ? .12 : A.weapon === "obsidian-axe" ? .06 : A.weapon === "volcanic-hammer" ? .1 : 0;
		r() < K && (k === "player" ? _ = 2 : b = 2, E.push({
			type: "skill",
			actor: v,
			target: k,
			label: A.weapon === "volcanic-hammer" ? "Brûlure" : "Saignement",
			...D()
		})), j.armor === "volcanic-shell" && r() < .1 && (v === "player" ? _ = 2 : b = 2, E.push({
			type: "skill",
			actor: k,
			target: v,
			label: "Brûlure",
			...D()
		})), _ > 0 && (s -= 3, --_, E.push({
			type: "bleed",
			actor: "enemy",
			target: "player",
			value: 3,
			...D()
		})), b > 0 && (c -= 3, --b, E.push({
			type: "bleed",
			actor: "player",
			target: "enemy",
			value: 3,
			...D()
		})), s <= 0 && C(e, "Second Souffle") && !h && (s = Math.round(e.stats.hp * .18), h = !0, E.push({
			type: "heal",
			actor: "player",
			target: "player",
			value: s,
			label: "Second Souffle",
			...D()
		})), c <= 0 && C(t, "Second Souffle") && !g && (c = Math.round(t.stats.hp * .18), g = !0, E.push({
			type: "heal",
			actor: "enemy",
			target: "enemy",
			value: c,
			label: "Second Souffle",
			...D()
		}));
		let q = C(A, "Double Frappe") ? .1 : A.weapon === "smilodon-fangs" ? .08 : 0;
		if (r() < q && s > 0 && c > 0) {
			let n = Math.max(1, Math.round(G * .5));
			E.push({
				type: "attack",
				actor: v,
				target: k,
				label: "Coup supplémentaire",
				...D()
			}), M(n), s <= 0 && C(e, "Second Souffle") && !h && (s = Math.round(e.stats.hp * .18), h = !0, E.push({
				type: "heal",
				actor: "player",
				target: "player",
				value: s,
				label: "Second Souffle",
				...D()
			})), c <= 0 && C(t, "Second Souffle") && !g && (c = Math.round(t.stats.hp * .18), g = !0, E.push({
				type: "heal",
				actor: "enemy",
				target: "enemy",
				value: c,
				label: "Second Souffle",
				...D()
			}));
		}
	}
	let O = c <= 0 ? "player" : "enemy";
	return E.push({
		type: "ko",
		actor: O,
		target: O === "player" ? "enemy" : "player",
		label: "K.O.",
		...D()
	}), {
		winner: O,
		events: E,
		enemy: t,
		consecutiveMax: d
	};
}
function T(e, t, n = Math.random) {
	let r = e.ownedWarriors[e.activeWarriorId];
	if (!r || r.level >= o.maxWarriorLevel || !Number.isFinite(t) || t <= 0) return 0;
	r.xp += Math.trunc(t);
	let i = 0;
	for (; r.level < o.maxWarriorLevel && r.xp >= a(r.level);) r.xp -= a(r.level), r.level += 1, i += 1;
	return r.level >= o.maxWarriorLevel && (r.xp = 0), i;
}
function E(e, t = e.activeWarriorId) {
	let n = e.ownedWarriors[t];
	if (!n) return 0;
	let r = n.xp;
	for (let e = 1; e < n.level; e++) r += a(e);
	return r;
}
function D(e, t, n = e.activeWarriorId) {
	let r = E(e, n), i = e.activeWarriorId;
	return e.activeWarriorId = n, T(e, t), e.activeWarriorId = i, E(e, n) - r;
}
//#endregion
//#region src/victories.ts
var O = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 0 ? e : 0;
function k(e) {
	return O(e.adventureWins) + O(e.riftWins) + O(e.duelWins);
}
function A(e, t, n) {
	n === "player" && (e.totalWins = O(e.totalWins) + 1, t === "adventure" ? e.adventureWins = O(e.adventureWins) + 1 : t === "rift" ? e.riftWins = O(e.riftWins) + 1 : e.duelWins = O(e.duelWins) + 1);
}
//#endregion
//#region src/badgeSystem.ts
var j = {
	bronze: 50,
	silver: 100,
	gold: 200,
	platinum: 500
}, M = 1500, N = [
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
	"primordial-titan-skin",
	"storm-javelin",
	"reed-mantle",
	"raptor-scales",
	"smilodon-cloak",
	"ancestor-guard"
], P = (e, t) => ({
	current: Math.min(Math.max(Number.isFinite(e) ? e : 0, 0), t),
	target: t
}), F = (e) => new Set(e.defeatedNodes.filter((e) => Number.isInteger(e) && e >= 1 && e <= 20)), I = (e) => f.filter(({ id: t }) => !!e.ownedWarriors[t]).length, L = (e) => Object.keys(e.ownedWarriors).filter((t) => p[t] && e.ownedWarriors[t]?.warriorId === t), R = (e) => L(e).length, z = (e, t, n = !1) => L(e).some((e) => {
	let r = p[e].rarity;
	return n ? s.indexOf(r) >= s.indexOf(t) : r === t;
}), B = (e) => N.filter((t) => (e.owned[t]?.quantity ?? 0) > 0).length, V = (e, t) => e.badges.some((e) => e.id === t);
function H(e) {
	return e.nemesisCompleted || e.nemesisDefeatedNodes.includes(20);
}
var U = [
	{
		id: "primal-first-level",
		title: "Premiers pas dans le Primal",
		description: "Terminez le premier niveau de l’Ère Primordiale.",
		grade: "bronze",
		binary: !0,
		progress: (e) => P(Number(F(e).has(1)), 1)
	},
	{
		id: "primal-three-warriors",
		title: "Tribu naissante",
		description: "Obtenez 3 Warriors de l’Ère Primordiale.",
		grade: "bronze",
		progress: (e) => P(I(e), 3)
	},
	{
		id: "primal-three-equipment",
		title: "Équipement de survie",
		description: "Obtenez 3 équipements primordiaux différents.",
		grade: "bronze",
		progress: (e) => P(B(e), 3)
	},
	{
		id: "primal-ten-levels",
		title: "Au cœur de la jungle",
		description: "Terminez 10 niveaux de l’Ère Primordiale.",
		grade: "silver",
		progress: (e) => P(F(e).size, 10)
	},
	{
		id: "primal-first-elite",
		title: "Briseur d’Élite",
		description: "Vainquez votre premier Élite Primal.",
		grade: "silver",
		binary: !0,
		progress: (e) => P(Number([
			5,
			10,
			15
		].some((t) => F(e).has(t)) || V(e, "first-elite")), 1)
	},
	{
		id: "primal-six-warriors",
		title: "Meute primordiale",
		description: "Obtenez 6 Warriors de l’Ère Primordiale.",
		grade: "silver",
		progress: (e) => P(I(e), 6)
	},
	{
		id: "primal-eight-equipment",
		title: "Arsenal de chasse",
		description: "Obtenez 8 équipements primordiaux différents.",
		grade: "silver",
		progress: (e) => P(B(e), 8)
	},
	{
		id: "primal-conqueror",
		title: "Conquérant primordial",
		description: "Vainquez le Boss final de l’Aventure Primal.",
		grade: "gold",
		binary: !0,
		progress: (e) => P(Number(F(e).has(20) || V(e, "boss")), 1)
	},
	{
		id: "primal-all-warriors",
		title: "Panthéon primordial",
		description: "Obtenez les 12 Warriors primordiaux.",
		grade: "gold",
		progress: (e) => P(I(e), f.length)
	},
	{
		id: "primal-all-equipment",
		title: "Arsenal primordial",
		description: "Obtenez les 20 équipements primordiaux.",
		grade: "gold",
		progress: (e) => P(B(e), N.length)
	},
	{
		id: "primal-tyrak",
		title: "Roi parmi les rois",
		description: "Obtenez Tyrak, Roi Primordial.",
		grade: "platinum",
		binary: !0,
		progress: (e) => P(Number(!!e.ownedWarriors.tyrak), 1)
	},
	{
		id: "primal-nemesis",
		title: "Dominateur du Primal",
		description: "Terminez l’Ère Primordiale en Némésis.",
		grade: "platinum",
		binary: !0,
		progress: (e) => P(Number(H(e)), 1)
	}
];
function W(e) {
	return L(e).filter((t) => e.ownedWarriors[t].level >= 10).length;
}
var G = [
	{
		id: "exploit-first-impact",
		title: "Premier Impact",
		description: "Remportez votre premier combat.",
		grade: "bronze",
		binary: !0,
		progress: (e) => P(k(e), 1)
	},
	{
		id: "exploit-first-reinforcements",
		title: "Premiers renforts",
		description: "Rassemblez 5 Warriors différents.",
		grade: "bronze",
		progress: (e) => P(R(e), 5)
	},
	{
		id: "exploit-rare-spark",
		title: "Éclat rare",
		description: "Obtenez votre premier Warrior Rare ou supérieur.",
		grade: "bronze",
		binary: !0,
		progress: (e) => P(Number(z(e, "Rare", !0)), 1)
	},
	{
		id: "exploit-first-duel",
		title: "Premier duel",
		description: "Remportez votre premier Duel.",
		grade: "bronze",
		binary: !0,
		progress: (e) => P(e.duelWins, 1)
	},
	{
		id: "exploit-seasoned-fighter",
		title: "Combattant aguerri",
		description: "Remportez 25 combats.",
		grade: "silver",
		progress: (e) => P(k(e), 25)
	},
	{
		id: "exploit-chronos-collector",
		title: "Collectionneur de Chronos",
		description: "Rassemblez 10 Warriors différents.",
		grade: "silver",
		progress: (e) => P(R(e), 10)
	},
	{
		id: "exploit-ascension",
		title: "Ascension",
		description: "Amenez un Warrior au niveau 10.",
		grade: "silver",
		binary: !0,
		progress: (e) => P(W(e), 1)
	},
	{
		id: "exploit-war-machine",
		title: "Machine de guerre",
		description: "Remportez 100 combats.",
		grade: "gold",
		progress: (e) => P(k(e), 100)
	},
	{
		id: "exploit-awakened-legend",
		title: "Légende éveillée",
		description: "Obtenez votre premier Warrior Légendaire.",
		grade: "gold",
		binary: !0,
		progress: (e) => P(Number(z(e, "Légendaire")), 1)
	},
	{
		id: "exploit-elite-squad",
		title: "Escouade d’élite",
		description: "Amenez 6 Warriors au niveau 10.",
		grade: "gold",
		binary: !0,
		progress: (e) => P(W(e), 6)
	},
	{
		id: "exploit-feared-rival",
		title: "Rival redouté",
		description: "Remportez 25 Duels.",
		grade: "gold",
		progress: (e) => P(e.duelWins, 25)
	},
	{
		id: "exploit-mythic-fracture",
		title: "Fracture mythique",
		description: "Obtenez votre premier Warrior Mythique.",
		grade: "platinum",
		binary: !0,
		progress: (e) => P(Number(z(e, "Mythique")), 1)
	}
], K = "primal-mastery", q = (e, t) => e.badges.some((e) => e.id === t), re = (e) => U.every(({ id: t }) => q(e, t));
function ie(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
	let n = [...U, ...G].filter((t) => {
		if (q(e, t.id)) return !1;
		let { current: n, target: r } = t.progress(e);
		return n >= r;
	}), r = q(e, "primal-all-warriors") && !q(e, "primal-warriors-v015-reward");
	if (!n.length && !r && (q(e, "primal-mastery") || !re(e))) return {
		save: e,
		granted: []
	};
	let i = structuredClone(e), a = n.map((e) => {
		let n = e.id === "primal-all-warriors" ? M : j[e.grade];
		return i.badges.push({
			id: e.id,
			unlockedAt: t
		}), i.coins += n, {
			id: e.id,
			title: e.title,
			coins: n
		};
	});
	return q(e, "primal-all-warriors") && !q(i, "primal-warriors-v015-reward") ? (i.badges.push({
		id: "primal-warriors-v015-reward",
		unlockedAt: t
	}), i.coins += M - j.gold, a.push({
		id: "primal-warriors-v015-reward",
		title: "Panthéon primordial · complément V0.15",
		coins: M - j.gold
	})) : n.some(({ id: e }) => e === "primal-all-warriors") && i.badges.push({
		id: "primal-warriors-v015-reward",
		unlockedAt: t
	}), re(i) && !q(i, "primal-mastery") && (i.badges.push({
		id: K,
		unlockedAt: t
	}), i.coins += M, a.push({
		id: K,
		title: "Maîtrise Primordiale",
		coins: M
	})), {
		save: i,
		granted: a
	};
}
//#endregion
//#region src/art/assetsV04.ts
var ae = [
	"flint-club",
	"bone-spear",
	"obsidian-axe",
	"hunter-bow",
	"smilodon-fangs",
	"mammoth-spear",
	"volcanic-hammer",
	"tyrant-claw",
	"titan-heart"
], oe = [
	"hunter-hides",
	"bone-harness",
	"mammoth-plate",
	"volcanic-shell",
	"white-titan-fur",
	"primordial-titan-skin"
], se = [
	"tribal-hunter",
	"tribal-warrior",
	"cave-brute",
	"shaman",
	"raptor",
	"smilodon",
	"mammoth"
];
new Set(ae), new Set(oe), new Set(se);
//#endregion
//#region src/rift.ts
var ce = [
	100,
	90,
	82,
	74,
	68,
	62,
	56,
	50
], J = 12e5;
function le(e, t, n) {
	let r = Math.min(15, Math.max(0, Math.trunc(e)));
	if (r === 15) return {
		charges: r,
		nextAt: null
	};
	if (t === null || !Number.isFinite(t)) return {
		charges: r,
		nextAt: n + J
	};
	if (n < t) return {
		charges: r,
		nextAt: t
	};
	let i = 1 + Math.floor((n - t) / J), a = Math.min(15, r + i);
	return {
		charges: a,
		nextAt: a === 15 ? null : t + i * J
	};
}
function ue(e, t = Date.now()) {
	let n = le(e.campaignRemaining, e.campaignRechargeAt, t);
	return n.charges === e.campaignRemaining && n.nextAt === e.campaignRechargeAt ? e : {
		...e,
		campaignRemaining: n.charges,
		campaignRechargeAt: n.nextAt
	};
}
//#endregion
//#region src/storage.ts
var de = "chronos-age-warriors:v4", fe = "chronos-age-warriors:v3", pe = "chronos-age-warriors:admin:v3", me = "chronos-age-warriors:v2", he = "chronos-age-warriors:admin:v2", ge = (e = /* @__PURE__ */ new Date()) => e.toLocaleDateString("sv-SE");
function Y() {
	return {
		version: 6,
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
		campaignRemaining: 15,
		campaignRechargeAt: null,
		nemesisUnlocked: !1,
		nemesisCampaignNode: 1,
		nemesisDefeatedNodes: [],
		nemesisCompleted: !1,
		normalBossFirstClearRewardClaimed: !1,
		nemesisBossFirstClearRewardClaimed: !1,
		loadouts: {},
		personalClears: {},
		campaignBattleSequence: 0,
		equipmentRecycleSequence: 0,
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
		lastReset: ge()
	};
}
function _e(e, t = ge()) {
	e.lastReset = t;
	let n = ue(e);
	return e.campaignRemaining = n.campaignRemaining, e.campaignRechargeAt = n.campaignRechargeAt, e;
}
function ve(e = localStorage, t = de) {
	try {
		let n = t === "chronos-age-warriors:v4" ? [fe, me] : t === "chronos-age-warriors:admin:v4" ? [pe, he] : t === "chronos-age-warriors:v3" ? [me] : t === "chronos-age-warriors:admin:v3" ? [he] : [], r = e.getItem(t) ?? n.map((t) => e.getItem(t)).find(Boolean);
		if (!r) return Y();
		let i = JSON.parse(r);
		if (![
			2,
			3,
			4,
			5,
			6
		].includes(i.version)) return Y();
		let o = i.version < 6, s = "dev-primordial-warrior";
		if (i.ownedWarriors?.[s]) {
			let e = i.ownedWarriors[s];
			i.ownedWarriors.karg || (i.ownedWarriors[l] = {
				...e,
				warriorId: l
			}), delete i.ownedWarriors[s], i.activeWarriorId === s && (i.activeWarriorId = l);
		}
		let c = !!(p[i.activeWarriorId] && i.ownedWarriors?.[i.activeWarriorId]?.warriorId === i.activeWarriorId), u = i.activeWarriorId === "" && Object.keys(i.ownedWarriors ?? {}).length === 0 && i.welcomeChestOpened === !1;
		if (!c && !u || !Array.isArray(i.unlockedSkills)) return Y();
		i.version === 2 && (i.unlockedSkills = [], delete i.pendingLevelChoice);
		for (let e of Object.values(i.ownedWarriors)) delete e.bonusStats, e.level = Number.isInteger(e.level) ? Math.min(10, Math.max(1, e.level)) : 1, e.xp = e.level === 10 ? 0 : Number.isInteger(e.xp) && e.xp >= 0 ? Math.min(e.xp, a(e.level) - 1) : 0;
		delete i.pendingLevelChoice, i.welcomeChestOpened = !!c;
		let d = i;
		delete d.trainingRemaining, delete d.trainingWins, i.version = 6, o && i.campaignRemaining === 10 && (i.campaignRemaining = 15);
		let f = i.personalClears;
		if (i.personalClears = {}, !o && f && typeof f == "object" && !Array.isArray(f)) for (let e of Object.keys(i.ownedWarriors)) {
			let t = f[e];
			if (!t || typeof t != "object") continue;
			let n = (e) => Array.isArray(e) ? [...new Set(e.filter((e) => Number.isInteger(e) && e >= 1 && e <= 20))].sort((e, t) => e - t) : [];
			i.personalClears[e] = {
				normal: n(t.normal),
				nemesis: n(t.nemesis)
			};
		}
		for (let e of ["campaignBattleSequence", "equipmentRecycleSequence"]) i[e] = !o && Number.isSafeInteger(i[e]) && i[e] >= 0 ? i[e] : 0;
		i.campaignRemaining = Number.isInteger(i.campaignRemaining) ? Math.min(15, Math.max(0, i.campaignRemaining)) : 15, i.campaignRechargeAt = i.campaignRemaining === 15 ? null : Number.isSafeInteger(i.campaignRechargeAt) && (i.campaignRechargeAt ?? 0) > 0 ? i.campaignRechargeAt : Date.now() + 12e5, i.defeatedNodes = Array.isArray(i.defeatedNodes) ? [...new Set(i.defeatedNodes.filter((e) => Number.isInteger(e) && e >= 1 && e <= 20))] : [], i.campaignNode = Number.isInteger(i.campaignNode) ? Math.min(20, Math.max(1, i.campaignNode)) : 1;
		let m = i.defeatedNodes.includes(20) || i.eraRewardClaimed === !0;
		i.eraRewardClaimed === !0 && !i.defeatedNodes.includes(20) && i.defeatedNodes.push(20), i.nemesisUnlocked = m || i.nemesisUnlocked === !0, i.nemesisDefeatedNodes = Array.isArray(i.nemesisDefeatedNodes) ? [...new Set(i.nemesisDefeatedNodes.filter((e) => Number.isInteger(e) && e >= 1 && e <= 20))] : [], i.nemesisCampaignNode = Number.isInteger(i.nemesisCampaignNode) ? Math.min(20, Math.max(1, i.nemesisCampaignNode)) : 1, i.nemesisCompleted = i.nemesisCompleted === !0 || i.nemesisDefeatedNodes.includes(20), i.nemesisCompleted && !i.nemesisDefeatedNodes.includes(20) && i.nemesisDefeatedNodes.push(20), i.normalBossFirstClearRewardClaimed = i.normalBossFirstClearRewardClaimed === !0 || o && m, i.nemesisBossFirstClearRewardClaimed = i.nemesisBossFirstClearRewardClaimed === !0 || o && i.nemesisCompleted, delete i.bossTrophyPending, delete i.eraRewardClaimed, i.riftChestCount = Number.isSafeInteger(i.riftChestCount) && i.riftChestCount >= 0 ? i.riftChestCount : 0, i.riftLossStreak = Number.isSafeInteger(i.riftLossStreak) && i.riftLossStreak >= 0 ? i.riftLossStreak : 0, i.equipmentChestCount = Number.isSafeInteger(i.equipmentChestCount) && i.equipmentChestCount >= 0 ? i.equipmentChestCount : 0, i.warriorChestCount = Number.isSafeInteger(i.warriorChestCount) && i.warriorChestCount >= 0 ? i.warriorChestCount : 0;
		let h = /* @__PURE__ */ new Set();
		i.pendingWarriorRecycles = Array.isArray(i.pendingWarriorRecycles) ? i.pendingWarriorRecycles.filter((e) => !e || typeof e.id != "string" || !e.id || h.has(e.id) || !p[e.warriorId] || !i.ownedWarriors[e.warriorId] ? !1 : (h.add(e.id), !0)) : [];
		let g = i.expedition;
		i.expedition = g && i.ownedWarriors[g.warriorId] && Number.isSafeInteger(g.startedAt) && g.startedAt > 0 ? g : null;
		let _ = i.expeditionReturn;
		i.expeditionReturn = _ && typeof _.id == "string" && i.ownedWarriors[_.warriorId] && Number.isSafeInteger(_.elapsedMs) && _.elapsedMs >= 0 && _.elapsedMs <= 864e5 && Number.isSafeInteger(_.xp) && _.xp >= 0 && Number.isSafeInteger(_.coins) && _.coins >= 0 && Array.isArray(_.equipmentIds) && _.equipmentIds.every((e) => typeof e == "string") && typeof _.equipmentChest == "boolean" && typeof _.warriorChest == "boolean" && Number.isSafeInteger(_.levelsGained) && _.levelsGained >= 0 ? _ : null, o && i.expeditionReturn && i.ownedWarriors[i.expeditionReturn.warriorId].level === 10 && i.expeditionReturn.levelsGained === 0 && (i.expeditionReturn.xp = 0);
		let v = i.riftRun;
		i.riftRun = v && /^\d{4}-\d{2}-\d{2}$/.test(v.dateKey) && Number.isInteger(v.stage) && v.stage >= 0 && v.stage < 5 && Array.isArray(v.lineup) && v.lineup.length === 5 && v.lineup.every((e) => se.some((t) => t === e)) && Number.isSafeInteger(v.seed) && v.seed >= 0 && v.seed <= 4294967295 && ce.some((e) => e === v.difficulty) && (v.warriorId === "" || i.ownedWarriors[v.warriorId]) && Number.isSafeInteger(v.earnedCoins) && v.earnedCoins >= 0 && Number.isSafeInteger(v.earnedXp) && v.earnedXp >= 0 && [
			"ready",
			"fighting",
			"between",
			"lost",
			"quit",
			"complete"
		].includes(v.status) ? v : null, i.adventureWins = Number.isSafeInteger(i.adventureWins) && i.adventureWins >= 0 ? i.adventureWins : 0, i.riftWins = Number.isSafeInteger(i.riftWins) && i.riftWins >= 0 ? i.riftWins : 0, i.duelWins = Number.isSafeInteger(i.duelWins) && i.duelWins >= 0 ? i.duelWins : 0, i.owned ??= {};
		for (let e of Object.values(i.owned)) e.quantity = Number.isSafeInteger(e.quantity) && (e.quantity ?? 0) > 0 ? e.quantity : 1;
		if (i.loadouts ??= {}, i.loadouts[s] && (i.loadouts[l] ??= i.loadouts[s], delete i.loadouts[s]), c) {
			i.loadouts[i.activeWarriorId] ??= {
				weapon: i.equippedWeapon,
				armor: i.equippedArmor
			};
			let e = i.loadouts[i.activeWarriorId];
			i.equippedWeapon = i.owned[e.weapon] ? e.weapon : "", i.equippedArmor = i.owned[e.armor] ? e.armor : "";
		}
		return _e(i);
	} catch {
		return Y();
	}
}
function ye(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e;
	if (![
		2,
		3,
		4,
		5,
		6
	].includes(t.version) || typeof t.activeWarriorId != "string" || !t.ownedWarriors || typeof t.ownedWarriors != "object" || Array.isArray(t.ownedWarriors) || !Array.isArray(t.unlockedSkills) || !Number.isSafeInteger(t.coins) || t.coins < 0 || !t.activeWarriorId && (Object.keys(t.ownedWarriors).length > 0 || t.welcomeChestOpened !== !1)) return null;
	let n = JSON.stringify(e), r = ve({ getItem: () => n }, "account-save");
	return t.activeWarriorId && !r.activeWarriorId ? null : r;
}
//#endregion
//#region src/duelRules.ts
var be = 10, xe = "Europe/Paris", Se = {
	win: {
		xp: 20,
		coins: 10
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
function Ce(e, t, n) {
	return n ? 20 + 5 * Math.max(0, X[t] - X[e]) : 0;
}
function Z(e) {
	let t = e.activeWarriorId, n = e.ownedWarriors?.[t];
	return !!(p[t] && n?.warriorId === t && Number.isInteger(n.level) && n.level >= 1 && n.level <= 10);
}
function we(e) {
	if (!Te(e)) return null;
	let t = ye(e);
	return t && Z(t) ? t : null;
}
function Q(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Te(e) {
	if (!Q(e) || typeof e.activeWarriorId != "string" || !p[e.activeWarriorId] || !Q(e.ownedWarriors) || !Q(e.owned) || typeof e.equippedWeapon != "string" || typeof e.equippedArmor != "string") return !1;
	for (let [t, n] of Object.entries(e.ownedWarriors)) if (!p[t] || !Q(n) || n.warriorId !== t || !Number.isInteger(n.level) || n.level < 1 || n.level > 10 || !Number.isSafeInteger(n.xp) || n.xp < 0 || (n.level === 10 ? n.xp !== 0 : n.xp >= a(n.level))) return !1;
	if (!Object.hasOwn(e.ownedWarriors, e.activeWarriorId)) return !1;
	if (e.version === 6) {
		if (!Q(e.personalClears) || !Number.isSafeInteger(e.campaignBattleSequence) || e.campaignBattleSequence < 0 || !Number.isSafeInteger(e.equipmentRecycleSequence) || e.equipmentRecycleSequence < 0) return !1;
		for (let [t, n] of Object.entries(e.personalClears)) {
			if (!Object.hasOwn(e.ownedWarriors, t) || !Q(n)) return !1;
			for (let e of ["normal", "nemesis"]) {
				let t = n[e];
				if (!Array.isArray(t) || t.some((e) => !Number.isInteger(e) || e < 1 || e > 20) || new Set(t).size !== t.length) return !1;
			}
		}
	}
	let t = new Map(c.map((e) => [e.id, e]));
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
	let t = h(e);
	return {
		name: t.name,
		stats: S(e),
		skills: [],
		warriorId: t.id,
		level: t.level,
		weapon: e.equippedWeapon,
		armor: e.equippedArmor
	};
}
function Ee(e, t, n) {
	let r = $(e), i = $(t), a = w(r, i, n), o = a.winner === "player", s = Se[o ? "win" : "loss"], c = p[r.warriorId].rarity, l = p[i.warriorId].rarity;
	return {
		attacker: r,
		defender: i,
		result: a,
		xp: s.xp,
		coins: s.coins,
		points: Ce(c, l, o),
		attackerRarity: c,
		defenderRarity: l
	};
}
function De(e, t) {
	let n = structuredClone(e);
	return n.coins += t.coins, A(n, "duel", t.result.winner), D(n, t.xp), ie(n);
}
//#endregion
export { be as DUEL_MAX_CHARGES, xe as DUEL_RESET_TIMEZONE, Se as DUEL_REWARDS, X as RARITY_TIERS, De as applyDuelReward, $ as duelFighter, Ce as duelPoints, we as normalizedDuelSave, Ee as resolveDuel, Te as strictDuelPayload, Z as validDuelWarrior, p as warriorDefinitions, E as warriorTotalXp };
