#!/usr/bin/env bash
# Optimize a chart screenshot for a Trading852 article image.
#
# Pipeline:
#   1. Resize to 1280px wide (preserves aspect ratio) with sips
#   2. Strip EXIF metadata
#   3. Re-encode as progressive JPEG q=82 with cjpeg (libjpeg-turbo)
#   4. Output: src/analyses/images/{SLUG}.jpg
#
# Usage:
#   ./scripts/optimize-article-image.sh INPUT_FILE SLUG
#
# Examples:
#   ./scripts/optimize-article-image.sh ~/Downloads/spy-chart.png spy-ipo-fork-chart
#   ./scripts/optimize-article-image.sh ~/Desktop/screenshot.png hsi-trendline-update
#
# Target: 1280 x ~auto px, progressive JPEG q=82, ~60-120 KB

set -euo pipefail

INPUT="${1:?Usage: $0 INPUT_FILE SLUG}"
SLUG="${2:?Usage: $0 INPUT_FILE SLUG}"

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="$SITE_DIR/src/analyses/images/$SLUG.jpg"
WORK_DIR="/private/tmp/trading852-img-$$"
mkdir -p "$WORK_DIR"
trap 'rm -rf "$WORK_DIR"' EXIT

if [[ ! -f "$INPUT" ]]; then
    echo "ERROR: file not found: $INPUT" >&2
    exit 1
fi

SRC_W=$(sips -g pixelWidth  "$INPUT" 2>/dev/null | awk '/pixelWidth/{print $2}')
SRC_H=$(sips -g pixelHeight "$INPUT" 2>/dev/null | awk '/pixelHeight/{print $2}')
SRC_SIZE=$(stat -f%z "$INPUT")
echo "Source: $(basename "$INPUT")  ${SRC_W}x${SRC_H}  $((SRC_SIZE / 1024)) KB"

TARGET_W=1280

if [[ "$SRC_W" -gt "$TARGET_W" ]]; then
    echo "→ Resizing to ${TARGET_W}px wide..."
    sips --resampleWidth "$TARGET_W" -s format jpeg -s formatOptions 100 "$INPUT" \
         --out "$WORK_DIR/resized.jpg" >/dev/null
else
    echo "→ Source already ≤ ${TARGET_W}px wide — converting only"
    sips -s format jpeg -s formatOptions 100 "$INPUT" \
         --out "$WORK_DIR/resized.jpg" >/dev/null
fi

echo "→ Re-encoding as progressive JPEG q=82..."
djpeg "$WORK_DIR/resized.jpg" 2>/dev/null \
    | cjpeg -quality 82 -progressive -optimize -outfile "$OUTPUT" 2>/dev/null

OUT_W=$(sips -g pixelWidth  "$OUTPUT" 2>/dev/null | awk '/pixelWidth/{print $2}')
OUT_H=$(sips -g pixelHeight "$OUTPUT" 2>/dev/null | awk '/pixelHeight/{print $2}')
OUT_SIZE=$(stat -f%z "$OUTPUT")
SAVED=$((SRC_SIZE - OUT_SIZE))

echo ""
echo "Output: $OUTPUT"
echo "  Dimensions : ${OUT_W}x${OUT_H}"
echo "  Size       : $((OUT_SIZE / 1024)) KB"
if [[ $SAVED -gt 0 ]]; then
    echo "  Saved      : $((SAVED / 1024)) KB ($((SAVED * 100 / SRC_SIZE))% smaller)"
fi
echo ""
echo "Add to article:"
echo "  <img src=\"images/$SLUG.jpg\" alt=\"...\" width=\"$OUT_W\" height=\"$OUT_H\" loading=\"lazy\" decoding=\"async\" />"
