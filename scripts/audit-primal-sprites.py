"""Audit every Primal spritesheet without altering source art.

Usage: python scripts/audit-primal-sprites.py [warrior-id ...]
Reports are written to ignored qa-output/primal-sprite-audit.json.
"""

from pathlib import Path
from collections import deque
import json
import sys

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SPRITES = ROOT / "public/assets/sprites/warriors/primal"
OUTPUT = ROOT / "qa-output/primal-sprite-audit.json"
ALPHA_THRESHOLD = 24


def component_candidates(visible: np.ndarray) -> list[dict]:
    """Coarse 8-connected components for review, never automatic deletion."""
    height, width = visible.shape
    step = 6
    sampled = visible[::step, ::step]
    seen = np.zeros_like(sampled)
    pieces = []
    for y in range(sampled.shape[0]):
        for x in range(sampled.shape[1]):
            if not sampled[y, x] or seen[y, x]:
                continue
            queue = deque([(y, x)])
            seen[y, x] = True
            xs, ys = [], []
            while queue:
                cy, cx = queue.popleft()
                xs.append(cx)
                ys.append(cy)
                for ny in range(max(0, cy - 1), min(sampled.shape[0], cy + 2)):
                    for nx in range(max(0, cx - 1), min(sampled.shape[1], cx + 2)):
                        if sampled[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            queue.append((ny, nx))
            pieces.append({"sampled_pixels": len(xs), "bbox": [min(xs) * step, min(ys) * step,
                            min(width, (max(xs) + 1) * step), min(height, (max(ys) + 1) * step)]})
    return sorted(pieces, key=lambda piece: piece["sampled_pixels"], reverse=True)[:20]


def approximate_mask(image: Image.Image) -> np.ndarray:
    pixels = np.asarray(image)
    if image.mode == "RGBA":
        return pixels[:, :, 3] >= ALPHA_THRESHOLD
    rgb = pixels[:, :, :3].astype(np.int16)
    # Opaque black/white sheets are source defects, not genuine transparency.
    corner = np.median(np.array([rgb[0, 0], rgb[0, -1], rgb[-1, 0], rgb[-1, -1]]), axis=0)
    if corner.mean() > 200:
        return np.min(rgb, axis=2) < 236
    return np.max(rgb, axis=2) > 20


def frame_regions(path: Path, size: tuple[int, int]) -> tuple[str, list[tuple[int, int, int, int]]]:
    width, height = size
    if path.stem == "base":
        return "single", [(0, 0, width, height)]
    if path.parent.name == "tyrak" and path.name == "ko.png":
        # Official source is a hand-laid eleven-pose storyboard, not a sheet.
        top = (0, 350, 720, 1095, 1450, 1830, width)
        bottom = (0, 360, 770, 1190, 1680, width)
        return "storyboard-6-plus-5", ([(top[i], 0, top[i + 1], 420) for i in range(6)]
                                       + [(bottom[i], 420, bottom[i + 1], height) for i in range(5)])
    if width < height * 1.5:
        raise ValueError(f"Cannot identify four horizontal cells: {path} {size}")
    # Odd widths (1774px) are split using proportional integer boundaries.
    return "horizontal-four", [(round(i * width / 4), 0, round((i + 1) * width / 4), height) for i in range(4)]


def audit(path: Path) -> dict:
    image = Image.open(path)
    width, height = image.size
    layout, regions = frame_regions(path, image.size)
    mask = approximate_mask(image)
    cells = []
    cell_masks = []
    for frame, (x0, y0, x1, y1) in enumerate(regions):
        visible = mask[y0:y1, x0:x1]
        cell_masks.append(visible)
        yy, xx = np.nonzero(visible)
        bbox = [int(xx.min()), int(yy.min()), int(xx.max() + 1), int(yy.max() + 1)] if len(xx) else None
        cells.append({
            "index": frame,
            "width": x1 - x0,
            "region": [x0, y0, x1, y1],
            "bbox": bbox,
            "visible_pixels": int(visible.sum()),
            "bottom_y": bbox[3] if bbox else None,
            "edge_pixels": {"left": int(visible[:, :3].sum()), "right": int(visible[:, -3:].sum())},
            "suspected_cross_cell": bool(visible[:, :3].sum() > 50 or visible[:, -3:].sum() > 50),
            "components_for_review": component_candidates(visible),
        })
    neighbors = []
    for index in range(len(cell_masks) - 1):
        left, right = cell_masks[index], cell_masks[index + 1]
        if left.shape[0] != right.shape[0]:
            continue
        ending_rows = left[:, -8:].any(axis=1)
        entering_rows = right[:, :8].any(axis=1)
        neighbors.append({
            "from_frame": index,
            "to_frame": index + 1,
            "right_edge_rows": int(ending_rows.sum()),
            "next_left_edge_rows": int(entering_rows.sum()),
            "shared_edge_rows": int((ending_rows & entering_rows).sum()),
            "review": "Compare painted fragments; a shared edge can also be intentional FX.",
        })
    visible_heights = [cell["bbox"][3] - cell["bbox"][1] for cell in cells if cell["bbox"]]
    visible_widths = [cell["bbox"][2] - cell["bbox"][0] for cell in cells if cell["bbox"]]
    return {
        "size": [width, height], "mode": image.mode, "frames": len(regions), "layout": layout,
        "cells": cells,
        "adjacent_frame_edges": neighbors,
        "summary": {
            "visible_height_range": [min(visible_heights), max(visible_heights)] if visible_heights else None,
            "visible_width_range": [min(visible_widths), max(visible_widths)] if visible_widths else None,
            "height_variation_ratio": round(max(visible_heights) / min(visible_heights), 3) if visible_heights and min(visible_heights) else None,
            "edge_warning_frames": [cell["index"] for cell in cells if cell["suspected_cross_cell"]],
            "note": "Edge warnings need visual review: intentional tails, dust and FX may touch cell edges.",
        },
    }


def main() -> None:
    ids = sys.argv[1:] or [folder.name for folder in sorted(SPRITES.iterdir()) if folder.is_dir()]
    report = {"alpha_threshold": ALPHA_THRESHOLD, "warriors": {}}
    for warrior_id in ids:
        folder = SPRITES / warrior_id
        if not folder.is_dir() or folder.parent != SPRITES:
            raise ValueError(f"Unknown Warrior: {warrior_id}")
        files = {path.name: audit(path) for path in sorted(folder.glob("*.png"))}
        report["warriors"][warrior_id] = files
        opaque = [name for name, item in files.items() if item["mode"] != "RGBA"]
        abnormal = [name for name, item in files.items() if item["frames"] == 4 and len({cell["width"] for cell in item["cells"]}) != 1]
        print(f"{warrior_id}: {len(files)} PNG; opaque={opaque}; uneven cells={abnormal}")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(OUTPUT)


if __name__ == "__main__":
    main()
