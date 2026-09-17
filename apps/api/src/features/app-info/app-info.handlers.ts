import type { Request, Response } from 'express';
import { config } from '../../platform/config/index.js';
import { buildAppInfo } from './app-info.logic.js';

export const getAppInfo = (_request: Request, response: Response): void => {
  response.json(buildAppInfo(config.appName));
};
