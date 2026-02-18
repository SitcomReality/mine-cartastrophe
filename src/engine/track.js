/**
 * Procedural track sampling.
 */
import { fbm1D } from './noise.js';

const DX_STEP = 0.1;

export function sampleTrack(t, biome) {
  const seed = biome.seedOffset || 0;

  const xAt = (s) =>
    fbm1D(s * (biome.curvatureFrequency || 0.02), seed + 1, 4) * (biome.curvatureAmplitude || 0.7);

  const yAt = (s) =>
    fbm1D(s * (biome.verticalFrequency || 0.02), seed + 2, 3) * (biome.verticalAmplitude || 0.2);

  const xOffset = xAt(t);
  const yOffset = yAt(t);
  const dX = (xAt(t + DX_STEP) - xAt(t - DX_STEP)) / (2 * DX_STEP);
  const dY = (yAt(t + DX_STEP) - yAt(t - DX_STEP)) / (2 * DX_STEP);

  return { xOffset, yOffset, dX, dY };
}