# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

蘇珊日常 SUSUNFILM 的品牌網站。Vite 6 + React 19 + TypeScript + Tailwind 4，
build 成靜態檔案部署到 GitHub Pages 專案頁（子路徑 `/susunfilm/`）。
註解、文案、docs 都用繁體中文，新增的內容請沿用。

## 指令

```bash
npm run dev       # vite dev server，port 5273
npm run build     # 完整產出（見下方「build 管線」），內含 tsc -b 型別檢查
npm run serve     # 用 dist/ 起本機伺服器，port 4180，模擬 GitHub Pages 的路由規則
npm run images    # 圖片管線，需要 python3 + Pillow
npm run sitemap   # 只重產 sitemap.xml / robots.txt
```

沒有測試框架與 lint 設定。唯一的自動檢查是 `npx tsc -b`（strict、`noUnusedLocals`、
`noUnusedParameters` 都開著），`npm run build` 會跑它。

驗證改動時用 `npm run build && npm run serve`，不要用 `vite preview`：
preview 是 SPA fallback，任何路徑都回 index.html，
「深層路由到底回 200 還是 404」在它上面永遠測不出來。

## 內容層與 status 閘門

所有文案都放在 `src/content/*.ts`，不寫進 component。每筆內容帶 `status`：

- `verified` — 已從來源確認，會上線
- `review` / `draft` — 只在 dev 顯示，並由 `<StatusBadge>` 標出「不會上線」

閘門實作在 `src/lib/content.ts`（`published()` 過濾陣列、`isPublished()` 判斷單筆、
`pick()` 未放行時換 fallback），依據 `import.meta.env.PROD`。
**production build 只放行 `verified`**。要讓某段內容上線，改 `status` 就好，不用動程式。

`scripts/routes.mjs` 用正規表示式從 content 檔抓 `slug` + `status`，同樣只收 `verified`；
sitemap 與預先渲染共用這一份路由清單，所以列了卻沒產出檔案（或反過來）不會發生。
改動 content 檔裡 `slug` / `status` 的寫法（例如換成雙引號、把兩個欄位拆遠）會讓那條正規表示式抓不到。

## build 管線（順序不能換）

`npm run build` 依序做五件事：

1. `scripts/sitemap.mjs` — 產生 `public/sitemap.xml`、`public/robots.txt`（兩份都進版控）
2. `tsc -b && vite build` — 瀏覽器端 bundle → `dist/`
3. `scripts/postbuild.mjs` — 複製 index.html 成 404.html（安全網）+ `.nojekyll`
4. `vite build --ssr src/entry-server.tsx` — SSR bundle → `.ssr/`（中間產物，不部署、不進版控）
5. `scripts/prerender.mjs` — 每條路由各產出一份真的 HTML，並覆寫 404.html

**postbuild 必須在 prerender 之前**，順序反了 404.html 會變成首頁內容。

為什麼要預先渲染：GitHub Pages 沒有伺服器端路由，只靠 404.html fallback 的話，
人看到的是正確頁面但 HTTP 狀態碼是 404，爬蟲會當成不存在。
產出 `dist/projects/lele-siong.html` 之後，Pages 會用 200 直接服務無副檔名網址，
所以網址、canonical、sitemap 都不用改。

## 路由與渲染

路由樹只有 `src/App.tsx` 的 `AppRoutes` 一份：
瀏覽器端由 `App` 包 `BrowserRouter`，預先渲染由 `src/entry-server.tsx` 包 `StaticRouter`。
新增頁面時兩邊會自動同步，但要記得把路徑加進 `scripts/routes.mjs`（`/styleguide` 是例外：
它在 prerender.mjs 裡單獨補上，刻意不進 sitemap）。

- `StaticRouter` 的 `basename` 對不上時整棵樹渲染成空字串**而且不會報錯**；
  prerender.mjs 有一道 `body` 為空就 throw 的檢查。
