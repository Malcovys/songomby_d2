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

| Path                 | Role                                                       |
| -------------------- | ---------------------------------------------------------- |
| `apps/api`           | NestJS HTTP API                                            |
| `apps/worker`        | NestJS BullMQ consumers                                    |
| `apps/web`           | React, TanStack and Tailwind PWA                           |
| `packages/core`      | NestJS platform modules shared by api and worker           |
| `packages/contracts` | Zod schemas, event types and queue names shared everywhere |
| `prisma`             | Prisma schema and migrations                               |
| `docker`             | Dockerfiles, nginx and Caddy configuration                 |

## Docker profiles

- default: postgres, redis, seaweedfs
- `app`: adds api, worker, web and caddy
