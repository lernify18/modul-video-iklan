/**
 * The learner's own skill, iklan-video: a short version of Ubai's video-ad skills, with nothing that needs his tools,
 * voice, music or folders. The learner pastes this once (Modul 5); every later prompt starts with «Guna skill
 * iklan-video». Tested on 30 Okt 2026 on a Claude with no skills, no CLAUDE.md and no memory: it refused facts not on
 * the poster and followed the hook rules. Its first render hung for two hours: Homebrew's ffmpeg has no libass, so it
 * drew the captions as looping PNGs with no -t and the output never ended. Hence the "subtitles" check and the -t rule.
 * The ffmpeg links are the makers' own redirects to the latest build (evermeet.cx now answers 410).
 */
export const SKILL = 'iklan-video'

export const SKILL_PROMPT = `Cipta skill peribadi bernama iklan-video supaya saya boleh guna dalam semua folder projek.
Simpan sebagai iklan-video/SKILL.md dalam folder skills Claude saya. Tulis isinya tepat seperti di bawah.
Lepas siap, tunjuk di mana fail disimpan dan ayat untuk guna skill ini.

---
name: iklan-video
description: Buat video iklan Facebook/Instagram menegak 9:16 dalam dua format, POV (rakaman tanpa suara + kotak tulisan + lagu) dan VO (suara ElevenLabs + caption ikut perkataan + latar grid), dari folder RAW dan Footage. Guna bila saya minta video iklan, iklan POV, iklan VO, sample iklan, atau buat 10/20 video.
---

# Iklan video POV + VO

## Peraturan
1. Fakta dari bahan saya sahaja (poster, brosur, nota). Jangan reka harga, ulasan atau angka.
2. Tiada nombor telefon atau WhatsApp. Hujung setiap video: «Klik butang di bawah».
3. Saiz 1080×1920, 25–30 saat. Tukar babak setiap 2–3 saat.
4. Hook ada pada saat pertama: 2–3 baris, 2–4 perkataan sebaris, satu fakta.
   Pola: «POV: …», «Ramai tak tahu …», «Tak sangka …», «Menyesal tak tahu awal …».
5. Tulisan dan bayang gelap tidak pernah menutup muka orang.
6. Tunjuk senarai hook dulu, tunggu saya setuju, baru render.

## POV
- Rakaman dari RAW, bunyi asal dibisukan, lagu dari Footage (perlahan masuk dan keluar).
- Tulisan hitam Arial Black dalam kotak putih, kata penting kotak merah tulisan putih, di bawah muka.
- Poster: penuh lebar, zoom perlahan ke angka penting, bulatan merah pada angka itu.

## VO
- Skrip 55–60 perkataan: hook → masalah → penyelesaian → bukti → «Klik butang di bawah». Mula dengan perkataan Melayu.
- Suara ElevenLabs melalui endpoint with-timestamps (masa setiap perkataan). Guna voice ID yang saya beri; jika tiada,
  pilih suara dalam akaun saya yang sesuai untuk Bahasa Melayu dan tulis namanya dalam CATATAN.
  Pilih model yang menyokong Bahasa Melayu. Kunci API dalam fail .env projek sahaja.
- Caption 1–3 perkataan, putih Arial Black, satu kata kunci kuning, muncul tepat ikut suara, di sepertiga bawah.
- Latar video grid dari Footage, gambar dan poster sebagai kad di atasnya, zoom ke angka yang disebut.
  Muzik 15 dB di bawah suara.

## Cara bina
- Render dengan ffmpeg sahaja. Tulisan melalui fail sari kata .ass (kotak POV = BorderStyle 3), jangan tukar jadi gambar.
- Semak dulu: ffmpeg -filters mesti ada "subtitles". Jika ffmpeg tiada, atau tiada "subtitles", muat turun ffmpeg dan
  ffprobe static ke folder alat/ projek dan guna yang itu, tanpa kata laluan admin:
  Mac https://ffmpeg.martin-riedl.de/redirect/latest/macos/arm64/release/ffmpeg.zip (Intel: amd64; ffprobe.zip sama),
  Windows https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
- Setiap gambar diam (-loop 1) mesti ada -t tempohnya, jika tidak video tak pernah habis.
- Skrip kecil dalam bahasa yang sudah ada di komputer (Python, Node atau PowerShell); jika tiada, muat turun Node
  portable ke alat/. Simpan semua skrip dalam alat/ supaya kali seterusnya sama dan laju.
- Bunyi akhir -14 LUFS.
- Simpan dalam out/<tarikh>_<apa>/: POV01.mp4, VO01.mp4…, dan CATATAN.md (hook, fakta dan sumber setiap video).

## Sebelum serah
- Ambil gambar frame 0.5 s, tengah dan akhir setiap video, kemudian lihat sendiri: hook terbaca,
  tiada nombor telefon, ejaan betul, muka tak tertutup.
- 5 sample dulu (3 POV + 2 VO). Kumpulan penuh hanya selepas saya kata ngam.

## Teguran
- Ubah video yang disebut sahaja. Yang lain kekal.
- Teguran yang saya beri dua kali: tambah ke bahagian Pelajaran supaya tak berulang.

## Pelajaran
(kosong, diisi dari teguran)`
