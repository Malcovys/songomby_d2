import { ApiRequestError } from './api';

export const errorMessage = (error: unknown): string =>
  error instanceof ApiRequestError
    ? error.message
    : 'Impossible de joindre le serveur. Vérifiez que l’API est lancée.';