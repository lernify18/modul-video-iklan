import { expect, test, type Page } from '@playwright/test'
import { bookFor } from '../../src/content'
import type { OS } from '../../src/content/types'

// Modul 5, click to click (Ubai, 29 Okt 2026): Claude Desktop in Code mode, the project folder, one prompt for POV
// and VO together, Allow once, five samples, changes, then the full batch of 20.

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
  test(`${os}: Latihan walks Modul 5 from opening Claude to Allow once, every click answers Betul`, async ({ page }) => {
    test.setTimeout(120_000)
    await setup(page, os)
    const m5 = bookFor(os).filter((p) => p.chapter.id === 'm5').map((p) => p.page)
    await open(page, /Buka app Claude/)
    let screens = 0
    for (const p of m5.slice(m5.findIndex((x) => x.id === 'm5-buka'))) {
      await expect(page.locator('article.page')).toHaveAttribute('data-page-id', p.id)
      if (p.kind === 'shot') {
        await clickTarget(page)
        await expect(msg(page), `${os} ${p.id}`).toContainText('Betul')
        screens++
      }
      if (await next(page).isEnabled()) await next(page).click()
    }
    // 7 screens to the ad's Allow once, then 4 to turn the finished ads into the reader's own skill (30 Okt 2026).
    expect(screens).toBe(11)
  })
}

test('the POV + VO prompt copies clean, and its filled example uses the real umrah facts', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await setup(page, 'mac')
  await open(page, /Tampal prompt POV \+ VO/)
  const card = page.locator('article.page .prompt')
  await card.getByRole('button', { name: 'Contoh diisi' }).click()
  await card.getByTestId('copy').click()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain('Umrah Musim Sejuk ikhlas.com')
  expect(copied).toContain('RM5,990')
  // From scratch: the prompt carries format, size and rules itself and calls no skill.
  expect(copied.split('\n')[0]).toMatch(/^Saya nak buat video iklan untuk Umrah Musim Sejuk ikhlas\.com/)
  expect(copied).not.toContain('Guna skill')
  expect(copied).toContain('Klik butang di bawah')
  expect(copied).not.toContain('==')
})

test('when the ads are right, the reader turns the session into a skill of their own and starts the next project with it', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await setup(page, 'mac')
  await open(page, /Jadikan skill awak sendiri/)
  const card = page.locator('article.page .prompt')
  await card.getByRole('button', { name: 'Contoh diisi' }).click()
  await card.getByTestId('copy').click()
  const own = await page.evaluate(() => navigator.clipboard.readText())
  expect(own).toContain('dah ngam')
  expect(own.match(/iklan-kedai-saya/g)).toHaveLength(2)
  expect(own).not.toMatch(/iklan-video|ubai-videoads/)
  await open(page, /Lain kali, satu baris pun cukup/)
  const next = page.locator('article.page .prompt')
  await next.getByRole('button', { name: 'Contoh diisi' }).click()
  await next.getByTestId('copy').click()
  expect((await page.evaluate(() => navigator.clipboard.readText())).split('\n')[0]).toBe('Guna skill iklan-kedai-saya.')
})

test('the ElevenLabs key is treated as a secret', async ({ page }) => {
  await setup(page, 'mac')
  await open(page, /Ambil API key ElevenLabs/)
  await expect(page.locator('article.page .note.privasi')).toContainText('.env')
})
