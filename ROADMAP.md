# Skywhale Airways Roadmap

Last updated: June 3, 2026 23:01 PDT.

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
- Lighthouse/accessibility pass completed locally against the final build:
  Home mobile 91/96/100/100/100, Home desktop 100/96/100/100/100,
  About mobile+desktop 100s, Press mobile 88/100/92/100/100, Press desktop
  100/100/96/100/100. Score order: performance/accessibility/best
  practices/SEO/agentic browsing.

## Repository Queue Snapshot

Audited June 3, 2026 23:01 PDT.

- Open GitHub issues: none.
- Open GitHub PRs: none.
- Branches before this closeout: `main` was the only local branch and the only
  remote branch.
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

Post-Nomad production checks on June 3, 2026 23:01 PDT:

- `https://skywhaleairways.com/` serves the `i-am-nomad-og.jpg` social preview.
- `https://www.skywhaleairways.com/` returns 308 to the apex.
- GitHub Pages API returns 404 after Pages was disabled.
- The old GitHub Pages URL returns 404.

## Launch Polish

- Create the Shopify store at `shop.skywhaleairways.com`, publish the three
  Nomad products to the Buy Button sales channel, then add the Vite env values
  in Vercel.
- Improve Press Kit mobile LCP/image delivery if festival traffic makes that
  page a primary landing surface.
- Make the Press Kit easier to skim for festival programmers.
- Add copy/share polish to the boarding pass and Decade Weather widgets.
- Decide whether the canonical **I AM NOMAD** art should replace more page-level
  stills beyond social previews and Duty-Free.

## Later

- Expand Shopify beyond the first three Nomad products once the first drop is
  proven.
- Add more creative widgets and shareable terminal artifacts.
- Archive production prompts and source notes into a stable handoff package.
