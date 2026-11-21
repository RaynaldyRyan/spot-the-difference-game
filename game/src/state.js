// The game state: which scene, what is found, score, timer, hints and the
// screen the player is on. Pure logic — rendering reads it, input writes it.
import {
  FIND_PULSE_SECONDS,
  HINT_COOLDOWN_SECONDS,
  HINT_GLOW_SECONDS,
  HIT_RADIUS_MIN,
  MISS_MARK_SECONDS,
  SCORE_FIND,
  SCORE_HINT_COST,
  SCORE_MISS_COST,
  SCORE_STREAK_BONUS,
  SCORE_TIME_BONUS_PER_SECOND,
} from './config.js';
import { SCENES } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_SCENE_DONE = 'scene-done';
export const SCREEN_TIME_UP = 'time-up';
export const SCREEN_ALL_DONE = 'all-done';

export class GameState {
  constructor() {
    this.screen = SCREEN_TITLE;
    this.sceneIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.streak = 0;
    this.misses = 0;
    this.hintsUsed = 0;
    this.elapsed = 0;
    this.timeBonus = 0;
    this.muted = false;
    this.hintCooldown = 0;
    this.hint = null; // { diff, until } while a hint glow is showing
    this.lastFind = null; // { diff, at } for the pulse animation
    this.lastMiss = null; // { x, y, at } in scene coords, for the red X
    this.cursor = { x: 300, y: 220 }; // scene coords, mirrored on both panels
    this.cursorVisible = false;
    this.shotMode = false; // deterministic screenshot staging: timer frozen
    this.now = 0;
  }

  get scene() {
    return SCENES[this.sceneIndex];
  }

  get remaining() {
    return this.scene.differences.length - this.found.size;
  }

  get timeLeft() {
    return Math.max(0, this.scene.seconds - this.elapsed);
  }

  get totalFound() {
    return this.found.size;
  }

  startScene(index) {
    this.sceneIndex = index;
    this.found = new Set();
    this.streak = 0;
    this.elapsed = 0;
    this.hint = null;
    this.hintCooldown = 0;
    this.lastFind = null;
    this.lastMiss = null;
    this.timeBonus = 0;
    this.cursor = { x: 300, y: 220 };
    this.screen = SCREEN_PLAY;
  }

  startGame() {
    this.score = 0;
    this.misses = 0;
    this.hintsUsed = 0;
    this.startScene(0);
  }

  /** Advance the clock; frozen in shot mode and off the play screen. */
  tick(dt) {
    this.now += dt;
    if (this.screen !== SCREEN_PLAY || this.shotMode) return;
    this.elapsed += dt;
    if (this.hintCooldown > 0) this.hintCooldown = Math.max(0, this.hintCooldown - dt);
    if (this.hint && this.now > this.hint.until) this.hint = null;
    if (this.timeLeft <= 0) this.screen = SCREEN_TIME_UP;
  }

  /** The difference at scene point (x, y), if one is unfound and within reach. */
  differenceAt(x, y) {
    for (const diff of this.scene.differences) {
      if (this.found.has(diff.id)) continue;
      const r = Math.max(diff.r, HIT_RADIUS_MIN);
      const dx = x - diff.x;
      const dy = y - diff.y;
      if (dx * dx + dy * dy <= r * r) return diff;
    }
    return null;
  }

  /**
   * Mark the difference at (x, y). Returns 'found', 'miss' or null when the
   * click is not on the play screen.
   */
  markAt(x, y) {
    if (this.screen !== SCREEN_PLAY) return null;
    const diff = this.differenceAt(x, y);
    if (diff) {
      this.found.add(diff.id);
      this.streak += 1;
      this.score += SCORE_FIND + SCORE_STREAK_BONUS * (this.streak - 1);
      this.lastFind = { diff, at: this.now };
      if (this.hint && this.hint.diff.id === diff.id) this.hint = null;
      if (this.found.size === this.scene.differences.length) this.completeScene();
      return 'found';
    }
    this.streak = 0;
    this.misses += 1;
    this.score = Math.max(0, this.score - SCORE_MISS_COST);
    this.lastMiss = { x, y, at: this.now };
    return 'miss';
  }

  completeScene() {
    this.timeBonus = Math.round(this.timeLeft) * SCORE_TIME_BONUS_PER_SECOND;
    this.score += this.timeBonus;
    this.screen = this.sceneIndex === SCENES.length - 1 ? SCREEN_ALL_DONE : SCREEN_SCENE_DONE;
  }

  nextScene() {
    if (this.sceneIndex < SCENES.length - 1) this.startScene(this.sceneIndex + 1);
  }

  /** A hint glows broadly around one still-hidden difference. Never exact. */
  useHint() {
    if (this.screen !== SCREEN_PLAY || this.hintCooldown > 0 || this.hint) return null;
    const hidden = this.scene.differences.filter((d) => !this.found.has(d.id));
    if (hidden.length === 0) return null;
    const pick = this.shotMode
      ? hidden[0]
      : hidden[Math.floor(Math.random() * hidden.length)];
    this.hintsUsed += 1;
    this.score = Math.max(0, this.score - SCORE_HINT_COST);
    this.hintCooldown = HINT_COOLDOWN_SECONDS;
    this.hint = { diff: pick, until: this.now + HINT_GLOW_SECONDS };
    return pick;
  }

  findPulseAge() {
    if (!this.lastFind) return Infinity;
    return this.now - this.lastFind.at;
  }

  missAge() {
    if (!this.lastMiss) return Infinity;
    return this.now - this.lastMiss.at;
  }

  get findPulseActive() {
    return this.findPulseAge() < FIND_PULSE_SECONDS;
  }

  get missActive() {
    return this.missAge() < MISS_MARK_SECONDS;
  }
}
