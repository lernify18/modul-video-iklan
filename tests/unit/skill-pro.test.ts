import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { header, hookLines, povLines, ring, ts } from '../../pro/ubai-videoads/scripts/ass.mjs'
import { lint } from '../../pro/ubai-videoads/scripts/lint.mjs'
import { groups, papar, wordTimes } from '../../pro/ubai-videoads/scripts/vo.mjs'

// The Pro skill ubai-videoads (Ubai, 30 Okt 2026): Ubai's way, rewritten for every niche, with nothing of his own
// tools, voice, songs or folders; it thinks about the niche first and its engine checks the rules before a render.

const SKILL_DIR = fileURLToPath(new URL('../../pro/ubai-videoads/', import.meta.url))
const ZIP = fileURLToPath(new URL('../../public/pro/ubai-videoads.zip', import.meta.url))
const md = readFileSync(join(SKILL_DIR, 'SKILL.md'), 'utf8')
const files = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? files(join(d, f)) : [join(d, f)]))

const ok = {
  jenis: 'pov', nama: 'POV01', out: 'out/x/POV01.mp4', hook: 'TULIS NAMA ANAK, | SIAP ESOK PAGI', fakta: ['siap 24 jam — bahan.md'],
  beat: [
    { jenis: 'klip', fail: 'public/media/bekam_iman_T01.mp4', tempoh: 3, teks: ['TULIS NAMA ANAK,', 'SIAP ESOK PAGI'] },
    { jenis: 'gambar', fail: 'public/media/bekam_iman_T01.jpg', tempoh: 3, teks: ['3 RASA'] },
    { jenis: 'klip', fail: 'public/media/bekam_iman_T01.mp4', tempoh: 3, teks: ['AMBIL DI PINTU'] },
    { jenis: 'klip', fail: 'public/media/bekam_iman_T01.mp4', tempoh: 3, teks: ['HANTAR 10 KM'] },
    { jenis: 'klip', fail: 'public/media/bekam_iman_T01.mp4', tempoh: 3, teks: ['KLIK BUTANG DI BAWAH'] },
  ],
}
const withText = (t: string) => ({ ...ok, beat: [...ok.beat.slice(0, 4), { ...ok.beat[4]!, teks: [t] }] })

describe('skill ubai-videoads', () => {
  it('is a skill file named ubai-videoads that says when to use it, for any product', () => {
    expect(md).toMatch(/^---\nname: ubai-videoads\ndescription: .*APA-APA produk.*Guna bila .*\n---\n/)
    for (const step of ['Profil Produk', 'Peta Niche', 'Riset pesaing', 'Pendekatan', 'Hook', 'Render', 'Semak dan belajar']) expect(md).toContain(step)
  })

  it('every reference and script it names is in the folder', () => {
    for (const ref of md.match(/(references|scripts)\/[a-z-]+\.(md|mjs)/g) ?? []) expect(existsSync(join(SKILL_DIR, ref)), ref).toBe(true)
  })

  it('carries nothing of Ubai\'s own set-up: no voice, songs, paths, brands or project tools', () => {
    const banned = /0Ofo4kJrKlEEX2Mj8IUB|Music FYP|JENAMA=|pustaka|\/Users\/|kidzy|fizudean|ikhlas|osxphotos|worktree|Antigravity/i
    for (const f of files(SKILL_DIR)) expect(readFileSync(f, 'utf8'), f).not.toMatch(banned)
  })

  it('the download zip holds exactly the skill folder as it is now', () => {
    const list = execFileSync('unzip', ['-l', ZIP], { encoding: 'utf8' })
    for (const f of files(SKILL_DIR)) {
      const rel = 'ubai-videoads/' + f.slice(SKILL_DIR.length)
      const row = list.split('\n').find((l) => l.trim().endsWith(' ' + rel))
      expect(row, `${rel} missing from the zip: run node tools/bina-pro.ts`).toBeDefined()
      expect(Number(row!.trim().split(/\s+/)[0]), `${rel} is stale in the zip: run node tools/bina-pro.ts`).toBe(statSync(f).size)
    }
  })
})

