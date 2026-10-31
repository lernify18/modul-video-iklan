import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Pinned: a contested port must fail loudly, not drift and 502 Herd. */
const DEV_PORT = Number(process.env.MODUL_PORT || 5560)
const PREVIEW_PORT = 5561
const HERD_HOST = 'modulvideo.test'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // must equal the Herd proxy target exactly, or nginx 502s
    port: DEV_PORT,
    strictPort: true,
    // Vite answers 403 to every request that arrives through the Herd proxy until the host is listed.
    allowedHosts: [HERD_HOST],
    // Other branches live in worktrees/ inside the project; anchored, so a checkout inside worktrees/ still watches itself.
    watch: { ignored: [fileURLToPath(new URL('./worktrees/', import.meta.url)) + '**', fileURLToPath(new URL('./.tmp/', import.meta.url)) + '**'] },
  },
  preview: { host: '127.0.0.1', port: PREVIEW_PORT, strictPort: true, allowedHosts: [HERD_HOST] },
})
