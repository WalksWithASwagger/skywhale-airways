# Skywhale Airways Shopify Launch

Duty-Free is live for the first Nomad drop. The Skywhale site keeps its own
product cards and mounts embedded Shopify Buy Buttons inside the first three
cards when the required Vite environment values are present.

## Storefront

- Store name: `Skywhale Airways`
- Shopify admin/store handle: `dze7ru-ii`
- Shopify API domain: `dze7ru-ii.myshopify.com`
- Default currency: USD
- Embedded checkout: live on `https://skywhaleairways.com/`
- Future shop subdomain: `shop.skywhaleairways.com`

`shop.skywhaleairways.com` is not required for the embedded Buy Button checkout.
If Skywhale needs a standalone Shopify storefront later, connect the subdomain in
Shopify and add a Porkbun CNAME record for `shop` pointing to
`shops.myshopify.com`.

## Products

The first drop uses the canonical image from `merch/r5/i-am-nomad-master.png`
for all three products. The holographic sticker print source is
`merch/print/r5-i-am-nomad-holographic-sticker.png`.

| Product | Handle | Product ID | Price | Status | Site env key |
|---|---|---:|---:|---|---|
| I AM NOMAD Holographic Sticker | `i-am-nomad-holographic-sticker` | `15051888918891` | `$6.00 USD` | Active, Buy Button published | `VITE_SHOPIFY_NOMAD_STICKER_PRODUCT_ID` |
| I AM NOMAD Patch | `i-am-nomad-patch` | `15051889705323` | `$14.00 USD` | Active, Buy Button published | `VITE_SHOPIFY_NOMAD_PATCH_PRODUCT_ID` |
| I AM NOMAD Tee | `i-am-nomad-tee` | `15051891638635` | `$36.00 USD` | Active, Buy Button published | `VITE_SHOPIFY_NOMAD_TEE_PRODUCT_ID` |

The tee is currently a single product with no size or color variants. Treat real
tee fulfillment, sizing, shipping, tax, and returns as issue #17 work before a
larger public merch push.

## Issue #17 Fulfillment Decision Packet

Shopify Dev MCP was callable after restart on June 4, 2026 and used only for
Shopify docs context. The current embedded Buy Button approach matches Shopify's
documented path for adding commerce to an existing website: generate a Storefront
access token, make products available to the app/channel, then embed Buy Button
JS components for product buttons, cart, and checkout.

Default recommendation for #17: keep Duty-Free as Skywhale's concept gallery
plus the three live Nomad Buy Buttons until fulfillment, variants, shipping,
returns, and tax are decided. Do not create more live Shopify products or add
more product IDs to Vercel until the product can actually be fulfilled.

Best next real-product candidates:

| Candidate | Suggested status | Decision needed before live Shopify product |
|---|---|---|
| Skywhale Chest Print patch | Next batch candidate | Patch vendor, size, backing, MOQ, unit cost, price |
| Skywhale Chest Print sticker/decal | Next batch candidate | Sticker material, finish, size, print source, unit cost |
| Every Decade Has Its Own Weather card/sticker | Small-batch candidate | Card vs sticker format, print source, packaging |
| Baggage tag variant | Small-batch candidate | Material, attachment hardware, writable vs art-only |
| Gravity Stops Insisting tee/sticker | Hold until tee model is solved | Tee blanks, sizes, colors, print partner, returns |
| Pin and sticker-sheet sets | Concept-only for now | Vendor, MOQ, packaging, backing cards |

Before any candidate graduates from concept to live commerce, capture:

- Final source art and print file path.
- Shopify title, handle, price, and product ID.
- Fulfillment path and who ships it.
- Shipping profile, returns copy, and tax approach.
- Variant model, if any.
- Confirmation that the product is active and published to the Buy Button
  channel or custom app used by the embedded buttons.
- Vercel env var name and value for the product ID.
- Production smoke result: button renders, cart opens, item adds/removes, and
  checkout starts.

Visual rule for Duty-Free: only products with a complete `shopify` config should
show live embedded checkout. Everything else should remain clearly
non-transactional until fulfillment is real.

## Environment

Local `.env` shape:

```bash
VITE_SHOPIFY_DOMAIN=dze7ru-ii.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=<from Shopify Buy Button; do not commit>
VITE_SHOPIFY_NOMAD_STICKER_PRODUCT_ID=15051888918891
VITE_SHOPIFY_NOMAD_PATCH_PRODUCT_ID=15051889705323
VITE_SHOPIFY_NOMAD_TEE_PRODUCT_ID=15051891638635
```

The same values are set in Vercel for Production and Preview. The Storefront
access token is a secret and must stay out of committed docs, screenshots, and
logs.

## Verification

- `npm run build` succeeds with and without Shopify env vars.
- Without env vars, the first three cards keep their Skywhale art and show the
  non-transactional "Shop opening soon" fallback.
- With env vars, the first three cards mount embedded Shopify Buy Buttons.
- Production deploy `dpl_CB8FhyMecrNVSB1Nh14p82kGV3VC` is aliased to
  `https://skywhaleairways.com/`.
- Production smoke on June 4, 2026:
  - Shopify SDK loads from the public site.
  - First three Duty-Free cards show real Add to cart buttons.
  - Sticker add-to-cart works.
  - Removing the item works.
  - Reopening the cart works.
  - Checkout starts on Shopify with Skywhale branding, the sticker line item,
    and a `USD $6.00` total.

## References

- Shopify Buy Button setup:
  https://help.shopify.com/en/manual/online-sales-channels/buy-button/create-buy-button
- Shopify embed code:
  https://help.shopify.com/en/manual/online-sales-channels/buy-button/add-embed-code
- Shopify Buy Button JS developer docs:
  https://shopify.dev/docs/storefronts/headless/additional-sdks/buy-button
- Shopify Storefront API docs:
  https://shopify.dev/docs/api/storefront/latest
- BuyButton.js:
  https://shopify.github.io/buy-button-js/
- Shopify subdomain DNS:
  https://help.shopify.com/en/manual/domains/add-a-domain/connecting-domains/connect-subdomain
