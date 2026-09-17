import type { Request, Response } from 'express';

/** Lyra polls this after every restart; a non-5xx answer means the release is good. */
export const getHealth = (_request: Request, response: Response): void => {
  response.json({ status: 'ok' });
};
