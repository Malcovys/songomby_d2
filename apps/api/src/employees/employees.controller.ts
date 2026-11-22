import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import {
  createEmployeeSchema,
  listEmployeesQuerySchema,
  updateEmployeeSchema,
} from '@nexora/contracts';
import type {
  CreateEmployee,
  Employee,
  ListEmployeesQuery,
  PaginatedEmployees,
  UpdateEmployee,
} from '@nexora/contracts';
import { EmployeesService, ZodValidationPipe } from '@nexora/core';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employees: EmployeesService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listEmployeesQuerySchema)) query: ListEmployeesQuery,
  ): Promise<PaginatedEmployees> {
    return this.employees.list(query);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Employee> {
    return this.employees.get(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createEmployeeSchema)) body: CreateEmployee,
  ): Promise<Employee> {
    return this.employees.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateEmployeeSchema)) body: UpdateEmployee,
  ): Promise<Employee> {
    return this.employees.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.employees.remove(id);
  }
}