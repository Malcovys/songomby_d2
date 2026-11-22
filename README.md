# NEXORA

ERP RH intelligent, modulaire et sécurisé pour une entreprise.

Pour une vue complète du projet, consultez la [documentation](documentation/README.md).

## Prérequis

- Node.js 26 (voir `.nvmrc`)
- pnpm 12.21.0
- PostgreSQL 18 pour une installation sans Docker
- Docker Desktop avec Docker Compose pour une installation avec Docker

## Installation avec Docker

Cette méthode lance PostgreSQL, l'API et le frontend en conteneurs. Node.js et pnpm ne sont pas nécessaires sur la machine hôte.

1. Depuis la racine du dépôt, créez le fichier de configuration :

   ```bash
   cp .env.example .env
   ```

2. Construisez et démarrez l'environnement de développement :

   ```bash
   docker compose -f compose.dev.yml up --build
   ```

   Au premier démarrage, Docker installe les dépendances et construit les packages. Laissez cette commande ouverte pour voir les logs.

3. Dans un second terminal, appliquez les migrations :

   ```bash
   docker compose -f compose.dev.yml exec api pnpm db:migrate
   ```

L'application est disponible aux adresses suivantes :

- Frontend : <http://localhost:5173>
- API : <http://localhost:3000/api/v1>
- Vérification de l'API : <http://localhost:3000/api/v1/health/ready>

Pour arrêter les services, utilisez `Ctrl+C`, puis :

```bash
docker compose -f compose.dev.yml down
```

Les données PostgreSQL sont conservées dans un volume Docker. Pour les supprimer également, exécutez `docker compose -f compose.dev.yml down -v`.

## Installation sans Docker

Cette méthode nécessite Node.js, pnpm et un serveur PostgreSQL accessibles depuis la machine.

1. Installez Node.js 26 et pnpm 12.21.0, puis démarrez PostgreSQL 18.
2. Depuis la racine du dépôt, créez le fichier de configuration :

   ```bash
   cp .env.example .env
   ```

3. Vérifiez dans `.env` que `DATABASE_URL` correspond à votre instance PostgreSQL. Les valeurs de l'exemple sont :

   ```dotenv
   DATABASE_URL=postgresql://nexora:nexora@localhost:5432/nexora
   ```

   La base `nexora` et l'utilisateur correspondant doivent exister dans PostgreSQL.

4. Installez les dépendances, générez le client Prisma et appliquez les migrations :

   ```bash
   pnpm install
   pnpm db:generate
   pnpm db:migrate
   ```

5. Démarrez l'API et le frontend :

   ```bash
   pnpm dev
   ```

L'application est disponible aux mêmes adresses que pour l'installation Docker :

- Frontend : <http://localhost:5173>
- API : <http://localhost:3000/api/v1>
- Vérification de l'API : <http://localhost:3000/api/v1/health/ready>

Pour utiliser l'assistant, configurez également `LLM_API_KEY` et `LLM_MODEL` dans `.env`. Le fournisseur par défaut est Gemini ; `LLM_BASE_URL` peut être défini pour une autre API compatible OpenAI.

## Commandes utiles

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm format:check
```

## Structure du dépôt

| Chemin | Rôle |
|---|---|
| `apps/api` | API HTTP NestJS |
| `apps/web` | Application React et PWA |
| `packages/core` | Services métier, Prisma, configuration et logging |
| `packages/contracts` | Schémas Zod et types API partagés |
| `prisma` | Schéma et migrations de base de données |
| `docker` | Dockerfiles, configuration Nginx et Caddy |
| `documentation` | Documentation métier et technique |