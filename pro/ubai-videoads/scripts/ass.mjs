// .ass captions and drawings (red circle, phone bezel), at 1080 × 1920. Colours are &HAABBGGRR.
import { H, W } from './lib.mjs'

const RED = '&H002B2BE5'
const YELLOW = '&H0000D7FF'

export function header() {
  const style = (name, size, primary, outline, back, border, outlineW, align) =>
    `Style: ${name},Arial Black,${size},${primary},${primary},${outline},${back},0,0,0,0,100,100,0,0,${border},${outlineW},0,${align},40,40,0,1`
  return [
    '[Script Info]', 'ScriptType: v4.00+', `PlayResX: ${W}`, `PlayResY: ${H}`, 'WrapStyle: 2', 'ScaledBorderAndShadow: yes', '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    // POV: black words in a white box; key phrase white in a red box (BorderStyle 3 = opaque box).
    style('Putih', 76, '&H00141414', '&H00FFFFFF', '&H00FFFFFF', 3, 18, 5),
    style('Merah', 76, '&H00FFFFFF', RED, RED, 3, 18, 5),
    // VO: big hook on top, captions in the lower third, white with a black edge.
    style('Hook', 96, '&H00FFFFFF', '&H00000000', '&H80000000', 1, 7, 8),
    style('Cap', 82, '&H00FFFFFF', '&H00000000', '&H80000000', 1, 7, 2),
    style('Lukis', 10, '&H00FFFFFF', RED, '&H00000000', 1, 0, 7),
    '', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
  ].join('\n') + '\n'
}

export function ts(sec) {
  const s = Math.max(0, sec)
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60
  return `${h}:${String(m).padStart(2, '0')}:${r.toFixed(2).padStart(5, '0')}`
}

/** Text as typed by the user, safe inside an event (no override blocks, no forced breaks). */
export const clean = (t) => String(t).replace(/[{}]/g, '').replace(/\\/g, '/')

export const event = (start, end, style, text, layer = 0) => `Dialogue: ${layer},${ts(start)},${ts(end)},${style},,0,0,0,,${text}\n`

/** POV caption lines stacked at y (fraction of the screen), red box for the lines listed in `merah`. */
export function povLines(lines, merah, y, start, end) {
  const gap = 124
  const top = y * H - ((lines.length - 1) * gap) / 2
  return lines.map((l, i) => event(start, end, merah.includes(i) ? 'Merah' : 'Putih', `{\\an5\\pos(${W / 2},${Math.round(top + i * gap)})}${clean(l)}`, 3)).join('')
}

const K = 0.5523
/** A circle of radius r around (0,0) as an ASS drawing path. */
function circlePath(r) {
  const k = r * K
  return `m ${r} 0 b ${r} ${k} ${k} ${r} 0 ${r} b ${-k} ${r} ${-r} ${k} ${-r} 0 b ${-r} ${-k} ${-k} ${-r} 0 ${-r} b ${k} ${-r} ${r} ${-k} ${r} 0`
}

/**
 * A red ring centred on (x, y) in pixels, fading in at `start`. With \\an7 a drawing's (0,0) sits on \\pos, so a path
 * drawn around (0,0) is centred there (checked against libass; \\an5 moved it off the number).
 */
export function ring(x, y, r, start, end) {
  return event(start, end, 'Lukis', `{\\an7\\pos(${Math.round(x)},${Math.round(y)})\\fad(150,0)\\1a&HFF&\\3c${RED}\\bord12\\shad0\\p1}${circlePath(Math.round(r))}{\\p0}`, 2)
}

/** A rounded-rectangle phone bezel around (x, y, w, h). */
export function bezel(x, y, w, h, start, end) {
  const r = 70
  const p = `m ${r} 0 l ${w - r} 0 b ${w} 0 ${w} 0 ${w} ${r} l ${w} ${h - r} b ${w} ${h} ${w} ${h} ${w - r} ${h} l ${r} ${h} b 0 ${h} 0 ${h} 0 ${h - r} l 0 ${r} b 0 0 0 0 ${r} 0`
  return event(start, end, 'Lukis', `{\\an7\\pos(${x},${y})\\1a&HFF&\\3c&H00262626&\\bord26\\shad0\\p1}${p}{\\p0}`, 1)
}

/** VO caption: 1–3 words, one key word in yellow. */
export function capWords(words, keys, start, end) {
  const isKey = (w) => keys.some((k) => k.toLowerCase().split(/\s+/).includes(w.toLowerCase().replace(/[^\p{L}\p{N},.]/gu, '')))
  const text = words.map((w) => (isKey(w) ? `{\\c${YELLOW}}${clean(w)}{\\c&H00FFFFFF&}` : clean(w))).join(' ')
  return event(start, end, 'Cap', `{\\an2\\pos(${W / 2},1450)}${text}`)
}

export const hookLines = (hook) => String(hook).split('|').map((s) => s.trim()).filter(Boolean)
