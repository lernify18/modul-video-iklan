import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export type Rect = [number, number, number, number]

/** One captured screen: where its picture lives and where the click target and zoom area sit, in percent. */
export interface ShotEntry {
  img: string
  w: number
  h: number
  target: Rect
  focus: Rect
  kind: 'web' | 'desk' | 'win'
  /** How the target was found: from the page's DOM, from the button label (OCR), or typed in by hand. */
  targetFrom: 'dom' | 'ocr' | 'manual'
  source: string
  capturedAt: string
  dummy?: boolean
  masked?: Rect[]
}

export const ROOT = fileURLToPath(new URL('../../', import.meta.url))
// Tests point these at .tmp so a test run never writes into the book's pictures or manifest.
export const PUBLIC = process.env.SHOTS_PUBLIC ?? ROOT + 'public'
export const MANIFEST = process.env.SHOTS_MANIFEST ?? ROOT + 'src/content/shots.json'

const round = (n: number) => Math.round(n * 100) / 100

export function pct(box: { x: number; y: number; width: number; height: number }, w: number, h: number): Rect {
  return [round((box.x / w) * 100), round((box.y / h) * 100), round((box.width / w) * 100), round((box.height / h) * 100)]
}

/**
 * The area the camera zooms to on a phone: the target plus enough of its surroundings to recognise the screen —
 * at least `minW` by `minH` percent and 1.6 times the target — kept on the picture.
 */
export function autoFocus(t: Rect, minW = 34, minH = 26): Rect {
  const w = Math.min(100, Math.max(minW, t[2] * 1.6))
  const h = Math.min(100, Math.max(minH, t[3] * 1.6))
  const cx = t[0] + t[2] / 2
  const cy = t[1] + t[3] / 2
  const x = Math.min(100 - w, Math.max(0, cx - w / 2))
  const y = Math.min(100 - h, Math.max(0, cy - h / 2))
  return [round(x), round(y), round(w), round(h)]
}

export function readManifest(path = MANIFEST): Record<string, ShotEntry> {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Record<string, ShotEntry>
  } catch {
    return {}
  }
}

export function saveShot(id: string, entry: ShotEntry, path = MANIFEST): void {
  const all = readManifest(path)
  all[id] = entry
  const sorted = Object.fromEntries(Object.entries(all).sort(([a], [b]) => a.localeCompare(b)))
  writeFileSync(path, JSON.stringify(sorted, null, 1) + '\n')
}

export function parseRect(s: string): Rect {
  const n = s.split(',').map(Number)
  if (n.length !== 4 || n.some((v) => !Number.isFinite(v))) throw new Error(`bad rect "${s}", want x,y,w,h in percent`)
  return n as Rect
}

/** Read --flag value pairs; repeated flags collect into arrays. */
export function flags(argv: string[]): { pos: string[]; one: (k: string) => string | undefined; all: (k: string) => string[]; has: (k: string) => boolean } {
  const pos: string[] = []
  const map = new Map<string, string[]>()
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!
    if (a.startsWith('--')) {
      const next = argv[i + 1]
      const v = next !== undefined && !next.startsWith('--') ? (i++, next) : 'true'
      map.set(a.slice(2), [...(map.get(a.slice(2)) ?? []), v])
    } else pos.push(a)
  }
  return { pos, one: (k) => map.get(k)?.[0], all: (k) => map.get(k) ?? [], has: (k) => map.has(k) }
}
