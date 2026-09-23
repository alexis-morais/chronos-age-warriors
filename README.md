# Chronos Age Warriors — V0.4.1

Jeu d’arène automatique mobile-first dans lequel un Warrior unique traverse l’Ère Primordiale. Le build, l’équipement et vingt compétences passives influencent des combats spectaculaires dont le résultat reste déterminé par un moteur seedé indépendant de l’interface.

## Lancer le jeu

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

Scripts disponibles :

- `npm run dev` — serveur Vite local ;
- `npm run assets:v04` — régénère les sprites de production depuis les atlas V0.4 ;
- `npm run build` — vérification TypeScript stricte puis build de production ;
- `npm run lint` — analyse ESLint ;
- `npm test` — tests Vitest.

## Architecture

- `src/game.ts` centralise le RNG seedable, les formules, le moteur de combat, le gacha et les progressions.
- `src/config.ts` contient toutes les valeurs d’équilibrage modifiables.
- `src/data.ts` décrit équipements, compétences, ennemis et badges.
- `src/storage.ts` fournit une abstraction de sauvegarde `localStorage` versionnée et le reset quotidien local.
- `src/App.tsx` orchestre les écrans et les boucles de jeu.
- `src/art/assetsV04.ts` centralise le manifeste des sprites et les profils d’animation par famille d’arme.
- `src/components/Art.tsx` assemble l’avatar de création et les sprites de production V0.4.

## Systèmes présents

- création et apparence du Warrior avec distribution initiale RNG équitable ;
- Hub responsive, statistiques effectives, équipement visible et compétences ;
- collection complète de 15 équipements primordiaux et 11 badges ;
- coffre à roulette dont le résultat est déterminé avant l’animation ;
- recyclage des doublons, montée de niveau des équipements et compétence Mythique ;
- Entraînement quotidien, campagne visuelle de 20 nœuds, Élites, champions et Boss ;
- moteur de combat déterministe, timeline d’événements, animations, vitesse ×1/×2/×3 et passage immédiat au résultat ;
- niveaux Warrior, choix attribut/compétence au niveau 5, trophée du Boss et récompense de fin d’ère ;
- sauvegarde locale versionnée et compteurs quotidiens.

## Refonte V0.2

- Avatar entièrement redessiné avec couches modulaires pour le corps, les cheveux, six armures portées et neuf armes visibles.
- Illustrations SVG individuelles pour chaque équipement, cartes de collection enrichies et silhouettes verrouillées.
- Arène reconstruite en plans successifs, Warriors ramenés à environ 20–25 % de sa hauteur et HUD compact en partie haute.
- Séquences visuelles pour anticipation, déplacement, projectile, impact, critique, esquive, parade, poussière et K.O.
- Fiches de loot complètes avec comparaison des statistiques réelles, choix Équiper/Stocker et progression avant/après des doublons recyclés.
- Présentation consultable des vingt compétences et iconographie d’interface Lucide harmonisée.

## Intégration artistique V0.4

- Les atlas validés de `public/assets-v04` sont normalisés en 155 sprites transparents reproductibles dans `public/assets-v04/derived`.
- Le manifeste central interdit toute dépendance d’exécution envers `public/art-direction` et sélectionne le Warrior complet selon le genre, l’arme et l’état visuel.
- Le combat pilote anticipation, approche, attaque, impact, blessure, esquive, récupération, K.O. et victoire à partir de la timeline déterministe existante.
- Les profils massue, lance, hache, arc, griffes, marteau et relique ajustent déplacement, durée, projectile et sensation d’impact sans modifier le résultat simulé.
- L’arène est rendue en trois plans V0.4, les ennemis disposent de six poses et le Boss de campagne utilise le Mammouth.
- Le Hub, la Collection, le Coffre et la création réemploient le logo, les équipements et la palette de la production V0.4.
- En développement, `?spriteLab=1` ouvre une grille de contrôle de tous les Warriors, ennemis, états et effets.

## Correctif visuel V0.4.1

- Les quinze équipements sont redécoupés par composante visuelle afin d’éliminer les fragments de cases voisines.
- Le Warrior du Hub conserve son ratio natif et son agrandissement est plafonné pour éviter le flou et les recadrages agressifs.
- Les combattants humains occupent environ 15 % de la hauteur utile de l’arène, restent ancrés au sol et ne sont plus masqués par le premier plan.
- Les transitions de poses, attaques, projectiles, impacts, esquives et K.O. utilisent des animations courtes basées sur `transform` et `opacity`.
- Le Sprite Lab affiche les dimensions natives et rendues, ainsi que des aides de contrôle pour le quadrillage, les boîtes et la ligne de base.

Les fichiers de `public/art-direction` restent des références de conception uniquement et ne sont jamais importés à l’exécution.

## Reporté après la V0.1

- duel asynchrone réel et backend ;
- autres ères, comptes multi-appareils et services en ligne ;
- équilibrage avancé après télémétrie et davantage de variations d’arènes.

Le projet reste volontairement local : aucune publication ou opération Git d’écriture n’est effectuée par l’application.
