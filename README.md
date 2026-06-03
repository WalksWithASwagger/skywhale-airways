# Skywhale Airways ✈ 🐋

A scroll-driven, heavy-WebGL microsite for the animation *A Psychedelic Airport
for Time Travelers* — **AI Film Club · Retro Challenge · June 2026**, by
**Kris Krug & Suzie Easton**. *Skywhale Airways* is the in-world airline brand
(it's the airline on the boarding pass) and the project's name for festivals and
merch.

**Canonical domain:** https://skywhaleairways.com/

**Production host:** Vercel at the domain root. The apex and `www` custom
domains are attached to the Vercel project and resolve publicly through
Porkbun DNS.

**Vercel fallback:** https://skywhale-airways.vercel.app/

Ten hand-painted gouache keyframes become a single immersive journey: scroll
melts each scene into the next with a liquid chromatic shader, generative
fish-aircraft drift in parallax, the *whale sky god* soundtrack plays underneath
and drives the distortion, and the poetic voiceover surfaces line by line. At the
end of the terminal, visitors issue themselves a time-travel boarding pass,
watch the finished cut in the terminal frame, and browse the Skywhale Airways
Duty-Free merch concepts.

## Run it

```bash
npm install
npm run optimize   # refreshes committed public assets when local source folders exist
npm run dev        # http://localhost:3000
```

`npm run build` writes the static site to `dist/`. `npm run preview` serves the
root-path Vercel build locally.

To test the old GitHub Pages subpath build manually, run:

```bash
VITE_BASE_PATH=/skywhale-airways/ npm run build
npm run preview -- --base /skywhale-airways/
```

## Deploy

Vercel is the production host. The GitHub repo is linked, Git LFS is enabled in
the project's Git settings, and production deploys from `main`.

Custom domains attached in Vercel and resolving publicly on June 2, 2026:

- `skywhaleairways.com`
- `www.skywhaleairways.com`

Porkbun DNS records:

- `A` record: `skywhaleairways.com` → `76.76.21.21`
- `A` record: `www.skywhaleairways.com` → `76.76.21.21`

As of June 2, 2026 14:01 PDT, both apex and `www` returned HTTP 200 from
Vercel. Page canonical tags point at the apex domain.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for launch gates, merge order, and post-launch
work.

- **Vercel production** — verified on June 2, 2026 with root-path assets, custom
  aliases attached, and a real Git LFS-backed film file.
- **Finished film** — the Veo cut is wired into the `#film-frame` slot from
  `public/film/psychedelic-airport.mp4`.
- **Festival submissions** — *Skywhale Airways* is the submission brand; the site
  includes a lightweight press kit at `press.html`.
- **Duty-Free merch** — concept products are live on the site. Source and
  print-ready PNGs are kept in `merch/` and tracked with Git LFS; deployable WebP
  derivatives live in `public/merch/`.

## How it works

- **`src/journey.js`** — Three.js. One fullscreen quad whose shader
  (`src/shaders/transition.frag`) melts between adjacent scene textures. Scroll
  sets a `progress` uniform in `[0, N-1]`; the fraction is the melt. A `uMouse`
  uniform trails the cursor (`pointermove` in `main.js`, hover-capable devices
  only) for subtle parallax + ripple; touch leaves it centered. Textures
  lazy-load as you approach.
- **`about.html`** — the colophon / methodology page (a second Vite entry,
  registered in `vite.config.js`), linked from the footer. Honest about the
  tools, told in the film's voice.
- **`press.html`** — the festival-facing press kit: synopsis, credits, runtime,
  format notes, stills, and film links.
- **`src/fish-particles.js`** — generative fish drawn as `THREE.Points` in the
  same render pass, parallaxing with scroll and pulsing with the audio.
- **Boarding gate** (`#gate` in `index.html`, wired in `src/main.js`) — the site
  opens on an entry overlay so it's **sound-on by default**: browsers block
  autoplay until a gesture, so the "Tap to board" tap *is* that gesture and starts
  the soundtrack. A small "enter muted" link is the courteous opt-out.
- **`src/audio.js`** — the soundtrack bed + a WebAudio `AnalyserNode` feeding a
  `0..1` amplitude into the shader. The boarding-gate tap starts playback; the
  `SOUND` toggle mutes/unmutes.
- **`src/boarding-pass.js`** — the signature widget. Name + decade → a canvas
  boarding pass in the film's style, downloadable / shareable. No backend.
- **`src/decade-weather.js`** — a second client-side canvas widget. Decade →
  a Skywhale Airways weather advisory with deterministic copy, downloadable /
  shareable as a mini print.
- **`src/shop-data.js` / `src/shop.js`** — the Duty-Free catalog and renderer.
  Buttons are disabled until a fulfillment provider is chosen.
- **`src/data/scenes.js`** — the single source of truth: ten scenes, each with a
  title and its voiceover lines.
- **Accessibility** — `prefers-reduced-motion` zeroes the shader's `uIntensity`
  (no shake, no chromatic melt, calm crossfades) and stills the grain; captions
  stay readable and the piece remains fully scrollable.

## Assets

`scripts/optimize-assets.mjs` reads local source folders when they are present
and writes deployable WebP/audio assets into `public/`. If the old Desktop
keyframe folder is gone, scene/audio optimization is skipped because those
outputs are already committed.

The sibling checkout `/Users/kk/Code/psychedelic-airport` was used as the source
for the merch PNGs and print-ready die-cuts now preserved in `merch/`.
Those source/print assets are tracked with Git LFS. `scripts/diecut.mjs` can
regenerate transparent print cuts from the merch round folders. Round 4 centers
the Skywhale Chest Print art for patches, decals, sticker sheets, pins, and the
Decade Weather card. Round 5 makes the upgraded **I AM NOMAD** master art the
canonical project/store image, adapted across the holographic sticker, patch,
and tee products. Its source lives at `merch/r5/i-am-nomad-master.png`; the
print sticker handoff lives at `merch/print/r5-i-am-nomad-holographic-sticker.png`.

**Soundtrack:** currently `whale sky god.mp3`. The original session folder also
held `Airline Brochure.mp3` and `Beneath Skywhale.mp3`; swap the `AUDIO_SRC` line
in `scripts/optimize-assets.mjs` and re-run `npm run optimize` to change the bed
when those local sources are available.

## Film embed

The finished web cut is committed at `public/film/psychedelic-airport.mp4` and
is embedded in the `#film-frame` element with relative asset paths. Git LFS is
enabled on Vercel, and production serves the file as `video/mp4`.

```html
<div class="film-frame" id="film-frame">
  <video src="./film/psychedelic-airport.mp4" controls playsinline poster="./scenes/01-skywhale-airport.webp"></video>
</div>
```
