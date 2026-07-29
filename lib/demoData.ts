/**
 * Real data, lifted from the projects it belongs to.
 *
 * Nothing here is invented. Site figures come from Radar Autonomy's SF
 * candidate registry and its PG&E hosting-capacity and deadhead joins; the
 * prediction-market rows are actual stored assessments from the scout's
 * SQLite database; the rubric scores are the evaluator's own output.
 *
 * Where a field is null it is null in the source too — that is the point.
 */

// ---------------------------------------------------------------- RADAR

export type RadarSite = {
  id: string
  address: string
  group: string
  availableSf: number
  /** $/sf/yr asking rent. null where no rent is published. */
  askingRent: number | null
  zoning: string
  yard: boolean
  /** Measured PG&E hosting capacity at the nearest line section, kW. */
  hostingKw: number | null
  /** Modelled deadhead cost, $/vehicle/day. */
  deadheadUsd: number | null
}

export const RADAR_SITES: RadarSite[] = [
  { id: 'mckinnon-2000', address: '2000 McKinnon Ave', group: 'Prime', availableSf: 242498, askingRent: 12, zoning: 'PDR-2', yard: true, hostingKw: 139, deadheadUsd: 9.86 },
  { id: 'napoleon-180', address: '180–200 Napoleon St', group: 'Prime', availableSf: 85003, askingRent: 26.4, zoning: 'PDR-2', yard: true, hostingKw: 138, deadheadUsd: 8.38 },
  { id: 'newcomb-2025', address: '2025–2035 Newcomb Ave', group: 'Prime', availableSf: 32000, askingRent: 19.8, zoning: 'PDR-2', yard: true, hostingKw: 0, deadheadUsd: 10.01 },
  { id: 'marin-2575', address: '2575 Marin St', group: 'Prime', availableSf: 27000, askingRent: 18, zoning: 'PDR-2', yard: true, hostingKw: 205, deadheadUsd: 8.12 },
  { id: 'jerrold-2225', address: '2225 Jerrold Ave', group: 'Prime', availableSf: 98614, askingRent: 25.8, zoning: 'PDR-2', yard: true, hostingKw: 0, deadheadUsd: 8.86 },
  { id: 'toland-450', address: '450 Toland St', group: 'Prime', availableSf: 90000, askingRent: 15, zoning: 'PDR-2', yard: false, hostingKw: 139, deadheadUsd: 8.96 },
  { id: 'toland-201', address: '201 Toland St', group: 'Prime', availableSf: 64000, askingRent: 7.44, zoning: 'PDR-2', yard: false, hostingKw: 0, deadheadUsd: 9.15 },
  { id: 'oakdale-1900', address: '1900 Oakdale Ave', group: 'Prime', availableSf: 66000, askingRent: 18.3, zoning: 'PDR-1-B', yard: false, hostingKw: 0, deadheadUsd: 10.56 },
  { id: 'third-3150', address: '3150 3rd St', group: 'Prime', availableSf: 51597, askingRent: null, zoning: 'PDR-2', yard: false, hostingKw: 1482, deadheadUsd: 9.44 },
  { id: 'carroll-1300', address: '1300 Carroll Ave', group: 'Non-prime', availableSf: 121097, askingRent: 10.8, zoning: 'PDR-2', yard: true, hostingKw: null, deadheadUsd: null },
  { id: 'armstrong-1313', address: '1313 Armstrong Ave', group: 'Non-prime', availableSf: 74923, askingRent: 15, zoning: 'PDR-2', yard: true, hostingKw: 255, deadheadUsd: 14.53 },
  { id: 'third-6025', address: '6025 3rd St', group: 'Non-prime', availableSf: 94304, askingRent: null, zoning: 'PDR-2', yard: true, hostingKw: 207, deadheadUsd: 13.92 },
]

export type GateId =
  | 'site-identity'
  | 'fleet-capacity'
  | 'budget'
  | 'legal-use'
  | 'utility-capacity'
  | 'yard-geometry'
  | 'access-routing'

/** The production weights. Site control (14) and environmental (7) are not
 *  evaluated here, so the reachable total is 79 of 100 — shown, not hidden. */
