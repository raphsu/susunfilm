/**
 * GitHub Pages 沒有伺服器端路由。
 * 把 index.html 複製成 404.html —— 直接開 /projects/xxx 時 GitHub 會回 404.html，
 * 那份就是 SPA 外殼，React Router 讀網址後渲染正確頁面，網址列不會變。
 * .nojekyll 讓 GitHub 不要用 Jekyll 處理（底線開頭的檔案才不會被吃掉）。
 */
import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
writeFileSync(resolve(dist, '.nojekyll'), '')
console.log('postbuild: 404.html + .nojekyll')
