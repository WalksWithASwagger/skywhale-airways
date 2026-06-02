#!/usr/bin/env node
/**
 * Optimize source keyframes (~1.8MB PNGs) into responsive WebP and copy the
 * audio bed into public/. Same pattern as bothhandsfull's slide ingest:
 * optimize early, commit optimized, never ship the 2MB originals.
 *
 * Source: the Midjourney keyframe folder on the Desktop.
 * Output: public/scenes/<slug>.webp (1600w) + <slug>@sm.webp (800w)
 *         public/audio/whale-sky-god.mp3
 *
 * The SCENES array is the single source of truth mapping each shot-list scene
 * to its keyframe file. src/data/scenes.js references the same slugs.
 */
import { mkdir, copyFile, access, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename, extname } from "node:path";
import sharp from "sharp";

const SRC = "/Users/kk/Desktop/midjourney_session copy/10-key-frames";
// The soundtrack bed. Swap this filename to use a different track (the session
// folder also holds "Airline Brochure.mp3" and "Beneath Skywhale.mp3").
const AUDIO_SRC = "/Users/kk/Desktop/midjourney_session copy/audio/whale sky god.mp3";
const ROOT = new URL("..", import.meta.url).pathname;
const SCENES_OUT = join(ROOT, "public", "scenes");
const AUDIO_OUT = join(ROOT, "public", "audio");

const SIZES = [
  { width: 1600, suffix: "" },
  { width: 800, suffix: "@sm" },
];

// scene slug -> source PNG filename (resolved from the shot list)
const SCENES = [
  ["01-skywhale-airport", "Upward_tilt_composition_long_yellow_flying_creature_above_lik_5ed26510-67df-4008-b3c9-13f39fd88972_2.png"],
  ["02-lost-baggage", "the_lost-luggage_office_for_time_travelers_--ar_169_--raw_--s_07818e7b-3529-4938-a887-2ea82025bf27_2.png"],
  ["03-departures-concourse", "a_retro_time-travel_airport_departure_lounge_--ar_169_--raw_-_82f1e761-302d-48dd-8a8a-0520fff8eda6_2.png"],
  ["04-duplicate-selves", "timeline_documentation_office_where_passengers_are_separated__92c002d8-b45a-4885-877c-70d11b9f555c_2.png"],
  ["05-boarding-platform", "a_strange_boarding_gate_inside_the_psychedelic_time_airport_-_efe0d8e8-8c12-412b-86d7-73589a1ffe76_1.png"],
  ["06-zero-gravity", "the_moment_the_time_airport_turns_into_an_underwater_boarding_aacbfc3d-c2de-4cac-bd2b-007b4d67b73a_1.png"],
  ["07-golden-fish-flight", "Upward_tilt_composition_long_yellow_flying_creature_above_lik_f65df54b-fcb9-47c9-a0d8-08d333cdfc85_1.png"],
  ["08-holding-pattern", "surreal_airport_wall_objects_subtly_aligning_into_flight_path_0c2247bc-1826-4ba5-ab4f-e3cc26904886_0.png"],
  ["09-cloud-orchard", "Lower_frame_flooding_with_soft_pink_clouds_rising_like_liquid_65d771a3-dee4-4986-b5fb-eca563fc6771_1.png"],
  ["10-pink-rotunda", "surreal_airport_wall_objects_subtly_aligning_into_flight_path_724bfe5b-52a6-45d0-9bbe-50ca26ef7022_3.png"],
];

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  // Scenes + audio come from the ephemeral Desktop folder; once optimized they
  // live committed in public/, so skip (don't fail) when the source is gone.
  if (existsSync(SRC)) {
    await mkdir(SCENES_OUT, { recursive: true });
    await mkdir(AUDIO_OUT, { recursive: true });

    for (const [slug, file] of SCENES) {
      const src = join(SRC, file);
      if (!(await fileExists(src))) {
        throw new Error(`Missing keyframe for ${slug}: ${file}`);
      }
      await Promise.all(
        SIZES.map(({ width, suffix }) =>
          sharp(src)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 84 })
            .toFile(join(SCENES_OUT, `${slug}${suffix}.webp`))
        )
      );
      console.log(`✓ ${slug}`);
    }

    if (await fileExists(AUDIO_SRC)) {
      await copyFile(AUDIO_SRC, join(AUDIO_OUT, "whale-sky-god.mp3"));
      console.log("✓ audio/whale-sky-god.mp3");
    } else {
      console.warn(`! audio not found at ${AUDIO_SRC} — skipping`);
    }
    console.log(`Done. ${SCENES.length} scenes optimized → public/scenes/`);
  } else {
    console.warn(`Keyframe source gone (${SRC}) — scenes/audio already in public/, skipping.`);
  }

  await optimizeMerch();
}

// Merch raster outputs (merch/<round>/*.png, gitignored) → committed web webp in
// public/merch/ so the on-site Duty-Free shop can deploy. Source PNGs stay local.
async function optimizeMerch() {
  const MERCH_SRC = join(ROOT, "merch");
  const MERCH_OUT = join(ROOT, "public", "merch");
  if (!existsSync(MERCH_SRC)) return;

  const rounds = (await readdir(MERCH_SRC, { withFileTypes: true }))
    .filter((d) => d.isDirectory() && d.name !== "print") // print/ = handoff files, not web
    .map((d) => d.name);

  await mkdir(MERCH_OUT, { recursive: true });
  let n = 0;
  for (const round of rounds) {
    const dir = join(MERCH_SRC, round);
    const pngs = (await readdir(dir)).filter((f) => f.endsWith(".png"));
    for (const file of pngs) {
      const stem = basename(file, extname(file));
      await sharp(join(dir, file))
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 86 })
        .toFile(join(MERCH_OUT, `${round}-${stem}.webp`));
      n++;
    }
  }
  if (n) console.log(`Done. ${n} merch images optimized → public/merch/`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
