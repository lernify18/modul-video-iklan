import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { vo, voUrl } from '../content'

export interface PlayRequest {
  readonly id: string
  /** Which page asked to play; its voice button shows Hentikan while it plays. */
  readonly owner: string
  readonly onStart?: () => void
  readonly onCue?: (i: number) => void
}

interface VoiceApi {
  readonly owner: string | null
  /** The page whose voice last finished or was stopped, so its button offers "Main semula". */
  readonly last: string | null
  /** Cues passed so far by the playing voice, and how many it has. */
  readonly step: number
  readonly cues: number
  /** The reader has pressed something, so the browser lets the voice start on its own from now on. */
  readonly unlocked: boolean
  /** Voice starts by itself on every page (Ubai approved 29 Okt 2026); the reader can switch it off. */
  readonly auto: boolean
  play(req: PlayRequest): void
  /** Stop the voice. `final` jumps the page to its last step, so it can still be read in full. */
  stop(final?: boolean): void
  /** Stop only if this page's voice is the one playing (a page leaving the screen). */
  stopIf(owner: string): void
  unlock(): void
  setAuto(on: boolean): void
  /** Read at the moment a page appears: should its voice start by itself? */
  wantsAuto(): boolean
}

const Ctx = createContext<VoiceApi | null>(null)
const ProgressCtx = createContext(0)

export function useVoice(): VoiceApi {
  const api = useContext(Ctx)
  if (!api) throw new Error('useVoice di luar VoiceProvider')
  return api
}

/**
 * How far this page's voice has gone, in cues: 0 while waiting for the first one, then one more per cue. Infinity
 * when no voice is playing for the page, so a page read in silence (or stopped) shows every step at once.
 */
export function useStep(owner: string): number {
  const v = useVoice()
  return v.owner === owner ? v.step : Infinity
}

/** How far the playing voice is, 0 to 1. Updates every frame, so only small parts should read it. */
export function useProgress(): number {
  return useContext(ProgressCtx)
}

const AUTO_KEY = 'modul:suara-auto'
// A few silent samples: playing them on the reader's first press lets Safari play the real voice later on its own.
const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

/** One audio element for the whole book, so two voices never overlap. Cues fire when playback passes each word time. */
export function VoiceProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null)
  const current = useRef<{ req: PlayRequest; cues: readonly number[]; fired: number } | null>(null)
  const raf = useRef(0)
  const unlockedRef = useRef(false)
  const [owner, setOwner] = useState<string | null>(null)
  const [last, setLast] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [cues, setCues] = useState(0)
  const [progress, setProgress] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const [auto, setAutoState] = useState(() => {
    try { return localStorage.getItem(AUTO_KEY) !== 'off' } catch { return true }
  })
  const autoRef = useRef(auto)

  const fire = useCallback((upTo: number) => {
    const c = current.current
    if (!c) return
    const before = c.fired
    while (c.fired < c.cues.length && upTo >= (c.cues[c.fired] ?? Infinity)) {
      c.req.onCue?.(c.fired)
      c.fired++
    }
    if (c.fired !== before) setStep(c.fired)
  }, [])

  const tick = useCallback(() => {
    const a = audio.current
    if (!a || !current.current || a.paused) return
    fire(a.currentTime)
    setProgress(a.duration ? a.currentTime / a.duration : 0)
    raf.current = requestAnimationFrame(tick)
  }, [fire])

  const stop = useCallback((final = true) => {
    cancelAnimationFrame(raf.current)
    audio.current?.pause()
    const c = current.current
    if (c && final) fire(Infinity)
    current.current = null
    setLast(c ? c.req.owner : null)
    setOwner(null); setStep(0); setProgress(0)
  }, [fire])

  const stopIf = useCallback((who: string) => {
    if (current.current?.req.owner === who) stop(false)
  }, [stop])

  const unlock = useCallback(() => {
    if (unlockedRef.current) return
    unlockedRef.current = true
    setUnlocked(true)
    const a = audio.current
    if (!a || current.current) return
    a.muted = true
    a.src = SILENT
    a.play().then(() => a.pause()).catch(() => undefined).finally(() => { a.muted = false })
  }, [])

  const play = useCallback((req: PlayRequest) => {
    const a = audio.current
    if (!a) return
    stop(false)
    current.current = { req, cues: vo[req.id]?.cues ?? [], fired: 0 }
    setOwner(req.owner); setLast(null); setStep(0); setCues(current.current.cues.length)
    req.onStart?.()
    a.muted = false
    a.src = voUrl(req.id)
    a.currentTime = 0
    a.play().then(() => { raf.current = requestAnimationFrame(tick) }).catch(() => {
      // The browser refused to start without a press: show the page in full and offer Mula again.
      if (current.current?.req !== req) return
      stop(true)
      unlockedRef.current = false
      setUnlocked(false)
    })
  }, [stop, tick])

  const setAuto = useCallback((on: boolean) => {
    autoRef.current = on
    setAutoState(on)
    try { localStorage.setItem(AUTO_KEY, on ? 'on' : 'off') } catch { /* private window: remembered for this visit only */ }
    if (!on) stop(true)
  }, [stop])

  const wantsAuto = useCallback(() => unlockedRef.current && autoRef.current, [])

  useEffect(() => {
    const a = audio.current
    if (!a) return
    const ended = () => { if (current.current) stop(true) }
    a.addEventListener('ended', ended)
    return () => a.removeEventListener('ended', ended)
  }, [stop])

  const api = useMemo<VoiceApi>(() => ({ owner, last, step, cues, unlocked, auto, play, stop, stopIf, unlock, setAuto, wantsAuto }),
    [owner, last, step, cues, unlocked, auto, play, stop, stopIf, unlock, setAuto, wantsAuto])

  return (
    <Ctx.Provider value={api}>
      <ProgressCtx.Provider value={progress}>
        {children}
        <audio ref={audio} preload="none" data-testid="vo-audio" />
      </ProgressCtx.Provider>
    </Ctx.Provider>
  )
}

