import { Module } from '@nestjs/common';
import { TicketsModule } from '@nexora/core';
import { TicketsController } from './tickets.controller.ts';

@Module({
  imports: [TicketsModule],
  controllers: [TicketsController],
})
export class TicketsHttpModule {}