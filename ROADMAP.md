# Skywhale Airways Roadmap

Last updated: June 2, 2026.

## Launch Status

Skywhale Airways remains the project and festival brand. Vercel is the primary
production target, with GitHub Pages kept as a temporary fallback until the
Vercel deployment is verified with Git LFS media.

The canonical repository is `/Users/kk/Code/skywhale-airways`. The sibling
checkout `/Users/kk/Code/psychedelic-airport` has been used only as the source
for preserved merch PNG and print assets.

## Merge Order

1. Merge PR #2: Vercel/root-path cleanup, Git LFS policy, merch source assets,
   fallback Pages configuration, and documentation refresh.
2. Enable Git LFS in Vercel Project Settings > Git, then redeploy.
3. Verify Vercel serves real media, not Git LFS pointer files.
4. Merge PR #1: film production pipeline and final web cut.
5. After production is verified on Vercel, remove the GitHub Pages workflow.

## Verification Gates

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

For the film file, a passing Vercel deployment should serve
`/film/psychedelic-airport.mp4` as `video/mp4` with a full-size response around
78 MB. A 133-byte response beginning with `version https://git-lfs.github.com`
means Git LFS is still not enabled for Vercel Git deployments.

## Ready For KK

- Choose and register the final domain.
- Keep the public brand as Skywhale Airways unless a deliberate rename happens.
- Enable Git LFS in Vercel Project Settings > Git.
- Attach the domain to the Vercel project after the LFS redeploy passes.
- Decide whether GitHub Pages should be removed immediately after Vercel passes
  or kept briefly as a public fallback.

## Agent-Fixable

- Remove `.github/workflows/deploy.yml` after Vercel production is verified.
- Add domain-specific README and press-kit links once the domain exists.
- Add a small film/press page if festival submissions need downloadable
  stills, synopsis, credits, and contact details.
- Add merch fulfillment links when a vendor is chosen.
- Run a Lighthouse/accessibility pass after the Vercel cutover.

## Blocked

- PR #1 should not be merged into production until Vercel Git LFS is enabled and
  a redeploy proves the film MP4 is not a pointer file.
- Custom-domain verification is blocked until KK registers the domain.

## Later

- Add social preview images for the root page, About page, and film.
- Add a lightweight press kit with festival synopsis, credits, stills, and
  runtime.
- Decide whether the Duty-Free section becomes a real shop, a concept gallery,
  or a print-on-demand experiment.
- Archive production prompts and source notes into a stable handoff package
  after the film branch lands.
