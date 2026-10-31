# SOP: suara Ubai untuk setiap muka

**Objektif.** Setiap muka boleh dibacakan dengan suara Ubai, dan dalam Mod Tutorial kursor bergerak tepat ketika suara
menyebut butang.

## Input

- `src/content/vo-script.json`: `{ "<id>": { "text": "..." } }`. Tulis `{klik}` tepat sebelum perkataan yang patut
  menggerakkan kursor (atau memunculkan label pada muka kenal komponen; satu `{klik}` setiap komponen).
- `.env`: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID=0Ofo4kJrKlEEX2Mj8IUB`, `ELEVENLABS_MODEL=eleven_v4`
  (disalin dari SAAS FORM JUN26). Tetapan suara: stability 0.5, similarity 0.75, speed 1.0.

## Jalankan

```bash
node tools/vo.ts                 # buat klip yang baru atau yang teksnya berubah
node tools/vo.ts n3 --semak      # satu klip, kemudian transkrip whisper untuk semak sebutan
node tools/vo.ts --force n3      # buat semula walaupun teks sama
```

Hasil: `public/vo/<id>.mp3` dan `src/content/vo.json` (`dur`, `cues`, `hash`). Ujian kandungan gagal jika muka merujuk
id suara yang tiada, atau muka skrin tiada cue untuk menggerakkan kursor.

## Kes tepi

- **Kredit ElevenLabs:** jangan tanya Ubai sebelum menjana (peraturan global 2026-10-20). Berhenti hanya bila API kata kuota habis.
- **Sebutan "Claude":** whisper BM menulisnya "Cloud" untuk semua ejaan. Ejaan "Claude" sahaja yang whisper Inggeris dengar
  sebagai "Claude"; "Klod", "Klawd", "Klôd" lebih teruk (diuji 29 Okt 2026). Kekalkan "Claude"; Ubai sahkan dengan telinga.
- **Alamat laman:** tulis seperti disebut ("claude dot com slash pricing"), bukan "claude.com/pricing".
- **Nama jenama dan tempat:** selepas setiap klip baru, semak transkrip `--semak` (v4 pernah sebut "AirAsia" sebagai "Aasia").

## Infografik ikut suara (29 Okt 2026)

- Muka yang ada infografik (peta jalan, aliran, pokok, jubin, carta bar, kitaran): tulis satu `{klik}` tepat sebelum
  Ubai menyebut setiap langkah, ikut susunan langkah di skrin. Cue ke-n (dari 0) menyalakan langkah yang ada `at: n`.
- Setiap langkah dalam kandungan diberi `at` (0, 1, 2, …); pokok dan kitaran juga ada `at` untuk soalan/tengahnya.
  Ujian `tests/unit/content.test.ts` gagal jika ada cue tanpa langkah, atau langkah menunggu cue yang tiada.
- Langkah tanpa `at` (contohnya aliran bank prompt) menyala bergilir sepanjang suara; tiada suara = semua nampak.
- Selepas tukar skrip: `node tools/vo.ts <id> --semak`, kemudian `pnpm exec playwright test tests/e2e/infografik.spec.ts`.
