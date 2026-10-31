import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { allPages, chapters, vo, voUrl } from '../../src/content'
import voScript from '../../src/content/vo-script.json' with { type: 'json' }

// Ubai, 31 Okt 2026: umrah stays as a case study, but the pages that teach from an example use Ubai's own digital
// product, without its name and without its price: the Ad Library proof, the caption-and-proof frame, the POV + VO
// pair and the caption written by Claude.
const DIGITAL = ['m0-bukti', 'm1-komponen-b', 'm5-hasil', 'm6-cw', 'm6-cw-hasil']
const CLIENT_OR_NAME = /umrah|ikhlas|air\s?asia|kpk\/ln|kidzy|bina game ai|jawi kids|math kids|kids baca|kids tracing/i
const PRICE = /RM\s?\d|ringgit/i

const page = (id: string) => {
  const p = allPages.find((x) => x.id === id)
  if (!p) throw new Error(`no page ${id}`)
  return p
}

describe('the digital example pages', () => {
  it.each(DIGITAL)('%s names no client, no product and no price', (id) => {
    const text = JSON.stringify(page(id))
    expect(text).not.toMatch(CLIENT_OR_NAME)
    expect(text).not.toMatch(PRICE)
  })

  it.each(DIGITAL)('the voice of %s names no client, no product and no price', (id) => {
    const said = (voScript as Record<string, { text: string }>)[page(id).vo ?? id]?.text ?? ''
    expect(said).not.toMatch(CLIENT_OR_NAME)
    expect(said).not.toMatch(PRICE)
  })

  it('every picture on them is a frame from the digital ads, and the file is there', () => {
    const srcs = DIGITAL.flatMap((id) => JSON.stringify(page(id)).match(/\/media\/[^"]+\.(?:jpg|png|mp4)/g) ?? [])
    expect(srcs.length).toBe(5)
    for (const src of srcs) {
      expect(src).toMatch(/^\/media\/digital[-_]/)
      expect(existsSync(new URL('../../public' + src, import.meta.url)), src).toBe(true)
    }
  })

  it('the number on the caption page is not an order count or a sale, and it has a scene of its own', () => {
    const p = page('m1-komponen-b')
    expect(JSON.stringify(p)).not.toMatch(/order|jualan|sales|pembelian|beli/i)
    if (p.kind !== 'spot') throw new Error('m1-komponen-b is a find-the-part page')
    expect(p.items.map((i) => i.img ?? p.img)).toEqual(['/media/digital-caption.jpg', '/media/digital-angka.jpg'])
  })

  it('the caption format ends on proof and a button, not on a licence', () => {
    const text = JSON.stringify(page('m6-cw-hasil'))
    expect(text).toContain('Bukti')
    expect(text).not.toMatch(/Lesen/)
    expect(JSON.stringify(page('m6-cw'))).toContain('[bukti]')
  })

  it('umrah is still a case study, for a client', () => {
    expect(JSON.stringify(page('m0-umrah'))).toContain('Untuk klien')
  })
})

// Ubai, 31 Okt 2026, later: no price of his own product anywhere in Modul 0, in the text or the voice (the cost per
// purchase read as the price), and no class case study, since buyers of a module distrust one that sells classes.
// Umrah keeps the client's own advertised price.
describe('Modul 0 without a price and without a class case study', () => {
  const m0 = chapters.find((c) => c.module === 0)!.pages
  const said = (id: string) => (voScript as Record<string, { text: string }>)[id]?.text ?? ''

  it('the case studies run digital, bekam, umrah', () => {
    const cases = m0.filter((p) => p.kind === 'explain' && /^Kajian kes \d$/.test(p.kicker ?? ''))
    expect(cases.map((p) => [p.id, p.kicker])).toEqual([['m0-digital', 'Kajian kes 1'], ['m0-bekam', 'Kajian kes 2'], ['m0-umrah', 'Kajian kes 3']])
  })

  it.each(m0.filter((p) => p.id !== 'm0-umrah').map((p) => p.id))('%s shows and says no price and no class', (id) => {
    const p = page(id)
    for (const text of [JSON.stringify(p), said(p.vo ?? id)]) {
      expect(text).not.toMatch(PRICE)
      expect(text).not.toMatch(/kelas|kidzy/i)
    }
  })

  it('no icon draws a price: the target is a bullseye, not «RM»', () => {
    const icons = readFileSync(new URL('../../src/components/Icons.tsx', import.meta.url), 'utf8')
    expect(icons).not.toMatch(/>\s*RM\s*</)
  })

  it('every voice clip is fetched under its own hash, so a re-voiced clip never plays from an old cache', () => {
    for (const [id, clip] of Object.entries(vo)) expect(voUrl(id)).toBe(`/vo/${id}.mp3?v=${clip.hash}`)
    expect(voUrl('m1-komponen-b')).not.toBe(voUrl('m0-bukti'))
  })
})
