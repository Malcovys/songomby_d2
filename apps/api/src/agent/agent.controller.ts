import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { chatRequestSchema } from '@nexora/contracts';
import type { ChatRequest, ChatResponse, ProposalAction } from '@nexora/contracts';
import { ZodValidationPipe } from '@nexora/core';
import { AgentService } from './agent.service.ts';

@Controller('agent')
export class AgentController {
  constructor(private readonly agent: AgentService) {}

  @Post('chat')
  @HttpCode(200)
  chat(@Body(new ZodValidationPipe(chatRequestSchema)) body: ChatRequest): Promise<ChatResponse> {
    return this.agent.chat(body);
  }

  @Post('proposals/:id/apply')
  @HttpCode(200)
  apply(@Param('id') id: string): Promise<ProposalAction> {
    return this.agent.apply(id);
  }

  @Post('proposals/:id/cancel')
  @HttpCode(200)
  cancel(@Param('id') id: string): Promise<ProposalAction> {
    return this.agent.cancel(id);
  }
}