# SUSUNFILM DESIGN SYSTEM v0.1

2026-08-19。Phase 03 完成。
**可以直接看：`npm run dev --prefix susunfilm` → http://localhost:5273**

專案已建起來：Vite 6 + React 19 + TypeScript + Tailwind 4。`npx tsc -b` 通過，無 console 錯誤。

## 檔案結構

```
susunfilm/
├─ index.html                字體只載 Noto Sans TC / Noto Serif TC / Roboto Mono
├─ src/
│  ├─ styles/tokens.css      全部設計 token（Tailwind 4 @theme）
│  ├─ content/site.ts        資料來源層，帶 status 欄位
│  ├─ components/Reveal.tsx  唯一的進場動畫
│  └─ pages/Styleguide.tsx   這份設計系統本身
└─ public/
   ├─ brand/                 LOGO 三版 + 裁掉留白的 wordmark
   ├─ images/                你上傳的 10 張
   ├─ images/from-raphsu-studio/   官網原圖 18 張
   └─ images/lelesiong/      咧咧相合照
```

## 色彩

每一個顏色都有出處，沒有一個是發明的。

| Token | HEX | 出處 |
|---|---|---|
| `--color-paper` | `#F7F5F1` | 暖紙白。**必須暖**，因為 LOGO 的米是 `#FBE5C6`，冷白會讓它顯髒 |
| `--color-paper-warm` | `#EDE9E2` | 區塊底 |
| `--color-paper-deep` | `#E3DED4` | 引言區 |
| `--color-rule` | `#D8D3CA` | 分隔線 |
| `--color-ink-mute` | `#7A7268` | 資訊層 |
| `--color-ink-soft` | `#4A4A4A` | 次要文字 |
| `--color-ink` | `#1A1A1A` | 主文字 |
| `--color-moss` | `#668271` | **LOGO 圓底實測** |
| `--color-moss-deep` | `#51683E` | **作品照片量化取樣**（6/10 張出現同一綠家族）|
| `--color-cream` | `#FBE5C6` | **LOGO 中文字實測**。只用在綠底之上 |
| `--color-rust` | `#6E3521` | 反光鏡框／三角錐。極少量 |

綠色在網站上只出現四個地方：**連結 hover、當前導航、分類標籤、引言縱線**。不做大色塊。
綠底米字的完整組合只留給頁尾與 CTA。

## 文字

| 用途 | 字體 | 為什麼 |
|---|---|---|
| 大標與內文 | **Noto Sans TC** 200–900 | LOGO 是厚重復古粗黑，標題用襯線會打架 |
| 引言、STORY 長文開頭 | **Noto Serif TC** 200–500 | 刻意換一個聲音，不是預設值 |
| 年份／地點／分類／Credits／台羅 | **Roboto Mono** 300–500 | 資訊層 |

跟咧咧相官方站載入同一組字體，品牌連續。

內文 17px / line-height 1.9 / letter-spacing .02em / 每行 32–38 字。
中文行高比英文網站標準鬆——因為這個站要的是閱讀變慢。

`.tailo` 是台羅拼音的專用樣式（mono + 綠 + 字距）。`Kio-thâu lē-lē-siòng`、`Kio-a-thau`
是你自己在用的語言層，設計系統把它變成正式元素。

## 版面

12 欄，max-width 1280，內文 680。非對稱：文字靠左 col 2–7 或靠右 col 7–12 交替，圖片可 bleed。

## 元件

按鈕（實心／外框）、分類標籤、Project Card、圖片組合、meta 資訊列、pullquote、link-quiet。

**Project Card 刻意不等高、不等比例、交錯**（`md:mt-16` / `md:mt-6`）——
需求書第 25 條說「不要全部置中」，這是實作。

## 動態

全站只有三種，全部包在 `prefers-reduced-motion` 裡：

| 名稱 | 行為 |
|---|---|
| `.reveal` | 16px 上移 + 淡入，600ms，只播一次 |
| `.slow-zoom` | 圖片 hover 放大到 1.03，**4 秒**。慢到幾乎察覺不到 |
| `.link-quiet` | 底線 0 → 100%，400ms |

沒有 mouse follow、沒有 parallax、沒有 WebGL。

## 資料來源層

`src/content/site.ts` 每一筆帶 `status: 'verified' | 'review' | 'draft'`。
目前 `tagline`（「把日常留下來，地方就有了自己的樣子」）標的是 **`review`**——
因為三個來源都沒有這句，是你這次新給的。`intro`（表單「關於我們」）標 `verified`。

下一步要做的是 build 時過濾：`review` 和 `draft` 不進 production。
這樣「不要把 NEED REVIEW 當 VERIFIED」變成程式強制，不是靠人記得。

## 順手修的一件事

