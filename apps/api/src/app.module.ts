import { Module } from '@nestjs/common';
import { ConfigModule, HealthModule, LoggingModule, PrismaModule } from '@nexora/core';
import { EmployeesHttpModule } from './employees/employees-http.module.ts';
import { HolidaysHttpModule } from './holidays/holidays-http.module.ts';
import { LeavesHttpModule } from './leaves/leaves-http.module.ts';

@Module({
  imports: [
    ConfigModule,
    LoggingModule,
    PrismaModule,
    HealthModule,
    EmployeesHttpModule,
    HolidaysHttpModule,
    LeavesHttpModule,
  ],
})
export class AppModule {}