import { expect, test } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Every capture in this spec goes to .tmp, never into the book's pictures or manifest.
const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const OUT = `${ROOT}.tmp/e2e-alat`
process.env.SHOTS_PUBLIC = OUT
process.env.SHOTS_MANIFEST = `${OUT}/shots.json`
mkdirSync(OUT, { recursive: true })

const manifest = () => JSON.parse(readFileSync(`${OUT}/shots.json`, 'utf8')) as Record<string, { target: number[]; dummy?: boolean; targetFrom: string }>
const inside = (inner: number[], outer: number[], slack = 0.5) =>
  inner[0]! >= outer[0]! - slack && inner[1]! >= outer[1]! - slack && inner[0]! + inner[2]! <= outer[0]! + outer[2]! + slack && inner[1]! + inner[3]! <= outer[1]! + outer[3]! + slack

test('Windows dummy: the recorded target is where OCR reads the file name, and it is marked as a dummy', async () => {
  const { renderWin } = await import('../../tools/win.ts')
  const { swift } = await import('../../tools/lib/swift.ts')
  await renderWin('explorer', 'uji-explorer', 'folder=Downloads&files=Claude Setup.exe|Application|182 MB;Gambar.jpg|JPG File|2 MB&pick=Claude Setup.exe')
  const entry = manifest()['win/uji-explorer']!
  expect(entry.dummy).toBe(true)
  const ocr = JSON.parse(swift('find', [`${OUT}/shots/win/uji-explorer.png`, 'Claude Setup.exe'])) as { found: boolean; text: number[] }
  expect(ocr.found).toBe(true)
  expect(inside(ocr.text, entry.target), `OCR ${ocr.text} outside target ${entry.target}`).toBe(true)
})

test('web capture: the target is the element box from the page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const { shotOn } = await import('../../tools/web.ts')
  const { flags } = await import('../../tools/lib/shots.ts')
  await shotOn(page, 'uji-seterusnya', flags(['--role', 'button', '--name', 'Seterusnya', '--exact', '--blur', '.booktitle']), 'reader e2e')
  const box = (await page.getByRole('button', { name: 'Seterusnya', exact: true }).boundingBox())!
  const t = manifest()['web/uji-seterusnya']!.target
  expect(t[0]).toBeCloseTo((box.x / 1440) * 100, 1)
  expect(t[1]).toBeCloseTo((box.y / 900) * 100, 1)
  expect(await page.locator('.booktitle').evaluate((e) => getComputedStyle(e).filter)).toBe('none')
})

test('Claude Desktop demo: capture the open screen and find a real button on it', async () => {
  test.skip(!process.env.DESK, 'needs the demo Claude Desktop on screen: DESK=1 pnpm test:e2e')
  const { swift } = await import('../../tools/lib/swift.ts')
  const label = process.env.DESK_LABEL ?? 'Continue with email'
  execFileSync('node', [`${ROOT}tools/desk.ts`, 'shot', 'uji-desk', '--find', label], { env: process.env, stdio: 'inherit' })
  const entry = manifest()['desk/uji-desk']!
  expect(entry.targetFrom).toBe('ocr')
  const ocr = JSON.parse(swift('find', [`${OUT}/shots/desk/uji-desk.png`, label])) as { text: number[] }
  expect(inside(ocr.text, entry.target)).toBe(true)
})
