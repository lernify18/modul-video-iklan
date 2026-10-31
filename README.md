# 10 Video Iklan Dengan Claude — kod sumber

Ebook interaktif (React + Vite) dengan Worker Cloudflare untuk kod akses dan D1 untuk sesi. Isi modul ada dalam
`src/content/`, gambar dan suara dalam `public/`, skill Pro dalam `pro/ubai-videoads/`.

Repo ini private dan dikongsi khas untuk anda. Jangan kongsi semula tanpa izin Ubai.

## Keperluan

- Node 24 atau lebih baru (skrip `tools/*.ts` dijalankan terus dengan `node`)
- pnpm 10 atau lebih baru
- Google Chrome (untuk ujian Playwright)

## Jalankan di komputer sendiri

```sh
pnpm install
pnpm dev                # buku tanpa kod akses: http://127.0.0.1:5560
pnpm cf:lokal           # macam di Cloudflare (Worker + D1 lokal): http://127.0.0.1:5577/masuk
```

Kod demo untuk `pnpm cf:lokal`: `DEMO-LOKAL-2026` (Basic), `DEMO-PRO-2026` (Pro). Kod ini untuk lokal sahaja.

## Deploy ke Cloudflare anda sendiri

```sh
pnpm exec wrangler login
pnpm exec wrangler d1 create modul-video-iklan     # salin "database_id" ke wrangler.jsonc
pnpm exec wrangler d1 migrations apply modul-video-iklan --remote
pnpm build && pnpm exec wrangler deploy
node tools/jana-kod.ts kongsi pembeli --remote     # kod akses sebenar → .tmp/kod/*.csv
```

`--remote` menulis ke D1 production anda. Kod unik setiap pembeli: `node tools/jana-kod.ts unik <label> <n> --remote`.

## Ujian

```sh
pnpm typecheck
pnpm test               # unit
pnpm test:smoke         # pnpm dev, 5560
pnpm test:akses         # Worker + D1 lokal, 5578
pnpm test:e2e           # 5562
```

## Suara (pilihan)

Semua suara sudah ada dalam `public/vo/`. Untuk jana semula dengan suara sendiri, salin `.env.example` ke `.env`, isi
`ELEVENLABS_API_KEY` dan `ELEVENLABS_VOICE_ID` anda, kemudian ikut `workflows/suara-ubai.md`.

Alat tangkap skrin dalam `tools/` (`desk.ts`, `web.ts`, `mac/*.swift`) dan `pnpm herd:setup` dibina untuk Mac Ubai. Ia
tidak perlu untuk menjalankan atau deploy buku.