`logo-white-2481.png` 是 2481×2481 的正方形畫布、字置中，直接用 `h-14` 會變成 56×56 的小方塊。
已裁掉透明留白產生 `logo-white-wordmark.png`（2153×582，比例 3.7），頁尾用這個。
黑色版是完整圓形徽標，維持正方形不裁。

## 已知限制

- 目前只有 Styleguide 一頁，還沒有路由。Phase 04（首頁）開始才需要 react-router。
- 尚未做 SEO meta / sitemap / structured data（Phase 07）。
- 尚未做 RWD 細調——目前用 Tailwind 斷點，但沒有實機測過手機。

---

# Phase 04｜首頁　2026-08-19

`npm run build` 通過（49 modules，CSS 19.6 kB → gzip 4.9 kB，JS 260 kB → gzip 83 kB）。
手機 390px 無水平溢出，16 張圖全部載入。

## 八個區塊

| # | 區塊 | 內容來源 |
|---|---|---|
| 01 | HERO | 反光鏡＋捷運＋糖廠煙囪。**刻意不做 full bleed**，收在 max-width 1600 |
| 02 | 品牌介紹 | 報名表單「關於我們」原文三句，`verified` |
| 03 | 最近正在看的事 | 三張 Project Card，交錯不等高 |
| 04 | 我為什麼拍 | 珊珊手持 Super 8 直式照 ＋ 引言「家的模樣，不在模板裡…」 |
| 05 | 日常誌 | 三筆，**全部標 `draft`** |
| 06 | 最近的日常 | 六宮格，本地資料，外連 IG |
| 07 | CTA | 需求書第 20 條全文 |
| 08 | Footer | 綠底＋白 wordmark＋導覽＋社群＋email |

## 修掉一個會在正式環境出事的問題

原本 `.reveal` 預設 `opacity: 0`，靠 IntersectionObserver 加 `.is-in` 才顯示。
驗證時發現預覽瀏覽器的 **IntersectionObserver 完全不回呼**——連我在 console 手動建一個都不會。
結果是整段內容永遠隱形。

這不只是預覽環境的問題：無頭瀏覽器、部分 in-app browser、JS 載入失敗、爬蟲，都會踩到同一顆雷。
一個以 SEO 和「影像優先」為前提的網站，內容因為動畫而隱形是不能接受的。

改成漸進增強：

- CSS 預設**可見**，只有 JS 在 `<html>` 掛上 `.reveal-ready` 後才把未進場的元素藏起來
- `Reveal` 先偵測 `IntersectionObserver` 是否存在，不存在就直接顯示
- 再加 1200ms 保險：IO 沒回呼就自己顯示

沒有 JS、IO 壞掉、爬蟲來看，內容都照樣看得到。

## 另外修的

`react-router-dom` 被 Vite 預先打包時會帶進第二份 React。已在 `vite.config.ts` 加
`resolve.dedupe: ['react','react-dom']` 與 `optimizeDeps.include`。

## 還沒做

- 其餘六頁（ABOUT / STORY / PROJECTS / PROJECT DETAIL / JOURNAL / COLLABORATION / CONTACT）
- SEO：每頁 title/description/OG/canonical/sitemap/robots/structured data
- build 時過濾 `status !== 'verified'` 的內容
- JOURNAL 三篇的正式文字（目前是我起的草稿）

---

# Phase 05｜內頁　2026-08-19

九條路由全部 200，`npm run build` 通過（CSS 23.2 kB → gzip 5.4；JS 285 kB → gzip 90）。

| 路由 | 頁面 | 內容狀態 |
|---|---|---|
| `/about` | 關於蘇珊 ＋ 一路走到現在 Timeline | intro/story 標 **review**（改寫過），timeline 全部 verified |
| `/story` | 我為什麼拍？ | 全部 verified，直接引用 Notion 原文 |
| `/projects` | 四大分類 | verified |
| `/projects/:slug` | 作品內頁 | 骨架完成，內容標「整理中」 |
| `/journal` | 日常誌 | 三筆 **draft** |
| `/journal/:slug` | 單篇 | 骨架完成，內文標「整理中」 |
| `/collaboration` | 一起做過的事 = 人的頁面 | verified |
| `/contact` | 聯絡 | verified，收件端 raph.sue@gmail.com |
| `*` | 404 | 用「多看她一眼…」那句 |

## ABOUT 的改寫（唯一動到既有文案的地方）

Notion《橋仔頭青聚點 三味》原文是小夫的第一人稱。依你決定 ABOUT 用「我們」，改寫如下，
標 `review`，**你點頭之前不算數**。原文保留在 `about.introSource` 逐句對照。

> 原文：大家好，我是蘇珊日常的攝影師，同時也是平面設計者，一名在地的橋頭人。
> 我習慣用鏡頭觀察生活，也希望透過影像和文字，讓更多人看見地方的溫度。

