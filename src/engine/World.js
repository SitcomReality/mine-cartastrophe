import { MIN_SPEED, MAX_SPEED, ACCELERATION, BASE_SPEED } from './constants.js';

export function createWorldState(initialBiome) {
  return {
    distance: 0,
    speed: BASE_SPEED,
    targetSpeed: BASE_SPEED,
    biome: initialBiome,
    elapsed: 0,
    frameCount: 0,
    paused: false
  };
}

export function tickWorld(state, dt) {
  if (state.paused) return;

  state.elapsed += dt;
  state.frameCount++;

  // Approach target speed
  if (state.speed < state.targetSpeed) {
    state.speed = Math.min(state.speed + ACCELERATION * dt, state.targetSpeed);
  } else if (state.speed > state.targetSpeed) {
    state.speed = Math.max(state.speed - ACCELERATION * dt, state.targetSpeed);
  }

  state.distance += state.speed * dt;
}