import { Module } from '@nestjs/common';
import { PrismaModule } from '../../platform/prisma/prisma.module.ts';
import { TicketsService } from './tickets.service.ts';

@Module({
  imports: [PrismaModule],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}