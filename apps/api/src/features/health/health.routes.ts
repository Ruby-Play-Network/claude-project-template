import { Router } from 'express';
import { getHealth } from './health.handlers.js';

export const healthRouter = Router();

healthRouter.get('/healthz', getHealth);
