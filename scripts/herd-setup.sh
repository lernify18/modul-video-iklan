#!/usr/bin/env bash
# One-time per machine: serve the dev server at https://modulvideo.test through Laravel Herd.
# Herd only proxies the port; `pnpm dev` (vite on 127.0.0.1:5560, strictPort) still runs separately.
# The target must be 127.0.0.1, not localhost, or nginx can resolve ::1 and 502.
set -euo pipefail
cd "$(dirname "$0")/.."

HERD="$HOME/Library/Application Support/Herd/bin/herd"
DOMAIN="modulvideo.test"
TARGET="http://127.0.0.1:5560"

[ -x "$HERD" ] || { echo "Herd CLI tiada di: $HERD"; exit 1; }
"$HERD" proxy "$DOMAIN" "$TARGET" --secure

code=$(curl -s -o /dev/null -w '%{http_code}' "https://${DOMAIN}/" || true)
case "$code" in
  200) echo "OK  https://${DOMAIN}/ -> 200" ;;
  502 | 000) echo "Herd sedia; dev server belum jalan. Jalankan: pnpm dev" ;;
  403) echo "403: tambah '${DOMAIN}' dalam server.allowedHosts (vite.config.ts)"; exit 1 ;;
  *) echo "dapat ${code} dari https://${DOMAIN}/" ;;
esac
