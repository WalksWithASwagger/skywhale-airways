# Skywhale Awards QA

Audited June 3, 2026 23:30 PDT / June 4, 2026 06:30 UTC.

## Files

- Festival cut: `public/film/skywhale-awards-cut-v2.mp4`
- Production edit: `production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4`
- Web cut, preserved: `public/film/psychedelic-airport.mp4`
- Awards audio master: `production/video_project/time_airport/audio/whale-sky-god-awards-master.wav`
- Awards title card: `production/video_project/time_airport/titles/title_card_awards.png`
- Awards credits card: `production/video_project/time_airport/titles/credits_card_awards.png`

`public/film/skywhale-awards-cut-v2.mp4` and
`production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4` are
byte-identical.

## Video Specs

Command:

```bash
ffprobe -hide_banner -v error \
  -show_entries format=duration,size,bit_rate:stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,sample_rate,channels \
  -of json public/film/skywhale-awards-cut-v2.mp4
```

Result:

- Duration: `59.208333`
- Size: `78,241,899` bytes
- Video: H.264, `1920x1080`, `24/1` nominal frame rate
- Audio: AAC, stereo, `48000 Hz`

## Black Gap Check

Command:

```bash
ffmpeg -hide_banner -nostats \
  -i public/film/skywhale-awards-cut-v2.mp4 \
  -vf blackdetect=d=0.1:pix_th=0.10 -an -f null -
```

Result: no `blackdetect` events were printed.

## Loudness Check

Command:

```bash
ffmpeg -hide_banner -nostats \
  -i public/film/skywhale-awards-cut-v2.mp4 \
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
- `public/film/skywhale-awards-cut-v2.mp4` loads as the primary cut.
- `public/film/psychedelic-airport.mp4` remains reachable as the 53s web cut.
- Press Kit links for festival cut, web cut, stills, About, and airport resolve.

## Remaining Human Review

- Watch the 59s festival cut end to end on the target submission device.
- Listen once on headphones and once on speakers before final awards submission.
- Re-check any festival-specific music/AI clearance paperwork before submitting
  to a venue that requires formal rights documents.
