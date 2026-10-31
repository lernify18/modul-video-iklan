import { createContext, Fragment, useContext, type CSSProperties } from 'react'
import type { Bar, IconName, InfoStep } from '../content/types'
import { Rich } from './Rich'
import { useProgress, useVoice } from './Voice'

/** Which page the infographics belong to, so they follow that page's voice and nobody else's. */
export const PageOwner = createContext('')

/**
 * Step-by-step reveal (Ubai approved 29 Okt 2026): while the page's voice plays, each step lights when the voice
 * reaches its cue (`at`), or in turn across the voice when it has none. With no voice playing (silent reading, or
 * after Hentikan) every step is shown, so the page can always be read in full.
 */
function useReveal() {
  const owner = useContext(PageOwner)
  const v = useVoice()
  const progress = useProgress()
  const live = v.owner === owner
  const on = (k: number, n: number, at?: number) => {
    if (!live) return true
    if (at !== undefined && at < v.cues) return v.step > at
    return progress >= ((k + 1) / (n + 1)) * 0.85
  }
  return { live, on }
}

/** The step that was lit last is the one Ubai is talking about: it glows and floats. */
function marks(live: boolean, lit: readonly boolean[]) {
  const now = live ? lit.lastIndexOf(true) : -1
  return (k: number) => 'it' + (lit[k] ? ' on' : '') + (k === now ? ' now' : '')
}

const kStyle = (k: number) => ({ '--k': k }) as CSSProperties

export function Glyph({ n, className = 'ic' }: { n: IconName; className?: string }) {
  return <svg className={className} viewBox="0 0 64 64" aria-hidden="true"><use href={`#eb-${n}`} /></svg>
}

function Arrow({ on, down }: { on: boolean; down?: boolean }) {
  return (
    <svg className={'ix-arr' + (on ? ' on' : '') + (down ? ' down' : '')} viewBox="0 0 34 24" aria-hidden="true">
      <path d="M3 12h24M20 5l7 7-7 7" pathLength={1} />
    </svg>
  )
}

function StepBody({ s }: { s: InfoStep }) {
  return <><Glyph n={s.icon} /><b><Rich text={s.title} /></b>{s.sub && <small><Rich text={s.sub} /></small>}</>
}

/** Numbered stops along a drawn path: one row for three stops or fewer, otherwise a U-turn over two rows. */
export function Road({ stops }: { stops: readonly InfoStep[] }) {
  const { live, on } = useReveal()
  const n = stops.length
  const lit = stops.map((s, k) => on(k, n, s.at))
  const cls = marks(live, lit)
  const top = n <= 3 ? n : Math.ceil(n / 2)
  const span = (j: number, of: number) => (of < 2 ? 50 : 14 + (72 * j) / (of - 1))
  const pos = stops.map((_, k) => (n <= 3 ? { x: span(k, n), y: 50 } : k < top ? { x: span(k, top), y: 22 } : { x: span(n - 1 - k, n - top), y: 76 }))
  const first = pos[0]!
  const last = pos[n - 1]!
  const turnFrom = pos[top - 1]!
  const turnTo = pos[top] ?? turnFrom
  const d = n <= 3 ? `M ${first.x} 50 L ${last.x} 50` : `M ${first.x} 22 L ${turnFrom.x} 22 C 100 22, 100 76, ${turnTo.x} 76 L ${last.x} 76`
  const drawn = live ? lit.filter(Boolean).length / n : 1
  return (
    <div className={'ix ix-road' + (live ? ' live' : '') + (n <= 3 ? ' one' : '')}>
      <svg className="ix-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="base" d={d} vectorEffect="non-scaling-stroke" />
        <path className="draw" d={d} pathLength={1} vectorEffect="non-scaling-stroke" style={{ strokeDashoffset: 1 - drawn }} />
      </svg>
      <ol>
        {stops.map((s, k) => (
          <li key={s.title} className={'ix-stop ' + cls(k)} style={{ ...kStyle(k), '--x': `${pos[k]!.x}%`, '--y': `${pos[k]!.y}%` } as CSSProperties}>
            <i>{k + 1}</i><StepBody s={s} />
          </li>
        ))}
      </ol>
    </div>
  )
}

