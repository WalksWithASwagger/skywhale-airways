# Skywhale Airways Roadmap

Last updated: June 2, 2026 16:20 PDT.

## Launch Status

Skywhale Airways remains the project and festival brand. Vercel is the primary
production host and is verified with Git LFS media. The custom domains are
attached in Vercel and resolving publicly through Porkbun DNS.

The canonical repository is `/Users/kk/Code/skywhale-airways`. The sibling
checkout `/Users/kk/Code/psychedelic-airport` has been used only as the source
for preserved merch PNG and print assets.

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
- Merch Wave 5 added: **I AM NOMAD.** sticker, patch, and tee graphic using one
  core blonde Time Traveller art system.

## Repository Queue Snapshot

Audited June 2, 2026 16:20 PDT.

- Open GitHub issues: none.
- Open GitHub PRs: none.
- Branches: `main` is the only local branch and the only remote branch.
- Recently merged PRs:
  - #2 `Prepare Vercel launch and LFS merch assets`
  - #1 `Add film production pipeline and final web cut`

## Verification

- `npm ci`
- `npm run build`
- `npm run optimize`
- `npm audit --audit-level=moderate`
- Browser smoke: gate, scroll journey, soundtrack toggle, boarding pass,
  Duty-Free grid, About page, and film embed.
- Vercel root URLs:
  - `/`
  - `/about.html`
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

## Ready For KK

- Keep the public brand as Skywhale Airways unless a deliberate rename happens.
- Decide whether the GitHub Pages public URL should redirect, stay as an old
  mirror, or be left unpublished.

## Agent-Fixable

- Verify the `www.skywhaleairways.com` hard redirect after the next Vercel
  production deploy.
- Add merch fulfillment links when a vendor is chosen.
- Run a Lighthouse/accessibility pass after the domain cutover.

## Later

- Decide whether the Duty-Free section becomes a real shop, a concept gallery,
  or a print-on-demand experiment.
- Archive production prompts and source notes into a stable handoff package
  after the film branch lands.
