// VO ad: ElevenLabs voice with per-word timing, captions that follow the voice (one key word yellow), the hook big on
// top, picture cards over the grid from Footage, music 15 dB under the voice.
//   node <skill>/scripts/vo.mjs <plan.json>      (run from the project folder; format: references/plan.md)
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { capWords, clean, event, header, hookLines, ring } from './ass.mjs'
import { at, ENCODE, env, ffmpegOrExit, FPS, H, loudWav, probe, readPlan, run, subtitlesFilter, W } from './lib.mjs'
import { COVER, TV, zoomFilter } from './pov.mjs'

/** Words of the script with their start and end in seconds, from ElevenLabs' character timing. */
export function wordTimes(al) {
  const words = []
  let cur = null
  al.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) { if (cur) { words.push(cur); cur = null } return }
    if (!cur) cur = { w: '', start: al.character_start_times_seconds[i], end: 0 }
    cur.w += ch
    cur.end = al.character_end_times_seconds[i]
  })
  if (cur) words.push(cur)
  return words
}

/**
 * Numbers are spelled out for the voice but shown as digits: `papar` maps a spoken phrase to what the caption shows,
 * e.g. {"dua ratus lima puluh ringgit": "RM250"}. The phrase's words become one caption token with their timing.
 */
export function papar(words, map = {}) {
  const norm = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
  const rules = Object.entries(map).map(([k, v]) => ({ parts: k.split(/\s+/).map(norm), v }))
  const out = []
  for (let i = 0; i < words.length; i++) {
    const r = rules.find((r) => r.parts.every((p, k) => words[i + k] && norm(words[i + k].w) === p))
    if (!r) { out.push(words[i]); continue }
    const lastW = words[i + r.parts.length - 1]
    const tail = lastW.w.match(/[.,!?;:]$/)?.[0] ?? ''
    out.push({ w: r.v + tail, start: words[i].start, end: lastW.end })
    i += r.parts.length - 1
  }
  return out
}

/** 1–3 words per caption; a full stop, comma or pause ends a group early. */
export function groups(words) {
  const out = []
  let g = []
  words.forEach((w, i) => {
    g.push(w)
    const next = words[i + 1]
    const pause = next ? next.start - w.end > 0.35 : true
    if (g.length === 3 || /[.,!?;:]$/.test(w.w) || pause) { out.push(g); g = [] }
  })
  if (g.length) out.push(g)
  return out
}

async function voice(plan, kerja) {
  const id = plan.suara?.voice_id
  const model = plan.suara?.model ?? 'eleven_multilingual_v2'
  if (!id) throw new Error('plan.suara.voice_id tiada (lihat profil.md)')
  const key = env('ELEVENLABS_API_KEY')
  if (!key) throw new Error('ELEVENLABS_API_KEY tiada dalam .env projek')
  const hash = createHash('sha256').update(`${id}|${model}|${plan.skrip}`).digest('hex').slice(0, 12)
  const mp3 = join(kerja, `suara-${hash}.mp3`), json = join(kerja, `suara-${hash}.json`)
  if (!existsSync(mp3)) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${id}/with-timestamps`, {
      method: 'POST', headers: { 'xi-api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify({ text: plan.skrip, model_id: model, voice_settings: { stability: 0.5, similarity_boost: 0.75, speed: 1 } }),
    })
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`)
    const body = await res.json()
    writeFileSync(mp3, Buffer.from(body.audio_base64, 'base64'))
    writeFileSync(json, JSON.stringify(body.alignment))
  }
  return { mp3, alignment: JSON.parse(readFileSync(json, 'utf8')) }
}

/** One card over the grid for [t0, t1): picture, clip or phone screen, with zoom and ring like POV. */
function babak(ff, plan, b, t0, t1, kerja, i) {
  const d = +(t1 - t0).toFixed(3)
  const seg = join(kerja, `v${i}.mp4`)
  const grid = ['-stream_loop', '-1', '-t', String(d), '-i', at(plan.latar)]
  const still = b.jenis !== 'klip'
  const src = still ? ['-loop', '1', '-framerate', String(FPS), '-t', String(d), '-i', at(b.fail)] : ['-ss', String(b.mula ?? 0), '-t', String(d), '-i', at(b.fail)]
  const m = probe(ff, at(b.fail))
  const boxW = b.jenis === 'telefon' ? 600 : 920, boxH = b.jenis === 'telefon' ? 1050 : 1000
  const fw = Math.min(boxW, Math.round((boxH * m.w) / m.h)), fh = Math.round((fw * m.h) / m.w)
  const ox = Math.round((W - fw) / 2), oy = Math.round(260 + (boxH - Math.min(fh, boxH)) / 2)
  const crop = fh > boxH ? `,crop=${fw}:${boxH}:0:'min(${fh - boxH},max(0,t-0.4)/${Math.max(0.5, d - 0.8)}*${fh - boxH}*0.6)'` : ''
  const chain = [`[0:v]${COVER},fps=${FPS}[bg]`, `[1:v]scale=${fw}:${fh},setsar=1${crop},fps=${FPS}[fg]`, `[bg][fg]overlay=${ox}:${oy}:shortest=1,format=yuv420p[c0]`]
  let last = 'c0'
  if (b.bulatan) {
    const ra = join(kerja, `v${i}-ring.ass`)
    writeFileSync(ra, header() + ring(ox + b.bulatan.x * fw, oy + b.bulatan.y * fh, (b.bulatan.r ?? 0.08) * fw, Math.min(1.1, d * 0.45), d))
    chain.push(`[${last}]${subtitlesFilter(ra)}[c1]`); last = 'c1'
  }
  if (b.zoom) { chain.push(`[${last}]${zoomFilter(ox + b.zoom.x * fw, oy + b.zoom.y * fh, b.zoom.skala ?? 1.6)}[c2]`); last = 'c2' }
  chain.push(`[${last}]trim=duration=${d},${TV}[out]`)
  run(ff, [...grid, ...src, '-filter_complex', chain.join(';'), '-map', '[out]', '-an', ...ENCODE, '-t', String(d), seg])
  return seg
}

