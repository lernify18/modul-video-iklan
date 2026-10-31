import { expect, test, type Page } from '@playwright/test'
import { bookFor } from '../../src/content'
import { PRO_PASANG, PRO_SKILL, PRO_ZIP } from '../../src/content/pakej'

// Ubai, 30 Okt 2026: Pro gets the skill ubai-videoads as a download, installed screen by screen in its own session,
// and Modul 7. A Basic reader sees two Pro pages, locked, with nothing to download or copy.

const msg = (page: Page) => page.locator('article.page [data-testid=msg]')

async function setup(page: Page, pakej: 'basic' | 'pro', mode: 'latih' | 'tutor' = 'latih') {
  await page.addInitScript(({ pakej, mode }) => {
    localStorage.setItem('modul:suara-auto', 'off')
    localStorage.setItem('modul:pakej', pakej)
    if (!localStorage.getItem('modul:v1')) localStorage.setItem('modul:v1', JSON.stringify({ page: 0, mode, os: 'mac', done: [] }))
  }, { pakej, mode })
  await page.goto('/')
}

async function open(page: Page, title: RegExp) {
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: title }).click()
}

async function clickTarget(page: Page) {
  const cam = page.locator('[data-testid=stage] .cam')
  const t = (await cam.getAttribute('data-target'))!.split(',').map(Number) as [number, number, number, number]
  const box = (await cam.boundingBox())!
  await page.mouse.click(box.x + (box.width * (t[0] + t[2] / 2)) / 100, box.y + (box.height * (t[1] + t[3] / 2)) / 100)
}

test('basic: one Pro page shows locked, with no download and no prompt; the rest of Pro is not in the book', async ({ page }) => {
  await setup(page, 'basic')
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  const toc = page.locator('#toc')
  await expect(toc.locator('.pro-chip')).toHaveCount(1)
  await expect(toc).not.toContainText('Tujuh langkah sebelum video siap')
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  for (const title of [new RegExp(`Muat turun skill ${PRO_SKILL}`)]) {
    await open(page, title)
    const art = page.locator('article.page')
    await expect(art.getByTestId('kunci')).toBeVisible()
    await expect(art.getByTestId('kunci')).toContainText('Muka ini untuk pakej Pro')
    await expect(art.getByTestId('muat-turun')).toHaveCount(0)
    await expect(art.locator('.prompt')).toHaveCount(0)
  }
})

test('pro: the download button points at the Pro zip, the install prompt copies exact, and the install screens all answer Betul', async ({ page, context }) => {
  test.setTimeout(90_000)
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await setup(page, 'pro')
  await open(page, new RegExp(`Muat turun skill ${PRO_SKILL}`))
  const art = page.locator('article.page')
  await expect(art.getByTestId('muat-turun')).toHaveAttribute('href', PRO_ZIP)
  await expect(art.getByTestId('kunci')).toHaveCount(0)
  await art.locator('.prompt').getByTestId('copy').click()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(PRO_PASANG)
  for (const id of ['m7-pro-hantar', 'm7-pro-izin', 'm7-pro-siap', 'm7-pro-sesi-baru']) {
    await page.getByRole('button', { name: 'Seterusnya', exact: true }).click()
    await expect(art).toHaveAttribute('data-page-id', id)
    await clickTarget(page)
    await expect(msg(page), id).toContainText('Betul')
  }
  await page.getByRole('button', { name: 'Seterusnya', exact: true }).click()
  await expect(art).toHaveAttribute('data-page-id', 'm7-guna-projek')
})

test('pro: Modul 7 is open, every Pro page fits one sheet, and the skill-naming voice is the Pro twin', async ({ page }) => {
  test.setTimeout(120_000)
  await page.setViewportSize({ width: 1440, height: 900 })
  await setup(page, 'pro', 'tutor')
  const ids = bookFor('mac', 'pro').filter((b) => b.page.pakej === 'pro').map((b) => b.page.title!)
  expect(ids.length).toBeGreaterThanOrEqual(11)
  for (const title of ids) {
    await open(page, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    await page.waitForTimeout(300)
    expect(Number(await page.locator('article.page').getAttribute('data-scale')), `${title}: body shrank`).toBe(1)
  }
  await open(page, /Guna skill Ubai dalam projek sedia ada/)
  await expect(page.locator('article.page .prompt pre').first()).toContainText(`Guna skill ${PRO_SKILL} pada folder projek ini.`)
  await page.getByTestId('vo-button').click()
  await expect(page.getByTestId('vo-audio')).toHaveAttribute('src', /m7-guna-projek-pro\.mp3/)
})
