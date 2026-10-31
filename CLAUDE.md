# Modul Video Iklan OCT26 — "10 Video Iklan Dengan Claude"

Projek baru (dimulakan 2026-10-29, chat 120I). Peraturan global dalam `~/.claude/CLAUDE.md` terpakai; seksyen di bawah ialah
peraturan projek ini sahaja. Projek ini **tidak** mewarisi aturan projek lain (Video Ubai OCT26 Kelas, ebook, Sellhiz).

## Apa projek ini

Modul casestudy berbayar dalam bentuk **ebook interaktif** untuk orang yang tak pernah vibecode (sasaran: umur 60).
Pelajar belajar buat 10 video iklan dengan Claude, klik demi klik, atas screenshot sebenar.

## Keputusan Ubai (2026-10-29)

- **Satu muka sahaja**: penuh di telefon, responsif di desktop. Tiada susunan dua muka.
- Penerangan penuh macam ebook, tema kids pastel (palet dan font ebook "Jana 6 Angka Dengan AI"), footnote, label,
  langkah bernombor, Key Note di kaki setiap muka, nombor muka.
- **Mod Tutorial** (suara Ubai, kursor bergerak ikut timestamp perkataan) dan **Mod Latihan** (pelajar klik sendiri,
  petunjuk bertingkat, tiada merah, butang Tunjuk saya).
- **Screenshot klik demi klik, tiada langkah di-skip** — termasuk log masuk dan bayar (e-mel di-blur, rahsia dititik,
  butang bayar terakhir ditekan oleh Ubai sendiri).
- Mac = screenshot sebenar. **Windows = screenshot dummy** (paparan Windows 11 dibina semula, dilabel "paparan contoh").
  Halaman web dalam langkah Windows guna screenshot sebenar dalam bingkai Windows.
- Sumber bahan = **YouTube + savefrom.net** (`https://en1.savefrom.net/21-youtube-to-mp4-40LR.html`), ikut cara Ubai.
- POV dan VO diajar **sekaligus**. Footage run sebenar Modul 5 = umrah ikhlas.
- ElevenLabs: akaun demo jika API boleh dipakai; jika tidak, akaun Ubai (kunci dititik dalam screenshot).
- Suara narasi: suara Ubai PVC `0Ofo4kJrKlEEX2Mj8IUB`, model `eleven_v4`, stability 0.5, similarity 0.75, speed 1.0.
  Kunci dalam `.env` sahaja. Ejaan "Claude" dikekalkan dalam teks TTS (ejaan fonetik lebih teruk, diuji 2026-10-29).
- Bahan ebook lama diguna semula, tidak ditangkap semula: `~/Ebook AI Sept 26/bahan-video/modul-saas/mentah/` (319
  tangkapan bersih 2880x1800 + `marks.json`) dan `tools/klik.mjs` pada branch `ebook-modul-saas`.

## Cara kerja

- Satu worktree setiap slice di `worktrees/<branch>`. Pelan slice S0–S8 dan status dalam memori projek.
- Dev: `pnpm dev` (127.0.0.1:5560, strictPort) → `https://modulvideo.test` melalui Herd (`pnpm herd:setup` sekali).
- Ujian: `pnpm typecheck`, `pnpm test`, `pnpm test:smoke`, `pnpm test:e2e` (e2e pada port 5562 sendiri).
- Kotak klik tidak diletak dengan mata: diambil dari butang sebenar (DOM, macOS Accessibility, atau replika Windows).

## Keputusan Ubai (2026-10-29, pusingan 4): Claude Desktop sahaja

- Pelajar guna **Claude Code di dalam app Claude Desktop** (tab Code). VS Code tidak diajar. Bahan VS Code ebook modul-saas
  tidak dipakai; skrin app ditangkap baru.
- App ditangkap dari salinan demo pada profil `~/.claude/claude-desktop-demo` (`node tools/desk.ts start`), supaya akaun
  dan chat Ubai tidak masuk gambar. Claude Desktop menolak suis penyahpepijat, jadi kotak klik datang dari OCR label
  butang (Apple Vision), bukan Accessibility tree.
- Kandungan mengambil gambar dan kotak dengan `fromShot('<jenis>/<id>')` dari `src/content/shots.json`. Bab klik-demi-klik
  ditanda `strict: true` dan diuji oleh `tests/unit/chain.test.ts`.
- SOP: `workflows/tangkap-skrin.md`, `workflows/suara-ubai.md`.

## Keputusan Ubai (2026-10-30): skill pelajar, pakej Basic & Pro

- Modul dibina dari kosong: **tiada prompt memanggil skill Ubai sendiri**. Pelajar Basic memasang skill ringkas
  `iklan-video` (satu sumber: `src/content/skill.ts`, muka `m5-skill`); semua prompt modul dan bank bermula «Guna skill …».
  `tests/unit/skill.test.ts` menolak nama skill Ubai dan nama skill lain dalam prompt.
- **Pro** = skill `ubai-videoads` (jenama Ubai), ditulis semula untuk semua niche: AI berfikir ikut niche (Profil Produk →
  Peta Niche → riset pesaing → pendekatan → hook → render → Pelajaran), 6 jenis jualan hanya titik mula. Dihantar sebagai
  zip melalui butang muat turun, untuk kod Pro sahaja.
