#!/usr/bin/env node
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "merch", "r5");
const KEYFRAME = join(
  ROOT,
  "production",
  "video_project",
  "time_airport",
  "keyframes",
  "s02_baggage.png"
);

const img = `data:image/png;base64,${(await readFile(KEYFRAME)).toString("base64")}`;

const palette = {
  ink: "#283047",
  cream: "#f3e5c6",
  paper: "#fff7e8",
  rose: "#d98590",
  gold: "#d9a93f",
  sky: "#9fc9d5",
  sage: "#8fae8b",
};

const esc = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function defs() {
  return `
    <filter id="paper" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="17" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.11"/>
      </feComponentTransfer>
      <feBlend in="SourceGraphic" mode="multiply"/>
    </filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#7d5160" flood-opacity="0.22"/>
    </filter>
    <pattern id="stitch" width="28" height="12" patternUnits="userSpaceOnUse">
      <path d="M2 6 H16" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round"/>
    </pattern>
    <style>
      .title { font-family: Georgia, 'Times New Roman', serif; font-weight: 800; letter-spacing: 10px; fill: ${palette.ink}; }
      .small { font-family: Avenir, Helvetica, Arial, sans-serif; font-weight: 800; letter-spacing: 5px; fill: ${palette.ink}; }
      .script { font-family: Georgia, 'Times New Roman', serif; font-style: italic; fill: ${palette.ink}; }
    </style>`;
}

function routeArc(x, y, w, h, color = palette.gold) {
  return `<path d="M${x} ${y + h} C${x + w * 0.25} ${y - h * 0.35}, ${x + w * 0.73} ${y - h * 0.25}, ${x + w} ${y + h * 0.15}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 24"/>`;
}

function plane(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s}) rotate(-8)" fill="${palette.ink}" opacity="0.86">
    <path d="M0 0 L70 24 L0 48 L12 28 L-34 24 L12 20 Z"/>
    <path d="M18 21 L44 -20 L58 -15 L40 25 Z" opacity="0.8"/>
    <path d="M18 27 L44 68 L58 63 L40 23 Z" opacity="0.8"/>
  </g>`;
}

function fish(x, y, s = 1, fill = palette.gold) {
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity="0.9">
    <ellipse cx="0" cy="0" rx="46" ry="21" fill="${fill}" stroke="${palette.ink}" stroke-width="5"/>
    <path d="M43 0 L82 -25 L77 0 L82 25 Z" fill="${fill}" stroke="${palette.ink}" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="-22" cy="-4" r="5" fill="${palette.ink}"/>
    <path d="M-2 -17 C12 -36 30 -34 39 -22" fill="none" stroke="${palette.ink}" stroke-width="4" stroke-linecap="round"/>
  </g>`;
}

async function render(name, width, height, body) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>${defs()}</defs>
    <rect width="100%" height="100%" fill="${palette.cream}"/>
    ${body}
    <rect width="100%" height="100%" fill="transparent" filter="url(#paper)"/>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(join(OUT, name));
}

await mkdir(OUT, { recursive: true });

await render(
  "01-i-am-nomad-sticker.png",
  1600,
  1600,
  `
    <clipPath id="stickerClip"><path d="M205 174 C350 92 602 118 790 128 C1002 139 1240 83 1380 234 C1496 360 1438 604 1452 804 C1467 1012 1529 1230 1396 1376 C1232 1555 960 1492 778 1511 C551 1534 314 1567 178 1405 C53 1257 116 1035 124 824 C132 587 77 302 205 174 Z"/></clipPath>
    <path d="M205 174 C350 92 602 118 790 128 C1002 139 1240 83 1380 234 C1496 360 1438 604 1452 804 C1467 1012 1529 1230 1396 1376 C1232 1555 960 1492 778 1511 C551 1534 314 1567 178 1405 C53 1257 116 1035 124 824 C132 587 77 302 205 174 Z" fill="${palette.paper}" stroke="#ffffff" stroke-width="54" filter="url(#soft)"/>
    <g clip-path="url(#stickerClip)">
      <image href="${img}" x="178" y="214" width="1244" height="698" preserveAspectRatio="xMidYMid slice"/>
      <rect x="132" y="842" width="1336" height="610" fill="${palette.paper}"/>
      <path d="M132 842 C420 935 1118 930 1468 830 L1468 1452 L132 1452 Z" fill="${palette.sky}" opacity="0.22"/>
    </g>
    ${routeArc(288, 1040, 1024, 210)}
    ${fish(323, 1090, 1.2, palette.rose)}
    ${fish(1272, 1194, 1.0, palette.sage)}
    ${plane(1115, 1016, 1.25)}
    <text class="small" x="800" y="1030" text-anchor="middle" font-size="56">${esc("SKYWHALE AIRWAYS")}</text>
    <text class="title" x="800" y="1228" text-anchor="middle" font-size="134">${esc("I AM")}</text>
    <text class="title" x="800" y="1390" text-anchor="middle" font-size="150">${esc("NOMAD.")}</text>
  `
);

