import { describe, expect, it } from 'vitest'
import { camera, hitTest, inside } from '../../src/lib/stage'

describe('camera', () => {
  it('stays at full view when zoom is not allowed', () => {
    expect(camera([35, 70, 29, 26], 1)).toMatchObject({ scale: 1, inv: '1.000' })
  })

  it('zooms until the focus fills the frame, capped by maxScale', () => {
    expect(camera([35, 70, 29, 26], 10).scale).toBeCloseTo(0.92 / 0.29, 3)
    expect(camera([35, 70, 29, 26], 2.4).scale).toBe(2.4)
  })

  it('never slides past the picture edge', () => {
    const c = camera([0, 90, 10, 10], 3)
    const [x, y] = c.transform.match(/-?[\d.]+%/g)!.map(parseFloat)
    expect(x).toBe(0)
    expect(y).toBeCloseTo(-200, 3)
  })
})

describe('hitTest', () => {
  const box = { left: 100, top: 50, width: 1000, height: 500 }
  it('turns a click into picture percentages and checks the target with tolerance', () => {
    expect(hitTest(box, 600, 300, [[45, 45, 10, 10]], 0)).toEqual({ x: 50, y: 50, hit: true })
    expect(hitTest(box, 548, 300, [[45, 45, 10, 10]], 0).hit).toBe(false)
    expect(hitTest(box, 548, 300, [[45, 45, 10, 10]], 5).hit).toBe(true)
  })
})

describe('inside', () => {
  it('accepts a rect within another and rejects one that pokes out', () => {
    expect(inside([40, 40, 10, 10], [30, 30, 40, 40])).toBe(true)
    expect(inside([40, 40, 40, 10], [30, 30, 40, 40])).toBe(false)
  })
})
