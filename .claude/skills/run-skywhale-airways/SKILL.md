---
name: run-skywhale-airways
description: Build, run, and drive the Skywhale Airways WebGL microsite. Use when asked to start, serve, build, or screenshot the site, drive the scroll journey or boarding-pass/decade-weather/passport-stamp generators, or confirm a change works in the real running app.
---

Skywhale Airways is a Vite static microsite (`index.html` + `src/main.js`, Three.js WebGL, no backend). You run it with `npm run dev` (port 3000) and drive it with the committed Playwright harness `.claude/skills/run-skywhale-airways/driver.mjs` — a `chromium-cli`-style command interpreter (no real `chromium-cli` exists for this project). Screenshots land in `.claude/skills/run-skywhale-airways/screenshots/`.

All paths below are relative to the `skywhale-airways/` project directory.

## Prerequisites

- **Node** 20+ (verified on v24.15.0). No `apt-get` packages needed — this is a static site, not a desktop app, so no `xvfb`/`lib*`.
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

2. Drive it. The scripted smoke flow enters the gate, scrolls to the terminal, generates a boarding pass, and screenshots each step:

```bash
cd .claude/skills/run-skywhale-airways
node driver.mjs smoke
```

Expected output ends with `(no console/page errors)` and writes `01-gate.png`, `02-journey.png`, `03-terminal.png`, `04-boarding-pass.png` into `screenshots/`. **Open `04-boarding-pass.png`** — it should show a generated "SKYWHALE AIRWAYS / TIME TRAVELER / NOW → FISH" pass.

3. For ad-hoc driving, pipe commands on stdin (same session, one command per line):

```bash
printf 'nav http://localhost:3000\nwait #gate-board\nclick #gate-muted\nscroll-to #terminal\nscreenshot terminal\nconsole-errors\n' | node driver.mjs
```

Driver commands: `nav <url>`, `wait <selector>`, `wait-text <text>`, `click <sel>`, `fill <sel> <value>`, `press <sel> <key>`, `scroll <px>`, `scroll-to <sel>`, `sleep <ms>`, `eval <js>`, `screenshot [name]`, `shot-el <sel> [name]` (crop to one element), `console-errors`, `quit`. Set `HEADED=1` to watch in a visible window.

4. Stop the server before relaunching (or the next `npm run dev` hits `EADDRINUSE`):

```bash
kill $(cat /tmp/skywhale-dev.pid) 2>/dev/null || pkill -f 'vite'
```

## Build

Static build to `dist/` (verified — builds in ~0.6s; the 539 kB main chunk warning is expected, it's the Three.js bundle):

```bash
npm run build
npm run preview     # serves the built dist/ at the Vercel root path on http://localhost:4173
```

The README's `VITE_BASE_PATH=/skywhale-airways/` variant is the retired GitHub Pages subpath build — not needed for normal work.

## Key DOM handles

- **Entry gate** (`#gate`): `#gate-board` ("Tap to board", starts audio) or `#gate-muted` ("enter muted"). Scroll is locked until one is clicked. The driver uses `#gate-muted` so it never needs an audio gesture.
- **Scroll journey**: 10 viewport-tall panels build the WebGL scenes; `scroll`/`scroll-to` advances them.
- **Terminal generators** (each is a `<form>` rendering to a `<canvas>`): boarding pass (`#pass-form`, `#pass-name`, `#pass-decade`, `#pass-generate`, then `#pass-download`), decade weather (`#weather-*`), passport stamp (`#stamp-*`), plus gate receipt / route postcard / suitcase manifest.

## Gotchas

- **The gate blocks everything.** Until `#gate-board`/`#gate-muted` is clicked, scroll is locked and the terminal is unreachable. Always click the gate first. `#gate-muted` avoids the sound-on path.
- **`npm run dev` opens a browser** (`server.open: true` in `vite.config.js`). Harmless headless — it just fails to spawn a window; the server still serves.
- **`screenshot` is always full-page**, so for the long scroll site that's a tall strip. To verify one component (e.g. the generated boarding pass), use `shot-el #boarding-pass` — that's what the smoke flow does.
- **WebGL needs a moment to paint.** After clicking the gate, `sleep 1200` before screenshotting the journey, or the canvas is blank. The smoke flow already does this.
- **Playwright resolves from the skill dir, not the project.** Run `node driver.mjs` from `.claude/skills/run-skywhale-airways/` (or it can't `import "playwright"`). `node_modules` and `screenshots` there are git-ignored.
- **No `timeout` on macOS.** Use the `for`-loop port poll above, not `timeout 30 bash -c ...`.
- **Git LFS only matters for the festival-cut video.** `.gitattributes` routes `*.mp4` (and `merch/`, `production/` assets) through LFS. On a fresh clone without `git lfs pull`, `public/film/*.mp4` are 133-byte pointer files, so the terminal's festival-cut `<video>` won't play. **The core experience does not need this** — the scene `.webp`s (`public/scenes/`), the `whale-sky-god.mp3` soundtrack, and the WebGL journey are committed as normal files and render with git-lfs absent (verified — git-lfs isn't even installed on this host and the journey paints fine). Only run `git lfs install && git lfs pull` if you specifically need the embedded videos.

## Troubleshooting

- **`Cannot find package 'playwright'`** — you ran the driver from the wrong cwd, or skipped the driver-deps install. `cd .claude/skills/run-skywhale-airways && npm install`.
- **`browserType.launch: Executable doesn't exist`** — chromium isn't installed: `npx playwright install chromium` from the skill dir.
- **`EADDRINUSE :3000`** — a previous dev server is still up: `pkill -f vite` then restart.
- **`04-boarding-pass.png` is blank / pass never appears** — the gate wasn't dismissed, so the form was off-screen/disabled. Confirm `click #gate-muted` ran before `scroll-to #terminal`.

## Test

There is no automated test suite (no `test` script in `package.json`). The smoke flow above **is** the regression check — run `node driver.mjs smoke` and confirm it ends with `(no console/page errors)` and a valid boarding-pass screenshot.
