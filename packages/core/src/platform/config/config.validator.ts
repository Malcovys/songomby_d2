import { loadEnv } from './env.ts';

export function validate(env: Record<string, unknown>): Record<string, unknown> {
  loadEnv(env as NodeJS.ProcessEnv);
  return env;
}
