#!/usr/bin/env node
/**
 * Make transparent, print-ready die-cuts from the merch rasters.
 *
 * The designs sit on a flat cream ground. We flood-fill inward from the four
 * corners, clearing only the *connected* background within a tight color
 * tolerance — so the white die-cut sticker borders (which differ from cream)
 * survive, and cream that appears inside a design is untouched. No external
 * tools (rembg / ImageMagick) required; pure sharp + a stack flood-fill.
 *
 * In:  merch/<round>/*.png   Out: merch/print/<round>-<name>-diecut.png
 */
import { readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename, extname } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const ROUNDS = ["r1", "r2"];
const OUT = join(ROOT, "merch", "print");
const TOLERANCE = 34; // < distance(cream→white)≈44, so white borders survive

async function carve(srcPath, outPath) {
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const idx = (x, y) => (y * w + x) * 4;

  // Background reference = average of the four corners.
  const corners = [idx(0, 0), idx(w - 1, 0), idx(0, h - 1), idx(w - 1, h - 1)];
  let br = 0, bg = 0, bb = 0;
  for (const c of corners) { br += data[c]; bg += data[c + 1]; bb += data[c + 2]; }
  br /= 4; bg /= 4; bb /= 4;

  const near = (i) => {
    const dr = data[i] - br, dg = data[i + 1] - bg, db = data[i + 2] - bb;
    return Math.sqrt(dr * dr + dg * dg + db * db) <= TOLERANCE;
  };

  const seen = new Uint8Array(w * h);
  const stack = [];
  const pushIf = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (!seen[p]) { seen[p] = 1; stack.push(x, y); }
  };
  for (let x = 0; x < w; x++) { pushIf(x, 0); pushIf(x, h - 1); }
  for (let y = 0; y < h; y++) { pushIf(0, y); pushIf(w - 1, y); }

  let cleared = 0;
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    const i = idx(x, y);
    if (!near(i)) continue;
    data[i + 3] = 0; // transparent
    cleared++;
    pushIf(x + 1, y); pushIf(x - 1, y); pushIf(x, y + 1); pushIf(x, y - 1);
  }

  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(outPath);
  return cleared / (w * h);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  let n = 0;
  for (const round of ROUNDS) {
    const dir = join(ROOT, "merch", round);
    if (!existsSync(dir)) continue;
    for (const file of (await readdir(dir)).filter((f) => f.endsWith(".png"))) {
      const stem = basename(file, extname(file));
      const out = join(OUT, `${round}-${stem}-diecut.png`);
      const frac = await carve(join(dir, file), out);
      console.log(`✓ ${round}-${stem}  (${Math.round(frac * 100)}% cleared)`);
      n++;
    }
  }
  console.log(`\nDone. ${n} transparent die-cuts → merch/print/`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
