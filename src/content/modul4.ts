import { fromShot } from './shots'
import type { Chapter, ShotView } from './types'

/** A web screen looks the same on both computers; only the browser frame around it changes. */
const both = (v: ShotView): { mac: ShotView; win: ShotView } => ({ mac: v, win: v })
const yt = (id: string, url: string) => ({ ...fromShot(`web/${id}`), frame: 'browser' as const, url })
const SF = 'en1.savefrom.net/21-youtube-to-mp4-40LR.html'

export const modul4: Chapter = {
  id: 'm4',
  module: 4,
  title: 'Kumpul Bahan',
  strict: true,
  pages: [
    {
      id: 'm4-pembuka', kind: 'explain', cover: true, tone: 'lav', kicker: 'Modul 4', title: 'Kumpul Bahan', vo: 'm4-pembuka',
      keynote: 'Footage dari YouTube, RAW dari telefon.',
      blocks: [
        { t: 'lead', text: 'Claude buat video dari bahan dalam folder projek. Dalam modul ini awak isi dua folder: **Footage** dan **RAW**.' },
        { t: 'chips', items: ['YouTube', 'savefrom.net', 'Telefon awak'] },
        { t: 'outcome', text: 'folder Footage ada latar grid, muzik, overlay dan light leak; folder RAW ada rakaman telefon awak.' },
        {
          t: 'road', stops: [
            { icon: 'film', title: 'Footage dari YouTube', sub: 'Grid, muzik, overlay, light leak', at: 0 },
            { icon: 'folder', title: 'Masuk ke Footage', sub: 'Salin dari Downloads', at: 1 },
            { icon: 'phone', title: 'RAW dari telefon', sub: 'Rakaman awak sendiri', at: 2 },
          ],
        },
      ],
    },
    {
      id: 'm4-senarai', kind: 'explain', tone: 'butter', kicker: 'Faham dulu', title: 'Empat bahan Footage', vo: 'm4-senarai',
      keynote: 'Satu bahan, satu carian, satu muat turun.',
      footnotes: ['Pilih video yang tulis **no copyright** atau **free** pada tajuk atau keterangannya.'],
      blocks: [
        { t: 'p', text: 'Empat bahan ini dicari di YouTube, dimuat turun sekali, dan dipakai untuk banyak iklan^1. Muka seterusnya tunjuk caranya dengan **latar grid**; tiga yang lain sama sahaja.' },
        { t: 'note', tone: 'tip', title: 'Pilih Shorts', text: 'Untuk latar grid, pilih video di bawah **Shorts**. Ia sudah menegak, sama saiz dengan iklan Reels.' },
        {
          t: 'table', head: ['Bahan', 'Taip di YouTube'],
          rows: [
            ['Latar grid', '**grid background animated**'],
            ['Muzik latar', '**instrumental** di Pixabay, atau **NCS** di YouTube'],
            ['Overlay', '**film overlay free download**'],
            ['Light leak', '**light leak transition free**'],
          ],
        },
      ],
    },
    {
      id: 'm4-cari', kind: 'explain', tone: 'sky', kicker: 'Langkah 1 · YouTube', title: 'Cari latar grid', vo: 'm4-cari',
      keynote: 'youtube.com, taip carian, Enter.',
      bridge: { from: 'mula-m4', to: 'yt-hasil' },
      blocks: [
        { t: 'steps', items: ['Buka **youtube.com** di pelayar.', 'Klik kotak carian di atas.', 'Taip **grid background animated**, tekan **Enter**.'] },
        {
          t: 'flow', title: 'Tiga langkah', steps: [
            { icon: 'browser', title: 'Buka youtube.com', at: 0 },
            { icon: 'type', title: 'Taip carian', at: 1 },
            { icon: 'click', title: 'Tekan Enter', at: 2 },
          ],
        },
      ],
    },
    {
      id: 'm4-yt-hasil', kind: 'shot', tone: 'sky', kicker: 'Langkah 1 · YouTube', title: 'Pilih video menegak',
      keynote: 'Shorts = menegak, sama saiz iklan.',
      views: both({
        ...yt('m4-yt-hasil', 'youtube.com/results'),
        caption: '**Hasil carian YouTube** · screenshot sebenar, senarai peribadi dikaburkan',
        say: 'Di bawah **Shorts**, klik satu video grid yang awak suka.',
        hints: ['Baris gambar menegak di bawah tulisan **Shorts**.', 'Pilih yang pertama pun boleh.'],
        ok: '**Betul!** Video itu terbuka.',
        vo: 'm4-yt-hasil', screen: 'yt-hasil', leadsTo: 'yt-short',
      }),
    },
    {
      id: 'm4-yt-short', kind: 'shot', tone: 'sky', kicker: 'Langkah 1 · YouTube', title: 'Klik Share',
      keynote: 'Share ada di sebelah kanan video.',
      views: both({
        ...yt('m4-yt-short', 'youtube.com/shorts'),
        caption: '**Video Shorts** · screenshot sebenar',
        say: 'Klik butang **Share** (anak panah) di sebelah kanan video.',
        hints: ['Butang bulat di sebelah kanan video, di bawah Like.', 'Di bawahnya tertulis **Share**.'],
        ok: '**Betul!** Kotak Share terbuka.',
        vo: 'm4-yt-short', screen: 'yt-short', leadsTo: 'yt-kongsi',
      }),
    },
    {
      id: 'm4-yt-kongsi', kind: 'shot', tone: 'sky', kicker: 'Langkah 1 · YouTube', title: 'Salin pautan',
      keynote: 'Copy = pautan video disalin.',
      views: both({
        ...yt('m4-yt-kongsi', 'youtube.com/shorts'),
        caption: '**Kotak Share** · screenshot sebenar',
        say: 'Klik **Copy**. Pautan video kini disalin.',
        hints: ['Butang di hujung kanan pautan.', 'Ia bertulis **Copy**.'],
        ok: '**Betul!** Pautan disalin. Sekarang ke savefrom.',
        vo: 'm4-yt-kongsi', screen: 'yt-kongsi', leadsTo: 'pautan-disalin',
      }),
    },
    {
      id: 'm4-ke-savefrom', kind: 'explain', tone: 'peach', kicker: 'Langkah 2 · savefrom', title: 'Buka savefrom', vo: 'm4-ke-savefrom',
      keynote: 'Iklan terbuka? Tutup tab itu. Jangan klik apa-apa di dalamnya.',
      bridge: { from: 'pautan-disalin', to: 'sf-utama' },
      blocks: [
        { t: 'steps', items: ['Klik bar alamat paling atas dalam pelayar.', `Taip **${SF}**.`, 'Tekan **Enter**.'] },
        { t: 'note', tone: 'awas', title: 'Awas iklan', text: 'Laman ini percuma kerana ada iklan. Setiap klik mungkin membuka **tab iklan baru**, termasuk iklan judi. Tutup tab itu terus. Jangan klik apa-apa di dalamnya, dan jangan pasang apa-apa.' },
        {
          t: 'flow', title: 'Kalau tab iklan terbuka', steps: [
            { icon: 'warn', title: 'Tab baru muncul', at: 0 },
            { icon: 'no', title: 'Tutup tab itu', at: 1 },
            { icon: 'browser', title: 'Kembali ke savefrom', at: 2 },
          ],
        },
      ],
    },
    {
      id: 'm4-sf-utama', kind: 'shot', tone: 'peach', kicker: 'Langkah 2 · savefrom', title: 'Klik kotak pautan',
      keynote: 'Kotak putih panjang di tengah.',
      views: both({
        ...yt('m4-sf-utama', SF),
        caption: '**savefrom.net** · screenshot sebenar',
        say: 'Klik kotak putih **Paste your video link here**.',
        hints: ['Kotak putih panjang berbingkai hijau.', 'Di sebelah kirinya butang hijau **Download**.'],
        ok: '**Betul!** Kotak itu sedia untuk diisi.',
        vo: 'm4-sf-utama', screen: 'sf-utama', leadsTo: 'sf-kotak',
      }),
    },
    {
      id: 'm4-tampal', kind: 'explain', tone: 'peach', kicker: 'Langkah 2 · savefrom', title: 'Tampal pautan', vo: 'm4-tampal',
      keynote: 'Mac: Command + V. Windows: Ctrl + V.',
      bridge: { from: 'sf-kotak', to: 'sf-ditampal' },
      blocks: [
        { t: 'p', text: 'Pautan yang awak salin di YouTube kini ditampal ke dalam kotak.' },
        {
          t: 'tiles', cols: 2, items: [
            { icon: 'laptop', title: 'Mac', sub: 'Tekan **Command + V**', at: 0 },
            { icon: 'laptop', title: 'Windows', sub: 'Tekan **Ctrl + V**', at: 1 },
          ],
        },
      ],
    },
    {
      id: 'm4-sf-ditampal', kind: 'shot', tone: 'peach', kicker: 'Langkah 2 · savefrom', title: 'Klik Download',
      keynote: 'Pautan dalam kotak, klik Download.',
      views: both({
        ...yt('m4-sf-ditampal', SF),
        caption: '**Pautan dah ditampal** · screenshot sebenar',
        say: 'Pautan dah ada dalam kotak. Klik butang hijau **Download**.',
        hints: ['Butang hijau di hujung kanan kotak.', 'Ia bertulis **Download**.'],
        ok: '**Betul!** savefrom sedang menyediakan video.',
        vo: 'm4-sf-ditampal', screen: 'sf-ditampal', leadsTo: 'sf-sedia',
      }),
    },
    {
      id: 'm4-sf-sedia', kind: 'shot', tone: 'peach', kicker: 'Langkah 2 · savefrom', title: 'Klik with low quality',
      keynote: 'Butang biru besar = jual app. Pautan kecil = percuma.',
      views: both({
        ...yt('m4-sf-sedia', SF),
        caption: '**Video sedia** · screenshot sebenar',
        say: 'Jangan klik butang biru besar. Klik pautan kecil **with low quality** di bawahnya.',
        hints: ['Tulisan kecil bergaris di bawah butang biru.', 'Ia bertulis **with low quality**.'],
        ok: '**Betul!** Senarai muat turun percuma terbuka.',
        vo: 'm4-sf-sedia', screen: 'sf-sedia', leadsTo: 'sf-muat',
      }),
    },
    {
      id: 'm4-sf-muat', kind: 'shot', tone: 'peach', kicker: 'Langkah 2 · savefrom', title: 'Buka senarai kualiti',
      keynote: 'Klik MP4 720 untuk buka senarai.',
      views: both({
        ...yt('m4-sf-muat', SF),
        caption: '**Pilihan muat turun** · screenshot sebenar',
        say: 'Klik **MP4 720** di sebelah butang Download untuk buka senarai kualiti.',
        hints: ['Kotak putih bertulis **MP4 720**, dengan anak panah kecil.', 'Bukan butang hijau **Download**; ia hanya membuka iklan.'],
        ok: '**Betul!** Senarai kualiti terbuka.',
        vo: 'm4-sf-muat', screen: 'sf-muat', leadsTo: 'sf-senarai',
      }),
    },
    {
      id: 'm4-sf-senarai', kind: 'shot', tone: 'peach', kicker: 'Langkah 2 · savefrom', title: 'Pilih MP4 360',
      keynote: 'MP4 360 = muat turun percuma terus.',
      views: both({
        ...yt('m4-sf-senarai', SF),
        caption: '**Senarai kualiti** · screenshot sebenar; diuji 29 Okt 2026',
        say: 'Klik **MP4 360**, pilihan percuma yang terus memuat turun. Fail masuk ke folder **Downloads**.',
        hints: ['Baris ketiga dalam senarai hijau.', 'Ia bertulis **MP4 360**.'],
        ok: '**Betul!** Fail dimuat turun. Kalau tab iklan terbuka, tutup tab itu.',
        vo: 'm4-sf-senarai', screen: 'sf-senarai', leadsTo: 'fail-dimuat',
      }),
    },
    {
      id: 'm4-ke-downloads-mac', kind: 'explain', os: 'mac', tone: 'mint', kicker: 'Langkah 3 · Ke Footage', title: 'Buka Downloads', vo: 'm4-ke-downloads-mac',
      keynote: 'Command + Space, taip Downloads, Enter.',
      bridge: { from: 'fail-dimuat', to: 'dl-fail' },
      blocks: [
        { t: 'steps', items: ['Tekan **Command + Space**.', 'Taip **Downloads**.', 'Tekan **Enter**.'] },
        { t: 'flow', title: 'Tiga tekan', steps: [{ icon: 'type', title: 'Command + Space', at: 0 }, { icon: 'chat', title: 'Taip Downloads', at: 1 }, { icon: 'folder', title: 'Tekan Enter', at: 2 }] },
      ],
    },
    {
      id: 'm4-ke-downloads-win', kind: 'explain', os: 'win', tone: 'mint', kicker: 'Langkah 3 · Ke Footage', title: 'Buka Downloads', vo: 'm4-ke-downloads-win',
      keynote: 'Butang Windows, taip Downloads, Enter.',
      bridge: { from: 'fail-dimuat', to: 'dl-fail' },
      blocks: [
        { t: 'steps', items: ['Tekan butang **Windows**.', 'Taip **Downloads**.', 'Tekan **Enter**.'] },
        { t: 'flow', title: 'Tiga tekan', steps: [{ icon: 'laptop', title: 'Butang Windows', at: 0 }, { icon: 'chat', title: 'Taip Downloads', at: 1 }, { icon: 'folder', title: 'Tekan Enter', at: 2 }] },
      ],
    },
    {
      id: 'm4-dl-fail', kind: 'shot', tone: 'mint', kicker: 'Langkah 3 · Ke Footage', title: 'Pilih fail video',
      keynote: 'Fail baru ada di Downloads.',
      views: {
        mac: {
          ...fromShot('desk/m4-dl-fail'), frame: 'screen',
          caption: '**Downloads di Mac** · screenshot sebenar, fail lain disorok',
          say: 'Klik kanan pada fail video yang baru dimuat turun.',
          hints: ['Ikon video dengan butang main.', 'Klik kanan: dua jari pada trackpad, atau butang kanan tetikus.'],
          ok: '**Betul!** Menu kecil muncul.',
          vo: 'm4-dl-fail-mac', screen: 'dl-fail', leadsTo: 'dl-menu',
        },
        win: {
          ...fromShot('win/m4-win-dl'), frame: 'screen',
          caption: '**Downloads di File Explorer**',
          say: 'Klik sekali pada fail video yang baru dimuat turun.',
          hints: ['Baris yang jenisnya **MP4 Video**.', 'Namanya sama dengan tajuk video YouTube.'],
          ok: '**Betul!** Fail itu dipilih.',
          vo: 'm4-dl-fail-win', screen: 'dl-fail', leadsTo: 'dl-menu',
        },
      },
    },
    {
      id: 'm4-dl-menu', kind: 'shot', tone: 'mint', kicker: 'Langkah 3 · Ke Footage', title: 'Klik Copy',
      keynote: 'Copy = salin fail.',
      views: {
        mac: {
          ...fromShot('desk/m4-dl-menu'), frame: 'screen',
          caption: '**Menu klik kanan fail** · screenshot sebenar',
          say: 'Klik **Copy**.',
          hints: ['Di bawah **Quick Look**.', 'Ada ikon dua helai kertas.'],
          ok: '**Betul!** Fail disalin.',
          vo: 'm4-dl-menu-mac', screen: 'dl-menu', leadsTo: 'fail-disalin',
        },
        win: {
          ...fromShot('win/m4-win-copy'), frame: 'screen',
          caption: '**Butang Copy di File Explorer**',
          say: 'Klik **Copy** di baris butang atas.',
          hints: ['Di antara **Cut** dan **Paste**.', 'Fail itu mesti biru dahulu.'],
          ok: '**Betul!** Fail disalin.',
          vo: 'm4-dl-menu-win', screen: 'dl-menu', leadsTo: 'fail-disalin',
        },
      },
    },
    {
      id: 'm4-ke-projek', kind: 'explain', tone: 'mint', kicker: 'Langkah 3 · Ke Footage', title: 'Buka folder projek', vo: 'm4-ke-projek',
      keynote: 'Cari folder projek dengan namanya.',
      bridge: { from: 'fail-disalin', to: 'projek' },
      blocks: [
        { t: 'steps', items: ['Mac: tekan **Command + Space**. Windows: tekan butang **Windows**.', 'Taip nama folder projek awak, contohnya **2026-10-29 Iklan Bekam**.', 'Tekan **Enter**.'] },
        { t: 'flow', title: 'Sama macam tadi', steps: [{ icon: 'type', title: 'Buka carian', at: 0 }, { icon: 'chat', title: 'Taip nama projek', at: 1 }, { icon: 'folder', title: 'Tekan Enter', at: 2 }] },
      ],
    },
    {
      id: 'm4-projek', kind: 'shot', tone: 'mint', kicker: 'Langkah 3 · Ke Footage', title: 'Buka Footage',
      keynote: 'Klik dua kali Footage.',
      views: {
        mac: { ...fromShot('desk/m4-projek'), frame: 'screen', caption: '**Folder projek** · screenshot sebenar', say: 'Klik dua kali folder **Footage**.', hints: ['Folder biru di sebelah kiri.', 'Bukan **RAW**; RAW untuk rakaman telefon.'], ok: '**Betul!** Folder Footage terbuka. Ia masih kosong.', vo: 'm4-projek', screen: 'projek', leadsTo: 'footage-kosong' },
        win: { ...fromShot('win/m4-win-projek'), frame: 'screen', caption: '**Folder projek** · File Explorer', say: 'Klik dua kali folder **Footage**.', hints: ['Baris folder kuning yang pertama.', 'Bukan **RAW**; RAW untuk rakaman telefon.'], ok: '**Betul!** Folder Footage terbuka. Ia masih kosong.', vo: 'm4-projek', screen: 'projek', leadsTo: 'footage-kosong' },
      },
    },
    {
      id: 'm4-footage', kind: 'shot', tone: 'mint', kicker: 'Langkah 3 · Ke Footage', title: 'Tampal dalam Footage',
      keynote: 'Mac: klik kanan. Windows: Paste.',
      views: {
        mac: { ...fromShot('desk/m4-footage'), frame: 'screen', caption: '**Folder Footage yang kosong** · screenshot sebenar', say: 'Klik kanan pada ruang kosong.', hints: ['Ruang gelap kosong di tengah tetingkap.', 'Klik kanan: dua jari pada trackpad, atau butang kanan tetikus.'], ok: '**Betul!** Menu kecil muncul.', vo: 'm4-footage-mac', screen: 'footage-kosong', leadsTo: 'footage-menu' },
        win: { ...fromShot('win/m4-win-footage'), frame: 'screen', caption: '**Folder Footage yang kosong** · File Explorer', say: 'Klik **Paste** di baris butang atas.', hints: ['Di sebelah kanan **Copy**.', 'Ia bertulis **Paste**.'], ok: '**Betul!** Video masuk ke Footage.', vo: 'm4-footage-win', screen: 'footage-kosong', leadsTo: 'footage-ada' },
      },
    },
    {
      id: 'm4-footage-menu', kind: 'shot', os: 'mac', tone: 'mint', kicker: 'Langkah 3 · Ke Footage', title: 'Klik Paste Item',
      keynote: 'Paste Item = tampal fail.',
      views: both({
        ...fromShot('desk/m4-footage-menu'), frame: 'screen',
        caption: '**Menu klik kanan** · screenshot sebenar',
        say: 'Klik **Paste Item**.',
        hints: ['Pilihan kedua dari atas.', 'Ia muncul hanya bila ada fail yang disalin.'],
        ok: '**Betul!** Video masuk ke Footage.',
        vo: 'm4-footage-menu', screen: 'footage-menu', leadsTo: 'footage-ada',
      }),
    },
    ...(['mac', 'win'] as const).map((os) => ({
      id: `m4-footage-siap-${os}`, kind: 'explain' as const, os, tone: 'mint' as const, kicker: 'Langkah 3 · Siap', title: 'Latar grid dah dalam Footage', vo: 'm4-footage-siap',
      keynote: 'Ulang untuk muzik, overlay dan light leak.',
      blocks: [
        { t: 'p' as const, text: 'Satu bahan dah masuk. Ulang Langkah 1 hingga 3 untuk tiga bahan lagi, dengan carian dari muka **Empat bahan Footage**.' },
        { t: 'steps' as const, items: ['**Muzik latar**: ikut muka **Muzik latar** seterusnya.', '**Overlay**: film overlay free download.', '**Light leak**: light leak transition free.'] },
        { t: 'img' as const, src: fromShot(os === 'mac' ? 'desk/m4-footage-ada' : 'win/m4-win-footage-ada').img, alt: 'Folder Footage dengan video latar grid', caption: os === 'mac' ? '**Footage** dengan latar grid · screenshot sebenar' : '**Footage** dengan latar grid · paparan contoh Windows' },
      ],
    })),
    {
      id: 'm4-muzik', kind: 'explain', tone: 'butter', kicker: 'Langkah 3 · Muzik latar', title: 'Muzik latar: dua cara', vo: 'm4-muzik',
      keynote: 'Iklan berbayar? Pilih Cara 1.',
      footnotes: ['Lesen Pixabay dan Mixkit membenarkan guna dalam iklan tanpa bayaran. NCS pula percuma untuk creator, tetapi brand yang promosi produk sendiri perlu lesen dari NCS.'],
      blocks: [
        { t: 'p', text: 'Muzik latar masuk folder **Footage** sebagai fail **MP3**. Ada dua cara, dan kedua-duanya percuma. **Cara 1** paling selamat untuk iklan berbayar^1.' },
        {
          t: 'vs',
          left: { title: 'Cara 1 · Pixabay / Mixkit', tag: 'Disyorkan', pick: true, rows: [{ text: 'Butang MP3 terus, tiada laman penukar', ok: true }, { text: 'Boleh dipakai dalam iklan berbayar', ok: true }, { text: 'Lagu viral tiada di sini', ok: false }] },
          right: { title: 'Cara 2 · YouTube + ytmp3', tag: 'Lagu paling banyak', rows: [{ text: 'NCS, instrumental dan lagu cover', ok: true }, { text: 'Lagu berhak cipta: Meta boleh bisu atau tolak iklan', ok: false }, { text: 'Laman penukar penuh iklan pop-up', ok: false }] },
        },
      ],
    },
    {
      id: 'm4-muzik-pixabay', kind: 'explain', tone: 'butter', kicker: 'Langkah 3 · Muzik latar', title: 'Cara 1: Pixabay Music', vo: 'm4-muzik-pixabay',
      keynote: 'Cari instrumental, dengar, muat turun, salin ke Footage.',
      blocks: [
        { t: 'steps', items: ['Buka **pixabay.com/music**. Taip **instrumental**, tekan **Enter**.', 'Klik lagu untuk dengar. Pilih yang tenang, tanpa orang menyanyi.', 'Klik ikon **muat turun** di hujung kanan. MP3 masuk ke **Downloads**.', 'Salin MP3 ke **Footage**, sama cara macam latar grid.'] },
        { t: 'img', src: fromShot('web/m4-pixabay').img, alt: 'Pixabay Music, hasil carian instrumental dengan ikon muat turun di kanan', caption: '**Pixabay Music** · screenshot sebenar · ikon muat turun di hujung kanan setiap lagu' },
        { t: 'note', tone: 'tip', title: 'Mixkit', text: '**mixkit.co/free-stock-music** sama sahaja: dengar, kemudian klik **Download**.' },
      ],
    },
    {
      id: 'm4-muzik-ytmp3', kind: 'explain', tone: 'peach', kicker: 'Langkah 3 · Muzik latar', title: 'Cara 2: YouTube ke MP3', vo: 'm4-muzik-ytmp3',
      keynote: 'Salin pautan, tampal di ytmp3, Convert, Download.',
      blocks: [
        { t: 'steps', items: ['Di YouTube, cari **NCS** atau **instrumental no copyright**. Klik **Share**, kemudian **Copy**.', 'Buka **ytmp3.gl**. Tampal pautan dalam kotak, klik **Convert**.', 'Klik **Download**. MP3 masuk ke **Downloads**, kemudian salin ke **Footage**.'] },
        { t: 'img', src: fromShot('web/m4-ytmp3').img, alt: 'Laman ytmp3.gl dengan kotak pautan YouTube dan butang Convert', caption: '**ytmp3.gl** · screenshot sebenar · format **MP3** sudah dipilih' },
        { t: 'note', tone: 'awas', title: 'Awas hak cipta', text: 'Lagu artis dan lagu cover ada **hak cipta**. Dalam **iklan berbayar**, Meta boleh **bisukan bunyi** atau **tolak iklan**. Tab iklan yang terbuka sendiri: tutup, jangan klik apa-apa di dalamnya.' },
      ],
    },
    {
      id: 'm4-raw-mac', kind: 'explain', os: 'mac', tone: 'pink', kicker: 'Langkah 4 · RAW', title: 'Rakaman iPhone ke folder RAW', vo: 'm4-raw-mac',
      keynote: 'AirDrop ke Mac, kemudian salin ke RAW.',
      footnotes: ['Telefon Android: hantar video ke Google Drive, kemudian download di Mac. Fail masuk ke Downloads juga.'],
      blocks: [
        { t: 'p', text: 'RAW ialah rakaman awak sendiri, contohnya video kedai atau video awak bercakap. Dari iPhone, cara paling senang ialah **AirDrop**^1.' },
        { t: 'steps', items: ['Di iPhone, buka **Photos** dan pilih video.', 'Tekan **Share**, kemudian **AirDrop**.', 'Pilih nama Mac awak. Video masuk ke **Downloads**.', 'Salin video ke folder **RAW**, sama macam tadi.'] },
        { t: 'flow', title: 'Dari iPhone ke RAW', steps: [{ icon: 'phone', title: 'Photos, pilih video', at: 0 }, { icon: 'click', title: 'Share, AirDrop', at: 1 }, { icon: 'laptop', title: 'Pilih Mac awak', at: 2 }, { icon: 'folder', title: 'Salin ke RAW', at: 3 }] },
      ],
    },
    {
      id: 'm4-raw-win', kind: 'explain', os: 'win', tone: 'pink', kicker: 'Langkah 4 · RAW', title: 'Rakaman telefon ke folder RAW', vo: 'm4-raw-win',
      keynote: 'Kabel, DCIM, salin ke RAW.',
      footnotes: ['Pada sesetengah telefon, pilihan itu bertulis **Transfer files**, **File transfer** atau **Pindah fail**.'],
      blocks: [
        { t: 'p', text: 'RAW ialah rakaman awak sendiri, contohnya video kedai atau video awak bercakap. Dari telefon Android, guna **kabel USB**.' },
        { t: 'steps', items: ['Sambung telefon ke komputer dengan kabel USB.', 'Di telefon, pilih **Pindah fail**^1.', 'Di File Explorer, buka **This PC**, nama telefon, **DCIM**, kemudian **Camera**.', 'Salin video ke folder **RAW**, sama macam tadi.'] },
        { t: 'flow', title: 'Dari telefon ke RAW', steps: [{ icon: 'phone', title: 'Sambung kabel', at: 0 }, { icon: 'click', title: 'Pilih Pindah fail', at: 1 }, { icon: 'folder', title: 'DCIM, Camera', at: 2 }, { icon: 'folder', title: 'Salin ke RAW', at: 3 }] },
      ],
    },
    {
      id: 'm4-rumusan', kind: 'quiz', tone: 'pink', kicker: 'Rumusan', title: 'Folder projek dah ada bahan', vo: 'm4-rumusan',
      keynote: 'Footage dari YouTube, RAW dari telefon.',
      blocks: [
        { t: 'p', text: 'Tiga perkara yang awak dah buat dalam modul ini:' },
        { t: 'flow', title: 'Bahan masuk folder projek', steps: [{ icon: 'film', title: 'Cari di YouTube', sub: 'Copy pautan', at: 0 }, { icon: 'browser', title: 'savefrom', sub: 'with low quality, MP4 360', at: 1 }, { icon: 'folder', title: 'Salin ke folder', sub: 'Footage dan RAW', at: 2 }] },
      ],
      questions: [
        { q: 'Di savefrom, klik yang mana?', options: ['Butang biru besar', 'Pautan kecil with low quality'], icons: ['no', 'click'], answer: 1, hint: 'Hampir. Butang biru besar menjual app; pautan kecil yang percuma.' },
        { q: 'Tab iklan terbuka. Apa awak buat?', options: ['Tutup tab itu', 'Klik iklan itu'], icons: ['no', 'warn'], answer: 0, hint: 'Hampir. Jangan klik apa-apa dalam tab iklan; tutup terus.' },
        { q: 'Rakaman telefon masuk folder mana?', options: ['RAW', 'Footage'], icons: ['phone', 'film'], answer: 0, hint: 'Hampir. Footage untuk bahan dari YouTube.' },
      ],
    },
  ],
}
