import { Module } from '@nestjs/common';
import { ConfigModule, LoggingModule, PrismaModule, QueuesModule } from '@nexora/core';

@Module({
  imports: [ConfigModule, LoggingModule, PrismaModule, QueuesModule],
})
export class WorkerModule {}
