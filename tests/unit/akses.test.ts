import { readFileSync } from 'node:fs'
import { DatabaseSync, type SQLInputValue } from 'node:sqlite'
import { beforeEach, describe, expect, it } from 'vitest'
import { DEMO_KOD, DEMO_KOD_PRO, insertSql, newKod } from '../../tools/jana-kod.ts'
import { COOKIE, handle, MAX_TRIES, normalKod, sha256, type Db, type Env, type Stmt } from '../../worker/akses.ts'

// The Worker's access rules, run against the real migration on SQLite (what D1 is), with a stand-in for the assets.

function d1(db: DatabaseSync): Db {
  const stmt = (sql: string, params: SQLInputValue[] = []): Stmt => ({
    bind: (...v) => stmt(sql, v as SQLInputValue[]),
    first: async <T,>() => (db.prepare(sql).get(...params) as T | undefined) ?? null,
    run: async () => db.prepare(sql).run(...params),
    all: async <T,>() => ({ results: db.prepare(sql).all(...params) as T[] }),
  })
  return {
    prepare: (sql) => stmt(sql),
    batch: async (list) => {
      db.exec('BEGIN')
      for (const s of list) await s.run()
      db.exec('COMMIT')
    },
  }
}

const ASSETS = {
  fetch: async (req: Request) => {
    const path = new URL(req.url).pathname
    const html = path === '/' || path === '/masuk'
    return new Response(`PAGE:${path}`, { headers: { 'content-type': html ? 'text/html' : 'application/octet-stream' } })
  },
}

let db: DatabaseSync
let env: Env
const BASE = 'http://127.0.0.1:5577'

beforeEach(async () => {
  db = new DatabaseSync(':memory:')
  for (const m of ['0001_akses.sql', '0002_pakej.sql']) db.exec(readFileSync(new URL(`../../migrations/${m}`, import.meta.url), 'utf8'))
  db.exec(await insertSql([DEMO_KOD], 'demo', true, 3, 1))
  db.exec(await insertSql([DEMO_KOD_PRO], 'demo-pro', true, 3, 1, 'pro'))
  env = { DB: d1(db), ASSETS }
})

const get = (path: string, cookie?: string, accept = 'text/html') =>
  handle(new Request(BASE + path, { headers: { accept, ...(cookie ? { cookie } : {}) } }), env)

const signIn = (body: unknown, ip = '10.0.0.1', base = BASE) =>
  handle(new Request(base + '/api/masuk', { method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip }, body: JSON.stringify(body) }), env)

const cookieOf = (res: Response) => res.headers.get('set-cookie')!.split(';')[0]!

describe('access codes', () => {
  it('normalises a code the way a buyer might type it', () => {
    expect(normalKod(' demo-lokal 2026 ')).toBe('DEMOLOKAL2026')
  })

  it('new codes avoid letters an older buyer could misread, and the database never holds a code itself', async () => {
    for (let i = 0; i < 50; i++) expect(newKod()).toMatch(/^[A-HJKMNP-Z2-9]{5}-[A-HJKMNP-Z2-9]{5}$/)
    const rows = db.prepare('SELECT * FROM kod_akses').all()
    expect(JSON.stringify(rows)).not.toContain('DEMO')
    expect(rows[0]).toMatchObject({ kod_hash: await sha256('DEMOLOKAL2026'), kongsi: 1 })
  })
})

describe('without a session', () => {
  it('every page shows only the sign-in page, never cached', async () => {
    for (const path of ['/', '/apa-apa']) {
      const res = await get(path)
      expect(res.status).toBe(200)
      expect(await res.text()).toBe('PAGE:/masuk')
      expect(res.headers.get('cache-control')).toBe('no-store')
    }
  })

  it('the book, its pictures and its voice are refused', async () => {
    for (const path of ['/assets/index.js', '/shots/contoh/m6-home.png', '/vo/m1-pembuka.mp3', '/media/umrah_pov_P01.mp4']) {
      expect((await get(path, undefined, '*/*')).status, path).toBe(401)
    }
    expect((await get('/api/sesi', undefined, 'application/json')).status).toBe(401)
  })

  it('the sign-in page itself opens', async () => {
    expect(await (await get('/masuk')).text()).toBe('PAGE:/masuk')
  })
})

