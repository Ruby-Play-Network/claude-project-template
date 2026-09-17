import express from 'express';
import { appInfoRouter } from './features/app-info/app-info.routes.js';
import { config } from './platform/config/index.js';
import { errorHandler } from './platform/middleware/error-handler.js';

const app = express();

app.use(express.json());
app.use('/api', appInfoRouter);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
