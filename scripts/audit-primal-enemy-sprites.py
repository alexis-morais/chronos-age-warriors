#!/usr/bin/env python3
"""Audit supplied Primal enemy sheets and prepare transparent Smilodon exports.

Sources are never overwritten. The JSON report is deliberately kept in the
git-ignored qa-output directory; runtime exports sit beside their source art.
"""

import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public/assets/sprites/ennemies/primal'
REPORT = ROOT / 'qa-output/primal-enemy-sprites.json'
IDS = ('cave-brute', 'tribal-warrior', 'tribal-hunter', 'raptor', 'shaman', 'smilodon', 'mammoth')
POSES = ('idle', 'run', 'anticipation', 'attack', 'attack-fx', 'dodge', 'block', 'hit', 'ko')


def transparent_black(image: Image.Image) -> Image.Image:
    """Unmatte a black-backed RGB sheet; retain source RGB and anti-aliased edges.

    The generated source was composited over near-black. A short alpha ramp
    removes that matte without bleaching the painted warm colours.
    """
    rgba = image.convert('RGBA')
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, _ = pixels[x, y]
            brightness = max(red, green, blue)
            if brightness <= 4:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                pixels[x, y] = (red, green, blue, min(255, (brightness - 4) * 6))
    return rgba


def remove_attack_edge_bleed(image: Image.Image) -> tuple[Image.Image, list[dict]]:
    """Remove only detached small fragments crossing an attack cell edge."""
    result = Image.new('RGBA', image.size)
    removed = []
    width = image.width // 4
    for frame in range(4):
        cell = image.crop((frame * width, 0, (frame + 1) * width, image.height)).convert('RGBA')
        alpha = cell.getchannel('A')
        source = alpha.tobytes()
        seen = bytearray(len(source))
        output = bytearray(source)
        for start, value in enumerate(source):
            if value <= 32 or seen[start]:
                continue
            queue = deque([start]); seen[start] = 1; component = []
            minimum_x = width; minimum_y = cell.height; maximum_x = maximum_y = 0
            while queue:
                point = queue.popleft(); component.append(point)
                x, y = point % width, point // width
                minimum_x = min(minimum_x, x); maximum_x = max(maximum_x, x)
                minimum_y = min(minimum_y, y); maximum_y = max(maximum_y, y)
                for neighbour in (point - 1, point + 1, point - width, point + width):
                    if neighbour < 0 or neighbour >= len(source) or seen[neighbour] or source[neighbour] <= 32:
                        continue
                    if abs(neighbour % width - x) + abs(neighbour // width - y) != 1:
                        continue
                    seen[neighbour] = 1; queue.append(neighbour)
            if len(component) < 6500 and (minimum_x <= 1 or maximum_x >= width - 2):
                for point in component:
                    output[point] = 0
                removed.append({'frame': frame, 'pixels': len(component), 'bbox': [minimum_x, minimum_y, maximum_x + 1, maximum_y + 1]})
        cell.putalpha(Image.frombytes('L', cell.size, bytes(output)))
        result.paste(cell, (frame * width, 0))
    return result, removed


def inspect(path: Path, image: Image.Image, cells: int) -> dict:
    cell_width = image.width // cells
    alpha = image.getchannel('A') if 'A' in image.getbands() else None
    # RGB Smilodon sources were painted onto black rather than transparency.
    # Inspect visible colour there, or every source frame would look "empty".
    if alpha is None and cells == 4:
        red, green, blue = image.convert('RGB').split()
        visible = ImageChops.lighter(ImageChops.lighter(red, green), blue).point(lambda value: 255 if value > 4 else 0)
    else:
        visible = alpha
    frames = []
    for index in range(cells):
        region = (index * cell_width, 0, (index + 1) * cell_width, image.height)
        cell = visible.crop(region) if visible else None
        bbox = cell.getbbox() if cell else None
        components = []
        if cell:
            small = cell.resize((max(1, cell.width // 6), max(1, cell.height // 6)), Image.Resampling.BOX)
            width, height = small.size
            pixels = small.tobytes()
            seen = bytearray(width * height)
            for start, value in enumerate(pixels):
                if value <= 32 or seen[start]:
                    continue
                queue = deque([start]); seen[start] = 1; area = 0
                minimum_x = width; minimum_y = height; maximum_x = maximum_y = 0
                while queue:
                    point = queue.popleft(); x, y = point % width, point // width
                    area += 1; minimum_x = min(minimum_x, x); maximum_x = max(maximum_x, x)
                    minimum_y = min(minimum_y, y); maximum_y = max(maximum_y, y)
                    for neighbour in (point - 1, point + 1, point - width, point + width):
                        if neighbour < 0 or neighbour >= width * height or seen[neighbour] or pixels[neighbour] <= 32:
                            continue
                        if abs(neighbour % width - x) + abs(neighbour // width - y) != 1:
                            continue
                        seen[neighbour] = 1; queue.append(neighbour)
                components.append({'areaAtSixthScale': area, 'bboxAtSixthScale': [minimum_x, minimum_y, maximum_x + 1, maximum_y + 1]})
        components.sort(key=lambda component: component['areaAtSixthScale'], reverse=True)
        frames.append({
            'index': index,
            'bbox': list(bbox) if bbox else None,
            'empty': bbox is None,
            'touchesLeft': bool(cell and cell.crop((0, 0, 1, cell.height)).getbbox()),
            'touchesRight': bool(cell and cell.crop((cell.width - 1, 0, cell.width, cell.height)).getbbox()),
            'components': len(components),
            'componentSummary': components[:10],
            'smallDetachedComponentsForReview': [component for component in components[1:] if component['areaAtSixthScale'] <= 5][:12],
        })
    return {
        'path': str(path.relative_to(ROOT)), 'size': [image.width, image.height],
        'mode': image.mode, 'hasAlpha': alpha is not None,
        'frameCount': cells, 'cellSize': [cell_width, image.height], 'frames': frames,
    }


def main() -> None:
    report = {'kits': {}, 'warnings': []}
    for enemy_id in IDS:
        folder = ASSETS / enemy_id
        kit = {}
        for name in ('base', *POSES):
            source = folder / f'{name}.png'
            if not source.is_file():
                report['warnings'].append(f'Missing: {source.relative_to(ROOT)}')
                continue
            with Image.open(source) as opened:
                image = opened.copy()
            cells = 1 if name == 'base' else 4
            if image.width % cells:
                report['warnings'].append(f'Unequal cells: {source.relative_to(ROOT)}')
            kit[name] = inspect(source, image, cells)
            if name == 'base' and 'A' not in image.getbands():
                report['warnings'].append(f'Opaque static base (not used in combat): {source.relative_to(ROOT)}')
            if enemy_id == 'smilodon' and name != 'base' and image.mode == 'RGB':
                runtime = folder / f'{name}-runtime.png'
                converted = transparent_black(image)
                converted.save(runtime, optimize=True)
                kit[name]['runtime'] = inspect(runtime, converted, cells)
            elif enemy_id in ('tribal-warrior', 'tribal-hunter', 'raptor') and name == 'attack':
                runtime = folder / 'attack-runtime.png'
                converted, removed = remove_attack_edge_bleed(image)
                converted.save(runtime, optimize=True)
                kit[name]['runtime'] = inspect(runtime, converted, cells)
                kit[name]['removedEdgeFragments'] = removed
            elif name != 'base' and 'A' not in image.getbands():
                report['warnings'].append(f'No alpha: {source.relative_to(ROOT)}')
        report['kits'][enemy_id] = kit
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(f'Audited {len(report["kits"])} kits; warnings: {len(report["warnings"])}; report: {REPORT}')
    for warning in report['warnings']:
        print(f'WARNING {warning}')


if __name__ == '__main__':
    main()
