import { useEffect, useState } from 'react'
import type { Mode, OS } from '../content/types'

export interface Prefs {
  readonly page: number
  readonly mode: Mode
  readonly os: OS
  /** Ids of pages the learner has finished. */
  readonly done: readonly string[]
}

const KEY = 'modul:v1'
const DEFAULTS: Prefs = { page: 0, mode: 'tutor', os: 'mac', done: [] }

export function loadPrefs(raw: string | null): Prefs {
  if (!raw) return DEFAULTS
  try {
    const v = JSON.parse(raw) as Partial<Prefs>
    return {
      page: Number.isInteger(v.page) && (v.page ?? 0) >= 0 ? (v.page as number) : 0,
      mode: v.mode === 'latih' ? 'latih' : 'tutor',
      os: v.os === 'win' ? 'win' : 'mac',
      done: Array.isArray(v.done) ? v.done.filter((d): d is string => typeof d === 'string') : [],
    }
  } catch {
    return DEFAULTS
  }
}

/** Remembered per browser; storage can be missing or blocked, and the book still works without it. */
export function usePrefs(): [Prefs, (next: Partial<Prefs>) => void] {
  const [prefs, setPrefs] = useState<Prefs>(() => {
    try { return loadPrefs(localStorage.getItem(KEY)) } catch { return DEFAULTS }
  })
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch { /* private window: keep going without saving */ }
  }, [prefs])
  return [prefs, (next) => setPrefs((p) => ({ ...p, ...next }))]
}
