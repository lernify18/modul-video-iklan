// Web screens shown as examples instead of captures (Ubai, 29 Okt 2026: no new account and no payment for the
// book; the log-in, Google and payment screens are rebuilt from existing captures, with a dummy e-mail). Templates
// live in tools/contoh/<template>.html; the click target is the element marked data-target.
//
//   node tools/contoh.ts <template> <id> [--q "key=value&key=value"]
import { pathToFileURL } from 'node:url'
import { flags } from './lib/shots.ts'
import { renderTemplate } from './lib/template.ts'

/** The real capture each template was rebuilt from, recorded with the picture. */
const BASED_ON: Record<string, string> = {
  'claude-login': 'claude.ai log-in page (capture in Ebook AI Sept 26, m26-l04-log-masuk-claude.png)',
  'google-pilih': 'Google "Choose an account" page (capture in Ebook AI Sept 26, m42-l02-google-pilih.png)',
  'claude-bayar': 'Claude Pro plan and price from claude.com/pricing (public/shots/pricing.png); payment form rebuilt',
  'claude-pro': 'claude.ai home after subscribing, rebuilt',
  'mac-buka': 'the macOS "downloaded from the internet" dialog, words read from the real dialog on 29 Okt 2026',
  'claude-desk': 'a reference capture of Claude Desktop in Code mode (29 Okt 2026), labels from the app\'s own interface strings',
  'mac-pilih-folder': 'the macOS folder dialog, titled with the app\'s own words',
  'meta-ads': 'Meta Ads Manager (English labels, Oct 2026), rebuilt with an example account; no real ad account is touched',
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const f = flags(process.argv.slice(2))
  const [template, id] = f.pos
  if (!template || !id) {
    console.error('usage: node tools/contoh.ts <template> <id> [--q "key=value&..."]')
    process.exit(2)
  }
  await renderTemplate('contoh', template, id, f.one('q') ?? '', `Rebuilt example screen (tools/contoh/${template}.html), based on ${BASED_ON[template] ?? 'existing captures'}`)
}
