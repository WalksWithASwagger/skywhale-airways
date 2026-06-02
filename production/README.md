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

## The finished cut

- **`../public/film/psychedelic-airport.mp4`** (= `edits/skywhale_whalesky_final.mp4`)
  — **the deliverable.** 53.0s, all ten pro (`veo-3.1`) shots, cut to the
  **`whale sky god`** track (the spoken-word song — narration is *in* the track,
  no separate VO). Each shot uses its *opening* window stretched into slow motion
  (head mode), so the film stays in the flat hand-painted style throughout.

  The cut is **lyric-synced**: shot boundaries fall on the song's phrase
  timestamps and the hero shots land on their own lines —
  *"yellow god with fins"* → skywhale (0:00), *"saw herself already waiting"* →
  duplicate selves (0:16), *"the big yellow animal…"* → golden-fish flight
  (0:34), *"she arrived…"* → rotunda (0:40). The golden-fish flight is moved to
  the climax slot (just before arrival) to match the narration order. Title
  couplet fades in over the opening shot; the arrival holds through the
  instrumental outro and fades out for credits.

  ```bash
  python3 scripts/assemble_time_airport.py \
    --audio video_project/time_airport/audio/whale-sky-god.mp3 \
    --mode head --variant full --silent \
    --scenes s01 s02 s03 s04 s05 s06 s08 s09 s07 s10 \
    --durations "5.84,4.5,5.72,4.46,3.18,3.14,3.51,3.51,5.76,13.38" \
    --windows   "3.5,3.2,4.0,3.2,2.3,2.3,2.5,2.5,4.0,6.0" \
    --out /tmp/wsg_silent.mp4
  # then add title fade-in (1.5s) + credits fade-out (6s) and mux the track:
  ffmpeg -i /tmp/wsg_silent.mp4 -i video_project/time_airport/audio/whale-sky-god.mp3 \
    -filter_complex "[0:v]fade=t=in:st=0:d=1.5,fade=t=out:st=47:d=6[v];\
[1:a]afade=t=in:st=0:d=1.0,afade=t=out:st=49.5:d=3.5[a]" \
    -map "[v]" -map "[a]" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -t 53 \
    video_project/time_airport/edits/skywhale_whalesky_final.mp4
  ```

- Pro source clips (`clips/s01_full.mp4` … `s10_full.mp4`) are regenerable with
  `run_i2v_pipeline.py --all --model full`; they're not committed (regenerate on
  demand) — only the fast clips and the final cut live in the repo.
- **Web embed:** the finished file sits in `public/film/`; wiring it into the
  `#film-frame` element in `index.html` is left to the web app work (the Pages
  deploy needs `lfs: true` on its checkout — see PR #1).

## Titles & credits

Generative, in-style title and credit cards (rafiki, with a source keyframe as a
`style` reference):

- `titles/title_card.png` — "SKYWHALE AIRWAYS / A PSYCHEDELIC AIRPORT FOR TIME
  TRAVELERS". Generated on **OpenAI gpt-image-2** (Gemini reliably misspells
  "psychedelic"; gpt-image-2 spells it correctly). Style ref: `s07_goldenfish.png`.
- `titles/credits_card.png` — "A FILM BY KRIS KRÜG & SUZIE EASTON / MUSIC — whale
  sky god / AI FILM CLUB · RETRO CHALLENGE · 2026". Generated on Gemini
  (`gemini-2.5-flash-image`). Style ref: `s10_rotunda.png`.

**Text-on-card caveat:** Veo animation *melts lettering*, so don't run text cards
through `run_i2v_pipeline`. The title is animated with a text-safe ffmpeg slow
push-in (Ken Burns); the credits use a short Veo clip windowed to the first ~5s
(before its text dissolves).

**Festival cut:** `edits/skywhale_whalesky_titled.mp4` — 63s = title card (4.5s,
push-in, fades from black) → the 53s film → credits card (5.5s, fades to black).
The clean 53s `public/film/psychedelic-airport.mp4` stays as the web-embed cut.

## Config

Copy `.env.example` → `.env` and set `REPLICATE_API_TOKEN` (clips, beds, stems),
`ELEVENLABS_API_KEY` (voiceover), plus `GOOGLE_API_KEY` / `OPENAI_API_KEY` for
rafiki card generation.
