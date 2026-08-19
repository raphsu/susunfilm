# Phase 07｜QA 報告

2026-08-19。對 production build（`vite preview`）實測，不是看原始碼猜的。

---

## 摘要

| 項目 | 結果 |
|---|---|
| 版面 · 九條路由 | ✅ 全部 200，無破版 |
| 文字 · 標題階層 | ✅ 每頁一個 h1，無跳級 |
| 圖片 | ✅ 全部有 alt、有 width/height、CLS = 0 |
| 連結 | ✅ 無空連結，外連全部帶 `rel="noreferrer"` |
| 手機 390px | ✅ 無水平溢出 |
| 無障礙 · 對比 | ⚠️ **找到 3 個未達 WCAG AA 的色票 → 已修** |
| 無障礙 · 觸控目標 | ⚠️ **10 個連結小於 24×24 → 已修** |
| SEO | ⚠️ **每頁 description 都一樣 → 已修** |
| 效能 · 出貨體積 | ⚠️ **33 MB → 7.0 MB** |
| 效能 · 字體 | ⏸ **1.3–2 MB，維持現狀（使用者選 A）。見文末** |

---

## 1｜效能：出貨體積 33 MB → 7.0 MB

**問題**：`public/` 裡放的是原始檔，包括 6720×4480（6.7 MB）和 6540×4360（4.9 MB）兩張。
Vite 會把 `public/` 原封不動複製進 `dist/`——等於把攝影原檔直接丟上線。
而且官網抓來的 18 張裡只有 3 張真的用到，其餘 15 張也一起出貨。

**做法**：建立圖片管線。

```
assets-source/images/     ← 原始檔，31 張，不會被部署
        ↓  python3 scripts/images.py
public/images/            ← 只產生「程式碼真的引用到的」12 張
                            每張 640 / 1280 / 1920 三個尺寸 × WebP + JPEG
src/image-manifest.json   ← 尺寸與可用寬度，給 <Img> 組 srcset 用
```

`src/components/Img.tsx` 讀 manifest，輸出 `<picture>` + WebP/JPEG 雙軌 srcset，
並帶上原始 `width`/`height` 讓瀏覽器先算好版位。content 檔案裡的路徑不用改，
寫 `/images/foo.jpg`，元件自己換成對應尺寸。找不到 manifest 就退回原路徑，不會壞。

**結果**：`dist/` 7.00 MB（images 6.35 MB），首頁實際下載的圖片只有 **68 KB**（其餘 lazy load）。
**CLS = 0。**

順手也修了 LOGO：header 用 2481×2481 的圖去顯示 36px，已改成 `logo-72.png`（5 KB），
另外補了 favicon.ico 與 192/512 的 PWA 尺寸。

---

## 2｜無障礙：三個色票沒過 WCAG AA

用 canvas 解析實際算繪色（Tailwind 4 會輸出 `oklab()`，直接用正規表示式讀會得到假數字），
逐一量測頁面上每個含文字節點的前景／背景比。

| 色票 | 原值 | 對比 | 需要 | 判定 |
|---|---|---|---|---|
| `ink-mute` on paper | `#7A7268` | **4.35** | 4.5 | ❌ 而且它用在 11px 的資訊層 |
| `moss` 當文字 on paper | `#668271` | **3.86** | 4.5 | ❌ 連結、當前導航、台羅 |
| `cream` on `moss` 頁尾 | `#FBE5C6` / `#668271` | **3.43** | 4.5 | ❌ 而且還疊了 `/75` 透明度，更糟 |

**修法**——沒有動 LOGO 的顏色，而是分工：

```
--color-moss       #668271   LOGO 實測。只用於底色、框線、非文字
--color-moss-text  #546C5D   綠色文字專用，同色相壓深。對 paper 5.24:1
--color-moss-dark  #4A6053   頁尾／CTA 深綠底，讓 cream 過 AA（5.54:1）
--color-ink-mute   #635C52   對 paper 6.06:1，11px 也安全
```

頁尾另外把 `text-cream/75`、`/50` 這種用透明度做層級的寫法全部拿掉——
**透明度會直接吃掉對比**。層級改用字級與字重表達。

**修完實測：七頁全部 0 個對比失敗。**

---

## 3｜無障礙：觸控目標

WCAG 2.2 的 2.5.8 要求最小 24×24。11px 的 `.meta` 箭頭連結行高只有 **21px**，
`/contact` 的四個聯絡連結（15px）只有 22px。全站共 10 個。

修法：`.link-quiet.meta` 與 `a.meta` 改成 `inline-flex` + `min-height: 24px`，
`/contact` 那四個直接加 `min-h-6`。修完 0 個。

其他無障礙項目本來就是好的：`lang="zh-Hant-TW"`、skip link、
header/main/footer landmark、手機選單有 `aria-label` 與 `aria-expanded`、
NavLink 自動帶 `aria-current="page"`、`:focus-visible` 有 2px 綠色外框。

