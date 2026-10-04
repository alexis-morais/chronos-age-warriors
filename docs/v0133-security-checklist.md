# V0.13.3 — intégration et sécurité locale

État au début de la passe, déclaré par le propriétaire : V0.13.1 et V0.13.2 sont appliquées dans le projet Supabase réel ; la fonction `duel` est déployée et un vrai compte obtient 10/10 charges et « Aucun adversaire disponible. ». Aucun deuxième compte factice ne doit être créé. Ces faits ne valent pas validation du nouveau code V0.13.3 tant qu'il n'est pas déployé.

## Actions manuelles après cette passe

1. Appliquer **uniquement** `supabase/migrations/202610040003_v0133_security.sql` dans SQL Editor. Ne pas rejouer ni modifier les migrations V0.13.1 / V0.13.2. Cette migration rend Classement et Profil robustes aux saves sans Warrior ou à un niveau corrompu ; les RPC restent exécutables uniquement par `service_role`.
2. Redéployer la fonction `duel` à partir de `supabase/functions/duel/index.ts` et `engine.js`, généré par `pnpm run build:duel-edge`. Le build Edge ne doit contenir aucun asset public. Aucun changement de secret n'est demandé.
3. Vérifier que l'environnement **serveur** fournit `SUPABASE_URL`, une clé publique (`SUPABASE_ANON_KEY` ou `SUPABASE_PUBLISHABLE_KEY`) et une clé privée (`SUPABASE_SERVICE_ROLE_KEY` ou `SUPABASE_SECRET_KEY`). La clé privée ne doit jamais être préfixée `VITE_`, livrée au navigateur ou loggée.
4. Conserver le réglage distant actuel concernant la vérification JWT legacy de plateforme : la fonction vérifie elle-même chaque bearer via `auth.getUser(token)`. Une requête sans bearer ou avec token invalide doit donner 401.
5. Faire un contrôle `OPTIONS` depuis le navigateur : `Access-Control-Allow-Headers` doit inclure `authorization, x-client-info, apikey, content-type`. L'origine `*` reste temporaire pour le développement ; la restreindre au domaine public définitif **quand celui-ci sera connu**, avant la V1 publique, sans inventer de domaine maintenant.
6. Tester avec le compte réel existant : session persistante, cloud save, réserve Duel, absence d'adversaire comme état normal, classement à 0 et profil public. Le premier vrai Duel entre **deux vrais comptes** reste en attente d'un second joueur naturel, sans compte QA fantôme.

## Frontières de confiance

- Le navigateur transmet `action`, `requestId` et éventuellement `username`, jamais un `attackerId`, un seed, un winner, des points ou des récompenses. L'Edge Function déduit l'utilisateur du token et calcule le combat avec `src/game.ts` + `src/duelRules.ts` compilés dans `engine.js`.
- Les deux tables compétitives sont sous RLS et sans droit d'écriture direct pour `public`, `anon` ou `authenticated`. Les cinq RPC Duel sont réservées au rôle serveur. `(attacker_id, request_id)` est unique ; les révisions des saves sont contrôlées en transaction.
- La save de Duel est validée **avant** les migrations solo qui peuvent réparer des niveaux. Un Warrior, niveau ou équipement impossible est refusé sans résolution ni dépense de charge. Les stats et passifs sont recalculés des définitions, jamais pris du client.
- La cloud save solo reste partiellement client-driven : un client déterminé peut encore falsifier une progression ou une possession via `save_game`. Cette passe ne prétend pas fournir un anti-cheat complet ; les écritures compétitives, le résultat et les récompenses Duel restent serveur.
- Une ancienne révision locale ne remplace pas silencieusement la save récompensée par le serveur : le CAS provoque le conflit existant. Le mode `?admin` local n'accède pas au backend.

## Backlog post-V0.13, sans valeur nouvelle décidée

Refonte XP ; difficulté globale (un Peu commun neuf peut traverser l'Aventure trop facilement) ; descriptions concrètes des 36 passifs ; doublons Warrior avec Recycler et valeurs à décider ; retirer « ×1 » des boutons simples des coffres ; sortir proprement de la Faille à l'élimination sans écran Défaite ; économie/rétention ; grand polish UI/combat/assets.
