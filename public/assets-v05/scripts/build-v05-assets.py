#!/usr/bin/env python3
"""
Chronos Age Warriors V0.5 Production — asset build notes.

This package already includes the normalized production PNGs.
The source files are retained under assets-v05/source for audit/rebuild.
Critical runtime rule: never tight-crop player frames again; all combat frames
must remain on the supplied 512x512 canvases and share their existing groundY.
The supplied hurt frames have a flat opaque red backdrop. The cleanup below
removes only that edge-connected backdrop while preserving the 512x512 canvas,
sprite coordinates, scale and groundY. It never crops or resizes a frame.
"""
from collections import deque
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
output = root / "derived" / "player"

def clean_hurt(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGBA")
    if image.size != (512, 512):
        raise ValueError(f"Unexpected player canvas: {source} -> {image.size}")
    pixels = image.load()
    background = pixels[0, 0][:3]
    queue = deque([(0, 0)])
    visited = bytearray(512 * 512)
    while queue:
        x, y = queue.popleft()
        index = y * 512 + x
        if visited[index]:
            continue
        visited[index] = 1
        color = pixels[x, y][:3]
        if max(abs(color[channel] - background[channel]) for channel in range(3)) > 24:
            continue
        pixels[x, y] = (*color, 0)
        if x: queue.append((x - 1, y))
        if x < 511: queue.append((x + 1, y))
        if y: queue.append((x, y - 1))
        if y < 511: queue.append((x, y + 1))
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, optimize=True)

count = 0
for source in sorted((root / "player").glob("*/*/hurt.png")):
    destination = output / source.relative_to(root / "player")
    clean_hurt(source, destination)
    count += 1
print(f"Assets V0.5 prêts : {count} hurt frames nettoyées, canvas 512x512 préservé.")
