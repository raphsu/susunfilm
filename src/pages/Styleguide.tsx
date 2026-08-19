import { site, projectCategories } from '../content/site'
import { Reveal } from '../components/Reveal'
import { Img } from '../components/Img'
import { asset } from '../lib/asset'

const swatches = [
  { n: 'paper',      v: '#F7F5F1', note: '底。暖紙白，配 LOGO 的米' },
  { n: 'paper-warm', v: '#EDE9E2', note: '區塊底' },
  { n: 'paper-deep', v: '#E3DED4', note: '深一階，用於引言區' },
  { n: 'rule',       v: '#D8D3CA', note: '分隔線' },
  { n: 'ink-mute',   v: '#635C52', note: '資訊層文字。11px 也要過 AA（6.06:1）' },
  { n: 'ink-soft',   v: '#4A4A4A', note: '次要文字' },
  { n: 'ink',        v: '#1A1A1A', note: '主文字' },
  { n: 'moss',       v: '#668271', note: 'LOGO 圓底實測。只用於底色與框線' },
  { n: 'moss-text',  v: '#546C5D', note: '綠色文字專用。壓深才過 AA（5.24:1）' },
  { n: 'moss-dark',  v: '#4A6053', note: '頁尾／CTA 深綠底，讓 cream 過 AA（5.54:1）' },
  { n: 'moss-deep',  v: '#51683E', note: '照片量化取樣。深綠' },
  { n: 'cream',      v: '#FBE5C6', note: 'LOGO 中文字實測。只用在綠底之上' },
  { n: 'rust',       v: '#6E3521', note: '反光鏡框／三角錐。極少量' },
]

const typeScale = [
  { label: 'Display', cls: 'text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.15] tracking-[-.01em]', sample: '蘇珊日常' },
  { label: 'H1',      cls: 'text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.3]', sample: '把日常留下來' },
  { label: 'H2',      cls: 'text-[1.75rem] font-bold leading-[1.45]', sample: '最近正在看的事' },
  { label: 'H3',      cls: 'text-[1.25rem] font-medium leading-[1.6]', sample: '橋頭咧咧相' },
  { label: 'Body',    cls: 'text-[17px] font-light leading-[1.9]', sample: '走過同一條老街三天，攤販開始點頭跟我說「欸，你又來啦！」' },
  { label: 'Small',   cls: 'text-[14px] font-light leading-[1.8] text-ink-soft', sample: '記錄那些值得慢慢看的事情。' },
]

