import type { CSSProperties } from 'react'
import type { Rect } from '../content/types'

export const centre = (r: Rect): readonly [number, number] => [r[0] + r[2] / 2, r[1] + r[3] / 2]

export const rectStyle = (r: Rect): CSSProperties => ({ left: `${r[0]}%`, top: `${r[1]}%`, width: `${r[2]}%`, height: `${r[3]}%` })

export const pointStyle = (x: number, y: number): CSSProperties => ({ left: `${x}%`, top: `${y}%` })

export function inside(inner: Rect, outer: Rect): boolean {
  return inner[0] >= outer[0] && inner[1] >= outer[1] && inner[0] + inner[2] <= outer[0] + outer[2] && inner[1] + inner[3] <= outer[1] + outer[3]
}

/**
 * Zoom so `focus` fills about 92% of the frame, capped at `maxScale`, then slide it to the centre without
 * showing past the picture's edges. Translate percentages are of the unscaled box, applied after the scale.
 */
export function camera(focus: Rect, maxScale: number): { transform: string; inv: string; scale: number } {
  let s = 1
  if (maxScale > 1) s = Math.max(1, Math.min(maxScale, 0.92 / Math.max(focus[2] / 100, focus[3] / 100)))
  let x = 0
  let y = 0
  if (s > 1) {
    const cx = (focus[0] + focus[2] / 2) / 100
    const cy = (focus[1] + focus[3] / 2) / 100
    x = Math.min(0, Math.max(1 - s, 0.5 - cx * s))
    y = Math.min(0, Math.max(1 - s, 0.5 - cy * s))
  }
  return { transform: `translate(${(x * 100).toFixed(3)}%, ${(y * 100).toFixed(3)}%) scale(${s.toFixed(3)})`, inv: (1 / s).toFixed(3), scale: s }
}

/** Where a click landed, in percent of the (possibly scaled) picture box, and whether it hit any rect with a pixel tolerance. */
export function hitTest(box: { left: number; top: number; width: number; height: number }, clientX: number, clientY: number, rects: readonly Rect[], padPx: number) {
  const x = ((clientX - box.left) / box.width) * 100
  const y = ((clientY - box.top) / box.height) * 100
  const px = (padPx / box.width) * 100
  const py = (padPx / box.height) * 100
  const hit = rects.some((t) => x >= t[0] - px && x <= t[0] + t[2] + px && y >= t[1] - py && y <= t[1] + t[3] + py)
  return { x, y, hit }
}
