"""Remove only the two full-height alpha seams from the supplied solo sheet.

The supplied command-solo.png remains the registry source. This script never
reads or rebuilds from the older command.png with baked-in raptors.
"""

from pathlib import Path
import json
import shutil

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/sprites/warriors/primal/rhex/command-solo.png"
BACKUP = ROOT / "qa-output/rhex-command-solo-original.png"
REPORT = ROOT / "qa-output/rhex-command-solo-seam-cleanup.json"
SEAM_COLUMNS = (1085, 1086)


def main() -> None:
    BACKUP.parent.mkdir(parents=True, exist_ok=True)
    if not BACKUP.exists():
        shutil.copy2(SOURCE, BACKUP)
    pixels = np.array(Image.open(BACKUP).convert("RGBA"))
    if pixels.shape != (724, 2172, 4):
        raise ValueError(f"Unexpected solo sheet dimensions: {pixels.shape}")
    removed = int(np.count_nonzero(pixels[:, SEAM_COLUMNS, 3]))
    pixels[:, SEAM_COLUMNS, 3] = 0
    Image.fromarray(pixels, "RGBA").save(SOURCE, optimize=True)
    REPORT.write_text(json.dumps({
        "source": str(SOURCE.relative_to(ROOT)),
        "original_backup": str(BACKUP.relative_to(ROOT)),
        "method": "erase two full-height cell-boundary seams only",
        "columns": SEAM_COLUMNS,
        "removed_alpha_pixels": removed,
        "preserved": "all four painted Rhex poses, spear, cape, and particles",
    }, indent=2) + "\n", encoding="utf-8")
    print(f"Rhex command-solo: removed {removed} seam pixels")


if __name__ == "__main__":
    main()
