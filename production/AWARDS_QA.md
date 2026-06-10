# Skywhale Awards QA

Audited June 3, 2026 23:30 PDT / June 4, 2026 06:30 UTC.

## I AM NOMAD 4K master v2 — June 10, 2026 (current submission deliverable)

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
