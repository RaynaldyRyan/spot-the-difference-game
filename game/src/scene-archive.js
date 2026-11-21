// Scene 2 — Storm Archive. Bottled weather on wooden shelves, curled maps and
// a lightning jar that may or may not be glowing.
import { INK } from './config.js';
import { bolt, jar, moon, plate, rr, sparkle, sun } from './helpers.js';

export const sceneArchive = {
  id: 'archive',
  name: 'Storm Archive',
  short: 'Archive',
  tagline: 'Bottled weather, curled maps, lightning in jars.',
  seconds: 150,
  differences: [
    { id: 'jar-glow', label: 'the lightning jar is dark instead of glowing', x: 150, y: 205, r: 30 },
    { id: 'bottle-missing', label: 'a bottle is missing from the top shelf', x: 430, y: 112, r: 26 },
    { id: 'map-inlet', label: 'the map coastline grew an extra inlet', x: 300, y: 88, r: 34 },
    { id: 'clock-hands', label: 'the clock shows a different hour', x: 520, y: 62, r: 28 },
    { id: 'paper-bird', label: 'the paper bird left the desk', x: 200, y: 348, r: 26 },
    { id: 'candle-flame', label: 'the candle went out', x: 480, y: 302, r: 26 },
    { id: 'globe-symbol', label: 'the globe shows a moon, not a sun', x: 90, y: 328, r: 30 },
    { id: 'book-count', label: 'the book stack lost a book', x: 340, y: 348, r: 30 },
  ],

  paint(ctx, variant) {
    const changed = variant === 1;

    // Warm archive wall, wainscot and wooden floor.
    ctx.fillStyle = '#e9dcc0';
    ctx.fillRect(0, 0, 600, 440);
    ctx.fillStyle = '#dcc9a4';
    ctx.fillRect(0, 372, 600, 68);
    ctx.fillStyle = '#b08d5f';
    ctx.fillRect(0, 408, 600, 32);
    ctx.strokeStyle = '#8a6a45';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 408);
    ctx.lineTo(600, 408);
    ctx.moveTo(0, 372);
    ctx.lineTo(600, 372);
    ctx.stroke();
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.moveTo(60 + i * 100, 408);
      ctx.lineTo(60 + i * 100, 440);
      ctx.stroke();
    }

    // Framed cloud chart, left wall.
    ctx.fillStyle = '#8a6a45';
    rr(ctx, 48, 34, 84, 64, 4);
    ctx.fill();
    ctx.fillStyle = INK.cream;
    rr(ctx, 54, 40, 72, 52, 2);
    ctx.fill();
    ctx.strokeStyle = INK.skyDeep;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(72, 72, 10, Math.PI, 0);
    ctx.arc(88, 66, 12, Math.PI, 0);
    ctx.arc(104, 72, 9, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(60, 80);
    ctx.lineTo(120, 80);
    ctx.stroke();

    // Curled map, centre wall: the coastline gains an extra inlet when changed.
    ctx.save();
    ctx.translate(300, 88);
    ctx.fillStyle = INK.cream;
    ctx.fillRect(-62, -46, 124, 92);
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-62, -46, 124, 92);
    ctx.fillStyle = INK.sage;
    ctx.beginPath();
    ctx.moveTo(-62, 46);
    ctx.lineTo(-62, 6);
    ctx.quadraticCurveTo(-40, -6, -22, 4);
    ctx.quadraticCurveTo(-6, 12, 8, 2);
    if (changed) {
      ctx.quadraticCurveTo(16, -12, 24, 2);
      ctx.quadraticCurveTo(30, 12, 40, 4);
    } else {
      ctx.quadraticCurveTo(26, -4, 40, 4);
    }
    ctx.quadraticCurveTo(52, 10, 62, 0);
    ctx.lineTo(62, 46);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK.teal;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-62, 6);
    ctx.quadraticCurveTo(-40, -6, -22, 4);
    ctx.quadraticCurveTo(-6, 12, 8, 2);
    if (changed) {
      ctx.quadraticCurveTo(16, -12, 24, 2);
      ctx.quadraticCurveTo(30, 12, 40, 4);
    } else {
      ctx.quadraticCurveTo(26, -4, 40, 4);
    }
    ctx.quadraticCurveTo(52, 10, 62, 0);
    ctx.stroke();
    ctx.fillStyle = INK.coral;
    ctx.beginPath();
    ctx.arc(-34, -26, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = INK.navy;
    ctx.font = 'bold 11px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('STORM CHART', 0, -32);
    ctx.fillStyle = '#d8c8a8';
    ctx.beginPath();
    ctx.moveTo(62, 46);
    ctx.lineTo(44, 46);
    ctx.lineTo(62, 28);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Wall clock, top right: 3 o'clock, or 5 o'clock when changed.
    ctx.fillStyle = INK.cream;
    ctx.beginPath();
    ctx.arc(520, 62, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = INK.navy;
    for (let i = 0; i < 12; i += 1) {
      const a = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.arc(520 + Math.cos(a) * 22, 62 + Math.sin(a) * 22, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(520, 62);
    if (changed) ctx.lineTo(520 + 13, 62 + 13);
    else ctx.lineTo(520 + 16, 62);
    ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(520, 62);
    ctx.lineTo(520, 62 - 19);
    ctx.stroke();
    ctx.fillStyle = INK.coral;
    ctx.beginPath();
    ctx.arc(520, 62, 3, 0, Math.PI * 2);
    ctx.fill();

    // Top shelf with bottled weather; one bottle is gone when changed.
    ctx.fillStyle = '#8a6a45';
    ctx.fillRect(56, 150, 488, 10);
    const bottles = [
      { x: 88, h: 52, fill: INK.sky, label: 'RAIN' },
      { x: 140, h: 38, fill: INK.tealLight, label: 'FOG' },
      { x: 188, h: 58, fill: INK.plumLight, label: 'HAIL' },
      { x: 384, h: 44, fill: INK.mustardLight, label: 'SUN' },
      { x: 430, h: 56, fill: INK.coralSoft, label: 'WIND' },
      { x: 482, h: 40, fill: INK.sage, label: 'DEW' },
    ];
    bottles.forEach((b) => {
      if (changed && b.x === 430) return;
      jar(ctx, b.x - 16, 150 - b.h, 32, b.h, b.fill, b.label);
    });

    // Middle shelf: the lightning jar, glowing or dark.
    ctx.fillStyle = '#8a6a45';
    ctx.fillRect(56, 252, 300, 10);
    if (!changed) {
      const glow = ctx.createRadialGradient(150, 205, 8, 150, 205, 70);
      glow.addColorStop(0, 'rgba(233,161,59,0.55)');
      glow.addColorStop(1, 'rgba(233,161,59,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(70, 125, 160, 160);
    }
    jar(ctx, 124, 168, 52, 84, changed ? '#3a4a6b' : '#f4c876', 'BOLT');
    if (!changed) bolt(ctx, 150, 210, 0.42, 3, INK.mustard);
    jar(ctx, 210, 196, 36, 56, INK.sky, 'CLOUD');
    jar(ctx, 262, 206, 30, 46, INK.tealLight, 'MIST');
    sparkle(ctx, 320, 200, 8, INK.mustard);
    sparkle(ctx, 336, 224, 5, INK.mustard);

    // A rolled chart leaning on the wall, right.
    ctx.fillStyle = INK.cream;
    ctx.save();
    ctx.translate(452, 260);
    ctx.rotate(0.12);
    rr(ctx, -14, -58, 28, 116, 12);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2;
    rr(ctx, -14, -58, 28, 116, 12);
    ctx.stroke();
    ctx.fillStyle = INK.coral;
    ctx.fillRect(-14, -20, 28, 6);
    ctx.restore();

    // Desk.
    ctx.fillStyle = '#7a5a3a';
    ctx.fillRect(40, 360, 520, 12);
    ctx.fillRect(64, 372, 14, 36);
    ctx.fillRect(522, 372, 14, 36);
    ctx.fillStyle = '#8a6a45';
    ctx.fillRect(40, 356, 520, 5);

    // Globe on a stand: sun symbol, or moon when changed.
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(90, 356);
    ctx.lineTo(90, 344);
    ctx.stroke();
    ctx.fillStyle = INK.sky;
    ctx.beginPath();
    ctx.arc(90, 320, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = INK.sage;
    ctx.beginPath();
    ctx.ellipse(82, 314, 10, 7, -0.4, 0, Math.PI * 2);
    ctx.ellipse(100, 328, 8, 6, 0.4, 0, Math.PI * 2);
    ctx.fill();
    if (changed) moon(ctx, 90, 320, 9, INK.cream);
    else sun(ctx, 90, 320, 7, 6, INK.mustard);

    // Paper bird on the desk; gone when changed.
    if (!changed) {
      ctx.fillStyle = INK.white;
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(200, 352);
      ctx.lineTo(176, 330);
      ctx.lineTo(196, 334);
      ctx.lineTo(200, 326);
      ctx.lineTo(212, 334);
      ctx.lineTo(228, 330);
      ctx.lineTo(206, 352);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Book stack: four books, or three when changed.
    const bookColors = [INK.teal, INK.coral, INK.mustard, INK.plum];
    const bookCount = changed ? 3 : 4;
    for (let i = 0; i < bookCount; i += 1) {
      const bw = 74 - i * 8;
      const by = 356 - (i + 1) * 12;
      ctx.fillStyle = bookColors[i];
      rr(ctx, 340 - bw / 2, by, bw, 11, 2);
      ctx.fill();
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 1.5;
      rr(ctx, 340 - bw / 2, by, bw, 11, 2);
      ctx.stroke();
      ctx.fillStyle = INK.cream;
      ctx.fillRect(340 - bw / 2 + 6, by + 4, bw - 22, 3);
    }

    // Candle: lit, or out when changed.
    ctx.fillStyle = INK.cream;
    rr(ctx, 470, 318, 20, 38, 4);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2;
    rr(ctx, 470, 318, 20, 38, 4);
    ctx.stroke();
    ctx.fillStyle = INK.mustard;
    rr(ctx, 464, 354, 32, 6, 3);
    ctx.fill();
    if (!changed) {
      ctx.fillStyle = INK.mustard;
      ctx.beginPath();
      ctx.moveTo(480, 296);
      ctx.quadraticCurveTo(487, 308, 487, 313);
      ctx.arc(480, 313, 7, 0, Math.PI);
      ctx.quadraticCurveTo(473, 308, 480, 296);
      ctx.fill();
      ctx.fillStyle = '#fff3c4';
      ctx.beginPath();
      ctx.arc(480, 311, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(480, 318);
      ctx.lineTo(480, 310);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(34,48,74,0.5)';
      ctx.beginPath();
      ctx.moveTo(480, 308);
      ctx.quadraticCurveTo(476, 302, 480, 296);
      ctx.stroke();
    }

    // Ink pot and quill, far right of the desk.
    ctx.fillStyle = INK.navy;
    rr(ctx, 524, 336, 18, 20, 3);
    ctx.fill();
    ctx.strokeStyle = INK.plum;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(533, 336);
    ctx.quadraticCurveTo(542, 318, 552, 312);
    ctx.stroke();

    plate(ctx, 36, 384, 120, 20, 'STORM ARCHIVE · RM 2');
  },
};
