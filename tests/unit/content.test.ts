import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { allPages, bookFor, vo } from '../../src/content'
import type { Block, InfoStep, Page, Rect } from '../../src/content/types'
import { footnoteRefs } from '../../src/lib/markup'
import { inside } from '../../src/lib/stage'

const publicFile = (p: string) => new URL('../../public' + p, import.meta.url)
const inPicture = (r: Rect) => r[0] >= 0 && r[1] >= 0 && r[2] > 0 && r[3] > 0 && r[0] + r[2] <= 100.01 && r[1] + r[3] <= 100.01

function blockText(b: Block): string[] {
  switch (b.t) {
    case 'p': case 'lead': return [b.text]
    case 'steps': return [...b.items]
    case 'note': return [b.text]
    case 'price': return [b.text]
    case 'img': case 'video': return [b.caption]
    case 'pair': return b.items.map((i) => i.caption)
    case 'table': return [...b.rows.flat(), b.caption ?? '']
    case 'prompt': return [b.note ?? '']
    case 'road': return b.stops.flatMap(stepText)
    case 'flow': return b.steps.flatMap(stepText)
    case 'tree': return [b.q, b.sub ?? '', ...stepText(b.yes), ...stepText(b.no)]
    case 'tiles': return b.items.flatMap(stepText)
    case 'bars': return b.rows.map((r) => r.label)
    case 'loop': return [b.centre, ...b.nodes.flatMap(stepText)]
    case 'outcome': return [b.text]
    case 'stats': return b.items.flatMap((i) => [i.n, i.label])
    case 'download': return [b.label, b.meta, b.next]
    case 'badge': return [b.text]
    default: return []
  }
}

const stepText = (s: InfoStep) => [s.title, s.sub ?? '']

/** Every infographic step on a page, with the voice cue it waits for. */
function infoSteps(p: Page): InfoStep[] {
  const fromBlocks = blocksOf(p).flatMap((b): readonly InfoStep[] => {
    switch (b.t) {
      case 'road': return b.stops
      case 'flow': return b.steps
      case 'tree': return [b.yes, b.no]
      case 'tiles': return b.items
      case 'loop': return b.nodes
      default: return []
    }
  })
  return p.kind === 'spot' ? [...fromBlocks, ...p.items.flatMap((i) => i.flow ?? [])] : fromBlocks
}

// The pages Ubai approved filling on 29 Okt 2026 (artifact Hj5WyXo6LufAs3f5Pkxm6p); the bank pages are added below.
const FILLED = ['m0-pembuka', 'm0-teka', 'm1-pembuka', 'm1-glosari', 'm1-komponen-a', 'm1-komponen-b', 'm1-vo-pov-kuiz',
  'm1-rumusan', 'm2-pembuka', 'm2-formula', 'm2-formula-kuiz', 'm2-ubah', 'm2-ubah-2', 'm2-rumusan', 'm3-pembuka', 'm3-l1-terang', 'm3-rumusan']
const INFO_BLOCKS = new Set<Block['t']>(['road', 'flow', 'tree', 'tiles', 'bars', 'loop'])

function media(b: Block): string[] {
  switch (b.t) {
    case 'img': return [b.src]
    case 'pair': return b.items.map((i) => i.src)
    case 'video': return [b.src, b.poster]
    case 'download': return [b.href]
    default: return []
  }
}

function blocksOf(p: Page): Block[] {
  switch (p.kind) {
    case 'explain': case 'quiz': case 'spot': return [...p.blocks]
    case 'check': return [...p.blocks, ...(p.after ?? [])]
    case 'shot': return []
  }
}

function texts(p: Page): string[] {
  switch (p.kind) {
    case 'explain': return p.blocks.flatMap(blockText)
    case 'shot': return [p.views.mac.say, p.views.mac.caption, p.views.win.say, p.views.win.caption]
    case 'check': return [...p.blocks.flatMap(blockText), ...p.items, ...(p.after ?? []).flatMap(blockText)]
    case 'quiz': return p.blocks.flatMap(blockText)
    case 'spot': return p.blocks.flatMap(blockText)
  }
}

function voIds(p: Page): string[] {
  const ids = p.vo ? [p.vo] : []
  if (p.kind === 'shot') for (const v of Object.values(p.views)) if (v.vo) ids.push(v.vo)
  return ids
}

