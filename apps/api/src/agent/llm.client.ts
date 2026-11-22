import { BadGatewayException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { loadEnv } from '@nexora/core';

export interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

// Message brut du modèle. On le renvoie tel quel dans l'historique :
// Gemini 3 y glisse des signatures de réflexion qu'il réclame au tour suivant.
export type LlmMessage = Record<string, unknown>;

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

function failure(status: number, detail: string): BadGatewayException {
  if (status === 0) {
    return new BadGatewayException({
      code: 'llm_unreachable',
      message: 'Impossible de joindre Gemini (réseau ou délai dépassé). Vérifiez votre connexion.',
    });
  }
  if (status === 429) {
    return new BadGatewayException({
      code: 'llm_rate_limited',
      message: 'Limite gratuite de Gemini atteinte. Réessayez dans une minute.',
    });
  }
  if (status === 503) {
    return new BadGatewayException({
      code: 'llm_overloaded',
      message:
        'Gemini est surchargé en ce moment. Réessayez dans un instant ou changez LLM_MODEL dans le .env.',
    });
  }
  return new BadGatewayException({
    code: 'llm_error',
    message: `Le modèle a répondu ${status}. ${detail.slice(0, 300)}`,
  });
}

@Injectable()
export class LlmClient {
  async chat(messages: LlmMessage[], tools: ToolDefinition[]): Promise<LlmMessage> {
    const env = loadEnv();
    if (!env.LLM_API_KEY || !env.LLM_MODEL) {
      throw new ServiceUnavailableException({
        code: 'llm_not_configured',
        message: 'Renseignez LLM_API_KEY et LLM_MODEL dans le fichier .env, puis relancez l’API.',
      });
    }

    const url = `${env.LLM_BASE_URL.replace(/\/$/, '')}/chat/completions`;
    const body = JSON.stringify({
      model: env.LLM_MODEL,
      reasoning_effort: 'low',
      messages,
      tools: tools.map((tool) => ({ type: 'function', function: tool })),
      tool_choice: 'auto',
    });

    let status = 0;
    let detail = '';

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${env.LLM_API_KEY}`,
          },
          body,
          signal: AbortSignal.timeout(60_000),
        });

        if (response.ok) {
          const data = (await response.json()) as { choices?: { message?: LlmMessage }[] };
          const message = data.choices?.[0]?.message;
          if (!message) {
            throw new BadGatewayException({ code: 'llm_empty', message: 'Réponse vide du modèle.' });
          }
          return message;
        }

        status = response.status;
        detail = await response.text().catch(() => '');
        if (!RETRYABLE_STATUS.has(status)) break;
      } catch (error) {
        if (error instanceof BadGatewayException) throw error;
        status = 0; // réseau coupé ou délai dépassé
        detail = '';
      }

      if (attempt < MAX_ATTEMPTS) await sleep(2000 * attempt);
    }

    throw failure(status, detail);
  }
}