from collections import deque
from functools import lru_cache
from pathlib import Path
from shutil import rmtree
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'public' / 'assets-v04'
DERIVED = SOURCE / 'derived'
if DERIVED.exists():
    rmtree(DERIVED)

WEAPONS = ['flint-club', 'bone-spear', 'obsidian-axe', 'hunter-bow', 'smilodon-fangs', 'mammoth-spear', 'volcanic-hammer', 'tyrant-claw', 'titan-heart']
STATES = ['idle', 'anticipation', 'attack', 'dodge', 'ko']
ENEMY_STATES = ['idle', 'anticipation', 'attack', 'dodge', 'hurt', 'ko']

def nearest_opaque(alpha, origin, radius=100, threshold=192):
    ox, oy = origin
    best = None
    for y in range(max(0, oy-radius), min(alpha.height, oy+radius+1)):
        for x in range(max(0, ox-radius), min(alpha.width, ox+radius+1)):
            if alpha.getpixel((x, y)) > threshold:
                distance = (x-ox) ** 2 + (y-oy) ** 2
                if best is None or distance < best[0]:
                    best = (distance, x, y)
    if best is None:
        raise ValueError(f'Aucun pixel opaque près de {origin}')
    return best[1], best[2]

@lru_cache(maxsize=None)
def load_atlas(atlas):
    image = Image.open(SOURCE / atlas).convert('RGBA')
    if 'warriors/' not in atlas:
        return image

    # The supplied Warrior sheets contain captions baked below every pose.
    # Detect their neutral-grey glyphs inside narrow, known caption bands,
    # then grow the mask just enough to remove the dark outline as well.
    labels = (
        (139 if '/male-' in atlas else 131),
        (271 if '/male-' in atlas else 259),
        (409 if '/male-' in atlas else 397),
        (541 if '/male-' in atlas else 534),
        (665 if '/male-' in atlas else 665),
        (782 if '/male-' in atlas else 777),
        (896 if '/male-' in atlas else 897),
        (998 if '/male-' in atlas else 1000),
        1073,
    )
    centers = [280, 520, 760, 1035, 1310] if '/male-' in atlas else [185, 455, 735, 1030, 1310]
    pixels = image.load()
    for label_y in labels:
        neutral = set()
        for center_x in centers:
            for y in range(max(0, label_y - 13), min(image.height, label_y + 14)):
                for x in range(max(0, center_x - 64), min(image.width, center_x + 65)):
                    red, green, blue, alpha = pixels[x, y]
                    if alpha > 70 and max(red, green, blue) - min(red, green, blue) < 24 and max(red, green, blue) > 70:
                        neutral.add((x, y))
        for x, y in neutral:
            for dy in range(-3, 4):
                for dx in range(-3, 4):
                    if dx * dx + dy * dy <= 12 and 0 <= x + dx < image.width and 0 <= y + dy < image.height:
                        pixels[x + dx, y + dy] = (0, 0, 0, 0)
        # Captions have an opaque black stroke which can remain connected to a
        # boot or shadow. Their bounding boxes are stable across every row.
        for center_x, half_width in zip(centers, [55, 75, 65, 65, 50]):
            for y in range(max(0, label_y - 18), min(image.height, label_y + 19)):
                for x in range(max(0, center_x - half_width), min(image.width, center_x + half_width + 1)):
                    pixels[x, y] = (0, 0, 0, 0)
    return image


