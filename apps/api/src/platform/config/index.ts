import { existsSync } from 'node:fs';
import * as zod from 'zod';

// Deployed environments inject real values; locally we fall back to the .env file.
// Anything already present in the environment (CI, dotenv-cli) wins.
if (process.env['DATABASE_URL'] === undefined && existsSync('.env')) {
  process.loadEnvFile('.env');
}

const environmentSchema = zod.object({
  PORT: zod.coerce.number().int().positive().default(3000),
  APP_NAME: zod.string().min(1),
  DATABASE_URL: zod.string().min(1),
});

const parsed = environmentSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration:\n${zod.prettifyError(parsed.error)}`);
}

export const config = {
  port: parsed.data.PORT,
  appName: parsed.data.APP_NAME,
  databaseUrl: parsed.data.DATABASE_URL,
} as const;
