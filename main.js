import { GameLoop } from 'engine/GameLoop.js';
import { Camera } from 'engine/camera.js';
import { Renderer } from 'renderer/core.js';
import { ChunkManager } from 'engine/ChunkManager.js';
import { BiomeManager } from 'biomes/BiomeManager.js';
import { createWorldState, tickWorld } from 'engine/World.js';
import { WORLD_SEED } from 'engine/constants.js';

const canvas = document.getElementById('game-canvas');
const hudElement = document.getElementById('hud-overlay');

// Initialize Systems
const biomeManager = new BiomeManager(WORLD_SEED);
const camera = new Camera();
const renderer = new Renderer(canvas);
const chunkManager = new ChunkManager(biomeManager);
const world = createWorldState(biomeManager.getBiomeAt(0).getConfig());

function updateHUD() {
  const distKm = (world.distance / 1000).toFixed(2);
  hudElement.innerHTML = `
    <div class="hud-left">
      <span class="biome-name">${world.biome.name}</span>
      <span class="dist">${distKm} km</span>
    </div>
    <div class="hud-right">
      <span class="speed">${world.speed.toFixed(1)} u/s</span>
      <span class="fps">${loop.getFps()} fps</span>
    </div>
  `;
}

// Simulation Tick (Fixed Timestep)
function onUpdate(dt, time) {
  tickWorld(world, dt);
  const currentBiome = biomeManager.getBiomeAt(world.distance).getConfig();
  camera.update(dt, world.distance, world.speed, time, currentBiome);
  chunkManager.update(camera.position.z);
  world.biome = biomeManager.getCurrentConfig(camera.position.z);
}

// Rendering Tick (Variable Rate)
function onRender(interpolation) {
  const chunks = chunkManager.getVisibleChunks();
  renderer.render(camera, chunks, world.biome, performance.now() / 1000);
  updateHUD();
}

const loop = new GameLoop({ onUpdate, onRender });

// Input Handling
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') world.targetSpeed = Math.min(world.targetSpeed + 5, 40);
  if (e.key === 'ArrowDown') world.targetSpeed = Math.max(world.targetSpeed - 5, 5);
  if (e.key === ' ') world.paused = !world.paused;
});

window.addEventListener('resize', () => {
  renderer.resize();
  camera.setScreenSize(renderer.w, renderer.h);
});

// Start
renderer.resize();
camera.setScreenSize(renderer.w, renderer.h);
loop.start();