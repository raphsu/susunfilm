import { site } from '../content/site'
import { Wrap } from '../components/PageHead'
import { Seo } from '../components/Seo'

export default function Contact() {
  return (
    <Wrap className="py-24 md:py-36">
      <Seo
        title="聯絡"
        description="如果你也正在做一件值得留下來的事——地方創作、文化計畫、人物紀錄、公共藝術、品牌故事、社區行動。"
        path="/contact"
      />
      <span className="meta">CONTACT</span>
      <h1 className="mt-6 max-w-read text-[clamp(1.9rem,4.5vw,3.25rem)] font-bold leading-[1.35]">
        如果你也正在做一件<br className="hidden sm:block" />值得留下來的事
      </h1>

      <p className="mt-10 max-w-read text-[1.05rem] leading-[2]">
        如果你正在進行：地方創作、文化計畫、人物紀錄、公共藝術、品牌故事、社區行動，
        或只是有一個故事想被好好記錄。
      </p>
      <p className="mt-4 max-w-read text-[1.05rem]">也許我們可以一起做一件事。</p>

      <a
        href={`mailto:${site.social.email}?subject=%E9%97%9C%E6%96%BC%E4%B8%80%E4%BB%B6%E5%80%BC%E5%BE%97%E7%95%99%E4%B8%8B%E4%BE%86%E7%9A%84%E4%BA%8B`}
        className="mt-12 inline-block bg-ink px-10 py-4 text-[15px] tracking-[.08em] text-paper transition-colors hover:bg-moss-dark"
      >
        開始聊聊
      </a>

      <div className="rule mt-16 pt-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="meta mb-2">EMAIL</div>
            <a href={`mailto:${site.social.email}`} className="link-quiet inline-flex min-h-6 items-center text-[15px]">{site.social.email}</a>
          </div>
          <div>
            <div className="meta mb-2">INSTAGRAM</div>
            <a href={site.social.instagram} target="_blank" rel="noreferrer" className="link-quiet inline-flex min-h-6 items-center text-[15px]">@susunfilm</a>
          </div>
          <div>
            <div className="meta mb-2">FACEBOOK</div>
            <a href={site.social.facebook} target="_blank" rel="noreferrer" className="link-quiet inline-flex min-h-6 items-center text-[15px]">蘇珊日常susunfilm</a>
          </div>
          <div>
            <div className="meta mb-2">影像製作服務</div>
            <a href={site.social.studio} target="_blank" rel="noreferrer" className="link-quiet inline-flex min-h-6 items-center text-[15px]">RaphSuFilm ↗</a>
          </div>
        </div>
      </div>
    </Wrap>
  )
}
