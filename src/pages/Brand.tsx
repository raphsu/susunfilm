import { Link } from 'react-router-dom'
import { brand } from '../content/brand'
import { site } from '../content/site'
import { collaborations } from '../content/collaborations'
import { PageHead, Wrap, H2 } from '../components/PageHead'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { StatusBadge } from '../components/StatusBadge'
import { IS_PROD } from '../lib/content'

/** 「做過的事」直接引用 collaborations 裡已確認的委託，不另外抄一份。 */
const filmWork = collaborations.find(g => g.en === 'FILM')?.items ?? []

const mailto =
  `mailto:${site.social.email}?subject=${encodeURIComponent(brand.mailSubject)}`

export default function Brand() {
  return (
    <>
      <Seo
        title={brand.title}
        description="用拍日常的方式拍品牌：在地店家、職人與工作現場、空間、文化計畫。先講清楚我們適合什麼、不適合什麼。"
        path="/brand"
        image={brand.hero.src}
      />
      <PageHead eyebrow={brand.eyebrow} title={brand.title} lead={brand.lead} />

      {/* dev 才看得到：提醒這頁的文案還沒經過校對。prod 連這塊留白都不要留 */}
      {!IS_PROD && (
        <div className="px-6 pt-8 md:px-10">
          <div className="mx-auto max-w-page">
            <StatusBadge status={brand.status} />
          </div>
        </div>
      )}

      <section className="px-6 pt-10 md:px-10 md:pt-16">
        <div className="mx-auto max-w-[1600px]">
          <div className="aspect-[16/10] overflow-hidden bg-paper-warm md:aspect-[21/9]">
            <Img
              src={brand.hero.src}
              alt={brand.hero.alt}
              className="h-full w-full object-cover"
              sizes="(min-width: 1600px) 1600px, 100vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── 這頁是什麼 ───────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-page gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <span className="meta">WHY THIS PAGE</span>
          </div>
          <Reveal className="md:col-span-7">
            {brand.intro.map((line, i) => (
              <p key={i} className={i === 0 ? 'text-[1.15rem] font-medium' : 'mt-4 text-ink-soft'}>
                {line}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── 適合這樣的合作 ───────────────────── */}
      <Wrap className="border-t border-rule">
        <H2 zh={brand.fitTitle} en="GOOD FIT" />
        <div className="grid gap-x-10 gap-y-0 border-b border-rule md:grid-cols-2">
          {brand.fit.map(f => (
            <Reveal key={f.h} className="border-t border-rule py-7">
              <h3 className="text-[1.05rem] font-medium">{f.h}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{f.p}</p>
            </Reveal>
          ))}
        </div>
      </Wrap>

      {/* ── 我們會怎麼拍 ─────────────────────── */}
      <section className="border-t border-rule bg-paper-warm px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-page gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <div className="aspect-[2/3] overflow-hidden bg-paper-deep">
              <Img
                src={brand.portrait.src}
                alt={brand.portrait.alt}
                className="h-full w-full object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
            <blockquote className="pullquote mt-8 text-[1.05rem]">
              {site.quotes[3].text}
            </blockquote>
            <div className="tailo mt-3">{site.quotes[3].romanization}</div>
          </Reveal>

          <div className="md:col-span-7 md:col-start-6">
            <H2 zh={brand.howTitle} en="HOW WE WORK" />
            <ol className="divide-y divide-rule border-y border-rule">
              {brand.how.map(h => (
                <li key={h.no} className="grid gap-2 py-7 md:grid-cols-[64px_1fr] md:gap-6">
                  <span className="meta">{h.no}</span>
                  <div>
                    <h3 className="text-[1.05rem] font-medium">{h.h}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{h.p}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── 流程 ─────────────────────────────── */}
      <Wrap className="border-t border-rule">
        <H2 zh={brand.processTitle} en="PROCESS" />
        <ol className="divide-y divide-rule border-y border-rule">
          {brand.process.map(s => (
            <li key={s.no} className="grid gap-2 py-7 md:grid-cols-[64px_240px_1fr] md:gap-6">
              <span className="meta">{s.no}</span>
              <h3 className="text-[1.05rem] font-medium">{s.h}</h3>
              <p className="text-[14px] leading-relaxed text-ink-soft">{s.p}</p>
            </li>
          ))}
        </ol>
      </Wrap>

      {/* ── 報價／不做的事 ───────────────────── */}
      <Wrap className="border-t border-rule">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <H2 zh={brand.pricingTitle} en="PRICING" />
            {brand.pricing.map((p, i) => (
              <p key={i} className={i === 0 ? 'max-w-read' : 'mt-4 max-w-read text-ink-soft'}>{p}</p>
            ))}
          </Reveal>
          <Reveal>
            <H2 zh={brand.boundaryTitle} en="NOT US" />
            <ul className="max-w-read space-y-4">
              {brand.boundary.map((b, i) => (
                <li key={i} className="text-ink-soft">{b}</li>
              ))}
            </ul>
            <a
              href={site.social.studio}
              target="_blank"
              rel="noreferrer"
              className="link-quiet meta mt-6 inline-block"
            >
              {brand.boundaryLinkLabel}
            </a>
          </Reveal>
        </div>
      </Wrap>

      {/* ── 做過的事 ─────────────────────────── */}
      <Wrap className="border-t border-rule">
        <H2 zh={brand.evidenceTitle} en="TRACK RECORD" />
        <p className="mb-8 max-w-read text-ink-soft">{brand.evidenceLead}</p>
        <ul className="divide-y divide-rule border-y border-rule">
          {filmWork.map(i => (
            <li key={i.name} className="grid gap-2 py-6 md:grid-cols-[280px_1fr] md:gap-8">
              <div className="text-[1.05rem] font-medium">
                {i.project
                  ? <Link to={`/projects/${i.project}`} className="link-quiet">{i.name}</Link>
                  : i.name}
              </div>
              <div className="text-[14px] leading-relaxed text-ink-soft">{i.role}</div>
            </li>
          ))}
        </ul>
        <Link to="/collaboration" className="link-quiet meta mt-8 inline-block">
          一起做過的事 →
        </Link>
      </Wrap>

      {/* ── CTA ──────────────────────────────── */}
      <section className="border-t border-rule bg-moss-dark px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-page">
          <span className="meta text-cream/70">CONTACT</span>
          <h2 className="mt-5 max-w-read text-[clamp(1.6rem,3.5vw,2.5rem)] font-bold leading-[1.35] text-cream">
            {brand.ctaTitle}
          </h2>
          <p className="mt-6 max-w-read text-cream/90">{brand.ctaLead}</p>
          <a
            href={mailto}
            className="mt-10 inline-block bg-cream px-10 py-4 text-[15px] tracking-[.08em] text-ink transition-colors hover:bg-paper"
          >
            {brand.ctaLabel}
          </a>
        </div>
      </section>
    </>
  )
}
