import { mkdirSync, writeFileSync } from 'node:fs'
import type { Tab } from './cdp.ts'
import { autoFocus, pct, PUBLIC, saveShot, type Rect } from './shots.ts'

const VIEW = { width: 1440, height: 900 }

export interface Find {
  /** CSS selector of the click target, or its visible text (exact, trimmed). */
  readonly css?: string
  readonly text?: string
  readonly nth?: number
  /** Private text to soften (names, subscriptions, avatars), and secret values to replace with dots. */
  readonly blur?: readonly string[]
  readonly dots?: readonly string[]
}

/** The target's box in CSS pixels, scrolled into view first; null when it is not on the page. */
export function find(tab: Tab, f: Find): Promise<{ x: number; y: number; width: number; height: number } | null> {
  return tab.eval(`(f) => {
    // css picks the kind of element, text picks which one; either alone works too.
    const all = [...document.querySelectorAll(f.css || 'a, button, [role=button], [role=option], span, div, yt-formatted-string')]
      .filter((e) => !f.text || (e.textContent.trim() === f.text && e.children.length < 4))
    const vis = all.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 })
    const el = vis[f.nth || 0]
    if (!el) return null
    const r0 = el.getBoundingClientRect()
    if (r0.top < 0 || r0.bottom > innerHeight) el.scrollIntoView({ block: 'center' })
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  }`, f)
}

/**
 * Capture the tab as public/shots/web/<id>.png with the target's real box from the page, so a pin never drifts off
 * its button. Blur and dots change the picture only and are undone straight after.
 */
export async function shotWeb(tab: Tab, id: string, f: Find): Promise<{ x: number; y: number; width: number; height: number }> {
  const box = await find(tab, f)
  if (!box) throw new Error(`${id}: target not on the page (${f.css ?? f.text})`)
  await new Promise((r) => setTimeout(r, 400))
  await tab.eval(`(f) => {
    const st = document.createElement('style'); st.id = '__shot'
    st.textContent = (f.blur || []).map((s) => s + '{filter:blur(8px)!important}').join('')
    document.head.appendChild(st)
    window.__undo = []
    for (const s of f.dots || []) for (const e of document.querySelectorAll(s)) { window.__undo.push([e, e.textContent]); e.textContent = '•'.repeat(12) }
  }`, f)
  mkdirSync(`${PUBLIC}/shots/web`, { recursive: true })
  writeFileSync(`${PUBLIC}/shots/web/${id}.png`, await tab.png())
  await tab.eval(`() => { document.getElementById('__shot')?.remove(); for (const [e, t] of window.__undo || []) e.textContent = t }`)
  const url = new URL(await tab.eval<string>('() => location.href'))
  const target: Rect = pct(box, VIEW.width, VIEW.height)
  saveShot(`web/${id}`, {
    img: `/shots/web/${id}.png`, w: VIEW.width * 2, h: VIEW.height * 2, target, focus: autoFocus(target),
    kind: 'web', targetFrom: 'dom', source: `${url.host}${url.pathname}, Chrome`, capturedAt: new Date().toISOString().slice(0, 10),
  })
  console.log(`web/${id}`, JSON.stringify({ target }))
  return box
}

export const centre = (b: { x: number; y: number; width: number; height: number }) => [b.x + b.width / 2, b.y + b.height / 2] as const
