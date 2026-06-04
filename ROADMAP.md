# Skywhale Airways Roadmap

Last updated: June 4, 2026 07:50 PDT / 14:50 UTC.

## Launch Status

Skywhale Airways remains the project and festival brand. Vercel is the primary
production host and is verified with Git LFS media. The custom domains are
attached in Vercel and resolving publicly through Porkbun DNS.

The canonical repository is `/Users/kk/Code/skywhale-airways`. The sibling
checkout `/Users/kk/Code/psychedelic-airport` has been used only as the source
for preserved merch PNG and print assets.

Duty-Free is now Nomad-first for Shopify: the repo has the embedded Buy Button
integration and product handles, but live checkout still needs Shopify product
IDs and a Storefront access token from the Shopify admin.

The public film path now leads with the 59s festival / awards cut while
preserving the original 53s web cut.

The remaining launch work has been turned into GitHub issues for the next swarm.
Use the `tomorrow-swarm`, `launch-polish`, and `later` labels to slice the queue.
GA4 and Search Console now have source-side hooks ready for Vercel env rollout;
admin setup still needs the Google properties and values.

## Closed Out

- PR #2: Vercel/root-path cleanup, Git LFS policy, merch source assets, fallback
  Pages configuration, and documentation refresh.
- Vercel Git LFS enabled for Git deployments.
- PR #1: film production pipeline and final web cut.
- Production Vercel deploy verified on June 2, 2026.
- GitHub Pages workflow removed after Vercel passed.
- Lightweight press kit added for festival synopsis, credits, stills, runtime,
  and film links.
- Domain `skywhaleairways.com` registered and attached to the Vercel project as
  both apex and `www`.
- Porkbun DNS verified for apex and `www`; both resolve to Vercel.
- Social preview image metadata added for the public pages.
- Merch Wave 5 refined: the upgraded **I AM NOMAD** poster is the canonical
  project/store image and now drives the sticker, patch, tee, and social
  preview art.
- `www.skywhaleairways.com` verified as a hard 308 redirect to the apex.
- GitHub Pages disabled; the old
  `walkswithaswagger.github.io/skywhale-airways/` URL now returns 404 instead of
  the stale June 2 build.
- Suno cover art for **Whale Sky God** archived in production titles.
- Shopify Buy Button scaffolding added for the three Nomad products; checkout is
  pending Shopify env values.
- Awards/festival cut v2 imported from the awards worktree and wired as the
  primary homepage film frame:
  `public/film/skywhale-awards-cut-v2.mp4`.
- Original 53s web cut preserved at `public/film/psychedelic-airport.mp4`.
- Awards title card, credits card, and audio master archived under
  `production/video_project/time_airport/`.
- Press Kit upgraded for festival programmers with a snapshot, canonical
  **I AM NOMAD** key art, thesis, distinct festival/web cut links, process note,
  and rights/clearance language.
- Boarding pass and Decade Weather widgets now support copyable state links:
  `#pass?...` and `#weather?...`.
- Awards QA handoff added at `production/AWARDS_QA.md`.
- PR #9: awards/festival cut package, Press Kit upgrade, widget share links, and
  production notes. Merged June 4, 2026.
- Production Vercel deploy `dpl_8tcssWUzzdzMmfxNuDKdCiR5RWyJ` verified on June
  4, 2026. The apex serves the awards cut as a real MP4 and `www` still
  hard-redirects to the apex.
- Lighthouse/accessibility pass completed locally against the final build:
  Home mobile 91/96/100/100/100, Home desktop 100/96/100/100/100,
  About mobile+desktop 100s, Press mobile 88/100/92/100/100, Press desktop
  100/100/96/100/100. Score order: performance/accessibility/best
  practices/SEO/agentic browsing.

## Repository Queue Snapshot

Audited June 4, 2026 07:50 PDT / 14:50 UTC.

- Closed awards issues after PR #9 merged:
  - #8 `Awards QA checklist and verification`
  - #7 `Upgrade press kit for festival programmers`
  - #6 `Publish festival cut on the site`
  - #5 `Crisp title and credits typography pass`
  - #4 `Festival audio master and subtle sound design`
  - #3 `Awards cut v2: tighten the titled festival edit`
- New launch-polish issues for the next swarm:
  - #10 `Launch Nomad Shopify Buy Button checkout`
  - #11 `Create GA4 stream and verify production analytics`
  - #12 `Add Search Console property and submit sitemap`
  - #14 `Improve Press Kit mobile LCP and image delivery`
  - #15 `Human watch/listen signoff for awards submission`
  - #16 `Prune stale awards worktrees and branches after merge`
- Closed production deploy issue:
  - #13 `Verify awards cut on Vercel production`
