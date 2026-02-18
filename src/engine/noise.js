import { lerp, smoothstep, createRNG } from './math.js';

export const noise1D = (x, seed = 0) => {
  const ix = Math.floor(x);
  const fx = x - ix;
  const rng1 = createRNG(ix + seed * 10000);
  const rng2 = createRNG(ix + 1 + seed * 10000);
  return lerp(rng1.next(), rng2.next(), smoothstep(0, 1, fx));
};

export const fbm1D = (x, seed, octaves = 4, lacunarity = 2.0, gain = 0.5) => {
  let value = 0;
  let amp = 1;
  let freq = 1;
  let max = 0;
  for (let i = 0; i < octaves; i++) {
    value += noise1D(x * freq, seed + i * 1000) * amp;
    max += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return value / max;
};