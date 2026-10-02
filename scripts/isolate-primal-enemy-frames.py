#!/usr/bin/env python3
"""Separate overlapping four-pose Primal sheets into safe, lossless frame cells.

The supplied art is kept intact. Connected painted subjects are assigned to
their own frame before being placed on a wider transparent atlas; detached
particles are retained and assigned to the nearest subject. This avoids both
neighbour bleed and the old edge-cleaner's amputated Raptor muzzle.
"""

import json
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public/assets/sprites/ennemies/primal'
REPORT = ROOT / 'qa-output/enemy-frame-audit/isolation-report.json'
GEOMETRY = ROOT / 'src/art/enemyFrameGeometry.generated.ts'
ENEMIES = ('cave-brute', 'tribal-warrior', 'tribal-hunter', 'raptor', 'shaman', 'smilodon', 'mammoth')
POSES = ('idle', 'run', 'anticipation', 'attack', 'attack-fx', 'dodge', 'block', 'hit', 'ko')


def painted_source(enemy: str, pose: str) -> Path:
    # Smilodon's original sheets are opaque RGB; the previous alpha export is
    # used as the input, but the original RGB source is never overwritten.
    suffix = '-runtime' if enemy == 'smilodon' else ''
    return ASSETS / enemy / f'{pose}{suffix}.png'


def minimum_alpha_seam(alpha: np.ndarray, center: int, reach: int = 130) -> np.ndarray:
    """Find a low-opacity vertical cut between the touching Mammoth KO poses."""
    height, width = alpha.shape
    left, right = max(0, center - reach), min(width, center + reach + 1)
    strip = alpha[:, left:right].astype(np.float32)
    columns = np.arange(left, right)
    bias = np.abs(columns - center) * .045
    cost = strip / 255 * 40 + bias[None, :]
    scores = cost[0].copy()
    predecessors = np.zeros((height, right - left), dtype=np.int16)
    for y in range(1, height):
        candidates = np.stack((np.pad(scores[:-1], (1, 0), constant_values=1e8), scores, np.pad(scores[1:], (0, 1), constant_values=1e8)))
        choice = candidates.argmin(axis=0)
        predecessors[y] = choice - 1
        scores = cost[y] + candidates.min(axis=0)
    position = int(scores.argmin())
    seam = np.zeros(height, dtype=np.int32)
    for y in range(height - 1, -1, -1):
        seam[y] = left + position
        position = max(0, min(right - left - 1, position + int(predecessors[y, position])))
    return seam


