# SOP: tangkap skrin klik demi klik

**Objektif.** Setiap langkah dalam buku ada screenshot sendiri, dengan kotak klik tepat pada butang sebenar. Tiada langkah
di-skip (peraturan Ubai, 29 Okt 2026).

## Tiga jenis skrin, tiga alat

| Skrin | Alat | Dari mana kotak klik |
|---|---|---|
| Laman web (claude.com, YouTube, savefrom.net, ElevenLabs) | `node tools/web.ts shot <id> ...` | kotak elemen dalam DOM |
| App Claude Desktop di Mac | `node tools/desk.ts shot <id> --find "<label>" ...` | OCR label butang (Apple Vision), dikembangkan ke warna latar butang |
| Skrin Windows | `node tools/win.ts <template> <id> --q "..."` | elemen `data-target` dalam templat HTML |

Setiap tangkapan menulis gambar ke `public/shots/<jenis>/<id>.png` dan entri ke `src/content/shots.json`. Kandungan buku
mengambil gambar, kotak dan kawasan zum dengan `fromShot('<jenis>/<id>')`. Jangan taip nombor kotak dengan tangan.

## Sebelum mula

1. Chrome tangkapan: `sh ~/.claude/tools/chrome-cdp.sh`. Ubai log masuk sendiri; Claude tidak menaip kata laluan.
2. Claude Desktop demo: `node tools/desk.ts start`. Ia buka salinan app pada profil `~/.claude/claude-desktop-demo`, jadi
   akaun dan chat Ubai tidak masuk gambar. Tetingkap kecil "Claude" akan muncul; jangan tutup sehingga tangkapan siap.
3. `tools/mac/trusted.swift` mesti cetak `trusted` (kebenaran Accessibility untuk klik).

## Satu langkah

```bash
node tools/desk.ts shot m3-get-started --find "Get started" --click --wait 2500
node tools/web.ts shot m3-harga --url https://claude.com/pricing --role link --name "Try Claude" --nth 2 --keep-tab
node tools/win.ts app m3-win-get-started --q "img=/shots/desk/m3-get-started.png&crop=8&t=13.33,85.33,73.33,6.67&patch=28,53,44,7|Claude for Windows|25"
```

- `--click` menekan butang selepas tangkap, supaya tangkapan seterusnya ialah skrin yang terbuka. Ini yang menjamin
  rantai klik-demi-klik.
- Butang tanpa teks (ikon): `--target x,y,w,h` (direkod sebagai `manual`).
- Rahsia dan maklumat peribadi: web `--dots "<selector>"` (nilai rahsia jadi titik) atau `--blur "<selector>"`; app
  `--mask x,y,w,h` (blur kawasan). Titik hanya nilai rahsia, jangan blur seluruh skrin (peraturan ebook Ubai).
- Skrin Windows ialah dummy. Pembaca memaparkan label "Paparan contoh Windows" secara automatik (`dummy: true`).

## Dalam kandungan

Bab klik-demi-klik ditanda `strict: true`. Setiap `ShotView` ada `screen` (skrin ini) dan `leadsTo` (skrin selepas klik).
`tests/unit/chain.test.ts` gagal jika skrin seterusnya bukan skrin yang dibuka oleh klik, atau jika senarai tanda
"buat sendiri" menggantikan skrin.

## Kes tepi yang sudah dijumpai

