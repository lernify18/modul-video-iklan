import { expect, test, type Page } from '@playwright/test'
import { bookFor } from '../../src/content'
import { SKILL_PROMPT } from '../../src/content/skill'
import type { OS } from '../../src/content/types'

// Ubai, 30 Okt 2026: Ubai's skill is a bonus (Modul 7), installed screen by screen in its own session; then a new
// session to use it in a project the reader already has. Background music: Pixabay / Mixkit first, and ytmp3 too, with a copyright warning.

const INSTALL = ['m7-skill', 'm7-skill-hantar', 'm7-skill-izin', 'm7-skill-siap', 'm7-sesi-baru', 'm7-guna-projek']
const msg = (page: Page) => page.locator('article.page [data-testid=msg]')

test('the bonus skill prompt copies whole and exact, from a box that scrolls inside one sheet', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await setup(page, 'mac')
  await open(page, /Pasang skill iklan-video/)
  const card = page.locator('article.page .prompt.fixed')
  await card.getByTestId('copy').click()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(SKILL_PROMPT)
  expect(await card.locator('pre').evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true)
  expect(Number(await page.locator('article.page').getAttribute('data-scale')), 'body shrank to fit').toBe(1)
})

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

for (const os of ['mac', 'win'] as const) {
  test(`${os}: the bonus skill is installed in its own session, and using it starts after ＋ New`, async ({ page }) => {
    const ids = bookFor(os).map((b) => b.page.id)
    const at = ids.indexOf(INSTALL[0]!)
    expect(ids.slice(at, at + INSTALL.length)).toEqual(INSTALL)

    await setup(page, os)
    await open(page, /Skill siap, buka sesi baru/)
    const cam = page.locator('[data-testid=stage] .cam')
    const t = (await cam.getAttribute('data-target'))!.split(',').map(Number) as [number, number, number, number]
    expect(t[0] + t[2], `${os}: ＋ New sits in the left list`).toBeLessThan(40)
    const box = (await cam.boundingBox())!
    await page.mouse.click(box.x + (box.width * (t[0] + t[2] / 2)) / 100, box.y + (box.height * (t[1] + t[3] / 2)) / 100)
    await expect(msg(page)).toContainText('Betul')
  })
}

test('music: Pixabay / Mixkit is the recommended way, ytmp3 is taught with the copyright warning', async ({ page }) => {
  await setup(page, 'mac')
  await open(page, /Muzik latar: dua cara/)
  await expect(page.locator('article.page .vs .pick')).toContainText('Pixabay')
  await open(page, /Cara 2: YouTube ke MP3/)
  const art = page.locator('article.page')
  await expect(art).toContainText('ytmp3.gl')
  await expect(art.locator('.note.awas')).toContainText('hak cipta')
  const img = art.locator('figure.pic img')
  await img.scrollIntoViewIfNeeded()
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0)
})
