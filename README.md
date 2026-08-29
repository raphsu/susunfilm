# 蘇珊日常 SUSUNFILM

> 把日常留下來，地方就有了自己的樣子。

以影像為方法，觀看日常、人物與地方的創作品牌網站。高雄橋頭。

線上：<https://raphsu.github.io/susunfilm/>

React 19 · Vite 6 · TypeScript · Tailwind 4 · React Router 7 ·
build 時預先渲染的靜態站，部署在 GitHub Pages。沒有後端、沒有資料庫。

---

## 快速開始

```bash
npm ci
npm run dev        # http://localhost:5173/susunfilm/
```

| 指令 | 做什麼 |
|---|---|
| `npm run dev` | 開發伺服器。**所有內容都看得到**，包含還沒放行的 draft／review |
| `npm run build` | 完整建置：sitemap → 型別檢查 → 瀏覽器端 → SSR → 預先渲染 |
| `npm run serve` | 照 GitHub Pages 的規則服務 `dist/`（port 4180）。要驗狀態碼只能用這個 |
| `npm run sitemap` | 只重產 `public/sitemap.xml` 與 `robots.txt` |
| `npm run images` | 圖片管線。需要 Python 與 Pillow，CI 不跑 |

`vite preview` 是 SPA fallback，任何路徑都回 index.html，
所以「深層路由到底回 200 還是 404」在它上面永遠測不出來。用 `npm run serve`。

## 目錄

```
src/
  content/      所有文案住在這裡。site / about / story / projects /
                journal / collaborations / brand / instagram
  pages/        一個路由一個檔
  components/   Layout · PageHead · Img · Seo · Reveal · StatusBadge
  lib/          content.ts（資料閘門）· asset.ts（子路徑補 base）
  styles/       tokens.css —— 色票、字級、動態，全站唯一一份
scripts/        routes.mjs（路由清單）· sitemap · prerender · postbuild
                serve-dist · images.py
assets-source/  圖片原檔。不部署
public/images/  圖片管線的產出，已進版控
docs/           當初的盤點、設計系統、內容地圖、部署說明
```

## 動手之前要知道的三件事

### 1. 文案不寫進 component

所有字都在 `src/content/`。頁面只負責排版。
要改一句話，去 content 檔改，不要在 JSX 裡找。

### 2. 資料閘門：`verified` / `review` / `draft`

```ts
type Status = 'verified' | 'review' | 'draft'
```

| | 意思 | 會上線嗎 |
|---|---|---|
| `verified` | 已從來源確認 | ✅ |
| `review` | 我改寫的，等使用者確認 | ❌ dev 才看得到 |
| `draft` | 我寫的，尚未經同意 | ❌ dev 才看得到 |

**這不是靠人記得，是 build 時強制執行的**（`src/lib/content.ts`）：
production 只放行 `verified`，dev 全部顯示並在畫面上標出狀態（`<StatusBadge>`）。

站上寫的是真實存在的人跟單位 —— 衛武營、美濃區公所、駐村藝術家 ——
所以「沒有出處的一律不列」這條規矩，比程式好不好看重要。
`scripts/routes.mjs` 與 `site.nav` 也走同一個閘門，
還沒放行的頁不會進 sitemap、不會被預先渲染、導覽列也不會連過去。

要讓東西上線，把對應的 `status` 改成 `'verified'`，不用動程式。

### 3. 預先渲染那條管線不能拆

GitHub Pages 沒有伺服器端路由。只靠 `404.html` fallback 的話，
人看到的是正確頁面，但 HTTP 狀態碼是 404，爬蟲會當成頁面不存在。

所以 build 時每條路由各產出一份真的 HTML：

```
sitemap.mjs   →  sitemap.xml / robots.txt（只收 verified）
tsc -b        →  型別
vite build    →  瀏覽器端
postbuild.mjs →  404.html 空殼 + .nojekyll
vite build --ssr → .ssr/（中間產物，不部署也不進版控）
prerender.mjs →  每條路由一份 HTML + 覆寫 404.html
```

- **順序不能換。** postbuild 一定要在 prerender 之前，否則 404.html 會變成首頁內容。
- 路由清單只有 `scripts/routes.mjs` 一份，sitemap 與 prerender 共用，
  不會出現「sitemap 列了但沒產出檔案」。
- 產出的是 `dist/projects/lele-siong.html`；GitHub Pages 會用 200 直接服務無副檔名網址，
  所以網址、canonical、sitemap 都不用改。
- `src/main.tsx` 偵測到 `#root` 已有標記就 `hydrateRoot`，不是整片重畫。

## 圖片

原檔放 `assets-source/images/`，跑 `npm run images`
產出 WebP + JPEG 的 640／1280／1920 三個尺寸到 `public/images/`，
同時寫 `src/image-manifest.json`（含原始寬高，`<Img>` 靠它避免 CLS）。

只有**程式碼真的引用到的**圖片會被產出。`public/images/` 已進版控，CI 不需要 Python。

## 部署

推到 `main` 就會由 GitHub Actions 部署（Node 22、`npm ci`、`npm run build`）。
換自訂網域、改 repo 名稱這些，看 [`docs/DEPLOY.md`](docs/DEPLOY.md)。

## 文件

| | |
|---|---|
| [`docs/DEPLOY.md`](docs/DEPLOY.md) | 部署、預先渲染、子路徑、換網域 |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | 字級、間距、動態、元件規則 |
| [`docs/BRAND-ASSETS.md`](docs/BRAND-ASSETS.md) | LOGO 與色票（每個色都有出處） |
| [`docs/CONTENT-MAP.md`](docs/CONTENT-MAP.md) | 每一頁放什麼、為什麼；歷次異動紀錄 |
| [`docs/AUDIT.md`](docs/AUDIT.md) | 開站前的來源盤點與品牌定位 |
| [`docs/IMAGE-INVENTORY.md`](docs/IMAGE-INVENTORY.md) | 圖片清單與用途 |

站內另有 `/styleguide`（不進 sitemap），是活的設計系統，改 tokens 就會跟著變。
