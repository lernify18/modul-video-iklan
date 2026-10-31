import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (p: string) => readFileSync(new URL('../../' + p, import.meta.url), 'utf8')

describe('project wiring', () => {
  it('pins the dev server to 5560 for the Herd proxy', () => {
    const vite = read('vite.config.ts')
    expect(vite).toMatch(/MODUL_PORT \|\| 5560/)
    expect(vite).toMatch(/strictPort: true/)
    expect(vite).toMatch(/modulvideo\.test/)
  })

  it('keeps secrets and other branches out of git', () => {
    const ignore = read('.gitignore').split('\n')
    expect(ignore).toContain('.env')
    expect(ignore).toContain('worktrees/')
  })
})
