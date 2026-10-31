import { expect, test, type Page } from '@playwright/test'
import { bookFor } from '../../src/content'
import type { OS } from '../../src/content/types'

// Modul 6 (Ubai, 31 Okt 2026: the module is about making the videos, not marketing them): check, pick the best 6,
// name the files, captions from Claude in Ubai's CW format, ready to post. No Ads Manager.

async function setup(page: Page, os: OS, mode: 'latih' | 'tutor' = 'latih') {
  await page.addInitScript(([os, mode]) => {
    localStorage.setItem('modul:suara-auto', 'off')
    if (!localStorage.getItem('modul:v1')) localStorage.setItem('modul:v1', JSON.stringify({ page: 0, mode, os, done: [] }))
  }, [os, mode] as const)
  await page.goto('/')
}

async function open(page: Page, title: RegExp) {
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: title }).click()
}

test('Modul 6 ends with the videos ready to post: no Ads Manager, no campaign, no cost per purchase', async ({ page }) => {
  const m6 = bookFor('mac').filter((b) => b.chapter.id === 'm6').map((b) => b.page)
  expect(m6.map((p) => p.id)).toEqual(['m6-pembuka', 'm6-semak', 'm6-pilih', 'm6-nama', 'm6-cw', 'm6-cw-hasil', 'm6-rumusan', 'm6-tamat'])
  expect(m6.some((p) => p.kind === 'shot')).toBe(false)
  await setup(page, 'mac', 'tutor')
  for (const title of [/Video Siap/, /Video awak dah siap/, /Kursus selesai/]) {
    await open(page, title)
    const text = await page.locator('article.page').innerText()
    expect(text, String(title)).not.toMatch(/Ads Manager|kempen|kos per beli|Publish/i)
  }
})

test('the caption prompt copies clean in Ubai\'s CW format, and its example uses the digital facts without a price', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await setup(page, 'mac', 'tutor')
  await open(page, /Minta Claude tulis caption/)
  const card = page.locator('article.page .prompt')
  await card.getByTestId('copy').click()
  const template = await page.evaluate(() => navigator.clipboard.readText())
  expect(template).toContain('[ciri produk]')
  expect(template).toContain('dan bukti: [bukti]')
  expect(template).toContain('«Klik butang di bawah»')
  expect(template).toContain('Jangan reka ulasan')
  await card.getByRole('button', { name: 'Contoh diisi' }).click()
  await card.getByTestId('copy').click()
  const filled = await page.evaluate(() => navigator.clipboard.readText())
  expect(filled).toContain('819 order dalam 14 hari')
  expect(filled).toContain('tanpa coding')
  expect(filled).not.toMatch(/RM\s?\d|umrah|ikhlas/i)
  expect(filled).not.toContain('==')
  expect(filled).not.toContain('[')
})

test('the real caption is broken into its parts, and the first set is 3 POV + 3 VO', async ({ page }) => {
  await setup(page, 'mac', 'tutor')
  await open(page, /Caption sebenar, bahagian demi bahagian/)
  const rows = page.locator('article.page table tbody tr')
  await expect(rows.first()).toContainText('Ingatkan kena pandai coding baru boleh jual game')
  await expect(rows.filter({ hasText: 'Bukti' })).toContainText('819 order dalam 14 hari')
  await expect(rows.filter({ hasText: 'Headline' })).toContainText('Sehari Je, 26 Jualan Masuk')
  await expect(page.locator('article.page')).not.toContainText('Lesen')
  await open(page, /Pilih 6 yang terbaik/)
  await expect(page.locator('article.page')).toContainText('3 POV dan 3 VO')
})
