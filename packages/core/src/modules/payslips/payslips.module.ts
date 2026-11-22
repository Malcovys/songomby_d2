import { Module } from '@nestjs/common';
import { PrismaModule } from '../../platform/prisma/prisma.module.ts';
import { PayslipsService } from './payslips.service.ts';

@Module({
  imports: [PrismaModule],
  providers: [PayslipsService],
  exports: [PayslipsService],
})
export class PayslipsModule {}