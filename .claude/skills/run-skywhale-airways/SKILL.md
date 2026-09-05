---
name: run-skywhale-airways
description: Build, run, and drive the Skywhale Airways WebGL microsite. Use when asked to start, serve, build, or screenshot the site, drive the scroll journey, festival-cut film, artifact lab, shop, or confirm a change works in the real running app.
---

Skywhale Airways is a Vite static microsite (`index.html` + `src/main.js`, Three.js WebGL, no backend). You run it with `npm run dev` (port 3000) and drive it with the committed Playwright harness `.claude/skills/run-skywhale-airways/driver.mjs` — a `chromium-cli`-style command interpreter (no real `chromium-cli` exists for this project). Screenshots land in `.claude/skills/run-skywhale-airways/screenshots/`.

All paths below are relative to the `skywhale-airways/` project directory.

## Prerequisites

- **Node** 24 (matches CI; Vite requires 20.19+ or 22.12+). No `apt-get` packages needed — this is a static site, not a desktop app, so no `xvfb`/`lib*`.
- On a fresh Linux box, Playwright's chromium needs system libs: `npx playwright install --with-deps chromium` (on this macOS host plain `npx playwright install chromium` is enough).

## Setup

Install the app's deps, then the harness's own deps (Playwright is **not** a project dependency — it lives only in the skill dir so the project `package.json` stays clean):

```bash
npm install                                                          # app deps (three, vite)
cd .claude/skills/run-skywhale-airways && npm install && npx playwright install chromium
cd -                                                                 # back to project root
```

No env vars are required to run locally. `.env.example` lists optional Shopify / Google analytics keys; the site renders fully without them.

## Run (agent path) — START HERE

1. Start the dev server in the background and poll the port (macOS has no `timeout`, so loop):

```bash
npm run dev > /tmp/skywhale-dev.log 2>&1 &
echo $! > /tmp/skywhale-dev.pid
for i in $(seq 1 30); do curl -sf http://localhost:3000 >/dev/null 2>&1 && { echo "SERVING"; break; }; sleep 1; done
```

2. Drive it. The scripted smoke flow enters the gate, scrolls to the promoted festival-cut film, generates an artifact, verifies the shop slots, and screenshots the main steps:

```bash
cd .claude/skills/run-skywhale-airways
node driver.mjs smoke
```

Expected output ends with `(no console/page errors)` and writes `01-gate.png`, `02-journey.png`, `03-film.png`, `04-terminal.png`, and `05-artifact-lab.png` into `screenshots/`. **Open `03-film.png` and `05-artifact-lab.png`** — they should show the promoted festival-cut film and a generated Skywhale artifact.

3. To verify Artifact Lab shared links, run the dedicated deep-link smoke. It loads a `#artifact?...` URL, closes the gate, and asserts the restored type, omen, decade, name, and canvas label:

```bash
cd .claude/skills/run-skywhale-airways
node driver.mjs smoke-artifact-link
```

Expected output ends with `(no console/page errors)` and writes `06-artifact-deeplink.png` into `screenshots/`. Open it — it should show the restored Good Pilots Route artifact for Sky Tester in the 1990s.

4. For ad-hoc driving, pipe commands on stdin (same session, one command per line):

```bash
printf 'nav http://localhost:3000\nwait #gate-board\nclick #gate-muted\nscroll-to #terminal\nwait-eval document.body.classList.contains("in-terminal")\nwait #film-slot\nscroll-to #artifact-lab\nscreenshot terminal\nconsole-errors\n' | node driver.mjs
```

Driver commands: `nav <url>`, `wait <selector>`, `wait-text <text>`, `wait-eval <js>`, `click <sel>`, `fill <sel> <value>`, `press <sel> <key>`, `scroll <px>`, `scroll-to <sel>`, `sleep <ms>`, `eval <js>`, `screenshot [name]`, `shot-el <sel> [name]` (crop to one element), `console-errors`, `quit`. Set `HEADED=1` to watch in a visible window.

5. Stop the server before relaunching (or the next `npm run dev` hits `EADDRINUSE`):

