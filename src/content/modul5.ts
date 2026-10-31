import { fromShot } from './shots'
import type { Chapter, ShotView } from './types'

/** A Claude Desktop screen on each computer: the Mac one as rebuilt, the Windows one inside a Windows 11 window. */
const app = (mac: string, win: string, v: Omit<ShotView, 'img' | 'target' | 'focus' | 'frame'>): { mac: ShotView; win: ShotView } => ({
  mac: { ...fromShot(`contoh/${mac}`), frame: 'screen', ...v },
  win: { ...fromShot(`win/${win}`), frame: 'screen', ...v },
})

// Ubai, 30 Okt 2026: the book starts from scratch with no skill, so this prompt carries everything a Claude with no
// skill needs (format, hook, captions, size, rules, how to render). The reader turns it into a skill of their own at the
// end of this module, once the ads are right; Ubai's skill is a bonus in Modul 7.
const PROMPT = [
  'Saya nak buat video iklan untuk [nama produk]. Bahan ada dalam folder RAW dan Footage dalam folder projek ini.',
  'Buat POV (rakaman tanpa suara, tulisan dalam kotak putih, lagu) dan VO (suara ElevenLabs, caption ikut perkataan, latar grid).',
  'Saiz 1080×1920, 25–30 saat. Hook 2–3 baris pada saat pertama. Babak 2–3 saat. Hujung: «Klik butang di bawah».',
  'API key ElevenLabs: [tampal key]. Simpan dalam .env projek ini sahaja.',
  'Fakta: [harga, apa yang termasuk, tarikh]. Jangan reka fakta lain.',
  'Jangan letak [nombor telefon / dakwaan yang tak benar]. Tulisan tak boleh tutup muka.',
  'Render dengan ffmpeg, tulisan guna fail .ass. Jika ffmpeg tiada, muat turun versi static ke folder alat/.',
  'Tunjuk senarai hook dulu. Lepas saya setuju, buat 5 sample: 3 POV dan 2 VO.',
].join('\n')

const JADIKAN = [
  'Iklan dalam sesi ini dah ngam. Jadikan skill peribadi bernama [nama-skill] supaya saya boleh guna dalam semua projek.',
  'Simpan semua yang kita guna: format POV dan VO, gaya, saiz, hook, larangan, cara render, cara semak, dan teguran yang saya beri.',
  'Simpan sebagai [nama-skill]/SKILL.md dalam folder skills Claude saya. Lepas siap, tunjuk ayat untuk guna skill ini.',
].join('\n')

const JADIKAN_CONTOH = JADIKAN.replaceAll('[nama-skill]', '==iklan-kedai-saya==')

const GUNA = [
  'Guna skill [nama-skill].',
  'Saya nak buat video iklan untuk [produk baru]. Bahan ada dalam folder RAW dan Footage dalam folder projek ini.',
  'Fakta yang boleh guna: [fakta produk baru]. Buat 5 sample dulu.',
].join('\n')

const GUNA_CONTOH = GUNA
  .replace('[nama-skill]', '==iklan-kedai-saya==')
  .replace('[produk baru]', '==Umrah Musim Biasa 2027==')
  .replace('[fakta produk baru]', '==deposit RM250, harga bermula RM4,990==')

const CONTOH = PROMPT
  .replace('[nama produk]', '==Umrah Musim Sejuk ikhlas.com==')
  .replace('[tampal key]', '==key yang awak salin tadi==')
  .replace('[harga, apa yang termasuk, tarikh]', '==bermula RM5,990, ziarah Taif, umrah 3 kali, terbang terus AirAsia==')
  .replace('[nombor telefon / dakwaan yang tak benar]', '==nombor WhatsApp, dan harga yang tiada pada poster==')

