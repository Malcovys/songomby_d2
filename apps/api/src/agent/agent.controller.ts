import { Body, Controller, HttpCode, Param, Post, Res } from '@nestjs/common';
import { chatRequestSchema } from '@nexora/contracts';
import type { ChatRequest, ChatResponse, ProposalAction } from '@nexora/contracts';
import { ZodValidationPipe } from '@nexora/core';
import { AgentService } from './agent.service.ts';

// Juste ce qu'on utilise de la réponse Express
interface StreamResponse {
  status(code: number): unknown;
  setHeader(name: string, value: string): unknown;
  flushHeaders(): void;
  write(chunk: string): boolean;
  end(): void;
  on(event: 'close', listener: () => void): unknown;
  writableEnded: boolean;
}

@Controller('agent')
export class AgentController {
  constructor(private readonly agent: AgentService) {}

  @Post('chat')
  @HttpCode(200)
  chat(@Body(new ZodValidationPipe(chatRequestSchema)) body: ChatRequest): Promise<ChatResponse> {
    return this.agent.chat(body);
  }

  @Post('chat/stream')
  async chatStream(
    @Body(new ZodValidationPipe(chatRequestSchema)) body: ChatRequest,
    @Res() res: StreamResponse,
  ): Promise<void> {
    const abort = new AbortController();
    res.on('close', () => abort.abort()); // l'utilisateur ferme la page : on arrête le modèle

    res.status(200);
    res.setHeader('content-type', 'text/event-stream; charset=utf-8');
    res.setHeader('cache-control', 'no-cache, no-transform');
    res.setHeader('connection', 'keep-alive');
    res.setHeader('x-accel-buffering', 'no');
    res.flushHeaders();

    await this.agent.chatStream(
      body,
      (event) => {
        if (!res.writableEnded) res.write(`data: ${JSON.stringify(event)}\n\n`);
      },
      abort.signal,
    );
    res.end();
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