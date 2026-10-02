"""Conservative, reproducible cleanup of confirmed cross-cell sprite fragments.

Never overwrites supplied art. Original sheets are copied to ignored qa-output;
only the explicitly reviewed masks are removed from runtime exports.
"""

from collections import deque
from pathlib import Path
import argparse
import hashlib
import json
import shutil

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SPRITES = ROOT / "public/assets/sprites/warriors/primal"
QA = ROOT / "qa-output/primal-fragment-cleanup"

# (warrior, source, exported runtime name, frame, local-cell selection, reason)
# These windows are *review bounds*, not blind erasure regions. Only small,
# disconnected alpha islands touching the left cell seam can be removed.
TARGETS = [
    ("rhex", "raptors-attack.png", "raptors-attack-runtime.png", 1, (0, 70, 420, 490), "head from prior raptor frame"),
    ("rhex", "raptors-attack.png", "raptors-attack-runtime.png", 2, (0, 75, 320, 500), "head/claws from prior raptor frame"),
    ("rhex", "raptors-attack.png", "raptors-attack-runtime.png", 3, (0, 35, 450, 545), "claws from prior raptor frame"),
    ("brakk", "hit.png", "hit-runtime.png", 1, (0, 60, 270, 430), "hammer head from frame 0"),
    ("brakk", "hit.png", "hit-runtime.png", 2, (0, 75, 295, 465), "hammer head from frame 1"),
    ("eyla", "hit.png", "hit-runtime.png", 3, (0, 38, 155, 440), "bow fragment from frame 2"),
    ("ursak", "hit.png", "hit-runtime.png", 1, (0, 45, 395, 530), "paw from frame 0"),
    ("ursak", "hit.png", "hit-runtime.png", 2, (0, 45, 375, 495), "paw from frame 1"),
    ("ursak", "hit.png", "hit-runtime.png", 2, (0, 45, 615, 680), "foot from frame 1"),
    ("saar", "hit.png", "hit-runtime.png", 1, (0, 65, 570, 640), "paw from frame 0"),
    ("rhex", "hit.png", "hit-runtime.png", 2, (0, 15, 400, 450), "raptor head sliver from frame 1"),
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def component(mask: np.ndarray, seed: tuple[int, int]) -> list[tuple[int, int]]:
    """Return one alpha island (8-neighbor) from a seam pixel."""
    height, width = mask.shape
    seen = np.zeros(mask.shape, dtype=bool)
    pending = deque([seed])
    seen[seed] = True
    pixels = []
    while pending:
        y, x = pending.popleft()
        pixels.append((y, x))
        for ny in range(max(0, y - 1), min(height, y + 2)):
            for nx in range(max(0, x - 1), min(width, x + 2)):
                if mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    pending.append((ny, nx))
    return pixels


def candidates(image: Image.Image, frame: int, bounds: tuple[int, int, int, int]) -> list[dict]:
    width, height = image.size
    assert width % 4 == 0, image.size
    cell_width = width // 4
    left, right, top, bottom = bounds
    alpha = np.asarray(image.crop((frame * cell_width, 0, (frame + 1) * cell_width, height)))[:, :, 3]
    # A low threshold joins some artwork to legitimate dust through a few
    # nearly transparent pixels. Identify only the opaque, isolated core.
    mask = alpha >= 24
    found = set()
    result = []
    for y in range(top, min(bottom, height)):
        for x in range(left, min(left + 3, right)):
            if not mask[y, x] or (y, x) in found:
                continue
            pixels = component(mask, (y, x))
            found.update(pixels)
            ys, xs = zip(*pixels)
            bbox = [min(xs), min(ys), max(xs) + 1, max(ys) + 1]
            result.append({"bbox": bbox, "pixels": len(pixels), "coordinates": pixels})
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="export only reviewed small edge islands")
    args = parser.parse_args()
    QA.mkdir(parents=True, exist_ok=True)
    report = {"mode": "apply" if args.apply else "inspect", "sources": {}, "masks": []}
    images: dict[tuple[str, str], Image.Image] = {}
    for warrior, source, runtime, frame, bounds, reason in TARGETS:
        key = (warrior, source)
        source_path = SPRITES / warrior / source
        if key not in images:
            images[key] = Image.open(source_path).convert("RGBA")
            backup = QA / f"{warrior}-{source}"
            if not backup.exists():
                shutil.copy2(source_path, backup)
            report["sources"][str(source_path.relative_to(ROOT))] = {
                "sha256": sha256(source_path), "backup": str(backup.relative_to(ROOT)),
                "runtime": str((SPRITES / warrior / runtime).relative_to(ROOT)),
            }
        original = Image.open(source_path).convert("RGBA")
        islands = candidates(original, frame, bounds)
        entries = [{"bbox": item["bbox"], "pixels": item["pixels"]} for item in islands]
        print(f"{warrior}/{source} frame {frame}: {entries}")
        report["masks"].append({"warrior": warrior, "source": source, "frame": frame,
                                "reason": reason, "review_bounds": bounds, "candidates": entries})
    (QA / "inspection.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    if not args.apply:
        return
    cleaned: dict[tuple[str, str], np.ndarray] = {
        key: np.array(image, copy=True) for key, image in images.items()
    }
    for target, entry in zip(TARGETS, report["masks"]):
        warrior, source, _, frame, bounds, _ = target
        islands = candidates(Image.open(SPRITES / warrior / source).convert("RGBA"), frame, bounds)
        if len(islands) != 1:
            raise ValueError(f"Expected one reviewed island: {warrior}/{source} frame {frame}: {entry['candidates']}")
        island = islands[0]
        if island["pixels"] > 8000 or island["bbox"][2] > 80:
            raise ValueError(f"Refusing to erase possible body/FX: {warrior}/{source} {island['bbox']}")
        pixels = cleaned[(warrior, source)]
        offset = frame * (pixels.shape[1] // 4)
        erased = 0
        for y, x in island["coordinates"]:
            for ny in range(max(0, y - 1), min(pixels.shape[0], y + 2)):
                for nx in range(max(0, x - 1), min(pixels.shape[1] // 4, x + 2)):
                    real_x = offset + nx
                    # Clear the 1px antialias fringe, but do not cross into
                    # another opaque element (tail, dust, impact fragment).
                    if (ny == y and nx == x) or pixels[ny, real_x, 3] < 24:
                        if pixels[ny, real_x, 3] > 0:
                            erased += 1
                        pixels[ny, real_x] = (0, 0, 0, 0)
        entry["erased_alpha_pixels"] = erased
    for (warrior, source), pixels in cleaned.items():
        runtime = next(row[2] for row in TARGETS if row[:2] == (warrior, source))
        destination = SPRITES / warrior / runtime
        Image.fromarray(pixels, "RGBA").save(destination, optimize=True)
        source_meta = report["sources"][str((SPRITES / warrior / source).relative_to(ROOT))]
        source_meta["runtime_sha256"] = sha256(destination)
        source_meta["runtime_size"] = list(Image.open(destination).size)
        if sha256(SPRITES / warrior / source) != source_meta["sha256"]:
            raise RuntimeError(f"Source unexpectedly changed: {warrior}/{source}")
    (QA / "applied.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Exported {len(cleaned)} runtime sheets; erased {sum(item['erased_alpha_pixels'] for item in report['masks'])} alpha pixels")


if __name__ == "__main__":
    main()
