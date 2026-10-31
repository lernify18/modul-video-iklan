import { expect, test, type Page } from '@playwright/test'
import { vo } from '../../src/content'

function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  return errors
}

async function open(page: Page, title: RegExp) {
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: title }).click()
}

async function mode(page: Page, name: 'Tutorial' | 'Latihan') {
  await page.getByRole('group', { name: 'Pilih mod' }).getByRole('button', { name: new RegExp(name) }).click()
}

async function os(page: Page, name: 'Mac' | 'Windows') {
  await page.getByRole('group', { name: 'Komputer awak' }).getByRole('button', { name, exact: true }).click()
}

/** Click a point given in percent of the (possibly zoomed) screenshot. */
async function clickAt(page: Page, x: number, y: number) {
  const cam = page.locator('[data-testid=stage] .cam')
  const box = await cam.boundingBox()
  if (!box) throw new Error('no stage')
  await page.mouse.click(box.x + (box.width * x) / 100, box.y + (box.height * y) / 100)
}

async function clickTarget(page: Page) {
  const t = (await page.locator('[data-testid=stage] .cam').getAttribute('data-target'))!.split(',').map(Number) as [number, number, number, number]
  await clickAt(page, t[0] + t[2] / 2, t[1] + t[3] / 2)
}

const msg = (page: Page) => page.locator('article.page [data-testid=msg]')

// These tests press the voice themselves; the auto voice (tests/e2e/suara.spec.ts) is switched off here.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('modul:suara-auto', 'off'))
})

test('Latihan: every click target answers "Betul" on Mac and on Windows', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/')
  await mode(page, 'Latihan')
  for (const system of ['Mac', 'Windows'] as const) {
    await os(page, system)
    for (const title of [/Cuba sendiri/, /Download Claude/]) {
      await open(page, title)
      await clickAt(page, 3, 3)
      await expect(msg(page)).toContainText('Hampir')
      await clickTarget(page)
      await expect(msg(page), `${system} ${title}`).toContainText('Betul')
    }
  }
  expect(errors).toEqual([])
})

test('Latihan: three misses light up the right button, and "Tunjuk saya" does too', async ({ page }) => {
  await page.goto('/')
  await mode(page, 'Latihan')
  await open(page, /Cuba sendiri/)
  const spot = page.getByTestId('spot')
  await clickAt(page, 3, 3)
  await clickAt(page, 3, 6)
  await expect(page.locator('[data-testid=stage] .area')).toHaveClass(/on/)
  await expect(spot).not.toHaveClass(/on/)
  await clickAt(page, 3, 9)
  await expect(spot).toHaveClass(/on/)
  await expect(msg(page)).toContainText('Tak apa')
  await open(page, /Download Claude/)
  await page.getByRole('button', { name: 'Tunjuk saya' }).click()
  await expect(spot).toHaveClass(/on/)
})

test('Tutorial without voice: the cursor walks to the button on its own', async ({ page }) => {
  await page.goto('/')
  await open(page, /Cuba sendiri/)
  await expect(page.getByTestId('spot')).toHaveClass(/on/, { timeout: 5000 })
  await expect(page.getByTestId('cursor')).toHaveClass(/on/)
})

test('Tutorial with voice: the cursor waits for Ubai to say the button, then moves', async ({ page }) => {
  await page.goto('/')
  await open(page, /Cuba sendiri/)
  await page.getByTestId('vo-button').click()
  const audio = page.getByTestId('vo-audio')
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => !a.paused && a.currentTime > 0)).toBe(true)
  await page.waitForTimeout(1500)
  await expect(page.getByTestId('spot'), 'nothing lights up before the cue').not.toHaveClass(/on/)
  const cue = vo['n3']!.cues[0]!
  await audio.evaluate((a: HTMLAudioElement, t: number) => { a.currentTime = t }, cue - 0.3)
  await expect(page.getByTestId('spot')).toHaveClass(/on/, { timeout: 4000 })
  await expect(page.getByTestId('vo-button')).toContainText('Hentikan')
})

