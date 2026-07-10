#!/bin/bash
# generate-carousel.command — Trading852 IG carousel → JPEG slides
#
# Renders every <section> of a carousel HTML (1080×1350) to a PNG via html2ig.js
# (Puppeteer / Chrome for Testing), then converts each to a posting-ready JPEG.
#
# CONVENTION: one folder per project under `Instagram/IG slides/{slug}/`, holding
# the HTML + the generated JPEGs (+ the source PNGs in `_png/`).
#
# Usage:
#   ./generate-carousel.command <path-to-html> [project-slug] [--2x]
#
#   - <path-to-html> : the filled carousel HTML (6 <section> slides).
#   - [project-slug] : optional folder name. If omitted, derived from the HTML
#                      filename (lowercased, spaces→-, non-alnum stripped).
#   - --2x           : keep the retina 2160×2700 export. DEFAULT is 1080×1350.
#
# If the HTML is not already inside its project folder it is COPIED there as
# {slug}.html, so the folder is self-contained.
#
# Double-clickable from Finder: it will prompt for the HTML path if none given.

set -euo pipefail

IG_ROOT="/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/TRADING/Trading852-v2/Instagram"
SLIDES_ROOT="$IG_ROOT/IG slides"
HTML2IG="/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/Knowledge-base/IG creator/html2ig.js"
JPEG_QUALITY=92
OUT_W=1080          # default Instagram portrait
OUT_H=1350

# ── parse args (flag can appear anywhere) ────────────────────────────────────
RETINA=0
POS=()
for a in "$@"; do
  case "$a" in
    --2x|--retina) RETINA=1 ;;
    *) POS+=("$a") ;;
  esac
done
SRC_HTML="${POS[0]:-}"
SLUG_ARG="${POS[1]:-}"

if [[ -z "$SRC_HTML" ]]; then
  read -r -p "Path to the carousel HTML: " SRC_HTML
fi
SRC_HTML="${SRC_HTML/#\~/$HOME}"
if [[ ! -f "$SRC_HTML" ]]; then
  echo "❌ HTML not found: $SRC_HTML" >&2; exit 1
fi

# derive slug
base="$(basename "$SRC_HTML")"; base="${base%.*}"
slug="${SLUG_ARG:-$base}"
slug="$(echo "$slug" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')"
slug="$(echo "$slug" | sed -E 's/-+/-/g; s/^-//; s/-$//')"
[[ -z "$slug" ]] && slug="carousel"

PROJ="$SLIDES_ROOT/$slug"
PNG_DIR="$PROJ/_png"
mkdir -p "$PROJ" "$PNG_DIR"

# self-contain: copy the HTML into the project folder as {slug}.html
DEST_HTML="$PROJ/$slug.html"
if [[ "$(cd "$(dirname "$SRC_HTML")" && pwd)/$(basename "$SRC_HTML")" != "$DEST_HTML" ]]; then
  cp "$SRC_HTML" "$DEST_HTML"
fi

if [[ $RETINA -eq 1 ]]; then OUT_W=2160; OUT_H=2700; fi
echo "▶ project : $slug"
echo "▶ folder  : $PROJ"
echo "▶ size    : ${OUT_W}×${OUT_H}$([[ $RETINA -eq 1 ]] && echo ' (retina 2×)' || echo ' (default)')"

# ── 1. HTML → PNG per slide (rendered at 1080×1350 ×2 for crispness) ─────────
node "$HTML2IG" "$DEST_HTML" --out="$PNG_DIR"
RAW_DIR="$PNG_DIR/$slug"
[[ -d "$RAW_DIR" ]] || RAW_DIR="$(find "$PNG_DIR" -maxdepth 1 -mindepth 1 -type d | head -1)"

shopt -s nullglob
pngs=("$RAW_DIR"/slide_*.png)
if [[ ${#pngs[@]} -eq 0 ]]; then
  echo "❌ no PNGs produced — check html2ig output above" >&2; exit 1
fi

# ── 2. PNG → JPEG, downsampled to the target size (default 1080×1350) ────────
n=0
for png in "${pngs[@]}"; do
  num="$(basename "$png" | sed -E 's/[^0-9]//g')"
  out="$PROJ/${slug}-${num}.jpg"
  # sips -z <height> <width>  (source is 2160×2700 = exact 4:5, no distortion)
  sips -s format jpeg -s formatOptions "$JPEG_QUALITY" -z "$OUT_H" "$OUT_W" \
       "$png" --out "$out" >/dev/null
  echo "  ✓ ${slug}-${num}.jpg  (${OUT_W}×${OUT_H})"
  n=$((n+1))
done

# tidy: keep the raw PNGs under _png/ for re-export, flatten the nested dir
mv "$RAW_DIR"/slide_*.png "$PNG_DIR"/ 2>/dev/null || true
rmdir "$RAW_DIR" 2>/dev/null || true

echo "✅ $n slide(s) → $PROJ/${slug}-NN.jpg"
echo "   (source PNGs kept in $PNG_DIR/ — rerun with --2x for a 2160×2700 export)"
