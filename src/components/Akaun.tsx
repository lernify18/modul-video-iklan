import type { Sesi } from '../lib/sesi'

/** Who is signed in and their package, with Keluar. Only the built app runs behind the Worker that knows. */
export function Akaun({ sesi }: { sesi: Sesi | null }) {
  if (!sesi) return null
  const keluar = async () => {
    await fetch('/api/keluar', { method: 'POST' }).catch(() => undefined)
    location.replace('/')
  }
  return (
    <div className="akaun" data-testid="akaun">
      <span>Masuk sebagai <b>{sesi.nama}</b> <span className={'lencana ' + sesi.pakej}>Pakej {sesi.pakej === 'pro' ? 'Pro' : 'Basic'}</span></span>
      <button type="button" onClick={keluar}>Keluar</button>
    </div>
  )
}