describe('signing in', () => {
  it('a right code opens the book with an HttpOnly cookie, and the name comes back', async () => {
    const res = await signIn({ nama: 'Pak Ali', kod: 'demo-lokal-2026' })
    expect(res.status).toBe(200)
    const set = res.headers.get('set-cookie')!
    expect(set).toContain(`${COOKIE}=`)
    expect(set).toContain('HttpOnly')
    expect(set).toContain('SameSite=Lax')
    expect(set).not.toContain('Secure')
    const c = cookieOf(res)
    expect(await (await get('/', c)).text()).toBe('PAGE:/')
    const asset = await get('/vo/m1-pembuka.mp3', c, '*/*')
    expect(asset.status).toBe(200)
    expect(asset.headers.get('cache-control')).toBe('private, max-age=86400')
    expect((await get('/', c)).headers.get('cache-control')).toBe('private, no-cache')
    expect(await (await get('/api/sesi', c, 'application/json')).json()).toEqual({ nama: 'Pak Ali', pakej: 'basic' })
  })

  it('on https the cookie is Secure', async () => {
    const res = await signIn({ nama: 'Pak Ali', kod: DEMO_KOD }, '10.0.0.1', 'https://modul.example')
    expect(res.headers.get('set-cookie')).toContain('Secure')
  })

  it('a wrong, short or nameless try is refused with a plain message', async () => {
    const wrong = await signIn({ nama: 'Pak Ali', kod: 'BUKAN-KOD-INI' })
    expect(wrong.status).toBe(401)
    expect((await wrong.json()).ralat).toContain('tidak dikenali')
    expect((await signIn({ nama: 'Pak Ali', kod: 'ab' })).status).toBe(400)
    expect((await signIn({ nama: '  ', kod: DEMO_KOD })).status).toBe(400)
    expect(wrong.headers.get('set-cookie')).toBeNull()
  })

  it('a whole class signing in on one Wi-Fi is never held up', async () => {
    for (let i = 0; i < MAX_TRIES + 10; i++) expect((await signIn({ nama: 'Pelajar ' + i, kod: DEMO_KOD }, '10.0.0.8')).status).toBe(200)
  })

  it(`after ${MAX_TRIES} failed tries an address waits, even with the right code; another address is not held up`, async () => {
    for (let i = 0; i < MAX_TRIES; i++) expect((await signIn({ nama: 'X', kod: 'SALAH-' + i }, '10.0.0.9')).status).toBe(401)
    const held = await signIn({ nama: 'X', kod: DEMO_KOD }, '10.0.0.9')
    expect(held.status).toBe(429)
    expect((await held.json()).ralat).toContain('15 minit')
    expect((await signIn({ nama: 'Y', kod: DEMO_KOD }, '10.0.0.10')).status).toBe(200)
  })

  it("a buyer's own code stays on its device limit by signing the oldest device out; a shared code has none", async () => {
    db.exec(await insertSql(['ABCDE-FGHJK'], 'pembeli', false, 2))
    const devices = []
    for (let i = 0; i < 3; i++) devices.push(cookieOf(await signIn({ nama: 'Mak Som', kod: 'ABCDE-FGHJK' })))
    expect(await (await get('/', devices[0])).text(), 'oldest device signed out').toBe('PAGE:/masuk')
    expect(await (await get('/', devices[2])).text()).toBe('PAGE:/')
    const shared = []
    for (let i = 0; i < 5; i++) shared.push(cookieOf(await signIn({ nama: 'P' + i, kod: DEMO_KOD }, '10.1.0.' + i)))
    for (const c of shared) expect(await (await get('/', c)).text()).toBe('PAGE:/')
  })

  it('Keluar ends the session and clears the cookie; switching a code off ends its sessions', async () => {
    const c = cookieOf(await signIn({ nama: 'Pak Ali', kod: DEMO_KOD }))
    const out = await handle(new Request(BASE + '/api/keluar', { method: 'POST', headers: { cookie: c } }), env)
    expect(out.headers.get('set-cookie')).toContain('Max-Age=0')
    expect(await (await get('/', c)).text()).toBe('PAGE:/masuk')
    const c2 = cookieOf(await signIn({ nama: 'Pak Ali', kod: DEMO_KOD }))
    db.exec("UPDATE kod_akses SET aktif = 0 WHERE label = 'demo'")
    expect(await (await get('/', c2)).text()).toBe('PAGE:/masuk')
    expect((await signIn({ nama: 'Pak Ali', kod: DEMO_KOD })).status).toBe(401)
  })
})

describe('packages', () => {
  it('a code made before packages existed is Basic; a Pro code says pro', async () => {
    const old = new DatabaseSync(':memory:')
    old.exec(readFileSync(new URL('../../migrations/0001_akses.sql', import.meta.url), 'utf8'))
    old.exec("INSERT INTO kod_akses (kod_hash, kongsi, had, label, aktif, dicipta) VALUES ('x', 1, 3, 'sellhiz-1', 1, 1)")
    old.exec(readFileSync(new URL('../../migrations/0002_pakej.sql', import.meta.url), 'utf8'))
    expect(old.prepare('SELECT pakej FROM kod_akses').get()).toEqual({ pakej: 'basic' })
    const pro = cookieOf(await signIn({ nama: 'Puan Zah', kod: DEMO_KOD_PRO }))
    expect(await (await get('/api/sesi', pro, 'application/json')).json()).toEqual({ nama: 'Puan Zah', pakej: 'pro' })
  })

  it('the Pro skill goes to Pro codes only, and every Pro download is logged with the code and name', async () => {
    const basic = cookieOf(await signIn({ nama: 'Pak Ali', kod: DEMO_KOD }))
    const refused = await get('/pro/ubai-videoads.zip', basic, '*/*')
    expect(refused.status).toBe(403)
    expect(await refused.text()).toContain('Pro sahaja')
    expect((await get('/pro/ubai-videoads.zip', undefined, '*/*')).status, 'no session').toBe(401)
    const pro = cookieOf(await signIn({ nama: 'Puan Zah', kod: DEMO_KOD_PRO }))
    const ok = await get('/pro/ubai-videoads.zip', pro, '*/*')
    expect(ok.status).toBe(200)
    expect(db.prepare('SELECT nama, fail FROM muat_turun').all()).toEqual([{ nama: 'Puan Zah', fail: '/pro/ubai-videoads.zip' }])
    expect(db.prepare('SELECT kod_hash FROM muat_turun').get()).toEqual({ kod_hash: await sha256('DEMOPRO2026') })
  })

  it('the check constraint keeps out a third package', () => {
    expect(() => db.exec("INSERT INTO kod_akses (kod_hash, label, dicipta, pakej) VALUES ('y', 'x', 1, 'gold')")).toThrow()
  })
})
