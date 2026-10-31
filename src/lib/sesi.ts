import { createContext, useContext, useEffect, useState } from 'react'
import type { Pakej } from '../content/types'

export interface Sesi { readonly nama: string; readonly pakej: Pakej }

/** Who is signed in and on which package, from the access Worker's /api/sesi; asked once per load. */
let asked: Promise<Sesi | null> | null = null
const ask = () => (asked ??= fetch('/api/sesi', { headers: { accept: 'application/json' } })
  .then((r) => (r.ok && (r.headers.get('content-type') ?? '').includes('json') ? r.json() : null))
  .then((b: { nama?: unknown; pakej?: unknown } | null): Sesi | null =>
    typeof b?.nama === 'string' ? { nama: b.nama, pakej: b.pakej === 'pro' ? 'pro' : 'basic' } : null)
  .catch(() => null))

/** The dev server has no Worker: a preview picks its package with localStorage modul:pakej = pro. */
function previewPakej(): Pakej {
  try { return localStorage.getItem('modul:pakej') === 'pro' ? 'pro' : 'basic' } catch { return 'basic' }
}

/** In the built app the book waits for the answer, so a Pro reader never sees the Basic book first. */
export function useSesi(): { sesi: Sesi | null; pakej: Pakej; ready: boolean } {
  const [state, setState] = useState<{ sesi: Sesi | null; ready: boolean }>({ sesi: null, ready: !import.meta.env.PROD })
  useEffect(() => {
    if (!import.meta.env.PROD) return
    let live = true
    void ask().then((sesi) => { if (live) setState({ sesi, ready: true }) })
    return () => { live = false }
  }, [])
  return { ...state, pakej: import.meta.env.PROD ? (state.sesi?.pakej ?? 'basic') : previewPakej() }
}

export const PakejCtx = createContext<Pakej>('basic')
export const usePakej = () => useContext(PakejCtx)
