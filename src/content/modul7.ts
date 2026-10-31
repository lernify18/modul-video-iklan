import { PRO_PASANG, PRO_SKILL, PRO_ZIP } from './pakej'
import { fromShot } from './shots'
import { SKILL, SKILL_PROMPT } from './skill'
import type { Chapter, ShotView } from './types'

/**
 * The bonus (Ubai, 30 Okt 2026): the book is built from scratch and the reader makes their own skill in Modul 5; Ubai's
 * skill comes last, as a gift. Basic installs iklan-video, Pro downloads ubai-videoads; both learn to use it in a
 * project they already have, or to merge its rules into their own skill. A Pro reader's text names ubai-videoads.
 */
const app = (mac: string, win: string, v: Omit<ShotView, 'img' | 'target' | 'focus' | 'frame'>): { mac: ShotView; win: ShotView } => ({
  mac: { ...fromShot(`contoh/${mac}`), frame: 'screen', ...v },
  win: { ...fromShot(`win/${win}`), frame: 'screen', ...v },
})

const NAIK = [
  `Guna skill ${SKILL} pada folder projek ini.`,
  'Semak video dalam folder [folder out] ikut peraturan skill: hook, saiz, caption dan larangan.',
  'Senaraikan yang lari, kemudian buat semula [3] video yang paling lemah dalam folder baru.',
].join('\n')

const NAIK_CONTOH = NAIK.replace('[folder out]', '==out/2026-11-01_iklan-kedai==').replace('[3]', '==3==')

const GABUNG = [
  `Baca skill ${SKILL} dan skill [nama skill saya].`,
  `Tambah peraturan dari ${SKILL} yang belum ada ke dalam skill saya. Jangan buang peraturan saya.`,
  'Tunjuk apa yang ditambah, dan tunggu saya setuju sebelum simpan.',
].join('\n')

const GABUNG_CONTOH = GABUNG.replace('[nama skill saya]', '==iklan-kedai-saya==')

const PROMPT = [
  `Guna skill ${PRO_SKILL}.`,
  'Produk saya: [apa yang dijual, untuk siapa].',
  'Bahan ada dalam folder RAW dan Footage, dan [poster / sales page / nota].',
  'Mula dengan Profil Produk dan Peta Niche. Tunjuk kepada saya dulu, kemudian 10 hook.',
  'Lepas saya luluskan, buat 5 sample: 3 POV dan 2 VO.',
].join('\n')

const CONTOH = PROMPT
  .replace('[apa yang dijual, untuk siapa]', '==kelas fizikal AI sehari di Muar, untuk usahawan yang nak buat produk digital==')
  .replace('[poster / sales page / nota]', '==poster kelas dan nota 9 modul==')

const CW = [
  `Guna skill ${PRO_SKILL}.`,
  'Tulis 10 caption iklan (CW) untuk [produk] ikut format skill.',
  'Setiap satu buka dengan masalah lain dari Peta Niche. Simpan dalam CW.md.',
].join('\n')

const CW_CONTOH = CW.replace('[produk]', '==kelas AI Muar==')

