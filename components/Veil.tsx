/**
 * A directional scrim that keeps type legible where it overlaps the point
 * cloud. A linear falloff reads better than a radial one behind a text column,
 * because the column is a rectangle, not a disc.
 */
export function Veil({ side = 'left' }: { side?: 'left' | 'right' | 'center' }) {
  const background =
    side === 'center'
      ? 'radial-gradient(62% 66% at 50% 50%, rgba(8,9,11,0.95) 0%, rgba(8,9,11,0.82) 45%, rgba(8,9,11,0) 82%)'
      : side === 'left'
        ? 'linear-gradient(96deg, rgba(8,9,11,0.97) 0%, rgba(8,9,11,0.94) 30%, rgba(8,9,11,0.72) 46%, rgba(8,9,11,0.18) 62%, rgba(8,9,11,0) 74%)'
        : 'linear-gradient(276deg, rgba(8,9,11,0.97) 0%, rgba(8,9,11,0.94) 30%, rgba(8,9,11,0.72) 46%, rgba(8,9,11,0.18) 62%, rgba(8,9,11,0) 74%)'

  return <div aria-hidden className="pointer-events-none absolute inset-0 -z-[1]" style={{ background }} />
}
