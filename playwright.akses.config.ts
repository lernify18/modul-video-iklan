import { defineConfig } from '@playwright/test'

// The book behind its access Worker, as on Cloudflare: built app + wrangler dev + local D1 (scripts/cf-lokal.sh).
export default defineConfig({
  testDir: './tests/akses',
  timeout: 60_000,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5578', viewport: { width: 1440, height: 900 }, channel: 'chrome' },
  webServer: {
    command: 'bash scripts/cf-lokal.sh',
    url: 'http://127.0.0.1:5578/masuk',
    env: { CF_PORT: '5578' },
    reuseExistingServer: false,
    timeout: 240_000,
  },
})