export const GATE_WEIGHTS: Record<GateId, number> = {
  'legal-use': 16,
  'utility-capacity': 16,
  'fleet-capacity': 14,
  budget: 10,
  'site-identity': 8,
  'yard-geometry': 8,
  'access-routing': 7,
}

export const GATE_SEVERITY: Record<GateId, 'fatal' | 'material'> = {
  'legal-use': 'fatal',
  'utility-capacity': 'fatal',
  'fleet-capacity': 'fatal',
  budget: 'fatal',
  'site-identity': 'material',
  'yard-geometry': 'material',
  'access-routing': 'material',
}

export const GATE_LABEL: Record<GateId, string> = {
  'legal-use': 'Legal use',
  'utility-capacity': 'Utility capacity',
  'fleet-capacity': 'Fleet capacity',
  budget: 'Budget',
  'site-identity': 'Site identity',
  'yard-geometry': 'Yard geometry',
  'access-routing': 'Access & routing',
}

export const GATE_ORDER: GateId[] = [
  'site-identity',
  'legal-use',
  'fleet-capacity',
  'utility-capacity',
  'yard-geometry',
  'access-routing',
  'budget',
]

/** Square feet a parked-and-circulating robotaxi needs, from the real model. */
export const SF_PER_VEHICLE = 400
/** Continuous kW per vehicle assumed for overnight charging. */
export const KW_PER_VEHICLE = 1.5

// ----------------------------------------------------------------- SCOUT

export type ScoutRow = {
  q: string
  cat: string
  /** Model's fair probability. */
  fair: number
  /** Model confidence, 1–10. */
  conf: number
  /** Traded market price at the time of assessment. */
  px: number
  dir: string
}

export const SCOUT_ROWS: ScoutRow[] = [
  { q: 'Will Stephen Miran dissent the next Fed decision?', cat: 'financial', fair: 0.35, conf: 3, px: 0.892, dir: 'BUY_NO' },
  { q: "Will 'Deadline' — BlackPink debut week album sales be under 300k?", cat: 'entertainment', fair: 0.55, conf: 3, px: 0.785, dir: 'BUY_NO' },
  { q: 'Khamenei public appearance by February 21, 2026?', cat: 'geopolitical', fair: 0.55, conf: 4, px: 0.35, dir: 'BUY_YES' },
  { q: "Will MrBeast's next video get under 25 million views on day 1?", cat: 'entertainment', fair: 0.55, conf: 4, px: 0.73, dir: 'BUY_NO' },
  { q: 'Will the Silicon Data H100 Index hit $2.45 by February?', cat: 'tech', fair: 0.55, conf: 3, px: 0.7, dir: 'BUY_NO' },
  { q: 'Will Octane by Don Toliver be the Billboard 200 #1 album?', cat: 'entertainment', fair: 0.15, conf: 3, px: 0.002, dir: 'BUY_YES' },
  { q: 'Will Alberta vote for independence in 2026?', cat: 'politics', fair: 0.01, conf: 9, px: 0.145, dir: 'BUY_NO' },
  { q: 'Tesla and SpaceX merger officially announced by June 30?', cat: 'financial', fair: 0.03, conf: 8, px: 0.145, dir: 'BUY_NO' },
  { q: 'Will the Silicon Data H100 Index hit $1.80 by February?', cat: 'tech', fair: 0.12, conf: 3, px: 0.01, dir: 'NO_EDGE' },
  { q: 'Will the Silicon Data H100 Index hit $2.10 by February?', cat: 'tech', fair: 0.12, conf: 3, px: 0.019, dir: 'BUY_YES' },
  { q: 'Will Rosamund Li get engaged in Bridgerton: Season 4?', cat: 'entertainment', fair: 0.55, conf: 3, px: 0.625, dir: 'BUY_NO' },
  { q: 'Will Occidental Petroleum beat quarterly earnings?', cat: 'financial', fair: 0.55, conf: 4, px: 0.48, dir: 'BUY_YES' },
  { q: 'Will “DtMF — Bad Bunny” be the #1 song on Spotify this week?', cat: 'entertainment', fair: 0.92, conf: 6, px: 0.988, dir: 'BUY_NO' },
  { q: 'Will fewer than 30 tornadoes occur in the US in February?', cat: 'science', fair: 0.62, conf: 5, px: 0.675, dir: 'BUY_NO' },
  { q: 'Will Bangladesh parliamentary turnout be 75–80%?', cat: 'politics', fair: 0.06, conf: 4, px: 0.009, dir: 'BUY_YES' },
  { q: "Will 'Arirang' — BTS debut week sales be 3.5m–4m?", cat: 'entertainment', fair: 0.08, conf: 3, px: 0.034, dir: 'NO_EDGE' },
  { q: 'Will Donald Trump be confirmed to have visited Epstein’s island?', cat: 'politics', fair: 0.08, conf: 7, px: 0.115, dir: 'BUY_NO' },
  { q: 'Anthropic $500B+ valuation in 2026?', cat: 'tech', fair: 0.82, conf: 5, px: 0.845, dir: 'BUY_NO' },
  { q: 'Will the DHS shutdown end between February 28 and March 3?', cat: 'politics', fair: 0.15, conf: 3, px: 0.169, dir: 'NO_EDGE' },
  { q: 'ChatGPT outage by February 21, 2026?', cat: 'tech', fair: 0.97, conf: 9, px: 0.955, dir: 'BUY_YES' },
  { q: 'Will the DHS shutdown last 21 days or more?', cat: 'politics', fair: 0.62, conf: 4, px: 0.625, dir: 'NO_EDGE' },
  { q: 'Will Ordinary by Alex Warren be the Billboard #1 song?', cat: 'entertainment', fair: 0.005, conf: 6, px: 0.001, dir: 'NO_EDGE' },
  { q: 'Will the US next strike Iran on March 1, 2026?', cat: 'geopolitical', fair: 0.005, conf: 7, px: 0.006, dir: 'NO_EDGE' },
]