- Pasang skill ditunjuk skrin demi skrin dalam **New session**, kemudian New session lagi untuk prompt video.
- Lagu: Pixabay / Mixkit dahulu; ytmp3.gl juga diajar, dengan nota awas (berhak cipta → Meta boleh bisu/tolak iklan).
- Ujian bilik bersih: `claude -p --setting-sources project --strict-mcp-config` dengan PATH tanpa Homebrew dan skill dalam
  `.claude/skills` projek ujian. Pengelas auto-mode menolak menjalankan binari yang dimuat turun, jadi langkah muat turun
  ffmpeg ialah ujian manusia. ffmpeg Homebrew TIADA libass (`-filters` tiada `subtitles`).
- Kajian kes Modul 0: video yang diedit dengan Claude dan terbukti jual di page /ubaidullahjaafar/ (angka dari D1
  sellhiz-analytics, baca sahaja), kemudian Kelas, Bekam, Umrah. Tiada bahan klien.

## Keputusan Ubai (2026-10-30, lewat malam): modul dari kosong, tiada skill dalam prompt

- **Tiada prompt dari Modul 0 hingga 6 memanggil skill Ubai.** Pelajar tulis prompt biasa (prompt POV + VO Modul 5 lengkap
  sendiri: format, hook, saiz, larangan, ffmpeg .ass), minta ubah sampai ngam, kemudian **jadikan skill sendiri** di hujung
  Modul 5 (`m5-jadikan`, nama contoh `iklan-kedai-saya`), dan projek seterusnya mula dengan «Guna skill [nama-skill]».
- Modul 2: tiada muka skill di awal; bahagian «Dah ngam? Jadikan skill» + contoh isi skill + templat di hujung.
- **Skill Ubai = bonus, Modul 7** («Bonus: Skill Ubai»): Basic pasang `iklan-video`, Pro muat turun `ubai-videoads`;
  kedua-duanya diajar guna skill Ubai dalam projek sedia ada dan gabung peraturannya ke dalam skill sendiri.
- Penjaga: `tests/unit/skill.test.ts` (tiada iklan-video/ubai-videoads dalam prompt Modul 0–6 atau bank).

## Keputusan Ubai (2026-10-31): modul fokus buat video, bukan marketing

- Modul 6 «Video Siap» berhenti pada 6 video terbaik yang disemak, dinamakan dan ada caption, siap untuk dipost.
  Ads Manager (kempen, ad set, Publish, tambah iklan, ukur kos per beli) tidak diajar; 16 muka dan skrinnya dibuang.
  Templat `tools/contoh/meta-ads.html` kekal dalam alat. Kajian kes Modul 0 masih guna angka iklan sebagai bukti.

## Keputusan Ubai (2026-10-31, malam): contoh digital tanpa nama dan harga

- Umrah kekal sebagai Kajian kes 4. Empat muka yang mengajar dari contoh guna produk digital Ubai sendiri: Bukti Ad
  Library (ms 6), Caption dan bukti angka (ms 13), POV dan VO dari satu folder (ms 105), Caption sebenar + prompt CW
  (ms 132–133). Muka lain (prompt Modul 5, skrin «Iklan Umrah», nama fail Modul 6) tidak diubah.
- Nama produk (kidzy.win, Bina Game AI, nama game) dan harga produk tidak pernah muncul dalam teks, prompt atau suara
  muka itu. Gambar = frame dari 30 video sedia ada (`out/2026-10-16_1858_30-hook-baru` projek Kelas); tiada render baru.
- Format CW: masalah, ciri, tawaran, **bukti**, butang (dulu «lesen», yang tak wujud untuk produk digital); hujung
  «Klik butang di bawah». Penjaga: `tests/unit/contoh-digital.test.ts`.

## Keputusan Ubai (2026-10-31, lewat malam): tiada harga produk, tiada kes jual kelas dalam slide

- Slide tidak pernah tunjuk harga produk Ubai. RM19 ialah harga jual webinar, jadi «kos setiap beli» RM19/RM43/RM44 pun
  dibuang (kini «kos terendah», «2.3× kos»). Bilangan jualan, order, tontonan dan klik boleh.
- Tiada kajian kes yang terang-terang hasil jual kelas: Modul 0 = Digital (1), Bekam (2), Umrah (3). Screenshot yang
  ada petak iklan kelas atau «Avg. Value» dipotong.
- Dalam video: biarkan (kelas disebut, angka atas skrin). Larangan hanya untuk slide, teks, jadual dan suara buku.
- Suara dimuat dengan `?v=<hash>` (`voUrl`), sebab aset dicache 24 jam; klip yang disuarakan semula tidak lagi main
  versi lama. Penjaga: `tests/unit/contoh-digital.test.ts`.

## Keputusan Ubai (2026-11-01): caption dan angka, tanpa carta Kidzy

- Muka carta reel Kidzy («Hook menentukan berapa ramai nampak») dibuang; kuiz «Iklan mana yang menang?» guna carta
  «Gaya edit sama, hook lain» (40 / 10 / 4 pembelian).
- «Caption dan angka» (Modul 1): bukti angka berbulat merah (order/jualan) dibuang. Caption pada frame H22
  («JAWI MATEMATIK»), angka pada frame H23 («DIBINA 100%») — angka yang bukan order atau jualan. Muka spot boleh beri
  frame sendiri setiap bahagian (`SpotItem.img`). Komponen ke-4 Modul 1 kini «Angka», bukan «Bukti angka … harga».
- Ikon `target` dulu tertulis «RM»; dilukis semula sebagai papan sasaran. Tiada ikon yang menulis harga.
