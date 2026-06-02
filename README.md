# A Psychedelic Airport for Time Travelers

A scroll-driven, heavy-WebGL microsite for the animation *A Psychedelic Airport
for Time Travelers* — **AI Film Club · Retro Challenge · June 2026**, by
**Kris Krug & Suzie Easton**.

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

`npm run build` → `dist/` (static, deploy to Vercel). `npm run preview` to check it.

## How it works

- **`src/journey.js`** — Three.js. One fullscreen quad whose shader
  (`src/shaders/transition.frag`) melts between adjacent scene textures. Scroll
  sets a `progress` uniform in `[0, N-1]`; the fraction is the melt. Textures
  lazy-load as the scroll approaches them.
- **`src/fish-particles.js`** — generative fish drawn as `THREE.Points` in the
  same render pass, parallaxing with scroll and pulsing with the audio.
- **`src/audio.js`** — the soundtrack bed + a WebAudio `AnalyserNode` feeding a
  `0..1` amplitude into the shader. Autoplay is blocked by browsers, so playback
  starts on the first gesture; the `SOUND` toggle mutes/unmutes.
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
