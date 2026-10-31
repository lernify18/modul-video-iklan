import { describe, expect, it } from 'vitest'
import { footnoteRefs, parse, plain } from '../../src/lib/markup'

describe('lesson markup', () => {
  it('splits bold, highlight and footnote marks from plain text', () => {
    expect(parse('Klik **Try Claude** di ==tengah==^1.')).toEqual([
      { k: 'text', v: 'Klik ' },
      { k: 'b', v: 'Try Claude' },
      { k: 'text', v: ' di ' },
      { k: 'hl', v: 'tengah' },
      { k: 'fn', n: 1 },
      { k: 'text', v: '.' },
    ])
  })

  it('leaves prices and lone symbols alone', () => {
    expect(parse('$17 sebulan, 2*3 = 6')).toEqual([{ k: 'text', v: '$17 sebulan, 2*3 = 6' }])
  })

  it('lists footnote numbers and strips marks for plain text', () => {
    expect(footnoteRefs('a^1 b **c**^2')).toEqual([1, 2])
    expect(plain('Pilih **Pro**^2 sekarang')).toBe('Pilih Pro sekarang')
  })
})
