# tools/

Skrip deterministik (lapisan Tools dalam WAT), ditulis dalam TypeScript dan dijalankan terus dengan Node
(`node tools/<nama>.ts`). Kunci dan rahsia dibaca dari `.env` sahaja. Cara guna penuh: `workflows/tangkap-skrin.md` dan
`workflows/suara-ubai.md`.

| Alat | Kerja |
|---|---|
| `desk.ts` | Claude Desktop demo (profil berasingan): tangkap tetingkap, cari butang dengan OCR, klik |
| `web.ts` | Laman web dalam Chrome 9337: tangkap, kotak dari DOM, titik/blur rahsia |
| `win.ts` + `win/*.html` | Skrin Windows 11 dibina semula (dummy), kotak dari `data-target` |
| `tangkap-skill.ts` | Skrin pasang skill (Mac + Windows): prompt → Allow once → siap → ＋ New → sesi baru. `basic` atau `pro` |
| `tangkap-muzik.ts` | Pixabay Music (ikon muat turun) dan ytmp3.gl (kotak pautan), dalam tab sendiri di Chrome 9337 |
| `vo.ts` | Suara Ubai dari `src/content/vo-script.json`, cue dari tanda `{klik}` |
| `mac/*.swift` | Senarai tetingkap, OCR + cari butang, klik, blur kawasan (dikompil sekali ke `.tmp/bin`) |
| `lib/` | Manifest `src/content/shots.json`, geometri kotak, pengkompil Swift |

## Kod akses (S8)

- Pakej: tambah `--pakej pro` untuk kod Pro (lalai `basic`). Kod Pro sahaja boleh ambil fail `/pro/*` (skill
  ubai-videoads); setiap muat turun dilog dalam jadual `muat_turun` (kod + nama + masa). Kod demo lokal Pro:
  `DEMO-PRO-2026`. Pratonton dev tanpa Worker: `localStorage.setItem('modul:pakej', 'pro')`.
- `node tools/jana-kod.ts kongsi <label>` — satu kod bernama untuk semua pembeli satu pakej (letak di halaman pembelian
  Sellhiz). `unik <label> <n> [--had 3]` — satu kod setiap pembeli, sah pada `--had` peranti (peranti paling lama
  dilog keluar). `demo` — kod pratonton lokal sahaja.
- Nilai kod tidak dicetak: ia masuk `.tmp/kod/<masa>-<jenis>-<label>.csv` (git abaikan). D1 hanya simpan SHA-256 kod.
- D1 lokal secara lalai. `--remote` menulis ke production dan perlu kelulusan Ubai dahulu.
- Matikan satu saluran: `UPDATE kod_akses SET aktif = 0 WHERE label = '<label>'` (sesi kod itu tamat serta-merta).
- Jalan macam Cloudflare di komputer ini: `pnpm cf:lokal` (build + Worker + D1 lokal + kod demo, port `CF_PORT`, lalai 5577).
