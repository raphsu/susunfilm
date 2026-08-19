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

**SPA 路由**
GitHub Pages 沒有伺服器端路由，直接開 `/projects/lele-siong` 會 404。
`scripts/postbuild.mjs` 把 `index.html` 複製成 `404.html`——GitHub 回這份，
React Router 讀網址渲染正確頁面，網址列不會變。同時產生 `.nojekyll`。

**子路徑**
`vite.config.ts` 的 `base` 預設 `/susunfilm/`，React Router 用 `import.meta.env.BASE_URL` 當 basename，
`src/lib/asset.ts` 和 `<Img>` 會自動補上 base。
本機實測 `http://localhost:5274/susunfilm/projects/lele-siong`：路由、13 張圖、canonical 全對，零破圖。

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
