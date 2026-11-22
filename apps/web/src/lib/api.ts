import { API_PREFIX } from '@nexora/contracts';
import { z } from 'zod';

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

const errorBodySchema = z.object({ code: z.string(), message: z.string() });

async function request(method: string, path: string, body?: unknown): Promise<unknown> {
  const response = await fetch(`/${API_PREFIX}${path}`, {
    method,
    headers: {
      accept: 'application/json',
      ...(body !== undefined && { 'content-type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) return null;

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = errorBodySchema.safeParse(data);
    throw new ApiRequestError(
      response.status,
      error.success ? error.data.code : 'unknown_error',
      error.success ? error.data.message : response.statusText,
    );
  }

  return data;
}

export async function apiGet<T extends z.ZodType>(path: string, schema: T): Promise<z.output<T>> {
  return schema.parse(await request('GET', path));
}

export async function apiSend<T extends z.ZodType>(
  method: 'POST' | 'PATCH',
  path: string,
  body: unknown,
  schema: T,
): Promise<z.output<T>> {
  return schema.parse(await request(method, path, body));
}

export async function apiDelete(path: string): Promise<void> {
  await request('DELETE', path);
}