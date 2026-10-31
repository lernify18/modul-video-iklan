import { bankPages } from './bank'
import { PRO_SKILL } from './pakej'
import { SKILL, SKILL_PROMPT } from './skill'
import type { Chapter, InfoStep } from './types'

// Ubai, 30 Okt 2026: "skill" is explained at the start of Modul 2, before any prompt uses it; installing it waits for
// Modul 5, when the app and the project folder exist.
const TULIS = [
  'Cipta skill peribadi bernama [nama-skill] supaya saya boleh guna dalam semua folder projek.',
  'Guna bila: [bila Claude patut guna skill ini].',
  'Peraturan: [apa yang wajib dan apa yang dilarang].',
  'Cara buat: [langkah demi langkah].',
  'Semak sebelum serah: [apa yang perlu disemak].',
  'Simpan sebagai [nama-skill]/SKILL.md dalam folder skills Claude saya, kemudian tunjuk ayat untuk guna skill ini.',
].join('\n')

const TULIS_CONTOH = TULIS
  .replaceAll('[nama-skill]', '==caption-iklan==')
  .replace('[bila Claude patut guna skill ini]', '==bila saya minta caption iklan==')
  .replace('[apa yang wajib dan apa yang dilarang]', '==fakta dari bahan sahaja, tiada nombor telefon==')
  .replace('[langkah demi langkah]', '==10 caption, buka dengan masalah, ciri ✅, CTA==')
  .replace('[apa yang perlu disemak]', '==ejaan, fakta, CTA==')

/** The six parts of a skill, with what they hold in the reader's own skill. */
const parts = (subs: readonly string[]): InfoStep[] => [
  { icon: 'tab', title: 'Nama', sub: subs[0], at: 0 },
  { icon: 'target', title: 'Bila guna', sub: subs[1], at: 1 },
  { icon: 'warn', title: 'Peraturan', sub: subs[2], at: 2 },
  { icon: 'gear', title: 'Cara buat', sub: subs[3], at: 3 },
  { icon: 'yes', title: 'Semak', sub: subs[4], at: 4 },
  { icon: 'bulb', title: 'Pelajaran', sub: subs[5], at: 5 },
]

