import { expect, test, type Page } from '@playwright/test'

// S8: the book is for buyers only. Without a session the Worker serves the sign-in page and nothing of the book;
// a buyer types their name and the access code from the Sellhiz purchase page once, and the book opens.

const DEMO = 'demo-lokal-2026'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('modul:suara-auto', 'off'))
})

async function signIn(page: Page, nama: string, kod: string) {
  await page.goto('/')
  await page.getByLabel('Nama awak').fill(nama)
  await page.getByLabel('Kod akses').fill(kod)
  await page.getByRole('button', { name: 'Masuk' }).click()
}

test('without a session only the sign-in page shows; the book, pictures and voice are refused', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '10 Video Iklan Dengan Claude' })).toBeVisible()
  await expect(page.locator('article.page')).toHaveCount(0)
  expect(await page.content()).not.toContain('/assets/')
  for (const path of ['/vo/m1-pembuka.mp3', '/shots/contoh/m6-home.png', '/media/umrah_pov_P01.mp4']) {
    expect((await page.request.get(path)).status(), path).toBe(401)
  }
})

test('a wrong code gets a plain message in the gentle tone, and the reader stays on sign-in', async ({ page }) => {
  await signIn(page, 'Pak Ali', 'BUKAN-KOD-INI')
  const msg = page.getByRole('alert')
  await expect(msg).toContainText('Kod itu tidak dikenali')
  expect(await msg.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgb(255, 229, 212)')
  await expect(page.locator('article.page')).toHaveCount(0)
})

test('the right code, typed loosely, opens the book: pictures load, the voice plays, and a reload keeps the session', async ({ page }) => {
  await signIn(page, 'Pak Ali', DEMO)
  await expect(page.locator('article.page')).toBeVisible()
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  await page.locator('#toc').getByRole('button', { name: /POV dan VO dari satu folder/ }).click()
  const img = page.locator('article.page img').first()
  await expect(img).toBeVisible()
  await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true)
  await page.getByTestId('vo-button').click()
  await expect.poll(() => page.getByTestId('vo-audio').evaluate((a: HTMLAudioElement) => !a.paused && a.currentTime > 0)).toBe(true)
  await page.reload()
  await expect(page.locator('article.page')).toBeVisible()
})

test('the drawer shows who is signed in, and Keluar returns to sign-in and locks the book again', async ({ page }) => {
  await signIn(page, 'Mak Som', DEMO)
  await expect(page.locator('article.page')).toBeVisible()
  await page.getByRole('button', { name: 'Isi kandungan' }).click()
  const akaun = page.getByTestId('akaun')
  await expect(akaun).toContainText('Masuk sebagai Mak Som')
  await akaun.getByRole('button', { name: 'Keluar' }).click()
  await expect(page.getByLabel('Kod akses')).toBeVisible()
  expect((await page.request.get('/vo/m1-pembuka.mp3')).status()).toBe(401)
})

test('the package comes from the code: Basic and Pro each see their badge, their skill, and only Pro may take Pro files', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  const PASANG = { Basic: /Pasang skill iklan-video/, Pro: /Muat turun skill ubai-videoads/ }
  for (const [kod, pakej, skill, lain] of [[DEMO, 'Basic', 'iklan-video', 'Pro'], ['demo-pro-2026', 'Pro', 'ubai-videoads', 'Basic']] as const) {
    await signIn(page, 'Puan Zah', kod)
    await expect(page.locator('.reader')).toHaveAttribute('data-pakej', pakej.toLowerCase())
    await page.getByRole('button', { name: 'Isi kandungan' }).click()
    await expect(page.getByTestId('akaun')).toContainText(`Pakej ${pakej}`)
    if (pakej === 'Basic') {
      await page.locator('#toc').getByRole('button', { name: PASANG.Pro }).click()
      await expect(page.getByTestId('kunci'), 'a Basic book keeps the Pro download page, locked').toBeVisible()
      await page.getByRole('button', { name: 'Isi kandungan' }).click()
    } else await expect(page.locator('#toc').getByRole('button', { name: PASANG[lain] }), 'a Pro book has no Basic skill page').toHaveCount(0)
    await page.locator('#toc').getByRole('button', { name: PASANG[pakej] }).click()
    await page.locator('article.page .prompt').getByTestId('copy').click()
    expect((await page.evaluate(() => navigator.clipboard.readText())).split('\n')[0]).toContain(skill)
    const pro = await page.request.get('/pro/ubai-videoads.zip')
    if (pakej === 'Basic') expect(pro.status(), 'a Basic code is refused the Pro skill').toBe(403)
    else {
      expect(pro.status(), 'a Pro code gets the Pro skill').toBe(200)
      expect((await pro.body()).subarray(0, 2).toString(), 'a zip file').toBe('PK')
    }
    await page.getByRole('button', { name: 'Isi kandungan' }).click()
    await page.getByTestId('akaun').getByRole('button', { name: 'Keluar' }).click()
    await expect(page.getByLabel('Kod akses')).toBeVisible()
  }
})
