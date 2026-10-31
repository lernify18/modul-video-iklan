import { expect, test, type Page } from '@playwright/test'
import { vo } from '../../src/content'

// Ubai approved 29 Okt 2026 (artifact Hj5WyXo6LufAs3f5Pkxm6p): empty space is filled with 3D infographics that light
// step by step with his voice; read in silence, or after Hentikan, every step shows so the page reads in full.

const audio = (page: Page) => page.getByTestId('vo-audio')
const playing = (page: Page) => audio(page).evaluate((a: HTMLAudioElement) => !a.paused && a.currentTime > 0)
const seek = (page: Page, t: number) => audio(page).evaluate((a: HTMLAudioElement, s: number) => { a.currentTime = s }, t)

async function open(page: Page, title: RegExp) {
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: title }).click()
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('modul:suara-auto', 'off'))
  await page.goto('/')
})

test('silent reading: every step of every infographic is shown', async ({ page }) => {
  for (const title of [/Kenal Bahan Sebuah Video/, /Kamus kecil/, /VO atau POV\?/, /Gaya edit sama, hook lain/, /Ayat siap untuk minta ubah/]) {
    await open(page, title)
    const steps = page.locator('article.page .ix .it')
    expect(await steps.count(), String(title)).toBeGreaterThan(2)
    await expect(page.locator('article.page .ix.live')).toHaveCount(0)
    for (const s of await steps.all()) await expect(s).toHaveClass(/\bon\b/)
  }
})

test('while the voice plays, the map waits dim and lights stop by stop, the latest one glowing', async ({ page }) => {
  await open(page, /Kenal Bahan Sebuah Video/)
  await page.getByTestId('vo-button').click()
  await expect.poll(() => playing(page)).toBe(true)
  await seek(page, 0)
  const road = page.locator('article.page .ix-road')
  await expect(road).toHaveClass(/live/)
  const stops = road.locator('.ix-stop')
  await expect(stops).toHaveCount(6)
  await expect(stops.first()).not.toHaveClass(/\bon\b/)
  await seek(page, vo['m1-pembuka']!.dur * 0.4)
  await expect(stops.first()).toHaveClass(/\bon\b/)
  await expect(stops.last()).not.toHaveClass(/\bon\b/)
  await expect(road.locator('.ix-stop.now')).toHaveCount(1)
  await seek(page, vo['m1-pembuka']!.dur * 0.97)
  await expect(stops.last()).toHaveClass(/\bon\b/)
})

test('find-the-part: each part\'s process lights when Ubai names that part', async ({ page }) => {
  await open(page, /Caption dan angka/)
  await page.getByTestId('vo-button').click()
  await expect.poll(() => playing(page)).toBe(true)
  await seek(page, 0)
  const rows = page.locator('.legend li.hasflow')
  await expect(rows).toHaveCount(2)
  await expect(rows.nth(0).locator('.ix-step').first()).not.toHaveClass(/\bon\b/)
  const [c0, c1] = vo['m1-komponen-b']!.cues
  await seek(page, c0! + 0.2)
  await expect(rows.nth(0).locator('.ix-step').last()).toHaveClass(/\bon\b/)
  await expect(rows.nth(1).locator('.ix-step').first()).not.toHaveClass(/\bon\b/)
  await seek(page, c1! + 0.2)
  await expect(rows.nth(1).locator('.ix-step').last()).toHaveClass(/\bon\b/)
})

test('Hentikan shows every step at once', async ({ page }) => {
  await open(page, /Tengok Hasil Dulu/)
  await page.getByTestId('vo-button').click()
  await expect.poll(() => playing(page)).toBe(true)
  await seek(page, 0)
  await expect(page.locator('article.page .ix-road')).toHaveClass(/live/)
  await page.getByTestId('vo-button').click()
  await expect(page.locator('article.page .ix-road')).not.toHaveClass(/live/)
  for (const s of await page.locator('article.page .ix-stop').all()) await expect(s).toHaveClass(/\bon\b/)
})

test('bank prompt: Contoh diisi shows a real filled prompt, Salin copies it clean, the card keeps its height', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await open(page, /Buat 10 video, satu angle/)
  const card = page.locator('article.page .prompt')
  const before = (await card.boundingBox())!.height
  await card.getByRole('button', { name: 'Contoh diisi' }).click()
  await expect(card.getByRole('button', { name: 'Contoh diisi' })).toHaveAttribute('aria-pressed', 'true')
  expect(Math.abs((await card.boundingBox())!.height - before)).toBeLessThan(1)
  await expect(card.locator('pre:not(.off) .hl').first()).toHaveText('Bekam Fizudean')
  await card.getByTestId('copy').click()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain('Untuk iklan Bekam Fizudean')
  expect(copied).not.toContain('==')
  await card.getByRole('button', { name: 'Templat' }).click()
  await card.getByTestId('copy').click()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('[nama produk]')
  await expect(page.locator('article.page .ix-flow .ix-step')).toHaveCount(4)
})

test('hook proof: the longest bar is the video with the most purchases, with the real numbers', async ({ page }) => {
  await open(page, /Gaya edit sama, hook lain/)
  const bars = page.locator('article.page .ix-bar')
  await expect(bars).toHaveCount(3)
  await expect(bars.first()).toContainText('40')
  await expect(bars.first()).toContainText('kos terendah')
  await expect(bars.last()).toContainText('4')
  const w = await bars.locator('.fill').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width))
  expect(w[0]).toBeGreaterThan(w[1]!)
  expect(w[1]).toBeGreaterThan(w[2]!)
})

test('phone: the module map becomes a list of stops, nothing positioned off the screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await open(page, /Kenal Bahan Sebuah Video/)
  const stops = page.locator('article.page .ix-stop')
  await expect(stops).toHaveCount(6)
  const xs = await stops.evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.right] }))
  for (const [l, r] of xs) { expect(l).toBeGreaterThanOrEqual(0); expect(r).toBeLessThanOrEqual(390) }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
})

test('Pilih pelan Pro: each step of the map lights as Ubai says it', async ({ page }) => {
  await open(page, /Pilih pelan Pro/)
  await page.getByTestId('vo-button').click()
  await expect.poll(() => playing(page)).toBe(true)
  const steps = page.locator('article.page .ix-flow .ix-step')
  await expect(steps).toHaveCount(4)
  const cues = vo['m3-l1-terang']!.cues
  for (const [i, t] of cues.entries()) {
    await seek(page, Math.max(0, t - 0.4))
    await expect(steps.nth(i), `step ${i + 1} before its cue`).not.toHaveClass(/\bon\b/)
    await seek(page, t + 0.3)
    await expect(steps.nth(i), `step ${i + 1} at its cue`).toHaveClass(/\bon\b/)
    await expect(steps.nth(i)).toHaveClass(/now/)
  }
})

