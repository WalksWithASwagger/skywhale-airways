# Skywhale Airways Roadmap

Last updated: June 4, 2026 14:34 PDT / 21:34 UTC.

## Launch Status

Skywhale Airways remains the project and festival brand. Vercel is the primary
production host, Git LFS media is enabled, and the public domain root is live at
`https://skywhaleairways.com/`. `www.skywhaleairways.com` hard-redirects to the
apex with HTTP 308.

Duty-Free is live for the first Nomad drop. The first three cards use Skywhale's
own catalog art and copy, then mount embedded Shopify Buy Buttons for checkout.
The Shopify API domain is `dze7ru-ii.myshopify.com`; `shop.skywhaleairways.com`
remains a later custom shop-domain polish task, not a launch blocker.

GA4 and Search Console are live for production. The GA4 Measurement ID is
`G-W59LMFSG43`, Search Console URL-prefix verification is installed through the
production meta tag, and the sitemap has been submitted.

The public film path leads with the 59s festival / awards cut while preserving
the original 53s web cut.

The canonical repository is `/Users/kk/Code/skywhale-airways`. The sibling
checkout `/Users/kk/Code/psychedelic-airport` was used only as the source for
preserved merch PNG and print assets.

## Closed Out

- PR #2: Vercel/root-path cleanup, Git LFS policy, merch source assets, fallback
  Pages configuration, and documentation refresh.
- PR #1: film production pipeline and final web cut.
- PR #9: awards/festival cut package, Press Kit upgrade, widget share links, and
  production notes. Merged June 4, 2026.
- Vercel Git LFS enabled for Git deployments.
- GitHub Pages workflow removed, Pages disabled, and the old
  `walkswithaswagger.github.io/skywhale-airways/` URL verified as 404 instead of
  the stale June 2 build.
- Domain `skywhaleairways.com` registered and attached to the Vercel project as
  both apex and `www`.
- Porkbun DNS verified for apex and `www`; apex returns HTTP 200 from Vercel and
  `www` returns HTTP 308 to the apex.
- Social preview image metadata added for the public pages.
- Merch Wave 5 refined: the upgraded **I AM NOMAD** poster is the canonical
  project/store image and drives the sticker, patch, tee, and social preview
  art.
- Shopify Buy Button checkout launched for the first three Nomad products:
  sticker, patch, and tee. Issue #10 closed.
- GA4 stream verified and production collection smoke-tested. Issue #11 closed.
- Search Console URL-prefix property verified and sitemap submitted. Issue #12
  closed.
- Suno cover art for **Whale Sky God** archived in production titles.
- Awards/festival cut v2 imported and wired as the primary homepage film frame:
  `public/film/skywhale-awards-cut-v2.mp4`.
- Original 53s web cut preserved at `public/film/psychedelic-airport.mp4`.
- Awards title card, credits card, and audio master archived under
  `production/video_project/time_airport/`.
- Press Kit upgraded for festival programmers with a snapshot, canonical
  **I AM NOMAD** key art, thesis, distinct festival/web cut links, process note,
  and rights/clearance language.
- Boarding pass and Decade Weather widgets support copyable state links:
  `#pass?...` and `#weather?...`.
- Terminal widgets polished into a Gate Infinity desk, with upgraded Boarding
  Pass and Decade Weather artwork plus a Passport Stamp widget at `#stamp?...`.
- Awards QA handoff added at `production/AWARDS_QA.md`.
- Lighthouse/accessibility pass completed locally against the final build:
  Home mobile 91/96/100/100/100, Home desktop 100/96/100/100/100,
  About mobile+desktop 100s, Press mobile 88/100/92/100/100, Press desktop
  100/100/96/100/100. Score order: performance/accessibility/best
  practices/SEO/agentic browsing.
- Parent creative-widget planning issue #18 split into build issues #21, #22,
  and #23.
- Gate Receipt, Route Map Postcard, and Suitcase Sticker Manifest widgets added
  to the Gate Infinity desk. Issues #21, #22, and #23 closed.
