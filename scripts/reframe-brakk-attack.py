"""Repack Brakk's attack without cutting the third pose's left leg/cape.

The painted third pose starts before the old 543px cell boundary. This keeps
the existing cleaned cells 0, 1 and 3, and takes a wider crop for cell 2.
Both the supplied source and the previous runtime are backed up in qa-output.
"""

from pathlib import Path
import json
import shutil

import numpy as np
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "public/assets/sprites/warriors/primal/brakk"
SOURCE = FOLDER / "attack.png"
RUNTIME = FOLDER / "attack-runtime.png"
BACKUP = ROOT / "qa-output/brakk-attack-before-wide-runtime.png"
SOURCE_BACKUP = ROOT / "qa-output/brakk-attack-original.png"
REPORT = ROOT / "qa-output/brakk-attack-wide-reframe.json"
SOURCE_CELL = 543
RUNTIME_CELL = 640
LEFT_CROP = 989


def main() -> None:
    BACKUP.parent.mkdir(parents=True, exist_ok=True)
    if not BACKUP.exists():
        shutil.copy2(RUNTIME, BACKUP)
    if not SOURCE_BACKUP.exists():
        shutil.copy2(SOURCE, SOURCE_BACKUP)
    original = Image.open(SOURCE).convert("RGBA")
    previous = Image.open(BACKUP).convert("RGBA")
    if original.size != (2172, 724) or previous.size != (2172, 724):
        raise ValueError("Brakk source or previous runtime no longer has four 543×724 cells")

    output = Image.new("RGBA", (RUNTIME_CELL * 4, original.height))
    for index in (0, 1, 3):
        cell = previous.crop((index * SOURCE_CELL, 0, (index + 1) * SOURCE_CELL, original.height))
        output.alpha_composite(cell, (index * RUNTIME_CELL + (RUNTIME_CELL - SOURCE_CELL) // 2, 0))

    wide = original.crop((LEFT_CROP, 0, LEFT_CROP + RUNTIME_CELL, original.height))
    pixels = np.array(wide)
    # The far-left upper strip belongs to the preceding raised-mace pose.
    # Brakk's lowered cape begins farther right; his left boot below y=545 stays.
    mask = Image.new("L", wide.size)
    ImageDraw.Draw(mask).rectangle((0, 0, 44, 544), fill=255)
    removed = int(np.count_nonzero((pixels[:, :, 3] > 0) & (np.asarray(mask) > 0)))
    pixels[np.asarray(mask) > 0, 3] = 0
    output.alpha_composite(Image.fromarray(pixels, "RGBA"), (2 * RUNTIME_CELL, 0))
    output.save(RUNTIME, optimize=True)
    REPORT.write_text(json.dumps({
        "source": str(SOURCE.relative_to(ROOT)),
        "runtime": str(RUNTIME.relative_to(ROOT)),
        "source_backup": str(SOURCE_BACKUP.relative_to(ROOT)),
        "previous_runtime_backup": str(BACKUP.relative_to(ROOT)),
        "four_cells": [RUNTIME_CELL, original.height],
        "third_pose_crop": [LEFT_CROP, 0, LEFT_CROP + RUNTIME_CELL, original.height],
        "preceding_pose_mask": [0, 0, 45, 545],
        "removed_visible_pixels": removed,
        "preserved": "body, left boot, complete club head, ground debris",
    }, indent=2) + "\n", encoding="utf-8")
    print(f"Brakk four-frame runtime: {output.size}; masked {removed} preceding-pose pixels")


if __name__ == "__main__":
    main()
