import { createRNG } from 'engine/math.js';

export class BaseBiome {
  constructor(config, seed) {
    this.config = config;
    this.rng = createRNG(seed);
  }
  
  getConfig() { return this.config; }
  getId() { return this.config.id; }
  getName() { return this.config.name; }
  
  getRandomObjectType() {
    const weights = this.config.objectWeights;
    const entries = Object.entries(weights);
    if (entries.length === 0) return null;
    
    const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);
    let r = this.rng.next() * totalWeight;
    for (const [type, weight] of entries) {
      r -= weight;
      if (r <= 0) return type;
    }
    return entries[0][0];
  }
  
  shouldSpawn(freq) {
    return this.rng.next() < freq;
  }

  // To be implemented by subclasses
  generateObjects(zStart, zEnd, chunkId) {
    return [];
  }
}