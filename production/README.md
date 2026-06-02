# Production — *A Psychedelic Airport for Time Travelers*

The film-production side of **Skywhale Airways**: the pipeline that turns the ten
hand-painted Midjourney keyframes into animated clips and edits. The WebGL
microsite (repo root) is the *presentation* layer; this folder is where the
actual animation is generated and cut.

## What's here

```
production/
  scripts/
    run_i2v_pipeline.py        # Veo 3.1 image-to-video runner (Replicate)
    assemble_time_airport.py   # concat clips + lay a music track (fit / natural / subset)
  video_project/time_airport/
    scenes.json                # 10 scenes: prompt, narration, keyframe, global style_suffix
    keyframes/                 # s01–s10 source frames (scene-named)
    clips/                     # s01–s10 generated clips (8s each, 1080p)
    audio/                     # VO takes, music beds, Demucs stems, instrumental cut, mixes
    edits/                     # assembled cuts (the 6-shot <60s instrumental cut)
    supporting-docs/           # storyboard PDF/DOCX, Veo prompts + Suno notes
```

## Pipeline

1. **Keyframes → clips.** Each scene's keyframe is passed as Veo's *first-frame*
   `image`, so the gouache composition is preserved and animated rather than
   redrawn. A shared `style_suffix` in `scenes.json` sets the trip dial
   (currently "legible Dalí melt" — strong surreal morph, subject still readable).

   ```bash
   python3 scripts/run_i2v_pipeline.py --scenes s01 --model fast --no-audio   # test one
   python3 scripts/run_i2v_pipeline.py --all --model fast --no-audio          # all ten
   python3 scripts/run_i2v_pipeline.py --all --model full                     # pro pass (veo-3.1)
   ```

   Cost: `fast` ≈ $1 per 8-s clip, `full` (veo-3.1) ≈ $3.20.

2. **Clips → cut.** Assemble in storyboard order against a track.

   ```bash
   python3 scripts/assemble_time_airport.py \
     --audio video_project/time_airport/audio/inst_intro_57s.mp3 \
     --mode fit --scenes s01 s03 s06 s07 s09 s10 \
     --out video_project/time_airport/edits/time_airport_6shot_57s.mp4
   ```

   `--mode fit` time-stretches clips to fill the audio (dreamy slow-mo);
   `--mode natural` keeps native 8-s speed and trims the audio.

## Audio

- VO drafts (ElevenLabs): `audio/vo_george.mp3`, `audio/vo_brian.mp3` — the
  narration script (newer, tighter lyrics) voiced as a warm male narrator.
- Music: independent retro lounge-jazz beds via Replicate `stable-audio`
  (`audio/bed_*.wav`), plus full VO-over-bed mixes (`audio/mix_*.mp3`).
- The hero track `Airline Brochure.mp3` was split with Demucs
  (`audio/stems/no_vocals.mp3`); `audio/inst_intro_57s.mp3` is the clean
  word-free 0:00–0:57 instrumental used in the current cut.

## Current cut & next steps

- **`edits/time_airport_6shot_57s.mp4`** — 57.5s, instrumental only, six hero
  shots (skywhale → concourse → zero-g → golden-fish flight → cloud orchard →
  rotunda). This is the candidate for the site's `#film-frame` slot.
- **Next:** lock the shot selection, then **regenerate the keepers on `veo-3.1`
  (full / pro)** for final quality, and optionally layer the most poignant
  spoken-word lines back over the instrumental.

## Config

Copy `.env.example` → `.env` and set `REPLICATE_API_TOKEN` (clips, beds, stems)
and `ELEVENLABS_API_KEY` (voiceover).
