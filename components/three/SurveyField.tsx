'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { buildFormations } from '@/lib/formations'
import { surveyFragment, surveyVertex } from './surveyShaders'

type Props = {
  /** 0..2 target morph position, updated from scroll. */
  morphRef: React.RefObject<number>
  /** 0..1 overall opacity, updated from scroll. */
  opacityRef: React.RefObject<number>
  pointCount: number
  reducedMotion: boolean
}

const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.damp(current, target, lambda, dt)

function makeUniforms() {
  return {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uSweep: { value: 0 },
    uSize: { value: 4.4 },
    uPixelRatio: { value: 1 },
    uPointer: { value: new THREE.Vector2() },
    uOpacity: { value: 1 },
  }
}

export function SurveyField({ morphRef, opacityRef, pointCount, reducedMotion }: Props) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size, camera, gl, scene } = useThree()

  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  const formations = useMemo(() => buildFormations(pointCount), [pointCount])

  // A ref, not a memo. Strict Mode re-invokes render and can recompute a memo,
  // which would leave the material holding one uniforms object while every
  // write went to another — the scene then renders frozen at its initial state.
  const uniformsRef = useRef<ReturnType<typeof makeUniforms> | null>(null)
  if (!uniformsRef.current) uniformsRef.current = makeUniforms()

  /** Always write through the material's own uniforms when it exists. */
  const live = () => materialRef.current?.uniforms ?? uniformsRef.current!

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(formations.survey, 3))
    g.setAttribute('aParcel', new THREE.BufferAttribute(formations.parcel, 3))
    g.setAttribute('aNetwork', new THREE.BufferAttribute(formations.network, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(formations.seed, 3))
    g.setAttribute('aAttrib', new THREE.BufferAttribute(formations.attrib, 3))
    // Positions are rewritten in the vertex shader, so CPU-side bounds lie.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 90)
    return g
  }, [formations])

  useEffect(() => () => geometry.dispose(), [geometry])

  useEffect(() => {
    const u = live()
    u.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2)
    // Larger points on narrow screens so the cloud keeps its density.
    u.uSize.value = size.width < 780 ? 5.6 : 4.4
  })

  useEffect(() => {
    if (reducedMotion) return
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.ty = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  const morph = useRef(0)
  const opacity = useRef(1)

  // QA: ?qa-morph pins the formation with no easing, so a single rendered
  // frame is enough to inspect a state that normally takes a second to reach.
  const pinnedMorph = useMemo(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return null
    const v = new URLSearchParams(window.location.search).get('qa-morph')
    return v === null ? null : Number(v) || 0
  }, [])

  /** Shared by the animation loop and the dev tick so they cannot diverge. */
  const place = (t: number, m: number, px = 0, py = 0) => {
    const orbit = reducedMotion ? 0.6 : t * 0.035
    const radius = 46 - m * 8
    const height = 21 - m * 3 + Math.sin(t * 0.14) * 0.8
    camera.position.set(
      Math.sin(orbit) * radius + px * 2.2,
      height - py * 1.8,
      Math.cos(orbit) * radius
    )
    camera.lookAt(-9 + m * 3.5, -1 + m * 1.5, 0)
    if (pointsRef.current) pointsRef.current.rotation.y = m * 0.22
  }

  // Frame the shot before the loop's first tick, so even a single render (a
  // throttled tab, reduced motion, a stalled rAF) composes correctly.
  useEffect(() => {
    place(0, pinnedMorph ?? 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 30)
    const t = state.clock.elapsedTime
    const u = live()

    u.uTime.value = t
    if (!reducedMotion) u.uSweep.value = t * 0.62

    morph.current =
      pinnedMorph !== null ? pinnedMorph : damp(morph.current, morphRef.current ?? 0, 3.4, dt)
    opacity.current = damp(opacity.current, opacityRef.current ?? 1, 5, dt)
    u.uMorph.value = morph.current
    u.uOpacity.value = opacity.current

    const p = pointer.current
    p.x = damp(p.x, p.tx, 2.4, dt)
    p.y = damp(p.y, p.ty, 2.4, dt)
    u.uPointer.value.set(p.x, p.y)

    place(t, morph.current, p.x, p.y)
  })

  // Dev-only QA hooks. __surveyTick(t, morph, opts) renders one deterministic
  // frame and reads the drawing buffer back as a coarse luminance map, so the
  // scene can be inspected from a throttled or background tab.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    const w = window as unknown as Record<string, unknown>

    w.__surveyTick = (
      t = 0,
      m = 0,
      opts: {
        camPos?: [number, number, number]
        lookAt?: [number, number, number]
        size?: number
      } = {}
    ) => {
      const u = live()
      u.uTime.value = t
      u.uSweep.value = t * 0.62
      u.uMorph.value = m
      u.uOpacity.value = 1
      if (opts.size) u.uSize.value = opts.size

      place(t, m)
      if (opts.camPos) camera.position.set(...opts.camPos)
      if (opts.lookAt) camera.lookAt(...opts.lookAt)

      gl.render(scene, camera)

      const ctx = gl.getContext()
      const W = gl.domElement.width
      const H = gl.domElement.height
      const px = new Uint8Array(W * H * 4)
      ctx.readPixels(0, 0, W, H, ctx.RGBA, ctx.UNSIGNED_BYTE, px)

      const COLS = 56
      const ROWS = 20
      const ramp = ' .:-=+*#%@'
      let lit = 0
      let total = 0
      const rows: string[] = []
      for (let r = 0; r < ROWS; r++) {
        let line = ''
        for (let c = 0; c < COLS; c++) {
          const x0 = Math.floor((c / COLS) * W)
          const x1 = Math.floor(((c + 1) / COLS) * W)
          // readPixels is bottom-up, so invert the row index.
          const y0 = Math.floor(((ROWS - 1 - r) / ROWS) * H)
          const y1 = Math.floor(((ROWS - r) / ROWS) * H)
          let sum = 0
          let n = 0
          for (let y = y0; y < y1; y += 4) {
            for (let x = x0; x < x1; x += 4) {
              const i = (y * W + x) * 4
              sum += (px[i] + px[i + 1] + px[i + 2]) / 3
              n++
            }
          }
          const v = n ? sum / n : 0
          total += v
          if (v > 6) lit++
          line += ramp[Math.min(ramp.length - 1, Math.floor((v / 70) * ramp.length))]
        }
        rows.push(line)
      }

      return {
        t,
        m,
        points: gl.info.render.points,
        meanLuma: +(total / (COLS * ROWS)).toFixed(2),
        litCells: `${lit}/${COLS * ROWS}`,
        uSize: u.uSize.value,
        map: rows,
      }
    }
  }, [gl, scene, camera])

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniformsRef.current}
        vertexShader={surveyVertex}
        fragmentShader={surveyFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
