# Chronos Age Warriors — V0.1

Jeu d’arène automatique mobile-first dans lequel un Warrior unique traverse l’Ère Primordiale. Le build, l’équipement et vingt compétences passives influencent des combats spectaculaires dont le résultat reste déterminé par un moteur seedé indépendant de l’interface.

## Lancer le jeu

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

Scripts disponibles :

- `npm run dev` — serveur Vite local ;
- `npm run build` — vérification TypeScript stricte puis build de production ;
- `npm run lint` — analyse ESLint ;
- `npm test` — tests Vitest.

## Architecture

- `src/game.ts` centralise le RNG seedable, les formules, le moteur de combat, le gacha et les progressions.
- `src/config.ts` contient toutes les valeurs d’équilibrage modifiables.
- `src/data.ts` décrit équipements, compétences, ennemis et badges.
- `src/storage.ts` fournit une abstraction de sauvegarde `localStorage` versionnée et le reset quotidien local.
- `src/App.tsx` orchestre les écrans et les boucles de jeu.
- `src/components/Art.tsx` produit les avatars et illustrations SVG modulaires originales.

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

## Reporté après la V0.1

- duel asynchrone réel et backend ;
- autres ères, comptes multi-appareils et services en ligne ;
- équilibrage avancé après télémétrie et davantage de variations d’arènes.

Le projet reste volontairement local : aucune publication ou opération Git d’écriture n’est effectuée par l’application.
