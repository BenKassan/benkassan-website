'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const LINKS = [
  { href: '/#builds', label: 'Builds' },
  { href: '/#hackathons', label: 'Hackathons' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#economics', label: 'Economics' },
  { href: '/agentic-os', label: 'Agentic OS' },
  { href: '/#contact', label: 'Contact' },
]

function Clock() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'America/New_York',
        }).format(new Date())
      )
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="tnum">
      New York {time ?? '--:--'}
    </span>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(8,9,11,0.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
        }}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6">
          <Link
            href="/"
            className="group flex items-baseline gap-3 no-underline"
            aria-label="Benjamin Kassan — home"
          >
            <span className="display text-[1.35rem] text-paper">BK</span>
            <span className="eyebrow hidden text-faint sm:inline">Benjamin Kassan</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="link-underline text-[0.8125rem] tracking-[0.01em] text-paper-dim hover:text-paper"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 text-[0.6875rem] text-faint lg:flex">
            <span
              className="inline-block size-[5px] rounded-full bg-amber"
              style={{ boxShadow: '0 0 10px 1px rgba(224,162,44,0.7)' }}
            />
            <span className="eyebrow text-muted">
              <Clock />
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="eyebrow -mr-2 flex h-9 items-center px-2 text-paper md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className="fixed inset-0 z-40 flex flex-col justify-center bg-ink-900/97 px-[var(--gutter)] backdrop-blur-xl transition-[opacity,visibility] duration-400 md:hidden"
        style={{
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
        }}
      >
        <nav className="flex flex-col gap-1">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display border-b border-[var(--line)] py-5 text-[2.25rem] text-paper no-underline"
              style={{
                transform: open ? 'none' : 'translateY(16px)',
                opacity: open ? 1 : 0,
                transition: `transform .6s var(--ease-out-expo) ${i * 45}ms, opacity .6s var(--ease-out-expo) ${i * 45}ms`,
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
