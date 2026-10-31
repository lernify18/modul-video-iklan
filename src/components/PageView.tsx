import { useRef, useState, type ReactNode } from 'react'
import { vo, type BookPage } from '../content'
import { locked, NAIK_TARAF_URL, PRO_SKILL } from '../content/pakej'
import { usePakej } from '../lib/sesi'
import type { Block, Mode, OS, Page } from '../content/types'
import { useFit, useSheet } from '../lib/fit'
import { Blocks } from './Blocks'
import { Icon } from './Icons'
import { Glyph, PageOwner } from './Info'
import { Rich } from './Rich'
import { ShotStage, type StageHandle } from './ShotStage'
import { SpotStage } from './SpotStage'
import { VoiceButton } from './Voice'

interface Props { bp: BookPage; total: number; mode: Mode; os: OS }

/**
 * Blocks that are looked at rather than read go to the right-hand column on a desktop. Tables are read, so they stay
 * left; picture tiles fill the width under the text. A flow marked `left` stays with the text of a page whose
 * right-hand column already has a picture or a prompt.
 */
const VISUAL = new Set<Block['t']>(['img', 'pair', 'video', 'prompt', 'vs', 'art', 'road', 'flow', 'tree', 'bars'])
/** A step map that is a page's only picture: its tips and terms sit beside it, as on the approved sheet. */
const visual = (b: Block) => VISUAL.has(b.t) && !((b.t === 'flow' || b.t === 'img') && b.left)

/** What a page puts in its sheet: the voice button for the head, the text column (a) and the picture column (b). */
type Frame = (voice: ReactNode, a: ReactNode, b?: ReactNode) => ReactNode

/**
 * One page = one fixed 1280 × 680 sheet with three zones (Ubai approved 29 Okt 2026): head (label, title, voice on
 * the right), body (text left, picture right, centred), foot (Key Note, footnotes, page number). On a desktop the
 * sheet is scaled to the screen; on a phone the zones stack and the page scrolls.
 */
export function PageView({ bp, total, mode, os }: Props) {
  const { page, no } = bp
  const sheet = useSheet()
  const fit = useFit(`${page.id}|${mode}|${os}`)
  const frame: Frame = (voice, a, b) => (
    <>
      <header className="sh-head">
        <div className="o-head">
          <span className="kick">{page.kicker}</span>
          {page.title && <h1>{page.title}</h1>}
        </div>
        {voice && <div className="sh-voice">{voice}</div>}
      </header>
      <div ref={fit.outer} className="sh-body">
        <div ref={fit.inner} className="fit">
          <div className={'cols' + (b ? ' two' : ' one')}>
            <div className="col-a">{a}</div>
            {b && <div className="col-b o-vis">{b}</div>}
          </div>
        </div>
        {fit.more && <button type="button" className="more" onClick={fit.down}>Ada lagi di bawah</button>}
      </div>
      <footer className="sh-foot">
        <div className="kn"><Icon name="pin" /><p><b>Key Note</b>{page.keynote}</p></div>
        <span className="pno">ms {no} / {total}</span>
        {page.footnotes && page.footnotes.length > 0 && (
          <div className="fn">{page.footnotes.map((f, i) => <p key={i}><b>{i + 1}</b> <Rich text={f} /></p>)}</div>
        )}
      </footer>
    </>
  )
  return (
    <div ref={sheet.box} className="sheetbox" style={sheet.boxStyle}>
      <article
        className={'page tone-' + (page.tone ?? 'lav') + ' kind-' + page.kind + (page.kind === 'explain' && page.cover ? ' cover' : '')}
        data-page-id={page.id} data-scale={fit.scale.toFixed(2)} data-sheet={sheet.scale.toFixed(2)} style={sheet.sheetStyle}
      >
        <PageOwner.Provider value={page.id}>
          <Body page={page} mode={mode} os={os} frame={frame} />
        </PageOwner.Provider>
      </article>
    </div>
  )
}

