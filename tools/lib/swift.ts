import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { ROOT } from './shots.ts'

/** Compile tools/mac/<name>.swift once into .tmp/bin and rerun the binary; recompile when the source is newer. */
export function swift(name: string, args: string[]): string {
  const src = `${ROOT}tools/mac/${name}.swift`
  const bin = `${ROOT}.tmp/bin/${name}`
  if (!existsSync(bin) || statSync(bin).mtimeMs < statSync(src).mtimeMs) {
    mkdirSync(`${ROOT}.tmp/bin`, { recursive: true })
    execFileSync('swiftc', ['-O', src, '-o', bin], { stdio: 'inherit' })
  }
  return execFileSync(bin, args, { encoding: 'utf8' })
}
