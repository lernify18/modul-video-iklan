import type { Chapter } from './types'

// Ubai, 31 Okt 2026: the module is about making the videos, not marketing them. Modul 6 ends with the best six
// checked, named and captioned, ready to post; running them as ads is not taught here.
const NAMA = [
  'Saya pilih 6 video ini dari folder out: [nombor video].',
  'Salin ke folder baru out/siap-[tarikh]. Jangan ubah video asal.',
  'Namakan setiap satu ikut format JENIS-NOMBOR-hook-ringkas.mp4, contohnya POV-01-umrah-rm5990.mp4.',
].join('\n')

const NAMA_CONTOH = NAMA.replace('[nombor video]', '==P01, P03, P05, V01, V04, V09==').replace('[tarikh]', '==29okt==')

const CW = [
  'Tulis satu caption iklan untuk setiap video dalam folder out/siap-[tarikh], ikut hook video itu.',
  'Mula dengan satu ayat masalah pelanggan dalam «..», tanpa emoji. Kemudian ciri, satu sebaris, dengan tick hijau: [ciri produk].',
  'Kemudian tawaran: [tawaran], dan bukti: [bukti]. Hujung: «Klik butang di bawah».',
  'Beri juga Headline (bawah 40 huruf) dan Description dari ulasan pelanggan sebenar: [ulasan]. Jangan reka ulasan.',
  'Simpan dalam fail CW.md dalam folder yang sama.',
].join('\n')

const CW_CONTOH = CW
  .replace('[tarikh]', '==29okt==')
  .replace('[ciri produk]', '==game edu dibina 100% guna AI tanpa coding, tiada stok dan tiada pos, bayaran dan akses automatik==')
  .replace('[tawaran]', '==akses terus selepas bayar, prompt siap untuk copy-paste==')
  .replace('[bukti]', '==819 order dalam 14 hari, 4,703+ unit terjual==')
  .replace('[ulasan]', '==fail ulasan.txt==')

