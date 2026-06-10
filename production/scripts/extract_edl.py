#!/usr/bin/env python3
"""Recover the awards-cut edit decision list from the v2 master itself.

The shipped edit of skywhale_awards_cut_v2.mp4 was never committed as a
recipe (the README documents the *web* cut). This measures the real thing:
shot boundaries, hard-cut vs dissolve at each boundary, the title
dip-to-black, and per-shot motion energy (slow-motion feel), and writes
video_project/time_airport/v2_edl.json so the edit can't be lost again.

Usage:
  python3 scripts/extract_edl.py                 # analyze v2, write v2_edl.json
  python3 scripts/extract_edl.py --compare PATH  # also compare per-shot motion vs another master
"""
from __future__ import annotations
import argparse, json, re, statistics, subprocess, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "video_project" / "time_airport"
V2 = PROJECT / "edits" / "skywhale_awards_cut_v2.mp4"
OUT = PROJECT / "v2_edl.json"
FPS = 24

# Storyboard order + documented (web-cut) durations as priors for boundary search.
ORDER = ["s01", "s02", "s03", "s04", "s05", "s06", "s08", "s09", "s07", "s10"]
PRIOR_DURS = [5.84, 4.5, 5.72, 4.46, 3.18, 3.14, 3.51, 3.51, 5.76, 13.38]
TITLE_END_PRIOR = 3.0   # scene-detect found the title->body cut at 3.000s


def metrics(path: Path) -> tuple[dict[int, float], dict[int, float]]:
    """Per-frame scene_score and YAVG via one ffmpeg pass at 480x270."""
    with tempfile.TemporaryDirectory() as td:
        sc, lu = Path(td) / "sc.txt", Path(td) / "lu.txt"
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-vf",
             f"scale=480:270,select='gte(scene,0)',metadata=print:file={sc},"
             f"signalstats,metadata=print:file={lu}",
             "-an", "-f", "null", "-"],
            check=True, capture_output=True)
        scores, luma = {}, {}
        for txt, key, store in ((sc.read_text(), "scene_score", scores),
                                (lu.read_text(), "YAVG", luma)):
            frame = None
            for line in txt.splitlines():
                m = re.match(r"frame:(\d+)", line)
                if m:
                    frame = int(m.group(1))
                elif key in line and frame is not None:
                    store[frame] = float(line.rsplit("=", 1)[1])
    return scores, luma


