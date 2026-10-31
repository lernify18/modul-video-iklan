/** Inline markup used in lesson text: **bold**, ==highlight==, ^1 footnote reference. Nothing else is special. */
export type Run =
  | { readonly k: 'text'; readonly v: string }
  | { readonly k: 'b'; readonly v: string }
  | { readonly k: 'hl'; readonly v: string }
  | { readonly k: 'fn'; readonly n: number }

const TOKEN = /(\*\*[^*]+\*\*|==[^=]+==|\^\d+)/g

export function parse(src: string): Run[] {
  const out: Run[] = []
  for (const part of src.split(TOKEN)) {
    if (!part) continue
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) out.push({ k: 'b', v: part.slice(2, -2) })
    else if (part.startsWith('==') && part.endsWith('==') && part.length > 4) out.push({ k: 'hl', v: part.slice(2, -2) })
    else if (/^\^\d+$/.test(part)) out.push({ k: 'fn', n: Number(part.slice(1)) })
    else out.push({ k: 'text', v: part })
  }
  return out
}

export function footnoteRefs(src: string): number[] {
  return parse(src).flatMap((r) => (r.k === 'fn' ? [r.n] : []))
}

export function plain(src: string): string {
  return parse(src).map((r) => (r.k === 'fn' ? '' : r.v)).join('')
}
