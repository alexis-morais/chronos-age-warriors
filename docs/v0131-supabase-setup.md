# V0.13.1 — activation Supabase (à effectuer par le propriétaire)

Cette passe ne modifie pas le projet Supabase distant. Le jeu normal ne peut être validé de bout en bout avant l'application de la migration.

1. Relire puis exécuter une seule fois `supabase/migrations/202610040001_v0131_accounts_cloud_save.sql` dans le SQL Editor du projet Chronos.
2. Vérifier dans Supabase Auth : Email activé, confirmation d'e-mail activée, inscriptions anonymes désactivées.
3. Ajouter aux Redirect URLs l'origine et le chemin exacts du serveur local utilisé pour les tests (le port peut changer), puis l'URL publique du jeu avant déploiement. Conserver les entrées `127.0.0.1:5173` déjà configurées.
4. Définir `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` dans `.env.local` pour le développement. Pour GitHub Pages, créer les deux **Repository variables** du même nom : le workflow local est prêt à les transmettre au build, mais aucune variable distante n'a été créée par cette passe. Ne jamais utiliser de secret/service-role côté Vite.
5. Créer deux comptes de test distincts, confirmer leurs e-mails et vérifier les scénarios : pseudo dupliqué (casse différente), compte A/B sur le même navigateur, rechargement, progression multi-appareils, conflit de révision, logout local, reconnexion hors ligne, première visite hors ligne refusée.

La sauvegarde officielle est `public.game_saves`. Le cache local est séparé par `user_id` (`chronos.save.<user_id>`). Aucun export/import automatique des anciennes sauvegardes locales n'est effectué, conformément à la règle « nouveau compte = nouvelle partie ».

Le service worker précache le shell, les icônes et les poses idle principales. Les autres gros sprites sont cachés après consultation ; un contenu jamais chargé en ligne peut rester indisponible hors ligne. `?admin` reste réservé à `localhost`/`127.0.0.1` et ne synchronise aucune donnée.
