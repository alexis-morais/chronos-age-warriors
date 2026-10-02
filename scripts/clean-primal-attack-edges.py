"""Make conservative runtime copies of attack sheets with stray cell-edge pieces removed.

Only components isolated inside a narrow edge strip are removed. The supplied
attack.png files stay untouched. Morga's last cell also has a clearly foreign
tusk from the preceding pose; its small painted region is explicitly masked.
"""

from collections import deque
from pathlib import Path
import json
import shutil

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SPRITES = ROOT / "public/assets/sprites/warriors/primal"
BACKUPS = ROOT / "qa-output/primal-attack-source"
REPORT = ROOT / "qa-output/primal-attack-edge-cleanup.json"
SHEETS = (("brakk", "attack"), ("ursak", "attack"), ("saar", "attack"), ("morga", "attack"), ("tyrak", "hit"))
STRIP = 115


def isolated_edge_fragments(alpha: np.ndarray) -> tuple[np.ndarray, list[dict]]:
    height, width = alpha.shape
    visible = alpha > 24
    removal = np.zeros_like(visible)
    details = []
    for side in ("left", "right"):
        x0 = 0 if side == "left" else width - STRIP
        strip = visible[:, x0:x0 + STRIP]
        seen = np.zeros_like(strip)
        edge_xs = range(3) if side == "left" else range(STRIP - 3, STRIP)
        for y in range(height):
            for x in edge_xs:
                if not strip[y, x] or seen[y, x]:
                    continue
                queue = deque([(y, x)])
                seen[y, x] = True
                points = []
                touches_interior = False
                while queue:
                    cy, cx = queue.popleft()
                    points.append((cy, cx))
                    if cx == (STRIP - 1 if side == "left" else 0):
                        touches_interior = True
                    for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                        if 0 <= ny < height and 0 <= nx < STRIP and strip[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            queue.append((ny, nx))
                if touches_interior or len(points) < 20:
                    continue
                yy = [point[0] for point in points]
                xx = [point[1] + x0 for point in points]
                for cy, cx in points:
                    removal[cy, cx + x0] = True
                details.append({"side": side, "pixels": len(points), "bbox": [min(xx), min(yy), max(xx) + 1, max(yy) + 1]})
    return removal, details


def main() -> None:
    results = {}
    for warrior_id, pose in SHEETS:
        source = SPRITES / warrior_id / f"{pose}.png"
        backup = BACKUPS / warrior_id / f"{pose}.png"
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            shutil.copy2(source, backup)
        image = Image.open(source).convert("RGBA")
        if image.width % 4:
            raise ValueError(f"Unequal four-frame sheet: {source}")
        cell_width = image.width // 4
        output = Image.new("RGBA", image.size)
        frame_reports = []
        for index in range(4):
            cell = image.crop((index * cell_width, 0, (index + 1) * cell_width, image.height))
            pixels = np.array(cell)
            removal, fragments = isolated_edge_fragments(pixels[:, :, 3])
            if warrior_id == "morga" and pose == "attack" and index == 3:
                # Left tusk belongs to frame 2; the real body starts farther
                # right here. Keep Morga's left rear leg below this region.
                manual = Image.new("L", cell.size)
                ImageDraw.Draw(manual).polygon([(0, 325), (74, 364), (75, 486), (0, 525)], fill=255)
                removal |= np.asarray(manual) > 0
                fragments.append({"side": "left", "reason": "preceding frame tusk", "bbox": [0, 325, 76, 525]})
            expanded = Image.fromarray((removal * 255).astype(np.uint8), "L").filter(ImageFilter.MaxFilter(5))
            pixels[np.asarray(expanded) > 0, 3] = 0
            output.alpha_composite(Image.fromarray(pixels, "RGBA"), (index * cell_width, 0))
            frame_reports.append({"frame": index, "fragments_removed": fragments,
                                  "removed_alpha_pixels": int(np.count_nonzero((np.asarray(cell)[:, :, 3] > 0) & (pixels[:, :, 3] == 0)))})
        destination = source.with_name(f"{pose}-runtime.png")
        output.save(destination, optimize=True)
        results[f"{warrior_id}/{pose}"] = {"source": str(source.relative_to(ROOT)), "runtime": str(destination.relative_to(ROOT)), "frames": frame_reports}
        print(f"{warrior_id}/{pose}: {destination}")
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps({"method": "isolated edge components + documented Morga tusk mask", "warriors": results}, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
