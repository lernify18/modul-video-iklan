// Windows screens for the module, rebuilt in HTML (tools/win/<template>.html) because there is no Windows PC to
// capture from. The click target is the element marked data-target in the template. Every picture is stored as a
// dummy, and the book labels it "Paparan contoh Windows".
//
//   node tools/win.ts <template> <id> [--q "key=value&key=value"]
//
// app:      a real capture inside a Windows 11 window, e.g. --q "img=/shots/desk/x.png&title=Claude&t=13,85,73,7"
// explorer: File Explorer, e.g. --q "folder=Downloads&files=Claude Setup.exe|Application|180 MB&pick=Claude Setup.exe"
import { pathToFileURL } from 'node:url'
import { flags } from './lib/shots.ts'
import { renderTemplate } from './lib/template.ts'

export const renderWin = (template: string, id: string, query: string) =>
  renderTemplate('win', template, id, query, `Rebuilt Windows 11 screen (tools/win/${template}.html)`)

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const f = flags(process.argv.slice(2))
  const [template, id] = f.pos
  if (!template || !id) {
    console.error('usage: node tools/win.ts <template> <id> [--q "key=value&..."]')
    process.exit(2)
  }
  await renderWin(template, id, f.one('q') ?? '')
}
