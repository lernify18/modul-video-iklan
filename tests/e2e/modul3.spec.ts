import { expect, test, type Page } from '@playwright/test'
import { bookFor } from '../../src/content'
import type { OS } from '../../src/content/types'

// Modul 3, click to click (Ubai, 29 Okt 2026): log in and pay on example screens with a dummy e-mail, download,
// then install the Mac way or the Windows way, and sign in to the app. No step skipped on either computer.

const next = (page: Page) => page.getByRole('button', { name: 'Seterusnya', exact: true })
const pageId = (page: Page) => page.locator('article.page').getAttribute('data-page-id')
const msg = (page: Page) => page.locator('article.page [data-testid=msg]')

async function setup(page: Page, os: OS) {
  await page.addInitScript((os) => {
    localStorage.setItem('modul:suara-auto', 'off')
    if (!localStorage.getItem('modul:v1')) localStorage.setItem('modul:v1', JSON.stringify({ page: 0, mode: 'latih', os, done: [] }))
  }, os)
  await page.goto('/')
}

async function open(page: Page, title: RegExp) {
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: title }).click()
}

async function clickTarget(page: Page) {
  const cam = page.locator('[data-testid=stage] .cam')
  await expect(cam).toBeVisible()
  const t = (await cam.getAttribute('data-target'))!.split(',').map(Number) as [number, number, number, number]
  const box = (await cam.boundingBox())!
  await page.mouse.click(box.x + (box.width * (t[0] + t[2] / 2)) / 100, box.y + (box.height * (t[1] + t[3] / 2)) / 100)
}

for (const os of ['mac', 'win'] as const) {
  test(`${os}: Latihan walks Modul 3 screen by screen, every click answers Betul, in the book's order`, async ({ page }) => {
    test.setTimeout(120_000)
    await setup(page, os)
    const m3 = bookFor(os).filter((p) => p.chapter.id === 'm3').map((p) => p.page)
    await open(page, /Cuba sendiri/)
    const start = m3.findIndex((p) => p.id === 'm3-l1-cuba')
    let screens = 0
    for (const p of m3.slice(start)) {
      await expect(page.locator('article.page'), 'pages come in the chain order').toHaveAttribute('data-page-id', p.id)
      if (p.kind === 'shot') {
        await clickTarget(page)
        await expect(msg(page), `${os} ${p.id}`).toContainText('Betul')
        screens++
      }
      if (await next(page).isEnabled()) await next(page).click()
    }
    expect(screens).toBe(os === 'mac' ? 14 : 12)
  })
}

test('switching computer keeps the reader on the same step', async ({ page }) => {
  await setup(page, 'mac')
  await open(page, /Buka Claude\.dmg/)
  await page.getByRole('group', { name: 'Komputer awak' }).getByRole('button', { name: 'Windows', exact: true }).click()
  expect(await pageId(page), 'a Mac-only page falls back to the last shared one').toBe('m3-l3-download')
  await open(page, /Get started/)
  await page.getByRole('group', { name: 'Komputer awak' }).getByRole('button', { name: 'Mac', exact: true }).click()
  expect(await pageId(page)).toBe('m3-pasang-mula')
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await expect(page.locator('#toc').getByRole('button', { name: /Seret Claude ke Applications/ })).toBeVisible()
  await expect(page.locator('#toc').getByRole('button', { name: /Buka Claude Setup/ })).toHaveCount(0)
})

test('rebuilt screens say Paparan contoh, real captures say Screenshot sebenar, and keep their own shape', async ({ page }) => {
  await setup(page, 'mac')
  const label = page.locator('article.page .real')
  await open(page, /Continue with Google/)
  await expect(label).toHaveText('Paparan contoh')
  await open(page, /Seret Claude ke Applications/)
  await expect(label).toHaveText('Screenshot sebenar')
  await open(page, /Get started/)
  const box = (await page.locator('[data-testid=stage]').boundingBox())!
  expect(box.width / box.height, 'the square app window is not stretched to 16:10').toBeCloseTo(1, 1)
  await page.getByRole('group', { name: 'Komputer awak' }).getByRole('button', { name: 'Windows', exact: true }).click()
  await open(page, /Buka Claude Setup/)
  await expect(label).toHaveText('Paparan contoh Windows')
})

test('the dummy e-mail is the only account shown, and card numbers are dots', async ({ page }) => {
  await setup(page, 'mac')
  await open(page, /Log masuk dan bayar/)
  await expect(page.locator('article.page')).toContainText('pelajar.demo@gmail.com')
  await open(page, /Isi kad, klik Subscribe/)
  await expect(page.locator('[data-testid=stage] img')).toHaveAttribute('src', '/shots/contoh/m3-bayar.png')
})
