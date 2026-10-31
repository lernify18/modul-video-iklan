// Web screens for the module, captured in Ubai's screenshot Chrome (CDP on 9337, started with
// `sh ~/.claude/tools/chrome-cdp.sh`). The click target is the real element's box from the page, so a pin can never
// drift off its button. Works in its own tab and never closes Ubai's tabs or the browser.
//
//   node tools/web.ts shot <id> [--url <url>] (--role button --name "Try Claude" [--nth 0] | --css "<selector>")
//        [--blur "<selector>"]... [--dots "<selector>"]... [--click] [--wait 1500] [--keep-tab]
//
// --blur softens private text (emails, names); --dots replaces a secret value with dots; both only for the picture.
import { chromium, type Locator, type Page } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { autoFocus, flags, pct, PUBLIC, saveShot } from './lib/shots.ts'

const CDP = process.env.CDP_URL ?? 'http://127.0.0.1:9337'
const VIEW = { width: 1440, height: 900 }
const TAB = 'modul-capture'

type Role = Parameters<Page['getByRole']>[0]

export function locate(page: Page, f: ReturnType<typeof flags>): Locator {
  const css = f.one('css')
  const base = css ? page.locator(css) : page.getByRole(f.one('role') as Role, { name: f.one('name'), exact: f.has('exact') })
  return base.nth(Number(f.one('nth') ?? 0))
}

export async function shotOn(page: Page, id: string, f: ReturnType<typeof flags>, source: string) {
  const el = locate(page, f)
  await el.scrollIntoViewIfNeeded()
  const box = await el.boundingBox()
  if (!box) throw new Error(`${id}: target not visible`)

  const blur = f.all('blur').map((s) => `${s}{filter:blur(7px)!important}`).join('')
  const style = blur ? await page.addStyleTag({ content: blur }) : null
  const dotted = await page.evaluate((sels) => {
    const undo: [Element, string][] = []
    for (const s of sels) for (const e of document.querySelectorAll(s)) { undo.push([e, e.textContent ?? '']); e.textContent = '•'.repeat(12) }
    ;(window as unknown as { __undoDots: [Element, string][] }).__undoDots = undo
    return undo.length
  }, f.all('dots'))

  mkdirSync(`${PUBLIC}/shots/web`, { recursive: true })
  await page.screenshot({ path: `${PUBLIC}/shots/web/${id}.png` })

  await style?.evaluate((s) => (s as Element).remove())
  await page.evaluate(() => { for (const [e, t] of (window as unknown as { __undoDots: [Element, string][] }).__undoDots) e.textContent = t })

  const target = pct(box, VIEW.width, VIEW.height)
  saveShot(`web/${id}`, {
    img: `/shots/web/${id}.png`, w: VIEW.width * 2, h: VIEW.height * 2, target, focus: autoFocus(target),
    kind: 'web', targetFrom: 'dom', source, capturedAt: new Date().toISOString().slice(0, 10),
  })
  console.log(`web/${id}`, JSON.stringify({ target, dotted }))
  return el
}

async function main() {
  const f = flags(process.argv.slice(2))
  const [cmd, id] = f.pos
  if (cmd !== 'shot' || !id) {
    console.error('usage: node tools/web.ts shot <id> [--url <url>] (--role <role> --name "<name>" | --css "<sel>") [--click]')
    process.exit(2)
  }
  const browser = await chromium.connectOverCDP(CDP)
  const ctx = browser.contexts()[0]
  if (!ctx) throw new Error('no browser context on ' + CDP)
  // Reuse the tab this tool kept open last run (marked by window.name), so a click-to-click run stays on one page.
  let page: Page | undefined
  for (const p of ctx.pages()) if ((await p.evaluate(() => window.name).catch(() => '')) === TAB) page = p
  page ??= await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Emulation.setDeviceMetricsOverride', { ...VIEW, deviceScaleFactor: 2, mobile: false })
  const url = f.one('url')
  if (url) await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.evaluate((n) => { window.name = n }, TAB)
  await page.waitForTimeout(Number(f.one('settle') ?? 2500))
  const el = await shotOn(page, id, f, `${new URL(page.url()).host}${new URL(page.url()).pathname}, Chrome`)
  if (f.has('click')) {
    await el.click()
    await page.waitForTimeout(Number(f.one('wait') ?? 1500))
  }
  await cdp.send('Emulation.clearDeviceMetricsOverride')
  if (!f.has('keep-tab')) await page.close()
  // Disconnect only: closing the CDP browser would close Ubai's Chrome.
  process.exit(0)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
