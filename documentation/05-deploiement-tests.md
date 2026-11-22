# 5. Environnement, déploiement et qualité

## Environnement local

| Élément | Valeur |
|---|---|
| Frontend | `http://localhost:5173` |
| API | `http://localhost:3000/api/v1` |
| PostgreSQL | `localhost:5432` |
| Utilisateur | `nexora` |
| Base | `nexora` |
| Mot de passe local par défaut | `nexora` |

Le fichier `.env.example` contient :

- `NODE_ENV=development` ;
- `PORT=3000` ;
- `LOG_LEVEL=info` ;
- `POSTGRES_PORT=5432` ;
- `DATABASE_URL=postgresql://nexora:nexora@localhost:5432/nexora`.

Le chargeur d'environnement accepte aussi :

- `LLM_API_KEY` : obligatoire pour utiliser l'assistant ;
- `LLM_MODEL` : modèle compatible OpenAI ;
- `LLM_BASE_URL` : URL de base, avec Gemini comme défaut ;
- `POSTGRES_PASSWORD` : mot de passe Docker ;
- `NEXORA_DOMAIN` : domaine Caddy ;
- `API_PROXY_TARGET` : cible du proxy Vite.

## Docker

`compose.yml` définit PostgreSQL, l'API, le web et Caddy. Les profils :

- le profil par défaut démarre uniquement PostgreSQL ;
- `app` ajoute l'API, le frontend et Caddy ;
- Caddy expose les ports 80 et 443 ;
- `compose.dev.yml` ajoute les volumes de développement, les watchers et les dépendances entre services.

Caddy est configuré avec le domaine `localhost` par défaut. L'en-tête HSTS est activé.

## CI/CD

Aucun workflow CI/CD hébergé n'est présent dans le dépôt. Les commandes disponibles sont :

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm format:check
```

Un pipeline recommandé doit exécuter au minimum :

1. installation verrouillée avec pnpm ;
2. génération Prisma ;
3. formatage ;
4. lint ;
5. typecheck ;
6. tests ;
7. build des applications ;
8. scan de secrets/dépendances ;
9. build des images ;
10. déploiement manuel ou automatique selon l'environnement.

Les stratégies blue/green, canary et rolling ne sont pas configurées.

## Qualité et tests

Aucun fichier de test unitaire ou E2E n'est actuellement visible dans le dépôt. La stratégie minimale recommandée est :

- unitaires : services métier, calculs de paie, validation Zod ;
- intégration : contrôleurs NestJS, Prisma et base PostgreSQL ;
- agent : lecture, création de proposition, application unique, annulation et échec ;
- E2E : parcours employés, congés, paie et assistant ;
- sécurité : contrôles d'autorisation, injection, limites de taille et de débit ;
- charge : recherche, pagination, streaming LLM et base PostgreSQL.

Commandes actuelles :

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm format:check
```

Pré-requis actuels :

- Node.js 26 ;
- pnpm 12.21.0 ;
- Docker ;
- PostgreSQL démarré ;
- variables d'environnement valides ;
- clé LLM uniquement pour tester l'assistant.

## Scénarios de recette

- créer, rechercher, modifier et supprimer un employé ;
- empêcher un matricule ou e-mail déjà utilisé ;
- créer un congé et changer son statut ;
- créer plusieurs jours fériés en bloc ;
- calculer un aperçu de fiche de paie ;
- empêcher une double fiche pour le même employé/mois/année ;
- poser une question à l'assistant ;
- appliquer une proposition une seule fois ;
- annuler une proposition ;
- vérifier l'état liveness/readiness ;
- vérifier les modes hors ligne ou reconnecté de la PWA.
