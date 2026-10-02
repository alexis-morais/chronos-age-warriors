"""Repack Asha's supplied 1774px projectile strip without black cell seams.

The original remains untouched; only the full-height export lines at the
three internal cell boundaries are removed from the runtime copy.
"""

from pathlib import Path
import json
import shutil

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/sprites/warriors/primal/asha/attack-fx.png"
OUTPUT = SOURCE.with_name("attack-fx-runtime.png")
BACKUP = ROOT / "qa-output/primal-projectile-source/asha/attack-fx.png"
REPORT = ROOT / "qa-output/asha-projectile-seam-cleanup.json"
CELL_WIDTH = 448


def main() -> None:
    BACKUP.parent.mkdir(parents=True, exist_ok=True)
    if not BACKUP.exists():
        shutil.copy2(SOURCE, BACKUP)
    original = Image.open(SOURCE).convert("RGBA")
    if original.size != (1774, 887):
        raise ValueError(f"Unexpected Asha projectile sheet: {original.size}")
    pixels = np.array(original)
    removed = []
    for boundary in (round(original.width / 4), round(original.width / 2), round(original.width * 3 / 4)):
        for column in range(boundary - 3, boundary + 4):
            line = pixels[:, column]
            dark = np.max(line[:, :3], axis=1) < 12
            full_height_dark = int(np.count_nonzero(dark & (line[:, 3] > 0))) > original.height * .8
            opaque_dark_seam = np.median(line[:, 3]) > 32 and np.median(np.max(line[:, :3], axis=1)) < 8
            if full_height_dark or opaque_dark_seam:
                pixels[:, column, 3] = 0
                removed.append(column)
    cleaned = Image.fromarray(pixels, "RGBA")
    output = Image.new("RGBA", (CELL_WIDTH * 4, original.height))
    frames = []
    for index in range(4):
        left, right = round(index * original.width / 4), round((index + 1) * original.width / 4)
        frame = cleaned.crop((left, 0, right, original.height))
        output.alpha_composite(frame, (index * CELL_WIDTH + (CELL_WIDTH - frame.width) // 2, 0))
        frames.append({"index": index, "source_range": [left, right], "width": frame.width})
    output.save(OUTPUT, optimize=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps({"source": str(SOURCE.relative_to(ROOT)), "runtime": str(OUTPUT.relative_to(ROOT)),
                                  "removed_full_height_dark_columns": removed, "frames": frames}, indent=2) + "\n", encoding="utf-8")
    print(OUTPUT)


if __name__ == "__main__":
    main()
