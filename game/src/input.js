// Pointer and keyboard input: clicks on panels and buttons, the mirrored
// keyboard cursor, and every shortcut. Input writes to the state; the
// renderer reads it back.
import { SCENE_H, SCENE_W } from './config.js';
import {
  SCREEN_ALL_DONE,
  SCREEN_PLAY,
  SCREEN_SCENE_DONE,
  SCREEN_TIME_UP,
  SCREEN_TITLE,
} from './state.js';
import {
  setMuted,
  soundClick,
  soundComplete,
  soundFind,
  soundHint,
  soundMiss,
  unlockAudio,
} from './audio.js';

const CURSOR_STEP = 14;
const CURSOR_STEP_FAST = 48;

/** Run a button action; returns true when it did something. */
export function handleAction(state, id) {
  if (id === 'mute') {
    state.muted = !state.muted;
    setMuted(state.muted);
    return true;
  }
  if (id === 'hint') {
    const pick = state.useHint();
    if (pick) soundHint();
    return pick !== null;
  }
  if (id === 'start' || id === 'again') {
    state.startGame();
    soundClick();
    return true;
  }
  if (id.startsWith('scene-')) {
    const index = Number(id.slice('scene-'.length));
    state.score = 0;
    state.misses = 0;
    state.hintsUsed = 0;
    state.startScene(index);
    soundClick();
    return true;
  }
  if (id === 'next') {
    state.nextScene();
    soundClick();
    return true;
  }
  if (id === 'replay' || id === 'retry') {
    state.startScene(state.sceneIndex);
    soundClick();
    return true;
  }
  if (id === 'title') {
    state.screen = SCREEN_TITLE;
    soundClick();
    return true;
  }
  return false;
}

function mark(state, x, y) {
  const result = state.markAt(x, y);
  if (result === 'found') {
    if (state.screen === SCREEN_SCENE_DONE || state.screen === SCREEN_ALL_DONE) soundComplete();
    else soundFind();
  } else if (result === 'miss') {
    soundMiss();
  }
  return result;
}

/** Wire pointer and keyboard events on the canvas. */
export function attachInput(canvas, state, renderer) {
  canvas.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    renderer.mouse = { x, y };
    renderer.hoverButton = renderer.buttonAt(x, y);
    state.cursorVisible = false;
  });

  canvas.addEventListener('pointerdown', (event) => {
    unlockAudio();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const button = renderer.buttonAt(x, y);
    if (button) {
      handleAction(state, button);
      return;
    }
    if (state.screen !== SCREEN_PLAY) return;
    const hit = renderer.panelFromPoint(x, y);
    if (hit) mark(state, hit.x, hit.y);
  });

  window.addEventListener('keydown', (event) => {
    unlockAudio();
    const key = event.key;
    if (key === 'm' || key === 'M') {
      handleAction(state, 'mute');
      return;
    }
    if (state.screen === SCREEN_TITLE) {
      if (key === 'Enter') handleAction(state, 'start');
      else if (key >= '1' && key <= '4') handleAction(state, `scene-${Number(key) - 1}`);
      return;
    }
    if (state.screen === SCREEN_SCENE_DONE) {
      if (key === 'n' || key === 'N' || key === 'Enter') handleAction(state, 'next');
      else if (key === 'r' || key === 'R') handleAction(state, 'replay');
      else if (key === 'Escape') handleAction(state, 'title');
      return;
    }
    if (state.screen === SCREEN_TIME_UP) {
      if (key === 'r' || key === 'R' || key === 'Enter') handleAction(state, 'retry');
      else if (key === 'Escape') handleAction(state, 'title');
      return;
    }
    if (state.screen === SCREEN_ALL_DONE) {
      if (key === 'Enter') handleAction(state, 'again');
      else if (key === 'Escape') handleAction(state, 'title');
      return;
    }
    if (state.screen !== SCREEN_PLAY) return;
    const step = event.shiftKey ? CURSOR_STEP_FAST : CURSOR_STEP;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      state.cursorVisible = true;
      if (key === 'ArrowLeft') state.cursor.x = Math.max(0, state.cursor.x - step);
      if (key === 'ArrowRight') state.cursor.x = Math.min(SCENE_W, state.cursor.x + step);
      if (key === 'ArrowUp') state.cursor.y = Math.max(0, state.cursor.y - step);
      if (key === 'ArrowDown') state.cursor.y = Math.min(SCENE_H, state.cursor.y + step);
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      state.cursorVisible = true;
      mark(state, state.cursor.x, state.cursor.y);
    } else if (key === 'h' || key === 'H') {
      handleAction(state, 'hint');
    } else if (key === 'Escape') {
      handleAction(state, 'title');
    }
  });
}
