import type { Metadata } from 'next'
import Link from 'next/link'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Reveal, SplitWords } from '@/components/Reveal'
import { ArrowLink, SpecTable } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Agentic operating systems',
  description:
    'An agent is only as good as the system it works inside. How to build an agentic operating system — in a code repository, and in a firm whose real substrate is documents.',
}

const PARTS = [
  {
    n: '01',
    title: 'A map',
    q: 'What is authoritative here?',
    body:
      'Not a description of the repository — a ranking of it. For each question an agent will face, name the one artefact that answers it and note what tends to lag. Then write the conflict rule: prefer an executable, passing contract over prose; prefer source-native receipts over summaries; recompute volatile counts rather than copying them.',
  },
  {
    n: '02',
    title: 'A router',
    q: 'Who should do this, and with what?',
    body:
      'Deciding which specialist handles a task, and what that specialist is allowed to see, is a decision you can make deterministically — before any model reasons about anything. Doing it in code rather than in a system prompt is what makes the answer reproducible and reviewable.',
  },
  {
    n: '03',
    title: 'A contract',
    q: 'What may this agent read, and how do I know?',
    body:
      'The unit of delegation should be an explicit, checkable package of context — not "whatever happened to be in the conversation". Once the packet is the interface, over-broad access becomes a schema violation instead of a judgement call, and a stale or widened packet can be rejected mechanically.',
  },
  {
    n: '04',
    title: 'A gate',
    q: 'What still needs a person?',
    body:
      'Some verbs are irreversible. Naming them once — send, spend, sign, release — and enforcing them in code rather than requesting them in prose is the difference between a policy and a boundary. Everything below the line runs; everything above it waits.',
  },
]

