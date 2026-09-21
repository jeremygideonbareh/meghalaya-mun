"""Trace the MMUN logo (source-photos/logo/mmun-logo.png, white on black) into
SVG path data for src/data/logo.json: the crown alone, and the MMUN lettering.

    python tools/trace_logo.py

Needs Pillow, NumPy and OpenCV. Paths use the even-odd rule, coordinates are
rounded to whole units in each shape's own box.
"""

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source-photos/logo/mmun-logo.png"
OUT = ROOT / "src/data/logo.json"

UP = 4  # trace at 4x so the simplified outline stays smooth
CROWN_BOTTOM = 850  # the lettering starts below this row of the source


def mask(img: Image.Image) -> np.ndarray:
    big = img.convert("L").resize((img.width * UP, img.height * UP), Image.LANCZOS)
    big = big.filter(ImageFilter.GaussianBlur(UP * 0.6))
    return (np.array(big) > 128).astype(np.uint8) * 255


def trace(m: np.ndarray, eps: float):
    contours, _ = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    ys, xs = np.nonzero(m)
    x0, y0 = xs.min(), ys.min()
    w, h = (xs.max() - x0 + 1) / UP, (ys.max() - y0 + 1) / UP
    parts = []
    for c in contours:
        if cv2.contourArea(c) < (UP * 3) ** 2:
            continue
        pts = cv2.approxPolyDP(c, eps * UP, True)[:, 0, :]
        pts = (pts - [x0, y0]) / UP
        coords = [f"{round(x)} {round(y)}" for x, y in pts]
        parts.append("M" + "L".join(coords) + "Z")
    return "".join(parts), round(w), round(h)


def main():
    img = Image.open(SRC)
    crown_d, cw, ch = trace(mask(img.crop((0, 0, img.width, CROWN_BOTTOM))), 0.55)
    text_d, tw, th = trace(mask(img.crop((0, CROWN_BOTTOM, img.width, img.height))), 0.45)
    OUT.write_text(
        json.dumps(
            {
                "crown": {"d": crown_d, "width": cw, "height": ch},
                "wordmark": {"d": text_d, "width": tw, "height": th},
            },
            indent=2,
        )
        + "\n"
    )
    print(f"crown {cw}x{ch}, {len(crown_d)} chars; wordmark {tw}x{th}, {len(text_d)} chars")


if __name__ == "__main__":
    main()
