/**
 * 預先渲染：build 時把每條路由各產出一份真的 HTML 檔。
 *
 * 為什麼要做：GitHub Pages 沒有伺服器路由，找不到實體檔案就回 404.html，
 * 人看到的是正確頁面但 HTTP 狀態碼是 404 —— 爬蟲會當成不存在。
 * 實測 GitHub Pages 會用 200 直接服務無副檔名網址（/projects/x → projects/x.html），
 * 所以只要把檔案產出來，網址、canonical、sitemap 一個都不用改。
 *
 * 附帶好處：沒有 JS 的環境（爬蟲、部分 in-app browser）直接看得到內容。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { root, routes } from './routes.mjs'

const BASE = (process.env.VITE_BASE ?? '/susunfilm/').replace(/\/$/, '')
const dist = resolve(root, 'dist')

const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: 模板裡找不到空的 <div id="root"></div>')
}

const { render } = await import(resolve(root, '.ssr/entry-server.js'))

/**
 * React 19 的 renderToString 會把 <title>/<meta>/<link> 提到輸出字串最前面，
 * 之後才是應用程式標記。從開頭一個一個剝下來，剩下的就是 body。
 */
function splitHead(html) {
  const head = []
  let rest = html
  for (;;) {
    const title = /^<title[^>]*>[\s\S]*?<\/title>/.exec(rest)
    const void_ = /^<(?:meta|link)\b[^>]*>/.exec(rest)
    const m = title ?? void_
    if (!m) break
    head.push(m[0])
    rest = rest.slice(m[0].length)
  }
  return { head: head.join('\n    '), body: rest }
}

function page(path) {
  const { head, body } = splitHead(render(BASE + path))
  if (!body) throw new Error(`prerender: ${path} 渲染成空字串（basename 對不上？）`)
  return template
    .replace('</head>', `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

// sitemap 的 11 條 + /styleguide（自己看的設計系統，不進 sitemap，
// 但也要有自己的檔案，否則會落到 404 外殼、標題變成「找不到頁面」）
const paths = [...routes().map(r => r.p), '/styleguide']

let n = 0
for (const p of paths) {
  const file = p === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${p}.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, page(p))
  n++
}

// 真正不存在的網址才會走到 404.html（合法的深層路由現在都有自己的檔案了）。
// 直接把 NotFound 頁渲染進去——它自帶 robots noindex、沒有 canonical，正好適合。
// postbuild.mjs 先複製的那份空殼是安全網，這裡覆蓋掉。
writeFileSync(resolve(dist, '404.html'), page('/this-path-does-not-exist'))

console.log(`prerender: ${n} html files + 404.html (base ${BASE || '/'})`)