export const modul7: Chapter = {
  id: 'm7',
  module: 7,
  title: 'Bonus: Skill Ubai',
  strict: true,
  pages: [
    {
      id: 'm7-pembuka', kind: 'explain', cover: true, tone: 'peach', kicker: 'Modul 7 · Bonus', title: 'Bonus: Skill Ubai', vo: 'm7-pembuka',
      keynote: 'Skill awak dulu. Skill Ubai tambahan.',
      blocks: [
        { t: 'lead', text: `Skill awak sendiri dah ada dari Modul 5. Bonus ini **skill ${SKILL}** Ubai: pilihan, bukan wajib.` },
        { t: 'chips', items: ['Pilihan', 'Pasang sekali', 'Guna dalam projek sedia ada'] },
        { t: 'outcome', text: 'awak boleh pasang skill Ubai, guna pada projek yang dah ada, dan gabungkan peraturannya ke dalam skill awak.' },
        {
          t: 'road', stops: [
            { icon: 'folder', title: 'Pasang skill Ubai', sub: 'Sekali sahaja', at: 0 },
            { icon: 'video', title: 'Guna dalam projek', sub: 'Semak dan naik taraf video', at: 1 },
            { icon: 'layers', title: 'Gabung ke skill awak', sub: 'Tambah, jangan buang', at: 2 },
          ],
        },
      ],
    },
    {
      id: 'm7-buka', kind: 'shot', tone: 'peach', kicker: 'Bonus · Sesi baru', title: 'Buka sesi baru',
      keynote: 'Claude, tab Code, ＋ New, kemudian kotak tulisan.',
      views: app('m5-ready', 'm5-win-ready', { caption: '**Sesi baru dalam folder projek** · dibina semula dari app sebenar', say: 'Buka app Claude, tab **Code**, klik **＋ New**. Kemudian klik kotak tulisan.', hints: ['Kotak besar di bawah skrin.', 'Ia bertulis **Describe a task or ask a question**.'], ok: '**Betul!** Kotak sedia.', vo: 'm7-buka', screen: 'bonus-mula', leadsTo: 'kotak-prompt' }),
    },
    {
      id: 'm7-pro-muat', pakej: 'pro', kunci: true, kind: 'explain', tone: 'butter', kicker: 'Bonus · Skill Pro', title: `Muat turun skill ${PRO_SKILL}`, vo: 'm5-pro-muat',
      keynote: 'Muat turun sekali, pasang sekali, guna dalam semua projek.',
      footnotes: ['Skill Pro ialah cara Ubai sendiri buat iklan video, ditulis semula untuk semua niche: Claude kenal niche awak dulu, baru tulis hook dan render dengan enjin yang menyemak peraturan.'],
      bridge: { from: 'kotak-prompt', to: 'pro-ditampal' },
      blocks: [
        { t: 'p', text: `Bonus Pro: **skill ${PRO_SKILL}** Ubai^1. Muat turun zip, kemudian Claude pasang.` },
        { t: 'download', href: PRO_ZIP, label: `Muat turun ${PRO_SKILL}.zip`, meta: 'zip · 25 KB · versi 30 Okt 2026', next: 'Fail masuk ke **Downloads**. Jangan buka zip itu; Claude yang pasang.' },
        { t: 'steps', items: ['Klik **Salin** pada prompt di bawah.', 'Tampal dalam kotak: **Command + V** (Mac) atau **Ctrl + V** (Windows).', 'Empat skrin seterusnya tunjuk setiap klik sampai skill siap.'] },
        { t: 'prompt', title: `Pasang skill ${PRO_SKILL}`, text: PRO_PASANG, fixed: true, note: 'Salin semua. Tiada tempat kosong untuk diisi.' },
      ],
    },
    {
      id: 'm7-pro-hantar', pakej: 'pro', kind: 'shot', tone: 'butter', kicker: 'Bonus · Skill Pro', title: 'Hantar prompt pasang',
      keynote: 'Anak panah oren = hantar.',
      views: app('m5-pro-prompt', 'm5-win-pro-prompt', { caption: '**Prompt pasang dalam kotak** · dibina semula dari app sebenar', say: 'Prompt pasang dah ada dalam kotak. Klik anak panah oren.', hints: ['Butang kecil oren di hujung kanan kotak.', 'Ada anak panah ke atas.'], ok: '**Betul!** Claude mula memasang skill Pro.', vo: 'm5-pro-hantar', screen: 'pro-ditampal', leadsTo: 'pro-izin' }),
    },
    {
      id: 'm7-pro-izin', pakej: 'pro', kind: 'shot', tone: 'mint', kicker: 'Bonus · Skill Pro', title: 'Benarkan buka zip',
      keynote: 'Claude buka zip ke folder skills. Allow once.',
      views: app('m5-pro-allow', 'm5-win-pro-allow', { caption: '**Claude minta izin membuka zip** · dibina semula', say: `Claude minta izin membuka zip **${PRO_SKILL}** ke folder skills. Klik **Allow once**.`, hints: ['Tiga butang di bawah kotak permintaan.', 'Yang paling kanan, **Allow once**.'], ok: '**Betul!** Skill Pro sedang dipasang.', vo: 'm5-pro-izin', screen: 'pro-izin', leadsTo: 'pro-siap' }),
    },
    {
      id: 'm7-pro-siap', pakej: 'pro', kind: 'shot', tone: 'mint', kicker: 'Bonus · Skill Pro', title: 'Skill Pro siap, buka sesi baru',
      keynote: 'Satu sesi, satu tugasan. Iklan dalam sesi baru.',
      views: app('m5-pro-done', 'm5-win-pro-done', { caption: '**Skill Pro dah dipasang** · dibina semula dari app sebenar', say: `Claude beritahu skill **${PRO_SKILL}** dah dipasang. Klik **＋ New** di atas kiri untuk buka sesi baru.`, hints: ['Senarai kiri, butang paling atas.', 'Ia bertulis **＋ New**.'], ok: '**Betul!** Sesi baru terbuka.', vo: 'm5-pro-siap', screen: 'pro-siap', leadsTo: 'sesi-baru' }),
    },
    {
      id: 'm7-pro-sesi-baru', pakej: 'pro', kind: 'shot', tone: 'butter', kicker: 'Bonus · Sesi baru', title: 'Sesi baru, folder sama',
      keynote: 'Folder projek masih dipilih. Klik kotak.',
      views: app('m5-pro-baru', 'm5-win-pro-baru', { caption: '**Sesi baru** · dibina semula dari app sebenar', say: `Sesi baru, folder projek masih sama, dan **Pasang skill ${PRO_SKILL}** ada dalam Recents. Klik kotak tulisan.`, hints: ['Kotak besar di bawah skrin.', 'Ia bertulis **Describe a task or ask a question**.'], ok: '**Betul!** Kotak sedia untuk prompt iklan.', vo: 'm5-pro-sesi-baru', screen: 'sesi-baru', leadsTo: 'sesi-kotak' }),
    },
    {
      id: 'm7-skill', pakej: 'basic', kind: 'explain', tone: 'butter', kicker: 'Bonus · Skill', title: `Pasang skill ${SKILL}`, vo: 'm5-skill',
      keynote: `Sekali sahaja. Lepas ini cukup tulis «Guna skill ${SKILL}».`,
      footnotes: ['Skill ialah fail arahan yang Claude simpan dalam komputer awak dan baca sendiri. Ini versi ringkas skill iklan video Ubai, tanpa alat, suara dan lagu Ubai, dan diuji pada Claude yang kosong.'],
      bridge: { from: 'kotak-prompt', to: 'skill-ditampal' },
      blocks: [
        { t: 'p', text: `Bonus: **skill ${SKILL}** Ubai^1. Pasang sekali sahaja; ia duduk bersama skill awak sendiri, dan boleh dipanggil dalam mana-mana projek.` },
        { t: 'steps', items: ['Klik **Salin**. Jangan ubah apa-apa.', 'Tampal dalam kotak: **Command + V** (Mac) atau **Ctrl + V** (Windows).', 'Empat skrin seterusnya tunjuk setiap klik sampai skill siap.'] },
        { t: 'prompt', title: `Pasang skill ${SKILL}`, text: SKILL_PROMPT, fixed: true, note: 'Salin semua. Tiada tempat kosong untuk diisi.' },
      ],
    },
    {
      id: 'm7-skill-hantar', pakej: 'basic', kind: 'shot', tone: 'butter', kicker: 'Bonus · Skill', title: 'Hantar prompt skill',
      keynote: 'Anak panah oren = hantar.',
      views: app('m5-skill-prompt', 'm5-win-skill-prompt', { caption: '**Prompt skill dalam kotak** · dibina semula dari app sebenar', say: 'Prompt skill dah ada dalam kotak. Klik anak panah oren.', hints: ['Butang kecil oren di hujung kanan kotak.', 'Ada anak panah ke atas.'], ok: '**Betul!** Claude mula memasang skill.', vo: 'm5-skill-hantar', screen: 'skill-ditampal', leadsTo: 'skill-izin' }),
    },
    {
      id: 'm7-skill-izin', pakej: 'basic', kind: 'shot', tone: 'mint', kicker: 'Bonus · Skill', title: 'Benarkan fail skill',
      keynote: 'Fail skill = SKILL.md dalam folder skills Claude.',
      views: app('m5-skill-allow', 'm5-win-skill-allow', { caption: '**Claude minta izin menulis fail skill** · dibina semula', say: `Claude minta izin menulis fail **SKILL.md** untuk skill **${SKILL}**. Klik **Allow once**.`, hints: ['Tiga butang di bawah kotak permintaan.', 'Yang paling kanan, **Allow once**.'], ok: '**Betul!** Skill sedang disimpan.', vo: 'm5-skill-izin', screen: 'skill-izin', leadsTo: 'skill-siap' }),
    },
    {
      id: 'm7-skill-siap', pakej: 'basic', kind: 'shot', tone: 'mint', kicker: 'Bonus · Skill', title: 'Skill siap, buka sesi baru',
      keynote: 'Satu sesi, satu tugasan. Iklan dalam sesi baru.',
      views: app('m5-skill-done', 'm5-win-skill-done', { caption: '**Skill dah dipasang** · dibina semula dari app sebenar', say: `Claude beritahu skill **${SKILL}** dah dipasang. Klik **＋ New** di atas kiri untuk buka sesi baru.`, hints: ['Senarai kiri, butang paling atas.', 'Ia bertulis **＋ New**.'], ok: '**Betul!** Sesi baru terbuka.', vo: 'm5-skill-siap', screen: 'skill-siap', leadsTo: 'sesi-baru' }),
    },
    {
      id: 'm7-sesi-baru', pakej: 'basic', kind: 'shot', tone: 'butter', kicker: 'Bonus · Sesi baru', title: 'Sesi baru, folder sama',
      keynote: 'Folder projek masih dipilih. Klik kotak.',
      views: app('m5-skill-baru', 'm5-win-skill-baru', { caption: '**Sesi baru** · dibina semula dari app sebenar', say: `Sesi baru, folder projek masih sama, dan **Pasang skill ${SKILL}** ada dalam Recents. Klik kotak tulisan.`, hints: ['Kotak besar di bawah skrin.', 'Ia bertulis **Describe a task or ask a question**.'], ok: '**Betul!** Kotak sedia untuk prompt iklan.', vo: 'm5-sesi-baru', screen: 'sesi-baru', leadsTo: 'sesi-kotak' }),
    },
    {
      id: 'm7-guna-projek', kind: 'explain', tone: 'mint', kicker: 'Bonus · Guna', title: 'Guna skill Ubai dalam projek sedia ada', vo: 'm7-guna-projek',
      keynote: 'Semak video lama ikut skill Ubai, buat semula yang lemah.',
      blocks: [
        { t: 'p', text: 'Ada projek yang dah siap? Buka **sesi baru dalam folder projek itu**, kemudian minta Claude semak video lama ikut skill Ubai.' },
        { t: 'note', tone: 'tip', title: 'Video lama selamat', text: 'Video baru masuk **folder baru**. Video lama tidak disentuh.' },
        { t: 'prompt', title: 'Naik taraf projek', text: NAIK, example: NAIK_CONTOH },
      ],
    },
    {
      id: 'm7-guna-gabung', kind: 'explain', tone: 'lav', kicker: 'Bonus · Gabung', title: 'Gabung skill Ubai ke dalam skill awak', vo: 'm7-guna-gabung',
      keynote: 'Tambah peraturan Ubai, kekalkan peraturan awak.',
      blocks: [
        { t: 'p', text: 'Mahu satu skill sahaja? Claude baca kedua-dua skill dan **tambah** peraturan Ubai yang belum ada ke dalam skill awak.' },
        { t: 'note', tone: 'awas', title: 'Semak dulu', text: 'Claude tunjuk apa yang ditambah dan tunggu awak setuju. Peraturan awak sendiri tidak dibuang.' },
        { t: 'prompt', title: 'Gabung skill', text: GABUNG, example: GABUNG_CONTOH },
      ],
    },
    {
      id: 'm7-otak', pakej: 'pro', kind: 'explain', tone: 'lav', kicker: 'Cara skill berfikir', title: 'Tujuh langkah sebelum video siap', vo: 'm7-otak',
      keynote: 'Profil dan Peta Niche diluluskan dulu. Barulah hook.',
      blocks: [
        { t: 'p', text: 'Skill Pro tidak terus render. Ia faham niche awak dulu, kemudian setiap video ikut peraturan yang sama.' },
        { t: 'note', tone: 'tip', title: 'Awak luluskan dua kali', text: '**Peta Niche** dan **senarai hook**. Selepas itu Claude jalan sendiri sampai 5 sample siap.' },
        {
          t: 'loop', centre: 'Pelajaran dalam profil.md', nodes: [
            { icon: 'doc', title: 'Profil Produk', sub: 'Dari bahan awak', at: 0 },
            { icon: 'target', title: 'Peta Niche', sub: 'Siapa beli, kenapa sekarang', at: 1 },
            { icon: 'browser', title: 'Riset pesaing', sub: 'Iklan paling lama aktif', at: 2 },
            { icon: 'layers', title: 'Pendekatan', sub: 'Jenis jualan sesuai', at: 3 },
            { icon: 'hook', title: '10 hook', sub: 'Setiap satu ada fakta', at: 4 },
            { icon: 'film', title: 'Render', sub: 'Lint dulu', at: 5 },
            { icon: 'yes', title: 'Semak', sub: 'Frame + bunyi', at: 6 },
          ],
        },
      ],
    },
    {
      id: 'm7-jenis', pakej: 'pro', kind: 'explain', tone: 'mint', kicker: 'Semua niche', title: 'Enam jenis jualan, titik mula sahaja', vo: 'm7-jenis',
      keynote: 'Niche lain? Claude campur atau reka cara sendiri.',
      blocks: [
        { t: 'p', text: 'Setiap jenis ada format, rakaman, bukti dan CTA yang paling menjadi. Claude pilih yang paling dekat dengan niche awak, dan terangkan kenapa.' },
        {
          t: 'tiles', cols: 3, items: [
            { icon: 'medal', title: 'Produk fizikal', sub: 'Demo dekat, tekstur', at: 0 },
            { icon: 'pin', title: 'Servis setempat', sub: 'Proses, pelanggan sebenar', at: 1 },
            { icon: 'laptop', title: 'Digital & kelas', sub: 'Hasil dulu, demo skrin', at: 2 },
            { icon: 'flag', title: 'Pakej & acara', sub: 'Harga termasuk apa', at: 3 },
            { icon: 'table', title: 'Nilai tinggi', sub: 'Kelayakan, ansuran', at: 4 },
            { icon: 'gear', title: 'B2B / sistem', sub: 'Masalah, demo, hasil', at: 5 },
          ],
        },
      ],
    },
    {
      id: 'm7-hasil', pakej: 'pro', kind: 'explain', tone: 'sky', kicker: 'Diuji', title: 'Enam niche, satu skill', vo: 'm7-hasil',
      keynote: 'Claude tak diajar niche ini. Ia fikir sendiri, dan semua lulus lint.',
      footnotes: ['Diuji 30 Okt 2026 pada Claude yang kosong. Kelas AI ialah bahan sebenar Ubai; lima lagi niche contoh rekaan untuk ujian.'],
      blocks: [
        { t: 'p', text: 'Diuji dengan **6 niche**^1: Claude pilih jenis jualan sendiri, hook dari fakta bahan, semua **lulus lint**.' },
        {
          t: 'table', head: ['Niche', 'Claude pilih · contoh hook'],
          rows: [
            ['Kelas AI', 'Digital & kelas · «SEHARI JE, 9 MODUL AI»'],
            ['Kedai kek', 'Fizikal + servis · «KEK TULIS NAMA, SIAP 24 JAM»'],
            ['Bengkel kereta', 'Servis setempat · «RM89 JE, SERVIS PENUH»'],
            ['Aircond ansuran', 'Nilai tinggi · «PASANG PERCUMA DALAM 3 HARI»'],
            ['Pakej Langkawi', 'Pakej · «RM599 SEORANG, DAH TERMASUK APA?»'],
            ['POS kedai runcit', 'B2B · «PEMILIK KEDAI, STOK LARI LAGI?»'],
          ],
        },
      ],
    },
    {
      id: 'm7-prompt', pakej: 'pro', kind: 'explain', tone: 'butter', kicker: 'Prompt Pro', title: 'Iklan pertama dengan skill Pro', vo: 'm7-prompt',
      keynote: 'Semak Profil dan Peta Niche betul-betul. Itu asas semua hook.',
      blocks: [
        { t: 'p', text: 'Buka **sesi baru** dalam folder projek, kemudian tampal prompt ini. Claude tunjuk **Profil Produk** dan **Peta Niche** dulu; betulkan yang salah, kemudian luluskan.' },
        { t: 'note', tone: 'tip', title: 'Contoh diisi', text: 'Tab itu tunjuk prompt untuk kelas AI Ubai di Muar.' },
        { t: 'prompt', title: 'Prompt Pro', text: PROMPT, example: CONTOH },
      ],
    },
    {
      id: 'm7-cw', pakej: 'pro', kind: 'explain', tone: 'pink', kicker: 'Caption iklan', title: 'Skill Pro tulis CW sekali', vo: 'm7-cw',
      keynote: 'Masalah, ciri bertanda ✅, kemudian CTA.',
      blocks: [
        { t: 'p', text: 'Caption mengikut format Ubai: **satu ayat masalah**, kemudian **ciri** dari bahan awak, dan **CTA** di hujung. Tiada fakta rekaan, tiada nombor telefon.' },
        { t: 'prompt', title: 'Prompt CW', text: CW, example: CW_CONTOH },
      ],
    },
    {
      id: 'm7-rumusan', pakej: 'pro', kind: 'quiz', tone: 'pink', kicker: 'Rumusan', title: 'Awak dah sedia guna Pro', vo: 'm7-rumusan',
      keynote: 'Kenal niche, hook bahasa pembeli, lint sebelum render.',
      blocks: [{ t: 'p', text: 'Tiga soalan untuk semak faham sebelum iklan Pro pertama awak.' }],
      questions: [
        { q: 'Apa Claude tunjuk sebelum hook?', options: ['Video siap', 'Profil + Peta Niche'], icons: ['video', 'target'], answer: 1, hint: 'Hampir. Skill Pro kenal niche dulu.' },
        { q: 'Niche awak lain dari 6 jenis jualan?', options: ['Skill tak boleh guna', 'Claude reka cara sendiri'], icons: ['no', 'bulb'], answer: 1, hint: 'Hampir. Enam jenis itu titik mula sahaja.' },
        { q: 'Lint gagal. Apa patut berlaku?', options: ['Betulkan dulu', 'Render juga'], icons: ['yes', 'warn'], answer: 0, hint: 'Hampir. Lint gagal = ada peraturan dilanggar.' },
      ],
    },
  ],
}
