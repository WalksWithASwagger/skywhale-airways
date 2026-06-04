# Skywhale Airways Roadmap

Last updated: June 3, 2026 23:30 PDT / June 4, 2026 06:30 UTC.

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
- Lighthouse/accessibility pass completed locally against the final build:
  Home mobile 91/96/100/100/100, Home desktop 100/96/100/100/100,
  About mobile+desktop 100s, Press mobile 88/100/92/100/100, Press desktop
  100/100/96/100/100. Score order: performance/accessibility/best
  practices/SEO/agentic browsing.

## Repository Queue Snapshot

Audited June 3, 2026 23:30 PDT / June 4, 2026 06:30 UTC.

- Open GitHub issues before this closeout:
  - #8 `Awards QA checklist and verification`
  - #7 `Upgrade press kit for festival programmers`
  - #6 `Publish festival cut on the site`
  - #5 `Crisp title and credits typography pass`
  - #4 `Festival audio master and subtle sound design`
  - #3 `Awards cut v2: tighten the titled festival edit`
- Open GitHub PRs: none.
- Branches/worktrees:
  - `main` is the canonical branch.
  - `codex/share-press-polish` is the temporary closeout branch for this pass.
  - `/Users/kk/Code/skywhale-airways-awards-swarm` is checked out at
    `codex/skywhale-awards-swarm` with no unique commits, but it contains
    untracked awards artifacts. Those artifacts have now been copied into the
    canonical repo; leave the worktree in place until KK confirms it can be
    pruned.
- Recently merged PRs:
  - #2 `Prepare Vercel launch and LFS merch assets`
  - #1 `Add film production pipeline and final web cut`

Expected issue closeout after this branch lands on `main`: #5, #6, and #7.
#3, #4, and #8 should stay open until the final human watch/listen/signoff pass
is complete.

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

## Launch Polish

- Create the Shopify store at `shop.skywhaleairways.com`, publish the three
  Nomad products to the Buy Button sales channel, then add the Vite env values
  in Vercel.
- Improve Press Kit mobile LCP/image delivery if festival traffic makes that
  page a primary landing surface.
- Human signoff pass for awards submission: watch the 59s festival cut end to
  end, listen once on headphones and once on speakers, then close #3/#4/#8 if no
  subjective issues remain.
- Confirm Vercel production serves `skywhale-awards-cut-v2.mp4` as a real MP4
  after this branch is deployed.
- Decide whether the `codex/skywhale-awards-swarm` worktree can be pruned now
  that its artifacts have been copied into canonical paths.

## Later

- Expand Shopify beyond the first three Nomad products once the first drop is
  proven.
- Add more creative widgets and shareable terminal artifacts.
- Archive production prompts and source notes into a stable handoff package.
