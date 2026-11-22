import { Module } from '@nestjs/common';
import { PrismaModule } from '../../platform/prisma/prisma.module.ts';
import { EmployeesService } from './employees.service.ts';

@Module({
  imports: [PrismaModule],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}