# Skywhale Airways Shopify Launch

Duty-Free is set up for a Nomad-first Shopify launch. The Skywhale site keeps
its own product cards and mounts embedded Shopify Buy Buttons inside the first
three cards when the required Vite environment values are present.

## Storefront

- Public store URL: `https://shop.skywhaleairways.com`
- Shopify API domain: copy the `domain` value from the generated Buy Button
  embed code. Shopify's developer docs normally show this as the store's
  `*.myshopify.com` domain.
- Subdomain DNS: connect `shop.skywhaleairways.com` in Shopify, then add a
  Porkbun CNAME record for `shop` pointing to `shops.myshopify.com`.

## Products

Create these products in Shopify and publish them to the Buy Button sales
channel before setting the site env vars.

| Product | Handle | Price | Site env key |
|---|---|---:|---|
| I AM NOMAD Holographic Sticker | `i-am-nomad-holographic-sticker` | `$6` | `VITE_SHOPIFY_NOMAD_STICKER_PRODUCT_ID` |
| I AM NOMAD Patch | `i-am-nomad-patch` | `$14` | `VITE_SHOPIFY_NOMAD_PATCH_PRODUCT_ID` |
| I AM NOMAD Tee | `i-am-nomad-tee` | `$36` | `VITE_SHOPIFY_NOMAD_TEE_PRODUCT_ID` |

Use the canonical image from `merch/r5/i-am-nomad-master.png` for all three
products. The holographic sticker print source is
`merch/print/r5-i-am-nomad-holographic-sticker.png`.

## Environment

Local `.env`:

```bash
VITE_SHOPIFY_DOMAIN=your-shop.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
VITE_SHOPIFY_NOMAD_STICKER_PRODUCT_ID=...
VITE_SHOPIFY_NOMAD_PATCH_PRODUCT_ID=...
VITE_SHOPIFY_NOMAD_TEE_PRODUCT_ID=...
```

Set the same values in Vercel for preview and production. Do not commit real
tokens; `.env` is ignored and `.env.example` documents the shape.

## Verification

- `npm run build` succeeds with and without Shopify env vars.
- Without env vars, the first three cards keep their Skywhale art and show the
  non-transactional "Shop opening soon" fallback.
- With env vars, the first three cards mount embedded Shopify Buy Buttons.
- Add one product to cart, remove it, reopen the cart, and confirm checkout
  starts from Shopify.
- Verify mobile layout: the cart toggle must not cover essential page controls.

References:

- Shopify Buy Button setup:
  https://help.shopify.com/en/manual/online-sales-channels/buy-button/create-buy-button
- Shopify embed code:
  https://help.shopify.com/en/manual/online-sales-channels/buy-button/add-embed-code
- BuyButton.js:
  https://shopify.github.io/buy-button-js/
- Shopify subdomain DNS:
  https://help.shopify.com/en/manual/domains/add-a-domain/connecting-domains/connect-subdomain
