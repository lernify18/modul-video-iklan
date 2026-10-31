import { forPakej } from '../content/pakej'
import { parse } from '../lib/markup'
import { usePakej } from '../lib/sesi'

export function Rich({ text }: { text: string }) {
  const pakej = usePakej()
  return (
    <>
      {parse(forPakej(text, pakej)).map((r, i) => {
        if (r.k === 'b') return <b key={i}>{r.v}</b>
        if (r.k === 'hl') return <span key={i} className="hl">{r.v}</span>
        if (r.k === 'fn') return <sup key={i} className="fr">{r.n}</sup>
        return <span key={i}>{r.v}</span>
      })}
    </>
  )
}
