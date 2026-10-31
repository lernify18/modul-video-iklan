import { expect, test, type Page } from '@playwright/test'
import { bookFor } from '../../src/content'

// Ubai, 30 Okt 2026: Modul 0 opens with his own proven sales (videos edited with Claude, numbers from Meta and
// Sellhiz), then the client work, each marked for how proven it is. 31 Okt: no class case study, and no price of his
// product (a cost per purchase reads as the price).

async function open(page: Page, title: RegExp) {
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: title }).click()
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('modul:suara-auto', 'off')
    if (!localStorage.getItem('modul:v1')) localStorage.setItem('modul:v1', JSON.stringify({ page: 0, mode: 'latih', os: 'mac', done: [] }))
  })
  await page.goto('/')
})

test('the three case studies run digital, bekam, umrah; own sales marked proven, client work marked as such', async ({ page }) => {
  const m0 = bookFor('mac').filter((b) => b.chapter.id === 'm0').map((b) => b.page.id)
  expect(m0.filter((id) => ['m0-digital', 'm0-kelas', 'm0-bekam', 'm0-umrah'].includes(id))).toEqual(['m0-digital', 'm0-bekam', 'm0-umrah'])
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await expect(page.locator('#toc')).not.toContainText('Iklan kelas')
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  for (const [title, kicker, badge] of [
    [/Iklan digital/, 'Kajian kes 1', 'Terbukti jual'],
    [/Iklan bekam/, 'Kajian kes 2', 'Untuk klien'],
    [/Iklan umrah/, 'Kajian kes 3', 'Untuk klien'],
  ] as const) {
    await open(page, title)
    const art = page.locator('article.page')
    await expect(art).toContainText(kicker)
    await expect(art.locator('.badge')).toContainText(badge)
    const video = art.locator('video')
    await expect(video).toHaveAttribute('poster', /\/media\/.+\.jpg$/)
    const ok = await page.request.get((await video.getAttribute('src'))!)
    expect(ok.status(), `${kicker} video served`).toBe(200)
  }
})

test('the digital case shows its four real figures, none of them a price', async ({ page }) => {
  await open(page, /Iklan digital/)
  const stats = page.locator('article.page .stat')
  await expect(stats).toHaveCount(4)
  await expect(stats.nth(1)).toContainText('40')
  await expect(stats.nth(2)).toContainText('2,246')
  await expect(page.locator('article.page')).not.toContainText(/RM\s?\d/)
})

test('same edit, other hook: the bars rank the three videos by purchases, cheapest first, with no price, and the page proof', async ({ page }) => {
  await open(page, /Gaya edit sama, hook lain/)
  const art = page.locator('article.page')
  const text = await art.locator('.ix-bars').innerText()
  expect(text.indexOf('kos terendah')).toBeGreaterThan(-1)
  expect(text.indexOf('kos terendah')).toBeLessThan(text.indexOf('2.3× kos'))
  await expect(art).not.toContainText(/RM\s?\d/)
  const img = art.locator('figure.pic img')
  await img.scrollIntoViewIfNeeded()
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0)
})
