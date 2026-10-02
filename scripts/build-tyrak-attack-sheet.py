"""Isolate the supplied Tyrak bite poses from an overlapping source strip.

The four painted poses are preserved; only neighboring tails/heads crossing
cell boundaries are masked. The supplied attack.png remains unchanged.
"""

from pathlib import Path
from collections import deque
import json

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/sprites/warriors/primal/tyrak/attack.png"
OUTPUT = SOURCE.with_name("attack-runtime.png")
REPORT = ROOT / "qa-output/tyrak-attack-repack.json"
CELL_WIDTH, CELL_HEIGHT = 950, 724
# Source x-range; previous head on the left above a y-boundary;
# next tail on the right below a y-boundary. Values checked against the
# transparent strip on a neutral QA background.
REGIONS = (
    (0, 620, None, None, 430, 385),
    (420, 1210, 550, 340, None, None),
    (945, 1710, 1100, 335, None, None),
    (1570, 2172, None, None, None, None),
)


def keep_main_body(pixels: np.ndarray) -> tuple[np.ndarray, int]:
    visible = pixels[:, :, 3] > 24
    seen = np.zeros_like(visible)
    largest: list[tuple[int, int]] = []
    height, width = visible.shape
    for y in range(height):
        for x in range(width):
            if not visible[y, x] or seen[y, x]:
                continue
            pending = deque([(y, x)])
            seen[y, x] = True
            group = []
            while pending:
                cy, cx = pending.popleft()
                group.append((cy, cx))
                for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                    if 0 <= ny < height and 0 <= nx < width and visible[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        pending.append((ny, nx))
            if len(group) > len(largest):
                largest = group
    main = np.zeros_like(visible, dtype=np.uint8)
    for y, x in largest:
        main[y, x] = 255
    outline = np.asarray(Image.fromarray(main, "L").filter(ImageFilter.MaxFilter(5))) > 0
    removed = int(np.count_nonzero(visible & ~outline))
    pixels[~outline, 3] = 0
    return pixels, removed


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    if source.size != (2172, 724):
        raise ValueError(f"Unexpected Tyrak attack sheet: {source.size}")
    output = Image.new("RGBA", (CELL_WIDTH * 4, CELL_HEIGHT))
    frames = []
    for index, (x0, x1, left, left_y, right, right_y) in enumerate(REGIONS):
        pixels = np.array(source.crop((x0, 0, x1, source.height)))
        before = int(np.count_nonzero(pixels[:, :, 3] > 24))
        if left is not None:
            pixels[:left_y, :left - x0, 3] = 0
        if right is not None:
            pixels[right_y:, right - x0:, 3] = 0
        pixels, detached_removed = keep_main_body(pixels)
        frame = Image.fromarray(pixels, "RGBA")
        bbox = frame.getchannel("A").getbbox()
        if bbox is None:
            raise ValueError(f"Empty Tyrak attack frame {index}")
        frame = frame.crop(bbox)
        factor = min(910 / frame.width, 460 / frame.height)
        frame = frame.resize((round(frame.width * factor), round(frame.height * factor)), Image.Resampling.LANCZOS)
        px = index * CELL_WIDTH + (CELL_WIDTH - frame.width) // 2
        output.alpha_composite(frame, (px, 655 - frame.height))
        frames.append({"index": index, "source_range": [x0, x1], "source_bbox": bbox,
                       "original_visible_pixels": before,
                       "retained_visible_pixels": int(np.count_nonzero(pixels[:, :, 3] > 24)),
                       "detached_pixels_removed": detached_removed,
                       "runtime_size": list(frame.size)})
    output.save(OUTPUT, optimize=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps({"source": str(SOURCE.relative_to(ROOT)), "output": str(OUTPUT.relative_to(ROOT)),
                                  "note": "Technical isolation of supplied bite poses; no painted pixels added.",
                                  "frames": frames}, indent=2) + "\n", encoding="utf-8")
    print(OUTPUT)


if __name__ == "__main__":
    main()
