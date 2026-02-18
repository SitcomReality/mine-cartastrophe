import { TARGET_FPS } from './constants.js';

/**
 * High-performance game loop with fixed timestep updates
 * and variable render rate for smooth visuals
 */
export class GameLoop {
  constructor(options) {
    this.onUpdate = options.onUpdate;
    this.onRender = options.onRender;
    this.targetFps = options.targetFps ?? TARGET_FPS;
    this.frameTime = 1000 / this.targetFps;
    
    this.isRunning = false;
    this.animationFrameId = null;
    this.lastTime = 0;
    this.accumulator = 0;
    this.time = 0;
    
    this.frameCount = 0;
    this.fpsTime = 0;
    this.currentFps = 0;
  }
  
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.fpsTime = this.lastTime;
    this.frameCount = 0;
    this.loop(this.lastTime);
  }
  
  stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  loop = (currentTime) => {
    if (!this.isRunning) return;
    
    this.animationFrameId = requestAnimationFrame(this.loop);
    
    let deltaTime = currentTime - this.lastTime;
    if (deltaTime > 250) deltaTime = 250; // Cap to prevent spirals
    
    this.lastTime = currentTime;
    this.accumulator += deltaTime;
    
    while (this.accumulator >= this.frameTime) {
      this.onUpdate(this.frameTime / 1000, this.time / 1000);
      this.time += this.frameTime;
      this.accumulator -= this.frameTime;
    }
    
    const interpolation = this.accumulator / this.frameTime;
    this.onRender(interpolation);
    
    this.frameCount++;
    if (currentTime - this.fpsTime >= 1000) {
      this.currentFps = this.frameCount;
      this.frameCount = 0;
      this.fpsTime = currentTime;
    }
  };
  
  getFps() {
    return this.currentFps;
  }
}