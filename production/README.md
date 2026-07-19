# Production — *I AM NOMAD*

The film-production side of **Skywhale Airways**: the pipeline that turns the ten
hand-painted Midjourney keyframes into animated clips and edits. The WebGL
microsite (repo root) is the *presentation* layer; this folder is where the
actual animation is generated and cut.

> Note (June 7, 2026): the former `public/film/*.mp4` files were removed from
> the repo/LFS. The festival + web cuts now live on YouTube
> (Unlisted) — `youtu.be/3xmfwiwdhm8` and `youtu.be/nvKMmuzQNDs`. The
> production-edit copies under `production/video_project/.../edits/` (Git LFS)
> are unchanged.

## What's here

```
production/
  scripts/
    run_i2v_pipeline.py        # Veo 3.1 image-to-video runner (Replicate; Gemini API for 4k)
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
   python3 scripts/run_i2v_pipeline.py --all --model full --resolution 4k --no-audio  # 4K pass
   ```

   Cost: `fast` ≈ $1 per 8-s clip, `full` (veo-3.1) ≈ $3.20, `4k` ≈ $4.80
   ($0.60/s via the Gemini API).

   **Resolution note (updated):** Veo 3.1 gained native 4K (3840×2160) in a
   January 2026 update. Replicate's `google/veo-3.1` still caps at 1080p, so
   4k requests route to the Gemini API (`veo-3.1-generate-preview`) — set
   `GOOGLE_API_KEY` in `production/.env`. 4K clips land as `clips/sNN_4k.mp4`;
   re-rolls never overwrite earlier takes (`sNN_4k_t2.mp4`, …).

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

- **`edits/skywhale_awards_cut_v2.mp4`** — the production edit copy of the
  festival / awards cut. The **primary public watch path** is now YouTube
  (Unlisted), `youtu.be/3xmfwiwdhm8`, embedded on the site with
  `youtube-nocookie`. 59.21s, 1920x1080, H.264/AAC, nominal 24fps. It uses the
  crisp awards title and credits cards, preserves the clean 53s film body, and
  trims the titled edit down from the earlier 63s pacing.

- **`edits/skywhale_whalesky_final.mp4`** — the production edit copy of the
  preserved web cut. The public web cut is now YouTube (Unlisted),
  `youtu.be/nvKMmuzQNDs`. 53.0s, all ten pro (`veo-3.1`) shots, cut to the
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
- **Web embed:** `index.html` embeds the primary festival cut in the
  `#film-frame` element from YouTube's no-cookie host. The 53s web cut remains
  linked from the film actions and Press Kit. Vercel no longer serves public
  film MP4s from repo/LFS.

## The I AM NOMAD cut (v9 — final, June 2026)

The film was re-cut as **I AM NOMAD** through nine director iterations.
The final recipe is fully committed and reproducible:

1. **Edit forensics** — `scripts/extract_edl.py` measured the original
   awards edit frame-exactly from the v2 master (shot boundaries, the
   title dip-to-dark, per-shot slow-motion via duplicate-frame
   signatures) into `video_project/time_airport/v2_edl.json`.
2. **Assembly** — `scripts/assemble_v3.py --timing <vN_timing.json>`
   renders any cut: per-scene picks across {old master extraction, r1
   4K take, r2 trippy take}, window offsets, per-shot frame counts,
   dissolves (`dissolve_into_next`), parametric title/credits lengths.
   The final recipe is `v9_timing.json` (lyric anchors at frames
   380/808/946 against the master audio trimmed from its 3.0s mark).
3. **4K upscale** — assemble at 1080p, split at a hard cut into <100MB
   chunks, upload via the Replicate Files API, re-host through
   `lucataco/video-merge` (Topaz cannot fetch authed Files URLs), then
   one `topazlabs/video-upscale` pass with `target_resolution: "4k"`
   **and `target_fps: 24`** (it defaults to 30 and will resample).
4. **Audio** — the approved master audio trimmed from 3.0s with a
   0.25s smoothing fade (music from frame one); Mix B adds the r2
   takes' SFX-directed ambience, time-stretched by each shot's slow
   factor (`atempo`), ducked -20dB. Loudness target -16.7 LUFS /
   -3.6 dBTP (EBU gating makes the trim loudness-invariant).
5. **Final encode** — H.264 CRF 18 preset slow, BT.709 via
   `setparams` (ffmpeg 8: the `-color_*` flags only tag the matrix),
   exact `-frames:v` cap, audio mux, `+faststart`.
6. **QA battery** — frame count, duration, blackdetect zero, ebur128,
   anchor frame-grabs, head-audio level. Version log + hashes:
   `AWARDS_QA.md`; canonical deliverable per `FESTIVAL_ARCHIVE.md`.

Approved final: `edits/i_am_nomad_4k_master_v9.mp4` (53.5s, Mix A
canonical). Masters v1–v8 remain in `edits/` as history (off-repo).

## Submission export

To package the finished cut for a festival portal or projector laptop, run:

```bash
production/scripts/export_festival_master.sh            # lossless repackage (recommended)
production/scripts/export_festival_master.sh --reencode # fresh high-bitrate H.264 if a portal rejects the original
```

This does **not** regenerate the film — it packages whichever finished master
exists (default: the 4K I AM NOMAD master, falling back to
`skywhale_awards_cut_v2.mp4`). The masters are already near-lossless CRF-17/18
encodes. The default mode is a bit-exact stream copy with `+faststart` and a
clean submission filename; `--reencode` produces a fresh CRF-16 H.264 with
BT.709 color tags and 320k audio for portals that demand a transcode. Requires
`ffmpeg` and an LFS-pulled master (`git lfs pull`).

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
- `titles/title_card_nomad_4k.png` — 3840×2160 **I AM NOMAD** title card
  (full lockup: "SKYWHALE AIRWAYS presents / I AM NOMAD / a psychedelic airport
  for time travelers"). Generated on Gemini 3 Pro Image at 4K via rafiki —
  unlike the older flash model it spells "psychedelic" correctly. Style refs:
  `merch/r5/i-am-nomad-master.png` (letterforms) + `s07_goldenfish.png` (scene).
- `titles/credits_card_nomad_4k.png` — 3840×2160 credits card for the I AM
  NOMAD cut, same credits text as the awards card. Style refs: nomad master +
  `s10_rotunda.png`.

**Text-on-card caveat:** Veo animation *melts lettering*, so don't run text cards
through `run_i2v_pipeline`. The title is animated with a text-safe ffmpeg slow
push-in (Ken Burns); the credits use a short Veo clip windowed to the first ~5s
(before its text dissolves).

**Earlier festival cut:** `edits/skywhale_whalesky_titled.mp4` — 63s = title
card (4.5s, push-in, fades from black) → the 53s film → credits card (5.5s,
fades to black). The current primary awards cut is
`edits/skywhale_awards_cut_v2.mp4`.

## Config

The environment contract is in `.env.schema`. Agents may inspect that schema,
but must not read local `.env*` value files. Run secret-dependent commands with:

```bash
varlock run --inject vars -- <command>
```

The contract covers `REPLICATE_API_TOKEN` (clips, beds, stems),
`ELEVENLABS_API_KEY` (voiceover), plus `GOOGLE_API_KEY` / `OPENAI_API_KEY` for
Gemini and Rafiki card generation. `GEMINI_API_KEY` remains an accepted alias.
