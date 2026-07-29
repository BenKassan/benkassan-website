'use client'

import { useMemo, useState } from 'react'

import { SCOUT_CORPUS, SCOUT_GATES, SCOUT_ROWS } from '@/lib/demoData'
import { Slider } from './Slider'

const W = 460
const H = 460
const PAD = 34

export function MispricingPlane() {
  const [minEdge, setMinEdge] = useState(SCOUT_GATES.minEdge)
  const [minConf, setMinConf] = useState(SCOUT_GATES.minConfidence)
  const [hover, setHover] = useState<number | null>(null)

  const x = (v: number) => PAD + v * (W - PAD * 2)
  const y = (v: number) => H - PAD - v * (H - PAD * 2)

  const rows = useMemo(
    () =>
      SCOUT_ROWS.map((r, i) => {
        const div = r.fair - r.px
        const passes = Math.abs(div) >= minEdge && r.conf >= minConf
        return { ...r, i, div, passes }
      }),
    [minEdge, minConf]
  )

  const flagged = rows.filter((r) => r.passes)
  const active = hover !== null ? rows.find((r) => r.i === hover) : null

  return (
    <div className="overflow-hidden rounded-[4px] border border-[var(--line)] bg-ink-850">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* plane */}
        <div className="p-5 lg:p-7">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Fair probability versus market price">
            {/* grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <g key={t}>
                <line x1={x(t)} y1={PAD} x2={x(t)} y2={H - PAD} stroke="rgba(240,237,230,0.07)" />
                <line x1={PAD} y1={y(t)} x2={W - PAD} y2={y(t)} stroke="rgba(240,237,230,0.07)" />
                <text x={x(t)} y={H - PAD + 15} fontSize="9" fill="#4a4e55" textAnchor="middle" fontFamily="monospace">
                  {t}
                </text>
                <text x={PAD - 8} y={y(t) + 3} fontSize="9" fill="#4a4e55" textAnchor="end" fontFamily="monospace">
                  {t}
                </text>
              </g>
            ))}

            {/* agreement diagonal */}
            <line
              x1={x(0)}
              y1={y(0)}
              x2={x(1)}
              y2={y(1)}
              stroke="rgba(240,237,230,0.28)"
              strokeDasharray="3 4"
            />
            <text x={x(0.72)} y={y(0.76)} fontSize="9" fill="#7b7f86" fontFamily="monospace">
              model agrees with market
            </text>

            {/* points */}
            {rows.map((r) => (
              <g key={r.i}>
                {r.passes ? (
                  <line
                    x1={x(r.px)}
                    y1={y(r.px)}
                    x2={x(r.px)}
                    y2={y(r.fair)}
                    stroke="rgba(224,162,44,0.42)"
                    strokeWidth="1"
                  />
                ) : null}
                <circle
                  cx={x(r.px)}
                  cy={y(r.fair)}
                  r={hover === r.i ? 7 : r.passes ? 5.5 : 3.4}
                  fill={r.passes ? '#E0A22C' : 'rgba(124,140,160,0.55)'}
                  stroke={hover === r.i ? '#F0EDE6' : 'none'}
                  strokeWidth="1.2"
                  onMouseEnter={() => setHover(r.i)}
                  onMouseLeave={() => setHover(null)}
                  style={{ transition: 'r .18s ease', cursor: 'pointer' }}
                />
              </g>
            ))}

            <text x={W / 2} y={H - 4} fontSize="9.5" fill="#7b7f86" textAnchor="middle" fontFamily="monospace">
              MARKET PRICE
            </text>
            <text
              x={11}
              y={H / 2}
              fontSize="9.5"
              fill="#7b7f86"
              textAnchor="middle"
              fontFamily="monospace"
              transform={`rotate(-90 11 ${H / 2})`}
            >
              MODEL FAIR PROBABILITY
            </text>
          </svg>
        </div>

        {/* controls + readout */}
        <div className="flex flex-col gap-7 border-t border-[var(--line)] p-6 lg:border-l lg:border-t-0 lg:p-7">
          <Slider
            label="Min |divergence|"
            value={minEdge}
            min={0}
            max={0.5}
            step={0.01}
            onChange={setMinEdge}
            format={(v) => v.toFixed(2)}
          />
          <Slider
            label="Min confidence"
            value={minConf}
            min={1}
            max={10}
            onChange={setMinConf}
            format={(v) => `${v}/10`}
          />

          <div className="border-t border-[var(--line)] pt-5">
            <p className="eyebrow mb-2">Clears every gate</p>
            <p className="display tnum text-[2.6rem] leading-none text-amber-hot">
              {flagged.length}
              <span className="text-[0.34em] text-muted"> / {rows.length}</span>
            </p>
          </div>

          <div className="min-h-[7rem] border-t border-[var(--line)] pt-5">
            {active ? (
              <>
                <p className="text-[0.8125rem] leading-snug text-paper">{active.q}</p>
                <dl className="mt-3 space-y-1 font-mono text-[0.6875rem] text-muted">
                  <div className="flex justify-between">
                    <dt>market</dt>
                    <dd className="tnum text-paper-dim">{active.px.toFixed(3)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>model fair</dt>
                    <dd className="tnum text-paper-dim">{active.fair.toFixed(3)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>divergence</dt>
                    <dd className="tnum" style={{ color: active.passes ? '#F7CD77' : '#b8b5ae' }}>
                      {active.div > 0 ? '+' : ''}
                      {active.div.toFixed(3)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>confidence</dt>
                    <dd className="tnum text-paper-dim">{active.conf}/10</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="text-[0.8125rem] leading-relaxed text-faint">
                Hover a point. Its vertical distance from the diagonal is the divergence the screen is
                actually trading on.
              </p>
            )}
          </div>

          <p className="mt-auto border-t border-[var(--line)] pt-5 text-[0.7rem] leading-relaxed text-faint">
            {SCOUT_ROWS.length} real assessments from a corpus of {SCOUT_CORPUS.assessments} across{' '}
            {SCOUT_CORPUS.markets} markets. Production defaults were |divergence| ≥ {SCOUT_GATES.minEdge} and
            confidence ≥ {SCOUT_GATES.minConfidence}. Single-model screen — the second-model consensus gate
            exists in the code but was never run.
          </p>
        </div>
      </div>
    </div>
  )
}
