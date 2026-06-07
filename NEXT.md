# Skywhale Airways Next

Last updated: June 5, 2026 18:30 PDT / June 6 01:30 UTC.

## Current Production

- Production: `https://skywhaleairways.com/`
- Vercel fallback: `https://skywhale-airways.vercel.app/`
- Production deployment verified during smoke: `dpl_BATferbaAcuaPEKmjPaotgJ6uSoM`
- `www.skywhaleairways.com` returns HTTP 308 to the apex.
- GitHub Pages is retired and should return 404.
- Primary film: festival cut embedded from YouTube (Unlisted) — `youtu.be/FTMbAECxb8A`
- Web cut: YouTube (Unlisted) — `youtu.be/nvKMmuzQNDs`. Both mp4s removed from the repo/LFS.
- Terminal artifacts live on the Gate Infinity desk: Gate Receipt, Route Map
  Postcard, and Suitcase Sticker Manifest.

## Admin State

- GA4 is live with Measurement ID `G-W59LMFSG43`.
- Search Console URL-prefix verification is live and the sitemap has been
  submitted.
- Shopify Buy Button checkout is live for the first three Nomad products through
  `dze7ru-ii.myshopify.com`.
- Vercel Production and Preview env vars are set for Shopify domain, Storefront
  token, and product IDs. Headless Chrome verified 3 ready Shopify Buy Button
  iframes on June 5, 2026 without cart or checkout actions.
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

## Open Work

- #15: Human watch/listen signoff for awards submission.
- #34: Optional standalone shop-domain handoff. The Vercel env and embedded
  Buy Button portions are verified; only `shop.skywhaleairways.com` DNS/Shopify
  connection remains unresolved.
- #17: Parent tracker for broader Shopify/fulfillment. Child issue split:
  #25 Nomad tee size/fulfillment, #26 Chest Print patch, #27 Chest Print
  sticker/decal, #28 Decade Weather card/sticker, #29 baggage tag variant, #30
  Gravity Stops Insisting tee/sticker, #31 pin/sticker-sheet production.
  Fulfillment defaults and the standalone shop-domain decision are documented in
  `merch/fulfillment-roadmap.md`.
- Festival archive packaging is documented in `production/FESTIVAL_ARCHIVE.md`.

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
- Duty-Free fulfillment policy: `merch/fulfillment-roadmap.md`
- Canonical Nomad art: `merch/r5/i-am-nomad-master.png`
- Holographic sticker print handoff:
  `merch/print/r5-i-am-nomad-holographic-sticker.png`
- Festival archive manifest: `production/FESTIVAL_ARCHIVE.md`

## Guardrails

- Keep **Skywhale Airways** as the brand.
- Keep **I AM NOMAD** as the canonical project/store image.
- Keep "Time Traveller" language across public and product copy.
- Keep Shopify embeds button/cart/checkout-only so Skywhale's own visual catalog
  remains the public storefront.
- Keep Git LFS enabled for film, production audio/video, and source/print merch
  assets.