---

## 4｜SEO：每頁 description 都一樣（真的 bug）

**症狀**：七頁的 `<title>` 和 `<link rel=canonical>` 都正確且唯一，
但 `<meta name="description">` **每頁都是同一句**。

**原因**：`index.html` 裡有一份靜態的 `<title>` 和 `<meta name="description">`，
`Seo.tsx` 又輸出一份。React 19 會把 `<meta>` 提升到 `<head>` 但**不會去重**，
結果每頁有兩個 description，爬蟲與 `querySelector` 讀到的都是靜態那份。

**修法**：把 `index.html` 的 title / description 刪掉，由 `Seo.tsx` 獨佔，
並在原處留註解說明為什麼不能放回去。

**修完實測**：六頁六個唯一 description，每頁各 1 個 `<title>`、1 個 description。

---

## 5｜還沒解決的：字體 1.3–2 MB

首頁下載量的組成：

```
字體   1,318 – 2,039 KB   ← 90%+
JS        90 KB (gzip)
圖片      68 KB
CSS        6 KB
```

Noto Sans TC 被 Google Fonts 切成上百個 unicode-range 子集，
頁面用到的中文字散落在 **19 個子集**，每個約 25–83 KB，所以一次就吃掉 1 MB 以上。
（數字每次測會變，取決於頁面渲染到哪些字、哪些子集已快取。）

已經做的：字重從 Sans 6 種砍到 4 種（300/500/700/900）、Serif 3→1、Mono 3→1，
`display=swap` 與 `preconnect` 都在。但**字重不是主因，中文字集才是**。

### 決定：A（使用者 2026-08-19 裁示）

**維持現狀，先上線。** 不再砍字重、不自架子集字型。
理由：字體快取一年、回訪成本為零、`swap` 不擋首屏，而砍字重會讓大標失去對應 LOGO 的厚重感。
等有真實流量數據（尤其是行動網路的第一次造訪）再回頭評估 C。

如果之後要重啟這個議題，往 C 走，並且要連內容更新流程一起設計——
子集字型的維護成本在「每次新增文章都要重跑」，不在檔案本身。

### 當初評估的三個選項

**A. 什麼都不做。**
字體有一年的快取，回訪是 0。首屏因為 `swap` 不會被擋住，先用系統字顯示。
對慢速行動網路的第一次造訪比較不友善。

**B. 再砍字重到 2 種（300 + 700）。**
大約省一半。代價是 `font-black`（900）沒了——而那個厚重字重是刻意去對應 LOGO 的粗黑體，
大標會變輕，設計上會鬆掉一階。

**C. 自架子集字型。**
用 fonttools 只留網站實際用到的字，可以壓到 150–300 KB，是真正的解法。
**代價是：以後你新增的文章如果出現子集裡沒有的字，那個字會掉回系統字型。**
對一個內容會持續長出來的網站，這是要長期維護的東西（每次改內容要重跑子集化）。

（我的建議是 A，使用者也選了 A。）

---

## 6｜其他實測數字

- `npm run build` 通過，`npx tsc -b` 零錯誤
- CSS 23.5 KB → gzip **5.5 KB**
- JS 292 KB → gzip **92 KB**
- `dist/` 共 69 個檔案
- 九條路由（含 `/styleguide`、404）全部 200
- Console 零錯誤

## 7｜還沒做的

- **實機測試**。以上都是桌機瀏覽器模擬視窗，還沒在真的手機上開過。
- Lighthouse 完整跑分（需要 Chrome DevTools 或 CI）。
- 鍵盤逐項 tab 過一遍（focus ring 已確認存在，但沒有走完整個 tab order）。
- 螢幕報讀軟體實測（VoiceOver / NVDA）。
- 深色模式——目前刻意只做淺色，這是設計決定不是缺漏。

---

# 追加修正　2026-08-19

## `<picture>` 讓 aspect 容器失效（我自己引入的回歸）

把 `<img>` 換成響應式的 `<Img>` 之後，元件輸出的是 `<picture><img …></picture>`。
`<picture>` 預設是 inline、沒有高度，所以外層 `aspect-[3/2]` 容器裡的
`h-full w-full object-cover` 全部失效——**Hero、作品卡、日常誌卡、IG 九宮格、並置，
所有用比例容器的圖都只剩一條**。

DOM 檢查會說「圖載入成功、可見、opacity 1」，因為圖真的載入了，只是被壓成幾乎沒有高度。

修法：`<picture className="contents">`。`display: contents` 讓 picture 不產生盒子，
`<img>` 直接對齊外層容器。

修完全站實測：15 個比例容器，**圖片尺寸與容器完全吻合**，零尺寸圖片 0 個。

> 教訓：`<picture>` 不是透明包裝。任何把 `<img>` 換成 `<picture>` 的重構，
> 都要重新檢查依賴 `h-full` 的版面。