> 改寫：我們是蘇珊日常。一個拿相機的，一個做平面設計的，都是在地的橋頭人。
> 我們習慣用鏡頭觀察生活，也希望透過影像和文字，讓更多人看見地方的溫度。

底下那段阿嬤家／捷運拆遷／回到糖廠，同樣只把「我」換成「我們」、把提案語氣拆成三段，
句子本身沒有改。

## Timeline 的原則

只放有出處的年份。三筆沒有日期的（阿嬤家、捷運拆遷、回到糖廠）年份欄留 `—`，
頁面底下寫明「沒有出處的年份一律留空，不臆測」。

## COLLABORATION 已改成「人的頁面」

五組：地方創作／公共藝術／影像製作／教育｜工作坊／參與｜以參與者身分。
每個單位一行字說做過什麼，可點的連到對應 project。**不列作品清單**，避免兩份會各自過期的資料。

最後一組「以參與者身分」只有海洋守護者一筆——因為那是唯一一件你們白紙黑字寫過角色的。

## 還沒做

- SEO：每頁 title/description/OG/canonical、sitemap.xml、robots.txt、structured data
- build 時過濾 `status !== 'verified'`
- 作品內頁的 Gallery / Video / Credits（等素材）
- JOURNAL 正式文字

---

# Phase 07-a｜SEO 與資料誠信閘門　2026-08-19

## SEO

每一頁都有獨立的 title / description / canonical / OG / Twitter Card。
用 **React 19 原生的 head 提升**，沒有裝 react-helmet——`<title>` `<meta>` `<link>` 寫在元件裡會自動跑到 `<head>`。

實測（`/projects/lele-siong`）：

```
title      橋頭咧咧相｜蘇珊日常 SUSUNFILM
canonical  {SITE_URL}/projects/lele-siong
og:image   .../lelesiong-2025-autumn-group-have-nice-day.jpg
og:locale  zh_TW
twitter:card summary_large_image
JSON-LD    CreativeWork（在 <head>）
```

**Structured Data**
- 首頁：`Organization`（含 logo、email、sameAs 四個社群、areaServed 高雄橋頭）
- 作品內頁：`CreativeWork`（含 dateCreated、locationCreated、genre、creator）
- React 19 不會提升 inline `<script>`，JSON-LD 改用 effect 塞進 `<head>`

**OG 圖** `public/brand/og-default.jpg` 1200×630——反光鏡那張裁切，底部漸層壓暗，
壓上白色 wordmark 與一道米色短線。

**一個細節**：`og:image:width/height` 只有在用預設 OG 圖時才輸出。
作品內頁用自己的封面（比例不是 1.91:1），宣告 1200×630 會是錯的 metadata。

**sitemap.xml / robots.txt** 由 `scripts/sitemap.mjs` 在 build 時產生，
**只收 `status: 'verified'` 的頁面**——跟 production 的過濾規則一致，不會把還沒放行的頁面送進搜尋引擎。
目前 11 條 URL（4 個作品，0 篇日常誌）。

> ⚠️ `SITE_URL` 目前預設 `https://raphsu.github.io/susunfilm`，**這是我猜的**。
> 網域確定後用環境變數覆蓋：`VITE_SITE_URL=https://你的網域 npm run build`

## 資料誠信閘門

需求書第 32 條變成程式強制，不再靠人記得。

`src/lib/content.ts`
- `published(items)` — production 只留 `status === 'verified'`
- `pick(value, status, fallback)` — 單一欄位沒放行就退回 fallback
- dev 模式全部顯示，並用 `StatusBadge` 在畫面上標出「review · 不會上線」

### 實測 production build 的行為

| 內容 | dev | production |
|---|---|---|
| 日常誌三篇（`draft`） | 顯示，標黃色 badge | **全部消失**，改顯示「第一批文章還在寫」 |
| `/journal/osaka-mirror` | 正常 | **視為找不到** |
| ABOUT 我改寫的自介（`review`） | 顯示，標紅色 badge | **不出現**，自動退回表單那段已驗證的原文 |
| ABOUT 阿嬤家那段（`review`） | 顯示 | **不出現** |
| Timeline 14 筆（`verified`） | 顯示 | 顯示 |
| sitemap 的日常誌 | — | **0 筆** |

也就是說：**你不點頭，我的改寫就上不了線。** 你在 `about.ts` 把 `review` 改成 `verified`，
它就會自己出現，不用改任何程式。

## 一個狀態調整

`site.taglineStatus` 從 `review` 改成 `verified`。
「把日常留下來，地方就有了自己的樣子」三個來源都沒有，但那是你 2026-08-19 親自裁示 Hero 要用的——
使用者對自己品牌的決定就是最終依據，不需要外部佐證。這跟「我擅自改寫的文案」性質不同。