export const modul6: Chapter = {
  id: 'm6',
  module: 6,
  title: 'Video Siap',
  strict: true,
  pages: [
    {
      id: 'm6-pembuka', kind: 'explain', cover: true, tone: 'lav', kicker: 'Modul 6', title: 'Video Siap', vo: 'm6-pembuka',
      keynote: 'Semak, pilih, namakan, caption.',
      blocks: [
        { t: 'lead', text: 'Video dah siap dalam folder **out**. Sekarang semak, pilih yang terbaik, dan minta Claude namakan fail serta tulis caption.' },
        { t: 'chips', items: ['Folder out', 'App Claude', 'Siap dipost'] },
        { t: 'outcome', text: 'awak ada 6 video terbaik, bernama kemas dalam satu folder, setiap satu dengan caption, siap untuk dipost.' },
        {
          t: 'road', stops: [
            { icon: 'film', title: 'Semak', sub: 'Tonton dengan bunyi', at: 0 },
            { icon: 'target', title: 'Pilih 6', sub: '3 POV + 3 VO', at: 1 },
            { icon: 'folder', title: 'Namakan', sub: 'Claude salin & namakan', at: 2 },
            { icon: 'caption', title: 'Caption', sub: 'Claude tulis CW', at: 3 },
          ],
        },
      ],
    },
    {
      id: 'm6-semak', kind: 'explain', tone: 'sky', kicker: 'Langkah 1 · Semak', title: 'Semak setiap video', vo: 'm6-semak',
      keynote: 'Tonton dengan bunyi, sampai habis.',
      footnotes: ['Lagu nasyid versi cover ada hak cipta. Facebook boleh bisukan bunyi bila video dipost; dengar semula selepas post.'],
      blocks: [
        { t: 'p', text: 'Tonton setiap video **dengan bunyi**^1, sampai habis. Ada yang tak kena? Minta Claude ubah, macam dalam Modul 5.' },
        { t: 'note', tone: 'awas', title: 'Dengar sebutan', text: 'Suara AI pernah menyebut **AirAsia** jadi «Aasia». Dengar sendiri nama syarikat, tempat dan harga dalam setiap VO.' },
        {
          t: 'tiles', cols: 3, items: [
            { icon: 'hook', title: 'Hook', sub: 'Saat pertama buat berhenti', at: 0 },
            { icon: 'doc', title: 'Fakta', sub: 'Harga ikut poster', at: 1 },
            { icon: 'mic', title: 'Sebutan', sub: 'Nama & tempat betul', at: 2 },
            { icon: 'caption', title: 'Caption', sub: 'Tak tutup muka', at: 3 },
            { icon: 'flag', title: 'Hujung', sub: '«Klik butang di bawah»', at: 4 },
            { icon: 'phone', title: 'Saiz', sub: 'Menegak 9:16', at: 5 },
          ],
        },
      ],
    },
    {
      id: 'm6-pilih', kind: 'explain', tone: 'mint', kicker: 'Langkah 2 · Pilih', title: 'Pilih 6 yang terbaik', vo: 'm6-pilih',
      keynote: '3 POV + 3 VO, hook berlainan.',
      blocks: [
        { t: 'p', text: 'Dari 20 video, pilih **3 POV dan 3 VO** yang paling kuat, setiap satu dengan hook berlainan. Inilah set pertama untuk dipost.' },
        { t: 'note', tone: 'tip', title: 'Yang lain disimpan', text: '14 video lagi untuk set kedua. Tiada yang dibuang.' },
        {
          t: 'flow', title: 'Dari folder ke set pertama', steps: [
            { icon: 'video', title: '20 video', sub: 'Dalam folder out', at: 0 },
            { icon: 'target', title: 'Pilih 6', sub: '3 POV + 3 VO', at: 1 },
            { icon: 'folder', title: 'Namakan', sub: 'Folder siap', at: 2 },
            { icon: 'caption', title: 'Caption', sub: 'Satu setiap video', at: 3 },
            { icon: 'medal', title: 'Siap dipost', sub: '6 video terbaik', at: 4 },
          ],
        },
      ],
    },
    {
      id: 'm6-nama', kind: 'explain', tone: 'butter', kicker: 'Langkah 3 · Namakan', title: 'Minta Claude namakan fail', vo: 'm6-nama',
      keynote: 'Nama fail = nama iklan.',
      blocks: [
        { t: 'p', text: 'Dalam app Claude, kotak yang sama dari Modul 5, tampal arahan ini. Nama fail nanti jadi **nama iklan**, jadi awak tahu hook mana yang menang.' },
        { t: 'note', tone: 'tip', title: 'Video asal selamat', text: 'Claude **salin** ke folder baru. Video dalam folder out tidak berubah.' },
        { t: 'prompt', title: 'Salin dan namakan 6 video', text: NAMA, example: NAMA_CONTOH },
      ],
    },
    {
      id: 'm6-cw', kind: 'explain', tone: 'pink', kicker: 'Langkah 4 · Caption', title: 'Minta Claude tulis caption', vo: 'm6-cw',
      keynote: 'Satu caption untuk satu video.',
      footnotes: ['Format ini dari CW iklan sebenar Ubai, Okt 2026.'],
      blocks: [
        { t: 'p', text: 'Caption ialah tulisan yang disertakan bila video dipost. Minta Claude tulis satu untuk setiap video, dalam format Ubai^1.' },
        { t: 'note', tone: 'awas', title: 'Testimoni sebenar sahaja', text: 'Beri Claude ulasan pelanggan yang betul. Jangan biar Claude reka kata-kata pelanggan.' },
        { t: 'prompt', title: 'Tulis caption (CW)', text: CW, example: CW_CONTOH },
      ],
    },
    {
      id: 'm6-cw-hasil', kind: 'explain', tone: 'mint', kicker: 'Langkah 4 · Caption', title: 'Caption sebenar, bahagian demi bahagian', vo: 'm6-cw-hasil',
      keynote: 'Masalah, ciri, tawaran, bukti, butang.',
      footnotes: ['Caption untuk video POV H03, iklan produk digital Ubai, ditulis Claude dengan prompt di muka sebelum. Dipendekkan di sini.'],
      blocks: [
        { t: 'p', text: 'Ini caption sebenar yang Claude tulis untuk video **POV H03**^1. Setiap bahagian ada tugasnya.' },
        { t: 'flow', left: true, title: 'Susunan caption', steps: [{ icon: 'hook', title: 'Masalah' }, { icon: 'yes', title: 'Ciri' }, { icon: 'medal', title: 'Tawaran' }, { icon: 'zoom', title: 'Bukti' }, { icon: 'click', title: 'Butang' }] },
        {
          t: 'table', head: ['Bahagian', 'Contoh sebenar'], rows: [
            ['Masalah', '«..Ingatkan kena pandai coding baru boleh jual game..» Rupanya AI yang bina, kita cuma copy dan paste prompt.'],
            ['Ciri', 'Dibina 100% guna AI, tanpa coding · Tiada stok, tiada pos · Bayaran & akses automatik'],
            ['Tawaran', 'Akses terus selepas bayar, prompt siap untuk copy-paste'],
            ['Bukti', '819 order dalam 14 hari · 4,703+ unit terjual'],
            ['Hujung', 'Klik butang di bawah'],
            ['Headline', 'Sehari Je, 26 Jualan Masuk'],
          ],
        },
      ],
    },
    {
      id: 'm6-rumusan', kind: 'quiz', tone: 'pink', kicker: 'Rumusan', title: 'Video awak dah siap', vo: 'm6-rumusan',
      keynote: 'Semak, pilih, namakan, caption.',
      blocks: [
        { t: 'p', text: 'Tiga perkara yang paling penting dalam modul ini:' },
        { t: 'flow', title: 'Dari folder ke video siap', steps: [{ icon: 'film', title: 'Semak, pilih 6', sub: '3 POV + 3 VO', at: 0 }, { icon: 'folder', title: 'Namakan', sub: 'Folder siap', at: 1 }, { icon: 'caption', title: 'Caption dari Claude', sub: 'Format CW Ubai', at: 2 }] },
      ],
      questions: [
        { q: 'Berapa video untuk set pertama?', options: ['6: 3 POV + 3 VO', 'Semua 20 sekaligus'], icons: ['target', 'layers'], answer: 0, hint: 'Hampir. Pilih yang paling kuat dulu.' },
        { q: 'Siapa namakan fail?', options: ['Claude, ikut format', 'Saya taip satu-satu'], icons: ['folder', 'type'], answer: 0, hint: 'Hampir. Satu prompt, Claude namakan semua.' },
        { q: 'Caption ditulis dari apa?', options: ['Fakta dan ulasan sebenar', 'Ayat rekaan'], icons: ['yes', 'no'], answer: 0, hint: 'Hampir. Jangan biar Claude reka kata-kata pelanggan.' },
      ],
    },
    {
      id: 'm6-tamat', kind: 'explain', cover: true, tone: 'lav', kicker: 'Tahniah', title: 'Kursus selesai', vo: 'm6-tamat',
      keynote: 'Satu folder, satu prompt, sepuluh iklan.',
      blocks: [
        { t: 'lead', text: 'Awak dah buat apa yang ramai fikir perlukan editor video: **video iklan sebenar, dengan Claude**, dari bahan sampai siap dipost.' },
        { t: 'outcome', text: 'awak boleh ulang semua ini untuk produk lain: folder baru, bahan baru, prompt yang sama.' },
        {
          t: 'road', stops: [
            { icon: 'video', title: 'Tengok hasil', sub: 'Modul 0', at: 0 },
            { icon: 'film', title: 'Kenal bahan', sub: 'Modul 1', at: 1 },
            { icon: 'chat', title: 'Prompt', sub: 'Modul 2', at: 2 },
            { icon: 'laptop', title: 'Komputer', sub: 'Modul 3', at: 3 },
            { icon: 'folder', title: 'Kumpul bahan', sub: 'Modul 4', at: 4 },
            { icon: 'code', title: 'Arah Claude', sub: 'Modul 5', at: 5 },
            { icon: 'medal', title: 'Video siap', sub: 'Modul 6', at: 6 },
          ],
        },
      ],
    },
  ],
}
