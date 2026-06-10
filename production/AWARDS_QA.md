# Skywhale Awards QA

Audited June 3, 2026 23:30 PDT / June 4, 2026 06:30 UTC.

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
