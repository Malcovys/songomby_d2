import { randomUUID } from 'node:crypto';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ENV } from '../config/env.ts';
import type { Env } from '../config/env.ts';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ENV],
      useFactory: (env: Env) => ({
        pinoHttp: {
          level: env.LOG_LEVEL,
          genReqId: (request) => request.headers['x-request-id']?.toString() ?? randomUUID(),
          redact: ['req.headers.authorization', 'req.headers.cookie'],
          transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
        },
      }),
    }),
  ],
  exports: [LoggerModule],
})
export class LoggingModule {}
