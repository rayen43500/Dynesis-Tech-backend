import { z } from 'zod';

export class ApiError extends Error {
  constructor({ statusCode = 500, code = 'INTERNAL_ERROR', message = 'Internal error', details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function toZodErrorDetails(zodError) {
  if (!(zodError instanceof z.ZodError)) return undefined;
  return zodError.errors.map((e) => ({
    path: e.path.join('.'),
    message: e.message
  }));
}

