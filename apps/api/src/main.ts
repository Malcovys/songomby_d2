import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { API_PREFIX } from '@nexora/contracts';
import { ENV } from '@nexora/core';
import type { Env } from '@nexora/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.ts';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const env = app.get<Env>(ENV);

  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(API_PREFIX);
  app.enableShutdownHooks();

  await app.listen(env.PORT, '0.0.0.0');
}

void bootstrap();
