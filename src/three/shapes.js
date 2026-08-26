// Each function returns a Float32Array of length COUNT * 3 — the target
// position for every particle in that silhouette. Particle[i] always maps
// to the same index across shapes, so ParticleField can morph i -> i.

// ---- small deterministic PRNG so shapes are stable across re-renders ----
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(1337);

function gaussian(rng) {
  // Box-Muller
  const u = 1 - rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * A torus/(p,q) knot curve, thickened into a soft tube by scattering points
 * radially around the curve. `tangle` widens the tube + adds a touch of
 * per-point jitter so it reads as a cloud of points, not a clean line.
 */
function torusKnotPositions(count, { p = 2, q = 3, scale = 2.4, tubeRadius = 0.55, R = 1.6 } = {}) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2 * q;
    const cx = (R + Math.cos((q / p) * t)) * Math.cos(t);
    const cy = (R + Math.cos((q / p) * t)) * Math.sin(t);
    const cz = Math.sin((q / p) * t);

    // local jitter around the curve for tube thickness
    const a = rand() * Math.PI * 2;
    const r = tubeRadius * Math.sqrt(rand());
    const jx = Math.cos(a) * r;
    const jy = Math.sin(a) * r;
    const jz = (rand() - 0.5) * tubeRadius;

    out[i * 3] = (cx + jx) * scale * 0.55;
    out[i * 3 + 1] = (cy + jy) * scale * 0.55;
    out[i * 3 + 2] = (cz + jz) * scale * 0.55;
  }
  return out;
}

export function torusKnot(count) {
  // hero: a denser, more tangled 3-lobe interlocking loop
  return torusKnotPositions(count, { p: 3, q: 4, scale: 2.5, tubeRadius: 0.5, R: 1.5 });
}

export function trefoil(count) {
  // method: the classic (2,3) trefoil
  return torusKnotPositions(count, { p: 2, q: 3, scale: 2.6, tubeRadius: 0.42, R: 1.4 });
}

export function ring(count) {
  const out = new Float32Array(count * 3);
  const radius = 2.5;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const jitter = 0.045;
    out[i * 3] = Math.cos(t) * radius + (rand() - 0.5) * jitter;
    out[i * 3 + 1] = Math.sin(t) * radius + (rand() - 0.5) * jitter;
    out[i * 3 + 2] = (rand() - 0.5) * jitter * 2;
  }
  return out;
}

export function sphereNetwork(count) {
  // Fibonacci sphere — evenly distributed points on a sphere surface
  const out = new Float32Array(count * 3);
  const radius = 2.65;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    out[i * 3] = x * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = z * radius;
  }
  return out;
}

export function comet(count) {
  // points streak into one elongated diagonal blur
  const out = new Float32Array(count * 3);
  const dir = { x: 1, y: 0.55, z: -0.35 };
  const len = Math.hypot(dir.x, dir.y, dir.z);
  const ux = dir.x / len,
    uy = dir.y / len,
    uz = dir.z / len;
  // arbitrary orthogonal basis for the thin cross-section
  const vx = -uy,
    vy = ux,
    vz = 0;
  const wx = uy * vz - uz * vy,
    wy = uz * vx - ux * vz,
    wz = ux * vy - uy * vx;

  for (let i = 0; i < count; i++) {
    // bias more points toward the tail (dense head, sparse streak) using a skewed distribution
    const along = (Math.pow(rand(), 1.8) - 0.15) * 5.2 - 1.3;
    const spread = 0.16 * (1 - Math.min(1, Math.abs(along) / 4.2));
    const jv = gaussian(rand) * spread;
    const jw = gaussian(rand) * spread;
    out[i * 3] = ux * along + vx * jv + wx * jw;
    out[i * 3 + 1] = uy * along + vy * jv + wy * jw;
    out[i * 3 + 2] = uz * along + vz * jv + wz * jw;
  }
  return out;
}

export function starburst(count) {
  // asymmetric star / constellation: an irregular set of spikes radiating
  // from the center, points denser near the vertices at each spike's tip
  const spikeCount = 7;
  const rng = mulberry32(42);
  const spikes = Array.from({ length: spikeCount }, () => {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(1 - 2 * rng());
    const length = 1.6 + rng() * 2.1;
    return {
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi),
      length,
    };
  });

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const s = spikes[i % spikeCount];
    // bias t toward 1 so points cluster near the vertex tips
    const t = Math.pow(rand(), 0.45);
    const wobble = 0.05 + 0.09 * t;
    out[i * 3] = s.x * s.length * t + gaussian(rand) * wobble;
    out[i * 3 + 1] = s.y * s.length * t + gaussian(rand) * wobble;
    out[i * 3 + 2] = s.z * s.length * t + gaussian(rand) * wobble;
  }
  return out;
}

export function halo(count) {
  // Studio: points spread into a soft, wide-radius starfield/halo
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = gaussian(rand) * 2.1;
    out[i * 3 + 1] = gaussian(rand) * 1.35;
    out[i * 3 + 2] = gaussian(rand) * 2.1 - 0.6;
  }
  return out;
}

export function spiral(count) {
  // Journal: a gentle expanding spiral, evoking a timeline unwinding outward
  const out = new Float32Array(count * 3);
  const turns = 3.2;
  const maxRadius = 2.7;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 2 * turns;
    const radius = t * maxRadius;
    const jitterA = rand() * Math.PI * 2;
    const jitterR = 0.05 * (0.3 + t) * rand();
    out[i * 3] = Math.cos(angle) * radius + Math.cos(jitterA) * jitterR;
    out[i * 3 + 1] = Math.sin(angle) * radius + Math.sin(jitterA) * jitterR;
    out[i * 3 + 2] = (rand() - 0.5) * 0.35 * (0.4 + t);
  }
  return out;
}

export const SHAPES = {
  torusKnot,
  sphereNetwork,
  trefoil,
  ring,
  comet,
  starburst,
  halo,
  spiral,
};

/** Random high-frequency scatter offsets used for the mid-transition "static" burst. */
export function scatterField(count, radius = 3.2) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rand() - 0.5) * 2 * radius;
    out[i * 3 + 1] = (rand() - 0.5) * 2 * radius;
    out[i * 3 + 2] = (rand() - 0.5) * 2 * radius;
  }
  return out;
}
