"""Crop event photos out of the MMUN 2026 brochure and export WebP.

Sources: source-photos/brochure/page-NN.jpg (the official MMUN_26 brochure,
rendered at 3124px wide) and source-photos/instagram/ (@meghalaya_mun).
Boxes are given in a 2000px-wide page frame and scaled to the real size.
Run: python tools/process_images.py
"""
import json
import os
from PIL import Image, ImageEnhance, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "source-photos")
OUT = os.path.join(ROOT, "public", "img")
MANIFEST = os.path.join(ROOT, "src", "data", "images.json")
os.makedirs(OUT, exist_ok=True)

INSET = 10  # trims the brochure's rounded gold frame off every photo

# name: (page, (x0, y0, x1, y1) in the 2000px frame)
BROCHURE = {
    # "Previous edition at a glance"
    "dignitaries": (11, (40, 262, 688, 598)),
    "stage-group": (11, (718, 262, 1275, 598)),
    "delegate-bw": (11, (1297, 256, 1680, 598)),
    "placard-jpc": (11, (1705, 256, 1955, 598)),
    "keynote": (11, (40, 628, 505, 1308)),
    "drafting": (11, (531, 628, 813, 932)),
    "placard-thailand": (11, (843, 628, 1105, 932)),
    "hands-up": (11, (1131, 628, 1597, 932)),
    "chair-guest": (11, (1623, 628, 1952, 932)),
    "speaker-blue": (11, (531, 978, 787, 1308)),
    "committee-floor": (11, (821, 978, 1335, 1308)),
    "arrival": (11, (1368, 978, 1955, 1308)),
    # Photo collage
    "podium-address": (23, (50, 40, 756, 490)),
    "anthem": (23, (798, 40, 1220, 490)),
    "refugee-challenge": (23, (1262, 40, 1940, 490)),
    "committee-room": (23, (50, 532, 606, 910)),
    "rapporteur": (23, (650, 532, 1143, 910)),
    "bureau": (23, (1186, 532, 1940, 910)),
    "delegate-placard": (23, (50, 952, 736, 1296)),
    "resolution": (23, (778, 952, 1354, 1296)),
    "chairs-debate": (23, (1390, 952, 1940, 1296)),
    # About MMUN strip
    "session": (7, (47, 1022, 506, 1300)),
    "celebration": (7, (528, 1022, 1012, 1300)),
    "voting": (7, (1040, 1022, 1438, 1300)),
    # Awards
    "award-certificate": (20, (52, 266, 828, 778)),
    "award-stole": (20, (52, 838, 820, 1296)),
}

# Instagram: the guest-speaker poster (portrait crop of the photo inside it)
INSTAGRAM = {
    "speaker-kharshiing": ("car_Dc0OWe-yQDC_0.jpg", (0.18, 0.19, 0.82, 0.60)),
}
COVERS = {"logo": "profile.jpg"}


def clean(im):
    im = ImageEnhance.Contrast(im).enhance(1.04)
    return im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=35, threshold=3))


def export(name, im):
    widths = [w for w in (480, 800, 1280, 1600) if w <= im.width] or [im.width]
    # keep the full native size too, so full-bleed shots use every pixel
    if im.width > widths[-1] + 120:
        widths.append(im.width)
    for w in widths:
        h = round(w / im.width * im.height)
        im.resize((w, h), Image.LANCZOS).save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=80, method=6)
    return {"widths": widths, "ratio": round(im.width / im.height, 4)}


manifest = {}
for name, (page, (x0, y0, x1, y1)) in BROCHURE.items():
    page_im = Image.open(os.path.join(SRC, "brochure", f"page-{page:02d}.jpg")).convert("RGB")
    k = page_im.width / 2000
    box = (round(x0 * k) + INSET, round(y0 * k) + INSET, round(x1 * k) - INSET, round(y1 * k) - INSET)
    manifest[name] = export(name, clean(page_im.crop(box)))

for name, (file, (fx0, fy0, fx1, fy1)) in INSTAGRAM.items():
    im = Image.open(os.path.join(SRC, "instagram", file)).convert("RGB")
    w, h = im.size
    manifest[name] = export(name, clean(im.crop((round(fx0 * w), round(fy0 * h), round(fx1 * w), round(fy1 * h)))))

for name, file in COVERS.items():
    im = Image.open(os.path.join(SRC, "instagram", file)).convert("RGB")
    im.save(os.path.join(OUT, f"{name}-150.webp"), "WEBP", quality=90)
    manifest[name] = {"widths": [150], "ratio": 1}

os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
json.dump(manifest, open(MANIFEST, "w"), indent=1)
print(len(manifest), "images")
