import type { ReactNode } from 'react'

/**
 * Every figure on this site is measured from something on disk. Where a number
 * appears, the note says how it was counted.
 */

export const PRACTICE = [
  {
    index: '01',
    title: 'AI due diligence',
    body:
      'Working out whether an AI claim survives contact with the model, the data behind it, and the org that has to run it. The interesting question is rarely whether the technology works — it is what the business would have to be true for the value to land.',
    points: [
      'Model, data, and infrastructure maturity in a deal context',
      'Separating demonstrated capability from roadmap',
      'Technical risk written so a deal team can price it',
    ],
  },
  {
    index: '02',
    title: 'AI value creation',
    body:
      'The other side of the same question, after close. Which processes actually change, what the change is worth, what has to be rebuilt to get it, and how long before it shows up in the numbers rather than the narrative.',
    points: [
      'Workflow-level opportunity mapping, not tool inventories',
      'Value cases tied to a measurable operating metric',
      'Sequencing: what is buildable now versus what needs data first',
    ],
  },
  {
    index: '03',
    title: 'Agentic tooling, internally',
    body:
      'Building the agent workflows the team uses on its own work, and — more usefully — writing down how to do it. I ran a session for my group on agent instruction files: how to make delegated work reproducible instead of impressive once.',
    points: [
      'Internal agent workflows for research and analysis',
      'AGENTS.md / CLAUDE.md conventions as a shared standard',
      'An enablement session delivered to the full group',
    ],
  },
] as const

/** Radar spec rows for the homepage summary. All counts verified on disk. */
export const RADAR_SPEC: { k: string; v: ReactNode }[] = [
  { k: 'Scope', v: 'Sourcing, diligence, underwriting and dossier generation for autonomous-fleet depots' },
  { k: 'Surface', v: '33 page routes · 34 API handlers · a gated geospatial workbench' },
  { k: 'Codebase', v: '189,323 lines of TypeScript across 574 files' },
  { k: 'Data', v: '230,553 GeoJSON features · 898 data files · 44 automated integrity checks' },
  { k: 'Autonomy', v: 'Four cron pipelines that fetch, validate and commit fresh data on their own' },
  { k: 'Role', v: 'Design and engineering, end to end' },
]

type Project = {
  title: string
  body: string
  stack: string[]
  note?: string
  href?: string
  hrefLabel?: string
}

export const PROJECTS: Project[] = [
  {
    title: 'Polymarket trading stack',
    body:
      'Three generations of Python agents for prediction markets, roughly 17,000 lines. The engineering is the point: a separate risk engine and ledger, paper-versus-live parity tests, a websocket feed, a physical kill-switch file, and eleven test modules including evals for the LLM layer. It ran — 167,103 recorded market observations, 78 decisions, 59 executed trades across 33 markets.',
    stack: ['Python', 'CLOB / websockets', 'SQLite', 'LLM evals'],
    note: 'Private',
  },
  {
    title: 'Prediction-market scout',
    body:
      'Scores live prediction markets against a model-derived fair probability, measures divergence from the traded price, and only flags an edge when it clears explicit thresholds on size, confidence and expected value. It ran across 407 markets and stored 424 assessments before the API budget ran out. A second-model consensus gate is built but was never run — so the screen is single-model, and the page says so.',
    stack: ['Python', 'Claude', 'SQLite', 'Divergence scoring'],
    note: 'Private',
  },
  {
    title: 'Neuralese',
    body:
      'A multi-agent trading research platform where four specialists — macro, quant, flow and risk — run on deliberately different cadences and write into one shared probabilistic world model. The risk agent can veto. It is the clearest thing I have built about agent coordination and structured disagreement, rather than about returns.',
    stack: ['Python', 'Multi-agent', 'FRED / market data', 'Provider-agnostic LLM adapter'],
    note: 'Private',
  },
  {
    title: 'GlowAI',
    body:
      'A finished agentic product loop rather than a chat window: baseline analysis, versioned plan generation, image projection through Gemini, weekly check-ins, and persistent memory that revises the plan and will not re-recommend something that already failed.',
    stack: ['Next.js', 'TypeScript', 'Gemini', 'Firebase'],
    note: 'Private',
  },
  {
    title: 'In-browser AR face tracker',
    body:
      'MediaPipe FaceLandmarker running entirely client-side at real-time frame rates, with three reticle styles, configurable EMA smoothing to kill landmark jitter, and live FPS and inference-time telemetry. Three dependencies, no backend, nothing uploaded.',
    stack: ['TypeScript', 'MediaPipe', 'Vite', 'Computer vision'],
    note: 'Private',
  },
  {
    title: 'Newsglide',
    body:
      'A news aggregation and summarisation service built on LLM workflows.',
    stack: ['LLM workflows', 'Web'],
    href: 'https://newsglide.org',
    hrefLabel: 'newsglide.org',
  },
  {
    title: 'American AI Dream',
    body: 'A site supporting American AI initiatives and education.',
    stack: ['Next.js', 'Claude Code'],
    href: 'https://americanaidream.org',
    hrefLabel: 'americanaidream.org',
  },
]

/**
 * Economics. Every position below is one Ben has actually argued in writing;
 * the source is named so nothing here is a borrowed opinion.
 */
