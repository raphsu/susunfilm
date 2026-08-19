import { story } from '../content/story'
import { PageHead, Wrap, H2 } from '../components/PageHead'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'

export default function Story() {
  return (
    <>
      <Seo
        title="我為什麼拍？"
        description="為什麼記錄、為什麼地方、為什麼人物、為什麼日常。三心二意、動態明信片、三味——蘇珊日常的創作觀。"
        path="/story"
      />
      <PageHead eyebrow={story.eyebrow} title={story.title} lead={story.lead} />

      {/* 為什麼是現在 */}
      <Wrap>
        <H2 zh={story.whyTitle} en="CONTEXT" />
        <p className="max-w-read text-[1.05rem]">{story.whyIntro}</p>
        <dl className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {story.facts.map(f => (
            <div key={f.label} className="border-t border-rule pt-4">
              <dt className="text-[13px] text-ink-soft">{f.label}</dt>
              <dd className="mt-1 font-mono text-[1.3rem] font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="meta mt-10">資料來源｜{story.factsSource}</p>
      </Wrap>

      {/* 三個關鍵故事 */}
      <Wrap className="border-t border-rule bg-paper-warm">
        <H2 zh={story.storiesTitle} en="THREE STORIES" />
        <div className="grid gap-10 md:grid-cols-3">
          {story.stories.map(s => (
            <Reveal key={s.no}>
              <div className="meta mb-3">{s.no}</div>
              <h3 className="mb-4 text-[1.2rem] font-medium">{s.title}</h3>
              <p className="text-[15px] leading-[1.9] text-ink-soft">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </Wrap>

      {/* 三心二意 */}
      <Wrap className="border-t border-rule">
        <H2 zh={story.howTitle} en="METHOD" />
        <p className="mb-2 text-[1.15rem] font-medium">{story.howSub}</p>
        <p className="mb-10 max-w-read text-ink-soft">{story.howIntro}</p>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
          {story.how.map(h => (
            <div key={h.k} className="border-t border-moss pt-4">
              <div className="text-[1.1rem] font-medium text-moss-text">{h.k}</div>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{h.v}</p>
            </div>
          ))}
        </div>
      </Wrap>

      {/* Video Postcard */}
      <Wrap className="border-t border-rule">
        <H2 zh={story.methodTitle} en="VIDEO POSTCARD" />
        <p className="mb-10 text-[1.15rem] font-medium">{story.methodSub}</p>
        <div className="grid gap-10 md:grid-cols-2">
          {story.method.map(m => (
            <Reveal key={m.t}>
              <h3 className="mb-3 text-[1.1rem] font-medium">{m.t}</h3>
              <p className="text-[15px] leading-[1.9] text-ink-soft">{m.d}</p>
            </Reveal>
          ))}
        </div>
      </Wrap>

      {/* 三味 */}
      <Wrap className="border-t border-rule bg-paper-warm">
        <H2 zh={story.axisTitle} en="THREE FLAVOURS" />
        <div className="divide-y divide-rule border-y border-rule">
          {story.axis.map(a => (
            <div key={a.k} className="grid gap-4 py-8 md:grid-cols-[200px_1fr]">
              <div>
                <div className="text-[1.35rem] font-bold">{a.k}</div>
                <div className="meta mt-1">{a.s}</div>
              </div>
              <p className="text-[15px] leading-[1.9] text-ink-soft">{a.d}</p>
            </div>
          ))}
        </div>
      </Wrap>

      <Wrap className="border-t border-rule">
        <blockquote className="pullquote mx-auto max-w-read text-[1.3rem] md:text-[1.5rem]">
          {story.closing}
        </blockquote>
      </Wrap>
    </>
  )
}
