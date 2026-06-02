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

- **`../public/film/psychedelic-airport.mp4`** (= `edits/time_airport_10shot_establish_pro.mp4`)
  — **the deliverable.** 57.5s, instrumental only, all ten shots in storyboard
  order, generated on **`veo-3.1` (pro)**. Each shot uses its *opening* window
  (head mode) stretched into slow motion, so the whole film stays in the flat
  hand-painted folk-art style and never drifts into the over-melted ends. s01 is
  capped at 3.5s to stay ahead of any morph. Built with:

  ```bash
  python3 scripts/assemble_time_airport.py \
    --audio video_project/time_airport/audio/inst_intro_57s.mp3 \
    --mode head --variant full --src-window 4.0 --head-overrides "s01=3.5" \
    --scenes s01 s02 s03 s04 s05 s06 s07 s08 s09 s10 \
    --out video_project/time_airport/edits/time_airport_10shot_establish_pro.mp4
  ```

- The earlier `edits/time_airport_6shot_57s.mp4` (six hero shots, melty middles)
  is kept as an alternate.
- Pro source clips (`clips/s01_full.mp4` … `s10_full.mp4`) are regenerable with
  `run_i2v_pipeline.py --all --model full`; they're not committed (regenerate on
  demand) — only the fast clips and the final cut live in the repo.
- **Optional next:** layer the most poignant spoken-word lines (ElevenLabs VO,
  used sparingly) back over the instrumental, then re-export.
- **Web embed:** the finished file sits in `public/film/`; wiring it into the
  `#film-frame` element in `index.html` is left to the web app work.

## Config

Copy `.env.example` → `.env` and set `REPLICATE_API_TOKEN` (clips, beds, stems)
and `ELEVENLABS_API_KEY` (voiceover).
