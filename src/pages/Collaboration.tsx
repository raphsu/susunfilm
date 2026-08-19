import { Link } from 'react-router-dom'
import { collaborations, collaborationIntro } from '../content/collaborations'
import { PageHead, Wrap } from '../components/PageHead'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'

export default function Collaboration() {
  return (
    <>
      <Seo
        title="一起做過的事"
        description="有些作品，是一個人完成的；有些故事，需要很多人一起留下來。合作過的單位與人。"
        path="/collaboration"
      />
      <PageHead eyebrow="COLLABORATION" title="一起做過的事" lead={collaborationIntro} />
      <Wrap>
        {collaborations.map(g => (
          <Reveal key={g.en} className="mb-16 last:mb-0">
            <div className="mb-8 flex items-baseline gap-5">
              <h2 className="text-[1.4rem] font-bold">{g.zh}</h2>
              <span className="meta">{g.en}</span>
            </div>
            <ul className="divide-y divide-rule border-y border-rule">
              {g.items.map(i => (
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
          </Reveal>
        ))}
      </Wrap>
    </>
  )
}
