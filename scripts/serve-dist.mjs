/**
 * 模擬 GitHub Pages 服務 dist/ 的本機伺服器。
 *
 * 為什麼不用 vite preview：它是 SPA fallback，任何找不到的路徑都回 index.html，
 * 所以「深層路由到底回 200 還是 404」這件事在它上面永遠測不出來。
 * GitHub Pages 的規則是：
 *   1. 有同名檔案 → 200
 *   2. 無副檔名時試 <path>.html → 200      ← 預先渲染就是靠這條
 *   3. 有 <path>/index.html → 301 到結尾斜線
 *   4. 都沒有 → 404 + 404.html
 *
 * 用法：node scripts/serve-dist.mjs [port]     預設 4180，base 走 VITE_BASE。
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, join } from 'node:path'
import { root } from './routes.mjs'

const port = Number(process.argv[2] ?? 4180)
const BASE = (process.env.VITE_BASE ?? '/susunfilm/').replace(/\/$/, '')
const dist = resolve(root, 'dist')

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon',
}

const isFile = async p => await stat(p).then(s => s.isFile()).catch(() => false)

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  let path = decodeURIComponent(url.pathname)

  if (BASE && !path.startsWith(BASE)) {
    // 方便直接開 http://localhost:4180/
    res.writeHead(302, { location: `${BASE}/` }).end()
    return
  }
  path = path.slice(BASE.length) || '/'

  const candidates = path.endsWith('/')
    ? [join(dist, path, 'index.html')]
    : [join(dist, path), join(dist, `${path}.html`)]

  for (const file of candidates) {
    if (!(await isFile(file))) continue
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
    res.end(await readFile(file))
    return
  }

  if (!path.endsWith('/') && (await isFile(join(dist, path, 'index.html')))) {
    res.writeHead(301, { location: `${BASE}${path}/` }).end()
    return
  }

  res.writeHead(404, { 'content-type': TYPES['.html'] })
  res.end(await readFile(join(dist, '404.html')))
}).listen(port, () => console.log(`serve-dist: http://localhost:${port}${BASE}/`))
