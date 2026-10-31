// Every rule the ad must keep, checked before a render. Errors stop the render; warnings are read and judged.
//   node <skill>/scripts/lint.mjs <plan.json> [more plans…]      (from the project folder; reads profil.md if there)
import { existsSync, readFileSync } from 'node:fs'
import { at, readPlan } from './lib.mjs'
import { hookLines } from './ass.mjs'

const PHONE = /(\+?6?0\d{1,2}[\s-]?\d{3,4}[\s-]?\d{3,4})|\b(whats\s?app|wasap|wa\.me)\b/i
// Meta's personal-attributes rule: never say what the viewer is.
const ATTRIBUTE = /\b(awak|anda|kau|korang)\b[^.?!]{0,24}\b(gemuk|obes|hutang|miskin|botak|jerawat|gelap|sakit|kemurungan|mandul|tua)\b/i
const HEALTH = /\b(sembuh|menyembuhkan|rawat(?:an)?\s+penyakit|ubat|kanser|diabetes|kencing manis|darah tinggi|dijamin sihat)\b/i
const KKM = /\bKKM\b/
const MONEY = /\b(dijamin|jaminan pulangan|untung pasti|pulangan tetap|confirm kaya|pasti untung)\b/i
const FOREVER = /\b(kekal selamanya|hilang terus|putih kekal|100% berkesan)\b/i
const HALAL = /\bhalal\b/i
// A result, not a price: a count of sales, or money per day/week/month.
const RESULT = /\b\d[\d,.]*k?\s?(jualan|order|tempahan|pelanggan|sales|unit terjual)\b|\bRM\s?[\d,.]+k?\s?(sebulan|sehari|seminggu|setahun)\b/i

/** Every piece of text the viewer will read or hear. */
export function texts(plan) {
  const t = [plan.hook ?? '', plan.cta ?? '', plan.skrip ?? '']
  for (const b of plan.beat ?? []) t.push(...(b.teks ?? []))
  return t.filter(Boolean)
}

export function lint(plan, profil = '') {
  const err = [], warn = []
  const all = texts(plan).join('\n')
  if (!plan.fakta?.length) err.push('"fakta" kosong: setiap iklan perlu fakta dan sumbernya')
  const hook = hookLines(plan.hook ?? '')
  if (hook.length < 2 || hook.length > 3) err.push(`hook ${hook.length} baris (perlu 2–3, dipisah dengan |)`)
  hook.forEach((l, i) => { const n = l.split(/\s+/).length; if (n > 4) err.push(`hook baris ${i + 1} ada ${n} perkataan (paling banyak 4)`) })
  if (PHONE.test(all)) err.push('nombor telefon / WhatsApp dalam teks')
  if (ATTRIBUTE.test(all)) err.push('atribut peribadi (polisi Meta): jangan sebut apa penonton itu; sebut masalahnya')
  if (HEALTH.test(all)) err.push('dakwaan kesihatan (sembuh, ubat, nama penyakit)')
  if (KKM.test(all) && !/kelulusan\s+KKM\s*:?\s*\S+/i.test(profil)) err.push('KKM disebut tanpa nombor kelulusan dalam profil.md')
  if (MONEY.test(all)) err.push('janji kewangan (dijamin, untung pasti)')
  if (FOREVER.test(all)) err.push('janji kekal / 100% berkesan')
  if (HALAL.test(all) && !/sijil halal/i.test(profil)) err.push('"halal" tanpa "sijil halal" dalam profil.md')
  if (RESULT.test(all) && !/hasil individu berbeza/i.test(all)) warn.push('angka hasil: tambah «*Hasil individu berbeza» pada kapsyen atau CW')

  if (plan.jenis === 'pov') {
    const d = (plan.beat ?? []).reduce((s, b) => s + Number(b.tempoh || 0), 0)
    if (d < 15 || d > 30) err.push(`POV ${d.toFixed(1)} s (perlu 15–30)`)
    for (const [i, b] of (plan.beat ?? []).entries()) {
      if (!(b.tempoh > 0)) err.push(`beat ${i}: tempoh tiada`)
      if (b.tempoh > 4) warn.push(`beat ${i}: ${b.tempoh} s (tukar babak setiap 2–3 s)`)
      if (!existsSync(at(b.fail ?? ''))) err.push(`beat ${i}: fail tiada ${b.fail}`)
    }
    const first = (plan.beat?.[0]?.teks ?? []).join(' ').toUpperCase()
    if (hook.length && !hook.every((l) => first.includes(l.toUpperCase().replace(/[,.]$/, '')))) warn.push('beat pertama tidak memaparkan hook penuh')
  } else {
    const n = (plan.skrip ?? '').split(/\s+/).filter(Boolean).length
    if (n < 45 || n > 70) err.push(`skrip ${n} perkataan (perlu 45–70, ~25–30 s)`)
    if (!plan.suara?.voice_id) err.push('suara.voice_id tiada')
    for (const [i, b] of (plan.babak ?? []).entries()) if (!existsSync(at(b.fail ?? ''))) err.push(`babak ${i}: fail tiada ${b.fail}`)
    if (plan.latar && !existsSync(at(plan.latar))) err.push(`latar tiada ${plan.latar}`)
  }
  if (plan.lagu && !existsSync(at(plan.lagu.fail))) err.push(`lagu tiada ${plan.lagu.fail}`)
  return { err, warn }
}

if (process.argv[1]?.endsWith('lint.mjs')) {
  const files = process.argv.slice(2)
  if (!files.length) { console.error('guna: node scripts/lint.mjs <plan.json> [...]'); process.exit(2) }
  const profil = existsSync(at('profil.md')) ? readFileSync(at('profil.md'), 'utf8') : ''
  let bad = 0
  for (const f of files) {
    const { err, warn } = lint(readPlan(f), profil)
    console.log(`${err.length ? '✗' : '✓'} ${f}`)
    for (const e of err) console.log(`   ✗ ${e}`)
    for (const w of warn) console.log(`   ! ${w}`)
    bad += err.length
  }
  process.exit(bad ? 1 : 0)
}
