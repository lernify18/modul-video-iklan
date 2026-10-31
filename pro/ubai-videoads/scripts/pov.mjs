// POV ad: muted footage, black-on-white boxed captions (key line in red), music.
//   node <skill>/scripts/pov.mjs <plan.json>      (run from the project folder; format: references/plan.md)
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { bezel, event, header, povLines, ring, clean } from './ass.mjs'
import { at, ENCODE, ffmpegOrExit, FPS, H, loudWav, probe, readPlan, run, subtitlesFilter, W } from './lib.mjs'

export const COVER = `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1`
/** Pictures decode as full-range (yuvj420p); every beat ends in TV range so the beats join without a re-encode. */
export const TV = 'scale=out_range=tv,format=yuv420p'

/** Card geometry for a still: fitted inside 1000 × 1500, a little above centre. */
export function card(w, h) {
  const fw = Math.min(1000, Math.round((1500 * w) / h))
  const fh = Math.round((fw * h) / w)
  return { fw, fh, ox: Math.round((W - fw) / 2), oy: Math.round((H - fh) / 2 - 120) }
}

/** Camera push on the whole composed frame towards (px, py), reaching `s`× in one second. */
export function zoomFilter(px, py, s) {
  return `zoompan=z='min(1+(${s}-1)*on/${FPS},${s})':x='max(0,min(iw-iw/zoom,${px}-iw/zoom/2))':y='max(0,min(ih-ih/zoom,${py}-ih/zoom/2))':d=1:s=${W}x${H}:fps=${FPS}`
}

/** One still beat: blurred fill behind, the card, a ring that zooms with it, then the captions (not zoomed). */
export function stillGraph(b, img, d, ringAss, capAss) {
  const { fw, fh, ox, oy } = card(img.w, img.h)
  const chain = [
    `[0:v]split=2[a][b]`,
    `[a]${COVER},boxblur=30:2,eq=brightness=-0.25[bg]`,
    `[b]scale=${fw}:${fh},setsar=1[fg]`,
    `[bg][fg]overlay=${ox}:${oy},fps=${FPS},format=yuv420p[c0]`,
  ]
  let last = 'c0'
  if (ringAss) { chain.push(`[${last}]${subtitlesFilter(ringAss)}[c1]`); last = 'c1' }
  if (b.zoom) { chain.push(`[${last}]${zoomFilter(ox + b.zoom.x * fw, oy + b.zoom.y * fh, b.zoom.skala ?? 1.6)}[c2]`); last = 'c2' }
  chain.push(`[${last}]${subtitlesFilter(capAss)},trim=duration=${d},${TV}[out]`)
  return { graph: chain.join(';'), fw, fh, ox, oy }
}