def connected_components(alpha: np.ndarray, enemy: str, pose: str) -> tuple[np.ndarray, list[dict]]:
    height, width = alpha.shape
    threshold = np.ascontiguousarray(alpha >= 100)
    if enemy == 'mammoth' and pose == 'ko':
        seam = minimum_alpha_seam(alpha, width // 2)
        for y, x in enumerate(seam):
            threshold[y, max(0, x - 2):min(width, x + 3)] = False
    pixels = threshold.ravel()
    seen = bytearray(pixels.size)
    labels = np.full(pixels.size, -1, dtype=np.int16)
    components = []
    for start in range(pixels.size):
        if not pixels[start] or seen[start]:
            continue
        index = len(components)
        queue = deque([start])
        seen[start] = 1
        count = total_x = total_y = 0
        min_x, min_y, max_x, max_y = width, height, 0, 0
        while queue:
            point = queue.popleft()
            x, y = point % width, point // width
            labels[point] = index
            count += 1
            total_x += x
            total_y += y
            min_x, min_y = min(min_x, x), min(min_y, y)
            max_x, max_y = max(max_x, x), max(max_y, y)
            for neighbour in (point - 1, point + 1, point - width, point + width):
                if neighbour < 0 or neighbour >= pixels.size or seen[neighbour] or not pixels[neighbour]:
                    continue
                if abs(neighbour % width - x) + abs(neighbour // width - y) != 1:
                    continue
                seen[neighbour] = 1
                queue.append(neighbour)
        components.append({'area': count, 'centerX': total_x / count, 'centerY': total_y / count,
                           'bbox': [min_x, min_y, max_x + 1, max_y + 1]})
    return labels.reshape((height, width)), components


def isolate(enemy: str, pose: str) -> dict:
    source = painted_source(enemy, pose)
    image = np.array(Image.open(source).convert('RGBA'))
    height, sheet_width = image.shape[:2]
    if sheet_width % 4:
        raise ValueError(f'Unequal source cells: {source}')
    old_width = sheet_width // 4
    alpha = image[:, :, 3]
    labels, components = connected_components(alpha, enemy, pose)
    main = []
    for frame in range(4):
        candidates = [(index, component) for index, component in enumerate(components)
                      if frame * old_width <= component['centerX'] < (frame + 1) * old_width]
        if not candidates:
            raise ValueError(f'No painted subject for {enemy}/{pose}, frame {frame + 1}')
        main.append(max(candidates, key=lambda entry: entry[1]['area'])[0])
    centers = np.array([components[index]['centerX'] for index in main])
    heights = np.array([components[index]['centerY'] for index in main])
    component_owner = np.empty(len(components), dtype=np.int8)
    for index, component in enumerate(components):
        if index in main:
            component_owner[index] = main.index(index)
        else:
            # Only small detached particles remain here. Keep them and choose
            # the closest painted pose, without a "tiny alpha = trash" rule.
            distance = ((centers - component['centerX']) / old_width) ** 2 + ((heights - component['centerY']) / height) ** 2 * .1
            component_owner[index] = int(distance.argmin())
    owner = np.full(alpha.shape, -1, dtype=np.int8)
    labelled = labels >= 0
    owner[labelled] = component_owner[labels[labelled]]
    # Restore anti-aliased outlines around each component before assigning the
    # residual disconnected low-alpha dust by nearest horizontal pose.
    for frame in range(4):
        mask = Image.fromarray(np.uint8(owner == frame) * 255).filter(ImageFilter.MaxFilter(7))
        expansion = (np.asarray(mask) > 0) & (owner < 0) & (alpha > 0)
        owner[expansion] = frame
    remaining = (owner < 0) & (alpha > 0)
    x_indices = np.broadcast_to(np.arange(sheet_width)[None, :], alpha.shape)
    owner[remaining] = np.clip(x_indices[remaining] // old_width, 0, 3)
    reassigned = int(((owner != np.clip(x_indices // old_width, 0, 3)) & (alpha > 32)).sum())
    if reassigned == 0 and source.name.endswith('-runtime.png'):
        # This supplied transparent export already has four clean cells. Ship
        # it directly instead of producing a redundant widened atlas.
        redundant = ASSETS / enemy / f'{pose}-isolated.png'
        if redundant.exists():
            redundant.unlink()
        return {'source': str(source.relative_to(ROOT)), 'runtime': str(source.relative_to(ROOT)),
                'sourceCellWidth': old_width, 'runtimeCellWidth': old_width, 'cellHeight': height,
                'sourceOpaquePixels': int((alpha > 32).sum()), 'runtimeOpaquePixels': int((alpha > 32).sum()),
                'pixelsReassignedToCorrectFrame': 0, 'previousRuntimeMissingOpaquePixels': None,
                'mainComponentBboxes': [components[index]['bbox'] for index in main],
                'maxPaintedWidth': max(components[index]['bbox'][2] - components[index]['bbox'][0] for index in main),
                'maxPaintedHeight': max(components[index]['bbox'][3] - components[index]['bbox'][1] for index in main)}
    max_span = 0
    for frame in range(4):
        x = np.where(owner == frame)[1]
        if not x.size:
            raise ValueError(f'Empty isolated frame: {enemy}/{pose}/{frame + 1}')
        max_span = max(max_span, int(np.max(np.abs(x - (frame * old_width + old_width // 2)))))
    new_width = max(old_width, ((2 * (max_span + 20) + 15) // 16) * 16)
    if new_width > 1056:
        raise ValueError(f'Suspiciously wide result {new_width}: {enemy}/{pose}')
    result = np.zeros((height, new_width * 4, 4), dtype=np.uint8)
    for frame in range(4):
        y, x = np.where((owner == frame) & (alpha > 0))
        shifted = frame * new_width + x + new_width // 2 - (frame * old_width + old_width // 2)
        result[y, shifted] = image[y, x]
    output = ASSETS / enemy / f'{pose}-isolated.png'
    Image.fromarray(result, 'RGBA').save(output, optimize=True)
    previous_runtime = ASSETS / enemy / f'{pose}-runtime.png'
    previous_removed = None
    if previous_runtime.exists() and previous_runtime != source:
        old_alpha = np.array(Image.open(previous_runtime).convert('RGBA'))[:, :, 3]
        if old_alpha.shape == alpha.shape:
            previous_removed = int(((alpha > 32) & (old_alpha <= 32)).sum())
    return {'source': str(source.relative_to(ROOT)), 'runtime': str(output.relative_to(ROOT)),
            'sourceCellWidth': old_width, 'runtimeCellWidth': new_width, 'cellHeight': height,
            'sourceOpaquePixels': int((alpha > 32).sum()), 'runtimeOpaquePixels': int((result[:, :, 3] > 32).sum()),
            'pixelsReassignedToCorrectFrame': reassigned, 'previousRuntimeMissingOpaquePixels': previous_removed,
            'mainComponentBboxes': [components[index]['bbox'] for index in main],
            'maxPaintedWidth': max(components[index]['bbox'][2] - components[index]['bbox'][0] for index in main),
            'maxPaintedHeight': max(components[index]['bbox'][3] - components[index]['bbox'][1] for index in main)}


def main() -> None:
    report = {'kits': {}}
    geometry = {}
    painted = {}
    for enemy in ENEMIES:
        report['kits'][enemy] = {}
        geometry[enemy] = {}
        painted[enemy] = {}
        for pose in POSES:
            entry = isolate(enemy, pose)
            if entry['sourceOpaquePixels'] != entry['runtimeOpaquePixels']:
                raise ValueError(f'Visible pixels lost during isolation: {enemy}/{pose}')
            report['kits'][enemy][pose] = entry
            geometry[enemy][pose] = [entry['runtimeCellWidth'], entry['cellHeight']]
            painted[enemy][pose] = [entry['maxPaintedWidth'], entry['maxPaintedHeight']]
            print(f'{enemy}/{pose}: {entry["sourceCellWidth"]} -> {entry["runtimeCellWidth"]}')
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    GEOMETRY.write_text('/* Generated by scripts/isolate-primal-enemy-frames.py; do not edit by hand. */\n'
                        'export const enemyFrameGeometry = ' + json.dumps(geometry, indent=2) + ' as const\n'
                        'export const enemyFramePaintedSize = ' + json.dumps(painted, indent=2) + ' as const\n', encoding='utf-8')


if __name__ == '__main__':
    main()
