import { defineConfig } from 'prisma/config';

try {
  process.loadEnvFile();
} catch {
  process.env.DATABASE_URL ??= 'postgresql://nexora:nexora@localhost:5432/nexora';
}

export default defineConfig({
  schema: 'prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL ?? '' },
});
