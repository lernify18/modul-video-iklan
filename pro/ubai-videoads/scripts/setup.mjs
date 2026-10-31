// Once per project: an ffmpeg that can draw .ass captions, and Arial Black copied where libass will find it.
//   node <skill>/scripts/setup.mjs
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { arch, platform } from 'node:process'
import { join } from 'node:path'
import { findFfmpeg, PROJ } from './lib.mjs'

const major = Number(process.versions.node.split('.')[0])
if (major < 20) {
  console.error(`Node ${process.versions.node} terlalu lama. Perlu Node 20 atau lebih baru.`)
  process.exit(2)
}

const FONTS = {
  darwin: ['/System/Library/Fonts/Supplemental/Arial Black.ttf', '/Library/Fonts/Arial Black.ttf'],
  win32: ['C:\\Windows\\Fonts\\ariblk.ttf'],
  linux: ['/usr/share/fonts/truetype/msttcorefonts/Arial_Black.ttf'],
}
const font = (FONTS[platform] ?? []).find(existsSync)
const dir = join(PROJ, 'alat', 'fonts')
if (font) {
  mkdirSync(dir, { recursive: true })
  copyFileSync(font, join(dir, 'ArialBlack.ttf'))
  console.log(`fon: Arial Black → ${dir}`)
} else {
  console.log('fon: Arial Black tiada; libass akan guna fon tebal terdekat.')
}

const ff = findFfmpeg()
if (ff) {
  console.log(`ffmpeg: ${ff} (ada "subtitles")`)
  console.log('Sedia.')
} else {
  const mac = arch === 'arm64' ? 'arm64' : 'amd64'
  console.log('ffmpeg dengan "subtitles" tiada. Muat turun versi static ke folder alat/ projek (tanpa kata laluan admin):')
  if (platform === 'darwin') {
    console.log(`  mkdir -p alat && cd alat`)
    console.log(`  curl -L -o ffmpeg.zip https://ffmpeg.martin-riedl.de/redirect/latest/macos/${mac}/release/ffmpeg.zip && unzip -o ffmpeg.zip`)
    console.log(`  curl -L -o ffprobe.zip https://ffmpeg.martin-riedl.de/redirect/latest/macos/${mac}/release/ffprobe.zip && unzip -o ffprobe.zip`)
    console.log('  chmod +x ffmpeg ffprobe && cd ..')
  } else if (platform === 'win32') {
    console.log('  mkdir alat; cd alat')
    console.log('  curl.exe -L -o ffmpeg.zip https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip')
    console.log('  tar -xf ffmpeg.zip; copy ffmpeg-*\\bin\\ff*.exe .; cd ..')
  } else {
    console.log('  Pasang ffmpeg yang dibina dengan libass (pakej "ffmpeg" Linux biasanya sudah ada).')
  }
  console.log('Kemudian jalankan setup.mjs sekali lagi.')
  process.exit(1)
}
