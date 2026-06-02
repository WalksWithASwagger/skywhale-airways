// The ten scenes of "A Psychedelic Airport for Time Travelers", in order.
// Each pairs a keyframe (optimized into public/scenes by scripts/optimize-assets.mjs)
// with its title and the voiceover lines that surface as captions on scroll.
// Source: the Veo 3.1 shot list + Suno voiceover draft.

export const scenes = [
  {
    slug: "01-skywhale-airport",
    title: "The Skywhale Airport",
    lines: [
      "There are airports for cities, airports for countries,",
      "and one airport for lost decades.",
    ],
  },
  {
    slug: "02-lost-baggage",
    title: "Lost Baggage Check-In",
    lines: [
      "Beneath the skywhale, she arrives carrying a single bag.",
      "At check-in, they weigh her luggage, her memories, and the years she has not yet unpacked.",
    ],
  },
  {
    slug: "03-departures-concourse",
    title: "Departures Concourse",
    lines: ["In the departures hall, fish move overhead and the clock refuses ordinary time."],
  },
  {
    slug: "04-duplicate-selves",
    title: "Gate Delay",
    lines: ["At the gate, she meets another version of herself already waiting."],
  },
  {
    slug: "05-boarding-platform",
    title: "Boarding Platform",
    lines: ["When boarding begins, the runway opens like a memory."],
  },
  {
    slug: "06-zero-gravity",
    title: "Zero-Gravity Transfer",
    lines: ["Somewhere between gate and sky, gravity stops insisting."],
  },
  {
    slug: "07-golden-fish-flight",
    title: "Golden Fish Flight",
    lines: ["A golden fish carries her between decades."],
  },
  {
    slug: "08-holding-pattern",
    title: "Holding Pattern",
    lines: ["They do not arrive. They circle. Every decade has its own weather."],
  },
  {
    slug: "09-cloud-orchard",
    title: "Cloud Orchard Layover",
    lines: ["In the layover orchard, even the clouds are waiting for someone."],
  },
  {
    slug: "10-pink-rotunda",
    title: "Pink Rotunda Arrival",
    lines: [
      "At last she enters a vast terminal where fish drift through the ceiling like constellations.",
      "She has arrived in another decade, carrying one bag, one body, and more time than she left with.",
    ],
  },
];

// Responsive source for a scene texture (small frame on narrow screens).
export function sceneImage(slug, small = false) {
  return `/scenes/${slug}${small ? "@sm" : ""}.webp`;
}
