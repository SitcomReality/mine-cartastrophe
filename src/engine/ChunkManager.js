import { CHUNK_LENGTH, RENDER_DISTANCE, DESPAWN_DISTANCE } from './constants.js';
import { ObjectPool } from './ObjectPool.js';

export class ChunkManager {
  constructor(biomeManager) {
    this.chunks = new Map();
    this.biomeManager = biomeManager;
    this.nextChunkId = 0;
    this.lastCameraChunk = -1;
    
    this.chunkPool = new ObjectPool(
      () => this.createEmptyChunk(),
      (chunk) => this.resetChunk(chunk),
      RENDER_DISTANCE + DESPAWN_DISTANCE
    );
  }
  
  createEmptyChunk() {
    return { id: 0, zStart: 0, zEnd: 0, objects: [], biomeId: '' };
  }
  
  resetChunk(chunk) {
    chunk.objects.length = 0;
  }
  
  generateChunk(index) {
    const chunk = this.chunkPool.acquire();
    const zStart = index * CHUNK_LENGTH;
    const zEnd = zStart + CHUNK_LENGTH;
    const biome = this.biomeManager.getBiomeAt(zStart);
    
    chunk.id = this.nextChunkId++;
    chunk.zStart = zStart;
    chunk.zEnd = zEnd;
    chunk.biomeId = biome.getId();
    chunk.objects = biome.generateObjects(zStart, zEnd, chunk.id);
    
    return chunk;
  }
  
  update(cameraZ) {
    const currentChunkIndex = Math.floor(cameraZ / CHUNK_LENGTH);
    if (currentChunkIndex === this.lastCameraChunk) return;
    this.lastCameraChunk = currentChunkIndex;
    
    const minChunk = currentChunkIndex - DESPAWN_DISTANCE;
    const maxChunk = currentChunkIndex + RENDER_DISTANCE;
    
    for (const [index, chunk] of this.chunks.entries()) {
      if (index < minChunk || index > maxChunk) {
        this.chunkPool.release(chunk);
        this.chunks.delete(index);
      }
    }
    
    for (let i = minChunk; i <= maxChunk; i++) {
      if (i < 0) continue;
      if (!this.chunks.has(i)) {
        this.chunks.set(i, this.generateChunk(i));
      }
    }
  }
  
  getVisibleChunks() {
    return Array.from(this.chunks.values()).sort((a, b) => b.zStart - a.zStart);
  }
}