#!/usr/bin/env python3
"""Veo 3.1 image-to-video runner for the Time Airport short.

Animates each keyframe into an 8-second clip, preserving the painted look
(the keyframe is passed as Veo's first-frame `image` input).

Backends: Replicate (720p/1080p) and the Gemini API (adds 4k — Replicate's
google/veo-3.1 does not expose the Jan-2026 4K update). 4k requests route to
Gemini automatically; it needs GOOGLE_API_KEY (env or production/.env).

Usage:
    python3 scripts/run_i2v_pipeline.py --scenes s01            # one clip (test)
    python3 scripts/run_i2v_pipeline.py --all                   # all scenes
    python3 scripts/run_i2v_pipeline.py --all --model full --audio
    python3 scripts/run_i2v_pipeline.py --all --model full --resolution 4k --no-audio
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import subprocess
import tempfile
import time
from pathlib import Path
from typing import Any, Dict, Optional
from urllib import error, request

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "video_project" / "time_airport"
SCENES_PATH = PROJECT / "scenes.json"
CLIPS_DIR = PROJECT / "clips"
PREDICTIONS_PATH = PROJECT / "predictions.json"
ENV_FILE = ROOT / ".env"


def load_token() -> str:
    token = os.getenv("REPLICATE_API_TOKEN")
    if token:
        return token
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            if line.startswith("REPLICATE_API_TOKEN="):
                token = line.split("=", 1)[1].strip()
                if token:
                    return token
    raise RuntimeError("REPLICATE_API_TOKEN missing.")


def load_google_key() -> str:
    for name in ("GOOGLE_API_KEY", "GEMINI_API_KEY"):
        key = os.getenv(name)
        if key:
            return key
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            for name in ("GOOGLE_API_KEY", "GEMINI_API_KEY"):
                if line.startswith(f"{name}="):
                    key = line.split("=", 1)[1].strip()
                    if key:
                        return key
    raise RuntimeError("GOOGLE_API_KEY missing (required for 4k via the Gemini API).")


def read_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text())
    except Exception:
        return default


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n")


def get_json(url: str, token: str) -> Dict[str, Any]:
    attempt = 0
    while True:
        req = request.Request(url, headers={"Authorization": f"Bearer {token}", "User-Agent": "i2v/1.0"})
        try:
            with request.urlopen(req, timeout=120) as resp:
                return json.loads(resp.read().decode())
        except error.HTTPError as exc:
            if exc.code in {429, 500, 502, 503, 504} and attempt < 7:
                time.sleep(min((2 ** attempt) + 1, 40))
                attempt += 1
                continue
            raise


def post_json(url: str, token: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    data = json.dumps(payload).encode()
    req = request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "i2v/1.0",
        },
        method="POST",
    )
    with request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode())


def image_jpeg_b64(path: Path, max_width: int = 1456) -> str:
    """Resize the keyframe to a Veo-friendly width and return base64 JPEG.

    1456 = native keyframe width; upscaling adds no information, only payload.
    """
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        tmp_path = Path(tmp.name)
    subprocess.run(
        ["sips", "-s", "format", "jpeg", "-Z", str(max_width), str(path), "--out", str(tmp_path)],
        check=True, capture_output=True,
    )
    raw = tmp_path.read_bytes()
    tmp_path.unlink(missing_ok=True)
    return base64.b64encode(raw).decode()


def image_data_uri(path: Path, max_width: int = 1456) -> str:
    return "data:image/jpeg;base64," + image_jpeg_b64(path, max_width)


def generate(scene: Dict[str, Any], cfg: Dict[str, Any], token: str, model_key: str,
             audio: Optional[bool], resolution: Optional[str]) -> Dict[str, Any]:
    version = cfg["version_full"] if model_key == "full" else cfg["version_fast"]
    defaults = cfg["defaults"]
    img = image_data_uri(PROJECT / scene["keyframe"])
    suffix = defaults.get("style_suffix", "")
    prompt = f"{scene['prompt']} {suffix}".strip() if suffix else scene["prompt"]
    payload = {
        "version": version,
        "input": {
            "prompt": prompt,
            "image": img,
            "aspect_ratio": defaults["aspect_ratio"],
            "duration": defaults["duration"],
            "resolution": resolution or defaults["resolution"],
            "generate_audio": defaults["generate_audio"] if audio is None else audio,
            "negative_prompt": defaults["negative_prompt"],
        },
    }
    print(f"  Submitting {scene['id']} ({scene['title']}) on {model_key} model...")
    pred = post_json("https://api.replicate.com/v1/predictions", token, payload)
    pred_id = pred["id"]
    poll_url = pred.get("urls", {}).get("get", f"https://api.replicate.com/v1/predictions/{pred_id}")
    while pred.get("status") not in {"succeeded", "failed", "canceled"}:
        time.sleep(8)
        pred = get_json(poll_url, token)
        print(f"    {scene['id']}: {pred.get('status')}")
    return pred


GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta"
GEMINI_VEO_MODEL = "veo-3.1-generate-preview"


def gemini_request(url: str, key: str, payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    data = json.dumps(payload).encode() if payload is not None else None
    req = request.Request(
        url, data=data, method="POST" if payload is not None else "GET",
        headers={"x-goog-api-key": key, "Content-Type": "application/json", "User-Agent": "i2v/1.0"},
    )
    try:
        with request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode())
    except error.HTTPError as exc:
        body = exc.read().decode(errors="replace")
        raise RuntimeError(f"Gemini API {exc.code} on {url.split('?')[0]}: {body[:2000]}") from exc


def generate_gemini(scene: Dict[str, Any], cfg: Dict[str, Any], key: str,
                    audio: Optional[bool], resolution: str) -> Dict[str, Any]:
    """Veo 3.1 via the Gemini API — the only backend that exposes 4k."""
    defaults = cfg["defaults"]
    suffix = defaults.get("style_suffix", "")
    prompt = f"{scene['prompt']} {suffix}".strip() if suffix else scene["prompt"]
    payload = {
        "instances": [{
            "prompt": prompt,
            "image": {
                "inlineData": {
                    "mimeType": "image/jpeg",
                    "data": image_jpeg_b64(PROJECT / scene["keyframe"]),
                },
            },
        }],
        "parameters": {
            "aspectRatio": defaults["aspect_ratio"],
            "resolution": resolution,
            "durationSeconds": str(defaults["duration"]),
            "negativePrompt": defaults["negative_prompt"],
            "generateAudio": defaults["generate_audio"] if audio is None else audio,
        },
    }
    print(f"  Submitting {scene['id']} ({scene['title']}) on gemini/{GEMINI_VEO_MODEL} @ {resolution}...")
    op = gemini_request(f"{GEMINI_BASE}/models/{GEMINI_VEO_MODEL}:predictLongRunning", key, payload)
    op_name = op["name"]
    while not op.get("done"):
        time.sleep(10)
        op = gemini_request(f"{GEMINI_BASE}/{op_name}", key)
        print(f"    {scene['id']}: {'done' if op.get('done') else 'generating'}")
    if "error" in op:
        return {"id": op_name, "status": "failed", "error": op["error"].get("message", str(op["error"]))}
    samples = op.get("response", {}).get("generateVideoResponse", {}).get("generatedSamples", [])
    uri = samples[0].get("video", {}).get("uri") if samples else None
    if not uri:
        return {"id": op_name, "status": "failed",
                "error": f"no video uri in response: {json.dumps(op.get('response'))[:500]}"}
    return {"id": op_name, "status": "succeeded", "output": uri}


def download(url: str, dest: Path, headers: Optional[Dict[str, str]] = None) -> None:
    req = request.Request(url, headers={"User-Agent": "i2v/1.0", **(headers or {})})
    with request.urlopen(req, timeout=600) as resp:
        dest.write_bytes(resp.read())


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--scenes", nargs="*", help="Scene IDs (e.g. s01 s02)")
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--model", choices=["fast", "full"], default="fast")
    parser.add_argument("--audio", dest="audio", action="store_true", default=None)
    parser.add_argument("--no-audio", dest="audio", action="store_false")
    parser.add_argument("--resolution", choices=["720p", "1080p", "4k"])
    parser.add_argument("--backend", choices=["replicate", "gemini"],
                        help="Default: gemini for 4k (Replicate lacks it), replicate otherwise")
    args = parser.parse_args()

    backend = args.backend or ("gemini" if args.resolution == "4k" else "replicate")
    if args.resolution == "4k" and backend == "replicate":
        raise SystemExit("Replicate's google/veo-3.1 caps at 1080p; use --backend gemini for 4k.")

    token = load_google_key() if backend == "gemini" else load_token()
    cfg = read_json(SCENES_PATH, {})
    scenes = cfg["scenes"]
    if args.all:
        targets = scenes
    elif args.scenes:
        targets = [s for s in scenes if s["id"] in set(args.scenes)]
    else:
        raise SystemExit("Specify --all or --scenes s01 ...")

    CLIPS_DIR.mkdir(parents=True, exist_ok=True)
    predictions = read_json(PREDICTIONS_PATH, [])

    for scene in targets:
        if backend == "gemini":
            pred = generate_gemini(scene, cfg, token, args.audio, args.resolution or "1080p")
        else:
            pred = generate(scene, cfg, token, args.model, args.audio, args.resolution)
        row = {
            "scene_id": scene["id"],
            "title": scene["title"],
            "model": args.model,
            "backend": backend,
            "resolution": args.resolution or cfg["defaults"]["resolution"],
            "prediction_id": pred.get("id"),
            "status": pred.get("status"),
            "metrics": pred.get("metrics"),
            "error": pred.get("error"),
        }
        if pred.get("status") == "succeeded":
            out = pred.get("output")
            url = out if isinstance(out, str) else (out[0] if isinstance(out, list) and out else None)
            if url:
                if args.resolution == "4k":
                    suffix = "_4k"
                else:
                    suffix = "_full" if args.model == "full" else ""
                dest = CLIPS_DIR / f"{scene['id']}{suffix}.mp4"
                take = 1
                while dest.exists():  # never overwrite an earlier take; re-rolls get _t2, _t3...
                    take += 1
                    dest = CLIPS_DIR / f"{scene['id']}{suffix}_t{take}.mp4"
                headers = {"x-goog-api-key": token} if backend == "gemini" else None
                download(url, dest, headers)
                row["file"] = str(dest.relative_to(ROOT))
                row["output_url"] = url
                print(f"  ✓ {scene['id']} -> {dest.relative_to(ROOT)}")
        else:
            print(f"  ✗ {scene['id']} {pred.get('status')}: {pred.get('error')}")
        predictions = [p for p in predictions
                       if not (p.get("scene_id") == scene["id"] and p.get("model") == args.model
                               and p.get("resolution", "1080p") == row["resolution"])
                       or p.get("file")]  # keep rows that point at real files (takes)
        predictions.append(row)
        write_json(PREDICTIONS_PATH, predictions)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
