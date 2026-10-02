"""Remove visually verified cross-cell components from Naya's runtime sheets.

The supplied originals are preserved in ignored qa-output/naya-sprite-originals.
Every run starts from those originals and validates each exact component bbox.
Intentional dust, rocks, hair, body parts and attack arcs are not blanket-filtered.
"""

from collections import deque
from pathlib import Path
import json
import shutil

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "public/assets/sprites/warriors/primal/naya"
BACKUP = ROOT / "qa-output/naya-sprite-originals"
CELL = (543, 724)
ALPHA_THRESHOLD = 24

# (zero-based frame, exact 8-connected alpha-component bbox). These were
# inspected in individual cell contact sheets before removal.
ARTIFACTS = {
    "idle.png": [
        (1, (0, 481, 16, 581)), (1, (0, 639, 25, 672)),
        (2, (0, 469, 31, 589)), (2, (0, 645, 19, 671)),
        (3, (0, 483, 18, 582)), (3, (0, 645, 16, 671)),
    ],
    "run.png": [
        (0, (540, 568, 543, 578)),
        (1, (452, 523, 543, 640)), (1, (0, 456, 27, 544)),
        (1, (514, 506, 541, 533)),
        (3, (0, 488, 9, 556)),
    ],
    "attack.png": [
        (0, (489, 551, 543, 646)), (0, (538, 333, 543, 347)),
        (0, (537, 466, 543, 470)), (1, (0, 628, 3, 643)),
        (2, (0, 286, 59, 451)), (2, (1, 518, 114, 582)),
        (3, (0, 476, 65, 607)), (3, (0, 185, 23, 284)),
        (3, (0, 330, 56, 379)), (3, (0, 201, 38, 311)),
        (3, (0, 437, 34, 476)),
    ],
    "attack-fx.png": [
        (0, (403, 500, 543, 616)), (0, (478, 115, 543, 130)),
        (1, (411, 492, 543, 627)), (1, (499, 450, 543, 498)),
        (1, (0, 446, 44, 491)), (1, (505, 67, 543, 81)),
        (3, (0, 417, 26, 507)), (3, (0, 257, 14, 273)),
        (3, (0, 361, 7, 378)),
    ],
    "dodge.png": [
        (1, (0, 593, 31, 630)), (2, (0, 593, 34, 637)),
        (3, (0, 496, 9, 540)), (3, (0, 621, 1, 624)),
    ],
    "block.png": [
        (1, (0, 381, 95, 476)), (1, (0, 629, 51, 695)),
        (2, (0, 554, 60, 696)),
        (3, (0, 634, 46, 696)), (3, (0, 628, 1, 630)),
    ],
    "hit.png": [
        (1, (0, 465, 53, 606)), (1, (0, 632, 32, 673)),
        (2, (0, 425, 26, 531)), (2, (0, 624, 35, 675)),
        (3, (0, 559, 8, 621)),
    ],
    "ko.png": [
        (0, (510, 265, 543, 303)), (0, (522, 361, 543, 419)),
        (0, (525, 313, 543, 370)), (0, (534, 533, 543, 574)),
        (1, (0, 426, 25, 451)),
        (2, (0, 322, 6, 365)), (2, (541, 599, 543, 616)),
    ],
}


def components(frame: Image.Image) -> dict[tuple[int, int, int, int], list[int]]:
    width, height = CELL
    visible = bytearray(value >= ALPHA_THRESHOLD for value in frame.getchannel("A").tobytes())
    found = {}
    for start in range(len(visible)):
        if not visible[start]:
            continue
        visible[start] = 0
        queue = deque([start])
        pixels = []
        x0, y0, x1, y1 = width, height, 0, 0
        while queue:
            index = queue.popleft()
            y, x = divmod(index, width)
            pixels.append(index)
            x0, y0 = min(x0, x), min(y0, y)
            x1, y1 = max(x1, x + 1), max(y1, y + 1)
            for ny in range(max(0, y - 1), min(height, y + 2)):
                row = ny * width
                for nx in range(max(0, x - 1), min(width, x + 2)):
                    neighbor = row + nx
                    if visible[neighbor]:
                        visible[neighbor] = 0
                        queue.append(neighbor)
        found[(x0, y0, x1, y1)] = pixels
    return found


def main() -> None:
    BACKUP.mkdir(parents=True, exist_ok=True)
    report = {"cell": CELL, "alpha_threshold": ALPHA_THRESHOLD, "files": {}}
    for filename, targets in ARTIFACTS.items():
        original = BACKUP / filename
        if not original.exists():
            shutil.copy2(RUNTIME / filename, original)
        sheet = Image.open(original).convert("RGBA")
        if sheet.size != (CELL[0] * 4, CELL[1]):
            raise ValueError(f"Unexpected dimensions for {filename}: {sheet.size}")
        result = Image.new("RGBA", sheet.size)
        removed = []
        for frame_index in range(4):
            box = (frame_index * CELL[0], 0, (frame_index + 1) * CELL[0], CELL[1])
            frame = sheet.crop(box)
            found = components(frame)
            mask_data = bytearray(CELL[0] * CELL[1])
            for target_frame, bounds in targets:
                if target_frame != frame_index:
                    continue
                pixels = found.get(bounds)
                if pixels is None:
                    raise ValueError(f"Audited component missing: {filename} frame {frame_index + 1} {bounds}")
                for index in pixels:
                    mask_data[index] = 255
                removed.append({"frame": frame_index + 1, "bbox": bounds, "visible_pixels": len(pixels)})
            if any(mask_data):
                mask = Image.frombytes("L", CELL, bytes(mask_data)).filter(ImageFilter.MaxFilter(3))
                frame.paste((0, 0, 0, 0), (0, 0), mask)
            result.paste(frame, box)
        result.save(RUNTIME / filename, optimize=True)
        report["files"][filename] = {"removed_components": removed, "count": len(removed)}
    destination = ROOT / "qa-output/naya-sprite-cleanup-report.json"
    destination.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Removed {sum(item['count'] for item in report['files'].values())} audited components; report: {destination}")


if __name__ == "__main__":
    main()
