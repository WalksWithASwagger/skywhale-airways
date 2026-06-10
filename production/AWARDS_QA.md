# Skywhale Awards QA

Audited June 3, 2026 23:30 PDT / June 4, 2026 06:30 UTC.

## I AM NOMAD v6 — June 10, 2026 (FINAL submission deliverable)

KK's notes on v5: credits hold trimmed to 49f (~2s — the "black fade"
feel was the song's quiet tail under a long bright card), s02 window
moved to the front of the take ([0.25-3.806] — she walks up to the
counter; the prior late window opened on the wrong style), and the
zero-g shot switched to the round-1 take at NATIVE speed (127f, factor
1.00, window [0.5-5.79]) — longer and unslowed per direction. The
reclaimed credits second grew s06, which pushed the rotunda back to
its EXACT original lyric anchor (frame 1018, "she arrived" on the cut).
Recipe: `v6_timing.json`.

Masters (off-repo):
- Mix A `edits/i_am_nomad_4k_master_v6.mp4` sha256 `fcd371d2631e123b229a565f0b5e5407b7ebd9282cfa265a2a7867e3d5f17603`
- Mix B `edits/i_am_nomad_4k_master_v6_sfx.mp4` sha256 `ff4b2d3eb85b306cf1468268cc42b3ad13dde40bd81f7bbd12f8b37e90e1f47a`

QA both: 1421f / 59.208333s / 3840x2160 / 24fps / BT.709 / blackdetect
zero / -16.7 LUFS / -3.6 (A) -3.7 (B) dBTP. Same chain as v4/v5.

## I AM NOMAD v5 fine-tune — June 10, 2026 (superseded by v6)

KK's polish pass on the v4 director's cut: title card -0.5s (60f), s01
window slid 1s earlier ([4.03-7.0] — whale reads as a bird before the
melt arrives), span-B re-slow relaxed from ~1.6x to ~1.35x (more living
motion in duplicates/zero-g/orchard), credits -1s (73f, the animation's
most stable window), and the claimed ~4.3s given to the narrative keys:
golden fish +1.8s (window opens to [2.76-8.0], same 1.44x tempo) and
the rotunda arrival +2s (mild 1.16x re-slow). Recipe: `v5_timing.json`.

Lyric-sync note: the duplicate-selves anchor stays exact; the golden
fish now begins ~2.8s before "the big yellow animal" (lands mid-shot)
and the rotunda ~1s before "she arrived" — a deliberate trade for the
longer hero shots.

Masters (off-repo; video identical, audio differs):
- Mix A `edits/i_am_nomad_4k_master_v5.mp4` sha256 `32f80d985dd8c48ee1a795e5c0b6f06fd0fdf2cc21504742cc61f4e74a6efa64`
- Mix B `edits/i_am_nomad_4k_master_v5_sfx.mp4` (s01/s02/s03 generated
  ambience stretched to picture speed, -20dB under the song) sha256
  `9c19671c6d095ff6c5741a48810e418cf8af299f6aac057b4bcafc2303721253`

QA both: 1421f / 59.208333s / 3840x2160 / 24fps / BT.709 / blackdetect
zero / -16.7 LUFS / -3.6 dBTP. Same merge->Topaz(24fps)->CRF18 chain
as v4.

## I AM NOMAD director's cut v4 — June 10, 2026 (superseded by v5)

KK's final per-scene direction after the three-way full-length review:
s01 trippy r2 (late window — the rainbow-drip end state), s02 trippy r2
(2nd half), s03 trippy r2 (front half), s04/s06/s09/s10 original takes
uprezzed, s07 round-1 4K (back portion — the plane-flying read).
**Scenes s05 and s08 cut**; their 161 frames redistributed across
s04/s06/s09 (~1.6x deeper slow-mo) with the lyric anchors pinned
(duplicate selves 0:16, golden fish 0:34, rotunda 0:40 — verified by
frame-grab). Timing recipe: `v4_timing.json`; assembly:
`scripts/assemble_v3.py --timing`.

