import { Module } from '@nestjs/common';
import { PrismaModule } from '../../platform/prisma/prisma.module.ts';
import { AbsencesService } from './absences.service.ts';

@Module({
  imports: [PrismaModule],
  providers: [AbsencesService],
  exports: [AbsencesService],
})
export class AbsencesModule {}