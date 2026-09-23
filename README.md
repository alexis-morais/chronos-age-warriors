# Chronos Age Warriors — V0.3

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
- `src/components/Art.tsx` assemble l’avatar SVG modulaire, les armes portées et les planches de référence fournies.

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

## Intégration artistique V0.3

- Logo, équipements, ennemis et décors utilisent directement les planches validées de `public/art-direction`.
- Hub, création et arène reprennent la lumière, les matières et la composition des références sans remplacer la structure fonctionnelle existante.
- Warrior redressé et affiné vers une silhouette adulte, avec barbe optionnelle, armures modulaires et arme réellement tenue en main.
- Ennemis cadrés depuis la planche Primordiale et animations de combat renforcées autour de l’arme, des impacts et des déplacements.
- Les SVG internes restent utilisés pour les silhouettes d’objets verrouillés et les versions portées, adaptées aux contraintes de lisibilité et d’animation du jeu.

## Reporté après la V0.1

- duel asynchrone réel et backend ;
- autres ères, comptes multi-appareils et services en ligne ;
- équilibrage avancé après télémétrie et davantage de variations d’arènes.

Le projet reste volontairement local : aucune publication ou opération Git d’écriture n’est effectuée par l’application.
