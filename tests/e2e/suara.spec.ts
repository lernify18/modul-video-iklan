import { expect, test, type Page } from '@playwright/test'
import { vo } from '../../src/content'

// Ubai approved 29 Okt 2026: one press first (Mula, or Seterusnya), then every page's voice starts by itself.
// Hentikan stops it and shows the page's last step; Senyap switches the auto voice off and is remembered.

const next = (page: Page) => page.getByRole('button', { name: 'Seterusnya', exact: true })
const audio = (page: Page) => page.getByTestId('vo-audio')
const playing = (page: Page) => audio(page).evaluate((a: HTMLAudioElement) => !a.paused && a.currentTime > 0)
const src = (page: Page) => audio(page).evaluate((a: HTMLAudioElement) => new URL(a.src).pathname.split('/').pop() ?? '')
const version = (page: Page) => audio(page).evaluate((a: HTMLAudioElement) => new URL(a.src).searchParams.get('v'))
const pageId = (page: Page) => page.locator('article.page').getAttribute('data-page-id')

async function fresh(page: Page) {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
}

test('first visit: the page waits for Mula, then Seterusnya starts the next page\'s voice by itself', async ({ page }) => {
  await fresh(page)
  const btn = page.getByTestId('vo-button')
  await expect(btn).toContainText('Mula')
  await page.waitForTimeout(800)
  expect(await playing(page), 'no voice before the reader presses anything').toBe(false)
  await next(page).click()
  await expect.poll(() => playing(page)).toBe(true)
  expect(await src(page)).toBe(`${await pageId(page)}.mp3`)
  expect(await version(page), 'a re-voiced clip is a new URL, never the cached old voice').toBe(vo[(await pageId(page))!]!.hash)
  await expect(btn).toContainText('Hentikan')
  await next(page).click()
  await expect.poll(() => src(page)).toBe(`${await pageId(page)}.mp3`)
  await expect.poll(() => playing(page)).toBe(true)
})

test('Hentikan stops the voice and offers Main semula, which plays from the start', async ({ page }) => {
  await fresh(page)
  await page.getByTestId('vo-button').click()
  await expect.poll(() => playing(page)).toBe(true)
  const btn = page.getByTestId('vo-button')
  await btn.click()
  await expect(btn).toContainText('Main semula')
  expect(await playing(page)).toBe(false)
  await btn.click()
  await expect.poll(() => playing(page)).toBe(true)
  expect(await audio(page).evaluate((a: HTMLAudioElement) => a.currentTime)).toBeLessThan(2)
})

test('Senyap: the next page stays silent until pressed, and the choice survives a reload', async ({ page }) => {
  await fresh(page)
  await page.getByRole('group', { name: 'Suara main sendiri' }).getByRole('button', { name: /Senyap/ }).click()
  await next(page).click()
  await page.waitForTimeout(1000)
  expect(await playing(page)).toBe(false)
  await expect(page.getByTestId('vo-button')).not.toContainText('Hentikan')
  await page.reload()
  await expect(page.getByRole('group', { name: 'Suara main sendiri' }).getByRole('button', { name: /Senyap/ })).toHaveAttribute('aria-pressed', 'true')
  await next(page).click()
  await page.waitForTimeout(1000)
  expect(await playing(page)).toBe(false)
})

test('auto voice on a screenshot page: the cursor waits for Ubai, then moves at his cue', async ({ page }) => {
  await fresh(page)
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: /Cuba sendiri/ }).click()
  await expect.poll(() => playing(page)).toBe(true)
  expect(await src(page)).toBe('n3.mp3')
  await page.waitForTimeout(1500)
  await expect(page.getByTestId('spot'), 'nothing lights up before the cue').not.toHaveClass(/on/)
  const cue = vo['n3']!.cues[0]!
  await audio(page).evaluate((a: HTMLAudioElement, t: number) => { a.currentTime = t }, cue - 0.3)
  await expect(page.getByTestId('spot')).toHaveClass(/on/, { timeout: 4000 })
})

test('Hentikan on a screenshot page jumps straight to the last step', async ({ page }) => {
  await fresh(page)
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: /Cuba sendiri/ }).click()
  await expect.poll(() => playing(page)).toBe(true)
  await page.getByTestId('vo-button').click()
  await expect(page.getByTestId('spot')).toHaveClass(/on/, { timeout: 3000 })
})

test('phone: the auto-voice switch sits in the table of contents, not the one-row top bar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await fresh(page)
  await expect(page.locator('.topbar').getByRole('group', { name: 'Suara main sendiri' })).toBeHidden()
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  const sw = page.locator('#toc').getByRole('group', { name: 'Suara main sendiri' })
  await expect(sw).toBeVisible()
  await sw.getByRole('button', { name: /Senyap/ }).click()
  await expect(sw.getByRole('button', { name: /Senyap/ })).toHaveAttribute('aria-pressed', 'true')
})
