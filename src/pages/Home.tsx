import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { featured } from '../content/projects'
import { journal } from '../content/journal'
import { published } from '../lib/content'
import { instagramPosts } from '../content/instagram'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { organizationJsonLd } from '../components/Seo'
import { Img } from '../components/Img'

function SectionHead({ zh, en, to, more }: { zh: string; en: string; to?: string; more?: string }) {
  return (
    <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
      <div className="flex items-baseline gap-5">
        <h2 className="text-[1.6rem] font-bold leading-tight md:text-[1.85rem]">{zh}</h2>
        <span className="meta">{en}</span>
      </div>
      {to && <Link to={to} className="link-quiet meta">{more} →</Link>}
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Seo
        title="蘇珊日常"
        description="把日常留下來，地方就有了自己的樣子。以影像為方法，觀看日常、人物與地方。高雄橋頭。"
        path="/"
        jsonLd={organizationJsonLd}
      />
      {/* ── 01 HERO ─────────────────────────────
          刻意不做 full bleed：目前最好的橋頭照片只有 2048×1365，
          滿版在 2× 螢幕會軟。收在 1600 之內，等原檔到了再放大。 */}
      <section className="px-6 pt-10 md:px-10 md:pt-16">
        <div className="mx-auto max-w-[1600px]">
          <div className="aspect-[16/10] overflow-hidden bg-paper-warm md:aspect-[21/9]">
            <Img
              src="/images/546056794_122230203650254592_5362882001383672505_n.jpg"
              alt="橋頭捷運高架橋下的反光鏡，鏡中是兩個人，遠處是糖廠煙囪"
              className="h-full w-full object-cover"
              sizes="(min-width: 1600px) 1600px, 100vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-page">
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[1.12] tracking-[-.01em]">
            蘇珊日常
          </h1>
          <p className="mt-6 max-w-read text-[1.05rem] md:text-[1.15rem]">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {site.keywords.map(k => <span key={k} className="meta">{k}</span>)}
          </div>
        </div>
      </section>

      {/* ── 02 品牌介紹 ───────────────────────── */}
      <section className="border-t border-rule px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-page gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <span className="meta">ABOUT</span>
          </div>
          <Reveal className="md:col-span-7">
            {site.intro.map((line, i) => (
              <p key={i} className={i === 0 ? 'text-[1.15rem] font-medium' : 'mt-3 text-ink-soft'}>
                {line}
              </p>
            ))}
            <Link to="/about" className="link-quiet meta mt-8 inline-block">關於蘇珊 →</Link>
          </Reveal>
        </div>
      </section>

      {/* ── 03 最近正在看的事 ───────────────────── */}
      <section className="border-t border-rule px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-page">
          <SectionHead zh="最近正在看的事" en="PROJECTS" to="/projects" more="看全部作品" />
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} className={i === 1 ? 'md:mt-16' : i === 2 ? 'md:mt-6' : ''}>
                <Link to={`/projects/${p.slug}`} className="group block">
                  <div className={`mb-5 overflow-hidden bg-paper-warm ${p.ratio}`}>
                    <Img src={p.coverImage} alt="" className="slow-zoom h-full w-full object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
                  </div>
                  <div className="meta mb-2">{p.no} — {p.year} · {p.location}</div>
                  <h3 className="mb-1 text-[1.25rem] font-medium">{p.title}</h3>
                  {p.tailo && <div className="tailo mb-3">{p.tailo}</div>}
                  <p className="mb-4 text-[14px] leading-relaxed text-ink-soft">{p.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {p.category.map(c => (
                      <span key={c} className="border border-rule px-2 py-0.5 text-[11px] text-ink-mute">{c}</span>
                    ))}
                  </div>
                  <span className="link-quiet meta">View Project →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 我為什麼拍 ───────────────────────── */}
      <section className="border-t border-rule bg-paper-warm px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-page items-center gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-4 md:col-start-1">
            <div className="aspect-[2/3] overflow-hidden bg-paper-deep">
              <Img src="/images/LINE_ALBUM_2021.9.26_260819_1.jpg" alt="手持 Super 8 攝影機的珊珊" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-6">
            <span className="meta">STORY</span>
            <blockquote className="pullquote mt-6 text-[1.15rem] md:text-[1.35rem]">
              {site.quotes[0].text}
            </blockquote>
            <p className="mt-8 text-ink-soft">
              不是攝影技術的問題。是為什麼記錄、為什麼地方、為什麼人物、為什麼日常。
            </p>
            <Link to="/story" className="link-quiet meta mt-8 inline-block">我為什麼拍 →</Link>
          </Reveal>
        </div>
      </section>

      {/* ── 05 日常誌 ───────────────────────────── */}
      <section className="border-t border-rule px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-page">
          <SectionHead zh="日常誌" en="JOURNAL" to="/journal" more="更多日常誌" />
          <p className="mb-10 -mt-4 text-ink-soft">記錄那些值得慢慢看的事情。</p>
          <div className="divide-y divide-rule border-y border-rule">
            {published(journal).map(j => (
              <Link key={j.id} to={`/journal/${j.slug}`} className="group grid gap-5 py-7 md:grid-cols-[180px_1fr_auto] md:items-center">
                <div className="aspect-[3/2] overflow-hidden bg-paper-warm">
                  <Img src={j.coverImage} alt="" className="slow-zoom h-full w-full object-cover" sizes="(min-width: 768px) 180px, 100vw" />
                </div>
                <div>
                  <div className="meta mb-2">{j.date ? `${j.date} · ` : ''}{j.category}</div>
                  <h3 className="mb-1 text-[1.1rem] font-medium">{j.title}</h3>
                  <p className="text-[14px] text-ink-soft">{j.excerpt}</p>
                </div>
                <span className="link-quiet meta hidden md:block">Read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 最近的日常 ───────────────────────── */}
      <section className="border-t border-rule px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-page">
          <SectionHead zh="最近的日常" en="INSTAGRAM" />
          <div className="grid grid-cols-2 gap-2 md:grid-cols-6 md:gap-3">
            {instagramPosts.map(p => (
              <a key={p.img} href={site.social.instagram} target="_blank" rel="noreferrer" className="group aspect-square overflow-hidden bg-paper-warm">
                <Img src={p.img} alt={p.alt} className="slow-zoom h-full w-full object-cover" sizes="(min-width: 768px) 16vw, 50vw" />
              </a>
            ))}
          </div>
          <a href={site.social.instagram} target="_blank" rel="noreferrer" className="link-quiet meta mt-8 inline-block">
            在 Instagram 上看更多 →
          </a>
        </div>
      </section>

      {/* ── 07 CTA ─────────────────────────────── */}
      <section className="border-t border-rule px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-page">
          <h2 className="max-w-read text-[clamp(1.6rem,3.4vw,2.5rem)] font-bold leading-[1.4]">
            如果你也正在做一件<br className="hidden sm:block" />值得留下來的事
          </h2>
          <p className="mt-8 max-w-read text-ink-soft">
            如果你正在進行：地方創作、文化計畫、人物紀錄、公共藝術、品牌故事、社區行動，
            或只是有一個故事想被好好記錄。也許我們可以一起做一件事。
          </p>
          <Link to="/contact" className="mt-10 inline-block bg-ink px-8 py-3 text-[14px] tracking-[.08em] text-paper transition-colors hover:bg-moss-dark">
            開始聊聊
          </Link>
        </div>
      </section>
    </>
  )
}
