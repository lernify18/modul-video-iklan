import { defineConfig } from '@playwright/test'

// Smoke: the dev server Ubai previews (pnpm dev on 5560), reached through Herd when SMOKE_URL says so.
export default defineConfig({
  testDir: './tests/smoke',
  timeout: 45_000,
  workers: 1,
  reporter: 'list',
  use: { baseURL: process.env.SMOKE_URL || 'http://127.0.0.1:5560', ignoreHTTPSErrors: true, channel: 'chrome' },
  webServer: { command: 'vite dev', url: 'http://127.0.0.1:5560/', reuseExistingServer: true, timeout: 60_000 },
})
