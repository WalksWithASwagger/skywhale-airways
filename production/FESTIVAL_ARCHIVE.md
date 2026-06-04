# Skywhale Festival Submission Archive

Last updated: June 4, 2026.

This is the off-repo packaging checklist for festivals that require a ZIP,
ProRes, stills sheet, separate rights files, or a delivery package beyond the
public Skywhale site and Press Kit.

## Canonical Deliverables

- Primary festival cut:
  `public/film/skywhale-awards-cut-v2.mp4`
- Production edit copy:
  `production/video_project/time_airport/edits/skywhale_awards_cut_v2.mp4`
- Preserved 53s web cut:
  `public/film/psychedelic-airport.mp4`
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
