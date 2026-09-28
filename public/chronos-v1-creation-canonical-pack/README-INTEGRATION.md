# CHRONOS AGE WARRIORS — V1 Canonical Creation Pack

This folder is designed to be copied **as-is** into the project's `public/` directory.

## Final V1 rule
- Male: one fixed canonical buzzcut.
- Female: one fixed canonical long hairstyle.
- Player chooses only: **sex, hair color, skin tone** (plus name).
- No hairstyle cards in V1.
- No runtime overlay, mask, recoloring, X/Y calibration or scale calibration.

## Asset paths
`characters/{male|female}/{skin-01..04}/{brown|black|blond|red}.png`

There are exactly **32 runtime character images**.

### Skin mapping
- `skin-01` = Clair
- `skin-02` = Doré
- `skin-03` = Brun
- `skin-04` = Foncé

### Hair mapping
- `brown` = Brun
- `black` = Noir
- `blond` = Blond
- `red` = Rouge

## Rendering
Render one PNG only, with a stable shared preview frame and `object-fit: contain`. Do not manipulate the pixels in the browser.

## References
The two original 4×4 generated sheets are preserved under `references/`.

## QA
Contact sheets are under `contact-sheets/`. The generated sprites are normalized to a shared 512×512 transparent canvas, centered and aligned to the same baseline.

## Rebuild
`scripts/build_pack.py` reconstructs the 32 cleaned normalized PNGs from the two reference sheets. It removes ultra-low-alpha color fringe around transparent edges before normalization.
