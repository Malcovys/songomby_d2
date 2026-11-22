import { Module } from '@nestjs/common';
import { AbsencesModule } from '@nexora/core';
import { AbsencesController } from './absences.controller.ts';

@Module({
  imports: [AbsencesModule],
  controllers: [AbsencesController],
})
export class AbsencesHttpModule {}