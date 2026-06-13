# Skywhale Airways ✈ 🐋

A scroll-driven, heavy-WebGL microsite for the animation _I AM NOMAD_ (a
psychedelic airport for time travelers) — **AI Film Club · Retro Challenge · June 2026**, by
**Kris Krug & Suzy Easton**. _Skywhale Airways_ is the in-world airline brand
(it's the airline on the boarding pass) and the project's name for festivals and
merch.

**Canonical domain:** https://skywhaleairways.com/

**Production host:** Vercel at the domain root. The apex and `www` custom
domains are attached to the Vercel project and resolve publicly through
Porkbun DNS.

**Vercel fallback:** https://skywhale-airways.vercel.app/

**Shopify checkout:** the live I AM NOMAD holographic sticker checks out through
an embedded Shopify Buy Button backed by `dze7ru-ii.myshopify.com`.
`shop.skywhaleairways.com` is not connected; the embedded Buy Button is the
current shop surface.

Ten hand-painted gouache keyframes become a single immersive journey: scroll
melts each scene into the next with a liquid chromatic shader, generative
fish-aircraft drift in parallax, the *whale sky god* soundtrack plays underneath
and drives the distortion, and the poetic voiceover surfaces line by line. After
that portal, the terminal leads with the festival cut: the animation contest
entry. Visitors can then remix the film, lyrics, and merch art into one
downloadable Skywhale Artifact Lab souvenir before browsing the Duty-Free merch
concepts.

## Run it

```bash
npm install
npm run optimize   # refreshes committed public assets when local source folders exist
npm run dev        # http://localhost:3000
```

`npm run build` writes the static site to `dist/`. `npm run preview` serves the
root-path Vercel build locally. `npm run lint` runs ESLint; every PR is gated by
a GitHub Actions **build + Playwright smoke** check (`.github/workflows/ci.yml`).

To test the old GitHub Pages subpath build manually, run:

```bash
VITE_BASE_PATH=/skywhale-airways/ npm run build
npm run preview -- --base /skywhale-airways/
```

## Deploy

Vercel is the production host. The GitHub repo is linked, Git LFS is enabled in
the project's Git settings, and production deploys from `main`.

The local Vercel CLI should be `54.9.0` or newer before deployment work:

```bash
npm i -g vercel@latest
```

Custom domains attached in Vercel and resolving publicly on June 2, 2026:

- `skywhaleairways.com`
- `www.skywhaleairways.com`

Porkbun DNS records:

- `A` record: `skywhaleairways.com` → `76.76.21.21`
- `A` record: `www.skywhaleairways.com` → `76.76.21.21`

As of June 5, 2026 18:27 PDT, the apex returned HTTP 200 from Vercel and `www`
returned HTTP 308 to the apex. Page canonical tags point at the apex domain.

GitHub Pages was disabled on June 3, 2026 after Vercel production was verified.
The old `walkswithaswagger.github.io/skywhale-airways/` URL should return 404.

Shopify Buy Button env vars are documented in `.env.example` and
`merch/shopify-launch.md`. Production and preview env vars are set in Vercel for
the live I AM NOMAD holographic sticker; patch, tee, and broader catalog pieces
remain concept-gallery items until fulfillment and product setup are chosen.

Admin verification env vars are also documented in `.env.example`.
`VITE_GA_MEASUREMENT_ID` loads GA4 only when a valid `G-...` or `GT-...` tag is
present; production currently uses `G-W59LMFSG43`. `VITE_GOOGLE_SITE_VERIFICATION`
injects the Search Console verification meta tag at build time.

`sitemap.xml` is generated during `vite build` from the page list in
`vite.config.js` (with git-derived `<lastmod>` dates) and served from the site
root, so it never drifts from the pages that actually ship. `robots.txt` points
crawlers at it. Set `VITE_SITE_URL` to override the base URL if the domain
changes.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for launch gates, merge order, and post-launch
work. See [NEXT.md](NEXT.md) for the shortest restart handoff.

- **Vercel production** — live at the domain root with custom aliases; the films
  are embedded from YouTube (no longer Git LFS), and the Vite 8 / Rolldown build
  is verified on Vercel.
- **Finished film** — the 59s festival / awards cut is embedded in the
  `#film-frame` slot from YouTube (Unlisted, `youtu.be/3xmfwiwdhm8`). The 53s web
  cut is also on YouTube (`youtu.be/nvKMmuzQNDs`). Both mp4s were removed from the
  repo/LFS so Vercel no longer pulls ~158 MB of LFS on every deploy.
- **Festival submissions** — _Skywhale Airways_ is the submission brand; the site
  includes an award-facing press kit at `press.html`.
- **Duty-Free merch** — the I AM NOMAD holographic sticker mounts a real Shopify
  Buy Button; patch, tee, and broader catalog pieces remain concept-only until
  fulfillment and product setup are chosen. Source and print-ready PNGs are kept in
  `merch/` and tracked with Git LFS; deployable WebP derivatives live in
  `public/merch/`.

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
- **`press.html`** — the festival-facing press kit: programmer snapshot,
  artistic thesis, credits, runtime, format notes, stills/key art, rights note,
  and distinct festival/web cut links.
- **`src/fish-particles.js`** — generative fish drawn as `THREE.Points` in the
  same render pass, parallaxing with scroll and pulsing with the audio.
- **Boarding gate** (`#gate` in `index.html`, wired in `src/main.js`) — the site
  opens on an entry overlay so it's **sound-on by default**: browsers block
  autoplay until a gesture, so the "Tap to board" tap _is_ that gesture and starts
  the soundtrack. A small "enter muted" link is the courteous opt-out.
- **`src/audio.js`** — the soundtrack bed + a WebAudio `AnalyserNode` feeding a
  `0..1` amplitude into the shader. The boarding-gate tap starts playback; the
  `SOUND` toggle mutes/unmutes.
- **`src/artifact-lab.js`** — the aftershow Artifact Lab. It composites committed
  Skywhale scene/merch art plus textless plates in `public/artifacts/` into a
  deterministic 1024px PNG. State is shareable through `#artifact?...`; old
  `#pass`, `#weather`, `#stamp`, `#receipt`, `#route`, and `#manifest` links map
  into the new lab.
- **Legacy canvas widgets** (`src/boarding-pass.js`, `src/decade-weather.js`,
  `src/passport-stamp.js`, `src/artifacts/`, `src/canvas/`, and
  `src/terminal-artifacts.js`) — retained as source-history/reference modules,
  but no longer imported by the homepage.
- **`src/shop-data.js` / `src/shop.js` / `src/shopify-buy-buttons.js`** — the
  Duty-Free catalog, renderer, and Shopify Buy Button loader. Products with
  enabled Shopify config mount embedded buttons when Vite env vars are set; all
  other products remain concept-only.
- **`src/analytics.js`** — optional GA4 loader. It is included on all public
  entry pages but does nothing until `VITE_GA_MEASUREMENT_ID` is configured.
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

## Film Embed

The festival cut is hosted on YouTube (Unlisted) and embedded in the
`#film-frame` slot via a privacy-friendly `youtube-nocookie` iframe — the mp4s
are no longer in the repo (removed from Git LFS to stop Vercel pulling ~158 MB
per deploy). The 53s web cut is also on YouTube (`youtu.be/nvKMmuzQNDs`).

```html
<div class="film-frame" id="film-frame">
  <iframe
    src="https://www.youtube-nocookie.com/embed/3xmfwiwdhm8"
    title="I AM NOMAD — festival cut"
    loading="lazy"
    allowfullscreen
  ></iframe>
</div>
```

Awards verification lives in `production/AWARDS_QA.md`.
