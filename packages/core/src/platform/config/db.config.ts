import { loadEnv } from './env.ts';

export interface DbConfig {
  db: {
    url: string;
    redisUrl: string;
  };
}

export default (): DbConfig => {
  const env = loadEnv();
  return { db: { url: env.DATABASE_URL, redisUrl: env.REDIS_URL } };
};
