'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * "Gate cascade" — the Radar case-study scene.
 *
 * An instanced wireframe parcel field. A scan plane rises through the massing;
 * every parcel it crosses flares and settles. One parcel stays lit: the site
 * that cleared every gate.
 */

const GRID = 15
const PITCH = 1.34
const MAX_H = 3.4

function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const vertex = /* glsl */ `
  attribute vec3 aOffset;
  attribute vec3 aScale;
  attribute float aTone;
  attribute float aSelected;

  uniform float uScan;
  uniform float uTime;

  varying float vFlare;
  varying float vSelected;
  varying float vTone;
  varying float vFog;

  void main() {
    vec3 p = position * aScale + aOffset;

    // Flare when the scan plane crosses this parcel's roof.
    float roof = aOffset.y + aScale.y * 0.5;
    float d = abs(uScan - roof);
    float flare = smoothstep(0.42, 0.0, d);

    // A settled afterglow so the field reads as progressively cleared.
    float cleared = smoothstep(0.0, 0.3, uScan - roof) * 0.24;

    p.y += flare * 0.09;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    vFlare = max(flare, cleared);
    vSelected = aSelected;
    vTone = aTone;
    vFog = 1.0 - smoothstep(11.0, 30.0, -mv.z);
  }
`

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;

  varying float vFlare;
  varying float vSelected;
  varying float vTone;
  varying float vFog;

  const vec3 SLATE = vec3(0.255, 0.310, 0.373);
  const vec3 AMBER = vec3(0.965, 0.784, 0.435);

  void main() {
    float pulse = 0.62 + 0.38 * sin(uTime * 1.9);
    vec3 col = mix(SLATE, AMBER, clamp(vFlare + vSelected * pulse, 0.0, 1.0));
    float a = (0.20 + vTone * 0.20 + vFlare * 0.72 + vSelected * 0.62 * pulse) * vFog;
    gl_FragColor = vec4(col, a);
  }
`

function ParcelField() {
  const groupRef = useRef<THREE.Group>(null)

  const { geometry, uniforms } = useMemo(() => {
    const rand = mulberry32(0x0dec1de)
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1))

    const offsets: number[] = []
    const scales: number[] = []
    const tones: number[] = []
    const selected: number[] = []

    const origin = -((GRID - 1) * PITCH) / 2
    const pickX = 5
    const pickZ = 9

    for (let ix = 0; ix < GRID; ix++) {
      for (let iz = 0; iz < GRID; iz++) {
        const r = rand()
        if (r < 0.17) continue // street / vacancy

        const cx = origin + ix * PITCH
        const cz = origin + iz * PITCH
        const distance = Math.hypot(cx, cz) / (GRID * PITCH * 0.5)
        const isPick = ix === pickX && iz === pickZ

        const h = isPick ? 0.34 : 0.28 + Math.pow(rand(), 1.6) * MAX_H * (1.15 - distance * 0.55)
        const w = 0.72 + rand() * 0.3

        offsets.push(cx, h / 2, cz)
        scales.push(w, h, w)
        tones.push(0.25 + rand() * 0.75)
        selected.push(isPick ? 1 : 0)
      }
    }

    const g = new THREE.InstancedBufferGeometry()
    g.setAttribute('position', edges.getAttribute('position'))
    g.instanceCount = selected.length
    g.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3))
    g.setAttribute('aScale', new THREE.InstancedBufferAttribute(new Float32Array(scales), 3))
    g.setAttribute('aTone', new THREE.InstancedBufferAttribute(new Float32Array(tones), 1))
    g.setAttribute('aSelected', new THREE.InstancedBufferAttribute(new Float32Array(selected), 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30)

    return {
      geometry: g,
      uniforms: { uScan: { value: 0 }, uTime: { value: 0 } },
    }
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    // Ease the scan so it lingers at the top before falling back through.
    const cycle = (t * 0.16) % 1
    const eased = cycle < 0.7 ? cycle / 0.7 : 1 - (cycle - 0.7) / 0.3
    uniforms.uScan.value = eased * (MAX_H + 0.9) - 0.2

    if (groupRef.current) groupRef.current.rotation.y = t * 0.045 + 0.5
  })

  return (
    <group ref={groupRef}>
      <lineSegments geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}

export default function GateCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden style={{ contain: 'layout paint' }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 34, position: [0, 8.4, 15.5], near: 0.1, far: 90 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.6, 0)}
      >
        <ParcelField />
      </Canvas>
    </div>
  )
}