function Body({ page, mode, os, frame }: { page: Page; mode: Mode; os: OS; frame: Frame }) {
  const stage = useRef<StageHandle>(null)
  const pakej = usePakej()
  const watch = (id: string) => ({
    id, owner: page.id,
    onStart: () => { if (mode === 'tutor') stage.current?.prepare() },
    onCue: (i: number) => { if (mode === 'tutor') stage.current?.cue(i) },
  })
  const autoKey = `${page.id}|${mode}|${os}`
  // A Pro reader hears the clip that names their own skill, where one was recorded.
  const voFor = (id: string) => (pakej === 'pro' && vo[`${id}-pro`] ? `${id}-pro` : id)
  const listen = page.vo ? <VoiceButton req={{ id: voFor(page.vo), owner: page.id }} autoKey={autoKey} /> : null
  if (locked(page, pakej)) return frame(null, <Locked page={page} />)

  switch (page.kind) {
    case 'explain': {
      // A table is read, so it sits with the text, unless it is the page's only picture-like part: then it takes
      // the right-hand column and the page uses both columns instead of one tall one.
      const loneTable = !page.blocks.some(visual)
      // On a module's opening page the list of what is inside is the thing to look at, so it goes right too.
      // A text-only page uses both columns too: its notes and a short glossary move right. A long glossary stays
      // full width in three columns (see styles.css).
      const textOnly = loneTable && !page.blocks.some((b) => b.t === 'table')
      // A comparison next to real pictures is read alongside them, so it fills the text column instead of stacking
      // under the pictures.
      const pictured = page.blocks.some((b) => b.t === 'pair' || b.t === 'img' || b.t === 'video')
      const infoOnly = !loneTable && !page.cover && page.blocks.filter(visual).every((b) => b.t === 'flow')
      const isVis = (b: Block) => (visual(b) && !(b.t === 'vs' && pictured)) || (loneTable && b.t === 'table') || (!!page.cover && b.t === 'steps')
        || (infoOnly && (b.t === 'note' || b.t === 'gloss'))
        || (textOnly && !page.cover && (b.t === 'note' || (b.t === 'gloss' && b.items.length <= 6)))
      const text = page.blocks.filter((b) => !isVis(b))
      const vis = page.blocks.filter(isVis)
      return frame(listen, <div className="o-instr"><Blocks blocks={text} /></div>, vis.length ? <Blocks blocks={vis} /> : undefined)
    }
    case 'shot': {
      const view = page.views[os]
      return (
        <ShotStage
          ref={stage} view={view} mode={mode} os={os}
          render={(instr, figure) => frame(
            view.vo && <VoiceButton req={watch(voFor(view.vo))} watch autoKey={autoKey} />,
            <><div className="o-instr">{instr}</div><div className="o-rest"><HowTo /></div></>,
            figure,
          )}
        />
      )
    }
    case 'spot':
      return (
        <SpotStage
          ref={stage} img={page.img} alt={page.alt} items={page.items} mode={mode}
          render={(side, phone) => frame(
            page.vo && <VoiceButton req={watch(page.vo)} watch autoKey={autoKey} />,
            <div className="o-instr"><Blocks blocks={page.blocks} />{side}</div>,
            phone,
          )}
        />
      )
    case 'check':
      return <Checklist page={page} frame={frame} listen={listen} />
    case 'quiz':
      return frame(
        listen,
        <div className="o-instr"><Blocks blocks={page.blocks} /></div>,
        <div className="quizzes">{page.questions.map((q) => <Quiz key={q.q} q={q} />)}</div>,
      )
  }
}

function HowTo() {
  return (
    <div className="howto">
      <div><span className="k">Tutorial</span><p>Dengar Ubai. Kursor bergerak ke butang yang betul ketika Ubai sebut namanya.</p></div>
      <div><span className="k l">Latihan</span><p>Cari dan klik sendiri. Silap tiga kali, butang yang betul akan bercahaya.</p></div>
    </div>
  )
}

/** A Pro page in a Basic book: what it holds, blurred behind one card and one upgrade button. */
function Locked({ page }: { page: Page }) {
  // The preview shows what the page teaches, never its download or its prompt.
  const peek = page.kind === 'explain' ? <Blocks blocks={page.blocks.filter((b) => b.t !== 'download' && b.t !== 'prompt')} /> : page.kind === 'shot' ? <img src={page.views.mac.img} alt="" /> : null
  return (
    <div className="kunci" data-testid="kunci">
      <div className="kabur" aria-hidden="true">{peek}</div>
      <div className="kunci-kad">
        <span className="pro-chip">PRO</span>
        <h2>Muka ini untuk pakej Pro</h2>
        <p>Pakej Pro dapat skill <b>{PRO_SKILL}</b>: Claude fikir ikut niche awak, 30 hook terbukti, mockup telefon, zoom pada angka bukti dan penulis caption.</p>
        {NAIK_TARAF_URL && <a className="naik" href={NAIK_TARAF_URL} target="_blank" rel="noopener">Naik taraf ke Pro</a>}
      </div>
    </div>
  )
}

function Checklist({ page, frame, listen }: { page: Extract<Page, { kind: 'check' }>; frame: Frame; listen: ReactNode }) {
  const [ticks, setTicks] = useState<boolean[]>(() => page.items.map(() => false))
  const all = ticks.every(Boolean)
  return frame(
    listen,
    <><div className="o-instr"><Blocks blocks={page.blocks} /></div>{page.after && <div className="o-rest"><Blocks blocks={page.after} /></div>}</>,
    <>
      <div className="checks">
        {page.items.map((item, i) => (
          <button key={item} type="button" aria-pressed={ticks[i]} onClick={() => setTicks((t) => t.map((v, k) => (k === i ? !v : v)))}>
            <span className="bx"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <span><Rich text={item} /></span>
          </button>
        ))}
      </div>
      {all && <p className="msg good" role="status"><Rich text={page.done} /></p>}
    </>,
  )
}

function Quiz({ q }: { q: Extract<Page, { kind: 'quiz' }>['questions'][number] }) {
  const [picked, setPicked] = useState<number | null>(null)
  const right = picked === q.answer
  return (
    <div className="quiz">
      <p className="q">{q.q}</p>
      <div className="opts">
        {q.options.map((o, i) => (
          <button key={o} type="button" className={picked === i ? (right ? 'ok' : 'no') : ''} onClick={() => setPicked(i)}>{q.icons?.[i] && <Glyph n={q.icons[i]!} />}{o}</button>
        ))}
      </div>
      {picked !== null && <p className={'msg ' + (right ? 'good' : 'hint')} role="status">{right ? <b>Betul!</b> : q.hint}</p>}
    </div>
  )
}
