// Skywhale Airways Duty-Free catalog. Images live in public/merch (committed
// web-optimized webp; source rasters regenerate from merch/*.md). Nomad-first
// Shopify products mount into the first three cards when VITE_* values are set.
//
// A product goes live by adding a `shopify` block (see the Nomad products
// below). `enabled: false` products are staged: the wiring is in place but the
// card still renders as the disabled "Boarding soon" button until KK creates the
// Shopify product, sets its `productEnv` value in Vercel, and flips
// `enabled: true`. See merch/shopify-launch.md for the launch checklist.
//   handle       — Shopify product handle (informational reference)
//   productEnv   — env var holding the Storefront product ID
//   componentId  — DOM node id the Buy Button mounts into (`shopify-buy-<slug>`)
//   variantMode  — "options" for apparel (size selector), else "button"

export const products = [
  {
    img: "merch/r5-i-am-nomad-master.webp",
    title: "I AM NOMAD Holographic Sticker",
    type: "Holographic sticker · the canonical Time Traveller at Gate infinity",
    price: "$6",
    shopify: {
      enabled: true,
      handle: "i-am-nomad-holographic-sticker",
      productEnv: "VITE_SHOPIFY_NOMAD_STICKER_PRODUCT_ID",
      componentId: "shopify-buy-i-am-nomad-sticker",
      variantMode: "button",
    },
  },
  {
    img: "merch/r5-i-am-nomad-master.webp",
    title: "I AM NOMAD Patch",
    type: "Embroidered patch · one suitcase, fish-aircraft overhead",
    price: "$14",
    shopify: {
      enabled: true,
      handle: "i-am-nomad-patch",
      productEnv: "VITE_SHOPIFY_NOMAD_PATCH_PRODUCT_ID",
      componentId: "shopify-buy-i-am-nomad-patch",
      variantMode: "button",
    },
  },
  {
    img: "merch/r5-i-am-nomad-master.webp",
    title: "I AM NOMAD Tee",
    type: "Shirt graphic · the iconic Skywhale Airways project image",
    price: "$36",
    shopify: {
      enabled: true,
      handle: "i-am-nomad-tee",
      productEnv: "VITE_SHOPIFY_NOMAD_TEE_PRODUCT_ID",
      componentId: "shopify-buy-i-am-nomad-tee",
      variantMode: "options",
    },
  },
  {
    img: "merch/r4-01-skywhale-chest-patch.webp",
    title: "Skywhale Chest Patch",
    type: "Embroidered patch · the chest-print skywhale for jackets and bags",
    price: "$12",
    shopify: {
      enabled: false,
      handle: "skywhale-chest-patch",
      productEnv: "VITE_SHOPIFY_CHEST_PATCH_PRODUCT_ID",
      componentId: "shopify-buy-skywhale-chest-patch",
      variantMode: "button",
    },
  },
  {
    img: "merch/r4-02-skywhale-chest-decal.webp",
    title: "Skywhale Chest Decal",
    type: "Die-cut decal · the friendly skywhale mark in travel-sticker form",
    price: "$6",
    shopify: {
      enabled: false,
      handle: "skywhale-chest-decal",
      productEnv: "VITE_SHOPIFY_CHEST_DECAL_PRODUCT_ID",
      componentId: "shopify-buy-skywhale-chest-decal",
      variantMode: "button",
    },
  },
  {
    img: "merch/mockups-05-skywhale-tee.webp",
    title: "Skywhale Chest Print",
    type: "Shirt · est. nowhen, arriving soon",
    price: "$34",
  },
  {
    img: "merch/r1-03-baggage-tag.webp",
    title: "Baggage Tag",
    type: "Sticker · seat fish, boarding through memory",
    price: "$5",
    shopify: {
      enabled: false,
      handle: "baggage-tag",
      productEnv: "VITE_SHOPIFY_BAGGAGE_TAG_PRODUCT_ID",
      componentId: "shopify-buy-baggage-tag",
      variantMode: "button",
    },
  },
  {
    img: "merch/r4-06-baggage-tag-memory.webp",
    title: "Memory Baggage Tag",
    type: "Sticker · one bag, wrong minutes, final call for yesterday",
    price: "$5",
  },
  {
    img: "merch/r4-04-enamel-pin-set-expanded.webp",
    title: "Enamel Pin Set",
    type: "Five pins · skywhale, Gate infinity, suitcase, clock, fish-aircraft",
    price: "$28",
    shopify: {
      enabled: false,
      handle: "enamel-pin-set",
      productEnv: "VITE_SHOPIFY_PIN_SET_PRODUCT_ID",
      componentId: "shopify-buy-enamel-pin-set",
      variantMode: "button",
    },
  },
  {
    img: "merch/r2-03-enamel-pins.webp",
    title: "Original Pin Set",
    type: "Three hard-enamel pins · small gods of transit",
    price: "$24",
  },
  {
    img: "merch/r4-03-terminal-relics-sticker-sheet.webp",
    title: "Terminal Relics Sticker Sheet",
    type: "Kiss-cut sheet · cute fragments from the time airport",
    price: "$10",
    shopify: {
      enabled: false,
      handle: "terminal-relics-sticker-sheet",
      productEnv: "VITE_SHOPIFY_RELICS_SHEET_PRODUCT_ID",
      componentId: "shopify-buy-terminal-relics-sheet",
      variantMode: "button",
    },
  },
  {
    img: "merch/r2-05-sticker-sheet.webp",
    title: "Skywhale Airways Sticker Sheet",
    type: "Kiss-cut sheet · eight small relics of the terminal",
    price: "$9",
  },
  {
    img: "merch/r3-02-time-traveller-floating.webp",
    title: "Gravity Stops Insisting",
    type: "Die-cut sticker · the Time Traveller, unweighted",
    price: "$5",
    shopify: {
      enabled: false,
      handle: "gravity-stops-insisting-sticker",
      productEnv: "VITE_SHOPIFY_GRAVITY_STICKER_PRODUCT_ID",
      componentId: "shopify-buy-gravity-stops-sticker",
      variantMode: "button",
    },
  },
  {
    img: "merch/r4-05-gravity-stops-insisting-tee.webp",
    title: "Gravity Stops Insisting Tee",
    type: "Shirt · somewhere between gate and sky",
    price: "$36",
    shopify: {
      enabled: false,
      handle: "gravity-stops-insisting-tee",
      productEnv: "VITE_SHOPIFY_GRAVITY_TEE_PRODUCT_ID",
      componentId: "shopify-buy-gravity-stops-tee",
      variantMode: "options",
    },
  },
  {
    img: "merch/r2-04-lyric-weather.webp",
    title: "Every Decade Has Its Own Weather",
    type: "Lyric die-cut · dress for the year you're landing in",
    price: "$5",
  },
  {
    img: "merch/r4-07-decade-weather-card.webp",
    title: "Decade Weather Card",
    type: "Sticker card · warm analog haze, runway visible in dreams",
    price: "$5",
    shopify: {
      enabled: false,
      handle: "decade-weather-card",
      productEnv: "VITE_SHOPIFY_DECADE_WEATHER_CARD_PRODUCT_ID",
      componentId: "shopify-buy-decade-weather-card",
      variantMode: "button",
    },
  },
  {
    img: "merch/r3-06-runway-like-a-memory.webp",
    title: "The Runway Opens Like a Memory",
    type: "Lyric die-cut · cleared for takeoff into the past",
    price: "$5",
  },
  {
    img: "merch/r1-02-fly-the-golden-fish.webp",
    title: "Fly the Golden Fish",
    type: "Die-cut sticker · preferred carrier of the terminal",
    price: "$5",
  },
  {
    img: "merch/r1-01-skywhale-roundel.webp",
    title: "Skywhale Airways Roundel",
    type: "Die-cut decal · gate infinity, departures hourly-ish",
    price: "$5",
  },
  {
    img: "merch/r3-01-one-bag-one-body.webp",
    title: "One Bag, One Body",
    type: "Lyric die-cut · everything you can carry between decades",
    price: "$5",
  },
  {
    img: "merch/r3-05-clock-refuses-time.webp",
    title: "The Clock Refuses Ordinary Time",
    type: "Lyric die-cut · for surfaces that are running late",
    price: "$5",
  },
  {
    img: "merch/r1-04-lyric-more-time.webp",
    title: "More Time Than You Left With",
    type: "Lyric die-cut · a small refund of years",
    price: "$5",
  },
  {
    img: "merch/r2-01-departures-board.webp",
    title: "Departures Board",
    type: "Die-cut sticker · 1968, 1973, nowhen · delayed by gravity",
    price: "$5",
  },
  {
    img: "merch/r2-02-duplicate-selves.webp",
    title: "I Met Another Version of Myself",
    type: "Die-cut sticker · she was already at the gate",
    price: "$5",
  },
  {
    img: "merch/mockups-06-lost-decades-tee.webp",
    title: "One Airport for Lost Decades",
    type: "Shirt · every decade has its own weather",
    price: "$36",
  },
  {
    img: "merch/r3-07-skywhale-patch.webp",
    title: "Original Skywhale Patch",
    type: "Embroidered patch · iron it onto something that travels",
    price: "$12",
  },
];
