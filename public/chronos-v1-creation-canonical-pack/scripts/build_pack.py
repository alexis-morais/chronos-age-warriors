from PIL import Image, ImageDraw, ImageFont
import numpy as np
from scipy import ndimage
from pathlib import Path
import json, math

ROOT = Path(__file__).resolve().parents[1]
REFS = ROOT / 'references'
OUT = ROOT / 'characters'
SHEETS = ROOT / 'contact-sheets'

SOURCES = {
    'male': REFS / 'male-source-grid.png',
    'female': REFS / 'female-source-grid.png',
}
SKINS = ['skin-01', 'skin-02', 'skin-03', 'skin-04']
HAIRS = ['brown', 'black', 'blond', 'red']
CANVAS = 512
TARGET_HEIGHT = 476
BASELINE = 500
ALPHA_ZERO_BELOW = 24
COMPONENT_THRESHOLD = 32


def clean_rgba(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert('RGBA'), dtype=np.uint8)
    alpha = arr[:, :, 3]
    # Remove ultra-low-alpha colored fringe generated around transparent edges.
    arr[alpha < ALPHA_ZERO_BELOW] = 0
    # Clear RGB where fully transparent so future resampling cannot pull hidden color into edges.
    arr[alpha == 0, :3] = 0
    return Image.fromarray(arr, 'RGBA')


def find_16_components(im: Image.Image):
    a = np.array(im.getchannel('A'))
    labels, _ = ndimage.label(a > COMPONENT_THRESHOLD)
    objects = ndimage.find_objects(labels)
    comps = []
    for idx, sl in enumerate(objects, 1):
        if sl is None:
            continue
        region = labels[sl] == idx
        area = int(region.sum())
        if area < 10000:
            continue
        y0, y1 = sl[0].start, sl[0].stop
        x0, x1 = sl[1].start, sl[1].stop
        cx = (x0 + x1) / 2
        cy = (y0 + y1) / 2
        comps.append({'id': idx, 'area': area, 'bbox': (x0, y0, x1, y1), 'cx': cx, 'cy': cy})
    if len(comps) != 16:
        raise RuntimeError(f'Expected 16 character components, found {len(comps)}')
    # Map robustly by visual grid: 4 rows by center-y, then 4 cols by center-x.
    comps.sort(key=lambda c: c['cy'])
    rows = [sorted(comps[i:i+4], key=lambda c: c['cx']) for i in range(0,16,4)]
    return rows, labels


def crop_component(im: Image.Image, labels, component_id, bbox, pad=3):
    x0,y0,x1,y1 = bbox
    x0=max(0,x0-pad); y0=max(0,y0-pad); x1=min(im.width,x1+pad); y1=min(im.height,y1+pad)
    arr=np.array(im.crop((x0,y0,x1,y1)))
    local_labels=labels[y0:y1, x0:x1]
    core=(local_labels == component_id)
    # Keep the selected connected component plus a tiny dilation ring so its original
    # antialiasing survives, while removing stray disconnected fragments from neighboring cells.
    keep=ndimage.binary_dilation(core, iterations=2) & (arr[:,:,3] > 0)
    arr[~keep]=0
    arr[arr[:,:,3] < ALPHA_ZERO_BELOW] = 0
    arr[arr[:,:,3] == 0,:3]=0
    return Image.fromarray(arr,'RGBA')


def normalize_sprite(crop: Image.Image) -> Image.Image:
    # Preserve aspect ratio, equal visual height, equal center and equal baseline for every variant.
    scale = TARGET_HEIGHT / crop.height
    nw = max(1, round(crop.width * scale))
    nh = TARGET_HEIGHT
    resized = crop.resize((nw, nh), Image.Resampling.LANCZOS)
    # Clean only near-transparent resampling residue; keep antialiasing otherwise.
    arr = np.array(resized)
    arr[arr[:,:,3] < 5] = 0
    arr[arr[:,:,3] == 0,:3]=0
    resized = Image.fromarray(arr,'RGBA')
    canvas = Image.new('RGBA', (CANVAS, CANVAS), (0,0,0,0))
    x = (CANVAS - nw)//2
    y = BASELINE - nh
    canvas.alpha_composite(resized, (x,y))
    return canvas


def build_gender(gender, src_path):
    src = clean_rgba(Image.open(src_path))
    rows, labels = find_16_components(src)
    out_paths=[]
    for r,row in enumerate(rows):
        skin=SKINS[r]
        (OUT/gender/skin).mkdir(parents=True, exist_ok=True)
        for c,comp in enumerate(row):
            hair=HAIRS[c]
            crop=crop_component(src,labels,comp['id'],comp['bbox'])
            sprite=normalize_sprite(crop)
            out=OUT/gender/skin/f'{hair}.png'
            sprite.save(out, optimize=True)
            out_paths.append(out)
    return out_paths


def draw_checker(size=(512,512), step=32):
    bg=Image.new('RGB',size,(30,35,45)); d=ImageDraw.Draw(bg)
    cols=[(30,35,45),(48,55,68)]
    for y in range(0,size[1],step):
        for x in range(0,size[0],step):
            d.rectangle((x,y,x+step-1,y+step-1),fill=cols[((x//step)+(y//step))%2])
    return bg


def make_sheet(gender):
    cell=256; label_h=28
    sheet=Image.new('RGB',(cell*4, (cell+label_h)*4),(12,16,24))
    try:
        font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',16)
    except Exception:
        font=ImageFont.load_default()
    d=ImageDraw.Draw(sheet)
    for r,skin in enumerate(SKINS):
        for c,hair in enumerate(HAIRS):
            sprite=Image.open(OUT/gender/skin/f'{hair}.png').convert('RGBA')
            bg=draw_checker((cell,cell),16)
            sp=sprite.resize((cell,cell),Image.Resampling.LANCZOS)
            bg.paste(sp,(0,0),sp)
            x=c*cell; y=r*(cell+label_h)
            sheet.paste(bg,(x,y))
            txt=f'{skin} / {hair}'
            d.text((x+8,y+cell+5),txt,font=font,fill=(235,235,235))
    sheet.save(SHEETS/f'{gender}-contact-sheet.png',quality=95)

if __name__=='__main__':
    all_files=[]
    for gender,src in SOURCES.items():
        all_files += build_gender(gender,src)
        make_sheet(gender)
    print(f'Built {len(all_files)} canonical character PNGs')
