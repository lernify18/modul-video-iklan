import { expect, test, type Page } from '@playwright/test'
import { bookFor } from '../../src/content'

// The reader starts on a Mac; this is the book it walks through.
const pages = bookFor('mac')

// Ubai, 29 Okt 2026: every page is one fixed 1280 × 680 sheet in three zones (head, body, foot), scaled to the screen,
// so a desktop never scrolls and a big screen shows a bigger page, not an emptier one. On a phone the zones stack and
// the page scrolls, with a clear "there is more below" button until the end.

const next = (page: Page) => page.getByRole('button', { name: 'Seterusnya', exact: true })

async function settle(page: Page) {
  await page.evaluate(() => Promise.all([...document.querySelectorAll('article.page img')].map((i) => (i as HTMLImageElement).decode().catch(() => undefined))))
  await page.waitForTimeout(250)
}

for (const [w, h, min] of [[1440, 900, 1], [1366, 650, 0.68]] as const) {
  test(`desktop ${w}x${h}: every page fills one sheet, body fits at full size, footnotes sit in the foot`, async ({ page }) => {
    test.setTimeout(240_000)
    await page.setViewportSize({ width: w, height: h })
    await page.goto('/')
    for (const { page: p } of pages) {
      await expect(page.locator('article.page')).toHaveAttribute('data-page-id', p.id)
      await settle(page)
      const m = await page.evaluate(() => {
        const a = document.querySelector('article.page') as HTMLElement
        const r = (sel: string) => a.querySelector(sel)?.getBoundingClientRect()
        const sheet = a.getBoundingClientRect()
        // The body zone's padding only gives shadows room (cancelled by a negative margin); measure its content box.
        const el = a.querySelector('.sh-body') as HTMLElement
        const k = Number(a.dataset.sheet) || 1
        const pad = parseFloat(getComputedStyle(el).paddingBottom) * k
        const body = { bottom: el.getBoundingClientRect().bottom - pad }
        const fit = r('.fit')!
        const foot = r('.sh-foot')!
        const fn = r('.fn')
        return {
          docScroll: document.documentElement.scrollHeight - window.innerHeight,
          inView: sheet.top >= 0 && sheet.bottom <= window.innerHeight,
          sheet: Number(a.dataset.sheet),
          fit: Number(a.dataset.scale),
          cut: Math.round(fit.bottom - body.bottom),
          footBelowBody: foot.top >= body.bottom - 1,
          fnInFoot: !fn || (fn.top >= foot.top && fn.bottom <= foot.bottom + 1),
        }
      })
      expect.soft(m.docScroll, `${p.id}: the window scrolls`).toBeLessThanOrEqual(1)
      expect.soft(m.inView, `${p.id}: sheet runs past the screen`).toBe(true)
      expect.soft(m.sheet, `${p.id}: sheet scaled too small to read`).toBeGreaterThanOrEqual(min * 0.99)
      expect.soft(m.fit, `${p.id}: body had to shrink to fit`).toBe(1)
      expect.soft(m.cut, `${p.id}: body content runs past the body zone by ${m.cut}px`).toBeLessThanOrEqual(2)
      expect.soft(m.footBelowBody && m.fnInFoot, `${p.id}: footnotes or Key Note left the foot zone`).toBe(true)
      if (await next(page).isEnabled()) await next(page).click()
    }
  })
}

test('desktop 1920x1080: the sheet grows with the screen and stays centred', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')
  const a = page.locator('article.page')
  await expect(a).toHaveAttribute('data-sheet', /^1\.[2-9]/)
  const box = (await a.boundingBox())!
  const area = (await page.locator('.pagewrap').boundingBox())!
  expect(Math.abs(box.x + box.width / 2 - (area.x + area.width / 2))).toBeLessThan(2)
  expect(Math.abs(box.y + box.height / 2 - (area.y + area.height / 2))).toBeLessThan(2)
  expect(box.width / box.height).toBeCloseTo(1280 / 680, 2)
})

test('desktop 1366x650: a Latihan click still lands on the real button when the sheet is scaled', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 650 })
  await page.goto('/')
  await page.getByRole('group', { name: 'Pilih mod' }).getByRole('button', { name: /Latihan/ }).click()
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: /Cuba sendiri/ }).click()
  await settle(page)
  const cam = page.locator('[data-testid=stage] .cam')
  const t = (await cam.getAttribute('data-target'))!.split(',').map(Number) as [number, number, number, number]
  const box = (await cam.boundingBox())!
  await page.mouse.click(box.x + (box.width * (t[0] + t[2] / 2)) / 100, box.y + (box.height * (t[1] + t[3] / 2)) / 100)
  await expect(page.locator('article.page [data-testid=msg]')).toContainText('Betul')
})

test('phone: zones stack head → body → foot, and a long page says there is more below until the reader gets there', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 })
  // The hint bobs to catch the eye; with reduced motion (as the test asks) it holds still, so it can be clicked.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: /Kamus kecil video iklan/ }).click()
  const y = async (sel: string) => (await page.locator(`article.page ${sel}`).boundingBox())!.y
  expect(await y('.sh-head')).toBeLessThan(await y('.sh-body'))
  expect(await y('.sh-body')).toBeLessThan(await y('.sh-foot'))
  await expect(page.locator('article.page')).toHaveAttribute('data-sheet', '0.00')
  const hint = page.getByRole('button', { name: 'Ada lagi di bawah' })
  await expect(hint).toBeVisible()
  await hint.click()
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight }))
  await expect(hint).toBeHidden()
})
