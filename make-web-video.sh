#!/usr/bin/env bash
# make-web-video.sh
#
# Compress a raw video (e.g. a phone clip) into a small, web-friendly
# looping clip for use as a hero <video> on the site.
#
# Usage:
#   ./make-web-video.sh images/week9-1.mov
#
# Produces: images/week9-1-web.mp4 (960px wide, no audio, fast-start)
#
# Requires ffmpeg: brew install ffmpeg

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <input-video> [max-width] [crf]"
  exit 1
fi

input="$1"
width="${2:-960}"
crf="${3:-28}"

dir=$(dirname "$input")
base=$(basename "$input")
name="${base%.*}"
output="$dir/${name}-web.mp4"

ffmpeg -y -i "$input" \
  -vf "scale=${width}:-2" \
  -an \
  -c:v libx264 -crf "$crf" -preset medium \
  -movflags +faststart \
  "$output"

echo "Done: $output"
ls -la "$input" "$output"