Two masters, identical video, KK chooses by ear:
- `edits/i_am_nomad_4k_master_v4.mp4` (Mix A — bit-exact original
  audio), sha256 `cc483461455580f9a040b10d7ce2362a6afd1fff573130d2de721bc0bb26ce11`
- `edits/i_am_nomad_4k_master_v4_sfx.mp4` (Mix B — generated airport
  ambience from the s01/s02/s03 takes, time-stretched to match the
  slowed picture, ducked -20dB under the song), sha256 `2e77464ef074fd739eb5b8a1ea74583ef4773ab0fba1735746f5a5944c3e7cf6`

QA (both): 1421f / 59.208333s / 3840x2160 / 24fps / BT.709 /
blackdetect zero / Mix A -16.7 LUFS -3.6 dBTP, Mix B -16.7 LUFS
-3.7 dBTP. Video chain: 1080p EDL assembly -> video-merge re-host ->
single Topaz 4K pass (24fps locked) -> H.264 CRF18.

Remaining human review: watch both, pick the mix, upload to YouTube.

## I AM NOMAD 4K master v2 — June 10, 2026 (superseded by v4)

Round-2 regeneration per KK's watch-through notes: trippier/drippier takes,
the **real v2 awards edit** (recovered frame-exact in `v2_edl.json` — the
round-1 master had reproduced the web-cut recipe by mistake), and animated
key-art title/credits cards. Master: `edits/i_am_nomad_4k_master_v2.mp4`
(off-repo; sha256
`acd0c3f7d912bc470011d52a353405c7291d618618f6923f48cc55841479ad82`,
267,064,609 bytes). Submission export is byte-identical.

Pipeline (all generation on Replicate, per KK):
- 10 scenes regenerated on `google/veo-3.1` (full, 1080p) with an amplified
  Dali-melt style suffix + character lock + SFX-only audio direction; same
  keyframes/prompts otherwise. KK pre-approved all takes live (`picks.json`).
- Title/credits cards: key-art stills (Gemini 3 Pro Image via rafiki,
  refs: `merch/r5/i-am-nomad-master.png` + holographic sticker) animated via
  Veo i2v early-window technique; lettering frame-stepped stable across the
  72f/97f used windows.
- Edit assembled by `scripts/assemble_v3.py` per `v2_edl.json`: 72f title with
  2f fade-to-dark, 15f body fade-in, corrected per-shot durations AND
  slow-motion windows (s10 = full 8s take stretched to 12.75s; s09 = 2.9s
  window), all hard cuts, credits hard cut at frame 1324, ends bright.
- 1080p assembly re-hosted via `lucataco/video-merge` (chunked through the
  Replicate Files API) and upscaled in one `topazlabs/video-upscale` pass
  (4k, target_fps 24 — the model defaults to 30fps; first attempt discarded).
  Trailing duplicate frame from the merge trimmed at final encode.

Measured on the master:
- Duration `59.208333` (1421 frames @ 24fps), 3840x2160, H.264 yuv420p,
  BT.709-tagged, ~36.1 Mbps (CRF 18, preset slow)
- Audio stream-copied from `skywhale_awards_cut_v2.mp4`: `-16.7 LUFS`,
  `-3.6 dBTP` (re-measured, matches)
- `blackdetect=d=0.1:pix_th=0.10`: zero events
- Spot frames verified: animated title card, dip transition, film body,
  animated credits card

