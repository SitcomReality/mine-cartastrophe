/**
 * Placeholder entrypoint for Mine Cartastrophe.
 * Right now it only sets up the canvas and a minimal resize handler.
 */

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvasToDisplaySize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr * 0.5625)); // keep 16:9-ish physical pixels
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  renderPlaceholder();
}

function renderPlaceholder() {
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);

  // simple vignette + centered text
  ctx.clearRect(0, 0, w, h);

  // background
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#0b0908');
  g.addColorStop(1, '#030201');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // subtle center rectangle
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  const pad = Math.min(40, w * 0.06);
  roundRect(ctx, pad, pad, w - pad * 2, h - pad * 2, 8);
  ctx.fill();

  // title text
  ctx.fillStyle = '#d4620a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.max(18, Math.floor(w * 0.05))}px "Courier New", monospace`;
  ctx.fillText('Mine Cartastrophe', w / 2, h / 2 - 8);

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.font = '12px sans-serif';
  ctx.fillText('Placeholder canvas — game will render here', w / 2, h / 2 + 24);
}

function roundRect(ctx, x, y, w, h, r) {
  const min = Math.min(w, h) / 2;
  r = Math.min(r, min);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

window.addEventListener('resize', resizeCanvasToDisplaySize);
resizeCanvasToDisplaySize();

// set document title explicitly (redundant with HTML but nice for scripts)
document.title = 'Mine Cartastrophe';