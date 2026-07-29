'use client'

import { useMemo, useState } from 'react'

import {
  GATE_LABEL,
  GATE_ORDER,
  GATE_SEVERITY,
  GATE_WEIGHTS,
  KW_PER_VEHICLE,
  RADAR_SITES,
  SF_PER_VEHICLE,
  type GateId,
  type RadarSite,
} from '@/lib/demoData'
import { Slider } from './Slider'

type Verdict = 'pass' | 'fail' | 'unresolved'
type State = 'advance' | 'conditional-advance' | 'hold-for-diligence' | 'screen-out'

const STATE_META: Record<State, { label: string; color: string }> = {
  advance: { label: 'Advance', color: '#F7CD77' },
  'conditional-advance': { label: 'Conditional', color: '#8FA6C4' },
  'hold-for-diligence': { label: 'Hold', color: '#6E7480' },
  'screen-out': { label: 'Screen out', color: '#C4675B' },
}

type Assessed = {
  site: RadarSite
  gates: Record<GateId, { verdict: Verdict; note: string }>
  state: State
  completeness: number
  capacity: number
  costPerVehicle: number | null
}

/**
 * A faithful reduction of Radar's underwriting pass. Seven of the nine
 * production gates are reachable from the data on this page; site control and
 * environmental need sources that are not shipped here, so they are excluded
 * rather than guessed — which is why the reachable weight is 79, not 100.
 */
function assess(site: RadarSite, fleet: number, budget: number): Assessed {
  const capacity = Math.floor(site.availableSf / SF_PER_VEHICLE)
  const requiredKw = fleet * KW_PER_VEHICLE
  const costPerVehicle =
    site.askingRent === null ? null : (site.askingRent * site.availableSf) / 12 / fleet

  const gates: Record<GateId, { verdict: Verdict; note: string }> = {
    'site-identity': {
      verdict: 'pass',
      note: 'Parcel reconciled to the assessor parcel number',
    },
    'legal-use': {
      verdict: 'pass',
      note:
        site.zoning === 'PDR-1-B'
          ? `${site.zoning} — light industrial buffer, permitted with conditions`
          : `${site.zoning} — production, distribution and repair`,
    },
    'fleet-capacity': {
      verdict: capacity >= fleet ? 'pass' : 'fail',
      note: `Fits ${capacity.toLocaleString()} vehicles at ${SF_PER_VEHICLE} sf each`,
    },
    'utility-capacity':
      site.hostingKw === null
        ? { verdict: 'unresolved', note: 'No current PG&E hosting record — stays null' }
        : {
            verdict: site.hostingKw >= requiredKw ? 'pass' : 'fail',
            note: `${site.hostingKw.toLocaleString()} kW screened vs ${Math.round(requiredKw).toLocaleString()} kW needed`,
          },
    'yard-geometry': {
      verdict: site.yard ? 'pass' : 'fail',
      note: site.yard ? 'Yard depth supports circulation' : 'No usable yard geometry',
    },
    'access-routing':
      site.deadheadUsd === null
        ? { verdict: 'unresolved', note: 'No deadhead model for this parcel' }
        : {
            verdict: site.deadheadUsd <= 12 ? 'pass' : 'fail',
            note: `$${site.deadheadUsd.toFixed(2)} deadhead per vehicle-day`,
          },
    budget:
      costPerVehicle === null
        ? { verdict: 'unresolved', note: 'No published asking rent' }
        : {
            verdict: costPerVehicle <= budget ? 'pass' : 'fail',
            note: `$${Math.round(costPerVehicle).toLocaleString()} per vehicle-month`,
          },
  }

  const total = Object.values(GATE_WEIGHTS).reduce((a, b) => a + b, 0)
  let resolved = 0
  let fatalFail = false
  let fatalUnresolved = false
  let materialFail = false

  for (const id of GATE_ORDER) {
    const { verdict } = gates[id]
    const fatal = GATE_SEVERITY[id] === 'fatal'
    if (verdict === 'unresolved') {
      if (fatal) fatalUnresolved = true
      continue
    }
    resolved += GATE_WEIGHTS[id]
    if (verdict === 'fail') {
      if (fatal) fatalFail = true
      else materialFail = true
    }
  }

  const completeness = Math.round((resolved / total) * 100)

  // Decision-state cascade, in the production order.
  let state: State
  if (fatalFail) state = 'screen-out'
  else if (fatalUnresolved) state = 'hold-for-diligence'
  else if (completeness < 70 || materialFail) state = 'conditional-advance'
  else state = 'advance'

  return { site, gates, state, completeness, capacity, costPerVehicle }
}

