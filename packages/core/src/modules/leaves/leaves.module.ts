import { Module } from '@nestjs/common';
import { PrismaModule } from '../../platform/prisma/prisma.module.ts';
import { LeavesService } from './leaves.service.ts';

@Module({
  imports: [PrismaModule],
  providers: [LeavesService],
  exports: [LeavesService],
})
export class LeavesModule {}