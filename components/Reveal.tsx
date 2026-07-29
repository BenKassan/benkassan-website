'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Scroll reveal. Sets data-shown once, then stops observing — the animation
 * itself lives in CSS so nothing re-renders.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  threshold = 0.15,
}: {
  children: ReactNode
  delay?: number
  className?: string
  threshold?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      el.dataset.shown = 'true'
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = 'true'
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      data-reveal=""
      data-shown="false"
      className={className}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

/**
 * Splits a headline into per-word masks that slide up in sequence.
 * Must sit inside something that gets data-shown (e.g. <Reveal>).
 */
export function SplitWords({
  text,
  stagger = 55,
  className = '',
}: {
  text: string
  stagger?: number
  className?: string
}) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="word-mask">
            <span style={{ '--word-delay': `${i * stagger}ms` } as React.CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  )
}
