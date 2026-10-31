import { describe, expect, it } from 'vitest'
import { chapters } from '../../src/content'
import { chainGaps } from '../../src/content/chain'
import type { Chapter, Page, ShotView } from '../../src/content/types'

const view = (screen: string, leadsTo: string): ShotView => ({
  img: '/x.png', frame: 'window', caption: 'c', say: 's', target: [10, 10, 5, 5], focus: [0, 0, 50, 50],
  hints: ['a', 'b'], ok: 'ok', screen, leadsTo,
})
const shot = (id: string, screen: string, leadsTo: string): Page => ({ id, kind: 'shot', kicker: 'k', keynote: 'n', views: { mac: view(screen, leadsTo), win: view(screen, leadsTo) } })
const explain: Page = { id: 'terang', kind: 'explain', kicker: 'k', keynote: 'n', blocks: [] }

describe('click-to-click chain', () => {
  it('passes when every click opens the next screen shown, with explain pages in between', () => {
    const c: Chapter = { id: 'c', module: 9, title: 't', strict: true, pages: [shot('a', 'mula', 'login'), explain, shot('b', 'login', 'bayar'), shot('c', 'bayar', 'tamat')] }
    expect(chainGaps(c, 'mac')).toEqual([])
  })

  it('names the gap when a screen is skipped', () => {
    const c: Chapter = { id: 'c', module: 9, title: 't', strict: true, pages: [shot('a', 'mula', 'login'), shot('c', 'bayar', 'tamat')] }
    expect(chainGaps(c, 'win')).toEqual(['a → c (win): click opens "login" but the next screen is "bayar"'])
  })

  it('refuses a checklist standing in for screens', () => {
    const check: Page = { id: 'buat-sendiri', kind: 'check', kicker: 'k', keynote: 'n', blocks: [], items: ['x'], done: 'ok' }
    const c: Chapter = { id: 'c', module: 9, title: 't', strict: true, pages: [shot('a', 'mula', 'login'), check, shot('b', 'login', 'tamat')] }
    expect(chainGaps(c, 'mac')[0]).toContain('checklist in a click-to-click chapter')
  })

  it('accepts a keyboard step that bridges exactly from one screen to the next', () => {
    const bridge = (from: string, to: string): Page => ({ id: 'taip', kind: 'explain', kicker: 'k', keynote: 'n', blocks: [], bridge: { from, to } })
    const ok: Chapter = { id: 'c', module: 9, title: 't', strict: true, pages: [shot('a', 'mula', 'siap'), bridge('siap', 'download'), shot('b', 'download', 'tamat')] }
    expect(chainGaps(ok, 'mac')).toEqual([])
    const wrong: Chapter = { id: 'c', module: 9, title: 't', strict: true, pages: [shot('a', 'mula', 'siap'), bridge('lain', 'download'), shot('b', 'download', 'tamat')] }
    expect(chainGaps(wrong, 'mac')[0]).toContain('starts from "lain"')
  })

  it('follows each computer through its own pages only', () => {
    const only = (p: Page, os: 'mac' | 'win'): Page => ({ ...p, os })
    const c: Chapter = { id: 'c', module: 9, title: 't', strict: true, pages: [shot('a', 'mula', 'dmg'), only(shot('m', 'dmg', 'app'), 'mac'), only(shot('w', 'mula-x', 'app'), 'win'), shot('b', 'app', 'tamat')] }
    expect(chainGaps(c, 'mac')).toEqual([])
    expect(chainGaps(c, 'win')).toEqual(['a → w (win): click opens "dmg" but the next screen is "mula-x"'])
  })

  it('holds for every strict chapter in the book, for Basic and for Pro readers', () => {
    for (const ch of chapters) for (const os of ['mac', 'win'] as const) for (const pakej of ['basic', 'pro'] as const) {
      expect(chainGaps(ch, os, pakej), `${ch.id} ${os} ${pakej}`).toEqual([])
    }
  })
})
