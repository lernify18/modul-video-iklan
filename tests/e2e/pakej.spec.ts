import { expect, test, type Page } from '@playwright/test'
import { PRO_SKILL } from '../../src/content/pakej'
import { SKILL } from '../../src/content/skill'

// Ubai, 30 Okt 2026: one book, two packages. In the dev preview the package comes from localStorage modul:pakej;
// behind the Worker it comes from the code the buyer signed in with (tests/akses).

async function setup(page: Page, pakej: 'basic' | 'pro') {
  await page.addInitScript((pakej) => {
    localStorage.setItem('modul:suara-auto', 'off')
    localStorage.setItem('modul:pakej', pakej)
    if (!localStorage.getItem('modul:v1')) localStorage.setItem('modul:v1', JSON.stringify({ page: 0, mode: 'latih', os: 'mac', done: [] }))
  }, pakej)
  await page.goto('/')
}

async function copyAdPrompt(page: Page) {
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: /Tampal prompt POV \+ VO/ }).click()
  await page.locator('article.page .prompt').getByTestId('copy').click()
  return page.evaluate(() => navigator.clipboard.readText())
}

for (const pakej of ['basic', 'pro'] as const) {
  test(`${pakej}: the ad prompt is the same plain prompt, calling no skill`, async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await setup(page, pakej)
    await expect(page.locator('.reader')).toHaveAttribute('data-pakej', pakej)
    const copied = await copyAdPrompt(page)
    expect(copied.split('\n')[0]).toMatch(/^Saya nak buat video iklan untuk \[nama produk\]/)
    expect(copied).not.toMatch(new RegExp(`${SKILL}|${PRO_SKILL}`))
  })
}

test('pro: the Basic install pages are not in the book; the Pro install and Modul 7 are', async ({ browser }) => {
  const count = async (pakej: 'basic' | 'pro') => {
    const ctx = await browser.newContext()
    const page = await ctx.newPage()
    await setup(page, pakej)
    await page.getByRole('button', { name: 'Isi kandungan' }).click()
    const toc = await page.locator('#toc').innerText()
    const n = Number((await page.locator('.plabel').innerText()).match(/daripada (\d+)/)![1])
    await ctx.close()
    return { toc, n }
  }
  const basic = await count('basic')
  const pro = await count('pro')
  expect(basic.toc).toContain(`Pasang skill ${SKILL}`)
  expect(pro.toc).not.toContain(`Pasang skill ${SKILL}`)
  expect(pro.toc).toContain(`Muat turun skill ${PRO_SKILL}`)
  expect(pro.toc).toContain('Tujuh langkah sebelum video siap')
  expect(basic.toc).not.toContain('Tujuh langkah sebelum video siap')
  expect(pro.n).not.toBe(basic.n)
})
