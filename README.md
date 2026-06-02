# Skywhale Airways ✈ 🐋

A scroll-driven, heavy-WebGL microsite for the animation *A Psychedelic Airport
for Time Travelers* — **AI Film Club · Retro Challenge · June 2026**, by
**Kris Krug & Suzie Easton**. *Skywhale Airways* is the in-world airline brand
(it's the airline on the boarding pass) and the project's name for festivals and
merch.

**Live:** https://walkswithaswagger.github.io/skywhale-airways/

Ten hand-painted gouache keyframes become a single immersive journey: scroll
melts each scene into the next with a liquid chromatic shader, generative
fish-aircraft drift in parallax, the *whale sky god* soundtrack plays underneath
and drives the distortion, and the poetic voiceover surfaces line by line. At the
end of the terminal, visitors issue themselves a time-travel boarding pass.

## Run it

```bash
npm install
npm run optimize   # builds public/scenes/*.webp + public/audio from the source folder
npm run dev        # http://localhost:3000
```

`npm run build` → `dist/` (static). `npm run preview` to check it.

## Deploy

Pushing to `main` auto-deploys to **GitHub Pages** via
`.github/workflows/deploy.yml` (build → `dist` → Pages). The site lives under the
`/skywhale-airways/` subpath, so `vite.config.js` sets `base` on build and all
runtime asset URLs are prefixed with `import.meta.env.BASE_URL`. If you rename the
repo, update that one `base` string.

## Roadmap

- **Finished film** — drop the Veo animation into the reserved `#film-frame`
  slot (below).
- **Festival submissions** — *Skywhale Airways* is the submission brand; the site
  doubles as the press/landing page.
- **Merch** — a shop section for stickers, patches, and shirts of the characters
  (the skywhale, the golden fish) and song lyrics. Not built yet; the airline
  branding (boarding pass, wordmark) is the design seed.

## How it works

- **`src/journey.js`** — Three.js. One fullscreen quad whose shader
  (`src/shaders/transition.frag`) melts between adjacent scene textures. Scroll
  sets a `progress` uniform in `[0, N-1]`; the fraction is the melt (eased with a
  gentle constant so it keeps flowing after you stop). A `uMouse` uniform trails
  the cursor (`pointermove` in `main.js`, hover-capable devices only) for subtle
  parallax + ripple; touch leaves it centered. Textures lazy-load as you approach.
- **`about.html`** — the colophon / methodology page (a second Vite entry,
  registered in `vite.config.js`), linked from the footer. Honest about the
  tools, told in the film's voice.
- **`src/fish-particles.js`** — generative fish drawn as `THREE.Points` in the
  same render pass, parallaxing with scroll and pulsing with the audio.
- **Boarding gate** (`#gate` in `index.html`, wired in `src/main.js`) — the site
  opens on an entry overlay so it's **sound-on by default**: browsers block
  autoplay until a gesture, so the "Tap to board" tap *is* that gesture and starts
  the soundtrack. A small "enter muted" link is the courteous opt-out (and, since
  there's no scroll-autostart, the mute sticks until the `SOUND` toggle is used).
- **`src/audio.js`** — the soundtrack bed + a WebAudio `AnalyserNode` feeding a
  `0..1` amplitude into the shader. The boarding-gate tap starts playback (autoplay
  is blocked otherwise); the `SOUND` toggle mutes/unmutes.
- **`src/boarding-pass.js`** — the signature widget. Name + decade → a canvas
  boarding pass in the film's style, downloadable / shareable. No backend.
- **`src/data/scenes.js`** — the single source of truth: ten scenes, each with a
  title and its voiceover lines.
- **Accessibility** — `prefers-reduced-motion` zeroes the shader's `uIntensity`
  (no shake, no chromatic melt, calm crossfades) and stills the grain; captions
  stay readable and the piece remains fully scrollable.

## Assets

`scripts/optimize-assets.mjs` reads the Midjourney keyframe folder on the Desktop
and writes responsive WebP (1600w + 800w) plus the audio bed into `public/`. The
`SCENES` map in that script is the scene → source-PNG mapping; only the optimized
WebP are committed, never the ~2 MB originals.

**Soundtrack:** currently `whale sky god.mp3`. The session folder also holds
`Airline Brochure.mp3` and `Beneath Skywhale.mp3` — swap the `AUDIO_SRC` line in
`scripts/optimize-assets.mjs` and re-run `npm run optimize` to change the bed.

## Dropping in the finished film

The animation is still in progress. When it's ready, replace the placeholder in
the `#film-frame` element in `index.html` with the embed, e.g.:

```html
<div class="film-frame" id="film-frame">
  <video src="/film/psychedelic-airport.mp4" controls playsinline poster="/scenes/01-skywhale-airport.webp"></video>
</div>
```

(or a YouTube/Vimeo `<iframe>`). Put the file under `public/film/`.
