"""Repack the supplied Tyrak KO storyboard into a four-frame runtime sheet.

The original ko.png remains untouched. Its poses are not in a regular grid:
six are in the upper row and five in the lower row.
"""

from pathlib import Path
from collections import deque

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/sprites/warriors/primal/tyrak/ko.png"
OUTPUT = SOURCE.with_name("ko-runtime.png")
# Hand-inspected ground-pose bounds in the supplied KO storyboard.
PICKS = ((770, 425, 1190, 724), (1680, 425, 2172, 724))
CELL_WIDTH, CELL_HEIGHT = 543, 724


def isolate_body(frame: Image.Image) -> Image.Image:
    rgba = np.array(frame)
    visible = rgba[:, :, 3] > 24
    height, width = visible.shape
    visited = np.zeros_like(visible)
    largest: list[tuple[int, int]] = []
    for y in range(height):
        for x in range(width):
            if not visible[y, x] or visited[y, x]:
                continue
            pending = deque([(y, x)])
            visited[y, x] = True
            group = []
            while pending:
                cy, cx = pending.popleft()
                group.append((cy, cx))
                for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                    if 0 <= ny < height and 0 <= nx < width and visible[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        pending.append((ny, nx))
            if len(group) > len(largest):
                largest = group
    keep = np.zeros_like(visible)
    for y, x in largest:
        keep[y, x] = True
    rgba[~keep, 3] = 0
    return Image.fromarray(rgba, "RGBA")


def main() -> None:
    montage = Image.open(SOURCE).convert("RGBA")
    width, height = montage.size
    if width != 2172 or height != 724:
        raise ValueError(f"Unexpected Tyrak KO montage size: {montage.size}")
    result = Image.new("RGBA", (CELL_WIDTH * 4, CELL_HEIGHT))
    sources = [montage.crop((0, 0, 330, 420)), montage.crop((350, 0, 710, 420))]
    for index in range(2):
        pixels = np.array(sources[index])
        # The next pose's tail enters the lower right of these storyboard
        # regions. The T-Rex head itself is above this boundary.
        pixels[250:, 320:, 3] = 0
        sources[index] = isolate_body(Image.fromarray(pixels, "RGBA"))
    sources.extend(isolate_body(montage.crop(bounds)) for bounds in PICKS)
    for output_index, frame in enumerate(sources):
        bbox = frame.getchannel("A").getbbox()
        if bbox is None:
            raise ValueError(f"Empty Tyrak KO source region: frame {output_index}")
        frame = frame.crop(bbox)
        factor = min(CELL_WIDTH / frame.width, 470 / frame.height)
        size = (round(frame.width * factor), round(frame.height * factor))
        frame = frame.resize(size, Image.Resampling.LANCZOS)
        x = output_index * CELL_WIDTH + (CELL_WIDTH - frame.width) // 2
        result.alpha_composite(frame, (x, 690 - frame.height))
    result.save(OUTPUT, optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
