import { DeepMineBiome } from './DeepMine.js';
import { WORLD_SEED, CHUNK_LENGTH } from 'engine/constants.js';
import { color, clamp, lerp } from 'engine/math.js';

export class BiomeManager {
  constructor(seed = WORLD_SEED) {
    this.biomes = new Map();
    this.zones = [];
    this.transitionLength = CHUNK_LENGTH * 3;
    
    this.registerBiome(new DeepMineBiome(seed));
    this.generateBiomeZones();
  }
  
  registerBiome(biome) {
    this.biomes.set(biome.getId(), biome);
  }
  
  generateBiomeZones() {
    const zoneLength = CHUNK_LENGTH * 20;
    this.zones = [
      { biomeId: 'deep_mine', startZ: 0, endZ: zoneLength },
      // Expansion point for more biomes
    ];
  }
  
  getZoneAt(z) {
    const totalLength = this.zones[this.zones.length - 1].endZ;
    const cycleZ = z % totalLength;
    for (const zone of this.zones) {
      if (cycleZ >= zone.startZ && cycleZ < zone.endZ) return zone;
    }
    return this.zones[0];
  }
  
  getBiomeAt(z) {
    const zone = this.getZoneAt(z);
    return this.biomes.get(zone.biomeId) || this.biomes.get('deep_mine');
  }
  
  getCurrentConfig(z) {
    // Basic config getter for now, blending logic can be re-added when 2nd biome exists
    return this.getBiomeAt(z).getConfig();
  }
}