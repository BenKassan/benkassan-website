'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import { SurveyField } from './SurveyField'

/**
 * The single persistent WebGL surface for the site.
 *
 * It sits fixed behind the first three screens of the document. Scroll drives
 * the formation morph and the fade-out; once it is invisible the render loop
 * stops entirely so the rest of the page costs nothing on the GPU.
 */
export default function SurveyCanvas() {
  const morphRef = useRef(0)
  const opacityRef = useRef(1)
  const shellRef = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [pointCount, setPointCount] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    // Scale the cloud to the device rather than shipping one number everywhere.
    const w = window.innerWidth
    const cores = navigator.hardwareConcurrency ?? 4
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let n = 96_000
    if (coarse || w < 780) n = 34_000
    else if (w < 1200 || cores <= 4) n = 62_000
    setPointCount(n)
  }, [])

  useEffect(() => {
    if (!pointCount) return

    // QA: ?qa-morph=0|1|2 pins the formation so each scroll state can be
    // screenshotted without scripting the page.
    const pinned = new URLSearchParams(window.location.search).get('qa-morph')
    if (pinned !== null && process.env.NODE_ENV !== 'production') {
      morphRef.current = Number(pinned) || 0
      opacityRef.current = 1
      setActive(true)
      return
    }

    let frame = 0
    const compute = () => {
      frame = 0
      const h = window.innerHeight || 1
      const y = window.scrollY

      const seg = (from: number, to: number) =>
        Math.min(Math.max((y - from * h) / ((to - from) * h), 0), 1)

      morphRef.current = seg(0.55, 1.7) + seg(1.75, 2.9)

      const fade = 1 - seg(2.45, 3.25)
      opacityRef.current = fade

      // Only scroll position gates the loop. Do NOT also gate on
      // document.hidden: a tab that mounts in the background would latch the
      // loop off, and the browser already suspends rAF while hidden anyway.
      const shouldRun = fade > 0.015
      setActive((prev) => (prev === shouldRun ? prev : shouldRun))

      if (shellRef.current) {
        shellRef.current.style.opacity = fade > 0.015 ? '1' : '0'
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pointCount])

  const dpr = useMemo<[number, number]>(() => [1, 2], [])

  if (!pointCount) return null

  return (
    <div
      ref={shellRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
      style={{ contain: 'layout paint' }}
    >
      <Canvas
        dpr={dpr}
        frameloop={active ? 'always' : 'never'}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ fov: 42, near: 0.1, far: 200, position: [0, 10, 34] }}
      >
        <SurveyField
          morphRef={morphRef}
          opacityRef={opacityRef}
          pointCount={pointCount}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  )
}