export const ECONOMICS = [
  {
    n: '01',
    title: 'Elasticity decides where the unemployment shows up',
    body:
      'A productivity shock does not land evenly. If an industry faces inelastic demand, making its output cheaper does not expand the market much, so the gain arrives as the same output produced by fewer people. Where demand is elastic, cheaper output grows the market and employment can rise alongside productivity. So “will AI cause unemployment” is the wrong question — the elasticity is the parameter that decides, and it has a different value in every sector. Estimating it sector by sector is the actual work, and it is mostly not being done.',
    source: 'The through-line in how I read AI and labour',
  },
  {
    n: '02',
    title: 'The studies measure a floor, not a ceiling',
    body:
      'The credible causal work on AI and productivity is real and I accept it. But it studies suggestion-style tools from an earlier model generation, so the effect it identifies is a lower bound on what current systems do. Agentic systems move the question from “does this complement labour?” to “where does it substitute?” — and complement and substitute are not opinions about AI, they are empirical claims about a particular labour market.',
    source: 'My section of a labour economics presentation — “The Floor, Not the Ceiling”',
  },
  {
    n: '03',
    title: 'Slower than I expected, and still a fast takeoff',
    body:
      'I have been wrong on timing. Agents have arrived more slowly than I predicted, and I think the honest read is that the lag is in diffusion — org design, trust, procurement, who is allowed to approve what — rather than in capability. That distinction matters, because a capability overhang that adoption has not absorbed yet is not a reason to expect a gentle transition. I still think we are in a fast takeoff and that the economic change will be drastic; I have just stopped being confident about the quarter it shows up in.',
    source: 'A stated view, and a revised one',
  },
  {
    n: '04',
    title: 'Grade your own evidence before someone else does',
    body:
      'When I ran the analysis on whether AV-adjacent industrial property was actually repricing, most of my own results came back low confidence, my synthetic control was probably overfit, and one significant coefficient rested on too little data to interpret. I wrote all of that down next to the findings. An estimate without a confidence tier and a falsification condition is a decoration.',
    source: 'Self-directed difference-in-differences memo',
  },
] as const

export const HACKATHONS = [
  {
    name: 'Anthropic × Penn',
    meta: 'November 2025 · Track 1, Agentic & MCP · with Adam Peles',
    result: 'Semi-finalist',
    what:
      'Rather than build one project, we built the system that builds projects: five packaged Claude Skills and an orchestrator delegating to four domain builder sub-agents. It produced 36 complete projects — 411 files, 25,024 lines — and I wrote the rubric evaluator that scored twelve of them against the official judging criteria, plus the gallery the judges browsed them in.',
    stack: ['Claude Skills', 'Orchestration', 'Python', 'Flask'],
  },
  {
    name: 'Cook with Cursor',
    meta: 'June 2026 · New York Tech Week · a build session, not a competition',
    result: 'Build day',
    what:
      'Cursor’s NY Tech Week morning at The Malin. No tracks and no judging — you turn up and build. I spent it on a cross-venue arbitrage scanner for esports binary markets: pull active markets from two venues, normalise the claim types, fuzzy-match equivalents, read top of book, compute both hedge directions, and subtract fee and latency buffers before anything counts as a candidate. Read-only by default; every candidate needs a human to approve the settlement rules.',
    stack: ['Python', 'Polymarket API', 'Kalshi API', 'pytest'],
  },
] as const

export const EXPERIENCE = [
  {
    period: 'Jun — Aug 2026',
    location: 'New York, NY',
    org: 'PwC Strategy&',
    role: 'Deal Technology Strategy',
    points: [
      'AI due diligence and AI value creation across deal work.',
      'Internal agentic AI tooling; delivered a group-wide session on writing agent instruction files.',
    ],
  },
  {
    period: 'Sep 2025 — Present',
    location: 'Philadelphia, PA',
    org: 'Fingerpaint Group',
    role: 'AI Operations Intern',
    points: [
      'Built and deployed agents for paid-search optimisation and media-brief generation using Claude Code and Claude Skills, Gemini 3, and Antigravity.',
      'Mapped end-to-end marketing workflows, identified the high-leverage automation points, and defined KPIs — time-to-brief, campaign performance, error rates — to hold the work accountable.',
    ],
  },
  {
    period: 'Sep 2025 — Present',
    location: 'Remote',
    org: 'Etienne Lane VC',
    role: 'Venture Capital Fellow',
    points: [
      'Built agent swarms that replicate the intern workflow: sourcing CPG and creator-led startups, scraping data, and synthesising one-pagers and investment briefs for partners.',
      'Deployed sourcing and scheduling agents that identify promising founders, draft personalised outreach, and set up intro calls — widening top-of-funnel while freeing the intern class for deeper diligence.',
    ],
  },
  {
    period: 'Jun — Aug 2025',
    location: 'New York, NY',
    org: 'GradeWiz  (YC-backed)',
    role: 'Student Success Engineer',
    points: [
      'Led the NYC private-school growth initiative: ran pilots in five schools end to end, documented results and teacher feedback, and signed two clients.',
      'Shipped system improvements that cut latency and raised scoring agreement — prompt and rubric templates, OCR cleanup, LangChain batching and caching, and instrumented evaluation metrics built with the research team.',
    ],
  },
  {
    period: 'May — Aug 2025',
    location: 'New York, NY',
    org: 'Cornick, Garber & Sandler',
    role: 'Summer Analyst',
    points: [
      'Prepared individual and partnership filings, client write-ups and audit-prep packets for HNW clients; reconciled statements and standardised workpapers.',
      'Mapped the return-prep workflow and piloted agentic automations — document intake to extraction to draft schedules — in n8n and React, with human-in-the-loop controls and audit trails, cutting manual entry and turnaround by up to 80% in practice.',
    ],
  },
  {
    period: 'Sep 2024 — Present',
    location: 'Philadelphia, PA',
    org: 'Education Consulting at Penn',
    role: 'Co-Founder & President',
    points: [
      'Founded and scaled a 40+ member consulting group working on education equity through data-driven strategy and grassroots outreach.',
      'Led a nonprofit turnaround that raised membership 75%; ran an event series with SpaceX’s Ad Astra program drawing 60+ participants.',
    ],
  },
] as const