function clock(sec: number) {
  const s = Math.round(sec)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * The voice control in a page's head. When the page appears and the reader has pressed something before, the voice
 * starts by itself; while it plays the button reads Hentikan, and stopping shows the page's last step.
 * `autoKey` changes when the page, mode or computer changes: the voice then stops and starts again for the new view.
 */
export function VoiceButton({ req, watch, autoKey }: { req: PlayRequest; watch?: boolean; autoKey: string }) {
  const v = useVoice()
  const progress = useContext(ProgressCtx)
  const reqRef = useRef(req)
  reqRef.current = req
  const mine = v.owner === req.owner
  const dur = vo[req.id]?.dur ?? 0

  const { wantsAuto, play, stopIf } = v
  useEffect(() => {
    const who = reqRef.current.owner
    // Next frame, so the page's screenshot stage has finished its own reset before the voice tells it to wait.
    const id = requestAnimationFrame(() => { if (wantsAuto()) play(reqRef.current) })
    return () => { cancelAnimationFrame(id); stopIf(who) }
  }, [autoKey, wantsAuto, play, stopIf])

  const press = () => {
    v.unlock()
    if (mine) v.stop(true)
    else v.play(req)
  }
  const first = !v.unlocked && v.auto
  const label = mine ? 'Hentikan' : first ? 'Mula' : v.last === req.owner ? 'Main semula' : watch ? 'Dengar dan tengok' : 'Dengar Ubai terangkan'
  const sub = mine ? 'Suara Ubai sedang main' : first ? 'Suara Ubai, kemudian main sendiri' : `${clock(dur)}${watch ? ' · ikut suara' : ''}`
  return (
    <button type="button" className={'vo' + (mine ? ' playing' : '')} onClick={press} data-testid="vo-button">
      <span className="pl" aria-hidden="true">
        {mine ? <span className="eq"><i /><i /><i /><i /></span> : <svg viewBox="0 0 20 20"><path d="M6 4l10 6-10 6z" /></svg>}
      </span>
      <span className="vt"><b>{label}</b><small>{sub}</small></span>
      <span className="vb" style={{ width: mine ? `${progress * 100}%` : 0 }} />
    </button>
  )
}

/** Voice on its own or silent; remembered in this browser. */
export function AutoVoice() {
  const v = useVoice()
  return (
    <div className="seg autov" role="group" aria-label="Suara main sendiri">
      <button type="button" aria-pressed={v.auto} onClick={() => { v.unlock(); v.setAuto(true) }}>Suara auto<small>Main sendiri</small></button>
      <button type="button" aria-pressed={!v.auto} onClick={() => v.setAuto(false)}>Senyap<small>Tekan bila perlu</small></button>
    </div>
  )
}
