# Skywhale Airways — Duty-Free · Round 5

Round 5 centers KK's upgraded **I AM NOMAD** poster with the blonde **Time
Traveller** at Gate infinity. This is now the canonical Skywhale Airways
project/store image. The artwork stays locked, but each store card needs a
product-specific mockup so the drop reads as real merchandise rather than three
copies of the same poster.

Canonical source: `merch/r5/i-am-nomad-master.png`

Print sticker source: `merch/print/r5-i-am-nomad-holographic-sticker.png`

Store mockup sources:

- `merch/r5/i-am-nomad-holographic-sticker-mockup.png`
- `merch/r5/i-am-nomad-patch-mockup.png`
- `merch/r5/i-am-nomad-tee-mockup.png`

Approved source file: `/Users/kk/Desktop/i-am-nomad--master.png` was copied into
the repo. The temporary screenshot attachment is reference only and should not
be committed.

Regenerate the web product image with:

```bash
node scripts/create-nomad-mockups.mjs
npm run optimize
```

## 01 — I AM NOMAD holographic sticker

Holographic sticker mockup using the full canonical poster: Time Traveller,
suitcase, fish-aircraft, Gate infinity, and exact headline **I AM NOMAD**. Show
the poster as a physical sticker with a subtle iridescent backing.

## 02 — I AM NOMAD patch

Embroidered patch mockup using the same poster art inside a stitched border.
Vendor production may simplify details only as needed for thread count and edge
shape.

## 03 — I AM NOMAD tee

T-shirt front mockup using the same canonical poster art. Keep the image large,
wearable, and centered; do not substitute the older generated Nomad variants.