- `src/main.tsx` 偵測到 `#root` 已有標記就 `hydrateRoot`，否則 `createRoot`（dev 外殼是空的）。
- React 19 會把 `<title>` / `<meta>` / `<link>` 提到 `renderToString` 輸出字串**最前面**，
  由 prerender.mjs 一個一個剝下來塞進 `<head>`。改 `Seo.tsx` 輸出的標籤種類時要一起確認那段剝離邏輯。

## base 路徑

`vite.config.ts` 的 `base` 預設 `/susunfilm/`，React Router 用 `import.meta.env.BASE_URL` 當 basename。
`public/` 底下的資源路徑一律經過 `src/lib/asset.ts` 的 `asset()` 或 `<Img>` 補 base，不要直接寫死。
換自訂網域：`VITE_BASE=/ VITE_SITE_URL=https://網域 npm run build`，
同時改 `.github/workflows/deploy.yml` 的環境變數，並在 `public/` 放 `CNAME`。

## SEO

每頁自己掛 `<Seo>`（`src/components/Seo.tsx`）輸出 title / description / canonical / OG。
`index.html` 刻意沒有靜態的 `<title>` 與 `<meta name="description">`——放了會變成每頁兩份，
而 `querySelector` 抓到的是靜態那份，全站描述會變成一模一樣。

JSON-LD 是唯一不被 React 提升到 `<head>` 的標籤，留在 body 是刻意的：
留在樹裡才會被預先渲染輸出成靜態 HTML。

## 圖片

原檔放 `assets-source/images/`（不部署）。`npm run images` 掃 `src/` 裡 `/images/...` 的引用，
只把真的被引用到的圖產成 640/1280/1920 三種寬度的 WebP + JPEG 放進 `public/images/`，
並寫出 `src/image-manifest.json`（width/height 用來預留版位、避免 CLS）。

`public/images/` 已 commit 進版控，所以 CI 不需要 Python。**新增照片時要在本機跑 `npm run images` 再 commit。**

content 檔裡寫的是原始路徑（`/images/foo.jpg`），`<Img>` 查 manifest 換成 srcset；
查不到就退回原路徑，不會壞掉。檔名含空白的圖必須經過 `<Img>` 的 `%20` 編碼才不會被 srcset 丟掉。

## 樣式

Tailwind 4，所有設計 token 定義在 `src/styles/tokens.css` 的 `@theme`（顏色、字體、
`--container-page` / `--container-read`），因此 `bg-moss`、`text-moss-text`、`max-w-page` 這類 class 直接可用。
`.meta` / `.tailo` / `.pullquote` / `.reveal` / `.slow-zoom` / `.link-quiet` 是 `@layer components` 裡的共用樣式。

顏色不要自己發明——現有色票都有出處（LOGO 實測 + 照片取樣），對比度也已對過 WCAG AA，
見 `docs/BRAND-ASSETS.md` 與 `docs/DESIGN-SYSTEM.md`。`/styleguide` 頁面就是這套系統本身。

進場動畫全站只有 `<Reveal>` 一種（16px 上移 + 淡入 600ms，只播一次），
採漸進增強：CSS 預設可見，JS 掛上 `.reveal-ready` 才藏起來，另有 1.2 秒保險，
避免 IntersectionObserver 不回呼的環境（無頭瀏覽器、部分 in-app browser）內容永遠隱形。

## 內容誠信

`docs/AUDIT.md` 記錄了所有素材的查證結果。既有的規則：
所有內文出自既有來源原文或原文重組，查不到的欄位標 `[待補資料]`、不臆測；
日期查不到就不顯示，不要猜。日常誌現有文字是草稿（content 檔裡有註記），只描述照片裡看得到的東西。

## 部署

push 到 `main` 觸發 `.github/workflows/deploy.yml`：Node 22、`npm ci`、`npm run build`
（帶 `VITE_SITE_URL` 與 `VITE_BASE`），上傳 `dist/` 到 GitHub Pages。詳見 `docs/DEPLOY.md`。