def extract_component(atlas, output, origin, padding=5, y_limits=None, x_limits=None, threshold=192):
    image = load_atlas(atlas)
    if y_limits:
        image = image.copy()
        pixels = image.load()
        lower, upper = y_limits
        for y in range(image.height):
            if y < lower or y >= upper:
                for x in range(image.width):
                    pixels[x, y] = (0, 0, 0, 0)
    if x_limits:
        if image is load_atlas(atlas):
            image = image.copy()
        pixels = image.load()
        lower, upper = x_limits
        for x in range(image.width):
            if x < lower or x >= upper:
                for y in range(image.height):
                    pixels[x, y] = (0, 0, 0, 0)
    if output == 'enemies/mammoth/hurt.png':
        # The neighbouring charge pose overlaps the hurt cell with the very
        # tip of an ivory tusk. Remove that ivory island while retaining the
        # hurt Mammoth's brown fur, which extends into the same x-range.
        image = image.copy()
        pixels = image.load()
        ivory = []
        for y in range(805, 950):
            for x in range(990, 1027):
                red, green, blue, alpha = pixels[x, y]
                if alpha > 80 and min(red, green, blue) > 105:
                    ivory.append((x, y))
        for x, y in ivory:
            for dy in range(-4, 5):
                for dx in range(-4, 5):
                    if dx * dx + dy * dy <= 20:
                        pixels[x + dx, y + dy] = (0, 0, 0, 0)
    alpha = image.getchannel('A')
    seed = nearest_opaque(alpha, origin, threshold=threshold)
    width, height = image.size
    seen = bytearray(width * height)
    queue = deque([seed])
    pixels = []
    min_x = max_x = seed[0]
    min_y = max_y = seed[1]
    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if seen[index] or alpha.getpixel((x, y)) <= threshold:
            continue
        seen[index] = 1
        pixels.append((x, y))
        min_x, max_x = min(min_x, x), max(max_x, x)
        min_y, max_y = min(min_y, y), max(max_y, y)
        if x: queue.append((x-1, y))
        if x+1 < width: queue.append((x+1, y))
        if y: queue.append((x, y-1))
        if y+1 < height: queue.append((x, y+1))
    box = (max(0, min_x-padding), max(0, min_y-padding), min(width, max_x+padding+1), min(height, max_y+padding+1))
    result = Image.new('RGBA', (box[2]-box[0], box[3]-box[1]))
    source_pixels, target_pixels = image.load(), result.load()
    for x, y in pixels:
        target_pixels[x-box[0], y-box[1]] = source_pixels[x, y]
    target = DERIVED / output
    target.parent.mkdir(parents=True, exist_ok=True)
    result.save(target, optimize=True)

def crop_trim(atlas, output, box):
    image = Image.open(SOURCE / atlas).convert('RGBA').crop(box)
    content = image.getbbox(alpha_only=True)
    if content:
        image = image.crop(content)
    target = DERIVED / output
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, optimize=True)


def crop_components(atlas, output, box, keep=1, threshold=16, discard_border=False, min_area=1):
    image = Image.open(SOURCE / atlas).convert('RGBA').crop(box)
    alpha = image.getchannel('A')
    width, height = image.size
    seen = bytearray(width * height)
    components = []
    for start_y in range(height):
        for start_x in range(width):
            start_index = start_y * width + start_x
            if seen[start_index] or alpha.getpixel((start_x, start_y)) <= threshold:
                continue
            queue = deque([(start_x, start_y)])
            pixels = []
            touches_border = False
            while queue:
                x, y = queue.popleft()
                index = y * width + x
                if seen[index] or alpha.getpixel((x, y)) <= threshold:
                    continue
                seen[index] = 1
                pixels.append((x, y))
                touches_border = touches_border or x == 0 or y == 0 or x == width - 1 or y == height - 1
                if x: queue.append((x - 1, y))
                if x + 1 < width: queue.append((x + 1, y))
                if y: queue.append((x, y - 1))
                if y + 1 < height: queue.append((x, y + 1))
            if len(pixels) >= min_area and not (discard_border and touches_border):
                components.append(pixels)
    components.sort(key=len, reverse=True)
    chosen = components if keep is None else components[:keep]
    if not chosen:
        raise ValueError(f'Aucune composante exploitable dans {atlas} {box}')
    all_pixels = [pixel for component in chosen for pixel in component]
    min_x = min(x for x, _ in all_pixels)
    min_y = min(y for _, y in all_pixels)
    max_x = max(x for x, _ in all_pixels)
    max_y = max(y for _, y in all_pixels)
    padding = 8
    output_box = (max(0, min_x-padding), max(0, min_y-padding), min(width, max_x+padding+1), min(height, max_y+padding+1))
    result = Image.new('RGBA', (output_box[2]-output_box[0], output_box[3]-output_box[1]))
    source_pixels, target_pixels = image.load(), result.load()
    for x, y in all_pixels:
        target_pixels[x-output_box[0], y-output_box[1]] = source_pixels[x, y]
    target = DERIVED / output
    target.parent.mkdir(parents=True, exist_ok=True)
    result.save(target, optimize=True)

warrior_x = {'male': [295, 530, 790, 1045, 1310], 'female': [185, 455, 735, 1030, 1310]}
warrior_y = [72, 202, 333, 466, 594, 716, 838, 958, 1040]
warrior_row_bounds = [(0, 148), (148, 278), (278, 414), (414, 544), (544, 672), (672, 792), (792, 907), (907, 1006), (1006, 1086)]
for sex in ('male', 'female'):
    for row, weapon in enumerate(WEAPONS):
        y = warrior_y[row]
        for column, state in enumerate(STATES):
            y_limits = warrior_row_bounds[row]
            if sex == 'male' and row == 7:
                y_limits = (907, 988)
            extract_component(
                f'warriors/{sex}-weapons-atlas.png',
                f'warriors/{sex}/{weapon}/{state}.png',
                (warrior_x[sex][column], y),
                y_limits=y_limits,
            )

