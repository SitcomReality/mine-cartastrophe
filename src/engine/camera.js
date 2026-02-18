import { vec3 } from './math.js';
import { noise1D } from './noise.js';
import { DEFAULT_FOV, CAMERA_HEIGHT, CAMERA_SHAKE_INTENSITY, CAMERA_SHAKE_FREQUENCY } from './constants.js';

export class Camera {
  constructor(config = {}) {
    this.fov = config.fov ?? DEFAULT_FOV;
    this.height = config.height ?? CAMERA_HEIGHT;
    this.shakeIntensity = config.shakeIntensity ?? CAMERA_SHAKE_INTENSITY;
    this.shakeFrequency = config.shakeFrequency ?? CAMERA_SHAKE_FREQUENCY;

    this.position = vec3.create(0, this.height, 0);
    this.rotation = vec3.create(0, 0, 0);
    this.targetPosition = vec3.clone(this.position);
    this.targetRotation = vec3.clone(this.rotation);
    
    this.smoothSpeed = 8;
    this.w = 800;
    this.h = 600;
  }

  setScreenSize(w, h) {
    this.w = w;
    this.h = h;
  }

  update(dt, trackZ, speed, time) {
    this.targetPosition.z = trackZ;
    this.targetPosition.y = this.height;

    const shake = this.shakeIntensity * (speed / 15);
    const sx = noise1D(time * this.shakeFrequency, 1) * shake;
    const sy = noise1D(time * this.shakeFrequency, 2) * shake;
    const sr = noise1D(time * this.shakeFrequency * 0.5, 3) * shake * 0.5;

    const t = 1 - Math.exp(-this.smoothSpeed * dt);
    this.position = vec3.lerp(this.position, this.targetPosition, t);
    this.rotation = vec3.lerp(this.rotation, this.targetRotation, t);

    this.position.x += sx;
    this.position.y += sy;
    this.rotation.z = sr;
  }

  project(point) {
    const rx = point.x - this.position.x;
    const ry = point.y - this.position.y;
    const rz = point.z - this.position.z;

    if (rz <= 0.1) return null;

    const fovRad = (this.fov * Math.PI) / 180;
    const fovScale = 1 / Math.tan(fovRad / 2);
    const scale = fovScale / rz;

    return {
      x: this.w / 2 + (rx * scale * this.h / 2),
      y: this.h / 2 - (ry * scale * this.h / 2),
      scale
    };
  }

  getDepthFactor(z, maxDist) {
    return Math.max(0, Math.min(1, (z - this.position.z) / maxDist));
  }
}