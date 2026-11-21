// Scene 1 — Cloud Greenhouse. Seed-clouds grow in glass pods under a brass
// rain gauge; the gentlest scene, it teaches the visual language.
import { INK } from './config.js';
import { bird, cloud, drop, plate, rr, seedCloud, sun, tree } from './helpers.js';

export const sceneGreenhouse = {
  id: 'greenhouse',
  name: 'Cloud Greenhouse',
  short: 'Greenhouse',
  tagline: 'Seed-clouds grow in glass pods. Find 8 differences.',
  seconds: 150,
  differences: [
    { id: 'bird-wire', label: 'a bird is missing from the wire', x: 300, y: 55, r: 26 },
    { id: 'gauge-drops', label: 'the rain gauge holds fewer drops', x: 90, y: 300, r: 30 },
    { id: 'vane', label: 'the wind vane points a different way', x: 530, y: 105, r: 26 },
    { id: 'pod-seed', label: 'a seed-cloud is missing from its pod', x: 440, y: 290, r: 28 },
    { id: 'can-rose', label: 'the watering can lost its rose', x: 162, y: 348, r: 26 },
    { id: 'sun-rays', label: 'the sun has fewer rays', x: 70, y: 105, r: 34 },
    { id: 'cloud-curl', label: 'the big cloud curls the other way', x: 430, y: 100, r: 34 },
    { id: 'ladder-rungs', label: 'the ladder lost a rung', x: 350, y: 300, r: 30 },
  ],

  // variant 0 draws the original, variant 1 the changed picture.
  paint(ctx, variant) {
    const changed = variant === 1;

    // Sky: warm paper with soft horizontal bands.
    ctx.fillStyle = INK.paper;
    ctx.fillRect(0, 0, 600, 440);
    ctx.fillStyle = '#f9f1de';
    ctx.fillRect(0, 90, 600, 70);
    ctx.fillStyle = '#f3e7cb';
    ctx.fillRect(0, 230, 600, 60);

    // Sun, upper left, set below the panel label chip so the chip never
    // covers its rays or its found marker: 8 rays, or 6 when changed.
    sun(ctx, 70, 105, 26, changed ? 6 : 8, INK.mustardLight);

    // Big cloud, top right, with a curl that flips side.
    cloud(ctx, 430, 100, 1.05, INK.white);
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (changed) {
      ctx.arc(392, 88, 10, Math.PI * 0.1, Math.PI * 1.4);
    } else {
      ctx.arc(468, 88, 10, Math.PI * 1.6, Math.PI * 0.9, true);
    }
    ctx.stroke();
    cloud(ctx, 210, 140, 0.7, INK.white);
    cloud(ctx, 560, 190, 0.55, INK.white);

    // Wire with three birds; the middle bird is gone in the changed picture.
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 55);
    ctx.lineTo(450, 55);
    ctx.stroke();
    bird(ctx, 220, 48, 0.9, INK.navy, 0.2);
    if (!changed) bird(ctx, 300, 48, 0.9, INK.navy, 0.2);
    bird(ctx, 380, 48, 0.9, INK.navy, 0.2);

    // Rolling ground and a low fence.
    ctx.fillStyle = INK.sage;
    ctx.beginPath();
    ctx.moveTo(0, 392);
    ctx.quadraticCurveTo(150, 372, 300, 390);
    ctx.quadraticCurveTo(450, 406, 600, 386);
    ctx.lineTo(600, 440);
    ctx.lineTo(0, 440);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK.sageDark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 392);
    ctx.quadraticCurveTo(150, 372, 300, 390);
    ctx.quadraticCurveTo(450, 406, 600, 386);
    ctx.stroke();
    ctx.fillStyle = '#8a6a45';
    for (let i = 0; i < 5; i += 1) {
      const fx = 30 + i * 60;
      ctx.fillRect(fx, 404, 8, 26);
    }
    ctx.fillRect(20, 412, 280, 5);

    // Greenhouse dome, right side.
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.moveTo(330, 388);
    ctx.ellipse(445, 388, 115, 168, 0, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(445, 220);
    ctx.lineTo(445, 388);
    ctx.moveTo(375, 248);
    ctx.lineTo(375, 388);
    ctx.moveTo(515, 248);
    ctx.lineTo(515, 388);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(445, 388, 78, 112, 0, Math.PI, 0);
    ctx.stroke();
    ctx.restore();

    // Shelf with three glass pods; the middle seed-cloud is gone when changed.
    ctx.fillStyle = '#8a6a45';
    ctx.fillRect(352, 330, 186, 8);
    const pods = [382, 440, 498];
    pods.forEach((px, i) => {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath();
      ctx.moveTo(px - 24, 330);
      ctx.ellipse(px, 330, 24, 30, 0, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (!(changed && i === 1)) seedCloud(ctx, px, 318, 0.9, INK.sky);
    });

    // Brass rain gauge, left: five drops, or four when changed.
    ctx.fillStyle = '#b08d4f';
    rr(ctx, 68, 268, 44, 84, 8);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2.5;
    rr(ctx, 68, 268, 44, 84, 8);
    ctx.stroke();
    ctx.fillStyle = '#8a6a45';
    ctx.beginPath();
    ctx.moveTo(62, 268);
    ctx.lineTo(118, 268);
    ctx.lineTo(106, 248);
    ctx.lineTo(74, 248);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.stroke();
    const drops = changed ? 4 : 5;
    for (let i = 0; i < drops; i += 1) {
      drop(ctx, 90, 288 + i * 12, 0.55, INK.skyDeep);
    }
    ctx.strokeStyle = INK.cream;
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(104, 282 + i * 22);
      ctx.lineTo(110, 282 + i * 22);
      ctx.stroke();
    }

    // Wind vane on the dome: the arrow points east, or north when changed.
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(520, 226);
    ctx.lineTo(520, 112);
    ctx.stroke();
    ctx.fillStyle = INK.coral;
    ctx.beginPath();
    if (changed) {
      ctx.moveTo(520, 88);
      ctx.lineTo(528, 106);
      ctx.lineTo(512, 106);
    } else {
      ctx.moveTo(546, 102);
      ctx.lineTo(528, 94);
      ctx.lineTo(528, 110);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = INK.mustard;
    ctx.beginPath();
    ctx.arc(520, 112, 4, 0, Math.PI * 2);
    ctx.fill();

    // Ladder leaning on the dome: five rungs, or four when changed.
    ctx.strokeStyle = '#8a6a45';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(336, 388);
    ctx.lineTo(362, 236);
    ctx.moveTo(362, 388);
    ctx.lineTo(388, 236);
    ctx.stroke();
    ctx.lineWidth = 4;
    const rungs = changed ? 4 : 5;
    for (let i = 0; i < rungs; i += 1) {
      const t = 0.18 + (i * 0.68) / (rungs - 1);
      const y = 388 - t * 152;
      const x0 = 336 + t * 26;
      const x1 = 362 + t * 26;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
    }

    // Watering can, bottom left: the rose on its spout is gone when changed.
    ctx.fillStyle = INK.teal;
    rr(ctx, 96, 362, 52, 30, 8);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2.5;
    rr(ctx, 96, 362, 52, 30, 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(104, 362);
    ctx.quadraticCurveTo(104, 344, 122, 344);
    ctx.quadraticCurveTo(138, 344, 138, 360);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(146, 372);
    ctx.lineTo(164, 352);
    ctx.lineWidth = 5;
    ctx.stroke();
    if (!changed) {
      ctx.fillStyle = INK.teal;
      ctx.beginPath();
      ctx.ellipse(168, 346, 9, 6, -0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = INK.skyDeep;
      for (let i = 0; i < 3; i += 1) drop(ctx, 176 + i * 5, 356 + i * 7, 0.4, INK.skyDeep);
    }

    // Potted cloud plants and a ribbon pole, centre.
    ctx.fillStyle = '#c96f4a';
    rr(ctx, 236, 378, 30, 22, 4);
    ctx.fill();
    rr(ctx, 282, 382, 26, 18, 4);
    ctx.fill();
    cloud(ctx, 251, 366, 0.42, INK.white);
    cloud(ctx, 295, 372, 0.34, INK.sky);
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(310, 392);
    ctx.lineTo(310, 300);
    ctx.stroke();
    ctx.fillStyle = INK.coral;
    ctx.beginPath();
    ctx.moveTo(310, 302);
    ctx.quadraticCurveTo(340, 296, 356, 308);
    ctx.quadraticCurveTo(340, 312, 310, 312);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = INK.mustard;
    ctx.beginPath();
    ctx.moveTo(310, 316);
    ctx.quadraticCurveTo(336, 312, 348, 322);
    ctx.quadraticCurveTo(336, 326, 310, 326);
    ctx.closePath();
    ctx.fill();

    // Small trees behind the dome and a sign.
    tree(ctx, 580, 380, 0.8);
    tree(ctx, 40, 372, 0.7);
    plate(ctx, 200, 408, 92, 20, 'CLOUD NURSERY');
  },
};
