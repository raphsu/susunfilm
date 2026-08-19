import { Link, useParams } from 'react-router-dom'
import { projects } from '../content/projects'
import { Wrap } from '../components/PageHead'
import { Reveal } from '../components/Reveal'
import { Img } from '../components/Img'
import { Seo } from '../components/Seo'
import { SITE_URL } from '../content/site'
import { isPublished } from '../lib/content'
import { StatusBadge } from '../components/StatusBadge'

export default function ProjectDetail() {
  const { slug } = useParams()
  const p = projects.find(x => x.slug === slug)
  const others = projects.filter(x => x.slug !== slug)

  if (!p) {
    return (
      <Wrap>
        <h1 className="text-[2rem] font-bold">找不到這件作品</h1>
        <Link to="/projects" className="link-quiet meta mt-6 inline-block">回到作品 →</Link>
      </Wrap>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    alternateName: p.subtitle,
    url: `${SITE_URL}/projects/${p.slug}`,
    image: `${SITE_URL}${p.coverImage}`,
    description: p.description,
    ...(p.year ? { dateCreated: p.year.replace('–', '/') } : {}),
    ...(p.location ? { locationCreated: { '@type': 'Place', name: p.location } } : {}),
    genre: p.category,
    creator: { '@type': 'Organization', name: '蘇珊日常 SUSUNFILM', url: SITE_URL },
  }

  return (
    <>
      <Seo
        title={p.title}
        description={`${p.subtitle}｜${p.description}`}
        path={`/projects/${p.slug}`}
        image={p.coverImage}
        type="article"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="px-6 pt-10 md:px-10 md:pt-14">
        <div className="mx-auto max-w-[1600px]">
          <div className="aspect-[16/10] overflow-hidden bg-paper-warm md:aspect-[21/9]">
            <Img src={p.coverImage} alt={`${p.title}｜${p.location ?? ''}`} className="h-full w-full object-cover" sizes="(min-width: 1600px) 1600px, 100vw" priority />
          </div>
        </div>
      </section>

      {/* 標題區 */}
      <Wrap>
        <div className="meta mb-5">{p.no} — {p.year} · {p.location}</div>
        <h1 className="text-[clamp(2.2rem,5vw,3.5rem)] font-black leading-[1.15]">{p.title}</h1>
        <div className="mt-3 text-[1.05rem] text-ink-soft">{p.subtitle}</div>
        {p.tailo && <div className="tailo mt-3">{p.tailo}</div>}

        <div className="mt-8 flex flex-wrap gap-2">
          {p.category.map(c => (
            <span key={c} className="border border-rule px-3 py-1 text-[12px] text-ink-mute">{c}</span>
          ))}
        </div>

        {p.lead && <blockquote className="pullquote mt-12 max-w-read text-[1.2rem]">{p.lead}</blockquote>}

        {p.externalUrl && (
          <a href={p.externalUrl} target="_blank" rel="noreferrer"
             className="mt-12 inline-block bg-ink px-8 py-3 text-[14px] tracking-[.08em] text-paper transition-colors hover:bg-moss-dark">
            {p.externalLabel ?? '看完整計畫'} ↗
          </a>
        )}
      </Wrap>

      {/* 兩張並置：同一個地方，不同時間 */}
      {p.diptych && (
        <section className="border-t border-rule px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1600px]">
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {[p.diptych.left, p.diptych.right].map(side => (
                <figure key={side.src}>
                  <div className="aspect-[3/2] overflow-hidden bg-paper-warm">
                    <Img src={side.src} alt={side.alt} className="h-full w-full object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                  </div>
                  <figcaption className="meta mt-3">{side.label}</figcaption>
                </figure>
              ))}
            </div>
            {p.diptych.caption && (
              <p className="mt-10 max-w-read text-[15px] leading-[2] text-ink-soft">{p.diptych.caption}</p>
            )}
          </div>
        </section>
      )}

      {/* 內文 */}
      {p.sections && (
        <Wrap className="border-t border-rule">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-8 md:col-start-3">
              {p.sections.map((s, i) => (
                <Reveal key={s.h} className={i > 0 ? 'mt-16' : ''}>
                  <h2 className="mb-6 text-[1.4rem] font-bold">{s.h}</h2>
                  {s.p?.map((t, j) => (
                    <p key={j} className={j === 0 ? 'text-[1.05rem] leading-[2]' : 'mt-5 leading-[2] text-ink-soft'}>{t}</p>
                  ))}
                  {s.list && (
                    <ul className="mt-2 divide-y divide-rule border-y border-rule">
                      {s.list.map(l => (
                        <li key={l} className="py-4 text-[15px] leading-relaxed text-ink-soft">{l}</li>
                      ))}
                    </ul>
                  )}
                  {s.note && <p className="meta mt-5 normal-case">{s.note}</p>}
                </Reveal>
              ))}
            </div>
          </div>
        </Wrap>
      )}

      {/* 時程 */}
      {p.timeline && (
        <Wrap className="border-t border-rule bg-paper-warm">
          <div className="meta mb-8">PROCESS</div>
          <ol className="divide-y divide-rule border-y border-rule">
            {p.timeline.map(m => (
              <li key={m.when + m.what} className="grid gap-2 py-5 md:grid-cols-[160px_1fr]">
                <div className="meta pt-1">{m.when}</div>
                <div className="text-[15px]">{m.what}</div>
              </li>
            ))}
          </ol>
        </Wrap>
      )}

      {/* Gallery */}
      {p.gallery && (
        <section className="border-t border-rule px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1600px]">
            <div className="meta mb-10">GALLERY</div>
            <div className="grid gap-4 md:grid-cols-12 md:gap-6">
              {p.gallery.map((g, i) => {
                // 刻意不等寬、不等高：大 → 小小 → 大 的節奏
                const span = i % 3 === 0 ? 'md:col-span-8' : 'md:col-span-4'
                const offset = i % 3 === 2 ? 'md:mt-12' : ''
                return (
                  <Reveal key={g.src} className={`${span} ${offset}`}>
                    <Img src={g.src} alt={g.alt} className="w-full" sizes="(min-width: 768px) 60vw, 100vw" />
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 影片 */}
      {p.videos && (
        <Wrap className="border-t border-rule">
          <div className="meta mb-8">VIDEO</div>
          <ul className="divide-y divide-rule border-y border-rule">
            {p.videos.map(v => (
              <li key={v.url}>
                <a href={v.url} target="_blank" rel="noreferrer"
                   className="group grid gap-2 py-5 md:grid-cols-[1fr_auto] md:items-baseline">
                  <span className="link-quiet text-[15px]">{v.title}</span>
                  <span className="meta">{v.len} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </Wrap>
      )}

      {/* Role / Credits */}
      <Wrap className="border-t border-rule">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <div className="meta mb-6">ROLE</div>
            <StatusBadge status={p.roleStatus} />
            {p.role && isPublished(p.roleStatus) ? (
              <ul className="mt-2 space-y-2">
                {p.role.map(r => <li key={r} className="text-[15px]">{r}</li>)}
              </ul>
            ) : (
              <p className="mt-2 text-[15px] text-ink-mute">[待補資料]</p>
            )}
            {!isPublished(p.roleStatus) && (
              <p className="mt-4 max-w-read text-[13px] leading-relaxed text-ink-soft">
                這一格還沒填。公開資料能證明這些事存在，但證明不了我們在裡面做了什麼——
                與其猜，不如空著。
              </p>
            )}
          </div>

          {p.credits && (
            <div>
              <div className="meta mb-6">CREDITS</div>
              <dl className="divide-y divide-rule border-y border-rule">
                {p.credits.map(c => (
                  <div key={c.role + c.name} className="grid gap-1 py-4 md:grid-cols-[1fr_1.4fr] md:gap-4">
                    <dt className="meta">{c.role}</dt>
                    <dd className="text-[14px]">{c.name}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {p.sources && (
          <p className="meta mt-12 normal-case">資料來源｜{p.sources.join('、')}</p>
        )}
      </Wrap>

      {/* Related */}
      <Wrap className="border-t border-rule">
        <div className="meta mb-8">其他作品</div>
        <div className="grid gap-8 md:grid-cols-3">
          {others.map(o => (
            <Reveal key={o.id}>
              <Link to={`/projects/${o.slug}`} className="group block">
                <div className="mb-4 aspect-[3/2] overflow-hidden bg-paper-warm">
                  <Img src={o.coverImage} alt="" className="slow-zoom h-full w-full object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <div className="meta mb-1">{o.no}</div>
                <h3 className="text-[1.1rem] font-medium">{o.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </>
  )
}
