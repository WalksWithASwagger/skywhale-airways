// Skywhale Airways Duty-Free catalog. Images live in public/merch as committed
// WebP derivatives; source rasters live in merch/<round>/ and regenerate with
// npm run optimize.
//
// The shop sells exactly ONE real product — the I AM NOMAD holographic
// sticker (the current drop). Every other design lives in the concept
// gallery (gallery.html) as art, not commerce.

export const shopSections = [
  {
    id: "nomad-drop",
    group: "nomad",
    eyebrow: "Current drop",
    title: "I AM NOMAD",
    description:
      "One real souvenir, made to travel: the Time Traveller at Gate infinity on holographic foil.",
    layout: "drop",
  },
];

export const products = [
  {
    id: "i-am-nomad-holographic-sticker",
    group: "nomad",
    featured: true,
    status: "live",
    badge: "Live drop",
    img: "merch/r5-i-am-nomad-holo-sticker-hero.webp",
    title: "I AM NOMAD Holographic Sticker",
    type: "Holographic foil sticker · the Time Traveller at Gate infinity · shifts color as it moves",
    price: "$6",
    shopify: {
      enabled: true,
      handle: "i-am-nomad-holographic-sticker",
      productEnv: "VITE_SHOPIFY_NOMAD_STICKER_PRODUCT_ID",
      componentId: "shopify-buy-i-am-nomad-sticker",
      variantMode: "button",
    },
  },
];

// The concept gallery: every design that isn't (yet) a real product —
// future drops, beloved marks, lyric die-cuts, and terminal relics.
// Rendered by src/gallery.js as a playful sticker wall on gallery.html.
export const galleryPieces = [
  { img: "merch/r5-i-am-nomad-patch-mockup.webp", title: "I AM NOMAD Patch", note: "embroidered · next in line" },
  { img: "merch/r5-i-am-nomad-tee-mockup.webp", title: "I AM NOMAD Tee", note: "cream tee · next in line" },
  { img: "merch/diecuts/r1-01-skywhale-roundel-diecut.webp", title: "Skywhale Airways Roundel", note: "gate infinity · departures hourly-ish" },
  { img: "merch/diecuts/r1-02-fly-the-golden-fish-diecut.webp", title: "Fly the Golden Fish", note: "preferred carrier of the terminal" },
  { img: "merch/diecuts/r1-03-baggage-tag-diecut.webp", title: "Baggage Tag", note: "boarding through memory" },
  { img: "merch/diecuts/r1-04-lyric-more-time-diecut.webp", title: "More Time Than You Left With", note: "a small refund of years" },
  { img: "merch/diecuts/r1-05-shirt-skywhale-front-diecut.webp", title: "Skywhale Front", note: "shirt concept" },
  { img: "merch/diecuts/r1-06-shirt-lost-decades-diecut.webp", title: "Lost Decades", note: "shirt concept" },
  { img: "merch/diecuts/r2-01-departures-board-diecut.webp", title: "Departures Board", note: "1968, 1973, nowhen · delayed by gravity" },
  { img: "merch/diecuts/r2-02-duplicate-selves-diecut.webp", title: "I Met Another Version of Myself", note: "she was already at the gate" },
  { img: "merch/diecuts/r2-03-enamel-pins-diecut.webp", title: "Original Pin Set", note: "small gods of transit" },
  { img: "merch/diecuts/r2-04-lyric-weather-diecut.webp", title: "Every Decade Has Its Own Weather", note: "dress for the year you're landing in" },
  { img: "merch/diecuts/r2-05-sticker-sheet-diecut.webp", title: "Skywhale Airways Sticker Sheet", note: "eight small relics of the terminal" },
  { img: "merch/diecuts/r2-06-passport-stamp-diecut.webp", title: "Passport Stamp", note: "admitted to nowhen" },
  { img: "merch/diecuts/r3-01-one-bag-one-body-diecut.webp", title: "One Bag, One Body", note: "everything you can carry between decades" },
  { img: "merch/diecuts/r3-02-time-traveller-floating-diecut.webp", title: "Gravity Stops Insisting", note: "the Time Traveller, unweighted" },
  { img: "merch/diecuts/r3-03-time-traveller-walking-diecut.webp", title: "The Time Traveller", note: "mid-stride between decades" },
  { img: "merch/diecuts/r3-04-time-traveller-emblem-diecut.webp", title: "Traveller Emblem", note: "her mark, stamped in gold" },
  { img: "merch/diecuts/r3-05-clock-refuses-time-diecut.webp", title: "The Clock Refuses Ordinary Time", note: "for surfaces that are running late" },
  { img: "merch/diecuts/r3-06-runway-like-a-memory-diecut.webp", title: "The Runway Opens Like a Memory", note: "cleared for takeoff into the past" },
  { img: "merch/diecuts/r3-07-skywhale-patch-diecut.webp", title: "Original Skywhale Patch", note: "iron it onto something that travels" },
  { img: "merch/diecuts/r4-01-skywhale-chest-patch-diecut.webp", title: "Skywhale Chest Patch", note: "for jackets and bags" },
  { img: "merch/diecuts/r4-02-skywhale-chest-decal-diecut.webp", title: "Skywhale Chest Decal", note: "the friendly skywhale mark" },
  { img: "merch/diecuts/r4-03-terminal-relics-sticker-sheet-diecut.webp", title: "Terminal Relics Sheet", note: "cute fragments from the time airport" },
  { img: "merch/diecuts/r4-04-enamel-pin-set-expanded-diecut.webp", title: "Enamel Pin Set", note: "skywhale, Gate infinity, suitcase, clock, fish" },
  { img: "merch/diecuts/r4-05-gravity-stops-insisting-tee-diecut.webp", title: "Gravity Stops Insisting Tee", note: "somewhere between gate and sky" },
  { img: "merch/diecuts/r4-06-baggage-tag-memory-diecut.webp", title: "Memory Baggage Tag", note: "final call for yesterday" },
  { img: "merch/diecuts/r4-07-decade-weather-card-diecut.webp", title: "Decade Weather Card", note: "warm analog haze" },
];
