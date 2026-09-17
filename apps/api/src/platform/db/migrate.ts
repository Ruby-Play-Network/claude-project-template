import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { config } from '../config/index.js';

// A dedicated single-connection client: migrations must not run concurrently.
const migrationClient = postgres(config.databaseUrl, { max: 1 });

await migrate(drizzle(migrationClient), {
  migrationsFolder: 'src/platform/db/migrations',
});

await migrationClient.end();
console.log('Migrations applied.');
