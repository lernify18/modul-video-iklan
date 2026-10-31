import { fromShot } from './shots'
import type { Chapter, ShotView } from './types'

const pricing: ShotView = {
  img: '/shots/pricing.png',
  frame: 'browser',
  url: 'claude.com/pricing',
  caption: '**Laman harga Claude** · claude.com/pricing, diambil 29 Okt 2026',
  say: 'Klik butang **Try Claude** di bawah kad **Pro**.',
  target: [37.64, 86.11, 24.65, 4.44],
  focus: [35.4, 70, 29.2, 26],
  hints: ['Cari kad di tengah yang bertulis **Pro** dan harga **$17**.', 'Butang hitam yang paling bawah dalam kad Pro.'],
  ok: '**Betul!** Laman log masuk Claude akan terbuka.',
  labels: [{ at: [40.8, 76.6], text: 'Harga Pro' }, { at: [8, 86.1], text: 'Kad Free: bukan ini' }],
  vo: 'n3',
  screen: 'pricing', leadsTo: 'login',
}

/** The same rebuilt web screen for both computers: a dummy e-mail, never a real account (Ubai, 29 Okt 2026). */
const both = (v: ShotView): { mac: ShotView; win: ShotView } => ({ mac: v, win: v })

export const modul3: Chapter = {
  id: 'm3',
  module: 3,
  title: 'Sediakan Komputer',
  strict: true,
  pages: [
    {
      id: 'm3-pembuka', kind: 'explain', cover: true, tone: 'lav', kicker: 'Modul 3', title: 'Sediakan Komputer', vo: 'n1',
      keynote: 'Satu langkah satu masa. Tak perlu faham semua hari ini.',
      blocks: [
        { t: 'lead', text: 'Empat langkah. Dua puluh minit. Lepas ini, komputer awak sedia untuk buat video.' },
        { t: 'chips', items: ['Komputer Mac atau Windows', 'Kad bank', 'Internet'] },
        { t: 'outcome', text: 'komputer awak ada app Claude dengan pelan Pro, sedia untuk membuka folder projek dan membuat video.' },
        {
          t: 'road', stops: [
            { icon: 'medal', title: 'Langgan Claude Pro', sub: 'Pelan bulanan', at: 0 },
            { icon: 'laptop', title: 'Download Claude', sub: 'Untuk Mac atau Windows', at: 1 },
            { icon: 'code', title: 'Pasang dan log masuk', sub: 'Dalam app Claude', at: 2 },
            { icon: 'folder', title: 'Buat folder projek', sub: 'Bertarikh dan bernama', at: 3 },
          ],
        },
      ],
    },
    {
      id: 'm3-kenapa-pro', kind: 'explain', tone: 'pink', kicker: 'Faham dulu', title: 'Kenapa Pro, bukan Free?', vo: 'n2',
      keynote: 'Pro = Claude Code. Claude Code = video siap.',
      footnotes: ['Senarai ciri dari claude.com/pricing, disemak 29 Okt 2026.', '$17 sebulan jika bayar setahun ($200 sekali gus). Harga belum termasuk cukai.'],
      blocks: [
        { t: 'p', text: 'Claude ada pelan percuma. Tapi pelan percuma **tiada Claude Code**^1. Claude Code ialah bahagian yang bekerja terus dalam komputer awak. Ia buka folder, baca footage, dan hasilkan video. Tanpanya, Claude cuma boleh berbual.' },
        {
          t: 'vs',
          left: { title: 'Free', tag: '$0', rows: [{ ok: true, text: 'Boleh berbual' }, { ok: false, text: 'Tiada Claude Code' }, { ok: false, text: 'Tak boleh buat video' }] },
          right: { title: 'Pro', tag: 'pilih ini', pick: true, rows: [{ ok: true, text: 'Boleh berbual' }, { ok: true, text: 'Ada Claude Code' }, { ok: true, text: 'Boleh buat video' }] },
        },
        { t: 'price', big: 'USD20', text: '**sebulan, bayar bulanan**^2 Bank tukar ke Ringgit ikut kadar hari itu, anggaran RM90.' },
      ],
    },
    {
      id: 'm3-l1-terang', kind: 'explain', tone: 'sky', kicker: 'Langkah 1 daripada 4', title: 'Pilih pelan Pro', vo: 'm3-l1-terang',
      keynote: 'Kad tengah, butang hitam: Try Claude.',
      footnotes: ['Rupa laman mungkin berubah sedikit bila Anthropic kemas kini. Cari perkataan **Pro** dan **Try Claude**.'],
      blocks: [
        { t: 'p', text: 'Laman harga Claude ada tiga kad: **Free**, **Pro** dan **Max**. Kita pilih kad yang di ==tengah==. Muka seterusnya ada gambar sebenar untuk awak cuba dulu.' },
        { t: 'steps', items: ['Buka **Chrome, Safari atau Edge**, iaitu app untuk buka laman web.', 'Taip **claude.com/pricing** di bar alamat, tekan Enter.', 'Pastikan tab **Individual** berwarna putih^1.', 'Dalam kad **Pro**, klik butang hitam **Try Claude**.'] },
        {
          t: 'flow', title: 'Peta langkah · nombor sama dengan langkah di kiri', steps: [
            { icon: 'browser', title: '1 · Buka pelayar', at: 0 },
            { icon: 'type', title: '2 · Taip claude.com/pricing', at: 1 },
            { icon: 'tab', title: '3 · Tab Individual', at: 2 },
            { icon: 'click', title: '4 · Klik Try Claude', at: 3 },
          ],
        },
        { t: 'note', tone: 'tip', title: 'Tip', text: 'Jangan pilih **Max**. Max untuk orang yang guna Claude sepanjang hari, bermula $100 sebulan.' },
        { t: 'gloss', items: [{ term: 'Bar alamat', def: 'kotak panjang paling atas dalam Chrome, tempat taip alamat laman.' }, { term: 'Tab', def: 'butang pilihan yang berderet. Yang dipilih berwarna putih.' }] },
      ],
    },
    {
      id: 'm3-l1-cuba', kind: 'shot', tone: 'butter', kicker: 'Cuba sendiri', keynote: 'Dalam Latihan, klik sendiri. Silap pun tak apa.',
      views: { mac: pricing, win: { ...pricing, caption: '**Laman harga Claude** · sama di Windows, diambil 29 Okt 2026' } },
    },
    {
      id: 'm3-masuk', kind: 'explain', tone: 'mint', kicker: 'Langkah 1 daripada 4', title: 'Log masuk dan bayar', vo: 'm3-masuk',
      keynote: 'Google, akaun awak, kad, Subscribe.',
      footnotes: ['Skrin log masuk dan bayar dalam buku ini ialah paparan contoh yang dibina semula dari screenshot sebenar, dengan e-mel contoh. Skrin awak akan tunjuk e-mel dan kad awak sendiri.'],
      blocks: [
        { t: 'p', text: 'Lepas klik **Try Claude**, laman log masuk Claude terbuka. Cara paling senang ialah log masuk dengan **akaun Google** awak, kemudian bayar pelan Pro dengan kad bank^1.' },
        { t: 'note', tone: 'privasi', title: 'E-mel contoh', text: 'Dalam gambar, akaun Google ialah **pelajar.demo@gmail.com**. Itu e-mel contoh, bukan akaun sebenar.' },
        { t: 'note', tone: 'awas', title: 'Bayaran ditolak?', text: 'Buka **transaksi luar negara** untuk kad debit dalam app bank awak, kemudian cuba semula.' },
        {
          t: 'flow', title: 'Empat klik sahaja', steps: [
            { icon: 'click', title: 'Continue with Google', at: 0 },
            { icon: 'chat', title: 'Pilih akaun Google awak', at: 1 },
            { icon: 'lock', title: 'Isi kad, klik Subscribe', at: 2 },
            { icon: 'medal', title: 'Pro aktif', at: 3 },
          ],
        },
      ],
    },
    {
      id: 'm3-masuk-google', kind: 'shot', tone: 'mint', kicker: 'Langkah 1 · Log masuk', title: 'Continue with Google',
      keynote: 'Butang putih paling atas: Continue with Google.',
      views: both({
        ...fromShot('contoh/m3-login'), frame: 'browser', url: 'claude.ai/login',
        caption: '**Laman log masuk Claude** · dibina semula dari screenshot sebenar',
        say: 'Klik **Continue with Google**.',
        hints: ['Butang putih paling atas, ada huruf **G** berwarna.', 'Bukan butang hitam **Continue with email**.'],
        ok: '**Betul!** Google akan tanya akaun mana yang awak nak guna.',
        vo: 'm3-masuk-google', screen: 'login', leadsTo: 'google-akaun',
      }),
    },
    {
      id: 'm3-masuk-akaun', kind: 'shot', tone: 'mint', kicker: 'Langkah 1 · Pilih akaun', title: 'Pilih akaun Google',
      keynote: 'Klik nama dan e-mel awak.',
      views: both({
        ...fromShot('contoh/m3-google-akaun'), frame: 'browser', url: 'accounts.google.com',
        caption: '**Pilih akaun Google** · e-mel contoh pelajar.demo@gmail.com',
        say: 'Klik akaun Google awak. Dalam contoh ini: **Pelajar Demo**.',
        hints: ['Lihat di sebelah kanan, baris yang ada nama dan e-mel.', 'Bukan **Use another account**; itu untuk akaun lain.'],
        ok: '**Betul!** Claude terus bawa awak ke laman bayaran Pro.',
        vo: 'm3-masuk-akaun', screen: 'google-akaun', leadsTo: 'bayar',
      }),
    },
    {
      id: 'm3-bayar', kind: 'shot', tone: 'mint', kicker: 'Langkah 1 · Bayar', title: 'Isi kad, klik Subscribe',
      keynote: 'Pro · Monthly, isi kad, Subscribe.',
      views: both({
        ...fromShot('contoh/m3-bayar'), frame: 'browser', url: 'claude.ai',
        caption: '**Bayar Claude Pro** · USD20 sebulan; nombor kad sengaja dititik',
        say: 'Pastikan **Pro · Monthly** dipilih. Isi nombor kad, tarikh tamat dan CVC, kemudian klik **Subscribe**.',
        hints: ['Butang hitam di bawah borang kad.', 'Ia bertulis **Subscribe**, di bawah kotak **Country**.'],
        ok: '**Betul!** Bayaran diterima dan pelan Pro awak aktif.',
        vo: 'm3-bayar', screen: 'bayar', leadsTo: 'pro-aktif',
      }),
    },
    {
      id: 'm3-pro-aktif', kind: 'explain', tone: 'sky', kicker: 'Langkah 2 daripada 4', title: 'Pro dah aktif. Sekarang download Claude', vo: 'm3-pro-aktif',
      keynote: 'Nampak Pro plan? Terus ke claude.com/download.',
      bridge: { from: 'pro-aktif', to: 'download' },
      blocks: [
        { t: 'p', text: 'Selepas bayar, Claude terbuka di pelayar. Di bawah nama awak tertulis **Pro plan**. Sekarang kita download app Claude untuk komputer awak.' },
        { t: 'steps', items: ['Klik **bar alamat** paling atas dalam pelayar.', 'Taip **claude.com/download**.', 'Tekan **Enter**.'] },
        { t: 'img', src: fromShot('contoh/m3-pro-aktif').img, alt: 'Claude di pelayar selepas bayar, tertulis Pro plan', caption: 'Selepas bayar: **Pro plan** · paparan contoh, e-mel contoh' },
      ],
    },
    {
      id: 'm3-l3-download', kind: 'shot', tone: 'sky', kicker: 'Langkah 2 daripada 4', title: 'Download Claude',
      keynote: 'Mac: butang hitam besar. Windows: baris Windows.',
      views: {
        mac: {
          img: '/shots/download.png', frame: 'browser', url: 'claude.com/download',
          caption: '**Laman download Claude** · claude.com/download, diambil 29 Okt 2026',
          say: 'Buka **claude.com/download**. Klik butang hitam **Download for macOS**.',
          target: [41.74, 42.22, 16.46, 4.44], focus: [30, 24, 40, 26],
          hints: ['Butang hitam di tengah, di bawah tulisan besar **Download Claude**.', 'Ada logo epal di sebelah kiri butang itu.'],
          ok: '**Betul!** Fail Claude mula dimuat turun ke folder Downloads.',
          labels: [{ at: [36, 30.5], text: 'Tajuk: Download Claude' }], vo: 'n6mac', screen: 'download', leadsTo: 'dmg',
        },
        win: {
          img: '/shots/download.png', frame: 'browser', url: 'claude.com/download',
          caption: '**Laman download Claude** · sama di Windows, diambil 29 Okt 2026',
          say: 'Buka **claude.com/download**. Turun ke kotak **Desktop**. Pada baris **Windows**, klik **Download**.',
          target: [55, 92.56, 7.15, 4], focus: [35.2, 70, 29.6, 30],
          hints: ['Cari kotak putih bertulis **Desktop** di bahagian bawah.', 'Baris kedua bertulis **Windows**. Butang di hujung kanan baris itu.'],
          ok: '**Betul!** Pemasang Claude untuk Windows mula dimuat turun.',
          labels: [{ at: [38, 86.9], text: 'Baris macOS: bukan ini' }], vo: 'n6win', screen: 'download', leadsTo: 'win-setup',
        },
      },
    },
    {
      id: 'm3-pasang-dmg', kind: 'shot', os: 'mac', tone: 'peach', kicker: 'Langkah 3 daripada 4', title: 'Buka Claude.dmg',
      keynote: 'Downloads, klik dua kali Claude.dmg.',
      views: both({
        ...fromShot('desk/m3-dmg'), frame: 'screen',
        caption: '**Folder Downloads di Mac** · screenshot sebenar, fail lain disorok',
        say: 'Buka folder **Downloads**. Klik dua kali pada **Claude.dmg**.',
        hints: ['Ikon fail putih dengan anak panah, bertulis **Claude.dmg**.', 'Kalau ada beberapa, pilih yang terbaru.'],
        ok: '**Betul!** Tetingkap **Install Claude** terbuka.',
        vo: 'm3-pasang-dmg', screen: 'dmg', leadsTo: 'pasang-mac',
      }),
    },
    {
      id: 'm3-pasang-seret', kind: 'shot', os: 'mac', tone: 'peach', kicker: 'Langkah 3 · Pasang', title: 'Seret Claude ke Applications',
      keynote: 'Tekan, tahan, seret ke Applications, lepaskan.',
      views: both({
        ...fromShot('desk/m3-seret'), frame: 'screen',
        caption: '**Install Claude** · screenshot sebenar tetingkap pemasang',
        say: 'Tekan dan tahan ikon **Claude**, seret ke folder **Applications**, kemudian lepaskan.',
        hints: ['Ikon oren di sebelah kiri, bertulis **Claude**.', 'Seret ke folder biru **Applications** di sebelah kanan.'],
        ok: '**Betul!** Claude disalin ke folder Applications. Tunggu beberapa saat sehingga siap.',
        vo: 'm3-pasang-seret', screen: 'pasang-mac', leadsTo: 'dipasang',
      }),
    },
    {
      id: 'm3-pasang-buka', kind: 'explain', os: 'mac', tone: 'peach', kicker: 'Langkah 3 · Buka', title: 'Buka Claude buat kali pertama', vo: 'm3-pasang-buka',
      keynote: 'Command + Space, taip Claude, Enter.',
      bridge: { from: 'dipasang', to: 'mac-buka' },
      blocks: [
        { t: 'p', text: 'Claude dah ada dalam Mac awak. Cara paling cepat untuk membukanya ialah carian **Spotlight**.' },
        { t: 'steps', items: ['Tekan **Command** dan **Space** serentak.', 'Taip **Claude**.', 'Tekan **Enter**.'] },
        { t: 'note', tone: 'tip', title: 'Cara lain', text: 'Buka Finder, klik **Applications** di sebelah kiri, kemudian klik dua kali ikon **Claude**.' },
        {
          t: 'flow', title: 'Tiga tekan', steps: [
            { icon: 'type', title: 'Command + Space', at: 0 },
            { icon: 'chat', title: 'Taip Claude', at: 1 },
            { icon: 'click', title: 'Tekan Enter', at: 2 },
          ],
        },
      ],
    },
    {
      id: 'm3-pasang-izin', kind: 'shot', os: 'mac', tone: 'peach', kicker: 'Langkah 3 · Buka', title: 'Klik Open',
      keynote: 'App dari internet? Mac tanya sekali. Klik Open.',
      views: both({
        ...fromShot('contoh/m3-mac-buka'), frame: 'screen',
        caption: '**Soalan macOS kali pertama** · dibina semula dengan ayat dialog sebenar',
        say: 'Mac tanya sama ada awak pasti nak buka app ini. Klik **Open**.',
        hints: ['Butang biru di sebelah kanan.', 'Bukan **Cancel**; Cancel menutup soalan tanpa membuka Claude.'],
        ok: '**Betul!** App Claude terbuka.',
        vo: 'm3-pasang-izin', screen: 'mac-buka', leadsTo: 'claude-mula',
      }),
    },
    {
      id: 'm3-pasang-setup', kind: 'shot', os: 'win', tone: 'peach', kicker: 'Langkah 3 daripada 4', title: 'Buka Claude Setup',
      keynote: 'Downloads, klik dua kali Claude Setup.',
      views: both({
        ...fromShot('win/m3-win-setup'), frame: 'screen',
        caption: '**File Explorer, folder Downloads** · nama fail awak mungkin ada nombor versi',
        say: 'Buka folder **Downloads**. Klik dua kali pada **Claude Setup**.',
        hints: ['Baris yang bertulis **Claude Setup.exe**.', 'Jenisnya **Application**.'],
        ok: '**Betul!** Claude dipasang dan terbuka sendiri.',
        vo: 'm3-pasang-setup', screen: 'win-setup', leadsTo: 'claude-mula',
      }),
    },
    {
      id: 'm3-pasang-mula', kind: 'shot', tone: 'peach', kicker: 'Langkah 3 · Log masuk app', title: 'Get started',
      keynote: 'Butang hitam di bawah: Get started.',
      views: {
        mac: {
          ...fromShot('desk/m3-mula'), frame: 'screen',
          caption: '**App Claude di Mac** · screenshot sebenar, kali pertama dibuka',
          say: 'App Claude terbuka. Klik **Get started**.',
          hints: ['Butang hitam panjang di bahagian bawah.', 'Ia bertulis **Get started**.'],
          ok: '**Betul!** Skrin **Sign In** terbuka.',
          vo: 'm3-pasang-mula', screen: 'claude-mula', leadsTo: 'signin',
        },
        win: {
          ...fromShot('win/m3-win-mula'), frame: 'screen',
          caption: '**App Claude di Windows** · skrin Mac sebenar dalam tetingkap Windows',
          say: 'App Claude terbuka. Klik **Get started**.',
          hints: ['Butang gelap panjang di bahagian bawah.', 'Ia bertulis **Get started**.'],
          ok: '**Betul!** Skrin **Sign In** terbuka.',
          vo: 'm3-pasang-mula', screen: 'claude-mula', leadsTo: 'signin',
        },
      },
    },
    {
      id: 'm3-pasang-masuk', kind: 'shot', tone: 'peach', kicker: 'Langkah 3 · Log masuk app', title: 'Sign In dengan Google',
      keynote: 'Akaun Google yang sama dengan masa bayar.',
      views: {
        mac: {
          ...fromShot('desk/m3-signin'), frame: 'screen',
          caption: '**Sign In** dalam app Claude · screenshot sebenar',
          say: 'Log masuk dengan akaun yang sama. Klik **Continue with Google**.',
          hints: ['Butang kelabu muda paling atas, ada huruf **G**.', 'Bukan **Continue with email**.'],
          ok: '**Betul!** Pelayar terbuka untuk pilih akaun Google.',
          vo: 'm3-pasang-masuk', screen: 'signin', leadsTo: 'google-app',
        },
        win: {
          ...fromShot('win/m3-win-signin'), frame: 'screen',
          caption: '**Sign In** dalam app Claude · skrin Mac sebenar dalam tetingkap Windows',
          say: 'Log masuk dengan akaun yang sama. Klik **Continue with Google**.',
          hints: ['Butang kelabu muda paling atas, ada huruf **G**.', 'Bukan **Continue with email**.'],
          ok: '**Betul!** Pelayar terbuka untuk pilih akaun Google.',
          vo: 'm3-pasang-masuk', screen: 'signin', leadsTo: 'google-app',
        },
      },
    },
    {
      id: 'm3-pasang-akaun', kind: 'shot', tone: 'peach', kicker: 'Langkah 3 · Log masuk app', title: 'Pilih akaun, kembali ke app',
      keynote: 'Pilih akaun. Pelayar tanya? Klik Open Claude.',
      views: both({
        ...fromShot('contoh/m3-google-akaun'), frame: 'browser', url: 'accounts.google.com',
        caption: '**Pilih akaun Google** · sama seperti masa bayar',
        say: 'Pelayar terbuka. Klik akaun Google awak. Kalau pelayar tanya **Open Claude?**, klik **Open Claude**.',
        hints: ['Baris yang ada nama dan e-mel awak.', 'Akaun yang sama dengan masa bayar.'],
        ok: '**Betul!** App Claude terbuka dengan akaun Pro awak.',
        vo: 'm3-pasang-akaun', screen: 'google-app', leadsTo: 'claude-app',
      }),
    },
    {
      id: 'm3-folder-terang', kind: 'explain', tone: 'butter', kicker: 'Langkah 4 daripada 4', title: 'Satu folder untuk satu projek', vo: 'm3-folder-terang',
      keynote: 'Tarikh dulu, nama kemudian. RAW dan Footage di dalam.',
      blocks: [
        { t: 'p', text: 'Claude bekerja dalam **satu folder untuk satu projek**. Semua bahan satu iklan masuk ke situ, jadi Claude tahu di mana nak cari. Nama folder bermula dengan tarikh supaya projek tersusun ikut masa.' },
        {
          t: 'tiles', cols: 3, items: [
            { icon: 'folder', title: '2026-10-29 Iklan Bekam', sub: 'Folder projek: tarikh (tahun-bulan-hari), kemudian nama', at: 0 },
            { icon: 'phone', title: 'RAW', sub: 'Rakaman dari telefon awak, belum diedit', at: 1 },
            { icon: 'film', title: 'Footage', sub: 'Grid, muzik, overlay dan light leak dari Modul 4', at: 2 },
          ],
        },
        { t: 'note', tone: 'tip', title: 'Kenapa tarikh dulu?', text: 'Komputer menyusun nama ikut huruf. Bila nama bermula dengan tahun-bulan-hari, projek paling baru sentiasa di hujung senarai.' },
      ],
    },
    {
      id: 'm3-folder-buka-mac', kind: 'explain', os: 'mac', tone: 'butter', kicker: 'Langkah 4 · Buka Documents', title: 'Buka folder Documents', vo: 'm3-folder-buka-mac',
      keynote: 'Command + Space, taip Documents, Enter.',
      bridge: { from: 'claude-app', to: 'finder-docs' },
      blocks: [
        { t: 'p', text: 'Biarkan app Claude terbuka. Kita buat folder projek dalam folder **Documents**.' },
        { t: 'steps', items: ['Tekan **Command** dan **Space** serentak.', 'Taip **Documents**.', 'Tekan **Enter**. Finder terbuka di folder Documents.'] },
        {
          t: 'flow', title: 'Tiga tekan', steps: [
            { icon: 'type', title: 'Command + Space', at: 0 },
            { icon: 'chat', title: 'Taip Documents', at: 1 },
            { icon: 'folder', title: 'Tekan Enter', at: 2 },
          ],
        },
      ],
    },
    {
      id: 'm3-folder-buka-win', kind: 'explain', os: 'win', tone: 'butter', kicker: 'Langkah 4 · Buka Documents', title: 'Buka folder Documents', vo: 'm3-folder-buka-win',
      keynote: 'Butang Windows, taip Documents, Enter.',
      bridge: { from: 'claude-app', to: 'finder-docs' },
      blocks: [
        { t: 'p', text: 'Biarkan app Claude terbuka. Kita buat folder projek dalam folder **Documents**.' },
        { t: 'steps', items: ['Tekan butang **Windows** pada papan kekunci.', 'Taip **Documents**.', 'Tekan **Enter**. File Explorer terbuka di folder Documents.'] },
        {
          t: 'flow', title: 'Tiga tekan', steps: [
            { icon: 'laptop', title: 'Butang Windows', at: 0 },
            { icon: 'chat', title: 'Taip Documents', at: 1 },
            { icon: 'folder', title: 'Tekan Enter', at: 2 },
          ],
        },
      ],
    },
    {
      id: 'm3-folder-baru', kind: 'shot', tone: 'butter', kicker: 'Langkah 4 · Folder baru', title: 'Buat folder baru',
      keynote: 'Mac: klik kanan ruang kosong. Windows: New.',
      views: {
        mac: {
          ...fromShot('desk/m3-docs'), frame: 'screen',
          caption: '**Folder Documents di Mac** · screenshot sebenar',
          say: 'Dalam folder **Documents**, klik kanan pada ruang kosong.',
          hints: ['Ruang putih kosong di tengah tetingkap.', 'Klik kanan: tekan dengan dua jari pada trackpad, atau butang kanan tetikus.'],
          ok: '**Betul!** Menu kecil muncul.',
          vo: 'm3-folder-baru-mac', screen: 'finder-docs', leadsTo: 'menu-baru',
        },
        win: {
          ...fromShot('win/m3-win-docs'), frame: 'screen',
          caption: '**File Explorer, folder Documents**',
          say: 'Dalam folder **Documents**, klik **New** di sebelah atas.',
          hints: ['Butang dengan bulatan biru dan tanda tambah.', 'Paling kiri dalam baris butang di atas.'],
          ok: '**Betul!** Menu kecil muncul.',
          vo: 'm3-folder-baru-win', screen: 'finder-docs', leadsTo: 'menu-baru',
        },
      },
    },
    {
      id: 'm3-folder-menu', kind: 'shot', tone: 'butter', kicker: 'Langkah 4 · Folder baru', title: 'Pilih New Folder',
      keynote: 'Pilihan paling atas dalam menu.',
      views: {
        mac: {
          ...fromShot('desk/m3-menu'), frame: 'screen',
          caption: '**Menu klik kanan Finder** · screenshot sebenar',
          say: 'Klik **New Folder**.',
          hints: ['Pilihan paling atas dalam menu.', 'Ada ikon folder kecil di sebelah kirinya.'],
          ok: '**Betul!** Folder baru muncul, dan namanya sedia untuk ditaip.',
          vo: 'm3-folder-menu-mac', screen: 'menu-baru', leadsTo: 'nama-folder',
        },
        win: {
          ...fromShot('win/m3-win-menu'), frame: 'screen',
          caption: '**Menu New dalam File Explorer**',
          say: 'Klik **Folder**.',
          hints: ['Pilihan paling atas dalam menu.', 'Ada ikon folder kuning di sebelah kirinya.'],
          ok: '**Betul!** Folder baru muncul, dan namanya sedia untuk ditaip.',
          vo: 'm3-folder-menu-win', screen: 'menu-baru', leadsTo: 'nama-folder',
        },
      },
    },
    {
      id: 'm3-folder-nama-mac', kind: 'explain', os: 'mac', tone: 'butter', kicker: 'Langkah 4 · Nama folder', title: 'Taip nama folder', vo: 'm3-folder-nama',
      keynote: 'Tarikh hari ini, nama projek, Enter.',
      bridge: { from: 'nama-folder', to: 'folder-siap' },
      blocks: [
        { t: 'steps', items: ['Folder baru muncul. Namanya biru, sedia untuk ditaip.', 'Taip **2026-10-29 Iklan Bekam**: tarikh hari ini, kemudian nama projek.', 'Tekan **Enter**.'] },
        { t: 'img', src: fromShot('desk/m3-nama').img, alt: 'Taip nama folder', caption: '**untitled folder** sedia ditaip · screenshot sebenar' },
      ],
    },
    {
      id: 'm3-folder-nama-win', kind: 'explain', os: 'win', tone: 'butter', kicker: 'Langkah 4 · Nama folder', title: 'Taip nama folder', vo: 'm3-folder-nama',
      keynote: 'Tarikh hari ini, nama projek, Enter.',
      bridge: { from: 'nama-folder', to: 'folder-siap' },
      blocks: [
        { t: 'steps', items: ['Folder baru muncul. Namanya biru, sedia untuk ditaip.', 'Taip **2026-10-29 Iklan Bekam**: tarikh hari ini, kemudian nama projek.', 'Tekan **Enter**.'] },
        { t: 'img', src: fromShot('win/m3-win-nama').img, alt: 'Taip nama folder', caption: '**New folder** sedia ditaip · paparan contoh Windows' },
      ],
    },
    {
      id: 'm3-folder-buka', kind: 'shot', tone: 'butter', kicker: 'Langkah 4 · Buka folder', title: 'Buka folder projek',
      keynote: 'Klik dua kali untuk masuk ke dalam folder.',
      views: {
        mac: {
          ...fromShot('desk/m3-siap'), frame: 'screen',
          caption: '**Folder projek dah ada** · screenshot sebenar',
          say: 'Klik dua kali folder **2026-10-29 Iklan Bekam** untuk membukanya.',
          hints: ['Ikon folder biru yang baru awak buat.', 'Namanya bermula dengan tarikh hari ini.'],
          ok: '**Betul!** Awak kini di dalam folder projek. Ia masih kosong.',
          vo: 'm3-folder-buka', screen: 'folder-siap', leadsTo: 'folder-dalam',
        },
        win: {
          ...fromShot('win/m3-win-siap'), frame: 'screen',
          caption: '**Folder projek dah ada** · File Explorer',
          say: 'Klik dua kali folder **2026-10-29 Iklan Bekam** untuk membukanya.',
          hints: ['Baris folder kuning yang baru awak buat.', 'Namanya bermula dengan tarikh hari ini.'],
          ok: '**Betul!** Awak kini di dalam folder projek. Ia masih kosong.',
          vo: 'm3-folder-buka', screen: 'folder-siap', leadsTo: 'folder-dalam',
        },
      },
    },
    {
      id: 'm3-folder-isi-mac', kind: 'explain', os: 'mac', tone: 'butter', kicker: 'Langkah 4 · Isi folder', title: 'Buat RAW dan Footage', vo: 'm3-folder-isi',
      keynote: 'Dua folder di dalam: RAW dan Footage.',
      bridge: { from: 'folder-dalam', to: 'folder-lengkap' },
      blocks: [
        { t: 'steps', items: ['Ulang langkah tadi di sini: klik kanan ruang kosong, **New Folder**.', 'Namakan folder pertama **RAW**: rakaman dari telefon awak.', 'Namakan folder kedua **Footage**: grid, muzik, overlay dan light leak.'] },
        { t: 'img', src: fromShot('desk/m3-dalam').img, alt: 'Buat RAW dan Footage', caption: 'Folder projek yang masih kosong · screenshot sebenar' },
      ],
    },
    {
      id: 'm3-folder-isi-win', kind: 'explain', os: 'win', tone: 'butter', kicker: 'Langkah 4 · Isi folder', title: 'Buat RAW dan Footage', vo: 'm3-folder-isi',
      keynote: 'Dua folder di dalam: RAW dan Footage.',
      bridge: { from: 'folder-dalam', to: 'folder-lengkap' },
      blocks: [
        { t: 'steps', items: ['Ulang langkah tadi di sini: **New**, kemudian **Folder**.', 'Namakan folder pertama **RAW**: rakaman dari telefon awak.', 'Namakan folder kedua **Footage**: grid, muzik, overlay dan light leak.'] },
        { t: 'img', src: fromShot('win/m3-win-dalam').img, alt: 'Buat RAW dan Footage', caption: 'Folder projek yang masih kosong · paparan contoh Windows' },
      ],
    },
    {
      id: 'm3-folder-siap-mac', kind: 'explain', os: 'mac', tone: 'mint', kicker: 'Langkah 4 · Siap', title: 'Folder projek dah sedia', vo: 'm3-folder-siap',
      keynote: 'Satu projek, satu folder. Modul 4 isi RAW dan Footage.',
      blocks: [
        { t: 'p', text: 'Folder projek awak dah sedia, dengan **RAW** dan **Footage** di dalamnya. Dalam Modul 4, awak isi kedua-dua folder ini. Dalam Modul 5, awak suruh Claude buka folder ini dan buat video.' },
        { t: 'note', tone: 'tip', title: 'Projek seterusnya', text: 'Untuk iklan lain, buat folder baru dengan tarikh hari itu. Jangan campur bahan dua projek dalam satu folder.' },
        { t: 'img', src: fromShot('desk/m3-lengkap').img, alt: 'Folder projek dengan RAW dan Footage', caption: '**RAW** dan **Footage** dalam folder projek · screenshot sebenar' },
      ],
    },
    {
      id: 'm3-folder-siap-win', kind: 'explain', os: 'win', tone: 'mint', kicker: 'Langkah 4 · Siap', title: 'Folder projek dah sedia', vo: 'm3-folder-siap',
      keynote: 'Satu projek, satu folder. Modul 4 isi RAW dan Footage.',
      blocks: [
        { t: 'p', text: 'Folder projek awak dah sedia, dengan **RAW** dan **Footage** di dalamnya. Dalam Modul 4, awak isi kedua-dua folder ini. Dalam Modul 5, awak suruh Claude buka folder ini dan buat video.' },
        { t: 'note', tone: 'tip', title: 'Projek seterusnya', text: 'Untuk iklan lain, buat folder baru dengan tarikh hari itu. Jangan campur bahan dua projek dalam satu folder.' },
        { t: 'img', src: fromShot('win/m3-win-lengkap').img, alt: 'Folder projek dengan RAW dan Footage', caption: '**RAW** dan **Footage** dalam folder projek · paparan contoh Windows' },
      ],
    },
    {
      id: 'm3-rumusan', kind: 'quiz', tone: 'pink', kicker: 'Rumusan', title: 'Komputer awak dah ada Claude', vo: 'n7',
      keynote: 'Pro, download, pasang, folder projek.',
      blocks: [
        { t: 'p', text: 'Empat perkara yang awak dah buat dalam modul ini:' },
        {
          t: 'flow', title: 'Dari laman harga ke folder projek', steps: [
            { icon: 'medal', title: 'Pelan Pro', sub: 'Ada Claude Code', at: 0 },
            { icon: 'laptop', title: 'Download', sub: '**Mac** atau **Windows**', at: 1 },
            { icon: 'code', title: 'Pasang, log masuk', sub: 'Akaun Google sama', at: 2 },
            { icon: 'folder', title: 'Folder projek', sub: 'RAW + Footage', at: 3 },
          ],
        },
      ],
      questions: [
        { q: 'Semak diri: pelan mana ada Claude Code?', options: ['Free', 'Pro'], icons: ['chat', 'medal'], answer: 1, hint: 'Hampir. Baca semula muka "Kenapa Pro, bukan Free?".' },
        { q: 'Nama folder projek yang paling senang dicari?', options: ['2026-10-29 Iklan Bekam', 'untitled folder 3'], icons: ['folder', 'no'], answer: 0, hint: 'Hampir. Tarikh dulu, kemudian nama projek.' },
        { q: 'Log masuk app Claude guna akaun apa?', options: ['Akaun yang sama', 'Akaun baru'], icons: ['chat', 'no'], answer: 0, hint: 'Hampir. Pelan Pro melekat pada akaun yang awak bayar.' },
      ],
    },
  ],
}
