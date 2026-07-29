export const surveyVertex = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uMorph;      // 0 = survey, 1 = parcel, 2 = network
  uniform float uSweep;      // sweep angle, radians, monotonically increasing
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2  uPointer;    // -1..1, damped

  attribute vec3 aParcel;
  attribute vec3 aNetwork;
  attribute vec3 aSeed;
  attribute vec3 aAttrib;    // x = stagger, y = tone, z = highlight

  varying float vTone;
  varying float vEnergy;
  varying float vHighlight;
  varying float vFog;

  const float TAU = 6.28318530718;

  float easeInOutQuint(float x) {
    return x < 0.5 ? 16.0 * x * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 5.0) / 2.0;
  }

  void main() {
    float stagger = aAttrib.x;
    float tone = aAttrib.y;

    // --- formation morph, staggered per point so the cloud flows rather than snaps
    float s0 = clamp((uMorph - stagger * 0.42) / 0.58, 0.0, 1.0);
    float s1 = clamp((uMorph - 1.0 - stagger * 0.42) / 0.58, 0.0, 1.0);

    vec3 p = mix(position, aParcel, easeInOutQuint(s0));
    p = mix(p, aNetwork, easeInOutQuint(s1));

    // The field is fully formed on the very first frame. An intro that animates
    // points in from a shell means a stalled or throttled loop paints a
    // meaningless starfield as the first thing a visitor sees; the canvas fades
    // in with CSS instead.

    // --- perpetual low-amplitude drift so nothing ever looks frozen
    float ph = aSeed.z;
    p.x += sin(uTime * 0.21 + ph) * 0.075 * (0.35 + tone);
    p.y += cos(uTime * 0.17 + ph * 1.63) * 0.06 * (0.35 + tone);
    p.z += sin(uTime * 0.19 + ph * 0.71) * 0.075 * (0.35 + tone);

    // --- radar sweep: energy decays behind the leading edge
    float a = atan(p.z, p.x);
    float behind = mod(uSweep - a, TAU);
    float trail = exp(-behind * 2.6);
    float edge = smoothstep(0.16, 0.0, behind);
    float energy = clamp(trail * 0.62 + edge, 0.0, 1.6);

    // Sweep only reads on the ground formations; on the network it becomes a
    // travelling pulse around the shell instead of a floor scan.
    float groundness = 1.0 - smoothstep(1.0, 2.0, uMorph);
    energy *= mix(0.45, 1.0, groundness);

    p.y += energy * 0.30 * groundness;

    // --- pointer parallax, stronger on near points for real depth
    float depthBias = smoothstep(-24.0, 18.0, p.z);
    p.x += uPointer.x * 1.5 * depthBias;
    p.y += uPointer.y * 0.9 * depthBias;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + tone * 0.85) * (1.0 + energy * 1.25) * (34.0 / max(dist, 1.0));

    vTone = tone;
    vEnergy = energy;
    vHighlight = aAttrib.z * smoothstep(0.35, 0.9, s0) * (1.0 - s1);
    vFog = 1.0 - smoothstep(34.0, 82.0, dist);
  }
`

export const surveyFragment = /* glsl */ `
  precision highp float;

  uniform float uOpacity;

  varying float vTone;
  varying float vEnergy;
  varying float vHighlight;
  varying float vFog;

  const vec3 SLATE = vec3(0.365, 0.427, 0.502);
  const vec3 PAPER = vec3(0.949, 0.937, 0.914);
  const vec3 AMBER = vec3(0.976, 0.816, 0.478);

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d2 = dot(uv, uv);
    if (d2 > 0.25) discard;

    // Soft halo plus a tight core keeps points crisp without aliasing.
    float halo = smoothstep(0.25, 0.0, d2);
    float core = smoothstep(0.045, 0.0, d2);
    float alpha = halo * 0.42 + core * 1.0;

    vec3 col = mix(SLATE, PAPER, pow(vTone, 0.7));
    col = mix(col, AMBER, clamp(vEnergy * 0.85, 0.0, 1.0));
    col = mix(col, AMBER, vHighlight);

    alpha *= vFog * uOpacity * (0.55 + vTone * 0.5 + vEnergy * 0.55 + vHighlight * 0.6);

    gl_FragColor = vec4(col, alpha);
  }
`
