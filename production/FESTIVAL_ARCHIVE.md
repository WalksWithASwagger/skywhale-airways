# Skywhale Festival Submission Archive

Last updated: June 4, 2026.

> Note (June 7, 2026): the former `public/film/*.mp4` paths were removed from the
> repo/LFS; the cuts are now on YouTube (Unlisted) — `youtu.be/FTMbAECxb8A`
> (festival) and `youtu.be/nvKMmuzQNDs` (web cut). The `production/.../edits/`
> source copies (Git LFS) are unchanged.

This is the off-repo packaging checklist for festivals that require a ZIP,
ProRes, stills sheet, separate rights files, or a delivery package beyond the
public Skywhale site and Press Kit.

## Canonical Deliverables

> June 10, 2026 (later) — **Director's cut v4 is FINAL**: KK's per-scene picks
> across old/r1/r2, s05+s08 cut with anchor-pinned retiming, Mix A
> (`i_am_nomad_4k_master_v4.mp4`, sha256 `cc483461455580f9a040b10d7ce2362a6afd1fff573130d2de721bc0bb26ce11`)
> and Mix B SFX variant (`..._v4_sfx.mp4`, sha256 `2e77464ef074fd739eb5b8a1ea74583ef4773ab0fba1735746f5a5944c3e7cf6`).
> Recipe: `v4_timing.json` + `scripts/assemble_v3.py`. QA: AWARDS_QA top.

> June 10, 2026 — **I AM NOMAD 4K master v2** (round-2 trippier takes,
> EDL-exact edit, animated key-art cards) supersedes everything below as the
> submission deliverable. Off-repo: `edits/i_am_nomad_4k_master_v2.mp4`,
> sha256 `acd0c3f7d912bc470011d52a353405c7291d618618f6923f48cc55841479ad82`,
> 267,064,609 bytes, 59.208333s, 3840×2160/24fps. Regenerable: keyframes +
> prompts + trippier suffix (`predictions.json`) + `v2_edl.json` +
> `scripts/assemble_v3.py` + Topaz provenance (`predictions.json` steps).
> QA: `AWARDS_QA.md` top section.

> June 9, 2026 — **I AM NOMAD 4K master** supersedes the 1080p awards cut as
> the submission deliverable. Off-repo (LFS budget): keep
> `edits/i_am_nomad_4k_master.mp4` in the festival archive; sha256
> `d94fa8ecbeefa6d05dbfbdd0badc27d2f2462b07f7c7434a5f6db8bdf1635c78`,
> 263,651,782 bytes, 59.208333s, 3840×2160. Regenerable: keyframes + prompts
> (`scenes.json`) + Gemini operation IDs (`predictions.json`) + assembly recipe
> (`production/README.md`). 4K title/credits cards are committed in `titles/`.
> YouTube upload + site embed swap pending (PR #83). QA: `AWARDS_QA.md` top
> section.

- Public primary festival cut:
  YouTube (Unlisted), `youtu.be/FTMbAECxb8A`
- Production edit copy:
  `production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4`
- Public preserved 53s web cut:
  YouTube (Unlisted), `youtu.be/nvKMmuzQNDs`
- Production web edit copy:
  `production/video_project/time_airport/edits/skywhale_whalesky_final.mp4`
- Awards title card:
  `production/video_project/time_airport/titles/title_card_awards.png`
- Awards credits card:
  `production/video_project/time_airport/titles/credits_card_awards.png`
- Canonical project key art:
  `merch/r5/i-am-nomad-master.png`
- Press Kit:
  `press.html`
- Awards QA evidence:
  `production/AWARDS_QA.md`
- Production origin notes:
  `production/ORIGIN_NOTES.md`

## Package Manifest

For a standard festival upload package, assemble outside the repo:

- `Skywhale-Airways-festival-cut.mp4`
- `Skywhale-Airways-web-cut.mp4`
- `Skywhale-Airways-press-kit.pdf` or saved `press.html` export, if required.
- `Skywhale-Airways-key-art.png`
- `Skywhale-Airways-stills/` with selected keyframes or still grabs.
- `Skywhale-Airways-credits.txt`
- `Skywhale-Airways-rights-and-ai-process-note.txt`
- `Skywhale-Airways-technical-specs.txt`

Do not commit duplicate ZIPs, ProRes exports, or large alternate encodes unless a
specific festival requirement makes that artifact part of the repo record.

## Credits And Rights Notes

Working credit line:

```text
Skywhale Airways
A film by Kris Krug & Suzy Easton
Music: Whale Sky God
AI Film Club · Retro Challenge · 2026
```

Rights/process note should cover:

- The film uses AI-assisted image, animation, and audio workflows.
- Final public cuts and committed source notes are documented in this repo.
- Any festival-specific AI disclosure, music clearance, or rights statement must
  be reviewed against that festival's submission rules before upload.

## Technical Specs

Current primary cut:

- Duration: `59.208333` seconds.
- Video: H.264, `1920x1080`, nominal `24fps`.
- Audio: AAC stereo, `48000 Hz`.
- Loudness: `-16.7 LUFS` integrated, `-3.6 dBFS` true peak.
- QA source: `production/AWARDS_QA.md`.

If a festival requires ProRes, DCP, subtitles, closed captions, or a different
aspect ratio, create that export outside the repo first and document the exact
command and output path before deciding whether to preserve it.
