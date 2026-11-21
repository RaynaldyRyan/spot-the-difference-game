// The scene registry: the four connected scenes in play order, and the
// offscreen renders each panel draws from.
import { SCENE_H, SCENE_W } from './config.js';
import { sceneGreenhouse } from './scene-greenhouse.js';
import { sceneArchive } from './scene-archive.js';
import { sceneObservatory } from './scene-observatory.js';
import { sceneThundercloud } from './scene-thundercloud.js';

export const SCENES = [sceneGreenhouse, sceneArchive, sceneObservatory, sceneThundercloud];

export function sceneById(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}

/** Render one scene variant (0 = original, 1 = changed) to an offscreen canvas. */
export function renderScene(scene, variant) {
  const canvas = document.createElement('canvas');
  canvas.width = SCENE_W;
  canvas.height = SCENE_H;
  const ctx = canvas.getContext('2d');
  scene.paint(ctx, variant);
  return canvas;
}

/** Both panels of a scene, rendered once and reused until the scene changes. */
export function renderScenePair(scene) {
  return [renderScene(scene, 0), renderScene(scene, 1)];
}
