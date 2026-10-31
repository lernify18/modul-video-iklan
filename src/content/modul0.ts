import type { Chapter } from './types'

export const modul0: Chapter = {
  id: 'm0',
  module: 0,
  title: 'Tengok Hasil Dulu',
  pages: [
    {
      id: 'm0-pembuka', kind: 'explain', cover: true, tone: 'lav', kicker: 'Modul 0', title: 'Tengok Hasil Dulu', vo: 'm0-pembuka',
      keynote: 'Tengok hasil dulu. Butang kemudian.',
      blocks: [
        { t: 'lead', text: 'Sebelum belajar satu butang pun, tengok dulu apa yang awak akan hasilkan dengan Claude, dan berapa yang ia jual.' },
        { t: 'chips', items: ['12 minit', 'Tiada butang lagi', 'Tonton sahaja'] },
        { t: 'outcome', text: 'awak tahu rupa video iklan yang akan awak hasilkan, dan kenapa sesetengah iklan menjual lebih murah.' },
        {
          t: 'road', stops: [
            { icon: 'video', title: 'Iklan digital', sub: 'Diedit dengan Claude, 40 jualan', at: 0 },
            { icon: 'folder', title: 'Bekam, umrah', sub: 'Kerja klien: satu folder bahan, puluhan iklan', at: 1 },
            { icon: 'table', title: 'Bukti', sub: 'Hook menentukan kos dan tontonan', at: 2 },
            { icon: 'flag', title: 'Teka', sub: 'Iklan mana yang menang', at: 3 },
          ],
        },
      ],
    },
    {
      id: 'm0-digital', kind: 'explain', tone: 'mint', kicker: 'Kajian kes 1', title: 'Iklan digital: diedit dengan Claude, terbukti jual', vo: 'm0-digital',
      keynote: 'Rakaman telefon biasa + edit Claude = 40 jualan.',
      footnotes: [
        'Diedit dengan Claude dari rakaman telefon Ubai, disiarkan di page Ubaidullah Jaafar. Klip ini 35 saat pertama.',
        'Meta, kempen «Tips SEDIH Struggle», 14–30 Okt 2026, melalui Analitik Sellhiz.',
      ],
      blocks: [
        { t: 'badge', text: 'Terbukti jual · jualan Ubai sendiri', tone: 'bukti' },
        { t: 'p', text: 'Rakaman telefon biasa, diedit dengan Claude^1, dijadikan iklan produk digital Ubai^2.' },
        { t: 'stats', items: [{ n: '53K', label: 'tontonan di page' }, { n: '40', label: 'pembelian' }, { n: '2,246', label: 'klik pada iklan' }, { n: '17 hari', label: 'iklan masih berjalan' }] },
        { t: 'video', src: '/media/digital_bina_kerjaya.mp4', poster: '/media/digital_bina_kerjaya.jpg', caption: '**«BINA KERJAYA saat tiada apa-apa»** · diedit dengan Claude · 35 saat pertama' },
      ],
    },
    {
      id: 'm0-bekam', kind: 'explain', tone: 'pink', kicker: 'Kajian kes 2', title: 'Iklan bekam: satu kedai, puluhan video', vo: 'm0-bekam',
      keynote: 'Bahan kedai sendiri + masalah pelanggan = puluhan iklan.',
      footnotes: ['Kumpulan 50 iklan dari riset permintaan, dihasilkan 15 Okt 2026.', 'Iklan bekam tidak meletak harga, nombor WhatsApp atau sebutan KKM. Nombor ada pada butang iklan.'],
      blocks: [
        { t: 'badge', text: 'Untuk klien', tone: 'klien' },
        { t: 'p', text: 'Bekam Fizudean, kedai bekam lelaki di Pulau Pinang. Pada 15 Okt 2026, Claude hasilkan **50 video iklan**^1 dari gambar dan rakaman kedai itu sendiri.' },
        { t: 'video', src: '/media/bekam_iman_T01.mp4', poster: '/media/bekam_iman_T01.jpg', caption: '**Iklan bekam T01** · gaya Iman, suara Ubai, 28 saat' },
        { t: 'steps', items: ['Gambar dan video kedai, dari page Facebook kedai itu.', 'Lima masalah pelanggan: **tak sakit**, **bekas tak bengkak**, **terapis bertauliah**, **ramai 5 bintang**, **konsultasi percuma**.', 'Peraturan: tiada harga dan tiada nombor telefon dalam video^2.'] },
      ],
    },
    {
      id: 'm0-umrah', kind: 'explain', tone: 'sky', kicker: 'Kajian kes 3', title: 'Iklan umrah: 20 video dari satu folder', vo: 'm0-umrah',
      keynote: 'Satu folder bahan rasmi, dua jenis video, dua puluh iklan.',
      footnotes: ['Bahan dari kit Sahabat ikhlas.com (anak syarikat AirAsia). Harga diambil dari poster rasmi mereka.', 'Kumpulan 20 video dihasilkan dan diluluskan Ubai pada 28 Okt 2026.'],
      blocks: [
        { t: 'badge', text: 'Untuk klien', tone: 'klien' },
        { t: 'p', text: 'Untuk umrah, bahannya ialah satu folder kit rasmi: video TikTok, poster dan brosur^1. Dari folder itu, Claude hasilkan **10 video POV** dan **10 video suara (VO)** dalam satu kumpulan^2.' },
        { t: 'video', src: '/media/umrah_vo_V01.mp4', poster: '/media/umrah_vo_V01.jpg', caption: '**Iklan umrah V01** · VO, 27 saat' },
        { t: 'note', tone: 'tip', title: 'Perhatikan', text: 'Saat pertama terus bertanya soalan yang pembeli fikir: **«Umrah RM5,990 dah termasuk apa?»**' },
      ],
    },
    {
      id: 'm0-bukti', kind: 'explain', tone: 'butter', kicker: 'Bukti', title: 'Hook yang jalan berbulan-bulan', vo: 'm0-bukti',
      keynote: 'Iklan yang lama jalan = iklan yang menjual. Tiru hooknya.',
      footnotes: ['Meta Ad Library, negara Malaysia, iklan video aktif, disemak 31 Okt 2026. Hari dikira dari tarikh iklan mula. Nama pengiklan tidak dipaparkan.'],
      blocks: [
        { t: 'p', text: 'Syarikat tak akan bayar iklan berbulan-bulan kalau iklan itu tak menjual. Jadi sebelum buat video, Ubai semak dulu iklan produk digital yang **paling lama aktif** di Meta Ad Library^1.' },
        { t: 'table', head: ['Iklan produk digital', 'Lama aktif'], rows: [['«Ibu risau anak masih lemah membaca, menulis & mengira?» · worksheet PDF', '~180 hari, 3 hook'], ['«Cara moden mudah anak belajar sains?» · ebook', '~131 hari, 3 salinan'], ['«Cikgu-cikgu, peniaga… berapa kali bulan ni terpaksa siapkan design?» · prompt AI', '~92 hari, 2 salinan']] },
        { t: 'img', src: '/media/digital-hook.jpg', alt: 'Saat pertama iklan digital H20: SURI RUMAH, GAME INI DIBINA TANPA CODING', caption: 'Video H20 guna pola yang sama: sebut siapa pembelinya di saat pertama', tall: true },
      ],
    },
    {
      id: 'm0-hook-kos', kind: 'explain', tone: 'sky', kicker: 'Bukti angka', title: 'Gaya edit sama, hook lain', vo: 'm0-hook-kos',
      keynote: 'Hook yang betul memotong kos setiap jualan lebih separuh.',
      footnotes: ['Tiga video diedit dengan Claude dalam gaya yang sama dan diiklankan di page yang sama. Angka Meta hingga 30 Okt 2026.'],
      blocks: [
        { t: 'p', text: 'Tiga video ini diedit dengan cara yang sama^1. Yang berbeza cuma **hook** di saat pertama.' },
        {
          t: 'bars', title: 'Pembelian dari setiap video', legend: ['Bar = pembelian', 'Pil hijau = kos setiap pembelian, berbanding yang paling murah'],
          rows: [
            { label: '«BINA KERJAYA saat tiada apa-apa»', sub: '53K tontonan', value: 40, shown: '40', pill: 'kos terendah', at: 0 },
            { label: '«Ramai fikir kena pandai coding»', sub: '16K tontonan', value: 10, shown: '10', pill: '2.3× kos', at: 1 },
            { label: '«Game edu ni siap dengan 3 step AI»', sub: '9.6K tontonan', value: 4, shown: '4', pill: '2.3× kos', at: 2 },
          ],
        },
        { t: 'img', src: '/media/bukti-reels.jpg', alt: 'Tab Reels page Ubaidullah Jaafar dengan kiraan tontonan setiap reel', caption: '**Page Ubaidullah Jaafar, tab Reels** · screenshot sebenar, 30 Okt 2026, dipendekkan', left: true },
      ],
    },
    {
      id: 'm0-teka', kind: 'quiz', tone: 'pink', kicker: 'Teka', title: 'Iklan mana yang menang?', vo: 'm0-teka',
      keynote: 'Hook dulu, baru cerita.',
      blocks: [
        { t: 'p', text: 'Guna carta di muka sebelum ini. Tak perlu hafal; ini cuma untuk rasa bagaimana iklan bersaing.' },
        {
          t: 'flow', title: 'Kenapa hook menentukan hasil', steps: [
            { icon: 'hook', title: 'Hook kuat', sub: 'Saat pertama buat orang berhenti', at: 0 },
            { icon: 'video', title: 'Ramai terus tonton', sub: '53K, bukan 9.6K', at: 1 },
            { icon: 'click', title: 'Lebih ramai beli', sub: '40 pembelian, bukan 4', at: 2 },
          ],
        },
      ],
      questions: [
        { q: 'Video mana dapat paling banyak pembelian?', options: ['«Game edu ni siap dengan 3 step AI»', '«BINA KERJAYA saat tiada apa-apa»'], icons: ['phone', 'video'], answer: 1, hint: 'Hampir. Lihat bar paling panjang: BINA KERJAYA dapat 40 pembelian.' },
        { q: 'Ketiga-tiga video diedit dengan gaya yang sama. Apa yang paling menentukan hasil?', options: ['Panjang video', 'Hook saat pertama', 'Warna latar'], icons: ['film', 'hook', 'layers'], answer: 1, hint: 'Hampir. Gaya edit sama; yang beza cuma ayat di saat pertama.' },
      ],
    },
  ],
}
