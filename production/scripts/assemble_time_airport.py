#!/usr/bin/env python3
"""Assemble the Time Airport clips into a single cut with a music track.

Modes:
  fit      -> each clip is time-stretched so the 10 clips exactly fill the
              audio duration (dreamy slow-motion). Default.
  natural  -> clips play at native 8s speed; audio is trimmed + faded to match.
  head     -> per-scene: take the opening --windows seconds of each clip and
              slow it to fill that scene's --durations seconds (the awards-cut
              recipe — keeps the flat painted style of each shot's opening).

Usage:
  python3 scripts/assemble_time_airport.py --audio "/path/track.mp3" --mode fit
  python3 scripts/assemble_time_airport.py --mode head --variant 4k --silent \
      --scenes s01 s02 s03 s04 s05 s06 s08 s09 s07 s10 \
      --durations "5.84,4.5,5.72,4.46,3.18,3.14,3.51,3.51,5.76,13.38" \
      --windows "3.5,3.2,4.0,3.2,2.3,2.3,2.5,2.5,4.0,6.0" \
      --size 3840x2160 --out /tmp/body_4k.mp4
"""
from __future__ import annotations
import argparse, json, shutil, subprocess, tempfile
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
    ap.add_argument("--audio", help="Music track (required unless --silent)")
    ap.add_argument("--mode", choices=["fit", "natural", "head"], default="fit")
    ap.add_argument("--scenes", nargs="*", help="Subset/order of scene ids (default: all in storyboard order)")
    ap.add_argument("--variant", choices=["fast", "full", "4k"], default="fast",
                    help="Clip variant: fast=sNN.mp4, full=sNN_full.mp4, 4k=sNN_4k.mp4")
    ap.add_argument("--silent", action="store_true", help="Skip audio mux; emit video only")
    ap.add_argument("--durations", help="head mode: comma list, target seconds per scene")
    ap.add_argument("--windows", help="head mode: comma list, source head-window seconds per scene")
    ap.add_argument("--size", default="1920x1080", help="Output WxH (e.g. 3840x2160)")
    ap.add_argument("--out", default=None)
    ap.add_argument("--fps", type=int, default=24)
    args = ap.parse_args()

    if not args.silent and not args.audio:
        ap.error("--audio is required unless --silent")
    if args.mode == "fit" and not args.audio:
        ap.error("fit mode needs --audio to size the stretch")
    if args.mode == "head" and not (args.durations and args.windows):
        ap.error("head mode needs --durations and --windows")

    cfg = json.loads((PROJECT / "scenes.json").read_text())
    ids = args.scenes if args.scenes else [s["id"] for s in cfg["scenes"]]
    suffix = {"fast": "", "full": "_full", "4k": "_4k"}[args.variant]
    clips = [CLIPS / f"{i}{suffix}.mp4" for i in ids]
    missing = [c.name for c in clips if not c.exists()]
    if missing:
        raise SystemExit(f"Missing clips: {missing}")

    durations = windows = None
    if args.mode == "head":
        durations = [float(x) for x in args.durations.split(",")]
        windows = [float(x) for x in args.windows.split(",")]
        if not (len(durations) == len(windows) == len(clips)):
            raise SystemExit(f"head mode: {len(clips)} scenes but "
                             f"{len(durations)} durations / {len(windows)} windows")

    audio = Path(args.audio) if args.audio else None
    audio_len = dur(audio) if audio else None
    EDITS.mkdir(parents=True, exist_ok=True)
    out = Path(args.out) if args.out else EDITS / f"time_airport_test_{args.mode}.mp4"

    w, h = args.size.split("x")
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
        vf = f"scale={w}:{h}:force_original_aspect_ratio=decrease,pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,fps={args.fps}"
        cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(clip)]
        if args.mode == "head":
            factor = durations[idx] / windows[idx]
            vf = f"trim=0:{windows[idx]:.3f},setpts={factor:.5f}*PTS," + vf
        elif target:
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
    if args.silent:
        shutil.move(str(silent), str(out))
        print(f"✓ {out}  video={video_len:.2f}s (silent, {args.size}, variant={args.variant})")
        return 0

    # Mux audio. In fit mode lengths match; otherwise trim+fade audio to video.
    afilter = []
    if args.mode in {"natural", "head"}:
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
