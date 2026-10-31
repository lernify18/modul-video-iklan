import { describe, expect, it } from 'vitest'
import { allPages, bookFor, chapters } from '../../src/content'
import bank from '../../src/content/bank.json' with { type: 'json' }
import { PRO_SKILL } from '../../src/content/pakej'
import { SKILL, SKILL_PROMPT } from '../../src/content/skill'
import type { Page } from '../../src/content/types'

// Ubai, 30 Okt 2026: the book starts from scratch. No prompt from Modul 0 to Modul 6 leans on Ubai's skills: the reader
// writes plain prompts, gets the ads right, then turns them into a skill of their own at the end of Modul 5. Ubai's
// skill (iklan-video, or ubai-videoads for Pro) is a bonus in Modul 7, with prompts to use it in a project they already
// have. Ubai's private skills never reach a learner's computer.
const UBAI_PRIVATE = /(?:^|\s)\/ubai-|(?:^|\s)\/fizudean|skill (==)?fizudean|iklan-umrah-sahabat|iklan\.umrah\.sahabat|suaraubai|iman-ghazi/i
const UBAI_SKILL = new RegExp(`${SKILL}|${PRO_SKILL}`)
/** A skill a prompt calls: a hyphenated slug, a ==filled== slug or a [blank] after "skill". */
const CALLED = /skill\s+(==)?([a-z][a-z0-9]*-[a-z0-9-]*[a-z0-9]|\[[^\]]+\])/gi

const prompts = (p: Page) => (p.kind === 'explain' || p.kind === 'quiz' || p.kind === 'spot' ? p.blocks : [])
  .flatMap((b) => (b.t === 'prompt' ? [b.text, ...(b.example ? [b.example] : [])] : []))
const mainPages = chapters.filter((c) => c.module <= 6).flatMap((c) => c.pages)
// The skill pages of Modul 2 show Ubai's skill text to read, as an example of a skill; they are not prompts to run.
const READ_ONLY = new Set(['m2-skill-isi'])
const mainPrompts = [...mainPages.filter((p) => !READ_ONLY.has(p.id)).flatMap(prompts), ...bank.flatMap((b) => [b.ringkas, b.contoh])].filter(Boolean)

describe('from scratch, no skill until the reader makes one', () => {
  it('the skill file Ubai gives as a bonus has its own name and says when to use it', () => {
    const file = SKILL_PROMPT.slice(SKILL_PROMPT.indexOf('---\n'))
    expect(file).toMatch(new RegExp(`^---\\nname: ${SKILL}\\ndescription: .*Guna bila .*\\n---\\n`))
    expect(SKILL_PROMPT.split('\n').length, 'kept short').toBeLessThanOrEqual(60)
  })

  it('no prompt in Modul 0–6 calls Ubai\'s skill, and only the reader\'s own [nama-skill] is ever called', () => {
    for (const text of mainPrompts) {
      expect(text, text.slice(0, 60)).not.toMatch(UBAI_PRIVATE)
      expect(text, text.slice(0, 60)).not.toMatch(UBAI_SKILL)
      for (const m of text.matchAll(CALLED)) expect(['[nama-skill]', '[nama skill]', 'iklan-kedai-saya'], text.slice(0, 60)).toContain(m[2])
    }
  })

  it('the Modul 5 ad prompt is complete on its own: format, hook, size, rules and how to render', () => {
    const ad = prompts(allPages.find((p) => p.id === 'm5-prompt')!)[0]!
    expect(ad.split('\n')[0]).toMatch(/^Saya nak buat video iklan untuk \[nama produk\]/)
    for (const must of ['POV', 'VO', '1080×1920', 'Hook', 'Klik butang di bawah', '.env', '.ass', '5 sample']) expect(ad).toContain(must)
  })

  it('Modul 5 ends by turning the ads into the reader\'s own skill, after the 20 videos', () => {
    const ids = bookFor('mac').map((b) => b.page.id)
    expect(ids.indexOf('m5-jadikan')).toBeGreaterThan(ids.indexOf('m5-siap'))
    const [jadikan] = prompts(allPages.find((p) => p.id === 'm5-jadikan')!)
    expect(jadikan).toContain('[nama-skill]')
    expect(jadikan).toContain('dah ngam')
    const [guna] = prompts(allPages.find((p) => p.id === 'm5-projek-baru')!)
    expect(guna!.split('\n')[0]).toBe('Guna skill [nama-skill].')
  })

  it('Ubai\'s skill is installed only in the Modul 7 bonus, on both computers', () => {
    for (const os of ['mac', 'win'] as const) {
      const book = bookFor(os)
      const at = book.findIndex((b) => b.page.id === 'm7-skill')
      expect(at, os).toBeGreaterThan(-1)
      expect(book[at]!.chapter.id).toBe('m7')
    }
    expect(prompts(allPages.find((p) => p.id === 'm7-skill')!)).toEqual([SKILL_PROMPT])
  })

  it('the bonus shows how to use Ubai\'s skill in a project the reader already has, and how to merge it into theirs', () => {
    const naik = prompts(allPages.find((p) => p.id === 'm7-guna-projek')!)[0]!
    expect(naik.split('\n')[0]).toBe(`Guna skill ${SKILL} pada folder projek ini.`)
    const gabung = prompts(allPages.find((p) => p.id === 'm7-guna-gabung')!)[0]!
    expect(gabung).toContain('[nama skill saya]')
    expect(gabung).toContain('Jangan buang peraturan saya')
  })
})
