import { SKILL } from './skill'
import type { Page, Pakej } from './types'

/** Ubai's own video-ad skill, rewritten for every niche; the Pro package downloads it. */
export const PRO_SKILL = 'ubai-videoads'

/** Where a Basic buyer upgrades to Pro on Sellhiz; empty until the product exists, and the button waits for it. */
export const NAIK_TARAF_URL = ''

/** The Pro skill as one zip; the Worker gives /pro/* to Pro codes only. */
export const PRO_ZIP = `/pro/${PRO_SKILL}.zip`

/** Pasted once in a Pro reader's new session, after the zip is in Downloads. */
export const PRO_PASANG = [
  `Pasang skill dari fail zip ini ke folder skills Claude saya: ~/Downloads/${PRO_SKILL}.zip`,
  `Jika folder ${PRO_SKILL} sudah ada, tanya saya dulu sebelum menindih.`,
  'Lepas siap, tunjuk di mana skill disimpan dan ayat untuk guna skill ini.',
].join('\n')

export const skillFor = (p: Pakej) => (p === 'pro' ? PRO_SKILL : SKILL)

/** Text as a reader of this package sees it: a Pro reader's prompts and pages call their own skill. */
export const forPakej = (text: string, p: Pakej) => (p === 'pro' ? text.replaceAll(SKILL, PRO_SKILL) : text)

/**
 * A page is in the book of its own package. A Basic book also keeps the Pro pages marked `kunci`, locked: one
 * preview, not a run of locked pages.
 */
export const inBook = (page: Page, p: Pakej) => !page.pakej || page.pakej === p || (page.pakej === 'pro' && !!page.kunci)
export const locked = (page: Page, p: Pakej) => page.pakej === 'pro' && p !== 'pro'
