import type { ErrorRequestHandler } from 'express';
import { DomainError } from '../errors.js';

/** Maps domain errors to status codes; never leaks internals to the client. */
export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof DomainError) {
    response.status(error.status).json({ error: error.message });
    return;
  }

  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
};
