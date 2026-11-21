// Boot: size the canvas to the window (device pixels for crisp art), stage a
// screenshot scene when ?shot= is present, and run the frame loop.
import { GameState } from './state.js';
import { Renderer } from './render.js';
import { attachInput } from './input.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const statusEl = document.getElementById('status');
const state = new GameState();
const renderer = new Renderer(canvas, state);

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', resize);
resize();

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) stageShot(shot, state);

attachInput(canvas, state, renderer);

let last = performance.now();
let lastStatus = '';
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  state.tick(dt);
  renderer.draw();
  // Announce progress to screen readers when it changes.
  const status = `${state.scene.name}: ${state.remaining} differences left, score ${state.score}`;
  if (status !== lastStatus && state.screen !== 'title') {
    statusEl.textContent = status;
    lastStatus = status;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
