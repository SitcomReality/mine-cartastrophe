import { BaseBiome } from './BaseBiome.js';
import { TIE_SPACING } from 'engine/constants.js';

const CONFIG = {
  id: 'cavernous_abyss',
  name: 'The Cavernous Abyss',
  fogColor: { r: 5, g: 3, b: 8 },
  fogDensity: 0.025,
  ambientLight: 0.08,
  tunnelWidth: 25,
  tunnelHeight: 15,
  wallColor: { r: 25, g: 20, b: 22 },
  floorColor: { r: 35, g: 28, b: 25 },
  ceilingColor: { r: 15, g: 12, b: 14 },
  trackColor: { r: 50, g: 40, b: 32 },
  railColor: { r: 85, g: 75, b: 65 },
  curvatureFrequency: 0.008,
  curvatureAmplitude: 28.0,
  verticalFrequency: 0.005,
  verticalAmplitude: 5.0,
  supportBeamFrequency: 0.1,
  lanternFrequency: 0.08,
  decorationDensity: 0.2,
  objectWeights: {
    lantern: 0.4,
    stalactite: 0.8,
    rubble: 0.2,
    chain: 0.4,
  },
  hasLeftWall: false,
  hasRightWall: true,
  hasCeiling: true,
  hasFloor: false,
  floorEdgeWidth: 2.5,
  abyssDepth: 100,
  abyssGlowIntensity: 0.15,
};

export class CavernousAbyssBiome extends BaseBiome {
  constructor(seed) {
    super(CONFIG, seed);
  }

  generateObjects(zStart, zEnd, chunkId) {
    const objects = [];
    this.rng.setSeed(chunkId * 7919 + 54321);
    
    for (let z = zStart; z < zEnd; z += TIE_SPACING) {
      objects.push({ type: 'rail_tie', position: { x: 0, y: 0, z }, rotation: 0, scale: 1 });
    }

    if (this.shouldSpawn(0.1)) {
      const z = (zStart + zEnd) / 2;
      objects.push({ type: 'stalactite', position: { x: this.rng.range(-5, 5), y: 10, z }, rotation: 0, scale: 2 });
    }

    return objects;
  }
}