#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "merch", "r5");
const SOURCE = join(OUT, "i-am-nomad-master.png");
const SIZE = 1200;

function svg(content) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${content}</svg>`
  );
}

function paperGrain(opacity = 0.14) {
  return svg(`
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="3" seed="17"/><feColorMatrix type="saturate" values="0"/></filter>
    <rect width="${SIZE}" height="${SIZE}" filter="url(#grain)" opacity="${opacity}"/>
  `);
}

async function roundedImage(input, width, radius) {
  const image = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .png()
    .toBuffer();
  const meta = await sharp(image).metadata();
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}">
      <rect width="100%" height="100%" rx="${radius}" ry="${radius}" fill="#fff"/>
    </svg>`
  );
  return sharp(image).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

async function poster(width) {
  return roundedImage(SOURCE, width, 20);
}

async function sticker() {
  const art = await poster(520);

  await sharp(
    svg(`
      <defs>
        <linearGradient id="counter" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f7dfc9"/>
          <stop offset="0.45" stop-color="#d8e8ec"/>
          <stop offset="1" stop-color="#e9c6d4"/>
        </linearGradient>
        <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff6bc"/>
          <stop offset="0.24" stop-color="#c7f0ef"/>
          <stop offset="0.48" stop-color="#e5c6ef"/>
          <stop offset="0.72" stop-color="#cbe6ff"/>
          <stop offset="1" stop-color="#f8d6a8"/>
        </linearGradient>
        <pattern id="slashes" width="58" height="58" patternUnits="userSpaceOnUse" patternTransform="rotate(22)">
          <rect width="9" height="58" fill="#ffffff" opacity="0.22"/>
        </pattern>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="16" dy="20" stdDeviation="18" flood-color="#33242a" flood-opacity="0.28"/>
        </filter>
      </defs>
      <rect width="${SIZE}" height="${SIZE}" fill="url(#counter)"/>
      <rect x="84" y="94" width="1032" height="1012" rx="38" fill="#fffaf0" opacity="0.52"/>
      <g transform="rotate(-5 600 595)" filter="url(#softShadow)">
        <rect x="300" y="210" width="600" height="720" rx="46" fill="#33242a" opacity="0.18"/>
      </g>
      <g transform="rotate(-5 600 595)">
        <rect x="300" y="210" width="600" height="720" rx="46" fill="url(#foil)" stroke="#fff7e8" stroke-width="20"/>
        <rect x="300" y="210" width="600" height="720" rx="46" fill="url(#slashes)"/>
        <path d="M328 246 H872 M328 892 H872" stroke="#9ebfc8" stroke-width="3" opacity="0.5"/>
      </g>
      <text x="118" y="1026" font-family="Georgia, serif" font-size="29" letter-spacing="4" fill="#33242a">HOLOGRAPHIC STICKER</text>
      <text x="118" y="1064" font-family="Georgia, serif" font-size="18" letter-spacing="3" fill="#8a5b64">GATE INFINITY ISSUE</text>
    `)
  )
    .composite([
      { input: art, left: 340, top: 230 },
      { input: paperGrain(0.09), blend: "multiply" },
    ])
    .png()
    .toFile(join(OUT, "i-am-nomad-holographic-sticker-mockup.png"));
}

