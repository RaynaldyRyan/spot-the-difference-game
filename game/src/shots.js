// Deterministic screenshot scenes behind ?shot=cover|scene2|hint|finish. Each
// one plays the real rules forward from a fresh scene — finds go through
// GameState.markAt, so the markers, counter, score and overlays are genuine
// game state, and the same URL always gives the same frame.
import { SCENES } from './scenes.js';
import { SCREEN_ALL_DONE, SCREEN_SCENE_DONE } from './state.js';

/** Apply finds by difference index, through the real mark logic. */
function applyFinds(state, indices) {
  for (const i of indices) {
    const diff = state.scene.differences[i];
    state.markAt(diff.x, diff.y);
  }
}

const SHOTS = {
  // Cover: the richest scene, 3 found, 5 left, mid-hunt.
  cover(state) {
    state.startScene(2);
    state.elapsed = 47;
    applyFinds(state, [0, 1, 3]);
  },
  // A different scene in active play: 2 found, 6 left.
  scene2(state) {
    state.startScene(0);
    state.elapsed = 23;
    applyFinds(state, [0, 5]);
  },
  // The densest scene with a hint glowing: 5 found, 3 left.
  hint(state) {
    state.startScene(3);
    state.elapsed = 96;
    applyFinds(state, [0, 1, 2, 3, 4]);
    state.useHint();
  },
  // A finished scene: all 8 found, results card over the scene.
  finish(state) {
    state.startScene(1);
    state.elapsed = 95;
    applyFinds(state, [0, 1, 2, 3, 4, 5, 6, 7]);
  },
};

/**
 * Stage the named shot, or return false when there is none. Shot mode freezes
 * the timer so the frame never changes between load and capture.
 */
export function stageShot(name, state) {
  const stage = SHOTS[name];
  if (!stage) return false;
  state.shotMode = true;
  state.score = 0;
  stage(state);
  // Keep the completion card visible for the finish shot even though the
  // scene is done; nothing else advances the screen in shot mode.
  if (name === 'finish' && state.screen !== SCREEN_SCENE_DONE && state.screen !== SCREEN_ALL_DONE) {
    state.screen = SCREEN_SCENE_DONE;
  }
  return true;
}

export function shotSceneNames() {
  return SCENES.map((s) => s.id);
}
