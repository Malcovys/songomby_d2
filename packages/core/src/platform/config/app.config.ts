import { loadEnv } from './env.ts';

export interface AppConfig {
  app: {
    env: 'development' | 'test' | 'production';
    port: number;
    logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  };
}

export default (): AppConfig => {
  const env = loadEnv();
  return { app: { env: env.NODE_ENV, port: env.PORT, logLevel: env.LOG_LEVEL } };
};
