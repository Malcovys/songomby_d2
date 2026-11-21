import { loadEnv } from './env.ts';

const RECOMMENDED_ENV_VARS = ['S3_ENDPOINT', 'S3_ACCESS_KEY', 'S3_SECRET_KEY'] as const;

export function validate(env: Record<string, unknown>): Record<string, unknown> {
  loadEnv(env as NodeJS.ProcessEnv);

  for (const key of RECOMMENDED_ENV_VARS) {
    if (!env[key]) {
      console.warn(
        `Environment variable ${key} is not set — the feature it configures will be degraded.`,
      );
    }
  }

  return env;
}
