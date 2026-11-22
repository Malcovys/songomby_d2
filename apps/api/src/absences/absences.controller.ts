import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import {
  createAbsenceSchema,
  listAbsencesQuerySchema,
  updateAbsenceSchema,
} from '@nexora/contracts';
import type {
  Absence,
  CreateAbsence,
  ListAbsencesQuery,
  PaginatedAbsences,
  UpdateAbsence,
} from '@nexora/contracts';
import { AbsencesService, ZodValidationPipe } from '@nexora/core';

@Controller('absences')
export class AbsencesController {
  constructor(private readonly absences: AbsencesService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listAbsencesQuerySchema)) query: ListAbsencesQuery,
  ): Promise<PaginatedAbsences> {
    return this.absences.list(query);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Absence> {
    return this.absences.get(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(createAbsenceSchema)) body: CreateAbsence): Promise<Absence> {
    return this.absences.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAbsenceSchema)) body: UpdateAbsence,
  ): Promise<Absence> {
    return this.absences.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.absences.remove(id);
  }
}