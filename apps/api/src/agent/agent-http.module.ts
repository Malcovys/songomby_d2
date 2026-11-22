import { Module } from '@nestjs/common';
import {
  EmployeesModule,
  HolidaysModule,
  LeavesModule,
  PayslipsModule,
  PrismaModule,
  TicketsModule,
} from '@nexora/core';
import { AgentController } from './agent.controller.ts';
import { AgentService } from './agent.service.ts';
import { AgentTools } from './agent.tools.ts';
import { LlmClient } from './llm.client.ts';

@Module({
  imports: [
    PrismaModule,
    EmployeesModule,
    HolidaysModule,
    LeavesModule,
    PayslipsModule,
    TicketsModule,
  ],
  controllers: [AgentController],
  providers: [AgentService, AgentTools, LlmClient],
})
export class AgentHttpModule {}