describe('lint', () => {
  it('passes a clean plan', () => {
    expect(lint(ok).err).toEqual([])
  })

  it.each([
    ['nombor telefon', 'WHATSAPP 012-345 6789'],
    ['atribut peribadi', 'AWAK GEMUK? CUBA NI'],
    ['dakwaan kesihatan', 'SEMBUH DALAM 3 HARI'],
    ['janji kewangan', 'UNTUNG PASTI SETIAP BULAN'],
    ['"halal" tanpa', 'KEK HALAL'],
  ])('stops %s', (rule, text) => {
    expect(lint(withText(text)).err.join(' | ')).toContain(rule)
  })

  it('lets "halal" through only with a halal certificate in the profile', () => {
    expect(lint(withText('KEK HALAL'), 'Bukti: sijil halal JAKIM 2026').err).toEqual([])
  })

  it('keeps the hook to 2–3 lines of up to 4 words, and a POV to 15–30 s', () => {
    expect(lint({ ...ok, hook: 'SATU BARIS SAHAJA' }).err.join()).toContain('hook 1 baris')
    expect(lint({ ...ok, hook: 'INI BARIS YANG TERLALU PANJANG | DUA' }).err.join()).toContain('5 perkataan')
    expect(lint({ ...ok, beat: ok.beat.slice(0, 2) }).err.join()).toContain('perlu 15–30')
  })

  it('asks for facts, and a VO script of 45–70 words with a voice', () => {
    const vo = { jenis: 'vo', nama: 'VO01', out: 'o.mp4', hook: 'A B, | C D', fakta: ['x'], skrip: 'satu dua tiga', babak: [] }
    const e = lint(vo).err.join(' | ')
    expect(e).toContain('skrip 3 perkataan')
    expect(e).toContain('voice_id')
    expect(lint({ ...ok, fakta: [] }).err.join()).toContain('fakta')
  })
})

describe('engine pieces', () => {
  const al = (text: string) => ({
    characters: [...text], character_start_times_seconds: [...text].map((_, i) => i * 0.1), character_end_times_seconds: [...text].map((_, i) => i * 0.1 + 0.08),
  })

  it('times each word from the voice, and shows spelled numbers as digits', () => {
    const w = wordTimes(al('Deposit dua ratus ringgit, terus sah.'))
    expect(w.map((x: { w: string }) => x.w)).toEqual(['Deposit', 'dua', 'ratus', 'ringgit,', 'terus', 'sah.'])
    const p = papar(w, { 'dua ratus ringgit': 'RM200' })
    expect(p.map((x: { w: string }) => x.w)).toEqual(['Deposit', 'RM200,', 'terus', 'sah.'])
    expect(p[1].start).toBe(w[1].start)
    expect(p[1].end).toBe(w[3].end)
  })

  it('groups captions in 1–3 words, ending a group at a comma or full stop', () => {
    const g = groups(wordTimes(al('Satu dua tiga empat, lima. Enam')))
    expect(g.map((x: { w: string }[]) => x.map((y) => y.w).join(' '))).toEqual(['Satu dua tiga', 'empat,', 'lima.', 'Enam'])
  })

  it('draws the ring centred on its point (\\an7 with a path around 0,0) and stacks POV lines with a red box', () => {
    const r = ring(710, 788, 160, 1, 3)
    expect(r).toContain('\\an7\\pos(710,788)')
    expect(r).toContain('m 160 0')
    expect(r).toContain('-160 0')
    const lines = povLines(['SEHARI JE,', '26 KEK'], [1], 0.72, 0, 3)
    expect(lines).toMatch(/Putih.*SEHARI JE,/)
    expect(lines).toMatch(/Merah.*26 KEK/)
    expect(ts(83.456)).toBe('0:01:23.46')
    expect(hookLines('A B, | C D')).toEqual(['A B,', 'C D'])
    expect(header()).toContain('PlayResX: 1080')
  })
})
