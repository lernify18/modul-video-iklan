import { handle, type Env } from './akses.ts'

export default { fetch: (req: Request, env: Env) => handle(req, env) }
