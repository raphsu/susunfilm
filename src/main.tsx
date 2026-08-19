import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/tokens.css'
import App from './App'

const el = document.getElementById('root')!
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// build 時每條路由都預先渲染成靜態 HTML（scripts/prerender.mjs），
// 所以 #root 裡已經有標記時要用 hydrate 接手，不要整片重畫。
// vite dev 的外殼是空的，走 createRoot。
if (el.hasChildNodes()) hydrateRoot(el, tree)
else createRoot(el).render(tree)
