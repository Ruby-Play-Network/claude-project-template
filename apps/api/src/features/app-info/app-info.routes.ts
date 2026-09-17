import { Router } from 'express';
import { getAppInfo } from './app-info.handlers.js';

export const appInfoRouter = Router();

appInfoRouter.get('/app-info', getAppInfo);
