// Scene 3 — Rooftop Kite Observatory. Dusk, patterned kites, a veiled moon and
// a telescope on the roof. The richest scene: it is the cover shot.
import { INK } from './config.js';
import { cloud, kite, moon, plate, rr, sparkle } from './helpers.js';

export const sceneObservatory = {
  id: 'observatory',
  name: 'Rooftop Kite Observatory',
  short: 'Observatory',
  tagline: 'Kites over the rooftops, a moon behind the rain.',
  seconds: 180,
  differences: [
    { id: 'kite-tail', label: 'the big kite tail bends the other way', x: 185, y: 250, r: 30 },
    { id: 'kite-stripe', label: 'the small kite lost a stripe', x: 430, y: 120, r: 30 },
    { id: 'telescope', label: 'the telescope points down, not up', x: 300, y: 315, r: 30 },
    { id: 'moon-veil', label: 'the cloud veiling the moon is gone', x: 90, y: 80, r: 30 },
    { id: 'smoke-puffs', label: 'the chimney smoke lost a puff', x: 525, y: 228, r: 26 },
    { id: 'antenna', label: 'the antenna dish is missing', x: 560, y: 190, r: 26 },
    { id: 'window-open', label: 'the attic window is shut, not open', x: 430, y: 330, r: 26 },
    { id: 'star-count', label: 'a star vanished from the sky', x: 250, y: 70, r: 30 },
  ],

  paint(ctx, variant) {
    const changed = variant === 1;

    // Dusk sky, deep at the top, lighter toward the rooftops.
    const sky = ctx.createLinearGradient(0, 0, 0, 360);
    sky.addColorStop(0, INK.duskDeep);
    sky.addColorStop(0.55, INK.dusk);
    sky.addColorStop(1, '#6a6390');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 600, 360);
    ctx.fillStyle = '#3d3a5e';
    ctx.fillRect(0, 360, 600, 80);

    // A loose cluster of stars, upper centre: seven, or six when changed.
    const stars = [
      [212, 52, 7], [246, 38, 5], [282, 58, 7], [228, 84, 5],
      [268, 78, 6], [300, 40, 4], [316, 82, 5],
    ];
    stars.forEach(([sx, sy, sr], i) => {
      if (changed && i === 4) return;
      sparkle(ctx, sx, sy, sr, '#ffe9a8');
    });
    sparkle(ctx, 520, 60, 6, '#ffe9a8');
    sparkle(ctx, 560, 110, 4, '#ffe9a8');
    sparkle(ctx, 40, 160, 5, '#ffe9a8');
    sparkle(ctx, 340, 150, 4, '#ffe9a8');

    // Crescent moon, top left, veiled by a rain cloud — unless changed.
    moon(ctx, 90, 80, 30, '#ffe9a8');
    if (!changed) {
      cloud(ctx, 96, 84, 0.62, '#5a5680');
      ctx.strokeStyle = '#8fa8cc';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i += 1) {
        const rx = 72 + i * 14;
        ctx.beginPath();
        ctx.moveTo(rx, 108);
        ctx.lineTo(rx - 4, 122);
        ctx.stroke();
      }
    }

    // Two patterned kites. The big one's tail bends the other way when changed;
    // the small one loses a stripe.
    kite(ctx, 170, 150, 0.9, INK.teal, INK.coral, changed ? -1 : 1, 3);
    kite(ctx, 430, 120, 0.72, INK.mustard, INK.plum, 1, changed ? 2 : 3);
    ctx.strokeStyle = 'rgba(246,236,215,0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(170, 184);
    ctx.quadraticCurveTo(220, 260, 250, 350);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(430, 145);
    ctx.quadraticCurveTo(420, 240, 400, 350);
    ctx.stroke();

    // Drifting clouds.
    cloud(ctx, 320, 210, 0.6, '#5a5680');
    cloud(ctx, 60, 250, 0.5, '#5a5680');
    cloud(ctx, 540, 300, 0.45, '#5a5680');

    // Rooftop parapet and building body.
    ctx.fillStyle = '#4a4468';
    ctx.fillRect(0, 352, 600, 88);
    ctx.fillStyle = '#5d5680';
    ctx.fillRect(0, 352, 600, 10);
    ctx.fillStyle = '#3d3a5e';
    for (let i = 0; i < 12; i += 1) ctx.fillRect(10 + i * 50, 380, 30, 44);
    ctx.strokeStyle = '#2e2b4a';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i += 1) ctx.strokeRect(10 + i * 50, 380, 30, 44);

    // Gabled attic with a round window: open, or shut when changed.
    ctx.fillStyle = '#4a4468';
    ctx.beginPath();
    ctx.moveTo(380, 352);
    ctx.lineTo(430, 300);
    ctx.lineTo(480, 352);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2e2b4a';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#ffe9a8';
    ctx.beginPath();
    ctx.arc(430, 332, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    if (changed) {
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(418, 332);
      ctx.lineTo(442, 332);
      ctx.moveTo(430, 320);
      ctx.lineTo(430, 344);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#4a4468';
      ctx.beginPath();
      ctx.moveTo(430, 317);
      ctx.arc(430, 332, 15, -Math.PI / 2, Math.PI / 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(430, 317);
      ctx.lineTo(430, 347);
      ctx.stroke();
      ctx.fillStyle = '#ffe9a8';
      ctx.beginPath();
      ctx.arc(437, 332, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Chimney with smoke: three puffs, or two when changed.
    ctx.fillStyle = '#6b5a52';
    ctx.fillRect(508, 272, 34, 82);
    ctx.fillStyle = '#7d6b63';
    ctx.fillRect(504, 266, 42, 10);
    const puffs = changed
      ? [[520, 250, 12], [508, 212, 10]]
      : [[520, 250, 12], [528, 228, 11], [508, 212, 10]];
    ctx.fillStyle = '#cfc4dd';
    puffs.forEach(([px, py, pr]) => {
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    });

    // Antenna on a pole, right edge: the dish is gone when changed.
    ctx.strokeStyle = '#2e2b4a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(566, 352);
    ctx.lineTo(566, 196);
    ctx.stroke();
    if (!changed) {
      ctx.fillStyle = '#cfc4dd';
      ctx.beginPath();
      ctx.arc(556, 186, 14, Math.PI * 0.15, Math.PI * 1.15);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(556, 186);
      ctx.lineTo(566, 196);
      ctx.stroke();
    }

    // Telescope on a tripod: pointing up, or down when changed.
    ctx.strokeStyle = '#2e2b4a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(300, 352);
    ctx.lineTo(282, 318);
    ctx.moveTo(300, 352);
    ctx.lineTo(318, 318);
    ctx.moveTo(300, 352);
    ctx.lineTo(300, 316);
    ctx.stroke();
    ctx.save();
    ctx.translate(300, 310);
    ctx.rotate(changed ? Math.PI : -0.7);
    ctx.fillStyle = INK.teal;
    rr(ctx, -8, -34, 16, 62, 7);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2.5;
    rr(ctx, -8, -34, 16, 62, 7);
    ctx.stroke();
    ctx.fillStyle = INK.mustard;
    rr(ctx, -8, -34, 16, 10, 5);
    ctx.fill();
    ctx.restore();

    // Laundry line with pennants, left.
    ctx.strokeStyle = '#2e2b4a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 352);
    ctx.lineTo(60, 288);
    ctx.moveTo(260, 352);
    ctx.lineTo(260, 288);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 290);
    ctx.quadraticCurveTo(160, 300, 260, 290);
    ctx.stroke();
    const pennants = [INK.coral, INK.mustard, INK.teal];
    pennants.forEach((c, i) => {
      const px = 100 + i * 55;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(px - 10, 292);
      ctx.lineTo(px + 10, 292);
      ctx.lineTo(px, 312);
      ctx.closePath();
      ctx.fill();
    });

    // A cat watching the kites from the parapet.
    ctx.fillStyle = INK.navy;
    ctx.beginPath();
    ctx.ellipse(150, 344, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(158, 330, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(153, 325);
    ctx.lineTo(155, 318);
    ctx.lineTo(159, 324);
    ctx.moveTo(160, 324);
    ctx.lineTo(163, 318);
    ctx.lineTo(164, 325);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(139, 346);
    ctx.quadraticCurveTo(130, 340, 132, 330);
    ctx.stroke();

    plate(ctx, 20, 408, 132, 20, 'KITE OBSERVATORY');
  },
};
