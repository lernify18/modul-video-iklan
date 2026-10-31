import { expect, test, type Page } from '@playwright/test'
import { bookFor } from '../../src/content'
import type { OS } from '../../src/content/types'

// Modul 4, click to click (Ubai, 29 Okt 2026): a grid Short from YouTube, downloaded on savefrom by the free path
// (with low quality, then MP4 360), copied into the project's Footage folder; phone recordings go to RAW.

const next = (page: Page) => page.getByRole('button', { name: 'Seterusnya', exact: true })
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
  test(`${os}: Latihan walks Modul 4 from the YouTube search to Footage, every click answers Betul`, async ({ page }) => {
    test.setTimeout(120_000)
    await setup(page, os)
    const m4 = bookFor(os).filter((p) => p.chapter.id === 'm4').map((p) => p.page)
    await open(page, /Cari latar grid/)
    let screens = 0
    for (const p of m4.slice(m4.findIndex((x) => x.id === 'm4-cari'))) {
      await expect(page.locator('article.page')).toHaveAttribute('data-page-id', p.id)
      if (p.kind === 'shot') {
        await clickTarget(page)
        await expect(msg(page), `${os} ${p.id}`).toContainText('Betul')
        screens++
      }
      if (await next(page).isEnabled()) await next(page).click()
    }
    expect(screens).toBe(os === 'mac' ? 13 : 12)
  })
}

test('savefrom: the reader is warned about advert tabs and steered off the big blue button', async ({ page }) => {
  await setup(page, 'mac')
  await open(page, /Buka savefrom/)
  await expect(page.locator('article.page .note.awas')).toContainText('tab iklan baru')
  await open(page, /Klik with low quality/)
  await expect(page.locator('article.page .say')).toContainText('Jangan klik butang biru besar')
  await page.getByRole('group', { name: 'Pilih mod' }).getByRole('button', { name: /Latihan/ }).click()
  const cam = page.locator('[data-testid=stage] .cam')
  const box = (await cam.boundingBox())!
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.69)
  await expect(msg(page), 'the big blue button is not the answer').toContainText('Hampir')
})

test('phone recordings: AirDrop on a Mac, a USB cable on Windows', async ({ page }) => {
  await setup(page, 'mac')
  await open(page, /Rakaman iPhone ke folder RAW/)
  await expect(page.locator('article.page')).toContainText('AirDrop')
  await page.getByRole('group', { name: 'Komputer awak' }).getByRole('button', { name: 'Windows', exact: true }).click()
  await open(page, /Rakaman telefon ke folder RAW/)
  await expect(page.locator('article.page')).toContainText('kabel USB')
})
