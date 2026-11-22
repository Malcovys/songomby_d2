import { Module } from '@nestjs/common';
import { PrismaModule } from '../../platform/prisma/prisma.module.ts';
import { HolidaysService } from './holidays.service.ts';

@Module({
  imports: [PrismaModule],
  providers: [HolidaysService],
  exports: [HolidaysService],
})
export class HolidaysModule {}