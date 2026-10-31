import { useRef, useState } from 'react'
import type { Block } from '../content/types'
import { forPakej } from '../content/pakej'
import { plain } from '../lib/markup'
import { usePakej } from '../lib/sesi'
import { Icon } from './Icons'
import { Bars, Flow, Loop, Outcome, Road, Tiles, Tree } from './Info'
import { Rich } from './Rich'

const NOTE_ICON = { tip: 'bulb', awas: 'warn', privasi: 'lock' } as const

export function Blocks({ blocks }: { blocks: readonly Block[] }) {
  return <>{blocks.map((b, i) => <BlockView key={i} b={b} />)}</>
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case 'p':
      return <p><Rich text={b.text} /></p>
    case 'lead':
      return <p className="lead"><Rich text={b.text} /></p>
    case 'steps':
      return (
        <ol className={'steps' + (b.parts ? ' parts' : '')}>
          {b.items.map((s, i) => <li key={i}><i>{i + 1}</i><span><Rich text={s} /></span></li>)}
        </ol>
      )
    case 'note':
      return (
        <div className={'note ' + b.tone}>
          <Icon name={NOTE_ICON[b.tone]} />
          <p><span className="nl">{b.title}</span><Rich text={b.text} /></p>
        </div>
      )
    case 'gloss':
      return (
        <div className="gl">
          <span className="gt">Istilah</span>
          {b.items.map((g) => <p key={g.term}><b>{g.term}</b>: {g.def}</p>)}
        </div>
      )
    case 'vs':
      return (
        <div className="vs">
          {[b.left, b.right].map((side) => (
            <div key={side.title} className={side.pick ? 'pick' : ''}>
              <h3>{side.title} <small>{side.tag}</small></h3>
              <ul>{side.rows.map((r) => <li key={r.text}><Icon name={r.ok ? "yes" : "no"} /><Rich text={r.text} /></li>)}</ul>
            </div>
          ))}
        </div>
      )
    case 'price':
      return <div className="price"><span className="n">{b.big}</span><p><Rich text={b.text} /></p></div>
    case 'chips':
      return <div className="chips">{b.items.map((c) => <span key={c}>{c}</span>)}</div>
    case 'stats':
      return <div className="stats">{b.items.map((s) => <p key={s.label} className="stat"><b>{s.n}</b><span>{s.label}</span></p>)}</div>
    case 'badge':
      return <p className={'badge ' + b.tone}><Icon name={b.tone === 'bukti' ? 'yes' : 'folder'} />{b.text}</p>
    case 'art':
      return <div className="art"><Icon name={b.icon} label={b.label} /></div>
    case 'img':
      return (
        <figure className={'pic' + (b.tall ? ' tall' : '')}>
          <img src={b.src} alt={b.alt} loading="lazy" />
          <figcaption><Rich text={b.caption} /></figcaption>
        </figure>
      )
    case 'pair':
      return (
        <div className="pair">
          {b.items.map((it) => (
            <figure key={it.src} className="pic tall">
              <span className="ptag">{it.tag}</span>
              <img src={it.src} alt={it.alt} loading="lazy" />
              <figcaption><Rich text={it.caption} /></figcaption>
            </figure>
          ))}
        </div>
      )
    case 'video':
      return (
        <figure className="pic tall">
          <video src={b.src} poster={b.poster} controls playsInline preload="none" />
          <figcaption><Rich text={b.caption} /></figcaption>
        </figure>
      )
    case 'table':
      return (
        <figure className="tbl">
          <div className="tscroll">
            <table>
              <thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, k) => <td key={k}><Rich text={c} /></td>)}</tr>)}</tbody>
            </table>
          </div>
          {b.caption && <figcaption><Rich text={b.caption} /></figcaption>}
        </figure>
      )
    case 'quote':
      return <blockquote className="asal"><p>«{b.text}»</p><cite>{b.cite}</cite></blockquote>
    case 'prompt':
      return <PromptCard title={b.title} text={b.text} note={b.note} parts={b.parts} example={b.example} fixed={b.fixed} />
    case 'road':
      return <Road stops={b.stops} />
    case 'flow':
      return <Flow title={b.title} steps={b.steps} />
    case 'tree':
      return <Tree title={b.title} q={b.q} sub={b.sub} at={b.at} yes={b.yes} no={b.no} />
    case 'tiles':
      return <Tiles title={b.title} items={b.items} cols={b.cols} />
    case 'bars':
      return <Bars title={b.title} rows={b.rows} legend={b.legend} />
    case 'loop':
      return <Loop centre={b.centre} at={b.at} nodes={b.nodes} />
    case 'outcome':
      return <Outcome text={b.text} />
    case 'download':
      return (
        <div className="muat">
          <a href={b.href} download data-testid="muat-turun"><Icon name="folder" /><span><b>{b.label}</b><small>{b.meta}</small></span></a>
          <p><Rich text={b.next} /></p>
        </div>
      )
  }
}

/**
 * A prompt to copy. With `parts`, each line carries the name of the formula part it is (colour-coded, not copied).
 * With `example`, a second tab shows the same prompt filled in for a real ad; Salin copies the tab on screen.
 */
function PromptCard({ title, text, note, parts, example, fixed }: { title: string; text: string; note?: string; parts?: readonly string[]; example?: string; fixed?: boolean }) {
  const pakej = usePakej()
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<'templat' | 'contoh'>('templat')
  const box = useRef<HTMLPreElement>(null)
  const showing = tab === 'contoh' && example ? example : text
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plain(forPakej(showing, pakej)))
    } catch {
      // Clipboard refused (old browser, app view): select the text so the learner can copy it by hand.
      const sel = window.getSelection()
      if (box.current && sel) { const r = document.createRange(); r.selectNodeContents(box.current); sel.removeAllRanges(); sel.addRange(r) }
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }
  return (
    // A full prompt of eight lines or more (the Modul 5 ad prompt) is set a little smaller, so it stays on one sheet.
    <div className={'prompt' + (parts ? ' parts' : '') + (fixed ? ' fixed' : '') + (text.split('\n').length >= 8 ? ' panjang' : '')}>
      <div className="phead">
        {example
          ? (
            <div className="ptabs" role="group" aria-label={title}>
              <button type="button" aria-pressed={tab === 'templat'} onClick={() => setTab('templat')}>Templat</button>
              <button type="button" aria-pressed={tab === 'contoh'} onClick={() => setTab('contoh')}>Contoh diisi</button>
            </div>
          )
          : <span className="ptitle">{title}</span>}
        <button type="button" className="copy" onClick={copy} data-testid="copy">{copied ? 'Disalin' : 'Salin'}</button>
      </div>
      {example
        ? (
          // Both texts sit in one cell, the hidden one keeping its space: switching tabs never changes the card's height.
          <div className="pboth">
            <pre ref={tab === 'templat' ? box : undefined} aria-hidden={tab !== 'templat'} className={tab === 'templat' ? '' : 'off'}><Rich text={text} /></pre>
            <pre ref={tab === 'contoh' ? box : undefined} aria-hidden={tab !== 'contoh'} className={tab === 'contoh' ? '' : 'off'}><Rich text={example} /></pre>
          </div>
        )
        : (
          <pre ref={box}>
            {parts ? forPakej(text, pakej).split('\n').map((line, i) => <span key={i} className="pl" data-part={parts[i] ?? ''}>{line}</span>) : <Rich text={text} />}
          </pre>
        )}
      {note && <p className="pnote"><Rich text={note} /></p>}
    </div>
  )
}
