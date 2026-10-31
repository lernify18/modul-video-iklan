import type { Rect, ShotView } from './types'
import manifest from './shots.json' with { type: 'json' }

interface Entry { img: string; w: number; h: number; target: number[]; focus: number[]; dummy?: boolean }

const all: Record<string, Entry> = manifest

/** Picture, click target and zoom area of a captured screen, as the capture tools recorded them — never typed by hand. */
export function fromShot(id: string): Pick<ShotView, 'img' | 'target' | 'focus' | 'dummy' | 'ratio'> {
  const e = all[id]
  if (!e) throw new Error(`shot "${id}" is not in shots.json; capture it with tools/desk.ts, tools/web.ts or tools/win.ts`)
  return { img: e.img, target: e.target as unknown as Rect, focus: e.focus as unknown as Rect, ratio: Math.round((e.w / e.h) * 1000) / 1000, ...(e.dummy ? { dummy: true } : {}) }
}
