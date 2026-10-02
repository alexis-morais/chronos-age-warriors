"""Remove verified neighbouring-pose fragments from Tyrak's run sheet.

The supplied run.png is kept intact. The small reviewed rectangles below
cover only isolated neighbouring-pose fragments at the cell edges; they do
not touch the torso, jaw or intentional dust under the feet.
"""

from pathlib import Path
import json

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/sprites/warriors/primal/tyrak/run.png"
OUTPUT = SOURCE.with_name("run-runtime.png")
REPORT = ROOT / "qa-output/tyrak-run-cleanup.json"
CELL_WIDTH = 418
RECTANGLES = (
    ((400, 380, 418, 450), (390, 530, 418, 670)),
    ((406, 460, 418, 510), (384, 530, 418, 670)),
    ((0, 350, 20, 430), (408, 500, 418, 540), (348, 538, 418, 670)),
    None,
)


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    if source.size != (CELL_WIDTH * 4, 941):
        raise ValueError(f"Unexpected Tyrak run size: {source.size}")
    pixels = np.array(source)
    removed = []
    for frame, rectangles in enumerate(RECTANGLES):
        for rectangle in rectangles or ():
            x0, y0, x1, y1 = rectangle
            region = pixels[y0:y1, frame * CELL_WIDTH + x0:frame * CELL_WIDTH + x1]
            visible = int(np.count_nonzero(region[:, :, 3] > 24))
            region[:, :, 3] = 0
            removed.append({"frame": frame, "rectangle": rectangle, "pixels": visible})
    Image.fromarray(pixels, "RGBA").save(OUTPUT, optimize=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps({"source": str(SOURCE.relative_to(ROOT)),
                                  "output": str(OUTPUT.relative_to(ROOT)),
                                  "removed": removed}, indent=2) + "\n", encoding="utf-8")
    print(REPORT)


if __name__ == "__main__":
    main()
