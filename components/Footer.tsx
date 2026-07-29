import Link from 'next/link'

const SOCIAL = [
  { href: 'mailto:bkassan@sas.upenn.edu', label: 'Email' },
  { href: 'https://linkedin.com/in/benjamin-kassan', label: 'LinkedIn' },
  { href: 'https://github.com/benkassan', label: 'GitHub' },
  { href: 'https://x.com/ben_kassan', label: 'X' },
]

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--line)] bg-ink-900">
      <div className="shell grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="display text-[1.75rem] leading-tight">
            Benjamin&nbsp;Kassan
          </p>
          <p className="mt-3 max-w-[34ch] text-[0.875rem] leading-relaxed text-muted">
            Strategy and applied AI systems. Philadelphia and New York.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow mb-4">Elsewhere</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                  className="link-underline text-[0.875rem] text-paper-dim hover:text-paper"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="eyebrow mb-4">Pages</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            <li>
              <Link href="/" className="link-underline text-[0.875rem] text-paper-dim hover:text-paper">
                Home
              </Link>
            </li>
            <li>
              <Link href="/radar" className="link-underline text-[0.875rem] text-paper-dim hover:text-paper">
                Radar Autonomy — case study
              </Link>
            </li>
            <li>
              <Link href="/agentic-os" className="link-underline text-[0.875rem] text-paper-dim hover:text-paper">
                Agentic operating systems — a method
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-[var(--line)] py-6 text-[0.75rem] text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Benjamin Kassan</span>
        <span className="font-mono tracking-[0.05em]">
          Point cloud rendered in WebGL · 96k instanced points
        </span>
      </div>
    </footer>
  )
}
