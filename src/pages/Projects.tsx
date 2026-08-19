import { Link } from 'react-router-dom'
import { projects } from '../content/projects'
import { PageHead, Wrap } from '../components/PageHead'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { Img } from '../components/Img'

export default function Projects() {
  return (
    <>
      <Seo
        title="作品"
        description="橋頭咧咧相、《家》的生活筆記、藝術生活觀察、異業與區域觀察。四個正在進行的方向。"
        path="/projects"
      />
      <PageHead
        eyebrow="PROJECTS"
        title="作品"
        lead="四個正在進行的方向。不是接案清單，是我們持續在看的事。"
      />
      <Wrap>
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.id} className={i % 2 === 1 ? 'md:mt-20' : ''}>
              <Link to={`/projects/${p.slug}`} className="group block">
                <div className={`mb-6 overflow-hidden bg-paper-warm ${p.ratio}`}>
                  <Img src={p.coverImage} alt="" className="slow-zoom h-full w-full object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
                <div className="meta mb-3">{p.no} — {p.year} · {p.location}</div>
                <h2 className="text-[1.6rem] font-bold">{p.title}</h2>
                <div className="mt-1 text-[14px] text-ink-soft">{p.subtitle}</div>
                {p.tailo && <div className="tailo mt-2">{p.tailo}</div>}
                <p className="mt-4 max-w-read text-[15px] leading-relaxed text-ink-soft">{p.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.category.map(c => (
                    <span key={c} className="border border-rule px-2 py-0.5 text-[11px] text-ink-mute">{c}</span>
                  ))}
                </div>
                <span className="link-quiet meta mt-6 inline-block">View Project →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </>
  )
}
