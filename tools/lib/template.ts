import { chromium } from '@playwright/test'
import { existsSync, mkdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { autoFocus, pct, PUBLIC, ROOT, saveShot } from './shots.ts'


/**
 * Render a rebuilt screen (an HTML template in tools/<dir>/) to public/shots/<dir>/<id>.png. The click target is the
 * element marked data-target, so its box comes from the layout, never typed by hand. Every such picture is a dummy:
 * the book labels it "Paparan contoh".
 */
export async function renderTemplate(dir: 'win' | 'contoh', template: string, id: string, query: string, source: string) {
  const file = `${ROOT}tools/${dir}/${template}.html`
  if (!existsSync(file)) throw new Error(`no template tools/${dir}/${template}.html`)
  // Picture paths in the query are public URLs (/shots/...); the template is opened from disk, so point them at public/.
  const q = new URLSearchParams(query)
  // ?view=WxH renders a smaller screen (a dialog), so it is not a speck in a full desktop.
  const [vw, vh] = (q.get('view') ?? '1440x900').split('x').map(Number)
  const VIEW = { width: vw || 1440, height: vh || 900 }
  const img = q.get('img')
  if (img?.startsWith('/')) q.set('img', pathToFileURL(`${PUBLIC}${img}`).href)

  const browser = await chromium.launch({ channel: 'chrome' })
  try {
    const page = await browser.newPage({ viewport: VIEW, deviceScaleFactor: 2 })
    await page.goto(`${pathToFileURL(file).href}?${q.toString()}`)
    await page.waitForSelector('body[data-ready="1"]', { timeout: 15000 })
    await page.evaluate(() => document.fonts.ready)
    const box = await page.locator('[data-target]').first().boundingBox()
    if (!box) throw new Error(`${template}: no data-target element on screen`)
    mkdirSync(`${PUBLIC}/shots/${dir}`, { recursive: true })
    await page.screenshot({ path: `${PUBLIC}/shots/${dir}/${id}.png` })
    const target = pct(box, VIEW.width, VIEW.height)
    saveShot(`${dir}/${id}`, {
      img: `/shots/${dir}/${id}.png`, w: VIEW.width * 2, h: VIEW.height * 2, target, focus: autoFocus(target),
      kind: dir === 'win' ? 'win' : 'web', targetFrom: 'dom', dummy: true, source, capturedAt: new Date().toISOString().slice(0, 10),
    })
    console.log(`${dir}/${id}`, JSON.stringify({ target }))
    return target
  } finally {
    await browser.close()
  }
}
