import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './App'

/**
 * 預先渲染用的進入點。只有 build 時在 Node 裡跑，不會進到瀏覽器 bundle。
 *
 * - url 必須是「含 base 的完整路徑」（例如 /susunfilm/projects/lele-siong）。
 *   StaticRouter 的 basename 不相符時整棵樹會渲染成空字串，而且不會報錯。
 * - 不 import tokens.css：樣式由 client build 產出，SSR bundle 不需要。
 * - 不包 StrictMode：renderToString 下只會白跑一次渲染。
 * - React 19 會把 <title>/<meta>/<link> 提到輸出字串「最前面」，
 *   由 scripts/prerender.mjs 剝下來塞進 <head>。
 */
export function render(url: string) {
  return renderToString(
    <StaticRouter location={url} basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </StaticRouter>,
  )
}
