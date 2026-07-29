import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Reveal, SplitWords } from '@/components/Reveal'
import { ArrowLink, Figure, Pill, SpecTable } from '@/components/ui'

const GateCanvas = dynamic(() => import('@/components/three/GateField'))

export const metadata: Metadata = {
  title: 'Radar Autonomy',
  description:
    'A case study in evidence engineering: the decision and data system I designed and built for autonomous-fleet depot sourcing, diligence and underwriting.',
}

/** A numbered chapter heading used down the case study. */
function Chapter({
  n,
  label,
  title,
}: {
  n: string
  label: string
  title: string
}) {
  return (
    <Reveal className="mb-10 border-t border-[var(--line)] pt-7">
      <div className="flex items-baseline gap-4">
        <span className="eyebrow tnum text-amber">{n}</span>
        <span className="eyebrow">{label}</span>
      </div>
      <h2 className="display mt-5 max-w-[20ch] text-[clamp(1.9rem,3.9vw,3rem)]">
        <SplitWords text={title} />
      </h2>
    </Reveal>
  )
}

export default function RadarPage() {
  return (
    <>
      <Nav />

      <main className="relative z-10">
        {/* ------------------------------------------------------ HERO */}
        <section className="relative flex min-h-[92svh] items-end overflow-hidden pb-[9vh] pt-32">
          <GateCanvas />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(72% 60% at 20% 72%, rgba(8,9,11,0.95) 0%, rgba(8,9,11,0.7) 48%, rgba(8,9,11,0) 82%), linear-gradient(to bottom, rgba(8,9,11,0.9) 0%, rgba(8,9,11,0) 28%)',
            }}
          />
          <div className="shell relative w-full">
            <Reveal className="max-w-[50rem]">
              <p className="eyebrow mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link href="/" className="link-underline text-muted">
                  Index
                </Link>
                <span className="text-faint">/</span>
                <span className="text-amber">Case study</span>
              </p>

              <h1 className="display text-[clamp(2.8rem,8vw,7rem)]">
                <SplitWords text="Radar" stagger={80} />{' '}
                <span className="italic text-paper-dim">
                  <SplitWords text="Autonomy" stagger={80} />
                </span>
              </h1>

              <p className="lede mt-9 max-w-[56ch]">
                An <strong className="font-medium text-paper">agentic operating system</strong> with a
                product on top. The product decides where autonomous fleets should put their depots. The
                operating system underneath is what makes the product&rsquo;s answers checkable — a governed
                control plane that routes machine work, bounds what any agent can see, and keeps a person on
                the irreversible verbs. I designed and built both.
              </p>

              <div className="mt-10 flex flex-wrap gap-2">
                {['Next.js', 'React', 'TypeScript', 'MapLibre GL', 'D3', 'Postgres', 'Geospatial ETL'].map(
                  (t) => (
                    <Pill key={t}>{t}</Pill>
                  )
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------- THE NUMBERS */}
        <section className="relative border-y border-[var(--line)] bg-ink-850">
          <div className="shell grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-4">
            {[
              { v: '189,323', c: 'Lines of TypeScript across 574 tracked files' },
              { v: '230,553', c: 'GeoJSON features published across 28 datasets' },
              { v: '44', c: 'Automated data-integrity checks standing in for a test suite' },
              { v: '4', c: 'Cron pipelines that fetch, validate and commit data unattended' },
            ].map((f, i) => (
              <Reveal key={f.v} delay={i * 90}>
                <Figure value={f.v} caption={f.c} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------ PROBLEM */}
        <section className="relative bg-ink-900 py-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Chapter n="01" label="The problem" title="A research problem wearing real-estate clothes." />
            </div>
            <div className="prose-body md:col-span-7 md:pt-7">
              <p>
                Autonomous fleets need ground. Not abstractly — specific parcels, close enough to
                where demand actually is, with enough grid capacity to charge a fleet overnight,
                zoned to permit the use, with a yard geometry that a vehicle can actually circulate
                through, and with a path to site control that does not take three years.
              </p>
              <p>
                Each of those is a different public-records problem with a different source, a
                different update cadence, and a different failure mode. Assembled by hand, the
                answer arrives as a spreadsheet and a recommendation — and six months later, when
                someone asks why <em>this</em> parcel, the reasoning has evaporated. The number
                survives; the evidence behind it does not.
              </p>
              <p>
                <strong>
                  Radar exists to make that chain unbreakable.
                </strong>{' '}
                Not a map with scores on it. A traceable path from a public source, through a
                documented derivation, to a gate that a site either cleared or failed — with the
                record that decided it still attached at the end.
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------- THE TWO HALVES */}
        <section className="relative border-t border-[var(--line)] bg-ink-900 pb-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Chapter
                n="01b"
                label="Shape"
                title="Two halves, and the second one is the interesting one."
              />
            </div>
            <div className="prose-body md:col-span-7 md:pt-7">
              <p>
                The visible half is a geospatial workbench: markets, layers, candidate parcels, gates,
                underwriting, exports. Everything below in this case study describes it.
              </p>
              <p>
                The half nobody sees is an operating system for the machine work that keeps it honest — a
                separate repository holding no application code at all, only registries, policies, schemas and
                adversarial evaluations. A deterministic router decides which specialist handles a task and
                exactly what it may read, <em>before</em> any model reasons about anything. Specialists launch
                with no tools and no inherited history. Four verbs stay with a human.
              </p>
              <p>
                I built it in that order for a reason. The product got good fast and then started drifting —
                numbers that were right on Monday, unsourced by Friday, with no way to tell which agent or
                which run had changed them. The operating system is what stopped that, and it is the part of
                this project I would rebuild first somewhere else.
              </p>
              <div className="mt-8">
                <ArrowLink href="/agentic-os">The method, generalised</ArrowLink>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- CHAIN */}
        <section className="relative border-t border-[var(--line)] bg-ink-850 py-[13vh]">
          <div className="shell">
            <Chapter n="02" label="The spine" title="Source to decision, without a gap." />
            <div className="mt-4 grid gap-2 md:grid-cols-7">
              {[
                { t: 'Brief', d: 'What the operator actually needs' },
                { t: 'Demand', d: 'Where the trips are' },
                { t: 'Candidates', d: 'Parcels and facilities' },
                { t: 'Gates', d: 'Pass, fail, or unresolved' },
                { t: 'Underwriting', d: 'Weighted, versioned' },
                { t: 'Dossier', d: 'Frozen and hashed' },
                { t: 'Monitoring', d: 'Sources age; so does the answer' },
              ].map((s, i) => (
                <Reveal
                  key={s.t}
                  delay={i * 70}
                  className="group relative border-t border-[var(--line)] pt-4 md:border-t-0 md:border-l md:pl-4 md:pt-0"
                >
                  <span className="eyebrow tnum text-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2 text-[0.9375rem] font-medium text-paper">{s.t}</p>
                  <p className="mt-1 text-[0.8125rem] leading-snug text-muted">{s.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- EVIDENCE */}
        <section className="relative bg-ink-900 py-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Chapter
                n="03"
                label="Evidence"
                title="Unknown is a value. It never scores."
              />
              <div className="prose-body">
                <p>
                  The single most consequential design decision in the system is that a missing
                  input is not a zero, not an average, and not a hidden default. It is{' '}
                  <code className="font-mono text-[0.85em] text-amber-hot">null</code> with a reason
                  code, and it drops the record into a review band instead of quietly producing a
                  number that looks like knowledge.
                </p>
                <p>
                  Every value in the system carries an evidence mode, and each mode carries the
                  confidence weight it deserves. Stale utility data is nulled rather than shown. A
                  pipeline build date is never promoted into a claim about source freshness. A
                  future-dated source is flagged invalid, not fresh.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 md:pt-7">
              <p className="eyebrow mb-5">Evidence modes and their confidence weight</p>
              <SpecTable
                rows={[
                  { k: 'Measured', v: 'Read directly from the source record. Full weight — 1.00' },
                  { k: 'Modeled', v: 'Derived through a documented model. 0.65' },
                  { k: 'Directional', v: 'Indicative only; will not carry a decision. 0.35' },
                  { k: 'Demo', v: 'Illustrative. Contributes nothing — 0.00' },
                  { k: 'Unavailable', v: 'Source could not be resolved. Contributes nothing — 0.00' },
                ]}
                dense
              />
              <p className="mt-6 max-w-[52ch] text-[0.8125rem] leading-relaxed text-muted">
                Unresolved gates contribute zero confidence <em>and</em> zero suitability, and the
                weight they took with them is reported back as an explicit audit figure rather than
                being silently redistributed across the gates that did resolve.
              </p>

              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-4">Freshness, enforced</p>
                  <p className="text-[0.9375rem] leading-relaxed text-paper-dim">
                    Grid hosting-capacity data is only allowed to populate a parcel when the record
                    was measured at the nearest line section <em>and</em> is inside its 45-day
                    service-level window. Outside it, the field goes null and the method becomes an
                    unavailable-source clock with a human-readable reason.
                  </p>
                </div>
                <div>
                  <p className="eyebrow mb-4">No double-counting</p>
                  <p className="text-[0.9375rem] leading-relaxed text-paper-dim">
                    The land-use component deliberately excludes every permit-derived signal,
                    because permit activity is already scored in a separate readiness component.
                    Weights re-normalise over whichever components actually have data, so the
                    composite can never reward the same permit rows twice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- UNDERWRITING */}
        <section className="relative border-t border-[var(--line)] bg-ink-850 py-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Chapter n="04" label="Underwriting" title="Screening is not approval." />
              <div className="prose-body">
                <p>
                  Nine weighted gates, summing to a hundred points, resolve a site into one of four
                  states. A fatal failure forces a screen-out no matter how well the rest scores. An
                  unresolved fatal gate forces a hold. Confidence below seventy caps you at
                  conditional advance.
                </p>
                <p>
                  Candidate ranking then sorts by decision state <em>first</em> — then fatal
                  failures, then material failures, then unresolved weight, and only then by score.
                  That ordering is the point: it is structurally impossible for a
                  high-scoring screened-out site to outrank a viable one.
                </p>
                <p>
                  Site identity itself is a gate. It is not satisfied by an address string matching;
                  it requires the parcel match to be a containing point, exactly one matched parcel
                  feature whose identifier equals the assessor parcel number, and the official
                  address point to agree with the site coordinate to within{' '}
                  <span className="tnum font-mono text-[0.85em] text-amber-hot">1e-8</span> degrees.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 md:pt-7">
              <p className="eyebrow mb-5">The nine gates</p>
              <SpecTable
                rows={[
                  { k: 'Legal use · 16', v: 'Does the zoning actually permit the operation' },
                  { k: 'Utility · 16', v: 'Is there grid capacity to charge the fleet' },
                  { k: 'Fleet capacity · 14', v: 'Does the site hold the vehicle count' },
                  { k: 'Site control · 14', v: 'Is there a realistic path to control it' },
                  { k: 'Budget · 10', v: 'Does the basis survive the operator’s envelope' },
                  { k: 'Identity · 8', v: 'Is this provably the parcel we think it is' },
                  { k: 'Yard geometry · 8', v: 'Can vehicles actually circulate' },
                  { k: 'Access · 7', v: 'Routing, restrictions, deadhead' },
                  { k: 'Environmental · 7', v: 'Screens that can kill a deal late' },
                ]}
                dense
              />
              <div className="mt-8 flex flex-wrap gap-2">
                {['Screen out', 'Hold for diligence', 'Conditional advance', 'Advance'].map((s, i) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-3.5 py-1.5 font-mono text-[0.6875rem] tracking-[0.05em] text-paper-dim"
                  >
                    <span
                      className="size-[5px] rounded-full"
                      style={{
                        background: ['#7C8CA0', '#7C8CA0', '#E0A22C', '#F7CD77'][i],
                      }}
                    />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- MAP */}
        <section className="relative bg-ink-900 py-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Chapter n="05" label="The map" title="Network timing must not decide what you see." />
            </div>
            <div className="prose-body md:col-span-7 md:pt-7">
              <p>
                The workbench renders more than a hundred map layers — 109 typed layer
                specifications over a set of shared sources — and several of them are multi-megabyte
                GeoJSON assets that land whenever the network delivers them. In the naive
                implementation, whichever asset arrives last paints on top, so the same site can
                look different on two loads.
              </p>
              <p>
                So the stack is reconciled rather than appended. Every layer is declared once in one
                ordered canonical array; new layers insert relative to the next already-mounted
                canonical identifier; and the entire stack is re-sorted whenever an async asset
                arrives. Broad context layers are additionally pinned beneath the basemap&rsquo;s own
                road and place labels, so geography never buries its own names.
              </p>
              <p>
                Two details I am fond of. First,{' '}
                <strong>geographic scope is a compile-time contract</strong>: layer and mode
                availability live in tables closed with a TypeScript{' '}
                <code className="font-mono text-[0.85em] text-amber-hot">satisfies</code> clause, so
                adding a layer without declaring which markets it is valid in is a build failure —
                and switching markets projects the user&rsquo;s visibility rather than mutating it,
                so one city can never render or cite another city&rsquo;s evidence. Second, the
                basemap has a three-tier fallback ending in an inline offline style, because a
                blocked CDN should degrade to a working dark map with every bundled layer still
                attached, not to a dead black rectangle.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- DEPTH */}
        <section className="relative border-t border-[var(--line)] bg-ink-850 py-[13vh]">
          <div className="shell">
            <Chapter n="06" label="Depth" title="What one candidate site actually carries." />
            <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
              <Reveal>
                <Figure value="1,354" caption="San Francisco parcels individually screened for grid power and deadhead distance" />
              </Reveal>
              <Reveal delay={110}>
                <Figure value="39" caption="Distinct public-record enrichment feeds joined onto every candidate site" />
              </Reveal>
              <Reveal delay={220}>
                <Figure value="12" caption="Candidates that survive screening and carry full underwriting" />
              </Reveal>
            </div>

            <Reveal className="mt-14">
              <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-paper-dim">
                Those thirty-nine feeds are not a data dump. Each one runs the same house pattern
                end to end — a fetch or derive script, JSON keyed by site identifier, a typed facts
                interface, a dedicated panel component, and a row in both the coverage ledger and
                the methodology ledger — which is why there are forty facts panels in the product
                and no orphaned datasets behind them. Grid hosting capacity, zoning, census
                demographics, occupational wage, fire and EMS response, pavement condition, curb
                parking, truck restrictions, sensitive receptors, environmental screens.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------- COPILOT */}
        <section className="relative bg-ink-900 py-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Chapter n="07" label="The copilot" title="Grounded, or it refuses." />
            </div>
            <div className="prose-body md:col-span-7 md:pt-7">
              <p>
                There is a research agent inside the workbench. It runs a read-only tool loop over
                the product&rsquo;s own data — workbench context, candidate search, site briefs,
                operator facilities, market summaries, data limitations — plus live intel and hosted
                web search, bounded to eight tool rounds and force-finalised after five data rounds.
              </p>
              <p>
                The rule it lives under is the same rule the rest of the system lives under: a reply
                is checked for real tool evidence, and without it the agent falls back to a safe
                ungrounded response rather than improvising. Citations are derived mechanically from
                the tool calls that actually happened, not written by the model.
              </p>
              <p>
                It is also budgeted like something that runs in production — capped body size,
                per-principal and per-IP rate limits, and a token-cost ceiling whose units are
                deliberately decoupled from billing prices, so renaming a model can never silently
                disable the guardrail. Limiter keys are hashes; no raw user identifier, access
                token, or IP is retained.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ AUTONOMY */}
        <section className="relative border-t border-[var(--line)] bg-ink-850 py-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Chapter n="08" label="Autonomy" title="It keeps itself current." />
              <div className="prose-body">
                <p>
                  Four scheduled pipelines run without anyone present. They pull from public
                  sources, validate what comes back, snapshot the raw response into an append-only
                  archive with a diff log, and commit the result. Two machine identities appear in
                  the commit history alongside mine, which is the honest way to describe a
                  repository that partly maintains itself.
                </p>
                <p>
                  Above them sits a scheduled analyst agent that runs daily in an isolated worktree,
                  sweeps ten defined work lanes, ships one change end to end, and promotes its own
                  release through a written gate: clean detached main, exactly one commit, checks
                  run against committed bytes only, re-fetch before push, never force-push, poll for
                  the exact commit hash, and confirm the deployment health endpoint uncached.
                </p>
                <p>
                  Its memory is deliberately not conversational. It writes a staged backlog, a skill
                  registry with dated evolution decisions, and a run note per day. Six of the ten
                  recorded skill decisions are deliberate <em>no change</em> or <em>defer</em>{' '}
                  entries, with written reasoning about context cost — which I consider the strongest
                  evidence the thing is actually thinking rather than accumulating.
                </p>
              </div>
            </div>
            <div className="md:col-span-7 md:pt-7">
              <p className="eyebrow mb-5">What is checked, and by whom</p>
              <SpecTable
                rows={[
                  { k: 'Test suite', v: 'There is no npm test and no CI gate. 44 domain check scripts are the suite, and local validation is the only thing standing between a change and production.' },
                  { k: 'Source rights', v: 'Every source carries a rights decision; an expired or revoked one fails the build rather than degrading quietly.' },
                  { k: 'Temporal integrity', v: 'Evidence cannot claim a validity window it does not have. Inverted or future-dated records are rejected.' },
                  { k: 'Entity resolution', v: 'A mapped facility clue is never allowed to be restated as a physical facility.' },
                  { k: 'Staleness', v: 'A monitored registry of source artefacts with per-source age limits and a due-ratio threshold.' },
                  { k: 'Publication', v: 'Datasets are hash-addressed behind a manifest pointer that is replaced last, so the app can never advertise a half-built pair.' },
                ]}
                dense
              />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- GOVERNANCE */}
        <section className="relative bg-ink-900 py-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Chapter
                n="09"
                label="The operating system"
                title="What the agents are not allowed to do."
              />
            </div>
            <div className="prose-body md:col-span-7 md:pt-7">
              <p>
                Alongside the product sits a small second repository that does nothing but govern
                how machine work is delegated. It holds no application code — it is registries,
                policies, schemas and evaluations, and it is machine-checked on every change.
              </p>
              <p>
                Routing happens <strong>before</strong> any model reasoning. A deterministic router
                classifies the task, selects one specialist, and resolves exactly which context
                items that specialist may read — returning a three-way split of readable items,
                metadata-only items, and blocked items, each blocked one carrying a named
                machine-readable reason. Specialists then launch as no-tool subagents in a fresh,
                non-resumed context that can see nothing but a signed packet.
              </p>
              <p>
                The packet is where the design earns its keep. It embeds a revision hash computed
                over every registry, so editing any of them invalidates every outstanding packet.
                And validation refuses to trust the packet&rsquo;s own claims: it re-runs the router
                live and byte-compares the result. A packet whose two revision strings match each
                other but are stale is rejected. A packet that quietly appends one extra source
                grant on a current revision is also rejected — because the freshly derived route
                does not contain it.
              </p>
              <p>
                Above all of it is a four-verb human boundary —{' '}
                <strong>send, spend, sign, release</strong> — declared once, derived mechanically,
                and enforced in code rather than requested in prose. Approvals bind to a hash of the
                exact payload, so a changed recipient or amount invalidates the approval. A producer
                can never review its own work.
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- GOV FIGURES */}
        <section className="relative border-y border-[var(--line)] bg-ink-850">
          <div className="shell grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-4">
            {[
              { v: '78', c: 'Pinned routing cases, plus adversarial registry mutations that must fail closed' },
              { v: '23', c: 'Adversarial safety evaluations — 20 of them required rejections' },
              { v: '24', c: 'Machine-enforced schemas across the control plane' },
              { v: '13', c: 'Specialist agents, each with no tools and no inherited context' },
            ].map((f, i) => (
              <Reveal key={f.v} delay={i * 90}>
                <Figure value={f.v} caption={f.c} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- CLOSING */}
        <section className="relative bg-ink-900 py-[14vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Chapter n="10" label="What it taught me" title="Rigour is a feature you can ship." />
            </div>
            <div className="prose-body md:col-span-7 md:pt-7">
              <p>
                The instinct on a project this size is to defer the discipline — get the map
                working, make the numbers look right, add provenance later. That order does not
                work. Provenance is not a layer you can retrofit; it is a property of how each value
                was constructed, and once a value has been through three derivations without
                carrying its source, the information is gone.
              </p>
              <p>
                The second lesson is that constraints written in prose do not hold. Every rule in
                this system that actually survived contact with a deadline is one that fails a
                build, fails a check, or fails a schema. The rules that lived in documentation got
                broken — including by me.
              </p>
              <p>
                Both of those transfer directly to diligence work. The question I ask of a target&rsquo;s
                AI claims now is not whether the model is good. It is: what happens here when an
                input is missing, and who finds out?
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <ArrowLink href="/agentic-os">The operating system behind this</ArrowLink>
                <ArrowLink href="/">Back to the index</ArrowLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