async function main() {
  const file = process.argv[2]
  if (!file) { console.error('guna: node scripts/vo.mjs <plan.json>'); process.exit(2) }
  const plan = readPlan(file)
  if (plan.jenis !== 'vo') throw new Error(`${file}: bukan plan VO`)
  if (!plan.latar) throw new Error('plan.latar (video grid dari Footage) tiada')
  const ff = ffmpegOrExit()
  const out = at(plan.out)
  const kerja = join(dirname(out), '.kerja', plan.nama)
  mkdirSync(kerja, { recursive: true })

  const { mp3, alignment } = await voice(plan, kerja)
  const words = wordTimes(alignment)
  const total = +(probe(ff, mp3).dur + 0.6).toFixed(2)

  // Scenes start on the word named by dari_kata, else they share the voice evenly.
  const n = plan.babak.length
  const starts = plan.babak.map((b, i) => (i === 0 ? 0 : b.dari_kata != null ? words[Math.min(b.dari_kata, words.length - 1)].start : (total * i) / n))
  const segs = plan.babak.map((b, i) => babak(ff, plan, b, starts[i], i + 1 < n ? starts[i + 1] : total, kerja, i))
  const list = join(kerja, 'senarai.txt')
  writeFileSync(list, segs.map((s) => `file '${s.replace(/'/g, "'\\''")}'`).join('\n') + '\n')
  const video = join(kerja, 'video.mp4')
  run(ff, ['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', video])

  let ass = header()
  const hook = hookLines(plan.hook)
  const hookEnd = Math.min(2.6, words.find((w) => /[.!?]$/.test(w.w))?.end ?? 2.6)
  if (hook.length) ass += event(0, hookEnd, 'Hook', `{\\an8\\pos(${W / 2},170)}${hook.map(clean).join('\\N')}`, 4)
  const gs = groups(papar(words, plan.papar))
  gs.forEach((g, i) => {
    const end = i + 1 < gs.length ? gs[i + 1][0].start : g[g.length - 1].end + 0.4
    ass += capWords(g.map((w) => w.w), plan.kata_kunci ?? [], g[0].start, Math.max(end, g[0].start + 0.35))
  })
  if (plan.cta) ass += event(Math.max(0, total - 2.2), total, 'Putih', `{\\an5\\pos(${W / 2},${Math.round(H * 0.86)})}${clean(plan.cta)}`, 4)
  const capAss = join(kerja, 'caption.ass')
  writeFileSync(capAss, ass)

  // Music 15 dB under the voice (×0.18), then the whole mix to -14 LUFS.
  const wav = join(kerja, 'bunyi.wav')
  const music = plan.lagu ? ['-ss', String(plan.lagu.mula ?? 0), '-t', String(total), '-i', at(plan.lagu.fail)] : []
  const pre = plan.lagu
    ? `[0:a]apad=whole_dur=${total}[v];[1:a]volume=0.18,afade=t=in:d=1,afade=t=out:st=${Math.max(0, total - 1.5)}:d=1.5[m];[v][m]amix=inputs=2:normalize=0:duration=first`
    : `[0:a]apad=whole_dur=${total}`
  loudWav(ff, ['-i', mp3, ...music], pre, wav)
  mkdirSync(dirname(out), { recursive: true })
  run(ff, ['-i', video, '-i', wav, '-filter_complex', `[0:v]${subtitlesFilter(capAss)},${TV}[vv]`, '-map', '[vv]', '-map', '1:a', ...ENCODE, '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-t', String(total), '-movflags', '+faststart', out])
  writeFileSync(join(kerja, 'kata.json'), JSON.stringify(words))
  console.log(`${plan.nama}: ${out} (${total} s, ${words.length} perkataan)`)
}

if (process.argv[1]?.endsWith('vo.mjs')) main().catch((e) => { console.error(e.message); process.exit(1) })
