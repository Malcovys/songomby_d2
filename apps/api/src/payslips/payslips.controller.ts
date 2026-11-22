import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { listPayslipsQuerySchema, payslipInputSchema } from '@nexora/contracts';
import type {
  ListPayslipsQuery,
  PaginatedPayslips,
  Payslip,
  PayslipInput,
  PayslipPreview,
} from '@nexora/contracts';
import { PayslipsService, ZodValidationPipe } from '@nexora/core';

@Controller('payslips')
export class PayslipsController {
  constructor(private readonly payslips: PayslipsService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listPayslipsQuerySchema)) query: ListPayslipsQuery,
  ): Promise<PaginatedPayslips> {
    return this.payslips.list(query);
  }

  // Doit rester avant ':id' pour ne pas être pris pour un id
  @Post('preview')
  @HttpCode(200)
  preview(
    @Body(new ZodValidationPipe(payslipInputSchema)) body: PayslipInput,
  ): Promise<PayslipPreview> {
    return this.payslips.preview(body);
  }

  @Post()
  generate(@Body(new ZodValidationPipe(payslipInputSchema)) body: PayslipInput): Promise<Payslip> {
    return this.payslips.generate(body);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Payslip> {
    return this.payslips.get(id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.payslips.remove(id);
  }
}