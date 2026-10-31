// Modul 4 web screens, captured click to click in a tab of our own in Ubai's screenshot Chrome (CDP 9337):
// YouTube search → a grid Short → Share → Copy → savefrom → paste → Download → "with low quality" → Download MP4.
// The video itself downloads into .tmp/stage/Downloads, not into Ubai's Downloads.
//
//   node tools/tangkap-modul4.ts [search terms]
import { mkdirSync, readdirSync } from 'node:fs'
import { Tab } from './lib/cdp.ts'
import { ROOT } from './lib/shots.ts'
import { centre, find, shotWeb } from './lib/webshot.ts'

const SEARCH = process.argv[2] ?? 'grid background animated'
const SAVEFROM = 'https://en1.savefrom.net/21-youtube-to-mp4-40LR.html'
// Ubai's own YouTube: his subscriptions and avatar are softened in every picture.
const PRIVATE = ['ytd-guide-section-renderer:nth-of-type(2)', '#avatar-btn', 'ytd-mini-guide-entry-renderer[aria-label="Subscriptions"]']
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const STAGE = `${ROOT}.tmp/stage/Downloads`

/** Close tabs that savefrom opened from our tab (adverts); Ubai's own tabs are never touched. */
async function closeAdverts(ours: string): Promise<string[]> {
  const list = (await (await fetch('http://127.0.0.1:9337/json/list')).json()) as { id: string; type: string; url: string }[]
  const opened = list.filter((t) => t.type === 'page' && t.id !== ours && !before.has(t.id))
  for (const t of opened) await fetch(`http://127.0.0.1:9337/json/close/${t.id}`)
  return opened.map((t) => new URL(t.url).host)
}

const before = new Set(((await (await fetch('http://127.0.0.1:9337/json/list')).json()) as { id: string }[]).map((t) => t.id))
const tab = await Tab.open()
try {
  mkdirSync(STAGE, { recursive: true })
  await tab.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: STAGE })

  await tab.goto(`https://www.youtube.com/results?search_query=${encodeURIComponent(SEARCH)}`, 6000)
  const short = await tab.eval<string>(`() => document.querySelector('a[href^="/shorts/"]')?.getAttribute('href')`)
  if (!short) throw new Error('no Short in the results')
  const link = `https://www.youtube.com${short}`
  await tab.click(...centre(await shotWeb(tab, 'm4-yt-hasil', { css: `a[href="${short}"]`, blur: PRIVATE })))
  await wait(6000)

  await tab.click(...centre(await shotWeb(tab, 'm4-yt-short', { css: 'button[aria-label="Share"]', blur: PRIVATE })))
  await wait(2500)
  await tab.click(...centre(await shotWeb(tab, 'm4-yt-kongsi', { css: 'button', text: 'Copy', blur: PRIVATE })))
  await wait(800)

  await tab.goto(SAVEFROM, 4000)
  await tab.click(...centre(await shotWeb(tab, 'm4-sf-utama', { css: '#sf_url' })))
  await tab.type(link)
  await wait(700)
  await tab.click(...centre(await shotWeb(tab, 'm4-sf-ditampal', { css: '#sf_submit' })))
  await wait(9000)
  await tab.click(...centre(await shotWeb(tab, 'm4-sf-sedia', { css: 'a.landingTz-btn-close' })))
  // The format list can take a few seconds to replace the upsell.
  let card = null
  for (let i = 0; i < 10 && !card; i++) { await wait(1000); card = await find(tab, { css: 'div.def-btn-name' }) }
  if (!card) throw new Error('no quality list after "with low quality"')
  // The green Download (MP4 720) only opens adverts; the working path is the quality list, then MP4 360.
  await tab.click(...centre(await shotWeb(tab, 'm4-sf-muat', { css: 'div.def-btn-name' })))
  await wait(1500)
  await tab.click(...centre(await shotWeb(tab, 'm4-sf-senarai', { css: 'a', text: 'MP4 360' })))
  for (let i = 0; i < 12 && !readdirSync(STAGE).some((n) => n.endsWith('.mp4')); i++) await wait(1000)
  console.log('adverts closed:', await closeAdverts(tab.id))
  console.log('downloaded:', readdirSync(STAGE).filter((n) => n.endsWith('.mp4')).join(', ') || 'nothing yet')
  console.log('link:', link)
} finally {
  await tab.close()
}
