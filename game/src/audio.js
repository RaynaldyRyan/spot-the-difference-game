// Procedural sound: every effect is a short WebAudio oscillator phrase, so the
// game ships no audio files and stays fully usable with sound off.
let ctx = null;
let muted = false;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Unlock audio on the first user gesture; safe to call any time. */
export function unlockAudio() {
  if (!muted) audio();
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function tone(freq, start, dur, type = 'sine', gain = 0.12) {
  const ac = audio();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  amp.gain.setValueAtTime(0, ac.currentTime + start);
  amp.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
  osc.connect(amp);
  amp.connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.05);
}

/** Two-note chime on a find. */
export function soundFind() {
  tone(660, 0, 0.18, 'sine', 0.14);
  tone(990, 0.09, 0.28, 'sine', 0.12);
}

/** Soft low thud on a miss. */
export function soundMiss() {
  tone(180, 0, 0.16, 'triangle', 0.12);
  tone(120, 0.05, 0.2, 'triangle', 0.1);
}

/** Rising sweep when a hint appears. */
export function soundHint() {
  tone(440, 0, 0.12, 'sine', 0.08);
  tone(587, 0.1, 0.14, 'sine', 0.08);
  tone(740, 0.2, 0.2, 'sine', 0.07);
}

/** Short arpeggio when a scene is complete. */
export function soundComplete() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'sine', 0.12));
}

/** Quiet click for buttons. */
export function soundClick() {
  tone(520, 0, 0.07, 'triangle', 0.07);
}