export const modul5: Chapter = {
  id: 'm5',
  module: 5,
  title: 'Arah Claude',
  strict: true,
  pages: [
    {
      id: 'm5-pembuka', kind: 'explain', cover: true, tone: 'lav', kicker: 'Modul 5', title: 'Arah Claude', vo: 'm5-pembuka',
      keynote: 'Satu prompt, dua jenis video, lima sample dulu.',
      blocks: [
        { t: 'lead', text: 'Folder projek dah ada bahan. Sekarang awak suruh Claude buat iklan **POV** dan **VO** sekaligus, dari satu prompt.' },
        { t: 'chips', items: ['App Claude, tab Code', 'Akaun ElevenLabs', 'Folder projek'] },
        { t: 'outcome', text: 'awak ada 5 sample iklan dalam folder out, tahu cara minta ubah, dan cara minta 20 video penuh.' },
        {
          t: 'road', stops: [
            { icon: 'mic', title: 'Key ElevenLabs', sub: 'Untuk suara VO', at: 0 },
            { icon: 'code', title: 'Buka Code', sub: 'Pilih folder projek', at: 1 },
            { icon: 'chat', title: 'Tampal prompt', sub: 'POV + VO sekaligus', at: 2 },
            { icon: 'yes', title: 'Benarkan', sub: 'Allow once', at: 3 },
            { icon: 'video', title: '5 sample', sub: 'Tonton, minta ubah', at: 4 },
            { icon: 'flag', title: '20 video', sub: 'Bila dah ngam', at: 5 },
            { icon: 'medal', title: 'Jadikan skill', sub: 'Skill awak sendiri', at: 6 },
          ],
        },
      ],
    },
    {
      id: 'm5-hasil', kind: 'explain', tone: 'sky', kicker: 'Hasil yang kita buat', title: 'POV dan VO dari satu folder', vo: 'm5-hasil',
      keynote: 'Satu folder bahan, dua jenis iklan.',
      footnotes: ['Kedua-dua frame dari kumpulan 30 iklan produk digital Ubai (10 POV + 20 VO) yang Ubai luluskan pada 16 Okt 2026.'],
      blocks: [
        { t: 'p', text: 'Ini hasil sebenar dari satu prompt^1. **POV** tanpa suara, dengan kotak tulisan dan lagu. **VO** bersuara, dengan caption yang muncul ikut perkataan.' },
        { t: 'note', tone: 'tip', title: 'Kenapa dua jenis', text: 'Facebook menguji kedua-duanya. Ada orang berhenti untuk cerita (POV), ada yang berhenti untuk penerangan (VO).' },
        {
          t: 'pair', items: [
            { src: '/media/digital_pov_H03.jpg', alt: 'Iklan digital POV H03: POV: sehari je, 26 jualan masuk', tag: 'POV', caption: '**POV H03**: kotak tulisan + lagu' },
            { src: '/media/digital_vo_H14.jpg', alt: 'Iklan digital VO H14: DARI IDEA KOSONG KE 819 ORDER', tag: 'VO', caption: '**VO H14**: suara + caption' },
          ],
        },
      ],
    },
    {
      id: 'm5-eleven', kind: 'explain', tone: 'pink', kicker: 'Sebelum mula', title: 'Ambil API key ElevenLabs', vo: 'm5-eleven',
      keynote: 'Key = kata laluan suara. Simpan dalam .env sahaja.',
      footnotes: ['Nama menu di laman ElevenLabs boleh berubah. Cari perkataan **API Keys**.'],
      blocks: [
        { t: 'p', text: 'Suara VO dijana oleh **ElevenLabs**. Claude perlukan satu **API key**, iaitu kata laluan khas yang membenarkan Claude guna akaun suara awak.' },
        { t: 'steps', items: ['Buka **elevenlabs.io**, daftar atau log masuk dengan **Google**.', 'Buka **API Keys**^1, klik **Create API Key**.', 'Beri nama, contohnya **iklan**, kemudian **Create**.', 'Klik **Copy**. Key itu akan ditampal dalam prompt nanti.'] },
        { t: 'note', tone: 'privasi', title: 'Rahsia', text: 'Jangan kongsi key ini di WhatsApp atau Facebook. Dalam prompt, Claude simpan key ke fail **.env** projek awak sahaja.' },
        { t: 'flow', title: 'Empat langkah', steps: [{ icon: 'browser', title: 'elevenlabs.io', at: 0 }, { icon: 'lock', title: 'API Keys', at: 1 }, { icon: 'click', title: 'Create', at: 2 }, { icon: 'type', title: 'Copy', at: 3 }] },
      ],
    },
    {
      id: 'm5-buka', kind: 'explain', tone: 'lav', kicker: 'Langkah 1 · Buka Code', title: 'Buka app Claude', vo: 'm5-buka',
      keynote: 'Carian, taip Claude, Enter.',
      bridge: { from: 'mula-m5', to: 'claude-chat' },
      blocks: [
        { t: 'steps', items: ['Mac: tekan **Command + Space**. Windows: tekan butang **Windows**.', 'Taip **Claude**.', 'Tekan **Enter**. App Claude terbuka.'] },
        { t: 'flow', title: 'Tiga tekan', steps: [{ icon: 'type', title: 'Buka carian', at: 0 }, { icon: 'chat', title: 'Taip Claude', at: 1 }, { icon: 'click', title: 'Tekan Enter', at: 2 }] },
      ],
    },
    {
      id: 'm5-code', kind: 'shot', tone: 'lav', kicker: 'Langkah 1 · Buka Code', title: 'Tukar ke Code',
      keynote: 'Ikon </> di atas = Code.',
      views: app('m5-chat', 'm5-win-chat', { caption: '**App Claude, mod Chat** · dibina semula dari app sebenar', say: 'Klik ikon **</>** di sebelah atas untuk tukar ke **Code**.', hints: ['Dua ikon kecil di atas senarai kiri.', 'Yang kanan, berbentuk **</>**.'], ok: '**Betul!** Mod Code terbuka.', vo: 'm5-code', screen: 'claude-chat', leadsTo: 'claude-code' }),
    },
    {
      id: 'm5-folder', kind: 'shot', tone: 'lav', kicker: 'Langkah 2 · Folder', title: 'Pilih folder',
      keynote: 'Select folder di bawah kotak.',
      views: app('m5-code', 'm5-win-code', { caption: '**Mod Code** · dibina semula dari app sebenar', say: 'Klik **Select folder** di bawah kotak tulisan.', hints: ['Di bawah kotak besar, ada ikon folder kecil.', 'Ia bertulis **Select folder**.'], ok: '**Betul!** Menu folder terbuka.', vo: 'm5-folder', screen: 'claude-code', leadsTo: 'folder-menu' }),
    },
    {
      id: 'm5-folder-menu', kind: 'shot', tone: 'lav', kicker: 'Langkah 2 · Folder', title: 'Choose a folder',
      keynote: 'Kali pertama, tiada folder terkini.',
      views: app('m5-folders', 'm5-win-folders', { caption: '**Menu folder** · dibina semula dari app sebenar', say: 'Klik **Choose a folder**.', hints: ['Pilihan paling bawah dalam menu kecil.', 'Ada ikon folder di sebelah kirinya.'], ok: '**Betul!** Kotak pilih folder terbuka.', vo: 'm5-folder-menu', screen: 'folder-menu', leadsTo: 'folder-dialog' }),
    },
    {
      id: 'm5-folder-pilih', kind: 'shot', tone: 'lav', kicker: 'Langkah 2 · Folder', title: 'Pilih folder projek',
      keynote: 'Documents, folder projek, Open.',
      views: {
        mac: { ...fromShot('contoh/m5-mac-folder'), frame: 'screen', caption: '**Choose a folder for the project** · dibina semula', say: 'Dalam **Documents**, pilih folder projek awak, kemudian klik **Open**.', hints: ['Butang biru di bawah kanan.', 'Pastikan folder projek berwarna biru dahulu.'], ok: '**Betul!** Claude kini bekerja dalam folder projek awak.', vo: 'm5-folder-pilih-mac', screen: 'folder-dialog', leadsTo: 'folder-sedia' },
        win: { ...fromShot('win/m5-win-folder'), frame: 'screen', caption: '**Choose a folder for the project** · paparan contoh Windows', say: 'Dalam **Documents**, pilih folder projek awak, kemudian klik **Select Folder**.', hints: ['Butang biru di bawah.', 'Pastikan folder projek dipilih dahulu.'], ok: '**Betul!** Claude kini bekerja dalam folder projek awak.', vo: 'm5-folder-pilih-win', screen: 'folder-dialog', leadsTo: 'folder-sedia' },
      },
    },
    {
      id: 'm5-kotak', kind: 'shot', tone: 'butter', kicker: 'Langkah 3 · Prompt', title: 'Klik kotak tulisan',
      keynote: 'Nama folder projek ada di bawah kotak.',
      views: app('m5-ready', 'm5-win-ready', { caption: '**Folder projek dipilih** · dibina semula dari app sebenar', say: 'Nama folder projek kini di bawah kotak. Klik kotak **Describe a task or ask a question**.', hints: ['Kotak besar di bawah skrin.', 'Ia bertulis **Describe a task or ask a question**.'], ok: '**Betul!** Kotak sedia untuk prompt.', vo: 'm5-kotak', screen: 'folder-sedia', leadsTo: 'kotak-prompt' }),
    },
    {
      id: 'm5-prompt', kind: 'explain', tone: 'butter', kicker: 'Langkah 3 · Prompt', title: 'Tampal prompt POV + VO', vo: 'm5-prompt',
      keynote: 'Salin, tukar tempat kosong, tampal.',
      bridge: { from: 'kotak-prompt', to: 'prompt-ditampal' },
      blocks: [
        { t: 'p', text: 'Satu prompt penuh, dari kosong. Klik **Salin**, tukar **[tempat kosong]**, tampal: **Command + V** (Mac) atau **Ctrl + V** (Windows).' },
        { t: 'note', tone: 'tip', title: 'Contoh diisi', text: 'Prompt sebenar iklan umrah ikhlas.com. Bila dah ngam, ia jadi **skill awak** di hujung modul.' },
        { t: 'prompt', title: 'Prompt POV + VO', text: PROMPT, example: CONTOH },
      ],
    },
    {
      id: 'm5-hantar', kind: 'shot', tone: 'butter', kicker: 'Langkah 3 · Prompt', title: 'Hantar prompt',
      keynote: 'Anak panah oren = hantar.',
      views: app('m5-prompt', 'm5-win-prompt', { caption: '**Prompt dalam kotak** · dibina semula dari app sebenar', say: 'Prompt dah ada dalam kotak. Klik anak panah oren untuk hantar.', hints: ['Butang kecil oren di hujung kanan kotak.', 'Ada anak panah ke atas.'], ok: '**Betul!** Claude mula bekerja.', vo: 'm5-hantar', screen: 'prompt-ditampal', leadsTo: 'claude-tanya' }),
    },
    {
      id: 'm5-izin', kind: 'shot', tone: 'mint', kicker: 'Langkah 4 · Benarkan', title: 'Allow once',
      keynote: 'Claude minta izin sebelum buat sesuatu.',
      views: app('m5-allow', 'm5-win-allow', { caption: '**Claude minta izin** · dibina semula, label dari app sebenar', say: 'Claude minta izin untuk menyemak folder. Klik **Allow once**.', hints: ['Tiga butang di bawah kotak permintaan.', 'Yang paling kanan, **Allow once**.'], ok: '**Betul!** Claude teruskan kerja.', vo: 'm5-izin', screen: 'claude-tanya', leadsTo: 'claude-kerja' }),
    },
    {
      id: 'm5-kerja', kind: 'explain', tone: 'mint', kicker: 'Langkah 4 · Tunggu', title: 'Biarkan Claude bekerja', vo: 'm5-kerja',
      keynote: 'Jangan tutup app. Izin lagi? Allow once.',
      blocks: [
        { t: 'p', text: 'Claude kini membaca bahan, menulis skrip, menjana suara dan render video. Ini ambil masa, kadang-kadang 20 hingga 40 minit untuk 5 sample.' },
        { t: 'steps', items: ['Biarkan app Claude terbuka. Komputer jangan tidur.', 'Claude minta izin lagi? Baca, kemudian klik **Allow once**.', 'Claude tanya soalan? Jawab dengan ayat biasa dalam kotak yang sama.'] },
        { t: 'img', src: fromShot('contoh/m5-working').img, alt: 'Claude sedang bekerja: baca bahan, tulis skrip, jana suara, render', caption: 'Claude sedang bekerja · paparan contoh' },
      ],
    },
    {
      id: 'm5-sample', kind: 'explain', tone: 'sky', kicker: 'Langkah 5 · Tonton', title: 'Tonton 5 sample', vo: 'm5-sample',
      keynote: 'Tonton semua, catat nombor video dan saat.',
      footnotes: ['Gambar folder dari kumpulan iklan umrah sebenar Ubai, lima sample pertama.'],
      blocks: [
        { t: 'p', text: 'Bila siap, Claude beritahu sample ada dalam folder **out**^1. Buka folder itu dan tonton setiap video sampai habis.' },
        { t: 'steps', items: ['**Hook**: saat pertama buat awak berhenti?', '**Fakta**: harga dan pakej betul ikut poster?', '**Caption**: sempat dibaca?', '**Hujung**: ada «Klik butang di bawah»?'] },
        { t: 'img', src: fromShot('desk/m5-out-5').img, alt: 'Folder out dengan 5 sample: 3 POV dan 2 VO', caption: 'Folder **out** dengan 5 sample · screenshot sebenar' },
      ],
    },
    {
      id: 'm5-ubah', kind: 'explain', tone: 'mint', kicker: 'Langkah 5 · Ubah', title: 'Minta ubah satu-satu', vo: 'm5-ubah',
      keynote: 'Nombor video + saat + apa yang salah.',
      blocks: [
        { t: 'p', text: 'Taip dalam kotak yang sama. Sebut **nombor video**, **saat**, dan apa yang tak kena. Claude ubah bahagian itu sahaja.' },
        { t: 'prompt', title: 'Caption laju sangat', text: 'Caption video [nombor] laju sangat. Perlahankan, 2–3 perkataan sebaris. Yang lain kekalkan.' },
        { t: 'prompt', title: 'Fakta tak betul', text: 'Pada saat [masa] dalam video [nombor], harga salah. Guna harga dari poster sahaja: [harga betul].' },
      ],
    },
    {
      id: 'm5-sepuluh', kind: 'explain', tone: 'lav', kicker: 'Langkah 6 · 20 video', title: 'Dah ngam? Minta 20 video', vo: 'm5-sepuluh',
      keynote: 'Sample yang ngam jadi templat.',
      blocks: [
        { t: 'p', text: 'Bila sample dah ngam, minta Claude buat kumpulan penuh ikut gaya yang sama. Ini cara Ubai dapat 20 iklan umrah dalam satu kumpulan.' },
        { t: 'note', tone: 'tip', title: 'Satu angle, banyak hook', text: 'Setiap video dengan hook berlainan supaya Facebook boleh cari yang paling ramai tonton.' },
        { t: 'prompt', title: 'Buat kumpulan penuh', text: 'Sample [nombor] dah ngam. Buat [10] POV dan [10] VO lagi ikut gaya yang sama, setiap satu hook berlainan. Simpan dalam folder out bertarikh hari ini.' },
      ],
    },
    {
      id: 'm5-siap', kind: 'explain', tone: 'mint', kicker: 'Langkah 6 · Siap', title: '20 iklan dalam satu folder', vo: 'm5-siap',
      keynote: 'Satu prompt yang ngam = satu kumpulan penuh.',
      blocks: [
        { t: 'p', text: 'Inilah hasil sebenar: **10 POV** dan **10 VO** untuk umrah ikhlas.com, dalam satu folder **out**. Dalam Modul 6, awak semak, namakan dan lancarkan iklan ini.' },
        { t: 'img', src: fromShot('desk/m5-out-20').img, alt: 'Folder out dengan 20 iklan umrah: 10 POV dan 10 VO', caption: '**20 iklan umrah sebenar** · 10 POV + 10 VO, 28 Okt 2026' },
      ],
    },
    {
      id: 'm5-jadikan-kotak', kind: 'shot', tone: 'butter', kicker: 'Langkah 7 · Jadikan skill', title: 'Dah ngam? Klik kotak',
      keynote: 'Dalam sesi yang sama: Claude masih ingat semua teguran awak.',
      views: app('m5-sendiri-kotak', 'm5-win-sendiri-kotak', { caption: '**20 iklan siap** · dibina semula dari app sebenar', say: 'Iklan dah ngam. Dalam sesi yang sama, klik kotak tulisan.', hints: ['Kotak besar di bawah skrin.', 'Ia bertulis **Describe a task or ask a question**.'], ok: '**Betul!** Kotak sedia.', vo: 'm5-jadikan-kotak', screen: 'claude-kerja', leadsTo: 'kotak-jadikan' }),
    },
    {
      id: 'm5-jadikan', kind: 'explain', tone: 'butter', kicker: 'Langkah 7 · Jadikan skill', title: 'Jadikan skill awak sendiri', vo: 'm5-jadikan',
      keynote: 'Ngam dulu, kemudian simpan. Itu cara Ubai.',
      footnotes: ['Beri nama pendek dengan sempang, huruf kecil, contohnya iklan-kedai-saya.'],
      bridge: { from: 'kotak-jadikan', to: 'jadikan-ditampal' },
      blocks: [
        { t: 'p', text: 'Semua yang awak ajar Claude dalam sesi ini (gaya, larangan, teguran) disimpan jadi **skill sendiri**. Lain kali, satu baris pun cukup.' },
        { t: 'steps', items: ['Klik **Salin**, tukar **[nama-skill]**^1.', 'Tampal dalam kotak, kemudian ikut tiga skrin seterusnya.'] },
        { t: 'prompt', title: 'Jadikan skill', text: JADIKAN, example: JADIKAN_CONTOH },
      ],
    },
    {
      id: 'm5-jadikan-hantar', kind: 'shot', tone: 'butter', kicker: 'Langkah 7 · Jadikan skill', title: 'Hantar prompt skill',
      keynote: 'Anak panah oren = hantar.',
      views: app('m5-sendiri-prompt', 'm5-win-sendiri-prompt', { caption: '**Prompt jadikan skill dalam kotak** · dibina semula', say: 'Prompt dah ada dalam kotak. Klik anak panah oren.', hints: ['Butang kecil oren di hujung kanan kotak.', 'Ada anak panah ke atas.'], ok: '**Betul!** Claude mula menulis skill awak.', vo: 'm5-jadikan-hantar', screen: 'jadikan-ditampal', leadsTo: 'jadikan-izin' }),
    },
    {
      id: 'm5-jadikan-izin', kind: 'shot', tone: 'mint', kicker: 'Langkah 7 · Jadikan skill', title: 'Benarkan fail skill',
      keynote: 'Fail skill = SKILL.md dalam folder skills Claude.',
      views: app('m5-sendiri-allow', 'm5-win-sendiri-allow', { caption: '**Claude minta izin menulis skill awak** · dibina semula', say: 'Claude minta izin menulis fail **SKILL.md** skill awak. Klik **Allow once**.', hints: ['Tiga butang di bawah kotak permintaan.', 'Yang paling kanan, **Allow once**.'], ok: '**Betul!** Skill awak sedang disimpan.', vo: 'm5-jadikan-izin', screen: 'jadikan-izin', leadsTo: 'jadikan-siap' }),
    },
    {
      id: 'm5-jadikan-siap', kind: 'shot', tone: 'mint', kicker: 'Langkah 7 · Jadikan skill', title: 'Skill awak dah siap',
      keynote: 'Projek baru? Klik ＋ New.',
      views: app('m5-sendiri-done', 'm5-win-sendiri-done', { caption: '**Skill awak dah disimpan** · dibina semula', say: 'Skill awak dah disimpan, dengan ayat untuk guna. Untuk projek seterusnya, klik **＋ New**.', hints: ['Senarai kiri, butang paling atas.', 'Ia bertulis **＋ New**.'], ok: '**Betul!** Sesi baru untuk projek seterusnya.', vo: 'm5-jadikan-siap', screen: 'jadikan-siap', leadsTo: 'sesi-baru' }),
    },
    {
      id: 'm5-projek-baru', kind: 'explain', tone: 'lav', kicker: 'Langkah 7 · Projek seterusnya', title: 'Lain kali, satu baris pun cukup', vo: 'm5-projek-baru',
      keynote: 'Guna skill awak, tambah teguran baru ke dalamnya.',
      blocks: [
        { t: 'p', text: 'Projek baru, folder baru, sesi baru. Mula dengan **skill awak sendiri**, kemudian sebut apa yang baru sahaja.' },
        { t: 'note', tone: 'tip', title: 'Skill makin bijak', text: 'Ada teguran baru yang menjadi? Guna prompt **«Simpan cara yang menjadi ke dalam skill»** dalam bank Modul 2.' },
        { t: 'prompt', title: 'Projek seterusnya', text: GUNA, example: GUNA_CONTOH },
      ],
    },
    {
      id: 'm5-rumusan', kind: 'quiz', tone: 'pink', kicker: 'Rumusan', title: 'Awak dah arah Claude', vo: 'm5-rumusan',
      keynote: 'Folder, prompt, izin, sample, ubah, 20 video.',
      blocks: [
        { t: 'p', text: 'Tiga perkara yang paling penting dalam modul ini:' },
        { t: 'flow', title: 'Dari prompt ke 20 video', steps: [{ icon: 'code', title: 'Code + folder', sub: 'Select folder dulu', at: 0 }, { icon: 'chat', title: 'Satu prompt', sub: 'POV + VO, 5 sample', at: 1 }, { icon: 'video', title: 'Ubah, kemudian 20', sub: 'Nombor video + saat', at: 2 }] },
      ],
      questions: [
        { q: 'Sebelum tampal prompt, apa yang mesti dipilih?', options: ['Folder projek', 'Model AI'], icons: ['folder', 'gear'], answer: 0, hint: 'Hampir. Claude perlu tahu di mana bahan awak.' },
        { q: 'Bila jadikan skill sendiri?', options: ['Sebelum sample pertama', 'Bila iklan dah ngam'], icons: ['flag', 'yes'], answer: 1, hint: 'Hampir. Ngam dulu, kemudian simpan.' },
        { q: 'API key ElevenLabs disimpan di mana?', options: ['Fail .env projek', 'Group WhatsApp'], icons: ['lock', 'chat'], answer: 0, hint: 'Hampir. Key ialah rahsia; jangan kongsi.' },
      ],
    },
  ],
}
