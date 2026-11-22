import { Module } from '@nestjs/common';
import { ConfigModule, HealthModule, LoggingModule, PrismaModule } from '@nexora/core';
import { AbsencesHttpModule } from './absences/absences-http.module.ts';
import { EmployeesHttpModule } from './employees/employees-http.module.ts';
import { HolidaysHttpModule } from './holidays/holidays-http.module.ts';
import { LeavesHttpModule } from './leaves/leaves-http.module.ts';
import { PayslipsHttpModule } from './payslips/payslips-http.module.ts';
import { TicketsHttpModule } from './tickets/tickets-http.module.ts';
import { AgentHttpModule } from './agent/agent-http.module.ts';

@Module({
  imports: [
    ConfigModule,
    LoggingModule,
    PrismaModule,
    HealthModule,
    EmployeesHttpModule,
    HolidaysHttpModule,
    LeavesHttpModule,
    AbsencesHttpModule,
    TicketsHttpModule,
    PayslipsHttpModule,
    AgentHttpModule,
  ],
})
export class AppModule {}