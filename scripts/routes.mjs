/**
 * 全站路由清單。sitemap.mjs 與 prerender.mjs 共用同一份——
 * 分成兩份遲早會出現「sitemap 列了但沒產出檔案」或反過來的情況。
 *
 * 只收 status: 'verified'，跟 production build 的資料閘門（src/lib/content.ts）一致。
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** 從 content 檔抓 slug + status */
function entries(file) {
  const src = readFileSync(resolve(root, file), 'utf8')
  const out = []
  const re = /slug:\s*'([^']+)'[\s\S]*?status:\s*'([^']+)'/g
  let m
  while ((m = re.exec(src))) out.push({ slug: m[1], status: m[2] })
  return out
}

export function routes() {
  const projects = entries('src/content/projects.ts').filter(e => e.status === 'verified')
  const journal = entries('src/content/journal.ts').filter(e => e.status === 'verified')

  return [
    { p: '/', pri: '1.0', freq: 'weekly' },
    { p: '/about', pri: '0.8', freq: 'monthly' },
    { p: '/story', pri: '0.8', freq: 'monthly' },
    { p: '/projects', pri: '0.9', freq: 'weekly' },
    ...projects.map(e => ({ p: `/projects/${e.slug}`, pri: '0.7', freq: 'monthly' })),
    { p: '/journal', pri: '0.7', freq: 'weekly' },
    ...journal.map(e => ({ p: `/journal/${e.slug}`, pri: '0.6', freq: 'monthly' })),
    { p: '/collaboration', pri: '0.7', freq: 'monthly' },
    { p: '/contact', pri: '0.6', freq: 'yearly' },
  ]
}
