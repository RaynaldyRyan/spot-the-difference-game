// Shared constants for The Cloud Cartographer's Lost Forecast: scene size, palette,
// timing and scoring. One place to tune the whole game.
export const SCENE_W = 600;
export const SCENE_H = 440;

// Cut-paper / risograph palette: limited inks on warm paper.
export const INK = {
  paper: '#f6ecd7',
  paperDark: '#efe0c2',
  navy: '#22304a',
  navySoft: '#3a4a6b',
  teal: '#2e7f7a',
  tealLight: '#7fb8b2',
  coral: '#e4573d',
  coralSoft: '#f08a73',
  mustard: '#e9a13b',
  mustardLight: '#f4c876',
  sky: '#a9c9e2',
  skyDeep: '#7fa8cc',
  sage: '#8fae8b',
  sageDark: '#5f8261',
  plum: '#6b4f7a',
  plumLight: '#9a7fa8',
  cream: '#fdf6e3',
  white: '#ffffff',
  dusk: '#4a4a72',
  duskDeep: '#35355c',
};

// Scoring and timing.
export const SCORE_FIND = 100;
export const SCORE_STREAK_BONUS = 10; // per find in an unbroken streak
export const SCORE_HINT_COST = 50;
export const SCORE_MISS_COST = 10;
export const SCORE_TIME_BONUS_PER_SECOND = 10;
export const HINT_COOLDOWN_SECONDS = 12;
export const HINT_GLOW_SECONDS = 4;
export const MISS_MARK_SECONDS = 0.9;
export const FIND_PULSE_SECONDS = 0.55;

// Hit tolerance in scene pixels: generous, so a near miss still feels fair.
export const HIT_RADIUS_MIN = 30;

export const TITLE = "The Cloud Cartographer's Lost Forecast";
export const SUBTITLE = 'Spot the difference · 4 scenes · 32 differences';
