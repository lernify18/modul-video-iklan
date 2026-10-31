import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ROOT } from '../../tools/lib/shots.ts'
import { swift } from '../../tools/lib/swift.ts'

// Draw a known button, then ask the Swift finder to locate it by its label. The box it grows must match the
// button the browser drew, so OCR-found targets on Claude Desktop can be trusted the same way.
describe('find.swift', () => {
  it('finds a filled button by its label and grows the box to the button edges', async () => {
    mkdirSync(`${ROOT}.tmp/test`, { recursive: true })
    const png = `${ROOT}.tmp/test/button.png`
    const browser = await chromium.launch({ channel: 'chrome' })
    const page = await browser.newPage({ viewport: { width: 600, height: 400 }, deviceScaleFactor: 2 })
    await page.setContent(`<body style="margin:0;background:#fff;font:16px -apple-system">
      <p style="position:absolute;left:40px;top:40px">Some text above</p>
      <button id="b" style="position:absolute;left:80px;top:300px;width:440px;height:40px;border:0;border-radius:10px;background:#1a1a1a;color:#fff;font-size:16px">Get started</button></body>`)
    const box = (await page.locator('#b').boundingBox())!
    await page.screenshot({ path: png })
    await browser.close()

    const out = JSON.parse(swift('find', [png, 'Get started'])) as { found: boolean; grown: boolean; target: number[] }
    expect(out.found).toBe(true)
    expect(out.grown).toBe(true)
    const want = [(box.x / 600) * 100, (box.y / 400) * 100, (box.width / 600) * 100, (box.height / 400) * 100]
    out.target.forEach((v, i) => expect(Math.abs(v - want[i]!), `edge ${i}`).toBeLessThan(1.2))
  }, 120_000)

  it('reports a label that is not on the picture', () => {
    expect(() => swift('find', [`${ROOT}.tmp/test/button.png`, 'Continue with Google'])).toThrow()
  })
})