```bash
kill "$(cat /tmp/skywhale-dev.pid)" # only if this run started and recorded that PID
```

## Build

Static build to `dist/`. The large optional portal chunk warning is expected; the entry bundle does not include Three.js:

```bash
npm run build
npm run preview     # serves the built dist/ at the Vercel root path on http://localhost:4173
```

The README's `VITE_BASE_PATH=/skywhale-airways/` variant is the retired GitHub Pages subpath build — not needed for normal work.

## Key DOM handles

- **Entry gate** (`#gate`): primary `#gate-watch` links to `#film-slot`; optional `#gate-board`/`#gate-muted` start wandering with sound/muted. The enhanced dialog contains focus. Direct film links bypass it, and native Watch navigation works without JavaScript.
- **Scroll journey**: 10 viewport-tall panels build the WebGL scenes; `scroll`/`scroll-to` advances them.
- **Contest film**: `#film-slot` contains the canonical YouTube no-cookie festival cut and appears before extras or shop content.
- **Artifact lab**: `#artifact-lab`, `#artifact-form`, `#artifact-name`, `.artifact-type-option[data-value="route"]`, then `#artifact-download`. The lab renders the aftershow artifacts to `#artifact-canvas`.

## Gotchas

- **Choose the flow under test.** Use `#gate-watch` or `/#film-slot` for direct film entry. Use `#gate-muted` for optional wandering. Shared artifact links retain gate entry but restore directly without initializing WebGL.
- **`npm run dev` opens a browser** (`server.open: true` in `vite.config.js`). Harmless headless — it just fails to spawn a window; the server still serves.
- **`screenshot` is always full-page**, so for the long scroll site that's a tall strip. To verify one component, use `shot-el #film-slot` or `shot-el #artifact-lab` — that's what the smoke flow does.
- **WebGL needs a moment to paint.** After clicking the gate, `sleep 1200` before screenshotting the journey, or the canvas is blank. The smoke flow already does this.
- **Playwright resolves from the skill dir, not the project.** Run `node driver.mjs` from `.claude/skills/run-skywhale-airways/` (or it can't `import "playwright"`). `node_modules` and `screenshots` there are git-ignored.
- **No `timeout` on macOS.** Use the `for`-loop port poll above, not `timeout 30 bash -c ...`.
- **Film hosting:** the canonical festival cut is a YouTube no-cookie iframe, not a local MP4. No LFS pull is required to test it. Production media generation is outside the browser workflow.

## Troubleshooting

- **`Cannot find package 'playwright'`** — you ran the driver from the wrong cwd, or skipped the driver-deps install. `cd .claude/skills/run-skywhale-airways && npm install`.
- **`browserType.launch: Executable doesn't exist`** — chromium isn't installed: `npx playwright install chromium` from the skill dir.
- **`EADDRINUSE :3000`** — a previous dev server is still up: stop only the server PID started by this run; use another explicit port if an unrelated process owns 3000.
- **Artifact never appears** — choose Watch or Wander if the entry dialog is still open; inspect `#artifact-status` for loading/failure feedback. A terminal-module failure leaves film navigation available.

## Test

From the repo root run `npm run lint`, `npm run build`, `npm run check:seo`,
`npm run test:seo`, and `node --test tests/audio.test.mjs`. With preview serving,
run all three browser flows from this skill directory:

```bash
URL=http://localhost:4173 node driver.mjs smoke
URL=http://localhost:4173 node driver.mjs smoke-artifact-link
URL=http://localhost:4173 node driver.mjs smoke-film-entry
```

`smoke-film-entry` checks desktop/mobile, keyboard/history, direct links, blocked
JavaScript/WebGL/terminal/API, loading escape, legacy artifacts, and sound
ownership. Its YouTube boundary is simulated; manually check native playback and
audio handoff against the real player too. Console/page errors fail the driver.
Screenshots include film entry, screening, and souvenir views at 1280px, 390px, and 375px.
No production AI behavior changes, so no model eval is applicable.
