# Format plan (JSON) untuk scripts/pov.mjs dan scripts/vo.mjs

Laluan fail relatif kepada folder projek. Koordinat x/y ialah pecahan 0–1 dari gambar asal.

## POV
```json
{
  "jenis": "pov", "nama": "POV01", "out": "out/2026-11-01_kek/POV01.mp4",
  "hook": "SEHARI JE, | 26 KEK DITEMPAH", "fakta": ["26 tempahan, gambar WhatsApp 12 Okt"],
  "teks_y": 0.72,
  "beat": [
    { "jenis": "klip", "fail": "RAW/hias.mp4", "mula": 3.2, "tempoh": 2.6, "teks": ["SEHARI JE,", "26 KEK DITEMPAH"], "merah": [1] },
    { "jenis": "gambar", "fail": "RAW/poster.jpg", "tempoh": 3, "zoom": { "x": 0.62, "y": 0.41, "skala": 1.8 },
      "bulatan": { "x": 0.62, "y": 0.41, "r": 0.09 }, "teks": ["TULIS NAMA ANAK"] },
    { "jenis": "telefon", "fail": "RAW/salespage.png", "tempoh": 3, "teks": ["TEMPAH DALAM 1 MINIT"] }
  ],
  "lagu": { "fail": "Footage/lagu.mp3", "mula": 20 },
  "cta": "Klik butang di bawah"
}
```
`merah` = nombor baris (dari 0) yang dapat kotak merah. `teks_y` boleh diletak setiap beat.

## VO
```json
{
  "jenis": "vo", "nama": "VO01", "out": "out/2026-11-01_kek/VO01.mp4",
  "hook": "KEK TULIS NAMA, | SIAP ESOK PAGI", "fakta": ["…"],
  "skrip": "Kek tulis nama, siap esok pagi. …", "kata_kunci": ["esok pagi", "RM45"],
  "suara": { "voice_id": "…", "model": "eleven_multilingual_v2" },
  "latar": "Footage/grid.mp4",
  "babak": [
    { "jenis": "gambar", "fail": "RAW/kek1.jpg", "dari_kata": 0 },
    { "jenis": "gambar", "fail": "RAW/poster.jpg", "dari_kata": 12, "zoom": { "x": 0.5, "y": 0.7, "skala": 1.6 }, "bulatan": { "x": 0.5, "y": 0.7, "r": 0.08 } },
    { "jenis": "klip", "fail": "RAW/ambil.mp4", "mula": 1, "dari_kata": 24 }
  ],
  "lagu": { "fail": "Footage/lagu.mp3", "mula": 0 },
  "cta": "Klik butang di bawah"
}
```
`dari_kata` = babak mula pada perkataan ke-n skrip (dari 0). Tanpa `dari_kata`, babak dibahagi sama rata.
Nombor dieja dalam `skrip` supaya suara sebut betul; `papar` menukar frasa itu jadi angka dalam caption:
`"papar": { "dua ratus lima puluh ringgit": "RM250", "dua ribu dua puluh tujuh": "2027" }`.
