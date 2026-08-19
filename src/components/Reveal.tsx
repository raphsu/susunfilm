import { useEffect, useRef, type ReactNode } from 'react'

/**
 * 進場動畫。全站只有這一種：16px 上移 + 淡入，600ms，只播一次。
 *
 * 漸進增強：CSS 預設讓內容可見，只有掛上 .reveal-ready 之後才會藏起來。
 * 加上 1.2 秒的保險——某些環境（無頭瀏覽器、部分 in-app browser）
 * 的 IntersectionObserver 不會回呼，沒有這道保險內容會永遠隱形。
 */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => el.classList.add('is-in')

    if (!('IntersectionObserver' in window)) { show(); return }

    document.documentElement.classList.add('reveal-ready')

    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { show(); io.disconnect(); clearTimeout(t) } },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)

    // 保險：IO 沒回呼就直接顯示
    const t = window.setTimeout(() => { show(); io.disconnect() }, 1200)

    return () => { io.disconnect(); clearTimeout(t) }
  }, [])

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}
