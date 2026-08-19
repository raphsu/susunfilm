export function PageHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <header className="border-b border-rule px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-page">
        <span className="meta">{eyebrow}</span>
        <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.75rem)] font-black leading-[1.15] tracking-[-.01em]">
          {title}
        </h1>
        {lead && <p className="mt-8 max-w-read text-[1.05rem] md:text-[1.15rem]">{lead}</p>}
      </div>
    </header>
  )
}

export function Wrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`px-6 py-16 md:px-10 md:py-24 ${className}`}>
      <div className="mx-auto max-w-page">{children}</div>
    </section>
  )
}

export function H2({ zh, en }: { zh: string; en?: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-5">
      <h2 className="text-[1.6rem] font-bold leading-tight md:text-[1.85rem]">{zh}</h2>
      {en && <span className="meta">{en}</span>}
    </div>
  )
}
