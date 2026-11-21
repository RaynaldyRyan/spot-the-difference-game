// The Cloud Cartographer's Lost Forecast — a spot-the-difference game.
// Node 22, standard library only. This program hands the game in: it copies
// game/ and screenshots/ from beside this file to /output and writes
// /output/dossier.json with the vendored make.fun library.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The scorer's caps: the dossier text is capped at 160 KiB; the rest refuse an
// entry the scorer would refuse (more than 4 screenshots or one over 256 KiB;
// more than 993 files in game/ or 48 MiB of game files, or a path over 1000
// bytes — game/ counts beside /output's own 1000-entry cap).
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

// Guard: the scorer refuses a dossier over 1.5 MiB, so fail loudly here rather
// than hand in an entry the gate would refuse. The text cap above already
// bounds the source text; this catches oversized screenshots pushing the
// dossier itself over the limit.
const DOSSIER_MAX_BYTES = 1572864;
const dossierBytes = Buffer.byteLength(dossier, 'utf8');
if (dossierBytes > DOSSIER_MAX_BYTES) {
  throw new Error(
    `dossier.json is ${dossierBytes} bytes, over the scorer's ${DOSSIER_MAX_BYTES} cap — ` +
      'shrink the screenshots and run again',
  );
}
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`wrote ${join(outDir, 'dossier.json')} (${dossierBytes} bytes)`);