await render(
  "02-i-am-nomad-patch.png",
  1600,
  1600,
  `
    <clipPath id="patchClip"><path d="M205 174 C350 92 602 118 790 128 C1002 139 1240 83 1380 234 C1496 360 1438 604 1452 804 C1467 1012 1529 1230 1396 1376 C1232 1555 960 1492 778 1511 C551 1534 314 1567 178 1405 C53 1257 116 1035 124 824 C132 587 77 302 205 174 Z"/></clipPath>
    <path d="M205 174 C350 92 602 118 790 128 C1002 139 1240 83 1380 234 C1496 360 1438 604 1452 804 C1467 1012 1529 1230 1396 1376 C1232 1555 960 1492 778 1511 C551 1534 314 1567 178 1405 C53 1257 116 1035 124 824 C132 587 77 302 205 174 Z" fill="${palette.gold}" stroke="${palette.ink}" stroke-width="64" filter="url(#soft)"/>
    <path d="M205 174 C350 92 602 118 790 128 C1002 139 1240 83 1380 234 C1496 360 1438 604 1452 804 C1467 1012 1529 1230 1396 1376 C1232 1555 960 1492 778 1511 C551 1534 314 1567 178 1405 C53 1257 116 1035 124 824 C132 587 77 302 205 174 Z" fill="none" stroke="url(#stitch)" stroke-width="32"/>
    <path d="M246 228 C380 160 612 182 790 191 C990 201 1204 153 1332 286 C1438 396 1384 624 1396 805 C1410 997 1466 1194 1345 1328 C1196 1491 953 1432 781 1450 C568 1472 352 1498 229 1352 C117 1219 174 1016 181 822 C188 605 126 339 246 228 Z" fill="${palette.paper}"/>
    <g clip-path="url(#patchClip)">
      <image href="${img}" x="178" y="214" width="1244" height="698" preserveAspectRatio="xMidYMid slice"/>
      <rect x="132" y="842" width="1336" height="610" fill="${palette.paper}"/>
      <path d="M132 842 C420 935 1118 930 1468 830 L1468 1452 L132 1452 Z" fill="${palette.sky}" opacity="0.22"/>
    </g>
    ${routeArc(288, 1040, 1024, 210)}
    ${fish(323, 1090, 1.2, palette.rose)}
    ${fish(1272, 1194, 1.0, palette.sage)}
    ${plane(1115, 1016, 1.25)}
    <text class="small" x="800" y="1030" text-anchor="middle" font-size="56">${esc("SKYWHALE AIRWAYS")}</text>
    <text class="title" x="800" y="1228" text-anchor="middle" font-size="134">${esc("I AM")}</text>
    <text class="title" x="800" y="1390" text-anchor="middle" font-size="150">${esc("NOMAD.")}</text>
  `
);

await render(
  "03-i-am-nomad-tee.png",
  1400,
  1700,
  `
    <rect x="112" y="110" width="1176" height="1480" rx="78" fill="${palette.paper}" filter="url(#soft)"/>
    <g transform="translate(58 184) scale(0.802)">
      <clipPath id="teeClip"><path d="M205 174 C350 92 602 118 790 128 C1002 139 1240 83 1380 234 C1496 360 1438 604 1452 804 C1467 1012 1529 1230 1396 1376 C1232 1555 960 1492 778 1511 C551 1534 314 1567 178 1405 C53 1257 116 1035 124 824 C132 587 77 302 205 174 Z"/></clipPath>
      <path d="M205 174 C350 92 602 118 790 128 C1002 139 1240 83 1380 234 C1496 360 1438 604 1452 804 C1467 1012 1529 1230 1396 1376 C1232 1555 960 1492 778 1511 C551 1534 314 1567 178 1405 C53 1257 116 1035 124 824 C132 587 77 302 205 174 Z" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="30"/>
      <g clip-path="url(#teeClip)">
        <image href="${img}" x="178" y="214" width="1244" height="698" preserveAspectRatio="xMidYMid slice"/>
        <rect x="132" y="842" width="1336" height="610" fill="${palette.paper}"/>
        <path d="M132 842 C420 935 1118 930 1468 830 L1468 1452 L132 1452 Z" fill="${palette.sky}" opacity="0.22"/>
      </g>
      ${routeArc(288, 1040, 1024, 210)}
      ${fish(323, 1090, 1.2, palette.rose)}
      ${fish(1272, 1194, 1.0, palette.sage)}
      ${plane(1115, 1016, 1.25)}
      <text class="small" x="800" y="1030" text-anchor="middle" font-size="56">${esc("SKYWHALE AIRWAYS")}</text>
      <text class="title" x="800" y="1228" text-anchor="middle" font-size="134">${esc("I AM")}</text>
      <text class="title" x="800" y="1390" text-anchor="middle" font-size="150">${esc("NOMAD.")}</text>
    </g>
    <text class="small" x="700" y="1555" text-anchor="middle" font-size="34">${esc("SHIRT FRONT GRAPHIC")}</text>
  `
);

console.log("Created 3 Round 5 I AM NOMAD assets in merch/r5/");