- Production prompts, source notes, final deliverables, and restart handoff
  documented through `production/README.md`, `production/ORIGIN_NOTES.md`,
  `production/AWARDS_QA.md`, `merch/shopify-launch.md`, and `NEXT.md`.
- Shopify Dev MCP configured in Codex global config for future Shopify
  docs/schema work, and a read-only Skywhale Launch Monitor automation created
  for Friday health checks.
- Shopify Dev MCP verified callable after Codex restart; the monitor prompt now
  names the docs-only Shopify MCP tools and keeps store/product/order/cart
  mutation out of scope.
- Roadmap backlog split into focused GitHub issues #24-#33 for the next swarm;
  #17 remains the parent Shopify/fulfillment tracker.
- Fulfillment defaults, standalone shop-domain decision, and festival archive
  package checklist documented for issues #24, #32, and #33.

## Repository Queue Snapshot

Audited June 4, 2026 14:34 PDT / 21:34 UTC.

- Open GitHub PRs: none.
- Current branch: `main`.
- Local branches: `main`.
- Open launch-polish issue:
  - #15 `Human watch/listen signoff for awards submission`
- Open merch/shop parent issue:
  - #17 `Expand Shopify beyond the first Nomad drop`
- Open merch/shop child issues:
  - #25 `Add size and fulfillment model for I AM NOMAD tee`
  - #26 `Prepare Skywhale Chest Print patch for live commerce`
  - #27 `Prepare Skywhale Chest Print sticker/decal for live commerce`
  - #28 `Prepare Decade Weather card/sticker for live commerce`
  - #29 `Prepare baggage tag variant for live commerce`
  - #30 `Prepare Gravity Stops Insisting tee/sticker for live commerce`
  - #31 `Source pin and sticker-sheet production path`
- Recently closed roadmap issues:
  - #24 `Decide real-shop fulfillment model for Duty-Free`
  - #32 `Connect shop.skywhaleairways.com if standalone shop surface is needed`
  - #33 `Package festival submission archive`
- Recently closed launch/admin issues:
  - #10 `Launch Nomad Shopify Buy Button checkout`
  - #11 `Create GA4 stream and verify production analytics`
  - #12 `Add Search Console property and submit sitemap`
  - #13 `Verify awards cut on Vercel production`
  - #14 `Improve Press Kit mobile LCP and image delivery`
  - #16 `Prune stale awards worktrees and branches after merge`
  - #18 `Plan the next creative widgets and shareable terminal artifacts`
  - #19 `Archive production prompts, source notes, and final handoff package`
  - #21 `Build Gate Receipt share card widget`
  - #22 `Build Route Map Postcard generator`
  - #23 `Build Suitcase Sticker Manifest widget`
- Recently merged PRs:
  - #9 `Prepare Skywhale awards cut package`
  - #2 `Prepare Vercel launch and LFS merch assets`
  - #1 `Add film production pipeline and final web cut`

## Verification

- `npm ci`
- `npm run build`
- `npm run optimize`
- `npm audit --audit-level=moderate`
- `ffprobe` on `public/film/skywhale-awards-cut-v2.mp4`
- `ffmpeg blackdetect` on `public/film/skywhale-awards-cut-v2.mp4`
- `ffmpeg ebur128=peak=true` on `public/film/skywhale-awards-cut-v2.mp4`
- Browser smoke: gate, scroll journey, soundtrack toggle, boarding pass,
  widget copy links, Duty-Free grid, About page, Press Kit, and film embed.
- Terminal artifact smoke: shared links restore Gate Receipt, Route Map
  Postcard, and Suitcase Sticker Manifest; canvases render nonblank; 390px
  mobile layout has no horizontal overflow.
- Shopify smoke: first three Duty-Free cards mount real Buy Buttons, add to cart
  works, remove works, cart reopens, and checkout starts on Shopify.
- GA smoke: production page loads the configured GA4 tag and sends the expected
  Google Analytics request.
