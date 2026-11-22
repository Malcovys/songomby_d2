# 3. Frontend, backend et APIs

## Frontend

### Architecture frontend

- React 19 ;
- TanStack Router pour le routage ;
- TanStack Query pour le cache des données API ;
- Tailwind CSS 4 ;
- composants Lucide ;
- PWA gérée par Vite PWA / Workbox ;
- alias `@` vers `apps/web/src` ;
- rendu SPA côté client, sans SSR/SSG/ISR ;
- stale time de 30 secondes et une nouvelle tentative pour les requêtes React Query.

Les modules principaux sont organisés sous `apps/web/src/features` : agent, employés, congés, absences, jours fériés, fiches de paie, tickets et workspace. Le workspace est une interface à onglets avec une vue centrale unique à `/`.

### PWA

Le manifest déclare NEXORA comme application autonome. Le service worker est enregistré automatiquement à l'ouverture. Les routes commençant par `/api/` sont exclues du fallback PWA. Les assets sont servis avec des règles de cache par Nginx.

### State management

- React Query contient les données récupérées depuis l'API ;
- les vues utilisent des stores/hooks locaux pour l'état UI ;
- aucune solution globale Redux/Zustand n'est présente.

### Gestion des erreurs

Le client HTTP transforme les réponses non réussies en `ApiRequestError` avec `status`, `code` et `message`. Les écrans doivent afficher les messages métier plutôt que les codes techniques. Le système contient actuellement peu de routes dédiées aux pages 404/500 : `TanStack Router` n'en déclare pas explicitement.

## Backend

### Contrôleurs

Le préfixe global est `api/v1`, les ressources sont :

| Ressource | Routes principales |
|---|---|
| Health | `GET /api/v1/health/live`, `GET /api/v1/health/ready` |
| Employés | `GET/POST /api/v1/employees`, `GET/PATCH/DELETE /api/v1/employees/:id` |
| Congés | `GET/POST /api/v1/leaves`, `GET /api/v1/leaves/:id`, `PATCH /api/v1/leaves/:id/status` |
| Absences | `GET/POST /api/v1/absences`, `GET/PATCH/DELETE /api/v1/absences/:id` |
| Jours fériés | `GET/POST /api/v1/holidays`, `POST /api/v1/holidays/bulk`, `DELETE /api/v1/holidays/:id` |
| Fiches de paie | `POST /api/v1/payslips/preview`, `GET/POST /api/v1/payslips`, `GET/DELETE /api/v1/payslips/:id` |
| Tickets | `GET/POST /api/v1/tickets`, `GET/PATCH/DELETE /api/v1/tickets/:id` |
| Agent | `POST /api/v1/agent/chat`, `POST /api/v1/agent/chat/stream`, `POST /api/v1/agent/proposals/:id/apply`, `POST /api/v1/agent/proposals/:id/cancel` |

Les schémas détaillés sont définis dans `packages/contracts/src`. Aucun fichier OpenAPI/Swagger n'est généré actuellement. Les contrats Zod constituent la source partagée des types et validations.

### Validation, pagination et tri

- les corps et paramètres sont validés par `ZodValidationPipe` ;
- la pagination accepte `page` (par défaut 1) et `limit` (25 par défaut, maximum 100) ;
- les collections renvoient `items`, `page`, `limit` et `total` ;
- les recherches utilisent des filtres spécifiques selon la ressource ;
- les montants décimaux sont transportés en chaînes pour éviter les conversions JavaScript ;
- les dates sont des chaînes ISO au format `YYYY-MM-DD`.

Un mécanisme d'idempotence avec clé dédiée n'est pas implémenté. L'application d'une proposition reste protégée contre le double clic par une réserve atomique Prisma.

### Format des erreurs

Le client partage un schéma d'erreur contenant `code`, `message`, `details` facultatifs et `requestId`. Certaines exceptions actuelles retournent seulement `code` et `message`. Une normalisation globale RFC 7807 / Problem Details n'est pas encore implémentée.

### Authentification

Aucune authentification utilisateur, aucun JWT, aucune session, aucune clé API et aucune gestion RBAC/ABAC ne sont actuellement implémentés. L'accès à l'API est donc limité principalement par le périmètre réseau/de déploiement. Cette lacune doit être fermée avant une mise à disposition multi-utilisateurs.

### Assistant et actions

Les outils de lecture sont exécutés directement. Les outils d'écriture préparés sont `add_holidays`, `create_leave`, `create_ticket` et `generate_payslip`. Chaque proposition contient un résumé lisible. L'utilisateur peut appliquer ou annuler depuis le frontend.
