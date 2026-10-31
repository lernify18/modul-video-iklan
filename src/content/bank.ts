import type { IconName, Page } from './types'
import bank from './bank.json' with { type: 'json' }
import groupsJson from './bank-groups.json' with { type: 'json' }

/** One of Ubai's own prompts from his other projects, cleaned for beginners (src/content/bank.json). */
export interface BankPrompt {
  readonly id: string
  readonly kategori: string
  readonly tajuk: string
  readonly projek: string
  readonly tarikh: string
  readonly asal: string
  readonly ringkas: string
  readonly kenapa: string
  /** The same prompt filled in for one of Ubai's real ads, ==marked== where it was filled. */
  readonly contoh: string
  /** What happens after the learner pastes it, in four steps. */
  readonly aliran: readonly { readonly icon: string; readonly title: string }[]
}

/** Page per category, in the order the bank lists them: title, voice id and the one-line lesson of that group. */
export interface BankGroup { readonly kategori: string; readonly title: string; readonly vo: string; readonly keynote: string }

const all: readonly BankPrompt[] = bank
const ICONS: ReadonlySet<string> = new Set<IconName>(['chat', 'mic', 'caption', 'phone', 'doc', 'zoom', 'target', 'film', 'grid', 'hook', 'click', 'svg', 'layers', 'flare', 'gear', 'video', 'table', 'folder', 'flag', 'browser', 'type', 'tab', 'code', 'yes', 'no', 'bulb'])
const icon = (n: string): IconName => (ICONS.has(n) ? (n as IconName) : 'chat')
const groups: readonly BankGroup[] = groupsJson

const short = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s)

/**
 * One prompt per page, so each page fits one desktop screen: why it works and Ubai's own words on the left; the
 * cleaned prompt to copy on the right (with a tab that shows it filled in for a real ad) and what happens after
 * pasting it. The category's voice plays on its first page.
 */
export const bankPages: readonly Page[] = groups
  .map((g) => ({ g, items: all.filter((p) => p.kategori === g.kategori) }))
  .filter(({ items }) => items.length > 0)
  .flatMap(({ g, items }, gi) =>
    items.map((p, k): Page => ({
      id: k === 0 ? `m2-bank-${gi + 1}` : `m2-bank-${gi + 1}-${k + 1}`,
      kind: 'explain', tone: 'butter', kicker: `Bank prompt · ${g.title} · ${k + 1}/${items.length}`, title: p.tajuk,
      ...(k === 0 ? { vo: g.vo } : {}), keynote: g.keynote,
      blocks: [
        { t: 'note', tone: 'tip', title: 'Kenapa berkesan', text: p.kenapa },
        { t: 'quote', text: short(p.asal, 170), cite: `Asal Ubai · ${[p.projek, p.tarikh].filter(Boolean).join(', ')} · nama, nombor dan kunci rahsia dibuang` },
        { t: 'prompt', title: 'Salin, tukar [tempat kosong]', text: p.ringkas, example: p.contoh },
        { t: 'flow', title: 'Cara prompt ini bekerja', steps: p.aliran.map((s) => ({ icon: icon(s.icon), title: s.title })) },
      ],
    })),
  )
