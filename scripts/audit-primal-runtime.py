"""Audit the exact Primal PNGs referenced by the combat registry, frame by frame.

This diagnostic never edits an asset. Review edge warnings against the art:
tails, weapons, dust, flames and ice can legitimately touch cell boundaries.
"""

from pathlib import Path
import json
import runpy


ROOT = Path(__file__).resolve().parents[1]
SPRITES = ROOT / "public/assets/sprites/warriors/primal"
OUTPUT = ROOT / "qa-output/primal-runtime-audit.json"
audit = runpy.run_path(str(ROOT / "scripts/audit-primal-sprites.py"))["audit"]
IDS = ("karg", "naya", "brakk", "eyla", "asha", "rhex", "ursak", "saar", "morga", "vorka", "urgath", "tyrak")
OVERRIDES = {
    "brakk": {"attack": "attack-runtime", "hit": "hit-runtime"},
    "eyla": {"run": "idle", "attack": "attack-runtime", "hit": "hit-runtime"},
    "asha": {"run": "idle"},
    "rhex": {"run": "idle", "attack": "command-solo", "hit": "hit-runtime"},
    "ursak": {"attack": "attack-runtime", "hit": "hit-runtime"},
    "saar": {"attack": "attack-runtime", "hit": "hit-runtime"},
    "morga": {"attack": "attack-runtime"},
    "tyrak": {"idle": "idle-runtime", "run": "run-runtime", "attack": "attack-runtime", "hit": "hit-runtime", "ko": "ko-runtime"},
}
POSES = ("idle", "run", "attack", "dodge", "block", "hit", "ko")
EXTRAS = {"eyla": ("projectile",), "asha": ("attack-impact",), "rhex": ("raptors-run", "raptors-attack")}
EXTRA_OVERRIDES = {"rhex": {"raptors-attack": "raptors-attack-runtime"}}
FX_OVERRIDES = {"asha": "attack-fx-runtime"}


def main() -> None:
    report = {"scope": "combat runtime PNGs only", "warriors": {}}
    for warrior_id in IDS:
        sources = {pose: f"{OVERRIDES.get(warrior_id, {}).get(pose, pose)}.png" for pose in POSES}
        sources["attack-fx"] = f"{FX_OVERRIDES.get(warrior_id, 'attack-fx')}.png"
        sources.update({special: f"{EXTRA_OVERRIDES.get(warrior_id, {}).get(special, special)}.png" for special in EXTRAS.get(warrior_id, ())})
        for pose, name in list(sources.items()):
            path = SPRITES / warrior_id / name
            if not path.is_file():
                raise FileNotFoundError(f"Missing runtime {warrior_id}/{pose}: {path}")
            sources[pose] = {"path": str(path.relative_to(ROOT)), "audit": audit(path)}
        report["warriors"][warrior_id] = sources
        print(f"{warrior_id}: {len(sources)} runtime poses/effects audited")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(OUTPUT)


if __name__ == "__main__":
    main()
