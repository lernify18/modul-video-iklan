// Modul 4 background-music screens, captured in a tab of our own in Ubai's screenshot Chrome (CDP 9337):
// Pixabay Music search results (the Download button of the first track) and the ytmp3.gl box for a YouTube link.
// Nothing is downloaded. Tabs the sites open (adverts) are closed; Ubai's own tabs are never touched.
//
//   node tools/tangkap-muzik.ts
import { Tab } from './lib/cdp.ts'
import { shotWeb } from './lib/webshot.ts'

const before = new Set(((await (await fetch('http://127.0.0.1:9337/json/list')).json()) as { id: string }[]).map((t) => t.id))
const tab = await Tab.open()
try {
  await tab.goto('https://pixabay.com/music/search/instrumental/', 7000)
  // The download icon of each track is an unlabelled button at the right end of its row; mark the first one.
  await tab.eval(`() => {
    const b = [...document.querySelectorAll('button')].find((e) => { const r = e.getBoundingClientRect(); return !e.textContent.trim() && r.x > 1250 && r.top > 400 && r.width > 0 })
    if (b) b.dataset.cap = 'dl'
  }`)
  console.log('pixabay', await shotWeb(tab, 'm4-pixabay', { css: '[data-cap="dl"]' }))

  await tab.goto('https://ytmp3.gl/', 6000)
  console.log('ytmp3', await shotWeb(tab, 'm4-ytmp3', { css: 'input' }))
} finally {
  await tab.close()
  const list = (await (await fetch('http://127.0.0.1:9337/json/list')).json()) as { id: string; type: string }[]
  for (const t of list.filter((x) => x.type === 'page' && !before.has(x.id))) await fetch(`http://127.0.0.1:9337/json/close/${t.id}`)
}
