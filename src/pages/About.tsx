import { Link } from 'react-router-dom'
import { about } from '../content/about'
import { site } from '../content/site'
import { pick } from '../lib/content'
import { StatusBadge } from '../components/StatusBadge'
import { PageHead, Wrap, H2 } from '../components/PageHead'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { Img } from '../components/Img'

export default function About() {
  return (
    <>
      <Seo
        title="關於蘇珊"
        description="我們是蘇珊日常。一個拿相機的，一個做平面設計的，都是在地的橋頭人。一路走到現在的創作歷程。"
        path="/about"
      />
      <PageHead eyebrow={about.eyebrow} title={about.title} />

      <Wrap>
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="aspect-[2/3] overflow-hidden bg-paper-warm">
              <Img src={about.portrait} alt="手持 Super 8 攝影機的珊珊" className="h-full w-full object-cover" sizes="(min-width: 768px) 40vw, 100vw" />
            </div>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7">
            <div className="mb-2"><StatusBadge status={about.introStatus} /></div>
            {pick(about.intro, about.introStatus, [...site.intro]).map((p, i) => (
              <p key={i} className={i === 0 ? 'text-[1.2rem] font-medium leading-[1.85]' : 'mt-4 text-ink-soft'}>{p}</p>
            ))}
            {/* 這段還沒放行時，連分隔線一起收掉，不要留一條孤線 */}
            {pick(about.story, about.storyStatus, []).length > 0 && (
              <>
                <div className="rule my-10" />
                <div className="mb-2"><StatusBadge status={about.storyStatus} /></div>
                {pick(about.story, about.storyStatus, []).map((p, i) => (
                  <p key={i} className={i === 0 ? 'text-[1.05rem]' : 'mt-5 text-ink-soft'}>{p}</p>
                ))}
              </>
            )}
          </Reveal>
        </div>
      </Wrap>

      <Wrap className="border-t border-rule bg-paper-warm">
        <H2 zh={about.timelineTitle} en="TIMELINE" />
        <ol className="divide-y divide-rule border-y border-rule">
          {about.timeline.map((t, i) => (
            <li key={i} className="grid gap-2 py-6 md:grid-cols-[140px_1fr]">
              <div className="meta pt-1">{t.year}</div>
              <div className="text-[15px] leading-relaxed">{t.text}</div>
            </li>
          ))}
        </ol>
        <p className="meta mt-8">沒有出處的年份一律留空，不臆測</p>
      </Wrap>

      <Wrap className="border-t border-rule">
        <div className="grid gap-8 md:grid-cols-2">
          <Link to="/story" className="link-quiet group block border border-rule p-8 transition-colors hover:border-moss">
            <span className="meta">STORY</span>
            <div className="mt-3 text-[1.3rem] font-medium">我為什麼拍？</div>
            <p className="mt-2 text-[14px] text-ink-soft">不是攝影技術的問題。</p>
          </Link>
          <Link to="/projects" className="link-quiet group block border border-rule p-8 transition-colors hover:border-moss">
            <span className="meta">PROJECTS</span>
            <div className="mt-3 text-[1.3rem] font-medium">我們留下了什麼</div>
            <p className="mt-2 text-[14px] text-ink-soft">四個正在進行的方向。</p>
          </Link>
        </div>
      </Wrap>
    </>
  )
}
