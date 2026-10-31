import { z } from 'zod'

/** The parts of D1 this Worker uses; D1Database fits it, and so does the SQLite adapter the unit tests use. */
export interface Stmt {
  bind(...values: unknown[]): Stmt
  first<T = Record<string, unknown>>(): Promise<T | null>
  run(): Promise<unknown>
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>
}
export interface Db {
  prepare(sql: string): Stmt
  batch(stmts: Stmt[]): Promise<unknown>
}
export interface Env {
  DB: Db
  ASSETS: { fetch(req: Request): Promise<Response> }
}

export const COOKIE = 'mv_sesi'
const YEAR = 365 * 24 * 3600
/** Failed tries per address in WINDOW before sign-in pauses. A buyer mistyping a few times never meets it. */
export const MAX_TRIES = 20
export const WINDOW = 15 * 60 * 1000

/** Upper case, letters and digits only: «mv-umrah 2026» and «MVUMRAH2026» are the same code. */
export function normalKod(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function newToken(): string {
  const b = crypto.getRandomValues(new Uint8Array(32))
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function readCookie(req: Request, name = COOKIE): string | null {
  for (const part of (req.headers.get('cookie') ?? '').split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return v.join('=') || null
  }
  return null
}

function cookie(req: Request, value: string, maxAge: number): string {
  const secure = new URL(req.url).protocol === 'https:' ? '; Secure' : ''
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
}

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } })

const MasukBody = z.object({
  nama: z.string().trim().min(1, 'Tulis nama awak.').max(60, 'Nama terlalu panjang.'),
  kod: z.string().max(64).transform(normalKod).pipe(z.string().min(6, 'Kod itu tidak lengkap. Semak semula kod dalam halaman pembelian.')),
})

export type Pakej = 'basic' | 'pro'
export interface Session { nama: string; pakej: Pakej; kodHash: string }

export async function sessionOf(req: Request, env: Env): Promise<Session | null> {
  const token = readCookie(req)
  if (!token) return null
  const row = await env.DB.prepare(
    'SELECT s.nama, k.pakej, k.kod_hash FROM sesi s JOIN kod_akses k ON k.kod_hash = s.kod_hash WHERE s.token_hash = ? AND k.aktif = 1',
  ).bind(await sha256(token)).first<{ nama: string; pakej: string; kod_hash: string }>()
  return row ? { nama: row.nama, pakej: row.pakej === 'pro' ? 'pro' : 'basic', kodHash: row.kod_hash } : null
}

/** Sign in with a name and an access code. */
export async function masuk(req: Request, env: Env, now = Date.now()): Promise<Response> {
  const alamat = req.headers.get('cf-connecting-ip') ?? 'lokal'
  const tries = await env.DB.prepare('SELECT COUNT(*) AS n FROM cubaan WHERE alamat = ? AND masa > ?').bind(alamat, now - WINDOW).first<{ n: number }>()
  if ((tries?.n ?? 0) >= MAX_TRIES) return json({ ralat: 'Terlalu banyak cubaan. Rehat sekejap, cuba lagi dalam 15 minit.' }, 429)
  // Only failures count: a class of buyers signing in on one Wi-Fi must never hold each other up.
  const fail = async (status: number, ralat: string) => {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO cubaan (alamat, masa) VALUES (?, ?)').bind(alamat, now),
      env.DB.prepare('DELETE FROM cubaan WHERE masa < ?').bind(now - 24 * 3600 * 1000),
    ])
    return json({ ralat }, status)
  }

  let raw: unknown
  try { raw = await req.json() } catch { raw = null }
  const parsed = MasukBody.safeParse(raw)
  if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? 'Isi nama dan kod akses.')
  const { nama, kod } = parsed.data

  const kodHash = await sha256(kod)
  const row = await env.DB.prepare('SELECT kongsi, had FROM kod_akses WHERE kod_hash = ? AND aktif = 1').bind(kodHash).first<{ kongsi: number; had: number }>()
  if (!row) return fail(401, 'Kod itu tidak dikenali. Semak semula kod dalam halaman pembelian Sellhiz.')

  const token = newToken()
  const stmts = [env.DB.prepare('INSERT INTO sesi (token_hash, kod_hash, nama, dicipta, dilihat) VALUES (?, ?, ?, ?, ?)').bind(await sha256(token), kodHash, nama, now, now)]
  // A buyer's own code: past its device limit the oldest device is signed out, so the buyer is never locked out.
  if (!row.kongsi) {
    stmts.push(env.DB.prepare(
      'DELETE FROM sesi WHERE kod_hash = ? AND token_hash NOT IN (SELECT token_hash FROM sesi WHERE kod_hash = ? ORDER BY dicipta DESC LIMIT ?)',
    ).bind(kodHash, kodHash, row.had))
  }
  await env.DB.batch(stmts)
  return json({ ok: true, nama }, 200, { 'set-cookie': cookie(req, token, YEAR) })
}

export async function keluar(req: Request, env: Env): Promise<Response> {
  const token = readCookie(req)
  if (token) await env.DB.prepare('DELETE FROM sesi WHERE token_hash = ?').bind(await sha256(token)).run()
  return json({ ok: true }, 200, { 'set-cookie': cookie(req, '', 0) })
}

/** Paths anyone may open: the sign-in page and what it needs. Nothing of the book is here. */
const OPEN = new Set(['/masuk', '/masuk.html', '/favicon.svg', '/robots.txt'])

export async function handle(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url)
  const path = url.pathname
  if (path === '/api/masuk') return req.method === 'POST' ? masuk(req, env) : json({ ralat: 'POST sahaja.' }, 405)
  if (path === '/api/keluar') return req.method === 'POST' ? keluar(req, env) : json({ ralat: 'POST sahaja.' }, 405)
  if (path === '/api/sesi') {
    const s = await sessionOf(req, env)
    return s ? json({ nama: s.nama, pakej: s.pakej }) : json({ ralat: 'Belum log masuk.' }, 401)
  }
  if (path.startsWith('/api/')) return json({ ralat: 'Tiada.' }, 404)
  if (OPEN.has(path)) return env.ASSETS.fetch(req)

  const sesi = await sessionOf(req, env)
  // Pro files (the skill ubai-videoads) go to Pro codes only; each download is logged against the code and name.
  if (sesi && path.startsWith('/pro/')) {
    if (sesi.pakej !== 'pro') return new Response('Untuk pakej Pro sahaja.', { status: 403, headers: { 'cache-control': 'no-store' } })
    if (path.endsWith('.zip')) {
      await env.DB.prepare('INSERT INTO muat_turun (kod_hash, nama, fail, masa) VALUES (?, ?, ?, ?)').bind(sesi.kodHash, sesi.nama, path, Date.now()).run()
    }
  }
  if (!sesi) {
    const page = req.method === 'GET' && (req.headers.get('accept') ?? '').includes('text/html')
    if (!page) return new Response('Perlu log masuk.', { status: 401, headers: { 'cache-control': 'no-store' } })
    const login = await env.ASSETS.fetch(new Request(new URL('/masuk', url), { headers: req.headers }))
    return new Response(login.body, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } })
  }
  const res = await env.ASSETS.fetch(req)
  // The book is for buyers only: no shared cache may keep a copy, and a page is checked again on every visit so
  // signing out takes effect at once.
  const out = new Response(res.body, res)
  const html = (res.headers.get('content-type') ?? '').includes('text/html')
  out.headers.set('cache-control', html ? 'private, no-cache' : 'private, max-age=86400')
  return out
}
