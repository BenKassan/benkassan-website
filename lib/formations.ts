/**
 * Point-cloud formations for the hero survey field.
 *
 * Three designed states the cloud morphs between as the page scrolls:
 *   0  SURVEY  – a rotating-lidar rosette over noisy ground
 *   1  PARCEL  – a city block grid with extruded footprints and one selected site
 *   2  NETWORK – a shell of nodes wired together by great-circle filaments
 *
 * Everything is generated on the CPU into flat Float32Arrays so the shader only
 * has to interpolate. Deterministic PRNG keeps runs identical across reloads.
 */

export type Formations = {
  count: number
  survey: Float32Array
  parcel: Float32Array
  network: Float32Array
  seed: Float32Array // vec3 – per-point noise offsets
  attrib: Float32Array // vec3 – (stagger, tone, highlight)
}

function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Cheap value-noise fbm, enough for a survey surface. */
function makeNoise2D(rand: () => number) {
  const size = 256
  const grid = new Float32Array(size * size)
  for (let i = 0; i < grid.length; i++) grid[i] = rand()

  const at = (x: number, y: number) => grid[(y & (size - 1)) * size + (x & (size - 1))]
  const smooth = (t: number) => t * t * (3 - 2 * t)

  const value = (x: number, y: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = smooth(x - xi)
    const yf = smooth(y - yi)
    const a = at(xi, yi)
    const b = at(xi + 1, yi)
    const c = at(xi, yi + 1)
    const d = at(xi + 1, yi + 1)
    return (a * (1 - xf) + b * xf) * (1 - yf) + (c * (1 - xf) + d * xf) * yf
  }

  return (x: number, y: number, octaves = 4) => {
    let sum = 0
    let amp = 0.5
    let freq = 1
    let norm = 0
    for (let o = 0; o < octaves; o++) {
      sum += value(x * freq, y * freq) * amp
      norm += amp
      amp *= 0.5
      freq *= 2.07
    }
    return sum / norm
  }
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

export function buildFormations(count: number, seedValue = 0x5ca1ab1e): Formations {
  const rand = mulberry32(seedValue)
  const noise = makeNoise2D(mulberry32(seedValue ^ 0x9e3779b9))

  const survey = new Float32Array(count * 3)
  const parcel = new Float32Array(count * 3)
  const network = new Float32Array(count * 3)
  const seed = new Float32Array(count * 3)
  const attrib = new Float32Array(count * 3)

  // ---------------------------------------------------------------- SURVEY
  // Concentric rings swept at the golden angle: the rosette a spinning lidar
  // actually paints on the ground, rather than uniform random scatter.
  const RINGS = 190
  const perRing = Math.ceil(count / RINGS)
  const R_MAX = 30

  for (let i = 0; i < count; i++) {
    const ring = Math.floor(i / perRing)
    const withinRing = i % perRing
    // Ease radius so the middle stays legible and the rim gets dense.
    const t = ring / RINGS
    const radius = Math.pow(t, 0.78) * R_MAX + rand() * 0.16

    const angle = i * GOLDEN_ANGLE + ring * 0.021 + (rand() - 0.5) * 0.014 * (withinRing + 1)
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    // Terrain: broad landform + a ridge running north-east + micro relief.
    const base = noise(x * 0.055 + 40, z * 0.055 + 40, 5)
    const ridge = Math.exp(-Math.pow((x * 0.5 + z * 0.5) * 0.09, 2)) * 0.55
    const micro = noise(x * 0.42, z * 0.42, 2) * 0.12
    const falloff = 1 - Math.pow(radius / R_MAX, 2.4)
    const y = (base * 2.6 + ridge * 2.2 + micro) * Math.max(falloff, 0.06) - 1.1

    survey[i * 3] = x
    survey[i * 3 + 1] = y
    survey[i * 3 + 2] = z
  }

  // ---------------------------------------------------------------- PARCEL
  // A block grid with street setbacks. Most blocks are flat lots; a minority
  // are extruded and sampled on their shell so the volumes read as buildings.
  // One parcel is flagged as the selected site.
  const BLOCKS = 9
  const BLOCK_PITCH = 5.6
  const LOT = 4.15
  const ORIGIN = -((BLOCKS - 1) * BLOCK_PITCH) / 2

  type Block = { cx: number; cz: number; h: number; selected: boolean }
  const blocks: Block[] = []
  const selectedIx = 3 * BLOCKS + 5

  for (let bx = 0; bx < BLOCKS; bx++) {
    for (let bz = 0; bz < BLOCKS; bz++) {
      const ix = bx * BLOCKS + bz
      const cx = ORIGIN + bx * BLOCK_PITCH
      const cz = ORIGIN + bz * BLOCK_PITCH
      const distance = Math.hypot(cx, cz) / (BLOCKS * BLOCK_PITCH * 0.5)
      // Denser massing downtown, tapering to flat lots at the edge.
      const massing = Math.max(0, 1 - distance * 1.15) * rand()
      const h = massing > 0.24 ? 0.8 + massing * 7.4 : 0
      blocks.push({ cx, cz, h, selected: ix === selectedIx })
    }
  }
  blocks[selectedIx].h = 0.28 // the selected site is vacant land, deliberately

  for (let i = 0; i < count; i++) {
    const b = blocks[Math.floor(rand() * blocks.length)]
    const half = LOT / 2
    let x: number, y: number, z: number

    if (b.h > 0.6 && rand() > 0.28) {
      // Sample the shell of the massing box: four walls + roof.
      const face = rand()
      const u = (rand() - 0.5) * LOT
      if (face < 0.22) {
        x = b.cx + u
        z = b.cz - half
        y = rand() * b.h
      } else if (face < 0.44) {
        x = b.cx + u
        z = b.cz + half
        y = rand() * b.h
      } else if (face < 0.66) {
        x = b.cx - half
        z = b.cz + u
        y = rand() * b.h
      } else if (face < 0.88) {
        x = b.cx + half
        z = b.cz + u
        y = rand() * b.h
      } else {
        x = b.cx + u
        z = b.cz + (rand() - 0.5) * LOT
        y = b.h
      }
    } else {
      // Flat lot / apron.
      x = b.cx + (rand() - 0.5) * LOT
      z = b.cz + (rand() - 0.5) * LOT
      y = b.h > 0 ? rand() * 0.06 : 0
    }

    parcel[i * 3] = x
    parcel[i * 3 + 1] = y - 1.4
    parcel[i * 3 + 2] = z

    // Carry the selected-site flag through as the highlight channel.
    attrib[i * 3 + 2] = b.selected ? 1 : 0
  }

  // --------------------------------------------------------------- NETWORK
  // A Fibonacci node shell plus filaments along great circles between hubs:
  // the orchestration graph, not a decorative particle sphere.
  const R_SHELL = 13.2
  const HUBS = 15
  const hubs: [number, number, number][] = []
  for (let h = 0; h < HUBS; h++) {
    const y = 1 - (h / (HUBS - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = h * GOLDEN_ANGLE
    hubs.push([Math.cos(theta) * r, y, Math.sin(theta) * r])
  }

  const slerp = (
    a: [number, number, number],
    b: [number, number, number],
    t: number
  ): [number, number, number] => {
    let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    dot = Math.max(-1, Math.min(1, dot))
    const omega = Math.acos(dot)
    if (omega < 1e-4) return a
    const s = Math.sin(omega)
    const w1 = Math.sin((1 - t) * omega) / s
    const w2 = Math.sin(t * omega) / s
    return [a[0] * w1 + b[0] * w2, a[1] * w1 + b[1] * w2, a[2] * w1 + b[2] * w2]
  }

  for (let i = 0; i < count; i++) {
    let nx: number, ny: number, nz: number
    const roll = rand()

    if (roll < 0.34) {
      // Filament riding a great circle between two hubs.
      const a = hubs[Math.floor(rand() * HUBS)]
      const b = hubs[Math.floor(rand() * HUBS)]
      const t = rand()
      const p = slerp(a, b, t)
      const wobble = 1 + (rand() - 0.5) * 0.012
      nx = p[0] * wobble
      ny = p[1] * wobble
      nz = p[2] * wobble
    } else if (roll < 0.44) {
      // Tight cluster around a hub – the visible nodes.
      const a = hubs[Math.floor(rand() * HUBS)]
      const spread = 0.055
      nx = a[0] + (rand() - 0.5) * spread
      ny = a[1] + (rand() - 0.5) * spread
      nz = a[2] + (rand() - 0.5) * spread
    } else {
      // Shell haze.
      const u = rand() * 2 - 1
      const theta = rand() * Math.PI * 2
      const r = Math.sqrt(Math.max(0, 1 - u * u))
      nx = Math.cos(theta) * r
      ny = u
      nz = Math.sin(theta) * r
    }

    const len = Math.hypot(nx, ny, nz) || 1
    const shell = R_SHELL * (0.985 + rand() * 0.03)
    network[i * 3] = (nx / len) * shell
    network[i * 3 + 1] = (ny / len) * shell * 0.86
    network[i * 3 + 2] = (nz / len) * shell
  }

  // ------------------------------------------------------------ PER-POINT
  for (let i = 0; i < count; i++) {
    seed[i * 3] = rand() * 2 - 1
    seed[i * 3 + 1] = rand() * 2 - 1
    seed[i * 3 + 2] = rand() * Math.PI * 2

    // Stagger drives the flow-through look during a morph.
    attrib[i * 3] = rand()
    // Tone gives the cloud tonal variance instead of one flat colour.
    attrib[i * 3 + 1] = Math.pow(rand(), 1.7)
  }

  return { count, survey, parcel, network, seed, attrib }
}
