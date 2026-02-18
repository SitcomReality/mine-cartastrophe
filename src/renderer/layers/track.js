import { color } from 'engine/math.js';
import { sampleTrack } from 'engine/track.js';
import { FAR_PLANE, TRACK_WIDTH, RAIL_SPACING } from 'engine/constants.js';

export class TrackLayer {
  render(renderCtx, chunks) {
    const { canvasCtx, camera, biome } = renderCtx;
    
    // Draw Rails
    this.renderRails(renderCtx);

    // Draw Chunk Objects (Ties)
    for (const chunk of chunks) {
      for (const obj of chunk.objects) {
        if (obj.type === 'rail_tie') {
          this.renderTie(renderCtx, obj);
        }
      }
    }
  }

  renderRails(ctx) {
    const { canvasCtx, camera, biome } = ctx;
    const segments = 60;
    const step = FAR_PLANE / segments;
    const railOffset = RAIL_SPACING / 2;

    canvasCtx.strokeStyle = color.toRgb(color.lerp(biome.railColor, biome.fogColor, 0.2));
    canvasCtx.lineWidth = 2;

    for (let side = -1; side <= 1; side += 2) {
      canvasCtx.beginPath();
      let first = true;
      for (let i = 0; i <= segments; i++) {
        const z = camera.position.z + i * step;
        const track = sampleTrack(z, biome);
        
        const yaw = Math.atan2(track.dX, 1);
        const px = track.xOffset + Math.cos(yaw) * (railOffset * side);
        const pz = z - Math.sin(yaw) * (railOffset * side);

        const p = camera.project({
          x: px,
          y: track.yOffset + 0.1,
          z: pz
        });
        
        if (!p) {
          if (!first) break;
          continue;
        }
        if (first) {
          canvasCtx.moveTo(p.x, p.y);
          first = false;
        } else {
          canvasCtx.lineTo(p.x, p.y);
        }
      }
      canvasCtx.stroke();
    }
  }

  renderTie(ctx, obj) {
    const { canvasCtx, camera, biome } = ctx;
    const { z } = obj.position;
    const track = sampleTrack(z, biome);
    const w = RAIL_SPACING * 0.8;
    const d = 0.4; // thickness
    
    const yaw = Math.atan2(track.dX, 1);
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);

    const getCorner = (dx, dz) => ({
      x: track.xOffset + dx * cosY + dz * sinY,
      y: track.yOffset,
      z: z - dx * sinY + dz * cosY
    });

    const p1 = camera.project(getCorner(-w, 0));
    const p2 = camera.project(getCorner(w, 0));
    const p3 = camera.project(getCorner(w, d));
    const p4 = camera.project(getCorner(-w, d));

    if (!p1 || !p2 || !p3 || !p4) return;

    const depth = camera.getDepthFactor(z, FAR_PLANE);
    canvasCtx.fillStyle = color.toRgb(color.lerp(biome.trackColor, biome.fogColor, depth));
    
    canvasCtx.beginPath();
    canvasCtx.moveTo(p1.x, p1.y);
    canvasCtx.lineTo(p2.x, p2.y);
    canvasCtx.lineTo(p3.x, p3.y);
    canvasCtx.lineTo(p4.x, p4.y);
    canvasCtx.closePath();
    canvasCtx.fill();
  }
}