def classify_boundary(scores: dict[int, float], center: int, halo: int = 14) -> dict:
    """Around an expected boundary, find the spike and measure its width."""
    window = {f: scores.get(f, 0.0) for f in range(center - halo, center + halo + 1)}
    peak = max(window, key=window.get)
    # Background level: median score of the surrounding shot interiors.
    bg = statistics.median(v for f, v in scores.items()
                           if abs(f - peak) > halo and v is not None)
    thresh = max(bg * 3, window[peak] * 0.35)
    elevated = [f for f, v in window.items() if v >= thresh]
    run = [peak]
    for f in range(peak - 1, min(window) - 1, -1):
        if f in elevated: run.insert(0, f)
        else: break
    for f in range(peak + 1, max(window) + 1):
        if f in elevated: run.append(f)
        else: break
    kind = "cut" if len(run) <= 2 else "dissolve"
    return {"frame": peak, "time": round(peak / FPS, 5), "kind": kind,
            "width_frames": len(run), "peak_score": round(window[peak], 4)}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--compare", help="Another master to compare per-shot motion against")
    args = ap.parse_args()

    print(f"Analyzing {V2.name}...")
    scores, luma = metrics(V2)
    n_frames = max(luma) + 1

    # Title -> body boundary + dip shape from luminance.
    t_end = int(TITLE_END_PRIOR * FPS)
    dip = {f: luma[f] for f in range(t_end - 12, t_end + 16) if f in luma}
    dip_min_f = min(dip, key=dip.get)
    title_level = statistics.median(luma[f] for f in range(10, 50))
    body_level = statistics.median(luma[f] for f in range(t_end + 20, t_end + 60))
    fade_out = [f for f in range(dip_min_f, t_end - 13, -1)
                if luma.get(f, 255) < title_level * 0.85]
    fade_in = [f for f in range(dip_min_f, t_end + 15)
               if luma.get(f, 255) < body_level * 0.85]
    title = {"end_frame": t_end, "dip_min_frame": dip_min_f,
             "dip_min_yavg": round(dip[dip_min_f], 1),
             "title_yavg": round(title_level, 1), "body_yavg": round(body_level, 1),
             "fade_out_frames": len(fade_out), "fade_in_frames": len(fade_in)}

    # Internal shot boundaries from priors.
    boundaries, cursor = [], TITLE_END_PRIOR
    for dur in PRIOR_DURS[:-1]:
        cursor += dur
        boundaries.append(classify_boundary(scores, int(round(cursor * FPS))))

    # Credits entrance: luminance/served crossfade measured around body end.
    body_end_prior = int((TITLE_END_PRIOR + sum(PRIOR_DURS)) * FPS)
    credits = classify_boundary(scores, body_end_prior, halo=20)

    # Per-shot motion energy (mean scene_score, boundary halo excluded).
    def shot_motion(sc: dict[int, float], starts: list[int], ends: list[int]) -> list[float]:
        out = []
        for a, b in zip(starts, ends):
            vals = [sc[f] for f in range(a + 6, b - 6) if f in sc]
            out.append(round(statistics.mean(vals), 5) if vals else 0.0)
        return out

    starts = [t_end] + [b["frame"] for b in boundaries]
    ends = [b["frame"] for b in boundaries] + [credits["frame"]]
    v2_motion = shot_motion(scores, starts, ends)

    edl = {
        "source": V2.name, "fps": FPS, "total_frames": n_frames,
        "title": title,
        "shots": [{"id": sid, "start_frame": a, "end_frame": b,
                   "frames": b - a, "seconds": round((b - a) / FPS, 4),
                   "motion_energy": m}
                  for sid, a, b, m in zip(ORDER, starts, ends, v2_motion)],
        "boundaries": [{"after": ORDER[i], **b} for i, b in enumerate(boundaries)],
        "credits": credits,
    }

    if args.compare:
        cmp_path = Path(args.compare)
        print(f"Comparing motion vs {cmp_path.name}...")
        c_scores, _ = metrics(cmp_path)
        c_motion = shot_motion(c_scores, starts, ends)
        # The compare master is assumed to use the README web-cut recipe; from
        # its known windows/durations and the motion ratio, solve the source
        # window that reproduces v2's apparent slow-motion per shot:
        #   src_rate = window / duration;  rate_v2 = rate_cmp / motion_ratio
        #   window_v2 = rate_v2 * duration_v2
        R1_DURS = dict(zip(ORDER, PRIOR_DURS))
        R1_WINS = dict(zip(ORDER, [3.5, 3.2, 4.0, 3.2, 2.3, 2.3, 2.5, 2.5, 4.0, 6.0]))
        for shot, cm in zip(edl["shots"], c_motion):
            shot["compare_motion_energy"] = cm
            ratio = round(cm / shot["motion_energy"], 3) if shot["motion_energy"] else None
            shot["speed_ratio_vs_v2"] = ratio
            if ratio:
                rate = (R1_WINS[shot["id"]] / R1_DURS[shot["id"]]) / ratio
                shot["derived_window_seconds"] = round(min(rate * shot["seconds"], 7.9), 3)

    OUT.write_text(json.dumps(edl, indent=2) + "\n")
    print(f"✓ {OUT.relative_to(ROOT)}")
    for s in edl["shots"]:
        extra = f"  speed_ratio={s.get('speed_ratio_vs_v2')}" if args.compare else ""
        print(f"  {s['id']}: {s['frames']}f ({s['seconds']}s) motion={s['motion_energy']}{extra}")
    for b in edl["boundaries"]:
        print(f"  after {b['after']}: {b['kind']} ({b['width_frames']}f @ {b['time']}s)")
    print(f"  title dip: min YAVG {title['dip_min_yavg']} (title {title['title_yavg']}, body {title['body_yavg']}), "
          f"fade_out {title['fade_out_frames']}f, fade_in {title['fade_in_frames']}f")
    print(f"  credits: {credits['kind']} ({credits['width_frames']}f @ {credits['time']}s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
