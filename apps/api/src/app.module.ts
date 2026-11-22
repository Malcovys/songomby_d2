import { Module } from '@nestjs/common';
import { ConfigModule, HealthModule, LoggingModule, PrismaModule } from '@nexora/core';
import { EmployeesHttpModule } from './employees/employees-http.module.ts';

@Module({
  imports: [ConfigModule, LoggingModule, PrismaModule, HealthModule, EmployeesHttpModule],
})
export class AppModule {}