- Later backlog issues:
  - #17 `Expand Shopify beyond the first Nomad drop`
  - #18 `Plan the next creative widgets and shareable terminal artifacts`
  - #19 `Archive production prompts, source notes, and final handoff package`
- Open GitHub PRs: none.
- Branches/worktrees:
  - `main` is the canonical branch.
  - `codex/skywhale-awards-swarm` was merged and the remote branch was deleted.
  - `/Users/kk/Code/skywhale-airways-awards-swarm` is now a clean `main`
    worktree used for the production deploy.
  - `/Users/kk/Code/skywhale-airways` is still on the local scratch branch
    `codex/share-press-polish`; prune or reset it only after confirming no
    needed local-only work remains.
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
- Vercel root URLs:
  - `/`
  - `/about.html`
  - `/press.html`
  - `/film/skywhale-awards-cut-v2.mp4`
  - `/film/psychedelic-airport.mp4`
  - `/merch/...`
  - `/scenes/...`

The June 2, 2026 Vercel production deploy serves
`/film/psychedelic-airport.mp4` as `video/mp4` with an 81,961,123 byte response
and an MP4 `ftyp` header.

The production deployment `dpl_2qPxs4J67M91c7wGuUdFY1McjiTC` is ready and
aliased to `skywhaleairways.com`, `www.skywhaleairways.com`, and
`skywhale-airways.vercel.app`.

Custom-domain checks on June 2, 2026 14:01 PDT:

- `https://skywhaleairways.com/` -> HTTP 200 from Vercel.
- `https://www.skywhaleairways.com/` -> HTTP 200 from Vercel.

Post-Nomad production checks on June 3, 2026 23:01 PDT:

- `https://skywhaleairways.com/` serves the `i-am-nomad-og.jpg` social preview.
- `https://www.skywhaleairways.com/` returns 308 to the apex.
- GitHub Pages API returns 404 after Pages was disabled.
- The old GitHub Pages URL returns 404.

Awards cut local checks on June 3, 2026 23:30 PDT / June 4, 2026 06:30 UTC:

- `skywhale-awards-cut-v2.mp4`: 59.208333s, 78,241,899 bytes, H.264, 1920x1080,
  nominal 24fps, AAC stereo 48kHz.
- `blackdetect`: no events printed.
- `ebur128`: integrated loudness `-16.7 LUFS`, true peak `-3.6 dBFS`.
- Awards title and credits cards inspected at full size and readable.

Awards cut production checks on June 4, 2026 07:49 PDT / 14:49 UTC:

- Vercel CLI upgraded locally to `54.9.1` before deploy.
- `npm run build` passed before deploy with the known large WebGL bundle warning.
- Production deployment `dpl_8tcssWUzzdzMmfxNuDKdCiR5RWyJ` is ready and aliased
  to `https://skywhaleairways.com/`.
- `https://skywhaleairways.com/` returned HTTP 200 and references
  `./film/skywhale-awards-cut-v2.mp4`.
- `https://skywhaleairways.com/press.html` returned HTTP 200 and links both the
  festival cut and the preserved 53s web cut.
- `https://www.skywhaleairways.com/` returned HTTP 308 to the apex.
- `https://skywhaleairways.com/film/skywhale-awards-cut-v2.mp4` returned HTTP
  200, `content-type: video/mp4`, `content-length: 78241899`, and an `ftypisom`
  MP4 header.

Press Kit local performance pass on June 4, 2026:

- `/press.html` mobile Lighthouse: 100/100/96/100 for
  performance/accessibility/best-practices/SEO, LCP `1.6s`, CLS `0`.
- `/press.html` desktop Lighthouse: 100/100/96/100, LCP `0.5s`, CLS `0`.
- 390px layout smoke: document width equals viewport width; title, intro, and
  action buttons fit within the page.

## Launch Polish

- #10: Create the Shopify store at `shop.skywhaleairways.com`, publish the three
  Nomad products to the Buy Button sales channel, then add the Vite env values
  in Vercel.
- #11: Create or confirm a GA4 web stream, wire its Measurement ID through
  Vercel, and verify public analytics collection. Source hook is ready via
  `src/analytics.js`; admin setup remains.
- #12: Add Skywhale Airways to Search Console, submit the sitemap, and document
  verification/access status. Source hook is ready via
  `VITE_GOOGLE_SITE_VERIFICATION`; admin setup remains.
- #14: Improve Press Kit mobile LCP/image delivery if festival traffic makes
  that page a primary landing surface.
- #15: Run the human watch/listen signoff pass against the production-served
  awards cut.
- #16: Prune stale local worktrees and branches after confirming no local-only
  artifacts are still needed.

## Later

- #17: Expand Shopify beyond the first three Nomad products once the first drop
  is proven.
- #18: Add more creative widgets and shareable terminal artifacts.
- #19: Archive production prompts and source notes into a stable handoff package.
