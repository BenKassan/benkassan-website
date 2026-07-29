'use client'

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <label className="block select-none">
      <span className="eyebrow flex items-baseline justify-between gap-4">
        <span>{label}</span>
        <span className="tnum text-amber-hot">{format ? format(value) : value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3 w-full"
        style={{ '--pct': `${pct}%` } as React.CSSProperties}
      />
    </label>
  )
}
