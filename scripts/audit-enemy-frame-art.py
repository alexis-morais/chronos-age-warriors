#!/usr/bin/env python3
"""Export the exact runtime enemy cells for visual review, without editing sources."""

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public/assets/sprites/ennemies/primal'
OUTPUT = ROOT / 'qa-output/enemy-frame-audit'
ENEMIES = ('cave-brute', 'tribal-warrior', 'tribal-hunter', 'raptor', 'shaman', 'smilodon', 'mammoth')
POSES = ('idle', 'run', 'anticipation', 'attack', 'attack-fx', 'dodge', 'block', 'hit', 'ko')


def runtime_file(enemy: str, pose: str) -> Path:
    suffix = '-runtime' if enemy == 'smilodon' and pose in ('idle', 'anticipation', 'block') else '-isolated'
    return ASSETS / enemy / f'{pose}{suffix}.png'


def checker(size: tuple[int, int]) -> Image.Image:
    image = Image.new('RGBA', size, '#344039')
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], 32):
        for x in range(0, size[0], 32):
            if (x // 32 + y // 32) % 2:
                draw.rectangle((x, y, x + 31, y + 31), fill='#42504a')
    return image


def contact_sheet(frames: list[Image.Image], label: str, path: Path) -> None:
    width, height = frames[0].size
    margin, header, gap = 22, 60, 14
    sheet = Image.new('RGBA', (margin * 2 + 4 * width + 3 * gap, header + height + margin), '#17221f')
    draw = ImageDraw.Draw(sheet)
    draw.text((margin, 12), label, fill='#f2deb4', font=ImageFont.load_default())
    for index, frame in enumerate(frames):
        x = margin + index * (width + gap)
        tile = checker(frame.size)
        tile.alpha_composite(frame.convert('RGBA'))
        sheet.alpha_composite(tile, (x, header))
        draw.rectangle((x, header, x + width - 1, header + height - 1), outline='#f2deb4', width=2)
        draw.text((x + 8, 35), f'FRAME {index + 1}', fill='white', font=ImageFont.load_default())
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.convert('RGB').save(path, optimize=True)


def cells(path: Path) -> list[Image.Image]:
    with Image.open(path) as opened:
        sheet = opened.convert('RGBA')
    if sheet.width % 4:
        raise ValueError(f'Four equal cells expected: {path}')
    width = sheet.width // 4
    return [sheet.crop((index * width, 0, (index + 1) * width, sheet.height)) for index in range(4)]


def main() -> None:
    manifest = {'animations': {}, 'totals': {'enemies': 0, 'animations': 0, 'frames': 0}}
    for enemy in ENEMIES:
        manifest['animations'][enemy] = {}
        overview = Image.new('RGB', (1320, 3 * 244 + 48), '#17221f')
        overview_draw = ImageDraw.Draw(overview)
        for pose in POSES:
            runtime = runtime_file(enemy, pose)
            source = ASSETS / enemy / f'{pose}{"-runtime" if enemy == "smilodon" else ""}.png'
            frames = cells(runtime)
            target = OUTPUT / enemy / pose
            target.mkdir(parents=True, exist_ok=True)
            for index, frame in enumerate(frames):
                frame.save(target / f'frame-{index + 1}.png', optimize=True)
            contact_sheet(frames, f'{enemy} / {pose} / runtime: {runtime.name}', OUTPUT / enemy / f'{pose}-contact-sheet.png')
            thumbnail = Image.open(OUTPUT / enemy / f'{pose}-contact-sheet.png').convert('RGB')
            thumbnail.thumbnail((430, 202))
            slot = POSES.index(pose)
            column, row = slot % 3, slot // 3
            overview.paste(thumbnail, (column * 440 + 5, row * 244 + 32))
            overview_draw.text((column * 440 + 8, row * 244 + 9), pose.upper(), fill='#f2deb4')
            entry = {
                'runtime': str(runtime.relative_to(ROOT)),
                'source': str(source.relative_to(ROOT)),
                'cellSize': list(frames[0].size),
                'runtimeFrameBboxes': [list(frame.getchannel('A').getbbox()) if frame.getchannel('A').getbbox() else None for frame in frames],
                'runtimeFrameFiles': [str((target / f'frame-{index + 1}.png').relative_to(ROOT)) for index in range(4)],
                'contactSheet': str((OUTPUT / enemy / f'{pose}-contact-sheet.png').relative_to(ROOT)),
            }
            if runtime != source:
                original = cells(source)
                contact_sheet(original, f'{enemy} / {pose} / source: {source.name}', OUTPUT / enemy / f'{pose}-source-contact-sheet.png')
                if original[0].size == frames[0].size:
                    entry['removedAlphaPixels'] = []
                    entry['restoredAlphaPixels'] = []
                    for before, after in zip(original, frames):
                        a = before.getchannel('A').tobytes()
                        b = after.getchannel('A').tobytes()
                        entry['removedAlphaPixels'].append(sum(old > 32 and new <= 32 for old, new in zip(a, b)))
                        entry['restoredAlphaPixels'].append(sum(old <= 32 and new > 32 for old, new in zip(a, b)))
            manifest['animations'][enemy][pose] = entry
            manifest['totals']['animations'] += 1
            manifest['totals']['frames'] += 4
        manifest['totals']['enemies'] += 1
        overview.save(OUTPUT / enemy / 'overview.jpg', quality=90)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    print(f"Exported {manifest['totals']['animations']} contact sheets and {manifest['totals']['frames']} frames to {OUTPUT}")


if __name__ == '__main__':
    main()
