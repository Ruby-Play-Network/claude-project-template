import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../config/index.js';
import * as schema from './schema.js';

// postgres.js connects lazily, so importing this module does not open a socket.
const queryClient = postgres(config.databaseUrl);

export const database = drizzle(queryClient, { schema });
