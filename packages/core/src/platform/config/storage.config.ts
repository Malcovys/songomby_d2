import { loadEnv } from './env.ts';

export interface StorageConfig {
  storage: {
    endpoint?: string;
    accessKey?: string;
    secretKey?: string;
  };
}

export default (): StorageConfig => {
  const env = loadEnv();
  return {
    storage: {
      endpoint: env.S3_ENDPOINT,
      accessKey: env.S3_ACCESS_KEY,
      secretKey: env.S3_SECRET_KEY,
    },
  };
};