/** A process: icon steps joined by arrows that draw themselves as each step lights. */
export function Flow({ title, steps, compact }: { title?: string; steps: readonly InfoStep[]; compact?: boolean }) {
  const { live, on } = useReveal()
  const n = steps.length
  const lit = steps.map((s, k) => on(k, n, s.at))
  const cls = marks(live, lit)
  return (
    <div className={'ix ix-flow' + (live ? ' live' : '') + (compact ? ' compact' : '')}>
      {title && <span className="ix-t">{title}</span>}
      <div className="ix-row">
        {steps.map((s, k) => (
          <Fragment key={s.title}>
            {k > 0 && <Arrow on={!!lit[k]} />}
            <div className={'ix-step ' + cls(k)} style={kStyle(k)}><StepBody s={s} /></div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

/** A yes/no choice: the question, then the two answers it leads to. */
export function Tree({ title, q, sub, at, yes, no }: { title?: string; q: string; sub?: string; at?: number; yes: InfoStep; no: InfoStep }) {
  const { live, on } = useReveal()
  const lit = [on(0, 3, at), on(1, 3, yes.at), on(2, 3, no.at)]
  const cls = marks(live, lit)
  return (
    <div className={'ix ix-tree' + (live ? ' live' : '')}>
      {title && <span className="ix-t">{title}</span>}
      <p className={'ix-q ' + cls(0)} style={kStyle(0)}><Rich text={q} />{sub && <small><Rich text={sub} /></small>}</p>
      {([['Ya', 'yes', yes], ['Tidak', 'no', no]] as const).map(([word, kind, s], i) => (
        <div key={kind} className="ix-branch">
          <Arrow on={!!lit[i + 1]} down />
          <span className={'ix-yn ' + kind + ' ' + cls(i + 1)} style={kStyle(i + 1)}>{word}</span>
          <div className={'ix-ans ' + cls(i + 1)} style={kStyle(i + 1)}><StepBody s={s} /></div>
        </div>
      ))}
    </div>
  )
}

/** Picture tiles, one per term or part. */
export function Tiles({ title, items, cols }: { title?: string; items: readonly InfoStep[]; cols?: number }) {
  const { live, on } = useReveal()
  const lit = items.map((s, k) => on(k, items.length, s.at))
  const cls = marks(live, lit)
  return (
    <div className={'ix ix-tiles' + (live ? ' live' : '')} style={cols ? ({ '--cols': cols } as CSSProperties) : undefined}>
      {title && <span className="ix-t">{title}</span>}
      <div className="ix-grid">
        {items.map((s, k) => <div key={s.title} className={'ix-tile ' + cls(k)} style={kStyle(k)}><Glyph n={s.icon} /><span><b><Rich text={s.title} /></b>{s.sub && <small><Rich text={s.sub} /></small>}</span></div>)}
      </div>
    </div>
  )
}

/** Real numbers as bars that grow; the widest bar is the largest value. */
export function Bars({ title, rows, legend }: { title: string; rows: readonly Bar[]; legend: readonly string[] }) {
  const { live, on } = useReveal()
  const max = Math.max(...rows.map((r) => r.value))
  const lit = rows.map((r, k) => on(k, rows.length, r.at))
  const cls = marks(live, lit)
  return (
    <figure className={'ix ix-bars' + (live ? ' live' : '')}>
      <span className="ix-t">{title}</span>
      {rows.map((r, k) => {
        const w = (r.value / max) * 100
        return (
          <div key={r.label} className={'ix-bar ' + cls(k) + (w < 35 ? ' small' : '')} style={kStyle(k)}>
            <span className="nm"><Rich text={r.label} />{r.sub && <small>{r.sub}</small>}</span>
            <span className="track"><span className="fill" style={{ width: lit[k] ? `${w}%` : 0 }}><b>{r.shown}</b></span></span>
            <span className="pill">{r.pill}</span>
          </div>
        )
      })}
      <figcaption>{legend.map((l) => <span key={l}>{l}</span>)}</figcaption>
    </figure>
  )
}

/** Steps around a ring with the lesson in the middle: top, right, bottom, left. */
export function Loop({ centre, at, nodes }: { centre: string; at?: number; nodes: readonly InfoStep[] }) {
  const { live, on } = useReveal()
  const n = nodes.length
  const lit = nodes.map((s, k) => on(k, n + 1, s.at))
  const centreOn = on(n, n + 1, at)
  const cls = marks(live, lit)
  const spots = [[50, 14], [84, 50], [50, 86], [16, 50]] as const
  return (
    <div className={'ix ix-loop' + (live ? ' live' : '')}>
      <svg className="ring" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="50" cy="50" rx="34" ry="36" vectorEffect="non-scaling-stroke" /></svg>
      <p className={'ix-centre it' + (centreOn ? ' on' : '')} style={kStyle(n)}><Rich text={centre} /></p>
      {nodes.map((s, k) => (
        <div key={s.title} className={'ix-node ' + cls(k)} style={{ ...kStyle(k), '--x': `${spots[k % 4]![0]}%`, '--y': `${spots[k % 4]![1]}%` } as CSSProperties}>
          <StepBody s={s} />
        </div>
      ))}
    </div>
  )
}

export function Outcome({ text }: { text: string }) {
  return <div className="ix-out"><Glyph n="yes" /><p><b>Selepas modul ini:</b> <Rich text={text} /></p></div>
}
