export class AtmosphereLayer {
  render(ctx) {
    const { canvasCtx, w, h } = ctx;
    
    // Vignette
    const grad = canvasCtx.createRadialGradient(w/2, h/2, h*0.2, w/2, h/2, h*0.85);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.6)');
    
    canvasCtx.fillStyle = grad;
    canvasCtx.fillRect(0, 0, w, h);
  }
}