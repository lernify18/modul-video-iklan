import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'

/**
 * Desktop = room for the whole sheet at a readable size (at least ~0.7 of 1280 × 680 between the bars). Anything
 * smaller stacks the sheet's zones and scrolls like a normal phone page.
 */
export const DESKTOP = '(min-width: 1024px) and (min-height: 620px)'
/** Smallest shrink of a sheet's body before the text gets too small for an older reader; past this the body scrolls. */
export const MIN_SCALE = 0.78
/** Every page is designed on one fixed sheet (Ubai approved 29 Okt 2026), then scaled to the screen. */
export const SHEET_W = 1280
export const SHEET_H = 680
const SHEET_PAD = 20

/**
 * Scale the fixed sheet to the free space between the top bar and the pager, up or down, so a big screen shows a
 * bigger page instead of an emptier one. Returns the box size (the scaled sheet's footprint) and the sheet transform.
 */
export function useSheet() {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useLayoutEffect(() => {
    const b = box.current
    const area = b?.parentElement
    if (!b || !area) return
    const mq = matchMedia(DESKTOP)
    const measure = () => {
      if (!mq.matches) { setScale(0); return }
      const w = area.clientWidth - SHEET_PAD * 2
      const h = area.clientHeight - SHEET_PAD * 2
      setScale(Math.max(0.1, Math.min(w / SHEET_W, h / SHEET_H)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(area)
    mq.addEventListener('change', measure)
    return () => { ro.disconnect(); mq.removeEventListener('change', measure) }
  }, [])

  const boxStyle: CSSProperties | undefined = scale ? { width: SHEET_W * scale, height: SHEET_H * scale } : undefined
  const sheetStyle: CSSProperties | undefined = scale ? { transform: `scale(${scale})` } : undefined
  return { box, scale, boxStyle, sheetStyle }
}

/**
 * The sheet's body zone has a fixed height. If its content is taller, the content is scaled down (and laid out
 * wider by the same factor, so it reflows into the freed width) until it fits. Re-fits when the content changes size.
 * The e2e spec keeps every page at scale 1; this is the safety net for a page that grows (a font that loads late).
 */
export function useFit(key: string) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ scale: 1, more: false })

  useLayoutEffect(() => {
    const o = outer.current
    const i = inner.current
    if (!o || !i) return
    const mq = matchMedia(DESKTOP)
    let busy = false
    let lastNeed = -1

    const atBottom = () => o.scrollTop + o.clientHeight >= o.scrollHeight - 4
    const fit = () => {
      if (busy) return
      busy = true
      if (!mq.matches) {
        i.style.transform = ''
        i.style.width = ''
        o.style.overflowY = ''
        setState({ scale: 1, more: false })
        busy = false
        return
      }
      const cs = getComputedStyle(o)
      const availW = o.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const availH = o.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      // Laid out wider by 1/s, text wraps onto fewer lines, so the height depends on the scale itself. Search for the
      // largest scale whose scaled height fits; a fixed-point loop can flip between two values and never settle.
      const heightAt = (s: number) => {
        i.style.width = s === 1 ? '' : `${availW / s}px`
        i.style.transform = s === 1 ? '' : `scale(${s})`
        return i.offsetHeight
      }
      let s = 1
      if (heightAt(1) > availH + 1) {
        let lo = MIN_SCALE
        let hi = 1
        for (let k = 0; k < 8; k++) {
          const mid = (lo + hi) / 2
          if (heightAt(mid) * mid <= availH) lo = mid
          else hi = mid
        }
        s = lo
      }
      lastNeed = heightAt(s)
      const overflow = lastNeed * s > availH + 2
      o.style.overflowY = overflow ? 'auto' : 'hidden'
      setState({ scale: s, more: overflow && !atBottom() })
      busy = false
    }

    fit()
    let lastBox = `${o.clientWidth}x${o.clientHeight}`
    // Re-fit when the body box changes, or the content grows (a picture loads, a hint appears); the width this hook
    // sets itself leaves both unchanged, so it cannot loop.
    const ro = new ResizeObserver(() => {
      if (busy) return
      const box = `${o.clientWidth}x${o.clientHeight}`
      if (box === lastBox && Math.abs(i.offsetHeight - lastNeed) < 2) return
      lastBox = box
      requestAnimationFrame(fit)
    })
    ro.observe(o)
    ro.observe(i)
    const onScroll = () => setState((st) => ({ ...st, more: o.style.overflowY === 'auto' && !atBottom() }))
    o.addEventListener('scroll', onScroll)
    mq.addEventListener('change', fit)
    return () => { ro.disconnect(); o.removeEventListener('scroll', onScroll); mq.removeEventListener('change', fit) }
  }, [key])

  const down = useCallback(() => {
    const o = outer.current
    if (o) o.scrollBy({ top: o.clientHeight * 0.7, behavior: 'smooth' })
  }, [])

  return { outer, inner, scale: state.scale, more: state.more, down }
}
