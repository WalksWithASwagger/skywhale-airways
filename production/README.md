# Production — *A Psychedelic Airport for Time Travelers*

The film-production side of **Skywhale Airways**: the pipeline that turns the ten
hand-painted Midjourney keyframes into animated clips and edits. The WebGL
microsite (repo root) is the *presentation* layer; this folder is where the
actual animation is generated and cut.

> Note (June 7, 2026): the `public/film/*.mp4` files referenced below were
> removed from the repo/LFS. The festival + web cuts now live on YouTube
> (Unlisted) — `youtu.be/FTMbAECxb8A` and `youtu.be/nvKMmuzQNDs`. The
> production-edit copies under `production/video_project/.../edits/` (Git LFS)
> are unchanged.

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
    edits/                     # assembled web and festival cuts
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
- The final web cut uses `audio/whale-sky-god.mp3`. The awards/festival cut uses
  `audio/whale-sky-god-awards-master.wav`, measured at `-16.7 LUFS` integrated
  loudness and `-3.6 dBFS` true peak after MP4 export. The earlier
  `audio/inst_intro_57s.mp3` instrumental and Demucs stems are retained as
  production history for the 6-shot exploration.

## The finished cut

- **`../public/film/skywhale-awards-cut-v2.mp4`** (=
  `edits/skywhale_awards_cut_v2.mp4`) — **the festival / awards cut and primary
  public watch path.** 59.21s, 1920x1080, H.264/AAC, nominal 24fps. It uses the
  crisp awards title and credits cards, preserves the clean 53s film body, and
  trims the titled edit down from the earlier 63s pacing.

- **`../public/film/psychedelic-airport.mp4`** (= `edits/skywhale_whalesky_final.mp4`)
  — **the preserved web cut.** 53.0s, all ten pro (`veo-3.1`) shots, cut to the
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
- **Web embed:** the primary festival cut sits in `public/film/` and
  `index.html` loads it into the `#film-frame` element with relative paths. The
  53s web cut remains linked from the film actions and Press Kit. Vercel has Git
  LFS enabled and serves real MP4s, not pointer files.

See `AWARDS_QA.md` for the ffprobe, blackdetect, loudness, and browser checklist
results.

See `FESTIVAL_ARCHIVE.md` for the off-repo festival submission package manifest,
credits note, rights/process note, and export guardrails.

## Titles & credits

Generative, in-style title and credit cards (rafiki, with a source keyframe as a
`style` reference):

- `titles/title_card.png` — "SKYWHALE AIRWAYS / A PSYCHEDELIC AIRPORT FOR TIME
  TRAVELERS". Generated on **OpenAI gpt-image-2** (Gemini reliably misspells
  "psychedelic"; gpt-image-2 spells it correctly). Style ref: `s07_goldenfish.png`.
- `titles/credits_card.png` — historical draft credit card generated with a
  misspelled Kris Krug name line; superseded by the awards card below.
- `titles/credits_card_awards.png` — "A FILM BY KRIS KRUG & SUZY EASTON /
  MUSIC — whale sky god / AI FILM CLUB · RETRO CHALLENGE · 2026". Generated on
  Gemini (`gemini-2.5-flash-image`) and corrected with crisp text for the awards
  cut. Style ref: `s10_rotunda.png`.
- `titles/whale-sky-god-suno-cover-portrait.png` — Suno publishing cover for
  **Whale Sky God**. Built as a 1024x1536 portrait-safe poster so it reads in
  Suno's tall song-card UI while surviving Suno's square CDN normalization.
  Published song: https://suno.com/song/4a931db0-bbcd-45e0-b187-0ecde5bbd1d4
- `titles/title_card_awards.png` — crisp 1920x1080 awards title card used in the
  59s festival cut.

**Text-on-card caveat:** Veo animation *melts lettering*, so don't run text cards
through `run_i2v_pipeline`. The title is animated with a text-safe ffmpeg slow
push-in (Ken Burns); the credits use a short Veo clip windowed to the first ~5s
(before its text dissolves).

**Earlier festival cut:** `edits/skywhale_whalesky_titled.mp4` — 63s = title
card (4.5s, push-in, fades from black) → the 53s film → credits card (5.5s,
fades to black). The current primary awards cut is
`edits/skywhale_awards_cut_v2.mp4`.

## Config

Copy `.env.example` → `.env` and set `REPLICATE_API_TOKEN` (clips, beds, stems),
`ELEVENLABS_API_KEY` (voiceover), plus `GOOGLE_API_KEY` / `OPENAI_API_KEY` for
rafiki card generation.