function GateDot({ verdict }: { verdict: Verdict }) {
  if (verdict === 'unresolved') {
    return (
      <span className="block size-[9px] rounded-[2px] border border-[var(--line-strong)] bg-transparent" />
    )
  }
  return (
    <span
      className="block size-[9px] rounded-[2px]"
      style={{ background: verdict === 'pass' ? '#F0EDE6' : '#C4675B' }}
    />
  )
}

export function GateBoard() {
  const [fleet, setFleet] = useState(80)
  const [budget, setBudget] = useState(500)

  const rows = useMemo(
    () =>
      RADAR_SITES.map((s) => assess(s, fleet, budget)).sort((a, b) => {
        const order: State[] = ['advance', 'conditional-advance', 'hold-for-diligence', 'screen-out']
        const d = order.indexOf(a.state) - order.indexOf(b.state)
        return d !== 0 ? d : b.completeness - a.completeness
      }),
    [fleet, budget]
  )

  const counts = rows.reduce<Record<State, number>>(
    (acc, r) => ({ ...acc, [r.state]: (acc[r.state] ?? 0) + 1 }),
    { advance: 0, 'conditional-advance': 0, 'hold-for-diligence': 0, 'screen-out': 0 }
  )

  return (
    <div className="overflow-hidden rounded-[4px] border border-[var(--line)] bg-ink-850">
      {/* controls */}
      <div className="grid gap-7 border-b border-[var(--line)] p-6 sm:grid-cols-2 lg:p-8">
        <Slider
          label="Fleet size"
          value={fleet}
          min={10}
          max={300}
          step={5}
          onChange={setFleet}
          format={(v) => `${v} vehicles`}
        />
        <Slider
          label="Budget ceiling"
          value={budget}
          min={100}
          max={1400}
          step={25}
          onChange={setBudget}
          format={(v) => `$${v}/veh/mo`}
        />
      </div>

      {/* tally */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-[var(--line)] px-6 py-4 lg:px-8">
        {(Object.keys(STATE_META) as State[]).map((s) => (
          <span key={s} className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.05em]">
            <span className="size-[6px] rounded-full" style={{ background: STATE_META[s].color }} />
            <span className="text-muted">{STATE_META[s].label}</span>
            <span className="tnum text-paper">{counts[s]}</span>
          </span>
        ))}
      </div>

      {/* rows */}
      <div className="max-h-[30rem] overflow-y-auto">
        {rows.map(({ site, gates, state, completeness, capacity }) => (
          <div
            key={site.id}
            className="grid grid-cols-1 items-center gap-3 border-b border-[var(--line)] px-6 py-4 last:border-b-0 md:grid-cols-[1fr_auto_auto] md:gap-6 lg:px-8"
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-3">
                <span
                  className="size-[6px] shrink-0 rounded-full"
                  style={{ background: STATE_META[state].color }}
                />
                <span className="truncate text-[0.9375rem] text-paper">{site.address}</span>
              </div>
              <p className="mt-1 pl-[15px] font-mono text-[0.6875rem] text-faint">
                {site.zoning} · {site.availableSf.toLocaleString()} sf · fits{' '}
                <span className="tnum">{capacity.toLocaleString()}</span>
              </p>
            </div>

            <div className="flex items-center gap-[5px] pl-[15px] md:pl-0">
              {GATE_ORDER.map((id) => (
                <span key={id} title={`${GATE_LABEL[id]} — ${gates[id].note}`} className="cursor-help">
                  <GateDot verdict={gates[id].verdict} />
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 pl-[15px] md:pl-0 md:w-[9.5rem] md:justify-end">
              <span className="hidden h-[3px] w-16 overflow-hidden rounded-full bg-[var(--line)] sm:block">
                <span
                  className="block h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${completeness}%`, background: STATE_META[state].color }}
                />
              </span>
              <span className="tnum font-mono text-[0.6875rem] text-muted">{completeness}% evid.</span>
            </div>
          </div>
        ))}
      </div>

      <p className="border-t border-[var(--line)] px-6 py-4 text-[0.75rem] leading-relaxed text-faint lg:px-8">
        Seven of nine production gates run here; site control and environmental need sources not shipped to
        this page, so the reachable weight is 79 of 100. Hollow squares are unresolved — they contribute no
        confidence and are never defaulted to a passing value. Hosting capacity is PG&amp;E screening data and
        is not a service commitment.
      </p>
    </div>
  )
}
