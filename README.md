# NEXORA

Intelligent, modular and secure ERP for a single company.

## Requirements

- Node.js 26 (LTS), see `.nvmrc`
- pnpm 12
- Docker

## Getting started

```bash
cp .env.example .env
pnpm install
pnpm infra:up
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Web runs on http://localhost:5173 and the API on http://localhost:3000/api/v1.

## Layout

| Path                 | Role                                               |
| -------------------- | -------------------------------------------------- |
| `apps/api`           | NestJS HTTP API                                    |
| `apps/web`           | React, TanStack and Tailwind PWA                   |
| `packages/core`      | NestJS platform modules shared by the applications |
| `packages/contracts` | Zod schemas and shared API types                   |
| `prisma`             | Prisma schema and migrations                       |
| `docker`             | Dockerfiles, nginx and Caddy configuration         |

## Docker profiles

- default: postgres
- `app`: adds api, web and caddy

## Render

The `render.yaml` Blueprint runs Prisma migrations and the idempotent demo seed
before deploying the API. Demo records use `DEMO` identifiers and are not
overwritten on later deploys. Render pre-deploy commands require a paid web
service.
