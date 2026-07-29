import dynamic from 'next/dynamic'
import Link from 'next/link'

import { GateBoard } from '@/components/demos/GateBoard'
import { MispricingPlane } from '@/components/demos/MispricingPlane'
import { RubricBoard } from '@/components/demos/RubricBoard'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Reveal, SplitWords } from '@/components/Reveal'
import { Veil } from '@/components/Veil'
import { ArrowLink, Pill, SectionHead, SpecTable } from '@/components/ui'
import { ECONOMICS, EXPERIENCE, HACKATHONS, PROJECTS } from '@/lib/content'

const SurveyCanvas = dynamic(() => import('@/components/three/SurveyCanvas'))

export default function Home() {
  return (
    <>
      <Nav />
      <SurveyCanvas />

      <main className="relative z-10">
        {/* ------------------------------------------------------- HERO */}
        <section className="relative flex min-h-[100svh] items-end pb-[8vh] pt-28">
          <Veil side="left" />
          <div className="shell w-full">
            <Reveal className="max-w-[54rem]">
              <p className="eyebrow mb-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-amber">Benjamin Kassan</span>
                <span className="hidden h-px w-10 bg-[var(--line-strong)] sm:inline-block" />
                <span>Strategy &amp; applied AI systems</span>
              </p>

              <h1 className="display text-[clamp(2.75rem,7.4vw,6.5rem)]">
                <SplitWords text="Systems that" stagger={70} />
                <br />
                <span className="italic text-paper-dim">
                  <SplitWords text="show their work." stagger={70} />
                </span>
              </h1>

              <p className="lede mt-8 max-w-[52ch]">
                I work on <strong className="font-medium text-paper">AI due diligence</strong> and{' '}
                <strong className="font-medium text-paper">value creation</strong> at PwC Strategy&amp;, and I
                build software where every number can be traced back to the source it came from. Economics
                undergraduate; most of what I know I learned by shipping.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#builds" className="btn btn-accent">
                  See what I&rsquo;ve built
                </a>
                <Link href="/agentic-os" className="btn">
                  Agentic operating systems
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="absolute bottom-7 right-[var(--gutter)] hidden items-center gap-3 md:flex">
            <span className="eyebrow text-faint">Scroll</span>
            <span className="block h-10 w-px bg-gradient-to-b from-[var(--line-strong)] to-transparent" />
          </div>
        </section>

        {/* ----------------------------------------------------- BUILDS */}
        <section id="builds" className="relative bg-ink-900 py-[14vh]">
          <div className="shell">
            <SectionHead
              index="01"
              label="Builds"
              title="Things I made, running here."
              intro={
                <>
                  These are not screenshots. Each one runs the real logic on the real data from the project it
                  came from — including the gaps, which are the most honest part.
                </>
              }
            />

            {/* --- Radar */}
            <div className="mt-16 grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <Reveal>
                  <p className="eyebrow tnum mb-3 text-faint">Build 01</p>
                  <h3 className="display text-[1.9rem] leading-tight">Radar Autonomy</h3>
                  <div className="prose-body mt-5 text-[0.9375rem]">
                    <p>
                      A decision system for autonomous-fleet depot infrastructure — sourcing, diligence,
                      underwriting, and a dossier that holds up when someone pulls on it. It is also the
                      largest thing I have built: an agentic operating system with a product on top.
                    </p>
                    <p>
                      Set a fleet size and a budget. Twelve real San Francisco candidate sites get
                      re-underwritten through the weighted gates. Hollow squares are unresolved inputs — they
                      never quietly become a passing value.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {['Next.js', 'TypeScript', 'MapLibre GL', 'Geospatial ETL'].map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-6">
                    <ArrowLink href="/radar">Full case study</ArrowLink>
                    <ArrowLink href="/agentic-os">The operating system</ArrowLink>
                  </div>
                </Reveal>
              </div>
              <Reveal className="md:col-span-7" delay={120}>
                <GateBoard />
              </Reveal>
            </div>

            {/* --- Scout */}
            <div className="mt-24 grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5 md:order-2">
                <Reveal>
                  <p className="eyebrow tnum mb-3 text-faint">Build 02</p>
                  <h3 className="display text-[1.9rem] leading-tight">Prediction-market scout</h3>
                  <div className="prose-body mt-5 text-[0.9375rem]">
                    <p>
                      Scores live prediction markets against a model-derived fair probability and only flags
                      an edge when the divergence clears explicit thresholds. It ran across 407 markets and
                      stored 424 assessments before the API budget ran out.
                    </p>
                    <p>
                      The diagonal is where the model agrees with the market. Everything interesting is the
                      distance from it — and most of that distance is noise until you demand confidence too.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {['Python', 'Claude', 'SQLite'].map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </div>
                </Reveal>
              </div>
              <Reveal className="md:col-span-7 md:order-1" delay={120}>
                <MispricingPlane />
              </Reveal>
            </div>

            {/* --- the rest */}
            <div className="mt-24">
              <Reveal className="mb-8">
                <p className="eyebrow">Also built</p>
              </Reveal>
              {PROJECTS.filter((p) => p.title !== 'Prediction-market scout').map((p, i) => (
                <Reveal
                  key={p.title}
                  delay={i * 45}
                  className="group grid gap-4 border-t border-[var(--line)] py-7 last:border-b md:grid-cols-12 md:gap-8"
                >
                  <div className="flex items-baseline gap-4 md:col-span-3">
                    <span className="eyebrow tnum text-faint">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className="display text-[1.35rem] leading-tight text-paper transition-colors duration-500 group-hover:text-amber-hot">
                      {p.title}
                    </h4>
                  </div>
                  <div className="md:col-span-6">
                    <p className="max-w-[56ch] text-[0.9375rem] leading-relaxed text-paper-dim">{p.body}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                      {p.stack.map((s) => (
                        <span key={s} className="font-mono text-[0.6875rem] tracking-[0.06em] text-faint">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start md:col-span-3 md:justify-end">
                    {p.href ? (
                      <ArrowLink href={p.href} external>
                        {p.hrefLabel ?? 'Visit'}
                      </ArrowLink>
                    ) : (
                      <span className="eyebrow text-faint">{p.note}</span>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- HACKATHONS */}
        <section
          id="hackathons"
          className="relative border-t border-[var(--line)] bg-ink-850 py-[14vh]"
        >
          <div className="shell">
            <SectionHead
              index="02"
              label="Hackathons"
              title="Build fast, then check honestly."
              intro="What I like about hackathons is the forcing function — and what I like about the one that went well is that the time went into building the thing that builds, rather than the thing itself."
            />

            <div className="mt-16 grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                {HACKATHONS.map((h, i) => (
                  <Reveal
                    key={h.name}
                    delay={i * 90}
                    className={i > 0 ? 'mt-12 border-t border-[var(--line)] pt-12' : ''}
                  >
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="display text-[1.75rem] leading-tight">{h.name}</h3>
                      <span className="rounded-full border border-[color-mix(in_oklab,var(--color-amber)_45%,transparent)] px-3 py-1 font-mono text-[0.65rem] tracking-[0.06em] text-amber-hot">
                        {h.result}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-[0.6875rem] leading-relaxed text-faint">{h.meta}</p>
                    <p className="prose-body mt-4 text-[0.9375rem]">{h.what}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {h.stack.map((t) => (
                        <Pill key={t}>{t}</Pill>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal className="md:col-span-7" delay={120}>
                <RubricBoard />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- EXPERIENCE */}
        <section id="experience" className="relative bg-ink-900 py-[14vh]">
          <div className="shell">
            <SectionHead index="03" label="Experience" title="Where I have worked." />

            <div className="mt-16">
              {EXPERIENCE.map((e, i) => (
                <Reveal
                  key={`${e.org}-${e.role}`}
                  delay={i * 50}
                  className="grid gap-3 border-t border-[var(--line)] py-7 last:border-b md:grid-cols-12 md:gap-8"
                >
                  <div className="md:col-span-3">
                    <p className="eyebrow tnum text-muted">{e.period}</p>
                    <p className="mt-1 text-[0.75rem] text-faint">{e.location}</p>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="text-[1.0625rem] font-medium tracking-[-0.01em] text-paper">{e.org}</h3>
                    <p className="mt-0.5 text-[0.875rem] text-amber-hot/85">{e.role}</p>
                  </div>
                  <div className="md:col-span-5">
                    <ul className="m-0 flex list-none flex-col gap-2 p-0">
                      {e.points.map((pt) => (
                        <li key={pt} className="text-[0.875rem] leading-relaxed text-paper-dim">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-12">
              <ArrowLink href="/agentic-os">
                How I think about running work through agents
              </ArrowLink>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------- ECONOMICS */}
        <section
          id="economics"
          className="relative border-t border-[var(--line)] bg-ink-850 py-[14vh]"
        >
          <div className="shell">
            <SectionHead
              index="04"
              label="Economics"
              title="What I actually think."
              intro="Mostly labour: what happens to employment when productivity moves, and why the answer is different in every industry. These are positions I hold and will defend, not a reading list."
            />

            <div className="mt-16">
              {ECONOMICS.map((e, i) => (
                <Reveal
                  key={e.n}
                  delay={i * 50}
                  className="grid gap-4 border-t border-[var(--line)] py-8 last:border-b md:grid-cols-12 md:gap-8"
                >
                  <div className="md:col-span-1">
                    <span className="eyebrow tnum text-amber">{e.n}</span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="display text-[1.4rem] leading-snug text-paper">{e.title}</h3>
                  </div>
                  <div className="md:col-span-7">
                    <p className="text-[0.9375rem] leading-relaxed text-paper-dim">{e.body}</p>
                    <p className="mt-3 font-mono text-[0.6875rem] tracking-[0.04em] text-faint">
                      {e.source}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-14">
              <div className="grid gap-6 rounded-[4px] border border-[color-mix(in_oklab,var(--color-amber)_28%,transparent)] bg-[color-mix(in_oklab,var(--color-amber)_5%,transparent)] p-8 md:grid-cols-12 md:items-center lg:p-10">
                <div className="md:col-span-8">
                  <p className="eyebrow mb-3 text-amber">Open invitation</p>
                  <h3 className="display text-[1.6rem] leading-snug">
                    I want to do actual empirical work on this.
                  </h3>
                  <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-relaxed text-paper-dim">
                    If you are working on labour-demand elasticity, AI adoption and employment, or anything
                    adjacent — as a researcher, a student, or someone sitting on data — I would like to hear
                    from you. Co-authors, replication partners, and people who think I have this wrong are
                    all equally welcome.
                  </p>
                </div>
                <div className="md:col-span-4 md:justify-self-end">
                  <a href="mailto:bkassan@sas.upenn.edu?subject=Economics" className="btn btn-accent">
                    Start a conversation
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------ INDEX */}
        <section id="index" className="relative bg-ink-900 py-[14vh]">
          <div className="shell grid gap-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionHead index="05" label="Index" title="Everything else." />
            </div>
            <div className="md:col-span-7 md:pt-7">
              <SpecTable
                rows={[
                  {
                    k: 'Education',
                    v: (
                      <>
                        University of Pennsylvania, B.A. Economics (2027). Minors in Statistics and Data
                        Science. GPA 3.84. A year abroad at Queen Mary University of London reading labour
                        economics and the political economy of food.
                      </>
                    ),
                  },
                  {
                    k: 'Leadership',
                    v: (
                      <>
                        Co-founder and President, Education Consulting at Penn — a 40+ member group working on
                        education equity. Led a nonprofit turnaround that grew membership 75%, and ran an
                        event series with SpaceX&rsquo;s Ad Astra program.
                      </>
                    ),
                  },
                  { k: 'Languages', v: <>Python · TypeScript / JavaScript · SQL · R · Mathematica</> },
                  {
                    k: 'Systems',
                    v: (
                      <>
                        Claude Code &amp; Agent SDK · agent orchestration · MCP · LangChain · n8n · Next.js /
                        React · MapLibre GL · Postgres · Vercel
                      </>
                    ),
                  },
                  {
                    k: 'Methods',
                    v: (
                      <>
                        Difference-in-differences with staggered adoption · event studies · panel fixed
                        effects · hedonic and count models · trees, random forests and gradient boosting ·
                        RNN forecasting
                      </>
                    ),
                  },
                  { k: 'Away from work', v: <>National-level powerlifting · rugby · tennis · poker · chess · cooking</> },
                ]}
              />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- CONTACT */}
        <section
          id="contact"
          className="relative overflow-hidden border-t border-[var(--line)] bg-ink-850 py-[18vh]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
            style={{
              background:
                'radial-gradient(70% 100% at 50% 120%, rgba(224,162,44,0.14) 0%, rgba(224,162,44,0) 70%)',
            }}
          />
          <div className="shell relative">
            <Reveal className="max-w-[36rem]">
              <p className="eyebrow mb-7">
                <span className="tnum text-amber">06</span>
                <span className="ml-4">Contact</span>
              </p>
              <h2 className="display text-[clamp(2.4rem,6vw,4.5rem)]">
                <SplitWords text="Tell me what you are trying to decide." />
              </h2>
              <p className="lede mt-8">
                I read everything. Diligence questions, agent-tooling problems, and anything about autonomy
                infrastructure get answered fastest.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a href="mailto:bkassan@sas.upenn.edu" className="btn btn-accent">
                  bkassan@sas.upenn.edu
                </a>
                <a
                  href="https://linkedin.com/in/benjamin-kassan"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn"
                >
                  LinkedIn
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
