import { Link } from 'react-router-dom'
import { Wrap } from '../components/PageHead'

export default function NotFound() {
  return (
    <Wrap className="py-28 md:py-40">
      <title>找不到頁面｜蘇珊日常 SUSUNFILM</title>
      <meta name="robots" content="noindex" />
      <span className="meta">404</span>
      <h1 className="mt-6 text-[clamp(1.8rem,4vw,2.75rem)] font-bold leading-[1.35]">
        這裡沒有東西，<br />但轉個彎也許有。
      </h1>
      <p className="mt-8 max-w-read text-ink-soft">多看她一眼，也許你就會發現沒發現的地方風景。</p>
      <Link to="/" className="link-quiet meta mt-10 inline-block">← 回首頁</Link>
    </Wrap>
  )
}
