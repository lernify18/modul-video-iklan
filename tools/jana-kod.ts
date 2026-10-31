// Access codes for the book, written into D1. Code values are never printed: they go to a git-ignored file in
// .tmp/kod/ for Ubai to place on the Sellhiz purchase page (kongsi) or hand to buyers (unik).
//
//   node tools/jana-kod.ts kongsi <label> [--pakej pro]          one named code every buyer of a package types
//   node tools/jana-kod.ts unik <label> <n> [--had 3] [--pakej pro]   n codes, one per buyer, each on up to --had devices
//   node tools/jana-kod.ts demo                    the local-only preview codes, Basic and Pro (local D1, never production)
//
// --pakej is basic (the default) or pro.
//
// Local D1 by default; --remote writes to the production database and needs Ubai's approval first.
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { normalKod, sha256, type Pakej } from '../worker/akses.ts'
import { flags, ROOT } from './lib/shots.ts'

/** No 0/O, 1/I/L: a code read off a phone screen by an older buyer must not be ambiguous. */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const DEMO_KOD = 'DEMO-LOKAL-2026'
export const DEMO_KOD_PRO = 'DEMO-PRO-2026'

export function newKod(len = 10): string {
  const b = crypto.getRandomValues(new Uint8Array(len))
  const s = [...b].map((x) => ALPHABET[x % ALPHABET.length]).join('')
  return `${s.slice(0, len / 2)}-${s.slice(len / 2)}`
}

const q = (s: string) => `'${s.replace(/'/g, "''")}'`

export async function insertSql(kods: readonly string[], label: string, kongsi: boolean, had: number, now = Date.now(), pakej: Pakej = 'basic'): Promise<string> {
  const rows = await Promise.all(kods.map(async (k) => `(${q(await sha256(normalKod(k)))}, ${kongsi ? 1 : 0}, ${had}, ${q(label)}, 1, ${now}, ${q(pakej)})`))
  return `INSERT OR IGNORE INTO kod_akses (kod_hash, kongsi, had, label, aktif, dicipta, pakej) VALUES\n${rows.join(',\n')};\n`
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const f = flags(process.argv.slice(2))
  const [kind, label = 'demo', n = '1'] = f.pos
  const remote = f.has('remote')
  if (kind === 'demo' && remote) throw new Error('the demo code is for local previews only')
  if (!kind || !['kongsi', 'unik', 'demo'].includes(kind)) {
    console.error('usage: node tools/jana-kod.ts kongsi <label> | unik <label> <n> [--had 3] | demo  [--remote]')
    process.exit(2)
  }
  const pakej = f.one('pakej') ?? 'basic'
  if (pakej !== 'basic' && pakej !== 'pro') throw new Error('--pakej is basic or pro')
  const kods = kind === 'demo' ? [DEMO_KOD] : Array.from({ length: kind === 'unik' ? Number(n) : 1 }, () => newKod())
  const had = Number(f.one('had') ?? 3)
  const sql = kind === 'demo'
    ? (await insertSql([DEMO_KOD], 'demo', true, had)) + (await insertSql([DEMO_KOD_PRO], 'demo-pro', true, had, Date.now(), 'pro'))
    : await insertSql(kods, label, kind !== 'unik', had, Date.now(), pakej)
  const dir = `${ROOT}.tmp/kod`
  mkdirSync(dir, { recursive: true })
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '')
  const base = `${dir}/${stamp}-${kind}-${label}`
  writeFileSync(`${base}.sql`, sql)
  if (kind !== 'demo') writeFileSync(`${base}.csv`, 'kod,label,jenis,pakej\n' + kods.map((k) => `${k},${label},${kind},${pakej}`).join('\n') + '\n')
  execFileSync('pnpm', ['exec', 'wrangler', 'd1', 'execute', 'modul-video-iklan', remote ? '--remote' : '--local', '--file', `${base}.sql`], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] })
  console.log(`${kods.length} kod ${kind} «${label}» (${kind === 'demo' ? 'basic + pro' : pakej}) → D1 ${remote ? 'PRODUCTION' : 'lokal'}${kind === 'demo' ? ` (kod demo lokal: ${DEMO_KOD}, Pro: ${DEMO_KOD_PRO})` : `; nilai dalam ${base}.csv`}`)
}