- Search Console smoke: URL-prefix ownership verified and
  `https://skywhaleairways.com/sitemap.xml` submitted.
- Vercel root URLs:
  - `/`
  - `/about.html`
  - `/press.html`
  - `/sitemap.xml`
  - `/film/skywhale-awards-cut-v2.mp4`
  - `/film/psychedelic-airport.mp4`
  - `/merch/...`
  - `/scenes/...`

The widget deployment verified during smoke,
`dpl_DFCBq74up3pjKytJZor5hyd8kuUt`, was ready and aliased to
`https://skywhaleairways.com/`.

Awards cut production checks on June 4, 2026:

- Vercel CLI upgraded locally to `54.9.1` before deploy.
- `npm run build` passed before deploy with the known large WebGL bundle warning.
- `https://skywhaleairways.com/` returned HTTP 200 and references
  `./film/skywhale-awards-cut-v2.mp4`.
- `https://skywhaleairways.com/press.html` returned HTTP 200 and links both the
  festival cut and the preserved 53s web cut.
- `https://www.skywhaleairways.com/` returned HTTP 308 to the apex.
- `https://skywhaleairways.com/film/skywhale-awards-cut-v2.mp4` returned HTTP
  200, `content-type: video/mp4`, `content-length: 78241899`, and an `ftypisom`
  MP4 header.

Shopify checkout checks on June 4, 2026:

- Store name: Skywhale Airways.
- Store domain: `dze7ru-ii.myshopify.com`.
- Default currency: USD.
- Buy Button sales channel installed.
- Products are active and published for the first drop:
  - `I AM NOMAD Holographic Sticker`, product ID `15051888918891`, `$6.00 USD`.
  - `I AM NOMAD Patch`, product ID `15051889705323`, `$14.00 USD`.
  - `I AM NOMAD Tee`, product ID `15051891638635`, `$36.00 USD`.
- Vercel production and preview env vars are set for Shopify domain, Storefront
  token, and the three product IDs. The token is not committed.
- Production checkout opened on Shopify with Skywhale branding, the sticker line
  item, and a `USD $6.00` total.

Terminal artifact production checks on June 4, 2026 13:39 PDT / 20:39 UTC:

- `https://skywhaleairways.com/` returned HTTP 200 from Vercel.
- The production HTML includes Gate Receipt, Route Map Postcard, and Suitcase
  Sticker Manifest panels.
- Vercel deployment `dpl_DFCBq74up3pjKytJZor5hyd8kuUt` was Ready and aliased to
  apex, `www`, the Vercel fallback, and the main Git deployment URL during the
  widget smoke.

Press Kit local performance pass on June 4, 2026:

- `/press.html` mobile Lighthouse: 100/100/96/100 for
  performance/accessibility/best-practices/SEO, LCP `1.6s`, CLS `0`.
- `/press.html` desktop Lighthouse: 100/100/96/100, LCP `0.5s`, CLS `0`.
- 390px layout smoke: document width equals viewport width; title, intro, and
  action buttons fit within the page.

## Launch Polish

- #15: Run the human watch/listen signoff pass against the production-served
  awards cut. This is the only remaining launch-polish gate that should stay
  human-owned.

## Next Swarm

- #15: Human watch/listen signoff for the production-served awards cut.
- #17: Parent tracker for broader Shopify/fulfillment.
- #25-#31: Product-specific merch decisions. Keep only the three Nomad Buy
  Buttons live until fulfillment, variants, shipping, returns, and tax are
  decided.

## Later

- Connect `shop.skywhaleairways.com` only if KK later decides the public shop
  surface should exist outside embedded Buy Buttons.
- Add real fulfillment, sizes, variants, shipping, returns, and tax settings
  through #25-#31 before treating the tee/patch/sticker drop as a serious public
  storefront.
- Package a festival-submission archive outside the repo if festivals require
  ZIP delivery, ProRes, stills contact sheets, or separate rights documents;
  use `production/FESTIVAL_ARCHIVE.md` as the manifest.
