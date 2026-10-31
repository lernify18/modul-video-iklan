import { defineConfig } from '@playwright/test'

// e2e: its own dev server on 5562, so a run never touches the 5560 server Ubai previews.
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  workers: 1,
  reporter: 'list',
  // Installed Chrome, not Playwright's Chromium: no browser download, and MP3 voice-over plays.
  use: { baseURL: 'http://127.0.0.1:5562', viewport: { width: 1440, height: 1000 }, channel: 'chrome' },
  webServer: {
    command: 'vite dev',
    url: 'http://127.0.0.1:5562/',
    env: { MODUL_PORT: '5562' },
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
