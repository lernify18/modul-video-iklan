import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import type { Mode, SpotItem } from '../content/types'
import { Flow } from './Info'
import { Rich } from './Rich'
import { hitTest, pointStyle, rectStyle } from '../lib/stage'
import type { StageHandle } from './ShotStage'

interface Props {
  img: string
  alt: string
  items: readonly SpotItem[]
  mode: Mode
  /** Place the side panel (question, hint, legend) and the phone frame; the page decides the columns. */
  render: (side: ReactNode, phone: ReactNode) => ReactNode
}

/** "Find the part" exercise on a real video frame: Tutorial walks through each part, Latihan asks the learner to tap it. */
export const SpotStage = forwardRef<StageHandle, Props>(function SpotStage({ img, alt, items, mode, render }, ref) {
  const box = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const [got, setGot] = useState<number[]>([])
  const [shown, setShown] = useState<{ i: number; kind: 'area' | 'ok'; label: string } | null>(null)
  const [tries, setTries] = useState(0)
  const [solved, setSolved] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [miss, setMiss] = useState<{ x: number; y: number; k: number } | null>(null)
  const [msg, setMsg] = useState<{ kind: 'hint' | 'good'; text: string } | null>(null)

  const go = (n: number) => {
    setI(n); setTries(0); setSolved(false); setMsg(null); setMiss(null)
    const it = items[n]
    setShown(mode === 'tutor' && it ? { i: n, kind: 'area', label: it.name } : null)
  }

  useEffect(() => { setGot([]); setWaiting(false); go(0) }, [mode, items])
  useEffect(() => { for (const c of items) if (c.img) new Image().src = c.img }, [items])

  useImperativeHandle(ref, () => ({
    prepare: () => { setGot([]); setI(0); setShown(null); setWaiting(true) },
    cue: (n: number) => {
      const it = items[n]
      if (!it) return
      setI(n); setGot((g) => Array.from(new Set([...g, ...Array.from({ length: n }, (_, k) => k)])))
      setShown({ i: n, kind: 'area', label: it.name })
      if (n === items.length - 1) setWaiting(false)
    },
  }), [items])

  const it = items[i]
  const finished = i >= items.length

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (mode === 'tutor' || !it || solved || !box.current) return
    const h = hitTest(box.current.getBoundingClientRect(), e.clientX, e.clientY, it.rects, 6)
    if (h.hit) {
      setSolved(true); setGot((g) => (g.includes(i) ? g : [...g, i]))
      setShown({ i, kind: 'ok', label: 'Betul!' }); setMsg({ kind: 'good', text: '**Betul!** ' + it.why })
      return
    }
    const n = tries + 1
    setTries(n); setMiss({ x: h.x, y: h.y, k: Date.now() })
    if (n === 1) setMsg({ kind: 'hint', text: 'Hampir. ' + it.hint })
    else { setMsg({ kind: 'hint', text: 'Tak apa. Kawasannya bergaris kuning. Klik di dalamnya.' }); setShown({ i, kind: 'area', label: 'Di sini' }) }
  }

  const next = () => {
    if (finished) { setGot([]); go(0); return }
    if (mode === 'tutor') setGot((g) => (g.includes(i) ? g : [...g, i]))
    go(i + 1)
  }

  const say = finished
    ? mode === 'tutor' ? 'Itu tiga komponen utama. Sekarang tukar ke **Latihan** di atas dan cari sendiri.' : `**Latihan lulus, ${items.length} daripada ${items.length}.** Awak boleh kenal komponen video iklan.`
    : waiting ? 'Dengar Ubai. Label muncul ikut suara.'
    : mode === 'tutor' && it ? `**${i + 1}. ${it.name}.** ${it.why}` : it ? `Soalan ${i + 1}/${items.length}: ${it.q}` : ''

  const mark = shown ? items[shown.i] : undefined
  const first = mark?.rects[0]
  const below = first ? first[1] < 18 : false
  const scene = items[shown?.i ?? i] ?? items[items.length - 1]

  const phone = (
      <div className="phone">
        <div className="pstage" ref={box} onClick={onClick} data-testid="spot-stage">
          <img src={scene?.img ?? img} alt={scene?.alt ?? alt} draggable={false} />
          {mark?.rects.map((r, k) => <div key={k} className={(shown?.kind === 'ok' ? 'okring' : 'area') + ' on'} style={rectStyle(r)} />)}
          {first && (
            <div className={'anc callout on' + (below ? ' below' : '')} style={pointStyle(first[0] + first[2] / 2, below ? first[1] + first[3] : first[1])}>
              <div className="bub"><i>{(shown?.i ?? 0) + 1}</i><span>{shown?.label}</span></div>
            </div>
          )}
          {miss && <div key={miss.k} className="anc miss on" style={pointStyle(miss.x, miss.y)}><span /></div>}
        </div>
      </div>
  )
  const side = (
      <div className="spotside">
        <p className="say small"><Rich text={say} /></p>
        {msg && <p className={'msg ' + msg.kind} role="status" data-testid="msg"><Rich text={msg.text} /></p>}
        <ul className="legend">
          {items.map((c, k) => (
            <li key={c.name} className={(got.includes(k) ? 'got' : k === i && !finished ? 'cur' : '') + (c.flow ? ' hasflow' : '')}>
              <span className="lname"><i>{got.includes(k) ? <Tick /> : k + 1}</i>{c.name}</span>
              {c.flow && <Flow steps={c.flow} compact />}
            </li>
          ))}
        </ul>
        {!waiting && (mode === 'tutor' || solved || finished) && (
          <button type="button" className="tb pri" onClick={next}>
            {finished ? 'Ulang' : i < items.length - 1 ? (mode === 'tutor' ? 'Komponen seterusnya' : 'Soalan seterusnya') : 'Selesai'}
          </button>
        )}
      </div>
  )
  return <>{render(side, phone)}</>
})

function Tick() {
  return <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
