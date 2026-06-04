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
- BuyButton.js:
  https://shopify.github.io/buy-button-js/
- Shopify subdomain DNS:
  https://help.shopify.com/en/manual/domains/add-a-domain/connecting-domains/connect-subdomain
