import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { createTicketSchema, listTicketsQuerySchema, updateTicketSchema } from '@nexora/contracts';
import type {
  CreateTicket,
  ListTicketsQuery,
  PaginatedTickets,
  Ticket,
  UpdateTicket,
} from '@nexora/contracts';
import { TicketsService, ZodValidationPipe } from '@nexora/core';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listTicketsQuerySchema)) query: ListTicketsQuery,
  ): Promise<PaginatedTickets> {
    return this.tickets.list(query);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Ticket> {
    return this.tickets.get(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(createTicketSchema)) body: CreateTicket): Promise<Ticket> {
    return this.tickets.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTicketSchema)) body: UpdateTicket,
  ): Promise<Ticket> {
    return this.tickets.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.tickets.remove(id);
  }
}