import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173' },
  // Two entries rather than one shell command: `&` is not portable across
  // the shells Playwright spawns on Windows and Linux.
  webServer: [
    {
      command: 'pnpm --filter api dev',
      url: 'http://localhost:3000/healthz',
      reuseExistingServer: !process.env['CI'],
    },
    {
      command: 'pnpm --filter web dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env['CI'],
    },
  ],
});
