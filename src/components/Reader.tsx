import { useEffect, useMemo, useState } from 'react'
import { BOOK_TITLE, bookFor, samePlace } from '../content'
import type { Mode, OS } from '../content/types'
import { usePrefs } from '../lib/store'
import { IconSprite } from './Icons'
import { PageView } from './PageView'
import { AutoVoice, useVoice } from './Voice'
import { Akaun } from './Akaun'
import { locked } from '../content/pakej'
import { PakejCtx, useSesi } from '../lib/sesi'

export function Reader() {
  const [prefs, set] = usePrefs()
  const [tocOpen, setTocOpen] = useState(false)
  const voice = useVoice()
  const { sesi, pakej, ready } = useSesi()
  // Pages meant for the other computer or package are left out, so page numbers and contents match this reader.
  const pages = useMemo(() => bookFor(prefs.os, pakej), [prefs.os, pakej])
  const idx = Math.min(prefs.page, pages.length - 1)
  const bp = pages[idx]

  const goTo = (n: number) => {
    // Any move is a press, so from here on the next page's voice may start by itself.
    voice.unlock()
    const next = Math.max(0, Math.min(pages.length - 1, n))
    const leaving = pages[idx]?.page.id
    set({ page: next, done: leaving && next > idx && !prefs.done.includes(leaving) ? [...prefs.done, leaving] : prefs.done })
    setTocOpen(false)
  }

  useEffect(() => { window.scrollTo({ top: 0 }) }, [idx, prefs.mode, prefs.os])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return
      if (e.key === 'ArrowRight') goTo(idx + 1)
      if (e.key === 'ArrowLeft') goTo(idx - 1)
    }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  })

  if (!bp || !ready) return null
  return (
    <PakejCtx.Provider value={pakej}>
    <div className="reader" data-pakej={pakej}>
      <IconSprite />
      <header className="topbar">
        <button type="button" className="tocbtn" onClick={() => setTocOpen((o) => !o)} aria-expanded={tocOpen} aria-controls="toc" aria-label="Isi kandungan">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" /></svg>
          <span>Isi kandungan</span>
        </button>
        <p className="booktitle">{BOOK_TITLE}</p>
        <div className="toggles">
          <Seg<Mode> label="Pilih mod" value={prefs.mode} onChange={(mode) => set({ mode })} options={[['tutor', 'Tutorial', 'Saya tunjuk'], ['latih', 'Latihan', 'Awak klik']]} />
          <Seg<OS> label="Komputer awak" value={prefs.os} onChange={(os) => set({ os, page: samePlace(bp.page.id, os, pakej) })} options={[['mac', 'Mac'], ['win', 'Windows']]} />
          <AutoVoice />
        </div>
      </header>

      {tocOpen && (
        <nav id="toc" className="toc" aria-label="Isi kandungan">
          <Akaun sesi={sesi} />
          <div className="tocvoice"><AutoVoice /></div>
          {pages.map((p, i) => {
            const prev = pages[i - 1]
            return (
              <div key={p.page.id}>
                {(!prev || prev.chapter.id !== p.chapter.id) && <p className="tch">Modul {p.chapter.module} · {p.chapter.title}</p>}
                <button type="button" aria-current={i === idx} onClick={() => goTo(i)}>
                  <span className={'tick' + (prefs.done.includes(p.page.id) ? ' on' : '')} aria-hidden="true" />
                  <span>{p.page.title ?? p.page.kicker}{locked(p.page, pakej) && <i className="pro-chip">PRO</i>}</span>
                  <small>ms {p.no}</small>
                </button>
              </div>
            )
          })}
        </nav>
      )}

      <main className="pagewrap">
        <PageView key={bp.page.id} bp={bp} total={pages.length} mode={prefs.mode} os={prefs.os} />
      </main>

      <ScrollHint page={bp.page.id} />
      <nav className="pager" aria-label="Muka">
        <button type="button" className="pbtn" onClick={() => goTo(idx - 1)} disabled={idx === 0}>Sebelum</button>
        <p className="plabel">Muka {idx + 1} daripada {pages.length}</p>
        <button type="button" className="pbtn next" onClick={() => goTo(idx + 1)} disabled={idx === pages.length - 1}>Seterusnya</button>
      </nav>
    </div>
    </PakejCtx.Provider>
  )
}

/** On a phone a page is taller than the screen; older readers miss what is below, so say so until they reach the end. */
function ScrollHint({ page }: { page: string }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const check = () => {
      const d = document.documentElement
      setShow(d.scrollHeight - (window.scrollY + window.innerHeight) > 60)
    }
    check()
    const late = window.setTimeout(check, 500)
    const ro = new ResizeObserver(check)
    ro.observe(document.body)
    addEventListener('scroll', check, { passive: true })
    addEventListener('resize', check)
    return () => { clearTimeout(late); ro.disconnect(); removeEventListener('scroll', check); removeEventListener('resize', check) }
  }, [page])
  if (!show) return null
  return <button type="button" className="scrollhint" onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' })}>Ada lagi di bawah</button>
}

function Seg<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: readonly (readonly [T, string, string?])[] }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map(([v, text, sub]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>
          {text}{sub && <small>{sub}</small>}
        </button>
      ))}
    </div>
  )
}
