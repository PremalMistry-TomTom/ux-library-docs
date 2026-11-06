#!/usr/bin/env bash
# Copies the hairline kernel and figures from Thiago Andrade's
# tomtom-docs-illustrations repo into public/hairline/.
#   scripts/sync-hairline.sh [path-to-local-clone]
# With no path it clones the repo into a temp folder.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="${1:-}"
if [ -z "$SRC" ]; then
  SRC="$(mktemp -d)/repo"
  git clone -q --depth 1 https://github.com/thiagoandrade-tomtom/tomtom-docs-illustrations "$SRC"
fi
DEST=public/hairline
rm -rf "$DEST"; mkdir -p "$DEST"
cp "$SRC/lib/kernel.js" "$SRC/lib/HAIRLINE-LICENSE" "$DEST/"
cp -R "$SRC/figures" "$DEST/figures"
REV="$(git -C "$SRC" log -1 --format='%h %cs' 2>/dev/null || echo unknown)"
printf 'Vendored from https://github.com/thiagoandrade-tomtom/tomtom-docs-illustrations at %s.\nDo not edit here: change the figure upstream, then run scripts/sync-hairline.sh.\nHairline engine: MIT, see HAIRLINE-LICENSE.\n' "$REV" > "$DEST/SOURCE.txt"
echo "Synced $(ls "$DEST/figures" "$DEST/figures/usecases" | grep -c '\.js$') figures at $REV"
