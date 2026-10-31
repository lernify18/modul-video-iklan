// The Pro skill as one zip, for the Pro download button: pro/ubai-videoads → public/pro/ubai-videoads.zip.
// The Worker gives /pro/* to Pro codes only and logs each download.
//
//   node tools/bina-pro.ts
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { ROOT } from './lib/shots.ts'

export const ZIP = `${ROOT}public/pro/ubai-videoads.zip`

if (process.argv[1]?.endsWith('bina-pro.ts')) {
  mkdirSync(`${ROOT}public/pro`, { recursive: true })
  rmSync(ZIP, { force: true })
  // -X: no macOS extra attributes; the folder name stays, so it unzips straight into skills/ubai-videoads.
  execFileSync('zip', ['-r', '-X', '-q', ZIP, 'ubai-videoads', '-x', '*.DS_Store', '*/.kerja/*'], { cwd: `${ROOT}pro`, stdio: 'inherit' })
  console.log(`zip: ${ZIP}`)
}
