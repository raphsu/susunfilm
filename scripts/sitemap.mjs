/**
 * 產生 sitemap.xml 與 robots.txt。build 時自動跑。
 * 只收 status: 'verified' 的內容——跟 production build 的過濾規則一致，
 * 避免把還沒放行的頁面送進搜尋引擎。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE_URL = (process.env.VITE_SITE_URL ?? 'https://raphsu.github.io/susunfilm').replace(/\/$/, '')

/** 從 content 檔抓 slug + status */
function entries(file) {
  const src = readFileSync(resolve(root, file), 'utf8')
  const out = []
  const re = /slug:\s*'([^']+)'[\s\S]*?status:\s*'([^']+)'/g
  let m
  while ((m = re.exec(src))) out.push({ slug: m[1], status: m[2] })
  return out
}

const projects = entries('src/content/projects.ts').filter(e => e.status === 'verified')
const journal  = entries('src/content/journal.ts').filter(e => e.status === 'verified')

const routes = [
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

const today = new Date().toISOString().slice(0, 10)
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes
    .map(r => `  <url>\n    <loc>${SITE_URL}${r.p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.freq}</changefreq>\n    <priority>${r.pri}</priority>\n  </url>`)
    .join('\n') +
  `\n</urlset>\n`

writeFileSync(resolve(root, 'public/sitemap.xml'), xml)
writeFileSync(
  resolve(root, 'public/robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
)

console.log(`sitemap: ${routes.length} urls (projects ${projects.length}, journal ${journal.length}) → ${SITE_URL}`)