Remaining human review: watch end to end on the target device; listen on
headphones and speakers (issue #15).

## I AM NOMAD 4K master — June 9, 2026 (superseded by v2 above)

The film was regenerated at native 4K (Veo 3.1 via the Gemini API, same
keyframes and prompts) and retitled **I AM NOMAD**. New master:
`edits/i_am_nomad_4k_master.mp4` (off-repo, not in LFS; sha256
`d94fa8ecbeefa6d05dbfbdd0badc27d2f2462b07f7c7434a5f6db8bdf1635c78`).
Generation provenance: `predictions.json` (10 Gemini operation IDs, all 4k).
The submission export `I-Am-Nomad-festival-cut-submission.mp4` is
byte-identical to the master.

Measured on the master:

- Duration: `59.208333` (1421 frames @ 24 fps — title 72f + body 1272f +
  credits 106f with a 29-frame crossfade)
- Video: H.264, `3840x2160`, yuv420p, BT.709-tagged, ~35.6 Mbps (CRF 18,
  preset slow)
- Audio: AAC stereo 48 kHz, **stream-copied** from `skywhale_awards_cut_v2.mp4`
  — loudness therefore unchanged: `-16.7 LUFS` integrated, `-3.6 dBTP` peak
  (re-measured on the new master, matches)
- Black gap check (`blackdetect=d=0.1:pix_th=0.10`): zero events
- Title/credits cards: `titles/title_card_nomad_4k.png`,
  `titles/credits_card_nomad_4k.png` — text proofread at 100% zoom
- Per-scene A/B against the v2 master: all ten 4K takes approved
  (first-frame-anchored regen; pacing identical — same durations/head-windows)

Remaining human review for the 4K cut: watch end to end on the target
submission device; listen once on headphones, once on speakers.

---

Everything below documents the earlier 1080p awards cut
(`skywhale_awards_cut_v2.mp4`), which remains the source of the audio
timeline and the per-scene A/B reference.

> Note (June 7, 2026): the former `public/film/*.mp4` paths were removed from the
> repo/LFS; the cuts are now on YouTube (Unlisted) — `youtu.be/FTMbAECxb8A`
> (festival) and `youtu.be/nvKMmuzQNDs` (web cut). The `production/.../edits/`
> source copies (Git LFS) are unchanged, so the `ffprobe` checks still apply to
> those.

## Files

- Public festival cut: YouTube (Unlisted), `youtu.be/FTMbAECxb8A`
- Production edit: `production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4`
- Public web cut, preserved: YouTube (Unlisted), `youtu.be/nvKMmuzQNDs`
- Production web edit: `production/video_project/time_airport/edits/skywhale_whalesky_final.mp4`
- Awards audio master: `production/video_project/time_airport/audio/whale-sky-god-awards-master.wav`
- Awards title card: `production/video_project/time_airport/titles/title_card_awards.png`
- Awards credits card: `production/video_project/time_airport/titles/credits_card_awards.png`

The old public MP4 copy was byte-identical to
`production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4` before
the public files were removed from the repo/LFS.

## Video Specs

Command:

```bash
ffprobe -hide_banner -v error \
  -show_entries format=duration,size,bit_rate:stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,sample_rate,channels \
  -of json production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4
```

Result:

- Duration: `59.208333`
- Size: `76,464,369` bytes (matches the committed LFS pointer, sha256 `6b9357a6…`)
- Video: H.264, `1920x1080`, `24/1` nominal frame rate
- Audio: AAC, stereo, `48000 Hz`

## Black Gap Check

Command:

```bash
ffmpeg -hide_banner -nostats \
  -i production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4 \
  -vf blackdetect=d=0.1:pix_th=0.10 -an -f null -
```

Result: no `blackdetect` events were printed.

## Loudness Check

Command:

```bash
ffmpeg -hide_banner -nostats \
  -i production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4 \
  -filter_complex ebur128=peak=true -f null -
```

Result:

- Integrated loudness: `-16.7 LUFS`
- Loudness range: `4.3 LU`
- True peak: `-3.6 dBFS`

## Title And Credits

The awards title and credits cards were inspected at full size. Both are
1920x1080 PNGs with readable composited text. The awards credits card and MP4
credit segment use `KRIS KRUG & SUZY EASTON`.

## Browser / Site Checks

Run after any site edit:

```bash
npm run build
```

Then smoke test:

- Home page gate opens.
- Festival cut appears in the terminal film frame.
- The terminal film frame embeds the YouTube no-cookie festival cut
  (`FTMbAECxb8A`) as the primary cut.
- The 53s web cut link points to YouTube (`nvKMmuzQNDs`).
- Press Kit links for festival cut, web cut, stills, About, and airport resolve.

## Remaining Human Review

- Watch the 59s festival cut end to end on the target submission device.
- Listen once on headphones and once on speakers before final awards submission.
- Re-check any festival-specific music/AI clearance paperwork before submitting
  to a venue that requires formal rights documents.
