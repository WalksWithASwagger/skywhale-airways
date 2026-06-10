#!/usr/bin/env bash
#
# export_festival_master.sh — package the finished festival cut as a clean,
# submission-ready, projector-friendly H.264 deliverable.
#
# WHAT THIS IS FOR
#   Producing the single MP4 you hand to a festival / AI Film Club portal or
#   load onto a projector laptop. It does NOT regenerate the film — it
#   packages whichever finished master you point it at (default: the 4K
#   I AM NOMAD master; pass --in for any other cut).
#
# IMPORTANT — re-encoding upward does not add quality
#   The masters are already near-lossless CRF-17/18 encodes of the native
#   edit. Re-encoding to a *higher* bitrate cannot recover detail that was
#   never there and adds one generation of loss. So the DEFAULT mode here is
#   a bit-exact stream copy: same pristine video, just repackaged with
#   +faststart and a clean filename. Use --reencode ONLY when a submission
#   portal rejects the original container or demands a fresh transcode.
#
# AUDIO NOTE
#   We do NOT swap in audio/whale-sky-god-awards-master.wav. That WAV is the raw
#   song; the cut's audio is that track positioned under the title-card/credits
#   timeline with fades, so a straight swap would desync. Rebuilding that
#   timeline would require re-cutting the edit from source.
#
# USAGE
#   production/scripts/export_festival_master.sh                 # lossless copy (recommended)
#   production/scripts/export_festival_master.sh --reencode      # fresh high-bitrate H.264
#   production/scripts/export_festival_master.sh --in <mp4> --out <mp4>
#
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT="$(cd "$HERE/.." && pwd)/video_project/time_airport"
EDITS="$PROJECT/edits"

IN="$EDITS/i_am_nomad_4k_master.mp4"
[[ -f "$IN" ]] || IN="$EDITS/skywhale_awards_cut_v2.mp4"  # pre-4K fallback
OUT=""
REENCODE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --in)       IN="$2"; shift 2 ;;
    --out)      OUT="$2"; shift 2 ;;
    --reencode) REENCODE=1; shift ;;
    -h|--help)  grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

# --- preflight -------------------------------------------------------------
command -v ffmpeg  >/dev/null 2>&1 || { echo "ERROR: ffmpeg not found on PATH."  >&2; exit 1; }
command -v ffprobe >/dev/null 2>&1 || { echo "ERROR: ffprobe not found on PATH." >&2; exit 1; }

if [[ ! -f "$IN" ]]; then
  echo "ERROR: input not found: $IN" >&2; exit 1
fi

# Guard against operating on a Git LFS pointer (these are ~133 bytes of text).
if [[ "$(head -c 40 "$IN")" == "version https://git-lfs.github.com/spec"* ]]; then
  echo "ERROR: $IN is a Git LFS pointer, not the real media." >&2
  echo "       Run 'git lfs install && git lfs pull' first, then re-run." >&2
  exit 1
fi

if [[ -z "$OUT" ]]; then
  case "$(basename "$IN")" in
    i_am_nomad*) OUT="$EDITS/I-Am-Nomad-festival-cut-submission.mp4" ;;
    *)           OUT="$EDITS/Skywhale-Airways-festival-cut-submission.mp4" ;;
  esac
fi

echo "Input : $IN"
echo "Output: $OUT"

# --- export ----------------------------------------------------------------
if [[ "$REENCODE" -eq 0 ]]; then
  # Lossless repackage: pristine streams, web/projector-friendly faststart.
  echo "Mode  : stream copy (lossless, recommended)"
  ffmpeg -hide_banner -y -i "$IN" \
    -map 0 -c copy -movflags +faststart \
    "$OUT"
else
  # Fresh high-bitrate H.264 for portals that reject the original.
  # CRF 16 = visually transparent; BT.709 color tags ensure correct projector
  # color; AAC 320k gives audio headroom on a real sound system.
  echo "Mode  : re-encode (high-bitrate H.264 + BT.709 + 320k AAC)"
  # setparams (not -color_* codec flags): on ffmpeg 8 the codec-context flags
  # only tag the matrix — primaries/transfer come out "unknown" in the VUI.
  ffmpeg -hide_banner -y -i "$IN" \
    -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p \
    -vf setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709 \
    -c:a aac -b:a 320k \
    -movflags +faststart \
    "$OUT"
fi

echo
echo "✓ Wrote: $OUT"
echo "Verify before submitting:"
echo "  ffprobe -hide_banner -v error -show_entries \\"
echo "    format=duration,size,bit_rate:stream=codec_name,width,height,sample_rate,channels \\"
echo "    -of json \"$OUT\""
