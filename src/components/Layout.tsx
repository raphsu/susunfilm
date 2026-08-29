import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { site } from '../content/site'
import { published } from '../lib/content'
import { asset } from '../lib/asset'

/** production 只留 verified 的頁面；dev 全部顯示。 */
const nav = published([...site.nav])

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-page items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={asset("/brand/logo-72.png")} width={36} height={36} alt="" className="h-9 w-9 rounded-full" />
          <span className="font-bold tracking-[.05em]">蘇珊日常</span>
        </Link>

        <nav className="hidden gap-7 md:flex">
          {nav.map(i => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) => `link-quiet text-[14px] ${isActive ? 'text-moss-text' : ''}`}
            >
              {i.zh}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden"
          aria-expanded={open}
          aria-label={open ? '關閉選單' : '開啟選單'}
          onClick={() => setOpen(v => !v)}
        >
          <span className="meta">{open ? 'CLOSE' : 'MENU'}</span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-rule px-6 pb-6 pt-2 md:hidden">
          {nav.map(i => (
            <NavLink
              key={i.to}
              to={i.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `block border-b border-rule py-3 ${isActive ? 'text-moss-text' : ''}`}
            >
              {i.zh}
              <span className="meta ml-3">{i.en}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-moss-dark">
      <div className="mx-auto max-w-page px-6 py-16 md:px-10 md:py-20">
        <img src={asset("/brand/logo-white-wordmark.png")} alt="蘇珊日常 SUSUNFILM" width={2153} height={582} className="mb-8 h-12 w-auto md:h-14" />
        <p className="max-w-read text-cream">{site.tagline}</p>

        <nav className="mt-10 grid gap-y-3 sm:grid-cols-2 md:grid-cols-4">
          {nav.slice(1).map(i => (
            <Link key={i.to} to={i.to} className="text-[14px] text-cream/90 transition-colors hover:text-cream">
              {i.zh}
            </Link>
          ))}
        </nav>

        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-cream/25 pt-8">
          <a href={site.social.instagram} target="_blank" rel="noreferrer" className="text-[14px] text-cream/90 transition-colors hover:text-cream">Instagram</a>
          <a href={site.social.threads} target="_blank" rel="noreferrer" className="text-[14px] text-cream/90 transition-colors hover:text-cream">Threads</a>
          <a href={site.social.facebook} target="_blank" rel="noreferrer" className="text-[14px] text-cream/90 transition-colors hover:text-cream">Facebook</a>
          <a href={site.social.studio} target="_blank" rel="noreferrer" className="text-[14px] text-cream/90 transition-colors hover:text-cream">影像製作服務 → RaphSuFilm</a>
        </div>

        <a href={`mailto:${site.social.email}`} className="mt-8 inline-flex min-h-6 items-center font-mono text-[11px] uppercase tracking-[.18em] text-cream/90 transition-colors hover:text-cream">
          {site.social.email}
        </a>
      </div>
    </footer>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        跳至主要內容
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
