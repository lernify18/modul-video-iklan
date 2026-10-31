// The skill-install screens of Claude Desktop (Code), rebuilt on both computers: prompt in the box → Allow once on
// the skill file → skill installed, click ＋ New → a new session in the same folder, ready for the ad prompt.
// Each Mac picture is tools/contoh/claude-desk.html; the Windows one is the same screen (os=win) inside a Windows 11
// window. Pictures and click boxes go to public/shots and src/content/shots.json.
//
//   node tools/tangkap-skill.ts basic | pro | sendiri
//
// sendiri: the reader's own skill, made at the end of Modul 5 in the same session as the 20 ads (box → prompt typed →
// Allow once → done).
import { SKILL, SKILL_PROMPT } from '../src/content/skill.ts'
import { renderTemplate } from './lib/template.ts'
import { renderWin } from './win.ts'

const PRO = { skill: 'ubai-videoads', text: 'Pasang skill dari fail zip ini ke folder skills Claude saya: ~/Downloads/ubai-videoads.zip', id: 'pro' }
const BASIC = { skill: SKILL, text: SKILL_PROMPT.split('\n').slice(0, 3).join('\n'), id: 'skill' }
const which = process.argv[2] === 'pro' ? PRO : BASIC

if (process.argv[2] === 'sendiri') {
  const own = 'iklan-kedai-saya'
  const ad = 'Saya nak buat video iklan untuk Umrah Musim Sejuk ikhlas.com. Bahan ada dalam folder RAW (rakaman saya) dan Footage dalam folder projek ini.'
  const jadikan = 'Iklan dalam sesi ini dah ngam. Jadikan skill peribadi bernama iklan-kedai-saya supaya saya boleh guna dalam semua projek. Simpan semua yang kita guna: format POV dan VO, gaya, saiz, hook, larangan, cara render, cara semak, dan teguran yang saya beri.'
  const jawab = 'Dua puluh iklan siap dalam folder <code>out</code>: sepuluh POV dan sepuluh VO.'
  const tajuk = 'Iklan umrah · POV + VO'
  const dua20 = 'Baca bahan|Tulis skrip 20 hook|Jana suara VO|Render 20 iklan'
  const screens: [string, Record<string, string>][] = [
    ['kotak', { state: 'done', text: ad, jawab, langkah: dua20 }],
    ['prompt', { state: 'done', text: ad, jawab, isi: jadikan, langkah: dua20 }],
    ['allow', { state: 'skill-allow', skill: own, tajuk, text: jadikan, kata: `Saya tulis skill <code>${own}</code> dari cara kita buat iklan dalam sesi ini.` }],
    ['done', { state: 'skill-done', skill: own, tajuk, text: jadikan, langkah: 'Kumpul peraturan dan teguran dari sesi ini|Tulis SKILL.md' }],
  ]
  for (const [name, extra] of screens) {
    for (const os of ['mac', 'win'] as const) {
      const q = new URLSearchParams({ view: '1200x800', project: '2026-10-29 Iklan Umrah', ...extra })
      if (extra.state?.startsWith('skill-')) q.set('code', os === 'mac' ? `~/.claude/skills/${own}/SKILL.md` : `C:\\Users\\Pelajar\\.claude\\skills\\${own}\\SKILL.md`)
      if (os === 'win') q.set('os', 'win')
      const id = `m5-${os === 'mac' ? '' : 'w-'}sendiri-${name}`
      const t = await renderTemplate('contoh', 'claude-desk', id, q.toString(), 'Rebuilt example screen (tools/contoh/claude-desk.html), the reader\'s own skill made in the ad session')
      if (os === 'win') await renderWin('app', `m5-win-sendiri-${name}`, new URLSearchParams({ img: `/shots/contoh/${id}.png`, title: 'Claude', t: t.join(',') }).toString())
    }
  }
  process.exit(0)
}

const PROJECT = '2026-10-29 Iklan Umrah'
const macPath = which === PRO ? 'unzip ~/Downloads/ubai-videoads.zip -d ~/.claude/skills' : `~/.claude/skills/${which.skill}/SKILL.md`
const winPath = which === PRO
  ? 'Expand-Archive ~\\Downloads\\ubai-videoads.zip ~\\.claude\\skills'
  : `C:\\Users\\Pelajar\\.claude\\skills\\${which.skill}\\SKILL.md`
const card = which === PRO ? 'Allow Claude to run this command?' : 'Allow Claude to write this file?'
// The done screen names where the skill now lives; for Pro the allow card showed the unzip command instead.
const donePath = { mac: `~/.claude/skills/${which.skill}/SKILL.md`, win: `C:\\Users\\Pelajar\\.claude\\skills\\${which.skill}\\SKILL.md` }
const langkah = which === PRO ? `Buka zip ke skills/${which.skill}|Semak SKILL.md, references dan scripts` : ''

const screens: { state: string; name: string; extra?: Record<string, string> }[] = [
  { state: 'prompt', name: 'prompt' },
  { state: 'skill-allow', name: 'allow', extra: { card } },
  { state: 'skill-done', name: 'done', extra: langkah ? { langkah } : {} },
  { state: 'ready', name: 'baru', extra: { recent: `Pasang skill ${which.skill}` } },
]

for (const s of screens) {
  for (const os of ['mac', 'win'] as const) {
    const q = new URLSearchParams({ view: '1200x800', state: s.state, project: PROJECT, skill: which.skill, text: which.text, ...s.extra })
    if (s.state === 'skill-allow') q.set('code', os === 'mac' ? macPath : winPath)
    if (s.state === 'skill-done') q.set('code', donePath[os])
    if (os === 'win') q.set('os', 'win')
    const id = `m5-${os === 'mac' ? '' : 'w-'}${which.id}-${s.name}`
    const t = await renderTemplate('contoh', 'claude-desk', id, q.toString(), 'Rebuilt example screen (tools/contoh/claude-desk.html), skill install, based on a reference capture of Claude Desktop in Code mode (29 Okt 2026)')
    if (os === 'win') await renderWin('app', `m5-win-${which.id}-${s.name}`, new URLSearchParams({ img: `/shots/contoh/${id}.png`, title: 'Claude', t: t.join(',') }).toString())
  }
}
