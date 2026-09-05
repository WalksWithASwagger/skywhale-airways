# Skywhale Airways Next

## Current milestone — direct film boarding

Approved direction: [product north star and roadmap](ROADMAP.md#approved-product-north-star).
Tracking: [transformation #111](https://github.com/WalksWithASwagger/skywhale-airways/issues/111),
[proof #112](https://github.com/WalksWithASwagger/skywhale-airways/issues/112).

Delivery boundary: one transformation tracker, one proof issue, one reviewable
proof PR. Do not merge or deploy. No future backlog is being created.

### Scope and smallest architecture

- Primary “Watch I AM NOMAD” entry and `#film-slot` permalink; optional wander
  with sound or muted; explicit link from the film to the existing Artifact Lab.
- Lightweight `src/main.js` owns navigation. A lazy `src/portal.js` owns the
  existing Journey/Fish initialization and scene loop. No renderer rewrite.
- `AudioBed` gains cancellation-safe pause/resume control. A small
  `src/film-player.js` adapter uses the supported YouTube IFrame API on the
  existing no-cookie iframe. No npm dependency, API key, model, or media bus.
- Film navigation never awaits WebGL, the player adapter, or terminal modules.
  Preserve the memoized terminal loader and all artifact hash consumers.
- Touch HTML/CSS, entry/audio modules, the existing browser harness/CI, and only
  the relevant README/runbook instructions. Preserve other agents' work.

### Done when

1. Homepage → Watch → native Play needs at most two deliberate actions and no
   required portal scrolling. `/#film-slot` opens directly at the film.
2. Film and external watch link remain usable with JavaScript disabled, portal
   startup failure, or unavailable terminal modules.
3. Entering/playing the film pauses ambience, including a pending play request.
   Explicit ambient resume first pauses the film; sound never resumes by itself.
   If player coordination is unavailable, native playback works and ambience
   stays muted after entering the film.
4. Current and legacy artifact URLs restore selections/name. Back/Forward does
   not recreate an obstructive gate or discard artifact state.
5. Wandering retains its scenes and sound choices. Watching directly does not
   initialize WebGL. Loading/failure states offer an immediate Watch route.
6. Keyboard focus stays within an enhanced entry overlay, moves to the chosen
   destination, and remains visible. Desktop, mobile, and reduced-motion paths
   are usable without horizontal overflow.
7. Relevant checks pass, the final diff is reviewed for scope/secrets, and one
   PR is open for review. Unavailable checks are recorded as unavailable.

### Decisions and bounded unknowns

- Keep Vite/vanilla JavaScript, Three.js, and the existing lockfiles. Node 24
  matches CI and Vite's supported engine range. No production AI path changes,
  so model selection and AI evals are not applicable.
- Native player controls own playback: no autoplay and no custom Play overlay.
  YouTube readiness and pause acknowledgement are the bounded integration
  unknowns. Verify them with a local player spike and deterministic failure/race
  tests before relying on the adapter; fail muted, never block Watch.
- Preserve the no-cookie host, set the API origin to the current site origin,
  and never put artifact names or secrets into player/API requests.
- Branch-specific Vercel auto-deployment must be disabled before the PR push to
  honor the explicit no-deploy boundary; leave main/other branches unchanged.
- Reference checks: [Vite requirements](https://vite.dev/guide/),
  [Three.js WebGL2 renderer](https://threejs.org/docs/pages/WebGLRenderer.html),
  [YouTube existing-iframe API and origin](https://developers.google.com/youtube/iframe_api_reference),
  [Vercel branch deployment control](https://vercel.com/docs/project-configuration/git-configuration),
  [Playwright page boundary testing](https://playwright.dev/docs/api/class-page#page-add-init-script),
  [Node test runner](https://nodejs.org/docs/latest-v24.x/api/test.html).

### Validation requirements and evidence

Baseline: verified upstream `ea154245e1e24cdc3fe016e94e01f981f56558b8`;
original main is 13 commits behind with unrelated local work preserved.
Clean-worktree `npm ci`, lint, build, SEO check (4 pages), SEO regression test
(1 test), `smoke`, and `smoke-artifact-link` all passed before runtime edits.
Both browser flows ended with no console/page errors. Baseline main chunk:
536.86 kB (136.88 kB gzip); existing >500 kB warning. Node 24.19.0, Vite 8.2.2.
The local YouTube spike reached ready/cued state, retained youtube-nocookie.com,
and exposed pauseVideo. Real playback and race behavior are validated separately.
No source assets or environment value files were copied from the dirty checkout.

After each meaningful checkpoint, run the relevant checks. Final validation:
`npm run lint`, `npm run build`, `npm run check:seo`, `npm run test:seo`,
`git diff --check`, existing smoke + artifact-link flow, and new film-flow
checks. Cover native entry, history, blocked JavaScript/WebGL/API/terminal
modules, delayed audio, unexpected console errors, keyboard, reduced motion,
and 1280px/390px layouts. Manually inspect the real embed and sound handoff.
No type-check script or production AI eval exists for this vanilla JS slice.

Before approving broader transformation, observe five first-time visitors:
can they start the film unaided and find the souvenir experience afterward?
This is a product validation requirement, not a result simulated by automation.

### Proof validation record — September 5, 2026

- Baseline and completed build: lint, build, four-page SEO check, existing SEO
  regression, and both existing browser flows passed. Existing >500 kB warning
  remains for the optional portal; it was not suppressed.
- Five audio tests pass, including a reproduced-and-fixed race where an old play
  completion arrived during a newer film-pause request. Explicit permission is
  tied to the current request; intent alone cannot enable playback.
- Eleven deterministic browser scenarios cover 1280px/390px/375px layouts,
  keyboard/focus/history, direct links without WebGL, native HTML navigation
  without JavaScript, application module failure, terminal import failure,
  escaping slow portal loading, legacy artifact restoration, and API ready /
  unavailable / unacknowledged-pause behavior. Expected injected failures are
  asserted explicitly; unexpected console/page errors fail the suite.
- The driver's negative console probe exits 1 with the expected diagnostic.
  CI now runs that probe, the audio tests, all three browser flows, and existing
  lint/build/SEO gates. Screenshot evidence is uploaded by the existing CI job.
- Real Chromium playback check: explicit ambient start, film entry mute, native
  YouTube playback progression, film pause before ambient resume, and personalized
  PNG download passed with no console/page errors. A separate real 390px player
  continued playing when the parent YouTube API was unavailable. The visible
  browser also completed the native film from Watch → Play.
- Local screenshots: the existing harness's ignored screenshots directory holds
  entry/screening/souvenir views; real playback captures are kept separately from
  the deterministic player screenshots. No generated screenshots or media enter
  the source commit.
- No npm dependencies, lockfiles, film assets, commerce implementation, analytics
  configuration, credentials, or shared/global agent settings changed.

### Scope adjustments and limits

- Artifact hash restoration now precedes optional WebGL initialization, reusing
  the existing parser. Its reveal respects reduced motion (small change in
  `src/artifact-lab.js`, required by the accepted navigation criteria).
- The native player keeps at least a 200px content height on narrow phones, as
  required by YouTube's documented embed contract.
- `vercel.json` disables auto-deployment only for `codex/film-first-entry` to honor
  the no-deploy review boundary. Main and other branches retain their settings.
- JavaScript-disabled validation proves static film-section/external-link access;
  YouTube itself needs JavaScript for playback. The separate application-module
  failure case preserves an independently working native embed.
- An initial JS-disabled automated click timed out in its stability check;
  native keyboard navigation passes. Real native playback and keyboard behavior
  were checked separately; no force-click or relaxed assertions were used.
- Physical iOS/Safari, assistive-technology review, production commerce, and five
  first-time human visits have not been run. No production AI behavior changed;
  AI evals and type checking are not applicable to this vanilla JS slice.

### Decision unlocked

Review whether direct film boarding preserves the airport's character and should
be accepted as the new entry experience. Technical independence and end-to-end
viewing/keepsake access are demonstrated; conversion and delight remain product
hypotheses. Next: observe five first-time visits, then scope one aftershow
keepsake milestone from what they struggle with. Do not merge, deploy, or expand
that milestone as part of this proof PR.

## Historical June handoff

The following dated handoff is preserved for provenance, not current checkout,
launch, tooling, or issue status. Use the milestone above for this proof.

Last updated: June 7, 2026.

### Current Production

- Production: `https://skywhaleairways.com/`
- Vercel fallback: `https://skywhale-airways.vercel.app/`
- Production auto-deploys the latest `main`; the Vite 8 / Rolldown build is verified live on Vercel.
- `www.skywhaleairways.com` returns HTTP 308 to the apex.
- GitHub Pages is retired and should return 404.
- Primary film: festival cut embedded from YouTube (Unlisted) — `youtu.be/3xmfwiwdhm8`
- Web cut: YouTube (Unlisted) — `youtu.be/nvKMmuzQNDs`. Both mp4s removed from the repo/LFS.
- Terminal artifacts live on the Gate Infinity desk: Gate Receipt, Route Map
  Postcard, and Suitcase Sticker Manifest.

### Homepage Entry Flow

- Current homepage flow runs: portal journey → contest-entry festival cut →
  Skywhale Artifact Lab → Duty-Free Souvenir Desk → credits.
- The festival cut remains the canonical YouTube no-cookie embed
  (`3xmfwiwdhm8`), with the 53s web cut linked at `nvKMmuzQNDs`.
- Verification on June 7: `npm run build` passes with the existing large-bundle
  warning; `npm run lint` passes; Browser smoke passes at `1280x720` and
  `390x844` with no console errors.
- The flow is part of `main`; this checkout is currently ahead of `origin/main`
  until the local commits are pushed.

### June 6–7 engineering + infra pass

A hardening sweep landed on `main` (all merged, all live):

- **CI gate** — GitHub Actions `build` + Playwright `smoke` runs on every PR
  (#36 / #38). The smoke flow is the run-skywhale-airways driver. Smoke flakiness
  on the HUD overlay is tracked in #56.
- **Lint + deps** — ESLint flat config + Prettier with `lint`/`format` scripts
  (#37); `three` 0.171→0.184, `sharp` 0.33→0.34, and Dependabot (#39).
- **Vite 6 → 8 (Rolldown/Oxc)** — `vite.config.js` uses `rolldownOptions`; build
  verified on Vercel (#41).
- **Canvas refactor** — the 873-line `terminal-artifacts.js` split into
  `src/artifacts/*` + a shared `src/canvas/` kit (`canvas-kit.js`,
  `canvas-draw.js`); the boarding-pass / decade-weather / passport-stamp widgets
  now reuse that kit (#42 + #51, tiers 1–3). `THREE.Clock` → `THREE.Timer` (#48).
- **LFS / film hosting** — the LFS budget exhaustion that failed every Vercel
  deploy (clone step) was fixed (budget top-up + Vercel Pro), and the durable fix
  removed both film mp4s from the repo/LFS; they're embedded from YouTube now
  (#49 / #57). See "Current Production" above for the URLs.

### Admin State

- GA4 is live with Measurement ID `G-W59LMFSG43`.
- Search Console URL-prefix verification is live and the sitemap has been
  submitted.
- Shopify Buy Button checkout is live for the I AM NOMAD holographic sticker
  through `dze7ru-ii.myshopify.com`.
- Vercel Production and Preview env vars are set for Shopify domain, Storefront
  token, and the sticker product ID. Patch, tee, and the broader catalog remain
  concept-gallery items until fulfillment and product setup are chosen.
- `shop.skywhaleairways.com` does not resolve. Leave it disconnected unless KK
  chooses a standalone Shopify storefront outside the embedded Buy Button flow.
- Shopify Dev MCP is configured globally in `/Users/kk/.codex/config.toml` as
  `shopify-dev-mcp` using `npx -y @shopify/dev-mcp@latest`. Restart Codex if it
  is not visible in the current session. After restart, callable tools were
  verified: `mcp__shopify_dev_mcp.learn_shopify_api` and
  `mcp__shopify_dev_mcp.search_docs_chunks`. Treat them as Shopify
  docs/schema/dev context, not as store-admin mutation tools.
- Skywhale Launch Monitor is active at
  `/Users/kk/.codex/automations/skywhale-launch-monitor/automation.toml`. It
  runs Fridays at 9:15 AM in read-only mode and now names the callable Shopify
  MCP docs tools while forbidding store, product, order, cart, deployment, commit,
  and issue-comment mutations.
- Do not commit real `.env` files or the Shopify Storefront access token.

### Open Work

- #15: Human watch/listen signoff for awards submission.
- #34: Optional standalone shop-domain handoff. The Vercel env and embedded
  sticker Buy Button are verified; only `shop.skywhaleairways.com` DNS/Shopify
  connection remains unresolved.
- #17: Parent tracker for broader Shopify/fulfillment. Child issue split:
  #25 Nomad tee size/fulfillment, #26 Chest Print patch, #27 Chest Print
  sticker/decal, #28 Decade Weather card/sticker, #29 baggage tag variant, #30
  Gravity Stops Insisting tee/sticker, #31 pin/sticker-sheet production.
  Fulfillment defaults and the standalone shop-domain decision are documented in
  `merch/fulfillment-roadmap.md`.
- Festival archive packaging is documented in `production/FESTIVAL_ARCHIVE.md`.

### Restart Commands

```bash
npm ci
npm run build
npm audit --audit-level=moderate
```

Use `npm run dev` for local work and `npm run preview` to smoke the Vercel-style
static build. Run `npm run optimize` only when source assets need regenerated
public derivatives.

### Production Archive Map

- Production pipeline overview: `production/README.md`
- Creative origin notes: `production/ORIGIN_NOTES.md`
- Awards QA checklist and evidence: `production/AWARDS_QA.md`
- Film production project: `production/video_project/time_airport/`
- Films: YouTube (Unlisted) — `youtu.be/3xmfwiwdhm8` (festival), `youtu.be/nvKMmuzQNDs` (web cut); removed from repo/LFS
- Shopify launch notes: `merch/shopify-launch.md`
- Duty-Free fulfillment policy: `merch/fulfillment-roadmap.md`
- Canonical Nomad art: `merch/r5/i-am-nomad-master.png`
- Holographic sticker print handoff:
  `merch/print/r5-i-am-nomad-holographic-sticker.png`
- Festival archive manifest: `production/FESTIVAL_ARCHIVE.md`

### Guardrails

- Keep **Skywhale Airways** as the brand.
- Keep **I AM NOMAD** as the canonical project/store image.
- Keep "Time Traveller" language across public and product copy.
- Keep Shopify embeds button/cart/checkout-only so Skywhale's own visual catalog
  remains the public storefront.
- Keep Git LFS enabled for production audio/video and source/print merch assets.
  (The public films are hosted on YouTube now, not Git LFS.)
