import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import type { Mode, OS, ShotView } from '../content/types'
import { Rich } from './Rich'
import { hitTest, camera, rectStyle, pointStyle, centre } from '../lib/stage'

export interface StageHandle {
  /** Voice is about to start: park the cursor and wait for cue(). */
  prepare(): void
  cue(i: number): void
}

const reduce = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
const PARK: readonly [number, number] = [70, 62]

interface Props {
  view: ShotView
  mode: Mode
  os: OS
  /** Place the instruction (say, hint, tools) and the screenshot; the page decides the columns. */
  render: (instr: ReactNode, figure: ReactNode) => ReactNode
}

export const ShotStage = forwardRef<StageHandle, Props>(function ShotStage({ view, mode, os, render }, ref) {
  const stageRef = useRef<HTMLDivElement>(null)
  const camRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const [narrow, setNarrow] = useState(true)
  const [zoomed, setZoomed] = useState(false)
  const [instant, setInstant] = useState(true)
  const [full, setFull] = useState(false)
  const [cursor, setCursor] = useState<{ on: boolean; at: readonly [number, number]; move: boolean }>({ on: false, at: PARK, move: false })
  const [ripple, setRipple] = useState(0)
  const [reveal, setReveal] = useState<string | null>(null)
  const [labels, setLabels] = useState(false)
  const [area, setArea] = useState(false)
  const [solved, setSolved] = useState(false)
  const [tries, setTries] = useState(0)
  const [miss, setMiss] = useState<{ x: number; y: number; k: number } | null>(null)
  const [msg, setMsg] = useState<{ kind: 'hint' | 'good'; text: string } | null>(null)

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const later = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, reduce() ? 0 : ms)) }

  const act = useCallback(() => {
    setCursor({ on: true, at: centre(view.target), move: true })
    later(950, () => { setRipple((r) => r + 1); setReveal('Klik di sini'); setLabels(true) })
  }, [view])

  const reset = useCallback((wait: boolean) => {
    clear()
    setSolved(false); setTries(0); setMsg(null); setReveal(null); setLabels(false); setArea(false); setMiss(null)
    setCursor({ on: false, at: PARK, move: false })
    setInstant(true); setZoomed(mode === 'latih')
    if (mode !== 'tutor') return
    later(300, () => { setInstant(false); setZoomed(true) })
    later(900, () => setCursor((c) => ({ ...c, on: true })))
    if (!wait) later(1200, act)
  }, [mode, act])

  useEffect(() => { setFull(false); reset(false); return clear }, [view, mode, os, reset])

  // Narrow = a phone-sized stage, which zooms in further. The desktop sheet's stage is 580 sheet pixels wide, so it
  // keeps the wide behaviour: Latihan shows the whole screenshot.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => { if (e) setNarrow(e.contentRect.width < 560) })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useImperativeHandle(ref, () => ({ prepare: () => reset(true), cue: () => act() }), [reset, act])

  const maxScale = full || !zoomed ? 1 : mode === 'tutor' ? (narrow ? 3.2 : 1.7) : (narrow ? 2.4 : 1)
  const cam = camera(view.focus, maxScale)
  const t = view.target
  const below = t[1] < 18

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (mode === 'tutor' || solved || !camRef.current) return
    const h = hitTest(camRef.current.getBoundingClientRect(), e.clientX, e.clientY, [t], 10)
    if (h.hit) {
      setSolved(true); setReveal(null); setArea(false); setLabels(true)
      setMsg({ kind: 'good', text: view.ok })
      return
    }
    const n = tries + 1
    setTries(n)
    setMiss({ x: h.x, y: h.y, k: Date.now() })
    if (n === 1) setMsg({ kind: 'hint', text: 'Hampir. ' + view.hints[0] })
    else if (n === 2) { setMsg({ kind: 'hint', text: view.hints[1] + ' Kawasannya bergaris kuning.' }); setArea(true) }
    else { setMsg({ kind: 'hint', text: 'Tak apa. Butang itu sekarang bercahaya. Klik padanya.' }); setArea(false); setReveal('Di sini') }
  }

  const showMe = () => {
    if (solved) return
    setMsg({ kind: 'hint', text: 'Ini tempatnya. Sekarang klik pada butang yang bercahaya.' })
    setArea(false); setReveal('Di sini')
  }

  const instr = (
    <>
      <p className="say"><Rich text={view.say} /></p>
      {msg && <p className={'msg ' + msg.kind} role="status" data-testid="msg"><Rich text={msg.text} /></p>}
      {mode === 'latih' && (
        <div className="tools">
          <button type="button" className="tb" onClick={() => setFull((f) => !f)}>{full ? 'Besarkan kawasan' : 'Lihat penuh skrin'}</button>
          <button type="button" className="tb" onClick={showMe} disabled={solved}>Tunjuk saya</button>
        </div>
      )}
    </>
  )
  const figure = (
      <figure className="shotfig" style={{ '--r': view.ratio ?? 1.6 } as CSSProperties}>
        <span className={'real' + (view.dummy ? ' dummy' : '')}>{view.dummy ? (os === 'win' ? 'Paparan contoh Windows' : 'Paparan contoh') : 'Screenshot sebenar'}</span>
        <div className={'win ' + os + (view.frame === 'screen' ? ' bare' : '')}>
          {view.frame !== 'screen' && (
            <div className="chrome">
              {os === 'mac' && <span className="dots" aria-hidden="true"><i /><i /><i /></span>}
              {view.frame === 'browser' ? <span className="url">{view.url}</span> : <span className="grow" />}
              {os === 'win' && <WinControls />}
            </div>
          )}
          <div className="stage" ref={stageRef} onClick={onClick} data-testid="stage" style={view.ratio ? { aspectRatio: String(view.ratio) } : undefined}>
            <div ref={camRef} className={'cam' + (instant ? ' instant' : '')} style={{ transform: cam.transform, '--inv': cam.inv } as CSSProperties} data-target={t.join(',')} data-focus={view.focus.join(',')}>
              <img src={view.img} alt={'Screenshot ' + (view.url ?? view.caption)} draggable={false} />
              <div className={'area' + (area ? ' on' : '')} style={rectStyle(view.focus)} />
              <div className={'spot' + (reveal ? ' on' : '')} style={rectStyle(t)} data-testid="spot" />
              <div className={'okring' + (solved ? ' on' : '')} style={rectStyle(t)} />
              {labels && view.labels?.map((l) => (
                <div key={l.text} className="anc lab on" style={pointStyle(l.at[0], l.at[1])}><span className="dot" /><span className="tag">{l.text}</span></div>
              ))}
              {miss && <div key={miss.k} className="anc miss on" style={pointStyle(miss.x, miss.y)}><span /></div>}
              <div className={'anc callout' + (reveal ? ' on' : '') + (below ? ' below' : '')} style={pointStyle(t[0] + t[2] / 2, below ? t[1] + t[3] : t[1])}>
                <div className="bub"><i>1</i><span>{reveal}</span></div>
              </div>
              <div className={'anc cursor' + (cursor.on ? ' on' : '') + (cursor.move ? '' : ' still')} style={pointStyle(cursor.at[0], cursor.at[1])} data-testid="cursor">
                {ripple > 0 && <span key={ripple} className="ripple go" />}
                <svg viewBox="0 0 30 36" aria-hidden="true"><path d="M3 2v26l7-6.5 4.6 10.3 5-2.2-4.6-10.1H25z" fill="#fff" stroke="#1e2240" strokeWidth="2" strokeLinejoin="round" /></svg>
              </div>
            </div>
          </div>
        </div>
        <figcaption><Rich text={view.caption} /></figcaption>
      </figure>
  )
  return <>{render(instr, figure)}</>
})

function WinControls() {
  return (
    <span className="wctl" aria-hidden="true">
      <svg viewBox="0 0 12 12"><path d="M2 6h8" /></svg>
      <svg viewBox="0 0 12 12"><rect x="2.5" y="2.5" width="7" height="7" /></svg>
      <svg viewBox="0 0 12 12"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" /></svg>
    </span>
  )
}
