import { IS_PROD } from '../lib/content'
import type { Status } from '../content/site'

/** 只在 dev 出現。上線後自動消失。 */
export function StatusBadge({ status }: { status?: Status }) {
  if (IS_PROD || !status || status === 'verified') return null
  const tone = status === 'review' ? 'bg-rust' : 'bg-ink-mute'
  return (
    <span className={`${tone} ml-3 inline-block px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-[.15em] text-paper`}>
      {status} · 不會上線
    </span>
  )
}
