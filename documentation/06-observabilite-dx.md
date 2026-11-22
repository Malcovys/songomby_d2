# 6. Observabilité, démarrage rapide et gouvernance

## Démarrage rapide

Prérequis :

- Node.js 26 ;
- pnpm 12 ;
- Docker ;
- accès à une API LLM compatible OpenAI pour l'assistant.

Installation :

```bash
cp .env.example .env
pnpm install
pnpm infra:up
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Pour démarrer toutes les applications avec Docker Compose en mode développement :

```bash
docker compose -f compose.dev.yml up
```

Pour démarrer l'ensemble avec les profils applicatifs :

```bash
docker compose --profile app up -d
```

L'API exige une URL PostgreSQL valide dès son démarrage. L'assistant répond avec `llm_not_configured` si `LLM_API_KEY` ou `LLM_MODEL` est absent.

## Structure du dépôt

| Chemin | Rôle |
|---|---|
| `apps/api` | API NestJS |
| `apps/web` | frontend React/PWA |
| `packages/core` | services métier, Prisma, configuration, health et logging |
| `packages/contracts` | schémas Zod et types API |
| `prisma` | schéma et migrations |
| `docker` | Dockerfiles, Nginx et Caddy |
| `compose.yml` | infrastructure Docker de production |
| `compose.dev.yml` | infrastructure Docker de développement |
| `documentation` | documentation technique et métier |

## Logging

NestJS utilise `nestjs-pino` et `pino-http`. `LOG_LEVEL` accepte `fatal`, `error`, `warn`, `info`, `debug` ou `trace`, avec `info` par défaut.

Le format JSON structuré doit être privilégié en production. Les logs ne doivent jamais contenir :

- `LLM_API_KEY` ;
- mots de passe PostgreSQL ;
- jetons ;
- données RH sensibles ;
- corps complets contenant des pièces justificatives.

La centralisation et la durée de conservation des logs ne sont pas configurées.

## Health checks

- `GET /api/v1/health/live` : retourne `{ "status": "ok" }` ;
- `GET /api/v1/health/ready` : vérifie PostgreSQL avec un timeout de 2 secondes ;
- en cas d'échec, le statut est `degraded` et HTTP 503 est retourné.

Nginx transmet `/api/` vers l'API. Les orchestrateurs peuvent utiliser ces routes pour les sondes liveness/readiness.

## Métriques et alertes

Aucun système de métriques, tracing distribué ou alerting n'est configuré. À ajouter :

- latence HTTP par route ;
- erreurs 4xx/5xx ;
- disponibilité PostgreSQL ;
- latence des requêtes Prisma ;
- latence et taux d'erreur du fournisseur LLM ;
- nombre de propositions en attente/annulées/appliquées/échouées ;
- CPU, mémoire, disque et connexions PostgreSQL ;
- état du service worker et erreurs frontend.

## Runbooks

### API indisponible

1. vérifier les logs API ;
2. vérifier que PostgreSQL est sain ;
3. vérifier `DATABASE_URL` ;
4. redémarrer l'API ;
5. vérifier `/api/v1/health/live` puis `/api/v1/health/ready`.

### PostgreSQL saturé ou inaccessible

1. vérifier les logs et l'espace disque ;
2. vérifier les connexions actives ;
3. vérifier le volume Docker `postgres-data` ;
4. restaurer une sauvegarde validée uniquement selon la procédure approuvée ;
5. réappliquer les migrations si nécessaire.

### Fournisseur LLM indisponible

1. vérifier `LLM_API_KEY`, `LLM_MODEL` et `LLM_BASE_URL` ;
2. consulter les erreurs `llm_unreachable`, `llm_rate_limited` ou `llm_overloaded` ;
3. changer temporairement de modèle si nécessaire ;
4. vérifier que les propositions en attente restent dans l'interface ;
5. ne jamais exposer la clé API dans les logs.

### Certificat ou domaine Caddy

1. vérifier `NEXORA_DOMAIN` ;
2. vérifier les ports 80/443 ;
3. consulter les logs Caddy ;
4. vérifier l'enregistrement DNS ;
5. redémarrer Caddy après correction.

## Workflow Git

Aucune convention Git formelle n'est visible dans le dépôt. À convenir entre l'équipe :

- stratégie de branches ;
- format des commits ;
- règles de revue ;
- politique de tags/releases ;
- fréquence des mises à jour de dépendances ;
- obligation de documenter les changements d'API et de modèle.

## Gouvernance de la documentation

Cette documentation vit dans `documentation/` à la racine du dépôt. Elle doit être revue lors de toute modification affectant :

- une API ou un contrat Zod ;
- le schéma Prisma ;
- la configuration Docker ;
- les variables d'environnement ;
- les règles métier ;
- les mécanismes de sécurité ;
- les procédures d'exploitation ;
- les tests ou la CI/CD.
