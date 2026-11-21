import { Module } from '@nestjs/common';
import { ConfigModule, HealthModule, LoggingModule, PrismaModule } from '@nexora/core';

@Module({
  imports: [ConfigModule, LoggingModule, PrismaModule, HealthModule],
})
export class AppModule {}
