import { Link, useParams } from 'react-router-dom'
import { journal } from '../content/journal'
import { isPublished } from '../lib/content'
import { Wrap } from '../components/PageHead'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'

export default function JournalDetail() {
  const { slug } = useParams()
  const found = journal.find(x => x.slug === slug)
  const j = found && isPublished(found.status) ? found : undefined

  if (!j) {
    return (
      <Wrap>
        <h1 className="text-[2rem] font-bold">找不到這篇</h1>
        <Link to="/journal" className="link-quiet meta mt-6 inline-block">回到日常誌 →</Link>
      </Wrap>
    )
  }

  return (
    <>
      <Seo
        title={j.title}
        description={j.excerpt}
        path={`/journal/${j.slug}`}
        image={j.coverImage}
        type="article"
      />
      <section className="px-6 pt-10 md:px-10 md:pt-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="aspect-[16/9] overflow-hidden bg-paper-warm">
            <Img src={j.coverImage} alt={j.title} className="h-full w-full object-cover" sizes="(min-width: 1280px) 1280px, 100vw" priority />
          </div>
        </div>
      </section>

      <Wrap>
        <div className="mx-auto max-w-read">
          <div className="meta mb-4">{j.date} · {j.category}</div>
          <h1 className="text-[clamp(1.8rem,4vw,2.75rem)] font-bold leading-[1.3]">{j.title}</h1>
          <p className="mt-8 text-[1.1rem]">{j.excerpt}</p>

          {j.body ? (
            <div className="mt-10">
              {j.body.map((t, i) => (
                <p key={i} className={i === 0 ? 'leading-[2]' : 'mt-5 leading-[2] text-ink-soft'}>{t}</p>
              ))}
            </div>
          ) : (
            <>
              <div className="rule my-12" />
              <span className="meta">內文整理中</span>
              <p className="mt-3 text-ink-soft">這篇的完整文字還沒寫完。</p>
            </>
          )}

        </div>

        {j.gallery && (
          <div className="mx-auto mt-16 grid max-w-[1600px] gap-4 md:grid-cols-12 md:gap-6">
            {j.gallery.map((g, i) => {
              const span = i % 3 === 0 ? 'md:col-span-7' : 'md:col-span-5'
              const offset = i % 4 === 3 ? 'md:mt-10' : ''
              return (
                <Reveal key={g.src} className={`${span} ${offset}`}>
                  <Img src={g.src} alt={g.alt} className="w-full" sizes="(min-width: 768px) 55vw, 100vw" />
                </Reveal>
              )
            })}
          </div>
        )}

        <div className="mx-auto mt-16 max-w-read">
          <Link to="/journal" className="link-quiet meta inline-block">← 回到日常誌</Link>
        </div>
      </Wrap>
    </>
  )
}
