// Shared by every script: where the project is, which ffmpeg to use, and how to run it without hanging.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

export const W = 1080
export const H = 1920
export const FPS = 30
/** Scripts run from the project folder (the one with RAW and Footage). */
export const PROJ = process.cwd()
const EXE = process.platform === 'win32' ? '.exe' : ''

export const at = (p) => resolve(PROJ, p)

/** True when this ffmpeg can draw .ass captions (libass). Homebrew's plain ffmpeg cannot. */
export function hasSubtitles(bin) {
  try {
    const r = spawnSync(bin, ['-hide_banner', '-filters'], { encoding: 'utf8' })
    return r.status === 0 && / subtitles /.test(r.stdout)
  } catch {
    return false
  }
}

export function findFfmpeg() {
  const tries = [process.env.FFMPEG, join(PROJ, 'alat', `ffmpeg${EXE}`), join(PROJ, 'alat', 'bin', `ffmpeg${EXE}`), 'ffmpeg'].filter(Boolean)
  return tries.find(hasSubtitles) ?? null
}

export function ffmpegOrExit() {
  const ff = findFfmpeg()
  if (!ff) {
    console.error('ffmpeg dengan "subtitles" tiada. Jalankan: node <skill>/scripts/setup.mjs')
    process.exit(2)
  }
  return ff
}

/** ffprobe beside the ffmpeg in use, else on PATH. */
export function probeFor(ff) {
  const side = join(dirname(ff), `ffprobe${EXE}`)
  return existsSync(side) ? side : 'ffprobe'
}

/** Run ffmpeg quietly; stderr is collected (never left in a full pipe), and a failure shows its tail. */
export function run(bin, args) {
  const r = spawnSync(bin, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (r.status !== 0) throw new Error(`${bin} gagal:\n${(r.stderr || '').slice(-1500)}`)
  return r
}

export function probe(ff, file) {
  const r = spawnSync(probeFor(ff), ['-v', 'error', '-show_entries', 'format=duration:stream=width,height,codec_type', '-of', 'json', file], { encoding: 'utf8' })
  if (r.status !== 0) throw new Error(`ffprobe gagal: ${file}`)
  const j = JSON.parse(r.stdout)
  const v = (j.streams || []).find((s) => s.codec_type === 'video')
  return { dur: Number(j.format?.duration || 0), w: v?.width || 0, h: v?.height || 0, audio: (j.streams || []).some((s) => s.codec_type === 'audio') }
}

/** Fonts copied by setup.mjs, so libass finds Arial Black on any computer. */
export function fontsDir() {
  const d = join(PROJ, 'alat', 'fonts')
  return existsSync(d) ? d : null
}

/** A path inside an ffmpeg filter: forward slashes, and ':' '\'' escaped. */
export const fpath = (p) => p.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'")

export function subtitlesFilter(assFile) {
  const fd = fontsDir()
  return `subtitles='${fpath(assFile)}'${fd ? `:fontsdir='${fpath(fd)}'` : ''}`
}

export function readPlan(file) {
  const plan = JSON.parse(readFileSync(file, 'utf8'))
  if (!plan.nama || !plan.out || !['pov', 'vo'].includes(plan.jenis)) throw new Error(`${file}: perlu "jenis" (pov|vo), "nama" dan "out"`)
  return plan
}

/** KEY=value lines of the project's .env. */
export function env(name) {
  if (process.env[name]) return process.env[name]
  const f = join(PROJ, '.env')
  if (!existsSync(f)) return null
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && m[1] === name) return m[2].replace(/^["']|["']$/g, '')
  }
  return null
}

/**
 * Audio to -14 LUFS in two passes: measure, then a linear gain. One pass lands 1–2 LU short when music and voice mix.
 * `pre` is the filter chain that builds the mix; the result is written as WAV to `out`.
 */
export function loudWav(ff, inputs, pre0, out) {
  // Voice peaks stop a linear gain reaching -14; a limiter first (level=false: no hidden auto-gain) lets it.
  const pre = `${pre0},alimiter=limit=0.5:attack=5:release=50:level=false`
  const m = spawnSync(ff, ['-hide_banner', '-nostats', ...inputs, '-filter_complex', `${pre},loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json[x]`, '-map', '[x]', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  const j = JSON.parse(m.stderr.slice(m.stderr.lastIndexOf('{'), m.stderr.lastIndexOf('}') + 1))
  const ln = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`
  run(ff, [...inputs, '-filter_complex', `${pre},${ln},aresample=48000[x]`, '-map', '[x]', '-c:a', 'pcm_s16le', out])
  return out
}

export const ENCODE = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS)]
