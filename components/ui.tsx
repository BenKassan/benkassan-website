import type { ReactNode } from 'react'

import { Reveal, SplitWords } from './Reveal'

export function SectionHead({
  index,
  label,
  title,
  intro,
}: {
  index: string
  label: string
  title: string
  intro?: ReactNode
}) {
  return (
    <Reveal className="grid gap-8 border-t border-[var(--line)] pt-7 md:grid-cols-12 md:gap-10">
      <div className="flex items-baseline gap-4 md:col-span-3">
        <span className="eyebrow tnum text-amber">{index}</span>
        <span className="eyebrow">{label}</span>
      </div>
      <div className="md:col-span-9">
        <h2 className="display text-[clamp(2.1rem,4.4vw,3.6rem)]">
          <SplitWords text={title} />
        </h2>
        {intro ? <div className="lede mt-6 max-w-[46ch]">{intro}</div> : null}
      </div>
    </Reveal>
  )
}

/** Monospace label/value rows — the site's core information surface. */
export function SpecTable({
  rows,
  dense = false,
}: {
  rows: { k: string; v: ReactNode }[]
  dense?: boolean
}) {
  return (
    <dl className="w-full">
      {rows.map((r, i) => (
        <div
          key={r.k}
          className={`grid grid-cols-[minmax(6.5rem,10rem)_1fr] items-baseline gap-x-6 border-t border-[var(--line)] ${
            dense ? 'py-2.5' : 'py-3.5'
          } ${i === rows.length - 1 ? 'border-b' : ''}`}
        >
          <dt className="eyebrow pt-[3px]">{r.k}</dt>
          <dd className="m-0 text-[0.9375rem] leading-relaxed text-paper-dim">{r.v}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--line-strong)] px-3 py-[5px] font-mono text-[0.6875rem] tracking-[0.06em] text-paper-dim">
      {children}
    </span>
  )
}

export function ArrowLink({
  href,
  children,
  external = false,
}: {
  href: string
  children: ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className="group inline-flex items-center gap-2 text-[0.875rem] text-paper no-underline"
    >
      <span className="link-underline">{children}</span>
      <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        aria-hidden
        className="translate-y-px transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1"
      >
        <path
          d={external ? 'M3 10L10 3M10 3H4.5M10 3V8.5' : 'M2 6.5H11M11 6.5L7 2.5M11 6.5L7 10.5'}
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}

/** Big numeric callout used sparingly, always with a source note. */
export function Figure({
  value,
  unit,
  caption,
}: {
  value: string
  unit?: string
  caption: string
}) {
  return (
    <div>
      <div className="display tnum flex items-baseline gap-1 text-[clamp(2.4rem,5vw,3.6rem)] text-paper">
        {value}
        {unit ? <span className="text-[0.42em] text-muted">{unit}</span> : null}
      </div>
      <p className="mt-2 max-w-[24ch] text-[0.8125rem] leading-snug text-muted">{caption}</p>
    </div>
  )
}
