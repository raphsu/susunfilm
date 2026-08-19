/**
 * 產生 sitemap.xml 與 robots.txt。build 時自動跑。
 * 路由清單來自 scripts/routes.mjs（與預先渲染同一份，只收 verified）。
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { root, routes } from './routes.mjs'

const SITE_URL = (process.env.VITE_SITE_URL ?? 'https://raphsu.github.io/susunfilm').replace(/\/$/, '')

const list = routes()
const today = new Date().toISOString().slice(0, 10)
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  list
    .map(r => `  <url>\n    <loc>${SITE_URL}${r.p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.freq}</changefreq>\n    <priority>${r.pri}</priority>\n  </url>`)
    .join('\n') +
  `\n</urlset>\n`

writeFileSync(resolve(root, 'public/sitemap.xml'), xml)
writeFileSync(
  resolve(root, 'public/robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
)

console.log(`sitemap: ${list.length} urls → ${SITE_URL}`)
