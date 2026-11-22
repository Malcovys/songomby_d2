import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import {
  createHolidaySchema,
  createHolidaysSchema,
  listHolidaysQuerySchema,
} from '@nexora/contracts';
import type {
  CreateHoliday,
  CreateHolidays,
  CreateHolidaysResult,
  Holiday,
  ListHolidaysQuery,
} from '@nexora/contracts';
import { HolidaysService, ZodValidationPipe } from '@nexora/core';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidays: HolidaysService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listHolidaysQuerySchema)) query: ListHolidaysQuery,
  ): Promise<Holiday[]> {
    return this.holidays.list(query);
  }

  @Post()
  create(@Body(new ZodValidationPipe(createHolidaySchema)) body: CreateHoliday): Promise<Holiday> {
    return this.holidays.create(body);
  }

  @Post('bulk')
  createMany(
    @Body(new ZodValidationPipe(createHolidaysSchema)) body: CreateHolidays,
  ): Promise<CreateHolidaysResult> {
    return this.holidays.createMany(body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.holidays.remove(id);
  }
}