import { Module } from '@nestjs/common';
import { LeavesModule } from '@nexora/core';
import { LeavesController } from './leaves.controller.ts';

@Module({
  imports: [LeavesModule],
  controllers: [LeavesController],
})
export class LeavesHttpModule {}