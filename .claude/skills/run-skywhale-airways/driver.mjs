#!/usr/bin/env node
// Playwright driver for the Skywhale Airways microsite — a chromium-cli-style
// command interpreter. The project ships no chromium-cli, so this is the
// committed harness a future agent uses to drive the running dev server.
//
//   node driver.mjs smoke                       # scripted entry→scroll→pass flow
//   node driver.mjs <<'EOF' ... EOF             # pipe commands on stdin
//   echo 'nav http://localhost:3000\nscreenshot' | node driver.mjs
//
// Commands (one per line, '#' lines ignored):
//   nav <url>                 navigate and wait for DOMContentLoaded
//   wait <selector>           wait for selector to be visible (10s)
//   wait-text <text>          wait for text to appear (10s)
//   click <selector>          click an element
//   fill <selector> <value>   fill an input (rest of line is the value)
//   press <selector> <key>    press a key on a focused selector
//   scroll <px>               scroll window by px (drives the WebGL journey)
//   scroll-to <selector>      scrollIntoView the selector
//   sleep <ms>                hard wait (use sparingly; prefer wait/wait-text)
//   eval <js>                 run JS in page, print result
//   screenshot [name]         full-page PNG into ./screenshots/<name>.png
//   shot-el <selector> [name] crop screenshot to one element
//   console-errors            print console errors/page errors collected so far
//   quit                      close and exit
//
// Env: URL (default http://localhost:3000), HEADED=1 to watch, SHOT_DIR override.

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOT_DIR = process.env.SHOT_DIR || join(__dirname, "screenshots");
const URL = process.env.URL || "http://localhost:3000";
mkdirSync(SHOT_DIR, { recursive: true });

// Prefer Playwright's bundled chromium; fall back to system Chrome.
async function launch() {
  const opts = { headless: !process.env.HEADED, args: ["--no-sandbox"] };
  try {
    return await chromium.launch(opts);
  } catch {
    return await chromium.launch({ ...opts, channel: "chrome" });
  }
}

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

let shotN = 0;
async function screenshot(name) {
  const file = join(SHOT_DIR, `${name || `shot-${String(++shotN).padStart(2, "0")}`}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`📸 ${file}`);
}

async function run(line) {
  const t = line.trim();
  if (!t || t.startsWith("#")) return;
  const sp = t.indexOf(" ");
  const cmd = sp === -1 ? t : t.slice(0, sp);
  const rest = sp === -1 ? "" : t.slice(sp + 1).trim();
  switch (cmd) {
    case "nav":
      await page.goto(rest || URL, { waitUntil: "domcontentloaded" });
      console.log(`→ ${rest || URL}`);
      break;
    case "wait":
      await page.locator(rest).first().waitFor({ state: "visible", timeout: 10000 });
      console.log(`✓ visible ${rest}`);
      break;
    case "wait-text":
      await page.getByText(rest, { exact: false }).first().waitFor({ state: "visible", timeout: 10000 });
      console.log(`✓ text "${rest}"`);
      break;
    case "click":
      await page.locator(rest).first().click({ timeout: 10000 });
      console.log(`• click ${rest}`);
      break;
    case "fill": {
      const fsp = rest.indexOf(" ");
      const sel = rest.slice(0, fsp);
      const val = rest.slice(fsp + 1);
      await page.locator(sel).first().fill(val);
      console.log(`• fill ${sel} = ${val}`);
      break;
    }
    case "press": {
      const psp = rest.indexOf(" ");
      const sel = rest.slice(0, psp);
      const key = rest.slice(psp + 1);
      await page.locator(sel).first().press(key);
      console.log(`• press ${key} on ${sel}`);
      break;
    }
    case "scroll":
      await page.evaluate((px) => window.scrollBy(0, px), Number(rest));
      console.log(`• scroll ${rest}`);
      break;
    case "scroll-to":
      await page.locator(rest).first().scrollIntoViewIfNeeded();
      console.log(`• scroll-to ${rest}`);
      break;
    case "sleep":
      await page.waitForTimeout(Number(rest));
      break;
    case "eval":
      console.log(JSON.stringify(await page.evaluate(rest)));
      break;
    case "screenshot":
      await screenshot(rest);
      break;
    case "shot-el": {
      const esp = rest.indexOf(" ");
      const sel = esp === -1 ? rest : rest.slice(0, esp);
      const nm = esp === -1 ? `el-${++shotN}` : rest.slice(esp + 1);
      const file = join(SHOT_DIR, `${nm}.png`);
      await page.locator(sel).first().screenshot({ path: file });
      console.log(`📸 ${file}`);
      break;
    }
    case "console-errors":
      console.log(errors.length ? errors.join("\n") : "(no console/page errors)");
      break;
    case "quit":
      throw { done: true };
    default:
      console.log(`?? unknown command: ${cmd}`);
  }
}

// The scripted representative flow used by `smoke`.
const SMOKE = `
nav ${URL}
wait #gate-board
screenshot 01-gate
click #gate-muted
sleep 1200
screenshot 02-journey
scroll-to #terminal
wait #pass-form
screenshot 03-terminal
fill #pass-name Time Traveler
click #pass-generate
wait #pass-download
shot-el #boarding-pass 04-boarding-pass
console-errors
quit
`;

const lines =
  process.argv[2] === "smoke"
    ? SMOKE.split("\n")
    : await new Promise((res) => {
        const acc = [];
        createInterface({ input: process.stdin })
          .on("line", (l) => acc.push(l))
          .on("close", () => res(acc));
      });

try {
  for (const line of lines) await run(line);
} catch (e) {
  if (!e?.done) {
    console.error("✗", e?.message || e);
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