enemy_x = [115, 355, 600, 835, 1080, 1320]
for row, enemy in enumerate(['tribal-hunter', 'tribal-warrior', 'cave-brute', 'shaman']):
    for column, state in enumerate(ENEMY_STATES):
        extract_component('enemies/humanoid-enemies-atlas.png', f'enemies/{enemy}/{state}.png', (enemy_x[column], 135 + row * 271), padding=6)

beast_x_bounds = [
    [(0, 270), (270, 515), (515, 770), (770, 1050), (1050, 1220), (1220, 1448)],
    [(0, 270), (270, 515), (515, 770), (770, 1050), (1050, 1220), (1220, 1448)],
    [(0, 250), (250, 500), (500, 750), (750, 1000), (990, 1220), (1220, 1448)],
]
beast_y_bounds = [(0, 400), (400, 700), (700, 1086)]
beast_origins = [
    [(115, 250), (390, 280), (620, 250), (900, 270), (1120, 250), (1340, 320)],
    [(120, 560), (390, 575), (620, 555), (900, 565), (1120, 535), (1330, 600)],
    [(120, 890), (370, 900), (620, 870), (870, 900), (1100, 870), (1330, 960)],
]
for row, enemy in enumerate(['raptor', 'smilodon', 'mammoth']):
    for column, state in enumerate(ENEMY_STATES):
        extract_component(
            'enemies/beasts-enemies-atlas.png',
            f'enemies/{enemy}/{state}.png',
            beast_origins[row][column],
            padding=6,
            y_limits=beast_y_bounds[row],
            x_limits=beast_x_bounds[row][column],
        )

weapon_cells = {
    'flint-club': ((0, 520), (0, 380), (260, 185)),
    'bone-spear': ((480, 1060), (0, 380), (740, 185)),
    'obsidian-axe': ((955, 1448), (0, 380), (1215, 185)),
    'hunter-bow': ((0, 525), (340, 760), (250, 545)),
    'mammoth-spear': ((925, 1448), (340, 760), (1190, 545)),
    'volcanic-hammer': ((0, 600), (675, 1086), (285, 900)),
    'tyrant-claw': ((510, 1050), (675, 1086), (760, 900)),
}
for weapon, (x_limits, y_limits, origin) in weapon_cells.items():
    extract_component(
        'weapons/primordial-weapons.png',
        f'equipment/weapons/{weapon}.png',
        origin,
        padding=8,
        x_limits=x_limits,
        y_limits=y_limits,
        threshold=16,
    )

# These two designs intentionally contain several disconnected pieces. Their
# real source cells are isolated enough to retain the complete composition.
crop_components('weapons/primordial-weapons.png', 'equipment/weapons/smilodon-fangs.png', (510, 340, 985, 770), keep=2)
crop_components('weapons/primordial-weapons.png', 'equipment/weapons/titan-heart.png', (1030, 665, 1448, 1086), keep=None, discard_border=True, min_area=18)

for index, armor in enumerate(['hunter-hides', 'bone-harness', 'mammoth-plate', 'volcanic-shell', 'white-titan-fur', 'primordial-titan-skin']):
    column, row = index % 3, index // 3
    left = max(0, column * 482 - 18)
    top = max(0, row * 543 - 18)
    right = min(1448, (1448 if column == 2 else (column + 1) * 482) + 18)
    bottom = min(1086, (row + 1) * 543 + 18)
    crop_components('armors/primordial-armors.png', f'equipment/armors/{armor}.png', (left, top, right, bottom), keep=1)

effects = {
    'slash': (20, 0, 590, 345), 'energy': (600, 0, 1448, 300), 'impact': (0, 330, 510, 630),
    'dust': (505, 350, 970, 620), 'critical': (1000, 315, 1448, 650), 'parry': (15, 655, 455, 855),
    'dodge': (470, 660, 910, 875), 'projectile': (930, 680, 1448, 855),
}
for name, box in effects.items():
    crop_trim('effects/combat-effects.png', f'effects/{name}.png', box)

print(f'{sum(1 for _ in DERIVED.rglob("*.png"))} assets V0.4 normalisés dans {DERIVED}')
