import { BaseBiome } from './BaseBiome.js';
import { TIE_SPACING } from 'engine/constants.js';

const CONFIG = {
  id: 'deep_mine',
  name: 'The Deep Mine',
  fogColor: { r: 12, g: 8, b: 15 },
  fogDensity: 0.04,
  ambientLight: 0.15,
  tunnelWidth: 7,
  tunnelHeight: 5.5,
  wallColor: { r: 38, g: 32, b: 28 },
  floorColor: { r: 28, g: 24, b: 22 },
  ceilingColor: { r: 25, g: 20, b: 18 },
  trackColor: { r: 55, g: 45, b: 35 },
  railColor: { r: 95, g: 85, b: 75 },
  supportBeamFrequency: 0.25,
  lanternFrequency: 0.15,
  decorationDensity: 0.4,
  objectWeights: {
    support_beam: 1.0,
    lantern: 0.6,
    stalactite: 0.4,
    rubble: 0.3,
  },
  hasLeftWall: true,
  hasRightWall: true,
  hasCeiling: true,
  hasFloor: true,
  floorEdgeWidth: 7,
  abyssDepth: 0,
  abyssGlowIntensity: 0,
};

export class DeepMineBiome extends BaseBiome {
  constructor(seed) {
    super(CONFIG, seed);
  }
  
  generateObjects(zStart, zEnd, chunkId) {
    const objects = [];
    this.rng.setSeed(chunkId * 7919 + 12345);
    
    for (let z = zStart; z < zEnd; z += TIE_SPACING) {
      objects.push({ type: 'rail_tie', position: { x: 0, y: 0, z }, rotation: 0, scale: 1 });
    }
    
    // Simple logic for supports
    if (this.shouldSpawn(this.config.supportBeamFrequency)) {
      const z = (zStart + zEnd) / 2;
      objects.push({ type: 'support_beam', position: { x: -3.2, y: 0, z }, rotation: 0, scale: 1 });
      objects.push({ type: 'support_beam', position: { x: 3.2, y: 0, z }, rotation: Math.PI, scale: 1 });
    }

    return objects;
  }
}