function Section({ n, title, en, children }: { n: string; title: string; en: string; children: React.ReactNode }) {
  return (
    <section id={en.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20 border-t border-rule py-16 md:py-24">
      <div className="mb-10 flex items-baseline gap-5">
        <span className="meta">{n}</span>
        <h2 className="text-[1.75rem] font-bold leading-tight">{title}</h2>
        <span className="meta">{en}</span>
      </div>
      {children}
    </section>
  )
}

export default function Styleguide() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* 這頁是給自己看的，不進 sitemap，也不要被索引。
          有自己的 <title> 才不會沿用預先渲染 404 外殼留下的標題。 */}
      <title>設計系統｜蘇珊日常 SUSUNFILM</title>
      <meta name="robots" content="noindex" />

      {/* ── Nav 樣式示範 ───────────────────────────── */}
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-sm border-b border-rule">
        <div className="mx-auto flex max-w-page items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <img src={asset("/brand/logo-72.png")} width={36} height={36} alt="蘇珊日常 SUSUNFILM" className="h-9 w-9 rounded-full" />
            <span className="font-bold tracking-[.05em]">蘇珊日常</span>
          </div>
          <nav className="hidden gap-7 md:flex">
            {site.nav.map((i, idx) => (
              <a key={i.to} href="#" className={`link-quiet text-[14px] ${idx === 0 ? 'text-moss-text' : ''}`}>
                {i.zh}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-page px-6 md:px-10">
        {/* ── 封面 ───────────────────────────── */}
        <div className="py-20 md:py-32">
          <p className="tailo mb-5">Su-san ji̍t-siông ˙ Design System v0.1</p>
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.12] tracking-[-.01em]">
            蘇珊日常<br />設計系統
          </h1>
          <p className="mt-8 max-w-read text-ink-soft">
            所有顏色都有出處：品牌綠與米色量自 LOGO 原始檔，深綠與鏽紅量自實際攝影作品。
            沒有一個顏色是憑空發明的。
          </p>
        </div>

        {/* ── 01 色彩 ───────────────────────────── */}
        <Section n="01" title="色彩" en="COLOR">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {swatches.map(s => (
              <div key={s.n}>
                <div
                  className="mb-3 aspect-[4/3] w-full border border-rule"
                  style={{ background: s.v }}
                />
                <div className="meta mb-1">{s.v}</div>
                <div className="text-[14px] font-medium">--color-{s.n}</div>
                <div className="text-[13px] text-ink-soft leading-relaxed">{s.note}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="bg-moss-dark p-8">
              <div className="text-cream text-[1.5rem] font-bold">深綠底 × 米字</div>
              <p className="mt-2 text-cream text-[15px]">
                LOGO 的組合放到頁尾時要壓深一階，否則 cream 過不了 AA。
                純 LOGO 綠 #668271 配 cream 只有 3.43:1。
              </p>
            </div>
            <div className="bg-paper-warm p-8">
              <div className="text-[1.5rem] font-bold">暖紙底 × 墨字</div>
              <p className="mt-2 text-ink-soft text-[15px]">
                全站主要組合。綠色只用在 hover、當前導航、標籤、引言縱線。
              </p>
            </div>
          </div>
        </Section>

        {/* ── 02 文字 ───────────────────────────── */}
        <Section n="02" title="文字" en="TYPOGRAPHY">
          <div className="mb-10 grid gap-4 md:grid-cols-3">
            {[
              { f: 'Noto Sans TC', r: '大標與內文。LOGO 是厚重粗黑，標題用襯線會打架', s: '蘇珊日常 · 橋仔頭' },
              { f: 'Noto Serif TC', r: '只給引言與 STORY 長文開頭。刻意換一個聲音', s: '關於這个所在' },
              { f: 'Roboto Mono', r: '資訊層：年份、地點、分類、Credits、台羅', s: '2025 · KIO-A-THAU' },
            ].map(x => (
              <div key={x.f} className="border border-rule p-6">
                <div className="meta mb-3">{x.f}</div>
                <div
                  className="text-[1.5rem]"
                  style={{ fontFamily: x.f === 'Noto Serif TC' ? 'var(--font-serif)' : x.f === 'Roboto Mono' ? 'var(--font-mono)' : 'var(--font-sans)' }}
                >
                  {x.s}
                </div>
                <p className="mt-3 text-[13px] text-ink-soft leading-relaxed">{x.r}</p>
              </div>
            ))}
          </div>

          <div className="divide-y divide-rule border-y border-rule">
            {typeScale.map(t => (
              <div key={t.label} className="grid gap-4 py-7 md:grid-cols-[100px_1fr]">
                <div className="meta pt-2">{t.label}</div>
                <div className={t.cls}>{t.sample}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-read">
            <div className="meta mb-4">內文節奏</div>
            <p>
              中文行高 1.9、字距 .02em、每行約 32–38 字。這不是排版潔癖——
              是因為這個網站要的是「閱讀變慢」，行距鬆一點，眼睛才會停下來。
            </p>
            <blockquote className="pullquote mt-8 text-[1.15rem]">
              {site.quotes[0].text}
              <footer className="meta mt-4 not-italic">{site.quotes[0].source}</footer>
            </blockquote>
          </div>
        </Section>

        {/* ── 03 版面 ───────────────────────────── */}
        <Section n="03" title="版面" en="GRID">
          <p className="mb-8 max-w-read text-ink-soft">
            12 欄，最大寬 1280，內文區收到 680。刻意非對稱：文字靠左 2–7 欄或靠右 6–11 欄交替，
            圖片允許 bleed 出欄外。不全部置中。
          </p>
          <div className="mb-10 grid grid-cols-12 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-24 bg-moss/10 text-center">
                <span className="meta">{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-3 text-[13px]">
            <div className="col-span-12 bg-paper-warm p-4 md:col-span-6 md:col-start-2">
              <div className="meta mb-1">col 2–7</div>文字區塊靠左
            </div>
            <div className="col-span-12 bg-paper-warm p-4 md:col-span-6 md:col-start-7">
              <div className="meta mb-1">col 7–12</div>下一段靠右，交替
            </div>
          </div>
        </Section>

        {/* ── 04 元件 ───────────────────────────── */}
        <Section n="04" title="元件" en="COMPONENTS">
          <div className="mb-12">
            <div className="meta mb-5">按鈕</div>
            <div className="flex flex-wrap items-center gap-5">
              <button className="bg-ink px-8 py-3 text-[14px] tracking-[.08em] text-paper transition-colors hover:bg-moss-dark">
                開始聊聊
              </button>
              <button className="border border-ink px-8 py-3 text-[14px] tracking-[.08em] transition-colors hover:border-moss hover:text-moss-text">
                看全部作品
              </button>
              <a href="#" className="link-quiet meta">View Project →</a>
            </div>
          </div>

          <div className="mb-12">
            <div className="meta mb-5">分類標籤</div>
            <div className="flex flex-wrap gap-2">
              {site.tags.map(t => (
                <span key={t} className="border border-rule px-3 py-1 text-[12px] text-ink-soft transition-colors hover:border-moss hover:text-moss-text">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="meta mb-5">Project Card — 不等高、不等比例、交錯</div>
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
              {[
                { img: '/images/546056794_122230203650254592_5362882001383672505_n.jpg', ratio: 'aspect-[3/2]', cat: projectCategories[1], place: '高雄 · 橋頭', year: '2025', desc: '反光鏡裡的兩個人，背後是拆掉阿嬤家的那條捷運。', offset: '' },
                { img: '/images/lelesiong/lelesiong-2025-autumn-group-have-nice-day.jpg', ratio: 'aspect-[4/5]', cat: projectCategories[0], place: '高雄 · 橋頭老街', year: '2025', desc: '走完三個小時，最後停在這面牆前面。', offset: 'md:mt-16' },
                { img: '/images/from-raphsu-studio/qiaotou-2024-tiezhilu-artists-group.jpg', ratio: 'aspect-[3/2]', cat: projectCategories[2], place: '橋仔頭糖廠藝術村', year: '2024', desc: '鐵支路：茁·空·光。五個人，一個冬天。', offset: 'md:mt-6' },
              ].map(c => (
                <Reveal key={c.img} className={c.offset}>
                  <a href="#" className="group block">
                    <div className={`mb-5 overflow-hidden bg-paper-warm ${c.ratio}`}>
                      <Img src={c.img} alt="" className="slow-zoom h-full w-full object-cover" />
                    </div>
                    <div className="meta mb-2">{c.cat.no} — {c.year} · {c.place}</div>
                    <h3 className="mb-2 text-[1.25rem] font-medium">{c.cat.zh}</h3>
                    <p className="mb-4 text-[14px] leading-relaxed text-ink-soft">{c.desc}</p>
                    <span className="link-quiet meta">View Project →</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 05 圖片 ───────────────────────────── */}
        <Section n="05" title="圖片" en="IMAGE">
          <p className="mb-8 max-w-read text-ink-soft">
            不統一裁切比例，橫／直／方混排。Project Detail 的節奏：大圖 → 短文 → 雙圖並置（一橫一直）
            → 人物 → 影片 → 故事 → Credits。
          </p>
          <div className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
            <div className="aspect-[3/2] overflow-hidden bg-paper-warm">
              <Img src="/images/LINE_ALBUM_早期空拍作品_260819_1.jpg" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="aspect-[2/3] overflow-hidden bg-paper-warm">
              <Img src="/images/LINE_ALBUM_2021.9.26_260819_2.jpg" alt="" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="meta mt-4">橫 3:2 ＋ 直 2:3 並置。刻意不等高</div>
        </Section>

        {/* ── 06 動態 ───────────────────────────── */}
        <Section n="06" title="動態" en="MOTION">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { t: 'reveal', d: '16px 上移 + 淡入，600ms，只播一次。滾動時進場。' },
              { t: 'slow-zoom', d: '圖片 hover 放大到 1.03，但要 4 秒。慢到幾乎察覺不到。' },
              { t: 'link-quiet', d: '底線從 0 長到 100%，400ms。連結不預設有底線。' },
            ].map(m => (
              <div key={m.t} className="border border-rule p-6">
                <div className="meta mb-3">{m.t}</div>
                <p className="text-[14px] leading-relaxed text-ink-soft">{m.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-read text-[14px] text-ink-soft">
            全站只有這三種，而且都包在 <code className="font-mono text-[13px]">prefers-reduced-motion</code> 裡。
            沒有 mouse follow、沒有 parallax、沒有 WebGL。動畫的目的是讓閱讀變慢，不是展示技術。
          </p>
        </Section>

        {/* ── 07 四大分類 ───────────────────────────── */}
        <Section n="07" title="作品分類" en="PROJECT CATEGORIES">
          <div className="divide-y divide-rule border-y border-rule">
            {projectCategories.map(c => (
              <div key={c.id} className="grid gap-3 py-8 md:grid-cols-[80px_1fr_1fr]">
                <div className="meta pt-1">{c.no}</div>
                <div>
                  <div className="text-[1.25rem] font-medium">{c.zh}</div>
                  {c.tailo && <div className="tailo mt-1">{c.tailo}</div>}
                </div>
                <div className="text-[14px] text-ink-soft">{c.sub}</div>
              </div>
            ))}
          </div>
        </Section>
      </main>

      {/* ── Footer ───────────────────────────── */}
      <footer className="mt-16 bg-moss">
        <div className="mx-auto max-w-page px-6 py-16 md:px-10">
          <img src={asset("/brand/logo-white-wordmark.png")} alt="蘇珊日常 SUSUNFILM" className="mb-8 h-14 w-auto" />
          <p className="max-w-read text-cream/90">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-6">
            {['Instagram', 'Threads', 'Facebook', '影像製作服務 → RaphSuFilm'].map(l => (
              <a key={l} href="#" className="text-[14px] text-cream/75 transition-colors hover:text-cream">{l}</a>
            ))}
          </div>
          <div className="meta mt-10 text-cream/50">{site.social.email}</div>
        </div>
      </footer>
    </div>
  )
}
