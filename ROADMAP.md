# Skywhale Airways Roadmap

Last updated: June 2, 2026.

## Launch Status

Skywhale Airways remains the project and festival brand. Vercel is the primary
production host and is verified with Git LFS media.

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

## Ready For KK

- Choose and register the final domain.
- Keep the public brand as Skywhale Airways unless a deliberate rename happens.
- Attach the domain to the Vercel project after DNS is ready.
- Decide whether the GitHub Pages public URL should redirect, stay as an old
  mirror, or be left unpublished.

## Agent-Fixable

- Add domain-specific README and press-kit links once the domain exists.
- Add merch fulfillment links when a vendor is chosen.
- Run a Lighthouse/accessibility pass after the Vercel cutover.

## Blocked On Domain

- Custom-domain verification is blocked until KK registers the domain.

## Later

- Add social preview images for the root page, About page, and film.
- Decide whether the Duty-Free section becomes a real shop, a concept gallery,
  or a print-on-demand experiment.
- Archive production prompts and source notes into a stable handoff package
  after the film branch lands.