export const modul2: Chapter = {
  id: 'm2',
  module: 2,
  title: 'Cakap Dengan Claude',
  pages: [
    {
      id: 'm2-pembuka', kind: 'explain', cover: true, tone: 'lav', kicker: 'Modul 2', title: 'Cakap Dengan Claude', vo: 'm2-pembuka',
      keynote: 'Arahan jelas, hasil terus jadi.',
      blocks: [
        { t: 'lead', text: 'Claude buat apa yang awak tulis. Bila arahan jelas, video terus jadi. Bila kabur, Claude terpaksa meneka.' },
        { t: 'chips', items: ['22 prompt sebenar Ubai', 'Templat + contoh diisi', 'Tinggal salin'] },
        { t: 'outcome', text: 'awak boleh tulis prompt yang Claude terus faham, dan minta ubah satu bahagian tanpa mula semula.' },
        {
          t: 'road', stops: [
            { icon: 'chat', title: 'Formula 5 bahagian', sub: 'Cara tulis prompt pertama', at: 0 },
            { icon: 'doc', title: 'Bank prompt Ubai', sub: 'Prompt sebenar, tinggal salin', at: 1 },
            { icon: 'gear', title: 'Ayat minta ubah', sub: 'Bila video belum ngam', at: 2 },
            { icon: 'medal', title: 'Jadikan skill', sub: 'Bila dah ngam', at: 3 },
          ],
        },
      ],
    },
    {
      id: 'm2-formula', kind: 'explain', tone: 'sky', kicker: 'Formula', title: 'Prompt 5 bahagian', vo: 'm2-formula',
      keynote: 'Apa, bahan, gaya, saiz, larangan.',
      blocks: [
        { t: 'p', text: 'Setiap prompt video iklan yang menjadi ada lima bahagian ini. Tak perlu ayat cantik. Bahasa biasa pun Claude faham.' },
        { t: 'steps', parts: true, items: ['**Apa**: berapa video, untuk produk apa.', '**Bahan**: folder mana Claude perlu baca.', '**Gaya**: caption ikut suara, latar grid, babak 2–3 saat (gaya Iman Gadzhi).', '**Saiz dan panjang**: menegak 9:16, 25–30 saat.', '**Larangan**: apa yang tak boleh ada dalam video.'] },
        {
          t: 'prompt', title: 'Prompt pertama', note: 'Tukar setiap **[tempat kosong]**, kemudian tampal dalam Claude.',
          parts: ['1 · Apa', '2 · Bahan', '3 · Gaya', '4 · Saiz', '5 · Larangan', 'Akhir · minta sample dulu'],
          text: 'Saya nak buat [5] video iklan untuk [nama produk].\nBahan ada dalam folder RAW dan Footage dalam folder projek ini.\nGaya: caption ikut suara, latar grid, tukar babak setiap 2–3 saat.\nSaiz menegak 9:16, panjang 25–30 saat setiap video.\nJangan letak [harga / nombor telefon / dakwaan yang tak benar].\nBuat 5 sample dulu, kemudian tunggu komen saya.',
        },
      ],
    },
    {
      id: 'm2-formula-kuiz', kind: 'quiz', tone: 'pink', kicker: 'Semak diri', title: 'Prompt ini kurang apa?', vo: 'm2-formula-kuiz',
      keynote: 'Semak lima bahagian sebelum tekan hantar.',
      blocks: [
        { t: 'p', text: 'Baca setiap prompt di sebelah, kemudian pilih bahagian yang tertinggal. Semak dengan lima bahagian ini:' },
        {
          t: 'tiles', title: 'Semak 5 bahagian', cols: 2, items: [
            { icon: 'chat', title: '1 · Apa', sub: 'Berapa video, untuk produk apa', at: 0 },
            { icon: 'folder', title: '2 · Bahan', sub: 'Folder mana Claude perlu baca', at: 1 },
            { icon: 'film', title: '3 · Gaya', sub: 'Skill iklan-video, gaya Iman', at: 2 },
            { icon: 'phone', title: '4 · Saiz', sub: 'Menegak 9:16, 25–30 saat', at: 3 },
            { icon: 'warn', title: '5 · Larangan', sub: 'Apa yang tak boleh ada', at: 4 },
          ],
        },
      ],
      questions: [
        { q: '«Buat 5 video iklan bekam gaya Iman Gadzhi, 25 saat.»', options: ['Bahan: folder mana', 'Gaya'], icons: ['folder', 'film'], answer: 0, hint: 'Hampir. Gaya sudah ada (Iman Gadzhi). Claude tak tahu gambar mana nak guna.' },
        { q: '«Guna folder RAW. Buat video untuk kedai saya.»', options: ['Gaya, saiz dan jumlah', 'Bahan'], icons: ['film', 'folder'], answer: 0, hint: 'Hampir. Folder sudah disebut. Berapa video, gaya apa, saiz apa?' },
      ],
    },
    ...bankPages,
    {
      id: 'm2-ubah', kind: 'explain', tone: 'mint', kicker: 'Bila belum ngam · 1/2', title: 'Ayat siap untuk minta ubah', vo: 'm2-ubah',
      keynote: 'Sebut nombor video dan saat. Claude ubah tempat itu sahaja.',
      blocks: [
        { t: 'p', text: 'Sample pertama jarang terus sempurna. Itu biasa. Beritahu Claude **apa** yang tak kena dan **di mana**, kemudian minta yang lain dikekalkan.' },
        {
          t: 'loop', centre: 'Ulang sampai ngam', at: 4, nodes: [
            { icon: 'video', title: 'Tonton sample', sub: 'Video 1–5 dari Claude', at: 0 },
            { icon: 'zoom', title: 'Cari yang tak kena', sub: 'Catat nombor video + saat', at: 1 },
            { icon: 'chat', title: 'Taip ayat ubah', sub: 'Salin ayat di sebelah', at: 2 },
            { icon: 'gear', title: 'Claude ubah', sub: 'Bahagian itu sahaja', at: 3 },
          ],
        },
        { t: 'prompt', title: 'Tukar hook', text: 'Hook video [nombor] kurang kuat. Bagi 3 hook baru untuk [produk] yang lebih menarik, kekalkan bahagian lain.' },
        { t: 'prompt', title: 'Muzik terlalu kuat', text: 'Muzik dalam video [nombor] tenggelamkan suara. Perlahankan muzik, suara mesti jelas.' },
        { t: 'prompt', title: 'Caption laju sangat', text: 'Caption video [nombor] laju sangat, tak sempat baca. Perlahankan, 2–3 perkataan sebaris.' },
      ],
    },
    {
      id: 'm2-ubah-2', kind: 'explain', tone: 'mint', kicker: 'Bila belum ngam · 2/2', title: 'Tukar gambar, atau ulang yang dah ngam', vo: 'm2-ubah-2',
      keynote: 'Video yang dah ngam jadi templat untuk yang lain.',
      blocks: [
        { t: 'p', text: 'Dua ayat terakhir: tukar satu gambar sahaja, dan bila satu video dah ngam, minta Claude buat lagi ikut gaya yang sama.' },
        {
          t: 'loop', centre: 'Ulang sampai ngam', at: 4, nodes: [
            { icon: 'video', title: 'Tonton sample', sub: 'Video 1–5 dari Claude', at: 0 },
            { icon: 'zoom', title: 'Cari yang tak kena', sub: 'Catat nombor video + saat', at: 1 },
            { icon: 'chat', title: 'Taip ayat ubah', sub: 'Salin ayat di sebelah', at: 2 },
            { icon: 'gear', title: 'Dah ngam?', sub: 'Jadikan templat yang lain', at: 3 },
          ],
        },
        { t: 'prompt', title: 'Tukar gambar', text: 'Gambar pada saat [masa] dalam video [nombor] tak sesuai. Ganti dengan gambar lain dari folder [nama folder].' },
        { t: 'prompt', title: 'Ulang yang dah ngam', text: 'Video [nombor] dah ngam. Buat [jumlah] lagi ikut gaya yang sama, setiap satu hook berlainan.' },
      ],
    },
    {
      id: 'm2-skill-ngam', kind: 'explain', tone: 'butter', kicker: 'Dah ngam · Skill', title: 'Dah ngam? Jadikan skill', vo: 'm2-skill-ngam',
      keynote: 'Prompt dan ubah dulu. Bila dah ngam, baru jadikan skill.',
      blocks: [
        { t: 'p', text: `Begini skill **${SKILL}** dibina: banyak kali prompt dan minta ubah. Bila hasil dah ngam, barulah semua peraturan itu disimpan jadi **SKILL.md**.` },
        { t: 'note', tone: 'tip', title: 'Jangan terlalu awal', text: 'Skill yang ditulis sebelum cara kerja menjadi hanya menyimpan cara yang salah. Ngam dulu, kemudian simpan.' },
        {
          t: 'loop', centre: 'Lain kali: «Guna skill …»', nodes: [
            { icon: 'chat', title: 'Prompt', sub: 'Formula 5 bahagian', at: 0 },
            { icon: 'video', title: '5 sample', sub: 'Kecil dulu', at: 1 },
            { icon: 'zoom', title: 'Minta ubah', sub: 'Satu-satu', at: 2 },
            { icon: 'yes', title: 'Dah ngam', sub: 'Hasil yang awak suka', at: 3 },
            { icon: 'doc', title: 'Simpan jadi skill', sub: 'SKILL.md', at: 4 },
          ],
        },
      ],
    },
    {
      id: 'm2-skill-isi', pakej: 'basic', kind: 'explain', tone: 'sky', kicker: 'Dah ngam · Skill', title: 'Dalam sebuah skill', vo: 'm2-skill-isi',
      keynote: 'Nama, bila guna, peraturan, cara, semak, pelajaran.',
      blocks: [
        { t: 'p', text: `Contoh: skill **${SKILL}** Ubai, hasil cara kerja yang dah ngam, dalam enam bahagian. Baca sebagai contoh; ia bonus dalam **Modul 7**.` },
        { t: 'tiles', cols: 3, items: parts([SKILL, 'Video iklan, POV, VO', 'Fakta, saiz, hook, muka', 'ffmpeg, suara, folder out', 'Frame, 5 sample dulu', 'Dari teguran awak']) },
        { t: 'prompt', title: `Contoh skill Ubai · ${SKILL}`, text: SKILL_PROMPT, fixed: true, note: 'Contoh untuk dibaca. Skill ini bonus dalam Modul 7.' },
      ],
    },
    {
      id: 'm2-skill-isi-pro', pakej: 'pro', kind: 'explain', tone: 'sky', kicker: 'Dah ngam · Skill Pro', title: 'Dalam sebuah skill', vo: 'm2-skill-isi-pro',
      keynote: 'Contoh: satu folder SKILL.md, references dan scripts.',
      blocks: [
        { t: 'p', text: `Contoh: skill **${PRO_SKILL}** Ubai ialah satu folder: **SKILL.md** (arahan), **references** (hook, susun atur, pematuhan) dan **scripts** (enjin render). Ia bonus dalam **Modul 7**.` },
        { t: 'tiles', cols: 3, items: parts([PRO_SKILL, 'Iklan apa-apa produk', 'Fakta, polisi Meta, kategori', 'Profil, Peta Niche, hook, render', 'Lint dan frame', 'Dalam profil.md']) },
        { t: 'note', tone: 'tip', title: 'Skill awak dulu', text: 'Dalam **Modul 5** awak jadikan skill sendiri dari iklan yang dah ngam. Skill Ubai ialah bonus di **Modul 7**.' },
      ],
    },
    {
      id: 'm2-skill-tulis', kind: 'explain', tone: 'mint', kicker: 'Dah ngam · Skill', title: 'Tulis skill sendiri', vo: 'm2-skill-tulis',
      keynote: 'Cara yang dah menjadi, simpan jadi skill.',
      blocks: [
        { t: 'p', text: 'Bila cara kerja awak sendiri dah ngam, contohnya cara tulis caption, jadikan skill. Dalam **Modul 5** awak buat ini dengan iklan awak sendiri.' },
        { t: 'prompt', title: 'Templat skill sendiri', text: TULIS, example: TULIS_CONTOH, note: 'Setiap baris satu bahagian skill: nama, bila guna, peraturan, cara, semak, simpan.' },
      ],
    },
    {
      id: 'm2-rumusan', kind: 'quiz', tone: 'pink', kicker: 'Rumusan', title: 'Awak dah tahu cara arah Claude', vo: 'm2-rumusan',
      keynote: 'Formula 5 bahagian, 5 sample dulu, ubah satu-satu, dah ngam jadikan skill.',
      blocks: [
        { t: 'p', text: 'Empat langkah yang Ubai ulang dalam setiap projek iklan:' },
        {
          t: 'flow', title: 'Cara arah Claude', steps: [
            { icon: 'chat', title: 'Tulis 5 bahagian', at: 0 },
            { icon: 'video', title: 'Minta 5 sample', at: 1 },
            { icon: 'zoom', title: 'Ubah satu-satu', at: 2 },
            { icon: 'doc', title: 'Jadikan skill', at: 3 },
          ],
        },
      ],
      questions: [
        { q: 'Sebelum 10 video, minta apa dulu?', options: ['5 sample', 'Terus 50 video'], icons: ['video', 'film'], answer: 0, hint: 'Hampir. Sample kecil dulu.' },
        { q: 'Ubah satu video: sebut apa?', options: ['Nombor video dan saat', 'Nama penuh awak'], icons: ['zoom', 'chat'], answer: 0, hint: 'Hampir. Video mana, bahagian mana.' },
        { q: 'Bila jadikan skill sendiri?', options: ['Sebelum mula projek', 'Bila dah ngam'], icons: ['flag', 'yes'], answer: 1, hint: 'Hampir. Ngam dulu, kemudian simpan.' },
      ],
    },
  ],
}
