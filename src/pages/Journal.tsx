import { Link } from 'react-router-dom'
import { journal } from '../content/journal'
import { published } from '../lib/content'
import { site } from '../content/site'
import { PageHead, Wrap } from '../components/PageHead'
import { Seo } from '../components/Seo'
import { Img } from '../components/Img'

const JOURNAL_RATIOS = ['aspect-[3/2]', 'aspect-[4/5]', 'aspect-square']

export default function Journal() {
  const items = published(journal)
  return (
    <>
      <Seo
        title="日常誌"
        description="記錄那些值得慢慢看的事情。地方觀察、人物、老店、街區、影像筆記。"
        path="/journal"
      />
      <PageHead eyebrow="JOURNAL" title="日常誌" lead="記錄那些值得慢慢看的事情。" />
      <Wrap>
        <div className="mb-10 flex flex-wrap gap-2">
          {site.tags.map(t => (
            <span key={t} className="border border-rule px-3 py-1 text-[12px] text-ink-soft transition-colors hover:border-moss hover:text-moss-text">
              #{t}
            </span>
          ))}
        </div>

        {items.length === 0 && (
          <div className="max-w-read border border-rule p-10">
            <span className="meta">整理中</span>
            <p className="mt-4 text-ink-soft">
              第一批文章還在寫。與其先放上還沒確認過的東西，我們寧可讓這一頁先空著。
            </p>
          </div>
        )}

        {/* 跟首頁 Project Card 同一套交錯節奏（md:mt-16 / md:mt-6），
            並讓封面比例輪替，避免三欄全部等高等比例。 */}
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
          {items.map((j, i) => (
            <Link
              key={j.id}
              to={`/journal/${j.slug}`}
              className={`group block ${i % 3 === 1 ? 'md:mt-16' : i % 3 === 2 ? 'md:mt-6' : ''}`}
            >
              <div className={`mb-5 overflow-hidden bg-paper-warm ${JOURNAL_RATIOS[i % 3]}`}>
                <Img src={j.coverImage} alt="" className="slow-zoom h-full w-full object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
              </div>
              <div className="meta mb-2">{j.date ? `${j.date} · ` : ''}{j.category}</div>
              <h2 className="mb-2 text-[1.15rem] font-medium leading-snug">{j.title}</h2>
              <p className="text-[14px] leading-relaxed text-ink-soft">{j.excerpt}</p>
            </Link>
          ))}
        </div>
      </Wrap>
    </>
  )
}
