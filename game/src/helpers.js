// Small canvas drawing primitives shared by every scene: clouds, birds, stars,
// jars, kites and the other cut-paper shapes the painters compose from.
import { INK } from './config.js';

/** Rounded-rectangle path, left in the current path for fill/stroke. */
export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** A puffy cloud made of overlapping circles, flat base, ink outline. */
export function cloud(ctx, x, y, s, color, outline = INK.navy) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(-28, 6, 18, 0, Math.PI * 2);
  ctx.arc(-6, -8, 24, 0, Math.PI * 2);
  ctx.arc(20, 2, 19, 0, Math.PI * 2);
  ctx.arc(34, 10, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-44, 8, 82, 14);
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(-28, 6, 18, Math.PI * 0.55, Math.PI * 1.5);
  ctx.arc(-6, -8, 24, Math.PI * 1.05, Math.PI * 1.95);
  ctx.arc(20, 2, 19, Math.PI * 1.15, Math.PI * 2.02);
  ctx.arc(34, 10, 12, Math.PI * 1.3, Math.PI * 0.45);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-44, 22);
  ctx.lineTo(38, 22);
  ctx.stroke();
  ctx.restore();
}

/** A small seed-cloud: a tiny cloud with a sprout, used in the greenhouse pods. */
export function seedCloud(ctx, x, y, s, color) {
  cloud(ctx, x, y, s * 0.55, color);
  ctx.save();
  ctx.strokeStyle = INK.sageDark;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y - 12 * s);
  ctx.quadraticCurveTo(x + 2 * s, y - 22 * s, x + 8 * s, y - 26 * s);
  ctx.stroke();
  ctx.fillStyle = INK.sage;
  ctx.beginPath();
  ctx.ellipse(x + 11 * s, y - 27 * s, 7 * s, 3.5 * s, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** A simple bird: body, wing and tail. `flap` tilts the wing. */
export function bird(ctx, x, y, s, color, flap = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(10, -5, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INK.mustard;
  ctx.beginPath();
  ctx.moveTo(14, -6);
  ctx.lineTo(20, -4);
  ctx.lineTo(14, -2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = color;
  ctx.save();
  ctx.translate(-2, -2);
  ctx.rotate(-0.5 - flap);
  ctx.beginPath();
  ctx.ellipse(-4, -6, 11, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(-11, -1);
  ctx.lineTo(-20, -6);
  ctx.lineTo(-19, 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = INK.cream;
  ctx.beginPath();
  ctx.arc(11, -6, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** A four-point sparkle star. */
export function sparkle(ctx, x, y, r, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.18, -r * 0.18, r, 0);
  ctx.quadraticCurveTo(r * 0.18, r * 0.18, 0, r);
  ctx.quadraticCurveTo(-r * 0.18, r * 0.18, -r, 0);
  ctx.quadraticCurveTo(-r * 0.18, -r * 0.18, 0, -r);
  ctx.fill();
  ctx.restore();
}

/** A five-point star. */
export function star(ctx, x, y, r, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
    else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** A raindrop, pointed at the top. */
export function drop(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.quadraticCurveTo(8, 0, 8, 4);
  ctx.arc(0, 4, 8, 0, Math.PI);
  ctx.quadraticCurveTo(-8, 0, 0, -12);
  ctx.fill();
  ctx.restore();
}

/** A glass bottle or jar with a stopper; `fill` colours the liquid. */
export function jar(ctx, x, y, w, h, fill, label = null) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  rr(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.strokeStyle = INK.navy;
  ctx.lineWidth = 2.5;
  rr(ctx, x, y, w, h, 6);
  ctx.stroke();
  ctx.fillStyle = fill;
  rr(ctx, x + 4, y + h * 0.35, w - 8, h * 0.6 - 3, 4);
  ctx.fill();
  ctx.fillStyle = INK.mustard;
  rr(ctx, x + w / 2 - 6, y - 9, 12, 10, 3);
  ctx.fill();
  ctx.strokeStyle = INK.navy;
  ctx.lineWidth = 2;
  rr(ctx, x + w / 2 - 6, y - 9, 12, 10, 3);
  ctx.stroke();
  if (label) {
    ctx.fillStyle = INK.cream;
    rr(ctx, x + 6, y + h * 0.42, w - 12, 14, 3);
    ctx.fill();
    ctx.fillStyle = INK.navy;
    ctx.font = 'bold 10px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + w / 2, y + h * 0.42 + 8);
  }
  ctx.restore();
}

/** A diamond kite with a tail. `tailDir` 1 bends the tail right, -1 left. */
export function kite(ctx, x, y, s, body, accent, tailDir, stripes = 3) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = INK.navy;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 34);
  ctx.quadraticCurveTo(14 * tailDir, 70, 4 * tailDir, 104);
  ctx.quadraticCurveTo(-8 * tailDir, 130, 2 * tailDir, 156);
  ctx.stroke();
  for (let i = 0; i < 3; i += 1) {
    const ty = 62 + i * 34;
    const tx = (i % 2 === 0 ? 8 : -4) * tailDir;
    ctx.fillStyle = i % 2 === 0 ? accent : body;
    ctx.beginPath();
    ctx.moveTo(tx - 7, ty);
    ctx.lineTo(tx + 7, ty);
    ctx.lineTo(tx, ty + 12);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(0, -46);
  ctx.lineTo(40, 0);
  ctx.lineTo(0, 34);
  ctx.lineTo(-40, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = INK.navy;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = accent;
  for (let i = 0; i < stripes; i += 1) {
    const yy = -30 + i * 18;
    ctx.beginPath();
    ctx.moveTo(-24 + i * 7, yy);
    ctx.lineTo(24 - i * 7, yy);
    ctx.lineTo(20 - i * 7, yy + 7);
    ctx.lineTo(-20 + i * 7, yy + 7);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = INK.navy;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -46);
  ctx.lineTo(0, 34);
  ctx.moveTo(-40, 0);
  ctx.lineTo(40, 0);
  ctx.stroke();
  ctx.restore();
}

/** A sun with `rays` triangular rays. */
export function sun(ctx, x, y, r, rays, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  for (let i = 0; i < rays; i += 1) {
    const a = (i * Math.PI * 2) / rays;
    ctx.save();
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(r + 3, -5);
    ctx.lineTo(r + 16, 0);
    ctx.lineTo(r + 3, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK.navy;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** A crescent moon. */
export function moon(ctx, x, y, r, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INK.dusk;
  ctx.beginPath();
  ctx.arc(r * 0.45, -r * 0.2, r * 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** A small round tree on a trunk. */
export function tree(ctx, x, y, s, leaf = INK.sageDark) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#7a5a3a';
  ctx.fillRect(-3, -2, 6, 16);
  ctx.fillStyle = leaf;
  ctx.beginPath();
  ctx.arc(0, -12, 14, 0, Math.PI * 2);
  ctx.arc(-11, -4, 9, 0, Math.PI * 2);
  ctx.arc(11, -4, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK.navy;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -12, 14, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** A lightning bolt with `zigs` zigzags. */
export function bolt(ctx, x, y, s, zigs, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.strokeStyle = INK.navy;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -46);
  let px = 0;
  let py = -46;
  for (let i = 0; i < zigs; i += 1) {
    const nx = i % 2 === 0 ? 16 : -6;
    const ny = py + 92 / zigs;
    ctx.lineTo(nx, ny);
    px = nx;
    py = ny;
  }
  ctx.lineTo(px - 14, py);
  ctx.lineTo(2, -30);
  ctx.lineTo(-10, -30);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** A spiral of wind. `dir` 1 curls clockwise, -1 counter-clockwise. */
export function spiral(ctx, x, y, s, dir, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s * dir, s);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let t = 0; t <= Math.PI * 3.4; t += 0.15) {
    const r = 4 + t * 5.2;
    const px = Math.cos(t) * r;
    const py = Math.sin(t) * r * 0.8;
    if (t === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

/** A wooden sign or label plate with centred text. */
export function plate(ctx, x, y, w, h, text, fill = INK.cream) {
  ctx.save();
  ctx.fillStyle = fill;
  rr(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.strokeStyle = INK.navy;
  ctx.lineWidth = 2;
  rr(ctx, x, y, w, h, 6);
  ctx.stroke();
  ctx.fillStyle = INK.navy;
  ctx.font = 'bold 11px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);
  ctx.restore();
}
