import { Module } from '@nestjs/common';
import { EmployeesModule } from '@nexora/core';
import { EmployeesController } from './employees.controller.ts';

@Module({
  imports: [EmployeesModule],
  controllers: [EmployeesController],
})
export class EmployeesHttpModule {}