function main() {
  const file = process.argv[2]
  if (!file) { console.error('guna: node scripts/pov.mjs <plan.json>'); process.exit(2) }
  const plan = readPlan(file)
  if (plan.jenis !== 'pov') throw new Error(`${file}: bukan plan POV`)
  const ff = ffmpegOrExit()
  const out = at(plan.out)
  const kerja = join(dirname(out), '.kerja', plan.nama)
  mkdirSync(kerja, { recursive: true })

  const segs = []
  let total = 0
  plan.beat.forEach((b, i) => {
    const d = Number(b.tempoh)
    if (!(d > 0)) throw new Error(`beat ${i}: "tempoh" tiada`)
    const y = b.teks_y ?? plan.teks_y ?? 0.72
    const last = i === plan.beat.length - 1
    let cap = header() + (b.teks?.length ? povLines(b.teks, b.merah ?? [], y, 0, d) : '')
    if (last && plan.cta) cap += event(Math.max(0, d - 2), d, 'Putih', `{\\an5\\pos(${W / 2},${Math.round(H * 0.88)})}${clean(plan.cta)}`, 3)
    const capAss = join(kerja, `b${i}.ass`)
    const seg = join(kerja, `b${i}.mp4`)

    if (b.jenis === 'klip') {
      writeFileSync(capAss, cap)
      run(ff, ['-ss', String(b.mula ?? 0), '-t', String(d), '-i', at(b.fail), '-an', '-vf', `${COVER},fps=${FPS},${subtitlesFilter(capAss)},${TV}`, ...ENCODE, '-t', String(d), seg])
    } else if (b.jenis === 'gambar') {
      const img = probe(ff, at(b.fail))
      const { fw, fh, ox, oy } = card(img.w, img.h)
      let ringAss = null
      if (b.bulatan) {
        ringAss = join(kerja, `b${i}-ring.ass`)
        writeFileSync(ringAss, header() + ring(ox + b.bulatan.x * fw, oy + b.bulatan.y * fh, (b.bulatan.r ?? 0.08) * fw, Math.min(1.1, d * 0.45), d))
      }
      writeFileSync(capAss, cap)
      // Every still has its own length (-t): a looped picture without one never ends.
      const { graph } = stillGraph(b, img, d, ringAss, capAss)
      run(ff, ['-loop', '1', '-framerate', String(FPS), '-t', String(d), '-i', at(b.fail), '-filter_complex', graph, '-map', '[out]', ...ENCODE, '-t', String(d), seg])
    } else if (b.jenis === 'telefon') {
      // A phone-shaped screen only (references/susun-atur.md), scrolled slowly inside a drawn bezel.
      const img = probe(ff, at(b.fail))
      const sw = 820, sh = 1480, sx = 130, sy = 150
      const tall = Math.round((img.h * sw) / img.w)
      const room = Math.max(0, tall - sh)
      const scroll = room > 0 ? `,crop=${sw}:${sh}:0:'min(${room},max(0,t-0.4)/${Math.max(0.5, d - 0.8)}*${room}*${b.skrol ?? 0.6})'` : ''
      writeFileSync(capAss, cap + bezel(sx - 12, sy - 12, sw + 24, Math.min(sh, tall) + 24, 0, d))
      // Behind the phone: the grid from Footage, else the same screen blurred, so the dark bezel stands out.
      const bg = plan.latar ? `[0:v]null[p];[1:v]${COVER},fps=${FPS}[bg]` : `[0:v]split=2[p][q];[q]${COVER},boxblur=30:2,eq=brightness=0.08[bg]`
      const inputs = ['-loop', '1', '-framerate', String(FPS), '-t', String(d), '-i', at(b.fail), ...(plan.latar ? ['-stream_loop', '-1', '-t', String(d), '-i', at(plan.latar)] : [])]
      const graph = `${bg};[p]scale=${sw}:-2,setsar=1${scroll}[s];[bg][s]overlay=${sx}:${sy}:shortest=1,fps=${FPS},${subtitlesFilter(capAss)},trim=duration=${d},${TV}[out]`
      run(ff, [...inputs, '-filter_complex', graph, '-map', '[out]', ...ENCODE, '-t', String(d), seg])
    } else {
      throw new Error(`beat ${i}: jenis "${b.jenis}" tidak dikenali (klip | gambar | telefon)`)
    }
    segs.push(seg)
    total += d
  })

  const list = join(kerja, 'senarai.txt')
  writeFileSync(list, segs.map((s) => `file '${s.replace(/'/g, "'\\''")}'`).join('\n') + '\n')
  const video = join(kerja, 'video.mp4')
  run(ff, ['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', video])

  const wav = join(kerja, 'bunyi.wav')
  if (plan.lagu) loudWav(ff, ['-ss', String(plan.lagu.mula ?? 0), '-t', String(total), '-i', at(plan.lagu.fail)], `[0:a]afade=t=in:d=1,afade=t=out:st=${Math.max(0, total - 1.5)}:d=1.5`, wav)
  else run(ff, ['-f', 'lavfi', '-t', String(total), '-i', 'anullsrc=r=48000:cl=stereo', '-c:a', 'pcm_s16le', wav])
  mkdirSync(dirname(out), { recursive: true })
  run(ff, ['-i', video, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-t', String(total), '-movflags', '+faststart', out])
  console.log(`${plan.nama}: ${out} (${total.toFixed(1)} s)`)
}

if (process.argv[1]?.endsWith('pov.mjs')) {
  try { main() } catch (e) { console.error(e.message); process.exit(1) }
}
