import { expect, test } from '@playwright/test'
import { bookFor, vo } from '../../src/content'

// The reader starts on a Mac; this is the book it walks through.
const pages = bookFor('mac')

// Herd injects /herd-studio/loader.js into every proxied page; its 404 is Herd's, not the app's.
const herdNoise = (url: string) => url.includes('/herd-studio/')

test('every page opens with its pictures loaded and no errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error' && !herdNoise(m.location().url)) errors.push(`${m.text()} @ ${m.location().url}`) })
  page.on('response', (r) => { if (r.status() >= 400 && !herdNoise(r.url())) errors.push(`${r.status()} ${r.url()}`) })

  expect((await page.goto('/'))?.status()).toBe(200)
  for (const [i, { page: p }] of pages.entries()) {
    await expect(page.locator('article.page')).toHaveAttribute('data-page-id', p.id)
    const broken = await page.locator('article.page img').evaluateAll(async (els) => {
      const imgs = els as HTMLImageElement[]
      await Promise.all(imgs.map((img) => img.decode().catch(() => undefined)))
      return imgs.filter((img) => img.naturalWidth === 0).map((img) => img.src)
    })
    expect(broken, `broken pictures on ${p.id}`).toEqual([])
    if (i < pages.length - 1) await page.getByRole('button', { name: 'Seterusnya', exact: true }).click()
  }
  expect(errors).toEqual([])
})

test('every voice clip is served', async ({ request }) => {
  for (const id of Object.keys(vo)) {
    const res = await request.get(`/vo/${id}.mp3`)
    expect(res.status(), id).toBe(200)
    expect(res.headers()['content-type'], id).toContain('audio')
  }
})
