'use client'

import { useMemo, useState } from 'react'

import { RUBRIC_PROJECTS, SWARM } from '@/lib/demoData'
import { Slider } from './Slider'

const CAT_COLOR: Record<string, string> = {
  agentic: '#E0A22C',
  rag: '#8FA6C4',
  research: '#9FBFA8',
  trading: '#C9927A',
}

const ROW_H = 46

export function RubricBoard() {
  const [wInv, setWInv] = useState(1)
  const [wImp, setWImp] = useState(1)
  const [wSto, setWSto] = useState(1)

  const ranked = useMemo(() => {
    const total = wInv + wImp + wSto || 1
    return RUBRIC_PROJECTS.map((p) => ({
      ...p,
      score: (p.inv * wInv + p.imp * wImp + p.sto * wSto) / total,
    }))
      .sort((a, b) => b.score - a.score)
      .map((p, rank) => ({ ...p, rank }))
  }, [wInv, wImp, wSto])

  const max = Math.max(...ranked.map((r) => r.score))
  const leader = ranked[0]

  return (
    <div className="overflow-hidden rounded-[4px] border border-[var(--line)] bg-ink-850">
      <div className="grid gap-7 border-b border-[var(--line)] p-6 sm:grid-cols-3 lg:p-8">
        <Slider label="Inventiveness" value={wInv} min={0} max={3} step={0.1} onChange={setWInv} format={(v) => `×${v.toFixed(1)}`} />
        <Slider label="Impact" value={wImp} min={0} max={3} step={0.1} onChange={setWImp} format={(v) => `×${v.toFixed(1)}`} />
        <Slider label="Story" value={wSto} min={0} max={3} step={0.1} onChange={setWSto} format={(v) => `×${v.toFixed(1)}`} />
      </div>

      <div className="border-b border-[var(--line)] px-6 py-4 lg:px-8">
        <p className="text-[0.8125rem] text-muted">
          Top of the board:{' '}
          <span className="text-paper">{leader.name}</span>{' '}
          <span className="tnum font-mono text-[0.6875rem] text-amber-hot">
            {leader.score.toFixed(2)}
          </span>
        </p>
      </div>

      {/* animated leaderboard */}
      <div className="relative px-6 py-5 lg:px-8" style={{ height: ranked.length * ROW_H + 20 }}>
        {ranked.map((p) => (
          <div
            key={p.name}
            className="absolute left-6 right-6 flex items-center gap-4 lg:left-8 lg:right-8"
            style={{
              top: p.rank * ROW_H + 12,
              height: ROW_H - 10,
              transition: 'top .6s var(--ease-out-expo)',
            }}
          >
            <span className="tnum w-5 shrink-0 font-mono text-[0.6875rem] text-faint">
              {String(p.rank + 1).padStart(2, '0')}
            </span>
            <span className="w-[10.5rem] shrink-0 truncate text-[0.8125rem] text-paper sm:w-[15rem]">
              {p.name}
            </span>
            <span className="relative h-[7px] flex-1 overflow-hidden rounded-full bg-[var(--line)]">
              <span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${(p.score / max) * 100}%`,
                  background: CAT_COLOR[p.cat],
                  opacity: p.rank === 0 ? 1 : 0.55,
                  transition: 'width .6s var(--ease-out-expo), opacity .4s ease',
                }}
              />
            </span>
            <span className="tnum w-10 shrink-0 text-right font-mono text-[0.6875rem] text-paper-dim">
              {p.score.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--line)] px-6 py-4 lg:px-8">
        {Object.entries(CAT_COLOR).map(([cat, color]) => (
          <span key={cat} className="flex items-center gap-2 font-mono text-[0.6875rem] text-muted">
            <span className="size-[6px] rounded-full" style={{ background: color }} />
            {cat}
          </span>
        ))}
      </div>

      <p className="border-t border-[var(--line)] px-6 py-4 text-[0.75rem] leading-relaxed text-faint lg:px-8">
        Real scores from the rubric evaluator I wrote. The swarm built {SWARM.built} projects (
        {SWARM.files} files, {SWARM.lines.toLocaleString()} lines); {SWARM.scored} were put through the
        evaluator, which is why {SWARM.scored} appear here and not {SWARM.built}. Change what the judge cares
        about and the winner changes — which is the honest thing a rubric does.
      </p>
    </div>
  )
}
