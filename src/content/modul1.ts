import type { Chapter } from './types'

export const modul1: Chapter = {
  id: 'm1',
  module: 1,
  title: 'Kenal Bahan Sebuah Video',
  pages: [
    {
      id: 'm1-pembuka', kind: 'explain', cover: true, tone: 'lav', kicker: 'Modul 1', title: 'Kenal Bahan Sebuah Video', vo: 'm1-pembuka',
      keynote: 'Kenal nama setiap bahan, baru senang cakap dengan Claude.',
      blocks: [
        { t: 'lead', text: 'Setiap iklan Ubai dibina dari **enam bahan yang sama**. Bila awak kenal nama setiap bahan, awak boleh suruh Claude ubah satu bahagian sahaja, dengan satu ayat.' },
        { t: 'chips', items: ['11 muka', '2 latihan cari komponen', 'Tonton dan klik'] },
        { t: 'outcome', text: 'awak boleh tunjuk setiap bahagian dalam video iklan, dan sebut namanya kepada Claude.' },
        {
          t: 'road', stops: [
            { icon: 'hook', title: 'Hook', sub: 'Ayat besar di saat pertama', at: 0 },
            { icon: 'caption', title: 'Caption', sub: 'Tulisan yang muncul ikut suara', at: 1 },
            { icon: 'film', title: 'B-roll', sub: 'Gambar dan rakaman sebenar', at: 2 },
            { icon: 'zoom', title: 'Angka', sub: 'Angka penting dibesarkan dalam caption', at: 3 },
            { icon: 'grid', title: 'Latar grid', sub: 'Garisan bergerak di belakang', at: 4 },
            { icon: 'click', title: 'CTA', sub: '«Klik butang di bawah»', at: 5 },
          ],
        },
      ],
    },
    {
      id: 'm1-glosari', kind: 'explain', tone: 'sky', kicker: 'Faham dulu', title: 'Kamus kecil video iklan', vo: 'm1-glosari',
      keynote: 'Dua belas perkataan ini cukup untuk seluruh buku.',
      blocks: [
        { t: 'p', text: 'Perkataan ini akan muncul berulang kali. Tak perlu hafal. Bila jumpa perkataan yang lupa, buka semula muka ini dari **Isi kandungan**.' },
        {
          t: 'tiles', items: [
            { icon: 'hook', title: 'Hook', sub: 'Ayat atau gambar di saat pertama yang buat orang berhenti menatal.', at: 0 },
            { icon: 'caption', title: 'Caption', sub: 'Tulisan di skrin. Dalam video VO, ia muncul perkataan demi perkataan ikut suara.', at: 1 },
            { icon: 'film', title: 'B-roll', sub: 'Gambar atau rakaman sebenar yang ditunjuk ketika suara bercerita.', at: 2 },
            { icon: 'svg', title: 'SVG beranimasi', sub: 'Lukisan bergerak yang Claude bina, untuk benda yang tiada gambar (peta, angka, langkah).', at: 3 },
            { icon: 'grid', title: 'Latar grid', sub: 'Garisan petak yang bergerak perlahan di belakang, supaya skrin tak kosong.', at: 4 },
            { icon: 'layers', title: 'Overlay', sub: 'Lapisan nipis di atas video, contohnya habuk filem atau warna kanta.', at: 5 },
            { icon: 'flare', title: 'Light leak', sub: 'Kilauan cahaya oren yang lalu di antara dua babak.', at: 6 },
            { icon: 'mic', title: 'VO', sub: 'Voice-over: video yang ada suara bercerita.', at: 7 },
            { icon: 'phone', title: 'POV', sub: 'Video tanpa suara, dengan kotak tulisan dan lagu, seolah-olah pelanggan bercerita.', at: 8 },
            { icon: 'click', title: 'CTA', sub: 'Call to action: arahan terakhir, contohnya klik butang di bawah.', at: 9 },
            { icon: 'gear', title: 'Render', sub: 'Proses Claude menyiapkan fail video MP4 dari semua bahan.', at: 10 },
            { icon: 'chat', title: 'Prompt', sub: 'Arahan yang awak taip kepada Claude.', at: 11 },
          ],
        },
      ],
    },
    {
      id: 'm1-komponen-a', kind: 'spot', tone: 'butter', kicker: 'Kenal komponen 1', title: 'Hook, B-roll dan latar grid', vo: 'm1-komponen-a',
      keynote: 'Saat pertama: hook besar, gambar sebenar, latar hidup.',
      footnotes: ['Frame dari iklan bekam T01, saat pertama.'],
      blocks: [{ t: 'p', text: 'Saat pertama iklan bekam T01^1: tiga komponen dalam setengah saat.' }],
      img: '/media/bekam-hook.jpg',
      alt: 'Frame pertama iklan bekam: gambar premis condong, hook KERETA SERVIS IKUT JADUAL, BADAN BILA LAGI?, latar grid',
      items: [
        { name: 'Hook 2–3 baris', q: 'Klik pada **hook**.', rects: [[6, 51.5, 88, 21]], why: 'Soalan yang pembeli sendiri fikir, dibaca dalam setengah saat.', hint: 'Cari tulisan putih paling besar.',
          flow: [{ icon: 'chat', title: 'Soalan yang pembeli fikir', at: 0 }, { icon: 'caption', title: '2–3 baris, dibaca ½ saat', at: 0 }, { icon: 'hook', title: 'Perkataan penting kotak kuning', at: 0 }] },
        { name: 'B-roll gambar sebenar', q: 'Klik pada **B-roll** (gambar sebenar).', rects: [[0, 3, 94, 48]], why: 'Gambar premis kedai yang sebenar, dicondongkan sedikit. Gambar sebenar lebih dipercayai dari gambar stok.', hint: 'Lihat gambar kedai di bahagian atas.',
          flow: [{ icon: 'film', title: 'Gambar premis sebenar', at: 1 }, { icon: 'layers', title: 'Dicondongkan sedikit', at: 1 }, { icon: 'yes', title: 'Lebih dipercayai dari stok', at: 1 }] },
        { name: 'Latar grid', q: 'Klik pada **latar grid**.', rects: [[0, 74, 100, 26]], why: 'Garisan petak bergerak perlahan di belakang, jadi bahagian bawah skrin tak nampak kosong.', hint: 'Lihat bahagian bawah, di belakang tulisan.',
          flow: [{ icon: 'grid', title: 'Garisan petak', at: 2 }, { icon: 'video', title: 'Bergerak perlahan', at: 2 }, { icon: 'phone', title: 'Bawah skrin tak kosong', at: 2 }] },
      ],
    },
    {
      id: 'm1-komponen-b', kind: 'spot', tone: 'butter', kicker: 'Kenal komponen 2', title: 'Caption dan angka', vo: 'm1-komponen-b',
      keynote: 'Caption ikut suara. Angka penting dibesarkan.',
      footnotes: ['Frame dari iklan produk digital Ubai: H22 saat ke-3, kemudian H23 saat ke-7.'],
      blocks: [{ t: 'p', text: 'Dua frame dari iklan digital Ubai^1. Caption menulis kata-kata yang sedang disebut. Bila ada angka penting, angka itu dibesarkan dan diwarnakan.' }],
      img: '/media/digital-caption.jpg',
      alt: 'Frame iklan digital H22: telefon dengan skrin game, caption JAWI MATEMATIK',
      items: [
        { name: 'Caption gaya Iman', q: 'Klik pada **caption**.', rects: [[5, 63, 90, 17]], why: 'Tulisan tebal, 2–4 perkataan, muncul ikut suara. Penonton faham walaupun video dibisukan.', hint: 'Cari tulisan kuning besar di bawah telefon.',
          flow: [{ icon: 'mic', title: 'Ubai sebut perkataan', at: 0 }, { icon: 'caption', title: 'Perkataan muncul ikut suara', at: 0 }, { icon: 'phone', title: '2–4 perkataan, tebal', at: 0 }] },
        { name: 'Angka dibesarkan', q: 'Klik pada **angka**.', rects: [[26, 66, 48, 10.5]], why: 'Angka yang penting ditulis paling besar dan berwarna, jadi mata terus nampak walaupun video dibisukan.', hint: 'Cari angka kuning paling besar.',
          img: '/media/digital-angka.jpg', alt: 'Frame iklan digital H23: telefon dengan skrin game, caption DIBINA 100%',
          flow: [{ icon: 'mic', title: 'Ubai sebut angka', at: 1 }, { icon: 'caption', title: 'Angka paling besar', at: 1 }, { icon: 'zoom', title: 'Warna lain, mata terus nampak', at: 1 }] },
      ],
    },
    {
      id: 'm1-cta', kind: 'explain', tone: 'peach', kicker: 'Komponen 6', title: 'CTA: suruh orang klik', vo: 'm1-cta',
      keynote: 'Satu arahan sahaja di hujung: klik butang di bawah.',
      footnotes: ['Ini peraturan iklan Ubai untuk bekam dan umrah: nombor ada pada butang iklan, bukan dalam video.'],
      blocks: [
        { t: 'p', text: 'Di hujung video, suara memberi **satu arahan sahaja**: «klik butang di bawah». Caption menulis perkataan terakhir, **BAWAH**, dan gambar mengajak mata turun ke butang iklan.' },
        { t: 'img', src: '/media/umrah-cta.jpg', alt: 'Frame akhir iklan umrah: jemaah di depan Kaabah, caption BAWAH', caption: 'Saat akhir iklan umrah V01', tall: true },
        { t: 'note', tone: 'awas', title: 'Jangan', text: 'Jangan letak nombor WhatsApp atau harga yang tiada pada poster dalam video^1. Butang iklan sudah ada nombornya.' },
      ],
    },
    {
      id: 'm1-vo-pov', kind: 'explain', tone: 'pink', kicker: 'Dua jenis video', title: 'VO lawan POV', vo: 'm1-vo-pov',
      keynote: 'Perlu terangkan? VO. Nak nampak macam pelanggan bercerita? POV.',
      blocks: [
        { t: 'p', text: 'Kedua-dua iklan ini untuk kedai bekam yang sama. Satu bersuara, satu tanpa suara.' },
        {
          t: 'pair', items: [
            { src: '/media/bekam-vo.jpg', alt: 'Iklan bekam VO: gambar kedai dengan caption kuning RUTIN', tag: 'VO', caption: '**VO**: suara Ubai bercerita, caption ikut suara' },
            { src: '/media/bekam-pov.jpg', alt: 'Iklan bekam POV: belakang pelanggan dengan cawan bekam, kotak putih Bekam tak sakit pun', tag: 'POV', caption: '**POV**: tiada suara, kotak tulisan putih + lagu' },
          ],
        },
        {
          t: 'vs',
          left: { title: 'VO', tag: 'bersuara', rows: [{ ok: true, text: 'Terangkan pakej, harga, apa termasuk' }, { ok: true, text: 'Caption perkataan demi perkataan' }, { ok: false, text: 'Perlu suara (ElevenLabs)' }] },
          right: { title: 'POV', tag: 'tanpa suara', rows: [{ ok: true, text: 'Nampak macam cerita pelanggan' }, { ok: true, text: 'Siap lebih cepat' }, { ok: false, text: 'Kurang ruang untuk terang panjang' }] },
        },
      ],
    },
    {
      id: 'm1-vo-pov-kuiz', kind: 'quiz', tone: 'pink', kicker: 'Semak diri', title: 'VO atau POV?', vo: 'm1-vo-pov-kuiz',
      keynote: 'Pilih jenis video ikut apa yang pembeli perlu tahu.',
      blocks: [
        { t: 'p', text: 'Untuk setiap iklan di sebelah, pilih jenis video yang paling sesuai. Kalau ragu, ikut soalan ini:' },
        {
          t: 'tree', title: 'Cara memilih', q: 'Pembeli perlu tahu banyak perkara?', sub: 'harga, pakej, apa yang termasuk', at: 0,
          yes: { icon: 'mic', title: 'VO', sub: 'Suara Ubai bercerita, caption ikut suara', at: 1 },
          no: { icon: 'phone', title: 'POV', sub: 'Kotak tulisan + lagu, macam cerita pelanggan', at: 2 },
        },
      ],
      questions: [
        { q: 'Iklan pakej umrah: pembeli nak tahu harga, hotel dan apa yang termasuk.', options: ['VO', 'POV'], icons: ['mic', 'phone'], answer: 0, hint: 'Hampir. Banyak perkara perlu diterangkan, jadi suara lebih membantu.' },
        { q: 'Iklan bekam: nak tunjuk pelanggan rasa tak sakit, macam dia sendiri bercerita.', options: ['VO', 'POV'], icons: ['mic', 'phone'], answer: 1, hint: 'Hampir. Cerita pelanggan lebih terasa dengan kotak tulisan dan lagu.' },
      ],
    },
    {
      id: 'm1-iman', kind: 'explain', tone: 'lav', kicker: 'Rujukan gaya', title: 'Gaya Iman Gadzhi', vo: 'm1-iman',
      keynote: 'Gaya Iman = laju, jelas, bukti sebenar.',
      footnotes: ['Iman Gadzhi ialah usahawan muda yang videonya terkenal dengan potongan laju dan caption besar. Ubai guna gayanya sebagai rujukan, bukan tiru videonya.'],
      blocks: [
        { t: 'p', text: 'Iklan VO Ubai merujuk gaya **Iman Gadzhi**^1. Dalam prompt Modul 5, awak minta Claude ikut lima perkara gaya ini:' },
        { t: 'steps', items: ['Caption **perkataan demi perkataan**, ikut suara.', '**2–4 perkataan** sebaris, perkataan penting berwarna.', 'Latar **gelap atau grid**, supaya tulisan jelas.', 'Tukar babak setiap **2–3 saat**.', 'Gambar fakta **sebenar** (brosur, skrin), dizoom ke angka.'] },
        { t: 'img', src: '/media/bekam-vo.jpg', alt: 'Iklan bekam gaya Iman: gambar condong, caption RUTIN berwarna kuning, latar grid gelap', caption: 'Caption kuning satu perkataan di atas gambar sebenar', tall: true },
      ],
    },
    {
      id: 'm1-broll-svg', kind: 'explain', tone: 'mint', kicker: 'Gambar dalam video', title: 'B-roll dan SVG beranimasi', vo: 'm1-broll-svg',
      keynote: 'Ada gambar sebenar? Guna B-roll. Tiada? Minta SVG.',
      footnotes: ['Kedua-dua frame dari video jerebu Ubai (video tanpa muka, suara dan B-roll sahaja).'],
      blocks: [
        { t: 'p', text: 'Ada benda yang boleh dirakam, ada yang tidak. Untuk yang tiada gambar, contohnya peta bacaan jerebu, Claude **melukis sendiri** gambar bergerak yang dipanggil SVG^1.' },
        {
          t: 'pair', items: [
            { src: '/media/jerebu-broll.jpg', alt: 'B-roll: rakaman sebenar kawasan berjerebu', tag: 'B-roll', caption: '**B-roll**: rakaman sebenar' },
            { src: '/media/jerebu-svg.jpg', alt: 'SVG beranimasi: peta Johor dengan tanda bacaan 190 dan 180', tag: 'SVG', caption: '**SVG**: peta yang Claude lukis, angka bergerak' },
          ],
        },
        { t: 'note', tone: 'tip', title: 'Tip', text: 'Dalam prompt, sebut terus: «buat SVG beranimasi untuk [angka atau langkah]». Claude akan lukis dan gerakkan sendiri.' },
      ],
    },
    {
      id: 'm1-sumber', kind: 'explain', tone: 'butter', kicker: 'Bahan tambahan', title: 'Grid, muzik, overlay, light leak', vo: 'm1-sumber',
      keynote: 'Empat bahan tambahan, semua boleh dicari di YouTube.',
      footnotes: ['Cara cari dan muat turun dari YouTube, klik demi klik, ada dalam Modul 4.'],
      blocks: [
        { t: 'p', text: 'Empat bahan ini bukan rakaman awak sendiri. Ia dimuat turun sekali, simpan dalam folder **Footage**, dan dipakai berulang kali^1.' },
        {
          t: 'table', head: ['Bahan', 'Guna untuk', 'Cari di YouTube'],
          rows: [
            ['Latar grid', 'Belakang tulisan', '**grid background animated**'],
            ['Muzik latar', 'Lagu bawah suara', '**NCS** atau **instrumental no copyright**'],
            ['Overlay', 'Rasa filem di atas video', '**film overlay free download**'],
            ['Light leak', 'Peralihan antara babak', '**light leak transition free**'],
          ],
        },
        { t: 'img', src: '/media/lightleak.jpg', alt: 'Contoh light leak: kilauan cahaya oren di atas latar gelap', caption: '**Light leak**: kilauan oren, dari pek Houston Kold' },
      ],
    },
    {
      id: 'm1-rumusan', kind: 'quiz', tone: 'pink', kicker: 'Rumusan', title: 'Awak dah kenal bahan video', vo: 'm1-rumusan',
      keynote: 'Hook, caption, B-roll, angka, grid, CTA.',
      blocks: [
        { t: 'p', text: 'Enam bahan, tiga bahagian video. Ini susunan yang Claude ikut setiap kali:' },
        {
          t: 'flow', title: 'Satu iklan, dari mula ke hujung', steps: [
            { icon: 'hook', title: 'Saat pertama', sub: '**Hook** di atas **B-roll** sebenar, latar grid', at: 0 },
            { icon: 'caption', title: 'Tengah', sub: '**Caption** ikut suara, **angka** penting dibesarkan', at: 1 },
            { icon: 'click', title: 'Hujung', sub: '**CTA**, satu arahan sahaja', at: 2 },
          ],
        },
      ],
      questions: [
        { q: 'Tulisan besar 2–3 baris di saat pertama dipanggil apa?', options: ['Caption', 'Hook', 'CTA'], icons: ['caption', 'hook', 'click'], answer: 1, hint: 'Hampir. Ia yang buat orang berhenti menatal di saat pertama.' },
        { q: 'Garisan petak yang bergerak di belakang dipanggil apa?', options: ['Light leak', 'Latar grid'], icons: ['flare', 'grid'], answer: 1, hint: 'Hampir. Light leak ialah kilauan cahaya oren.' },
        { q: 'Untuk peta bacaan jerebu yang tiada gambar, minta Claude buat apa?', options: ['SVG beranimasi', 'B-roll'], icons: ['svg', 'film'], answer: 0, hint: 'Hampir. B-roll ialah rakaman sebenar; peta ini perlu dilukis.' },
      ],
    },
  ],
}
