# 2. Architecture logicielle

## Architecture globale

Nexora est un monorepo modulaire avec une application monolithique NestJS côté API. Les principaux composants sont :

```text
    Navigateur
        |
        | HTTP JSON ou Server-Sent Events
        v
Caddy / Nginx
        |
        v
API NestJS (préfixe /api/v1)
        |
        +--> services métier
        +--> AgentService + outils
        +--> Prisma
                   |
                   v
              PostgreSQL

AgentService --> API compatible OpenAI (Gemini par défaut)
```

Le monorepo contient :

- `apps/web` : React 19, TanStack Router/Query, Tailwind CSS et PWA ;
- `apps/api` : API NestJS ;
- `packages/contracts` : schémas Zod et types partagés ;
- `packages/core` : configuration, Prisma, logging, validation et services métier ;
- `prisma` : schéma et migrations ;
- `docker` : images, Nginx et Caddy ;
- `compose.yml` / `compose.dev.yml` : infrastructure locale et conteneurisée.

## Flux de données

Le parcours HTTP standard est :

1. le navigateur appelle une route sous `/api/v1` ;
2. NestJS valide les paramètres via les pipes Zod ;
3. le contrôleur délègue au service métier ;
4. Prisma exécute la requête PostgreSQL ;
5. le contrôleur renvoie JSON ou `204 No Content`.

Le parcours de l'assistant est :

1. le frontend envoie les derniers messages à `/api/v1/agent/chat/stream` ;
2. NestJS ouvre un flux SSE ;
3. `AgentService` construit le contexte et appelle `LlmClient` ;
4. le modèle peut demander un outil ;
5. les outils de lecture sont exécutés immédiatement ;
6. les outils d'écriture créent une entrée `AuditLog` en `PREVIEW` ;
7. l'utilisateur applique ou annule la proposition via une route dédiée ;
8. l'application atomique met à jour le statut et les données métier.

## Communication

- REST JSON pour les fonctionnalités CRUD ;
- SSE pour le streaming de l'assistant ;
- API HTTP compatible OpenAI pour Gemini, configurée par des variables d'environnement ;
- aucune file, broker ou job asynchrone n'est actuellement implémenté ;
- aucune communication inter-services réseau n'est utilisée hors des composants HTTP décrits ci-dessus.

## Retry et résilience du fournisseur LLM

`LlmClient` applique jusqu'à trois tentatives pour les statuts 429, 500, 502, 503 et 504, avec des délais exponentiels simples de 2 puis 4 secondes. Les erreurs réseau ou délais sont également repris. Le timeout est fixé à 60 secondes. Une erreur annulée par la page utilisateur n'est pas transformée en réponse.

Les statuts métier sont exposés sous forme d'erreurs NestJS structurées : `llm_not_configured`, `llm_unreachable`, `llm_rate_limited`, `llm_overloaded`, `llm_error`, `llm_empty` ou `llm_interrupted`.

## Intégrations tierces

- PostgreSQL : stockage principal ;
- Gemini : fournisseur LLM par défaut via une API compatible OpenAI ;
- Caddy : terminaison TLS et reverse proxy en production ;
- Docker : image des applications et infrastructure ;
- pgvector/pgvector est utilisé comme image PostgreSQL, sans fonctionnalité vectorielle explicitement utilisée dans le code actuel.

## Décisions techniques

| Décision | Justification | Alternatives / limites |
|---|---|---|
| Monorepo pnpm/Turborepo | Partage des contrats, génération dépendante et commandes cohérentes | Complexité accrue pour le déploiement, mais simplicité locale |
| NestJS | Structure modulaire, injection de dépendances et contrôleurs REST | Monolithe adapté à la taille actuelle |
| React 19 + Vite | UX interactive et développement rapide | SPA sans SSR/SSG |
| TanStack Router/Query | Routage léger et gestion du cache serveur | Une seule route principale est déclarée actuellement |
| Zod | Validation commune entre API, outil assistant et réponses frontend | Les schémas restent à synchroniser avec les modèles Prisma |
| Prisma | Migrations et accès typé à PostgreSQL | Client généré dans `packages/core/src/platform/prisma/generated` |
| PostgreSQL | Relations, contraintes et transactions | Doit être sauvegardé hors du dépôt |
| SSE | Streaming simple des réponses et statuts | Pas de reconnection/replay spécifiques dans le frontend |
| Docker/Caddy | Déploiement reproductible et TLS automatique | CI/CD et gestion des secrets restent à formaliser |
