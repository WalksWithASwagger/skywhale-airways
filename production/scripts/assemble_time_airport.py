#!/usr/bin/env python3
"""Assemble the Time Airport clips into a single cut with a music track.

Modes:
  fit      -> each clip is time-stretched so the 10 clips exactly fill the
              audio duration (dreamy slow-motion). Default.
  natural  -> clips play at native 8s speed; audio is trimmed + faded to match.

Usage:
  python3 scripts/assemble_time_airport.py --audio "/path/track.mp3" --mode fit
"""
from __future__ import annotations
import argparse, json, subprocess, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "video_project" / "time_airport"
CLIPS = PROJECT / "clips"
EDITS = PROJECT / "edits"


def dur(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
                         capture_output=True, text=True).stdout.strip()
    return float(out)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--audio", required=True)
    ap.add_argument("--mode", choices=["fit", "natural"], default="fit")
    ap.add_argument("--scenes", nargs="*", help="Subset/order of scene ids (default: all in storyboard order)")
    ap.add_argument("--out", default=None)
    ap.add_argument("--fps", type=int, default=24)
    args = ap.parse_args()

    cfg = json.loads((PROJECT / "scenes.json").read_text())
    ids = args.scenes if args.scenes else [s["id"] for s in cfg["scenes"]]
    clips = [CLIPS / f"{i}.mp4" for i in ids]
    missing = [c.name for c in clips if not c.exists()]
    if missing:
        raise SystemExit(f"Missing clips: {missing}")

    audio = Path(args.audio)
    audio_len = dur(audio)
    EDITS.mkdir(parents=True, exist_ok=True)
    out = Path(args.out) if args.out else EDITS / f"time_airport_test_{args.mode}.mp4"

    n = len(clips)
    if args.mode == "fit":
        target = audio_len / n  # seconds per clip after stretch
    else:
        target = None

    # Build per-clip normalized segments (uniform fps, scale, optional slowdown).
    tmp = Path(tempfile.mkdtemp())
    segs = []
    for idx, clip in enumerate(clips):
        seg = tmp / f"seg_{idx:02d}.mp4"
        vf = f"scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps={args.fps}"
        cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(clip)]
        if target:
            factor = target / dur(clip)
            vf = f"setpts={factor:.5f}*PTS," + vf
        cmd += ["-vf", vf, "-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", str(seg)]
        subprocess.run(cmd, check=True)
        segs.append(seg)

    concat_list = tmp / "list.txt"
    concat_list.write_text("".join(f"file '{s}'\n" for s in segs))
    silent = tmp / "concat.mp4"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
                    "-i", str(concat_list), "-c", "copy", str(silent)], check=True)

    video_len = dur(silent)
    # Mux audio. In fit mode lengths match; in natural mode trim+fade audio to video.
    afilter = []
    if args.mode == "natural":
        fade_start = max(0.0, video_len - 3.0)
        afilter = ["-af", f"afade=t=out:st={fade_start:.2f}:d=3", "-t", f"{video_len:.2f}"]
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(silent), "-i", str(audio),
           "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
           "-c:a", "aac", "-b:a", "192k", "-shortest"] + afilter + [str(out)]
    subprocess.run(cmd, check=True)
    print(f"✓ {out.relative_to(ROOT)}  video={video_len:.1f}s audio={audio_len:.1f}s per_clip={target or dur(clips[0]):.1f}s")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
