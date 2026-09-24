CHRONOS AGE WARRIORS — ASSETS V0.5 PRODUCTION
==============================================

CE PACK REMPLACE L'ANCIEN ZIP V0.5 DE TRAVAIL.

OBJECTIF
--------
Réduire au maximum les découpes improvisées côté Codex et fournir des assets déjà exploitables.

1. JOUEUR COMBAT
----------------
- 9 armes × homme/femme.
- Chaque arme possède des PNG 512×512 NORMALISÉS.
- Même canvas, même échelle interne par arme, même groundY.
- États fournis :
  idle
  idle-to-anticipation     (tween court)
  anticipation
  anticipation-to-attack  (tween court)
  attack
  attack-to-recovery      (tween court)
  hurt
  dodge
  ko
- Les tweens sont des frames de transition brèves destinées à lisser les changements de pose.
- NE JAMAIS tight-crop ces fichiers au runtime.
- NE JAMAIS agrandir le KO indépendamment de l'idle.

2. HUB
------
- hub/hub-male.png
- hub/hub-female.png
Portraits dédiés, complets, grand canvas et espace vertical suffisant.
Animation conseillée : translateY -3px ↔ +3px, 3.4s, ease-in-out, infinite.
Aucun cercle décoratif ni ligne orbitale n'est requis derrière le Warrior.

3. PERSONNALISATION
-------------------
Les planches homme/femme sont conservées comme OPTIONS DE CRÉATION propres.
Elles ne sont PAS présentées comme des overlays de combat pixel-perfect.
Ne pas coller arbitrairement ces options sur les sprites de combat.
La V0.5 doit privilégier :
- personnalisation complète dans Création/portrait ;
- sprites canoniques homme/femme en combat tant qu'un vrai système modulaire pose-par-pose n'existe pas.

4. ICÔNES
---------
Les icônes individuelles sont déjà extraites.
Quand une icône V0.5 existe, ne pas la remplacer par Lucide/SVG générique.

5. COFFRE
---------
- closed.png
- open.png
- open-glow.png
La récompense de roulette doit apparaître immédiatement dans une modal/bottom-sheet.
Aucun scroll manuel vers le bas après l'arrêt.

6. ARÈNE PRIMORDIALE
--------------------
- background-full.png : décor complet HD.
- ground.png          : VRAI SOL transparent avec terre/rochers/végétation.
- foreground.png      : cadre jungle transparent.
- contact-shadow.png  : ombre sous combattant humain.
- contact-shadow-boss.png : ombre Boss.
Le joueur et l'ennemi doivent être ancrés sur groundY ≈ 82 %.
Humains : 13–16 % de hauteur utile.
Boss : 20–24 %.
Le foreground ne doit jamais cacher une grande partie des jambes.

7. SOURCE
---------
source/ conserve les fichiers d'origine pour audit.
Le runtime doit utiliser les assets dérivés ci-dessus et manifest.json.

8. QUALITÉ
----------
Avant validation :
- aucun label d'atlas visible ;
- aucun morceau d'une cellule voisine ;
- aucune variation de taille idle/KO ;
- aucune arme flottante ;
- aucune jambe coupée ;
- contact au sol lisible ;
- pas de upscale excessif/flou.