test('find-the-part: hook, B-roll and grid on the bekam frame, then caption and proof on the digital frame', async ({ page }) => {
  await page.goto('/')
  await mode(page, 'Latihan')
  const stage = page.getByTestId('spot-stage')
  const tap = async (x: number, y: number) => {
    const b = (await stage.boundingBox())!
    await page.mouse.click(b.x + (b.width * x) / 100, b.y + (b.height * y) / 100)
  }
  await open(page, /Hook, B-roll dan latar grid/)
  await tap(50, 5)
  await expect(msg(page), 'B-roll is not the hook').toContainText('Hampir')
  await tap(50, 62)
  await expect(msg(page)).toContainText('Betul')
  await page.getByRole('button', { name: 'Soalan seterusnya' }).click()
  await tap(47, 25)
  await expect(msg(page)).toContainText('Betul')
  await page.getByRole('button', { name: 'Soalan seterusnya' }).click()
  await tap(50, 88)
  await expect(msg(page)).toContainText('Betul')
  await page.getByRole('button', { name: 'Selesai' }).click()
  await expect(page.locator('.spotside .say')).toContainText('Latihan lulus, 3 daripada 3')

  await open(page, /Caption dan angka/)
  await expect(stage.locator('img'), 'the caption is found on its own scene').toHaveAttribute('src', /digital-caption\.jpg$/)
  await tap(50, 70)
  await expect(msg(page)).toContainText('Betul')
  await page.getByRole('button', { name: 'Soalan seterusnya' }).click()
  await expect(stage.locator('img'), 'the number has a scene of its own').toHaveAttribute('src', /digital-angka\.jpg$/)
  await tap(50, 71)
  await expect(msg(page)).toContainText('Betul')
  await page.getByRole('button', { name: 'Selesai' }).click()
  await expect(page.locator('.spotside .say')).toContainText('Latihan lulus, 2 daripada 2')
})

test('Tutorial on find-the-part: Ubai\'s voice lights each part as he names it', async ({ page }) => {
  await page.goto('/')
  await open(page, /Hook, B-roll dan latar grid/)
  await page.getByTestId('vo-button').click()
  const audio = page.getByTestId('vo-audio')
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => !a.paused)).toBe(true)
  const cues = vo['m1-komponen-a']!.cues
  for (const [i, t] of cues.entries()) {
    await audio.evaluate((a: HTMLAudioElement, s: number) => { a.currentTime = s }, t + 0.2)
    await expect(page.locator('.legend li').nth(i)).toHaveClass(/cur|got/)
  }
  await expect(page.locator('.pstage .area.on').first()).toBeVisible()
})

test('prompt cards copy their text and show "Disalin"', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')
  await open(page, /Prompt 5 bahagian/)
  const card = page.locator('.prompt').first()
  await card.getByTestId('copy').click()
  await expect(card.getByTestId('copy')).toHaveText('Disalin')
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain('[nama produk]')
  expect(copied.split('\n')[0]).toBe('Saya nak buat [5] video iklan untuk [nama produk].')
  expect(copied).not.toContain('Apa')
})

test('case studies show the real ads and the proof tables', async ({ page }) => {
  await page.goto('/')
  await open(page, /Iklan bekam: satu kedai/)
  const video = page.locator('article.page video')
  await expect(video).toHaveAttribute('src', '/media/bekam_iman_T01.mp4')
  await video.evaluate((v: HTMLVideoElement) => { v.muted = true; return v.play() })
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.2)
  await open(page, /Gaya edit sama, hook lain/)
  await expect(page.locator('article.page .ix-bars')).toContainText('BINA KERJAYA')
  await expect(page.locator('article.page .fn')).toContainText('Angka Meta')
})

test('quiz answers the learner', async ({ page }) => {
  await page.goto('/')
  await open(page, /Komputer awak dah ada Claude/)
  const q = page.locator('.quiz').first()
  await q.getByRole('button', { name: 'Free' }).click()
  await expect(q.locator('.msg')).toContainText('Hampir')
  await q.getByRole('button', { name: 'Pro' }).click()
  await expect(q.locator('.msg')).toContainText('Betul')
})

for (const width of [360, 390]) {
  test(`phone ${width}px: every page fits with no sideways scroll and a one-row top bar`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    const errors = watchErrors(page)
    await page.goto('/')
    expect((await page.locator('.topbar').boundingBox())!.height).toBeLessThan(90)
    const next = page.getByRole('button', { name: 'Seterusnya', exact: true })
    for (;;) {
      const sideways = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(sideways, await page.locator('article.page').getAttribute('data-page-id') ?? '').toBe(0)
      if (await next.isDisabled()) break
      await next.click()
    }
    expect(errors).toEqual([])
  })
}

test('progress, mode and computer choice survive a reload', async ({ page }) => {
  await page.goto('/')
  await os(page, 'Windows')
  await page.getByRole('button', { name: 'Seterusnya', exact: true }).click()
  await page.getByRole('button', { name: 'Seterusnya', exact: true }).click()
  const id = await page.locator('article.page').getAttribute('data-page-id')
  await page.reload()
  await expect(page.locator('article.page')).toHaveAttribute('data-page-id', id!)
  await expect(page.getByRole('group', { name: 'Komputer awak' }).getByRole('button', { name: 'Windows' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await expect(page.locator('#toc .tick.on')).toHaveCount(2)
})
