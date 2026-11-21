// Everything drawn on screen: the two panels, markers, hint glow, HUD, timer
// bar and the title / scene-done / time-up / all-done overlays. Layout is
// computed from the canvas size each frame, so the game fits any desktop
// window; screenshots are taken at 1280x720.
import { INK, SCENE_H, SCENE_W, SUBTITLE, TITLE } from './config.js';
import { SCENES, renderScene, renderScenePair } from './scenes.js';
import {
  SCREEN_ALL_DONE,
  SCREEN_PLAY,
  SCREEN_SCENE_DONE,
  SCREEN_TIME_UP,
  SCREEN_TITLE,
} from './state.js';
import { rr } from './helpers.js';

const SERIF = "Georgia, 'Iowan Old Style', serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";

function mmss(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Word-wrap `text` into lines at most `maxWidth` wide, drawn from (x, y). */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}

export class Renderer {
  constructor(canvas, state) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = state;
    this.pair = null;
    this.pairSceneId = null;
    this.thumbs = SCENES.map((scene) => renderScene(scene, 0));
    this.buttons = [];
    this.panelRects = [];
    this.mouse = { x: -1, y: -1 };
    this.hoverButton = null;
  }

  pairFor(scene) {
    if (this.pairSceneId !== scene.id) {
      this.pair = renderScenePair(scene);
      this.pairSceneId = scene.id;
    }
    return this.pair;
  }

  layout() {
    const W = this.canvas.clientWidth;
    const H = this.canvas.clientHeight;
    const marginX = 20;
    const gap = 20;
    const topBarH = 56;
    const timerH = 8;
    const stripH = 52;
    const footerH = 112;
    let panelW = (W - marginX * 2 - gap) / 2;
    let panelH = (panelW * SCENE_H) / SCENE_W;
    const panelsTop = topBarH + timerH + stripH + 12;
    const maxPanelH = H - panelsTop - footerH - 12;
    if (panelH > maxPanelH) {
      panelH = maxPanelH;
      panelW = (panelH * SCENE_W) / SCENE_H;
    }
    const totalW = panelW * 2 + gap;
    const x0 = (W - totalW) / 2;
    return {
      W,
      H,
      topBarH,
      timerH,
      stripH,
      footerH,
      panelsTop,
      panelW,
      panelH,
      panels: [
        { x: x0, y: panelsTop, w: panelW, h: panelH },
        { x: x0 + panelW + gap, y: panelsTop, w: panelW, h: panelH },
      ],
    };
  }

  /** Convert a canvas point to { panel, x, y } in scene coords, or null. */
  panelFromPoint(px, py) {
    for (let i = 0; i < this.panelRects.length; i += 1) {
      const r = this.panelRects[i];
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
        return {
          panel: i,
          x: ((px - r.x) / r.w) * SCENE_W,
          y: ((py - r.y) / r.h) * SCENE_H,
        };
      }
    }
    return null;
  }

  sceneToPanel(panel, sx, sy) {
    const r = this.panelRects[panel];
    return {
      x: r.x + (sx / SCENE_W) * r.w,
      y: r.y + (sy / SCENE_H) * r.h,
      scale: r.w / SCENE_W,
    };
  }

  buttonAt(px, py) {
    for (const b of this.buttons) {
      if (px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h) return b.id;
    }
    return null;
  }

  draw() {
    const ctx = this.ctx;
    const L = this.layout();
    this.panelRects = L.panels;
    this.buttons = [];
    ctx.fillStyle = INK.paper;
    ctx.fillRect(0, 0, L.W, L.H);
    const screen = this.state.screen;
    if (screen === SCREEN_TITLE) {
      this.drawTitle(L);
      return;
    }
    this.drawTopBar(L);
    this.drawTimerBar(L);
    this.drawSceneStrip(L);
    this.drawPanels(L);
    this.drawFooter(L);
    if (screen === SCREEN_SCENE_DONE) this.drawSceneDone(L);
    else if (screen === SCREEN_TIME_UP) this.drawTimeUp(L);
    else if (screen === SCREEN_ALL_DONE) this.drawAllDone(L);
  }

  drawButton(L, id, x, y, w, h, label, opts = {}) {
    const ctx = this.ctx;
    const hover = this.hoverButton === id;
    ctx.save();
    ctx.fillStyle = opts.primary ? INK.coral : INK.cream;
    if (hover) ctx.fillStyle = opts.primary ? '#f06a4f' : '#fff8e6';
    rr(ctx, x, y, w, h, 9);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 2;
    rr(ctx, x, y, w, h, 9);
    ctx.stroke();
    ctx.fillStyle = opts.primary ? INK.cream : INK.navy;
    ctx.font = `bold ${opts.small ? 13 : 15}px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + w / 2, y + h / 2 + 1);
    ctx.restore();
    this.buttons.push({ id, x, y, w, h });
  }

  drawTopBar(L) {
    const ctx = this.ctx;
    const st = this.state;
    ctx.fillStyle = INK.navy;
    ctx.fillRect(0, 0, L.W, L.topBarH);
    ctx.fillStyle = INK.cream;
    ctx.font = `bold 17px ${SERIF}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(TITLE, 20, L.topBarH / 2 + 1);
    // Score, time and mute on the right.
    const timeText = mmss(st.timeLeft);
    ctx.font = `bold 16px ${SANS}`;
    ctx.textAlign = 'right';
    ctx.fillStyle = st.timeLeft <= 30 && st.screen === SCREEN_PLAY ? '#ff9d8a' : INK.cream;
    ctx.fillText(`TIME ${timeText}`, L.W - 150, L.topBarH / 2 + 1);
    ctx.fillStyle = INK.mustardLight;
    ctx.fillText(`SCORE ${st.score.toLocaleString('en-US')}`, L.W - 230, L.topBarH / 2 + 1);
    this.drawButton(L, 'mute', L.W - 132, 12, 112, 32, st.muted ? 'Sound: Off' : 'Sound: On', { small: true });
  }

  drawTimerBar(L) {
    const ctx = this.ctx;
    const st = this.state;
    const frac = st.scene.seconds > 0 ? st.timeLeft / st.scene.seconds : 0;
    ctx.fillStyle = '#d8c8a8';
    ctx.fillRect(0, L.topBarH, L.W, L.timerH);
    let color = INK.teal;
    if (frac < 0.33) color = INK.mustard;
    if (frac < 0.17) color = INK.coral;
    if (st.timeLeft <= 10 && st.screen === SCREEN_PLAY && Math.floor(st.now * 2) % 2 === 0) {
      color = '#ff8a70';
    }
    ctx.fillStyle = color;
    ctx.fillRect(0, L.topBarH, L.W * frac, L.timerH);
  }

  drawSceneStrip(L) {
    const ctx = this.ctx;
    const st = this.state;
    const y = L.topBarH + L.timerH;
    ctx.fillStyle = INK.navy;
    ctx.font = `bold 19px ${SERIF}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `Scene ${st.sceneIndex + 1} of ${SCENES.length} — ${st.scene.name}`,
      20,
      y + L.stripH / 2 - 8,
    );
    ctx.fillStyle = INK.navySoft;
    ctx.font = `13px ${SANS}`;
    ctx.fillText(st.scene.tagline, 20, y + L.stripH / 2 + 14);
    // The remaining counter: big, centred, impossible to miss.
    const pillW = 210;
    const pillX = L.W / 2 - pillW / 2;
    ctx.fillStyle = INK.coral;
    rr(ctx, pillX, y + 6, pillW, 40, 20);
    ctx.fill();
    ctx.fillStyle = INK.cream;
    ctx.font = `bold 22px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText(
      `${st.remaining} LEFT`,
      L.W / 2,
      y + 27,
    );
    ctx.font = `11px ${SANS}`;
    ctx.fillStyle = INK.navySoft;
    ctx.textAlign = 'right';
    ctx.fillText(
      `${st.found.size} of ${st.scene.differences.length} found`,
      L.W - 20,
      y + L.stripH / 2 - 8,
    );
    // Found / unfound dots.
    const dots = st.scene.differences.length;
    const dw = 12;
    let dx = L.W - 20 - dots * (dw + 4);
    ctx.textAlign = 'left';
    st.scene.differences.forEach((d) => {
      ctx.fillStyle = st.found.has(d.id) ? INK.teal : '#d8c8a8';
      ctx.beginPath();
      ctx.arc(dx + dw / 2, y + L.stripH / 2 + 14, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 1;
      ctx.stroke();
      dx += dw + 4;
    });
  }

  drawPanels(L) {
    const ctx = this.ctx;
    const st = this.state;
    const pair = this.pairFor(st.scene);
    L.panels.forEach((r, i) => {
      ctx.save();
      ctx.shadowColor = 'rgba(34,48,74,0.25)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = INK.white;
      rr(ctx, r.x - 4, r.y - 4, r.w + 8, r.h + 8, 8);
      ctx.fill();
      ctx.restore();
      ctx.drawImage(pair[i], r.x, r.y, r.w, r.h);
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 2;
      ctx.strokeRect(r.x, r.y, r.w, r.h);
      // Panel label: a small chip in the top-left corner, clear of the art.
      const label = i === 0 ? 'A · ORIGINAL' : 'B · CHANGED';
      ctx.fillStyle = 'rgba(246,236,215,0.92)';
      rr(ctx, r.x + 8, r.y + 8, 108, 22, 6);
      ctx.fill();
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 1.5;
      rr(ctx, r.x + 8, r.y + 8, 108, 22, 6);
      ctx.stroke();
      ctx.fillStyle = INK.navy;
      ctx.font = `bold 12px ${SANS}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, r.x + 16, r.y + 20);
    });
    this.drawHintGlow();
    this.drawMarkers();
    this.drawMiss();
    this.drawCursor();
  }

  drawMarkers() {
    const ctx = this.ctx;
    const st = this.state;
    const pulseAge = st.findPulseAge();
    for (const diff of st.scene.differences) {
      if (!st.found.has(diff.id)) continue;
      const isRecent = st.lastFind && st.lastFind.diff.id === diff.id && pulseAge < 0.55;
      const pulse = isRecent ? 1 + (1 - pulseAge / 0.55) * 0.45 : 1;
      for (let panel = 0; panel < 2; panel += 1) {
        const p = this.sceneToPanel(panel, diff.x, diff.y);
        const rad = Math.max(diff.r, 30) * p.scale * pulse;
        ctx.save();
        ctx.strokeStyle = INK.coral;
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(228,87,61,0.12)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Small check at the circle's top right.
        ctx.strokeStyle = INK.coral;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x + rad * 0.35, p.y - rad * 0.55);
        ctx.lineTo(p.x + rad * 0.6, p.y - rad * 0.3);
        ctx.lineTo(p.x + rad * 0.95, p.y - rad * 0.75);
        ctx.stroke();
        if (isRecent) {
          ctx.fillStyle = INK.mustard;
          const a = pulseAge * 6;
          for (let i = 0; i < 4; i += 1) {
            const ang = a + (i * Math.PI) / 2;
            ctx.beginPath();
            ctx.arc(p.x + Math.cos(ang) * rad * 1.25, p.y + Math.sin(ang) * rad * 1.25, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }
    }
  }

  drawHintGlow() {
    const ctx = this.ctx;
    const st = this.state;
    if (!st.hint) return;
    const diff = st.hint.diff;
    const alpha = 0.28 + 0.14 * Math.sin(st.now * 5);
    for (let panel = 0; panel < 2; panel += 1) {
      const p = this.sceneToPanel(panel, diff.x, diff.y);
      const rad = 78 * p.scale;
      const g = ctx.createRadialGradient(p.x, p.y, 6, p.x, p.y, rad);
      g.addColorStop(0, `rgba(233,161,59,${alpha})`);
      g.addColorStop(1, 'rgba(233,161,59,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(233,161,59,${alpha + 0.25})`;
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  drawMiss() {
    const ctx = this.ctx;
    const st = this.state;
    if (!st.missActive) return;
    const age = st.missAge();
    const alpha = 1 - age / 0.9;
    for (let panel = 0; panel < 2; panel += 1) {
      const p = this.sceneToPanel(panel, st.lastMiss.x, st.lastMiss.y);
      const s = 12 * p.scale;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = INK.coral;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x - s, p.y - s);
      ctx.lineTo(p.x + s, p.y + s);
      ctx.moveTo(p.x + s, p.y - s);
      ctx.lineTo(p.x - s, p.y + s);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawCursor() {
    const ctx = this.ctx;
    const st = this.state;
    if (!st.cursorVisible || st.screen !== SCREEN_PLAY) return;
    for (let panel = 0; panel < 2; panel += 1) {
      const p = this.sceneToPanel(panel, st.cursor.x, st.cursor.y);
      const rad = 16 * p.scale;
      ctx.save();
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(p.x - rad - 6, p.y);
      ctx.lineTo(p.x - rad + 2, p.y);
      ctx.moveTo(p.x + rad - 2, p.y);
      ctx.lineTo(p.x + rad + 6, p.y);
      ctx.moveTo(p.x, p.y - rad - 6);
      ctx.lineTo(p.x, p.y - rad + 2);
      ctx.moveTo(p.x, p.y + rad - 2);
      ctx.lineTo(p.x, p.y + rad + 6);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawFooter(L) {
    const ctx = this.ctx;
    const st = this.state;
    const y = L.H - L.footerH;
    ctx.fillStyle = INK.paperDark;
    ctx.fillRect(0, y, L.W, L.footerH);
    ctx.strokeStyle = '#d8c8a8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(L.W, y);
    ctx.stroke();
    // Hint button, with cost and cooldown.
    const hintLabel = st.hintCooldown > 0
      ? `Hint… ${Math.ceil(st.hintCooldown)}s`
      : 'Hint  (−50 pts)';
    this.drawButton(L, 'hint', 20, y + 18, 168, 42, hintLabel, { primary: true });
    ctx.fillStyle = INK.navySoft;
    ctx.font = `12px ${SANS}`;
    ctx.textAlign = 'left';
    ctx.fillText('Click a difference in either picture.', 20, y + 82);
    ctx.fillText('Arrows move the cursor · Enter marks · H hint · M sound', 20, y + 100);
    // Scene progress thumbnails.
    const thumbW = 96;
    const thumbH = 70;
    const gap = 14;
    const total = SCENES.length * thumbW + (SCENES.length - 1) * gap;
    let tx = (L.W - total) / 2;
    SCENES.forEach((scene, i) => {
      const done = i < st.sceneIndex || (st.screen === SCREEN_ALL_DONE);
      const current = i === st.sceneIndex;
      ctx.save();
      if (current) {
        ctx.strokeStyle = INK.coral;
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = INK.navy;
        ctx.lineWidth = 1.5;
      }
      ctx.drawImage(this.thumbs[i], tx, y + 14, thumbW, thumbH);
      ctx.strokeRect(tx, y + 14, thumbW, thumbH);
      if (done) {
        ctx.fillStyle = 'rgba(46,127,122,0.85)';
        ctx.beginPath();
        ctx.arc(tx + thumbW - 12, y + 26, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = INK.cream;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(tx + thumbW - 17, y + 26);
        ctx.lineTo(tx + thumbW - 13, y + 30);
        ctx.lineTo(tx + thumbW - 6, y + 21);
        ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = current ? INK.navy : INK.navySoft;
      ctx.font = `bold 11px ${SANS}`;
      ctx.textAlign = 'center';
      ctx.fillText(scene.short, tx + thumbW / 2, y + 100);
      tx += thumbW + gap;
    });
    // Right: streak and accuracy.
    ctx.textAlign = 'right';
    ctx.fillStyle = INK.navy;
    ctx.font = `bold 14px ${SANS}`;
    ctx.fillText(st.streak >= 2 ? `Streak ×${st.streak}` : 'Find them all!', L.W - 20, y + 34);
    ctx.fillStyle = INK.navySoft;
    ctx.font = `12px ${SANS}`;
    ctx.fillText(`Misses: ${st.misses} · Hints: ${st.hintsUsed}`, L.W - 20, y + 54);
  }

  drawOverlayCard(L, w, h) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(34,48,74,0.55)';
    ctx.fillRect(0, 0, L.W, L.H);
    const x = (L.W - w) / 2;
    const y = (L.H - h) / 2;
    ctx.fillStyle = INK.paper;
    rr(ctx, x, y, w, h, 14);
    ctx.fill();
    ctx.strokeStyle = INK.navy;
    ctx.lineWidth = 3;
    rr(ctx, x, y, w, h, 14);
    ctx.stroke();
    return { x, y, w, h };
  }

  drawSceneDone(L) {
    const ctx = this.ctx;
    const st = this.state;
    const card = this.drawOverlayCard(L, 480, 330);
    ctx.fillStyle = INK.navy;
    ctx.font = `bold 30px ${SERIF}`;
    ctx.textAlign = 'center';
    ctx.fillText('Scene Complete!', card.x + card.w / 2, card.y + 58);
    ctx.font = `15px ${SANS}`;
    ctx.fillStyle = INK.navySoft;
    ctx.fillText(`All 8 differences found in ${st.scene.name}.`, card.x + card.w / 2, card.y + 88);
    ctx.fillStyle = INK.navy;
    ctx.font = `bold 18px ${SANS}`;
    ctx.fillText(`Time bonus  +${st.timeBonus}`, card.x + card.w / 2, card.y + 132);
    ctx.fillText(`Score  ${st.score.toLocaleString('en-US')}`, card.x + card.w / 2, card.y + 162);
    this.drawButton(L, 'next', card.x + card.w / 2 - 110, card.y + 196, 220, 44, 'Next Scene →', { primary: true });
    this.drawButton(L, 'replay', card.x + 40, card.y + 256, 180, 40, 'Replay Scene');
    this.drawButton(L, 'title', card.x + card.w - 220, card.y + 256, 180, 40, 'Title Screen');
  }

  drawTimeUp(L) {
    const ctx = this.ctx;
    const st = this.state;
    const card = this.drawOverlayCard(L, 480, 320);
    ctx.fillStyle = INK.navy;
    ctx.font = `bold 30px ${SERIF}`;
    ctx.textAlign = 'center';
    ctx.fillText("Time's Up!", card.x + card.w / 2, card.y + 58);
    ctx.font = `15px ${SANS}`;
    ctx.fillStyle = INK.navySoft;
    ctx.fillText('The forecast slipped away…', card.x + card.w / 2, card.y + 88);
    ctx.fillStyle = INK.navy;
    ctx.font = `bold 18px ${SANS}`;
    ctx.fillText(
      `You found ${st.found.size} of ${st.scene.differences.length} differences.`,
      card.x + card.w / 2,
      card.y + 132,
    );
    this.drawButton(L, 'retry', card.x + card.w / 2 - 110, card.y + 168, 220, 44, 'Try Again', { primary: true });
    this.drawButton(L, 'title', card.x + card.w / 2 - 110, card.y + 228, 220, 40, 'Title Screen');
  }

  drawAllDone(L) {
    const ctx = this.ctx;
    const st = this.state;
    const card = this.drawOverlayCard(L, 520, 380);
    ctx.fillStyle = INK.navy;
    ctx.font = `bold 32px ${SERIF}`;
    ctx.textAlign = 'center';
    ctx.fillText('Forecast Complete!', card.x + card.w / 2, card.y + 60);
    ctx.font = `15px ${SANS}`;
    ctx.fillStyle = INK.navySoft;
    ctx.fillText('All 32 differences found across 4 scenes.', card.x + card.w / 2, card.y + 92);
    ctx.fillStyle = INK.navy;
    ctx.font = `bold 26px ${SANS}`;
    ctx.fillText(`Final Score  ${st.score.toLocaleString('en-US')}`, card.x + card.w / 2, card.y + 142);
    ctx.font = `15px ${SANS}`;
    ctx.fillStyle = INK.navySoft;
    ctx.fillText(`Misses: ${st.misses}   ·   Hints used: ${st.hintsUsed}`, card.x + card.w / 2, card.y + 176);
    const rank = st.misses <= 2 && st.hintsUsed <= 2
      ? 'Master Cartographer'
      : st.misses <= 6
        ? 'Keen-Eyed Forecaster'
        : 'Rising Cloud-Watcher';
    ctx.fillStyle = INK.teal;
    ctx.font = `bold 18px ${SERIF}`;
    ctx.fillText(`Rank: ${rank}`, card.x + card.w / 2, card.y + 212);
    this.drawButton(L, 'again', card.x + card.w / 2 - 110, card.y + 246, 220, 44, 'Play Again', { primary: true });
    this.drawButton(L, 'title', card.x + card.w / 2 - 110, card.y + 306, 220, 40, 'Title Screen');
  }

  drawTitle(L) {
    const ctx = this.ctx;
    const st = this.state;
    // Header band.
    ctx.fillStyle = INK.navy;
    ctx.fillRect(0, 0, L.W, 150);
    ctx.fillStyle = INK.mustardLight;
    ctx.font = `bold 13px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText('A SPOT-THE-DIFFERENCE GAME IN FOUR WEATHER STATIONS', L.W / 2, 42);
    ctx.fillStyle = INK.cream;
    ctx.font = `bold 40px ${SERIF}`;
    ctx.fillText(TITLE, L.W / 2, 92);
    ctx.fillStyle = '#b9c4d8';
    ctx.font = `16px ${SANS}`;
    ctx.fillText(SUBTITLE, L.W / 2, 122);
    // Scene cards.
    const cardW = 268;
    const cardH = 300;
    const gap = 24;
    const total = SCENES.length * cardW + (SCENES.length - 1) * gap;
    let cx = (L.W - total) / 2;
    const cy = 190;
    SCENES.forEach((scene, i) => {
      const hover = this.hoverButton === `scene-${i}`;
      ctx.save();
      ctx.shadowColor = 'rgba(34,48,74,0.2)';
      ctx.shadowBlur = hover ? 14 : 8;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = INK.white;
      rr(ctx, cx, cy, cardW, cardH, 12);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = hover ? INK.coral : INK.navy;
      ctx.lineWidth = hover ? 3 : 2;
      rr(ctx, cx, cy, cardW, cardH, 12);
      ctx.stroke();
      ctx.drawImage(this.thumbs[i], cx + 10, cy + 10, cardW - 20, (cardW - 20) * SCENE_H / SCENE_W);
      ctx.strokeStyle = INK.navy;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx + 10, cy + 10, cardW - 20, (cardW - 20) * SCENE_H / SCENE_W);
      ctx.fillStyle = INK.navy;
      ctx.font = `bold 17px ${SERIF}`;
      ctx.textAlign = 'left';
      ctx.fillText(`${i + 1}. ${scene.name}`, cx + 14, cy + 224);
      ctx.fillStyle = INK.navySoft;
      ctx.font = `13px ${SANS}`;
      wrapText(ctx, scene.tagline, cx + 14, cy + 246, cardW - 28, 16);
      ctx.fillStyle = INK.teal;
      ctx.font = `bold 13px ${SANS}`;
      ctx.fillText(`8 differences · ${mmss(scene.seconds)}`, cx + 14, cy + 282);
      this.buttons.push({ id: `scene-${i}`, x: cx, y: cy, w: cardW, h: cardH });
      cx += cardW + gap;
    });
    // How to play + start.
    ctx.fillStyle = INK.navy;
    ctx.font = `15px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText(
      'Two pictures, nearly identical. Click a difference in either picture to mark it in both.',
      L.W / 2,
      540,
    );
    ctx.fillStyle = INK.navySoft;
    ctx.font = `13px ${SANS}`;
    ctx.fillText(
      'Hints cost 50 points · wrong clicks cost 10 · find fast for a time bonus',
      L.W / 2,
      564,
    );
    this.drawButton(L, 'start', L.W / 2 - 130, 592, 260, 48, 'Start the Forecast', { primary: true });
    ctx.fillStyle = INK.navySoft;
    ctx.font = `12px ${SANS}`;
    ctx.fillText('Keyboard: 1–4 choose a scene · Enter starts · arrows + Enter play', L.W / 2, 668);
    void st;
  }
}
