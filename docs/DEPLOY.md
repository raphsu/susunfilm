# 部署｜GitHub Pages

跟 lelesiong 同一套流程。本機該做的都做完了，剩下兩步要你操作。

## 現況

- git repo 已建好，第一個 commit 完成（280 個檔案）
- 分支：`main`
- 尚未設定 remote（因為這台機器沒有 `gh` CLI，我開不了 GitHub repo）

## 你要做的兩步

### 1. 在 GitHub 上開一個空的 repo

名稱：**`susunfilm`**
（不要勾 README／.gitignore／License，要完全空的）

> ⚠️ **repo 名稱決定網址。** 目前所有設定都假設是 `susunfilm`：
> - 網站會在 `https://raphsu.github.io/susunfilm/`
> - canonical、OG、sitemap 都指向這個網址
> - Vite 的 `base` 是 `/susunfilm/`
>
> 想用別的名稱的話跟我說，我改三個地方：
> `.github/workflows/deploy.yml`、`vite.config.ts`、`src/content/site.ts`

### 2. 推上去

```bash
cd "/Volumes/擴充SSD_1TB/Claude AI/susunfilm"
git remote add origin git@github.com:raphsu/susunfilm.git
git push -u origin main
```

（你有 SSH 金鑰 `~/.ssh/id_ed25519.pub`，所以用 SSH 位址。
若 GitHub 帳號不是 `raphsu`，把網址裡的帳號換掉。）

### 3. 開啟 Pages（推上去之後）

GitHub repo → **Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**。

選完之後 workflow 會自己跑。之後每次 `git push` 到 `main` 都會重新部署。

## 已經幫你設定好的

**GitHub Actions** `.github/workflows/deploy.yml`
Node 22、`npm ci`、`npm run build`，然後上傳到 Pages。
build 時帶入 `VITE_SITE_URL` 與 `VITE_BASE`。

**路由：build 時預先渲染（2026-08-19 改）**
GitHub Pages 沒有伺服器端路由。原本只靠 `404.html` fallback，
人看到的是正確頁面，但 HTTP 狀態碼是 404——爬蟲會當成頁面不存在。

現在每條路由在 build 時各產出一份真的 HTML：

```
node scripts/sitemap.mjs      產生 sitemap.xml / robots.txt（只收 verified）
tsc -b && vite build          瀏覽器端
node scripts/postbuild.mjs    404.html（此時還是空殼）+ .nojekyll
vite build --ssr …            SSR bundle → .ssr/（中間產物，不部署也不進版控）
node scripts/prerender.mjs    12 份 HTML + 覆寫 404.html
```

- 路由清單 `scripts/routes.mjs` 由 sitemap 與 prerender 共用，不會兩邊對不上。
- 產出的是 `dist/projects/lele-siong.html`。**GitHub Pages 會用 200 直接服務無副檔名網址**，
  所以網址、canonical、sitemap 都不用改，也不用結尾斜線。
- `404.html` 現在是預先渲染的 NotFound 頁（自帶 `robots: noindex`），真正不存在的網址才會走到。
- **順序不能換**：postbuild 一定要在 prerender 之前，否則 404.html 會變成首頁內容。
- 瀏覽器端 `src/main.tsx` 偵測到 `#root` 已有標記就 `hydrateRoot`，不是整片重畫。
- 沒有 JS 的環境（爬蟲、部分 in-app browser）現在直接看得到內容。

**本機怎麼測狀態碼**
`vite preview` 是 SPA fallback，任何路徑都回 index.html，這件事在它上面永遠測不出來。
用 `npm run serve`（`scripts/serve-dist.mjs`，port 4180）——它照 GitHub Pages 的規則服務 `dist/`：
先找同名檔案、再試 `<path>.html`、再試目錄 index（301）、都沒有才 404。

**子路徑**
`vite.config.ts` 的 `base` 預設 `/susunfilm/`，React Router 用 `import.meta.env.BASE_URL` 當 basename，
`src/lib/asset.ts` 和 `<Img>` 會自動補上 base。
本機實測 `http://localhost:4180/susunfilm/projects/lele-siong`：路由、13 張圖、canonical 全對，零破圖。

**CI 不需要 Python**
`public/images/`（圖片管線的產出）已經 commit 進版控，所以 GitHub Actions 只跑 npm。
之後新增照片時，本機跑 `npm run images` 再 commit。

## 上線後會看到什麼

**會出現**：首頁、關於蘇珊（用表單那段已驗證的自介）、品牌故事、
作品四頁（01 咧咧相有並置＋Gallery＋完整內文）、一起做過的事、聯絡。

**不會出現**（`status` 未放行，這是刻意的）：
- 日常誌全部三篇 → 該頁顯示「第一批文章還在寫」
- ABOUT 的阿嬤家那段
- 03、04 的 Role 欄位 → 顯示 `[待補資料]`

要讓它們上線，把對應的 `status` 從 `draft`／`review` 改成 `verified` 就好，不用動程式。

## 之後換自訂網域

```bash
VITE_BASE=/ VITE_SITE_URL=https://你的網域 npm run build
```

並在 `deploy.yml` 改成同樣的值，`public/` 加一個 `CNAME` 檔案寫上網域。
