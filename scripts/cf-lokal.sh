#!/usr/bin/env bash
# The book as it runs on Cloudflare, on this computer: built app, the access Worker, and a local D1 with the demo code.
# Never touches production.
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${CF_PORT:-5577}"
pnpm build
CI=1 pnpm exec wrangler d1 migrations apply modul-video-iklan --local
node tools/jana-kod.ts demo
exec pnpm exec wrangler dev --local --ip 127.0.0.1 --port "$PORT"
