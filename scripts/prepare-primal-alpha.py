"""Conservatively restore alpha to the opaque Primal sheets supplied for QA.

Only RGB files are touched. Original bytes are copied to ignored qa-output first.
This is a technical background removal, not a repaint or generated pose.
"""

from pathlib import Path
import json
import shutil

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/sprites/warriors/primal"
BACKUP = ROOT / "qa-output/primal-opaque-originals"
REPORT = ROOT / "qa-output/primal-alpha-preparation.json"


def restore_alpha(image: Image.Image) -> tuple[Image.Image, str, int]:
    pixels = np.asarray(image.convert("RGB"), dtype=np.float32)
    corners = np.stack([pixels[0, 0], pixels[0, -1], pixels[-1, 0], pixels[-1, -1]])
    background = "white" if float(corners.mean()) > 200 else "black"
    if background == "black":
        distance = pixels.max(axis=2)
        alpha = np.clip((distance - 3) / 19, 0, 1)
        recovered = np.clip(pixels / np.maximum(alpha[:, :, None], 1 / 255), 0, 255)
    else:
        distance = 255 - pixels.min(axis=2)
        alpha = np.clip((distance - 3) / 19, 0, 1)
        recovered = np.clip((pixels - (1 - alpha[:, :, None]) * 255) / np.maximum(alpha[:, :, None], 1 / 255), 0, 255)
    rgba = np.dstack([recovered, alpha * 255]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA"), background, int(np.count_nonzero(alpha == 0))


def main() -> None:
    prepared = []
    for warrior_id in ("morga", "saar", "tyrak"):
        for path in sorted((SOURCE / warrior_id).glob("*.png")):
            image = Image.open(path)
            original = BACKUP / warrior_id / path.name
            if image.mode != "RGB":
                if original.exists():
                    prepared.append({"path": str(path.relative_to(ROOT)), "backup": str(original.relative_to(ROOT)),
                                     "status": "already-converted"})
                continue
            original.parent.mkdir(parents=True, exist_ok=True)
            if not original.exists():
                shutil.copy2(path, original)
            converted, background, transparent = restore_alpha(image)
            converted.save(path, optimize=True)
            prepared.append({"path": str(path.relative_to(ROOT)), "backup": str(original.relative_to(ROOT)),
                             "background": background, "transparent_pixels": transparent})
            print(f"{path}: {background} -> RGBA ({transparent} transparent pixels)")
    # Eyla's attack sheet has one-pixel white vertical export seams at cell
    # boundaries. Remove only columns that are almost entirely opaque white.
    eyla = SOURCE / "eyla/attack.png"
    original = BACKUP / "eyla/attack.png"
    original.parent.mkdir(parents=True, exist_ok=True)
    if not original.exists():
        shutil.copy2(eyla, original)
    pixels = np.array(Image.open(eyla).convert("RGBA"))
    seams = []
    for column in (0, 542, 543, 1085, 1086, 1628, 1629, 2171):
        band = pixels[:, column]
        white = np.all(band[:, :3] > 220, axis=1) & (band[:, 3] > 100)
        if int(white.sum()) > pixels.shape[0] * 0.8:
            pixels[white, column, 3] = 0
            seams.append(column)
    if seams:
        Image.fromarray(pixels, "RGBA").save(eyla, optimize=True)
    prepared.append({"path": str(eyla.relative_to(ROOT)), "backup": str(original.relative_to(ROOT)),
                     "removed_seam_columns": seams, "status": "clean" if seams else "already-clean"})
    print(f"{eyla}: removed white seams at {seams}")
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps({"prepared": prepared}, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
