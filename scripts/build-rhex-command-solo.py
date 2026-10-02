"""Extract a conservative Rhex-only command layer from the supplied trio sheet.

This is a masking pass, not a repaint: the original pixels are never altered.
The raptors overlap a few lower-body pixels in the supplied art; the report
marks this candidate for visual review rather than calling it approved art.
"""

from pathlib import Path
import json

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/sprites/warriors/primal/rhex/command.png"
OUTPUT = ROOT / "qa-output/rhex-command-solo-candidate.png"
REPORT = ROOT / "qa-output/rhex-command-solo.json"
POLYGONS = (
    [(149, 155), (342, 151), (535, 160), (535, 210), (418, 306), (390, 354), (385, 548), (283, 561), (249, 515), (236, 428), (218, 373), (150, 336)],
    [(19, 145), (312, 150), (405, 182), (411, 310), (392, 356), (393, 550), (285, 562), (260, 506), (246, 422), (226, 365), (119, 309), (12, 222)],
    [(149, 155), (340, 151), (535, 160), (535, 210), (412, 307), (391, 357), (385, 553), (280, 562), (251, 508), (238, 424), (220, 369), (151, 338)],
    [(149, 155), (341, 150), (535, 160), (535, 211), (416, 308), (392, 356), (384, 554), (282, 564), (251, 512), (237, 426), (219, 370), (150, 339)],
)


def main() -> None:
    sheet = Image.open(SOURCE).convert("RGBA")
    if sheet.size != (2172, 724):
        raise ValueError(f"Unexpected Rhex sheet size: {sheet.size}")
    output = Image.new("RGBA", sheet.size)
    frames = []
    for index, polygon in enumerate(POLYGONS):
        frame = sheet.crop((index * 543, 0, (index + 1) * 543, 724))
        mask = Image.new("L", frame.size)
        ImageDraw.Draw(mask).polygon(polygon, fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(1))
        clipped = frame.copy()
        clipped.putalpha(Image.composite(frame.getchannel("A"), Image.new("L", frame.size), mask))
        output.alpha_composite(clipped, (index * 543, 0))
        frames.append({"index": index, "alpha_bbox": clipped.getchannel("A").getbbox()})
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    output.save(OUTPUT, optimize=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps({"source": str(SOURCE.relative_to(ROOT)), "runtime": str(OUTPUT.relative_to(ROOT)),
                                  "status": "HUMAN_REVIEW", "limitation": "Raptors overlap Rhex's lower body in the supplied painting; no original pixels were invented.",
                                  "frames": frames}, indent=2) + "\n", encoding="utf-8")
    print(OUTPUT)


if __name__ == "__main__":
    main()
