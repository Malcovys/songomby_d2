import { Module } from '@nestjs/common';
import { HolidaysModule } from '@nexora/core';
import { HolidaysController } from './holidays.controller.ts';

@Module({
  imports: [HolidaysModule],
  controllers: [HolidaysController],
})
export class HolidaysHttpModule {}