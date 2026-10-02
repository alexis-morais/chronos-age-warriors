"""Repack the overlapping supplied Tyrak idle poses into isolated runtime cells.

The source image is left untouched. Adjacent poses overlap across nominal
418px cell boundaries: a previous head enters the next pose's tail region,
and a following tail appears beside the preceding pose's forearm. The masks
below follow the observed empty gap between those shapes, without repainting.
"""

from pathlib import Path
from collections import deque
import json

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/sprites/warriors/primal/tyrak/idle.png"
OUTPUT = SOURCE.with_name("idle-runtime.png")
REPORT = ROOT / "qa-output/tyrak-idle-repack.json"
CELL_WIDTH, CELL_HEIGHT = 543, 724
# (x0, x1, remove previous head left of x until y, remove next tail right
# of x below y). Coordinates are on the original 1672 × 941 sheet.
REGIONS = (
    (0, 465, None, None, 385, 430),
    (380, 880, 465, 430, 800, 450),
    (795, 1330, 870, 450, 1225, 470),
    (1210, 1672, 1320, 470, None, None),
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
    # Keep the antialiased outline while removing distant stray pieces.
    outline = np.asarray(Image.fromarray(main, "L").filter(ImageFilter.MaxFilter(5))) > 0
    removed = int(np.count_nonzero(visible & ~outline))
    pixels[~outline, 3] = 0
    return pixels, removed


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    if source.size != (1672, 941):
        raise ValueError(f"Unexpected Tyrak idle sheet: {source.size}")
    output = Image.new("RGBA", (CELL_WIDTH * 4, CELL_HEIGHT))
    frames = []
    for index, (x0, x1, left, left_y, right, right_y) in enumerate(REGIONS):
        pixels = np.array(source.crop((x0, 0, x1, source.height)))
        original_visible = int(np.count_nonzero(pixels[:, :, 3] > 24))
        if left is not None:
            pixels[:left_y, :left - x0, 3] = 0
        if right is not None:
            pixels[right_y:, right - x0:, 3] = 0
        pixels, detached_removed = keep_main_body(pixels)
        frame = Image.fromarray(pixels, "RGBA")
        bbox = frame.getchannel("A").getbbox()
        if bbox is None:
            raise ValueError(f"Empty Tyrak idle frame {index}")
        frame = frame.crop(bbox)
        # A shared visible height keeps the idle cycle from pulsing in size.
        factor = min(540 / frame.width, 480 / frame.height)
        frame = frame.resize((round(frame.width * factor), round(frame.height * factor)), Image.Resampling.LANCZOS)
        px = index * CELL_WIDTH + (CELL_WIDTH - frame.width) // 2
        output.alpha_composite(frame, (px, 690 - frame.height))
        frames.append({"index": index, "source_range": [x0, x1], "source_bbox": bbox,
                       "original_visible_pixels": original_visible,
                       "retained_visible_pixels": int(np.count_nonzero(pixels[:, :, 3] > 24)),
                       "detached_pixels_removed": detached_removed,
                       "runtime_size": list(frame.size)})
    output.save(OUTPUT, optimize=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps({"source": str(SOURCE.relative_to(ROOT)), "output": str(OUTPUT.relative_to(ROOT)),
                                  "note": "Technical isolation of overlapping adjacent poses; no source repaint.",
                                  "frames": frames}, indent=2) + "\n", encoding="utf-8")
    print(OUTPUT)


if __name__ == "__main__":
    main()
