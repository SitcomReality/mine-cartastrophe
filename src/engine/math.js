export const vec3 = {
  create: (x = 0, y = 0, z = 0) => ({ x, y, z }),
  add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
  sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
  scale: (v, s) => ({ x: v.x * s, y: v.y * s, z: v.z * s }),
  length: (v) => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z),
  normalize: (v) => {
    const len = vec3.length(v);
    return len === 0 ? { x: 0, y: 0, z: 0 } : vec3.scale(v, 1 / len);
  },
  lerp: (a, b, t) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  }),
  clone: (v) => ({ ...v }),
};

export const color = {
  toRgba: (c, alpha) => {
    const a = alpha ?? c.a ?? 1;
    return `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${a})`;
  },
  toRgb: (c) => `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`,
  lerp: (a, b, t) => ({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
    a: (a.a ?? 1) + ((b.a ?? 1) - (a.a ?? 1)) * t,
  }),
  darken: (c, amount) => ({
    r: c.r * (1 - amount),
    g: c.g * (1 - amount),
    b: c.b * (1 - amount),
    a: c.a,
  }),
};

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const createRNG = (seed) => {
  let state = seed;
  return {
    next: () => {
      state |= 0; state = (state + 0x6d2b79f5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    range: (min, max) => min + (((createRNG(state)).next()) * (max - min)),
    chance: (p) => (createRNG(state)).next() < p,
    setSeed: (s) => { state = s; }
  };
};