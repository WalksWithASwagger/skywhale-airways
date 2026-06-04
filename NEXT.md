# Skywhale Airways Next

Last updated: June 4, 2026 13:40 PDT / 20:40 UTC.

## Current Production

- Production: `https://skywhaleairways.com/`
- Vercel fallback: `https://skywhale-airways.vercel.app/`
- Widget deployment verified during smoke: `dpl_DFCBq74up3pjKytJZor5hyd8kuUt`
- `www.skywhaleairways.com` returns HTTP 308 to the apex.
- GitHub Pages is retired and should return 404.
- Primary film: `public/film/skywhale-awards-cut-v2.mp4`
- Preserved web cut: `public/film/psychedelic-airport.mp4`
- Terminal artifacts live on the Gate Infinity desk: Gate Receipt, Route Map
  Postcard, and Suitcase Sticker Manifest.

## Admin State

- GA4 is live with Measurement ID `G-W59LMFSG43`.
- Search Console URL-prefix verification is live and the sitemap has been
  submitted.
- Shopify Buy Button checkout is live for the first three Nomad products through
  `dze7ru-ii.myshopify.com`.
- Vercel Production and Preview env vars are set for Shopify domain, Storefront
  token, and product IDs.
- Shopify Dev MCP is configured globally in `/Users/kk/.codex/config.toml` as
  `shopify-dev-mcp` using `npx -y @shopify/dev-mcp@latest`. Restart Codex if it
  is not visible in the current session. Treat it as Shopify docs/schema/dev
  context, not as a store-admin mutation tool.
- Skywhale Launch Monitor is active at
  `/Users/kk/.codex/automations/skywhale-launch-monitor/automation.toml`. It
  runs Fridays at 9:15 AM in read-only mode.
- Do not commit real `.env` files or the Shopify Storefront access token.

## Open Work

- #15: Human watch/listen signoff for awards submission.
- #17: Decide merch fulfillment and whether Duty-Free becomes a broader real
  shop.

## Restart Commands

```bash
npm ci
npm run build
npm audit --audit-level=moderate
```

Use `npm run dev` for local work and `npm run preview` to smoke the Vercel-style
static build. Run `npm run optimize` only when source assets need regenerated
public derivatives.

## Production Archive Map

- Production pipeline overview: `production/README.md`
- Creative origin notes: `production/ORIGIN_NOTES.md`
- Awards QA checklist and evidence: `production/AWARDS_QA.md`
- Film production project: `production/video_project/time_airport/`
- Final public film files: `public/film/`
- Shopify launch notes: `merch/shopify-launch.md`
- Canonical Nomad art: `merch/r5/i-am-nomad-master.png`
- Holographic sticker print handoff:
  `merch/print/r5-i-am-nomad-holographic-sticker.png`

## Guardrails

- Keep **Skywhale Airways** as the brand.
- Keep **I AM NOMAD** as the canonical project/store image.
- Keep "Time Traveller" language across public and product copy.
- Keep Shopify embeds button/cart/checkout-only so Skywhale's own visual catalog
  remains the public storefront.
- Keep Git LFS enabled for film, production audio/video, and source/print merch
  assets.
