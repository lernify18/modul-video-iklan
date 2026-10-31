import { modul0 } from './modul0'
import { modul1 } from './modul1'
import { modul2 } from './modul2'
import { modul3 } from './modul3'
import { modul4 } from './modul4'
import { modul5 } from './modul5'
import { modul6 } from './modul6'
import { modul7 } from './modul7'
import { inBook } from './pakej'
import type { Chapter, OS, Page, Pakej, VoClip } from './types'
import voJson from './vo.json' with { type: 'json' }

export const BOOK_TITLE = '10 Video Iklan Dengan Claude'

export const chapters: readonly Chapter[] = [modul0, modul1, modul2, modul3, modul4, modul5, modul6, modul7].sort((a, b) => a.module - b.module)

export interface BookPage {
  readonly page: Page
  readonly chapter: Chapter
  /** Page number printed at the foot, counted across the book as this reader's computer sees it. */
  readonly no: number
}

/** Every page of the book, Mac-only and Windows-only ones included, in reading order. */
export const allPages: readonly Page[] = chapters.flatMap((chapter) => chapter.pages)

/**
 * The book as one computer and one package see it: pages meant for the other computer, and a Basic reader's install
 * pages in a Pro book, are left out, and numbers count the rest.
 */
export function bookFor(os: OS, pakej: Pakej = 'basic'): readonly BookPage[] {
  return chapters
    .flatMap((chapter) => chapter.pages.filter((page) => (!page.os || page.os === os) && inBook(page, pakej)).map((page) => ({ page, chapter })))
    .map((p, i) => ({ ...p, no: i + 1 }))
}

/**
 * Where a reader lands after switching computer: the same page, or when that page exists only for the other
 * computer, the last page before it that both share.
 */
export function samePlace(id: string, os: OS, pakej: Pakej = 'basic'): number {
  const book = bookFor(os, pakej)
  const here = book.findIndex((p) => p.page.id === id)
  if (here >= 0) return here
  const order = allPages.findIndex((p) => p.id === id)
  const before = allPages.slice(0, Math.max(0, order)).map((p) => p.id)
  for (let i = book.length - 1; i >= 0; i--) if (before.includes(book[i]!.page.id)) return i
  return 0
}

export const vo: Readonly<Record<string, VoClip>> = voJson

/** Clips are cached for a day under the same name; the hash makes a re-voiced clip a new URL, so no stale voice plays. */
export const voUrl = (id: string): string => `/vo/${id}.mp3` + (vo[id]?.hash ? `?v=${vo[id].hash}` : '')
