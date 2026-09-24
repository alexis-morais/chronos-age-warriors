# Chronos Age Warriors — V0.5

Jeu d’arène automatique mobile-first dans lequel un Warrior unique traverse l’Ère Primordiale. Le build, l’équipement et vingt compétences passives influencent des combats spectaculaires dont le résultat reste déterminé par un moteur seedé indépendant de l’interface.

## Lancer le jeu

Prérequis : Node.js 20 ou plus récent.

```bash
pnpm install
pnpm run dev
```

Scripts disponibles :

- `pnpm run dev` — serveur Vite local ;
- `pnpm run assets:v04` — régénère les anciens sprites de secours V0.4 ;
- `pnpm run build` — vérification TypeScript stricte puis build de production ;
- `pnpm run lint` — analyse ESLint ;
- `pnpm test` — tests Vitest.

## Architecture

- `src/game.ts` centralise le RNG seedable, les formules, le moteur de combat, le gacha et les progressions.
- `src/config.ts` contient toutes les valeurs d’équilibrage modifiables.
- `src/data.ts` décrit équipements, compétences, ennemis et badges.
- `src/storage.ts` fournit une abstraction de sauvegarde `localStorage` versionnée et le reset quotidien local.
- `src/App.tsx` orchestre les écrans et les boucles de jeu.
- `src/art/assetsV05.ts` centralise les ressources de production V0.5, les 162 poses joueur et les profils d’animation.
- `src/components/Art.tsx` assemble l’avatar de création et les sprites de production V0.5.

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

## Production V0.5

- Le Hub emploie les portraits HD homme/femme V0.5, sans cercles techniques ni sur-recadrage, avec un mouvement respiratoire très discret.
- Le combat utilise neuf familles d’armes, deux genres et neuf états par séquence, tous sur un canvas constant de 512×512 et une ligne de sol commune.
- Les frames de transition (`idle-to-anticipation`, `anticipation-to-attack`, `attack-to-recovery`) empêchent les changements brusques de pose sans interpoler artificiellement les bitmaps.
- L’arène officielle V0.5 est superposée en arrière-plan, sol et premier plan avec ombres de contact, effets d’impact, flèche, esquive et critiques dédiés.
- Les proportions humaines visent 13–16 % de la hauteur utile, contre 20–24 % pour le Boss, et les combattants restent répartis aux quarts de l’arène.
- Le coffre officiel V0.5 conserve son résultat pré-calculé et affiche la récompense dans une fiche modale complète, avec comparaison avant Équiper/Stocker ou progression du doublon recyclé.
- Les icônes illustrées V0.5 remplacent l’iconographie générique pour la navigation, les statistiques et les états système.
- `?spriteLab=1` ouvre en développement toutes les poses, armes, genres, ennemis, ombres et effets nécessaires à la QA visuelle.
- Le build exclut les planches source, les références de direction artistique et les feuilles de QA : elles restent disponibles dans le dépôt sans alourdir le paquet de production.

Les seuls fallbacks V0.4 encore utilisés à l’exécution sont le logo, les illustrations d’équipement et les sprites ennemis, faute d’équivalents dédiés dans le pack V0.5. Les fichiers V0.4 restent donc intacts.

Les fichiers de `public/art-direction` restent des références de conception uniquement et ne sont jamais importés à l’exécution.

## Reporté après la V0.1

- duel asynchrone réel et backend ;
- autres ères, comptes multi-appareils et services en ligne ;
- équilibrage avancé après télémétrie et davantage de variations d’arènes.

Le projet reste volontairement local : aucune publication ou opération Git d’écriture n’est effectuée par l’application.