describe('book content', () => {
  it('has unique page ids', () => {
    const ids = allPages.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives each computer a whole book, numbered without gaps', () => {
    for (const os of ['mac', 'win'] as const) expect(bookFor(os).map((p) => p.no)).toEqual(bookFor(os).map((_, i) => i + 1))
  })

  for (const page of allPages) {
    describe(page.id, () => {
      it('links every footnote mark to a footnote, and every footnote is used', () => {
        const refs = new Set(texts(page).flatMap(footnoteRefs))
        const notes = page.footnotes?.length ?? 0
        for (const n of refs) expect(n, `^${n} without footnote`).toBeLessThanOrEqual(notes)
        for (let n = 1; n <= notes; n++) expect(refs.has(n), `footnote ${n} never referenced`).toBe(true)
      })

      it('has a voice clip on disk for every voice id', () => {
        for (const id of voIds(page)) {
          expect(vo[id], `vo.json lacks ${id}`).toBeDefined()
          expect(existsSync(publicFile(`/vo/${id}.mp3`)), `missing public/vo/${id}.mp3`).toBe(true)
        }
      })

      it('has every picture and video it shows on disk', () => {
        for (const src of blocksOf(page).flatMap(media)) expect(existsSync(publicFile(src)), `missing public${src}`).toBe(true)
      })

      it('gives every prompt card a fill-in place the learner can see, and none to a prompt pasted as it is', () => {
        for (const b of blocksOf(page)) {
          if (b.t !== 'prompt') continue
          if (b.fixed) expect(b.text, b.title).not.toMatch(/\[[^\]]+\]/)
          else expect(b.text, b.title).toMatch(/\[[^\]]+\]/)
        }
      })

      it('fills an example only where the template has a blank, and labels every line of a parts prompt', () => {
        for (const b of blocksOf(page)) {
          if (b.t !== 'prompt') continue
          if (b.example) {
            expect(b.example, b.title).toMatch(/==[^=]+==/)
            expect(b.example.replace(/==[^=]+==/g, '[x]').replace(/\[[^\]]+\]/g, '[x]'), `${b.title}: example strays from the template`)
              .toBe(b.text.replace(/\[[^\]]+\]/g, '[x]'))
          }
          if (b.parts) expect(b.parts.length, b.title).toBe(b.text.split('\n').length)
        }
      })

      it('lets every infographic step wait only for a cue its voice really has', () => {
        const cues = page.vo ? (vo[page.vo]?.cues.length ?? 0) : 0
        for (const s of infoSteps(page)) if (s.at !== undefined) expect(s.at, s.title).toBeLessThan(cues)
      })

      if (page.kind !== 'spot' && page.kind !== 'shot') {
        it('lights a step at every {klik} cue of its voice, none left unused', () => {
          const ats = new Set([...infoSteps(page).map((s) => s.at), ...blocksOf(page).flatMap((b) => (b.t === 'tree' || b.t === 'loop' ? [b.at] : b.t === 'bars' ? b.rows.map((r) => r.at) : []))]
            .filter((n): n is number => n !== undefined))
          const cues = page.vo ? (vo[page.vo]?.cues.length ?? 0) : 0
          if (ats.size || cues) expect([...ats].sort((x, y) => x - y), page.vo).toEqual(Array.from({ length: cues }, (_, i) => i))
        })
      }

      if (FILLED.includes(page.id) || page.id.startsWith('m2-bank-')) {
        it('has the infographic Ubai approved for its empty space', () => {
          const drawn = blocksOf(page).some((b) => INFO_BLOCKS.has(b.t) || (b.t === 'prompt' && !!b.parts)) || (page.kind === 'spot' && page.items.every((i) => i.flow?.length))
          expect(drawn).toBe(true)
          if (page.id.startsWith('m2-bank-')) expect(blocksOf(page).some((b) => b.t === 'prompt' && !!b.example)).toBe(true)
        })
      }

      if (page.kind === 'shot') {
        it('keeps each click target on the picture and inside its zoom area, for Mac and Windows', () => {
          for (const [os, v] of Object.entries(page.views)) {
            expect(existsSync(publicFile(v.img)), `${os}: missing ${v.img}`).toBe(true)
            expect(inPicture(v.target), `${os}: target off picture`).toBe(true)
            expect(inPicture(v.focus), `${os}: focus off picture`).toBe(true)
            expect(inside(v.target, v.focus), `${os}: target outside focus`).toBe(true)
            for (const l of v.labels ?? []) expect(l.at.every((n) => n >= 0 && n <= 100), `${os}: label ${l.text} off picture`).toBe(true)
            for (const id of v.vo ? [v.vo] : []) expect(vo[id]?.cues.length, `${os}: ${id} has no cue to move the cursor`).toBeGreaterThan(0)
          }
        })
      }

      if (page.kind === 'spot') {
        it('has a cue per part and every part on the picture', () => {
          expect(existsSync(publicFile(page.img))).toBe(true)
          for (const it of page.items) if (it.img) expect(existsSync(publicFile(it.img)), it.img).toBe(true)
          for (const it of page.items) for (const r of it.rects) expect(inPicture(r), it.name).toBe(true)
          if (page.vo) expect(vo[page.vo]?.cues.length).toBe(page.items.length)
        })
      }
    })
  }
})
