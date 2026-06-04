# Skywhale Duty-Free Fulfillment Roadmap

Last updated: June 4, 2026.

## Decision

Duty-Free stays a Skywhale concept gallery plus the three live **I AM NOMAD** Buy
Buttons until each additional product has a real fulfillment path. Do not create
more live Shopify products, add more product IDs to Vercel, or change Shopify
store settings until the product-specific readiness checklist is complete and KK
approves the store-admin pass.

`shop.skywhaleairways.com` is not needed for the current public shop surface.
Embedded Buy Buttons remain the production commerce path. Revisit the standalone
shop domain only if Skywhale needs a separate Shopify storefront outside the
site's visual Duty-Free catalog.

## Ownership

- Product go/no-go: KK.
- Site/catalog implementation: Skywhale repo agent work, after approval.
- Store-admin mutations: KK-approved Shopify pass only.
- Fulfillment operator: product-specific and undecided until vendor/manual-drop
  choices are recorded.

## Operating Defaults

- Concept-only items remain visible as non-transactional catalog pieces.
- Live checkout appears only on products with final art, fulfillment, price,
  shipping, returns, tax approach, Shopify product ID, and production smoke.
- The current tee remains a single live Shopify product, but broader tee work
  stays blocked until size/color variants, print partner, shipping, returns, and
  tax are settled.
- Use embedded Shopify Buy Buttons for product button, cart, and checkout
  behavior. Keep Skywhale's own art, copy, and card layout as the public catalog.

## Shipping, Returns, Tax

Draft shipping approach:

- Use Shopify shipping profiles only after package size, weight, ship-from
  location, and fulfillment operator are known.
- Start with the smallest reliable region set for the fulfillment path rather
  than promising broad international delivery before rates are tested.
- Do not publish shipping language until the product-specific issue confirms
  whether fulfillment is manual, batch/vendor, or print-on-demand.

Draft returns copy for review:

> Skywhale Duty-Free drops are small-batch souvenirs from a fictional airline.
> If your item arrives damaged or incorrect, contact us within 14 days and we
> will make it right. Size exchanges depend on remaining inventory.

Tax approach:

- Use Shopify's tax settings for live Shopify checkout.
- KK must review any tax, nexus, VAT/GST/PST, and business-address settings
  before broader product launch.
- Agents must not change tax settings or publish tax promises without approval.

## Product-Readiness Checklist

Before a concept graduates to live commerce, capture:

- Final source art and print/export file path.
- Product title, Shopify handle, price, and proposed product ID env key.
- Fulfillment path and responsible shipper.
- Package dimensions, weight, shipping profile, and launch regions.
- Returns copy and tax approach.
- Variant model, if any.
- Confirmation that the Shopify product is active and available to the Buy
  Button channel/custom app.
- Vercel env var set for the product ID, without committing secrets.
- Production smoke: button renders, cart opens, item adds/removes, checkout
  starts.

## Issue Map

- #24 is complete with this default decision and checklist.
- #25-#31 stay open for product-specific vendor, material, price, variant, and
  fulfillment decisions.
- #32 is complete for now: no standalone shop domain is required until KK wants a
  separate Shopify storefront.
