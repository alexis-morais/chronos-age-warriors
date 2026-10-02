"""Remove verified cross-cell fragments from Karg's four runtime sprite sheets.

The first run preserves the supplied PNGs under ignored qa-output/. Subsequent
runs always start from that backup, so this operation is reversible and stable.
Only the explicitly audited disconnected components below are removed.
"""

from collections import deque
from pathlib import Path
import json
import shutil

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "public/assets/sprites/warriors/primal/karg"
BACKUP = ROOT / "qa-output/karg-sprite-originals"
CELL = (543, 724)
ALPHA_THRESHOLD = 24

# (zero-based frame, exact isolated alpha-component bbox). These are fragments
# of adjacent cells, not Karg's connected silhouette, dust, hair or attack arc.
ARTIFACTS = {
    "idle.png": [
        (1, (0, 277, 26, 303)),
        (2, (0, 281, 31, 311)),
        (3, (0, 291, 30, 322)),
    ],
    "run.png": [
        (0, (507, 470, 543, 577)),
        (0, (523, 578, 543, 598)),
        (1, (518, 483, 543, 577)),
        (1, (519, 415, 543, 438)),
        (1, (528, 451, 543, 472)),
        (1, (521, 577, 543, 602)),
        (1, (9, 370, 26, 385)),
        (1, (0, 421, 10, 431)),
        (2, (0, 453, 9, 472)),
        (3, (0, 427, 74, 475)),
    ],
    "attack.png": [
        (0, (495, 371, 543, 396)),
        (0, (521, 424, 543, 440)),
        (2, (0, 317, 26, 337)),
        (3, (0, 306, 129, 497)),
        (3, (0, 291, 33, 328)),
    ],
    "hit.png": [
        (1, (0, 291, 53, 338)),
        (2, (0, 211, 52, 271)),
        (2, (0, 340, 26, 371)),
    ],
}


def components(frame):
    """8-connected components of visible alpha, including their exact pixels."""
    width, height = CELL
    visible = bytearray(value >= ALPHA_THRESHOLD for value in frame.getchannel("A").tobytes())
    found = []
    for start in range(len(visible)):
        if not visible[start]:
            continue
        queue = deque([start])
        visible[start] = 0
        pixels = []
        x0, y0, x1, y1 = width, height, 0, 0
        while queue:
            index = queue.popleft()
            y, x = divmod(index, width)
            pixels.append(index)
            x0, y0 = min(x0, x), min(y0, y)
            x1, y1 = max(x1, x + 1), max(y1, y + 1)
            for neighbor in (index - 1, index + 1, index - width, index + width):
                if 0 <= neighbor < len(visible) and visible[neighbor] and abs(neighbor % width - x) <= 1:
                    visible[neighbor] = 0
                    queue.append(neighbor)
        found.append({"bbox": (x0, y0, x1, y1), "pixels": pixels})
    return found


def main():
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
            detected = {component["bbox"]: component for component in components(frame)}
            mask = Image.new("L", CELL, 0)
            mask_data = bytearray(CELL[0] * CELL[1])
            for target_frame, bounds in targets:
                if target_frame != frame_index:
                    continue
                component = detected.get(bounds)
                if component is None:
                    raise ValueError(f"Audited component missing: {filename} frame {frame_index + 1} {bounds}")
                for index in component["pixels"]:
                    mask_data[index] = 255
                removed.append({"frame": frame_index + 1, "bbox": bounds, "opaque_pixels": len(component["pixels"])})
            if any(mask_data):
                mask = Image.frombytes("L", CELL, bytes(mask_data)).filter(ImageFilter.MaxFilter(5))
                frame.paste((0, 0, 0, 0), (0, 0), mask)
            result.paste(frame, box)
        result.save(RUNTIME / filename, optimize=True)
        report["files"][filename] = {"removed_components": removed, "count": len(removed)}
    destination = ROOT / "qa-output/karg-sprite-cleanup-report.json"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Removed {sum(item['count'] for item in report['files'].values())} audited components; report: {destination}")


if __name__ == "__main__":
    main()
