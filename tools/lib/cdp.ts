/**
 * A tab of our own in Ubai's screenshot Chrome (CDP on 9337), driven over the raw DevTools protocol. Chrome 156
 * refuses Playwright's browser-level connection, so this talks to one page target only. It closes only the tab it
 * opened, never Ubai's tabs and never the browser.
 */
const CDP = process.env.CDP_URL ?? 'http://127.0.0.1:9337'

export interface Box { x: number; y: number; width: number; height: number }

export class Tab {
  readonly id: string
  private ws: WebSocket
  private seq = 0
  private waiting = new Map<number, { ok: (v: unknown) => void; no: (e: Error) => void }>()
  // Plain fields, not constructor parameter properties: Node runs this file by stripping types only.
  private constructor(id: string, ws: WebSocket) {
    this.id = id
    this.ws = ws
    ws.addEventListener('message', (m) => {
      const msg = JSON.parse(String(m.data)) as { id?: number; result?: unknown; error?: { message: string } }
      const w = msg.id !== undefined ? this.waiting.get(msg.id) : undefined
      if (!w) return
      this.waiting.delete(msg.id!)
      if (msg.error) w.no(new Error(msg.error.message))
      else w.ok(msg.result)
    })
  }

  static async open(url = 'about:blank', view = { width: 1440, height: 900, scale: 2 }): Promise<Tab> {
    const t = (await (await fetch(`${CDP}/json/new?${encodeURI(url)}`, { method: 'PUT' })).json()) as { id: string; webSocketDebuggerUrl: string }
    const ws = new WebSocket(t.webSocketDebuggerUrl)
    await new Promise((ok, no) => { ws.addEventListener('open', ok, { once: true }); ws.addEventListener('error', no, { once: true }) })
    const tab = new Tab(t.id, ws)
    await tab.send('Page.enable')
    await tab.send('Emulation.setDeviceMetricsOverride', { width: view.width, height: view.height, deviceScaleFactor: view.scale, mobile: false })
    return tab
  }

  send<T = unknown>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const id = ++this.seq
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((ok, no) => this.waiting.set(id, { ok: ok as (v: unknown) => void, no }))
  }

  async goto(url: string, settle = 3000) {
    await this.send('Page.navigate', { url })
    await new Promise((r) => setTimeout(r, settle))
  }

  /** Run a function in the page and return its JSON result. */
  async eval<T>(fn: string, arg?: unknown): Promise<T> {
    const r = await this.send<{ result: { value: T }; exceptionDetails?: { text: string } }>('Runtime.evaluate', {
      expression: `(${fn})(${JSON.stringify(arg ?? null)})`, returnByValue: true, awaitPromise: true,
    })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text)
    return r.result.value
  }

  async png(): Promise<Buffer> {
    const r = await this.send<{ data: string }>('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    return Buffer.from(r.data, 'base64')
  }

  /** A real mouse click at a point in CSS pixels, as a person would. */
  async click(x: number, y: number) {
    for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
      await this.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: type === 'mouseMoved' ? 0 : 1 })
    }
  }

  async type(text: string) {
    await this.send('Input.insertText', { text })
  }

  async close() {
    this.ws.close()
    await fetch(`${CDP}/json/close/${this.id}`)
  }
}