- **Claude Desktop menolak `--remote-debugging-port`** ("refusing to start — a debugging or network-override switch is
  present"). Itu kawalan keselamatan app; jangan cuba pintas. Sebab itu app ditangkap sebagai gambar + OCR.
- **Tetingkap demo boleh berada di Space lain atau tersembunyi.** `screencapture -l` masih membacanya; klik pula membawa
  app ke depan dahulu (`click.swift`).
- **Tetingkap tertutup tetapi app masih berjalan:** `node tools/desk.ts stop` kemudian `start`.
- **`tools/web.ts` tidak pernah menutup Chrome.** Ia hanya memutuskan sambungan. `browser.close()` pada sambungan CDP
  menutup Chrome Ubai.
- **Herd menyuntik `/herd-studio/loader.js`** ke setiap laman; 404 itu bunyi Herd, bukan ralat app.
- Skrin bayaran Claude: Ubai tekan butang bayar terakhir sendiri. Jika sistem menyekat tangkapan halaman bayaran, Ubai
  tangkap sendiri dan Claude titikkan nilainya.

## Modul 3 (29 Okt 2026): skrin contoh, Finder, dan rantai ikut komputer

- **Skrin contoh (tiada akaun baru, tiada bayaran, keputusan Ubai):** `node tools/contoh.ts <templat> <id> [--q ...]`.
  Templat dalam `tools/contoh/` dibina semula dari screenshot sebenar (log masuk Claude, pilih akaun Google, bayar Pro,
  Pro aktif, dialog Open macOS). E-mel contoh tunggal: `pelajar.demo@gmail.com`; nombor kad sentiasa titik.
  Buku melabelnya "Paparan contoh". `?view=720x500` untuk dialog kecil supaya tidak jadi titik dalam desktop penuh.
- **Tetingkap app lain (Finder, pemasang):** `node tools/desk.ts shot <id> --app Finder --title <tajuk> --target x,y,w,h`.
  Tiada klik pada app Ubai. Pentaskan folder dalam `.tmp/stage/` (klon `cp -c`, fail asal tak disentuh), sorok sidebar
  (`set sidebar width of w to 0`), tutup tetingkap dan `hdiutil detach` selepas tangkap. Jangan seret ke /Applications.
- **Skrin pertama app:** `DESK_PROFILE=~/.claude/claude-desktop-demo-s3 node tools/desk.ts start` (profil kosong baru
  menunjuk Get started semula; profil lama tak dipadam).
- **Dialog macOS "downloaded from the internet":** muncul sekali sahaja untuk satu salinan; macOS mengingati keputusannya.
  Baca teks dialog dengan System Events, kemudian bina semula (`mac-buka`) jika tak sempat ditangkap.
- **Bingkai `screen`** untuk tangkapan yang sudah ada tetingkap sendiri; nisbah gambar diambil dari `shots.json`.
- **Muka khas komputer:** `os: 'mac' | 'win'` pada muka. **Langkah papan kekunci/taip:** muka terang dengan
  `bridge: { from, to }`. `tests/unit/chain.test.ts` menyemak rantai Mac dan Windows berasingan.
- Paparan utama Ubai ialah monitor 1080p, jadi tangkapan app keluar 1x (600 px). Cukup untuk helaian; zum Tutorial agak lembut.

## Modul 4 (29 Okt 2026): YouTube dan savefrom

- **Chrome 156 menolak `chromium.connectOverCDP`** ("Browser context management is not supported"). Guna
  `tools/lib/cdp.ts` (satu tab sendiri melalui `/json/new`, ditutup dengan `/json/close/<id>`) dan
  `tools/lib/webshot.ts` (kotak sasaran dari DOM, `blur`/`dots` hanya pada gambar). `tools/web.ts` lama masih guna
  Playwright; tukar ke `cdp.ts` bila perlu satu tangkapan.
- **Ulang tangkapan Modul 4:** `node tools/tangkap-modul4.ts ["carian"]`. Senarai langganan dan avatar YouTube Ubai
  dikaburkan. Fail video dimuat turun ke `.tmp/stage/Downloads` (`Page.setDownloadBehavior`), bukan Downloads Ubai.
- **savefrom (diuji 29 Okt 2026):** setiap klik "Download" membuka tab iklan (pernah 1xBet, trip.com, 1nto.com). Butang
  biru "Download HD or MP3" dan "Upgrade for better quality" menjual app/langganan. Jalan percuma yang benar-benar
  memuat turun: **with low quality** → buka senarai **MP4 720** → **MP4 360**. Skrip menutup tab iklan yang dibuka
  oleh tabnya sendiri sahaja.
- **Finder salin/tampal:** klik kanan fail → **Copy**; folder Footage → klik kanan ruang kosong → **Paste Item**
  (tangkapan `--region` supaya menu masuk gambar). Mac Ubai bertukar ke mod gelap pada waktu petang; tangkapan kekal sebenar.

## Modul 6 (Ads Manager, 29 Okt 2026)

- Semua skrin Ads Manager **dibina semula** dari `tools/contoh/meta-ads.html` dengan akaun contoh «Pelajar Demo (MYR)».
  Buku tidak pernah bertindak dalam akaun iklan sebenar Ubai (tiada Create/Publish di Meta).
- Satu templat, banyak keadaan: `node tools/contoh.ts meta-ads <id> --q "state=<keadaan>&obj=Sales"`. Keadaan:
  `home`, `objektif`, `objektif-on`, `kempen`, `adset`, `ad`, `ad-menu`, `ad-media`, `ad-teks`, `review`. `ad-media` dan
  `ad-teks` ambil `file=`, `img=` (gambar `/media/...`), `ad-teks` juga `text=`, `head=`, `url=` (CW sebenar dari
  `Video Ubai OCT26 Kelas/out/2026-10-28_ikhlas-cw/CW-JUAL.md`).
- Langkah taip (bajet, muat naik fail, tampal caption) = muka `explain` dengan `bridge`, supaya rantai klik tidak putus.
- Objektif **Sales** (Pixel perlu); muka buka Ads Manager beri nota «tiada Pixel → Traffic». Bajet RM20/hari ialah
  **angka contoh**, belum disahkan Ubai.
