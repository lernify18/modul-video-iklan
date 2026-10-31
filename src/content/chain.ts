import { inBook, locked } from './pakej'
import type { Chapter, OS, Pakej } from './types'

/**
 * Ubai's rule: click to click, no step skipped. In a strict chapter every screen names itself and the screen its
 * click opens, and the next screen page must be exactly that one. Explain pages may sit between screens; a
 * "do it yourself" checklist may not stand in for screens. A step typed on the keyboard is an explain page with a
 * bridge from one screen to the next. Pages for the other computer or package are not in this reader's chain.
 */
export function chainGaps(chapter: Chapter, os: OS, pakej: Pakej = 'basic'): string[] {
  if (!chapter.strict) return []
  const gaps: string[] = []
  let prev: { id: string; leadsTo?: string } | null = null
  for (const page of chapter.pages) {
    if (page.os && page.os !== os) continue
    // A locked Pro page is a preview, not a step a Basic reader clicks through.
    if (!inBook(page, pakej) || locked(page, pakej)) continue
    if (page.kind === 'check') gaps.push(`${page.id}: checklist in a click-to-click chapter; show the screens instead`)
    if (page.kind === 'explain' && page.bridge) {
      const b = page.bridge
      if (prev && prev.leadsTo !== b.from) gaps.push(`${prev.id} → ${page.id} (${os}): click opens "${prev.leadsTo}" but the step starts from "${b.from}"`)
      prev = { id: page.id, leadsTo: b.to }
      continue
    }
    if (page.kind !== 'shot') continue
    const v = page.views[os]
    if (!v.screen || !v.leadsTo) gaps.push(`${page.id} (${os}): needs screen and leadsTo`)
    if (prev && prev.leadsTo !== v.screen) gaps.push(`${prev.id} → ${page.id} (${os}): click opens "${prev.leadsTo}" but the next screen is "${v.screen}"`)
    prev = { id: page.id, leadsTo: v.leadsTo }
  }
  return gaps
}
