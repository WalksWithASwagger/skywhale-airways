# Skywhale Awards QA

Run these checks before treating the festival package as submission-ready.

## Files

- Festival cut: `production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4`
- Public festival cut: `public/film/skywhale-awards-cut-v2.mp4`
- Web cut: `public/film/psychedelic-airport.mp4`
- Audio master: `production/video_project/time_airport/audio/whale-sky-god-awards-master.wav`
- Poster/social image: `public/social/skywhale-awards-title-card.jpg`

## Current Readout

- Festival cut duration: 59.21s.
- Festival cut format: 1920x1080 H.264 video, AAC stereo audio, 24fps source cadence.
- Festival cut loudness: -16.7 LUFS integrated.
- Festival cut true peak: -3.6 dBFS.
- Audio master loudness: -16.6 LUFS integrated.
- Audio master true peak: -3.7 dBFS.
- Black-gap scan: no unwanted `blackdetect` intervals in `skywhale_awards_cut_v2.mp4`.

## Commands

```bash
npm run build
ffprobe -hide_banner -v error -show_format -show_streams production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4
ffmpeg -hide_banner -i production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4 -vf blackdetect=d=0.08:pic_th=0.98 -an -f null -
ffmpeg -hide_banner -nostats -i production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4 -filter_complex ebur128=peak=true -f null -
ffmpeg -hide_banner -nostats -i production/video_project/time_airport/audio/whale-sky-god-awards-master.wav -filter_complex ebur128=peak=true -f null -
```

## Browser Review

- Homepage shows the festival cut as the primary film.
- Homepage still links the 53s web cut.
- Press kit opens with the festival cut CTA above the hero image.
- Press kit links resolve locally.
- Poster/social image renders in the hero and metadata paths.

## Playback Review

- Title is readable immediately.
- First film image arrives after the 3s title card.
- Credits are readable at the end.
- No accidental mute, clipping, dropped video, or visible black seam appears between sections.
