import { existsSync } from 'node:fs';
import path from 'node:path';
import express from 'express';
import { appInfoRouter } from './features/app-info/app-info.routes.js';
import { healthRouter } from './features/health/health.routes.js';
import { config } from './platform/config/index.js';
import { errorHandler } from './platform/middleware/error-handler.js';

const app = express();

app.use(express.json());
app.use(healthRouter);
app.use('/api', appInfoRouter);

// In a deployed release the built front end ships alongside the API and is
// served from the same origin, so the browser's /api calls need no CORS.
const webDistFolder = path.resolve(import.meta.dirname, '../../web/dist');

if (existsSync(webDistFolder)) {
  app.use(express.static(webDistFolder));

  // Vue Router uses history mode, so any non-API path must fall back to the
  // SPA shell rather than 404.
  app.use((request, response, next) => {
    if (request.method !== 'GET') {
      next();
      return;
    }
    response.sendFile(path.join(webDistFolder, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
