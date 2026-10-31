---
name: ubai-videoads
description: Skill Ubai Video Ads (pakej Pro). Buat video iklan Facebook/Instagram/TikTok menegak 9:16 untuk APA-APA produk atau servis, dalam dua format, POV (rakaman tanpa suara + kotak tulisan + lagu) dan VO (suara ElevenLabs + caption ikut perkataan + latar grid), dari folder RAW dan Footage. Claude kenal niche dulu (Profil Produk, Peta Niche, riset pesaing), baru tulis hook dan render. Guna bila saya minta video iklan, iklan POV, iklan VO, hook iklan, caption iklan, sample iklan, buat 10/20/30 video, atau sebut ubai-videoads.
---

# Ubai Video Ads (Pro)

Cara Ubai buat iklan video yang menjual, untuk semua niche. Kerja ikut tujuh langkah, sentiasa dalam folder projek
saya (ada RAW dan Footage). Fail rujukan dalam `references/`, enjin dalam `scripts/` (Node 20+ dan ffmpeg).

## Peraturan yang tidak pernah dilanggar
1. Fakta dari bahan saya sahaja (poster, sales page, brosur, nota, profil.md). Setiap hook dan ayat VO menyebut sumber
   faktanya dalam CATATAN.md. Jangan reka harga, ulasan, testimoni atau angka.
2. Tiada nombor telefon atau WhatsApp dalam video. CTA ikut profil (lalai «Klik butang di bawah»).
3. 1080×1920. POV 15–30 s, VO 20–30 s (skrip 50–65 perkataan). Tukar babak setiap 2–3 s. Bunyi akhir -14 LUFS.
4. Hook pada frame pertama: 2–3 baris, 2–4 perkataan sebaris, SATU fakta. Hook mesti terbaca pada 0.5 s.
5. Tulisan, kotak dan bayang tidak pernah menutup muka orang. Lihat frame klip dulu, kemudian pilih `teks_y`.
6. Pematuhan: jalankan `node scripts/lint.mjs <plan.json>` sebelum render. Lint gagal = betulkan, jangan render.
7. Senarai hook dan Peta Niche mesti saya luluskan dulu. 5 sample dulu (3 POV + 2 VO); kumpulan penuh selepas «ngam».

## Tujuh langkah
1. **Profil Produk.** Baca semua bahan dulu, baru isi `profil.md` dalam folder projek ikut `references/profil-produk.md`.
   Tanya hanya yang tiada dalam bahan, paling banyak 5 soalan dalam satu mesej.
2. **Peta Niche.** Fikir sendiri tentang niche ini dan tulis 10 baris ikut `references/peta-niche.md`: siapa beli, kenapa
   sekarang, 3 bantahan, bukti yang paling dipercayai, rakaman yang menunjukkan nilai, perkataan pembeli sendiri,
   larangan kategori. Tunjuk kepada saya dan tunggu lulus.
3. **Riset pesaing.** Jika boleh buka web, cari di Meta Ad Library (negara saya) iklan niche ini yang paling lama aktif;
   iklan yang lama berjalan = iklan yang menjual. Ambil pola hook dan bukti, bukan ayatnya. Jika tak boleh, minta saya
   tampal 3 gambar iklan pesaing.
4. **Pendekatan.** `references/jenis-jualan.md` ada 6 jenis jualan sebagai titik mula. Pilih, campur, atau reka cara sendiri
   bila niche ini lain, dan terangkan dalam 2 ayat kenapa.
5. **Hook.** Guna `references/hook-bank.md` sebagai bahan mentah; tulis semula dalam bahasa pembeli niche ini. Jadual: hook,
   fakta, sumber, format (POV/VO). Tiada hook memerlukan bukti yang tiada dalam profil.
6. **Render.** Tulis satu plan JSON setiap video dalam `out/<tarikh>_<apa>/plan/`, kemudian:
   - `node scripts/setup.mjs` (sekali: cari ffmpeg yang ada "subtitles", sediakan fon)
   - `node scripts/lint.mjs out/.../plan/*.json`
   - `node scripts/pov.mjs <plan>` atau `node scripts/vo.mjs <plan>`
   - `node scripts/semak.mjs out/<tarikh>_<apa>` (frame 0.5 s, tengah, akhir + LUFS + tempoh)
   Format plan: `references/plan.md`. Susun atur: `references/susun-atur.md`.
7. **Semak dan belajar.** Lihat sendiri setiap gambar semak: hook terbaca, muka tak tertutup, ejaan, tiada nombor
   telefon. Tulis CATATAN.md (hook, fakta, sumber, lagu). Teguran saya diulang dua kali → tambah ke bahagian
   **Pelajaran** dalam `profil.md`, supaya video seterusnya terus betul.

## Suara (VO)
ElevenLabs endpoint with-timestamps. Voice ID dan model dari profil; jika tiada, pilih suara dalam akaun saya yang sesuai
untuk bahasa iklan, dan tulis namanya dalam CATATAN. Kunci API dalam `.env` projek sahaja (`ELEVENLABS_API_KEY`). Selepas
jana, dengar semula atau baca transkrip: nama jenama dan tempat mesti betul; tulis semula ejaan bunyi jika lari.

## Caption iklan (CW)
Bila saya minta caption, ikut `references/cw.md`: satu ayat masalah, kemudian ciri ✅ dari bahan, kemudian CTA profil.

## Bila ffmpeg tiada "subtitles"
`node scripts/setup.mjs` cetak arahan muat turun ffmpeg static (Mac: martin-riedl.de, Windows: gyan.dev) ke folder `alat/`
projek, tanpa kata laluan admin. Jangan sekali-kali tukar tulisan jadi gambar PNG, dan setiap gambar diam ada tempoh.

## Pelajaran Ubai (dari ratusan iklan)
- Telefon hanya untuk skrin berbentuk telefon; dashboard, resit, poster: tanpa bingkai, besar.
- Zoom = kamera menolak seluruh kad (bingkai membesar bersama), ke angka yang sedang disebut; bulatan merah muncul selepas
  zoom tiba.
- Satu modul / satu ciri setiap babak ~3 s; demo 1–2 sahaja, selebihnya hasil dan bukti.
- Rakaman yang nampak lama (pembinaan, kren, kualiti 2017) tidak dipakai untuk tawaran sekarang.
- Bukti hasil: 1–2 sahaja setiap video, yang paling kuat. Angka jualan disertakan «*Hasil individu berbeza».
- Hook yang lama berjalan dalam Ad Library mengalahkan hook yang "kreatif".
