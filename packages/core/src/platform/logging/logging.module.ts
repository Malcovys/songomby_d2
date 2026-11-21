import { randomUUID } from 'node:crypto';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigService } from '../config/config.service.ts';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: ({ app }: ConfigService) => ({
        pinoHttp: {
          level: app.logLevel,
          genReqId: (request) => request.headers['x-request-id']?.toString() ?? randomUUID(),
          redact: ['req.headers.authorization', 'req.headers.cookie'],
          transport: app.env === 'development' ? { target: 'pino-pretty' } : undefined,
        },
      }),
    }),
  ],
  exports: [LoggerModule],
})
export class LoggingModule {}
