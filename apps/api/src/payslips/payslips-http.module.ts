import { Module } from '@nestjs/common';
import { PayslipsModule } from '@nexora/core';
import { PayslipsController } from './payslips.controller.ts';

@Module({
  imports: [PayslipsModule],
  controllers: [PayslipsController],
})
export class PayslipsHttpModule {}