// Scene 4 — Inside a Migrating Thundercloud. Floating islands, suspended
// droplets and a little weather station riding a spiral of wind. The densest
// scene: it is the hint shot.
import { INK } from './config.js';
import { bird, bolt, cloud, drop, plate, rr, spiral, sparkle, tree } from './helpers.js';

export const sceneThundercloud = {
  id: 'thundercloud',
  name: 'Inside a Thundercloud',
  short: 'Thundercloud',
  tagline: 'Floating islands in the heart of a migrating storm.',
  seconds: 180,
  differences: [
    { id: 'bolt-zigs', label: 'the lightning bolt lost a zigzag', x: 110, y: 170, r: 30 },
    { id: 'droplet-count', label: 'a suspended droplet is missing', x: 330, y: 100, r: 32 },
    { id: 'island-tree', label: 'the island tree is gone', x: 455, y: 250, r: 28 },
    { id: 'spiral-dir', label: 'the wind spiral curls the other way', x: 250, y: 210, r: 36 },
    { id: 'balloon', label: 'the little balloon drifted away', x: 520, y: 90, r: 28 },
    { id: 'flag', label: 'the station flag droops instead of flying', x: 335, y: 305, r: 24 },
    { id: 'bird-flock', label: 'a bird left the flock', x: 90, y: 340, r: 28 },
    { id: 'station-window', label: 'the station window went dark', x: 300, y: 345, r: 24 },
  ],

  paint(ctx, variant) {
    const changed = variant === 1;

    // Deep indigo interior of the cloud.
    const bg = ctx.createLinearGradient(0, 0, 0, 440);
    bg.addColorStop(0, '#2e2b4a');
    bg.addColorStop(0.6, '#454468');
    bg.addColorStop(1, '#5a5480');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 440);

    // Cloud masses framing the scene.
    cloud(ctx, 60, 30, 1.1, '#6a6390');
    cloud(ctx, 300, 8, 1.3, '#6a6390');
    cloud(ctx, 560, 40, 0.9, '#6a6390');
    cloud(ctx, 40, 420, 1.2, '#6a6390');
    cloud(ctx, 560, 420, 1.1, '#6a6390');

    // Suspended droplets, upper centre: six, or five when changed.
    const drops = [
      [290, 92], [318, 76], [348, 94], [306, 116], [336, 122], [366, 112],
    ];
    drops.forEach(([dx, dy], i) => {
      if (changed && i === 3) return;
      drop(ctx, dx, dy, 0.7, INK.sky);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.arc(dx - 2, dy - 2, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Little striped balloon, top right; drifted away when changed.
    if (!changed) {
      ctx.save();
      ctx.translate(520, 90);
      ctx.fillStyle = INK.coral;
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = INK.mustard;
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 26, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-12, 22);
      ctx.lineTo(-7, 38);
      ctx.moveTo(12, 22);
      ctx.lineTo(7, 38);
      ctx.stroke();
      ctx.fillStyle = '#8a6a45';
      rr(ctx, -9, 38, 18, 12, 3);
      ctx.fill();
      ctx.restore();
    }

    // Lightning bolt, left: three zigzags, or two when changed.
    bolt(ctx, 110, 170, 0.9, changed ? 2 : 3, INK.mustardLight);
    sparkle(ctx, 150, 120, 7, '#ffe9a8');
    sparkle(ctx, 80, 230, 5, '#ffe9a8');

    // The great wind spiral: curls clockwise, or counter-clockwise when changed.
    spiral(ctx, 250, 210, 1.15, changed ? -1 : 1, '#b9b0d8');
    spiral(ctx, 250, 210, 0.55, changed ? -1 : 1, '#e6dff5');

    // Floating islands: grass top, rocky cone below.
    function island(x, y, w) {
      ctx.fillStyle = '#7a5a3a';
      ctx.beginPath();
      ctx.moveTo(x - w, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w * 0.45, y + 26);
      ctx.lineTo(x + 4, y + 44);
      ctx.lineTo(x - w * 0.4, y + 24);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = INK.sage;
      ctx.beginPath();
      ctx.ellipse(x, y, w, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK.sageDark;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    island(140, 318, 62);
    island(460, 272, 56);
    island(300, 392, 96);
    island(90, 120, 34);

    // Trees: the right island's tree is gone when changed.
    tree(ctx, 128, 310, 0.9);
    if (!changed) tree(ctx, 455, 262, 0.85);
    tree(ctx, 90, 112, 0.55);

    // Weather station hut on the central island.
    ctx.fillStyle = '#8a6a45';
    rr(ctx, 268, 322, 64, 52, 4);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2.5;
    rr(ctx, 268, 322, 64, 52, 4);
    ctx.stroke();
    ctx.fillStyle = INK.coral;
    ctx.beginPath();
    ctx.moveTo(262, 324);
    ctx.lineTo(300, 296);
    ctx.lineTo(338, 324);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Hut window: lit warm, or dark when changed.
    ctx.fillStyle = changed ? '#2e2b4a' : '#ffe9a8';
    rr(ctx, 292, 336, 16, 16, 2);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2;
    rr(ctx, 292, 336, 16, 16, 2);
    ctx.stroke();
    if (!changed) {
      ctx.fillStyle = 'rgba(255,233,168,0.35)';
      ctx.beginPath();
      ctx.arc(300, 344, 22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#5d4a33';
    rr(ctx, 316, 342, 12, 32, 2);
    ctx.fill();

    // Flag mast on the hut: flying, or drooping when changed.
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(336, 322);
    ctx.lineTo(336, 288);
    ctx.stroke();
    ctx.fillStyle = INK.teal;
    if (changed) {
      ctx.beginPath();
      ctx.moveTo(336, 290);
      ctx.lineTo(344, 298);
      ctx.lineTo(336, 312);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(336, 290);
      ctx.quadraticCurveTo(352, 292, 360, 298);
      ctx.quadraticCurveTo(352, 302, 336, 302);
      ctx.closePath();
      ctx.fill();
    }

    // Rain gauge on a post beside the hut.
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(252, 374);
    ctx.lineTo(252, 344);
    ctx.stroke();
    ctx.fillStyle = '#b08d4f';
    rr(ctx, 244, 326, 16, 20, 3);
    ctx.fill();

    // Bird flock, lower left: three birds, or two when changed.
    bird(ctx, 70, 340, 0.8, '#e6dff5', 0.3);
    bird(ctx, 98, 352, 0.7, '#e6dff5', 0.1);
    if (!changed) bird(ctx, 118, 330, 0.75, '#e6dff5', 0.4);

    // Diagonal rain streaks.
    ctx.strokeStyle = 'rgba(169,201,226,0.55)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 14; i += 1) {
      const rx = 380 + (i % 7) * 28;
      const ry = 300 + Math.floor(i / 7) * 60 + (i % 3) * 12;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 6, ry + 16);
      ctx.stroke();
    }

    // Small drifting cloudlets.
    cloud(ctx, 200, 130, 0.4, '#7d74a8');
    cloud(ctx, 480, 350, 0.45, '#7d74a8');
    sparkle(ctx, 420, 150, 6, '#ffe9a8');
    sparkle(ctx, 180, 260, 5, '#ffe9a8');

    plate(ctx, 216, 414, 168, 20, 'INSIDE A THUNDERCLOUD');
  },
};
