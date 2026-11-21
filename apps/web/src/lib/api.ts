import { API_PREFIX, apiErrorSchema } from '@nexora/contracts';
import type { z } from 'zod';

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export async function apiGet<T extends z.ZodType>(path: string, schema: T): Promise<z.output<T>> {
  const response = await fetch(`/${API_PREFIX}${path}`, {
    headers: { accept: 'application/json' },
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = apiErrorSchema.safeParse(body);
    throw new ApiRequestError(
      response.status,
      error.success ? error.data.code : 'unknown_error',
      error.success ? error.data.message : response.statusText,
    );
  }

  return schema.parse(body);
}
