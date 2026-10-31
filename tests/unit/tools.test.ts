import { describe, expect, it } from 'vitest'
import { autoFocus, flags, parseRect, pct } from '../../tools/lib/shots.ts'
import { cueTimes, hashOf, markers } from '../../tools/vo.ts'

describe('shot geometry', () => {
  it('turns a pixel box into picture percentages', () => {
    expect(pct({ x: 144, y: 90, width: 288, height: 45 }, 1440, 900)).toEqual([10, 10, 20, 5])
  })

  it('zoom area holds the target, keeps a readable size and stays on the picture', () => {
    const f = autoFocus([90, 95, 8, 4])
    expect(f[2]).toBeGreaterThanOrEqual(34)
    expect(f[3]).toBeGreaterThanOrEqual(26)
    expect(f[0] + f[2]).toBeLessThanOrEqual(100)
    expect(f[1] + f[3]).toBeLessThanOrEqual(100)
    expect(f[0]).toBeLessThanOrEqual(90)
    expect(f[1]).toBeLessThanOrEqual(95)
  })

  it('reads rects and repeated flags from the command line', () => {
    expect(parseRect('1,2,3,4')).toEqual([1, 2, 3, 4])
    expect(() => parseRect('1,2,3')).toThrow()
    const f = flags(['shot', 'x', '--mask', '1,1,1,1', '--mask', '2,2,2,2', '--click'])
    expect(f.pos).toEqual(['shot', 'x'])
    expect(f.all('mask')).toHaveLength(2)
    expect(f.has('click')).toBe(true)
  })
})

describe('voice cue marks', () => {
  it('strips {klik} and remembers where each one sat', () => {
    expect(markers('Cari kad. {klik}Klik butang.')).toEqual({ plain: 'Cari kad. Klik butang.', at: [10] })
    expect(markers('{klik}Satu. {klik}Dua.')).toEqual({ plain: 'Satu. Dua.', at: [0, 6] })
    expect(markers('Tiada tanda.')).toEqual({ plain: 'Tiada tanda.', at: [] })
  })

  it('times a mark at the next spoken character', () => {
    const chars = [...'ab cd']
    const a = { characters: chars, character_start_times_seconds: [0, 0.1, 0.2, 0.3, 0.4], character_end_times_seconds: [0.1, 0.2, 0.3, 0.4, 0.5] }
    expect(cueTimes([2], a)).toEqual([0.3])
    expect(cueTimes([0], a)).toEqual([0])
  })

  it('changes the hash when the words, voice or model change', () => {
    const h = hashOf('teks', 'v', 'm')
    expect(hashOf('teks', 'v', 'm')).toBe(h)
    expect(hashOf('teks!', 'v', 'm')).not.toBe(h)
    expect(hashOf('teks', 'v', 'm2')).not.toBe(h)
  })
})
