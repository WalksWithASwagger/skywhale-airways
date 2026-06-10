#!/usr/bin/env python3
"""Assemble the I AM NOMAD cut exactly per the recovered v2 EDL.

Reads video_project/time_airport/v2_edl.json (the measured awards edit) and a
picks file mapping each scene to its winning take, builds the frame-exact
silent video at the working resolution (default 1080p — the Topaz 4K upscale
happens afterwards on the assembled result, then audio is stream-copied from
the v2 master).

Edit language reproduced from the EDL: 72f animated title card with a fast
2-frame fade to dark, body fades in from dark over 15f, all internal shot
boundaries hard cuts, credits enter on a HARD CUT (97f), film ends on the
bright card (no closing fade — the audio fades, the picture doesn't).

Picks file (JSON): {"s01": "r2", "s02": "old", ...} where
  r1  -> clips/sNN_4k.mp4 (round-1 native 4K, downscaled to working res)
  r2  -> clips/sNN_full.mp4 (round-2 1080p)
  old -> the shot lifted straight out of the v2 master (already timed)

Usage:
  python3 scripts/assemble_v3.py --picks picks.json --out build/v3_body.mp4
  python3 scripts/assemble_v3.py --picks picks.json --size 480x270 --out /tmp/proof.mp4
"""
from __future__ import annotations
import argparse, json, subprocess, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "video_project" / "time_airport"
CLIPS = PROJECT / "clips"
V2 = PROJECT / "edits" / "skywhale_awards_cut_v2.mp4"
FPS = 24


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--picks", required=True, help="JSON mapping scene id -> old|r1|r2")
    ap.add_argument("--size", default="1920x1080")
    ap.add_argument("--out", required=True)
    ap.add_argument("--title", default=str(CLIPS / "card_title_anim_full.mp4"))
    ap.add_argument("--credits", default=str(CLIPS / "card_credits_anim_full.mp4"))
    args = ap.parse_args()

    edl = json.loads((PROJECT / "v2_edl.json").read_text())
    recon = edl["v3_reconstruction"]
    spec = {sid: (d, w) for sid, d, w in zip(recon["scenes"], recon["durations"], recon["windows"])}
    shots = {s["id"]: s for s in edl["shots"]}
    picks = json.loads(Path(args.picks).read_text())
    w, h = args.size.split("x")
    norm = (f"scale={w}:{h}:force_original_aspect_ratio=decrease,"
            f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,fps={FPS}")
    enc = ["-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p"]

    tmp = Path(tempfile.mkdtemp())
    segs = []

    def card_input(path: str) -> list[str]:
        # Still-image fallbacks need -loop 1 to fill the frame count.
        loop = ["-loop", "1"] if Path(path).suffix.lower() in {".png", ".jpg", ".jpeg"} else []
        return loop + ["-i", path]

    # Title: 72f, fast 2-frame fade to dark at the end.
    seg = tmp / "00_title.mp4"
    run(["ffmpeg", "-y", "-v", "error"] + card_input(args.title) +
        ["-vf", f"{norm},fade=t=out:st={70/FPS:.5f}:d={2/FPS:.5f}",
         "-frames:v", "72"] + enc + [str(seg)])
    segs.append(seg)

    # Body: EDL order; first shot fades in from dark over 15f.
    for i, sid in enumerate(recon["scenes"]):
        d, win = spec[sid]
        n = shots[sid]["frames"]
        pick = picks.get(sid, "r1")
        seg = tmp / f"{i+1:02d}_{sid}_{pick}.mp4"
        fade_in = f",fade=t=in:st=0:d={15/FPS:.5f}" if i == 0 else ""
        if pick == "old":
            ss = shots[sid]["start_frame"] / FPS
            vf = norm + fade_in
            cmd = ["ffmpeg", "-y", "-v", "error", "-ss", f"{ss:.5f}", "-i", str(V2),
                   "-vf", vf, "-frames:v", str(n)] + enc + [str(seg)]
        else:
            if pick == "r1":
                src = CLIPS / f"{sid}_4k.mp4"
            else:
                # Round-2: prefer the Topaz-4K version of the take when present.
                src = CLIPS / f"{sid}_topaz_4k.mp4"
                if not src.exists():
                    src = CLIPS / f"{sid}_full.mp4"
            if not src.exists():
                raise SystemExit(f"missing source for {sid} pick={pick}: {src}")
            factor = d / win
            vf = f"trim=0:{win:.4f},setpts={factor:.5f}*PTS,{norm}{fade_in}"
            cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(src),
                   "-vf", vf, "-frames:v", str(n)] + enc + [str(seg)]
        run(cmd)
        segs.append(seg)

    # Credits: hard cut in, 97f, ends bright (no fade).
    seg = tmp / "99_credits.mp4"
    run(["ffmpeg", "-y", "-v", "error"] + card_input(args.credits) +
        ["-vf", norm, "-frames:v", "97"] + enc + [str(seg)])
    segs.append(seg)

    concat = tmp / "list.txt"
    concat.write_text("".join(f"file '{s}'\n" for s in segs))
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
         "-i", str(concat), "-c", "copy", str(out)])

    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0",
         "-show_entries", "stream=nb_read_frames", "-of",
         "default=noprint_wrappers=1:nokey=1", str(out)],
        capture_output=True, text=True).stdout.strip()
    expected = 72 + sum(shots[s]["frames"] for s in recon["scenes"]) + 97
    status = "OK" if probe == str(expected) else f"MISMATCH (expected {expected})"
    print(f"✓ {out}  frames={probe} {status}")
    return 0 if probe == str(expected) else 1


if __name__ == "__main__":
    raise SystemExit(main())
