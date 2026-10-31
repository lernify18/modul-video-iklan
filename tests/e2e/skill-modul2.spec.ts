import { expect, test, type Page } from '@playwright/test'
import { bookFor } from '../../src/content'
import { PRO_SKILL } from '../../src/content/pakej'
import { SKILL, SKILL_PROMPT } from '../../src/content/skill'

// Ubai, 30 Okt 2026: the book starts from scratch with no skill. Modul 2 opens with one light page (a skill is Ubai's
// ready recipe, installed in Modul 5, nothing to write yet) and ends with making a skill of one's own, once the way of
// working is right: that is how Ubai builds his. Installing waits for Modul 5.

async function setup(page: Page, pakej: 'basic' | 'pro') {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.addInitScript((pakej) => {
    localStorage.setItem('modul:suara-auto', 'off')
    localStorage.setItem('modul:pakej', pakej)
    if (!localStorage.getItem('modul:v1')) localStorage.setItem('modul:v1', JSON.stringify({ page: 0, mode: 'latih', os: 'mac', done: [] }))
  }, pakej)
  await page.goto('/')
}

async function open(page: Page, title: RegExp) {
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: title }).click()
  await page.waitForTimeout(300)
}

const fits = async (page: Page) => Number(await page.locator('article.page').getAttribute('data-scale'))

for (const [pakej, skill, isi] of [['basic', SKILL, 'm2-skill-isi'], ['pro', PRO_SKILL, 'm2-skill-isi-pro']] as const) {
  test(`${pakej}: Modul 2 starts with plain prompts and ends with making a skill, once the way of working is right`, async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    const m2 = bookFor('mac', pakej).filter((b) => b.chapter.id === 'm2').map((b) => b.page.id)
    expect(m2.slice(0, 2)).toEqual(['m2-pembuka', 'm2-formula'])
    expect(m2.slice(-5)).toEqual(['m2-ubah-2', 'm2-skill-ngam', isi, 'm2-skill-tulis', 'm2-rumusan'])

    await setup(page, pakej)
    const art = page.locator('article.page')
    await open(page, /Dah ngam\? Jadikan skill/)
    await expect(art).toContainText('SKILL.md')
    await expect(art.locator('.ix-loop, figure').first()).toBeVisible()
    expect(await fits(page)).toBe(1)

    await open(page, /Dalam sebuah skill/)
    await expect(art).toHaveAttribute('data-page-id', isi)
    await expect(art).toContainText(skill)
    if (pakej === 'basic') {
      await art.locator('.prompt.fixed').getByTestId('copy').click()
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(SKILL_PROMPT)
    } else {
      await expect(art.locator('.prompt')).toHaveCount(0)
      await expect(art).toContainText('SKILL.md')
    }
    expect(await fits(page)).toBe(1)

    await open(page, /Tulis skill sendiri/)
    const card = art.locator('.prompt')
    await card.getByRole('button', { name: 'Contoh diisi' }).click()
    await card.getByTestId('copy').click()
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    expect(copied).toContain('caption-iklan')
    expect(copied).not.toContain('==')
    expect(copied.split('\n')).toHaveLength(6)
    expect(await fits(page)).toBe(1)
  })
}
