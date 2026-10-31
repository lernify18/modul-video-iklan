// Ubai's voice for every page, from src/content/vo-script.json. Write {klik} in the text where the cursor should move
// (or a find-the-part label should appear); the cue time is read from ElevenLabs' per-character timestamps.
//
//   node tools/vo.ts [id ...] [--force] [--semak] [--adopt]
//
// Only clips whose text, voice or model changed are made again. --semak transcribes each new clip with whisper so
// brand names can be checked by ear. --adopt records the current text hash for clips already on disk without
// calling ElevenLabs.
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { flags, ROOT } from './lib/shots.ts'

const SETTINGS = { stability: 0.5, similarity_boost: 0.75, speed: 1.0 }
const MARK = '{klik}'

export interface Clip { dur: number; cues: number[]; hash?: string }
export interface Alignment { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] }

/** Strip {klik} marks; return the spoken text and the character index of each mark in it. */
export function markers(text: string): { plain: string; at: number[] } {
  const at: number[] = []
  let plain = ''
  text.split(MARK).forEach((part, i) => {
    if (i > 0) at.push(plain.length)
    plain += part
  })
  return { plain, at }
}

/** Time of each mark: the start of the first spoken character at or after it. */
export function cueTimes(at: number[], a: Alignment): number[] {
  return at.map((i) => {
    let k = Math.min(i, a.characters.length - 1)
    while (k < a.characters.length - 1 && /\s/.test(a.characters[k] ?? '')) k++
    return Math.round((a.character_start_times_seconds[k] ?? 0) * 100) / 100
  })
}

export const hashOf = (text: string, voice: string, model: string) =>
  createHash('sha1').update(JSON.stringify([text, voice, model, SETTINGS])).digest('hex').slice(0, 12)

function env(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const line of readFileSync(ROOT + '.env', 'utf8').split('\n')) {
    const m = /^([A-Z_]+)=(.*)$/.exec(line.trim())
    if (m) out[m[1]!] = m[2]!.replace(/^["']|["']$/g, '')
  }
  return out
}

async function speak(text: string, key: string, voice: string, model: string): Promise<{ mp3: Buffer; a: Alignment }> {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({ text, model_id: model, voice_settings: SETTINGS }),
  })
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${(await r.text()).slice(0, 200)}`)
  const j = (await r.json()) as { audio_base64: string; alignment: Alignment }
  return { mp3: Buffer.from(j.audio_base64, 'base64'), a: j.alignment }
}

function transcribe(mp3: string): string {
  const wav = `${ROOT}.tmp/vo-check.wav`
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp3, '-ar', '16000', '-ac', '1', wav])
  // whisper-cli writes its model-loading log to stderr; only the transcript on stdout is wanted.
  return execFileSync('whisper-cli', ['-m', `${homedir()}/.cache/whisper-cpp/ggml-large-v3-turbo-q5_0.bin`, '-l', 'ms', '-nt', '-np', '-f', wav], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
}

async function main() {
  const f = flags(process.argv.slice(2))
  const e = env()
  const key = e.ELEVENLABS_API_KEY, voice = e.ELEVENLABS_VOICE_ID, model = e.ELEVENLABS_MODEL
  if (!key || !voice || !model) throw new Error('.env needs ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID and ELEVENLABS_MODEL')
  const script = JSON.parse(readFileSync(ROOT + 'src/content/vo-script.json', 'utf8')) as Record<string, { text: string }>
  const voPath = ROOT + 'src/content/vo.json'
  const clips = JSON.parse(readFileSync(voPath, 'utf8')) as Record<string, Clip>
  const ids = f.pos.length ? f.pos : Object.keys(script)

  for (const id of ids) {
    const entry = script[id]
    if (!entry) throw new Error(`${id} not in vo-script.json`)
    const hash = hashOf(entry.text, voice, model)
    const mp3 = `${ROOT}public/vo/${id}.mp3`
    if (f.has('adopt') && clips[id] && existsSync(mp3)) { clips[id] = { ...clips[id]!, hash }; continue }
    if (!f.has('force') && clips[id]?.hash === hash && existsSync(mp3)) continue
    const { plain, at } = markers(entry.text)
    const { mp3: audio, a } = await speak(plain, key, voice, model)
    writeFileSync(mp3, audio)
    const dur = Math.round((a.character_end_times_seconds.at(-1) ?? 0) * 100) / 100
    clips[id] = { dur, cues: cueTimes(at, a), hash }
    console.log(id, JSON.stringify(clips[id]))
    if (f.has('semak')) console.log('  whisper:', transcribe(mp3))
  }
  const sorted = Object.fromEntries(Object.entries(clips).sort(([x], [y]) => x.localeCompare(y)))
  writeFileSync(voPath, JSON.stringify(sorted, null, 1) + '\n')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
