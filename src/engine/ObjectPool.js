/**
 * Generic object pool for performance optimization
 * Reuses objects instead of creating/destroying them
 */
export class ObjectPool {
  constructor(factory, reset, initialSize = 0, maxSize = 1000) {
    this.pool = [];
    this.factory = factory;
    this.reset = reset;
    this.maxSize = maxSize;
    
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factory());
    }
  }
  
  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.factory();
  }
  
  release(obj) {
    if (this.pool.length < this.maxSize) {
      this.reset(obj);
      this.pool.push(obj);
    }
  }
  
  clear() {
    this.pool.length = 0;
  }
  
  size() {
    return this.pool.length;
  }
}