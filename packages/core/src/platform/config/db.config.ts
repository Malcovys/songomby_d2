import { loadEnv } from './env.ts';

export interface DbConfig {
  db: {
    url: string;
  };
}

export default (): DbConfig => {
  const env = loadEnv();
  return { db: { url: env.DATABASE_URL } };
};
