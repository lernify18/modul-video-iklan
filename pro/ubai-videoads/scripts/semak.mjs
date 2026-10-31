// Before handing over: three frames of every video (0.5 s, middle, end) to look at, its length and its loudness.
//   node <skill>/scripts/semak.mjs out/<tarikh>_<apa>
import { spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { at, ffmpegOrExit, probe, run } from './lib.mjs'

const dir = at(process.argv[2] ?? '')
if (!process.argv[2]) { console.error('guna: node scripts/semak.mjs <folder out>'); process.exit(2) }
const ff = ffmpegOrExit()
const semak = join(dir, 'semak')
mkdirSync(semak, { recursive: true })
let bad = 0
for (const f of readdirSync(dir).filter((x) => x.endsWith('.mp4')).sort()) {
  const file = join(dir, f), name = f.replace(/\.mp4$/, '')
  const { dur } = probe(ff, file)
  ;[0.5, dur / 2, Math.max(0, dur - 0.5)].forEach((t, i) => run(ff, ['-ss', t.toFixed(2), '-i', file, '-frames:v', '1', '-vf', 'scale=540:-2', join(semak, `${name}_${i + 1}.jpg`)]))
  const m = spawnSync(ff, ['-hide_banner', '-nostats', '-i', file, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  const lufs = Number(JSON.parse(m.stderr.slice(m.stderr.lastIndexOf('{'), m.stderr.lastIndexOf('}') + 1)).input_i)
  const vo = /^VO/i.test(name)
  const okDur = vo ? dur >= 20 && dur <= 31 : dur >= 15 && dur <= 31
  const okLufs = Math.abs(lufs + 14) <= 1
  if (!okDur || !okLufs) bad++
  console.log(`${okDur && okLufs ? '✓' : '✗'} ${name}: ${dur.toFixed(1)} s ${okDur ? '' : '(tempoh!)'} · ${lufs.toFixed(1)} LUFS ${okLufs ? '' : '(perlu -14 ±1)'} · gambar: semak/${name}_1..3.jpg`)
}
console.log('Lihat setiap gambar semak: hook terbaca, muka tak tertutup, ejaan betul, tiada nombor telefon.')
process.exit(bad ? 1 : 0)
