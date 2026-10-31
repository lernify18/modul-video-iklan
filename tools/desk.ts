// Claude Desktop screens for the module, captured from a demo copy of the app that runs on its own profile
// (~/.claude/claude-desktop-demo), so Ubai's account and chats never appear. Claude Desktop refuses debugging
// switches, so screens are plain window captures; the click target comes from the button's label (Apple Vision),
// grown over the button's own background.
//
//   node tools/desk.ts start                      open the demo app (no-op when it is already open)
//   node tools/desk.ts stop                       close the demo app
//   node tools/desk.ts shot <id> --find "<label>" [--nth 0] [--target x,y,w,h] [--mask x,y,w,h]... [--click] [--wait 1500]
//   node tools/desk.ts shot <id> --app Finder --title Downloads --find "Claude.dmg"   another app's window (no click)
//     --region captures the window's area of the screen instead, so a menu open over it is in the picture
//
// A shot saves public/shots/desk/<id>.png and its entry in src/content/shots.json. DESK_PROFILE picks another demo
// profile; a new, empty one shows the app's first screens again (Get started).
import { execFileSync, spawn } from 'node:child_process'
import { copyFileSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { autoFocus, flags, parseRect, PUBLIC, ROOT, saveShot, type Rect } from './lib/shots.ts'
import { swift } from './lib/swift.ts'

const PROFILE = process.env.DESK_PROFILE ?? `${homedir()}/.claude/claude-desktop-demo`
const APP = '/Applications/Claude.app/Contents/MacOS/Claude'

export function demoPid(): number | null {
  try {
    const out = execFileSync('pgrep', ['-f', `MacOS/Claude --user-data-dir=${PROFILE}$`], { encoding: 'utf8' }).trim()
    return Number(out.split('\n')[0]) || null
  } catch {
    return null
  }
}

interface Win { id: number; pid: number; title: string; onScreen: boolean; x: number; y: number; w: number; h: number }

/**
 * The demo app's main window. It may sit on another Space or behind other windows: screencapture still reads it,
 * and a click first brings the app forward. The thin full-width strips Electron keeps are not windows to capture.
 */
export function demoWindow(pid: number): Win {
  const wins = (JSON.parse(swift('windows', ['Claude'])) as Win[]).filter((w) => w.pid === pid && w.w > 200 && w.h > 200)
  const main = wins.sort((a, b) => Number(b.onScreen) - Number(a.onScreen) || b.w * b.h - a.w * a.h)[0]
  if (!main) throw new Error('demo Claude has no window; close it with `node tools/desk.ts stop` and start it again')
  return main
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function start() {
  if (demoPid()) return console.log('demo Claude already open, pid', demoPid())
  mkdirSync(PROFILE, { recursive: true })
  spawn(APP, [`--user-data-dir=${PROFILE}`], { detached: true, stdio: 'ignore' }).unref()
  for (let i = 0; i < 30 && !demoPid(); i++) await sleep(500)
  await sleep(4000)
  console.log('demo Claude open, pid', demoPid())
}

function stop() {
  const pid = demoPid()
  if (pid) process.kill(pid)
  console.log(pid ? `closed demo Claude ${pid}` : 'demo Claude was not open')
}

/** A window of another app (Finder, a mounted installer), picked by its title. Never clicked: Ubai's apps stay his. */
function appWindow(app: string, title: string): Win {
  const wins = (JSON.parse(swift('windows', [app])) as Win[]).filter((w) => w.title === title && w.w > 200 && w.h > 200)
  const win = wins.sort((a, b) => Number(b.onScreen) - Number(a.onScreen))[0]
  if (!win) throw new Error(`no ${app} window titled "${title}"`)
  return win
}

async function shot(id: string, f: ReturnType<typeof flags>) {
  const app = f.one('app')
  const pid = app ? null : demoPid()
  if (!app && !pid) throw new Error('demo Claude not open: node tools/desk.ts start')
  const win = app ? appWindow(app, f.one('title') ?? '') : demoWindow(pid!)
  mkdirSync(`${ROOT}.tmp/shots_raw/desk`, { recursive: true })
  const raw = `${ROOT}.tmp/shots_raw/desk/${id}.png`
  if (f.has('region')) execFileSync('screencapture', ['-x', `-R${win.x},${win.y},${win.w},${win.h}`, raw])
  else execFileSync('screencapture', ['-x', '-o', '-l', String(win.id), raw])

  let target: Rect
  let targetFrom: 'ocr' | 'manual'
  const manual = f.one('target')
  if (manual) {
    target = parseRect(manual)
    targetFrom = 'manual'
  } else {
    const label = f.one('find')
    if (!label) throw new Error('--find "<label>" or --target x,y,w,h is required')
    const found = JSON.parse(swift('find', [raw, label, f.one('nth') ?? '0'])) as { found: boolean; target: Rect }
    if (!found.found) throw new Error(`"${label}" not found on ${id}`)
    target = found.target
    targetFrom = 'ocr'
  }

  const masks = f.all('mask').map(parseRect)
  mkdirSync(`${PUBLIC}/shots/desk`, { recursive: true })
  const out = `${PUBLIC}/shots/desk/${id}.png`
  if (masks.length) swift('mask', [raw, out, ...masks.map((m) => m.join(','))])
  else copyFileSync(raw, out)

  const size = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', out], { encoding: 'utf8' })
  const w = Number(/pixelWidth: (\d+)/.exec(size)?.[1])
  const h = Number(/pixelHeight: (\d+)/.exec(size)?.[1])
  saveShot(`desk/${id}`, {
    img: `/shots/desk/${id}.png`, w, h, target, focus: f.one('focus') ? parseRect(f.one('focus')!) : autoFocus(target),
    kind: 'desk', targetFrom, source: app ? `${app} window "${win.title}"` : `Claude Desktop (demo profile), window "${win.title}"`, capturedAt: new Date().toISOString().slice(0, 10),
    ...(masks.length ? { masked: masks } : {}),
  })
  console.log(`desk/${id}`, JSON.stringify({ target, targetFrom }))

  if (f.has('click') && pid) {
    console.log(swift('click', [String(pid), String(win.id), String(target[0] + target[2] / 2), String(target[1] + target[3] / 2)]).trim())
    await sleep(Number(f.one('wait') ?? 1500))
  }
}

const [cmd, ...rest] = process.argv.slice(2)
const f = flags(rest)
if (cmd === 'start') await start()
else if (cmd === 'stop') stop()
else if (cmd === 'shot' && f.pos[0]) await shot(f.pos[0], f)
else {
  console.error('usage: node tools/desk.ts start | stop | shot <id> --find "<label>" [--click]')
  process.exit(2)
}
