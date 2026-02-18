export const TARGET_FPS = 60;
export const FRAME_TIME = 1000 / TARGET_FPS;

// World generation
export const CHUNK_LENGTH = 50;
export const RENDER_DISTANCE = 8;
export const DESPAWN_DISTANCE = 2;

// Track properties
export const TRACK_WIDTH = 2.5;
export const RAIL_SPACING = 2.0;
export const TIE_SPACING = 1.5;
export const RAIL_HEIGHT = 0.1;

// Camera defaults
export const DEFAULT_FOV = 75;
export const CAMERA_HEIGHT = 1.2;
export const CAMERA_SHAKE_INTENSITY = 0.015;
export const CAMERA_SHAKE_FREQUENCY = 12;

// Movement
export const BASE_SPEED = 15;
export const MAX_SPEED = 40;
export const MIN_SPEED = 5;
export const ACCELERATION = 8;

// Rendering
export const NEAR_PLANE = 0.1;
export const FAR_PLANE = CHUNK_LENGTH * RENDER_DISTANCE;

// Lighting
export const AMBIENT_FLICKER_SPEED = 3;
export const AMBIENT_FLICKER_AMOUNT = 0.08;

export const WORLD_SEED = 42;