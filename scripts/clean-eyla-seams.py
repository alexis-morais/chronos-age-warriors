"""Remove inspected full-height export seams from Eyla's runtime sheets.

Only the narrow columns at nominal four-cell boundaries are eligible. The
original supplied images are copied to ignored qa-output before export.
"""

from pathlib import Path
import json
import shutil

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/sprites/warriors/primal/eyla"
BACKUP = ROOT / "qa-output/eyla-source-before-runtime-cleanup"
REPORT = ROOT / "qa-output/eyla-seam-cleanup.json"
WHITELIST = {
    "attack.png": (541, 544, 1084, 1087, 1627, 1630),
    "aim.png": (543, 1085, 1086, 1628, 1629, 2171),
}


def main() -> None:
    result = {}
    for filename, columns in WHITELIST.items():
        path = SOURCE / filename
        backup = BACKUP / filename
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            shutil.copy2(path, backup)
        image = np.array(Image.open(backup).convert("RGBA"))
        if image.shape != (724, 2172, 4):
            raise ValueError(f"Unexpected Eyla sheet size: {filename} {image.shape}")
        removed = []
        for x in columns:
            occupied = int(np.count_nonzero(image[:, x, 3] > 20))
            if occupied < 300:
                raise ValueError(f"Expected inspected seam not found: {filename} x={x} ({occupied} rows)")
            image[:, x, 3] = 0
            removed.append({"x": x, "rows_with_alpha_above_20": occupied})
        # Low-alpha echoes of the same export seam can sit one or two columns
        # beside the solid line. They are near-invisible in normal compositing,
        # but remove them too so the runtime sheet has no vertical texture.
        for boundary in (543, 1086, 1629, 2171):
            for x in range(max(0, boundary - 8), min(image.shape[1], boundary + 9)):
                if any(item["x"] == x for item in removed):
                    continue
                column = image[:, x, 3]
                if int(np.count_nonzero(column > 1)) > 250 and int(column.max()) < 20:
                    image[:, x, 3] = 0
                    removed.append({"x": x, "soft_alpha_echo": True})
        output = path.with_name(path.stem + "-runtime.png")
        Image.fromarray(image, "RGBA").save(output, optimize=True)
        result[filename] = {"backup": str(backup.relative_to(ROOT)),
                            "runtime": str(output.relative_to(ROOT)), "removed_columns": removed}
        print(output)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(REPORT)


if __name__ == "__main__":
    main()
