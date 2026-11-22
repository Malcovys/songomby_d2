import { API_PREFIX, chatStreamEventSchema } from '@nexora/contracts';
import type { ChatRequest, ChatStreamEvent } from '@nexora/contracts';
import { ApiRequestError } from '@/lib/api';

export async function streamChat(
  input: ChatRequest,
  onEvent: (event: ChatStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`/${API_PREFIX}/agent/chat/stream`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok || !response.body) {
    const data = (await response.json().catch(() => null)) as {
      code?: string;
      message?: string;
    } | null;
    throw new ApiRequestError(
      response.status,
      data?.code ?? 'unknown_error',
      data?.message ?? response.statusText,
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Les événements sont séparés par une ligne vide
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() ?? '';
    for (const block of blocks) {
      const line = block.split('\n').find((l) => l.startsWith('data:'));
      if (!line) continue;
      try {
        const event = chatStreamEventSchema.safeParse(JSON.parse(line.slice(5)));
        if (event.success) onEvent(event.data);
      } catch {
        // événement illisible : on l'ignore
      }
    }
  }
}