async function patch() {
  const art = await poster(500);

  await sharp(
    svg(`
      <defs>
        <linearGradient id="fabric" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#192c3a"/>
          <stop offset="0.55" stop-color="#314455"/>
          <stop offset="1" stop-color="#132531"/>
        </linearGradient>
        <pattern id="weave" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 6 H22 M0 17 H22 M6 0 V22 M17 0 V22" stroke="#ffffff" stroke-width="1" opacity="0.055"/>
        </pattern>
        <pattern id="stitch" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M3 15 H15" stroke="#f6e8c4" stroke-width="5" stroke-linecap="round"/>
        </pattern>
        <filter id="patchShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="18" dy="24" stdDeviation="20" flood-color="#0f151d" flood-opacity="0.35"/>
        </filter>
      </defs>
      <rect width="${SIZE}" height="${SIZE}" fill="#e9c6d4"/>
      <rect x="82" y="76" width="1036" height="1048" rx="28" fill="url(#fabric)"/>
      <rect x="82" y="76" width="1036" height="1048" rx="28" fill="url(#weave)"/>
      <path d="M314 178 H886 C947 178 996 227 996 288 V844 C996 905 947 954 886 954 H314 C253 954 204 905 204 844 V288 C204 227 253 178 314 178Z" fill="#0f151d" opacity="0.16" filter="url(#patchShadow)"/>
      <path d="M314 178 H886 C947 178 996 227 996 288 V844 C996 905 947 954 886 954 H314 C253 954 204 905 204 844 V288 C204 227 253 178 314 178Z" fill="#d9e4df" opacity="0.24"/>
      <path d="M314 178 H886 C947 178 996 227 996 288 V844 C996 905 947 954 886 954 H314 C253 954 204 905 204 844 V288 C204 227 253 178 314 178Z" fill="none" stroke="#f0d89a" stroke-width="38"/>
      <path d="M314 178 H886 C947 178 996 227 996 288 V844 C996 905 947 954 886 954 H314 C253 954 204 905 204 844 V288 C204 227 253 178 314 178Z" fill="none" stroke="url(#stitch)" stroke-width="12"/>
      <text x="600" y="1040" text-anchor="middle" font-family="Georgia, serif" font-size="30" letter-spacing="5" fill="#f6e8c4">EMBROIDERED PATCH</text>
    `)
  )
    .composite([
      { input: art, left: 350, top: 244 },
      { input: paperGrain(0.16), blend: "overlay" },
    ])
    .png()
    .toFile(join(OUT, "i-am-nomad-patch-mockup.png"));
}

async function tee() {
  const art = await poster(325);

  await sharp(
    svg(`
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#d5e5ea"/>
          <stop offset="0.45" stop-color="#f3d7df"/>
          <stop offset="1" stop-color="#f6e2bf"/>
        </linearGradient>
        <linearGradient id="cotton" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#fff8eb"/>
          <stop offset="0.58" stop-color="#eee0c8"/>
          <stop offset="1" stop-color="#d9c7ad"/>
        </linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="printSoft"><feDropShadow dx="12" dy="16" stdDeviation="8" flood-color="#6b4650" flood-opacity="0.16"/></filter>
      </defs>
      <rect width="${SIZE}" height="${SIZE}" fill="url(#wall)"/>
      <ellipse cx="600" cy="1030" rx="418" ry="66" fill="#5d424b" opacity="0.17" filter="url(#soft)"/>
      <path d="M394 228 C455 181 516 162 600 162 C684 162 745 181 806 228 L1018 350 L900 566 L812 526 L812 1000 H388 L388 526 L300 566 L182 350 Z" fill="url(#cotton)" stroke="#c9b59c" stroke-width="3"/>
      <path d="M512 190 C544 220 656 220 688 190 C670 244 530 244 512 190Z" fill="#dcc9af"/>
      <path d="M388 528 C456 570 744 570 812 528" fill="none" stroke="#cab79e" stroke-width="4" opacity="0.55"/>
      <path d="M300 566 C284 490 246 407 182 350 M900 566 C916 490 954 407 1018 350" fill="none" stroke="#c4af95" stroke-width="4" opacity="0.46"/>
      <rect x="532" y="226" width="136" height="46" rx="8" fill="#ecd6aa" stroke="#b69058"/>
      <text x="600" y="256" text-anchor="middle" font-family="Georgia, serif" font-size="15" letter-spacing="2" fill="#6c3c35">SKYWHALE</text>
      <rect x="432" y="318" width="338" height="406" rx="16" fill="#6b4650" opacity="0.08" filter="url(#printSoft)"/>
      <text x="600" y="1068" text-anchor="middle" font-family="Georgia, serif" font-size="30" letter-spacing="5" fill="#33242a">NOMAD TEE</text>
      <text x="600" y="1106" text-anchor="middle" font-family="Georgia, serif" font-size="17" letter-spacing="4" fill="#7d5a62">CREAM COTTON FRONT PRINT</text>
    `)
  )
    .composite([
      { input: art, left: 438, top: 320 },
      { input: paperGrain(0.1), blend: "multiply" },
    ])
    .png()
    .toFile(join(OUT, "i-am-nomad-tee-mockup.png"));
}

await mkdir(OUT, { recursive: true });
await sticker();
await patch();
await tee();
console.log("Created Nomad product mockups in merch/r5");