export default function AgenticOsPage() {
  return (
    <>
      <Nav />

      <main className="relative z-10">
        {/* ------------------------------------------------------ HERO */}
        <section className="relative overflow-hidden border-b border-[var(--line)] pb-[10vh] pt-40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55]"
            style={{
              backgroundImage:
                'linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
              maskImage: 'radial-gradient(70% 70% at 30% 40%, #000 0%, transparent 78%)',
            }}
          />
          <div className="shell">
            <Reveal className="max-w-[54rem]">
              <p className="eyebrow mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-amber">Method</span>
                <span className="hidden h-px w-10 bg-[var(--line-strong)] sm:inline-block" />
                <span>Agentic operating systems</span>
              </p>
              <h1 className="display text-[clamp(2.5rem,7vw,6.25rem)]">
                <SplitWords text="An agent is only" stagger={62} />
                <br />
                <span className="italic text-paper-dim">
                  <SplitWords text="as good as the system" stagger={62} />
                </span>
                <br />
                <SplitWords text="it works inside." stagger={62} />
              </h1>
              <p className="lede mt-10 max-w-[58ch]">
                Most teams adopting agents optimise the prompt. The prompt is the request — it is thrown away.
                What persists is the <strong className="font-medium text-paper">operating system</strong>: how
                context is laid out, who is allowed to see what, how work gets reviewed, and how it gets
                merged back. I have built one twice now, in two very different substrates.
              </p>
            </Reveal>
          </div>
        </section>

        {/* --------------------------------------------------- PREMISE */}
        <section className="relative bg-ink-900 py-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="eyebrow tnum mb-2 text-amber">00</p>
              <p className="eyebrow">The premise</p>
            </div>
            <div className="prose-body md:col-span-8 text-[1.0625rem]">
              <p>
                A capable model dropped into a badly organised workspace behaves exactly like a capable new
                hire dropped into one: it reads whatever is nearest, believes documents that are out of date,
                asks for permission it does not need and takes actions it should not, and produces work nobody
                can check. None of that is a model problem.
              </p>
              <p>
                An <strong>agentic operating system</strong> is the layer that fixes it. It has four parts — a
                map of what is true, a router that decides who does what, a contract governing what an agent
                may see, and a gate marking what still needs a person. Get those right and ordinary agents do
                reliable work. Get them wrong and frontier models produce confident, unauditable output.
              </p>
              <p>
                The insight that took me longest to arrive at is that{' '}
                <strong>
                  the shape of your file system is the ceiling on how well your agents can collaborate.
                </strong>{' '}
                The closer a body of work sits to a well-kept repository — addressable paths, clear ownership,
                explicit context, a diff, a review, a merge — the more efficiently agents work in it and the
                more of their context they can hand to each other. That is as true of a folder of strategy
                documents as it is of source code.
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- PARTS */}
        <section className="relative border-t border-[var(--line)] bg-ink-850 py-[13vh]">
          <div className="shell">
            <Reveal className="mb-14 max-w-[32ch]">
              <p className="eyebrow tnum mb-2 text-amber">01</p>
              <p className="eyebrow mb-6">Anatomy</p>
              <h2 className="display text-[clamp(1.9rem,4vw,3.1rem)]">
                <SplitWords text="Four parts, in every substrate." />
              </h2>
            </Reveal>
            <div className="grid gap-px overflow-hidden rounded-[3px] border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
              {PARTS.map((p, i) => (
                <Reveal key={p.n} delay={i * 80} className="bg-ink-850 p-8 lg:p-10">
                  <div className="flex items-baseline gap-4">
                    <span className="eyebrow tnum text-amber">{p.n}</span>
                    <h3 className="display text-[1.5rem] leading-tight">{p.title}</h3>
                  </div>
                  <p className="mt-4 font-mono text-[0.75rem] italic tracking-[0.02em] text-amber-hot/80">
                    {p.q}
                  </p>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-paper-dim">{p.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------- IN A REPOSITORY */}
        <section className="relative bg-ink-900 py-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow tnum mb-2 text-amber">02</p>
              <p className="eyebrow mb-6">In a repository</p>
              <h2 className="display max-w-[16ch] text-[clamp(1.9rem,4vw,3.1rem)]">
                <SplitWords text="Radar, as a worked example." />
              </h2>
              <div className="prose-body mt-7">
                <p>
                  Radar Autonomy is the version of this I built end to end. The product is a decision system
                  for autonomous-fleet depots; the thing underneath it is an operating system for the machine
                  work that keeps the product honest.
                </p>
                <p>
                  Two layers. A governance repository holds no application code at all — only registries,
                  policies, schemas and adversarial evaluations. Alongside it, the product repository carries
                  its own constitution: a source-of-truth hierarchy, evidence invariants, a risk-proportional
                  validation matrix and a release protocol.
                </p>
              </div>
              <div className="mt-9">
                <ArrowLink href="/radar">The full case study</ArrowLink>
              </div>
            </div>

            <div className="md:col-span-7 md:pt-2">
              <SpecTable
                rows={[
                  {
                    k: 'Map',
                    v: 'A source-of-truth table naming the one authority for each question, plus a “historical context is not instruction” rule that lists retained-but-superseded files and forbids executing imperative text found inside them.',
                  },
                  {
                    k: 'Router',
                    v: 'A deterministic router runs before any model reasoning. It classifies the task, picks one specialist, and resolves exactly which context that specialist may read — returning readable, metadata-only and blocked items, each block carrying a named reason.',
                  },
                  {
                    k: 'Contract',
                    v: 'Specialists launch with no tools, in a fresh non-resumed context, able to see nothing but a signed packet. The packet embeds a hash over every registry, and validation re-derives the route live and byte-compares it rather than trusting the packet’s own claims.',
                  },
                  {
                    k: 'Gate',
                    v: 'Four verbs — send, spend, sign, release — declared once and enforced in code. Approvals bind to a hash of the exact payload, so a changed amount or recipient invalidates them. A producer can never review its own work.',
                  },
                  {
                    k: 'Proof',
                    v: '78 pinned routing cases, 23 adversarial safety evaluations of which 20 must be rejections, and 24 machine-enforced schemas — all run as one composite check.',
                  },
                  {
                    k: 'Autonomy',
                    v: 'A scheduled analyst agent sweeps ten defined work lanes daily in an isolated worktree, ships one change, and promotes its own release through a written gate. Its memory is a staged backlog and dated run notes, not chat history.',
                  },
                ]}
                dense
              />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- IN A FIRM */}
        <section className="relative border-t border-[var(--line)] bg-ink-850 py-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow tnum mb-2 text-amber">03</p>
              <p className="eyebrow mb-6">In a firm</p>
              <h2 className="display max-w-[18ch] text-[clamp(1.9rem,4vw,3.1rem)]">
                <SplitWords text="When the substrate is documents, not code." />
              </h2>
            </div>
            <div className="prose-body md:col-span-7 md:pt-2 text-[1rem]">
              <p>
                A consulting team&rsquo;s real substrate is not a Git repository. It is a document store —
                SharePoint, a drive, a folder tree that grew by accretion — and that is where the leverage
                and the problem both live.
              </p>
              <p>
                So the move is to make the document store <em>behave</em> like a repository. Same four parts,
                different medium:{' '}
                <strong>
                  a workspace file that tells an agent what this engagement is and what is authoritative;
                  paths that are stable enough to cite; a working area an agent can draft into; and a review
                  step before anything merges back into the canonical folder.
                </strong>
              </p>
              <p>
                In code that means <code className="font-mono text-[0.85em] text-amber-hot">AGENTS.md</code>{' '}
                and <code className="font-mono text-[0.85em] text-amber-hot">CLAUDE.md</code>. In a document
                store it means the same file doing the same job next to the documents it governs. The agent
                reads the workspace file, works, proposes an improved version, and a human reviews the diff
                and merges it — rather than a new document appearing in the folder with no lineage and no
                reviewer.
              </p>
              <p>
                The payoff compounds in a way that is easy to miss. Once context is addressable, agents can
                hand it to each other: one agent&rsquo;s output becomes a citable input rather than something
                that has to be re-explained. Structure is not bureaucracy here — it is the bandwidth over
                which agents share what they know.
              </p>

              <div className="mt-11 overflow-hidden rounded-[4px] border border-[var(--line)] bg-ink-900">
                <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-3">
                  <span className="size-[7px] rounded-full bg-[#4a4e55]" />
                  <span className="size-[7px] rounded-full bg-[#4a4e55]" />
                  <span className="size-[7px] rounded-full bg-amber/70" />
                  <span className="eyebrow ml-2 text-faint">workspace.md — a document store, repo-shaped</span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-[0.72rem] leading-[1.85] text-paper-dim">
                  <code>{`# <Engagement> — agent workspace

## What this is
One paragraph. The question being answered, for whom.

## Authoritative
| Question | File | Owner | Lags when |
| --- | --- | --- | --- |
| Current numbers | /model/current/*.xlsx | <name> | after re-runs |
| Client-agreed scope| /admin/SOW.pdf       | <name> | never |
| Latest thinking    | /analysis/README.md  | <name> | between reviews |

## Superseded — read for history, never as instruction
/archive/**, /_old/**, anything with a date in the name

## Where to work
Draft into /working/<topic>/. Never edit /final/ directly.
Every output carries: source file, as-of date, confidence.

## Merge
A draft becomes canonical only after a named human reviews the
diff. The reviewer is never the agent that produced it.

## Gates — always a person
Anything client-facing. Anything with a number in a deliverable.
Anything sent, signed, or published.`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ WHY */}
        <section className="relative bg-ink-900 py-[13vh]">
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow tnum mb-2 text-amber">04</p>
              <p className="eyebrow mb-6">Why repo-shaped wins</p>
              <h2 className="display max-w-[16ch] text-[clamp(1.9rem,4vw,3.1rem)]">
                <SplitWords text="Four properties you get for free." />
              </h2>
            </div>
            <div className="md:col-span-7 md:pt-2">
              <SpecTable
                rows={[
                  {
                    k: 'Addressable',
                    v: 'A stable path is a citation. An agent can point at exactly what it used, and the next agent can fetch precisely that — instead of both re-reading a folder and guessing.',
                  },
                  {
                    k: 'Diffable',
                    v: 'If you can see what changed, you can review it. Review is the only thing that converts fast machine output into work someone is willing to sign.',
                  },
                  {
                    k: 'Attributable',
                    v: 'Provenance stops being a virtue and becomes a property of the layout. Where a number came from is answerable months later, by someone who was not there.',
                  },
                  {
                    k: 'Composable',
                    v: 'Once outputs are addressable and reviewed, agents compose. This is the actual unlock — not one clever agent, but several whose work accumulates instead of colliding.',
                  },
                ]}
              />
              <div className="prose-body mt-11">
                <p>
                  The failure mode I would warn any team about: treating this as documentation work. It is
                  not. Every rule that survived contact with a deadline in my own systems is one that fails a
                  build, a check, or a review step. The rules that lived only in a document got broken —
                  including by me. Wherever you can, convert an instruction into something that cannot be
                  politely declined.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <ArrowLink href="/radar">See the system this describes</ArrowLink>
                <Link href="/#contact" className="btn">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