/** The scout's real auto-trade thresholds. */
export const SCOUT_GATES = { minEdge: 0.06, minConfidence: 6, minEvPerDollar: 0.03 }

export const SCOUT_CORPUS = { assessments: 424, markets: 407 }

// --------------------------------------------------------------- RUBRIC

export type RubricProject = {
  name: string
  cat: 'agentic' | 'rag' | 'research' | 'trading'
  inv: number
  imp: number
  sto: number
}

/** The evaluator's own scores. 36 projects were built; 12 were scored. */
export const RUBRIC_PROJECTS: RubricProject[] = [
  { name: 'Neural Network Training Visualizer', cat: 'research', inv: 10, imp: 10, sto: 9 },
  { name: 'Smart Code Review Agent', cat: 'agentic', inv: 10, imp: 9, sto: 10 },
  { name: 'Momentum Trading Strategy Bot', cat: 'trading', inv: 10, imp: 10, sto: 8 },
  { name: 'Intelligent Document Q&A System', cat: 'rag', inv: 10, imp: 9, sto: 9 },
  { name: 'Personal Research Assistant Agent', cat: 'agentic', inv: 8, imp: 8, sto: 9 },
  { name: 'RAG Chatbot with Memory System', cat: 'rag', inv: 8, imp: 8, sto: 9 },
  { name: 'CNN Image Classifier Visualizer', cat: 'research', inv: 8, imp: 8, sto: 9 },
  { name: 'SQL Query Generator Agent', cat: 'agentic', inv: 8, imp: 7, sto: 9 },
  { name: 'Semantic Search Engine', cat: 'rag', inv: 8, imp: 6, sto: 9 },
  { name: 'Mean Reversion Trading Bot', cat: 'trading', inv: 8, imp: 6, sto: 9 },
  { name: 'Portfolio Optimizer', cat: 'trading', inv: 7, imp: 6, sto: 8 },
  { name: 'Attention Mechanism Visualizer', cat: 'research', inv: 8, imp: 6, sto: 9 },
]

export const SWARM = { built: 36, scored: 12, files: 411, lines: 25024, skills: 5 }
