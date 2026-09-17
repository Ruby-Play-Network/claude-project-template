import { defineConfig } from 'drizzle-kit';
import { config } from './src/platform/config/index.js';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/platform/db/schema.ts',
  out: './src/platform/db/migrations',
  dbCredentials: { url: config.databaseUrl },
});
