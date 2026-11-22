import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  createLeaveSchema,
  listLeavesQuerySchema,
  updateLeaveStatusSchema,
} from '@nexora/contracts';
import type {
  CreateLeave,
  Leave,
  ListLeavesQuery,
  PaginatedLeaves,
  UpdateLeaveStatus,
} from '@nexora/contracts';
import { LeavesService, ZodValidationPipe } from '@nexora/core';

@Controller('leaves')
export class LeavesController {
  constructor(private readonly leaves: LeavesService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listLeavesQuerySchema)) query: ListLeavesQuery,
  ): Promise<PaginatedLeaves> {
    return this.leaves.list(query);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Leave> {
    return this.leaves.get(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(createLeaveSchema)) body: CreateLeave): Promise<Leave> {
    return this.leaves.create(body);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLeaveStatusSchema)) body: UpdateLeaveStatus,
  ): Promise<Leave> {
    return this.leaves.updateStatus(id, body);
  }
}