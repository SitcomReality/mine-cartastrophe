import { color } from 'engine/math.js';
import { AtmosphereLayer } from './layers/atmosphere.js';
import { TunnelLayer } from './layers/tunnel.js';
import { TrackLayer } from './layers/track.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    this.layers = [
      new TunnelLayer(),
      new TrackLayer(),
      new AtmosphereLayer()
    ];
    this.resize();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.ctx.scale(dpr, dpr);
  }

  render(camera, chunks, biome, time) {
    // Clear
    this.ctx.fillStyle = color.toRgb(biome.fogColor || {r:10, g:10, b:15});
    this.ctx.fillRect(0, 0, this.w, this.h);

    const ctx = {
      canvasCtx: this.ctx,
      w: this.w,
      h: this.h,
      camera,
      biome,
      time
    };

    // Render layers
    for (const layer of this.layers) {
      layer.render(ctx, chunks);
    }
  }
}