var e = [
	120,
	180,
	280,
	410,
	560,
	750,
	970,
	1240,
	1580
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
			22,
			15,
			18,
			217
		],
		[
			24,
			16,
			19,
			234
		],
		[
			26,
			17,
			21,
			252
		],
		[
			28,
			18,
			22,
			270
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
			17,
			22,
			25,
			177
		],
		[
			18,
			24,
			26,
			191
		],
		[
			20,
			25,
			28,
			206
		],
		[
			21,
			27,
			30,
			220
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
			20,
			12,
			14,
			268
		],
		[
			21,
			13,
			15,
			289
		],
		[
			23,
			14,
			16,
			309
		],
		[
			24,
			15,
			17,
			330
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
			19,
			17,
			23,
			190
		],
		[
			20,
			19,
			24,
			205
		],
		[
			22,
			20,
			26,
			220
		],
		[
			23,
			21,
			28,
			235
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
			22,
			17,
			20,
			240
		],
		[
			24,
			19,
			22,
			260
		],
		[
			26,
			20,
			23,
			280
		],
		[
			28,
			21,
			25,
			300
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
			22,
			19,
			24,
			225
		],
		[
			23,
			20,
			25,
			243
		],
		[
			25,
			22,
			27,
			262
		],
		[
			27,
			23,
			29,
			280
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
			26,
			14,
			18,
			297
		],
		[
			28,
			15,
			19,
			321
		],
		[
			30,
			16,
			21,
			346
		],
		[
			32,
			17,
			22,
			370
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
			27,
			26,
			28,
			252
		],
		[
			29,
			28,
			30,
			271
		],
		[
			31,
			29,
			32,
			291
		],
		[
			33,
			31,
			34,
			310
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
			28,
			12,
			15,
			345
		],
		[
			30,
			13,
			16,
			370
		],
		[
			32,
			14,
			18,
			395
		],
		[
			34,
			15,
			19,
			420
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
			31,
			22,
			26,
			308
		],
		[
			33,
			24,
			28,
			332
		],
		[
			35,
			25,
			30,
			356
		],
		[
			37,
			27,
			32,
			380
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
			34,
			13,
			17,
			388
		],
		[
			37,
			15,
			18,
			416
		],
		[
			39,
			16,
			20,
			443
		],
		[
			41,
			17,
			21,
			470
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
			37,
			15,
			21,
			415
		],
		[
			39,
			16,
			22,
			443
		],
		[
			42,
			17,
			24,
			472
		],
		[
			44,
			18,
			25,
			500
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
		bonus: "+1 Force",
		effect: "5 % de chance de +20 % dégâts",
		art: "club"
	},
	{
		id: "bone-spear",
		name: "Lance d’os",
		type: "weapon",
		rarity: "Commun",
		bonus: "+1 Vitesse",
		effect: "Première attaque +10 %",
		art: "spear"
	},
	{
		id: "obsidian-axe",
		name: "Hache d’obsidienne",
		type: "weapon",
		rarity: "Peu commun",
		bonus: "+1 Force et +5 PV",
		effect: "6 % de chance de saignement",
		art: "axe"
	},
	{
		id: "hunter-bow",
		name: "Arc du chasseur",
		type: "weapon",
		rarity: "Peu commun",
		bonus: "+1 Vitesse et +5 PV",
		effect: "Réduit légèrement l’Esquive adverse",
		art: "bow"
	},
	{
		id: "smilodon-fangs",
		name: "Crocs du Smilodon",
		type: "weapon",
		rarity: "Rare",
		bonus: "+1 Force et +1 Vitesse",
		effect: "8 % de chance d’un second coup à 50 %",
		art: "fangs"
	},
	{
		id: "mammoth-spear",
		name: "Lance du Mammouth ancestral",
		type: "weapon",
		rarity: "Rare",
		bonus: "+1 Force et +10 PV",
		effect: "10 % de chance d’ignorer la protection",
		art: "mammoth"
	},
	{
		id: "volcanic-hammer",
		name: "Marteau volcanique",
		type: "weapon",
		rarity: "Épique",
		bonus: "+2 Force et +5 PV",
		effect: "10 % de chance de brûlure",
		art: "hammer"
	},
	{
		id: "tyrant-claw",
		name: "Griffe du Tyran",
		type: "weapon",
		rarity: "Légendaire",
		bonus: "+2 Force et +1 Vitesse",
		effect: "12 % de chance de +50 % dégâts",
		art: "claw"
	},
	{
		id: "titan-heart",
		name: "Cœur du Titan Primordial",
		type: "weapon",
		rarity: "Mythique",
		bonus: "+2 Force, +1 Vitesse et +5 PV",
		effect: "7 % de chance de +80 % dégâts",
		art: "heart"
	},
	{
		id: "hunter-hides",
		name: "Peaux du chasseur",
		type: "armor",
		rarity: "Commun",
		bonus: "+10 PV",
		effect: "Première attaque reçue −5 %",
		art: "hide"
	},
	{
		id: "bone-harness",
		name: "Harnais d’os",
		type: "armor",
		rarity: "Peu commun",
		bonus: "+5 PV et +1 Force",
		effect: "5 % de chance de réduire une attaque de 25 %",
		art: "bones"
	},
	{
		id: "mammoth-plate",
		name: "Cuirasse du Mammouth ancestral",
		type: "armor",
		rarity: "Rare",
		bonus: "+10 PV et +1 Force",
		effect: "Critiques supplémentaires réduits de 20 %",
		art: "plate"
	},
	{
		id: "volcanic-shell",
		name: "Carapace volcanique",
		type: "armor",
		rarity: "Épique",
		bonus: "+15 PV et +1 Force",
		effect: "Peut brûler l’attaquant",
		art: "shell"
	},
	{
		id: "white-titan-fur",
		name: "Fourrure du Titan blanc",
		type: "armor",
		rarity: "Légendaire",
		bonus: "+20 PV et +1 Force",
		effect: "Au-dessus de 50 % PV : −8 % dégâts reçus",
		art: "fur"
	},
	{
		id: "primordial-titan-skin",
		name: "Peau du Titan primordial",
		type: "armor",
		rarity: "Mythique",
		bonus: "+25 PV et +1 Esquive",
		effect: "Les 3 premières attaques reçues font −20 % dégâts",
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
			"Sa première attaque réussie inflige 25 % de dégâts supplémentaires."
		],
		[
			7,
			"Pression du chasseur",
			"Ses coups consécutifs renforcent progressivement sa prochaine attaque."
		],
		[
			10,
			"Coup de Grâce",
			"Inflige 30 % de dégâts supplémentaires aux adversaires affaiblis."
		]
	]),
	naya: m("naya", [
		[
			3,
			"Pas d’Ombre",
			"Elle est particulièrement difficile à toucher lors du premier assaut."
		],
		[
			7,
			"Tempo fantôme",
			"Après le premier assaut, esquive renforcée ; chaque esquive accélère sa prochaine action et arme une riposte à +40 %."
		],
		[
			10,
			"Embuscade décisive",
			"Après une esquive, sa prochaine attaque réussie inflige 80 % de dégâts supplémentaires au lieu de 40 %."
		]
	]),
	brakk: m("brakk", [
		[
			3,
			"Garde rocheuse",
			"Réduit les dégâts de ses trois premiers impacts subis."
		],
		[
			7,
			"Riposte du Bastion",
			"12 % de chance de bloquer entièrement une attaque ; sa prochaine attaque réussie inflige alors +30 % de dégâts."
		],
		[
			10,
			"Dernière Résistance",
			"Sous 30 % de PV, il réduit fortement les trois prochains impacts."
		]
	]),
	eyla: m("eyla", [
		[
			3,
			"Mise en joue",
			"Sa première flèche réussie inflige 20 % de dégâts supplémentaires."
		],
		[
			7,
			"Cadence précise",
			"Chaque troisième attaque réussie déclenche un tir supplémentaire."
		],
		[
			10,
			"Flèche fatale",
			"Punit brutalement la première ouverture d’un adversaire affaibli."
		]
	]),
	asha: m("asha", [
		[
			3,
			"Marque de Braise",
			"Ses attaques accumulent jusqu’à trois charges de Braise."
		],
		[
			7,
			"Foyer ardent",
			"À trois Braises, sa prochaine attaque les consume pour provoquer une explosion."
		],
		[
			10,
			"Crescendo incandescent",
			"Ses détonations deviennent plus violentes et accélèrent son prochain sort."
		]
	]),
	rhex: m("rhex", [
		[
			3,
			"Signal de meute",
			"Chaque troisième attaque réussie appelle un raptor à l’assaut."
		],
		[
			7,
			"Relais de meute",
			"Les assauts de ses raptors accélèrent le rythme de la meute."
		],
		[
			10,
			"Assaut coordonné",
			"Ses deux raptors frappent ensemble lors des assauts de meute."
		]
	]),
	ursak: m("ursak", [
		[
			3,
			"Fureur cavernicole",
			"Les coups reçus alimentent la puissance de sa prochaine attaque."
		],
		[
			7,
			"Endurance sous pression",
			"Résiste davantage lorsqu’il combat sous la moitié de ses PV."
		],
		[
			10,
			"Fureur ancestrale",
			"À l’agonie, il entre dans une fureur qui augmente dégâts et cadence."
		]
	]),
	saar: m("saar", [
		[
			3,
			"Pas félin",
			"Chaque esquive le replace immédiatement dans le rythme du combat."
		],
		[
			7,
			"Frénésie féline",
			"Plus il frappe sans être touché, plus sa cadence augmente."
		],
		[
			10,
			"Contre-attaque prédatrice",
			"Après une esquive, sa prochaine attaque devient une contre-attaque prédatrice."
		]
	]),
	morga: m("morga", [
		[
			3,
			"Garde d’Ivoire",
			"Sa défense d’ivoire amortit ses quatre premiers impacts."
		],
		[
			7,
			"Protection de la tribu",
			"Sous 60 % de PV, elle renforce temporairement sa protection."
		],
		[
			10,
			"Endurance de Matriarche",
			"Au bord de la chute, elle récupère une partie de ses PV et durcit sa défense."
		]
	]),
	vorka: m("vorka", [
		[
			3,
			"Entaille d’obsidienne",
			"Ses coups peuvent provoquer un saignement persistant."
		],
		[
			7,
			"Pression persistante",
			"Ses attaques sont plus dangereuses contre une cible qui saigne."
		],
		[
			10,
			"Coupure décisive",
			"Achève brutalement une cible affaiblie déjà victime de son saignement."
		]
	]),
	urgath: m("urgath", [
		[
			3,
			"Rempart glacial",
			"Son corps titanesque réduit les dégâts de ses cinq premiers impacts."
		],
		[
			7,
			"Froid écrasant",
			"Ses coups ralentissent progressivement le rythme de son adversaire."
		],
		[
			10,
			"Résilience du Titan",
			"Sous 40 % de PV, sa résistance légendaire réduit fortement les dégâts reçus."
		]
	]),
	tyrak: m("tyrak", [
		[
			3,
			"Présence primordiale",
			"Sa présence impose sa domination dès les premiers échanges."
		],
		[
			7,
			"Sursaut cristallin",
			"Blessé, Tyrak réagit par un violent sursaut de puissance."
		],
		[
			10,
			"Domination du Roi",
			"Sous 35 % de PV, le Roi Primordial devient plus violent et plus difficile à abattre."
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
		return this.warriorId !== "naya" || !this.has(3) ? e : n ? Math.min(t, e * 1.25) : this.has(7) ? Math.min(t, e * 2.6) : e;
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
				this.has(7) && this.counterReady && (i *= this.has(10) ? 1.8 : 1.4, this.counterReady = !1, s.push(this.has(10) ? "Embuscade décisive" : "Tempo fantôme"));
				break;
			case "brakk":
				this.has(7) && this.riposteReady && (i *= 1.3, this.riposteReady = !1, s.push("Riposte du Bastion"));
				break;
			case "eyla":
				this.has(3) && l && (i *= 1.2, s.push("Mise en joue")), this.has(10) && !this.finalShotUsed && e <= t * .5 && (i *= 1.4, this.finalShotUsed = !0, s.push("Flèche fatale")), this.has(7) && this.landedHits % 3 == 0 && (c.push(.45), s.push("Cadence précise"));
				break;
			case "asha":
				this.has(3) && (this.has(7) && this.braise === 3 && (i *= this.has(10) ? 1.5 : 1.3, this.braise = 0, this.has(10) && this.credit(.2), s.push(this.has(10) ? "Crescendo incandescent" : "Foyer ardent")), this.braise = Math.min(3, this.braise + 1));
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
}, _ = [
	"flint-club",
	"bone-spear",
	"obsidian-axe",
	"hunter-bow",
	"smilodon-fangs",
	"mammoth-spear",
	"volcanic-hammer",
	"tyrant-claw",
	"titan-heart"
], v = [
	"hunter-hides",
	"bone-harness",
	"mammoth-plate",
	"volcanic-shell",
	"white-titan-fur",
	"primordial-titan-skin"
], y = [
	"tribal-hunter",
	"tribal-warrior",
	"cave-brute",
	"shaman",
	"raptor",
	"smilodon",
	"mammoth"
];
new Set(_), new Set(v), new Set(y);
//#endregion
//#region src/game.ts
function b(e) {
	let t = e >>> 0;
	return () => {
		t += 1831565813;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
var ee = (e) => i.baseDamage + i.strengthScale * e ** i.strengthExponent, te = (e) => Math.min(i.dodgeCap, i.dodgeBase + i.dodgeScale * e / (e + 100)), ne = (e) => (e + i.speedOffset) ** i.speedExponent;
function x(e) {
	let t = {}, n = (e, n) => {
		t[e] = (t[e] ?? 0) + n;
	};
	return e === "flint-club" && n("strength", 1), e === "bone-spear" && n("speed", 1), ["obsidian-axe", "bone-harness"].includes(e) && (n("strength", 1), n("hp", 5)), e === "hunter-bow" && (n("speed", 1), n("hp", 5)), e === "smilodon-fangs" && (n("strength", 1), n("speed", 1)), ["mammoth-spear", "mammoth-plate"].includes(e) && (n("strength", 1), n("hp", 10)), e === "volcanic-hammer" && (n("strength", 2), n("hp", 5)), e === "volcanic-shell" && (n("strength", 1), n("hp", 15)), e === "tyrant-claw" && (n("strength", 2), n("speed", 1)), e === "titan-heart" && (n("strength", 2), n("speed", 1), n("hp", 5)), e === "hunter-hides" && n("hp", 10), e === "white-titan-fur" && (n("strength", 1), n("hp", 20)), e === "primordial-titan-skin" && (n("dodge", 1), n("hp", 25)), t;
}
function S(e) {
	let t = { ...p(e).stats }, n = (n) => {
		if (!e.owned[n]) return;
		let r = x(n);
		for (let [e, n] of Object.entries(r)) t[e] += n;
	};
	return n(e.equippedWeapon), n(e.equippedArmor), t;
}
function C(e, t) {
	return e.skills.includes(t);
}
function w(e, t, n) {
	let r = b(n), a = new g(e.warriorId, e.level), o = new g(t.warriorId, t.level), s = e.stats.hp, c = t.stats.hp, l = null, u = 0, d = 0, f = 0, p = 0, m = 0, h = !1, _ = !1, v = 0, y = 0, x = 0, S = 0, w = 0, T = 0, E = [], D = () => ({
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
		let n = ne(e.stats.speed) * (C(e, "Accélération") ? 1.12 : 1) * a.actionRateMultiplier() * o.opponentRateMultiplier(), f = ne(t.stats.speed) * (C(t, "Accélération") ? 1.12 : 1) * o.actionRateMultiplier() * a.opponentRateMultiplier(), g = r() < n / (n + f) ? "player" : "enemy";
		g === l && u >= i.maxConsecutiveActions && (g = g === "player" ? "enemy" : "player"), u = g === l ? u + 1 : 1, d = Math.max(d, u), l = g;
		let b = g === "player" ? a : o, O = g === "player" ? o : a;
		b.onAction();
		let k = g === "player" ? "enemy" : "player", A = g === "player" ? e : t, j = g === "player" ? t : e, M = g === "player" ? ++p : ++m;
		E.push({
			type: "attack",
			actor: g,
			target: k,
			...D()
		});
		let N = C(A, "Précision") ? .05 : 0, P = Math.max(0, te(j.stats.dodge) - N), F = O.dodgeChance(P, i.dodgeCap);
		if (r() < F) {
			E.push({
				type: "dodge",
				actor: k,
				target: g,
				label: "Esquive",
				...D()
			}), O.onDodge(), b.onMiss();
			continue;
		}
		if (O.blockChance() > 0 && r() < O.blockChance()) {
			O.onBlock(), E.push({
				type: "skill",
				actor: k,
				target: g,
				label: "Parade",
				...D()
			});
			continue;
		}
		let I = ee(A.stats.strength) * (.9 + r() * .2);
		M === 1 && C(A, "Premier Sang") && (I *= 1.22), C(A, "Frappe Dévastatrice") && r() < .12 && (I *= 1.45, E.push({
			type: "skill",
			actor: g,
			target: k,
			label: "Frappe Dévastatrice",
			...D()
		})), C(A, "Rage") && (I *= 1 + (1 - (g === "player" ? s / e.stats.hp : c / t.stats.hp)) * .22), C(A, "Opportuniste") && (k === "player" ? s / e.stats.hp : c / t.stats.hp) < .3 && (I *= 1.25), A.weapon === "flint-club" && r() < .05 && (I *= 1.2), A.weapon === "bone-spear" && M === 1 && (I *= 1.1), A.weapon === "tyrant-claw" && r() < .12 && (I *= 1.5), A.weapon === "titan-heart" && r() < .07 && (I *= 1.8);
		let L = I;
		r() < i.criticalChance + (C(A, "Élan") ? .03 : 0) && (I *= i.criticalMultiplier, E.push({
			type: "critical",
			actor: g,
			target: k,
			label: "Critique",
			...D()
		}));
		let R = k === "player" ? s : c, z = k === "player" ? w > 0 || v > 0 : x > 0 || y > 0, B = A.warriorId ? b.onSuccessfulAttack(R, j.stats.hp, z, r) : null;
		if (B) {
			I *= B.multiplier;
			for (let e of B.labels) E.push({
				type: "skill",
				actor: g,
				target: k,
				label: e,
				...D()
			});
			B.consumeBleed && (k === "player" ? (w = 0, v = 0) : (x = 0, y = 0));
		}
		let V = I;
		C(j, "Peau Dure") && (I *= .9), C(j, "Parade") && r() < .1 && (I *= .55, E.push({
			type: "skill",
			actor: k,
			target: g,
			label: "Parade",
			...D()
		})), j.armor === "hunter-hides" && M === 1 && (I *= .95), j.armor === "bone-harness" && r() < .05 && (I *= .75), j.armor === "white-titan-fur" && (k === "player" ? s / e.stats.hp : c / t.stats.hp) > .5 && (I *= .92), j.armor === "primordial-titan-skin" && M <= 3 && (I *= .8), I *= O.incomingMultiplier(R, j.stats.hp);
		let H = L * I / V;
		I = Math.max(1, Math.round(I)), k === "player" ? s -= I : c -= I, E.push({
			type: "damage",
			actor: g,
			target: k,
			value: I,
			...D()
		});
		{
			let e = k === "player" ? s : c, t = O.onDamageTaken(e, j.stats.hp);
			if (t.heal > 0) {
				let n = Math.max(0, e), r = Math.min(j.stats.hp, n + t.heal);
				k === "player" ? s = r : c = r, E.push({
					type: "heal",
					actor: k,
					target: k,
					value: r - n,
					label: "Endurance de Matriarche",
					...D()
				});
			}
			for (let e of t.labels) E.push({
				type: "skill",
				actor: k,
				target: k,
				label: e,
				...D()
			});
			O.updateThresholds(k === "player" ? s : c, j.stats.hp);
		}
		if (B?.applyBleed && (k === "player" ? s > 0 : c > 0) && (k === "player" ? (w = 2, T = Math.max(1, Math.round(I * .1))) : (x = 2, S = Math.max(1, Math.round(I * .1)))), B?.bonusStrikes.length && (k === "player" ? s > 0 : c > 0)) for (let e of B.bonusStrikes) {
			if (k === "player" ? s <= 0 : c <= 0) break;
			let t = Math.max(1, Math.round(H * e));
			E.push({
				type: "attack",
				actor: g,
				target: k,
				label: "Coup supplémentaire",
				...D()
			}), k === "player" ? s -= t : c -= t, E.push({
				type: "damage",
				actor: g,
				target: k,
				value: t,
				...D()
			});
		}
		if (C(A, "Vampirisme")) {
			let n = Math.max(1, Math.round(I * .08));
			g === "player" ? s = Math.min(e.stats.hp, s + n) : c = Math.min(t.stats.hp, c + n), E.push({
				type: "heal",
				actor: g,
				target: g,
				value: n,
				label: "Vampirisme",
				...D()
			});
		}
		let U = C(A, "Saignement") ? .12 : A.weapon === "obsidian-axe" ? .06 : 0;
		r() < U && (k === "player" ? v = 2 : y = 2, E.push({
			type: "skill",
			actor: g,
			target: k,
			label: "Saignement",
			...D()
		})), v > 0 && (s -= 3, --v, E.push({
			type: "bleed",
			actor: "enemy",
			target: "player",
			value: 3,
			...D()
		})), y > 0 && (c -= 3, --y, E.push({
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
		})), c <= 0 && C(t, "Second Souffle") && !_ && (c = Math.round(t.stats.hp * .18), _ = !0, E.push({
			type: "heal",
			actor: "enemy",
			target: "enemy",
			value: c,
			label: "Second Souffle",
			...D()
		}));
		let W = C(A, "Double Frappe") ? .1 : A.weapon === "smilodon-fangs" ? .08 : 0;
		r() < W && s > 0 && c > 0 && (l = null);
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
	let a = e.ownedWarriors[e.activeWarriorId];
	if (!a || a.level >= i.maxWarriorLevel || !Number.isFinite(t) || t <= 0) return 0;
	a.xp += Math.trunc(t);
	let o = 0;
	for (; a.level < i.maxWarriorLevel && a.xp >= r(a.level);) a.xp -= r(a.level), a.level += 1, o += 1;
	return a.level >= i.maxWarriorLevel && (a.xp = 0), o;
}
//#endregion
//#region src/victories.ts
var E = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 0 ? e : 0;
function D(e) {
	return E(e.adventureWins) + E(e.riftWins) + E(e.duelWins);
}
function O(e, t, n) {
	n === "player" && (e.totalWins = E(e.totalWins) + 1, t === "adventure" ? e.adventureWins = E(e.adventureWins) + 1 : t === "rift" ? e.riftWins = E(e.riftWins) + 1 : e.duelWins = E(e.duelWins) + 1);
}
//#endregion
//#region src/badgeSystem.ts
var k = {
	bronze: 50,
	silver: 100,
	gold: 200,
	platinum: 500
}, A = 1500, j = [
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
], M = (e, t) => ({
	current: Math.min(Math.max(Number.isFinite(e) ? e : 0, 0), t),
	target: t
}), N = (e) => new Set(e.defeatedNodes.filter((e) => Number.isInteger(e) && e >= 1 && e <= 20)), P = (e) => u.filter(({ id: t }) => !!e.ownedWarriors[t]).length, F = (e) => Object.keys(e.ownedWarriors).filter((t) => d[t] && e.ownedWarriors[t]?.warriorId === t), I = (e) => F(e).length, L = (e, t, n = !1) => F(e).some((e) => {
	let r = d[e].rarity;
	return n ? a.indexOf(r) >= a.indexOf(t) : r === t;
}), R = (e) => j.filter((t) => (e.owned[t]?.quantity ?? 0) > 0).length, z = (e, t) => e.badges.some((e) => e.id === t);
function B(e) {
	return !1;
}
var V = [
	{
		id: "primal-first-level",
		title: "Premiers pas dans le Primal",
		description: "Terminez le premier niveau de l’Ère Primordiale.",
		grade: "bronze",
		binary: !0,
		progress: (e) => M(Number(N(e).has(1)), 1)
	},
	{
		id: "primal-three-warriors",
		title: "Tribu naissante",
		description: "Obtenez 3 Warriors de l’Ère Primordiale.",
		grade: "bronze",
		progress: (e) => M(P(e), 3)
	},
	{
		id: "primal-three-equipment",
		title: "Équipement de survie",
		description: "Obtenez 3 équipements primordiaux différents.",
		grade: "bronze",
		progress: (e) => M(R(e), 3)
	},
	{
		id: "primal-ten-levels",
		title: "Au cœur de la jungle",
		description: "Terminez 10 niveaux de l’Ère Primordiale.",
		grade: "silver",
		progress: (e) => M(N(e).size, 10)
	},
	{
		id: "primal-first-elite",
		title: "Briseur d’Élite",
		description: "Vainquez votre premier Élite Primal.",
		grade: "silver",
		binary: !0,
		progress: (e) => M(Number([
			5,
			10,
			15
		].some((t) => N(e).has(t)) || z(e, "first-elite")), 1)
	},
	{
		id: "primal-six-warriors",
		title: "Meute primordiale",
		description: "Obtenez 6 Warriors de l’Ère Primordiale.",
		grade: "silver",
		progress: (e) => M(P(e), 6)
	},
	{
		id: "primal-eight-equipment",
		title: "Arsenal de chasse",
		description: "Obtenez 8 équipements primordiaux différents.",
		grade: "silver",
		progress: (e) => M(R(e), 8)
	},
	{
		id: "primal-conqueror",
		title: "Conquérant primordial",
		description: "Vainquez le Boss final de l’Aventure Primal.",
		grade: "gold",
		binary: !0,
		progress: (e) => M(Number(N(e).has(20) || z(e, "boss")), 1)
	},
	{
		id: "primal-all-warriors",
		title: "Panthéon primordial",
		description: "Obtenez les 12 Warriors primordiaux.",
		grade: "gold",
		progress: (e) => M(P(e), u.length)
	},
	{
		id: "primal-all-equipment",
		title: "Arsenal primordial",
		description: "Obtenez les 15 équipements primordiaux.",
		grade: "gold",
		progress: (e) => M(R(e), j.length)
	},
	{
		id: "primal-tyrak",
		title: "Roi parmi les rois",
		description: "Obtenez Tyrak, Roi Primordial.",
		grade: "platinum",
		binary: !0,
		progress: (e) => M(Number(!!e.ownedWarriors.tyrak), 1)
	},
	{
		id: "primal-nemesis",
		title: "Dominateur du Primal",
		description: "Terminez l’Ère Primordiale en Némésis.",
		grade: "platinum",
		binary: !0,
		progress: (e) => M(Number(B(e)), 1)
	}
];
function H(e) {
	return F(e).filter((t) => e.ownedWarriors[t].level >= 10).length;
}
var U = [
	{
		id: "exploit-first-impact",
		title: "Premier Impact",
		description: "Remportez votre premier combat.",
		grade: "bronze",
		binary: !0,
		progress: (e) => M(D(e), 1)
	},
	{
		id: "exploit-first-reinforcements",
		title: "Premiers renforts",
		description: "Rassemblez 5 Warriors différents.",
		grade: "bronze",
		progress: (e) => M(I(e), 5)
	},
	{
		id: "exploit-rare-spark",
		title: "Éclat rare",
		description: "Obtenez votre premier Warrior Rare ou supérieur.",
		grade: "bronze",
		binary: !0,
		progress: (e) => M(Number(L(e, "Rare", !0)), 1)
	},
	{
		id: "exploit-first-duel",
		title: "Premier duel",
		description: "Remportez votre premier Duel.",
		grade: "bronze",
		binary: !0,
		progress: (e) => M(e.duelWins, 1)
	},
	{
		id: "exploit-seasoned-fighter",
		title: "Combattant aguerri",
		description: "Remportez 25 combats.",
		grade: "silver",
		progress: (e) => M(D(e), 25)
	},
	{
		id: "exploit-chronos-collector",
		title: "Collectionneur de Chronos",
		description: "Rassemblez 10 Warriors différents.",
		grade: "silver",
		progress: (e) => M(I(e), 10)
	},
	{
		id: "exploit-ascension",
		title: "Ascension",
		description: "Amenez un Warrior au niveau 10.",
		grade: "silver",
		binary: !0,
		progress: (e) => M(H(e), 1)
	},
	{
		id: "exploit-war-machine",
		title: "Machine de guerre",
		description: "Remportez 100 combats.",
		grade: "gold",
		progress: (e) => M(D(e), 100)
	},
	{
		id: "exploit-awakened-legend",
		title: "Légende éveillée",
		description: "Obtenez votre premier Warrior Légendaire.",
		grade: "gold",
		binary: !0,
		progress: (e) => M(Number(L(e, "Légendaire")), 1)
	},
	{
		id: "exploit-elite-squad",
		title: "Escouade d’élite",
		description: "Amenez 6 Warriors au niveau 10.",
		grade: "gold",
		binary: !0,
		progress: (e) => M(H(e), 6)
	},
	{
		id: "exploit-feared-rival",
		title: "Rival redouté",
		description: "Remportez 25 Duels.",
		grade: "gold",
		progress: (e) => M(e.duelWins, 25)
	},
	{
		id: "exploit-mythic-fracture",
		title: "Fracture mythique",
		description: "Obtenez votre premier Warrior Mythique.",
		grade: "platinum",
		binary: !0,
		progress: (e) => M(Number(L(e, "Mythique")), 1)
	}
], W = "primal-mastery", G = (e, t) => e.badges.some((e) => e.id === t), K = (e) => V.every(({ id: t }) => G(e, t));
function re(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
	let n = [...V, ...U].filter((t) => {
		if (G(e, t.id)) return !1;
		let { current: n, target: r } = t.progress(e);
		return n >= r;
	});
	if (!n.length && (G(e, "primal-mastery") || !K(e))) return {
		save: e,
		granted: []
	};
	let r = structuredClone(e), i = n.map((e) => {
		let n = k[e.grade];
		return r.badges.push({
			id: e.id,
			unlockedAt: t
		}), r.coins += n, {
			id: e.id,
			title: e.title,
			coins: n
		};
	});
	return K(r) && !G(r, "primal-mastery") && (r.badges.push({
		id: W,
		unlockedAt: t
	}), r.coins += A, i.push({
		id: W,
		title: "Maîtrise Primordiale",
		coins: A
	})), {
		save: r,
		granted: i
	};
}
//#endregion
//#region src/rift.ts
var ie = [
	100,
	90,
	82,
	74,
	68,
	62,
	56,
	50
], q = 12e5;
function ae(e, t, n) {
	let r = Math.min(10, Math.max(0, Math.trunc(e)));
	if (r === 10) return {
		charges: r,
		nextAt: null
	};
	if (t === null || !Number.isFinite(t)) return {
		charges: r,
		nextAt: n + q
	};
	if (n < t) return {
		charges: r,
		nextAt: t
	};
	let i = 1 + Math.floor((n - t) / q), a = Math.min(10, r + i);
	return {
		charges: a,
		nextAt: a === 10 ? null : t + i * q
	};
}
function oe(e, t = Date.now()) {
	let n = ae(e.campaignRemaining, e.campaignRechargeAt, t);
	return n.charges === e.campaignRemaining && n.nextAt === e.campaignRechargeAt ? e : {
		...e,
		campaignRemaining: n.charges,
		campaignRechargeAt: n.nextAt
	};
}
//#endregion
//#region src/storage.ts
var se = "chronos-age-warriors:v4", ce = "chronos-age-warriors:v3", le = "chronos-age-warriors:admin:v3", J = "chronos-age-warriors:v2", ue = "chronos-age-warriors:admin:v2", de = (e = /* @__PURE__ */ new Date()) => e.toLocaleDateString("sv-SE");
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
		lastReset: de()
	};
}
function fe(e, t = de()) {
	e.lastReset = t;
	let n = oe(e);
	return e.campaignRemaining = n.campaignRemaining, e.campaignRechargeAt = n.campaignRechargeAt, e;
}
function pe(e = localStorage, t = se) {
	try {
		let n = t === "chronos-age-warriors:v4" ? [ce, J] : t === "chronos-age-warriors:admin:v4" ? [le, ue] : t === "chronos-age-warriors:v3" ? [J] : t === "chronos-age-warriors:admin:v3" ? [ue] : [], i = e.getItem(t) ?? n.map((t) => e.getItem(t)).find(Boolean);
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
		if (a.version === 2) {
			for (let e of Object.keys(a.ownedWarriors)) a.ownedWarriors[e] = {
				warriorId: e,
				level: 1,
				xp: 0
			};
			a.unlockedSkills = [], delete a.pendingLevelChoice;
		} else {
			for (let e of Object.values(a.ownedWarriors)) delete e.bonusStats, e.level = Number.isInteger(e.level) ? Math.min(10, Math.max(1, e.level)) : 1, e.xp = e.level === 10 ? 0 : Number.isInteger(e.xp) && e.xp >= 0 ? Math.min(e.xp, r(e.level) - 1) : 0;
			delete a.pendingLevelChoice;
		}
		a.welcomeChestOpened = !!c;
		let u = a;
		delete u.trainingRemaining, delete u.trainingWins, a.version = 5, a.campaignRemaining = Number.isInteger(a.campaignRemaining) ? Math.min(10, Math.max(0, a.campaignRemaining)) : 10, a.campaignRechargeAt = a.campaignRemaining === 10 ? null : Number.isSafeInteger(a.campaignRechargeAt) && (a.campaignRechargeAt ?? 0) > 0 ? a.campaignRechargeAt : Date.now() + 12e5, a.defeatedNodes = Array.isArray(a.defeatedNodes) ? [...new Set(a.defeatedNodes.filter((e) => Number.isInteger(e) && e >= 1 && e <= 20))] : [], a.campaignNode = Number.isInteger(a.campaignNode) ? Math.min(20, Math.max(1, a.campaignNode)) : 1;
		let f = a.defeatedNodes.includes(20) || a.eraRewardClaimed === !0;
		a.eraRewardClaimed === !0 && !a.defeatedNodes.includes(20) && a.defeatedNodes.push(20), a.nemesisUnlocked = f || a.nemesisUnlocked === !0, a.nemesisDefeatedNodes = Array.isArray(a.nemesisDefeatedNodes) ? [...new Set(a.nemesisDefeatedNodes.filter((e) => Number.isInteger(e) && e >= 1 && e <= 20))] : [], a.nemesisCampaignNode = Number.isInteger(a.nemesisCampaignNode) ? Math.min(20, Math.max(1, a.nemesisCampaignNode)) : 1, a.nemesisCompleted = a.nemesisCompleted === !0 || a.nemesisDefeatedNodes.includes(20), a.nemesisCompleted && !a.nemesisDefeatedNodes.includes(20) && a.nemesisDefeatedNodes.push(20), a.normalBossFirstClearRewardClaimed = a.normalBossFirstClearRewardClaimed === !0, a.nemesisBossFirstClearRewardClaimed = a.nemesisBossFirstClearRewardClaimed === !0, delete a.bossTrophyPending, delete a.eraRewardClaimed, a.riftChestCount = Number.isSafeInteger(a.riftChestCount) && a.riftChestCount >= 0 ? a.riftChestCount : 0, a.riftLossStreak = Number.isSafeInteger(a.riftLossStreak) && a.riftLossStreak >= 0 ? a.riftLossStreak : 0, a.equipmentChestCount = Number.isSafeInteger(a.equipmentChestCount) && a.equipmentChestCount >= 0 ? a.equipmentChestCount : 0, a.warriorChestCount = Number.isSafeInteger(a.warriorChestCount) && a.warriorChestCount >= 0 ? a.warriorChestCount : 0;
		let p = a.expedition;
		a.expedition = p && a.ownedWarriors[p.warriorId] && Number.isSafeInteger(p.startedAt) && p.startedAt > 0 ? p : null;
		let m = a.expeditionReturn;
		a.expeditionReturn = m && typeof m.id == "string" && a.ownedWarriors[m.warriorId] && Number.isSafeInteger(m.elapsedMs) && m.elapsedMs >= 0 && m.elapsedMs <= 864e5 && Number.isSafeInteger(m.xp) && m.xp >= 0 && Number.isSafeInteger(m.coins) && m.coins >= 0 && Array.isArray(m.equipmentIds) && m.equipmentIds.every((e) => typeof e == "string") && typeof m.equipmentChest == "boolean" && typeof m.warriorChest == "boolean" && Number.isSafeInteger(m.levelsGained) && m.levelsGained >= 0 ? m : null;
		let h = a.riftRun;
		a.riftRun = h && /^\d{4}-\d{2}-\d{2}$/.test(h.dateKey) && Number.isInteger(h.stage) && h.stage >= 0 && h.stage < 5 && Array.isArray(h.lineup) && h.lineup.length === 5 && h.lineup.every((e) => y.some((t) => t === e)) && Number.isSafeInteger(h.seed) && h.seed >= 0 && h.seed <= 4294967295 && ie.some((e) => e === h.difficulty) && (h.warriorId === "" || a.ownedWarriors[h.warriorId]) && Number.isSafeInteger(h.earnedCoins) && h.earnedCoins >= 0 && Number.isSafeInteger(h.earnedXp) && h.earnedXp >= 0 && [
			"ready",
			"fighting",
			"between",
			"lost",
			"quit",
			"complete"
		].includes(h.status) ? h : null, a.adventureWins = Number.isSafeInteger(a.adventureWins) && a.adventureWins >= 0 ? a.adventureWins : 0, a.riftWins = Number.isSafeInteger(a.riftWins) && a.riftWins >= 0 ? a.riftWins : 0, a.duelWins = Number.isSafeInteger(a.duelWins) && a.duelWins >= 0 ? a.duelWins : 0, a.owned ??= {};
		for (let e of Object.values(a.owned)) e.quantity = Number.isSafeInteger(e.quantity) && (e.quantity ?? 0) > 0 ? e.quantity : 1;
		if (a.loadouts ??= {}, a.loadouts[o] && (a.loadouts[s] ??= a.loadouts[o], delete a.loadouts[o]), c) {
			a.loadouts[a.activeWarriorId] ??= {
				weapon: a.equippedWeapon,
				armor: a.equippedArmor
			};
			let e = a.loadouts[a.activeWarriorId];
			a.equippedWeapon = a.owned[e.weapon] ? e.weapon : "", a.equippedArmor = a.owned[e.armor] ? e.armor : "";
		}
		return fe(a);
	} catch {
		return Y();
	}
}
function me(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e;
	if (![
		2,
		3,
		4,
		5
	].includes(t.version) || typeof t.activeWarriorId != "string" || !t.ownedWarriors || typeof t.ownedWarriors != "object" || Array.isArray(t.ownedWarriors) || !Array.isArray(t.unlockedSkills) || !Number.isSafeInteger(t.coins) || t.coins < 0 || !t.activeWarriorId && (Object.keys(t.ownedWarriors).length > 0 || t.welcomeChestOpened !== !1)) return null;
	let n = JSON.stringify(e), r = pe({ getItem: () => n }, "account-save");
	return t.activeWarriorId && !r.activeWarriorId ? null : r;
}
//#endregion
//#region src/duelRules.ts
var he = 10, ge = 12e5, _e = {
	win: {
		xp: 100,
		coins: 50
	},
	loss: {
		xp: 25,
		coins: 10
	}
}, X = {
	Commun: 0,
	"Peu commun": 1,
	Rare: 2,
	Épique: 3,
	Légendaire: 4,
	Mythique: 5
};
function ve(e, t, n) {
	return n ? 20 + 5 * Math.max(0, X[t] - X[e]) : 0;
}
function Z(e) {
	let t = e.activeWarriorId, n = e.ownedWarriors?.[t];
	return !!(d[t] && n?.warriorId === t && Number.isInteger(n.level) && n.level >= 1 && n.level <= 10);
}
function ye(e) {
	if (!be(e)) return null;
	let t = me(e);
	return t && Z(t) ? t : null;
}
function Q(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function be(e) {
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
		stats: S(e),
		skills: [],
		warriorId: t.id,
		level: t.level,
		weapon: e.equippedWeapon,
		armor: e.equippedArmor
	};
}
function xe(e, t, n) {
	let r = $(e), i = $(t), a = w(r, i, n), o = a.winner === "player", s = _e[o ? "win" : "loss"], c = d[r.warriorId].rarity, l = d[i.warriorId].rarity;
	return {
		attacker: r,
		defender: i,
		result: a,
		xp: s.xp,
		coins: s.coins,
		points: ve(c, l, o),
		attackerRarity: c,
		defenderRarity: l
	};
}
function Se(e, t) {
	let n = structuredClone(e);
	return n.coins += t.coins, O(n, "duel", t.result.winner), T(n, t.xp), re(n);
}
//#endregion
export { he as DUEL_MAX_CHARGES, ge as DUEL_RECHARGE_MS, _e as DUEL_REWARDS, X as RARITY_TIERS, Se as applyDuelReward, $ as duelFighter, ve as duelPoints, ye as normalizedDuelSave, xe as resolveDuel, be as strictDuelPayload, Z as validDuelWarrior, d as warriorDefinitions };
