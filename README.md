# Chronos Age Warriors

Jeu d’arène mobile-first en React, TypeScript et Vite. Cette version locale retire l’ancien système de création de personnage et prépare une future collection de Warriors prédéfinis, sans encore construire le roster.

## Développement

```bash
pnpm install
pnpm run dev
```

Validation : `pnpm test`, `pnpm run lint`, `pnpm exec tsc -b --pretty false`, `pnpm run build`.

## Socle actuel

- `src/warriors.ts` définit un unique Warrior temporaire de développement, sans apparence personnalisable. Ce n’est pas un personnage du futur roster.
- `src/storage.ts` utilise une sauvegarde locale v2. Les anciennes sauvegardes v1 ne sont pas migrées dans cette phase de développement.
- `src/game.ts` conserve le moteur de combat déterministe, la progression, l’équipement, le coffre et les récompenses.
- `src/data.ts` conserve les 15 équipements, 20 compétences et 11 badges.
- Les 108 poses joueur V0.6 dans `public/assets-v06/derived/player` restent des placeholders de combat pour Aventure et Entraînement, jusqu’à la création des nouveaux Warriors.
- Les illustrations d’inventaire et les sprites ennemis V0.4 restent utilisés. Quelques décors et effets V0.5 génériques restent référencés.

Le projet est uniquement local. Aucune opération Git d’écriture ni publication n’est automatisée.
