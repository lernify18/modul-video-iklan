import { describe, expect, it } from 'vitest'
import { allPages, bookFor, vo } from '../../src/content'
import voScript from '../../src/content/vo-script.json' with { type: 'json' }
import { forPakej, inBook, locked, PRO_SKILL, skillFor } from '../../src/content/pakej'
import { SKILL } from '../../src/content/skill'
import type { Page } from '../../src/content/types'

// Ubai, 30 Okt 2026: Basic and Pro read one book. Basic installs the short skill; Pro calls its own skill everywhere,
// and Pro pages stay in a Basic book, locked.

const prompts = (p: Page) => (p.kind === 'explain' ? p.blocks : []).flatMap((b) => (b.t === 'prompt' ? [b.text] : []))

describe('packages', () => {
  it('a Pro book leaves out the Basic install pages; a Basic book keeps them', () => {
    for (const os of ['mac', 'win'] as const) {
      const basic = bookFor(os, 'basic').map((b) => b.page.id)
      const pro = bookFor(os, 'pro').map((b) => b.page.id)
      expect(basic).toContain('m7-skill')
      expect(pro).not.toContain('m7-skill')
      expect(pro).toContain('m7-pro-muat')
      expect(pro).toContain('m5-prompt')
      expect(pro.map((_, i) => i + 1)).toEqual(bookFor(os, 'pro').map((b) => b.no))
    }
  })

  it('a Pro reader\'s prompts call ubai-videoads, never the Basic skill', () => {
    expect(skillFor('pro')).toBe(PRO_SKILL)
    expect(skillFor('basic')).toBe(SKILL)
    for (const p of allPages.filter((p) => inBook(p, 'pro'))) {
      for (const t of prompts(p)) expect(forPakej(t, 'pro'), p.id).not.toContain(SKILL)
    }
    const naik = prompts(allPages.find((p) => p.id === 'm7-guna-projek')!)[0]!
    expect(forPakej(naik, 'pro').split('\n')[0]).toBe(`Guna skill ${PRO_SKILL} pada folder projek ini.`)
    expect(forPakej(naik, 'basic')).toBe(naik)
    const ad = prompts(allPages.find((p) => p.id === 'm5-prompt')!)[0]!
    expect(forPakej(ad, 'pro'), 'the ad prompt names no skill, so both packages read the same').toBe(ad)
  })

  it('a Pro page is hidden from Basic unless it is the locked preview; a Basic-only page is never shown to Pro', () => {
    const page = { id: 'x', kind: 'explain', kicker: 'k', keynote: 'k', blocks: [] } as const
    expect(inBook({ ...page, pakej: 'pro' }, 'basic')).toBe(false)
    expect(inBook({ ...page, pakej: 'pro', kunci: true }, 'basic')).toBe(true)
    expect(locked({ ...page, pakej: 'pro', kunci: true }, 'basic')).toBe(true)
    expect(locked({ ...page, pakej: 'pro' }, 'pro')).toBe(false)
    expect(inBook({ ...page, pakej: 'basic' }, 'pro')).toBe(false)
    expect(inBook(page, 'pro') && inBook(page, 'basic')).toBe(true)
  })
})

describe('voice for Pro readers', () => {
  it('every clip a Pro reader hears that names the Basic skill has a Pro twin naming ubai-videoads', () => {
    const script = voScript as Record<string, { text: string }>
    const heard = new Set(['mac', 'win'].flatMap((os) => bookFor(os as 'mac' | 'win', 'pro').flatMap((b) => [b.page.vo, ...(b.page.kind === 'shot' ? Object.values(b.page.views).map((v) => v.vo) : [])])))
    for (const id of heard) {
      if (!id || !script[id]?.text.includes(SKILL)) continue
      expect(script[`${id}-pro`]?.text, id).toBe(script[id]!.text.replaceAll(SKILL, PRO_SKILL))
      expect(vo[`${id}-pro`], `${id}-pro clip`).toBeDefined()
    }
  })
})
