import { color } from 'engine/math.js';
import { sampleTrack } from 'engine/track.js';
import { FAR_PLANE } from 'engine/constants.js';

export class TunnelLayer {
  render(renderCtx, chunks) {
    const { canvasCtx, camera, biome } = renderCtx;
    
    // Sort chunks far to near for painters algorithm
    const sortedChunks = [...chunks].sort((a, b) => b.zStart - a.zStart);
    
    for (const chunk of sortedChunks) {
      const step = 2.5; // Tunnel segment length
      for (let z = chunk.zEnd; z > chunk.zStart; z -= step) {
        if (z < camera.position.z - 5) continue; // Behind camera
        if (z > camera.position.z + FAR_PLANE) continue;

        this.renderSegment(renderCtx, z, z - step);
      }
    }
  }

  renderSegment(ctx, z1, z2) {
    const { canvasCtx, camera, biome } = ctx;
    const t1 = sampleTrack(z1, biome);
    const t2 = sampleTrack(z2, biome);

    const w = biome.tunnelWidth / 2;
    const h = biome.tunnelHeight;
    
    const yaw1 = Math.atan2(t1.dX, 1);
    const cos1 = Math.cos(yaw1);
    const sin1 = Math.sin(yaw1);

    const yaw2 = Math.atan2(t2.dX, 1);
    const cos2 = Math.cos(yaw2);
    const sin2 = Math.sin(yaw2);

    const corners1 = [
      { x: t1.xOffset - w * cos1, y: t1.yOffset, z: z1 + w * sin1 },
      { x: t1.xOffset + w * cos1, y: t1.yOffset, z: z1 - w * sin1 },
      { x: t1.xOffset + w * cos1, y: t1.yOffset + h, z: z1 - w * sin1 },
      { x: t1.xOffset - w * cos1, y: t1.yOffset + h, z: z1 + w * sin1 }
    ];

    const corners2 = [
      { x: t2.xOffset - w * cos2, y: t2.yOffset, z: z2 + w * sin2 },
      { x: t2.xOffset + w * cos2, y: t2.yOffset, z: z2 - w * sin2 },
      { x: t2.xOffset + w * cos2, y: t2.yOffset + h, z: z2 - w * sin2 },
      { x: t2.xOffset - w * cos2, y: t2.yOffset + h, z: z2 + w * sin2 }
    ];

    const p1 = corners1.map(c => camera.project(c));
    const p2 = corners2.map(c => camera.project(c));

    if (p1.some(p => !p) || p2.some(p => !p)) return;

    const depth = camera.getDepthFactor(z1, FAR_PLANE);
    const fog = color.toRgb(biome.fogColor);
    
    // Floor
    if (biome.hasFloor) {
      this.drawQuad(canvasCtx, p1[0], p1[1], p2[1], p2[0], color.lerp(biome.floorColor, biome.fogColor, depth));
    }
    // Ceiling
    if (biome.hasCeiling) {
      this.drawQuad(canvasCtx, p1[3], p1[2], p2[2], p2[3], color.lerp(biome.ceilingColor, biome.fogColor, depth));
    }
    // Left Wall
    if (biome.hasLeftWall) {
      this.drawQuad(canvasCtx, p1[0], p1[3], p2[3], p2[0], color.lerp(biome.wallColor, biome.fogColor, depth));
    }
    // Right Wall
    if (biome.hasRightWall) {
      this.drawQuad(canvasCtx, p1[1], p1[2], p2[2], p2[1], color.lerp(biome.wallColor, biome.fogColor, depth));
    }
  }

  drawQuad(ctx, a, b, c, d, col) {
    ctx.fillStyle = color.toRgb(col);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.closePath();
    ctx.fill();
  }
}